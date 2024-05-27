import { NavigationBarView } from "./navigationbarView";
import { observer } from "mobx-react-lite";
import React, { useState } from 'react';

const NavigationBar = observer(function MenuBarRender(props) {

  // we are using component state here since there are bugs with bootstrap and react and this was the only way to make the burger menu work
  const [navbarIsOpen, setnavbarIsOpen] = useState(false);
  const currentPartyName = props.model.nameOfParty;
  return (
    <NavigationBarView
      onLogoutButtonClick={logoutButtonClick}
      username={props.model.username}
      isHost={props.model.isHost}
      isLoggedin={props.model.isLoggedIn}
      onSeePlaylist = {seeCurrentPlaylistACB}
      currentPlaylist = {props.model.currentPlaylist}
      currentPartyName={currentPartyName ? currentPartyName : "No party"}
      userId={props.model.firebaseUserId}
      navBarIsOpen={navbarIsOpen}
      toggleNavBarCollapse={onToggleColapsibleMenuACB}
    />
  );

  function logoutButtonClick() {
    props.model.logout();
  };

  function seeCurrentPlaylistACB(){
    props.model.votesUpdated = !props.model.votesUpdated;
    props.model.lookingPreviousParty = false;
  }

  function onToggleColapsibleMenuACB(){
    setnavbarIsOpen(!navbarIsOpen);
  } 
  
});

export { NavigationBar };
