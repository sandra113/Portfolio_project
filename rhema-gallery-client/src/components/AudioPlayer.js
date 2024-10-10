import React from 'react';

const AudioPlayer = ({ audioUrl }) => {
  return (
    <div>
      <h2>Audio Player</h2>
      <audio controls>
        <source src={audioUrl} type="audio/mpeg" />
        Your browser does not support the audio tag.
      </audio>
    </div>
  );
};

export default AudioPlayer;
