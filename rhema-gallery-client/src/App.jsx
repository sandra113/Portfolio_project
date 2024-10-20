import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home/Home';
import About from './Components/About/About';
import Library from './Components/Library/Library'; 
import Chat from './Components/Chat/Chat';
import SignUp from './Components/SignUp/SignUp'; 
import Login from './Components/Login/Login';
import Upload from './Components/Upload/Upload'; 
import { useEffect, useState } from "react"; 
import Background from "./Components/Background/Background";
import Navbar from './Components/Navbar/Navbar'; 
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min"
import './App.css'; 
import Hero from './Components/Hero/Hero';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  // State for managing hero background and play status
  const [heroCount, setHeroCount] = useState(0);
  const [playStatus, setPlayStatus] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroCount((prevCount) => (prevCount + 1) % 3); 
    }, 10000); 

    return () => clearInterval(interval); // Cleanup on component unmount
  },);

  return (
    <Router>
      <div className="App">
        <Background playStatus={playStatus} heroCount={heroCount} /> 
        <Navbar />
        <Hero
          setPlayStatus={setPlayStatus}
          heroCount={heroCount}
          setHeroCount={setHeroCount}
          playStatus={playStatus}
        />
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

        <footer>
          <p>&copy; 2024 Rhema Gallery</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;