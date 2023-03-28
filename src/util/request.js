import deptArr from "@/static/dept";
const req = new Promise((res, req) => {
    setTimeout(function () {
              let data = { retCode: 0, msg: deptArr }; // 接口返回的数据
              if (data.retCode == 0) {
                res(data);
              } else {
                req({ retCode: -1, msg: "network error" });
              }
            }, 100);       
})



export default req