import "./phaser.js";

// You can copy-and-paste the code from any of the examples at https://examples.phaser.io here.
// You will need to change the `parent` parameter passed to `new Phaser.Game()` from
// `phaser-example` to `game`, which is the id of the HTML element where we
// want the game to go.
// The assets (and code) can be found at: https://github.com/photonstorm/phaser3-examples
// You will need to change the paths you pass to `this.load.image()` or any other
// loading functions to reflect where you are putting the assets.
// All loading functions will typically all be found inside `preload()`.

// The simplest class example: https://phaser.io/examples/v3/view/scenes/scene-from-es6-class

var game = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 1920,
    height: 1200,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var rules;
var timer;
var timedEvent;

var score = 0;
var gameOver = false;
var scoreText;
var button;
var nextPic;
var level = 0;
var timerScore;
var character;


var Game = new Phaser.Game(game);

function preload ()
{
    this.load.image('pic', 'assets/picture_spy.png');
    this.load.image('pic1', 'assets/pic_1.png');
    this.load.image('pic2', 'assets/pic_2.png');
    this.load.image('pic3', 'assets/pic_3.png');
    this.load.image('pic4', 'assets/pic_4.png');
    this.load.image('pic5', 'assets/pic_5.png');
    this.load.image('pic6', 'assets/pic_6.png');
    this.load.image('pic7', 'assets/pic_7.png');
    this.load.image('pic8', 'assets/pic_8.png');
    this.load.image('pic9', 'assets/pic_9.png');
    this.load.image('pic10', 'assets/pic_10.png');
}

function create ()
{
    //spy picture
    var pic = this.add.sprite(0, 0, 'pic');
    pic.setOrigin(0.0);
    pic.setPipeline('Light2D');

    console.log('create');

    //10 second timer to find the character
    this.initialTime = 10;
    timer = this.add.text(100, 1100, 'Time: ' + formatTime(this.initialTime), {fontSize: '40px'});
    // Each 1000 ms call onEvent
    timedEvent = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true });

    //print rules and score
    rules =  this.add.text(400, 1125, 'Find and click the following: ', { fontSize: '40px', fill: '#FFFFFF' })
    scoreText = this.add.text(100, 1145, 'Score: '+ score, { fontSize: '40px', fill: '#FFFFFF' })

    //display the different characters to be found
    if (level == 0) {
        button = this.add.sprite(1314, 475, 'pic1').setInteractive();
        button.setPipeline('Light2D');
        character = this.add.image(1150,1140, "pic1")
    }
    else if (level == 1) {
        button = this.add.sprite(185, 225, 'pic2').setInteractive();
        button.setPipeline('Light2D');
        character = this.add.image(1150,1140, "pic2")
    }
    else if (level == 2) {
        button = this.add.sprite(834, 570, 'pic3').setInteractive();
        button.setPipeline('Light2D');
        character = this.add.image(1150,1140, "pic3")
    }
    else if (level == 3) {
        button = this.add.sprite(1783, 431, 'pic4').setInteractive();
        button.setPipeline('Light2D');
        character = this.add.image(1150,1140, "pic4")
    }
    else if (level == 4) {
        button = this.add.sprite(1155, 825, 'pic5').setInteractive();
        button.setPipeline('Light2D');
        character = this.add.image(1150,1140, "pic5")
    }
    else if (level == 5) {
        button = this.add.sprite(1337, 729, 'pic6').setInteractive();
        button.setPipeline('Light2D');
        character = this.add.image(1150,1140, "pic6")
    }
    else if (level == 6) {
        button = this.add.sprite(267, 895, 'pic7').setInteractive();
        button.setPipeline('Light2D');
        character = this.add.image(1150,1140, "pic7")
    }
    else if (level == 7) {
        button = this.add.sprite(1060, 80, 'pic8').setInteractive();
        button.setPipeline('Light2D');
        character = this.add.image(1150,1140, "pic8")
    }
    else if (level == 8) {
        button = this.add.sprite(820, 960, 'pic9').setInteractive();
        button.setPipeline('Light2D');
        character = this.add.image(1150,1140, "pic9")
    }
    else if (level == 9) {
        button = this.add.sprite(1145, 170, 'pic10').setInteractive();
        button.setPipeline('Light2D');
        character = this.add.image(1150,1140, "pic10")
    }

    //lights
    var light = this.lights.addLight(400, 300, 300).setIntensity(1);
    this.lights.enable().setAmbientColor(0x555555);
    this.input.on('pointermove', function (pointer) {

        light.x = pointer.x;
        light.y = pointer.y;

    });

    //when character is clicked
    button.on('pointerdown', function (pointer) {
        found();
     });

    this.restart = this.input.keyboard.addKey('SPACE');

} 

function found (){
    scoreText.setText('Score: ' + score);
    nextPic = true;
    score = score + timerScore;
}
function formatTime(seconds){

    // Minutes
    var minutes = Math.floor(seconds/60);
    // Seconds
    var partInSeconds = seconds%60;
    // for score calculations
    timeScore(partInSeconds)
    // Adds left zeros to seconds
    partInSeconds = partInSeconds.toString().padStart(2,'0');

    if(minutes <= 0 && partInSeconds <= 0) {
        gameOver = true;
        return `0:00`;
    }

    // Returns formated time
    return `${minutes}:${partInSeconds}`;
}

function timeScore(seconds){
    timerScore = seconds;
}

function onEvent ()
{
    this.initialTime -= 1; // One second
    timer.setText('Time: ' + formatTime(this.initialTime));
}   


function update ()
{   
    if(level == 10) {
        gameOver = true;
    }
    if(gameOver == true) {
        rules.destroy();
        button.destroy();
        character.destroy();
        scoreText = this.add.text(600, 1130, 'FINAL SCORE: ' + score + '      Press SPACE to restart', { fontSize: '40px', fill: '#FFFFFF' })
    }
    if(nextPic == true) {
        this.scene.restart();
        nextPic = false;
        level++;
    }
    if(this.restart.isDown){
        gameOver = false;
        score = 0;
        level = 0;
        this.scene.restart();
    }
}

