/// <reference path="../../typings/phaser.d.ts" />
import Phaser from 'phaser';
import Hero from '../entities/Hero';

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.collectionArray = [];
  }

  

  preload() {
    this.load.tilemapTiledJSON('level-1', 'assets/tilemaps/level-1.json');

    this.load.spritesheet('world-1-sheet', 'assets/tilesets/world-1.png', {
      frameWidth: 32,
      frameHeight: 32,
      margin: 1,
      spacing: 2
    });
    this.load.image('clouds-sheet', 'assets/tilesets/Clouds.png');

    this.load.spritesheet('hero-idle-sheet', 'assets/hero/idle.png', {
      frameWidth: 32,
      frameHeight: 64,
    });

    this.load.spritesheet('hero-run-sheet', 'assets/hero/run.png', {
      frameWidth: 32,
      frameHeight: 64,
    });

    this.load.spritesheet('hero-pivot-sheet', 'assets/hero/pivot.png', {
      frameWidth: 32,
      frameHeight: 64,
    });

    this.load.spritesheet('hero-jump-sheet', 'assets/hero/jump.png', {
      frameWidth: 32,
      frameHeight: 64,
    });

    this.load.spritesheet('hero-flip-sheet', 'assets/hero/spinjump.png', {
      frameWidth: 32,
      frameHeight: 64,
    });

    this.load.spritesheet('hero-fall-sheet', 'assets/hero/fall.png', {
      frameWidth: 32,
      frameHeight: 64,
    });

    this.load.spritesheet('hero-die-sheet', 'assets/hero/bonk.png', {
      frameWidth: 32,
      frameHeight: 64,
    });
  }

  create(data) {

    this.cursorKeys = this.input.keyboard.createCursorKeys();
    
    this.anims.create({
      key: 'hero-idle',
      frames: this.anims.generateFrameNumbers('hero-idle-sheet'),
    });

    this.anims.create({
      key: 'hero-running',
      frames: this.anims.generateFrameNumbers('hero-run-sheet'),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'hero-pivoting',
      frames: this.anims.generateFrameNumbers('hero-pivot-sheet'),
    });

    this.anims.create({
      key: 'hero-jumping',
      frames: this.anims.generateFrameNumbers('hero-jump-sheet'),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'hero-flipping',
      frames: this.anims.generateFrameNumbers('hero-flip-sheet'),
      frameRate: 30,
      repeat: 0,
    });

    this.anims.create({
      key: 'hero-falling',
      frames: this.anims.generateFrameNumbers('hero-fall-sheet'),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'hero-dead',
      frames: this.anims.generateFrameNumbers('hero-die-sheet')
    });

    this.addMap();

    this.addHero();

    this.cameras.main.setBounds(0,0, this.map.widthInPixels, this.map.heightInPixels);
    

  }

  addHero() {
    this.hero = new Hero(this, this.spawnPos.x, this.spawnPos.y);
    this.cameras.main.startFollow(this.hero);
    this.children.moveTo(this.hero, this.children.getIndex(this.map.getLayer('Foreground').tilemapLayer))

    const groundCollider = this.physics.add.collider(this.hero, this.map.getLayer('Ground').tilemapLayer);

    const spikeCollider = this.physics.add.overlap(this.hero, this.spikeGroup, (item, spike) => {
      spike.destroy();
      this.hero.kill();      
    });

    const collectibleCollider = this.physics.add.overlap(this.hero, this.collectibleGroup, this.collectCollectibles, null, this);

    this.hero.on('died', () => {
      groundCollider.destroy();
      spikeCollider.destroy();
      collectibleCollider.destroy();
      this.hero.body.setCollideWorldBounds(false);
      this.cameras.main.stopFollow();
    })

  }

  collectCollectibles(player, collectible) {
    this.collectionArray.push(collectible.name);
    collectible.destroy();
    if(this.collectionArray.length == 6) {
      this.scene.start('EndScene', {success: true})
    }
  }

  addMap() {

    this.map = this.make.tilemap({ key: 'level-1' });
    const groundTiles = this.map.addTilesetImage('world-1', 'world-1-sheet');

    const backgroundTiles = this.map.addTilesetImage('clouds', 'clouds-sheet');

    this.backgroundLayer = this.map.createStaticLayer('Background', backgroundTiles);
    this.backgroundLayer.setScrollFactor(0.6);;
    

    const groundLayer = this.map.createStaticLayer('Ground', groundTiles);
    groundLayer.setCollision([2,3,5], true);

    

    this.physics.world.setBounds(0,0, this.map.widthInPixels, this.map.heightInPixels);
    this.physics.world.setBoundsCollision(true, true, false, true);

    this.spikeGroup = this.physics.add.group({immovable: true, allowGravity: false});

    this.collectibleGroup = this.physics.add.group({immovable: true, allowGravity: false});

    this.map.getObjectLayer('Objects').objects.forEach((object) => {
      if(object.name == 'Start') {
        this.spawnPos = {x: object.x, y: object.y};
      }

      if(object.gid === 13) {
        const spike = this.spikeGroup.create(object.x, object.y, 'world-1-sheet', object.gid - 1);
        spike.setOrigin(0, 1);
        spike.setSize(object.width -  10, object.height - 10);
        spike.setOffset(5, 10);
      }
    });

    this.map.getObjectLayer('Collectibles').objects.forEach((object) => {
      if(object.type === 'collectible') {
        const collectible = this.collectibleGroup.create(object.x, object.y, 'world-1-sheet', object.gid - 1);
        collectible.setOrigin(0, 1);
        collectible.setSize(object.width -  10, object.height - 10);
        collectible.setOffset(5, 10);
        collectible.name = object.name;
      }
    })



    this.map.createStaticLayer('Foreground', groundTiles);
    const debugGraphics = this.add.graphics();
    // groundLayer.renderDebug(debugGraphics)
    


  }

  update(time, delta) {
    const cameraBottom = this.cameras.main.getWorldPoint(0, this.cameras.main.height).y;

    if(this.hero.isDead() && this.hero.getBounds().top > cameraBottom + 100) {
      this.hero.destroy();
      this.scene.start('EndScene', {success: false})

      // this.addHero();
    }

  }
}

export default Game;