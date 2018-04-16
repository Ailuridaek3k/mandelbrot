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
var cntr = 0;
var p1x;
var p1y;
var p2x;
var p2y;

var mbCanvas;

function pixelToComplex(x, y) {
  imag = (y / windowHeight) * actual_height_range + actual_height_offset;
  real = (x / windowWidth) * actual_width_range + actual_width_offset;
  return math.complex(real, imag)
}

function setup() {
  pixelDensity(1);
  colorMode(HSB);
  createCanvas(windowWidth, windowHeight);
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
    colorMode(RGB);
    stroke(255, 255, 255);
    point(p1x, p1y);
    cntr++;
    
}

function mouseDragged(){
    p2x = mouseX;
    p2y = mouseY;
}

function mouseClicked(){
    
}

function drawMandelbrot(g){
    for (var x = 0; x < windowWidth; x++) {
        for (var y = 0; y < windowHeight; y++) {
            //console.log([x,y])
            var pxAsComplex = pixelToComplex(x, y);
            //var inMandelbrot = pxAsComplex.abs() < 2; 
            var inMandelbrot = nonDivergentMandelbrotIteration(pxAsComplex);
            //stroke(255*(inMandelbrot/max_iterations));
            g.colorMode(HSB);
            var color1 = color(25, 100, 50);
            var color2 = color(332, 100, 63);
            var trueColor = lerpColor(color1, color2, (inMandelbrot/max_iterations))
            g.stroke(trueColor);
            g.point(x,y);
        }
    }
}

function draw() {
    background(51);
    point(10, 10);
    image(mbCanvas, 0, 0, windowWidth, windowHeight);
    
    strokeWeight(3);
    noFill();
    colorMode(RGB);
    stroke(255, 255, 255);
    rWidth = p2x - p1x;
    rHeight = p2y - p1y;
    
    if (rHeight < rWidth){
        var cutWidth = (((windowWidth/windowHeight)*math.abs(rHeight))*(rWidth/math.abs(rWidth)));
        rect(p1x, p1y, cutWidth, rHeight);
    }
    else if(rHeight > rWidth){
        var cutHeight = (((windowWidth/windowHeight)*math.abs(rWidth))*(rHeight/math.abs(rHeight)));
        rect(p1x, p1y, rWidth, cutHeight);
    }
    else{
        rect(p1x, p1y, rWidth, rHeight);
    }
}