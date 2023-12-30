
const CANVAS_SIZE = 720;
const positions = { };
const lines = { };

// p5.js Functions
function setup() {
  createCanvas(CANVAS_SIZE, CANVAS_SIZE, SVG);
  strokeWeight(1)
  noLoop();
  ellipseMode(RADIUS);
}



function draw() {
  // Start with a middle main node.
  drawCircle(CANVAS_SIZE/2, CANVAS_SIZE/2, 16);

  let largeDist = CANVAS_SIZE/3;
  for (let i = 0; i < 8; i++) {
    // A random factor to mutate the angle.
    //let dist = largeDist*random(0.5, 1.5);
    let r = random(-0.2, 0.2);
    let angle = PI/4 + (2*PI)*(i/8) + PI/8*r;
    let x = CANVAS_SIZE/2 + largeDist*cos(angle);
    let y = CANVAS_SIZE/2 + largeDist*sin(angle);

    drawCircle(x, y, 8);
    drawLine({ x: CANVAS_SIZE/2, y: CANVAS_SIZE/2, r: 16 }, { x, y, angle: angle, r: 8 })
    lines[`${floor(CANVAS_SIZE/2)} ${floor(CANVAS_SIZE/2)} ${floor(x)} ${floor(y)}`] = true;
    
    for (let i = 0; i < floor(random(5, 10)); i++) {
      let smallDist = (largeDist/2)*random(0.5, 1.5);
      let r = random(-0.2, 0.2);
      let angle = random(0, 2*PI);//PI/4 + (PI/2)*i + PI/8*r;
      let xx = x + smallDist*cos(angle);
      let yy = y + smallDist*sin(angle);

      if (xx > CANVAS_SIZE - 16 || yy > CANVAS_SIZE - 16 || xx < 16 || yy < 16) { continue; }

      drawCircle(xx, yy, 4);
      drawLine({ x, y, r: 8 }, { x: xx, y: yy, r: 4 });
      lines[`${floor(x)} ${floor(y)} ${floor(xx)} ${floor(yy)}`] = true;
      positions[`${floor(xx)} ${floor(yy)}`] = 1;
    }

  }

  console.log(lines);
  
  Object.keys(positions).forEach(position => {
    let pos = position.split(' ').map(v => parseInt(v));
    let posX = pos[0];
    let posY = pos[1];
    let nearest = Object.keys(positions).reduce((total, cur) => {
      var [ x, y ] = cur.split(' ').map(v => parseInt(v));
      var dist = sqrt((x - posX)**2 + (y - posY)**2);

      if (x === posX && y === posY) { return total; }

      if (dist < total.dist) {
        return { x, y, dist };
      }
      return total; 
    }, { x: -1, y: -1, dist: CANVAS_SIZE*2 });

    // Don't draw lines we have already drawn.
    if (lines[`${floor(posX)} ${floor(posY)} ${floor(nearest.x)} ${floor(nearest.y)}`]) {
      return;
    }

    drawLine({ x: posX, y: posY, r: 4 }, { x: nearest.x, y: nearest.y, r: 4 });
    lines[`${floor(posX)} ${floor(posY)} ${floor(nearest.x)} ${floor(nearest.y)}`] = true;
  });
}



function mousePressed() {
  if (mouseButton === LEFT) {
    redraw();
  } else if (mouseButton === RIGHT) {
    save('network.svg');
  }
}



// Helper functions
function drawCircle(x, y, r) {
  push()
  strokeWeight(1);
  fill(0)
  ellipse(x, y, r, r);
  pop()
}

function drawLine(from, to) {
  let angle = atan2(to.y - from.y, to.x - from.x);
  let x1, y1, x2, y2;
  x1 = from.x + from.r*cos(angle);
  y1 = from.y + from.r*sin(angle);
  x2 = to.x - to.r*cos(angle);
  y2 = to.y - to.r*sin(angle);

  push();
  stroke(0);
  line(x1, y1, x2, y2);
  pop();
}


