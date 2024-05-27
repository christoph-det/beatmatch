export function VotingDoneView(props) {
    
    return (
     
        <div className="text-center container mt-5 bg-dark text-light p-5 rounded-3 bg-opacity-85">
            { props.isHost ? (
                <div>
                    <h1>You have voted for all the songs</h1>
                    <p>Wait for your friends to finish voting or export your playlist to your Spotify now.</p>
                    <br />
                    <h2>Enjoy your new playlist!</h2>
                    <div className="text-center">
                        <button onClick={onClickViewPlaylistACB} id="viewPlaylist-button" className="votingButton btn btn-primary btn-sm my-4 mx-5">
                            View Playlist
                        </button>
                    </div>
                </div>
          ) : 
                <div>
                    <h1>You have voted for all the songs!</h1>
                    <h2>The host can now create a playlist that you can listen to together!</h2>
                    <br />
                    <h2>Enjoy your party with songs everyone likes!</h2>
                    
                </div>
          }
        </div>
    );

    function onClickViewPlaylistACB() {
        props.onViewPlaylist();
    }
}