var cols = 50;
var rows = 50;

var isSol = false;
var grid = new Array(cols);
var openSet = [];
var closedSet = [];
var start ;
var end;
var w,h;
var path = [];
function heuristic(a,b){
  return abs(a.i-b.i)+abs(a.j-b.j);
}

function spot(i,j){
  this.i=i;
  this.j=j;
  this.f=0;
  this.g=0;
  this.h=0;
  this.wall = false;
  this.neighbors = [];
  this.previous =undefined;

  if(Math.random() < .4){

    this.wall = true;
  }

  this.show = function (col) {
    fill(col);
    if(this.wall){
      fill(0);
    }
    noStroke(0);
    rect(this.i * w, this.j * h, w-1, h-1);
  }

  this.addNeighbors = function(grid) {
    var i = this.i;
    var j = this.j;
    if(i < cols-1){
      this.neighbors.push(grid[i+1][j]);
    }
    if(i > 0){
      this.neighbors.push(grid[i-1][j]);
    }
    if( j < rows - 1){
      this.neighbors.push(grid[i][j+1]);
    }
    if( j > 0){
      this.neighbors.push(grid[i][j-1]);
    }
    if(i < cols - 1 && j < rows - 1){
      this.neighbors.push(grid[i+1][j+1]);
    }
    if(i < cols - 1 && j > 0){
      this.neighbors.push(grid[i+1][j-1]);
    }
    if(i > 0 && j < rows - 1){
      this.neighbors.push(grid[i-1][j+1]);
    }
    if(i > 0 && j > 0){
      this.neighbors.push(grid[i-1][j-1]);
    }
  }

}

function setup() {
  // put setup code here
  // createCanvas(1000, 1000);
  createCanvas(400, 400 );

  w = width/cols;
  h = height/rows;

  for(var i = 0 ; i < cols ; i++ ){
    grid[i] = new Array(rows);
  }

  //Now every city in grid is having some features we are going to assign these
  for(var i = 0 ; i < cols ; i++){
    for(var j = 0;j < rows ; j++){
      grid[i][j] = new spot(i,j);
      // grid[i][j].addNeighbors(grid);
    }
  }

// doing this because first we need to make spot
  for(var i = 0 ; i < cols ; i++){
    for(var j = 0;j < rows ; j++){
      grid[i][j].addNeighbors(grid);
    }
  }


  start = grid[0][0];
  end = grid[cols-1][rows - 1];
  start.wall = false;
  end.wall = false;
  openSet.push(start);
}


function draw() {
  // put drawing code here

  if(openSet.length>0)
  {
    var winner = 0;
    for(var i = 0; i < openSet.length; i++){
      if(openSet[i].f < openSet[winner].f){
        winner = i;
      }
    }

    var current = openSet[winner];

    if(current == end) {
      noLoop();
      console.log("DONE !");
    }


    const index = openSet.indexOf(current);
    if (index > -1) {
      openSet.splice(index, 1);
    }
    closedSet.push(current);

    var neighbors = current.neighbors;
    for(var i = 0; i < neighbors.length; i++)
    {
      var neighbor = neighbors[i];

      if(!closedSet.includes(neighbor) && !neighbor.wall)
      {
        var tempG = current.g + 1;

        if(openSet.includes(neighbor)){
          if(tempG < neighbor.g)
          {
            neighbor.g = tempG;
            neighbor.h = heuristic(neighbor,end);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.previous = current;
          }
        }else{
          neighbor.g = tempG;
          neighbor.h = heuristic(neighbor,end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
          openSet.push(neighbor);
        }


      }
    }

  }else{
    noLoop();
    console.log("NO SOLUTION");
    isSol=true;


  }
   background(0);

  for(var i=0 ; i < cols; i++){
    for(var j=0; j < rows; j++){
      grid[i][j].show(color(255));
    }
  }


  for(var i = 0; i < closedSet.length; i++){
    closedSet[i].show(color(255,0,0));
  }

  for(var i = 0; i < openSet.length; i++){
    openSet[i].show(color(0,255,0));
  }

  if(!isSol){
    path = [];
    var temp = current;
    path.push(temp);
    while(temp.previous){
      path.push(temp.previous);
      temp=temp.previous;
    }
  }



  for(var i = 0; i < path.length; i++){
    path[i].show(color(0,0,255));
  }

  // for(var i = 0; i < closedSet.length; i++){
  //   console.log(closedSet[i]);
  //   // closedSet[i].show(color(255,0,0));
  // }
  //
  // for(var i = 0; i < openSet.length; i++){
  //   console.log(openSet[i]);
  //   // closedSet[i].show(color(255,0,0));
  // }







  // if (mouseIsPressed) {
  //   fill(0);
  // } else {
  //   fill(255);
  // }
  // ellipse(mouseX, mouseY, 80, 80);
}
