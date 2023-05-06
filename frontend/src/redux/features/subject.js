import { createSlice } from "@reduxjs/toolkit";

const subjectSlice = createSlice({
    name:"subject",
    initialState: {
        subjectCode:'',
        subjectName: '',
        students: []
    },
    
    reducers: {
        setSubjectCode: (state, action) => {
            return {...state, subjectCode: action.payload}
        }
        
    }

})

export const {setSubjectCode} = subjectSlice.actions
export default subjectSlice.reducer;