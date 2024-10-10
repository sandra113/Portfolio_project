import React from 'react';

const VideoPlayer = ({ videoUrl }) => {
  return (
    <div>
      <h2>Video Player</h2>
      <iframe
        width="560"
        height="315"
        src={videoUrl}
        title="Video Player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
