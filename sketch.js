const H = 800
const W = 900

const OFFSET = 100

const N = 30

const vecScale = (W-OFFSET*2)/N

let points = []
let vectors = []

let x1
let x2

let isBasisMoving = false
let movingBasisVec
let secondBasisVec

let toNormalize

function setup() {
  let c = createCanvas(W, H);
  c.parent("canvas")
  
  for(let i = 0; i< N; i++){
    for(let j = 0; j < N; j++){
      let x = (j -N/2)* vecScale
      let y = (i -N/2)* vecScale
      points.push(createVector(x,y))
    }
  }
  
  for(let i=0; i< points.length; i++){
    vectors[i] = points[i].copy()
  }
  
  // x1 = createVector(1,0)
  // x2 = createVector(0,1)
  x1 = createVector(0, 0.25)
  x2 = createVector(0.1, 0)
  
  let checkbox = document.getElementById("normalize")
  checkbox.onchange = () => {
    toNormalize = checkbox.checked
  }
}

function A(vec){
  return createVector(x1.x*vec.x+x2.x*vec.y, x1.y*vec.x+x2.y*vec.y)
}

function draw() {
  background(0);
  strokeWeight(1)
  
  let origin = toScreen(createVector(0,0))
  
  if(isBasisMoving){
    mouse_w = toWorld(createVector(mouseX, mouseY)).div(vecScale)
    let angle = movingBasisVec.angleBetween(mouse_w)
    movingBasisVec.rotate(angle)
    movingBasisVec.setMag(mouse_w.mag())
    // secondBasisVec.rotate(angle)
  }
  
  for (let i = 0; i< vectors.length;i++){
    vectors[i] = A(points[i])
  }
  
  for (let i = 0; i< points.length;i++){
    let v = toScreen(points[i])
    stroke('blue')
    line(origin.x, origin.y, v.x, v.y)
  }
  
  for (let i = 0; i< vectors.length;i++){
    let v = toScreen(vectors[i])
    stroke('purple')
    line(origin.x, origin.y, v.x, v.y)
  }
  
  for (let i = 0; i< vectors.length;i++){
    let p = toScreen(points[i])
    let v = vectors[i]
    if(toNormalize){
      v = norm(v).mult(vecScale*2/3)
    }
    fill('white')
    stroke('white')
    drawArrow(p, v)
  }
  
  basis1  = p5.Vector.mult(x1, vecScale)
  basis2  = p5.Vector.mult(x2, vecScale)
  
  let col = 'red'
  strokeWeight(2)
  stroke(col)
  fill(col)
  drawArrow(origin, basis1)
  
  col = 'rgb(0,246,0)'
  stroke(col)
  fill(col)
  drawArrow(origin, basis2)
}

function mousePressed(){
  let mouse = createVector(mouseX, mouseY)
  let x1_s = toScreen(p5.Vector.mult(x1, vecScale))
  let x2_s = toScreen(p5.Vector.mult(x2, vecScale))
  
  let maxDist = 10
  
  if(mouse.dist(x1_s)<maxDist){
    isBasisMoving = true
    movingBasisVec = x1
    secondBasisVec = x2
    
  }else if(mouse.dist(x2_s)<maxDist){
    isBasisMoving = true
    movingBasisVec = x2
    secondBasisVec = x1
  }
}

function mouseReleased(){
  isBasisMoving = false  
}

function toScreen(vec){
  return createVector(W/2+vec.x, H/2+vec.y)  
}

function toWorld(vec){
  return createVector(vec.x-W/2,vec.y-H/2)  
}

let addv = p5.Vector.add
let norm = p5.Vector.normalize

function drawArrow(base, vec) {
  push();
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  translate(vec.x, vec.y);
  rotate(vec.heading());
  triangle(0, 4, 0, -4, 4, 0);
  pop();
}
