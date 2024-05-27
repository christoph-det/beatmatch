export function RegisterPageView(props) {
    
    return (
        <div className="mt-5 container bg-dark text-light p-5 rounded-3 bg-opacity-85">
        <div className="text-center">
            <h1 className="mb-3">Welcome to BeatMatch, {props.username}!</h1>
            <h3 className="mb-1">We use the email from your Spotify account but feel free to change it, if you want.</h3>
            <a className="link-welcom btn btn-secondary btn-lg m-auto mt-4 mb-2" href="#login">Already have an account? - Back to Login!</a>
            <h3 className="mb-2">Register here:</h3>
            <form>
            <input
              className="mx-2"
                id="emailInput"
                type="normal"
                placeholder="Email"
                defaultValue={props.email}
                onChange={onEmailInputChangeACB}
            />
            <input
                className="mx-2 mt-2"
                id="passwordInput"
                type="password"
                placeholder="Password"
            />
             <input
                className="mx-2 mt-2"
                id="passwordInputConfirm"
                type="password"
                placeholder="Confirm Password"
                onKeyDown={handleKeyPressACB}
            />
            </form>
            <button onClick={seePasswordOnClickCB} className="btn btn-secondary btn-lg link-welcom m-auto mx-2 mt-3 fs-3">See password</button>
            {props.errorMessage ? <p className="text-danger">{props.errorMessage}</p> : null}
        </div>
        <div className="d-grid gap-2 col-6 mx-auto mt-5">
            <a className="link-welcom btn btn-primary btn-lg w-50 m-auto" onClick={registerACB}>Register!</a>
        </div>
    </div>
    )

    function registerACB() {
        props.onClickRegister();
    }

    function onEmailInputChangeACB(event) {
        props.onEmailChanged(event.target.value);
    }

    function seePasswordOnClickCB() {
        const passwordInput = document.getElementById("passwordInput");
        const passwordInputConfirm = document.getElementById("passwordInputConfirm");
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            passwordInputConfirm.type = "text";
        } else {
            passwordInput.type = "password";
            passwordInputConfirm.type = "password";
        }
    }

    function handleKeyPressACB(event) {
        if (event.key === 'Enter') {
            props.onClickLogin();
        }
    }
}
  