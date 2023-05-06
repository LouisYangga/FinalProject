import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Card, Typography, Grid, Stack, Item, Button, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useSelector } from "react-redux";

const center= {
    alignItems: 'center',
    justifyContent: 'center'
};

export default function TeacherList(props) {
    const [teachers, setTeachers] = useState([])
    const userToken = useSelector((state => state.token))
    //Need to update API to get Teachers
    const fetchData = () =>  {
        fetch("https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/users/teachers",{
            method: 'GET',
            headers:{"Content-Type":"application/json"}
        })
         .then(response => {
            return response.json()
         })
         .then(data => {
            setTeachers(data)
         })
    }

    useEffect(() => {
        fetchData();
    },[])

    const navigate = useNavigate();

    function handleDetailOnClick(teacher) {
        navigate("/Admin/TeacherDetails",{state:teacher})
    }

    function handleRegTeacher() {
        navigate("/Admin/TeacherList/RegisterTeacher")
    }

    return(
        <Stack className="teacherList" sx = {{minHeight:"90vh", width: "100%", display: 'flex', justifyContent:'center'}}>
            <Stack className="body" sx= {{ marginTop:'120px', height:"100%",width: '100%', padding:'20px'}}>
                <Stack direction='row' style={{width:'100%', justifyContent:'center',marginBottom:'15px'}}>
                    <Typography variant="h4">
                        Teacher List
                    </Typography>
                </Stack>
                <Stack direction="row" sx={{width: "100%"}}>
                    <Stack className="teacherDetails" sx={{margin:'10px', marginBottom:'20px', width: "100%"}}>
                        <Card sx = {{width: "100%", minHeight: 400}}>
                            <CardContent>
                                <Button
                                sx= {{height:'70px',
                                padding: 2,
                                width:'fit-content',
                                color:props.secColor }}
                                value="childrenList" 
                                onClick={handleRegTeacher}                   
                                    >Register new teacher
                                </Button>
                                <TableContainer component={Paper}>
                                    <Table aria-label="Teacher List" stickyHeader sx={{ minWidth: 650 }}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>ID</TableCell>
                                                <TableCell align="left">First Name</TableCell>
                                                <TableCell align="left">Last Name</TableCell>
                                                <TableCell align="left">Email</TableCell>
                                                <TableCell align="left"> </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {teachers.map((teacher) => (
                                                <TableRow
                                                    key={teacher.id}>
                                                    <TableCell component="th" scope="row">
                                                        {teacher.id}
                                                    </TableCell>
                                                    <TableCell align="left">{teacher.firstName}</TableCell>
                                                    <TableCell align="left">{teacher.lastName}</TableCell>
                                                    <TableCell align="left">{teacher.email}</TableCell>
                                                    <TableCell align="left">
                                                        <Button sx={{color:props.secColor}} onClick={()=> {handleDetailOnClick(teacher)}}>
                                                            Details
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