export function NavigationBarView(props) {
  // For working conditional rendering (will make using window.location.hash for conditional rendering work)

  function generateNavBarButton(text, href, onClick, activeCond) {
    // not working as intended at the moment, so alwys set to false
    activeCond = false;
    return (
      <li className={`nav-item ${href == "#profile" ? "ms-auto-lg" : ""}`}>
        <a
          className={`btn btn-secondary mx-3 my-2 py-2 ${activeCond ? 'active' : ''}`}
          href={href}
          onClick={onClick}
          aria-pressed={activeCond}
          disabled={activeCond}
        >
          {text}
        </a>
      </li>
    );
  }


  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

        {/* Logo and name */}
        <div className="logo-and-name-container navbar-brand">
          <a href={props.isHost ? "#allplaylists" : (props.isLoggedin ? "#playlist" : "#")}>
            <img height={60} className=" rounded" src="logo.jpg"></img>
            <span className="ms-4">BeatMatch</span>
          </a>
        </div>

        
          <button
            className={`navbar-toggler mr-3 my-2 my-lg-0 me-5 py-2 ${!props.isLoggedin ? "d-none-xs" : ""}`}
            type="button" 
            onClick={onColapsibleMenuClickACB}
          >
              <span className="navbar-toggler-icon"></span>
          </button>

        

        {/* BUTTONS */}
        <div className={`collapse navbar-collapse ${props.navBarIsOpen ? 'show' : ''}`} id="navbarSupportedContent">
          <ul className="navbar-nav w-100">

            {/* Home button */}
            {(props.isHost && props.isLoggedin) && 
              generateNavBarButton("Home", "#allplaylists", null, (window.location.hash === "#allplaylists"))}

            {/* Current Playlist button */}
            {(props.isLoggedin && window.location.hash !== "#welcome" && props.userId) &&
              generateNavBarButton("Current Party: " + props.currentPartyName, "#playlist", showPlaylistClickACB, (window.location.hash === "#playlist"))}
              
            {/* Voting button */}
            {(props.isLoggedin && window.location.hash !== "#welcome" && props.userId) &&
              generateNavBarButton("Voting", "#voting", showPlaylistClickACB, (window.location.hash === "#voting"))}

            {/* Profile Button*/}
            {(props.isHost) &&
            generateNavBarButton(`Profile: ${props.username}`, "#profile", null, (window.location.hash == "#profile"))}
          
            {/* Logout/Back-to-Start button */}
            {props.isLoggedin ? (
            (props.isHost) ? (
              <li className="nav-item">
                <a
                  href="#"
                  onClick={logoutClickACB}
                  className="btn btn-danger mx-3 my-2 py-2"
                >
                  Logout
                </a>
              </li>
                
            ) : (
              <li className="nav-item ms-auto-lg">
                <a
                href="#"
                onClick={logoutClickACB}
                className="btn btn-danger mx-3 my-2 py-2"
              >
                Back to start
              </a>
              </li>
            )
          ) : null}
          </ul>
        </div>
      </nav>
    </div>
  );

  // display different items based on login status and guest / host mode

  function logoutClickACB() {
    props.onLogoutButtonClick();
  }

  function showPlaylistClickACB(){
    props.onSeePlaylist();
  }

  function onColapsibleMenuClickACB(){
    props.toggleNavBarCollapse();
  }

}

