import React from "react"
import { Typography, Stack, TextField, Button, Card, Box, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
export default function ParentRegister(props) {
    //stores the parent object as its created
    const [parentDets, editParent] = React.useState({
        role:"parent",
        email:"",
        firstName: "",
        lastName: "",
        password: "",
        DOB: "", 
        gender:""    
    })
    //edits the parent object
    function handleEmail(e) {editParent(prev => {
        return {...prev, email: e.target.value}})}
    function handleFirstName(e) {editParent(prev => {
        return {...prev, firstName: e.target.value}})}
    function handleLastName(e) {editParent(prev => {
        return {...prev, lastName: e.target.value}})}
    function handlePassword(e) {editParent(prev => {
        return {...prev, password: e.target.value}})}
    function handleDOB(e) {editParent(prev => {
        return {...prev, DOB: e.target.value}})}

    function handleGender(e) {
        editParent(prev => {
        return {...prev, gender: e.target.value}})}

    const navigate= useNavigate()
    //if parent dets are correct will take parents to the parent navigation page            
    const parent = parentDets
    const userToken = useSelector((state => state.token))
    function register() {
        fetch(" https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/users", {
            method: 'POST',
            headers:{"Content-Type":"application/json", "token": userToken},
            body: JSON.stringify(parent)
        }).then(res => res.json())
        .then(data => {
            console.log(data)
            if(data !== null) {
                props.userIs(data)
               //navigate("/Parent/ParentDashboard")
               navigate('/Login')
            }
        })
    }

    const shadow="0px 4px 4px rgba(0, 0, 0, 0.25),0px 4px 4px rgba(0, 0, 0, 0.25)"
   
    return (
        <Box style = 
            {{minHeight:"100vh", width: "100%",  
            position: 'relative', display: 'flex', justifyContent:'center', backgroundColor:`${props.thirdColor}`}}
        >            
            <Card sx={{width: '60%', marginTop:'15%', height:'70%'}}>
            <Stack spacing={2} justifyContent='center' alignItems='center' 
                    sx={{marginTop: '10px', width: '100%', padding:'20px'}}>
                        <Typography variant="h6" 
                        sx={{width: "70%"}}>Register Parent</Typography>

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
                            <Button variant="contained" sx={{backgroundColor:'#6495ED'}} value ="parentRegistered"onClick={register}> Register</Button>          
                            </div>
                        </div>
                       
            </Stack>
            </Card>
            
        </Box>    
    )
}