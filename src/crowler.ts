import superagent from "superagent";
import cheerio from "cheerio";

interface Course {
  title: string;
  count?: string; // 没有权限页面显示不出来count
}
class Crowller {
  private url = "http://www.dell-lee.com/";

  constructor() {
    this.getRawHtml();
  }

  getJsonInfo(html: string) {
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

    const result = {
      time: new Date().getTime(),
      data: courseInfos,
    };

    console.log(result);
  }

  async getRawHtml() {
    const result = await superagent.get(this.url);

    this.getJsonInfo(result.text);
  }
}

const crowller = new Crowller();
