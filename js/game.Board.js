goog.provide('game.Board');

goog.require('goog.events');
goog.require('lime.Sprite');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.MoveTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.Spawn');
goog.require('lime.RoundedRect');
goog.require('lime.Polygon');

goog.require('mit.AstarImpl');

goog.require('game.Tile');
goog.require('game.Shiplayer');




game.Board.level = {
   BACKGROUND:0,
   GRID:1,
   TERRAIN:2,
   PATH:3,
   ACTORS:4
};

game.Board = function(pane, game) {
    lime.Sprite.call(this);
    this.pane = pane;

    this.SIZE = 700;
    this.rows = this.pane.SIZEY;
    this.cols = this.pane.SIZEX;
    


    this.cells = new Array(this.rows);
    this.setSize(this.SIZE, this.SIZE).setAnchorPoint(0, 0);

    // space that one cell takes
    this.XGAP = Math.round(this.SIZE / this.cols);
    this.YGAP = Math.round(this.SIZE / this.rows);


    //this.game = game;

    this.layers = [];
    for (var i = 0; i < 5; i++) {
        this.layers[i] = new lime.Layer();
        this.appendChild(this.layers[i]);
    }
    
    
    
  

    //line = new lime.Sprite().setSize(170, 1).setFill('#FFFFFF').setPosition(220 * .5, 185);
  //  this.appendChild(line);


};

goog.inherits(game.Board, lime.Sprite);

game.Board.prototype.level = {
   BACKGROUND:0,
   GRID:1,
   TERRAIN:2,
   PATH:3,
   ACTORS:4
};

game.Board.prototype.init = function() {
	this.tilesArray = [];
    //board.buildTerrain();
	
    this.drawBackground();
    this.buildGrid();
    this.buildTerrain();
    this.buildActors();
    
	goog.events.listen(this,['mousedown','touchstart'],goog.bind(this.makePath, this));
	//goog.events.listen(this.layers[this.level.ACTORS],['mousedown','touchstart'],goog.bind(this.moveShip, this));

}

game.Board.prototype.buildTerrain = function(){
        for (var c = 0; c < this.rows; c++) {
            if (!this.cells[c]) this.cells[c] = [];
            var i = 0;
            for (var r = this.cells[c].length; r < this.cols; r++) {
                i++;
                var logicTile = this.pane.getTileAt(c,r);
                var gameTile = game.Tile.allocateTale(logicTile.kind);
                gameTile.r = r;
                gameTile.c = c;
                gameTile.setPosition((c + .5) * this.XGAP, (i - .5) * this.YGAP);
                //gameTile.setPosition(this.XGAP, this.YGAP);
                gameTile.setSize(this.XGAP, this.YGAP);
                gameTile.setSize(this.XGAP, this.YGAP);
                this.cells[c].push(gameTile);
                this.layers[2].appendChild(gameTile);
            }
        }

  this.layers[4] = new game.Shiplayer();
  this.ActorShip = this.layers[4].makeShip(this.getPointAt({x:1,y:1}));
  this.layers[4].appendChild(this.ActorShip);
  this.appendChild(this.layers[4]);
  //this.layers[2].setHidden(true);

  this.layers[4].moveToPosition(this.ActorShip, this.getPointAt({x:0,y:0}));
    };


game.Board.prototype.drawBackground = function(){
	var mappicture = new lime.RoundedRect().setFill('im/gamebackground.jpg').setPosition(0,0).setAnchorPoint(0,0);
	this.layers[this.level.BACKGROUND].appendChild(mappicture);
}

game.Board.prototype.buildActors = function() {
	//this.ship = new fishing.Ship().setPosition(60,60);
	//this.layers[this.level.ACTORS].appendChild(this.ship);
}


 
    
game.Board.prototype.makePath = function(e) {

	
	var fromCell = this.getCellAt(this.ActorShip.getPosition()),
		toCell = this.getCellAt(e.position);

	var AstarHelper = new mit.AstarImpl();
	var path = AstarHelper.search(this.pane.nodes, 
                                      this.pane.getTileAt(fromCell.x, fromCell.y), 
				      this.pane.getTileAt(toCell.x, toCell.y));
	
	
	
	var position;
	//var polygon = new lime.Polygon();
	var prevPosition = this.ActorShip.getPosition();
	var size = 5;
	
	var dx,dy,width,sprite;
	
	for(i=0;i<path.length;i++) {
		position = this.getPointAt(path[i]);
		//polygon.addPoint(position);
		
		
		
		dx = Math.abs(prevPosition.x - position.x);
		dy = Math.abs(prevPosition.y-position.y);
		width = Math.sqrt(dx*dx+dy*dy)+size;
		sprite = new lime.Sprite().setSize(width, size)
			.setAnchorPoint(size/2/width, .5)
			.setRotation(-Math.atan2(prevPosition.y-position.y, prevPosition.x-position.x)*180/Math.PI)
			.setFill(255,0,0)
			.setPosition(position.x, position.y);
		
		console.log(sprite);
		
		this.layers[this.level.ACTORS].appendChild(sprite);
		
		prevPosition = position;
		
		
		
		
	}

	//polygon.setFill(255,0,0,1).setScale(1);
	
	//this.layers[this.level.ACTORS].appendChild(polygon);
	
	
	






}
    




game.Board.prototype.getPointAt = function(pos){
  return new goog.math.Coordinate(Math.round(this.XGAP*(pos.x+.5)),Math.round(this.YGAP*(pos.y+.5)));  
}

game.Board.prototype.getCellAt = function(pos){
  return new goog.math.Coordinate(~~(pos.x/this.XGAP),~~(pos.y/this.YGAP));  
}




game.Board.prototype.buildGrid = function() {
    for (var i=0; i <= this.rows; i++) {
        var line = new lime.Sprite().setSize(this.SIZE, 1).setFill('#FFFFFF').setPosition(this.SIZE*.5, i*this.YGAP);
        this.layers[this.level.GRID].appendChild(line);
    }

    for (var i=0; i <= this.cols; i++) {
        var line = new lime.Sprite().setSize(1,this.SIZE).setFill('#FFFFFF').setPosition(i*this.XGAP,this.SIZE*.5);
        this.layers[this.level.GRID].appendChild(line);
    }

    goog.events.listen(this,['mousedown','touchstart'],goog.bind(this.doClick,this));
}

game.Board.prototype.doClick = function(e) {
  function RecursivePath(){
    var point = result.shift();
    if (typeof(point)!="undefined"){
      this.layers[4].moveToPosition(this.ActorShip, this.getPointAt(point),RecursivePathDelegate);
    }
  }


  var endcell = this.getCellAt(e.position);
  var startcell = this.getCellAt(this.ActorShip.getPosition());

  var AstarHelper = new mit.AstarImpl();
  var result = AstarHelper.search(this.pane.nodes, this.pane.getTileAt(startcell.x,startcell.y), this.pane.getTileAt(endcell.x,endcell.y));

  var RecursivePathDelegate= goog.bind(RecursivePath,this);
  if (result.length!=0){
    RecursivePathDelegate();
  }
};



