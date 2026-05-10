import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import LayoutHomePage from './layout/LayoutHomePage';
import LayoutAdmin from './layout/LayoutAdmin';
import LawyerProfile from './layout/part/homepage/LawyerProfile';
import AdminDashboard from './adminRelatedPage/dashboard';
import "./chartConfig";
import AdminLawyerManagement from './adminRelatedPage/lawyerManagement';
import AdminUserManagement from './adminRelatedPage/userManagement';
import AdminAppointment from './adminRelatedPage/appointmentOversight';
import FAQManagement from './adminRelatedPage/FAQManagement';
import SystemNotification from './adminRelatedPage/SystemNotification';
import HomepageFAQ from './Customer/FAQ';
import Register from './Auth/Register';
import UserInfoProvider from './context/UserContext';
import Profile from './layout/Profile';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomepageIndex from './layout/part/homepage/Index';
import AdminProtection from './protectComponent/AdminProtection';
import LawyerList from './Customer/LawyerList';
import Login from './Auth/Login';
import 'bootstrap-icons/font/bootstrap-icons.css';
import News from './Customer/News';
import AppointmentStatus from './appointment/AppointmentStatus';
import Reschedule from './appointment/Reschedule';
import AppointmentPage from './appointment/AppointmentPage';

const myClient = new QueryClient();

function App() {
  //<Route index element={<AdminDashboard/>}/>
  return (
    <QueryClientProvider client={myClient}>
      <UserInfoProvider>
        <Routes>
          <Route path="/" element={<LayoutHomePage/>}>
            <Route index element={<HomepageIndex/>}/>
            <Route path="FAQ" element={<HomepageFAQ/>}/>
            <Route path="signup" element={<Register/>}/>
            <Route path="login" element={<Login/>}/>
            <Route path="userInfo" element={<Profile/>}/>
            <Route path="ListOfLawyer/:city?" element = {<LawyerList/>}/>
            <Route path="lawyerProfile/:id" element = {<LawyerProfile/>}/>
            <Route path="News" element = {<News/>}/>
            <Route path="myAppointment" element={<AppointmentStatus/>}/>
            <Route path="reschedule/:appointmentID" element={<Reschedule/>}/>
            <Route path="registerAppointment/:lawyerID" element={<AppointmentPage/>}/>
          </Route>

          <Route path="/admin" element={<AdminProtection><LayoutAdmin/></AdminProtection>}>
            <Route index element={<AdminLawyerManagement/>}/>
            <Route path="userManagement" element={<AdminUserManagement/>}/>
            <Route path="appointmentOversight" element={<AdminAppointment/>}/>
            <Route path="FAQManagement" element={<FAQManagement/>}/>
            <Route path="SystemNotification" element={<SystemNotification/>}/>
          </Route>
        </Routes>
      </UserInfoProvider>
    </QueryClientProvider>
  );
}

export default App;
