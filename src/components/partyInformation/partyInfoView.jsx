export function PartyInfoView(props) {
    
    return (
        <div className="mt-5 container bg-dark text-light p-5 rounded-3 bg-opacity-85">
        <div className="text-center">
            <h1 className="mb-3">This is your new party!</h1>
            <h2 className="mb-4">Share the code with your friend to invite them to your blend!</h2>
            <h2 className="mb-4">Select a name for your party!</h2>
            <input
                className="mb-2"
                id="partyNameInput"
                type="normal"
                placeholder="Party Name"
                defaultValue={props.partyName}
                onChange={onPartyNameInputChangeACB}
            />
            <h2 className="mb-4">Invite code: {props.partyInviteCode}</h2>
            
        </div>
        <div className="d-grid gap-2 col-6 mx-auto mt-5">
            <a className="link-welcom btn btn-primary btn-lg" onClick={onClickStartVotingACB}>Start Voting!</a>
        </div>
    </div>
    
    );

    function onPartyNameInputChangeACB(event) {
        props.onPartyNameChanged(event.target.value);
    }

    function onClickStartVotingACB() {
        props.onStartVoting();
    }

  }
