import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";



function logOut(auth) {
    signOut(auth);
}

function createEmailAccount(auth, email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
    //sendEmailVerification(auth.currentUser);
}

function logInWithEmail(auth, email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

/// Returns the current user or null if there is none (undefined if the user is not yet loaded)
function getCurrentUser() {
    return auth.currentUser;
}

function resetPassword(auth, email) {
    return sendPasswordResetEmail(auth, email);
}


export { logOut, createEmailAccount, logInWithEmail, resetPassword, getCurrentUser };
