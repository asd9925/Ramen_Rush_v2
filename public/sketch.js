let x;
let y;
let topBurner;
let bottomBurner;
let cuttingBoard;
let pan;
let panImg;
let burnerOn = false;
let panSize;
let cuttingBoardImg;
let cuttingBoardX, cuttingBoardY, cuttingBoardW, cuttingBoardH;
let background2;
let tray;
let topBurnerOn = false;
let bottomBurnerOn = false;
let potImg;
let pot;
let tofu;
let tofuImg;
let cutTofu = false;
let cutTofuImg;
let cookedTofu = false;
let cookedTofuImg;
let addWaterPot;
let addWaterPan;
let knife;
let knifeImg;
let egg;
let eggImg;
let cookedEgg;
let cookedEggImg;
let ramen;
let ramenImg;
let cookedRamen;
let cookedRamenImg;
let scallions;
let scallionsImg;
let cutScallions;
let cutScallionsImg;
let bowl;

//timers
let timeFont;
let tofuTime = 0;
let tofuTimeStarted = false;
let eggTime = 0;
let eggTimeStarted = false;
let ramenTime = 0;
let ramenTimeStarted = false;
let mainTimer = 0;
let mainTimeStarted = true;

//putting food in bowl
let ramenInBowl = false;
let scallionsInBowl = false;
let tofuInBowl = false;
let eggInBowl = false;

//recipe steps
let step1;
let step2;
let step3;
let step4;
let step5;
let recipeSteps = [];
let currentStep = 0;

let woodTexture;
let woodTexture2;

//picking up and dragging
let holdingObject = null;

let potClicks = 0;
let panClicks = 0;

//welcome screen
let screen = 1;

//sound
let music;
let music_sound = 1;

//socket.io
let socket;
//winning/losing
gameWon = false;
gameLost = false;

function preload() {
  panImg = loadImage("pan.png");
  music = loadSound("background.mp3");
  cuttingBoardImg = loadImage("cuttingBoard.png");
  //background2 = loadImage("background2.png");
  tray = loadImage("tray.png");
  potImg = loadImage("pot2.png");
  knifeImg = loadImage("knife.webp");
  tofuImg = loadImage("tofu.png");
  cutTofuImg = loadImage("cuttofu.png");
  cookedTofuImg = loadImage("cookedtofu.png");
  eggImg = loadImage("egg.png");
  cookedEggImg = loadImage("completeegg.png");
  ramenImg = loadImage("ramen.png");
  cookedRamenImg = loadImage("cookedRamen.png");
  scallionsImg = loadImage("scallions.png");
  cutScallionsImg = loadImage("cutscallions.png");
  bowlImg = loadImage("bowl.png");
  woodTexture = loadImage("woodtexture.png");
  woodTexture2 = loadImage("woodtexture2.png");
  step1 = loadImage("step1.png");
  step2 = loadImage("step2final.png");
  step3 = loadImage('step3.png');
  step4 = loadImage('step4final.png');
  step5 = loadImage('step5.png');
  recipeSteps = [step1,step2,step3,step4,step5];
  timeFont = loadFont("Technology-Bold.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  x = width / 2;
  y = height / 2;

  music.loop();
  music.setVolume(music_sound);

  //socket client connection
  socket = io('http://localhost:5050', {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  timeout: 20000
});

  //check you're connected to server
  socket.on('connect', () => {
    console.log("Connected to server:", socket.id);
  });

  //Pot sprite
  pot = new Sprite(0, 0);
  pot.draw = function () {};

  //Pan sprite
  pan = new Sprite(0, 0);
  pan.draw = function () {};
  //egg sprite
  egg = new Sprite(0, 0, 20, 30);
  egg.color = color(0, 0, 0, 0);
  egg.stroke = color(0, 0, 0, 0);
  egg.collider = "kinematic";

  //knife sprite
  knife = new Sprite(0, 0);
  knife.draw = function () {};

  //tofu sprite
  tofu = new Sprite(0, 0);
  tofu.color = color(0, 0, 0, 0);
  tofu.stroke = color(0, 0, 0, 0);
  tofu.collider = "kinematic";

  //ramen sprite
  ramen = new Sprite(0, 0);
  ramen.color = color(0, 0, 0, 0);
  ramen.stroke = color(0, 0, 0, 0);
  ramen.collider = "kinematic";

  //scallions sprite
  scallions = new Sprite(0, 0);
  scallions.color = color(0, 0, 0, 0);
  scallions.stroke = color(0, 0, 0, 0);
  scallions.collider = "kinematic";
  
  // let bowlWidth = width * 0.1;
  // let bowlHeight = height* 0.14;
  
  //bowl sprite
  bowl = new Sprite(0,0);
  bowl.color = color(0,0,0,0);
  bowl.stroke = color(0,0,0,0);
  bowl.collider = 'static';
  
  //Set sprite positions
  kitchenSprites();

  //on messages for winning and losing
  socket.on('youWin', () => {
    console.log("You won!");
    gameWon = true;
  });

  socket.on('youLose', () => {
    console.log("You lost!");
    gameLost = true;
  });
}

function kitchenSprites() {
  let counterWidth = width / 6;
  let counterHeight = height / 7;

  //Make stove size based on counter width
  let burnerSize = counterWidth * 0.35;
  let stoveHeight = height * 0.28;
  //Space burners based on stove size
  let burnerSpacing = stoveHeight / 2;

  //pan on top burner

  let potSize = burnerSize * 1.3;
  pot.x = counterWidth / 2;
  pot.y = height / 2 - burnerSpacing / 2 + 15;
  pot.size = burnerSize * 1.8;

  pot.w = potSize;
  pot.h = potSize;
  pot.collider = "static";

  //pot on bottom burner
  let panSize = burnerSize * 1.8;
  pan.x = counterWidth / 2;
  pan.y = height / 2 + burnerSpacing / 2 + 42;
  pan.size = burnerSize * 1.8;

  pan.w = panSize;
  pan.h = panSize;
  pan.collider = "static";

  //cutting board SET MAXIMUM VALUE
  let boardWidth = width * 0.1;
  let boardHeight = height * 0.15;

  //cutting board image
  cuttingBoardW = width * 0.1;
  cuttingBoardH = height * 0.17;

  cuttingBoardX = counterWidth / 2;
  cuttingBoardY = counterHeight + cuttingBoardH / 2 + 20;

  tofu.x = width * 0.33;
  tofu.y = height - height * 0.1;
  tofu.w = width * 0.045;
  tofu.h = height * 0.06;
  tofu.collider = "kinematic";
  tofu.color = color(0, 0, 0, 0);

  //knife
  knife.x = width * 0.05;
  knife.y = counterHeight + cuttingBoardH;
  knife.w = width * 0.05;
  knife.h = height * 0.1;
  knife.collider = "kinematic";

  egg.x = width * 0.38;
  egg.y = height - height * 0.09;
  egg.w = width * 0.019;
  egg.h = height * 0.04;
  egg.collider = "kinematic";
  egg.color = color(0, 0, 0, 0);

  ramen.x = width * 0.33;
  ramen.y = height - height * 0.05;
  ramen.w = width * 0.04;
  ramen.h = height * 0.05;
  ramen.collider = "kinematic";
  ramen.color = color(0, 0, 0, 0);

  scallions.x = width * 0.41;
  scallions.y = height - height * 0.05;
  scallions.w = width * 0.026;
  scallions.h = height * 0.059;
  scallions.collider = "kinematic";
  scallions.color = color(0, 0, 0, 0);
  
let bowlWidth = width * 0.1;
let bowlHeight = height * 0.14;
bowl.x = counterWidth/2 - width * 0.01;
bowl.y = height - height * 0.18;
bowl.w = bowlWidth;
bowl.h = bowlHeight;
}

function draw() {
  // let screen1 = true;
  if (screen === 1) {
    //  cuttingBoard.visible = false;
    cuttingBoardImg.visible = false;
    tofu.visible = false;
    egg.visible = false;

    screen1();
  } else if (screen === 2) {
    // cuttingBoard.visible = true;
    cuttingBoardImg.visible = true;
    tofu.visible = true;
    egg.visible = true;

    if (holdingObject !== null) {
      holdingObject.x = mouseX;
      holdingObject.y = mouseY;
    }
    screen2();
  }
}

function screen2() {
  background("white");

  //variables for counter thickness
  let counterWidth = width / 6;
  let counterHeight = height / 7;
  let burnerSize = counterWidth * 0.35;
  //Proportional stove height
  let stoveHeight = height * 0.28;
  //Proportional burner spacing
  let burnerSpacing = stoveHeight / 2;

  push();
  fill(150, 111, 51);
  //fill(255);
  noStroke();
  //left counter
  image(woodTexture, 0, 0, counterWidth, height);

  //right counter
  image(woodTexture, width - counterWidth, 0, counterWidth, height);

  //top counter
  image(woodTexture2, 0, 0, width, counterHeight);

  //bottom counter
  image(woodTexture2, 0, height - counterHeight, width, counterHeight);
  pop();
  
  push();
  imageMode(CENTER);
  //display recipe steps, unless its step 5 and someone won or lost
  //image(recipeSteps[currentStep],width/2,height/2,width*0.25,height*0.3);
  if (!(currentStep === 4 && (gameWon || gameLost))) {
  image(recipeSteps[currentStep], width/2, height/2, width*0.25, height*0.3);
}
  
  //go to step 2 when water is added
  if(addWaterPot && topBurnerOn && bottomBurnerOn && currentStep === 0){
    currentStep=1;
  }
  //go to step 3 when tofu is chopped
  if(cutTofu && ramen.x > ramen.x - pot.w / 2 &&
      ramen.x < ramen.x + pot.w / 2 &&
      ramen.y > pot.y - pot.h / 2 &&
      ramen.y < pot.y + pot.h / 2 && currentStep === 1){
    currentStep = 2;
  }
  //go to step 4 when scallions are chopped
  if(cutScallions && tofu.x > tofu.x - pan.w / 2 &&
      tofu.x < tofu.x + pan.w / 2 &&
      tofu.y > pan.y - pan.h / 2 &&
      tofu.y < pan.y + pan.h / 2 && currentStep === 2){
    currentStep = 3;
  }
  //go to step 5 when egg is in pot
  if (
      egg.x > egg.x - pot.w / 2 &&
      egg.x < egg.x + pot.w / 2 &&
      egg.y > pot.y - pot.h / 2 &&
      egg.y < pot.y + pot.h / 2
    && currentStep === 3){
    currentStep = 4;
  }
  pop();
  
  //Main timer size/location variables
  let timerWidth = width * 0.12;
  let timerHeight = height * 0.08;
  let timerPadding = width * 0.02;
  
  let mainTimerX = width - timerWidth - timerPadding;
  let mainTimerY = timerPadding;

    push();
    rectMode(CORNER);
    fill("red");
    rect(mainTimerX, mainTimerY, timerWidth, timerHeight, 15);
    
    textAlign(CENTER,CENTER);
    textSize(timerHeight * 0.6);
    fill("white");
    textFont(timeFont);
    text(mainTimer, mainTimerX + timerWidth/2, mainTimerY + timerHeight/2);
    if (mainTimeStarted && frameCount % 60 == 0) {
      mainTimer++;
    }
    pop();

  //stove
  fill(0, 230);
  //rect(0,height/2,width/6,200);
  rect(20, height / 2 - stoveHeight / 2, counterWidth - 40, stoveHeight);

  //bowl
  push();
  imageMode(CENTER);
  image(bowlImg, bowl.x,bowl.y, bowl.w,bowl.h);
  pop();

  //tray
  image(tray, width / 4, height - 105, width / 5, height / 7);

  //Turning top burner on
  if (topBurnerOn) {
    fill("orange");
  } else {
    fill("white");
  }
  //top burner
  ellipse(
    counterWidth / 2,
    height / 2 - burnerSpacing / 2,
    burnerSize,
    burnerSize
  );

  //Turning bottom burner on
  if (bottomBurnerOn) {
    fill("orange");
  } else {
    fill("white");
  }
  //bottom burner
  ellipse(
    counterWidth / 2,
    height / 2 + burnerSpacing / 2,
    burnerSize,
    burnerSize
  );

  let panSize = burnerSize * 1.8;
  push();
  imageMode(CENTER);
  image(panImg, pan.x, pan.y, panSize, panSize);
  pop();

  let potSize = burnerSize * 1.3;
  push();
  imageMode(CENTER);
  image(potImg, pot.x, pot.y, potSize, potSize);
  pop();

  if (addWaterPot) {
    fill("lightblue");
    noStroke();
    ellipse(pot.x, pot.y, potSize * 0.6, potSize * 0.6);
  }

  cuttingBoardW = min(width * 0.15, 180);
  cuttingBoardH = height * 0.2;

  cuttingBoardX = counterWidth / 2;
  cuttingBoardY = counterHeight + cuttingBoardH / 2;

  push();
  imageMode(CENTER);
  image(
    cuttingBoardImg,
    cuttingBoardX,
    cuttingBoardY,
    cuttingBoardW,
    cuttingBoardH
  );
  pop();

  //ramen
  push();
  imageMode(CENTER);
  if (cookedRamen) {
    image(cookedRamenImg, ramen.x, ramen.y, ramen.w, ramen.h);
  } else {
    image(ramenImg, ramen.x, ramen.y, ramen.w, ramen.h);
  }
  pop();

  //tofu
  push();
  imageMode(CENTER);
  if (cookedTofu) {
    image(cookedTofuImg, tofu.x, tofu.y, tofu.w, tofu.h);
  } else if (cutTofu) {
    image(cutTofuImg, tofu.x, tofu.y, tofu.w, tofu.h);
  } else {
    image(tofuImg, tofu.x, tofu.y, tofu.w, tofu.h);
  }
  pop();

  //egg
  push();
  imageMode(CENTER);
  if (cookedEgg) {
    image(cookedEggImg, egg.x, egg.y, egg.w, egg.h);
  } else {
    image(eggImg, egg.x, egg.y, egg.w, egg.h);
  }
  pop();

  //scallions
  push();
  imageMode(CENTER);
  if (cutScallions) {
    image(cutScallionsImg, scallions.x, scallions.y, scallions.w, scallions.h);
  } else {
    image(scallionsImg, scallions.x, scallions.y, scallions.w, scallions.h);
  }
  pop();
  
  //VIEW COLLIDER RECTANGLES
//   bowl.debug = true;
// tofu.debug = true;
// egg.debug = true;
// ramen.debug = true;
// scallions.debug = true;

  //knife
  push();
  imageMode(CENTER);
  image(knifeImg, knife.x, knife.y, knife.w, knife.h);
  pop();

  //knife touches tofu to make it chopped
  if (holdingObject === knife && !cutTofu) {
    if (
      knife.x < tofu.x + tofu.w / 2 &&
      knife.x + knife.w / 2 > tofu.x &&
      knife.y < tofu.y + tofu.h / 2 &&
      knife.y + knife.h / 2 > tofu.y
    ) {
      cutTofu = true;
    }
  }
  //knife touches scallions to make it chopped
  if (holdingObject === knife && !cutScallions) {
    if (
      knife.x < scallions.x + scallions.w / 2 &&
      knife.x + knife.w / 2 > scallions.x &&
      knife.y < scallions.y + scallions.h / 2 &&
      knife.y + knife.h / 2 > scallions.y
    ) {
      cutScallions = true;
    }
  }
  
  //Cooking timer variables for location and size
  let cookTimerX = width - timerWidth/2 - timerPadding;
  let cookTimerY = timerPadding + timerHeight + timerPadding + timerHeight/2;
  let cookTimerSpacing = timerHeight + timerPadding * 0.5;

  //check if cut tofu in pan and timer starts
  if (cutTofu && !cookedTofu && bottomBurnerOn) {
    if (
      tofu.x > pan.x - pan.w / 2 &&
      tofu.x < pan.x + pan.w / 2 &&
      tofu.y > pan.y - pan.h / 2 &&
      tofu.y < pan.y + pan.h / 2
    ) {
      //start timer once
      if (tofuTime === 0) {
        tofuTime = 15;
        tofuTimeStarted = true;
      }
    }
  }

  //tofu timer (only show if counting down)
  push();
  if (tofuTime > 0) {
    rectMode(CENTER);
    fill("red");
    rect(cookTimerX, cookTimerY, timerWidth, timerHeight, 15);
    fill("white");
    textAlign(CENTER);
    textSize(timerHeight * 0.3);
    textFont('Courier New');
    text("TOFU:", cookTimerX, cookTimerY - timerHeight *0.15);
    textFont(timeFont);
    textSize(timerHeight * 0.4);
    text(tofuTime, cookTimerX, cookTimerY + timerHeight * 0.25);

    if (frameCount % 60 == 0) {
      tofuTime--;
    }
  }
  if (tofuTime == 0 && cutTofu && tofuTimeStarted && bottomBurnerOn) {
    cookedTofu = true;
  }
  pop();

  //check if egg in pot with water and start timer
  if (egg && !cookedEgg && topBurnerOn && addWaterPot) {
    if (
      egg.x > egg.x - pot.w / 2 &&
      egg.x < egg.x + pot.w / 2 &&
      egg.y > pot.y - pot.h / 2 &&
      egg.y < pot.y + pot.h / 2
    ) {
      //start timer once
      if (eggTime === 0) {
        eggTime = 15;
        eggTimeStarted = true;
      }
    }
  }

  push();
  if (eggTime > 0) {
    rectMode(CENTER);
    fill("red");
    rect(cookTimerX, cookTimerY + cookTimerSpacing, timerWidth, timerHeight, 15);
    fill("white");
    textAlign(CENTER);
    textSize(timerHeight * 0.3);
    textFont('Courier New');
    text("EGG:", cookTimerX, cookTimerY + cookTimerSpacing - timerHeight *0.15);
    textFont(timeFont);
    textSize(timerHeight * 0.4);
    text(eggTime, cookTimerX, cookTimerY + cookTimerSpacing + timerHeight * 0.25);

    if (frameCount % 60 == 0) {
      eggTime--;
    }
  }
  if (eggTime === 0 && egg && eggTimeStarted && topBurnerOn && addWaterPot) {
    cookedEgg = true;
  }
  pop();
  
  //ramen timer
  if (ramen && !cookedRamen && topBurnerOn && addWaterPot) {
    if (
      ramen.x > ramen.x - pot.w / 2 &&
      ramen.x < ramen.x + pot.w / 2 &&
      ramen.y > pot.y - pot.h / 2 &&
      ramen.y < pot.y + pot.h / 2
    ) {
      //start timer once
      if (ramenTime === 0) {
        ramenTime = 15;
        ramenTimeStarted = true;
      }
    }
  }
  
  push();
  if (ramenTime > 0) {
    rectMode(CENTER);
    fill('red');
    rect(cookTimerX, cookTimerY + cookTimerSpacing * 2, timerWidth,timerHeight, 15);
    textAlign(CENTER);
    textFont('Courier New');
    textSize(timerHeight * 0.3);
    fill("white");
    text("RAMEN:", cookTimerX, cookTimerY + cookTimerSpacing * 2- timerHeight * 0.15)
    fill("white");
    textSize(timerHeight *0.4);
    textFont(timeFont);
    text(ramenTime, cookTimerX, cookTimerY + cookTimerSpacing * 2 + timerHeight *0.25);

    if (frameCount % 60 == 0) {
      ramenTime--;
    }
  }
  if (
    ramenTime === 0 &&
    ramen &&
    ramenTimeStarted &&
    topBurnerOn &&
    addWaterPot
  ) {
    cookedRamen = true;
  }
  pop();
  
  //check ingredients are in bowl
      if (
  ramen.x > bowl.x - bowl.w/2 &&
  ramen.x < bowl.x + bowl.w/2 &&
  ramen.y > bowl.y - bowl.h/2 &&
  ramen.y < bowl.y + bowl.h/2
) {
  ramenInBowl = true;
}

if (
  egg.x > bowl.x - bowl.w/2 &&
  egg.x < bowl.x + bowl.w/2 &&
  egg.y > bowl.y - bowl.h/2 &&
  egg.y < bowl.y + bowl.h/2
) {
  eggInBowl = true;
}

if (
  scallions.x > bowl.x - bowl.w/2 &&
  scallions.x < bowl.x + bowl.w/2 &&
  scallions.y > bowl.y - bowl.h/2 &&
  scallions.y < bowl.y + bowl.h/2
) {
  scallionsInBowl = true;
}

if (
  tofu.x > bowl.x - bowl.w/2 &&
  tofu.x < bowl.x + bowl.w/2 &&
  tofu.y > bowl.y - bowl.h/2 &&
  tofu.y < bowl.y + bowl.h/2
) {
  tofuInBowl = true;
}
  //show when ramen bowl is complete: later add win or lose
  if(ramenInBowl && scallionsInBowl && eggInBowl && tofuInBowl && cookedEgg && cutScallions && cookedRamen && cookedTofu){
    mainTimeStarted = false;
    //tell server someone completed ramen
    socket.emit("ramenComplete");
    // textAlign(CENTER);
    // textSize(50);
    // fill('black');
    // text('RAMEN COMPLETE!',width/2,height/3-80);
  }

  //message for user if they win or lose
  if(gameWon){
    mainTimeStarted = false;
    textAlign(CENTER);
    textSize(50); 
    fill('black');
    text('YOU WON!',width/2,height/3-80);
  }
  if(gameLost){
    mainTimeStarted = false;
    textAlign(CENTER);
    textSize(50);
    fill('black');
    text('YOU LOST!',width/2,height/3-80);
  }
  
}

function mousePressed() {
  if (screen === 1) {
    //check if begin button is clicked
    if (
      mouseX > button.x &&
      mouseX < button.x + button.w &&
      mouseY > button.y &&
      mouseY < button.y + button.h
    ) {
      screen = 2;
    }
  } else if (screen === 2) {
    // if (pot.mouse.presses()){
    //   topBurnerOn = !topBurnerOn;
    // }
    if (pan.mouse.presses()) {
      bottomBurnerOn = !bottomBurnerOn;
    }
    //turn on burners, add water, turn off burners
    if (pot.mouse.presses()) {
      potClicks++;
      if (potClicks === 1) {
        topBurnerOn = true;
      } else if (potClicks === 2) {
        addWaterPot = true;
      } else {
        topBurnerOn = false;
        addWaterPot = false;
        potClicks = 0;
      }
    }

    //pick up tofu (check if mouse if over tofu)
    if (
      mouseX > tofu.x - tofu.w / 2 &&
      mouseX < tofu.x + tofu.w / 2 &&
      mouseY > tofu.y - tofu.h / 2 &&
      mouseY < tofu.y + tofu.h / 2
    ) {
      holdingObject = tofu;
    }

    //pick up egg
    if (
      mouseX > egg.x - egg.w / 2 &&
      mouseX < egg.x + egg.w / 2 &&
      mouseY > egg.y - egg.h / 2 &&
      mouseY < egg.y + egg.h / 2
    ) {
      holdingObject = egg;
    }
    //pick up knife
    if (
      mouseX > knife.x - knife.w / 2 &&
      mouseX < knife.x + knife.w / 2 &&
      mouseY > knife.y - knife.h / 2 &&
      mouseY < knife.y + knife.h / 2
    ) {
      holdingObject = knife;
    }
    //pick up ramen
    if (
      mouseX > ramen.x - ramen.w / 2 &&
      mouseX < ramen.x + ramen.w / 2 &&
      mouseY > ramen.y - ramen.h / 2 &&
      mouseY < ramen.y + ramen.h / 2
    ) {
      holdingObject = ramen;
    }
    //pick up scallions
    if (
      mouseX > scallions.x - scallions.w / 2 &&
      mouseX < scallions.x + scallions.w / 2 &&
      mouseY > scallions.y - scallions.h / 2 &&
      mouseY < scallions.y + scallions.h / 2
    ) {
      holdingObject = scallions;
    }
  }
}

//Welcome screen
function screen1() {
  background(255);
  fill("red");
  textSize(60);
  textAlign(CENTER);
  text("RAMEN RUSH", width / 2, height / 3);

  //Play button dimensions
  let buttonWidth = width / 5;
  let buttonHeight = height / 12;
  let buttonX = width / 2 - buttonWidth / 2;
  let buttonY = height / 2 - buttonHeight / 2;

  //play button drawn
  fill("red");
  rect(buttonX, buttonY, buttonWidth, buttonHeight, 25);
  //text on button
  fill(255);
  textSize(buttonHeight / 2);
  textAlign(CENTER);
  text("Play", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2 + 10);
  //Coordinates for button click
  button = { x: buttonX, y: buttonY, w: buttonWidth, h: buttonHeight };
}

function mouseReleased() {
  holdingObject = null;
}

//accomodate other screen sizes
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
 kitchenSprites();
}
