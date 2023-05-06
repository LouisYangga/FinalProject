import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Card, Typography, Grid, Stack, Item, Input, Button, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, Box} from "@mui/material";
import { useSelector } from "react-redux";

const center= {
    alignItems: 'center',
    justifyContent: 'center'
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3
  };

export default function AdminStudentList(props) {
    const [students, setStudents] = useState([]);
    const [studentFile, setStudentFile] = useState();
    const [expOpen, setExpOpen] = useState(false);
    const [impOpen, setImpOpen] = useState(false);

    const navigate = useNavigate();

    function handleSelectedFile(e) {setStudentFile(prev => 
        {return {...prev, file: e.target.files}})}

    const handleExpClose = () => {
      setExpOpen(false);
    };

    const handleImpClose = () => {
        setImpOpen(false);
    };

    function handleDetailsOnClick(stud) {
        //update student status in the backend
        navigate("/Admin/StudentDetails",{state:stud})
    }

    function handleImportOnClick() {
        setImpOpen(true);
    }
    const userToken = useSelector((state => state.token))
    function handleImportStudent(){
        const formData = new FormData();
        formData.append("file",studentFile.file[0],studentFile.file[0].name);
        console.log(studentFile.file[0]);
        fetch("https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/students/upload",{
            method: 'POST',
            headers:{"token": userToken},
            body: formData
        })
         .then(response => {
            return response.json()
        })
        setImpOpen(false);
    }

    function handleExportStudent(){
        window.location = "https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/students/download";
        setExpOpen(true);
    }

    const getStudents = () =>  {
        fetch("https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/users/students",{
            method: 'GET',
            headers:{"Content-Type":"application/json", "token": userToken}
        })
         .then(response => {
            return response.json()
         })
         .then(data => {
            setStudents(data)
         })
    }

    useEffect(() => {
        getStudents();
    },[])

    return(
        <Stack className="studentList" sx = {{minHeight:"90vh", width: "100%", display: 'flex', justifyContent:'center'}}>
            <Stack className="body" sx= {{ marginTop:'120px', height:"100%",width: '100%', padding:'20px'}}>
                <Stack direction='row' sx={{width:'100%', justifyContent:'center',marginBottom:'15px'}}>
                    <Typography variant="h4">
                        Student List
                    </Typography>
                </Stack>
                <Stack direction="row" sx={{width: "100%"}}>
                    <Stack className="studentList" sx={{margin:'10px', marginBottom:'20px', width: "100%"}}>
                        <Card sx = {{width: "100%", height: 400}}>
                            <CardContent>
                                <Stack direction='row' spacing={2}>
                                    <Button variant="contained" sx={{backgroundColor:props.secColor}} onClick={handleImportOnClick}>
                                        Upload Student
                                    </Button>
                                    <Button variant="contained" sx={{backgroundColor:props.secColor}} onClick={handleExportStudent}>
                                        Download Student
                                    </Button>
                                </Stack>
                                <Modal
                                  open={impOpen}
                                  aria-labelledby="modal-modal-title"
                                  aria-describedby="modal-modal-description"
                                >
                                    <Box sx = {style}>
                                      <Typography id="modal-modal-title" variant="h6" component="h2">
                                        Select file
                                      </Typography>
                                      <input
                                        type="file"
                                        className="fileSelect"
                                        onChange={handleSelectedFile} />

                                        <Stack direction='row' spacing={1}>
                                            <Button variant="contained" onClick={handleImportStudent}>Import</Button>
                                            <Button variant="outlined" onClick={handleImpClose}>Cancel</Button>
                                        </Stack>
                                    </Box>
                                </Modal>
                                <Modal
                                  open={expOpen}
                                  aria-labelledby="modal-modal-title"
                                  aria-describedby="modal-modal-description"
                                >
                                    <Box sx = {style}>
                                      <Typography id="modal-modal-title" variant="h6" component="h2">
                                        Students are exported
                                      </Typography>
                                      <Button onClick={handleExpClose}>Okay</Button>
                                    </Box>
                                </Modal>
                                <TableContainer component={Paper}>
                                    <Table aria-label="Student List" sx={{ minWidth: 650 }}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>ID</TableCell>
                                                <TableCell align="left">First Name</TableCell>
                                                <TableCell align="left">Last Name</TableCell>
                                                <TableCell align="left">Email</TableCell>
                                                <TableCell align="left">Status</TableCell>
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
                                                    {student.hasPaid[0] && 
                                                        <TableCell align="left">Paid</TableCell>
                                                    }
                                                    {!student.hasPaid[0] && 
                                                        <TableCell align="left">Not Paid</TableCell>
                                                    }
                                                    <TableCell align="left">
                                                        <Button variant="contained" sx={{backgroundColor:props.secColor}} onClick={()=> {handleDetailsOnClick(student)}}>
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