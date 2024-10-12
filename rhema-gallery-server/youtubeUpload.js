const mongoose = require('mongoose');
const YouTube = require('youtube-node'); // YouTube API client
const dotenv = require('dotenv');
const Sermon = require('./models/Sermon'); 
const Song = require('./models/Song'); 

dotenv.config(); // Load environment variables

// Configure YouTube API
const youTube = new YouTube();
youTube.setKey(process.env.YOUTUBE_API_KEY); // Add your YouTube API key in .env

// Function to upload YouTube video details
async function uploadYouTubeVideo(url, type, title, artistOrSpeaker, category) {
  try {
    // Extract video ID from the URL
    const videoId = url.split('v=')[1]?.split('&')[0];
    
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    // Get video details from YouTube API
    youTube.getById(videoId, async (error, result) => {
      if (error) {
        console.error('Error fetching YouTube video:', error);
        return;
      }

      const video = result.items[0];
      const description = video.snippet.description;
      const thumbnailUrl = video.snippet.thumbnails.high.url;

      // Prepare data based on the type
      if (type === 'sermon') {
        const sermon = new Sermon({
          title: title || video.snippet.title, // Use provided title or YouTube title
          description,
          youtubeUrl: url,
          thumbnailUrl,
          speaker: artistOrSpeaker, // Store speaker's name
          category, // Store category
        });
        await sermon.save();
        console.log(`Sermon uploaded: ${title || video.snippet.title}`);
      } else if (type === 'song') {
        const song = new Song({
          title: title || video.snippet.title, // Use provided title or YouTube title
          description,
          youtubeUrl: url,
          thumbnailUrl,
          artist: artistOrSpeaker, // Store artist's name
          category, // Store category
        });
        await song.save();
        console.log(`Song uploaded: ${title || video.snippet.title}`);
      } else {
        console.error('Invalid type specified. Use "sermon" or "song".');
      }
    });
  } catch (err) {
    console.error(`Error uploading YouTube video: ${err.message}`);
  }
}

// Main function to handle uploads from command line arguments
async function main() {
  const args = process.argv.slice(2);
  
  // Check if all required arguments are provided
  if (args.length < 5) {
    console.log('Usage: node youtubeUpload.js <youtubeUrl> <type> <title> <artistOrSpeaker> <category>');
    return;
  }

  const [url, type, title, artistOrSpeaker, category] = args;

  // Upload YouTube video details
  await uploadYouTubeVideo(url, type, title, artistOrSpeaker, category);
}

// Start the upload process
main();
