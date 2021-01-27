import fs from "fs";
import cheerio from "cheerio";
import { Analyzer } from "./crowler";

interface Course {
  title: string;
  count?: string; // 没有权限页面显示不出来count
}

interface CourseResult {
  time: number;
  data: Course[];
}

interface Content {
  [propName: number]: Course[];
}

export default class DellAnalyzer implements Analyzer {
  private static instance: DellAnalyzer;

  private constructor() {}

  static getInstance(){
    if(!DellAnalyzer.instance) {
      DellAnalyzer.instance =new DellAnalyzer();
    }

    return DellAnalyzer.instance;
  }

  private getCourseInfo(html: string) {
    const $ = cheerio.load(html);
    const courseItems = $(".course-item");
    const courseInfos: Course[] = [];

    courseItems.map((index, item) => {
      const descs = $(item).find(".course-desc");
      const title = descs.eq(0).text();

      courseInfos.push({
        title,
      });
    });
    // console.log(courseItems.length)

    return {
      time: new Date().getTime(),
      data: courseInfos,
    };
  }

  private generateJsonContent(courseInfo: CourseResult, filePath: string) {
    let fileContent: Content = {};

    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }

    fileContent[courseInfo.time] = courseInfo.data;

    return fileContent;
  }

  public analyze(html: string, filePath: string) {
    const courseInfo = this.getCourseInfo(html);
    const fileContent = this.generateJsonContent(courseInfo, filePath);

    return JSON.stringify(fileContent);
  }
}
