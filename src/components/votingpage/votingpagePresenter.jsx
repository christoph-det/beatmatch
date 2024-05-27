import { observer } from "mobx-react-lite";
import { VotingPageView } from './votingpageView';
import { generateInvitationText } from "../../utils/utilities";
import { NoVotingView } from "./noVotingView";
import { UnvalidCodeView } from "../getBack/unvalidCodeView";
import { decreaseVote, increaseVote } from "../../firebase/firebaseModel";

const VotingPage = observer(             
    function VotingPageRender(props){
        function backToStartACB() {
            props.model.logout();
            window.location.href = "#welcome";
        } 
        if (!props.model.currentPartyID && props.model.isHost) {
            return <NoVotingView/>;

        } else if(!props.model.isHost && props.model.firebaseUserId === null){
            //If the username not is set the given code does not exists, since it not corresponds to a userId
            return (<UnvalidCodeView
                    partyInviteCode = {props.model.partyInviteCode}
                    onBackToStart = {backToStartACB}
                />);
        } else if (
            (props.model.currentPlaylistPromiseState.promise && (!props.model.currentPlaylistPromiseState.error && 
            !props.model.currentPlaylistPromiseState.data) &&
            props.model.isHost) 
            ||
            (props.model.currentPlaylist.length === 0 && !props.model.isHost)) {
            // if pending
            return (
                <img
                    className="m-auto d-block loading-spinner"
                    src="loading-spinner.gif"
                    alt="Loading"
                  />
            );
        } else if (props.model.currentPlaylistPromiseState.error && props.model.isHost) {
            // if error is truthy --> show error message
            return <div>Error: {props.model.currentPlaylistPromiseState.error.toString()}</div>;
        } else { 
        return (
            <VotingPageView 
                playlist={props.model.currentPlaylist}
                saveVoting={saveVotingACB}
                partyCode = {props.model.currentPartyID}
                currentSong = {props.model.currentSongCardInSession}
                updateCurrentSong = {saveNumberOfSongVotedACB} 
                onShareCode = {shareCodeACB}
            />
        );
        function shareCodeACB() {
            navigator.clipboard.writeText(generateInvitationText(props.model.currentPartyID));
            props.model.openDialog("Invitation copied to clipboard");
        }
        function saveVotingACB(index, positiveVote) {
            if (positiveVote) {
                increaseVote(props.model, index);
            } else {
                decreaseVote(props.model, index);
            }
        }
        function saveNumberOfSongVotedACB(index){
            props.model.currentSongCardInSession = index;
        } 
     } 
});

export { VotingPage };