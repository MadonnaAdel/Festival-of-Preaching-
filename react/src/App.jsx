import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/loginAdmin';
import AdminPage from './pages/adminPage';
import './App.css';
import UserPage from './pages/userPage';
import ProtectedRoute from './Guards/guard';

function App() {
  return (
    <Router>
      <div >
         <h3>❤كنيسة السيدة العذراء مريم بمنفلوط❤</h3>

         <Link to="/login">
        <img
          src="WhatsApp Image 2024-08-16 at 16.32.30_3060410b.jpg"
          alt="Login"
          width="300px"
          />
          </Link>
        <Routes>
          <Route path="/" element={<UserPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/adminPage" element={<ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>} />
        </Routes>
<h6 className='text-start mt-5'>
    Developed by: 
  
    <a href="https://www.facebook.com/madonna.adel.9026/"  target='_blank' className='text-decoration-none text-dark fw-semibold fs-4'>
        Madonna Adel
    </a>
</h6>
      </div>
    </Router>
    
  );
}

export default App;
