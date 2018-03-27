
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

//player object
var Player = function(x, y, sprite){
  //ignore sprite currently, just use standard image obj
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

Player.prototype.checkGameEdge = function(x, y){
  var playerBoundaryXLeft = this.x - this.width/2;
  var playerBoundaryYBottom = this.y - this.height/2;
  var playerBoundaryXRight = this.x + this.width/2;
  var playerBoundaryYTop = this.y + this.height/2;


};

Player.prototype.handleInput = function(key){
  if(key === undefined){
    console.log("Key not allowed!");
    return;
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

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
