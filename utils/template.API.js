export default {
  configTemplateAPI(message,data) {
    if(data!=null){
      return {
        message: message,
        responeData: data,
        status: "Success",
        timeStamp: new Date().toISOString().replace(/T/, " ").replace(/\..+/, ""),
        violations: ""
      };
    } else
      return {
        message: message,
        responeData: "",
        status: "Fail",
        timeStamp: new Date().toISOString().replace(/T/, " ").replace(/\..+/, ""),
        violations: ""
      };
  },
  configTemplateAPIError(error){
    return {
      message: "",
      responeData: "",
      status: "Fail",
      timeStamp: new Date().toISOString().replace(/T/, " ").replace(/\..+/, ""),
      violations: error.message
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
