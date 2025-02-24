export function play() {

    var width = $(window).width();
    var height = $(window).height();

    const config = {
        type: Phaser.AUTO,
        width: width,
        height: height,
        physics: {
            default: "arcade",
            arcade: { gravity: { y: 0 }, debug: false }
        },
        scene: { preload, create, update },
        scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }
    };

    // Create the game instance
    const game = new Phaser.Game(config);

    // Resize the game when the window is resized
    $(window).resize(() => game.scale.resize($(window).width(), $(window).height()));

    let player, healthBar, cursors, keyA, keyS, keyD, keyW, keyLeft, keyDown, keyRight, keyUp, keySpace, pointer, background;
    var coins = [];
    var enemies = [];

    var numCoins = 500;
    var numEnemies = 0;

    let playerState = "idleDown";
    let playerScore = 0;

    const actions = {
        idleLeft: "idleLeft", idleRight: "idleRight", idleUp: "idleUp", idleDown: "idleDown",
        moveLeft: "moveLeft", moveRight: "moveRight", moveUp: "moveUp", moveDown: "moveDown",
    };

    function euclideanDistance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }


    function handleInput() {
        let speed = 300;
        
        player.setVelocity(0);
        let moving = false;

        if (keyA.isDown || keyLeft.isDown) {
            player.setVelocityX(-speed);
            if (playerState !== actions.moveLeft) {
                playerState = actions.moveLeft;
                player.setFlipX(true);
                player.anims.play("moveRight");
            }
            moving = true;
        } else if (keyD.isDown || keyRight.isDown) {
            player.setVelocityX(speed);
            if (playerState !== actions.moveRight) {
                playerState = actions.moveRight;
                player.setFlipX(false);
                player.anims.play("moveRight");
            }
            moving = true;
        }

        if (keyW.isDown || keyUp.isDown) {
            player.setVelocityY(-speed);
            if (playerState !== actions.moveUp) {
                playerState = actions.moveUp;
                player.anims.play("moveUp");
            }
            moving = true;
        } else if (keyS.isDown || keyDown.isDown) {
            player.setVelocityY(speed);
            if (playerState !== actions.moveDown) {
                playerState = actions.moveDown;
                player.anims.play("moveDown");
            }
            moving = true;
        }


        if (pointer.leftButtonDown()) {
            // Storing the current animation before attacking
            let previousAnim = player.anims.currentAnim ? player.anims.currentAnim.key : "idleDown";
        
            // Determining the attack animation based on direction
            let attackAnim;
            if (previousAnim.includes("Down")) {
                attackAnim = "attackDown";
            } else if (previousAnim.includes("Up")) {
                attackAnim = "attackUp";
            } else if (previousAnim.includes("Left")) {
                attackAnim = "attackLeft";
            } else if (previousAnim.includes("Right")) {
                attackAnim = "attackRight";
            } else {
                attackAnim = "attackDown"; // Default fallback
            }
        
            // Playing the attack animation
            player.anims.play(attackAnim, true);
        
            // Once the attack animation has finished, the previous animation is resumed
            player.once("animationcomplete", (animation) => {
                if (animation.key === attackAnim) {
                    player.anims.play(previousAnim, true);
                }
            });
        }
        
        // If no movememt keys were pushed, the player is made to
        // idle in their current direction
        if (!moving) {
            switch (playerState) {
                case actions.moveLeft:
                    playerState = actions.idleLeft;
                    player.setFlipX(true);
                    player.anims.play("idleRight");
                    break;
                case actions.moveRight:
                    playerState = actions.idleRight;
                    player.setFlipX(false);
                    player.anims.play("idleRight");
                    break;
                case actions.moveUp:
                    playerState = actions.idleUp;
                    player.anims.play("idleUp");
                    break;
                case actions.moveDown:
                    playerState = actions.idleDown;
                    player.anims.play("idleDown");
                    break;
            }
        }
    }


    function handleEnemies() {

        for (let enemy of enemies) {
            let speed = 100;
            let sepDistance = 10;

            let dx = Math.sign(player.x - enemy.x);
            let dy = Math.sign(player.y - enemy.y);

            for (let otherEnemy of enemies) {
                if (enemy.id != otherEnemy.id) {
                    if (Math.abs(otherEnemy.x - enemy.x) <= sepDistance) {
                        dy += 0.1
                    }
                    else if (Math.abs(otherEnemy.y - enemy.y) <= sepDistance) {
                        dx += 0.1
                    }
                }

            }
        
            enemy.setVelocity(0);
            enemy.setVelocityX(speed*dx);
            enemy.setVelocityY(speed*dy);
        }

    }


    function handlePickup(items) {
        for (let item of items) {

            if (item.found && !item.collected) {
                let speed = 400;

                let dx = (player.x - item.x);
                let dy = (player.y - item.y);

                let ratio = dy/dx;

                let u = speed/Math.sqrt(1+(ratio*ratio));

                let vx = u*Math.sign(dx);
                let vy = u*ratio*Math.sign(dx);
            
                item.setVelocity(0);
                item.setVelocityX(vx);
                item.setVelocityY(vy);
            }
        }
    }


    function preload() {
        this.load.spritesheet("player", "./src/spritepacks/mystic-woods/sprites/characters/player.png", { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet("coin", "./src/spritepacks/coin1_16x16.png", { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet("enemy", "./src/spritepacks/redSlime.png", { frameWidth: 16, frameHeight: 32 });
        this.load.image("background", "/frontend/src/textures/temp.png");
    }

    function create() {

        // Setting keyboard input bindings
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        pointer = this.input.activePointer;

        background = this.add.tileSprite(0, 0, width, height, "background").setOrigin(0, 0).setDepth(-1);

        player = this.physics.add.sprite(width / 2, height / 2, "player").setScale(2).setCollideWorldBounds(true);

        this.cameras.main.startFollow(player);

        let healthBarWidth = 48;
        let healthBarHeight = 5;
        healthBar = this.add.graphics();
        healthBar.fillStyle(0x00ff00, 1); // Green color for full health
        healthBar.fillRect(-healthBarWidth/2, 0, healthBarWidth, healthBarHeight);



        // The spritesheet has no left animations, so moving left
        // is achived by flipping the player sprite along the x axis.
        const animData = [
            { key: "idleDown", start: 0, end: 5 },
            { key: "idleRight", start: 6, end: 11 },
            { key: "idleUp", start: 12, end: 17 },

            { key: "moveDown", start: 18, end: 23 },
            { key: "moveRight", start: 24, end: 29 },
            { key: "moveUp", start: 30, end: 35 },

            { key: "attackDown", start: 36, end: 39 },
            { key: "attackRight", start: 42, end: 45 },
            { key: "attackUp", start: 48, end: 51 },


            { key: "die", start: 54, end: 56 }
        ];

        animData.forEach(({ key, start, end }) => {
            this.anims.create({
                key,
                frames: this.anims.generateFrameNumbers("player", { start, end }),
                frameRate: (key.includes("move") || key.includes("attack")) ? 12 : 10,
                repeat: (key.includes("attack") || key.includes("die")) ? 0 : -1
            });
        });
        player.anims.play("idleDown");


        // Creating the coin spin animation
        this.anims.create({
            key: "coinSpin",
            frames: this.anims.generateFrameNumbers("coin", 0, 14),
            frameRate: 30,
            repeat: -1,
        });
        // Loading in all coins
        for (let i = 0; i < numCoins; i++) {
            let coin = this.physics.add.sprite(Math.random() * width, Math.random() * height, "coin")
                .setOrigin(0, 0)
                .setDepth(-1);
            coin.setScrollFactor(1);  // This makes the coin move as the world moves

            coin.found = false;
            coin.anims.play("coinSpin");
            coins.push(coin);
        }



        this.anims.create({
            key: "enemyMove",
            frames: this.anims.generateFrameNumbers("enemy", 0, 10),
            frameRate: 10,
            repeat: -1,
        });

        for (let i = 0; i < numEnemies; i++) {
            let enemy = this.physics.add.sprite(Math.random() * width, Math.random() * height, "enemy").setScale(2);
            enemy.anims.play("enemyMove");
            enemy.id = i;
            enemies.push(enemy);
        }

    }

    function update() {
        handleInput();
        healthBar.setPosition(player.x, player.y + 50)

        handleEnemies();

        handlePickup(coins);

        const findRadius = 100;
        const collectRadius = 30;

        for (let coin of coins) {
            if (!coin.collected) {
                let distance = euclideanDistance(coin.x, coin.y, player.x, player.y);
                
                if (distance <= findRadius) {
                    coin.found = true;
                }
                if (distance <= collectRadius) {
                    playerScore += 5;
                    coin.destroy();
                    coin.collected = true;
                    $("#scoreText").text(playerScore);
                }

            }
        }
    }
}