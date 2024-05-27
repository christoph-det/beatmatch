import { observer } from "mobx-react-lite";
import { WelcomePageView } from "./welcomepageView";

const WelcomePage = observer(function WelcomePageRender(props) {
  if (props.model.isHost) {
    window.location.href = "#allplaylists";
  } else if (props.model.isLoggedIn && props.model.userId) {
    window.location.href = "#voting";
  } 
  return (
    <div>
      <WelcomePageView
        userLogInOnClick={userLogInACB}
        logInBtn={props.model.isLoggedIn ? "Go to playlist" : "Connect to Spotify"}
        onChangeCodeInput={onChangeCodeInputACB}
        onGuestConnectToVotingSession={guestConnectToVotingSessionACB}
      />
    </div>
  );

  function onChangeCodeInputACB(codeText) {
    props.model.partyInviteCode = codeText;
  }

  function guestConnectToVotingSessionACB() {
    if (props.model.partyInviteCode) {
      props.model.joinVotingSession();
      window.location.href = "#voting";
    }
  }

  function userLogInACB() {
    if (props.model.isLoggedIn) {
      window.location.href = "/#allplaylists";
      return;
    }
    props.model.logInSpotify();
  }

});

export { WelcomePage };
