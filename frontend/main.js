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

function preload() {
    // this.load.image('player', "./src/spritepacks/mystic-woods/sprites/characters/player.png");
    this.load.spritesheet('player', "./src/spritepacks/mystic-woods/sprites/characters/player.png", { frameWidth: 48, frameHeight: 48 });
    this.load.image('background', '/frontend/src/textures/temp.png');
}
function create() {
    // Create background
    background = this.add.tileSprite(0, 0, width, height, 'background');
    background.setOrigin(0, 0); // Make sure it's aligned to the top-left corner

    player = this.physics.add.sprite(width / 2, height / 2, 'player').setScale(1.5);



    this.anims.create({
        key: "idle",
        frames: this.anims.generateFrameNumbers("player", { start: 0, end: 2 }),
        frameRate: 5,
        repeat: -1  // Loop the animation
    });


    this.anims.create({
        key: "moveRight",
        frames: this.anims.generateFrameNumbers("player", { start: 6, end: 8 }),
        frameRate: 5,
        repeat: 5
    });

    this.anims.create({
        key: "moveUp",
        frames: this.anims.generateFrameNumbers("player", { start: 12, end: 14 }),
        frameRate: 5,
        repeat: 5
    });

    this.anims.create({
        key: "moveDown",
        frames: this.anims.generateFrameNumbers("player", { start: 18, end: 20 }),
        frameRate: 5,
        repeat: 5
    });




    player.anims.play("idle");



    player.setCollideWorldBounds(true);

    // Create keyboard input
    cursors = this.input.keyboard.createCursorKeys();
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
}

function update() {

    let speed = 5;

    // Reset velocity
    player.setVelocity(0);

    // Movement logic
    if (keyA.isDown) {
        // player.setVelocityX(-200);
        background.tilePositionX -= speed;
        player.setFlipX(true);
        player.anims.play("moveRight");

    } else if (keyD.isDown) {
        background.tilePositionX += speed;
        player.setFlipX(false);
        player.anims.play("moveRight");
    }

    if (keyW.isDown) {
        background.tilePositionY -= speed;
        player.anims.play("moveUp");

    } else if (keyS.isDown) {
        background.tilePositionY += speed;
        player.anims.play("moveDown");
    }
}
