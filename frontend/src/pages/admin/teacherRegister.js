import React from 'react'
import { Typography, Stack, TextField, Button, Card, Box, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import { useNavigate } from "react-router-dom"
import { useSelector } from 'react-redux'
export default function TeacherRegister(props) {
    const shadow="0px 4px 4px rgba(0, 0, 0, 0.25),0px 4px 4px rgba(0, 0, 0, 0.25)"
    //stores teacher details
    const [teacherDets, editTeacher] = React.useState({
        role:"teacher",
        email:"",
        firstName: "",
        lastName: "",
        password: "",
        DOB: "", 
        gender:""    
    })
    //edits teacher details
    function handleEmail(e) {editTeacher(prev => {
        return {...prev, email: e.target.value}})}
    function handleFirstName(e) {editTeacher(prev => {
        return {...prev, firstName: e.target.value}})}
    function handleLastName(e) {editTeacher(prev => {
        return {...prev, lastName: e.target.value}})}
    function handlePassword(e) {editTeacher(prev => {
        return {...prev, password: e.target.value}})}
    function handleDOB(e) {editTeacher(prev => {
        return {...prev, DOB: e.target.value}})}

    function handleGender(e) {
        editTeacher(prev => {
        return {...prev, gender: e.target.value}})}

    const navigate= useNavigate()
        //navigates to teacher dashboard if details are permissable
    const teacher = teacherDets
    const userToken = useSelector((state => state.token))
    function register() {
        fetch(" https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/users", {
            method: 'POST',
            headers:{"Content-Type":"application/json", "token":userToken},
            body: JSON.stringify(teacher)
        }).then(res => res.json())
        .then(data => {
            console.log(data)
            props.userIs(data)
            if(data !== null) {
                navigate("/Admin/AdminDashboard")
            }
        })
    }

    return (
        <Box style = 
            {{minHeight:"100vh", width: "100%",  
            position: 'relative', display: 'flex', justifyContent:'center', backgroundColor:`${props.thirdColor}`}}
        >            
            <Card sx={{width: '60%', marginTop:'15%', height:'70%'}}>
            <Stack spacing={2} justifyContent='center' alignItems='center' 
                    sx={{marginTop: '10px', width: '100%', padding:'20px'}}>
                        <Typography variant="h6" 
                        sx={{width: "70%"}}>Register Teacher</Typography>

                        <TextField id="outlined-basic" label="email" variant="outlined"  sx={{width: "70%", boxShadow: `${shadow}`}} onChange={handleEmail}/>
                        
                        <TextField id="outlined-basic" label="First Name" variant="outlined" sx={{width: "70%", boxShadow: `${shadow}`}} onChange={handleFirstName}/>
                    
                        <TextField id="outlined-basic" label="Last Name" variant="outlined" sx={{width: "70%", boxShadow: `${shadow}`}} onChange={handleLastName}/>


                        <TextField id="outlined-basic" label="password" variant="outlined"  type= "password" sx={{width: "70%", boxShadow: `${shadow}`}} onChange={handlePassword}/>

                        <TextField id="outlined-basic" label="DOB" variant="outlined" sx={{width: "70%",boxShadow: `${shadow}`}} onChange={handleDOB}/>
                        <div style={{width:'70%'}}>
                            <FormLabel>Gender</FormLabel>
                            <div style={{width:'100%' ,display: 'flex', justifyContent:'space-between'}}>
                            <RadioGroup row name="gender-radio-buttons-group" onChange={handleGender}>
                                <FormControlLabel value="male" control={<Radio />} label="Male" />
                                <FormControlLabel value="female" control={<Radio />} label="Female" />
                                <FormControlLabel value="other" control={<Radio />} label="Other" />
                            </RadioGroup>    
                            <Button variant="contained" sx={{backgroundColor:'#6495ED'}} onClick={register}> Register</Button>          
                            </div>
                        </div>
                       
            </Stack>
            </Card>
            
        </Box>    
    )
}