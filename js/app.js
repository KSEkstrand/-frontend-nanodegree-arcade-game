const colSize = 101;
const rowSize = 83;
const colCount = 5;
const rowCount = 6;
const allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
};



//GameObject Top level object for game
//1 - has screen location
//2 - can be touched (i.e. has boundaries)
//3 - has image
var GameObject = function(x, y, sprite, dt) {
  this.x = x;
  this.y = y;
  this.sprite = sprite;
  this.dt = dt;
  this.width = sprite.width;
  this.height = sprite.height;
};

GameObject.prototype.update = function(dt){

};

GameObject.prototype.render = function(){
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var CharacterObject = function() {
  GameObject.call(x, y, sprite);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

//player object
var Player = function(x, y, sprite){
  //ignore sprite currently, just use standard image obj
  //CharacterObject.call(this, x, y, sprite);
  CharacterObject.call(this, x, y, 'images/char-boy.png');
};

//function to check boundary of the player object
//this function only applies to the player, as we don't care if
//other objects touch
Player.prototype.checkBoundary = function(gameObject){
  var boundaryTouched = false;
  var playerBoundaryXLeft = this.x - this.width/2;
  var playerBoundaryYBottom = this.y - this.height/2;
  var playerBoundaryXRight = this.x + this.width/2;
  var playerBoundaryYTop = this.y + this.height/2;

  var gameObjectBoundaryXLeft = gameObject.x - gameObject.width/2;
  var gameObjectBoundaryYBottom = gameObject.y - gameObject.height/2;
  var gameObjectBoundaryXRight = gameObject.x + gameObject.width/2;
  var gameObjectBoundaryYTop = gameObject.y + gameObject.height/2;

  var xTouch = (playerBoundaryXLeft < gameObjectBoundaryXRight) && (playerBoundaryXRight > gameObjectBoundaryXLeft);
  var yTouch = (playerBoundaryYBottom < gameObjectBoundaryYTop) && (playerBoundaryYTop > gameObjectBoundaryYBottom);

  if(xTouch && yTouch) {
    boundaryTouched = true;
  }
  return boundaryTouched;
};

Player.prototype.performMove = function(playerObject){
  if(playerObject.checkGameEdge(x,y)){

  }
};

Player.prototype.checkGameEdge = function(key){
  var playerBoundaryXLeft = this.x - this.width/2;
  var playerBoundaryYBottom = this.y - this.height/2;
  var playerBoundaryXRight = this.x + this.width/2;
  var playerBoundaryYTop = this.y + this.height/2;

  var isEdgeTouched = false;
  return isEdgeTouched;
};



Player.prototype.handleInput = function(key){
  //check for def
  if(key === undefined){
    console.log("Key not allowed!");
    return;
  }

  if(!this.checkGameEdge(key)){

  }

};

// Enemies our player must avoid
var Enemy = function(x, y){
  CharacterObject.call(this, x, y, 'images/enemy-bug.png');
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  this.x = dt * (x+1);
};

Enemy.prototype.constructor = Enemy.prototype.constructor;

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var player = null;
//array for object storage
var allEnemies = [];

//array for players later?
// var playerArray = [];

//array for treasure?
var treasureArray = [];

//static quantity of enemies currently - maybe add text field later
var buildEnemyArray = function(enemyCount){
  for (var i = 0; i < enemyCount; i++){
    for(var j = rowCount/2; j < rowCount; j++){
      allEnemies.push(new Enemy(0, j*rowSize));
    }
  }
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    player.handleInput(allowedKeys[e.keyCode]);
});

//init
(function(){
  buildEnemyArray(6);

  //ToDo add custom player image
  player = new Player(3*rowSize, columnSize, null);
})();
