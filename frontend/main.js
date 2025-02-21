var width = $(window).width();
var height = $(window).height();

const config = {
    type: Phaser.AUTO,
    width: width,
    height: height,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        mode: Phaser.Scale.FIT, // Ensure the game resizes to fit the window
        autoCenter: Phaser.Scale.CENTER_BOTH // Center the game in the screen
    }
};

// Create the game instance
const game = new Phaser.Game(config);

// Resize the game when the window is resized
$(window).resize(function() {
    game.scale.resize($(window).width(), $(window).height());
});

let player, cursors;
let keyA, keyS, keyD, keyW;
let background;

const actions = {
    idleLeft:  0,
    idleRight: 1,
    idleUp:    2,
    idleDown:  3,
    
    moveLeft:  4,
    moveRight: 5,
    moveUp:    6,
    moveDown:  7,
};

let playerAction = actions.idleDown;


function preload() {
    // this.load.image('player', "./src/spritepacks/mystic-woods/sprites/characters/player.png");
    this.load.spritesheet("player", "./src/spritepacks/mystic-woods/sprites/characters/player.png", { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet("coin", "./src/spritepacks/coin1_16x16.png", { frameWidth: 16, frameHeight: 16 });
    this.load.image('background', '/frontend/src/textures/temp.png');
}
function create() {

    // Creating background
    background = this.add.tileSprite(0, 0, width, height, 'background');
    background.setDepth(-1);
    background.setOrigin(0, 0);

    // Creating the player
    player = this.physics.add.sprite(width / 2, height / 2, 'player').setScale(1.8);


    // Defining all player movement animations


    // The spritesheet has no left animations, so moving left
    // is achived by flipping the player sprite along the x axis.
    this.anims.create({
        key: "idleRight",
        frames: this.anims.generateFrameNumbers("player", { start: 6, end: 11 }),
        frameRate: 10,
        repeat: -1  // Loop the animation
    });

    this.anims.create({
        key: "idleUp",
        frames: this.anims.generateFrameNumbers("player", { start: 12, end: 17 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: "idleDown",
        frames: this.anims.generateFrameNumbers("player", { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });


    this.anims.create({
        key: "moveRight",
        frames: this.anims.generateFrameNumbers("player", { start: 24, end: 29 }),
        frameRate: 12,
        repeat: -1
    });

    this.anims.create({
        key: "moveUp",
        frames: this.anims.generateFrameNumbers("player", { start: 30, end: 35 }),
        frameRate: 12,
        repeat: -1
    });

    this.anims.create({
        key: "moveDown",
        frames: this.anims.generateFrameNumbers("player", { start: 18, end: 23 }),
        frameRate: 12,
        repeat: -1
    });

    player.anims.play("idleDown");
    player.setCollideWorldBounds(true);


    // Creating all coin sprites and randomly placing 10 throughout the map
    const coins = [];

    for (let i = 0; i < 10; i++) {
        let coin = this.add.sprite(Math.random()*width, Math.random()*height, "coin");
        coin.setOrigin(0, 0);
        coin.setDepth(-1);
        coins.push(coin);
    }

    // Setting keyboard input bindings
    cursors = this.input.keyboard.createCursorKeys();
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
}

function update() {

    let speed = 5;

    // Reseting velocity
    player.setVelocity(0);

    // Movement logic
    if (keyA.isDown) {
        // player.setVelocityX(-200);
        background.tilePositionX -= speed;
        if (playerAction != actions.moveLeft) {
            playerAction = actions.moveLeft;

            // The spritesheet has no left animations, so moving left
            // is achived by flipping the player sprite along the x axis.
            player.setFlipX(true);
            player.anims.play("moveRight");
        }

    } else if (keyD.isDown) {
        background.tilePositionX += speed;
        if (playerAction != actions.moveRight) {
            playerAction = actions.moveRight;
            player.setFlipX(false);
            player.anims.play("moveRight");
        }
    }

    if (keyW.isDown) {
        background.tilePositionY -= speed;
        if (playerAction != actions.moveUp) {
            playerAction = actions.moveUp;
            player.anims.play("moveUp");
        }

    } else if (keyS.isDown) {
        background.tilePositionY += speed;
        if (playerAction != actions.moveDown) {
            playerAction = actions.moveDown;
            player.anims.play("moveDown");
        }
    }

    // Else if no movememt keys were pushed, the player is made to
    // idle in their current direction
    else {
        let newAction = playerAction - 4;

        switch(newAction) {
            case 0:
                if (playerAction != actions.idleLeft) {
                    playerAction = actions.idleLeft;
                    player.setFlipX(true);
                    player.anims.play("idleRight");
                }
                break;
            case 1:
                if (playerAction != actions.idleRight) {
                    playerAction = actions.idleRight;
                    player.setFlipX(false);
                    player.anims.play("idleRight");
                }
                break;
            case 2:
                if (playerAction != actions.idleUp) {
                    playerAction = actions.idleUp;
                    player.anims.play("idleUp");
                }
                break;
            case 3:
                if (playerAction != actions.idleDown) {
                    playerAction = actions.idleDown;
                    player.anims.play("idleDown");
                }
                break;
        }
    }
    
}
