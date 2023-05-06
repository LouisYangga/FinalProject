import React, {useState, useEffect} from "react";
import { Card, Typography, Grid, Stack, Item, Button, CardContent } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { storeStudent } from "../redux/features/selectedStudent";

export default function UsersList() {
    const [users, setUsers] = useState([])
    const userToken = useSelector((state => state.token)) 

    const fetchData = () =>  {
        fetch("https:/ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/users/users",{
            method: 'GET',
            headers:{"Content-Type":"application/json", "token": userToken }
        })
         .then(res => res.json())
         .then(data => {
            console.log(data)
            setUsers(data)
         })
    }

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
        <div className="userList" style = {{minHeight:"90vh", width: "70%", display: 'flex', justifyContent:'center'}}>
            <div className="body" style= {{ marginTop:'120px', height:"100%",width: '100%', padding:'20px'}}>
                <Stack style={{width:'100%'}}>
                    <Typography variant="h4">
                        Users List
                    </Typography>
                </Stack>
                <Stack direction="row">
                    <Stack className="users" style={{margin:'10px', marginBottom:'20px'}}>
                        <Card sx = {{width: 400, minHeight: 300}}>
                            <CardContent>
                                <div>
                                    {users.length > 0 && (
                                        <ul>
                                            {users.map(user => (
                                                <li key={user.id}>{user.id} {user.role} {user.firstName} {user.lastName}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </Stack>
                </Stack>
            </div>
        </div>
    )

}