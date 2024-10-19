
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import Axios
import './Library.css';

const Library = () => {
  const [allImage, setAllImage] = useState(null);

  // Fetch PDFs on component mount
  useEffect(() => {
    getPdf();
  }, []);

  const getPdf = async () => {
    try {
      const result = await axios.get("http://localhost:5000/get-files");
      console.log(result.data.data);
      setAllImage(result.data.data); // Store the fetched PDFs
    } catch (error) {
      console.error("Error fetching PDFs:", error);
    }
  };

  const showPdf = (pdf) => {
    const encodedPdf = encodeURIComponent(pdf);
    window.open(`http://localhost:5000/files/${encodedPdf}`, "_blank", "noreferrer");
  }

  return (
    <div className="container">
      <header className='header'>
        <h4>Available Books</h4>
      </header>

      <div className="Booklist">
        <div className="output-div">
          {allImage == null ? "" : allImage.map((data, index) => {
            return (
              <div className="inner-div" key={data.id || index}>
                <h6>Title: {data.title}</h6>
                {/* Display cover image inline */}
                <img src={`http://localhost:5000/covers/${data.image}`} alt={data.title} className="cover-image" />
                <button className="btn btn-primary" onClick={() => showPdf(data.pdf)}> Show PDF </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Library;
