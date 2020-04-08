var sidebar = require("./config/sidebar.json");
var nav = require("./config/nav.json");
module.exports = {
  title: "VS Code 插件开发中文文档",
  description: "Just playing around",
  base: process.env.VUEPRESS_BASE || "/",
  themeConfig: {
    nav: nav,
    // sidebar: 'auto', //自动侧边栏
    sidebar: sidebar
    // displayAllHeaders: true // 默认值：false
  },


  configureWebpack: {
    //webpack别名 如![Image from alias](~@alias/image.png)
    resolve: {
      alias: {
        "@alias": "path/to/some/dir"
      }
    }
  }
};
