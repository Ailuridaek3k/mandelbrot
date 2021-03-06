//var x_offset = 300
//var y_offset = 200
var max_x = 300
var max_y = 200

var actual_height_range = 2
var actual_height_offset = -1

var actual_width_range = 3
var actual_width_offset = -2;

var divergence_threshold = 2
var max_iterations = 23;

//rectangle drawing vars
var p1x;
var p1y;
var p2x;
var p2y;

var addWidth;
var addHeight;

var mbCanvas;


var storedX;
var storedY;

var color1;
var color2;

var c1;
var c2;
var but;

function pixelToComplex(x, y) {
  imag = (y / windowHeight) * actual_height_range + actual_height_offset;
  real = (x / windowWidth) * actual_width_range + actual_width_offset;
  return math.complex(real, imag)
}

function setup() {
  pixelDensity(1);
  colorMode(HSB);
  c1 = select('#color1');
  c1.changed(selectEvent1);
  c2 = select('#color2');
  c2.changed(selectEvent2);
  selectEvent1();
  selectEvent2();
  redrawBut = select('#redraw');
  redrawBut.mouseClicked(redrawButtonEvent);
  resetBut = select('#reset');
  resetBut.changed(resetButtonEvent);    
  switchBut = select('#switch');
  switchBut.mouseClicked(switchButtonEvent);
  boxColor = color('hsb(0, 100%, 100%)');
  blendMode(REPLACE);
  createCanvas(windowWidth, windowHeight);
  stroke(255);
  // normally draw is called continuously
  // but this sucks for this case, because (a) our draw is expensive
  // (b) it does the same thing every time
  //noLoop();
  mbCanvas = createGraphics(windowWidth, windowHeight);
  drawMandelbrot(mbCanvas);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function selectEvent1(){
    color1 = color(c1.value());
}

function selectEvent2(){
    color2 = color(c2.value());
}

function redrawButtonEvent(){
    drawMandelbrot(mbCanvas);
    return false;
}

function resetButtonEvent(){
    drawMandelbrot(mbCanvas);
}

function switchButtonEvent(){    
    var swapColor = color(color1);
    color1 = color(color2);
    color2 = color(swapColor);
    drawMandelbrot(mbCanvas);
    c1.value(color1.toString('#rrggbb'));
    c2.value(color2.toString('#rrggbb'));
    return false;
}

function nonDivergentMandelbrotIteration(c) {
  // right now just returns a boolean
  // later return number of iterations until divergence
  var value = c;
  var num_iterations = 0;
  while (value.abs() <= divergence_threshold && num_iterations <= max_iterations) {
    num_iterations += 1;
    value = value.mul(value).add(c)
  }
  
  // if didn't hit max iterations, this is divergent not non-divergent
  return num_iterations;
}

function mousePressed(){
    p1x = mouseX;
    p1y = mouseY;
}

function mouseDragged(){
    p2x = mouseX;
    p2y = mouseY;
    rWidth = p2x - p1x;
    rHeight = p2y - p1y;
    boxDiag = Math.sqrt((math.pow(rHeight, 2)) + (math.pow(rWidth, 2)));
    screenDiag = Math.sqrt((math.pow(windowHeight, 2)) + (math.pow(windowWidth, 2)));
    boxRatio = boxDiag/screenDiag;
    wSign = rWidth/math.abs(rWidth);
    hSign = rHeight/math.abs(rHeight);
    //the signs are so that addW and addH keep the signs of the height and width
    addWidth =  (windowWidth * boxRatio * wSign);
    addHeight = (windowHeight * boxRatio * hSign);
    p2x = p1x + addWidth;
    p2y = p1y + addHeight;
}

function mouseClicked(){
    if(!p1x || !p2x || !p1y || !p2y){
        return;
    }
    var xCoords = [p1x, p2x];
    var yCoords = [p1y, p2y];
    xCoords.sort(math.subtract);
    yCoords.sort(math.subtract);
    var cropStart = pixelToComplex(xCoords[0], yCoords[0]);
    var cropEnd = pixelToComplex(xCoords[1], yCoords[1]);
    actual_height_offset = cropStart.im;
    actual_height_range = cropEnd.im - cropStart.im;
    console.assert(actual_height_range > 0);
    actual_width_offset = cropStart.re;
    actual_width_range = cropEnd.re - cropStart.re;
    console.assert(actual_width_range > 0);
    mbCanvas.clear();
    drawMandelbrot(mbCanvas);
    p2x = null;
    p2y = null;
    p1x = null;
    p1y = null;
    addHeight = null;
    addWidth = null;
}

function drawMandelbrot(g){
    for (var x = 0; x < windowWidth; x++) {
        for (var y = 0; y < windowHeight; y++) {
            var pxAsComplex = pixelToComplex(x, y);
            var inMandelbrot = nonDivergentMandelbrotIteration(pxAsComplex);
            var trueColor = lerpColor(color1, color2, (inMandelbrot/max_iterations));  
            g.stroke(trueColor);
            g.point(x,y);
        }
    }
}

function draw() {
    image(mbCanvas, 0, 0, windowWidth, windowHeight);
    strokeWeight(1.5);
    noFill();
    /*if(keyIsPressed === true){
        storedX = mouseX;
        storedY = mouseY;
        console.log(mbCanvas.get(mouseX, mouseY), pixelToComplex(mouseX, mouseY));
    }*/
    rect(p1x, p1y, 
         addWidth, 
         addHeight);
}

try {
  module.exports = {
    nonDivergentMandelbrotIteration,
    drawMandelbrot
  };
} catch (error){
  console.log(error)
}