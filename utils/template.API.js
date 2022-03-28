export default {
  configTemplateAPI(message,status,data,violations) {
    return {
      message: message,
      responeData: data,
      status: status,
      timeStamp: new Date().toISOString().replace(/T/, " ").replace(/\..+/, ""),
      violations: violations
    };
  },
 
  configTemplategetAllUser(data) {
    return {
      message: "",
      responeData: "",
      status: "Success",
      timeStamp: new Date().toISOString().replace(/T/, " ").replace(/\..+/, ""),
      violations: ""
    };
  },
};
