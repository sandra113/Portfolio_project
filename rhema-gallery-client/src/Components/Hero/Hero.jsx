import './Hero.css'
import play_icon from '../../Assets/play_icon.png'
import pause_icon from '../../Assets/pause_icon.png'

const Hero = ({heroData,  setPlayStatus, playStatus}) => {
    return (
        <div className='hero'>
                <div className='hero-play'>
                    <img 
                    onClick={()=>setPlayStatus(!playStatus)} 
                    src={playStatus ? pause_icon : play_icon} alt=""/>
                </div>
        </div>
    )
}

export default Hero