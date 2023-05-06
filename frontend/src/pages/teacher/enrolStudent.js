import { ConstructionRounded, SubjectSharp } from '@mui/icons-material';
import { Stack, Card, Typography, TextField, Button, Box, Modal, InputLabel, Select, MenuItem } from '@mui/material';
import React,{ useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { useLocation,useNavigate } from 'react-router-dom';

export default function EnrolStudent(props) {
    const location = useLocation();
    const navigate = useNavigate();

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
        pb: 3,
      };

    //modal handler
    
    
 

    

    const [student, setStudent] = useState(
        {
            id: location.state.id,
            role: location.state.role,
            firstName:location.state.firstName,
            lastName:location.state.lastName,
            email:location.state.email,
            gender:location.state.gender,
            DOB:location.state.DOB,
            enrolledSubjectId: location.state.enrolledSubjectId
        }
    )

    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState("");
    const [open, setOpen] = useState(false)

    const userToken = useSelector((state => state.token))
    const subject = useSelector((state => state.subject))
    const getSubjects = () =>  {
        fetch("https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/subjects",{
            method: 'GET',
            headers:{"Content-Type":"application/json", "token": userToken}
        })
         .then(response => {
            return response.json()
         })
         .then(data => {
            setSubjects(data)
         })
    }

    function enrolStudent(){
        console.log(student)
        const stu = {studentId: student.id, subjectId: subject.subjectCode}
        fetch(" https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/users/teacher/enroll", {
            method: 'PUT',
            headers:{"Content-Type":"application/json", "token": userToken},
            body: JSON.stringify(stu)
        }).then(res => res.json())
        .then(data => console.log(data))
        handleOpen()
    }

    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
        navigate("/Teacher/StudentList")
    }

    function onClickCancel() {
        navigate("/Teacher/StudentList")
    }

    const handleEnrolledSubject = (e) => {
        console.log(e.target.value)
        setSelectedSubject(e.target.value);
        setStudent(prev => 
            {return {...prev, enrolledSubjectId: e.target.value}
        })
    }

    useEffect(() => {
        getSubjects();
    },[])

    return(
        <div className="studentDetails" style = {{minHeight:"120vh", width: "100%",  display: 'flex', justifyContent:'center', marginTop:'150px'}}>
            <Card style={{backgroundColor: 'white', width: '95%', height: '100%', marginTop: "2%",
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: '30px'
            }}>
                <Typography variant="h4" sx={{ textAlign: 'center' }} >
                    Student Details
                </Typography>
                
                <Stack spacing={2} justifyContent='left' alignItems='left' 
                    sx={{margin: '20px', width: '100%'}}>

                    <Typography>Student Id: {student.id}</Typography>
                    <Typography>First Name: {student.firstName}</Typography>
                    <Typography>Last Name: {student.lastName}</Typography>
                    
                    <InputLabel id="enrol-subject">Enrol to subject</InputLabel>
                    <Select
                      labelId="enrol-subject"
                      id="enrol-subject"
                      label="Subject"
                      value={selectedSubject}
                      onChange={handleEnrolledSubject}
                    >
                        {subjects.map(subject => (
                            <MenuItem key={subject.id} value={subject.id}>{subject.subjectName}</MenuItem>
                        ))}
                    </Select>
                    <TextField value={subject.subjectCode} />

                    <Stack direction="row" spacing={2}>
                        <Button variant="outlined" sx={{width:'200px'}} onClick={onClickCancel}> Cancel</Button>           
                        <Button variant="contained" sx={{width:'200px'}} onClick={enrolStudent}> Enrol Student</Button>
                        <Modal
                          open={open}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                              Student enrolled subject is updated
                            </Typography>
                            <Button onClick={handleClose}>Back To Student List</Button>
                          </Box>
                        </Modal>
                    </Stack>
                </Stack>
            </Card>
        </div>
    )
}