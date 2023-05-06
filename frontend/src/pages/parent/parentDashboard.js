import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Card, Typography, Grid, Stack, Item, Button, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from "@mui/material";
import Sidebar from "../../components/sidebar";
import getStripe from "../../services/getStripe";
import { useSelector } from "react-redux";

const center= {
    alignItems: 'center',
    justifyContent: 'center'
};

export default function parentDashboard(props) {
    const [childrens, setChildrens] = useState([]);
    const userToken = useSelector((state => state.token))
    const fetchData = () =>  {
        fetch("https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/users/parent/children/"+props.user.id,{
            method: 'GET',
            headers:{"Content-Type":"application/json", "token" :userToken}
        })
         .then(response => {
            return response.json()
         })
         .then(data => {
            setChildrens(data)
         })
    }

    useEffect(() => {
        fetchData();
    },[])

    const navigate = useNavigate();

    function handleDetailOnClick(child) {
        navigate("/Parent/ChildrenDetails",{state:child})
    }

    function handleSubjectOnClick(child) {
        navigate("/Parent/ChildrenSubject",{state:child})
    }

    async function handleCheckout(child) {
        const stripe = await getStripe();
        const { error } = await stripe.redirectToCheckout({
          lineItems: [
            {
              price: "price_1LqbAbKLRGiGTeMXZd5PrRaZ",
              quantity: 1,
            },
          ],
          mode: 'subscription',
          successUrl: `https://www.wayspace.illawarrathai.org/Parent/PaymentSuccess?email=`+child.email,
          cancelUrl: `https://www.wayspace.illawarrathai.org/Parent/ParentDashboard`,
          customerEmail: child.email
        });
        console.warn(error.message);
    }

    return(
        <div className="childrenList" style = {{minHeight:"90vh", width: "100%", display: 'flex', justifyContent:'center'}}>
            <div className="body" style= {{ marginTop:'120px', height:"100%",width: '100%', padding:'20px'}}>
                <Stack direction='row' style={{width:'100%',marginBottom:'15px'}}>
                    <Typography variant="h4">
                        Dashboard
                    </Typography>
                </Stack>
                <Stack direction="row" sx={{width: "100%"}}>
                    <Stack className="childrenList" sx={{margin:'10px', marginBottom:'20px',width: "100%"}}>
                        <Card sx = {{width: "70%", minHeight: 400}}>
                            <Typography variant="h5">
                                Children List
                            </Typography>
                            {childrens === "No enrolled children" && 
                                <Typography variant="h6">
                                    You don't have any children registered yet
                                </Typography>
                            }
                            {childrens !== "No enrolled children" && 
                                <CardContent>
                                    <TableContainer component={Paper}>
                                        <Table aria-label="Student List" sx={{ minWidth: 650 }}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>ID</TableCell>
                                                    <TableCell align="left">First Name</TableCell>
                                                    <TableCell align="left">Last Name</TableCell>
                                                    <TableCell align="left">Email</TableCell>
                                                    <TableCell align="left">Status</TableCell>
                                                    <TableCell align="left"> </TableCell>
                                                    <TableCell align="left"> </TableCell>
                                                    <TableCell align="left"> </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {childrens.map((children) => (
                                                    <TableRow
                                                        key={children.id}>
                                                        <TableCell component="th" scope="row">
                                                            {children.id}
                                                        </TableCell>
                                                        <TableCell align="left">{children.firstName}</TableCell>
                                                        <TableCell align="left">{children.lastName}</TableCell>
                                                        <TableCell align="left">{children.email}</TableCell>
                                                        {children.hasPaid[0] && 
                                                            <TableCell align="left">Paid</TableCell>
                                                        }
                                                        {!children.hasPaid[0] && 
                                                            <TableCell align="left">
                                                                <Stack direction="row" spacing={2}>
                                                                    <Typography>
                                                                        Not Paid
                                                                    </Typography>
                                                                    <Button variant="contained" sx={{backgroundColor:props.secColor}} onClick={()=> {handleCheckout(children)}}>
                                                                        Pay Fee
                                                                    </Button>
                                                                </Stack>
                                                            </TableCell>
                                                        }
                                                        <TableCell align="left">
                                                            <Button variant="contained" sx={{backgroundColor:props.secColor}} onClick={()=> {handleDetailOnClick(children)}}>
                                                                Details
                                                            </Button>
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Button variant="contained" sx={{backgroundColor:props.secColor}} onClick={()=> {handleSubjectOnClick(children)}}>
                                                                Subjects
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            }
                        </Card>
                    </Stack>
                </Stack>
            </div>
            <div class="sidebar">
                <Sidebar primeColor={props.primeColor} secColor={props.secColor} />
            </div>
        </div>
    )

}