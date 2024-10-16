import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home/Home';
import Library from './Components/Library/Library'; 
import Chat from './Components/Chat/Chat';
import SignUp from './Components/SignUp/SignUp'; 
import Login from './Components/Login/Login'; 
import { useEffect, useState } from "react"; 
import Background from "./Components/Background/Background";
import Navbar from './Components/Navbar/Navbar'; 
import './App.css'; 
import Hero from './Components/Hero/Hero';

function App() {
  // State for managing hero background and play status
  const [heroCount, setHeroCount] = useState(0);
  const [playStatus, setPlayStatus] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroCount((prevCount) => (prevCount + 1)); 
    }, 30000); // Change every 30 seconds

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
          <Route path="/library" element={<Library />} />
          <Route path="/chat" element={<Chat />} />
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