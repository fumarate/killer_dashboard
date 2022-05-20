export default (() => {
  switch (process.env.VUE_APP_CURENV) {
    case "development":
      return "http://localhost:8080";
    case "production":
    case "test":
      return "http://124.223.196.190:8080";
  }
})();
