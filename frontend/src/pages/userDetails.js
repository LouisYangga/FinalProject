import { ConstructionRounded } from '@mui/icons-material';
import { Stack, Card, Typography, TextField, Button, Box, Modal } from '@mui/material';
import React,{ useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { useLocation,useNavigate } from 'react-router-dom';

export default function UserDetails(props){
    const navigate = useNavigate();

    //get user details from current user props and setUser for update
    const [user, setUser] = useState(
        {
            id: props.user.id,
            role: props.user.role,
            firstName:props.user.firstName,
            lastName:props.user.lastName,
            email:props.user.email,
            gender:props.user.gender,
            DOB:props.user.DOB,
            street: props.user.street,
            suburb: props.user.suburb,
            city: props.user.city,
            postCode: props.user.postCode
        }
    )

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
        if(user.role === "parent") {
            navigate("/Parent/ParentDashboard")
        } 
        if(user.role === "student") {
            navigate("/Student/StudentDashboard")
        }
        if(user.role === "teacher") {
            navigate("/Teacher/TeacherDashboard")
        }
        if(user.role === "admin") {
            navigate("/Admin/AdminDashboard")
        }
    }

    function onClickCancel() {
        if(user.role === "parent") {
            navigate("/Parent/ParentDashboard")
        } 
        if(user.role === "student") {
            navigate("/Student/StudentDashboard")
        }
        if(user.role === "teacher") {
            navigate("/Teacher/TeacherDashboard")
        }
        if(user.role === "admin") {
            navigate("/Admin/AdminDashboard")
        }
    }

    
    const userToken = useSelector((state => state.toekn))
    function updateUser(){
        console.log(user)
        fetch(" https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/users/update-details", {
            method: 'PUT',
            headers:{"Content-Type":"application/json", "token": userToken},
            body: JSON.stringify(user)
        }).then(res => res.json())
        .then(data => console.log(data))
        handleOpen()
    }

    function handleFirstName(e) {setUser(prev => 
        {return {...prev, firstName: e.target.value}})}
    function handleLastName(e) {setUser(prev => 
        {return {...prev, lastName: e.target.value}})}
    function handleDOB(e) {setUser(prev => 
        {return {...prev, DOB: e.target.value}})}
    function handleStreet(e) {setUser(prev => 
        {return {...prev, street: e.target.value}})}
    function handleSuburb(e) {setUser(prev => 
        {return {...prev, suburb: e.target.value}})}
    function handleCity(e) {setUser(prev => 
        {return {...prev, city: e.target.value}})}
    function handlePostCode(e) {setUser(prev => 
        {return {...prev, postCode: e.target.value}})}

    return(
        <div className="userDetails" style = {{minHeight:"120vh", width: "100%",  display: 'flex', justifyContent:'center', marginTop:'150px'}}>
            <Card style={{backgroundColor: 'white', width: '95%', height: '100%', marginTop: "2%",
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: '30px'
            }}>
                <Typography variant="h4" sx={{ textAlign: 'center' }} >
                    User Details
                </Typography>
                
                <Stack spacing={2} justifyContent='left' alignItems='left' 
                    sx={{margin: '20px', width: '100%'}}>

                    <TextField id="outlined-basic" label="First name" variant="outlined" defaultValue={user.firstName} onChange={handleFirstName}/>
                    <TextField id="outlined-basic" label="Last name" variant="outlined" defaultValue={user.lastName} onChange={handleLastName}/>
                    <TextField id="outlined-basic" label="Date of birth" variant="outlined" defaultValue={user.DOB} onChange={handleDOB}/>
                    <TextField id="outlined-basic" label="Email" variant="outlined" defaultValue={user.email} />

                    <Stack direction="row" spacing={2}>
                        <TextField id="outlined-basic" label="Street" variant="outlined" defaultValue={user.street} onChange={handleStreet}/>
                        <TextField id="outlined-basic" label="Suburb" variant="outlined" defaultValue={user.suburb} onChange={handleSuburb}/>
                        <TextField id="outlined-basic" label="City" variant="outlined" defaultValue={user.city} onChange={handleCity}/>
                        <TextField id="outlined-basic" label="Post Code" variant="outlined" defaultValue={user.postCode} onChange={handlePostCode}/>
                    </Stack>

                    <Stack direction="row" spacing={2}>
                        <Button variant="outlined" sx={{borderColor: props.secColor, color:props.secColor, width:'200px'}} onClick={onClickCancel}> Cancel</Button>           
                        <Button variant="contained" sx={{width:'200px', backgroundColor: props.secColor}} onClick={updateUser}> Update Details</Button>
                        <Modal
                          open={open}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                              User detail successfully updated
                            </Typography>
                            <Button variant="outlined" onClick={handleClose}>Back to dashboard</Button>
                          </Box>
                        </Modal>
                    </Stack>
                </Stack>
            </Card>
        </div>
    )
}