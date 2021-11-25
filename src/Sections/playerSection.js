import React from 'react';
import "./playerSection.css"


// icon imports 

import fullVolume from "./icons/VolumeFull.svg"


// import mediumVolume from "./icons/VolumeMedium.svg"

// Widget imports

// import volumeSlide from "./icons/volumeSlideWidget.svg"
// import volumeSlideButton from "./icons/volumeSlideButtonWidget.svg"

// import playerSlide  from "./icons/playerSliderWidget.svg"
// import playerSlideButton  from "./icons/playerSliderButtonWidget.svg"

import PlayButton from "./icons/Play.svg"
import PauseButton from "./icons/Pause.svg"
import nextSongButton from "./icons/nextSong.svg"
import prevSongButton from "./icons/prevSong.svg"
import loopSongButton from "./icons/Loop.svg"
import shuffleSongButton from "./icons/Shuffle.svg"





class QueueSection extends React.Component{
    constructor(props){
        super(props)

        this.props = props

        this.parentRef = this.props.parentRef

        this.state = {
            music:{
                music3: "",
                music2: "",
                music1: "",
            }
        }

        this.updateQueue = this.updateQueue.bind(this)
        this.parentRef.parentRef.updateQueue = this.updateQueue
        

    }

    componentDidMount(){
        this.updateQueue()
    }

    updateQueue(){
        
        this.setState(() => {
            return {music : this.parentRef.parentRef.state.queueSongs}
        })

    }

    render(){
        return(
            <div className="queueContainer">
                <div className="prevSongContainer">
                    <div className="songItem" id="song3">{this.state.music.music3}</div>
                    <div className="songItem" id="song2">{this.state.music.music2}</div>
                    <div className="songItem" id="song1">{this.state.music.music1}</div>
                </div>
                <div className="dropContainer">
                    <div className="dropButton" id="dropPlay"> 
                        <span>Play Now</span> 
                    </div>
                    <div className="dropButton" id="dropAdd">
                        <span>Add to Queue</span>                         
                    </div>
                </div>
            </div>
        )
    }
}

class VolumeSection extends React.Component{
    constructor(props){
        super(props)

        this.props = props
        this.parentRef = this.props.parentRef

        this.state = {
            volume: 0,
        }

        this.mouseVolumeState = false
        this.mouseClickedPos = [0, 0]

        this.slideButtonClicked = this.slideButtonClicked.bind(this)
        this.handleVolumeSlider = this.handleVolumeSlider.bind(this)
        this.setVolumePosition = this.setVolumePosition.bind(this)        
    }

    componentDidMount(){

        document.body.addEventListener("mousemove", this.handleVolumeSlider)
        document.body.addEventListener("mouseup", (event) => {this.mouseVolumeState = false})
        
        let volume = 0;

        if (document.cookie){
            volume = this.parentRef.parentRef.getCookie("volume")
        }

        this.setVolumePosition(volume)
    }


    changeVolumeIcon(icon){
        document.getElementById("volumeIcon").src = icon
    }


    slideButtonClicked(){
        this.mouseVolumeState = true
    }


    handleVolumeSlider(){

        var event = window.event

        let mousePos = [event.clientX, event.clientY]
        let volumeSlidePos = document.getElementById("volumeSlide").getBoundingClientRect()

        if ((mousePos[0] > volumeSlidePos["left"] && mousePos[0] < volumeSlidePos["right"] ) || this.mouseVolumeState ){
            let change = mousePos[0] - volumeSlidePos["left"]
    
            if ( change >= 0 && change <= 100 && this.mouseVolumeState ){
                this.setVolumePosition(Math.round(change))
            }

        } 
    }

    setVolumePosition(volume){
        this.parentRef.parentRef.setCookie("volume", volume)

        setTimeout(() => {
            this.setState({ volume })
        }, 100);

        document.getElementById("volumeSlideButton").style.transform = `translateX(${volume}px)`
        document.getElementById("highLightedVolumeSlide").style.width = `${volume}px`

        setTimeout(() => {
            this.parentRef.parentRef.setVolume(volume)
        }, 100);
    }


    render(){
        return(
            <div className="volumeSectionContainer">
                <div className="volumeDisplay">
                    <img className="volumeSpeakerIcon" id="volumeIcon" src={fullVolume} alt="volume" />
                    <span className="volumeText" id="playerVolume">{this.state.volume}</span> 
                </div>
                <div className="volumeController" onClick={this.handleVolumeSlider}>
                    <div className="volumeSlideButton" id="volumeSlideButton" onMouseDown={this.slideButtonClicked} />
                    <div className="volumeSliderContainer">
                        <div className="volumeSlide" id="volumeSlide" onMouseDown={()=>{
                            this.slideButtonClicked()
                            this.handleVolumeSlider()
                        }}/>
                        <div className="highLightedVolumeSlide" style={{width: "0px"}} id="highLightedVolumeSlide" onMouseDown={()=>{
                            this.slideButtonClicked()
                            this.handleVolumeSlider()
                        }}/>
                    </div>
                </div>
            </div>
        )
    }



}


class PlaySection extends React.Component{
    constructor(props){
        super(props)

        this.props = props
        this.parentRef = props.parentRef

        this.state = {
            playerState : true,
        }

        this.changeToPlayState = this.changeToPlayState.bind(this)
        this.parentRef.parentRef.changeToPlayState = this.changeToPlayState

        this.togglePlayState = this.togglePlayState.bind(this)
        this.parentRef.parentRef.togglePlayState = this.togglePlayState

        this.setPlayerPosition = this.setPlayerPosition.bind(this)
        this.handlePlayerSlider = this.handlePlayerSlider.bind(this)

    }


    componentDidMount(){
        this.highlightedPlayerSlider = document.getElementById("highlightedPlayerSlide")
        this.playerSlideButton = document.getElementById("playerSlideButton")
    }


    getStringfromSeconds(second){
        var string = "mm:ss"

        let minutes = Math.trunc(second / 60)
        let seconds = Math.trunc(second % 60)

        if (second >= 60*60){

            string = "hh:" + string
            let hours = Math.trunc(second / (60*60))
            
            if (hours < 10) string = string.replace("hh", "0hh")
            string.replace("hh", hours)  
        } 

        if (seconds < 10) string = string.replace("ss", "0ss")
        if (minutes < 10) string = string.replace("mm", "0mm")
        
        string = string.replace("mm", minutes)
        string = string.replace("ss", seconds)

        return string
    }

    togglePlayState(){
        function setPlayer(){
            this.state.playerState ? this.parentRef.parentRef.pauseSong() : this.parentRef.parentRef.playSong()
        }
        this.setState((state)=>{
            return {playerState : !state.playerState}
        }, setPlayer)
    }

    changeToPlayState(){
        if (this.state.playerState) {
            this.togglePlayState()
        }
        this.parentRef.parentRef.playSong()

        this.parentRef.parentRef.state.audioObject.ontimeupdate = () => {

            let factor = ((this.parentRef.parentRef.state.elapsedDuration/this.parentRef.parentRef.state.duration)*100).toFixed(4)
            this.setPlayerPosition(factor)

            if (this.parentRef.parentRef.state.elapsedDuration === (this.parentRef.parentRef.state.duration)){
                this.parentRef.parentRef.nextSong()
            }
        } 
    }

    handlePlayerSlider(){

        var event = window.event

        var playerSliderRect = document.getElementById("playerSlider").getBoundingClientRect()
        this.setPlayerPosition(((event.pageX - playerSliderRect["left"] + 7)/playerSliderRect["width"])*100, true)
    }

    setPlayerPosition(factor, handle=false){
        this.highlightedPlayerSlider.style.width = `${factor}%`
        this.playerSlideButton.style.left = `${factor}%`

        if (handle) {
            this.parentRef.parentRef.state.audioObject.currentTime = ((this.parentRef.parentRef.state.duration)*(factor/100)).toFixed(0)
        }

        this.parentRef.parentRef.setState((state)=>{
            return {elapsedDuration : (state.audioObject.currentTime).toFixed(4)}
        })
    }

    shuffle(){
        
    }
    


    render(){ 
        return(
            <div className="playSectionContainer">
                <div className="playerTimeline">
                    <div className="playerSlideContainer" id="playerSlider" onMouseDown={this.handlePlayerSlider} >
                        <div className="playerSlideButton" id="playerSlideButton" style={{left: "0%",}} onClick={this.changeCurrentTime} />
                        <div className="playerSlideController">
                            <div className="playerSlide" id="playerSlide" />
                            <div className="highlightedPlayerSlide" id="highlightedPlayerSlide" style={{width: "0%",}} />
                        </div>
                    </div>
                    <div className="playerTime">
                        <span className="playerTimeItem" id="playerTime1"> {this.getStringfromSeconds(this.parentRef.parentRef.state.elapsedDuration)} </span>
                        <span className="playerTimeItem" id="playerTime2"> {this.getStringfromSeconds(this.parentRef.parentRef.state.duration)} </span>
                    </div>
                </div>
                <div className="playRequestSection">
                    <img src={loopSongButton} alt="" className="requestIcon" id="loopButton"/>
                    <div className="currentMusicRequests">
                        <img src={prevSongButton} alt="" className="requestIcon" id="prevMusicButton" onClick={this.parentRef.parentRef.prevSong} />
                        <img src={this.state.playerState ? PlayButton : PauseButton} alt="" className="requestIcon" id="playButton" onClick={this.togglePlayState} />
                        <img src={nextSongButton} alt="" className="requestIcon" id="nextMusicButton" onClick={this.parentRef.parentRef.nextSong} />
                    </div>
                    <img src={shuffleSongButton} alt="" className="requestIcon" id="shuffleButton" onClick={}/>
                </div>
            </div>
        )
    }
}



class PlayerSection extends React.Component{
    constructor(props){
        super(props)

        this.props = props
        this.parentRef = this.props.parentRef
    }

    render(){
        return(
            <div className="playerSection">
                <QueueSection parentRef={this} />
                <VolumeSection parentRef={this}/>
                <PlaySection parentRef={this}/>
            </div> 
        )
    }
}


export default PlayerSection;

