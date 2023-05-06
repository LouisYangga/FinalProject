import * as React from "react";
import { Card, Typography, Grid, Stack, Item, Button, CardContent, TextField, InputLabel, MenuItem, Select } from "@mui/material";
import {useNavigate, Link} from 'react-router-dom'

const center= {
    alignItems: 'center',
    justifyContent: 'center'
};

/* 
    functonality to show how assigning student to a class
    display would work, once the backend is further developed
    NOTE: not how it will look at the end of project
*/

export default function AssignStudentClass(props) {
    const [classTime, setClassTime] = React.useState('');
    const navigate = useNavigate();

    const handleChange = (event) => {
      setClassTime(event.target.value);
    };

    function handleCancel() {
        navigate("/Teacher/TeacherDashboard")
    }

    return(
        <div className="body" style= {{ marginTop:'120px', height:"100%",width: '100%', padding:'20px', backgroundColor:`${props.thirdColor}`}}>
        <Stack>
            <Stack style={{width:'100%'}}>
                <Typography variant="h4">
                    Assign Student Class
                </Typography>
            </Stack>
            <Stack spacing={3} justifyContent='center' alignItems='center' 
            sx={{marginTop: '10px', width: '100%'}}>
                        
                <TextField id="outlined-basic"  label="id Number" variant="outlined" 
                sx= {{boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25),0px 4px 4px rgba(0, 0, 0, 0.25)', width: '70%', borderRadius:'5px'}}  />
            
                <InputLabel id="class-select-label">Select Class Time</InputLabel>
                <Select
                  labelId="class-select-label"
                  id="class-select"
                  value={classTime}
                  label="Class"
                >
                  <MenuItem value="Monday - 1:30pm">Monday - 1:30pm</MenuItem>
                  <MenuItem value="Tuesday - 1:30pm">Tuesday - 1:30pm</MenuItem>
                  <MenuItem value="Wednesday - 1:30pm">Wednesday - 1:30pm</MenuItem>
                </Select>
                   
                <Stack>
                    <Button variant="contained" onClick={handleCancel}
                        sx={{width: '259px', height: '35px', background: '#6495ED',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: '20px'}}>
                             Cancel
                    </Button>
                    <Button variant="contained"
                        sx={{width: '259px', height: '35px', background: '#6495ED',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: '20px'}}>
                            Update
                    </Button>
                </Stack>   
                    
            </Stack>
        </Stack>
        </div>
    )
    
}