import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, increment, push, remove } from "firebase/database";
import { getAuth } from "firebase/auth";
import { createEmailAccount, logInWithEmail, logOut, resetPassword } from "./firebaseAuth";


// Add relevant imports here 
import { firebaseConfig } from "./firebaseConfig";


// Initialise firebase app, database, ref
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const PATH = "beatMatch";

function createUser(email, password) {
    return createEmailAccount(auth, email, password);
}

function loginUser(email, password) {
    return logInWithEmail(auth, email, password);
}

function logoutUser() {
    logOut(auth);
}

function forgotPassword(email) {
    return resetPassword(auth, email);
}

function getAuthObject() {
    return auth;
}

function modelToPersistence(model){
    let persistenceObject = {};
    persistenceObject.playlist = model.currentPlaylist;
    persistenceObject.date = model.dateOfParty;
    persistenceObject.partyname = model.nameOfParty;
    return persistenceObject;
}


function persistenceToModel(persistenceObject, model) {
    if(!model.isHost){
        if (!model.firebaseUserId){
            model.firebaseUserId = persistenceObject ?? null;
        }
        model.currentPlaylist = persistenceObject?.playlist ?? [];
        model.nameOfParty = persistenceObject?.partyname ?? null;
        model.dateOfParty = persistenceObject?.date ?? null;
        
    }
    else{
        Object.entries(persistenceObject ?? []).map(saveAsParty);
    }
    
    function saveAsParty(party){
        const newParty = {
            partyID: party[0],
            playlist: party[1].playlist,
            name: party[1].partyname,
            date: party[1].date,
            votes:{},
            userVotes:party[1].userVotes
        };
        model.parties = [...model.parties, newParty];
    }
}

function saveToFirebase(model){
    const userRef = ref(db, PATH + "/users/" + model.firebaseUserId + "/parties/" + model.currentPartyID);
    const userRef1 = ref(db, PATH + "/allParties/" + model.currentPartyID);
    if (model.ready) {
        set(userRef, modelToPersistence(model));
        set(userRef1, model.firebaseUserId);
    }
}

function deleteFromFirebase(model){
    const userRef1 = ref(db, PATH + "/users/" + model.firebaseUserId + "/parties/" + model.partyToDelete);
    remove(userRef1);
    const userRef2 = ref(db, PATH + "/allParties/" + model.partyToDelete)
    remove(userRef2);
    
}

export function getHostIdOfParty(partyId, model) {
    model.ready = false;
    const userRef = ref(db, PATH + "/allParties/" + partyId);
    return get(userRef).then(gotDataACB).then(setModelReadyACB);

    function gotDataACB(snapshot) {
        return persistToModel(snapshot.val(), model);
    }
    function persistToModel(persObj, model) {
        model.firebaseUserId = persObj;
    }
    function setModelReadyACB() {
        model.ready = true;
    }
}

function readFromFirebase(model){
    model.ready = false;
    let userRef;

    if(model.isHost){
        userRef = ref(db, PATH + "/users/" + model.firebaseUserId + "/parties/");
    }
    else{
        if (!model.firebaseUserId){
            userRef = ref(db, PATH + "/allParties/" + model.partyInviteCode);
        } else{
            userRef = ref(db, PATH + "/users/" + model.firebaseUserId + "/parties/" + model.partyInviteCode);
        }
    }
    return get(userRef).then(gotFirebaseDataACB).then(setModelReadyACB);

    function gotFirebaseDataACB(snapshot){
        return persistenceToModel(snapshot.val(), model);
    }
    
    function setModelReadyACB() {
        model.ready = true;
    }
}

function connectToFirebase(model, watchFunction){

    // Save the model to firebase whenever model’s numberOfGuests, dishes or currentDish change!
    watchFunction(checkModelChangeACB, saveToFirebaseACB);

    watchFunction(needToReadWatchFunctionACB, readFromFirebaseACB);

    watchFunction(checkModelChangeDeleteACB, deleteFromFirebaseACB);

    watchFunction(checkModelChangeVotesACB, getVotesACB);

    function checkModelChangeVotesACB(){
        // When we want call getVotes
        return [model.votesUpdated];
    }

    function checkModelChangeDeleteACB(){
        // When we want to delete a party
        return [model.partyToDelete];
    }
    
    function checkModelChangeACB(){
        // When we want to save the model
        return [model.currentPartyID, model.nameOfParty]; // Values here are the values that are watched and will trigger a save to firebase
    }

    function needToReadWatchFunctionACB(){
        // When we want to read from firebase
        if(model.isLoggedIn){
            return [model.firebaseUserId, model.partyInviteCode, model.isLoggedIn, model.isHost]; // Values here are the values that are watched and will trigger a save to firebase
        }
        else{
            return [model.partyInviteCode, model.isHost];
        }
    }
    
    function deleteFromFirebaseACB(){
        deleteFromFirebase(model);
    }

    function readFromFirebaseACB(){
        readFromFirebase(model);
    }

    function saveToFirebaseACB(){
        saveToFirebase(model);
    }

    function getVotesACB(){
        getVotes(model, !model.lookingPreviousParty)
    }
}

function increaseVote(model, songID) {
    // Change the path depending on host or not
    let partyId = model.isHost ? model.currentPartyID : model.partyInviteCode;
    const userRef = ref(db, PATH + "/users/" + model.firebaseUserId + "/parties/" + partyId + "/votes/" + songID);
    const userRefTotalVotes = ref(db, PATH + "/users/" + model.firebaseUserId + "/parties/" + partyId + "/userVotes/" + model.firebaseUserId);
    set(userRef, increment(1));
    set(userRefTotalVotes, increment(1));
}

function decreaseVote(model, songID) {
    let partyId = model.isHost ? model.currentPartyID : model.partyInviteCode;
    const userRef = ref(db, PATH + "/users/" + model.firebaseUserId + "/parties/" + partyId + "/votes/" + songID);
    const userRefTotalVotes = ref(db, PATH + "/users/" + model.firebaseUserId + "/parties/" + partyId + "/userVotes/" + model.firebaseUserId);
    set(userRef, increment(-1));
    set(userRefTotalVotes, increment(1));
}

function persistenceToModelVotes(persistenceObject, model, current) {
    let playlist;
    if (current){
        playlist = model.currentPlaylist || [];
        model.currentPlaylist = playlist.map(matchIdtovotesCB);
    }
    else{
        playlist = model.previousParty || [];
        model.previousParty = playlist.map(matchIdtovotesCB);
    }
    
    function matchIdtovotesCB(song){
        const votes = persistenceObject?.[song.id] ?? null;
        return {
            ...song,
            vote: votes
        }
    }    
}


function getVotes(model, current=true){
    let partyId;
    if (current){
        partyId = model.isHost ? model.currentPartyID : model.partyInviteCode;
    }else{
        partyId = model.previousPartyID;
    }
    const userRef = ref(db, PATH + "/users/" + model.firebaseUserId + "/parties/" + partyId + "/votes/" );
    model.ready = false;
    return get(userRef).then(gotFirebaseDataACB).then(setModelReadyACB);

    function gotFirebaseDataACB(snapshot){
        return persistenceToModelVotes(snapshot.val(), model, current);
    }
    
    function setModelReadyACB() {
        model.ready = true;
        model.lookingPreviousParty = false;
    }
}


// Remember to uncomment the following line:
export { forgotPassword, connectToFirebase, modelToPersistence, persistenceToModel, saveToFirebase, readFromFirebase, createUser, loginUser, logoutUser, getAuthObject, increaseVote, decreaseVote, getVotes}
