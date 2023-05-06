import { createSlice } from "@reduxjs/toolkit";
const studentSubjectsSlice = createSlice({
    name:'studentSubjects',
    initialState: [],
    reducers: {
        storeSubjects: (state, action) => {
            return action.payload
        }

    }


})
export const {storeSubjects} = studentSubjectsSlice.actions
export default studentSubjectsSlice.reducer
