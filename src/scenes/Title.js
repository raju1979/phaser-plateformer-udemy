/// <reference path="../../typings/phaser.d.ts" />
import Phaser from 'phaser';

class Title extends Phaser.Scene {

    constructor() {
        super({key: 'TitleScene'})
    }

    preload() {
        console.log('Preloading');
        this.load.image('play', 'assets/play.png');
    }

    create() {
        const helloButton = this.add.text(100, 50, 'Start the UI Developer journey!', { fill: '#0f0' });
       
        let content = [
            "User arrow keys to move left-right",
            "use up-arrow key to jump once",
            "user up-arrow twice to double jump",
            "avoid obstacles",
            "collect skills to complete"
        ];

        var style = { font: "14px", fill: "#ffffff", align: "center" };

        // var content = [
        //     "The sky above the port was the color of television, tuned to a dead channel.",
        //     "`It's not like I'm using,' Case heard someone say, as he shouldered his way ",
        //     "through the crowd around the door of the Chat. `It's like my body's developed",
        //     "this massive drug deficiency.' It was a Sprawl voice and a Sprawl joke.",
        //     "The Chatsubo was a bar for professional expatriates; you could drink there for",
        //     "a week and never hear two words in Japanese.",
        //     "",
        //     "Ratz was tending bar, his prosthetic arm jerking monotonously as he filled a tray",
        //     "of glasses with draft Kirin. He saw Case and smiled, his teeth a webwork of",
        //     "East European steel and brown decay. Case found a place at the bar, between the",
        //     "unlikely tan on one of Lonny Zone's whores and the crisp naval uniform of a tall",
        //     "African whose cheekbones were ridged with precise rows of tribal scars. `Wage was",
        //     "in here early, with two joeboys,' Ratz said, shoving a draft across the bar with",
        //     "his good hand. `Maybe some business with you, Case?'",
        //     "",
        //     "Case shrugged. The girl to his right giggled and nudged him.",
        //     "The bartender's smile widened. His ugliness was the stuff of legend. In an age of",
        //     "affordable beauty, there was something heraldic about his lack of it. The antique",
        //     "arm whined as he reached for another mug.",
        //     "",
        //     "",
        //     "From Neuromancer by William Gibson"
        // ];
    
        this.add.text(120, 200, content, style);

        const playBtn = this.add.image(250, 120, 'play');
        playBtn.setScale(.1);
        playBtn.setInteractive()
        .on('pointerup', () => this.scene.start('GameScene'));
    }

    update() {

    }

}

export default Title;