/*******************************************************/
// Create a game
/// Written by Joseph
/*******************************************************/

import { fb_initialise,fb_writeScore } from "./fb_io.mjs";

/*******************************************************/
// setup()
/*******************************************************/
//fb_initialise();
//Future Joseph put const in all caps
window.preload = preload;
window.setup = setup;
window.draw = draw;
window.keyPressed = keyPressed;

const Numberofplatforms = 8
//for Game height 
const GameHeight = 800;
// for the Canvas width
const GameWidth = 800;
// How long the game lasts
var GameLength = 10
// for the timer 
var GameTime = GameLength;
// for the score
var Score = 0;
// surfaces you can jump on
var Gamestate = 'start';
// Number of coins
var Coinnumber = 10;
//Images for sprites
var Coinimage;
var PlatformGrass;
//Image for background
var Background;
//Restarts game
var Restart;
//starttime
var startTime
// sprites group
let Sprites;

let Player;

let Jumpsurfaces;

let coinGroup

function preload() {
    // Image for coins
    Coinimage = loadImage('Images/Goldcoin.png')
    // image for platforms
    PlatformGrass = loadImage('Images/GrassPlatform.png')
    // Image for background
    Background = loadImage('Images/GameScreenBackground.jpg')
}

function setup() {
    console.log("setup: ");
    let cnv = new Canvas(GameWidth, GameHeight);
    // surfaces you can jump on
    Jumpsurfaces = new Group();
    // all the sprites 
    Sprites = new Group();
    //adding Gravity 
    world.gravity.y = 10;
    //Makes sprites disappear
    Sprites.visible = false;


}

function makePlayer() {
//code for Player sprite 
    Player = new Sprite(250, 250, 25, 25, 'd');
    Player.color = 'cyan';
    Sprites.add(Player);
}
// function to make walls
function makeWalls() {
    let wallL = new Sprite(0, GameHeight, 8, GameHeight * 2, 'k');
    wallL.color = 'black';
    wallL.bounciness = 1;
    let wallRH = new Sprite(GameWidth, 0, 8, GameHeight * 2, 'k');
    wallRH.color = 'black';
    wallRH.bounciness = 1;
    let wallTop = new Sprite(0, 0, GameWidth * 2, 8, 'k');
    wallTop.color = 'black';
    wallTop.bounciness = 1;
    let wallBot = new Sprite(0, GameHeight, GameWidth * 2, 8, 'k');
    wallBot.color = 'black';
    wallBot.bounciness = 0;
    // adding the bottom wall to Jumpsurfaces group
    Jumpsurfaces.add(wallBot);
    // adding the walls to sprites group
    Sprites.add(wallBot);
    Sprites.add(wallTop);
    Sprites.add(wallRH);
    Sprites.add(wallL);
}


// Function to make the platforms and make them spawn in random places 
function platforms() {
    for (let i = 1; i < Numberofplatforms; i++) {
        var platformX = GameWidth * Math.random();
        var platformY = i * (GameHeight / (Numberofplatforms));
        let platform = new Sprite(platformX, platformY, 100, 8, 'k');
        platform.bounciness = 0;
        platform.friction = 5;
        platform.color = 'White'
        Sprites.add(platform);
        Jumpsurfaces.add(platform);
        platform.image = (PlatformGrass);
        PlatformGrass.resize(100, 100);
    }
}
/*******************************************************/
// draw()
/*******************************************************/
function draw() {
    background(Background);
// code for start screen
    if (Gamestate == 'start') {
        // if player presses q gtame starts
        if (kb.pressing('q')) {
            Sprites.visible = true;
            makePlayer();
            Coins();
            platforms();
            makeWalls();
            startTime = millis();
            Gamestate = 'running';
        }

        text("Press Q to start", GameWidth / 2, GameHeight / 2)
        text("Instructions: Jump from platform to platform using WASD collect as many coins as possible before the time limit ends if you get them all good Job", GameWidth / 2 - GameWidth / 2, GameHeight / 2 + GameHeight / 10)
        // Code for game screen
    } else if (Gamestate == 'running') {
        // This is the Score
        textSize(35);
        text("Score:" + Score, 55, 40);
        textSize(35);
        text("Timer:" + (GameTime - Math.floor((millis() - startTime) / 1000)), 60, 70);
        fill('Black');
        // code for end screen
        if (GameTime - Math.floor((millis() - startTime) / 1000) <= 0) {
            // remove everything
            coinGroup.remove();
            Sprites.visible = false;
            Gamestate = "end";
            fb_writeScore(Score)
        }

        //KeyBoard controls   
        Player.colliding(Jumpsurfaces, Jump);

        function Jump() {
            console.log("Jump");
            if (kb.pressing('w')) {
                // Set sprite's velocity upwards
                Player.vel.y = -8;
            }
        }
        if (kb.pressing('a')) {
            // Set sprite's velocity to the left
            Player.vel.x = -5;
        } else if (kb.pressing('d')) {
            // Set sprite's velocity to the right
            Player.vel.x = 5;
        } else if (kb.pressing('s')) {
            // Set sprite's velocity downwards
            Player.vel.y = 5;
        }
    } else if (Gamestate == 'end'){
        text("End Game", GameWidth / 2, GameHeight / 2)
        text("Your Score:" + Score, GameWidth / 2 - 100, GameHeight / 2 + 200)
        fill('black');
        

    }
}
// function to make the coins
function Coins() {
     coinGroup = new Group();

    for (let i = 0; i < Coinnumber; i++) {
        let coin = new Sprite(GameWidth * Math.random(), GameHeight * Math.random(), 20, 'd');
        coin.vel.x = 3;
        coin.vel.y = 4;
        coin.bounciness = 1;
        coin.friction = 0;
        coin.color = 'gold'
        coinGroup.add(coin);
        coin.image = (Coinimage);
        Coinimage.resize(50, 50);
    }

    // if any coin in the coin group colides with the Player call func2call
    coinGroup.collides(Player, func2call);

    function func2call(coin, circle) {
        // Delete the coin that gets hit
        coin.remove();
        Score++;
    }
}
//if r is pressed run the restart function
function keyPressed() {
    if (checkkey(key)){
        restartGame();
    }
}
//check if r is pressed 
function checkkey(_keypressed) {
    if (_keypressed === 'r' || _keypressed === 'R'){
        console.log("Game Restared");
        return true;
    } else {
        return false;
    }
}
// function to restart the game
function restartGame() {
    Score = 0;
    GameTime = GameLength;
    Gamestate = 'start';3
    coinGroup.removeAll();
    Jumpsurfaces.removeAll();
    Sprites.visible = false;
}
/**************************

/*******************************************************/
//  END OF APP
/*******************************************************/

/******************************************************/
//firebase code for high scores
/******************************************************/


