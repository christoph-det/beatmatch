export function WelcomePageView(props) {
  return (
    <div>
      <div className="loginSquare container mt-5 bg-dark text-light p-5 rounded-3 bg-opacity-85">
        <div className="title-container">
          <h1 className="text-center"> Welcome to BeatMatch! </h1>
          <h2> Create the best blend for your party! </h2>
        </div>

        <div className="options-container">
          <div className="hostSquare">
            <h3> I want to host a party </h3>
            <button className="btn btn-primary" onClick={userLogInACB}>
              {props.logInBtn}
            </button>
          </div>

          <div className="guestSquare">
            <h3>I want to join a party </h3>
            <input
              type="text"
              onChange={onChangeCodeInputACB}
              placeholder="Enter code..."
              onKeyDown={handleKeyPressACB}
            />
            <button
              className="btn btn-primary"
              onClick={guestConnectToVotingSessionACB} 
            >
              {" "}
              Join voting session{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  function userLogInACB() {
    props.userLogInOnClick();
  }

  function onChangeCodeInputACB(event) {
    props.onChangeCodeInput(event.target.value);
  }

  function guestConnectToVotingSessionACB() {
    props.onGuestConnectToVotingSession();
  }

  function handleKeyPressACB(event) {
    if (event.key === 'Enter') {
        props.onGuestConnectToVotingSession();
    }
}
}
