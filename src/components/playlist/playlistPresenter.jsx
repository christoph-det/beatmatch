import { generateInvitationText } from "../../utils/utilities";
import { PlayListView } from "./playlistView";
import { observer } from "mobx-react-lite";
import { sortPlaylist } from "/src/utils/utilities.js";
import { UnvalidCodeView } from "../getBack/unvalidCodeView";
import { NoPartyView } from "../getBack/noPartyView";

const Playlist = observer(function PlayListRender(props) {
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
    const playlist = sortPlaylist(props.model.currentPlaylist);
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
    if ((props.model.currentPartyID || props.model.partyInviteCode) && props.model.nameOfParty) {
      return (
        <PlayListView
          playlistName={props.model.nameOfParty}
          playlist={playlist}
          partyInviteCode={
            props.model.isHost
              ? props.model.currentPartyID
              : props.model.partyInviteCode
          }
          isHost={props.model.isHost}
          onShareCode={shareCodeACB}
          onExportSpotify={exportPlaylistsACB}
          onRefresh = {updateVotesACB}
          onBackToStart={backToStartACB}
        />
      );
    } else if (props.model.isHost) {
        return <NoPartyView />;
    } else {
        return (
        <UnvalidCodeView
          partyInviteCode={props.model.partyInviteCode}
          onBackToStart={backToStartACB}
        />
      );
    }
    function shareCodeACB() {
      navigator.clipboard.writeText(
        generateInvitationText(props.model.currentPartyID)
      );
      props.model.openDialog("Invitation copied to clipboard");
    }

    function exportPlaylistsACB() {
      props.model.exportPlaylistToSpotify(props.model.nameOfParty, props.model.currentPlaylist);
    }

    function updateVotesACB() {
      props.model.votesUpdated = !props.model.votesUpdated;
    }

    function backToStartACB() {
      props.model.logout();
      window.location.href = "#welcome";
    }

  }
});

export { Playlist };
