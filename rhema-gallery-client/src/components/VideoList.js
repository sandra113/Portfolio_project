import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoPlayer from './VideoPlayer'; // Adjust the path as necessary

const VideoList = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null); // State for selected video

    const fetchVideos = async () => {
        try {
            const response = await axios.get('/api/sermons/videos');
            setVideos(response.data);
        } catch (error) {
            console.error('Error fetching videos:', error);
            setError('Failed to fetch videos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const handleVideoSelect = (video) => {
        // Set the selected video URL for the player
        setSelectedVideo(`https://www.youtube.com/embed/${video.id.videoId}`);
    };

    return (
        <div>
            <h1>Sermon Videos</h1>
            {selectedVideo ? (  // Check if a video is selected
                <VideoPlayer videoUrl={selectedVideo} />  // Render VideoPlayer
            ) : (
                <ul>
                    {videos.map((video) => (
                        <li key={video.id.videoId}>
                            <h2 onClick={() => handleVideoSelect(video)}>{video.snippet.title}</h2>
                            <p>{video.snippet.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default VideoList;
