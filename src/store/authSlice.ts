import {createSlice, type PayloadAction} from "@reduxjs/toolkit";


interface AuthState{
  isLoggedIn:boolean;
  accessToken:string | null;
  refreshToken: string | null;
  publicId: string | null;
}

const initialState:AuthState={
  isLoggedIn:false,
  accessToken:null,
  refreshToken:null,
  publicId:null,
};

const authSlice=createSlice({
  name:"auth",
  initialState,

  reducers:{
    loginSuccess:(
      state,
      action: PayloadAction<{
        accessToken:string;
        refreshToken:string;
        publicId:string;
      }>
    )=>{
      state.isLoggedIn=true;
      state.accessToken=action.payload.accessToken;
      state.refreshToken=action.payload.refreshToken;
      state.publicId=action.payload.publicId;
    },

    logout:(state)=>{
      state.isLoggedIn=false;
      state.accessToken=null;
      state.refreshToken=null;
      state.publicId=null;
    },
  },
});
export const {loginSuccess, logout}=authSlice.actions;
export default authSlice.reducer;