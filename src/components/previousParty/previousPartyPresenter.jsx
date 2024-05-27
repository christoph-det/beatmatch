import { PreviousPlayListView } from "./previousPartyView";
import { UnvalidCodeView } from "../getBack/unvalidCodeView";
import { NoPartyView } from "../getBack/noPartyView";
import { observer } from "mobx-react-lite";
import { sortPlaylist } from "/src/utils/utilities.js";

const PreviousParty = observer(function PreviousPartyRender(props) {
  //Check if the votes are loaded or if no song have been voted for
  if (
    (props.model.exportPlaylistPromiseState.promise && // Check for export promise
      !props.model.exportPlaylistPromiseState.error &&
      !props.model.exportPlaylistPromiseState.data) ||
    (props.model.addTracksPromiseState.promise && // Check for addTracks promise
      !props.model.addTracksPromiseState.error &&
      !props.model.addTracksPromiseState.data)
  ) {
    return (
      <img
        className="m-auto d-block loading-spinner"
        src="loading-spinner.gif"
        alt="Loading"
      />
    );
  } else {
    let foundNegativeVote = false;
    const playlist = sortPlaylist(props.model.previousParty);
    for (let i = 0; i < playlist.length; i++) {
      playlist[i].vote = playlist[i].vote || 0;
      if (playlist[i].vote < 0) {
        playlist.splice(i, 0, null);
        foundNegativeVote = true;
        break;
      }
    }
    if (!foundNegativeVote) {
      playlist.push(null);
    }

    if (props.model.previousPartyID && props.model.previousPartyName){
      return (
        <PreviousPlayListView
          playlistName={props.model.previousPartyName}
          playlist={playlist}
          partyInviteCode={props.model.previousPartyID}
          isHost={props.model.isHost}
          onExportSpotify={exportPlaylistsACB}
          onUseAsCurrent = {useAsCurrentPlaylistACB}
          onBackToStart={backToStartACB}
        />
      );
    } else if (props.model.isHost){
      // NO PARTY
      return <NoPartyView />;
    } else{
      //unvalid code
      return <UnvalidCodeView 
          partyInviteCode={props.partyInviteCode} 
          onBackToStart={backToStartACB} 
      />;
    }

    function exportPlaylistsACB() {
      props.model.exportPlaylistToSpotify(props.model.previousPartyName, props.model.previousParty);
    }

    function backToStartACB() {
      props.model.logout();
      window.location.href = "#welcome";
    }

    function useAsCurrentPlaylistACB() {
        if (props.model.currentPartyID == props.model.previousPartyID) {
          props.model.openDialog("You are already using this playlist as your current party.");
        } else {
          props.model.openDialog("Warning, this resets all your votes and you can vote again on the songs with your friends. Continue?", confirmUseAsCurrentPlaylistACB);
        }
        function confirmUseAsCurrentPlaylistACB() {
          props.model.setCurrentParty(props.model.previousPartyID);
          window.location.href = "#voting";
        }
    }
  }
});

export { PreviousParty };
