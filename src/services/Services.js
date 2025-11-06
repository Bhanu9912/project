import instance from "../Components/AxiosInstance/Instance.js";

let services={
    register:async(payload)=>{
        try{
            let response=await instance.post("/register",payload)
            // console.log(response);
            return response;
        }
        catch(error){
            console.log(error);
            return error.response;   
        }
    },
    login:async(payload)=>{
        try{
            let response=await instance.post("/login",payload)
            console.log(response);
            return response;
        }
        catch(error){
            console.log(error);
            return error.response;
        }
    }
}
export default services;