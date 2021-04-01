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


var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 1024,
    height: 1152,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player;
var trophy;
let text;
var cursors;
var gameOver = false;

var game = new Phaser.Game(config);

function preload () {
    this.load.image("tiles", "assets/maze_tiles.png");
    this.load.image("finish","assets/trophy.png");
    this.load.tilemapTiledJSON("map", "assets/snakes.json");
    this.load.spritesheet('dude', 'assets/robot.png', { frameWidth: 31.5, frameHeight: 48 });
    this.load.audio('bgm', 'assets/bgmusic.wav');

    this.load.image("d1","assets/dice1.png");
    this.load.image("d2","assets/dice2.png");
    this.load.image("d3","assets/dice3.png");
    this.load.image("d4","assets/dice4.png");
    this.load.image("d5","assets/dice5.png");
    this.load.image("d6","assets/dice6.png");
}

function create () {

    //load map and tileset
    const map = this.make.tilemap({key: "map"});
    const tileset = map.addTilesetImage("maze_tiles","tiles");

    //play bgm
    this.music = this.sound.add('bgm', {volume: 0.04}); 
    this.music.play();

    //load map layers
    let worldLayer;
    this.groundLayer = map.createStaticLayer("ground", tileset, 0, 0);

    worldLayer = map.createStaticLayer("level1", tileset, 0, 0);

    //add collision on map
    worldLayer.setCollisionByProperty({ collides: true });

    //add the player
    player = this.physics.add.sprite(125, 900, 'dude');

    //add trophy
    trophy = this.physics.add.group({
        key: 'finish',
        setXY: { x: 125, y: 125 }
    })

    //reset button
    this.reset = this.input.keyboard.addKey('SPACE');

    //roll button
    this.roll = this.input.keyboard.addKey('R');

    //player physics properties
    player.setCollideWorldBounds(true);


    //player animations
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
        
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    //cursor input Events
    cursors = this.input.keyboard.createCursorKeys();

    //collide the player with board boundry
    this.physics.add.collider(player, worldLayer);


    //checks to see if the player overlaps with the trophy
    this.physics.add.overlap(player, trophy, collectTrophy, null, this);

    this.add.image(250, 1050, "d1");  
    this.add.text(350, 1035, 'press R to roll', { fontSize: '32px', fill: '#000' });

}

function update ()
{
    if (gameOver)
    {
        let style = { font: "32px Verdana", fill: "#000000", outline: "5px",align: "center" };
            text = this.add.text( this.cameras.main.centerX, this.cameras.main.centerY, "YOU WON!\nPress SPACE to restart game", style );
            text.setOrigin( 0.5, 2.4 ); 
    }

    if(this.reset.isDown){
        this.scene.restart();
        this.music.stop();
        gameOver = false;
    }

    if (this.roll.isDown) {
        var rng  = Phaser.Math.RND.between(1, 6);
        
        if(rng == 1) {
            this.add.image(250, 1050, "d1");
        }
        else if (rng == 2) {
            this.add.image(250, 1050, "d2"); 
        }
        else if (rng == 3) {
            this.add.image(250, 1050, "d3"); 
        }
        else if (rng == 4) {
            this.add.image(250, 1050, "d4"); 
        }
        else if (rng == 5) {
            this.add.image(250, 1050, "d5"); 
        }
        else {
            this.add.image(250, 1050, "d6"); 
        }
    }
    
    player.body.setVelocity(0);

    //horizontal movement
    if (cursors.left.isDown)
    {
        player.setVelocityX(-260);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(260);
        player.anims.play('right', true);
    }
    
    //vertical movement
    else if (cursors.up.isDown)
    {
        player.setVelocityY(-260);
        player.anims.play('down', true);
    }
    else if (cursors.down.isDown)
    {
        player.setVelocityY(260);
        player.anims.play('up', true);
    }
    else
    {
        player.setVelocityX(0);
        player.anims.play('turn');
    }
}

function collectTrophy (players, finish)
{
    finish.disableBody(true, true);

    if (trophy.countActive(true) === 0)
    {
        this.physics.pause();
        players.anims.play('turn');
        gameOver = true;
    }
}