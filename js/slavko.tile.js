goog.provide('slavko.Tile');

slavko.Tile = function(x,y,kind){
    this.data = { };

    this.x = x;
    this.y = y;

    this.point = {
        x: x,
        y: y
    };

    this.kind = kind;
}

slavko.Tile.prototype.toString = function() {
    return "(x:" + this.x + ",y:" + this.y+')';
};

slavko.Tile.prototype.isLocked = function() {
    return this.kind == 1;
};

