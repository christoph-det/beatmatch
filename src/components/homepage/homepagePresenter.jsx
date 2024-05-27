import { observer } from "mobx-react-lite";
import { PreviousPartiesView } from "./previousPartiesView";
import { CreatePartyView } from "./createPartyView";
import React, { useState } from 'react';

const HomePage = observer(           
    function HomePageRender(props){
        const [showAllPlaylists, setShowAllPlaylists] = useState(false);
        const [showAllPrevious, setShowAllPrevious] = useState(false);

        return <div className="homepage-container">
                {renderPreviousParties()}
                {connected()}
            </div>;


        function renderPreviousParties(){
            if (props.model.parties.length === 0) return (
                <p className="text">
                    You never created any party with us... Create one!
                </p>);
            return (<PreviousPartiesView
                  parties={props.model.parties}
                  viewParty={viewPartyACB}
                  deleteParty={deletePartyACB}
                  showAllPrevious={showAllPrevious}
                  onShowAllPrev={onShowAllPrevACB}
                />
                );
        }
        function onShowAllPrevACB(){
          setShowAllPrevious(true);
        }

        function viewPartyACB(partyId) {
          props.model.setPreviousParty(partyId);
          window.location.href = "#playlistview";
        }

        function deletePartyACB(partyId) {
          props.model.openDialog("Are you sure you want to delete this party?", deletePartyACB);
          function deletePartyACB() {
            props.model.deleteParty(partyId);
          }
        }


        function connected(){
            if (!props.model.allPlaylistsPromiseState.promise || !props.model.isLoggedIn) {
                // if no promise
                return <div className="text-light">No data has been found... Try again!</div>;
              } else if (
                !props.model.allPlaylistsPromiseState.error &&
                !props.model.allPlaylistsPromiseState.data
              ) { return (
                  <img
                    className="m-auto d-block loading-spinner"
                    src="loading-spinner.gif"
                    alt="Loading"
                  />
                );} else if (props.model.allPlaylistsPromiseState.error) {
                // if error is truthy --> show error message
                return <div className="text-light">Error: {props.model.allPlaylistsPromiseState.error.toString() || ""} Try to log in and out again.</div>;
              } else { return (
                  <div>
                    <CreatePartyView
                      playlists={props.model.allPlaylistsPromiseState.data}
                      createParty={createPartyOnClickACB}
                      showAllPlaylists={showAllPlaylists}
                      onShowAllPlaylists={onShowAllPlaylistsACB}
                    />;
                  </div>
                );
                function createPartyOnClickACB(playlistId) {
                  props.model.createParty(playlistId);
                }
                function onShowAllPlaylistsACB(){
                  setShowAllPlaylists(true);
                }
              }
        }
    }
);

export { HomePage };