import * as React from "react"
import { AppBar, Toolbar, Stack, Button, Typography, MenuItem, Menu, Avatar, Divider, ListItemIcon, Tooltip, IconButton} from "@mui/material"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Settings, Logout } from '@mui/icons-material';
import { styled } from '@mui/system'
import logoBlue from '../pictures/logoBlue.png'
import logoWhite from '../pictures/logoWhite.png'
import {useNavigate, Link} from 'react-router-dom'
import { useSelector } from "react-redux";
import user from "../redux/features/user";


//basic themes, will be customisable in future iterations


export default function Navbar2(props) {
  const theme = createTheme({
    status: {
      danger: '#e53e3e',
    },
    palette: {    
      neutral: {
        main: 'white',      
        contrastText: '#6495ED',
      }, 
      getStarted: {
        main: '#6495ED',
        contrastText: '#fff'
      }  
    },
  });
  
  const [anchorEl, setAnchorEl] = React.useState(null)

  function handleClose() {
    setAnchorEl(null)
  }

  function handleParentClose() {
    props.handlePage("ParentRegister")
    setAnchorEl(null)    
  }

  function handleClick(e) {
    setAnchorEl(e.currentTarget)
  }

 
  let prime = 'neutral'
  let sec = 'getStarted'
  let logo = logoWhite
  if(window.location.href !== 'http://localhost:3000/') {
     prime = 'getStarted'
     sec ='neutral'
  }

    const navigate = useNavigate();
    function changePage(e) {
      const x= e.target.value
      console.log(x);
      if(x ==="Login") {navigate("/Login")}
      if (x === 'userDetails') {navigate("/UserDetails")}
      if (x === 'settings') {navigate("/Settings")}
      if(x === 'regParent') {navigate("/ParentRegister")}
      /*Parent */
      if (x === "regStudent") {navigate("/Parent/parentRegStudent")}
      /*Teacher */
      if(x === 'assignStudent') {navigate("/Teacher/AssignStudent")}
      if (x === 'teacherStudentList') {navigate("/Teacher/StudentList")}
      if(x=== 'createSubject'){navigate('/Teacher/createSubject')}
      /*Admin */
      if(x === 'adminStudentList') {navigate("/Admin/StudentList")}
      if(x === 'teacherList') {navigate("/Admin/TeacherList")}
      if(x === 'regTeacher') {navigate("/Admin/TeacherRegister")}
      if(x === 'userList') {navigate("/Admin/UserList")}
      if(x === 'logOut') {
        props.handleColor('#6495ED')
        props.handleSecColor('#fff')
        props.handleLogo(logoWhite)
        navigate("/")

        props.userIs()
      }
    }  
    const user= useSelector((state => state.user))
    function goHome() {
      if(user) {
        const x = user.role
        if(x === 'student') {navigate("/Student/StudentDashboard")}
        if(x === 'parent') {navigate("/Parent/ParentDashboard")}
        if(x === 'teacher') {navigate("/Teacher/TeacherDashboard")}
        if(x === 'admin') {navigate("/Admin/AdminDashboard")}
       } else {
        navigate("/")
       }

    }
    
    const Logo = () => {
      return (
      
          <img src ={props.logo}  style={{height:props.user ?'80px':'', width: props.user ? "176px":''}} onClick={goHome}/>  
       
      )}
    

  return (
      <ThemeProvider theme={theme}>        
          <AppBar position = 'fixed' sx={{backgroundColor: props.primeColor}}>
              <Toolbar>
                  <Typography sx= {{
                      flexGrow: 1,
                      padding: 2,
                  }}>
                  <Logo />  
                  </Typography>  
                  <Stack direction='row' spacing ={2}>
                  
                  { !props.user && 
                    <Button color='inherit' value="Login" className ="navAnimate" 
                      onClick={changePage}
                    >Log in
                    </Button> 
                  }
                      
                  {/*Parent menu */}
                  {props.user != null && props.user.role === "parent" && 
                    <Stack direction="row" spacing={2}>                  
                      <Button color='inherit'
                       sx= {{height:'70px',
                       padding: 2,
                       width:'190px' }}
                          value="regStudent" 
                          onClick={changePage}                   
                          >Register Children 
                      </Button>
                    </Stack> }
                     
                  {/*Teacher menu */}
                  {props.user != null && props.user.role === "teacher" && 
                  <Stack direction="row" spacing={2}>
                       <Button color='inherit'
                        sx= {{height:'70px',
                          padding: 2,
                          width:'150px'
                          }}                     
                        value="createSubject" 
                        onClick= {changePage}                   
                        >Create Subject 
                      </Button>
                      <Button color='inherit'
                        sx= {{height:'70px',
                          padding: 2,
                          width:'150px'
                          }}                     
                        value="teacherStudentList" 
                        onClick= {changePage}                   
                        >Student List 
                      </Button>
                    </Stack>
                    }

                    {/*Admin menu */}
                    {props.user != null && props.user.role === "admin" && 
                    <Stack direction="row" spacing={2}>
                      <Button color='inherit'
                        sx= {{height:'70px',
                          padding: 1,
                          width:'150px'
                          }}                     
                        value="adminStudentList" 
                        onClick= {changePage}                   
                        >Student List
                      </Button>
                      <Button color='inherit'
                        sx= {{height:'70px',
                          padding: 1,
                          width:'150px'
                          }}                     
                        value="userList" 
                        onClick= {changePage}                   
                        >User List
                      </Button>
                      <Button color='inherit'
                        sx= {{height:'70px',
                          padding: 1,
                          width:'150px'
                          }}                     
                        value="teacherList"
                        onClick= {changePage}                   
                        >Teacher List
                      </Button>
                    </Stack>}

                    {/*Home menu */}
                    { !props.user && 
                      <Button variant='contained' color={sec}
                        sx= {{
                          height:'70px',
                          padding: 2,
                          width:'150px',                        
                        }}
                        onClick={changePage}
                        className="navAnimate"
                        value="regParent"
                        >Get Started
                      </Button>
                    }

                  {/*Account tooltip menu */}
                  {props.user && 
                      <Tooltip title="Account settings">
                        <IconButton
                          onClick={handleClick}
                          size="large"
                          sx={{ ml: 2 }}
                          aria-controls={open ? 'account-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? 'true' : undefined}
                        >
                          <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
                        </IconButton>
                      </Tooltip>
                    }
                    <Menu
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        onClick={handleClose}
                      >
                        <MenuItem>
                          <Button value="userDetails" onClick={changePage}>
                            <Avatar /> My account
                          </Button>
                        </MenuItem>
                        <Divider />
                        {props.user && props.user.role === "admin" && 
                          <MenuItem>
                            <Button value="settings" onClick={changePage}>
                              <ListItemIcon>
                                <Settings fontSize="small" />
                              </ListItemIcon>
                              Settings
                            </Button>
                          </MenuItem>
                        }
                        <MenuItem>
                          <Button value="logOut" onClick={changePage}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                              </ListItemIcon>
                              Logout
                          </Button>
                        </MenuItem>  
                      </Menu>
                  </Stack>       
              </Toolbar>
              
          </AppBar>
      </ThemeProvider>
  )

}