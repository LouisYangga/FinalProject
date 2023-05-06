import React, {useState, useEffect} from "react";
import { Card, Typography, Grid, Stack, Item, Button, CardContent, Paper } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { storeStudent } from "../../redux/features/selectedStudent";

const center= {
    alignItems: 'center',
    justifyContent: 'center'
};

export default function UsersList(props) {
    const [users, setUsers] = useState([])
    const userToken = useSelector((state => state.token)) 

    const fetchData = () =>  {
        fetch("https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/users/users",{
            method: 'GET',
            headers:{"Content-Type":"application/json", "token": userToken }
        })
         .then(res => res.json())
         .then(data => {
            setUsers(data)
         })
    }

    const subject= useSelector((state => state.subject))

    useEffect(() => {
        fetchData()
    },[])

    const dis = useDispatch()
    const nav = useNavigate()
    function seeStudent(u) {
        console.log(u)
        dis(storeStudent(u))
        nav('/Teacher/stuProfile')
    }

    return(
        <div style={{marginTop:'150px', minHeight: '90vh', display:'flex', justifyContent: 'center'}}>
        <Paper sx={{minWidth:'80vw', marginBottom:'300px', display:'flex', flexDirection:'column', alignItems:'center'  }}>
                <Stack style={{width:'100%'}}>
                    <Typography variant="h4" textAlign='center' onClick={() => console.log(subject.subjectCode)}>
                        Class List
                    </Typography>
                </Stack>
                <table style={{width:'80%'}}>        
                    <tr>
                        <th style={{textAlign:'left', padding:'20px'}}>Student Id</th>
                        <th style={{textAlign:'left', padding:'20px'}}>Given Name</th>
                        <th style={{textAlign:'left' , padding:'20px'}}>Surname</th>
                    </tr>

                    {users.map(user => { 
                            if(user.role ==='student') {
                                let u =false
                                user.enrolledSubjectId.forEach((id) => {
                                    if(id == subject.subjectCode) {
                                        u = true
                                    }
                                })  
                                if(u === true)   {
                                return(
                                    <tr onClick={() => seeStudent(user)} key={user.id} style={{boxShadow: '0px 3px 0px rgba(0, 0, 0, 0.25)'}} >
                                        <td className='stuList' style={{padding:'20px'}} >{user.id}</td>
                                        <td className='stuList' style={{padding:'20px'}} >{user.firstName}</td>
                                        <td className='stuList' style={{padding:'20px'}} >{user.lastName}</td>
                                        <td><Button variant='contained' sx={{backgroundColor:props.secColor}}>See Answers</Button></td>
                                    </tr>
                                )
                                }
                               // }
                            }
                            }
                        )}


                </table>
            </Paper>
        </div>
    )

}

