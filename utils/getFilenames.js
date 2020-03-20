const { readdir, readFile, writeFile, readdirSync, statSync, writeFileSync } = require("fs");
let path = require("path");
// const {resolve} = require('path')

// const FOLDERPATH = './docs/article'

const pathsIgnore = [".vuepress", "en", "pic"];

function pReadFile(filepath) {
  return new Promise((resolve, reject) => {
    readdir(filepath, (err, files) => {
      let filenames = [];
      files.forEach(file => {
        if (file.toLowerCase() === "readme.md") {
          file = ``;
        } else {
          file = file.replace(".md", "");
          file = `${file}`;
        }
        filenames.push(file);
      });

      filenames.sort(); // 排序
      resolve(filenames);
    });
  });
}
function getAllDirs(mypath = "docs") {
  const items = readdirSync(mypath);

  let result = [];

  // 遍历当前目录中所有的文件和文件夹

  items.map(item => {
    let temp = path.join(mypath, item);

    // 若当前的为文件夹

    if (statSync(temp).isDirectory()) {
      if (
        pathsIgnore.every(tt => {
          return tt != item;
        })
      ) {
        result.push(item);
      }
    }
  });
  console.log(result);
  return result;
}
async function doAllJobs(params) {
  var params = {};
  let PathsInNew = getAllDirs();
  for (let index = 0; index < PathsInNew.length; index++) {
    const dir = PathsInNew[index];
    console.log(dir);
    let fileNames = await pReadFile("./docs/" + dir);
    params[dir] = fileNames;
  }
  console.log(params);
  writeJson(params);
  autoNav(params)

}

function autoNav(side) {
  let nav = [{ "text": "首页", "link": "/" },
  {
    "text": "内容导航", items: []
  }]
  for (const key in side) {
    if (side.hasOwnProperty(key)) {
      const subMenu = side[key];
      let navEle = {
        text: key
      }
      if (subMenu.length) {
        if (subMenu.length == 1) {
          navEle.link = `/${key}/`
        } else {
          let items = subMenu.map(element => {
            return { text: element, link: `/${key}/${element}` }


          });
          navEle.items = items
        }
      }
      nav[1].items.push(navEle)

    }
  }
  console.dir(nav);
  var str = JSON.stringify(nav, null, 2);
  writeFileSync("./docs/.vuepress/config/nav.json", str);
}

doAllJobs();

function writeJson(params) {
  //现将json文件读出来
  readFile("./docs/.vuepress/config/sidebar.json", function (err, data) {
    if (err) {
      return console.error(err);
    }
    var person = data.toString(); //将二进制的数据转换为字符串

    person = JSON.parse(person); //将字符串转换为json对象
    // person['/article_child/'] = params['/article_child/']
    for (let key in params) {
      person[`/${key}/`] = params[key];
    }
    // console.log(person);
    var str = JSON.stringify(person, null, 2); //因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
    writeFile("./docs/.vuepress/config/sidebar.json", str, function (err) {
      if (err) {
        console.error(err);
      }
      console.log("----------新增成功-------------");
    });
  });
}
