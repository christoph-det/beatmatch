import { observer } from "mobx-react-lite";
import { ProfilePageView } from "./profilepageView";

const ProfilePage = observer(function ProfilePageRender(props) {
  if (!props.model.currentUserProfilePromiseState.promise) {
    // if no promise
    return (
      <div className="text-light">No data has been found... Try again!</div>
    );
  } else if (
    !props.model.currentUserProfilePromiseState.error &&
    !props.model.currentUserProfilePromiseState.data
  ) {
    // if pending
    return (
      <img
        className="m-auto d-block loading-spinner"
        src="loading-spinner.gif"
        alt="Loading"
      />
    );
  } else if (props.model.currentUserProfilePromiseState.error) {
    // if error is truthy --> show error message
    return <div>Error: {props.currentUserProfilePromiseState.error.toString()}</div>;
  } else {
    const numberOfPlaylists = props.model.allPlaylistsPromiseState.data.length;

    const totalVotes = props.model.parties.reduce(accumulateTotalVotesCB, 0);

    function accumulateTotalVotesCB(currentValue, party) {
      return currentValue + Object.values(party.userVotes ?? {}).reduce(accumulateVotesCB, 0);
    }

    function accumulateVotesCB(currentValue, votes) {
      return currentValue + votes;
    }

    return (
      <div>
        <ProfilePageView
          username={props.model.username}
          numberOfPlaylists={numberOfPlaylists >= 50 ? "50+" : numberOfPlaylists}
          profilePictureURL={props.model.profilePictureURL}
          numberOfParties={props.model.parties.length}
          numberOfVotes={totalVotes}
        />
        ;
      </div>
    );

  
  }
});

export { ProfilePage };
