import { createSlice } from "@reduxjs/toolkit";

const selectStudentSlice = createSlice({
    name:"selStudent",
    initialState: {},
    
    reducers: {
        storeStudent: (state, action) => {
            return action.payload
        }
    }

})

export const {storeStudent} = selectStudentSlice.actions
export default selectStudentSlice.reducer;