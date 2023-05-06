import React, { useEffect, useState } from "react";
import { Box,Button, Stack,Card } from "@mui/material";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

export default function Sidebar(props) {
    const [value, onChange] = useState(new Date());
    const user = useSelector((state => state.user))
    const nav = useNavigate()
    return(
        <Box
          sx={{
            height:'100%',
            width:'25%',
            position:'absolute',
            flexGrow:1,
            display:'flex',
            flexDirection:'column',
            right:0,
            backgroundColor: '#eee',
            paddingTop:17,
          }}>
            <Box>
                <input style={{padding:"5px",margin:"10px",height:"31px",borderRadius:"5px"}} type="text" placeholder="Search" />
                <Button size="small" variant="contained" startIcon={<SearchIcon />} sx={{backgroundColor: props.secColor}}>
                    Search
                </Button>
            </Box>
            <Stack style={{padding:"12px"}}>
                <Calendar onChange={onChange} value={value} />

                {user && user.role === 'student' &&<Card sx={{height:'119px', width:'92%', marginTop:'5px',borderRadius: '15px', marginTop:'30px',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', display:'flex', justifyContent:'center'}} >
                            <Button sx={{height:'100%', width:'100%', color:'black'}} onClick={(() => nav('/Student/allAnswers'))}>See Submissions</Button></Card> }
            </Stack>

        </Box>
    )
}