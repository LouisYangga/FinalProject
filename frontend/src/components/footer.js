import React, { useEffect } from "react";
import { AppBar, Toolbar, Stack, Button, Typography, Card, Grid, Box, Menu, MenuItem } from "@mui/material"

export default function Footer(props) {
    const [anchorEl, setAnchorEl] = React.useState(null)

    function handleClose() {
        setAnchorEl(null)
    }

    
    function openMenu(e) {
        setAnchorEl(e.currentTarget)
    }
 
    
    return (
        <Box style={{height: '300px', width: '100%', backgroundColor: `${props.secColor}`}}>
            
            <Button variant='contained' 
                      sx= {{
                        marginLeft:'30px',
                        marginTop:'30px',
                        height:70,
                          padding: 2,
                          width:'250px',
                          backgroundColor: `${props.primeColor}`
                      }}
                      onClick={openMenu}
                      >English</Button>
                      <Menu                                             
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                      >
                        <MenuItem sx={{width:'250px'}}  onClick={handleClose}>thai</MenuItem>                       
                        
                         
                        

                      </Menu>
            
        </Box>
    )
}
