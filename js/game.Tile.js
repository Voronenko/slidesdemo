/**
 * Created by JetBrains PhpStorm.
 * User: XPMUser
 * Date: 5/5/12
 * Time: 3:01 PM
 * To change this template use File | Settings | File Templates.
 */
goog.provide('game.Tile');


goog.require('lime.RoundedRect');
goog.require('lime.Sprite');


game.Tile = function() {
    goog.base(this);
    this.rectangle = new lime.Sprite();
    this.appendChild(this.rectangle);

    this.selected_ = false;

    this.index = -1;

    this.qualityRenderer = true;



};


goog.inherits(game.Tile, lime.Sprite);


game.Tile.allocateTale = function(kind) {
    var tile = new game.Tile();
    if (kind==game.Tile.kind.SEA) {
        tile.rectangle.setFill('assets/sea.png');
    } else {
        tile.rectangle.setFill('assets/land.png');
    }
    return tile;
};

game.Tile.kind= {
    SEA:0,
    LAND:1
};



