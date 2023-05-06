import React from 'react'
import { Card, Typography, TextField, Box, Stack, Item, Button } from "@mui/material"
import { Navigate, useNavigate } from 'react-router'


export default function ForgotPassword(props) {
    const [id, setId] = React.useState()
    const [newP, setNewP] = React.useState('')    
    const [confP, setConfP] = React.useState('')
    const [email, setEmail] = React.useState('')

    const [isWrong, setIsWrong] = React.useState(false) //error checker for password
    const nav = useNavigate()
    function reset() {
        if(newP === confP) {
            const toSend = {email:email, newPass: newP}
            fetch(`https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/users/reset/${id}`, {
                method:'PUT',
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify(toSend)
            }).then(res => res.json()).then(data => {
                console.log(data)
                nav('/Login')
            })
        }else {
            setIsWrong(true)
                
        }
    }

    return (
        <Box style ={{minHeight: '100vh', width: '100%', position:'relative', display:'Grid', alignContent:'center', justifyContent:'center', backgroundColor:`${props.thirdColor}`}}>    
           
            <Card style={{backgroundColor: 'white', width: '428px', height: '610px', marginTop: "8%",
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: '30px'
            }}>
                <Typography sx={{position: 'relative',  fontFamily: 'Source Code Pro', fontStyle: 'normal', fontWeight: '400',
                fontSize: '52px', lineHeight: '63px', textAlign: 'center', color: '#6495ED', padding: '10px'
                }}>
                    W A Y <br></br>  
                    S P A C E
                </Typography>
                <div style={{display: 'flex'}}>
                    <div style ={{margin:'0',borderTopStyle:'solid', transform:'skewY(7deg)', width: '50%', borderColor:'#6495ED', borderTopWidth:'1px'}}/>
                    <div style ={{margin:'0',borderTopStyle:'solid', transform:'skewY(-7deg)', width: '50%', borderColor:'#6495ED', borderTopWidth:'1px'}}/>
                </div>
                                
                <br></br>
                <Typography variant="h6" sx={{ textAlign: 'center' }} >
                    Forgot Password
                </Typography>
                
                <Stack spacing={3} justifyContent='center' alignItems='center' 
                    sx={{marginTop: '10px', width: '100%'}}>
                        
                            <TextField id="outlined-basic"  label="student Id" variant="outlined" value={id}
                             sx= {{boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25),0px 4px 4px rgba(0, 0, 0, 0.25)', width: '70%', borderRadius:'5px'}} 
                                onChange={(e) => setId(e.target.value)} />
                        
                             <TextField id="outlined-basic"  label="Email" variant="outlined" value={email}
                             sx= {{boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25),0px 4px 4px rgba(0, 0, 0, 0.25)', width: '70%', borderRadius:'5px'}} 
                                onChange={(e) => setEmail(e.target.value)} />
                        
                            <TextField id="outlined-basic" label="Password" 
                            variant="outlined" value={newP} type= "password" error={isWrong} helperText={isWrong && "passwords do not match"}
                            sx= {{boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25),0px 4px 4px rgba(0, 0, 0, 0.25)', width: '70%', borderRadius:'5px'}} 
                            onChange={(e) => setNewP(e.target.value)}/>
                            
                            <TextField id="outlined-basic" label="Confirm Password"  type= "password" value={confP} variant="outlined" 
                            sx= {{boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25),0px 4px 4px rgba(0, 0, 0, 0.25)', width: '70%', borderRadius:'5px'}} 
                            onChange={(e) => setConfP(e.target.value)}/>
                        
                        
                       
                    <Button variant="contained" onClick={reset} 
                        sx={{width: '259px', height: '35px', background: '#6495ED',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: '20px'}}>
                             Reset Password</Button>   
                    
                       
                    
                </Stack>
                
                
                
            </Card>
        </Box>  
    )
}
