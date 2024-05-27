import { observer } from "mobx-react-lite";
import { LoginPageView } from "./loginView";

const LoginPage = observer(function LoginPageRenderer(props) {
    if (props.model.isHost) {
        window.location.href = "#allplaylists";
    } else if (props.model.isLoggedIn) {
        window.location.href = "#voting";
    } else if (
        props.model.firebaseLoginPromiseState && !props.model.firebaseLoginPromiseState.error &&
        !props.model.firebaseLoginPromiseState.data && props.model.firebaseLoginPromiseState.promise && !props.model.firebaseLoginPromiseState.isDone
      ) { return (
          <img
            className="m-auto d-block loading-spinner"
            src="loading-spinner.gif"
            alt="Loading"
          />
        );} else if (props.model.firebaseLoginPromiseState && props.model.firebaseLoginPromiseState.error) {
        // if error is truthy --> show error message
        return (
            <LoginPageView
              email={props.model.spotifyEmail}
              onClickLogin={onLoginlACB}
              onEmailChanged={onEmailChangedACB}
              error={props.model.firebaseLoginPromiseState.error}
              username={props.model.username}
              onForgetPasswordClick={onForgetPasswordACB}
            />
        );
      } else {
        
        return (
            <LoginPageView
              email={props.model.spotifyEmail}
              onClickLogin={onLoginlACB}
              onEmailChanged={onEmailChangedACB}
              error={null}
              username={props.model.username}
              onForgetPasswordClick={onForgetPasswordACB}
            />
          );
      }
  
  function onEmailChangedACB(value) {
    props.model.spotifyEmail = value;
  }

  function onForgetPasswordACB() {
    props.model.forgotPassword();
  }

  function onLoginlACB() {
    const password = document.getElementById("passwordInput").value;
    const email = document.getElementById("emailInput").value;
    props.model.login(email, password);
  }
});

export { LoginPage };
