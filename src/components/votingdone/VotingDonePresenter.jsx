import { observer } from "mobx-react-lite";
import { VotingDoneView } from "./votingDoneView";



const VotingDone = observer(             
    function VotingDoneRender(props){
        return <VotingDoneView 
                isHost={props.model.isHost}
                onViewPlaylist={onViewPlaylistACB}
                    />;


        function onViewPlaylistACB() {
            window.location.href = "#playlist";
            props.model.votesUpdated = !props.model.votesUpdated;
        }
    }
    
);

export { VotingDone };