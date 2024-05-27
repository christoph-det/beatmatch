import { observer } from "mobx-react-lite";
import { RegisterPageView } from "./registerView";

const RegisterPage = observer(function RegisterPageRender(props) {
  if (props.model.isHost) {
    window.location.href = "#allplaylists";
  } else if (props.model.isLoggedIn) {
    window.location.href = "#voting";
  } else if (
    props.model.firebaseRegisterPromiseState &&
    !props.model.firebaseRegisterPromiseState.error &&
    !props.model.firebaseRegisterPromiseState.data &&
    props.model.firebaseRegisterPromiseState.promise
  ) {
    return (
      <img
        className="m-auto d-block loading-spinner"
        src="loading-spinner.gif"
        alt="Loading"
      />
    );
  } else if (
    props.model.firebaseRegisterPromiseState &&
    props.model.firebaseRegisterPromiseState.error
  ) {
    let errMsg = "";
    // only show part between : and (
    switch (props.model.firebaseRegisterPromiseState.error.code) {
      case "auth/email-already-in-use":
        errMsg = "Email is already in use. Plase login instead.";
        break;
      case "auth/invalid-email":
        errMsg = "The email you provided is invalid.";
        break;
      case "auth/weak-password":
        errMsg = "Password is too weak. Use at least 6 characters.";
        break;
      default:
        errMsg = "Unknown error. Please try again.";
        break;
    }
    return (
      <RegisterPageView
        email={props.model.spotifyEmail}
        onClickRegister={onRegisterACB}
        onEmailChanged={onEmailChangedACB}
        errorMessage={errMsg}
        username={props.model.username}
      />
    );
  } else {
    return (
      <RegisterPageView
        email={props.model.spotifyEmail}
        onClickRegister={onRegisterACB}
        onEmailChanged={onEmailChangedACB}
        error={null}
        username={props.model.username}
      />
    );
  }

  function onEmailChangedACB(value) {
    props.model.spotifyEmail = value;
  }

  function onRegisterACB() {
    const password = document.getElementById("passwordInput").value;
    const confirmPassword = document.getElementById(
      "passwordInputConfirm"
    ).value;
    if (password !== confirmPassword) {
      props.model.openDialog("Passwords do not match.");
      return;
    }
    const email = document.getElementById("emailInput").value;
    props.model.register(email, password);
  }
});

export { RegisterPage };
