
const CANVAS_SIZE = 720;
const circles = [ ];
const lines = [ ];

// p5.js Functions
function setup() {
  createCanvas(CANVAS_SIZE, CANVAS_SIZE, SVG);
  strokeWeight(1)
  noLoop();
  ellipseMode(RADIUS);
}



function draw() {
  // Start with a middle main node
  addCircle(CANVAS_SIZE/2, CANVAS_SIZE/2, 16);

  let largeDist = CANVAS_SIZE/3;
  for (let i = 0; i < 8; i++) {
    let r = random(-0.2, 0.2);
    let angle = PI/4 + (2*PI)*(i/8) + PI/8*r;
    let x = CANVAS_SIZE/2 + largeDist*cos(angle);
    let y = CANVAS_SIZE/2 + largeDist*sin(angle);

    addCircle(x, y, 8);
    addLine(CANVAS_SIZE/2, CANVAS_SIZE/2, x, y, 16, 8);
    
    for (let i = 0; i < floor(random(5, 10)); i++) {
      let smallDist = (largeDist/2)*random(0.5, 1.5);
      let r = random(-0.2, 0.2);
      let angle = random(0, 2*PI);
      let xx = x + smallDist*cos(angle);
      let yy = y + smallDist*sin(angle);

      if (xx > CANVAS_SIZE - 16 || yy > CANVAS_SIZE - 16 || xx < 16 || yy < 16) { continue; }

      addCircle(xx, yy, 4);
      addLine(x, y, xx, yy, 8, 4);
    }

  }
  

  circles.filter(c => c.r === 4).forEach(circle => {
    let nearest = findNearestSmallCircle(circle);

    // Don't add an existing line
    if (lineExists(circle.x, circle.y, nearest.x, nearest.y)) { return; }

    addLine(circle.x, circle.y, nearest.x, nearest.y, 4, 4);
  });

  // Finally, draw the circles and lines
  lines.forEach(line => drawLine(line));
  circles.forEach(circle => drawCircle(circle))
}



function mousePressed() {
  if (mouseButton === LEFT) {
    remove();
    redraw();
  } else if (mouseButton === RIGHT) {
    save('network.svg');
  }
}



// Helper functions
function addLine(x1, y1, x2, y2, r1, r2) {
  lines.push({
    x1: floor(x1),
    y1: floor(y1),
    x2: floor(x2),
    y2: floor(y2),
    r1: floor(r1),
    r2: floor(r2)
  });
}

function lineExists(x1, y1, x2, y2, r1, r2) {
  return lines.find(line => {
    return (line.x1 === x1 && line.y1 === y1 && line.x2 === x2 && line.y2 === y2 && line.r1 === r1 && line.r2 === r2) ||
      (line.x1 === x2 && line.y1 === y2 && line.x2 === x1 && line.y2 === y1 && line.r1 === r2 && line.r2 === r1);
  });
}

function addCircle(x, y, r) {
  circles.push({
    x: floor(x),
    y: floor(y),
    r: floor(r)
  });
}

function drawCircle(circle) {
  let { x, y, r } = circle;
  push()
  strokeWeight(1);
  fill(0)
  ellipse(x, y, r, r);
  pop()
}

function drawLine(lineObj) {
  let { x1, y1, x2, y2, r1, r2 } = lineObj;
  let angle = atan2(y2 - y1, x2 - x1);
  x1 += r1*cos(angle);
  y1 += r1*sin(angle);
  x2 -= r2*cos(angle);
  y2 -= r2*sin(angle);
  push();
  stroke(0);
  line(x1, y1, x2, y2);
  pop();
}

function findNearestSmallCircle(circle) {
  return circles.reduce((total, cur) => {
    let dist = sqrt((cur.x - circle.x)**2 + (cur.y - circle.y)**2);

    // Don't include self
    if (cur.x === circle.x && cur.y === circle.y) { return total; }

    // If this circle is closer, use it as the new closest
    if (dist < total.dist) { return { x: cur.x, y: cur.y, dist }; }

    return total;
  }, { x: -1, y: -1, dist: CANVAS_SIZE*2 });
}
