import React from 'react'
import MakeClasses from './makeClasses'
import { Button } from '@mui/material'
import {useSelector} from 'react-redux'
import StudentLists from './StudentLists'
import ViewActivities from './viewActivities'
import StudentList from './studentList'
import { maxWidth } from '@mui/system'
export default function SubjectHandler(props) {
    const [currPage, setPage] = React.useState('')

    return(
        <div style = {{minHeight:"90vh", width: "100%", backgroundColor:`${props.thirdColor}`, marginTop:'120px'}}>
           <div style={{display:'flex', justifyContent:'space-around', padding:'30px', height:!currPage &&'90vh', alignItems:'center'}}>
              
                <Button sx={{boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',color: 'black', backgroundColor: props.secColor,height:!currPage && '20vh', width:'20%'}} onClick={() => setPage('students')}>See Enrolled Students</Button>
                <Button sx={{boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',color: 'black', backgroundColor: props.secColor,height: !currPage && '20vh', width:'20%'}}  onClick={() => setPage('makeClasses')}>Add to Curriculum</Button>
                <Button sx={{boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',color: 'black', backgroundColor: props.secColor, height: !currPage && '20vh', width:'20%'}}  onClick={() => setPage('seeCurr')}>See Curriculum</Button>
                <Button sx={{boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',color: 'black', backgroundColor: props.secColor, height: !currPage && '20vh', width:'20%'}}  onClick={() => setPage('stu')}>See All Students</Button>

                

            </div> 
            <div style={{display:'grid', placeItems:'center', width:'100vw'}}>
                {currPage ==="makeClasses" && <MakeClasses secColor={props.secColor} />}
                {currPage ==="students" && <StudentLists secColor={props.secColor} />}
                {currPage ==="seeCurr" && <ViewActivities secColor={props.secColor}/>}
                {currPage ==="stu" && <StudentList secColor={props.secColor}/>}

            </div>


        </div>
    )
}