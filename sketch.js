const SIZE = 256;
let inputImg, currentImg, inputCanvas, output, statusMsg, pix2pix, clearBtn, transferBtn, currentColor, currentStroke;

var shapes_coord = []
var shapes_colors = []




function setup() {
    
  // Create a canvas
  inputCanvas = createCanvas(SIZE, SIZE);
  inputCanvas.class('border-box').parent('input');

  // Display initial input image
  inputImg = loadImage('images/map.png', drawImage);
  currentImg = inputImg;

  // Selcect output div container
  output = select('#output');
  statusMsg = select('#status');

  // Get the buttons
  currentColor = color(255, 126, 0);
  currentStroke = 0;
  select('#color_brick').mousePressed(() => currentColor = color(175, 5, 5));
  select('#color_alucobond').mousePressed(() => currentColor = color(210,163,231));
  select('#color_panel').mousePressed(() => currentColor = color(216,14,87));
  select('#color_wood').mousePressed(() => currentColor = color(0,255,191));
  select('#color_windSky').mousePressed(() => currentColor = color(255,173,0));
  select('#color_windRefl').mousePressed(() => currentColor = color(120,255,0));
  select('#color_windCurt').mousePressed(() => currentColor = color(71,34,85));
  select('#color_windStru').mousePressed(() => currentColor = color(113,33,146));
  select('#color_windDeep').mousePressed(() => currentColor = color(122,146,148));
  select('#color_mullion1').mousePressed(() => currentColor = color(124,199,205));
  select('#color_mullion2').mousePressed(() => currentColor = color(0,0,0));
  select('#color_exhaust').mousePressed(() => currentColor = color(255,0,233));
  select('#color_sunshade').mousePressed(() => currentColor = color(48,79,81));
  select('#color_billboard').mousePressed(() => currentColor = color(145,163,4));
  select('#color_shadow').mousePressed(() => currentColor = color(33,154,0));
  select('#color_foliage').mousePressed(() => currentColor = color(252,241,142));
  

  // Select 'transfer' button html element
  transferBtn = select('#transferBtn');

  // Select 'clear' button html element
  clearBtn = select('#clearBtn');

  randomBtn = select('#randomBtn');
  nextBtn = select('#nextImages');
  prevBtn = select('#prevImages');

  cancelBtn = select('#cancelBtn');

  startBtn = select('#startBtn');
    
    
  


  // Attach a mousePressed event to the 'clear' button
  clearBtn.mousePressed(function() {
    clearCanvas();
  });

  cancelBtn.mousePressed(function() {
    shapes_colors.pop()
    shapes_coord.pop()
  });

  randomBtn.mousePressed(function() {
    var nb = (int)(Math.random() * Math.floor(59))
    randImg = loadImage('images/Romy_data/'+nb+'.jpg', drawImage);
    currentImg = randImg
    shapes_coord = []
    shapes_colors = []
  });
    
  var index = 0; 
    
  nextBtn.mousePressed(function(){
      index+=1;
      if(index>16 -1){
          index  = 0;
      }
    nextImg = loadImage('images/Romy_data/'+index+'.jpg', drawImage);
    currentImg = nextImg
    shapes_coord = []
    shapes_colors = [] 
  });
  prevBtn.mousePressed(function(){
      index-=1;
      if(index>16 -1){
          index  = 0;
      }
    prevImg = loadImage('images/Romy_data/'+index+'.jpg', drawImage);
    currentImg = prevImg
    shapes_coord = []
    shapes_colors = [] 
  });
    


  startBtn.mousePressed(function() {
    pix2pix = ml5.pix2pix('model/model3.pict', modelLoaded);
    $("#screen").fadeOut( "slow", function() {
      // Animation complete.
    });
    $("#status").animate({
      opacity: 1
    }, 1500, function() {
      // Animation complete.
    });
  });

}



let painting = false;
let x_a
let y_a

// Draw on the canvas when mouse is pressed
function draw(){
    
  strokeWeight(0)
  background(currentImg);

  for(i = 0; i < shapes_coord.length; i++){
    fill(shapes_colors[i])
    rect(shapes_coord[i][0],shapes_coord[i][1],shapes_coord[i][2],shapes_coord[i][3])
  }
  
  if(painting){
    strokeWeight(currentStroke)
    fill(currentColor)
    rect(x_a,y_a,mouseX-x_a,mouseY-y_a)
  }
  
  strokeWeight(0.2)
  //vertical line
  line(mouseX,0,mouseX,256)
  //horizontal line
  line(0,mouseY,256,mouseY)

}

function mousePressed(){
  painting = true;
  x_a = mouseX
  y_a = mouseY
}

function mouseReleased(){
  shapes_coord.push([x_a,y_a,mouseX-x_a,mouseY-y_a])
  shapes_colors.push(currentColor)
  painting = false;
  redraw()
}


// A function to be called when the models have loaded
function modelLoaded() {
  // Show 'Model Loaded!' message
  statusMsg.html('Model Loaded!');
  // Call transfer function after the model is loaded
  // transfer();
  // Attach a mousePressed event to the transfer button
  transferBtn.mousePressed(function() {
    transfer();
  });
}

// Draw the input image to the canvas
function drawImage() {
  image(inputImg, 0, 0,SIZE, SIZE);
}

// Clear the canvas
function clearCanvas() {
  //background(255);
  currentImg = inputImg;
  shapes_coord = []
  shapes_colors = []
}

function transfer() {
  // Update status message
  statusMsg.html('Transfering...');

  // Select canvas DOM element
  const canvasElement = select('canvas').elt;

  // Apply pix2pix transformation
  pix2pix.transfer(canvasElement, function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result && result.src) {
      statusMsg.html('Done!');
      // Create an image based result
      output.elt.src = result.src;
    }
  });
}