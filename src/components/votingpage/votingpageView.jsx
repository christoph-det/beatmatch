import { CardSwiper } from "react-card-swiper";

export function VotingPageView(props) {
    const index = props.currentSong;
    const numberSongsInList = props.playlist.length;

    const Content = ({nameOfSong, artists, album}) => (
        <div className="flex flex-col items-center justify-center text-center">
            <h2> Title: {nameOfSong}</h2>
            <h3> Artists: {artists}</h3>
            <h3 >Album: {album}</h3>
        </div>
    )

    // Reverse, otherwise the playlist will start with latest added song
    const playlistSlice = [...props.playlist].slice(index, numberSongsInList);
    const playlistData = [...playlistSlice].map(renderSongCard).reverse();

    const handleDismiss = (el, meta, id, action, operation) => {
        if(action == "like"){ //Positive vote
            props.saveVoting(props.playlist[id].id, true); 
        }
        else{
            props.saveVoting(props.playlist[id].id, false); 
        }
        props.updateCurrentSong(id+1);
    };
    

    const handleFinish = (status) => {
        window.location.href = "/#votingdone";
    };
        
    return (
        <div>
            <div className="votingPage-container mt-5 container bg-dark text-light p-5 rounded-3 bg-opacity-85" >
                <div className="swiper-container" >
                    {/* This is our third party component */}
                    <CardSwiper 
                        data={playlistData} 
                        onDismiss={handleDismiss} 
                        onFinish={handleFinish} 
                            
                        emptyState={<div>Empty State</div>} 
                        dislikeButton={ <div>
                                            <button id="like-button" className="votingButton btn btn-danger my-2 my-lg-0 mx-5">
                                                Vote against this song    
                                            </button> 
                                        </div>}
                        likeButton={    <div>
                                            <button id="dislike-button" className="votingButton btn btn-primary my-2 my-lg-0 mx-5">
                                                Vote for this song
                                            </button>
                                        </div>}
                        withActionButtons
                    />
                </div>
            </div>  
            <div className="numberVotes-container">
                <h2>You have voted for {props.currentSong}/{numberSongsInList} songs</h2>
            </div>
            <div className="invite-container">
                <h2>Invite more friends to the party with the code: {props.partyCode}</h2>
                <button onClick={clickShareCodeACB} className='btn btn-primary py-1 btn-share'>Share code</button>
            </div>
        </div>
    );

    function clickShareCodeACB() {
        props.onShareCode();   
    }

    function renderSongCard(song, i) {  
        const id = props.currentSong+i;
        const src = song.albumCover;
        const content = (
            <Content nameOfSong={song.name} artists={song.artists} album={song.album} />
        );
        return {id, src, content};
    } 
}
