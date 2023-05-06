import {createSlice} from '@reduxjs/toolkit'

const  userSlice = createSlice({
    name:"user",
    initialState: null, 
    reducers: {
        loginUser: (state, action) => {
            return action.payload
        },
        logOut: (state, action) => {
            return null
        }
    }
})
export const {loginUser, logOut} = userSlice.actions
export default userSlice.reducer