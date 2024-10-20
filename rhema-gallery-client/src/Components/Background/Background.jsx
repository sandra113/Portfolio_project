import './Background.css';
import video1 from '../../Assets/video1.mp4';
import image1 from '../../Assets/image_1.jpg';
import image2 from '../../Assets/image_2.png';
import image7 from '../../Assets/image_7.jpg';

const Background = ({ playStatus, heroCount }) => {
  // Array of images for the background
  const BackgroundImages = [image1, image2, image7];

  if (playStatus) {
    return (
      <video className='background fade-in' autoPlay loop muted>
        <source src={video1} type='video/mp4' />
      </video>
    );
  } else {
    // Loop through BackgroundImages based on heroCount
    const currentImage = BackgroundImages[heroCount % BackgroundImages.length];
    return <img src={currentImage} className='background' alt="" />;
  }
};

export default Background;
