import React,{ useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { Card, Typography, Grid, Stack, Item, Button, CardContent } from "@mui/material";
import { useSelector } from "react-redux";
import Sidebar from "../../components/sidebar";

const center= {
    alignItems: 'center',
    justifyContent: 'center'
};

/* 
    NOTE: upcoming tasks, average score and side function (search bar and calendar)
    is not correctly implemented yet
*/

export default function AdminDashboard(props) {
    const [subjects, setSubjects] = useState([]);
    const userToken = useSelector((state => state.token))

    const getSubjects = () =>  {
        fetch("https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/subjects/",{
            method: 'GET',
            headers:{"Content-Type":"application/json", "token": userToken}
        })
         .then(response => {
            return response.json()
         })
         .then(data => {
            setSubjects(data)
            console.log(data)
         })
    }

    useEffect(() => {
        getSubjects();
    },[])

    return(
        <div className="adminDashboard" style = {{minHeight:"90vh", width: "70%", display: 'flex', justifyContent:'center'}}>
            <div className="body" style= {{ marginTop:'120px', height:"100%",width: '100%', padding:'20px'}}>
                <Stack style={{width:'100%'}}>
                    <Typography variant="h4" onClick= {()=> console.log(user)}>
                        Dashboard
                    </Typography>
                </Stack>
                <Stack direction="row">
                    <Stack className="subjects" style={{margin:'10px', marginBottom:'20px'}}>
                        <Typography variant="h5" sx={{marginBottom:'10px'}}>
                            Subjects
                        </Typography>
                        <Card sx = {{width: 210, height: 300}}>
                            <CardContent>
                                {subjects.map((subject) => (
                                    <Typography variant="h6" sx={{ m: 1 }} key={subject.subjectCode}> 
                                        {subject.subjectName} 
                                    </Typography>)
                                )}
                            </CardContent>
                        </Card>
                    </Stack>
                    <Stack>
                        <div className="upcoming">
                            <Typography variant="h6" sx={{marginBottom:'10px'}}>Upcoming Task and Quiz</Typography>
                            <Card sx = {{width: 410 }}>
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
            <div class="sidebar">
                <Sidebar primeColor={props.primeColor} secColor={props.secColor} />
            </div>
        </div>
    );
}