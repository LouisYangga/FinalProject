import React,{ useEffect, useState} from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import { Card, Typography, TextField, Grid, Stack, Item, Button, CardContent } from "@mui/material";
import { Box } from "@mui/material";
import { useSelector } from 'react-redux';
const center= {
    alignItems: 'center',
    justifyContent: 'center'
};

/* 
    NOTE: upcoming tasks, attedance and side function (search bar and calendar)
    is not correctly implemented yet
*/

export default function ChildrenSubject(props){
    const location = useLocation();
    const [enrolledSubjectId, setEnrolledSubjectId] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [children, setChildren] = useState(
        {
            id: location.state.id,
            role: location.state.role,
            firstName:location.state.firstName,
            lastName:location.state.lastName,
            email:location.state.email,
            gender:location.state.gender,
            DOB:location.state.DOB,
            street: location.state.street,
            suburb: location.state.suburb,
            city: location.state.city,
            postCode: location.state.postCode
        }
    )
    
    const SubjectZero= ()=> {
        return(
         <Card sx={{height:'60%', width:'300px',
        background: 'rgba(100, 149, 237, 0.51)',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',  marginLeft:'40px',
        borderRadius: '10px', display:'grid', placeItems:'center'}}>
            <Typography variant="h6"> 
            {props.loadSubjects[0]} 
            </Typography></Card>
        )
    }
      
    /*
    if( props.user.enrolledChildrenId.length >0) {
       const p = {id: `${props.user.id}`}
       fetch("http://localhost:5000/api/users/parent/children", {
          headers:{"Content-Type":"application/json", "token": userToken},
          body: JSON.stringify(p)
       }).then(res => res.json())
       .then(data => console.log(data))
    }  */
    
    const userToken = useSelector((state => state.token))


    async function getSubjectName(subjId) {
        let subjList = [];
        for (let i = 0; i < subjId.length; i++) {
            const response = await fetch('https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/subjects/info/'+subjId[i], {
                method: 'GET',
                headers: {"Content-Type":"application/json", "token":userToken}
            });
            const data = await response.json();
            subjList.push(data);
        }
        setSubjects(subjList);
    }

    const getEnrolledSubject = () => {
      fetch('https://ec2-54-86-22-206.compute-1.amazonaws.com:5000/api/users/find/id/'+children.id, {
          method: 'GET',
          headers: {"Content-Type":"application/json", "token":userToken}
      }).then(res => res.json()).then(data => {
          //setEnrolledSubjectId(data.enrolledSubjectId);
          getSubjectName(data.enrolledSubjectId)
      })
    } 

    

    useEffect(() => {
        getEnrolledSubject();
    },[])


    return (
        <div className="parentDashboard" style = {{minHeight:"90vh", width: "70%", display: 'flex', justifyContent:'center', backgroundColor:`${props.thirdColor}`}}>
            <div className="body" style= {{ marginTop:'150px', height:"100%",width: '100%', padding:'20px'}}>
                <Typography variant="h4">
                    Children Subject
                </Typography>
                <div className="subjects" style={{margin:'10px', marginBottom:'20px'}}>
                    <Typography variant="h5">
                        Children : {children.firstName} {children.lastName}
                    </Typography>
                    <div className="subjectContent" >
                        <Stack direction="row" alignItems="center" spacing={3} >
                            {!subjects && 
                            <Typography variant="h6"> 
                                Not enrolled to any subject
                            </Typography>
                            }
                            <Card sx = {{width: 300, height: 300}}>
                            {subjects.map((subject) => (
                                    <Typography variant="h6" key={subject.subjectCode}> 
                                        {subject.subjectName} 
                                    </Typography>
                                )
                            )}
                            </Card>
                        </Stack>
                    </div>
                </div>
            </div> 
            
        </div>
    );
    
}