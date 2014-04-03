goog.provide('slavko.Pane');

//tile is wrapper over yet unknown items
goog.require('slavko.Tile');


var PaneTileType = {
    SEA:0,
    GROUND: 1

}

slavko.Pane = function(panesetuparray){
    var nodes = [];
    this.panearray= panesetuparray; //original array
    var row, rowLength, len = panesetuparray.length;
    for (var x = 0; x < len; ++x) {
        row = panesetuparray[x];
        rowLength = row.length;
        nodes[x] = new Array(rowLength);
        for (var y = 0; y < rowLength; ++y) {
            nodes[x][y] = new slavko.Tile(x, y, row[y]);
        }

    }
    this.nodes = nodes;

    this.SIZEX = rowLength;
    this.SIZEY = len;
}

slavko.Pane.prototype.getTileAt = function (x, y) {
    return this.nodes[x][y];
};

slavko.Pane.prototype.toString = function() {
    var result = "\n";
    var nodes = this.nodes;
    var rowDebug, row, y, l;
    for (var x = 0, len = nodes.length; x < len; x++) {
        rowDebug = "";
        row = nodes[x];
        for (y = 0, l = row.length; y < l; y++) {
            rowDebug += row[y].kind + " ";
        }
        result = result + rowDebug + "\n";
    }
    return result;
};
