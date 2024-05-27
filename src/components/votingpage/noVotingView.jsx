export function NoVotingView(props) {
    return (
        <div className="text-center container mt-5 bg-dark text-light p-5 rounded-3 bg-opacity-85">
            <h2 className="mb-4">No data has been found... Try again!</h2>
            <a href="#allplaylists" className="btn btn-danger goback-button">Go back</a>               
        </div>
    )
}