export function PreviousPlayListView(props) {
    return (
      <div className="container">
        <h1 className="my-5 text-center">Playlist: {props.playlistName}</h1>
        <h2 className="mt-5 text-center">Invite code: {props.partyInviteCode}</h2>
        <div className="playlistview-container">
          {props.isHost ? <button onClick={onClickExportSpotifyACB} className="btn btn-primary">Export Playlist to Spotify</button> : null}
          {props.isHost ? <button onClick={onClickUseAsCurrentACB} className="btn btn-primary">Use as current party</button> : null}

        </div>
        <table className="table table-dark table-striped table-hover bg-opacity-85">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Songname</th>
              <th scope="col">Artist</th>
              <th scope="col">Album</th>
              <th scope="col">Votes</th>
            </tr>
          </thead>
          <tbody>{props.playlist.map(renderPlaylistRowCB)}</tbody>
        </table>
      </div>
    );
    
  
    function onClickExportSpotifyACB() {
      props.onExportSpotify();
    }

    function onClickUseAsCurrentACB() {
        props.onUseAsCurrent();
    }
  
    function renderPlaylistRowCB(song, index) {
      if (!song) {
        index = index - 1;
        return (
          <tr key={index} className="table-danger">
            <th scope="row"></th>
            <td colSpan="4">Songs after this are removed because of low rating.</td>
          </tr>
        );
      }
      return (
        <tr key={song.id} >
          <th className="py-3" scope="row">
            {song.vote < 0 ? index : index + 1}
          </th>
          <td className="py-3">{song.name}</td>
          <td className="py-3">{song.artists}</td>
          <td className="py-3">{song.album}</td>
          <td className="py-3">{song.vote || 0}</td>
        </tr>
      );
    }
}
  