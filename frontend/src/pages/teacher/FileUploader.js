import React from 'react'
import { TextField, Paper, Button, Stack } from '@mui/material'
import FileBase from 'react-file-base64'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'


export default function FileUploader(props) {   
        const [theFile, setTheFile] = React.useState('')
        const [name, setName] = React.useState('')
        const [totalMarks, setTotal] = React.useState(100)
        const [startDate, setStartDate] = React.useState()
        const [dueDate, setEndDate] = React.useState()

        const[type, setType] = React.useState('')

        const userToken = useSelector((state => state.token))
        const user = useSelector((state => state.user))
        const subj = useSelector((state => state.subject))
        
        const nav = useNavigate()
       
        function saveFile(){
            const toSend ={subjectId: subj.subjectCode, activityName: name, 
                type: type, totalMarks, startDate, dueDate, data:theFile}
                console.log(toSend)
            
                fetch('https://localhost:5000/api/subjects/activities/add',{
                    method: 'PUT',
                    headers: {"Content-Type": 'application/json', "token": userToken},
                    body: JSON.stringify(toSend)
                 }).then(res => res.json()).then(data => {
                    console.log(data)
                    nav('/Teacher/TeacherDashboard')

                })
        }

        function handleType(e) {
            setType(e.target.value)
        }

         return(
            <div style={{marginTop:'150px', minHeight: '90vh', display:'flex', justifyContent: 'center'}}>
            <Paper sx={{minWidth:'80vw', marginBottom:'300px' }}>
             <Stack spacing={5} sx={{width:'100%', height:'80%'}} alignItems='center' justifyContent='center' >
            <h2>Upload File</h2>
            <TextField label='Activity Name'  onChange={e => setName(e.target.value)} sx={{width:'80%'}}/>
              <div style={{display:'flex'}}> 
              <h4 style={{marginRight:'30px'}}>choose file type:</h4> 
              <select onChange={handleType} style={{height:'50px'}}>
                    <option>- choose file type</option>

                    <option value='file'>pdf</option>
                    <option value='audio'>audio</option>
                    <option value='image'>image</option>


                </select></div>
           
                <FileBase 
                type='file'
                multiple={false}
                onDone={({base64}) => setTheFile(base64)}
               />

               <TextField id="outlined-basic" label="Start Date: dd/mm/yy" variant="outlined" sx={{width:'80%'}}
                          onChange = {e => setStartDate(e.target.value)}  /> 
                   
                <TextField id="outlined-basic" label="End Date: dd/mm/yy" variant="outlined" sx={{width:'80%'}}
                        onChange = {e => setEndDate(e.target.value)}  /> 
            
            <Button onClick={saveFile}> save</Button>
            </Stack>   
            
            </Paper>
         </div>
         
         )
      } 

    
