//set main namespace
goog.provide('pathdemo');


//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');
goog.require('lime.RoundedRect');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveTo');

goog.require('slavko.Pane');
goog.require('game.Board');
goog.require('mit.AstarImpl');

// entrypoint

pathdemo.testfield = function(rows, cols, density){
        var nodes = [];

        for (var x=0; x < rows; x++) {
            var nodeRow = [];
            var gridRow = [];

            for(var y=0; y < cols; y++) {

                var isLocked = Math.floor(Math.random()*(1/density));
                if(isLocked == 0) {
                    nodeRow.push(1);
                }
                else  {
                    nodeRow.push(0);
                }
            }
            nodes.push(nodeRow);
        }


        return new slavko.Pane(nodes);
    };


pathdemo.start = function(){

    var DemoGrid = this.testfield(10,10,.3);
    var graph = new slavko.Pane([
        [0,0,0,0],
        [1,0,0,1],
        [1,1,0,0]
    ]);
    var start = graph.nodes[0][0];
    var end = graph.nodes[1][2];
    var AstarHelper = new mit.AstarImpl();
    console.time("Search started");
    var result = AstarHelper.search(graph.nodes, start, end);
    console.info(result);
    console.timeEnd("Search started");
//    alert(result);


    var director = new lime.Director(document.body,1024,768),
        scene = new lime.Scene(),

        target = new lime.Layer().setPosition(512,384);



    //add target and title to the scene
    scene.appendChild(target);


    director.makeMobileWebAppCapable();

    //add some interaction
    goog.events.listen(target,['mousedown','touchstart'],function(e){

        //animate
        target.runAction(new lime.animation.Spawn(
            new lime.animation.FadeTo(.5).setDuration(.2),
            new lime.animation.ScaleTo(1.5).setDuration(.8)
        ));

        //let target follow the mouse/finger
        e.startDrag();

        //listen for end event
        e.swallow(['mouseup','touchend'],function(){
            target.runAction(new lime.animation.Spawn(
                new lime.animation.FadeTo(1),
                new lime.animation.ScaleTo(1),
                new lime.animation.MoveTo(512,384)
            ));
        });


    });


    //empty layer for contents
    var layer = new lime.Layer();
    scene.appendChild(layer);

    //make board
    var board = new game.Board(DemoGrid, this).setPosition(0, 0);
    board.buildGrid();
    board.buildTerrain();

    layer.appendChild(board);
    // set current scene active
    director.replaceScene(scene);


}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('pathdemo.start', pathdemo.start);
