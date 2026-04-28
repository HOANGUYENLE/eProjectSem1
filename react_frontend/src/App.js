import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import LayoutHomePage from './layout/LayoutHomePage';


function App() {
  return (
    <Routes>
      <Route path="/" element={<LayoutHomePage/>}>
        
      
      </Route>
    </Routes>
  );
}

export default App;
