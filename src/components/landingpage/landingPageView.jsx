export function LandingPageView(props) {
    return (
        <div className="mt-5 container bg-dark text-light p-5 rounded-3 bg-opacity-85">
        <div className="text-center">
            <h1 className="mb-3">Welcome to BeatMatch!</h1>
            <h2 className="mb-4">Create the best blend for your party!</h2>
            <p className="text-light">
                With BeatMatch, you can create a playlist that everyone at your party will love!
                A host connects their Spotify account and creates a playlist. Guests can then join the playlist with an invite code and vote on the songs they like.
            </p>
        </div>
        <div className="d-grid gap-2 col-6 mx-auto mt-5">
            <a className="link-welcom btn btn-primary btn-lg" href="#welcome">Get Started!</a>
        </div>
    </div>
    
    )


  }
  