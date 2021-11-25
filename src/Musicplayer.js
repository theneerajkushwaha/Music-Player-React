import React from "react";
import { default as PlayerSection } from "./Sections/playerSection";
import { default as FileSection } from "./Sections/fileSection";



class Musicplayer extends React.Component {
    constructor(props) {
        super(props);

        this.songs = []

        this.state = {
            songs: this.songs,
            queueSongs: {
                music3: "Song3",
                music2: "Song2",
                music1: "Song1",
            },
            currentSongIndex : null,
            audioObject: null,
            duration : 0,
            elapsedDuration : 0,
        };

        this.updateQueue = () => { }
        this.setSongWidgets = () => { }
        this.togglePlayState = () => { }
        this.changeToPlayState = () => { }

        this.playToQueue = this.playToQueue.bind(this)
        this.setupAudio = this.setupAudio.bind(this)
        this.changeSong = this.changeSong.bind(this)
        this.playSong = this.playSong.bind(this)
        this.pauseSong = this.pauseSong.bind(this)
        this.setVolume = this.setVolume.bind(this)
        this.updateSongsList = this.updateSongsList.bind(this)
        this.prevSong = this.prevSong.bind(this)
        this.nextSong = this.nextSong.bind(this)
    }

    componentDidMount() {
        this.setupAudio()
    }

    playToQueue(songIndex) {
        for (let i = 0; i < 3; i++) {
            let index
            if (!((songIndex - i) < 0))
                index = (songIndex - i)
            else
                index = ((songIndex - i) + this.state.songs.length)

            this.state.queueSongs[`music${i + 1}`] = this.state.songs[index][0]
            this.updateQueue()
        }
        var selectedSong = window.URL.createObjectURL(this.state.songs[songIndex][1])
        this.changeSong(selectedSong)
        this.setState({
            currentSongIndex : songIndex
        })
        // document.head.getElementsByTagName("title").innerText = this.state.songs[songIndex][1]
    }

    prevSong(){
        let index = this.state.currentSongIndex
        if (index === 0)
            index = this.state.songs.length
        
        this.playToQueue(index-1)
    }
    nextSong(){
        let index = this.state.currentSongIndex
        if (index === (this.state.songs.length-1))
            index = -1
        
        this.playToQueue(index+1)
    }

    updateSongsList() {
        this.setState({ songs: this.songs })
        this.setSongWidgets()
    }

    getCookie(cookieName){
        let cookie = document.cookie
        let requiredVal = ""
        
        if (cookie && cookie.indexOf(cookieName) !== -1){
            let currentCookieIndex = cookie.indexOf(cookieName) + cookieName.length + 1

            for (let i = currentCookieIndex; i < cookie.length; i++) {
                if (cookie[i] === ";") break
                requiredVal += cookie[i]
            }
        } else {
            requiredVal = null
        }
        return requiredVal
    }

    setCookie(cookieName, value){

        let cookie = document.cookie.concat()
        let newCookie = `${cookieName}=${value};`

        if (this.getCookie(cookieName) !== null){
            let currentCookie = `${cookieName}=`

            let currentCookieIndex = cookie.indexOf(cookieName) + cookieName.length + 1

            for (let i = currentCookieIndex; i < cookie.length; i++) {
                if (cookie[i] === ";"){
                    currentCookie += ";"
                    break
                }
                currentCookie += cookie[i]
            }

            document.cookie = document.cookie.replace(currentCookie, newCookie)
        } else {
            document.cookie += newCookie
        }
    }

    createCookie(cookieName, value){

        document.cookie += `${cookieName}=${value};`

    }


    setupAudio() {
        var audioObject = document.createElement("audio")
        audioObject.id = "audioObject"
        document.body.appendChild(audioObject)
        this.setState({ audioObject: document.getElementById("audioObject") })
    }

    changeSong(song) {
        this.state.audioObject.src = song
        this.changeToPlayState()
        this.state.audioObject.onloadedmetadata = () => {
            this.setState((state)=>{
                return {duration : (state.audioObject.duration).toFixed(4)}
            })
        }
  
    }

    playSong() {
        if (this.state.audioObject.src)
            this.state.audioObject.play()
    }

    pauseSong() {
        this.state.audioObject.pause()
    }

    setVolume(volume){
        if (this.state.audioObject)
            this.state.audioObject.volume = parseInt(volume)/100
    }


    render() {
        return (
            <div className="MusicPlayer">
                <PlayerSection parentRef={this} />
                <FileSection parentRef={this} />
            </div>
        );
    }
}

export default Musicplayer;
