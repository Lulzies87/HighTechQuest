import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
  private walls?: Phaser.Physics.Arcade.StaticGroup;
  private player?: Phaser.Physics.Arcade.Sprite;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys: any = {};
  private playerSpeed: number = 160;
  private lastDirection: "up" | "down" | "left" | "right" = "down";

  constructor() {
    super({ key: "MainScene" });
  }

  preload() {
    this.load.image("floor", "/assets/floor.png");
    this.load.image("wall", "/assets/wall.png");
    this.load.spritesheet("character", "/assets/character.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    this.physics.world.setBounds(0, 0, 3840, 2160);

    for (let x = 0; x < 3840; x += 128) {
      for (let y = 0; y < 2160; y += 128) {
        this.add.image(x, y, "floor").setOrigin(0, 0);
      }
    }

    this.walls = this.physics.add.staticGroup();

    for (let x = 0; x <= 3840; x += 64) {
      this.walls.create(x, 0, "wall");
      this.walls.create(x, 2160, "wall");
    }

    for (let y = 0; y <= 2160; y += 64) {
      this.walls.create(0, y, "wall");
      this.walls.create(3840, y, "wall");
    }

    this.createObstacles();

    this.player = this.physics.add.sprite(500, 300, "character");
    this.player.setCollideWorldBounds(true);

    this.createPlayerAnimations();

    this.physics.add.collider(this.player, this.walls);

    this.cameras.main.setBounds(0, 0, 3840, 2160);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setDeadzone(100, 100);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys.W = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keys.A = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keys.S = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keys.D = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }

  createObstacles() {
    const obstaclePositions = [
      { x: 300, y: 300 },
      { x: 600, y: 600 },
      { x: 800, y: 200 },
      { x: 1200, y: 400 },
      { x: 1500, y: 800 },
      { x: 1800, y: 300 },
      { x: 2200, y: 600 },
      { x: 2500, y: 400 },
      { x: 2800, y: 700 },
    ];

    obstaclePositions.forEach((pos) => {
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          this.walls!.create(pos.x + i * 64, pos.y + j * 64, "wall");
        }
      }
    });
  }

  createPlayerAnimations() {
    this.anims.create({
      key: "walk_down",
      frames: this.anims.generateFrameNumbers("character", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1, // loop animation
    });

    this.anims.create({
      key: "walk_horizontal",
      frames: this.anims.generateFrameNumbers("character", {
        start: 4,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk_up",
      frames: this.anims.generateFrameNumbers("character", {
        start: 12,
        end: 15,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "idle-down",
      frames: [{ key: "character", frame: 0 }],
      frameRate: 10,
    });
    this.anims.create({
      key: "idle-left",
      frames: [{ key: "character", frame: 4 }],
      frameRate: 10,
    });
    this.anims.create({
      key: "idle-right",
      frames: [{ key: "character", frame: 4 }],
      frameRate: 10,
    });
    this.anims.create({
      key: "idle-up",
      frames: [{ key: "character", frame: 12 }],
      frameRate: 10,
    });
  }

  update() {
    if (!this.player) return;

    this.player.setVelocity(0);

    const leftPressed = this.cursors?.left.isDown || this.keys.A.isDown;
    const rightPressed = this.cursors?.right.isDown || this.keys.D.isDown;
    const upPressed = this.cursors?.up.isDown || this.keys.W.isDown;
    const downPressed = this.cursors?.down.isDown || this.keys.S.isDown;

    const movingDiagonally =
      (leftPressed || rightPressed) && (upPressed || downPressed);
    const speed = movingDiagonally
      ? this.playerSpeed * 0.7071
      : this.playerSpeed;

    if (leftPressed) {
      this.player.setVelocityX(-speed);
    } else if (rightPressed) {
      this.player.setVelocityX(speed);
    }

    if (upPressed) {
      this.player.setVelocityY(-speed);
    } else if (downPressed) {
      this.player.setVelocityY(speed);
    }

    if (leftPressed && !rightPressed) {
      this.player.anims.play("walk_horizontal", true);
      this.player.flipX = false;
      this.lastDirection = "left";
    } else if (rightPressed && !leftPressed) {
      this.player.anims.play("walk_horizontal", true);
      this.player.flipX = true;
      this.lastDirection = "right";
    } else if (upPressed && !downPressed) {
      this.player.anims.play("walk_up", true);
      this.player.flipX = true;
      this.lastDirection = "up";
    } else if (downPressed && !upPressed) {
      this.player.anims.play("walk_down", true);
      this.player.flipX = true;
      this.lastDirection = "down";
    } else {
      this.player.anims.play(`idle-${this.lastDirection}`, true);
      this.player.flipX = this.lastDirection === "right";
    }
  }
}
