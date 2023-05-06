import './App.css';
import React from 'react'
import Navbar from "./components/Navbar"
import Home from './pages/home'
import Login from './pages/login'
import UserDetails from './pages/userDetails';
import ParentRegister from './pages/ParentRegister';
import Footer from './components/footer';
import ParentDashboard from './pages/parent/parentDashboard';
import ParentRegStudent from './pages/parent/parentRegStudent';
import PaymentSuccess from './pages/parent/paymentSuccess';
import ChildrenSubject from './pages/parent/childrenSubject.js';
import ChildrenDetails from './pages/parent/childrenDetails';
import StudentDashboard from './pages/student/studentDashboard';
import AdminDashboard from './pages/admin/adminDashboard';
import TeacherList from './pages/admin/teacherList';
import TeacherDetails from './pages/admin/teacherDetails';
import AdminStudentList from './pages/admin/studentList';
import AdminStudentDetails from './pages/admin/studentDetails';
import TeacherRegister from './pages/admin/teacherRegister';
import TeacherDashboard from './pages/teacher/teacherDashboard';
import AssignStudentClass from './pages/teacher/assignStudentClass';
import EnrolStudent from './pages/teacher/enrolStudent';
import StudentList from './pages/teacher/StudentLists';
import StudentDetails from './pages/teacher/studentDetails';
import UsersList from './pages/admin/usersList';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Settings from './pages/Settings';
import MakeClasses from './pages/teacher/makeClasses';
import CreateSubject from './pages/teacher/createSubject';
import ViewVideo from './pages/student/activities/viewVideo';
import DragAndDrop from './pages/student/activities/dragAndDrop';
import SubjectHandler from './pages/teacher/subjectHandler';
import Translate from './pages/student/activities/translate'
import StudentProfile from './pages/teacher/StudentProfile';
import FileUploader from './pages/teacher/FileUploader';
import DownFile from './pages/student/activities/downFile';
import AudioDown from './pages/student/activities/audioDownload';
import AllAnswers from './pages/student/seeAnswers';
import BotCheck from './pages/botCheck';
import ImageDown from './pages/student/activities/imageDownload';
const primeFromLocalStorage = JSON.parse(sessionStorage.getItem('prime'))
const secFromLocalStorage = JSON.parse(sessionStorage.getItem('sec')) 
import logoWhite from './pictures/logoWhite.png'
import ForgotPassword from './pages/forgotPassword';

function App() {
  const [checkPage, setPage] = React.useState("")
  const [currUser, changeUser] = React.useState()
  const [isStu, setStu] = React.useState(false)
  const [isPar, setPar] = React.useState(false)
  const [isTeach, setTeach] = React.useState(true)
  const [primeColor, setPrimeColor] = React.useState('#6495ED')
  const [secColor, setSecColor] = React.useState('#fff')
  const [thirdColor, setThirdColor] = React.useState('#fff')
  const [isDark, setIsDark] = React.useState(true)
  const [isHome, setIsHome] = React.useState(false)
  const [logo, setLogo] = React.useState(logoWhite)
 //checks which user is logged



 React.useEffect(() => {
    sessionStorage.setItem('prime', JSON.stringify(primeColor))
    sessionStorage.setItem('sec', JSON.stringify(secColor))
   
 }, [primeColor, secColor])

 
 const setUser = (data) =>
  {
    changeUser(data)
    if(data === null) {
      setStu(false)
      setPar(false)
      setTeach(false)
    }
    if(data.role ==='student') {
      setStu(true)
      setPar(false)
      setTeach(false)
    }
    if(data.role ==='parent') {
      setStu(false)
      setPar(true)
      setTeach(false)
    }
    if(data.role ==='teacher') {
      setStu(false)
      setPar(false)
      setTeach(true)
    }
  }
  const pathname = window.location.pathname
  const [currPath, setCurrPath] = React.useState(pathname)
  React.useEffect(() => {
    setCurrPath(pathname)
 })

  let test 
  React.useEffect(() => {
    console.log(currPath)
  })
  

/*
  This is just a temporary to display how subject should look
*/
const subjects = ["thai grammar", "thai math", "thai spelling", "thai writing" ]
const student = {};
/*
end of temporary data
*/
 
function changeIsDark() {
  setIsDark(prev => !prev)
  if (isDark) {
    setPrimeColor('#26428B')
    setSecColor('#797979')
    setThirdColor('#282828')
  }
  else {
    setPrimeColor('#fff')
    setSecColor('#fff')
    setThirdColor('#fff')
  }
}



  return(
     <Router>
         <Routes>
           {/*starting path */}
           <Route path="/" element={<Home />}></Route>
           <Route path="/Login" element={<Login userIs = {setUser}  handleLogo={(data) => setLogo(data)} handleColor= {(data) => setPrimeColor(data)}  handleSecColor= {(data) => setSecColor(data)}
              user={currUser} primeColor={primeColor} secColor={secColor} thirdColor={thirdColor}/> }></Route>
           <Route path="/forgotPassword" element={<ForgotPassword  primeColor={primeColor} secColor={secColor} thirdColor={thirdColor}/>}></Route>

           <Route path="/ParentRegister" element={<ParentRegister userIs = {setUser} user={currUser}  primeColor={primeColor} secColor={secColor} thirdColor={thirdColor}/>}></Route>
           <Route path="/UserDetails" element={<UserDetails user= {currUser} primeColor={primeColor} secColor={secColor} thirdColor={thirdColor}/> }></Route>
           
           {/*parent path */}
           {isPar && <Route path="/Parent/ParentDashboard" element={<ParentDashboard user= {currUser} primeColor={primeColor} secColor={secColor} thirdColor={thirdColor}/> }></Route>}
           {isPar && <Route path="/Parent/parentRegStudent" element={<ParentRegStudent user={currUser} primeColor={primeColor} secColor={secColor}/>}></Route>}
           <Route path="/Parent/ChildrenSubject" element={<ChildrenSubject user={currUser} primeColor={primeColor} secColor={secColor}/>}></Route>
           <Route path="/Parent/ChildrenDetails" element={<ChildrenDetails user={currUser} primeColor={primeColor} secColor={secColor}/>}></Route>
           <Route path="/Parent/PaymentSuccess" element={<PaymentSuccess user={currUser} primeColor={primeColor} secColor={secColor}/>}></Route>

           {/*student path */}
           {isStu && <Route path="/Student/StudentDashboard" element={<StudentDashboard user={currUser} loadSubjects = {subjects} primeColor={primeColor} secColor={secColor} thirdColor={thirdColor}/>}></Route>}
           {isStu && <Route path="/Student/ViewVideo" element={<ViewVideo user={currUser} primeColor={primeColor} secColor={secColor} thirdColor={thirdColor}/>}></Route>}
          {isStu && <Route path="/Student/matchTheWords" element={<DragAndDrop user={currUser} primeColor={primeColor} secColor={secColor} thirdColor={thirdColor}/>}></Route> }
           {isStu && <Route path="/Student/translate" element={<Translate user={currUser} primeColor={primeColor} secColor={secColor} thirdColor={thirdColor}/>}></Route>}
           {isStu && <Route path="/Student/downloadFile" element={<DownFile user={currUser} primeColor={primeColor} secColor={secColor} thirdColor={thirdColor}/>}></Route>}
           {isStu && <Route path="/Student/downloadAudio" element={<AudioDown user={currUser} primeColor={primeColor} secColor={secColor} thirdColor={thirdColor}/>}></Route>}
           {isStu && <Route path="/Student/allAnswers" element={<AllAnswers user={currUser} primeColor={primeColor} secColor={secColor} thirdColor={thirdColor}/>}></Route>}
           {isStu && <Route path="/Student/imageDown" element={<ImageDown user={currUser} primeColor={primeColor} secColor={secColor} thirdColor={thirdColor}/>}></Route>}

           {/*teacher path */}
           {isTeach && <Route path="/Teacher/TeacherDashboard" element={<TeacherDashboard loadSubjects = {subjects} primeColor={primeColor} secColor={secColor} thirdColor={thirdColor}/>}></Route>}
           {isTeach && <Route path="/Teacher/AssignStudent" element={<AssignStudentClass primeColor={primeColor} secColor={secColor} thirdColor={thirdColor}/>}></Route>}
           {isTeach && <Route path="/Teacher/StudentDetails" element={<StudentDetails primeColor={primeColor} secColor={secColor} thirdColor={thirdColor}/>}></Route>}
           <Route path="/Teacher/EnrolStudent" element={<EnrolStudent primeColor={primeColor} secColor={secColor} thirdColor={thirdColor}/>}></Route>
           <Route path="/Teacher/StudentList" element={<StudentList primeColor={primeColor} secColor={secColor} thirdColor={thirdColor}/>}></Route>
           <Route path="/Teacher/makeClasses" element={<MakeClasses primeColor={primeColor} secColor={secColor} thirdColor={thirdColor}/>}></Route>
           <Route path="/Teacher/createSubject" element={<CreateSubject primeColor={primeColor} secColor={secColor} thirdColor={thirdColor}/>}></Route> 
           {isTeach && <Route path="/Teacher/subject" element={<SubjectHandler primeColor={primeColor} secColor={secColor} thirdColor={thirdColor}/>}></Route>}
           {isTeach && <Route path="/Teacher/stuProfile" element={<StudentProfile primeColor={primeColor} secColor={secColor} thirdColor={thirdColor}/>}></Route>}
           {isTeach && <Route path="/Teacher/custom-content" element={<FileUploader primeColor={primeColor} secColor={secColor} thirdColor={thirdColor}/>}></Route>}


           <Route path="/Teacher/enrolStudent" element={<EnrolStudent primeColor={primeColor} secColor={secColor} thirdColor={thirdColor}/>}></Route>
           
           {/*admin path */}
           <Route path="/Admin/AdminDashboard" element={<AdminDashboard loadSubjects = {subjects} primeColor={primeColor} secColor={secColor}  thirdColor={thirdColor}/>}></Route>
           <Route path="/Admin/TeacherList" element={<TeacherList primeColor={primeColor} secColor={secColor} thirdColor={thirdColor}/>}></Route>
           <Route path="/Admin/TeacherList/RegisterTeacher" element={<TeacherRegister user={currUser} primeColor={primeColor} secColor={secColor}thirdColor={thirdColor}/>}></Route> 
           <Route path="/Admin/TeacherDetails" element={<TeacherDetails primeColor={primeColor} secColor={secColor} thirdColor={thirdColor}/>}></Route>
           <Route path="/Admin/UserList" element={<UsersList primeColor={primeColor} secColor={secColor} thirdColor={thirdColor}/>}></Route>
           <Route path="/Admin/StudentList" element={<AdminStudentList primeColor={primeColor} secColor={secColor} thirdColor={thirdColor}/>}></Route>
           <Route path="/Admin/StudentDetails" element={<AdminStudentDetails primeColor={primeColor} secColor={secColor} thirdColor={thirdColor}/>}></Route>
           <Route path="/Settings" element={<Settings handleColor= {(data) => setPrimeColor(data)} 
               handleSecColor={(data)  => setSecColor(data)}
               thirdColor = {thirdColor}
               secColor= {secColor}
               currColor={primeColor}
               handleThird={(data) => setThirdColor(data)}
               handleIsDark={() => changeIsDark()}
               />}
               
               ></Route>
              <Route path="/botCheck" element={<BotCheck thirdColor={thirdColor}/>}></Route>

        </Routes>
        <Navbar handlePage = {(page) => setPage(page)} 
          userIs = {setUser} user={currUser} primeColor={primeColor} secColor={secColor} logo={logo}
          handleColor= {(data) => setPrimeColor(data)}
          handleSecColor={(data)  => setSecColor(data)}
          handleLogo={(data) => setLogo(data)}
          />
          
        <Footer primeColor={primeColor} secColor={secColor}/>
    </Router>
  ) 

}


export default App;