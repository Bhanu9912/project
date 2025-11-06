import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";

let initialstate = {
    user:[]
}

export const registerUser = createAsyncThunk("registerUser", async (payload) => {
  const { data } = await axios.post("http://192.168.0.21:5000/api/users/register", payload);
  return data;
});


let counterSlice=createSlice({
    name:'user',
    initialState:initialstate,

    extraReducers: (builder) => {
    builder.addCase(registerUser.fulfilled, (state, action) => {
        state.user.push(action.payload.data);
        console.log("User registered:", action.payload.data);
    });
}


 })

 export default counterSlice.reducer