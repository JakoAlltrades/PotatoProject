var cxt = document.getElementById("canvasId").getContext("2d");
                        
var graph = new BarGraph(ctx);
graph.margin = 2;
graph.width = 450;
graph.height = 150;
graph.xAxisLabelArr = ["Mashed", "Fried", "Baked", "Au Gratin"];
graph.update([3, 5, 3, 6]);


function BarGraph(ctx) {
  var that = this;
  var startArr;
  var endArr;
  var looping = false;
		
  // Loop method adjusts the height of bar and redraws if neccessary
  var loop = function () {
    ...
  };
		
  // Draw method updates the canvas with the current display
  var draw = function (arr) { 
     ...
  };