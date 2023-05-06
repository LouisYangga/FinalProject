import React, {useState, useEffect} from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Modal, Card, Typography, Grid, Stack, Item, Button, Box, CardContent, Paper} from "@mui/material";
import { loadStripe } from '@stripe/stripe-js';
import getStripe from "../../services/getStripe";
import { useSelector } from "react-redux";

export default function PaymentSuccess() {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
    };

    const [open, setOpen] = useState(true);
    const [childrenId, setChildrenId] = useState();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const navigate = useNavigate();

    function handleBack() {
        navigate("/Parent/ParentDashboard");
    }

    function verifyChildren(id){
        fetch("https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/users/update-status",{
            method: 'PUT',
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({"studentId": id, "status": "true"})
        })
         .then(response => {
            console.log("Children verified")
            return response.json()
        })
    }
    const userToken = useSelector((state => state.token))
    function getChildrenId(email) {
        fetch('https://lec2-54-86-22-206.compute-1.amazonaws.com:5000/api/users/find/email/'+email, {
            method: 'GET',
            headers: {"Content-Type":"application/json", "token": userToken}
        }).then(res => res.json()).then(data => {
            console.log(data.id);
            verifyChildren(data.id);
        })
    }

    function getEmail() {
        const email = searchParams.get("email");
        console.log("email - "+email);
        getChildrenId(email);
    }

    useEffect(() => {
        getEmail();
    },[])

    
    
    return (
        <Modal
          open={open}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
            <Box sx = {style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Payment Successful
              </Typography>
                <Stack direction='row' spacing={1}>
                    <Button variant="contained" onClick={handleBack}>Back to dashboard</Button>
                </Stack>
            </Box>
        </Modal>
        
    )
}