import React,{ useEffect, useState} from 'react';
import { Card, Typography, Grid, Stack, Item, Button, CardContent } from "@mui/material";
import {useDispatch, useSelector} from 'react-redux'
import { setSubjectCode } from "../../redux/features/subject";
import { useNavigate } from "react-router-dom";
import { storeSubjects } from "../../redux/features/studentSubjects";
import { combineReducers } from "redux";
import Sidebar from "../../components/sidebar";

const center= {
    alignItems: 'center',
    justifyContent: 'center'
};

/* 
    NOTE: upcoming tasks, average score and side function (search bar and calendar)
    is not correctly implemented yet
*/

export default function TeacherDashboard(props) {
    const user = useSelector((state => state.user))
    const userToken = useSelector((state => state.token))
    const dispatch = useDispatch()
    const subj = useSelector((state => state.stuSubj))

    
    React.useEffect(() => {
        fetch(`https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/subjects/subject-coord/${user.id}`, {
            headers: {"Content-Type": "application/json", "token": userToken}
        }).then(res => res.json()).then(data => {
            console.log(data)
            const temp = data.map(subj => {
                return {subjectId: subj.id, subjectName: subj.subjectName, students: subj.enrolledStudentId }
            })
            dispatch(storeSubjects(temp))
            
        })
    },[])

    const SubjectZero= ()=> {
        return( 
        <Typography variant="h6" sx={{ m: 1 }}> 
            {props.loadSubjects[0]} 
        </Typography>
    )}



    const nav = useNavigate()

    return(
        <div className="teacherDashboard" style = {{minHeight:"90vh", width: "70%", display: 'flex', justifyContent:'center'}}>
            <div className="body" style= {{ marginTop:'120px', height:"100%",width: '100%', padding:'20px'}}>
                <Stack style={{width:'100%'}}>
                    <Typography variant="h4" onClick={() => console.log(subj)}>
                        Dashboard
                    </Typography>
                </Stack>
                <div style={{height:"100%", width: '100vw', padding:'20px', display:'flex'}}>
                <Stack direction="row" sx={{margin:'15px'}}>
                    <Stack className="subjects" style={{margin:'10px', marginBottom:'20px', width:'33vw'}}>
                        <Typography variant="h5" sx={{marginBottom:'10px'}}>
                            Subjects
                        </Typography>
                        <Card sx = {{width: '100%', height: '300px', backgroundColor: props.secColor}}>
                            <CardContent>
                                {subj.map((sub, index) => {
                                    return(
                                        <Typography variant="h6" sx={{ m: 1 }} onClick={(e) => {
                                            dispatch(setSubjectCode(sub.subjectId))
                                            nav('../Teacher/subject')
                                        }}
                                        >{sub.subjectName}</Typography>
                                    )
                                })}
                                                        

                                 


                            </CardContent>
                        </Card>
                    </Stack>
                    <Stack sx={{margin:'10px',marginLeft:'15px', width:'33vw'}}>
                        <div className="upcoming">
                            <Typography variant="h6" sx={{marginBottom:'10px'}}>Upcoming Task and Quiz</Typography>
                            <Card sx = {{width: '410px', backgroundColor: props.secColor }}>
                                <Stack sx={{margin:'10px'}}>
                                    <Typography >14 May 2022</Typography>
                                    <Typography sx={{marginLeft:'10px'}}>08:00 PM ABC123 - Homework 3 due</Typography>
                                </Stack>
                                <Stack sx={{margin:'10px'}}>
                                    <Typography >18 May 2022</Typography>
                                    <Typography sx={{marginLeft:'10px'}}>08:00 PM DEF234 - Homework 4 due</Typography>
                                </Stack>
                            </Card>
                        </div>
                        <div className="avgScore">
                            <Typography variant="h6">Average Score</Typography>
                            <Card>
                                
                            </Card>
                        </div>
                    </Stack>
                </Stack>
                </div>
            </div>
            <div class="sidebar">
                <Sidebar />
            </div>
        </div>
    );
}