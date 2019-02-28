var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 1500,
  height: 900,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);
let direction = 0, player, otherPlayer;
let teamBlue = [], teamRed = [];
let MainPlayerTeam, OtherPlayerTeam;
let random = parseInt(Math.random() * 10);
let randomOP = parseInt(Math.random() * 10);

function preload() {
    //Sound
  //1 Fond
  this.load.audio('music', 'assets/audio/battleThemeB.mp3');
  //MAP
  //1
    this.load.image('fond','assets/Background.png');
    this.load.image('wall','assets/border.png');
  //2
    this.load.image("Map", "assets/tilesets/Map.jpg");
    this.load.image("tiles", "assets/tilesets/server_objects.png");
    this.load.image("tile1", "assets/tilesets/tile1.png");
    this.load.image("walkable", "assets/tilesets/walkable.png");
    this.load.tilemapTiledJSON("map", "assets/tilemaps/MAPUF3.json");
    //

 // BLUE 
 this.load.spritesheet('dude','assets/bluerun.png', { frameWidth: 75, frameHeight: 80 });
 this.load.spritesheet('dudeAttack','assets/bluerunAttack.png', { frameWidth: 108, frameHeight: 80 });
 this.load.spritesheet('SdudeAttack','assets/bluesuperattack.png', { frameWidth: 108, frameHeight: 80 });

// MINAUTORE
 this.load.spritesheet('minautore', 'assets/minaurun.png', {frameWidth: 104, frameHeight: 80});
 this.load.spritesheet('minauAttack','assets/minauattack.png', { frameWidth: 142, frameHeight: 130 });
 this.load.spritesheet('SminauAttack','assets/minausuperattack.png', { frameWidth: 144, frameHeight: 85 });

// NAIN
 this.load.spritesheet('nain', 'assets/nainrun.png', {frameWidth: 134, frameHeight: 80});
 this.load.spritesheet('nainAttack','assets/nainattack.png', { frameWidth: 115, frameHeight: 99 });
 this.load.spritesheet('SnainAttack','assets/nainsuperattack.png', { frameWidth: 100, frameHeight: 80 });

 //PERE NOEL
 this.load.spritesheet('noel', 'assets/noelrun.png', {frameWidth: 55, frameHeight: 55});
 this.load.spritesheet('noelAttack','assets/noelattack.png', { frameWidth: 58, frameHeight: 55 });
 this.load.spritesheet('SnoelAttack','assets/noelsuperattack.png', { frameWidth: 64, frameHeight: 60 });

  this.load.image('star', 'assets/star.png');
}

function degat(){

  this.socket.emit('attaque',1);

}
function update() {
  
  this.ship.setMaxVelocity(x, y);
  if (this.ship) {
    //Les déplacments
    if (this.cursors.left.isDown) {
      direction = "left";
      this.ship.setVelocityX(-100);
      this.ship.anims.play('left', true);
      
      this.physics.add.collider(this.ship, this.otherPlayers);

    } else if (this.cursors.right.isDown) {
      direction = "right";
      this.ship.setVelocityX(100);
      this.ship.anims.play('right', true);

    } else if (direction == "right" && this.cursors.down.isDown) {
      direction = "right";
      this.ship.setVelocityY(100);
      this.ship.anims.play('right', true);
      
    } else if (direction == "right" && this.cursors.up.isDown) {
      direction = "right";
      this.ship.setVelocityY(-100);
      this.ship.anims.play('right', true);
    } else if (direction == "left" && this.cursors.up.isDown) {
      direction = "left";
      this.ship.setVelocityY(-100);
      this.ship.anims.play('left', true);

    } else if (direction == "left" && this.cursors.down.isDown) {
      direction = "left";
      this.ship.setVelocityY(100);
      this.ship.anims.play('left', true);

    }//les Attaques
    if (direction == "left" && this.cursors.space.isDown) {
      
      direction = "left";
      this.ship.anims.play('attackLeft', true);
      // console.log(this.otherPlayers.children.entries[0].playerId);
      this.physics.add.collider(this.ship, this.otherPlayers, degat,null,this);
      

    } else if (direction == "right" && this.cursors.space.isDown) {
      direction = "right";
      this.ship.anims.play('attackRight', true);
      this.physics.add.collider(this.ship, this.otherPlayers, degat,null,this);
      

    }
    if (direction == "left" && this.cursors.shift.isDown) {
      direction = "left";
      this.ship.anims.play('SattackLeft', true);
      
      this.physics.add.collider(this.ship, this.otherPlayers, degat,null,this);
      

    } else if (direction == "right" && this.cursors.shift.isDown) {
      direction = "right";
      this.ship.anims.play('SattackRight', true);

      this.physics.add.collider(this.ship, this.otherPlayers, degat,null,this);
    }

    // emit player movement
    var x = this.ship.x;
    var y = this.ship.y;
    var r = this.ship.rotation;
    var team = this.ship.team;
    if (this.ship.oldPosition && (x !== this.ship.oldPosition.x || y !== this.ship.oldPosition.y || r !== this.ship.oldPosition.rotation)) {
      this.socket.emit('playerMovement', { x: this.ship.x, y: this.ship.y, rotation: this.ship.rotation});
    }
    

    // save old position data
    this.ship.oldPosition = {
      x: this.ship.x,
      y: this.ship.y,
      rotation: this.ship.rotation
    };
  }

}
function create() {
  //Sound
  //1
  let musicSnd = this.sound.add('music');
    musicSnd.play();
  //MAP
  //1
 /* this.add.image(750,450,'fond');

  platforms = this.physics.add.staticGroup();

  platforms.create(750, 450, 'wall');
  this.physics.add.collider(ship, platforms);*/

  //2
   const map = this.make.tilemap({ key: "map" });
  // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
  // Phaser's cache (i.e. the name you used in preload)
  const tileset1 = map.addTilesetImage("Map caro", "Map");
  const tileset2 = map.addTilesetImage("tile1","tile1");

  let positionXBlue = 1000, positionYBlue = 350;
  let positionXRed = 100, positionYRed = 350;
  // Parameters: layer name (or index) from Tiled, tileset, x, y
  const worldLayer = map.createStaticLayer("Border", tileset1, 0, 0).setScale(0.5);
  const belowLayer = map.createStaticLayer("Backgrounds", tileset1, 0, 0).setScale(0.5);
  const aboveLayer = map.createStaticLayer("Colliders", tileset2, 0, 0);
  //
  // CREE BLUE
  if (random < 3) {
    this.ship = this.physics.add.sprite(100, 350, 'dude');
  }
  // CREE UN MINAUTORE
  else if(random >= 3 && random <= 5 ) {
    this.ship = this.physics.add.sprite(100, 350, 'minautore');
  }
 // CREE UN NAIN
  else if(random > 5 && random < 8 ) {
    this.ship = this.physics.add.sprite(100, 350, 'nain').setDisplaySize(90, 70);
  }

  //CREE PERE NOEL
  else if(random >=8 && random <=10) {
    this.ship = this.physics.add.sprite(100, 350, 'noel').setDisplaySize(80, 65);
  }
  this.ship.setCollideWorldBounds(true);
  var self = this;
  this.socket = io();
  
  this.otherPlayers = this.physics.add.group();
  
  this.cursors = this.input.keyboard.createCursorKeys();
  
  

  this.anims.create({
    key: 'leftO',
    frames: this.anims.generateFrameNumbers('otherPlayer', { start: 0, end: 2 }),
    frameRate: 10,
    repeat: 1
  });

  this.anims.create({
    key: 'rightO',
    frames: this.anims.generateFrameNumbers('otherPlayer', { start: 3, end: 5 }),
    frameRate: 10,
    repeat: 1
  });

   //ANIMATIONS BLUE
   if (random < 3) {
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: 1
    });
  
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 3, end: 5 }),
        frameRate: 10,
        repeat: 1
    });
    this.anims.create({
      key: 'attackLeft',
      frames: this.anims.generateFrameNumbers('dudeAttack', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: 1
  });
    this.anims.create({
      key: 'attackRight',
      frames: this.anims.generateFrameNumbers('dudeAttack', { start: 3, end: 6 }),
      frameRate: 10,
      repeat: 1
    });
    this.anims.create({
      key: 'SattackRight',
      frames: this.anims.generateFrameNumbers('SdudeAttack', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: 1
    });
    this.anims.create({
    key: 'SattackLeft',
    frames: this.anims.generateFrameNumbers('SdudeAttack', { start: 3, end: 6 }),
    frameRate: 10,
    repeat: 1
    });
  } 
  //ANIMATIONS MINAUTORE
  else if (random >= 3 && random <= 5) {
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('minautore', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: 1
  });
  
  this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('minautore', { start: 3, end: 5 }),
      frameRate: 10,
      repeat: 1
  });
  this.anims.create({
    key: 'attackLeft',
    frames: this.anims.generateFrameNumbers('minauAttack', { start: 0, end: 2 }),
    frameRate: 10,
    repeat: 1
  });
  this.anims.create({
    key: 'attackRight',
    frames: this.anims.generateFrameNumbers('minauAttack', { start: 3, end: 5 }),
    frameRate: 10,
    repeat: 1
  });
  
  this.anims.create({
    key: 'SattackRight',
    frames: this.anims.generateFrameNumbers('SminauAttack', { start: 0, end: 2 }),
    frameRate: 10,
    repeat: 1
  });
  this.anims.create({
  key: 'SattackLeft',
  frames: this.anims.generateFrameNumbers('SminauAttack', { start: 3, end: 6 }),
  frameRate: 10,
  repeat: 1
  });
  }
  //ANIMATIONS NAINS
  else if (random > 5 && random < 8) {
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('nain', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: 1
  });
  
  this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('nain', { start: 3, end: 6 }),
      frameRate: 10,
      repeat: 1
  });
  this.anims.create({
    key: 'attackLeft',
    frames: this.anims.generateFrameNumbers('nainAttack', { start: 0, end: 2 }),
    frameRate: 10,
    repeat: 1
  });
  this.anims.create({
    key: 'attackRight',
    frames: this.anims.generateFrameNumbers('nainAttack', { start: 3, end: 6 }),
    frameRate: 10,
    repeat: 1
  });
  
  this.anims.create({
    key: 'SattackRight',
    frames: this.anims.generateFrameNumbers('SnainAttack', { start: 0, end: 2 }),
    frameRate: 10,
    repeat: 1
  });
  this.anims.create({
  key: 'SattackLeft',
  frames: this.anims.generateFrameNumbers('SnainAttack', { start: 3, end: 6 }),
  frameRate: 10,
  repeat: 1
  });
  }
    //ANIMATIONS PERE NOEL
  else if (random >= 8 && random <= 10) {
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('noel', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: 1
  });
  
  this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('noel', { start: 3, end: 6 }),
      frameRate: 10,
      repeat: 1
  });
  
  this.anims.create({
    key: 'attackLeft',
    frames: this.anims.generateFrameNumbers('noelAttack', { start: 0, end: 2 }),
    frameRate: 10,
    repeat: 1
  });
  this.anims.create({
    key: 'attackRight',
    frames: this.anims.generateFrameNumbers('noelAttack', { start: 3, end: 6 }),
    frameRate: 10,
    repeat: 1
  });
  this.anims.create({
    key: 'SattackRight',
    frames: this.anims.generateFrameNumbers('SnoelAttack', { start: 3, end: 6 }),
    frameRate: 10,
    repeat: 1
  });
  this.anims.create({
  key: 'SattackLeft',
  frames: this.anims.generateFrameNumbers('SnoelAttack', { start: 0, end: 2 }),
  frameRate: 10,
  repeat: 1
  });
  }
  


  this.socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        addPlayer(self, players[id]);
        MainPlayerTeam= players[id].team;
      } else {
        addOtherPlayers(self, players[id]);
        OtherPlayerTeam= players[id].team;
      }
    });
  });
  console.log(MainPlayerTeam, OtherPlayerTeam);

  this.socket.on('newPlayer', function (playerInfo) {
    addOtherPlayers(self, playerInfo);
  });

  this.socket.on('disconnect', function (playerId) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerId === otherPlayer.playerId) {
        otherPlayer.destroy();
      }
    });
  });
  this.blueScoreText = this.add.text(16, 16, '', { fontSize: '32px', fill: '#0000FF' });
  this.redScoreText = this.add.text(584, 16, '', { fontSize: '32px', fill: '#FF0000' });
    
  this.socket.on('scoreUpdate', function (scores) {
    self.blueScoreText.setText('Team Blue: ' + scores.blue);
    self.redScoreText.setText('Team Red: ' + scores.red);
  });


  this.socket.on('starLocation', function (starLocation) {
    if (self.star) self.star.destroy();
    self.star = self.physics.add.image(starLocation.x, starLocation.y, 'star');
    self.physics.add.overlap(self.ship, self.star, function () {
      this.socket.emit('starCollected');
    }, null, self);
  });

  this.socket.on('playerMoved', function (playerInfo) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerInfo.playerId === otherPlayer.playerId) {
        // otherPlayer.setRotation(playerInfo.rotation);
        otherPlayer.setPosition(playerInfo.x, playerInfo.y);
      }
    });
  });
  
}
function addPlayer(self, playerInfo) {
  // self.ship = self.physics.add.image(playerInfo.x, playerInfo.y, 'dude')
  //   .setOrigin(0.5, 0.5).setDisplaySize(83, 80);
  MainPlayerTeam = playerInfo.team;
  console.log(playerInfo.team);
  if (playerInfo.team === 'blue') {
    self.ship.setTint(0x66cccc);
    teamBlue.push(playerInfo.playerId);

  } else {
    self.ship.setTint(0xff9999);
    teamRed.push(playerInfo.playerId);
  }
  self.ship.setDrag(100);
  self.ship.setAngularDrag(100);
  self.ship.setMaxVelocity(70);
}
function addOtherPlayers(self, playerInfo) {
  //const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'otherPlayer').setOrigin(0.5, 0.5).setDisplaySize(83, 80);
   // CREE BLUE
   if (randomOP < 3) {
    otherPlayer = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'dude')
  }
  // CREE UN MINAUTORE
  else if(randomOP >= 3 && randomOP <= 5 ) {
    otherPlayer = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'minautore')
  }
 // CREE UN NAIN
  else if(randomOP > 5 && randomOP < 8 ) {
    otherPlayer = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'nain').setDisplaySize(90, 70)
  }

  //CREE PERE NOEL
  else if(randomOP >=8 && randomOP <=10) {
    otherPlayer = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'noel').setDisplaySize(80, 65)
  }
  if (playerInfo.team === 'blue') {

    otherPlayer.setTint(0x66cccc);
    teamBlue.push(playerInfo.playerId);

  } else {
    otherPlayer.setTint(0xff9999);
    teamRed.push(playerInfo.playerId);
  }
  otherPlayer.playerId = playerInfo.playerId;
  self.otherPlayers.add(otherPlayer);
  
}
// console.log(teamBlue);
// console.log(teamRed);