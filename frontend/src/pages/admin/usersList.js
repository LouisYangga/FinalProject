import React, {useState, useEffect} from "react";
import { Card, Typography, Grid, Stack, Item, Button, CardContent, 
    TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useSelector } from "react-redux";
export default function UsersList(props) {
    const [users, setUsers] = useState([])
    const userToken = useSelector((state => state.token))
    const fetchData = () =>  {
        fetch("https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/users/users",{
            method: 'GET',
            headers:{"Content-Type":"application/json", "token":userToken}
        })
         .then(response => {
            return response.json()
         })
         .then(data => {
            setUsers(data)
         })
    }

    useEffect(() => {
        fetchData()
    },[])

    return(
        <Stack className="teacherList" sx = {{minHeight:"90vh", width: "100%", display: 'flex', justifyContent:'center'}}>
            <Stack className="body" sx= {{ marginTop:'120px', height:"100%",width: '100%', padding:'20px'}}>
                <Stack direction='row' style={{width:'100%', justifyContent:'center',marginBottom:'15px'}}>
                    <Typography variant="h4">
                       User List
                    </Typography>
                </Stack>
                <Stack direction="row" sx={{width: "100%"}}>
                    <Stack className="teacherDetails" sx={{margin:'10px', marginBottom:'20px', width: "100%"}}>
                        <Card sx = {{width: "100%", minHeight: 400}}>
                            <CardContent>
                               
                                <TableContainer component={Paper}>
                                    <Table aria-label="Teacher List" stickyHeader sx={{ minWidth: 650 }}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>ID</TableCell>
                                                <TableCell align="left">First Name</TableCell>
                                                <TableCell align="left">Last Name</TableCell>
                                                <TableCell align="left">Email</TableCell>
                                                <TableCell align="left">User Role </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {users.map((user) => (
                                                <TableRow
                                                    key={user.id}>
                                                    <TableCell component="th" scope="row">
                                                        {user.id}
                                                    </TableCell>
                                                    <TableCell align="left">{user.firstName}</TableCell>
                                                    <TableCell align="left">{user.lastName}</TableCell>
                                                    <TableCell align="left">{user.email}</TableCell>
                                                    <TableCell align="left">{user.role}
                                                       
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )

}

