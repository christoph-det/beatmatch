# DH2642 Project - Group 2

## Deployed version

URL: https://kth-project-det-eme-hum-sof.web.app/

## How to run locally

 - Install packages: `npm install`

- Run development server: `npm run dev`

- Connect to Spotify with the following test Spotfiy account:

| Spotify account details |  |
|--|--|
| Username | hello@chdethloff.at |
| Password  | Nastiness1-Dismiss-Ability |

- Log in with the following test BeatMatch account:

| Beatmatch account details (the same credentials as the Spotify account) |  |
|--|--|
| Username | hello@chdethloff.at |
| Password  | Nastiness1-Dismiss-Ability |


## BeatMatch - What is it?

The idea of the app is to let users create a playlist with their friends by choosing an existing playlist from a Spotify account, and then voting to choose whether a song should stay in the playlist. After the voting session, the users will be able to export the new playlist to Spotify, and the order of this new playlist is determined by how many votes each song got. The higher to total number of votes a song got, the higher up the song will be in the new playlist. Songs with a negative total number of votes will not be in the new playlist. 

The app has two user modes: host and guest.

A host creates needs to connect their Spotify account and then create an account in or app. When the host is logged in, they can then create a party from one of their Spotify playlists, and then invite guests by sharing a party code. Directly when a party is created, a guest can join it and start voting too. The user doesn't need to connect to Spotify.

During the voting session, it is also possible to see the current playlist in a table with all the votes for the different songs. This is possible for both guests and the host.

When the voting session is done, the host can export the new playlist to Spotify. The host can do whatever they please with it, just like a normal Spotify playlist.

## Third party component
We have used a third party component that renders voting card in the voting page view (`votingpageView.jsx`). The third party component has the option to adds positive and negative action buttons that makes the current voting card 'swipe away' from the screen. It also has the feature that the user can swipe the actual card with their finger (on mobile) or with the mouse pointer. This also makes the voting card 'swipe away'. Finally, the third party component keeps track of when the user has voted for all songs, which we use to change to the voting done view (`votingDoneView.jsx`).  

The repository to the third party component can be found here, which includes a link to a demo: https://github.com/NativSibony/react-card-swiper 

## Project file structure 

- User tests
- public
- src
    - api
        - apiConfig.js
        - resovlePromise.js
        - spotifySource.js
    - assets
        - _bases.sccs
        - _classes.sccs
        - _media-queries.sccs
        - _utils.sccs
        - style.sccs
        - variables.sccs
    - components
        - alertDialog 
        - background
        - footer
        - getBack
        - homepage
        - landingpage
        - loggedIn
        - login
        - navigationbar
        - partyInformation
        - playlist
        - previousParty
        - profilepage
        - register
        - votingdone
        - votingpage
        - welcomepage 
    - firebase 
    - utils
    - DataModel.js
    - Root.jsx
    - index.jsx
    
.firebaserc and firebase.json - autogenerated, for firebase config
index.html - from minimal project setup
package.json - holds the project config and packages
vite.config.js - from minimal project setup

In the different folders under components we have view and presenter for each. In `assets`, you can find all the scss files. In `public`, you can find all the images and icons used in the app. In `User tests`, you can find detailed descriptions of the two user test review we did, and what we did based on our feedback. Pictures are also provided when applicable for better understanding. 

## Firebase Datamodel
```json
{
    "allParties": {
        "{partyID}": "{userID}" 
        // we need this to find the parties during voting as a guest
    },
    "users": {
        "{userID}": {
            "parties": {
               "{partyID}": {
                    "date": "{date}",
                    "partyname": "{partyname}",
                    "playlist": { 
                        // we save this in firebase so that a guest user does not have to connect their Spotify account
                        "{index}": {
                            "id", "{spotifyURI}",
                            "album": "{albumName}",
                            "albumCover": "{linkToAlbumCover}",
                            "artists": "{namesOfArtists}",
                            "name": "{songName}"
                        }
                    },
                    "userVotes": {
                        "{userID}": "{totalVotes}" 
                        // saves the total votes a user received in all time
                    },
                    "votes": {
                        "{spotifyTrackURI}": "{voteCount}" 
                        // can be positive or negative
                    }
                }
            }
        }
    }
}