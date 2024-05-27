export function UnvalidCodeView(props) {
    return (
        <div className="text-center container mt-5 bg-dark text-light p-5 rounded-3 bg-opacity-85">
              <h2 className="mb-4">There is no party with the code {props.partyInviteCode}, please try another code!</h2>
              <button onClick={backToStartACB} className="btn btn-danger goback-button">Go back</button>               
          </div>
    );

    function backToStartACB() {
        props.onBackToStart();
    }
}