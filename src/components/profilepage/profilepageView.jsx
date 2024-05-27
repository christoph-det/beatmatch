export function ProfilePageView(props) {
    return (
      <div className="container m-5 bg-dark text-light p-5 rounded-3 bg-opacity-85 mx-auto">
        <div className="row">
          <div className="col">
            <h1 className="text-left mb-4">Your Profile: {props.username}</h1>
            <p className="mt-5">Number of Spotify playlists: {props.numberOfPlaylists}</p>
            <p>Number of parties: {props.numberOfParties}</p>
            <p>Total votes received: {props.numberOfVotes}</p>
          </div>
          <div className="col text-end">
            <img className="profile-image" src={props.profilePictureURL}/>
          </div>
        </div>
       
      </div>
    );
  }
  