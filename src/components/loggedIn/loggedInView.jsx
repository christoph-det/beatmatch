export function LoggedInView(props) {
    return (
        <div>
          {window.opener.spotifyCallback(window.location)}
        </div>
    );
}