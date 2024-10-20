import React, { useState, useEffect } from 'react';
import './Home.css'

const Home = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const texts = [
    { id: 1, text: "Your word is a lamp for my feet, a light on my path. Psalm 119:105" },
    { id: 2, text: "Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth. 2 Timothy 2:5" }, 
    { id: 3, text: "This book of the law shall not depart out of thy mouth; but thou shalt meditate therein day and night, that thou mayest observe to do according to all that is written therein: for then thou shalt make thy way prosperous, and then thou shalt have good success. Joshua 1:8" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 15000); 

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [texts.length]);

  return (
    <div className="home-container">
      <h1>{texts[currentTextIndex].text}</h1>
    </div>
  );
};

export default Home;
