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
    width: 1300,  //640
    height: 512,
    parent: 'game',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            //gravity: { y: 300 }
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var platform;
var boxes;
var scoreText;

new Phaser.Game(config);

function preload() {
    this.load.atlas('flood', 'assets/blobs.png', 'assets/blobs.json');//new
    this.load.image('backdrop', 'assets/ship1.png');
    this.load.image('cannon_head', 'assets/cannon_head.png');
    this.load.image('cannon_body', 'assets/cannon_body.png');
    this.load.spritesheet('chick', 'assets/chick.png', { frameWidth: 16, frameHeight: 18 });
    //this.load.image('block', 'assets/block.png');
    //this.load.image('ground' , 'assets/platform.png')
}

function create() {

    // platform = this.physics.add.staticGroup();
    // platform.create(400 , 568, 'ground').setScale(4).refreshBody();

    var block1 = this.physics.add.image(1100, 470,'flood', 'icon-grey');
    //var block1 = this.physics.add.image(1200, 470, 'block');
    var block2 = this.physics.add.image(400, 380, 'flood' ,'icon-purple');
    //var block2 = this.physics.add.image(1200, 380, 'block');
    var block3 = this.physics.add.image(700, 290, 'flood', 'icon-green');
    //var block3 = this.physics.add.image(1200, 290, 'block');
    var block4 = this.physics.add.image(1000, 200, 'flood', 'icon-yellow');
    //var block4 = this.physics.add.image(1200, 200, 'block');
    var block5 = this.physics.add.image(100, 110, 'flood', 'icon-red');
    //var block5 = this.physics.add.image(1200, 110, 'block');


    boxes = this.physics.add.group({ key: 'block' , frame: [block1, block2,block3 ,block4,block5]});

    // var block1 = this.physics.add.staticImage(1200, 470, 'block');
    // var block2 = this.physics.add.staticImage(1200, 380, 'block');
    // var block3 = this.physics.add.staticImage(1200, 290, 'block');
    // var block4 = this.physics.add.staticImage(1200, 200, 'block');
    // var block5 = this.physics.add.staticImage(1200, 110, 'block');

    //  block1.setBounce(1);
    //  block2.setBounce(1);
    //  block3.setBounce(1);
    //  block4.setBounce(1);
    //  block5.setBounce(1);

   

    //this.bricks =this.physics.add.staticGroup({key: 'block' , frame: ['block'] , frameQuantity: 5, gridAlign: {width:10 , height: 6}});

    //this.anims.create({ key: 'fly', frames: this.anims.generateFrameNumbers('chick', [0, 1, 2, 3]), frameRate: 5, repeat: -1 });

    //this.add.image(320, 256, 'backdrop').setScale(2);

    var cannonHead = this.add.image(130, 416, 'cannon_head').setDepth(1);
    var cannon = this.add.image(130, 464, 'cannon_body').setDepth(1);
    var chick = this.physics.add.sprite(cannon.x, cannon.y - 10, 'chick').setScale(2);
    var gfx = this.add.graphics().setDefaultStyles({ lineStyle: { width: 10, color: 0xffdd00, alpha: 0.5 } });
    var line = new Phaser.Geom.Line();
    var angle = 0;

    //chick.disableBody(true, true);
    //block1.disableBody(true, true);
    this.input.on('pointermove', function (pointer) {
        angle = Phaser.Math.Angle.BetweenPoints(cannon, pointer);
        cannonHead.rotation = angle;
        Phaser.Geom.Line.SetToAngle(line, cannon.x, cannon.y - 50, angle, 128);
        gfx.clear().strokeLineShape(line);
    }, this);



    this.input.on('pointerup', function () {
        chick.enableBody(true, cannon.x, cannon.y - 50, true, true);
        chick.play('fly');
        this.physics.velocityFromRotation(angle, 600, chick.body.velocity);
    }, this);

   chick.setBounce(1);
   chick.setMass(10);
    
   //scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
   //this.physics.add.collider(boxes, chick);
    
    this.physics.add.collider(block1 , chick);//newly added
    this.physics.add.collider(block2 , chick);
    this.physics.add.collider(block3 , chick);
    this.physics.add.collider(block4 , chick);
    this.physics.add.collider(block5 , chick);

    //this.physics.add.overlap(boxes , chick ,collectStar, this ,this);
    
    // this.physics.add.overlap(block1 , chick ,collectStar, null ,this);
    // this.physics.add.overlap(block2 , chick ,collectStar, null ,this);
    // this.physics.add.overlap(block3 , chick ,collectStar, null ,this);
    // this.physics.add.overlap(block4 , chick ,collectStar, null ,this);
    // this.physics.add.overlap(block5 , chick ,collectStar, null ,this);
}

// function collectStar (player, block1)
// {
//     block1.disableBody(true, true);

//     //  Add and update the score
//     score += 1;
//     scoreText.setText('Score: ' + score);

//     if (boxes.countActive(true) === 0)
//     {
//         //  A new batch of stars to collect
//         boxes.children.iterate(function (child) {

//             child.enableBody(true, child.x, 0, true, true);

//         });


//     }
// }







