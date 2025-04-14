import Phaser from "phaser";
import { Player } from "../objects/Player";
import { COIN_SCORE } from "../utils/Constants";

export default class MainScene extends Phaser.Scene {
  private walls?: Phaser.Physics.Arcade.StaticGroup;
  private player?: Player;
  private coins?: Phaser.Physics.Arcade.Group;
  private scoreText?: Phaser.GameObjects.Text;
  private lifeBarBackground?: Phaser.GameObjects.Rectangle;
  private lifeBarFill?: Phaser.GameObjects.Rectangle;
  private heart?: Phaser.GameObjects.Image;
  private hp: number = 87;
  private score: number = 0;

  constructor() {
    super({ key: "MainScene" });
  }

  preload() {
    this.load.image("floor", "/assets/floor.png");
    this.load.image("wall", "/assets/wall.png");
    this.load.image("coin", "/assets/coin.png");
    this.load.image("heart", "/assets/heart.png");
    this.load.spritesheet("character", "/assets/character.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    // TODO: this.createWorld();
    this.physics.world.setBounds(0, 0, 3840, 2160);

    for (let x = 0; x < 3840; x += 32) {
      for (let y = 0; y < 2160; y += 32) {
        this.add.image(x, y, "floor").setOrigin(0, 0);
      }
    }

    this.walls = this.physics.add.staticGroup();

    for (let x = 0; x <= 3840; x += 32) {
      this.walls.create(x, 0, "wall");
      this.walls.create(x, 2160, "wall");
    }

    for (let y = 0; y <= 2160; y += 32) {
      this.walls.create(0, y, "wall");
      this.walls.create(3840, y, "wall");
    }

    this.createObstacles();

    this.coins = this.physics.add.group({
      key: "coin",
      repeat: 5,
      setXY: { x: 11 * 32, y: 11 * 32, stepX: 128 },
    });

    this.coins.children.iterate((child) => {
      const sprite = child as Phaser.Physics.Arcade.Image;
      sprite.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      return true;
    });

    this.player = new Player(this, 500, 300);

    this.scoreText = this.add.text(1000, 16, `${this.score}`, {
      fontSize: "32px",
      color: "#000",
    });
    this.scoreText.setScrollFactor(0);

    this.heart = this.add.image(1100, 16, "heart").setOrigin(0, 0);
    this.heart.setScrollFactor(0);

    this.lifeBarBackground = this.add
      .rectangle(1150, 16, 100, 32, 0x888888)
      .setOrigin(0, 0);
    this.lifeBarFill = this.add
      .rectangle(1150, 16, this.hp, 32, 0xff0000)
      .setOrigin(0, 0);

    this.lifeBarBackground.setScrollFactor(0);
    this.lifeBarFill.setScrollFactor(0);

    this.physics.add.collider(this.player, this.walls);
    this.physics.add.overlap(
      this.player,
      this.coins,
      this.collectCoin,
      undefined,
      this
    );

    this.cameras.main.setBounds(0, 0, 3840, 2160);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setDeadzone(100, 100);
  }

  collectCoin(player: any, coin: any) {
    coin.disableBody(true, true);
    this.score += COIN_SCORE;
    this.scoreText?.setText(`${this.score}`);
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
      const wallLength = Math.floor(Math.random() * 5) + 3;
      for (let i = 0; i < wallLength; i++) {
        this.walls!.create(pos.x + i * 32, pos.y, "wall");
      }
    });
  }

  update() {
    this.player?.update();
  }
}
