import axios from "axios";
import { showMessage } from "./status"; // 引入状态码文件
import { Dialog } from "vant"; // 引入el 提示框，这个项目里用什么组件库这里引什么

// 设置接口超时时间
axios.defaults.timeout = 60000;

// 请求地址，这里是动态赋值的的环境变量，下一篇会细讲，这里跳过
// @ts-ignore
axios.defaults.baseURL = import.meta.env.VITE_API_BASEURL;

//http request 拦截器
axios.interceptors.request.use(
  (config) => {
    // 配置请求头
    config.headers = {
      "Content-Type": "application/json;charset=UTF-8"};
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//http response 拦截器
axios.interceptors.response.use(
  (response) => {
    if(response.data.data.status == false){
        Dialog.alert("调用失败！\n错误信息："+response.data.data.info);
        return null;
    }else return response.data;
  },
  (error) => {
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      showMessage(response.status); // 传入响应码，匹配响应码对应信息
      return Promise.reject(response.data);
    } else {
      console.log("err")
    }
  }
);
const acceptType = ["GET","POST","PUT","DELETE"]
// 封装 GET POST 请求并导出
export function request(url = "", type = "GET", params = {}) {
  return new Promise((resolve, reject) => {
    let promise;
    if(acceptType.includes(type.toUpperCase())){
      promise = axios({
        method:type.toUpperCase(),
        url,
        params,
      });
    }
    promise
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
