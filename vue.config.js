const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
});
switch (process.env.VUE_APP_CURENV) {
  case "development":
    console.log("当前运行环境为：开发环境");
    break;
  case "production":
    console.log("当前运行环境为：生产环境");
    break;
}
