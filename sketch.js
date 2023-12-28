
const CANVAS_SIZE = 720;

// p5.js Functions

function setup() {
  createCanvas(CANVAS_SIZE, CANVAS_SIZE, SVG);
  strokeWeight(1)
  noLoop();
  ellipseMode(RADIUS);
}

function draw() {
  //background(51);
  //noStroke();
  // Start with a middle main node.

  const positions = { };

  fill(0);
  ellipse(CANVAS_SIZE/2, CANVAS_SIZE/2, 16, 16);

  let largeDist = CANVAS_SIZE/3;
  for (let i = 0; i < 8; i++) {
    // A random factor to mutate the angle.
    let dist = largeDist*random(0.8, 1.2);
    let r = random(-0.2, 0.2);
    let angle = PI/4 + (2*PI)*(i/8) + PI/8*r;
    let x = CANVAS_SIZE/2 + largeDist*cos(angle);
    let y = CANVAS_SIZE/2 + largeDist*sin(angle);
    fill(0);
    ellipse(x, y, 8, 8);
    line(CANVAS_SIZE/2, CANVAS_SIZE/2, x, y);
    
    for (let i = 0; i < floor(random(5, 10)); i++) {
      let smallDist = (largeDist/2)*random(0.8, 1.2);;
      let r = random(-0.2, 0.2);
      let angle = random(0, 2*PI);//PI/4 + (PI/2)*i + PI/8*r;
      let xx = x + smallDist*cos(angle);
      let yy = y + smallDist*sin(angle);

      if (xx > CANVAS_SIZE - 16 || yy > CANVAS_SIZE - 16 || xx < 16 || yy < 16) { continue; }

      fill(0);
      ellipse(xx, yy, 4, 4);
      line(x, y, xx, yy);
      noFill();
      ellipse(xx, yy, 4, 4);
      fill(0);
      positions[`${floor(xx)} ${floor(yy)}`] = 1;
    }

  }

  Object.keys(positions).forEach(position => {
    let pos = position.split(' ').map(v => parseInt(v));
    let posX = pos[0];
    let posY = pos[1];
    let nearest = Object.keys(positions).reduce((total, cur) => {
      console.log(cur);
      var [ x, y ] = cur.split(' ').map(v => parseInt(v));
      var dist = sqrt((x - posX)**2 + (y - posY)**2);

      if (x === posX && y === posY) { return total; }

      if (dist < total.dist) {
        return { x, y, dist };
      }
      return total; 
    }, { x: -1, y: -1, dist: CANVAS_SIZE*2 });
    console.log(nearest)

    line(posX, posY, nearest.x, nearest.y);

  });

  console.log(positions);
}

function mousePressed() {
  if (mouseButton === LEFT) {
    redraw();
  } else if (mouseButton === RIGHT) {
    //saveCanvas('osaka');
    save('network.svg');
  }
}






// Helper functions

