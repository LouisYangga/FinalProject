import React from 'react'
import {Paper, TextField, Typography, Stack, Button} from '@mui/material'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
export default function createSubject(props) {
    const user = useSelector(state => state.user)

    const shadow="0px 4px 4px rgba(0, 0, 0, 0.25),0px 4px 4px rgba(0, 0, 0, 0.25)"
    const [subject, setSubject] = React.useState({
        id: '',
        subjectName: '',
        coordinator: user.id,
        startDate: '',
        endDate:''
    }) 
    const userToken = useSelector((state => state.token))
    const nav = useNavigate()
    function createSubject() {
        fetch('https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/subjects/add',{
            method: 'POST',
            headers: {"Content-Type":"application/json" , "token":userToken},
            body: JSON.stringify(subject)
        }).then(res => res.json()).then(data => {
             console.log(data) 
             nav('/Teacher/TeacherDashboard')
            })
    }

  
    return (
        <div style={{marginTop:'150px', minHeight: '90vh', display:'flex', justifyContent: 'center'}}>
            <Paper sx={{width:'50%', height:'800px' }} > 
                <Stack spacing={2} justifyContent='left' alignItems='left' 
                    sx={{marginLeft: '5%', width:'90%'}}>
                    <Typography variant='h3'>Create Subject</Typography>
                    <TextField id="outlined-basic" label="Subject Name" variant="outlined" sx ={{boxShadow:`${shadow}`}} 
                            onChange={(e) => setSubject(prev =>({...prev, subjectName: e.target.value}))} />
                                                
                    <TextField id="outlined-basic" label="Subject Code" variant="outlined" sx ={{boxShadow:`${shadow}`}} 
                            onChange={(e) => setSubject(prev =>({...prev, id: e.target.value}))} />
                    
                    <TextField id="outlined-basic" label="Subject Description" variant="outlined" multiline minRows={3} sx ={{boxShadow:`${shadow}`}} 
                             />

                    <TextField id="outlined-basic" label="Coordinator" value={user.id} variant="outlined" sx ={{boxShadow:`${shadow}`}} 
                                              />
                   
                    <TextField id="outlined-basic" label="Start Date: dd/mm/yy" variant="outlined" sx ={{boxShadow:`${shadow}`}} 
                            onChange={(e) => setSubject(prev =>({...prev, startDate: e.target.value}))}/>
                   
                    <TextField id="outlined-basic" label="End Date: dd/mm/yy" variant="outlined" sx ={{boxShadow:`${shadow}`}} 
                            onChange={(e) => setSubject(prev =>({...prev, endDate: e.target.value}))}/>

                </Stack>
                <div style={{margin:'5%', width:'90%', display:'flex', justifyContent:'flex-end'}} >
                    <Button variant="contained" sx={{width:'200px', backgroundColor:props.secColor}} onClick={createSubject}>Create</Button>
                </div>
            </Paper>

        </div>
    )
}