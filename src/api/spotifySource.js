import { SPOTIFY_URL_AUTHO, SPOTIFY_BASE_URL, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_URL_ACCOUNT, API_KEY } from './apiConfig';



function gotResponseACB(response) {
    if (response.status != 200 && response.status != 201) {
        throw new Error('Network request failed. Error: ' + response.status + ' ' + response.statusText);
    }
    return response.json();
}


export function getUserAuthCode(accessTokenRetrievedACB) {

    const WEBSITE_URL = window.location.origin;
    const generateRandomString = (length) => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    }

    var state = generateRandomString(16); // from documentation, for CSRF protection

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: SPOTIFY_CLIENT_ID,
        scope: 'user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public',
        redirect_uri: WEBSITE_URL + '/#loggedin',
        state: state,
        show_dialog: true,
    });

    const url = SPOTIFY_URL_ACCOUNT + params.toString();

    // Open the spotify login page
    const loginPopUp = window.open(url, 'Login with Spotify', 'location=no,height=570,width=520,status=yes');
    window.spotifyCallback = (payload) => {
        const returnURL = new URL(payload.href);
        const code = returnURL.searchParams.get('code');
        getAccessTokenFromCode(code);
    }

    function getAccessTokenFromCode(code) {
        const url = SPOTIFY_URL_AUTHO;
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET)
        }
        const body = 'grant_type=authorization_code&code=' + code + '&redirect_uri=' + WEBSITE_URL + '/#loggedin';
        const options = {
            method: 'POST',
            headers: headers,
            body: body
        };
        return fetch(url, options)
            .then(gotResponseACB)
            .then(extractResponseAccessTokenACB)
    }

    function extractResponseAccessTokenACB(json) {
        loginPopUp.close();
        accessTokenRetrievedACB(json);
        return json.access_token;
    }

}

function refreshUserToken(model) {
    const url = SPOTIFY_URL_AUTHO;
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET)
    }
    const body = 'grant_type=refresh_token' + "&client_id=" + SPOTIFY_CLIENT_ID + "&refresh_token=" + model.refreshToken;
    const options = {
        method: 'POST',
        headers: headers,
        body: body
    };
    return fetch(url, options)
        .then(gotResponseACB)
        .then(extractResponseRefreshTokenACB);

        function extractResponseRefreshTokenACB(json) {
            model.accessToken = json['access_token'];
            document.cookie = "beatmatch_spotify_token=" + model.accessToken + "; SameSite=Strict;Secure";
            model.accessTokenExpiry = Date.now() + (json['expires_in'] * 1000);
            document.cookie = "beatmatch_spotify_token_expiry_date=" + model.accessTokenExpiry + "; SameSite=Strict;Secure";
            return json;
        }
}

export function getUserProfileData(model) {
    return checkAccessToken(model.accessTokenExpiry, model).then(runGetUserProfileDataACB);
    function runGetUserProfileDataACB() { 
        const url = SPOTIFY_BASE_URL + '/me';
        const headers = {
            'Authorization': 'Bearer ' + model.accessToken
        }
        const options = {
            method: 'GET',
            headers: headers
        };

        return fetch(url, options).then(gotResponseACB).then(getUserProfileDataACB);

        function getUserProfileDataACB(json) {
            return json;
        }
    }
}


export function getPlaylistsArray(model) {
    return checkAccessToken(model.accessTokenExpiry, model).then(runGetPlaylistArrayACB);
    function runGetPlaylistArrayACB() {
        const url = SPOTIFY_BASE_URL + '/me/playlists';
        const headers = {
            'Authorization': 'Bearer ' + model.accessToken
        }
        const options = {
            method: 'GET',
            headers: headers
        };
        return fetch(url, options)
            .then(gotResponseACB)
            .then(getPlaylistsFromResponseACB);

        function getPlaylistsFromResponseACB(json) {
            return json.items;
        }
    }
}

export function getPlaylistInfo(playlistId, model) {
    return checkAccessToken(model.accessTokenExpiry, model).then(runGetPlaylistInfoACB);
    function runGetPlaylistInfoACB() {
        const url = SPOTIFY_BASE_URL + '/playlists/' + playlistId;
        const headers = {
            'Authorization': 'Bearer ' + model.accessToken
        }
        const options = {
            method: 'GET',
            headers: headers
        };
        return fetch(url, options)
            .then(gotResponseACB)
            .then(getPlaylistFromResponseACB);
    
        function getPlaylistFromResponseACB(json) {
            //Changed from voting so that the host gets to a page with invite code first
            return json;
        }
       }
}

export function createNewPlaylist(userId, playlistName, model) {
    return checkAccessToken(model.accessTokenExpiry, model).then(runCreateNewPlaylistACB);
    function runCreateNewPlaylistACB() {
        const url = SPOTIFY_BASE_URL + '/users/' + userId + '/playlists';
        const headers = {
            'Authorization': 'Bearer ' + model.accessToken,
            'Content-Type': 'application/json'
        };

        const body = JSON.stringify({
            name: playlistName,
            description: 'Created by BeatMatch',
            public: false
        });

        const options = {
            method: 'POST',
            headers: headers,
            body: body
        };

        return fetch(url, options)
            .then(gotResponseACB)
            .then(playListCreatedACB);

        function playListCreatedACB(json) {
            return json;
         }
    }
}


export function addTracksToPlaylist(playlistId, trackUris, model) {
    return checkAccessToken(model.accessTokenExpiry, model).then(runAddTracksToPLaylistACB);
    function runAddTracksToPLaylistACB() {
        const url = SPOTIFY_BASE_URL + '/playlists/' + playlistId + '/tracks';
        const headers = {
            'Authorization': 'Bearer ' + model.accessToken,
            'Content-Type': 'application/json'
        };

        const body = JSON.stringify({
            uris: trackUris
        });

        const options = {
            method: 'POST',
            headers: headers,
            body: body
        };

        return fetch(url, options)
            .then(gotResponseACB)
            .then(tracksAddedACB);
        
        function tracksAddedACB(json) {
            return json;
        }
    }
}

function checkAccessToken(expirationDate, model) {
    // check if the token is about to expire (in next 10s)
   if (expirationDate < Date.now() + 10000) {
        return refreshUserToken(model);
   } else {
        return Promise.resolve();
   }    
}