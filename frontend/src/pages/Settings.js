import React from 'react';
import {Slider, Box, Card, Button, collapseClasses, Typography, TextField} from '@mui/material'
import * as Col from '@mui/material/colors'
import { useSelector } from 'react-redux';



function Settings(props) {
    const [shade, setShade] = React.useState(200)
    
    const [themeColor, setThemeColor] = React.useState()
    
    const [secShade, setSecShade] = React.useState(200)
   
    

    const allColors = [Col.red[shade], Col.pink[shade], Col.purple[shade], Col.deepPurple[shade], Col.indigo[shade], Col.blue[shade], Col.lightBlue[shade],
    Col.cyan[shade], Col.teal[shade], Col.green[shade], Col.lightGreen[shade], Col.lime[shade], Col.yellow[shade], Col.amber[shade], Col.orange[shade], 
    Col.deepOrange[shade], Col.brown[shade], Col.grey[shade],Col.blueGrey[shade]]    
    
    const secColors = [Col.red[secShade], Col.pink[secShade], Col.purple[secShade], Col.deepPurple[secShade], Col.indigo[secShade], Col.blue[secShade], Col.lightBlue[secShade],
    Col.cyan[secShade], Col.teal[secShade], Col.green[secShade], Col.lightGreen[secShade], Col.lime[secShade], Col.yellow[secShade], Col.amber[secShade], Col.orange[secShade], 
    Col.deepOrange[secShade], Col.brown[secShade], Col.grey[secShade],Col.blueGrey[secShade]]
    
    function changeThemeColor(e) {
        setThemeColor(e)
        props.handleColor(e)
    }

    function changeSecColor(e) {
        setThemeColor(e)
        props.handleSecColor(e)
    }

    const drawColors = allColors.map((data, index) => {
        return(
            <Box key = {index} sx={{height:'50px', width: '50px', backgroundColor:`${data}`}}   onClick={()=> changeThemeColor(data)} ></Box>
        )
    })
    
    const drawSecColors = secColors.map((dat, index) => {
        return(
            <Box key = {`S${index}`} sx={{height:'50px', width: '50px', backgroundColor:`${dat}`}}   onClick={()=> changeSecColor(dat)} ></Box>
        )
    })

    const [logoFile, setTheFile] = React.useState('')
    const [logoName, setLogoName] = React.useState('')

    function sendLogo() {

   
        fetch('https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/users/logo/thaiShoolLogo',{
            method:'GET',
            headers:{"Content-Type":"application/json"}
        }).then(res => res.json()).then(data => { 
            console.log(data)
            setTheFile(data.data)
        })
    }
   

    

    function changeShade(e) {
    const temp = e.target.value
    
    let isPrimary = false
    if(e.target.name ==='primary') {
        isPrimary = true
    }
    if (temp< 901) {
      isPrimary && setShade(temp)
      !isPrimary && setSecShade(temp)
    } else {
      if(temp === 1000) {
        isPrimary && setShade('A100')
        !isPrimary && setSecShade('A100')
       }
       if(temp === 1100) {
        isPrimary && setShade('A200')
        !isPrimary && setSecShade('A200')
       }
       if(temp === 1200) {
        isPrimary && setShade('A400')
        !isPrimary && setSecShade('A400')
       }
       if(temp === 1300) {
        isPrimary && setShade('A700')
        !isPrimary && setSecShade('A700')
       }
    }
        
    }
    let x= 100
    let marks = [{value: 50, label:'50'}]
    for(let i = 100; i< 1301; i+=100) {
        if(i< 901) {
            marks.push({value: i, label:`${i}`})
        } else {            
            const v = `A${x}`
            marks.push({value: i, label:`${v}`})    
            x+=100    
        }        
    }  

    
    
    function toggle(e) {
        if(!e.target.value) {
            e.target.classList.add('toggle')    
            props.handleIsDark()        
            e.target.value = true
        } else if(e.target.value) {
            e.target.classList.remove('toggle')
            props.handleIsDark()
           e.target.value = false
           
        
            const email = {email: 'kn728@uowmail.edu.au'}
            fetch("https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/users/colors", {
                method:'POST',
                headers: {"Content-Type":"application/json", "token": userToken},
                body: JSON.stringify(email)
            }).then(res => res.json()).then(data => {
                console.log(data)
                if(!data) {
                    return
                }
                if(data.hasOwnProperty('primary')) {
                    props.handleColor(data.primary)
                    
                }
                if(data.hasOwnProperty('secondary')) {
                    props.handleSecColor(data.secondary)
                }
                
            })
        
    
        }
    }
    const user = useSelector((state => state.user))
    const userToken = useSelector((state => state.token))

    function set() {
        const toSend = {firstName: user.firstName, email: user.email, 
                DOB:user.DOB, role:user.role, primary: props.currColor, secondary: props.secColor }
        console.log(toSend)
                fetch("https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/users/update-details",{
                    method: 'PUT',
                    headers:{"Content-Type":"application/json", "token": userToken},
                    body: JSON.stringify(toSend)
                }).then(res => res.json()).then(data => console.log(data))

    }
    function handleFile() {}


    return ( 
        <div style ={{minHeight:'90vh', width:'100%', backgroundColor:`${props.thirdColor}`}}>
                <div style={{width:'100%', display:'flex', justifyContent:'space-evenly'}}>
                    <Card style={{marginRight: '20px', marginTop:'150px', padding:'30px',
                    marginLeft:'2%',width:'40%', backgroundColor:`${props.secColor}`}}>
                        <Typography variant='h1'> Primary </Typography>
                        <Slider 
                        name='primary'               
                        defaultValue={50}
                        step={null}
                        marks={marks}
                        min= {50}
                        max={1300}                
                        onChange={changeShade}
                        sx={{width: '90%', marginLeft:'50px'}}/> 

                        <Box sx={{height:'250px', width: '200px', flexWrap:'wrap' , display:'flex'}} >
                            {drawColors}              
                        </Box>              
                
                    
                    </Card>
                    <Card style={{marginTop:'150px', width:'45%', padding:'30px',
                    backgroundColor:`${props.secColor}`}}>
                        <Typography variant='h1'> Secondary </Typography>
                            <Slider
                            name='secondary'
                            defaultValue={50}
                            step={null}
                            marks={marks}
                            min= {50}
                            max={1300}                
                            onChange={changeShade}
                            sx={{width: '90%', marginLeft:'50px'}}/> 
                            <Box sx={{height:'250px', width: '200px', flexWrap:'wrap' , display:'flex'}} >
                                {drawSecColors}              
                            </Box>
                    </Card>
                </div>
                <div style={{marginLeft:'5%', marginTop:'20px', display:'flex', alignItems:'center', width:'90%'}}>
                   <div style={{display:'flex', alignItems:'center', marginRight:'auto'}}>
                    <Typography variant='h1' > Dark Mode </Typography>
                    <div style={{ marginLeft:'30px',width: '50px', height:'30px', borderStyle:'solid', borderRadius:'20px', display:'flex', alignItems:'center'}}>
                    <div onClick={toggle} value={false} style={{width: '20px', height:'20px', backgroundColor:'black', borderRadius:'50%', marginLeft:'2px', 
                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}/>
                </div>


                    </div>
                    <Button onClick={set} variant='contained' sx={{backgroundColor: props.secColor}}>Set Colors</Button>

                </div>

         
            </div>
          
              

     );
}

export default Settings;