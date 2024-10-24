
import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface UserState{
    firstName:string;
    lastName:string;
    email:string;
    dob:string;
    phone:string;
    preferences: string[];
    token:string | null;
}

const initialState: UserState = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    token: null,
    dob: "",
    preferences: []
};

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        setUser:(state,action:PayloadAction<UserState>)=>{
            const{firstName, lastName, email, phone, dob, preferences, token } = action.payload
            state.firstName = firstName;
      state.lastName = lastName;
      state.email = email;
      state.phone = phone;
      state.dob = dob; 
      state.preferences = preferences; 
      state.token = token; 
        },
        clearUser:(state) =>{
      state.firstName = '';
      state.lastName = '';
      state.email = '';
      state.phone = '';
      state.dob = ''; 
      state.preferences = []; 
      state.token = null; 
        }
    },
});

export const {setUser,clearUser} = userSlice.actions

export default userSlice.reducer;