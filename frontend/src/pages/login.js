import { blue } from "@mui/material/colors"
import React from "react"
import { Card, Typography, TextField, Box, Stack, Item, Button } from "@mui/material"
import { borderColor  } from "@mui/system"
import { useNavigate } from "react-router-dom"
import { ConstructionOutlined } from "@mui/icons-material"
import  { useSelector, useDispatch } from 'react-redux'
import user, { loginUser } from "../redux/features/user"
import { storeToken } from "../redux/features/userToken"


export default function Login(props) {
    const [email, setEmail] = React.useState("") //stores email 
    const [password, setPassWord ] = React.useState("") //stores password
    const [isWrong, setIsWrong] = React.useState(false) //error checker for password
    const [school, chooseSchool] = React.useState('')

    const dispatch = useDispatch()
    const currUser = useSelector((state => state.user))
    const tok = useSelector((state => state.token))

    function handleEmail(e) {
        setEmail(e.target.value)
    }

    function handlePassword(e){
        setPassWord(e.target.value)
    }

    function setColors(t) {
        
            const email = {email: 'kn728@uowmail.edu.au'}
            fetch("https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/users/colors", {
                method:'POST',
                headers: {"Content-Type":"application/json", "token": t},
                body: JSON.stringify(email)
            }).then(res => res.json()).then(data => {
                console.log(data)
                if(!data) {
                    return
                }
                if(data.hasOwnProperty('primary')) {
                    props.handleColor(data.primary)
                    
                }
                if(data.hasOwnProperty('secondary')) {
                    props.handleSecColor(data.secondary)
                }
                
            })
        
    }

    function getLogo() {
        fetch(`https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/users/logo/${school}`,{
            method:'GET',
            headers:{"Content-Type":"application/json"}
        }).then(res => res.json()).then(data => { 
            console.log(data)
            props.handleLogo(`data:image/png;base64, ${data.data}`)
        })
    
   
    }
//navigates to the dashboard based on which user logs in
    const navigate = useNavigate()
    let test
   
    const testLogin = {email: email, password: password}
    function checkLogin() {
        if(school) {
        fetch("https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/users/login", {       
            method: 'POST',
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify(testLogin)
        }).then(res => res.json())
        .then(data => {
            if(data) {
            const t = data.token
            console.log(data)
            console.log(data.subjects)

            dispatch(loginUser({email: email, firstName: data.firstName,DOB: data.DOB,role: data.role, id: data.id, subjectIds: data.subjectIds}))
            props.userIs(data)
            dispatch(storeToken(data.token))
            console.log(data.token)
            setColors(t)
            getLogo()
            if(data.role === "parent") {
                navigate("/Parent/ParentDashboard")
            } 
            if(data.role === "student") {
                navigate("/botCheck")
            }
            if(data.role === "teacher") {
                navigate("/Teacher/TeacherDashboard")
            }
            if(data.role === "admin") {
                navigate("/Admin/AdminDashboard")
            }
           
         }           
        }).catch(() => {
            setIsWrong(true)
        }) 
        }

               
    }
    function handleSchool(e) {
        chooseSchool(e.target.value)
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
                    Log In
                </Typography>
                
                <Stack spacing={3} justifyContent='center' alignItems='center' 
                    sx={{marginTop: '10px', width: '100%'}}>
                        
                            <TextField id="outlined-basic"  label="email" variant="outlined" 
                             sx= {{boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25),0px 4px 4px rgba(0, 0, 0, 0.25)', width: '70%', borderRadius:'5px'}} 
                                onChange={handleEmail} />
                        
                            <TextField id="outlined-basic" label="password" variant="outlined" type= "password" error={isWrong} helperText={isWrong && "wrong password, please try again"}
                            sx= {{boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25),0px 4px 4px rgba(0, 0, 0, 0.25)', width: '70%', borderRadius:'5px'}} 
                            onChange={handlePassword}/>
                        
                        <select onChange={handleSchool} style={{height:'50px', width:'70%', borderRadius:'5px', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25),0px 4px 4px rgba(0, 0, 0, 0.25)'}}>
                            <option>- Choose School </option>

                            <option value='thaiShoolLogo'>Illawarrah thai School</option>
                            <option value='language'>Lanuage School</option>


                        </select>   
                       
                    <Button variant="contained" onClick={checkLogin} 
                        sx={{width: '259px', height: '35px', background: '#6495ED',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: '20px'}}>
                             Log In</Button>   
                    
                    <Typography sx={{ textAlign: 'center', color:'#6495ED'}} onClick={() => navigate('/forgotPassword')} >
                    Forgot Password?
                </Typography>       
                    
                </Stack>
                
                
                
            </Card>
        </Box>   
    ) /*  */
}

