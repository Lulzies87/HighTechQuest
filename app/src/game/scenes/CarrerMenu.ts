import Phaser from "phaser";

export default class CarrerMenu extends Phaser.Scene {
  constructor() {
    super("CarrerMenu");
  }

  create() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    this.add
      .text(centerX, centerY - 200, "Choose Your Carrer Path:", {
        fontSize: "28px",
        color: "#fff",
      })
      .setOrigin(0.5);
  }
}
