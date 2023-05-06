import {createSlice} from '@reduxjs/toolkit'

const  activitiesSlice = createSlice({
    name:"activities",
    initialState: {
        choice:'',
        activity: [] 
    },
    reducers: {
        
        storeActivites: (state, action) => {           
            const temp = action.payload            
            temp.forEach((act) => {
                state.activity.push(act)
            })            
        },

        emptyActivities: (state, action) => {
            return {choice:'', activity:[]}
        },

        makeChoice: (state, action) => {
            const a = [...state.activity]
            return {choice: action.payload, activity: a}
        },

        fetchActivities: (state, action) => {
            const t = [...action.payload]
            return {choice: '', activity: t}
        },
       removeActivity: (state, action) => {
         const temp = new Array()
         state.map((a) => {
            if(action.payload === a.name) {
                return;
            } else {
                temp.push(a)
            }
         })
        return temp
       }





    }

})
export const {storeActivites, emptyActivities, makeChoice, fetchActivities, removeActivity} = activitiesSlice.actions
export default activitiesSlice.reducer