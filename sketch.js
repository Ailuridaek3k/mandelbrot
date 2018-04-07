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

function pixelToComplex(x, y) {
  imag = (y / windowHeight) * actual_height_range + actual_height_offset;
  real = (x / windowWidth) * actual_width_range + actual_width_offset;
  return math.complex(real, imag)
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // normally draw is called continuously
  // but this sucks for this case, because (a) our draw is expensive
  // (b) it does the same thing every time
  noLoop();
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

function draw() {
  background(51);
  point(10, 10);
  for (var x = 0; x < windowWidth; x++) {
    for (var y = 0; y < windowHeight; y++) {
      //console.log([x,y])
      var pxAsComplex = pixelToComplex(x, y);
      //var inMandelbrot = pxAsComplex.abs() < 2; 
      var inMandelbrot = nonDivergentMandelbrotIteration(pxAsComplex);
      stroke(255*(inMandelbrot/max_iterations));
      point(x,y);
    }
  }
}