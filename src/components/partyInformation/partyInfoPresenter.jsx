import { observer } from "mobx-react-lite";
import { PartyInfoView } from "./partyInfoView";


const PartyInfo = observer(             
    function PartyInfoRender(props){
        return <PartyInfoView 
                partyInviteCode={props.model.currentPartyID}
                partyName={props.model.nameOfParty}
                onPartyNameChanged = {onPartyNameChangedACB}
                onStartVoting = {onStartVotingACB}
                />;
        function onPartyNameChangedACB(value){
            if (value.length < 1) {
                value = "-"
            }
            props.model.nameOfParty = value;
            props.model.parties.find(findPartyByIdACB).name = value;
            function findPartyByIdACB(party){
                return party.partyID === props.model.currentPartyID;
            }
        }

        function onStartVotingACB(){
            if (props.model.nameOfParty.length < 2) {
                props.model.openDialog("Party name needs to be at least 2 characters long!");
                return;
            }
            if (props.model.nameOfParty.length > 25) {
                props.model.openDialog("Party name needs to be shorter than 25 characters!");
                return;
            }
            window.location.href = "#voting";
        }
    }
);

export { PartyInfo };