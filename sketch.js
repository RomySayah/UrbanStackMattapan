const SIZE = 256;
let inputImg, currentImg, inputCanvas, output, statusMsg, pix2pix, clearBtn, transferBtn, currentColor, currentStroke;

var shapes_coord = []
var shapes_colors = []

var _container = document.getElementById('sdv-container');

var _viewerSettings = {
    
    container: _container,
    api: {version: 2},
    loggingLevel: SDVApp.constants.loggingLevels.NONE,
    showSceneMode: SDVApp.constants.showSceneModes.INSTANT,
    ticket: 'c898039b3c677c6248f187ad97c74b5c021e996f56363ae9f8bcbb754dbba90def43b40c1e615cd02785be213921dd5d790b235c7138b3624c9f9c640adf0000516c5047227c2c849c5228edd05a9b87030ccba01b51de4ea728b2fb44dccfdfd7f16f345d42d5b88effa9794b9aef0618794fdfa08a-bda8946d7d725825eb71fcddf9738dd7'
};
var api= new SDVApp.ParametricViewer(_viewerSettings);


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
  select('#color_facade').mousePressed(() => currentColor = color(255, 126, 0));
  select('#color_window').mousePressed(() => currentColor = color(185,255,0));
  select('#color_balcony').mousePressed(() => currentColor = color(169,71,130));
  select('#color_roof').mousePressed(() => currentColor = color(1,66,255));
  select('#color_columns').mousePressed(() => currentColor = color(153,179,254));

  // Select 'transfer' button html element
  transferBtn = select('#transferBtn');

  // Select 'clear' button html element
  clearBtn = select('#clearBtn');

  randomBtn = select('#randomBtn');

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
    var nb = Math.floor(Math.random() * 4) + 1  
    randImg = loadImage('images/random/'+nb+'-inputs'+'.png', drawImage);
    currentImg = randImg
    shapes_coord = []
    shapes_colors = []
  });

  startBtn.mousePressed(function() {
    pix2pix = ml5.pix2pix('model/model.pict', modelLoaded);
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