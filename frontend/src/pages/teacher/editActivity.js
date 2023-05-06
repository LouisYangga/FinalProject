import React from 'react'
import {Button, Stack, TextField, Card} from '@mui/material'
import ReactPlayer from 'react-player'
import {useSelector} from 'react-redux'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router';


export default function EditActivity(props) {
    const sDate = new Date(props.activity.startDate)
    let eDate = ''
    let sMonth = sDate.getMonth() + 1
    let eMonth =''
    if(props.activity.dueDate) {
        eDate = new Date(props.activity.dueDate)
        eMonth = eDate.getMonth() + 1

    }

    const [subjectId, setSubjectId] = React.useState(123)
    const [type, setType] = React.useState(props.activity.type)
    const [actName, setActName] = React.useState(props.activity.name)
    const [totalMarks, setTotalMarks] = React.useState(props.activity.totalMarks)
    const [data, setData] = React.useState([...props.activity.data])
    const [startDate, setStartDate] = React.useState(sDate.getDate()-1 +'/'+sMonth+'/'+ sDate.getFullYear())
    const [endDate, setEndDate] = React.useState(eDate.getDate()-1 +'/'+eMonth +'/'+ eDate.getFullYear())
    const userToken = useSelector((state => state.token))

    function handleUpdate() {
        const a = {subjectId: subjectId, activityName: actName, 
            type: type, totalMarks, dueDate: endDate, startDate: startDate}

        fetch('https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/subjects/update-content',{
            method:'PUT',
            headers:{"Content-Type":"application/json", "token": userToken},
            body: JSON.stringify(a)
        }).then(res => res.json()).then(dat => console.log(dat))

        const d = {subjectId, activityName: actName, newData: data}
        fetch('https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/subjects/update-data', {
            method: 'PUT',
            headers:{"Content-Type":"application/json", "token": userToken},
            body: JSON.stringify(d)
        }).then(res => res.json()).then(dat => console.log(dat))
    

    }

    function saveDragData(w1,w2,w3,w4,w5,t1,t2,t3,t4,t5) {
        setData([w1,w2,w3,w4,w5,t1,t2,t3,t4,t5])
    }

    const DragAndDrop = () => {
        const [w1, setW1] = React.useState(data[0])   
        const [w2, setW2] = React.useState(data[1])   
        const [w3, setW3] = React.useState(data[2]) 
        const [w4, setW4] = React.useState(data[3])        
        const [w5, setW5] = React.useState(data[4])   
        const [t1, setT1] = React.useState(data[5])   
        const [t2, setT2] = React.useState(data[6])   
        const [t3, setT3] = React.useState(data[7]) 
        const [t4, setT4] = React.useState(data[8])        
        const [t5, setT5] = React.useState(data[9])  
        return(        
            <div style={{display:'flex'}}>
                <Stack>
                    <TextField label = 'English word 1' value={w1} onChange={(e) => setW1(e.target.value)}></TextField>
                    <TextField label = 'English word 2' value={w2} onChange={(e) => setW2(e.target.value)}></TextField>
                    <TextField label = 'English word 3' value={w3} onChange={(e) => setW3(e.target.value)}></TextField>
                    <TextField label = 'English word 4' value={w4} onChange={(e) => setW4(e.target.value)}></TextField>
                    <TextField label = 'English word 5' value={w5} onChange={(e) => setW5(e.target.value)}></TextField>
                </Stack>
                <Stack>
                    <TextField label = 'Translated word 1'  value={t1} onChange={(e) => setT1(e.target.value)}></TextField>
                    <TextField label = 'Translated word 2' value={t2} onChange={(e) => setT2(e.target.value)}></TextField>
                    <TextField label = 'Translated word 3' value={t3} onChange={(e) => setT3(e.target.value)}></TextField>
                    <TextField label = 'Translated word 4' value={t4} onChange={(e) => setT4(e.target.value)}></TextField>
                    <TextField label = 'Translated word 5' value={t5} onChange={(e) => setT5(e.target.value)}></TextField>
                </Stack>

                <Button   sx={{color: 'black'}} onClick={() => saveDragData(w1,w2,w3,w4,w5,t1,t2,t3,t4,t5)}>Save</Button>
            </div>
        )
    }
    

    function saveTranslate(english, translate) {
        setData([english, translate])
    }

    function saveVideo(vid) {
        setData([vid])
    }

    const Translate = () => {
        const [english, setEnglish] = React.useState(data[0])
        const [translate, setTranslate] = React.useState(data[1])

        return(
            <div>
                <TextField label='english sentence' value={english} onChange={(e) => setEnglish(e.target.value)}></TextField>
                <TextField label='translated sentence' value={translate} onChange={(e) => setTranslate(e.target.value)}></TextField>
                <Button  variant='contained' sx={{backgroundColor:props.secColor}} onClick={() => saveTranslate(english, translate)}>Save</Button>

            </div>)
        }
        const Video = () => {
            const [vid, setVid] = React.useState(data[0])

            return(<div>
                <TextField label='video url' value={vid} onChange={(e) => setVid(e.target.value)} />
                <Button  variant='contained' sx={{backgroundColor:props.secColor}} onClick={() => saveVideo(vid)}>Save</Button>
                <ReactPlayer url= {vid} controls={true} />
            </div>)
        }

        const File = () => {
            return(<div></div>)
        }


    return (
        <Card>
        <Stack spacing={2} alignItems="center">
            <h3>{actName}</h3>
            <TextField label='total marks' value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)}></TextField>
            <TextField label='Start Date dd/mm/yyyy' value={startDate} onChange={(e) => setStartDate(e.target.value)}></TextField>
            <TextField label='End Date dd/mm/yyyy' value={endDate} onChange={(e) => setEndDate(e.target.value)}></TextField>
            {props.activity.type==='drag' && <DragAndDrop/>}
            {props.activity.type==='translate' && <Translate />}
            {props.activity.type==='video' && <Video />}


            <Button  variant='contained' sx={{backgroundColor:props.secColor, width:'200px'}} onClick={handleUpdate}>Update</Button>
            <Button onClick={() => props.handleClick()} > <ArrowBackIosNewIcon /> </Button>


        </Stack>
        </Card>
    )
}