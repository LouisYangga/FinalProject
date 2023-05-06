import React from 'react'
import { useSelector } from 'react-redux'
import { Paper, Button } from '@mui/material'


export default function AudioDown(props) {
    const act = useSelector((state => state.activities))
    const userToken = useSelector((state => state.token))
    const user = useSelector((state => state.user))
    
    const idx = act.choice
    
    const base64 = act.activity[idx].data
    function saveActivity() {
        const toSend ={studentId: user.id, subjectId: act.activity[idx].subjectId, 
            activityName: act.activity[idx].name,
            answers: [], activityType:'audio'}
    
        fetch('https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/subjects/save', {
            method:'POST',
            headers:{"Content-Type":"application/json", "token": userToken},
            body: JSON.stringify(toSend)
        }).then(res => res.json()).then(data => console.log(data))
    }
    
   
    
    
        return (
            <div style={{marginTop:'10vh', width:'100%', minHeight:'80vh', display:'grid', placeItems:'center'}}>
                <Paper sx={{width:'90%', height:'60vh', display:'grid', placeItems:'center'}}>
                    <h1>{act.activity[idx].name}</h1>
                    <audio controls volume style={{width:'300px'}}>
                        <source src={base64} type="audio/mp3"></source>
                    </audio>

                    <Button onClick={saveActivity}> mark completed</Button>
                </Paper>
                
            </div>
        )
    }
    