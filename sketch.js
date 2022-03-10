let pocketSize = 20;
let pockets = [];

let startX = 0;
let startY = 0;

function setup() {
  createCanvas(windowWidth*0.9, windowWidth*0.9 / 2).parent("container").id("canvas");
  stopTouchScrolling(document.getElementById("canvas"))

  pockets.push(new Pocket(0, 0, pocketSize))
  pockets.push(new Pocket(width / 2, 0, pocketSize))
  pockets.push(new Pocket(width, 0, pocketSize))

  pockets.push(new Pocket(0, height, pocketSize))
  pockets.push(new Pocket(width / 2, height, pocketSize))
  pockets.push(new Pocket(width, height, pocketSize))

  startX = width / 2;
  startY = height / 2;
}

function draw() {
  clear()
  background(7, 140, 80);
  stroke(0, 0, 0, 255)

  for (let pocket of pockets) {
    pocket.color = 0;
  }

  let angle = Math.atan2(mouseY - startY, mouseX - startX)
  
  push()
  noStroke()
  fill(255, 0, 0)
  circle(startX, startY, 20)
  pop()
  
  let currX = startX;
  let currY = startY;
  let count = 0;
  
  push()
  strokeWeight(2)
  while (count < 80) {
    let l = new AngledLine(currX, currY, angle)
    stroke(0, 0, 0, 255 / count)
    line(l.startX, l.startY, l.endX, l.endY)
    
    if (l.potted) {
      break;
    }

    currX = l.endX
    currY = l.endY
    
    if (l.endY < 0 || l.endY > height) {
      angle = -angle
    } else {
      angle = -PI - angle
    }
    
    count += 1
  }
  pop()
  
  noStroke()
  strokeWeight(0)
  text(count, 20, 20)
  // alert(count)
  if (count != 500) {
    for (let pocket of pockets) {
      pocket.draw()
    }
  } else {
    for (let pocket of pockets) {
      pocket.color = 0
      pocket.draw()
    }

  }

}

function doubleClicked() {
  startX = mouseX
  startY = mouseY
}


class AngledLine {
  constructor(startX, startY, angle) {
    this.startX = startX;
    this.startY = startY;
    this.angle = angle

    let mag = 1;
    let collisionX = -1;
    let collisionY = -1;
    let epsilon = 1;

    while (true) {
      let vec = p5.Vector.fromAngle(angle, mag)
      let [x, y] = [startX + vec.x, startY + vec.y]

      for (let pocket of pockets) {
        if (pocket.inside(x, y)) {
          this.potted = true;
          pocket.color = 255;
          this.endX = x;
          this.endY = y;
          break;
        }
      }

      if (this.potted) {
        break;
      }

      if (x < 0 || x > width || y < 0 || y > height) {
        this.endX = x;
        this.endY = y;

        break;
      }

      mag += epsilon
    }

  }
}

class Pocket {
  constructor(x, y, d) {
    this.x = x
    this.y = y
    this.d = d
    this.color = 0
  }

  // inside returns true if the given point is inside the circle.
  inside(posX, posY) {
    return (posX - this.x) ** 2 + (posY - this.y) ** 2 <= this.d
  }

  draw() {
    push()
    noStroke()
    fill(this.color)
    circle(this.x, this.y, this.d)
    pop()
  }
}

// Courtesy of https://stackoverflow.com/questions/49854201/html5-issue-canvas-scrolling-when-interacting-dragging-on-ios-11-3/51652248#51652248.
function stopTouchScrolling(canvas) {
  // Prevent scrolling when touching the canvas
  document.body.addEventListener("touchstart", function (e) {
    if (e.target == canvas) {
      e.preventDefault();
    }
  }, { passive: false });
  document.body.addEventListener("touchend", function (e) {
    if (e.target == canvas) {
      e.preventDefault();
    }
  }, { passive: false });
  document.body.addEventListener("touchmove", function (e) {
    if (e.target == canvas) {
      e.preventDefault();
    }
  }, { passive: false });

}