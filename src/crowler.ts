import superagent from "superagent";
import cheerio from "cheerio";

class Crowler {
  private url = "http://www.dell-lee.com/";

  constructor() {
    this.getRawHtml();
  }

  getJsonInfo(html: string) {
    const $ = cheerio.load(html);
    const courseItems = $(".course-item");

    courseItems.map((index, item) => {
        const descs = $(item).find(".course-desc")
        const title = descs.eq(0).text();
    console.log(title);

    })
  }

  async getRawHtml() {
    const result = await superagent.get(this.url);

    this.getJsonInfo(result.text);
  }
}

const crowler = new Crowler();
