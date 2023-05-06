import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Card, Typography, Grid, Stack, Item, Button, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useSelector } from "react-redux";
const center= {
    alignItems: 'center',
    justifyContent: 'center'
};

export default function StudentList(props) {
    const [students, setStudents] = useState([])
    const userToken = useSelector((state => state.token))
    const fetchData = () =>  {
        fetch("https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/users/students",{
            method: 'GET',
            headers:{"Content-Type":"application/json", "token":userToken}
        })
         .then(response => {
            return response.json()
         })
         .then(data => {
            setStudents(data)
         })
    }

    useEffect(() => {
        fetchData();
    },[])

    const navigate = useNavigate();

    function handleDetailOnClick(stud) {
        navigate("/Teacher/StudentDetails",{state:stud})
    }

    function handleEnrolOnClick(stud) {
        navigate("/Teacher/EnrolStudent",{state:stud})
    }

    return(
        <Stack className="studentList" sx = {{minHeight:"90vh", width: "100%", display: 'flex', justifyContent:'center'}}>
            <Stack className="body" sx= {{ marginTop:'120px', height:"100%",width: '100%', padding:'20px'}}>
                <Stack direction='row' style={{width:'100%', justifyContent:'center',marginBottom:'15px'}}>
                    <Typography variant="h4">
                        Student List
                    </Typography>
                </Stack>
                <Stack direction="row" sx={{width: "100%"}}>
                    <Stack className="studentList" sx={{width: "100%", margin:'10px', marginBottom:'20px'}}>
                        <Card sx = {{width: '100%', height: '50%'}}>
                            <CardContent>
                                <TableContainer component={Paper} sx ={{ height: 2050 }}>
                                    <Table aria-label="Student List" sx={{ minWidth: 650 }} stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>ID</TableCell>
                                                <TableCell align="left">First Name</TableCell>
                                                <TableCell align="left">Last Name</TableCell>
                                                <TableCell align="left">Email</TableCell>
                                                <TableCell align="left"> </TableCell>
                                                <TableCell align="left"> </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {students.map((student) => (
                                                <TableRow
                                                    key={student.id}>
                                                    <TableCell component="th" scope="row">
                                                        {student.id}
                                                    </TableCell>
                                                    <TableCell align="left">{student.firstName}</TableCell>
                                                    <TableCell align="left">{student.lastName}</TableCell>
                                                    <TableCell align="left">{student.email}</TableCell>
                                                    <TableCell align="left">
                                                        <Button onClick={()=> {handleDetailOnClick(student)}} sx={{color:props.secColor}}>
                                                            Details
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Button variant="contained" sx={{backgroundColor:props.secColor}}onClick={()=> {handleEnrolOnClick(student)}}>
                                                            Enrol to subject
                                                        </Button>
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