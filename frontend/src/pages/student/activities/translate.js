import React from 'react'
import {Paper, TextField, Button, Stack} from '@mui/material'
import { useSelector } from 'react-redux'
import { Sd } from '@mui/icons-material'

export default function Translate(props) {
    const userToken = useSelector((state => state.token))
    const act = useSelector((state => state.activities))
    const user = useSelector((state => state.user))

    let choice=''
    let a=''
    let data = new Array(2)
    if (act.activity.length > 0) { 
     choice = act.choice
     a = act.activity[choice]
     console.log(a)
     data = [...a.data]
    }
    else {
        data[0]='not downloaded'
        data[1]='still not downloaded'    
    }

    

    const [answer, setAnswer] = React.useState([data[0], data[1], '' ])
    const [currentAnswer, setCurrentAnswer] = React.useState('')
   
    function saveAnswer() {
        let temp = [...answer]
        temp[2] = currentAnswer
        setAnswer(temp)
        //console.log(act) 
        const send = {studentId: user.id, subjectId: a.subjectId, activityName: a.name, answers: answer }
        console.log(send)
        fetch('https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/subjects/save', {
            method: 'PUT',
            headers: {"Content-Type":"application/json", "token": userToken},
            body: JSON.stringify(send)
        }).then(res => res.json()).then(data => console.log(data))

    }
     return(
        <div style ={{minHeight: '100vh', width: '100%', display:'Grid', alignContent:'center', justifyContent:'center'}}>
            <Paper sx={{width:'60vw', height:'70vh', display:'flex',justifyContent:'center', alignItems:'center' }}>
               <Stack spacing={3} width='60%'>
                <h1 style={{textAlign:'center'}}>Translate the text</h1>
                <h4>sentence in thai</h4>
                <TextField label='The translated text' value='Thai sentence' />
                <h4>translate the sentence</h4>
                <TextField label='translate here' value={currentAnswer} onChange={(e) => setCurrentAnswer(e.target.value)}/>
                <Button variant='contained' sx={{backgroundColor:props.secColor}} onClick={() => saveAnswer()}> submit </Button>
                </Stack>

            </Paper>
        </div>
     )
}