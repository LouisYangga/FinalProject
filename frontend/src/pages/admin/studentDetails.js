import { ConstructionRounded } from '@mui/icons-material';
import { Stack, Card, Typography, TextField, Button, Box, Modal, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import React,{ useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { useLocation,useNavigate } from 'react-router-dom';

export default function AdminStudentDetails(){
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
    const [updOpen, setUpdOpen] = useState(false)
    const [verOpen, setVerOpen] = useState(false);
    //get student details from state and setStudent for update
    const [student, setStudent] = useState(
        {
            id: location.state.id,
            role: location.state.role,
            firstName:location.state.firstName,
            lastName:location.state.lastName,
            email:location.state.email,
            gender:location.state.gender,
            DOB:location.state.DOB,
            street: location.state.street,
            suburb: location.state.suburb,
            city: location.state.city,
            postCode: location.state.postCode,
            hasPaid: location.state.hasPaid
        }
    )

    const handleUpdClose = () => {
        setUpdOpen(false)
        navigate("/Admin/StudentList")
    }

    const handleVerClose = () => {
        setVerOpen(false);
    };
    
    function handleVerifyOnClick() {
        setVerOpen(true);
    }
    const userToken = useSelector((state => state.token))
    function updateStudent(){
        console.log(student)
        fetch(" https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/users/update-details", {
            method: 'PUT',
            headers:{"Content-Type":"application/json", "token": userToken},
            body: JSON.stringify(student)
        }).then(res => res.json())
        .then(data => console.log(data))
        setUpdOpen(true);
    }

    function verifyStudent(){
        console.log(student);
        fetch("https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/users/update-status",{
            method: 'PUT',
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({"studentId": student.id, "status": "true"})
        })
         .then(response => {
            return response.json()
        })
        handleVerClose();
        navigate("/Admin/StudentList")
    }

    function onClickCancel(){
        navigate("/Admin/StudentList")
    }

    function handleFirstName(e) {setStudent(prev => 
        {return {...prev, firstName: e.target.value}})}
    function handleLastName(e) {setStudent(prev => 
        {return {...prev, lastName: e.target.value}})}
    function handleDOB(e) {setStudent(prev => 
        {return {...prev, DOB: e.target.value}})}
    function handleStreet(e) {setStudent(prev => 
        {return {...prev, street: e.target.value}})}
    function handleSuburb(e) {setStudent(prev => 
        {return {...prev, suburb: e.target.value}})}
    function handleCity(e) {setStudent(prev => 
        {return {...prev, city: e.target.value}})}
    function handlePostCode(e) {setStudent(prev => 
        {return {...prev, postCode: e.target.value}})}

    //Student status isPaid is not in the model yet
    //Add button to verify student
    return(
        <div className="studentDetails" style = {{minHeight:"120vh", width: "100%",  display: 'flex', justifyContent:'center', marginTop:'150px'}}>
            <Card style={{backgroundColor: 'white', width: '95%', height: '100%', marginTop: "2%",
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: '30px'
            }}>
                <Typography variant="h4" sx={{ textAlign: 'center' }} >
                    Student Details and Verification
                </Typography>
                
                <Stack spacing={2} justifyContent='left' alignItems='left' 
                    sx={{margin: '20px', width: '100%'}}>

                    <TextField id="outlined-basic" label="Email" variant="outlined" defaultValue={student.email} InputProps = {{readOnly: true}} />
                    <TextField id="outlined-basic" label="First name" variant="outlined" defaultValue={student.firstName} onChange={handleFirstName}/>
                    <TextField id="outlined-basic" label="Last name" variant="outlined" defaultValue={student.lastName} onChange={handleLastName}/>
                    <TextField id="outlined-basic" label="Date of birth" variant="outlined" defaultValue={student.DOB} onChange={handleDOB}/>

                    <Stack direction="row" spacing={2}>
                        <TextField id="outlined-basic" label="Street" variant="outlined" defaultValue={student.street} onChange={handleStreet}/>
                        <TextField id="outlined-basic" label="Suburb" variant="outlined" defaultValue={student.suburb} onChange={handleSuburb}/>
                        <TextField id="outlined-basic" label="City" variant="outlined" defaultValue={student.city} onChange={handleCity}/>
                        <TextField id="outlined-basic" label="Post Code" variant="outlined" defaultValue={student.postCode} onChange={handlePostCode}/>
                    </Stack>

                    <Stack direction="row" spacing={2}>
                        <Button variant="outlined" sx={{width:'200px'}} onClick={onClickCancel}> Cancel</Button>           
                        <Button variant="contained" sx={{width:'200px'}} onClick={updateStudent}> Update Details</Button>
                        <Modal
                          open={updOpen}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                              Student details is updated
                            </Typography>
                            <Button onClick={handleUpdClose}>Back To Student List</Button>
                          </Box>
                        </Modal>
                        <Button variant="contained" onClick={handleVerifyOnClick}>
                            Verify
                        </Button>
                        <Dialog
                          open={verOpen}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                            <Box>
                              <Typography id="modal-modal-title" variant="h6" component="h2">
                                Do you want to verify this student?
                              </Typography>
                              <Button onClick={verifyStudent}>Verify</Button>
                              <Button onClick={handleVerClose}>Cancel</Button>
                            </Box>
                        </Dialog>
                    </Stack>
                </Stack>
                
                
            </Card>
        </div>
    )
}