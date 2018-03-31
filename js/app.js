const colSize = 101;
const colCenter = colSize/2-25; //center w/ offset for better looking placement
const rowSize = 83;
const rowCenter = rowSize/2+5; //center w/ offset for better looking placement
const colCount = 5;
const rowCount = 6;
const allowedKeys = {
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
var GameObject = function(x, y, sprite) {
  this.x = x;
  this.y = y;
  this.sprite = sprite;
  this.width = Resources.get(this.sprite).width;
  this.height = 83; //not using resource height because images are too large for cells
};

GameObject.prototype.update = function(dt){

};

GameObject.prototype.render = function(){
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//define character object for deviation from non-moving game objects later
var CharacterObject = function(x, y, sprite) {
  GameObject.call(this, x, y, sprite);
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
var Player = function(x, y, sprite){
  //ignore sprite currently, just use standard image obj
  //CharacterObject.call(this, x, y, sprite);
  CharacterObject.call(this, x, y, 'images/char-boy.png');
};

Player.prototype = Object.create(CharacterObject.prototype);
Player.prototype.constructor = Player;

//function to check boundary of the player object
//this function only applies to the player, as we don't care if
//other objects touch

const playerCollisionXOffset = 25; //offset for size of player image
checkBoundary = function(player, gameObject){
  var boundaryTouched = false;
  var playerBoundaryXLeft = (player.x - (player.width-playerCollisionXOffset)/2);
  var playerBoundaryYBottom = player.y - player.height/2;
  var playerBoundaryXRight = (player.x + (player.width-playerCollisionXOffset)/2);
  var playerBoundaryYTop = player.y + player.height/2;

  var gameObjectBoundaryXLeft = (gameObject.x - (gameObject.width-playerCollisionXOffset)/2);
  var gameObjectBoundaryYBottom = gameObject.y - gameObject.height/2;
  var gameObjectBoundaryXRight = (gameObject.x + (gameObject.width-playerCollisionXOffset)/2);
  var gameObjectBoundaryYTop = gameObject.y + gameObject.height/2;

  var xTouch = (playerBoundaryXLeft < gameObjectBoundaryXRight) && (playerBoundaryXRight > gameObjectBoundaryXLeft);
  var yTouch = (playerBoundaryYBottom < gameObjectBoundaryYTop) && (playerBoundaryYTop > gameObjectBoundaryYBottom);

  if(xTouch && yTouch) {
    boundaryTouched = true;
  }
  return boundaryTouched;
};

var performMove = function(player, key){
  var playerBoundaryXLeft = this.x - this.width/2;
  var playerBoundaryYBottom = this.y - this.height/2;
  var playerBoundaryXRight = this.x + this.width/2;
  var playerBoundaryYTop = this.y + this.height/2;

  if(key === "left")  {
    if(-1 < player.x-colSize){
      player.x = player.x-colSize;
    }
  }
  if(key === "right")  {
    if(colSize*colCount > player.x+colSize+colCenter){
      player.x = player.x+colSize;
    }
  }
  if(key === "down") {
    if(rowSize*(rowCount-2)-rowCenter > player.y-rowSize){
      player.y = player.y+rowSize;
    }
  }
  if(key === "up" )  {
    if(rowSize-rowCenter < player.y){
      player.y = player.y-rowSize;
    }
    else{
      console.log("Win");
      appInit();
    }
  }
  allEnemies.forEach(function(enemy){
    if(checkBoundary(player,enemy)){
      console.log("Lose");
      appInit();
    }
  });
};

Player.prototype.handleInput = function(key){
  //check for def
  if(key === undefined){
    console.log("Key not allowed!");
    return;
  }
  performMove(this,key);
  return;
};

// Enemies our player must avoid
var Enemy = function(x, y){
  CharacterObject.call(this, x, y, 'images/enemy-bug.png');
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
  var newX = updateEnemyX(dt, this);
  var index = allEnemies.indexOf(this);
  if(allEnemies[index]){
    allEnemies[index].x = newX;
    if(checkBoundary(player,this)){
      console.log("Lose");
      appInit();
    }
    if(allEnemies[index].x > colSize*colCount + colSize){
      allEnemies[index].x = -colSize;
    }
  }
};

var updateEnemyX = function(dt, enemy){
  return (dt * 10 * enemy.speed) + enemy.x;
};

//static quantity of enemies currently - maybe add text field later
var buildEnemyArray = function(enemyCount){
  allEnemies = [];
  for (var i = 0; i < enemyCount; i++){
    for(var j = rowCount/2; j < rowCount; j++){
      allEnemies.push(new Enemy(-colSize, (j-2)*rowSize-rowCenter));
    }
  }
};

var buildPlayer = function(){
  player = new Player(2*colSize, 5*rowSize-rowCenter, null);
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    player.handleInput(allowedKeys[e.keyCode]);
});

function appInit(){
  //1 enemies per row currently
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
