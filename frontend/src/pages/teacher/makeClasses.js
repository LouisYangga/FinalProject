import React, { useEffect } from 'react'
import {TextField, Typography, Button, Container, Paper, stepContentClasses, Stack} from '@mui/material'
import FileBase from 'react-file-base64'
import Delete from '@mui/icons-material/Delete'
import ReactPlayer from 'react-player'
import { useSelector } from 'react-redux'
import { set } from 'mongoose'
import { useNavigate } from 'react-router'


export default function makeClasses(props) {
   const userToken = useSelector((state => state.token))
   const [content, editContent] = React.useState([{}])
   const [choice, setChoice] = React.useState([''])
   const subj = useSelector((state => state.subject))
  
   
   const changeChoice = (e) => {
      
      setChoice(prev => {
         let temp = [...prev]
         temp[e.target.name] = e.target.value 
         return temp
      })

      let data  
         if(e.target.value === 'drag') {
            const words = ['','', '', '','', '','', '', '','']
            data = words
         } else if (e.target.value === 'translate') {
            data =['', '']
         } else if (e.target.value === 'video') {
            data =['']
         } else if (e.target.value === 'file')  {
            data=['']
         }  else if(e.target.value ==='audio') {
            data=['']
         }  

      let activity = {
         type: e.target.value,
         name: '',
         data: data,
         startDate: '',
         endDate:''
      }

      if ( e.target.value === 'file') {
         activity = {
            type: e.target.value,
            name: '',
            dataFile: '',
            startDate: '',
            endDate:''
         }
      }

      editContent(prev => {
         let temp = [...prev]
         temp[e.target.name] = activity
         return temp
      })
     
   }
   
   function setDragContent(w1, w2,w3,w4,w5,t1,t2,t3,t4,t5, index) {
     const holder = [w1, w2, w3, w4, w5, t1,t2,t3,t4,t5]
     editContent(prev => {
         const temp = [...prev]
         temp[index.index].data = [...holder]
         return temp; 
      }) 
   }
   

   function addContent() { 
      if(choice[0]=== '') {
         console.log('please choose your first option')
         return
      }
      setChoice(prev => [...prev, ''])
      editContent(prev => [...prev, {}])
   }

   React.useEffect(() => {console.log(content) 
      console.log(choice)}, [choice])
   
   const DragAndDrop= (index) => {  
      const [w1, setW1] = React.useState('')   
      const [w2, setW2] = React.useState('')   
      const [w3, setW3] = React.useState('') 
      const [w4, setW4] = React.useState('')        
      const [w5, setW5] = React.useState('')   
      const [t1, setT1] = React.useState('')   
      const [t2, setT2] = React.useState('')   
      const [t3, setT3] = React.useState('') 
      const [t4, setT4] = React.useState('')        
      const [t5, setT5] = React.useState('')   


      React.useEffect(() => {
         const temp = [...content[index.index].data]
         setW1(temp[0])
         setW2(temp[1])
         setW3(temp[2])
         setW4(temp[3])
         setW5(temp[4])
         setT1(temp[5])
         setT2(temp[6])
         setT3(temp[7])
         setT4(temp[8])
         setT5(temp[9])

      }, [content])


      return (
            <div>
                <div>
                  <TextField id={0} label='Word One' value={w1} onChange={(e) => setW1(e.target.value)} />
                  <TextField label='Translation 1' value={t1} onChange={(e) => setT1(e.target.value)}/>
               </div>
               <div>
                  <TextField id ={1} label='Word two' value={w2} onChange={(e) => setW2(e.target.value)}/>
                  <TextField label='Translation 2'  value={t2} onChange={(e) => setT2(e.target.value)}/>
               </div>
               <div>
                  <TextField id ={2}  label='Word three' value={w3} onChange={(e) => setW3(e.target.value)}/>
                  <TextField label='Translation 3'  value={t3} onChange={(e) => setT3(e.target.value)}/>
               </div>
               <div>
                  <TextField id ={3}  label='Word four' value={w4} onChange={(e) => setW4(e.target.value)}/>
                  <TextField label='Translation 4'  value={t4} onChange={(e) => setT4(e.target.value)}/>
               </div>
               <div>
                  <TextField id ={4}  label='Word five' value={w5} onChange={(e) => setW5(e.target.value)}/>
                  <TextField label='Translation 5'  value={t5} onChange={(e) => setT5(e.target.value)}/>
               </div>

               <Button onClick= {() => setDragContent(w1,w2, w3, w4, w5,t1,t2,t3,t4,t5, index)}>Save</Button>
            </div>     
      )      
   }

   function setTranlation(english, translate, index) {
      editContent(prev => {
         const temp= [...prev]
         temp[index.index].data[0] = english
         temp[index.index].data[1] = translate


         return temp;
      })
   }

   const Translation = (index) => {   
      const [english, setEnglish] = React.useState('')
      const [translate, setTranslate] = React.useState('')


      React.useEffect(() => {
         setEnglish(content[index.index].data[0])
         setTranslate(content[index.index].data[1])

      }, [content])


      return (
         <Stack alignItems='center' width='80%'>
            <TextField label='English sentence' value={english} fullWidth sx={{marginLeft:'20px'}} onChange={(e) => setEnglish(e.target.value)}/>
            <TextField label='thai translation' value={translate} fullWidth sx={{marginLeft:'20px'}} onChange={(e) => setTranslate(e.target.value)}/>
            <Button onClick= {() => setTranlation(english, translate,index)} >Save</Button>

         </Stack>
      )
   }

   function setVideo(videoUrl, index) {
      editContent(prev => {
         const temp=[...prev]
         temp[index.index].data[0] = videoUrl
         return temp
      })
   }

   const Video = (index) => { 
      const [videoUrl, setVideoUrl] = React.useState('')

      React.useEffect(() => {
         setVideoUrl(content[index.index].data)
      },[content])

      return (
         <div>
            <div style={{display: 'flex'}}>
            <TextField value={videoUrl} label='Video URL' sx={{marginLeft:'20px', width:'70%'}} onChange={(e) => setVideoUrl(e.target.value)}/>          
            <Button onClick={() => setVideo(videoUrl, index)}>Set Video</Button>
            </div>
            
            
            <ReactPlayer url ={videoUrl} controls={true}  height='300px' width='400px'/>

         </div>
      )
   }

   
  
   
   
   

   function removeContent(e) {
      const idx = e.currentTarget.value
      console.log(idx)
      if(choice.length > 1) {
         setChoice(prev => {
            const temp = [...prev]
            temp.splice(idx, 1)
            return temp
         })  
         editContent(prev => {
            const temp = [...prev]
            temp.splice(idx, 1)
            return temp;
         })              
      }    
   } 

   const contentOptions = ['translate', 'drag', 'video' ]

   function handleStartdate(e) {
      editContent(prev => {
         let temp = [...prev]
         temp[e.target.name].startDate = e.target.value
         return temp
      })
   }
   function handleEndDate(e) {
      editContent(prev => {
         let temp = [...prev]
         temp[e.target.name].endDate = e.target.value
         return temp
      })
   }

   function handleName(e) {
      editContent(prev => {
         let temp= [...prev]
         temp[e.target.name].name = e.target.value
         return temp;
      })
   }
   let counter = 0

   function sendContent() {

         content.forEach((item) => {
            
            if(item) {
            const {type, name, data, totalMarks, startDate, dueDate} =
               { type: item.type, name: item.name ,data: item.data, totalMarks: 100,
               startDate: item.startDate, dueDate: item.endDate }
            
               
            let b = {subjectId:  subj.subjectCode, activityName: name, type,  totalMarks, startDate, dueDate, data}
            if(item.type = 'file') {
               b = {subjectId:  subj.subjectCode, activityName: name, type,  totalMarks, startDate, dueDate, data, fileData: item.fileData}
            }
            console.log(b)
            fetch('https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/subjects/activities/add',{
               method: 'PUT',
               headers: {"Content-Type": 'application/json', "token": userToken},
               body: JSON.stringify(b)
            }).then(res => res.json()).then(data => { 
               console.log(data)
               nav('/Teacher/TeacherDashboard')
            }
               )
            counter= counter + 1;

            
          
         } else {
            return
         }
      })
   }

   const nav = useNavigate()

   function fileUploadPage() {
      nav('/Teacher/custom-content')
   }

   

   
   return(
      <div style={{marginTop:'150px', minHeight: '90vh', display:'flex', justifyContent: 'center'}}>
        <Paper sx={{minWidth:'80vw', marginBottom:'300px' }}>
        <Typography variant='h3'>Curriculum builder</Typography>


          {content.map((ch, index) => {
            return(
               <form  style={{padding: '30px'}}>
                  <div style={{display:'flex'}}>
                  <Typography  variant='h3' sx={{marginRight:'auto'}}>Add Content</Typography>
                  <Button  variant='contained' onClick={fileUploadPage} sx={{boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', backgroundColor:props.secColor}}>Upload Files</Button>
                  </div>

                  {choice[index] && <TextField label='Activity Name' name = {index} onChange={handleName}/>}
                  <div  style={{ position:'relative',display:'flex', flexDirection:'column',justifyContent:'space-between', alignItems:'center', marginTop:'30px'}}>
                     <div style={{display:'flex', width:'80%', justifyContent:'center'}}>
                        <h4 style={{marginRight:'20px'}}>Choose Activity type</h4>
                     <select name={index} id='content' style ={{height:'50px', width:'200px', padding:'5px', marginBottom:'20px'}} onChange={changeChoice}>
                        <option>-</option>
                        <option  value='translate' >Translate </option>
                        <option  value='drag'>drag and Match </option>
                        <option  value='video' >video</option>

                     </select>
                     <Button value={index} onClick={removeContent} sx={{alignSelf:'center', color:props.secColor}}>
                        <Delete  />
                     </Button>
                     </div>
                     {choice[index]==='drag' && <DragAndDrop  index={index} />}
                     {choice[index]==='translate' && <Translation   index={index}/>}
                     {choice[index] === 'video' && <Video index={index} />}


                     
                     
                  </div>
                  {choice[index] && <div style={{display:'flex', justifyContent:'space-around'}}>
                  <TextField  id="outlined-basic" label="Start Date: dd/mm/yy" variant="outlined" name={index}
                          onChange = {handleStartdate}  /> 
                   
                 <TextField id="outlined-basic" label="End Date: dd/mm/yy" variant="outlined" name={index}
                         onChange = {handleEndDate}  /> 
                  </div>}
               </form>
            )
          })}
          <div style={{display:'flex', justifyContent:'space-between', width:'80%', marginLeft:'10%'}}>
            <Button onClick={addContent} sx={{color:props.secColor}}> +Add </Button>
            <Button variant='contained' sx={{backgroundColor:props.secColor}} onClick={sendContent}> Submit </Button>
          </div>
        </Paper>
        </div>
     
     )
}
