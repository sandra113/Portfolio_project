// src/App.jsx
import { BrowserRouter as Router } from 'react-router-dom';
import { useEffect, useState } from "react"; 
import Background from "./Components/Background/Background";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import './App.css'; 
import Hero from './Components/Hero/Hero';
import RoutesComponent from './Components/RoutesComponent'; // Import new RoutesComponent

function App() {
  // State for managing hero background and play status
  const [heroCount, setHeroCount] = useState(0);
  const [playStatus, setPlayStatus] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroCount((prevCount) => (prevCount + 1) % 3); 
    }, 10000); 

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <Router>
      <div className="App">
        <Background playStatus={playStatus} heroCount={heroCount} /> 
        <Hero
          setPlayStatus={setPlayStatus}
          heroCount={heroCount}
          setHeroCount={setHeroCount}
          playStatus={playStatus}
        />
        <RoutesComponent /> 

        <footer>
          <p>&copy; 2024 Rhema Gallery</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
