export function CreatePartyView(props) {
    return (
      <div className="container">
        <h2 className="my-5">Create a Party from your existing Playlist!</h2>
        <br />
          <table className="table table-dark table-striped party-creation-table table-hover bg-opacity-85">
              <thead>
              <tr>
                  <th scope="col" className="left-column column-title">Name</th>
                  <th scope="col" className="right-column column-title">Create Party from Playlist</th>
              </tr>
              </thead>
              <tbody>
                {props.showAllPlaylists ? props.playlists.map(renderPlaylistsRowCB) : props.playlists.slice(0,15).map(renderPlaylistsRowCB)}
              </tbody>
              {!props.showAllPlaylists && props.playlists.length > 15 && (
              <tfoot>
                <tr> 
                  <td colSpan="2" className="text-center">
                      <button className="votingButton btn btn-primary btn-xs " onClick={showAllACB}>Show all playlists</button>
                  </td>
                </tr>
              </tfoot>
               )}
          </table>

        </div>
    );
    function showAllACB(){
      props.onShowAllPlaylists();
    }

    function renderPlaylistsRowCB(playlist) {
        return (
          <tr key={playlist.id}>
            <td className="py-3 left-column">{playlist.name}</td>
            <td className="py-3 right-column"><button className="votingButton btn btn-primary btn-xs" onClick={createPartyOnClickACB} >Create Party</button></td>
          </tr>
        );
        function createPartyOnClickACB() {
            props.createParty(playlist.id)
        }
      }    


  }
  