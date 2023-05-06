import React,{ useEffect, useState} from 'react';
import { Box, Typography, Card, TextField, Button } from "@mui/material"
import  { useSelector, useDispatch } from 'react-redux'
import { storeActivites, emptyActivities, makeChoice } from "../../redux/features/activities"
import { useNavigate } from "react-router"
import { storeSubjects } from "../../redux/features/studentSubjects"
import Sidebar from "../../components/sidebar";

export default function StudentDashboard(props) {    
    const subjectCard = <Card sx={{height:'60%', width:'300px',
    background: 'rgba(100, 149, 237, 0.51)',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: '10px'}}></Card>
    const dispatch = useDispatch()
    const activities = useSelector((state => state.activities))
    const userToken = useSelector((state => state.token))
    const user = useSelector((state => state.user))
    const stuSub = useSelector((state => state.stuSubj))
    const [pastWelcome, setPastWelcome] = React.useState(false)
    const [subjects, setSubjects]= React.useState([])

    const nav = useNavigate()

   /* 
        functonality to show how the subjects display would work, once the backend is further developed
        NOTE: not how subjects will look at the end of project
   */
    

    React.useEffect(()=> {
        const subj = []

        if(user && user.role === 'student') {
            console.log(user)
            user.subjectIds.forEach((code) => {
                subj.push(code)
            
            }) 
            dispatch(storeSubjects(subj))
            setSubjects([...subj])
        }        
        dispatch(emptyActivities())
        const d = new Date()
        let day = d.getDate()
       
        let month = d.getMonth() +1
        let year = d.getFullYear()
        if(day < 10) { day = `0${day}`}
        if(month < 10) { month = `0${month}`}

        const today = `${day +'/'+ month +'/' + year}`
        console.log(today)
        stuSub.forEach((s) => {
            fetch(`https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/subjects/activities/date`, {
                    method: 'POST',
                    headers: {"Content-Type":"application/json", "token": userToken},
                    body: JSON.stringify({subjectId: s, date: today})
                }).then(res => res.json()).then(data => {
                    console.log(data)
                    const d = data.map(obj => ({subjectId: s,...obj }))
                    console.log(d)
                    dispatch(storeActivites(d))
                })
            })
       
       
       },[]) 

  
      const SubjectZero= ()=> {

        return(
            subjects.map((sub) => {   
                return(      
                <Card sx={{height:'60%', width:'300px',
                        background: props.secColor,
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',  marginLeft:'40px',
                        borderRadius: '10px', display:'grid', placeItems:'center'}} onClick={() => console.log(activities)}>
                    <Typography variant="h6"> 
                        {sub} 
                    </Typography></Card>
        )})  
        
      )
            }

      function seeSubjects() {
        console.log(stuSub)
       // console.log(userToken)
       /* fetch("https://localhost/api/users/students", {
            headers:{"Content-Type":"application/json", "token": userToken},
        }).then(res => res.json()).then(data => console.log(data)) */
      }

      function accessActivity(e) {
        const i = e.target.value
        const a = activities.activity[i].type 

        dispatch(makeChoice(i))
        if(a === 'video') {
            nav('/Student/viewVideo')
        } else if (a === 'drag') {
            nav('/Student/matchTheWords')
        } else if (a === 'translate') {
            nav('/Student/translate')
        }
        if(a === 'file') {
            nav('/Student/downloadFile')
        }
        if(a==='audio'){
            nav('/Student/downloadAudio')
        }
        if(a==='image'){
            nav('/Student/imageDown')
        }

        
        

      }

      const Upcoming = () => {
        return  activities.activity.map((subj, index) => {
            return (
                <div style={{ display:'flex', alignItems:'center'}} key={subj.name}> 
                    <h3 style={{marginRight:'auto'}}>{subj.name}</h3>
                    <Button value={index} variant='contained' onClick={accessActivity} sx={{backgroundColor: props.secColor, height:'30px', width:'100px'}}>{subj.type}</Button>
                </div>
            )        
      }) 
    }
    
    return (
        <Box sx = 
            {{minHeight:"auto", width: "100%",  
            position: 'relative', display:'flex', justifyContent: 'flex-end', backgroundColor:`${props.thirdColor}`}}
        > 
            <Box sx={{height:'auto', minWidth:'80%'}}>
                <Typography variant="h1" sx={{marginTop: '150px', marginLeft:'10px'}} onClick={seeSubjects}>Dashboard</Typography>
                
                <Box sx={{marginTop: '50px'}}>
                    <Typography variant="h3" sx={{marginLeft:'40px'}}>Subjects</Typography>
                    <div style={{height:'20vh', width:'100%',  display:'flex',
                     alignItems:'center'}}>                        
                      <SubjectZero />
                       
                    </div>
                    <div style={{height:'55vh', width:'100%',  display:'flex',
                     justifyContent: "space-around",alignItems:'center'}}>
                       
                        <Box sx ={{height:'90%', width:'45%',maxWidth:'1200px'}}>
                            <Typography variant="h4">Upcoming Tasks</Typography>
                            <Card sx={{height:'80%', width:'100%', 
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', padding:'20px',
                                borderRadius: '10px'}}>
                                   <Upcoming />
                                  </Card>    
                        </Box>           
                        <Box sx ={{height:'90%', width:'45%', maxWidth:'1200px'}} onClick={() => console.log(props.primeColor)}>
                            <Typography variant="h4">Attendance Percentage</Typography>
                            <Card sx={{height:'80%', width:'100%', 
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                borderRadius: '10px'}}></Card>   
                        </Box>
                     </div>

                </Box>
            </Box>
            <Box sx={{height:'100vh', width:'20%',backgroundColor:'#f1f1ee'}}>
                <div style={{marginTop: '150px', marginLeft:'8%',  display:'flex', flexDirection:'column', height:'100%'}}>
                    <Typography variant='h5'>Search Sites</Typography>
                    <div>
                        <TextField 
                            sx= {{boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25),0px 4px 4px rgba(0, 0, 0, 0.25)', 
                            width: '60%',borderRadius:'10px', backgroundColor:'white', border:'none'}} 
                        />
                        <Button variant="contained" sx ={{height:'100%', marginLeft: '20px', background: 'rgba(100, 149, 237, 0.51)',
                            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                            borderRadius: '10px'}}>Search</Button>
                    </div>
                    <Card sx={{height:'500px', width:'92%', marginTop:'60px',borderRadius: '15px',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}></Card>
                     <Card sx={{height:'119px', width:'92%', marginTop:'5px',borderRadius: '15px', marginTop:'30px',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', display:'flex', justifyContent:'center'}} ><Button sx={{height:'100%', width:'100%', color:'black'}} onClick={(() => nav('/Student/allAnswers'))}>See Submissiions</Button></Card>
                </div>
                    
             </Box>
             <div class="sidebar">
                <Sidebar primeColor={props.primeColor} secColor={props.secColor} />
            </div>

        </Box>
    )
} 