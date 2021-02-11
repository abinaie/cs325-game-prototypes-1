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



var Breakout = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Breakout ()
    {
        Phaser.Scene.call(this, { key: 'breakout' });

        this.bricks;
        this.paddle;
        this.ball;
    },

    preload: function ()
    {
        this.load.atlas('assets', 'assets/breakout.png', './assets/breakout.json');
    },

    create: function ()
    {
        //  Enable world bounds, but disable the floor and ceiling
        this.physics.world.setBoundsCollision(true, true, false, false);//the 3d false is for the ceiling
    
        //  Create the bricks in a 10x6 grid
        this.bricks = this.physics.add.staticGroup({
            key: 'assets', frame: [ 'red', 'purple1' ,'red1','silver'],
            frameQuantity: 6,
            gridAlign: { width: 5, height:5, cellWidth: 64, cellHeight: 32, x: 270, y: 200 }
        });

        this.ball = this.physics.add.image(400, 500, 'assets', 'ball1').setCollideWorldBounds(true).setBounce(1);
        this.ball.setData('onPaddle', true);

        this.paddle = this.physics.add.image(400, 550, 'assets', 'paddle1').setImmovable();

        //  Our colliders
        this.physics.add.collider(this.ball, this.bricks, this.hitBrick, null, this);
        this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, null, this);

        //  Input events
        this.input.on('pointermove', function (pointer) {

            //  Keep the paddle within the game
            this.paddle.x = Phaser.Math.Clamp(pointer.x, 52, 948);
            this.paddle.y = Phaser.Math.Clamp(pointer.y, 50, 550);//newly added

            if (this.ball.getData('onPaddle'))
            {
                this.ball.x = this.paddle.x;
                this.ball.y = this.paddle.y - 30;//newly added
            }

        }, this);

        this.input.on('pointerup', function (pointer) {

            if (this.ball.getData('onPaddle'))
            {
                this.ball.setVelocity(-75, -300);
                this.ball.setData('onPaddle', false);
            }

        }, this);
    },

    hitBrick: function (ball, brick)
    {
        if (!this.ball.getData('onPaddle')){//newly added
        brick.disableBody(true, true);}
        //brick.enableBody(false, this.ball.x , this.ball.y , false , false);
        if (this.bricks.countActive() === 0)
        {
            window.alert('Well Done!!!');
            this.resetLevel();
        }
    },

    resetBall: function ()
    {
        this.ball.setVelocity(0);
        this.ball.setPosition(this.paddle.x, 500);
        this.ball.setData('onPaddle', true);
    },

    resetLevel: function ()
    {
        this.resetBall();
        
         this.bricks.children.each(function (brick) {

             brick.enableBody(false, 0, 0, true, true);

         });
    },

    hitPaddle: function (ball, paddle)
    {
        var diff = 0;

        if (ball.x < paddle.x)
        {
            //  Ball is on the left-hand side of the paddle
            diff = paddle.x - ball.x;
            ball.setVelocityX(-10 * diff);
        }
        else if (ball.x > paddle.x)
        {
            //  Ball is on the right-hand side of the paddle
            diff = ball.x -paddle.x;
            ball.setVelocityX(10 * diff);
        }
        else
        {
            //  Ball is perfectly in the middle
            //  Add a little random X to stop it bouncing straight up!
            ball.setVelocityX(2 + Math.random() * 8);
        }
    },

    update: function ()
    {
        if (this.ball.y > 600 || this.ball.y < 0)
        {
            this.resetLevel();
            this.resetBall();//remove

        }
    }

});

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    scene: [ Breakout ],
    physics: {
        default: 'arcade'
    }
};

var game = new Phaser.Game(config);
