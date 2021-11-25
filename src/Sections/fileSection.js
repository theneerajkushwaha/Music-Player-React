import React from 'react';
import './fileSection.css'



// import icon

import openDirIcon from "./icons/OpenDir.svg"

import currentSongIcon from "./icons/currentSong.svg"
import currentSongBlankIcon from "./icons/currentSongBlank.svg"

import bookMarkIcon from "./icons/bookMark.svg"
import bookMarkBlankIcon from "./icons/bookMarkBlank.svg"




class FolderSection extends React.Component{
    constructor(props){
        super(props)

        this.props = props
        this.parentRef = this.props.parentRef

        this.selectedFiles = []

        this.songInput = this.songInput.bind(this)
        this.addSongFiles = this.addSongFiles.bind(this)
    }



    addSongFiles(value){
        for (let i = 0; i < value.length; i++){
            let currentItem = [value[i].name.replace(".mp3", ""), value[i]]
            this.parentRef.parentRef.songs.push(currentItem)
        }
        this.parentRef.parentRef.updateSongsList()
        this.parentRef.parentRef.playToQueue(0)
    }
    
    songInput(){
        let songInputElement = document.getElementById("songInputBox")
        songInputElement.click()
        
        songInputElement.onchange = () => {
            let files = songInputElement.files
            this.addSongFiles(files)
        }                                  
    }


    render(){
        return(
            <div className="folderSelectorContainer" onClick={this.songInput}>
                <div className="folderLocation">
                    <span>Import Music</span>
                </div>
                <input type="file" accept=".mp3" className="songInputBox" id="songInputBox" multiple="multiple"/>               
            </div>
        )
    }
}

class SearchSection extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className="SearchContainer">
                <div className="searchInputContainer">
                    <input  type="text" hint="Search Music" />
                </div>

                <div className="sortContainer">
                    Sort by :
                    <select name="sortMethod" id="sortMethod" className="sortMusicBox">
                        <option value="Name">name</option>
                        <option value="Date">date</option>
                    </select>
                </div>
            </div>
        )
    }
}

class Songitem extends React.Component{
    constructor(props){
        super(props)
        
        this.props = props

        this.parentRef = this.props.parentRef

        this.state = {
            song : props.song,
            bookMark : false,
        }

        this.songIndex = this.props.songIndex
        this.parentState = this.parentRef.state
        this.checkEquality = this.props.parentRef.props.parentRef.checkEquality
        this.addToBookmark = this.addToBookmark.bind(this)
        this.setCurrentQueue = this.setCurrentQueue.bind(this)

    }


    
    

    addToBookmark(){
        const bookMarked =  this.props.parentRef.state.bookmarkedIndex

        if (this.state.bookMark){
            if (this.checkEquality(bookMarked, this.props.songIndex)){
                bookMarked.splice(bookMarked.indexOf(this.props.songIndex), 1)
            }
        }
        else{
            if (!this.checkEquality(bookMarked, this.props.songIndex)){
                bookMarked.push(this.props.songIndex)
            }
        }
    
        this.parentRef.setState({bookmarkedIndex:bookMarked})
        this.setState((state) => {
            return {bookMark : !state.bookMark}
        })

        this.parentRef.setSongWidgets()
    }

    setCurrentQueue(){
        this.parentRef.parentRef.parentRef.playToQueue(this.songIndex)
        this.parentRef.updateCurrentSongIndex(this.props.songIndex)
    }

    render(){
        return(
            <div className="songItemContainer" onDoubleClick={this.setCurrentQueue}>
                <div>
                    { this.parentRef.state.currentSongIndex === this.songIndex ? <img src={currentSongIcon} alt="" className="currentSong" /> : "" }
                    <span className="songName">{this.state.song}</span>
                </div>
                    <img src={this.checkEquality(this.parentState.bookmarkedIndex, this.props.songIndex) ? bookMarkIcon : bookMarkBlankIcon} alt="" className="bookMarkSong" onClick={this.addToBookmark}/>
            </div>
        )
    }
}

class SongSection extends React.Component{
    constructor(props){
        super(props)

        this.parentRef = props.parentRef
        this.selectedSongItemWidgets = []

        this.state = {
            selectedSongItemWidgets : null,
            bookmarkedIndex : [],
            currentSongIndex : 0,
        }

        this.updateCurrentSongIndex = this.updateCurrentSongIndex.bind(this)
        this.setSongWidgets = this.setSongWidgets.bind(this)
        this.props.parentRef.parentRef.setSongWidgets = this.setSongWidgets
    }

    updateCurrentSongIndex(index){
        this.setState({currentSongIndex : index})
        this.setSongWidgets()
    }

    setSongWidgets(){
        for (let index = 0; index < this.parentRef.parentRef.state.songs.length; index++) {
            this.selectedSongItemWidgets[index] = <Songitem 
            song={this.parentRef.parentRef.state.songs[index][0]}
            songIndex={index}
            parentRef={this}/>;     
        }

        this.setState({ selectedSongItemWidgets : this.selectedSongItemWidgets })
    }


    render(){

        return(
            <div className="SongContainer">
                {this.state.selectedSongItemWidgets}
            </div>
        )
    }
}




class FileSection extends React.Component{
    constructor(props){
        super(props)

        this.parentRef = props.parentRef

    }



    checkEquality(array, element){
        for (let i = 0; i < array.length; i++){
            if (array[i] === element){
                return true
            }
        }
        return false
    }
    


    render(){
        return(
            <div className="fileSection">
                <FolderSection parentRef={this}/>
                <SearchSection/>
                <SongSection parentRef={this} />
            </div>
        )
    }

}


export default FileSection;