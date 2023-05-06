import { ConstructionRounded } from '@mui/icons-material';
import { Stack, Card, Typography, TextField, Button, Box, Modal } from '@mui/material';
import React,{ useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { useLocation,useNavigate } from 'react-router-dom';

export default function TeacherDetails(props){
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
    const [open, setOpen] = useState(false)
    
    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
        navigate("/Admin/TeacherList")
    }

    //get childrens detail from state and setChildrens for update
    const [teacher, setTeacher] = useState(
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
            postCode: location.state.postCode
        }
    )
        const userToken = useSelector((state => state.token))
    function updateTeacher(){
        console.log(teacher)
        fetch(" https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/users/update-details", {
            method: 'PUT',
            headers:{"Content-Type":"application/json", "token":userToken},
            body: JSON.stringify(teacher)
        }).then(res => res.json())
        .then(data => console.log(data))
        handleOpen()
    }

    function onClickCancel(){
        navigate("/Admin/TeacherList")
    }

    function handleFirstName(e) {setTeacher(prev => 
        {return {...prev, firstName: e.target.value}})}
    function handleLastName(e) {setTeacher(prev => 
        {return {...prev, lastName: e.target.value}})}
    function handleDOB(e) {setTeacher(prev => 
        {return {...prev, DOB: e.target.value}})}
    function handleStreet(e) {setTeacher(prev => 
        {return {...prev, street: e.target.value}})}
    function handleSuburb(e) {setTeacher(prev => 
        {return {...prev, suburb: e.target.value}})}
    function handleCity(e) {setTeacher(prev => 
        {return {...prev, city: e.target.value}})}
    function handlePostCode(e) {setTeacher(prev => 
        {return {...prev, postCode: e.target.value}})}

    return(
        <div className="teacherDetails" style = {{minHeight:"120vh", width: "100%",  display: 'flex', justifyContent:'center', marginTop:'150px'}}>
            <Card style={{backgroundColor: 'white', width: '95%', height: '100%', marginTop: "2%",
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: '30px'
            }}>
                <Typography variant="h4" sx={{ textAlign: 'center' }} >
                    Teacher Details
                </Typography>
                
                <Stack spacing={2} justifyContent='left' alignItems='left' 
                    sx={{margin: '20px', width: '100%'}}>

                    <TextField id="outlined-basic" label="Email" variant="outlined" defaultValue={teacher.email} InputProps = {{readOnly: true}} />
                    <TextField id="outlined-basic" label="First name" variant="outlined" defaultValue={teacher.firstName} onChange={handleFirstName}/>
                    <TextField id="outlined-basic" label="Last name" variant="outlined" defaultValue={teacher.lastName} onChange={handleLastName}/>
                    <TextField id="outlined-basic" label="Date of birth" variant="outlined" defaultValue={teacher.DOB} onChange={handleDOB}/>

                    <Stack direction="row" spacing={2}>
                        <TextField id="outlined-basic" label="Street" variant="outlined" defaultValue={teacher.street} onChange={handleStreet}/>
                        <TextField id="outlined-basic" label="Suburb" variant="outlined" defaultValue={teacher.suburb} onChange={handleSuburb}/>
                        <TextField id="outlined-basic" label="City" variant="outlined" defaultValue={teacher.city} onChange={handleCity}/>
                        <TextField id="outlined-basic" label="Post Code" variant="outlined" defaultValue={teacher.postCode} onChange={handlePostCode}/>
                    </Stack>

                    <Stack direction="row" spacing={2}>
                        <Button variant="outlined" sx={{width:'200px'}} onClick={onClickCancel}> Cancel</Button>           
                        <Button variant="contained" sx={{width:'200px'}} onClick={updateTeacher}> Update Details</Button>
                        <Modal
                          open={open}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                              Teacher details updated
                            </Typography>
                            <Button variant="outlined" sx={{color: props.secColor}} onClick={handleClose}>Back To Teacher List</Button>
                          </Box>
                        </Modal>
                    </Stack>
                </Stack>
                
                
            </Card>
        </div>
    )
}