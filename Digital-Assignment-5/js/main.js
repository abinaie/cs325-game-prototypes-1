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
    type: Phaser.WEBGL,
    width: 600,
    height: 480,
    backgroundColor: '#009ccc',
    parent: 'game',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var snake;
var food;
var cursors;

var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('food', 'assets/food.png');
    this.load.image('body', 'assets/body.png');
}

function create ()
{
    var Food = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function Food (scene, x, y)
        {
            Phaser.GameObjects.Image.call(this, scene)

            this.setTexture('food');
            this.setPosition(x * 16, y * 16);
            this.setOrigin(0);

            this.total = 0;

            scene.children.add(this);
        },

        eat: function ()
        {
            this.total++;
        }

    });

    var Snake = new Phaser.Class({

        initialize:

        function Snake (scene, x, y)
        {
            this.headPosition = new Phaser.Geom.Point(x, y);

            this.body = scene.add.group();

            this.head = this.body.create(x * 16, y * 16, 'body');
            this.head.setOrigin(0);

            this.alive = true;

            this.speed = 150;

            this.moveTime = 0;

            this.tail = new Phaser.Geom.Point(x, y);

            this.heading = RIGHT;
            this.direction = RIGHT;
        },

        update: function (time)
        {
            if (time >= this.moveTime)
            {
                return this.move(time);
            }
        },

        faceLeft: function ()
        {
            if (this.direction === UP || this.direction === DOWN)
            {
                this.heading = LEFT;
            }
        },

        faceRight: function ()
        {
            if (this.direction === UP || this.direction === DOWN)
            {
                this.heading = RIGHT;
            }
        },

        faceUp: function ()
        {
            if (this.direction === LEFT || this.direction === RIGHT)
            {
                this.heading = UP;
            }
        },

        faceDown: function ()
        {
            if (this.direction === LEFT || this.direction === RIGHT)
            {
                this.heading = DOWN;
            }
        },

        move: function (time)
        {
          
            switch (this.heading)
            {
                case LEFT:
                    this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 40);
                    break;

                case RIGHT:
                    this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 40);
                    break;

                case UP:
                    this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 30);
                    break;

                case DOWN:
                    this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 30);
                    break;
            }

            this.direction = this.heading;

         
            Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 16, this.headPosition.y * 16, 1, this.tail);

            var hitBody = Phaser.Actions.GetFirst(this.body.getChildren(), { x: this.head.x, y: this.head.y }, 1);

            if (hitBody)
            {
                this.alive = false;
                return false;
            }
            else
            {
                //  Update the timer ready for the next movement
                this.moveTime = time + this.speed;

                return true;
            }
        },

        grow: function ()
        {
            var newPart = this.body.create(this.tail.x, this.tail.y, 'body');

            newPart.setOrigin(0);
        },

        collideWithFood: function (food)
        {
            if (this.head.x === food.x && this.head.y === food.y)
            {
                this.grow();
                food.eat();
                if (this.speed > 20 && food.total % 5 === 0)
                {
                    this.speed += 5;
                }

                return true;
            }
            else
            {
                return false;
            }
        },

        updateGrid: function (grid)
        {
            //  Remove all body pieces from valid positions list
            this.body.children.each(function (segment) {

                var bx = segment.x / 16;
                var by = segment.y / 16;

                grid[by][bx] = false;

            });

            return grid;
        }

    });

    food = new Food(this, 3, 4);

    snake = new Snake(this, 8, 8);

    //  Create our keyboard controls
    cursors = this.input.keyboard.createCursorKeys();
}

function update (time, delta)
{
    if (!snake.alive)
    {
        return;
    }

    if (cursors.left.isDown)
    {
        snake.faceLeft();
    }
    else if (cursors.right.isDown)
    {
        snake.faceRight();
    }
    else if (cursors.up.isDown)
    {
        snake.faceUp();
    }
    else if (cursors.down.isDown)
    {
        snake.faceDown();
    }

    if (snake.update(time))
    {
        if (snake.collideWithFood(food))
        {
            repositionFood();
        }
    }
}

function repositionFood ()
{
  
    var testGrid = [];

    for (var y = 0; y < 30; y++)
    {
        testGrid[y] = [];

        for (var x = 0; x < 40; x++)
        {
            testGrid[y][x] = true;
        }
    }

    snake.updateGrid(testGrid);

    //  Purge out false positions
    var validLocations = [];

    for (var y = 0; y < 30; y++)
    {
        for (var x = 0; x < 40; x++)
        {
            if (testGrid[y][x] === true)
            {
                validLocations.push({ x: x, y: y });
            }
        }
    }

    if (validLocations.length > 0)
    {
        var pos = Phaser.Math.RND.pick(validLocations);

        food.setPosition(pos.x * 16, pos.y * 16);

        return true;
    }
    else
    {
        return false;
    }
}
