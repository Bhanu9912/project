import instance from "../Components/AxiousInstance/Instance";

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
    }
}