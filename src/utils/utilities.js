export function generateUniqueId() {
    // This function generates a unique id for the party
    let longID = Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    // Make ID shorter
    return longID.substr(5, 6);
}
export function getTodaysDate(){
    const date = new Date();
    let fulldate = date.getDate()+ "-" + (date.getMonth()+1) + "-" +date.getFullYear();
    return fulldate;
}

//Sorts in descending order
export function comapreVotesCB(songA, songB){
    if(songA.vote > songB.vote){
        return -1;
    }
    else if(songA.vote < songB.vote){
        return 1;
    }
    else{
        return 0;
    }
}

export function extractSongInfoCB(song) {
    return {
        id: song.uri,
        name: song.name,
        artists: song.artists.map(artist => artist.name).join(", "),
        album: song.album.name,
        albumCover: song.album.images[0].url,   
                        
    }
}

export function removeDuplicatesCB(songId, uniqueIDs){
    if(uniqueIDs.includes(songId)){
        return false;
    }
    else{
        uniqueIDs.push(songId)
        return true;
    }
}
export function sortPlaylist(playlist){
    if (!playlist) {
        return [];
    }
    if (playlist.length === 0 || playlist.length === undefined )  {
        return [];
    }
    
    return [...playlist].sort(comapreVotesCB);
}

export function generateInvitationText(partyCode){
    return `Join my party on BeatMatch with the code: ${partyCode}\nVisit: https://kth-project-det-eme-hum-sof.web.app/#welcome`;
}