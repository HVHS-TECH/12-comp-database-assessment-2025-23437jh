//**************************************************************/
// fb_io.mjs
// Firebase Project 
// Written by <Joseph Hijazeen>, Term 2 2025?
/**************************************************************/
const COL_C = 'white';	    // These two const are part of the coloured 	
const COL_B = '#CD7F32';	//  console.log for functions scheme
console.log('%c fb_io.mjs', 'color: blue; background-color: white;');
var FB_GAMEDB;
var fb_uid;
var fb_email;
fb_initialise(); // Initialise the Firebase app when this module is loaded
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
        // firebase data
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
    FB_GAMEDB = getDatabase(FB_GAMEAPP);
    console.info(FB_GAMEDB);
    //console.log('%c fb_initialise(): ', 'color: ' + COL_C + '; background-color: ' + COL_B + ';');

    const saved_uid = localStorage.getItem("fb_uid");
    const saved_email = localStorage.getItem("fb_email");

    if (saved_uid && saved_email) {
        fb_uid = saved_uid;
        fb_email = saved_email;
        console.log("User already logged in with UID: " + fb_uid + " and Email: " + fb_email);
}
 const AUTH = getAuth();
    onAuthStateChanged(AUTH, (user) => {
        if (user) {
            // User is signed in.
            fb_uid = user.uid;
            fb_email = user.email;
            localStorage.setItem("fb_uid", fb_uid);
            localStorage.setItem("fb_email", fb_email);
            console.log("User is signed in with UID: " + fb_uid + " and Email: " + fb_email);
        } else {
            // User is signed out.
            console.log('bad stuff');
           
        }
    });
console.log(FB_GAMEDB);
console.log('%c fb_initialise(): ', 'color: ' + COL_C + '; background-color: ' + COL_B + ';');
}

function fb_authenticate() {

    console.log('%c fb_authenticate(): ', 'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    const AUTH = getAuth();
    const PROVIDER = new GoogleAuthProvider();
    signInWithPopup(AUTH, PROVIDER).then((result) => {
        //✅ Code for a successful authentication goes here
        fb_uid = result.user.uid;
        fb_email = result.user.email;
        console.log(result.user.uid);
        console.log(result.user.email);
        console.log(result);
        console.log("Authentication successful");

        localStorage.setItem("fb_uid", fb_uid);
        localStorage.setItem("fb_email", fb_email);
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

// Get email from the result concole log
function fb_writeto() {
    var name = document.getElementById("name").value;
    var age = document.getElementById("age").value;
    const dbReference = ref(FB_GAMEDB, ("Users/" + fb_uid));
    var User = { Name: name, age: age, Email: fb_email };

    set(dbReference, User).then(() => {
        console.log("Data sucessfully sent to Database");
        console.log(name);
        console.log(age);
        console.log(fb_email);
        console.log(User);
    }).catch((error) => {
        console.log(error);
        console.log("Error happened");
    });
}
// Function to write the score to the database
function fb_writeScore(Score){
    // if there is no uid or email it wont save the score to data base 
    if(!fb_uid || !fb_email || typeof Score !== 'number') {
      console.log("can't save score data missing:",{
        fb_uid: fb_uid,
        fb_email: fb_email,
        score: Score,
        vaildscore: typeof Score === 'number'
      });
      return false;
    }
    const dbReference = ref(FB_GAMEDB, ("/Scores/"+ fb_uid));
    // stores data in the database under the path Scores/UserID
    const scoreData = { 
    score: Score,
    fb_uid: fb_uid,
    };
    set(dbReference, scoreData)
    .then(() =>{ console.log ("score saved for ", fb_uid);
    return true;
})
.catch(error =>{
    console.log("error writing score: ", error)
    return false;
});
}
// function to read the scores from data base and put them on fire base 
function fb_readScore() {
    const scoreRef = ref(FB_GAMEDB, 'Scores');
    const scoreQuery = query(scoreRef, orderByChild('score'), limitToFirst(10));

    onValue(scoreQuery, (scoresSnapshot) => {
        const leaderboardDiv = document.getElementById("Leaderboard");

        if (scoresSnapshot.exists()) {
            const usersRef = ref(FB_GAMEDB, 'Users');
            onValue(usersRef, (usersSnapshot) => {
                if (usersSnapshot.exists()) {
                    const leaderboardData = [];
                    scoresSnapshot.forEach(scoreChild => {
                        const userid = scoreChild.key;
                        const userData = usersSnapshot.child(userid).val();

                        if (userData) {
                            leaderboardData.push({
                                name: userData.Name || "unknown",
                                score: scoreChild.val().score
                            });
                        }
                    });
                    leaderboardData.sort((a, b) => b.score - a.score);
                    let html = '<table><tr><th>Leaderboard</th></tr>';
                    leaderboardData.slice(0, 10).forEach((player, index) => {
                        // html for the leader board 
                        html += `<tr>
                            <td>${index + 1}</td>
                            <td>${player.name}</td>
                            <td>${player.score}</td>
                        </tr>`;
                    });
                    html += '</table>';

                    leaderboardDiv.innerHTML = html;
                } else {
                    leaderboardDiv.innerHTML = '<p>No user data found.</p>';
                }
            });
        }
    });
}




//
//function fb_write() {
   // var name = document.getElementById("name").value;
 //   var favoriteFruit = document.getElementById("favoriteFruit").value;
  //  var fruitQuantity = document.getElementById("fruitQuantity").value;
  //  const dbReference = ref(FB_GAMEDB, "UserID/UserInformation");
  //  var UserInformation = { name: name, favoriteFruit: favoriteFruit, fruitQuantity: fruitQuantity };
  //  set(dbReference, UserInformation).then(() => {
  //      console.log("Data sucessfully sent to Database");
   //     console.log(name);
  //      console.log(favoriteFruit);
  //      console.log(fruitQuantity);
  //      console.log(UserInformation);
  //  }).catch((error) => {
 //       console.log(error);
 //       console.log("Error happened");
 //   });
//}
export { 
    fb_initialise,
    fb_authenticate,
    fb_writeto,
    fb_writeScore,
    fb_readScore
};
