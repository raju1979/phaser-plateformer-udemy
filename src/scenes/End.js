/// <reference path="../../typings/phaser.d.ts" />
import Phaser from 'phaser';

export class End extends Phaser.Scene {

    constructor() {
        super({key: 'EndScene'});
        this.game = this;
    }

    init(data) {
        console.log(data);
        this.dataReceived = data;
    }

    preload() {
        this.load.image('play', 'assets/play.png');
    }

    create() {
        var style = { font: "25px Arial", fill: "#ffffff", align: "center" };

        if(this.dataReceived.success) {
            this.endText = "Congratulation You are now a UI developer";
        } else {
            this.endText = "You need to work more on your skill"
        }

        var text = this.add.text(20, 100, this.endText, style);



        const retryButton = this.add.image(250, 200, 'play');
        retryButton.setScale(.1);
        retryButton.setInteractive().on('pointerup', () => this.scene.start('GameScene'));

        
    }

}

export default End;