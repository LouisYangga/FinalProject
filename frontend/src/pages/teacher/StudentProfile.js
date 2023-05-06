import { ConstructionOutlined } from '@mui/icons-material'
import { Card, Paper, TextField, Button } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router';

export default function StudentProfile(props) {
const student = useSelector((state => state.selectedStudent))
const userToken = useSelector((state => state.token))
const subj = useSelector((state => state.subject))
const [answers, setAnswers] = React.useState([]) 
React.useEffect(() => {
    const b = {subjectId: subj.subjectCode, studentId: student.id}
    fetch('https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/subjects/all-answers', {
        method:'POST',
        headers:{"Content-Type":"application/json", "token": userToken},
        body: JSON.stringify(b)
    }).then(res => res.json()).then(data => {
        const temp = new Array()
        data.map(d => {
            if(d.marks !== undefined && d.activityType !== undefined ) {
                temp.push(d)
            }  else if(d.marks === undefined && d.activityType !== undefined) {
                const c = {...d, marks:''}
                temp.push(d)
            } else if(d.marks !== undefined && d.activityType === undefined) {
                const c = {...d, activityType:'translate'}
                temp.push(d)
            }          
            else {
                const c = {...d, marks: '', activityType:''}
                temp.push(c)
            }
            
        })
        setAnswers([...temp])
    })
},[])

const [isMarked, setIsMarked] = React.useState(false)

function activityMarked(index) {
    fetch()

    setAnswers(prev => {
        let temp = [...prev]
       temp.splice(index, 1)
       return temp
    })
}

const marking = new Array(100)

for(let i = 1; i < 101; i++) {
    marking[i-1]= i
}

function handleMark(e,index) {
    const temp = [...answers]
    temp[index].marks = e.target.value
    setAnswers(temp)
}

function activityMarked(index) {
    const a = answers[index]
    const toMark = {subjectId: subj.subjectCode , studentId: student.id, activityName: a.activityName, mark: a.marks} 
    console.log(toMark)
    fetch('https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/subjects/answer/mark', {
        method: "PUT",
        headers: {"Content-Type":"application/json", "token":userToken},
        body: JSON.stringify(toMark)
    }).then(res => res.json()).then(data => console.log(data))

    setIsMarked(true)
    setTimeout(function() {setIsMarked(false)}, 1000)
}   

const Translate = (ans) => {
    return(
        <div>
            <h5>proposed answer: {ans.answers[0]}</h5>
            <h5>translated text: {ans.answers[1]}</h5>
            <h5>students answer: {ans.answers[2]}</h5>
        </div>
    )
}

const Drag = (ans) => {
    const data= [...ans.answers]
    return (
        <div>
            <h5>pair 1: {data[0] +"           "+ data[5]}</h5>
            <h5>pair 2: {data[1] +"           "+ data[6]}</h5>
            <h5>pair 3: {data[2] +"           "+ data[7]}</h5>
            <h5>pair 4: {data[3] +"           "+ data[8]}</h5>
            <h5>pair 5: {data[4] +"           "+ data[9]}</h5>

        </div>

    )
}
const nav = useNavigate()


return (
    <div  style = {{minHeight:"auto", width: "100%", display: 'flex', justifyContent:'center', marginBottom:'10px', alignItems:'center', marginTop:'120px'}}>
        <Paper sx={{height:'80vh', width:'80%', display:'flex', flexDirection:'column', alignItems:'center'}} onClick = {() => console.log(student)}> 
            <h1>{student.firstName +"  "+ student.lastName}</h1> 
            <h4>{student.email}</h4>
         <div style={{display:'flex', flexWrap:'wrap', width:'80%', marginBottom:'auto', overflowY:'scroll'}}>
            {answers.map((ans,index) => {
                return(
                    <Card sx={{width:'200px', minHeight: ans.activityType !=='drag' ? '150px': '300px',  padding:'20px', margin:'20px', display:'flex', flexDirection:'column', position:'relative'}}> 
                        <h3>{ans.activityName}</h3>
                        {ans.activityType === 'translate' && Translate(ans)}
                        {ans.activityType ==='drag' && Drag(ans)}


                        <select style ={{width:'100px',height:'30px', }} value={ans.marks} onChange={(e) => handleMark(e,index)}>
                            {marking.map(m => {
                                return(
                                    <option value={m}>{m}</option>
                                )
                            })}
                        </select>
                        <div style ={{width:'100%', height:'100%', display:'grid', placeItems:'end end'}}>
                        
                        <Button sx={{color:props.secColor}}>
                            <CheckIcon onClick={() => activityMarked(index)} />
                        </Button>
                        </div>

                    </Card>
                )
            })}
            </div>
            {isMarked && <Card sx={{backgroundColor:'lightGreen', padding:'2px'}}>Activity has been marked</Card>}

            <Button onClick={() => nav('/Teacher/Subject')} > <ArrowBackIosNewIcon /> </Button>
        </Paper>
       
    </div>    
    )
}