import React from "react"
import { AppBar, Toolbar, Stack, Button, Typography, Card, Grid, Box, Menu, MenuItem } from "@mui/material"
import { blue } from "@mui/material/colors"
import {Link} from 'react-router-dom'

export default function Home(props) {

    const [anchorEl, setAnchorEl] = React.useState(null)

    function handleClose() {
        setAnchorEl(null)
    }

    
    function openMenu(e) {
        setAnchorEl(e.currentTarget)
    }
 

   
    return(
        <div style={{minHeight:'100vh',  width:'100%', display: 'flex', flexDirection:'column', backgroundColor:`${props.thirdColor}`}} className='everything'>            
                <Box sx = {{height:'50vh', width: '100%',  backgroundColor:'white', position:'relative', display: 'flex'}}>
                    <div style={{height:'50vh', width:'55%'}}>
                        <Typography variant='h1' component='h1' sx={{fontFamily: 'Source Code Pro', fontStyle: 'normal', color:'#6495ED', top:'190px', left:'40px', position:'relative', letterSpacing:'0.2em'}}> Its your space </Typography>
                        <Typography variant='h3' component='h3' sx={{fontFamily: 'Source Code Pro', fontStyle: 'normal',color:'#6495ED', top:'190px', left:'40px', position:'relative', letterSpacing:'0.1em'}}> (And, its free)</Typography>
                    </div>                        
                    <div style={{height:'50vh', width:'35%'}}>
                    <div style={{top:'210px', position:'relative', display:'flex', flexDirection:'column'}}> 
                        <Typography variant='h6' component='h6' sx={{letterSpacing:'0.1em', width: '60%'}}> 
                            Make your learning space your own way. Our easy to use templates make it simple to create digestable content for your students.
                        </Typography>

                    <Button variant='contained' 
                      sx= {{
                          height:70,
                          padding: 2,
                          maxWidth:'150px',
                          backgroundColor: '#6495ED'
                      }}
                      onClick={openMenu}
                      >Get Started</Button>
                      <Menu                                             
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                      >
                        <MenuItem sx={{width:'150px'}}  onClick={handleClose}>Teacher</MenuItem>                       
                        <MenuItem sx={{width:'150px'}} onClick={handleClose}>
                          <Link to="/ParentRegister" style={{textDecoration:'none', color:'black'}}>
                            Parent</Link></MenuItem>
                        

                      </Menu>
                      </div>  
                    </div>
                </Box>
                <div style={{position:'relative'}}>
                    <Box sx = {{height:'100%', width: '100%',  backgroundColor:'#6495ED'}}>
                        <Box sx={{height:'50vh', width:'33.33%', backgroundColor: '#26428B'}}></Box>
                        </Box>  
                        <div style={{position: 'absolute', height:'40vh', width:'80%',left: '15%', top:'5vh', display: 'flex'}}>
                        <Box sx={{ backgroundColor:'white', 
                            width: '50%', height:'100%',
                             borderRadius:'20px'}}></Box>
                              <Box sx={{ marginLeft:'100px', width: '800px', height:'100%'}}>
                                <Typography variant='h5' sx={{color:'#606060'}}>Why choose Way Space?</Typography>
                                <Typography variant='h1' sx={{color:'white'}}>Create your own unique eLearning platform</Typography>
                                <Typography variant= 'h5' sx={{marginTop: '20px'}}>At WAKYN, we have tailored built the platform from the ground up for community language schools. 
                                    <br></br><br></br>This gives you the freedom to create online teaching your own way.</Typography>
                              </Box>
                        </div>
                </div>          
        </div>
    )
   
}