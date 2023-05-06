import React from "react"
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Stack, Button, Typography, Box, Avatar, Menu, MenuItem, ListItemIcon, Tooltip, Divider, IconButton} from "@mui/material"
import { PersonAdd, Settings, Logout } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system'
import logoWhite from '../pictures/logoWhite.png'

/*This file is redunandant, will keep it here just in case */


const theme = createTheme({
  status: {
    danger: '#e53e3e',
  },
  palette: {    
    neutral: {
      main: '#6495ED',      
      contrastText: '#fff',
    }, 
    getStarted: {
      main: 'white',
      contrastText: '#6495ED'
    }  
  },
});


export default function NavbarLoggedin() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
        <ThemeProvider theme={theme}>        
            <AppBar position = 'static' color='neutral'>
                <Toolbar>
                    <Typography sx= {{
                        flexGrow: 1,
                        padding: 2,
                    }}>
                    <img src ={logoWhite} sx ={{ mr: "auto" }}/>  
                    </Typography>  
                    <Stack direction='row' spacing ={2}>
                        <Button color='inherit'>Menu</Button>    
                        <Button color='inherit'>Menu</Button>
                        <Button color='inherit'>Menu</Button>
                        
                        <Tooltip title="Account settings">
                          <IconButton
                            onClick={handleClick}
                            size="small"
                            sx={{ ml: 2 }}
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                          >
                            <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
                          </IconButton>
                        </Tooltip>
                      </Stack>  
                      <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        PaperProps={{
                          elevation: 0,
                          sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                              width: 32,
                              height: 32,
                              ml: -0.5,
                              mr: 1,
                            },
                            '&:before': {
                              content: '""',
                              display: 'block',
                              position: 'absolute',
                              top: 0,
                              right: 14,
                              width: 10,
                              height: 10,
                              bgcolor: 'background.paper',
                              transform: 'translateY(-50%) rotate(45deg)',
                              zIndex: 0,
                            },
                          },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      >
                        <MenuItem>
                          <Avatar /> My account
                        </MenuItem>
                        <Divider />
                        <MenuItem>
                          <ListItemIcon>
                            <Settings fontSize="small" />
                          </ListItemIcon>
                          Settings
                        </MenuItem>
                        <MenuItem data-my-value={"logout"}>
                          <ListItemIcon>
                            <Logout fontSize="small" />
                          </ListItemIcon>
                          Logout
                        </MenuItem>
                      </Menu>     
                  </Toolbar>                
            </AppBar>
        </ThemeProvider>
    )
}

