import React from 'react'
import ReactPlayer from 'react-player'
import {useSelector} from 'react-redux'
import {Paper, Button} from '@mui/material'

export default function viewVideo(props) {
const video = useSelector((state => state.activities))
const userToken = useSelector((state => state.token))
const user = useSelector((state => state.user))
const idx = video.choice
console.log(video)


function saveActivity() {
    const toSend ={studentId: user.id, subjectId: video.activity[idx].subjectId, 
        activityName: video.activity[idx].name,
        answers: [], activityType:'video'}

    fetch('https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/subjects/save', {
        method:'POST',
        headers:{"Content-Type":"application/json", "token": userToken},
        body: JSON.stringify(toSend)
    }).then(res => res.json()).then(data => console.log(data))
}


    return (
        <div style={{marginTop:'10vh', width:'100%', minHeight:'80vh', display:'grid', placeItems:'center'}}>
            <Paper sx={{width:'90%', height:'60vh', display:'grid', placeItems:'center'}}>
                <ReactPlayer url={video.activity[idx].data[0]} controls={true} width='80%'  height='50vh'/>
                <Button variant='contained' sx={{backgroundColor:props.secColor}} onClick={() => saveActivity()}>Mark Done</Button>
            </Paper>
        </div>
    )
}

