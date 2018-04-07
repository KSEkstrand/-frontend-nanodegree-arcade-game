const COLSIZE = 101;
const COLCENTER = COLSIZE/2-25; //center w/ offset for better looking placement
const ROWSIZE = 83;
const ROWCENTER = ROWSIZE/2+5; //center w/ offset for better looking placement
const COLCOUNT = 5;
const ROWCOUNT = 6;

const ALLOWEDKEYS = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
};

//player object
player = null;

//array for enemies
allEnemies = [];

//array for treasure?
//var treasureArray = [];

//array for players later?
// var playerArray = [];


//GameObject Top level object for game
//1 - has screen location
//2 - can be touched (i.e. has boundaries)
//3 - has image
var GameObject = function(x, y, sprite, collisionOffset) {
  this.x = x;
  this.y = y;
  this.sprite = sprite;
  this.width = Resources.get(this.sprite).width;
  this.height = 83; //not using resource height because images are too large for cells
  this.collisionOffset = collisionOffset;
};

// Currently unused, but fallback method for inheriting classes
// Can be used later for alternative updates
GameObject.prototype.update = function(dt){

};

GameObject.prototype.render = function(){
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//define character object for deviation from non-moving game objects later
var CharacterObject = function(x, y, sprite, collisionOffset) {
  GameObject.call(this, x, y, sprite, collisionOffset);
};
CharacterObject.prototype = Object.create(GameObject.prototype);
CharacterObject.prototype.constructor = CharacterObject;

//currently unused
// var NonCharacterObject = function() {
//   GameObject.call(x, y, sprite);
// };

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

//player object
var Player = function(x, y, sprite, collisionOffset){
  //ignore sprite currently, just use standard image obj
  //CharacterObject.call(this, x, y, sprite);
  CharacterObject.call(this, x, y, 'images/char-boy.png', 25);
};

Player.prototype = Object.create(CharacterObject.prototype);
Player.prototype.constructor = Player;

//BROKEN - detection when moved to player.checkboundary
Player.prototype.checkBoundary = function(gameObject){
  return checkGameObjectBoundary(this, gameObject);
};

//Base gameboundary checking
//Takes 2 game objects and returns boolean indicating collision between
//Can be extended to be invoked by all checkBoundary Functions
var checkGameObjectBoundary = function(gameObject1, gameObject2){
  var boundaryTouched = false;
  var gameObject1XLeft = (gameObject1.x - (gameObject1.width-gameObject1.collisionOffset)/2);
  var gameObject1YBottom = gameObject1.y - gameObject1.height/2;
  var gameObject1XRight = (gameObject1.x + (gameObject1.width-gameObject1.collisionOffset)/2);
  var gameObject1YTop = gameObject1.y + gameObject1.height/2;

  var gameObject2BoundaryXLeft = (gameObject2.x - (gameObject2.width-gameObject2.collisionOffset)/2);
  var gameObject2BoundaryYBottom = gameObject2.y - gameObject2.height/2;
  var gameObject2BoundaryXRight = (gameObject2.x + (gameObject2.width-gameObject2.collisionOffset)/2);
  var gameObject2BoundaryYTop = gameObject2.y + gameObject2.height/2;

  var xTouch = (gameObject1XLeft < gameObject2BoundaryXRight) && (gameObject1XRight > gameObject2BoundaryXLeft);
  var yTouch = (gameObject1YBottom < gameObject2BoundaryYTop) && (gameObject1YTop > gameObject2BoundaryYBottom);

  if(xTouch && yTouch) {
    boundaryTouched = true;
  }
  return boundaryTouched;
};

Player.prototype.handleInput = function(key){
  //check for def
  if(key === undefined){
    console.log("Key not allowed!");
    return;
  }

  if(key === "left")  {
    if(-1 < this.x-COLSIZE){
      this.x = this.x-COLSIZE;
    }
  }
  if(key === "right")  {
    if(COLSIZE*COLCOUNT > this.x+COLSIZE+COLCENTER){
      this.x = this.x+COLSIZE;
    }
  }
  if(key === "down") {
    if(ROWSIZE*(ROWCOUNT-2)-ROWCENTER > this.y-ROWSIZE){
      this.y = this.y+ROWSIZE;
    }
  }
  if(key === "up" )  {
    if(ROWSIZE-ROWCENTER < this.y){
      this.y = this.y-ROWSIZE;
    }
    else{
      console.log("Win");
      appInit();
    }
  }
  let playerCheck = this;

  //evaluate check for collision on move, not only on frame update
  //can be used to check for treasure touch
  allEnemies.forEach(function(enemy){
    if(playerCheck.checkBoundary(enemy)){
      console.log("Lose");
      appInit();
    }
  });
  return;
};

// Enemies our player must avoid
var Enemy = function(x, y, collisionOffset){
  CharacterObject.call(this, x, y, 'images/enemy-bug.png', collisionOffset);
  this.speed = generateRandomEnemySpeedOffset();
};

var generateRandomEnemySpeedOffset = function(){
  return Math.abs(Math.floor((Math.random() * 20) + 30) - Math.floor((Math.random() * 20) + 20)) + 2;
};

Enemy.prototype = Object.create(CharacterObject.prototype);
Enemy.prototype.constructor = Enemy;
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  this.x = (dt * 10 * this.speed) + this.x;

  if(player.checkBoundary(this)){
    console.log("Lose");
    appInit();
  }
  if(this.x > COLSIZE*COLCOUNT + COLSIZE){
    this.x = -COLSIZE;
  }
};

//static quantity of enemies currently - maybe add text field later
var buildEnemyArray = function(enemyCount){
  allEnemies = [];
  for (var i = 0; i < enemyCount; i++){
    for(var j = ROWCOUNT/2; j < ROWCOUNT; j++){
      allEnemies.push(new Enemy(-COLSIZE, (j-2)*ROWSIZE-ROWCENTER, 25));
    }
  }
};

var buildPlayer = function(){
  //Not handling building out custom sizes or custom images yet. Maybe later.
  player = new Player(2*COLSIZE, 5*ROWSIZE-ROWCENTER, null, null);
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    player.handleInput(ALLOWEDKEYS[e.keyCode]);
});

function appInit(){
  //call build enemies to build x enemies
  buildEnemyArray(2);

  //ToDo add custom player image
  buildPlayer();
}

//appInit
(function(){
      /* Go ahead and load all of the images we know we're going to need to
       * draw our game level. Then set init as the callback method, so that when
       * all of these images are properly loaded our game will start.
       */
      Resources.load([
          'images/stone-block.png',
          'images/water-block.png',
          'images/grass-block.png',
          'images/enemy-bug.png',
          'images/char-boy.png'
      ]);
      Resources.onReady(appInit);
})();
