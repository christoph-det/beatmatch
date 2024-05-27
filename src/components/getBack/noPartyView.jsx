export function NoPartyView(props) {
    return (
        <div className="text-center container mt-5 bg-dark text-light p-5 rounded-3 bg-opacity-85">
              <h2 className="mb-4">You don't have a current party to look at...</h2>
              <a href="#allplaylists" className="btn btn-danger goback-button">Go back</a>               
          </div>
      );
}