export function LoginPageView(props) {
    return (
        <div className="mt-5 container bg-dark text-light p-5 rounded-3 bg-opacity-85">
        <div className="text-center">
            <h1 className="mb-3">Welcome to BeatMatch, {props.username}!</h1>
            <h3 className="mb-1">We use the email from your Spotify account but feel free to change it, if you want.</h3>
            <a className="link-welcom btn btn-secondary btn-lg m-auto mt-4 mb-2" href="#register">New to BeatMatch? - Register your account!</a>
            <h3 className="mb-2">or login here:</h3>
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
                    onKeyDown={handleKeyPressACB}
                />
            </form>
            {props.error ? <p className="text-danger">Password is incorrect or user does not exist!</p> : null}
        </div>
        <div className="d-grid gap-2 col-6 mx-auto mt-5">
            <a className="link-welcom btn btn-primary btn-lg w-50 m-auto" onClick={loginACB}>Login!</a>
            <a className="text-center link-secondary pw-forgotten-link mt-3" onClick={onForgetPasswordClickACB}>Forgot Password? - Enter email and then click here.</a>
        </div>
        
    </div>
    
    )

    function onForgetPasswordClickACB(event) {
        props.onForgetPasswordClick();
    }

    function onEmailInputChangeACB(event) {
        props.onEmailChanged(event.target.value);
    }

    function loginACB() {
        props.onClickLogin();
    }

    function handleKeyPressACB(event) {
        if (event.key === 'Enter') {
            props.onClickLogin();
        }
    }
}
  