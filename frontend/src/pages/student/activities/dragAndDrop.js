import React from 'react'
import { Paper, Stack, Card, Button } from '@mui/material'
import {useSelector} from 'react-redux'
import  {DndContext, closestCenter} from '@dnd-kit/core'
import {arrayMove, SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable'
import { useNavigate } from 'react-router'

export default function dragAndDrop(props) {
    const act = useSelector((state => state.activities))
    const userToken = useSelector((state => state.token))
    const user = useSelector((state => state.user))
    let choice=''
    let activity=''
    let data = new Array(10)
    if (act.activity.length > 0) { 
     choice = act.choice
     activity = act.activity
     data = [...activity[choice].data]
    } else {
        for(let i = 0; i < data.length; i++) {
            if(i%3 === 0) {
                data[i] = 'hello'
            }
            if(i%2 === 0) {
                data[i] = 'goodBye'
            }
            else {
                data[i]= 'youDont'
            }
        }
    }
   


    const [answers, setAnswers] = React.useState([data[5], data[6], data[7], data[8], data[9], '', '', '', '',''])

    
    const [current, setCurrent] = React.useState(null)
   const [wordSelected, setWordSelected] = React.useState([false, false, false, false, false])

   const nav = useNavigate()
   function saveAnswer() {
        const toSend ={studentId: user.id, subjectId: activity[choice].subjectId,
            activityName: activity[choice].name, answers: answers,
             activityType: activity[choice].type}

             fetch('https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/subjects/save', {
                method:'POST',
                headers:{"Content-Type":"application/json", "token": userToken},
                body: JSON.stringify(toSend)
            }).then(res => res.json()).then(data => console.log(data))



            nav('/Student/StudentDashboard')
        }

    function selectCurrent(index) {
        let temp = [false, false, false, false, false]
        temp[index] = true
        setWordSelected(temp)
        setCurrent(data[index])        
    }

    function selectAnswer(index) {
        let temp = [...answers]
        temp[index] = current
        setAnswers(temp)
    }

    return(
        <div style ={{minHeight: '100vh', width: '100%', display:'Grid', alignContent:'center', justifyContent:'center'}}>
            {act && <Paper sx={{width:'60vw', height:'70vh'}}>
                <div style={{display:'flex', flexDirection:'column', alignItems:'center', height:'100%', width: '100%'}}>
                    <h1>Match The Word</h1>
                    <div style={{height:'100%', width:'70%', display:'flex', justifyContent:'space-between', marginTop:'30px'}}>
                        <Stack spacing={12}>
                            <Card sx={{width:'200px', height:'50px' , borderRadius:'30px',  display:'grid', placeItems:'center',
                                    backgroundColor: wordSelected[0] ? props.secColor: ''}} onClick={() => selectCurrent(0)}><h3>{data[0]}</h3></Card>
                            <Card sx={{width:'200px', height:'50px', borderRadius:'30px',  display:'grid', placeItems:'center',
                               backgroundColor: wordSelected[1] ? props.secColor : ''}} onClick={() => selectCurrent(1)}><h3>{data[1]}</h3></Card>
                            <Card sx={{width:'200px', height:'50px', borderRadius:'30px',  display:'grid', placeItems:'center',
                               backgroundColor: wordSelected[2] ? props.secColor : ''}} onClick={() => selectCurrent(2)}><h3>{data[2]}</h3></Card>
                            <Card sx={{width:'200px', height:'50px', borderRadius:'30px',  display:'grid', placeItems:'center',
                               backgroundColor: wordSelected[3] ? props.secColor: ''}} onClick={() => selectCurrent(3)}><h3>{data[3]}</h3></Card>
                            <Card sx={{width:'200px', height:'50px', borderRadius:'30px',  display:'grid', placeItems:'center',
                               backgroundColor: wordSelected[4] ? props.secColor : ''}} onClick={() => selectCurrent(4)}><h3>{data[4]}</h3></Card>
                        </Stack>
                        <Stack spacing={12}>
                            <div style={{display:'flex', width:'300px', justifyContent: 'space-around'}} >
                                <h3 sx={{width:'200px', height:'50px'}}>{data[5]}</h3>
                                <Card sx={{width:'200px', height:'50px',  display:'grid', borderRadius:'30px',placeItems:'center', boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)'}}
                                    onClick={() => selectAnswer(5)}>
                                    <h3>{answers[5]}</h3>
                                </Card>

                            </div>
                            <div style={{display:'flex', width:'300px', justifyContent: 'space-around'}} >
                                <h3 sx={{width:'200px', height:'50px',  display:'grid', placeItems:'center'}}>{data[6]}</h3>
                                <Card sx={{width:'200px', height:'50px',  display:'grid', borderRadius:'30px',placeItems:'center', boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)'}}
                                 onClick={() => selectAnswer(6)}>
                                    <h3>{answers[6]}</h3>
                                </Card>
                            </div>
                            <div style={{display:'flex', width:'300px', justifyContent: 'space-around'}} >
                                <h3 sx={{width:'200px', height:'50px',  display:'grid', placeItems:'center'}}>{data[7]}</h3>
                                <Card sx={{width:'200px', height:'50px',  display:'grid', borderRadius:'30px', placeItems:'center', boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)'}}
                                 onClick={() => selectAnswer(7)}>
                                <h3>{answers[7]}</h3>
                                </Card>
                            </div>                            
                            <div style={{display:'flex', width:'300px', justifyContent: 'space-around'}} >
                                <h3 sx={{width:'200px', height:'50px',  display:'grid', placeItems:'center'}}>{data[8]}</h3>
                                <Card sx={{width:'200px', height:'50px',  display:'grid', borderRadius:'30px', placeItems:'center', boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)'}}
                                 onClick={() => selectAnswer(8)}>
                                    <h3>{answers[8]}</h3>
                                </Card>

                            </div>                                                       
                            <div style={{display:'flex', width:'300px', justifyContent: 'space-around'}} >
                                <h3 sx={{width:'200px', height:'50px',  display:'grid', placeItems:'center'}}>{data[9]}</h3>
                                <Card sx={{width:'200px', height:'50px', borderRadius:'30px',  display:'grid', placeItems:'center', boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)'}}
                                 onClick={() => selectAnswer(9)}>
                                <h3>{answers[9]}</h3>
                                </Card>

                            </div>     
                        </Stack>

             </div>
             <Button  variant='contained' sx={{backgroundColor:props.secColor, marginBottom:'100px'}} onClick={() => saveAnswer()}>Submit</Button>                   

         </div>
         </Paper>}

        </div>
    )
}