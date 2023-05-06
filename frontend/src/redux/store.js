import {configureStore} from '@reduxjs/toolkit'
import userReducer from './features/user'
import activityReducer from './features/activities'
import subjectReducer from './features/subject'
import tokenReducer from './features/userToken'
import studentSubjectsReducer from './features/studentSubjects'
import selectedStudentReducer from './features/selectedStudent'

const store = configureStore({
    reducer: {
        user: userReducer,
        activities: activityReducer,
        subject: subjectReducer,
        token: tokenReducer,
        stuSubj: studentSubjectsReducer,
        selectedStudent: selectedStudentReducer
    }
})

export default store