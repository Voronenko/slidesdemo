
goog.require('lime');
goog.require('lime.Circle');
goog.require('lime.Director');
goog.require('lime.Layer');
goog.require('lime.Sprite');
goog.require('lime.fill.Frame');
goog.require('lime.animation.KeyframeAnimation');
goog.require('lime.animation.MoveBy');
goog.require('lime.SpriteSheet');
goog.require('lime.ASSETS.monster.plist');

goog.provide('game.Shiplayer');


game.Shiplayer = function(pane,game) {
    lime.Layer.call(this);

    // load the spritesheet
    this.shipsprite = new lime.SpriteSheet('assets/monster.png',lime.ASSETS.monster.plist);
}

goog.inherits(game.Shiplayer, lime.Layer);



game.Shiplayer.prototype.makeShip = function(point){
 var sprite = new lime.Sprite().setPosition(point.x,point.y)
 .setFill(this.shipsprite.getFrame('walking-s0001.png'));
 var light = new lime.Circle().setSize(6,6).setFill('#f90').setPosition(0,-40).setHidden(true);
 sprite.appendChild(light);

 sprite.select = function(){
 light.setHidden(false);
 }
 sprite.deselect = function(){
 light.setHidden(true);
 }

 // other element for hit area because original images have edges and I didn't crop
 var hitarea = new lime.Sprite().setSize(50,80);
 sprite.appendChild(hitarea);

 goog.events.listen(hitarea,['mousedown','touchstart'],function(e){
 this.select();
 e.event.stopPropagation();
 },false,sprite)

 return sprite;
 }


game.Shiplayer.prototype.moveToPosition = function(ship,pos, callback){
 var delta = goog.math.Coordinate.difference(pos,ship.getPosition()),
 angle = Math.atan2(-delta.y,delta.x);

 //determine the direction
 var dir = Math.round(angle/(Math.PI*2)*8);
 var dirs = ['e','ne','n','nw','w','sw','s','se'];
 if(dir<0) dir=8+dir;
 dir = dirs[dir];

 //move
 var move =new lime.animation.MoveBy(delta).setEasing(lime.animation.Easing.LINEAR).setSpeed(3);
 ship.runAction(move);

 // show animation
 var anim = new lime.animation.KeyframeAnimation();
 anim.delay= 1/7;
 for(var i=1;i<=7;i++){
 anim.addFrame(this.shipsprite.getFrame('walking-'+dir+'000'+i+'.png'));
 }
 ship.runAction(anim);

 // on stop show front facing
 goog.events.listen(move,lime.animation.Event.STOP,function(){
   anim.stop();
   if (typeof(callback)=="function"){
     callback();
   }
// ship.setFill(this.shipsprite.getFrame('walking-s0001.png'));
 })
 }



