import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './Home/Home';
import About from './About/About';
import Library from './Library/Library'; 
import Chat from './Chat/Chat';
import SignUp from './SignUp/SignUp'; 
import Login from './Login/Login';
import Upload from './Upload/Upload'; 
import ProtectedRoute from './ProtectedRoute';
import Navbar from './Navbar/Navbar';

const RoutesComponent = () => {
  const navigate = useNavigate(); 

  const handleLogout = () => {
    sessionStorage.removeItem('token'); // Clear the token
    navigate('/login'); // Redirect to login page
  };

  return (
    <>
    <Navbar onLogout={handleLogout} />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/About" element={<About />} />
      {/* Protect these routes */}
      <Route
        path="/library"
        element={
          <ProtectedRoute>
            <Library />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute> 
            <Chat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <Upload />
          </ProtectedRoute>
        }
      />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
    </Routes>
    </>
  );
};

export default RoutesComponent;
