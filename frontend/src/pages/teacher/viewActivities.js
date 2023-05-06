import { Button, Card, Paper, TextField } from '@mui/material'
import React, { useEffect } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { fetchActivities } from '../../redux/features/activities'
import ReactPlayer from 'react-player'
import EditActivity from './editActivity'
import DeleteIcon from '@mui/icons-material/Delete';
import { removeActivity } from '../../redux/features/activities'

export default function ViewActivities(props) {
    const subj = useSelector(state => state.subject)
    const act = useSelector(state => state.activities)
    const userToken = useSelector((state => state.token))
    const [content, editContent] = React.useState()
    const [selectedContent, setSelectedContent]= React.useState()
    const dis = useDispatch()
    
    React.useEffect(() => {
    fetch(`https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/subjects/activities/${subj.subjectCode}`, {
            headers: {"Content-Type":"application/json", "token": userToken}
        }).then(res => res.json()).then(data => {
            editContent(data.activities)
            dis(fetchActivities(data.activities))
        })
        console.log(subj)
    }, [])

    function handleSelectedContent(con) {
       setSelectedContent(con)
    }   

    function deleteActivity(con) {
        const temp = new Array()
        content.map((a) => {
            if(a.name === con.name) {return}
            else {temp.push(a)}
        })

        editContent(temp)

        const toDelete = {subjectId: subj.subjectCode, activityName: con.name}
        fetch('https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/subjects/activities/remove', {
            method:'PUT',
            headers:{"Content-Type":"application/json", "token":userToken},
            body: JSON.stringify(toDelete)
        }).then(res => res.json()).then(data => console.log(data))
    }
    

    return(
        <Paper sx={{width:'80vw', backgroundColor: props.secColor}}>
            <h1 style={{textAlign:'center'}}>Activities</h1>
            {content && !selectedContent && content.map((con) =>{
                return(
                    <Card  sx={{display:'flex', alignItems:'center', padding:'2px', margin:'5px'}} >
                       <div className='activityList' style={{width: '90%', height:'100%', marginRight:'auto'}} onClick={() => handleSelectedContent(con)}>
                        <h4 >{con.name}</h4>
                        </div>
                        <p style={{marginRight:'10px'}}>{con.type}</p>
                        <Button onClick={() => deleteActivity(con)}>
                         <DeleteIcon />
                        </Button>
                    </Card>)
            })}
            {selectedContent && <EditActivity secColor={props.secColor} handleClick={() => setSelectedContent(null)} activity = {selectedContent} />}
        </Paper>
    )
}