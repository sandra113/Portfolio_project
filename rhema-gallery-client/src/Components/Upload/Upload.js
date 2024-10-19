import { useState } from "react";
import axios from "axios";
import "./Upload.css";

function Upload() {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [coverImage, setCoverImage] = useState(null);

    const submitImage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("file", file);
        formData.append("coverImage", coverImage);
        
        // Check if title and file are set correctly
        console.log("Title:", title);
        console.log("File:", file);
        console.log("Cover Image:", coverImage);

        try {
            const result = await axios.post("http://localhost:5000/upload-files", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log(result);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    return (
        <div className="Upload">
            <form className="formStyle" onSubmit={submitImage}>
                <h4>Upload File</h4>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Title" 
                    required
                    onChange={(e) => setTitle(e.target.value)}
                />
                <br/>
                <input 
                    type="file" 
                    className="form-control" 
                    accept="application/pdf" 
                    required
                    onChange={(e) => setFile(e.target.files[0])} 
                />
                <br/>
                <label htmlFor="coverImage">Choose Cover Photo:</label>
                <input 
                    type="file" 
                    id="coverImage"
                    className="form-control" 
                    accept="image/*"
                    required
                    onChange={(e) => setCoverImage(e.target.files[0])} 
                />
                <br/>

                <button className="btn btn-primary" type="submit">Submit</button>
            </form>
        </div>
    );
}

export default Upload;
