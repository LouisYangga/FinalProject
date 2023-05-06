import React from 'react'
import { Button, Card, Paper} from '@mui/material'
import { useSelector } from 'react-redux'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router';

export default function AllAnswers() {
    const user = useSelector((state => state.user))
    const userToken = useSelector((state => state.token))
    const stuSubs = useSelector((state => state.stuSubj))
    const [answers, setAnswers] = React.useState([])

    console.log(user, stuSubs)

    React.useEffect(() => {
        const ans = new Array()

        stuSubs.forEach((s) => {
            const toSend= {subjectId: s, studentId: user.id}
            fetch("https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/subjects/all-answers", {
                method:'POST',
                headers: {"Content-Type":"application/json", "token": userToken},
                body: JSON.stringify(toSend)
            }).then(res => res.json()).then(data => {
                data.map((d) => {
                    const b = {...d, subjectId: s}
                    ans.push(b)
                })               
                setAnswers([...ans])
            })
        })

        console.log(ans)

    }, [])
    const nav = useNavigate()

    return(
        <div style ={{minHeight: '100vh', width: '100%', display:'Grid', alignContent:'center', justifyContent:'center'}}>
            <Paper sx={{width:'60vw', height:'70vh', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center' }}>
            <table style={{width:'80%', marginBottom:'auto'}}>        
              <tr>
                <th style={{textAlign:'left', padding:'20px'}} onClick={() => console.log(answers)}>Subject ID</th>
                <th style={{textAlign:'left', padding:'20px'}}>Activity name</th>
                <th style={{textAlign:'left' , padding:'20px'}}>Mark</th>
            </tr>      
           {answers.map(ans => {
            return(
                <tr style={{boxShadow: '0px 3px 0px rgba(0, 0, 0, 0.25)'}} >
                    <td style={{padding:'20px'}}>{ans.subjectId}</td>
                    <td style={{padding:'20px'}}>{ans.activityName}</td>
                    <td style={{padding:'20px'}}>{ans.marks}</td>
                </tr>
            )
           })}                          

            </table>
            <Button onClick={() => nav('/Student/StudentDashboard')}><ArrowBackIosNewIcon/></Button>
            </Paper>
        </div>
    )
}