import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Box, Card, Typography, TextField, Grid, Stack, Item, Button, CardContent, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import getStripe from "../../services/getStripe";
import { useSelector } from "react-redux";

export default function ParentRegStudent(props) {
    const navigate = useNavigate();
    //modal handler
    const [open, setOpen] = useState(false)
    const [registeredChildren, setRegisteredChildren] = useState([])
    const [student, setStudent] = React.useState(
        {
            role: "student",
            firstName:"",
            lastName:"",
            email:"",
            password:"",
            gender:"",
            DOB:"",
            parentId: `${props.user.id}`
        }
    )

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

    

    const shadow="0px 4px 4px rgba(0, 0, 0, 0.25),0px 4px 4px rgba(0, 0, 0, 0.25)"
    const userToken = useSelector((state => state.token))
    
  
    const child = student;
    function register() {
        fetch(" https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/users/", {
            method: 'POST',
            headers:{"Content-Type":"application/json", "token": userToken },
            body: JSON.stringify(child)
        }).then(res => res.json())
        .then(data => {
            setRegisteredChildren(data)
            console.log(data)
        })
        setOpen(true);
    }

    async function handleCheckout() {
        const stripe = await getStripe();
        const { error } = await stripe.redirectToCheckout({
          lineItems: [
            {
              price: "price_1LqbAbKLRGiGTeMXZd5PrRaZ",
              quantity: 1,
            },
          ],
          mode: 'subscription',
          successUrl: `https://www.wayspace.illawarrathai.org//Parent/PaymentSuccess?email=`+registeredChildren.email,
          cancelUrl: `https://www.wayspace.illawarrathai.org//Parent/ParentDashboard`,
          customerEmail: registeredChildren.email,
        });
        console.warn(error.message);
    }

    function handleClose() {
        navigate("/Parent/ParentDashboard")
    }

    function handleFirstName(e) {setStudent(prev => 
        {return {...prev, firstName: e.target.value}})}
    function handleLastName(e) {setStudent(prev => 
        {return {...prev, lastName: e.target.value}})}
    function handleDOB(e) {setStudent(prev => 
        {return {...prev, DOB: e.target.value}})}
    function handleEmail(e) {setStudent(prev => 
    {return {...prev, email: e.target.value}})}
    function handlePassword(e) {setStudent(prev => 
        {return {...prev, password: e.target.value}})}
    function handleGender(e) {setStudent(prev =>
        {return {...prev, gender: e.target.value}})        
    }


    return(
        <div className="regStudent" style = {{minHeight:"90vh", width: "100%",  display: 'flex', justifyContent:'center', marginTop:'150px'}}>
            <Card style={{backgroundColor: 'white', width: '95%', height: '100%', marginTop: "2%",
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: '30px'
            }}>
                <Typography variant="h4" sx={{ textAlign: 'center' }} >
                    Register Student
                </Typography>
                
                <Stack spacing={2} justifyContent='left' alignItems='left' 
                    sx={{margin: '20px', width: '100%'}}>
                    <div>
                        <TextField id="outlined-basic" label="First name" variant="outlined" onChange={handleFirstName}/>
                        <TextField id="outlined-basic" label="Last name" variant="outlined" onChange={handleLastName}/>
                        <TextField id="outlined-basic" label="Date of birth" variant="outlined" onChange={handleDOB} />
                    </div>
                    <div>
                        <FormLabel>Gender</FormLabel>
                        <RadioGroup row name="gender-radio-buttons-group" onChange={handleGender}>
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                            <FormControlLabel value="other" control={<Radio />} label="Other" />
                        </RadioGroup>
                    </div>
                    
                        <TextField id="outlined-basic" label="Email" variant="outlined" onChange={handleEmail}/>    
                    
                    <TextField id="outlined-basic" label="School" variant="outlined" />
                    <TextField id="outlined-basic" label="Password" type='password' variant="outlined" onChange={handlePassword}/>

                    <Button variant="contained" sx={{backgroundColor:props.secColor,width:'70%', marginTop:'15px'}} onClick={register}> Register</Button>           
                    <Modal
                          open={open}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                        <Box sx={style}>
                          <Typography id="modal-modal-title" variant="h6" component="h2">
                            Children is registered, do you want to pay the fee now?
                          </Typography>
                          <Button variant="contained" sx={{backgroundColor:props.secColor}} onClick={handleCheckout}>Pay Now</Button>
                          <Button variant="outlined" sx={{borderColor: props.secColor, color:props.secColor}} onClick={handleClose}>Later</Button>
                        </Box>
                    </Modal>
                </Stack>
                
                
            </Card>
        </div>
    );

}