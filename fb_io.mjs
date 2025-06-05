//**************************************************************/
// fb_io.mjs
// Firebase Project 
// Written by <Joseph Hijazeen>, Term 2 2025?
/**************************************************************/
const COL_C = 'white';	    // These two const are part of the coloured 	
const COL_B = '#CD7F32';	//  console.log for functions scheme
console.log('%c fb_io.mjs', 'color: blue; background-color: white;');
var FB_GAMEDB;
var fb_uid
/**************************************************************/
// Import all the methods you want to call from the firebase modules
import { 
    initializeApp 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

import { 
    getDatabase, 
    ref, 
    set, 
    get, 
    update,
    query,
    orderByChild,
    limitToFirst,
    onValue
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
/**************************************************************/
// EXPORT FUNCTIONS
// List all the functions called by code or html outside of this module
/**************************************************************/

function fb_initialise() {

    const FB_GAMECONFIG = {
        apiKey: "AIzaSyCtqOoxnHxsj7vs-AfrD8vo-20mA5Sq17A",
        authDomain: "comp-2025-joseph.firebaseapp.com",
        databaseURL: "https://comp-2025-joseph-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "comp-2025-joseph",
        storageBucket: "comp-2025-joseph.firebasestorage.app",
        messagingSenderId: "85501129840",
        appId: "1:85501129840:web:79c64e1947643f22bc70b5",
        measurementId: "G-BEE5KXTKTT"
    };

    const FB_GAMEAPP = initializeApp(FB_GAMECONFIG);
    FB_GAMEDB  = getDatabase(FB_GAMEAPP);
    console.info(FB_GAMEDB);     
    console.log('%c fb_initialise(): ', 'color: ' + COL_C + '; background-color: ' + COL_B + ';');
}

function fb_authenticate(){
    console.log('%c fb_authenticate(): ', 'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    const AUTH = getAuth();
    const PROVIDER = new GoogleAuthProvider();
    signInWithPopup(AUTH, PROVIDER).then((result) => {
       fb_uid = result.user.uid;
        console.log(result.user.uid);
        console.log(result);
        console.log("Authentication successful");
    })
    .catch((error) => {
        //❌ Code for an authentication error goes here
        console.log("Authentication unsuccessful");
        console.log(error);
    });
    PROVIDER.setCustomParameters({
        prompt: 'select_account'
    });

}

export { 
    fb_initialise,
    fb_authenticate
};
