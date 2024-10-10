import React, { useEffect, useState } from 'react';
import VideoPlayer from './VideoPlayer';
import AudioPlayer from './AudioPlayer';
import './Library.css';

const Library = () => {
  const [sermons, setSermons] = useState([]);
  const [songs, setSongs] = useState([]);
  const [books, setBooks] = useState([]);
  const [category, setCategory] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [youtubeVideos, setYoutubeVideos] = useState([]); // State for YouTube videos

  // Fetch all sermons, songs, and books on component mount
  useEffect(() => {
    fetch('/api/sermons')
      .then(res => res.json())
      .then(data => setSermons(data))
      .catch(err => console.error(err));

    fetch('/api/songs')
      .then(res => res.json())
      .then(data => setSongs(data))
      .catch(err => console.error(err));

    fetch('/api/books')
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error(err));

    // Fetch YouTube video list from your backend API
    fetch('/api/sermons/videos') // Ensure this matches your server endpoint
      .then(res => res.json())
      .then(data => setYoutubeVideos(data))
      .catch(err => console.error(err));
  }, []);

  // Search/filter functionality for sermons by category
  const handleSearch = () => {
    fetch(`/api/sermons?category=${category}`)
      .then(res => res.json())
      .then(data => setSermons(data))
      .catch(err => console.error(err));
  };

  // Handle video selection
  const handleVideoSelect = (videoUrl) => {
    setSelectedVideo(videoUrl);
  };

  // Handle audio selection
  const handleAudioSelect = (audioUrl) => {
    setSelectedAudio(audioUrl);
  };

  return (
    <div className="container">
      <h1>Rhema Gallery Library</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search sermons by category"
        value={category}
        onChange={e => setCategory(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {/* Sermons Section */}
      <h2>Sermons</h2>
      <ul>
        {sermons.map(sermon => (
          <li key={sermon._id} className="category-faith" onClick={() => handleVideoSelect(sermon.videoLink)}>
            {sermon.title} - {sermon.category}
          </li>
        ))}
      </ul>
      {selectedVideo && <VideoPlayer videoUrl={selectedVideo} />}

      {/* YouTube Videos Section */}
      <h2>YouTube Sermon</h2>
      <ul>
        {youtubeVideos.map(video => (
          <li key={video.id.videoId} onClick={() => handleVideoSelect(`https://www.youtube.com/embed/${video.id.videoId}`)}>
            {video.snippet.title} - {video.snippet.description}
          </li>
        ))}
      </ul>
      {selectedVideo && <VideoPlayer videoUrl={selectedVideo} />}

      {/* Songs Section */}
      <h2>Songs</h2>
      <ul>
        {songs.map(song => (
          <li key={song._id} className="category-prayer" onClick={() => handleAudioSelect(song.audioLink)}>
            {song.title} - {song.artist}
          </li>
        ))}
      </ul>
      {selectedAudio && <AudioPlayer audioUrl={selectedAudio} />}

      {/* Books Section */}
      <h2>Books</h2>
      <ul>
        {books.map(book => (
          <li key={book._id} className="category-worship">
            {book.title} - {book.author}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Library;
