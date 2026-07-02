
import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";

import axios from "axios"
const API="http://localhost:5000/api/User/Login";

export const LoginUser=createAsyncThunk("auth/LoginUser",(userData,thunkip)=>{
    try {
        const payload= await axios.post()
        
    } catch (error) {
        
    }
})





const initialstate={
    user:null,
    Token:null,
    loading:false,
    error:fale
}

const authslice=createSlice({
    name:"auth",
    initialState,
    
})