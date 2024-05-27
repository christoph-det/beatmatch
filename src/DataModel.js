import { resolvePromise } from './api/resolvePromise.js';
import * as spotSource from './api/spotifySource.js';
import { generateUniqueId, getTodaysDate, removeDuplicatesCB, sortPlaylist } from './utils/utilities.js';
import { createUser, loginUser, logoutUser, forgotPassword} from './firebase/firebaseModel.js';
import { extractSongInfoCB } from './utils/utilities.js';


const model = {
    isHost: false,

    // shows if the user is logged in to firebase account
    firebaseLoggedIn: false,
    firebaseLoginPromiseState: {},
    firebaseRegisterPromiseState: {},

    isLoggedIn: false,
    accessToken: null,
    refreshToken: null,
    accessTokenExpiry: null,

    partyInviteCode: null, // invite code of the party the guest is currently part of
    partyID: null, // ID of the party the guest is currently part of

    // for spotify auth
    currentAuthPromiseState: {}, 
    // for spotify user data
    currentUserProfilePromiseState: {},
    username: null,
    spotifyUserId: null,
    firebaseUserId: null,
    spotifyEmail: null,
    profilePictureURL: null,

    parties: [], // objects of all parties the host is part of

    currentPlaylist: [], // Current voting session 
    currentPartyID: null,
    currentSongCardInSession: null,


    crrentSongId: null,

    dateOfParty: null,
    nameOfParty: null,
    partyToDelete: null,

    currentSongPromiseState: {},
    currentPlaylistPromiseState: {},

    exportPlaylistPromiseState: {},
    addTracksPromiseState: {},

    allPlaylistsPromiseState: {},

    isDialogOpen: false,
    dialogMessage: "",

    onAccpetDialogRunACB: null,

    votesUpdated: false,

    previousPartyID: null,
    previousParty: {},
    previousPartyName: null,
    lookingPreviousParty: false,

    getPlaylistsFromSpotify() {
        // Get the playlists from spotify
        let prms = spotSource.getPlaylistsArray(this);
        resolvePromise(prms, this.allPlaylistsPromiseState);
    },

    getPartyById(id) {
        return this.parties.find(findPartyACB);
        function findPartyACB(party) {
            return party.partyID === id;
        }
    },

    openDialog(message, runACB = null) {
        this.dialogMessage = message;
        this.isDialogOpen = true;
        this.onAccpetDialogRunACB = runACB;
    },

    closeDialog(runCallback = false) {
        this.isDialogOpen = false;
        this.dialogMessage = "";
        if (runCallback && this.onAccpetDialogRunACB) {
            this.onAccpetDialogRunACB();
        }
        this.onAccpetDialogRunACB = null;
    },

    joinVotingSession() {
        this.isLoggedIn = true;
        this.isHost = false;
        this.currentSongCardInSession = 0;
    },

    logInSpotify(model = this) {
        let prms = spotSource.getUserAuthCode(accessTokenRetrievedACB); // Connect to spotify to get the user code

        function accessTokenRetrievedACB(data) {
            model.refreshToken = data['refresh_token'];
            model.accessToken = data['access_token'];
            document.cookie = "beatmatch_spotify_token=" + model.accessToken + "; SameSite=Strict;Secure";
            document.cookie = "beatmatch_refresh_token=" + model.refreshToken + "; SameSite=Strict;Secure";
            model.accessTokenExpiry = Date.now() + (data['expires_in'] * 1000);
            document.cookie = "beatmatch_spotify_token_expiry_date=" + model.accessTokenExpiry + "; SameSite=Strict;Secure";
            model.getPlaylistsFromSpotify();
            model.setUserProfileData();
        }
    },

    setUserProfileData(model = this) {
        let prms = spotSource.getUserProfileData(model);
        function userProfileLoadedACB(data) {
            if (data.images.length > 0) {
                model.profilePictureURL = data.images[data.images.length - 1].url;
            }
            model.username = data.display_name;
            model.spotifyEmail = data.email;
            model.spotifyUserId = data.id;
            if (!model.firebaseLoggedIn) {
                window.location.href = '/#login';
            } else {
                window.location.href = '/#allplaylists';
            }
        }
        resolvePromise(prms, this.currentUserProfilePromiseState, userProfileLoadedACB);
    },

    login(email, password, model = this) {
        const loginPromise = loginUser(email, password);
        resolvePromise(loginPromise, this.firebaseLoginPromiseState, firebaseLoginACB);
        function firebaseLoginACB() {
            //window.location.href = '/#allplaylists';
            model.isLoggedIn = true;
            model.isHost = true;
            document.cookie = "beatmatch_user_id=" + model.firebaseUserId + "; SameSite=Strict;Secure";
        }
    },

    register(email, password) {
        const registerPromise = createUser(email, password);
        resolvePromise(registerPromise, this.firebaseRegisterPromiseState, firebaseRegisterACB);
        function firebaseRegisterACB() {
            //window.location.href = '/#allplaylists';
            this.isLoggedIn = true;
            this.isHost = true;
            document.cookie = "beatmatch_user_id=" + model.firebaseUserId + "; SameSite=Strict;Secure";
        }
    },

    forgotPassword(model = this) {
        const promise = forgotPassword(this.spotifyEmail);
        resolvePromise(promise, this.firebaseLoginPromiseState, resetPasswordACB);
        function resetPasswordACB() {
            model.openDialog("Password reset email sent.");
        }
    },

    removePlaylist(playlistIdToRemove) {
        function shouldKeepPlaylistCB(playlist) {
            return playlist.id !== playlistIdToRemove;
        }
        this.playlists = this.playlists.filter(shouldKeepPlaylistCB);
    },

    createParty(playlistId, model = this) {
        let prms = spotSource.getPlaylistInfo(playlistId, model);
        resolvePromise(prms, this.currentPlaylistPromiseState, playlistLoadedACB);
        function playlistLoadedACB(data) {
            const uniqueIDs = [];
            model.currentPlaylist = data.tracks.items.filter(item => item.track).map(item => extractSongInfoCB(item.track))
            .filter(song => removeDuplicatesCB(song.id, uniqueIDs));
            model.currentPartyID = generateUniqueId();
            model.dateOfParty = getTodaysDate();
            model.nameOfParty = data.name;
            model.currentSongCardInSession = 0; //Maybe we want to have this someplace else
            const newParty = { // This is what will be saved in the firebase
                name: model.nameOfParty,
                date: model.dateOfParty,
                partyID: model.currentPartyID,
                playlist: model.currentPlaylist,
                votes:{},
            };
            model.parties = [...model.parties, newParty];
            window.location.href = '/#partyinfo';  
            //Save currentPartyId and the user, used to access userID when guest connects guest
        }
    },

    exportPlaylistToSpotify(partyNameToExport, playlistToExport, model = this) {
        let prms = spotSource.createNewPlaylist(this.spotifyUserId, partyNameToExport, model);
        resolvePromise(prms, this.exportPlaylistPromiseState, playlistCreatedACB);

        function playlistCreatedACB(data) {
            const playlistId = data.id;
            let playlist = sortPlaylist(playlistToExport);
            for (let i = 0; i < playlist.length; i++) {;
                if (playlist[i].vote < 0) {
                    playlist = playlist.slice(0, i);
                    break;
                }
            }
            const trackUris = playlist.map(extractSongIdsCB);
            let prms = spotSource.addTracksToPlaylist(playlistId, trackUris, model);
            resolvePromise(prms, model.addTracksPromiseState, playlistExportedACB);

            function playlistExportedACB() {
                model.openDialog("Playlist exported to Spotify! (It may take a few minutes to show up)");
            }

            function extractSongIdsCB(song) {
                return song.id;
            }
        }
    },

    deleteParty(partyIdToRemove) {
        function shouldKeepPartyCB(party) {
            return party.partyID !== partyIdToRemove;
        }
        this.parties = this.parties.filter(shouldKeepPartyCB);
        this.partyToDelete = partyIdToRemove;
    },

    setCurrentParty(partyId) {
        const currentParty = this.parties.find(findPartyByIdCB);
        this.currentPlaylist = currentParty.playlist;
        this.nameOfParty = currentParty.name;  
        this.dateOfParty = currentParty.date || getTodaysDate();
        this.currentPartyID = partyId;
        this.currentSongCardInSession = 0;
        this.votesUpdated = !this.votesUpdated;

        function findPartyByIdCB(party){
            return party.partyID == partyId;
        }
    },

    setPreviousParty(partyId) {
        const previousParty = this.parties.find(findPartyByIdCB);
        this.previousParty = previousParty.playlist;
        this.previousPartyName = previousParty.name;
        this.previousPartyID = partyId;
        this.lookingPreviousParty = true;
        this.votesUpdated = !this.votesUpdated;

        function findPartyByIdCB(party){
            return party.partyID == partyId;
        }
    },

    userSignedInACB(user) {
        this.firebaseUserId = user.uid;
        const spotifyTokenCookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith("beatmatch_spotify_token="))
            ?.split("=")[1];
        const refreshTokenCookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith("beatmatch_refresh_token="))
            ?.split("=")[1];
        const accessTokenExpiry = document.cookie
            .split("; ")
            .find((row) => row.startsWith("beatmatch_spotify_token_expiry_date="))
            ?.split("=")[1];
        const firebaseUserId = document.cookie
            .split("; ")
            .find((row) => row.startsWith("beatmatch_user_id="))
            ?.split("=")[1];
        if (spotifyTokenCookie) {
            this.accessToken = spotifyTokenCookie;
            this.refreshToken = refreshTokenCookie;
            this.accessTokenExpiry = accessTokenExpiry ?? 0;
            this.isLoggedIn = true;
            this.isHost = true;
            this.firebaseLoggedIn = true;
            if (firebaseUserId && firebaseUserId !== "null") {
                this.firebaseUserId = firebaseUserId;
            }
            this.setUserProfileData();
            this.getPlaylistsFromSpotify();
        }
    },

    logout() {
        this.isHost = false;
        this.firebaseLoggedIn = false;
        this.firebaseLoginPromiseState = {};
        this.firebaseRegisterPromiseState = {};
        this.isLoggedIn = false;
        this.accessToken = null;
        this.refreshToken = null;
        this.accessTokenExpiry = null;
        this.partyInviteCode = null;
        this.partyID = null;
        this.currentAuthPromiseState = {};
        this.currentUserProfilePromiseState = {};
        this.username = null;
        this.spotifyUserId = null;
        this.firebaseUserId = null;
        this.spotifyEmail = null;
        this.profilePicture = null;
        this.parties = [];
        this.currentPlaylist = [];
        this.currentPartyID = null;
        this.currentSongCardInSession = null;
        this.crrentSongId = null;
        this.dateOfParty = null;
        this.nameOfParty = null;
        this.currentSongPromiseState = {};
        this.currentPlaylistPromiseState = {};
        this.allPlaylistsPromiseState = {};
        this.exportPlaylistPromiseState = {};
        this.isDialogOpen = false;
        this.dialogMessage = "";
        this.onAccpetDialogRunACB = null;

        document.cookie = "beatmatch_spotify_token=; SameSite=None; Secure";
        document.cookie = "beatmatch_refresh_token=; SameSite=None; Secure";
        document.cookie = "beatmatch_user_id=; SameSite=None; Secure";
        document.cookie = "beatmatch_spotify_token_expiry_date=; SameSite=None; Secure";
        logoutUser();
    },

}

export { model }