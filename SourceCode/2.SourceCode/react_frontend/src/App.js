import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import LayoutHomePage from './layout/LayoutHomePage';
import LayoutAdmin from './layout/LayoutAdmin';
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

const myClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={myClient}>
      <UserInfoProvider>
        <Routes>
          <Route path="/" element={<LayoutHomePage/>}>
            <Route path="FAQ" element={<HomepageFAQ/>}/>
            <Route path="signup" element={<Register/>}/>
            <Route path="userInfo" element={<Profile/>}/>
          </Route>

          <Route path="/admin" element={<LayoutAdmin/>}>
            <Route index element={<AdminDashboard/>}/>
            <Route path="lawyerManagement" element={<AdminLawyerManagement/>}/>
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
