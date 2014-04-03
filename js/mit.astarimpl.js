goog.provide('mit.AstarImpl');

goog.require('mit.BinaryHeap');


mit.AstarImpl=function(){
}

mit.AstarImpl.prototype.init = function(grid) {
    for(var x = 0, xl = grid.length; x < xl; x++) {
        for(var y = 0, yl = grid[x].length; y < yl; y++) {
            var node = grid[x][y];
            node.f = 0;
            node.g = 0;
            node.h = 0;
            node.visited = false;
            node.closed = false;
            node.parent = null;
        }
    }
};

mit.AstarImpl.prototype.heap = function() {
    return new mit.BinaryHeap(function(node) {
        return node.f;
    });
};


mit.AstarImpl.prototype.search = function(grid, start, end, heuristic) {
    this.init(grid);
    heuristic = heuristic || this.manhattan;

    var openHeap = this.heap();

    openHeap.push(start);
    console.group("Starting search");
    while(openHeap.size() > 0) {

    	 this.logGrid(grid);

        // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
        var currentNode = openHeap.pop();

        // End case -- result has been found, return the traced path.
        if(currentNode === end) {
            var curr = currentNode;
            var ret = [];
            while(curr.parent) {
                ret.push(curr);
                curr = curr.parent;
            }
            console.groupEnd();
            return ret.reverse();
        }

        // Normal case -- move currentNode from open to closed, process each of its neighbors.
        currentNode.closed = true;

        var neighbors = this.neighbors(grid, currentNode);
        for(var i=0, il = neighbors.length; i < il; i++) {
            var neighbor = neighbors[i];

            if(neighbor.closed || neighbor.isLocked()) {
                // Not a valid node to process, skip to next neighbor.
                continue;
            }

            // The g score is the shortest distance from start to current node.
            // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
            // 1 is the distance from a node to it's neighbor - this could be variable for weighted paths.
            var gScore = currentNode.g + 1;
            var beenVisited = neighbor.visited;

            if(!beenVisited || gScore < neighbor.g) {

                // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                neighbor.visited = true;
                neighbor.parent = currentNode;
                neighbor.h = neighbor.h || heuristic(neighbor.point, end.point);
                neighbor.g = gScore;
                neighbor.f = neighbor.g + neighbor.h;

                if (!beenVisited) {
                    // Pushing to heap will put it in proper place based on the 'f' value.
                    openHeap.push(neighbor);
                }
                else {
                    // Already seen the node, but since it has been rescored we need to reorder it in the heap
                    openHeap.rescoreElement(neighbor);
                }
            }
        }
    }

    // No result was found - empty array signifies failure to find path.
    console.groupEnd();
    return [];
};

mit.AstarImpl.prototype.manhattan = function(pos0, pos1) {
    // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html

    var d1 = Math.abs (pos1.x - pos0.x);
    var d2 = Math.abs (pos1.y - pos0.y);
    return d1 + d2;
};


mit.AstarImpl.prototype.logGrid = function(grid){
  var result=[];
  for (var i=0; i<grid.length;i++){
    var row=[];
    for (j=0;j<grid[i].length;j++){
      var node=grid[i][j];
      if(node.closed) {
        row.push("---");
      } else {
        row.push("f:"+node.f+"|g:"+node.g+"|h:"+node.h);
      }
    }
    result.push(row);
  }
  console.table(result);
}

mit.AstarImpl.prototype.neighbors = function(grid, node) {
    var ret = [];
    var x = node.x;
    var y = node.y;

    if(grid[x-1] && grid[x-1][y]) {
        ret.push(grid[x-1][y]);
    }
    if(grid[x+1] && grid[x+1][y]) {
        ret.push(grid[x+1][y]);
    }
    if(grid[x] && grid[x][y-1]) {
        ret.push(grid[x][y-1]);
    }
    if(grid[x] && grid[x][y+1]) {
        ret.push(grid[x][y+1]);
    }
    return ret;
}



