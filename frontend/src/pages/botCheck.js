import React from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@mui/material'
export default function BotCheck(props) {
    const nav = useNavigate()
    return(
        <div style={{display: 'grid', placeItems:'center', minHeight:'90vh', width:'100%'}}>
            <h1>Greetings, click below to confirm you are not a bot</h1>
            <Button variant='contained' sx={{backgroundColor:props.primeColor}}onClick={() => nav('/Student/StudentDashboard')}> bot check? </Button>
        </div>
    )
}