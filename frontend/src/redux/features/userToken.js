import {createSlice} from '@reduxjs/toolkit'

const userTokenSlice= createSlice({
    name:'token',
    initialState: null,
    reducers: {
        storeToken: (state, action) => {
            return action.payload
        }
    }
})

export const {storeToken} = userTokenSlice.actions
export default userTokenSlice.reducer