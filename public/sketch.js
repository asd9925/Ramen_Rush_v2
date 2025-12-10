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
let addWaterPotImg;
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
let titleImg;
let chopsticks;

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

let currentStep = 0; //your step
let currentOpponentStep = 1; //opponent step

let woodTexture;
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

//name inputs for screen 1
let input1;
let submitButton;
let playerName = '';
let opponentName = '';
let inputState = 'enterName'; //then waiting for other player, matched, countdown, playing
let countdown = 0;
let countdownActive = false;
let countdownStart = 0; //make countdowns completely synced 

//can't move ingredients from pot/pan until cooked (after 2 seconds)
let ramenLocked;
let tofuLocked;
let eggLocked;

completedRamen = false;

function preload() {
  panImg = loadImage("panfinal2.png");
  music = loadSound("background.mp3");
  cuttingBoardImg = loadImage("cuttingboardfinal.png");
  tray = loadImage("trayfinal.png");
  potImg = loadImage("pot2.png");
  addWaterPotImg = loadImage("potwater2.png");
  knifeImg = loadImage("knifefinal2.png");
  tofuImg = loadImage("tofu.png");
  cutTofuImg = loadImage("cuttofufinal.png");
  cookedTofuImg = loadImage("cookedtofu.png");
  eggImg = loadImage("egg.png");
  cookedEggImg = loadImage("completeegg.png");
  ramenImg = loadImage("ramen.png");
  cookedRamenImg = loadImage("cookedramenfinal.png");
  scallionsImg = loadImage("scallions.png");
  cutScallionsImg = loadImage("cutscallionsfinal.png");
  bowlImg = loadImage("bowlfinal.png");
  woodTexture = loadImage("woodtexture.png");
  woodTexture2 = loadImage("woodtexture2.png");
  step1 = loadImage("step1.png");
  step2 = loadImage("step2.png");
  step3 = loadImage('step3.png');
  step4 = loadImage('step4.png');
  step5 = loadImage('step5.png');
  recipeSteps = [step1, step2, step3, step4, step5];
  timeFont = loadFont("Technology-Bold.ttf");
  titleImg = loadImage("title.png");
  chopsticks = loadImage("noodlesfinal.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  x = width / 2;
  y = height / 2;
  //start music 
  music.loop();
  music.setVolume(music_sound);

  //socket client connection...keep it running
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

  //inputs of usernames
  input1 = createInput('');
  input1.position(width / 2, height / 2.4);
  input1.attribute('placeholder', 'Enter your name');
  input1.hide();
  //submit button
  submitButton = createButton('Submit');
  submitButton.position(width / 2 + 120, height / 2.4);
  submitButton.style('background-color', '#ffcb9a');
  submitButton.style('cursor', 'pointer');
  submitButton.hide();

  //socket listener for submitting name
  submitButton.mousePressed(() => {
    playerName = input1.value();
    socket.emit('submitName', { playerName });
    inputState = 'waiting'; // waiting for opponent to submit
    input1.hide();
    submitButton.hide();
  });

  //socket listener for both players submitting names and server sends matched event
  socket.on('matched', (data) => {
    opponentName = data.opponentName || data.opponent || '';
    // update the input state to show match has occured
    inputState = 'matched'; // show "matched with..."

    //display step 1
    socket.emit('stepUpdate', currentStep + 1);
    // start a countdown  
    countdown = 3;
    countdownStart = frameCount; //make countdown synced
    countdownActive = true;
  });

  //socket listener for countdown to start game
  socket.on('countdown', (count) => {
    countdown = count; //Update countdown number on screen
    countdownActive = true;
    if (count === 0) { //When countdown reaches 0 
      screen = 2; //Switch to screen 2
      inputState = 'playing'; //Update game state to playing
    }
  });

  //socket listener for opponents step updating on your screen
  socket.on('opponentStep', (step) => {
    currentOpponentStep = step;
  });

  //Listener to store the opponents step
  socket.on('opponentStep', (step) => {
    currentOpponentStep = step;
  });

  //socket listener and message for winning/losing
  socket.on('youWin', () => {
    console.log("You won received");
    gameWon = true;
    mainTimeStarted = false;
  });

  socket.on('youLose', () => {
    console.log("You lost received");
    gameLost = true;
    mainTimeStarted = false;
  });

  //Pot sprite
  pot = new Sprite(0, 0);
  pot.color = color(0, 0, 0, 0);
  pot.stroke = color(0, 0, 0, 0);

  //Pan sprite
  pan = new Sprite(0, 0);
  pan.color = color(0, 0, 0, 0);
  pan.stroke = color(0, 0, 0, 0);

  //egg sprite
  egg = new Sprite(0, 0, 20, 30);
  egg.color = color(0, 0, 0, 0);
  egg.stroke = color(0, 0, 0, 0);
  egg.collider = "kinematic";

  //knife sprite
  knife = new Sprite(0, 0);
  knife.color = color(0, 0, 0, 0);
  knife.stroke = color(0, 0, 0, 0);
  knife.w = width * 0.05;
  knife.h = height * 0.12;

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

  //bowl sprite
  bowl = new Sprite(0, 0);
  bowl.color = color(0, 0, 0, 0);
  bowl.stroke = color(0, 0, 0, 0);
  bowl.collider = 'static';

  //Set sprite positions
  kitchenSprites();
}

function kitchenSprites() {
  let counterWidth = width / 6;
  let counterHeight = height / 7;

  //Make stove size based on counter width
  let burnerSize = counterWidth * 0.35;
  let stoveHeight = height * 0.28;
  //Space burners based on stove size
  let burnerSpacing = stoveHeight / 2;

  //pan on top burner (left burner)
  pot.x = width / 2.1 + burnerSpacing * 1.25;
  pot.y = height * 0.62 + burnerSpacing;
  pot.w = burnerSize * 2;
  pot.h = burnerSize * 1.8;
  pot.collider = "static";
  //pot on bottom burner (right burner)
  pan.x = width / 2.1 + burnerSpacing * 3.6;
  pan.y = height * 0.62 + burnerSpacing;
  pan.w = burnerSize * 2.6;
  pan.h = burnerSize * 1.8;
  pan.collider = "static";
  //cutting board
  let boardWidth = width * 0.4;
  let boardHeight = height * 0.1;
  cuttingBoardW = width * 0.5;
  cuttingBoardH = height * 0.1;
  cuttingBoardX = counterWidth / 2;
  cuttingBoardY = counterHeight + cuttingBoardH / 2 + 20;
  //tofu
  tofu.x = width / 6.4;
  tofu.y = height / 1.18;
  tofu.w = width * 0.051;
  tofu.h = height * 0.13;
  tofu.collider = "kinematic";
  tofu.color = color(0, 0, 0, 0);
  //knife
  knife.x = counterWidth * 1.8;
  knife.y = counterHeight + cuttingBoardH * 3;
  knife.w = width * 0.05;
  knife.h = height * 0.18;
  knife.collider = "kinematic";
  //egg
  egg.x = width / 5;
  egg.y = height / 1.15;
  egg.w = width * 0.021;
  egg.h = height * 0.06;
  egg.collider = "kinematic";
  egg.color = color(0, 0, 0, 0);
  //ramen
  ramen.x = width / 4.2;
  ramen.y = height / 1.15;
  ramen.w = width * 0.051;
  ramen.h = height * 0.11;
  ramen.collider = "kinematic";
  ramen.color = color(0, 0, 0, 0);
  //scallions
  scallions.x = width / 3.5;
  scallions.y = height / 1.19;
  scallions.w = width * 0.050;
  scallions.h = height * 0.11;
  scallions.collider = "kinematic";
  scallions.color = color(0, 0, 0, 0);
  //bowl
  let bowlWidth = width * 0.13;
  let bowlHeight = height * 0.16;
  bowl.x = width / 2;
  bowl.y = height / 2.5;
  bowl.w = bowlWidth;
  bowl.h = bowlHeight;
}

function draw() {
  if (screen === 1) {
    cuttingBoardImg.visible = false;
    tofu.visible = false;
    egg.visible = false;

    screen1();
    // countdown while in screen1 after matched
    if (inputState === 'matched' && countdownActive) {
      if (frameCount - countdownStart >= 60) {
        countdownStart = frameCount;
        countdown -= 1;
        if (countdown <= 0) {
          countdownActive = false;
          inputState = 'playing';
          screen = 2;
        }
      }
    }
  } else if (screen === 2) {
    cuttingBoardImg.visible = true;
    tofu.visible = true;
    egg.visible = true;
    //drag objects with mouse
    if (holdingObject !== null) {
      holdingObject.x = mouseX;
      holdingObject.y = mouseY;
    }
    screen2();
  }
}

function screen2() {
  background('white');
  push();
  imageMode(CORNER);
  image(woodTexture2, 0, 0, width, height);
  pop();
  input1.hide();

  //immediately stop both main timers when someone wins
  if (gameWon || gameLost) {
    mainTimeStarted = false;
  };

  //variables for counter thickness
  let counterWidth = width / 6;
  let counterHeight = height / 7;
  let burnerSize = counterWidth * 0.6;
  //Proportional stove height
  let stoveHeight = height * 0.27;
  //Proportional burner spacing
  let burnerSpacing = stoveHeight / 2;

  push();
  imageMode(CORNER);
  //display recipe steps, unless the game is over
  if (!(gameWon || gameLost)) {
    image(recipeSteps[currentStep], 10, width * 0.01, width * 0.38, height * 0.44);
  }

  //opponent name at top with current step, different sized rect based on name size
  push();
  textSize(24);
  let fullText = opponentName + ": Step " + currentOpponentStep;
  let rectWidth = textWidth(fullText) + 40;
  fill("white");
  rectMode(CENTER);
  rect(width / 2, height * 0.1, rectWidth, height * 0.05, 20);
  textAlign(CENTER, CENTER);
  fill("black");
  text(fullText, width / 2, height * 0.1);
  pop();

  //go to step 2 when water is added and burners are on
  if (addWaterPot && topBurnerOn && bottomBurnerOn && currentStep === 0) {
    currentStep = 1;
    socket.emit('stepUpdate', currentStep + 1); //send step to opponent
  }
  //go to step 3 when tofu is chopped and ramen is in pot
  if (cutTofu && ramen.x > pot.x - pot.w / 2 &&
    ramen.x < pot.x + pot.w / 2 &&
    ramen.y > pot.y - pot.h / 2 &&
    ramen.y < pot.y + pot.h / 2 && currentStep === 1) {
    currentStep = 2;
    socket.emit('stepUpdate', currentStep + 1); //send step to opponent
  }
  //go to step 4 when scallions are chopped and tofu is in pan
  if (cutScallions && tofu.x > pan.x - pan.w / 2 &&
    tofu.x < pan.x + pan.w / 2 &&
    tofu.y > pan.y - pan.h / 2 &&
    tofu.y < pan.y + pan.h / 2 && currentStep === 2) {
    currentStep = 3;
    socket.emit('stepUpdate', currentStep + 1); //send step to opponent
  }
  //go to step 5 when egg is in pot and ramen in bowl
  if (
    egg.x > pot.x - pot.w / 2 &&
    egg.x < pot.x + pot.w / 2 &&
    egg.y > pot.y - pot.h / 2 &&
    egg.y < pot.y + pot.h / 2
    && ramen.x > bowl.x - bowl.w / 2 &&
    ramen.x < bowl.x + bowl.w / 2 &&
    ramen.y > bowl.y - bowl.h / 2 &&
    ramen.y < bowl.y + bowl.h / 2 && currentStep === 3) {
    currentStep = 4;
    socket.emit('stepUpdate', currentStep + 1); //send step to opponent
  }
  pop();

  //Main timer size/location variables
  let timerWidth = width * 0.1;
  let timerHeight = height * 0.11;
  let timerPaddingX = width * 0.03;
  let timerPaddingY = width * 0.04;
  let mainTimerX = width - timerWidth - timerPaddingX;
  let mainTimerY = timerPaddingY;
  //draw main timer and count up unless game is over
  push();
  rectMode(CORNER);
  fill("red");
  rect(mainTimerX, mainTimerY, timerWidth, timerHeight, 15);
  textAlign(CENTER, CENTER);
  textSize(timerHeight * 0.7);
  fill("white");
  textFont(timeFont);
  text(mainTimer, mainTimerX + timerWidth / 2, mainTimerY + timerHeight / 2);
  if (mainTimeStarted && !gameWon && !gameLost && frameCount % 60 == 0) {
    mainTimer++;
  }
  pop();

  push();
  //stove
  rectMode(CORNER);
  fill(0, 230);
  rect(width / 2.1, height * 0.55, counterWidth * 1.9, stoveHeight * 1.5);
  pop();

  //bowl
  push();
  imageMode(CENTER);
  image(bowlImg, bowl.x, bowl.y, bowl.w, bowl.h);
  pop();

  //tray
  image(tray, width / 5, height / 1.8, width / 2, height / 0.9);

  //Turning top burner on (left burner)
  if (topBurnerOn) {
    fill("orange");
  } else {
    fill("white");
  }
  //top burner (left burner)
  ellipse(
    width / 2.1 + burnerSpacing * 1.3,
    height * 0.62 + burnerSpacing,
    burnerSize,
    burnerSize
  );

  //Turning bottom burner on (right burner)
  if (bottomBurnerOn) {
    fill("orange");
  } else {
    fill("white");
  }
  //bottom burner (right burner)
  ellipse(
    width / 2.1 + burnerSpacing * 3.3,
    height * 0.62 + burnerSpacing,
    burnerSize,
    burnerSize
  );

  push();
  imageMode(CENTER);
  image(panImg, pan.x, pan.y, pan.w, pan.h); //draw pan
  pop();

  if (addWaterPot) { //draw pot with water if clicked
    image(addWaterPotImg, pot.x, pot.y, pot.w, pot.h);
  } else {
    image(potImg, pot.x, pot.y, pot.w, pot.h); //regular pot
  }

  //draw and position cutting board
  cuttingBoardW = width * 0.26;
  cuttingBoardH = height * 0.25;
  cuttingBoardX = counterWidth;
  cuttingBoardY = counterHeight + cuttingBoardH * 1.5;
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

  //draw ramen
  push();
  imageMode(CENTER);
  if (cookedRamen) {
    image(cookedRamenImg, ramen.x, ramen.y, ramen.w * 1.4, ramen.h);
  } else {
    image(ramenImg, ramen.x, ramen.y, ramen.w, ramen.h);
  }
  pop();

  //draw tofu
  push();
  imageMode(CENTER);
  if (cookedTofu) {
    image(cookedTofuImg, tofu.x, tofu.y, tofu.w, tofu.h / 1.3);
  } else if (cutTofu) {
    image(cutTofuImg, tofu.x, tofu.y, tofu.w, tofu.h);
  } else {
    image(tofuImg, tofu.x, tofu.y, tofu.w, tofu.h);
  }
  pop();

  //draw egg
  push();
  imageMode(CENTER);
  if (cookedEgg) {
    image(cookedEggImg, egg.x, egg.y, egg.w, egg.h);
  } else {
    image(eggImg, egg.x, egg.y, egg.w, egg.h);
  }
  pop();

  //draw scallions
  push();
  imageMode(CENTER);
  if (cutScallions) {
    image(cutScallionsImg, scallions.x, scallions.y, scallions.w, scallions.h);
  } else {
    image(scallionsImg, scallions.x, scallions.y, scallions.w, scallions.h);
  }
  pop();

  //draw knife
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
  let cookTimerX = width - timerWidth / 2 - timerPaddingX;
  let cookTimerY = timerPaddingY + timerHeight + timerPaddingY + timerHeight / 2;
  let cookTimerSpacing = timerHeight + timerPaddingY / 2.5;

  //check if cut tofu in pan and tofu timer starts
  if (cutTofu && !cookedTofu && bottomBurnerOn) {
    if (
      tofu.x > pan.x - pan.w / 2 &&
      tofu.x < pan.x + pan.w / 2 &&
      tofu.y > pan.y - pan.h / 2 &&
      tofu.y < pan.y + pan.h / 2
    ) {
      //start timer only once
      if (tofuTime === 0) {
        tofuTime = 15;
        tofuTimeStarted = true;
      }
    }
  }
  //draw tofu timer (only show if counting down)
  push();
  if (tofuTime > 0) {
    rectMode(CENTER);
    fill("red");
    rect(cookTimerX, cookTimerY, timerWidth, timerHeight, 15);
    fill("white");
    textAlign(CENTER);
    textSize(timerHeight * 0.3);
    textFont('Courier New');
    text("TOFU:", cookTimerX, cookTimerY - timerHeight * 0.15);
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
      egg.x > pot.x - pot.w / 2 &&
      egg.x < pot.x + pot.w / 2 &&
      egg.y > pot.y - pot.h / 2 &&
      egg.y < pot.y + pot.h / 2
    ) {
      //start timer only once
      if (eggTime === 0) {
        eggTime = 15;
        eggTimeStarted = true;
      }
    }
  }
  //draw egg timer
  push();
  if (eggTime > 0) {
    rectMode(CENTER);
    fill("red");
    rect(cookTimerX, cookTimerY + cookTimerSpacing, timerWidth, timerHeight, 15);
    fill("white");
    textAlign(CENTER);
    textSize(timerHeight * 0.3);
    textFont('Courier New');
    text("EGG:", cookTimerX, cookTimerY + cookTimerSpacing - timerHeight * 0.15);
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

  //ramen timer if it's raw, and burner is on with water
  if (ramen && !cookedRamen && topBurnerOn && addWaterPot) {
    if (
      ramen.x > pot.x - pot.w / 2 &&
      ramen.x < pot.x + pot.w / 2 &&
      ramen.y > pot.y - pot.h / 2 &&
      ramen.y < pot.y + pot.h / 2
    ) {
      //start timer only once
      if (ramenTime === 0) {
        ramenTime = 15;
        ramenTimeStarted = true;
      }
    }
  }
  //draw ramen timer
  push();
  if (ramenTime > 0) {
    rectMode(CENTER);
    fill('red');
    rect(cookTimerX, cookTimerY + cookTimerSpacing * 2, timerWidth, timerHeight, 15);
    textAlign(CENTER);
    textFont('Courier New');
    textSize(timerHeight * 0.3);
    fill("white");
    text("RAMEN:", cookTimerX, cookTimerY + cookTimerSpacing * 2 - timerHeight * 0.15)
    fill("white");
    textSize(timerHeight * 0.4);
    textFont(timeFont);
    text(ramenTime, cookTimerX, cookTimerY + cookTimerSpacing * 2 + timerHeight * 0.25);

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

  //can't move ramen from pot unless it's cooked (after 2 seconds)
  //check if uncooked ramen is in pot
  if (!cookedRamen && ramen.x > pot.x - pot.w / 2 &&
    ramen.x < pot.x + pot.w / 2 &&
    ramen.y > pot.y - pot.h / 2 &&
    ramen.y < pot.y + pot.h / 2) {
    //start timer when ramen first touches pot
    if (ramenLocked === null) {
      ramenLocked = frameCount;
    }
    //after 2 seconds post touching pot, ramen is locked in place until cooked
    if (frameCount - ramenLocked > 120) {
      if (holdingObject === ramen) {
        holdingObject = null; //force release
      }
    }
    //reset if taken out of pot before 2 seconds
  } else {
    ramenLocked = null;
  }

  //can't move egg from pot unless it's cooked (after 2 seconds)
  //check if uncooked egg is in pot
  if (!cookedEgg && egg.x > pot.x - pot.w / 2 &&
    egg.x < pot.x + pot.w / 2 &&
    egg.y > pot.y - pot.h / 2 &&
    egg.y < pot.y + pot.h / 2) {
    //start timer when egg first touches pot
    if (eggLocked === null) {
      eggLocked = frameCount;
    }
    //after 2 seconds post touching pot, egg is locked in place until cooked
    if (frameCount - eggLocked > 120) {
      if (holdingObject === egg) {
        holdingObject = null; //force release
      }
    }
    //reset if taken out of pot before 2 seconds
  } else {
    eggLocked = null;
  }

  //can't move tofu from pan unless it's cooked (after 2 seconds)
  //check if uncooked tofu is in pan
  if (!cookedTofu && cutTofu && tofu.x > pan.x - pan.w / 2 &&
    tofu.x < pan.x + pan.w / 2 &&
    tofu.y > pan.y - pan.h / 2 &&
    tofu.y < pan.y + pan.h / 2) {
    //start timer when tofu first touches pan
    if (tofuLocked === null) {
      tofuLocked = frameCount;
    }
    //after 2 seconds post touching pan, tofu is locked in place until cooked
    if (frameCount - tofuLocked > 120) {
      if (holdingObject === tofu) {
        holdingObject = null; //force release
      }
    }
    //reset if taken out of pot before 2 seconds
  } else {
    tofuLocked = null;
  }

  //check ingredients are in bowl
  if (
    ramen.x > bowl.x - bowl.w / 2 &&
    ramen.x < bowl.x + bowl.w / 2 &&
    ramen.y > bowl.y - bowl.h / 2 &&
    ramen.y < bowl.y + bowl.h / 2
  ) {
    ramenInBowl = true;
  }

  if (
    egg.x > bowl.x - bowl.w / 2 &&
    egg.x < bowl.x + bowl.w / 2 &&
    egg.y > bowl.y - bowl.h / 2 &&
    egg.y < bowl.y + bowl.h / 2
  ) {
    eggInBowl = true;
  }

  if (
    scallions.x > bowl.x - bowl.w / 2 &&
    scallions.x < bowl.x + bowl.w / 2 &&
    scallions.y > bowl.y - bowl.h / 2 &&
    scallions.y < bowl.y + bowl.h / 2
  ) {
    scallionsInBowl = true;
  }

  if (
    tofu.x > bowl.x - bowl.w / 2 &&
    tofu.x < bowl.x + bowl.w / 2 &&
    tofu.y > bowl.y - bowl.h / 2 &&
    tofu.y < bowl.y + bowl.h / 2
  ) {
    tofuInBowl = true;
  }

  //check if ramen bowl is complete:
  if (ramenInBowl && scallionsInBowl && eggInBowl && tofuInBowl && cookedEgg && cutScallions && cookedRamen && cookedTofu && !completedRamen) {
    console.log("Ramen Complete!");
    //stop the main timer
    mainTimeStarted = false;
    completedRamen = true;
    //tell server someone completed ramen
    socket.emit("ramenComplete");
  }
  //display winning/losing text
  if (gameWon) {
    textAlign(CENTER);
    textSize(51);
    fill('black');
    text('YOU WON!', width / 2, height / 3 - 80);
  }
  if (gameLost) {
    textAlign(CENTER);
    textSize(51);
    fill('black');
    text('YOU LOST!', width / 2, height / 3 - 80);
  }
}

function mousePressed() {
  //turn burner on if the pan is clicked
  if (screen === 2) {
    if (pan.mouse.presses()) {
      bottomBurnerOn = !bottomBurnerOn;
    }
    //turn on pot burners, add water, turn off burners
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

    //pick up tofu (check if mouse if over tofu) (unless it's locked in pan)
    if (
      mouseX > tofu.x - tofu.w / 2 &&
      mouseX < tofu.x + tofu.w / 2 &&
      mouseY > tofu.y - tofu.h / 2 &&
      mouseY < tofu.y + tofu.h / 2 && !(tofuLocked !== null && frameCount - tofuLocked > 120 && !cookedTofu)
    ) {
      holdingObject = tofu;
    }

    //pick up egg (unless it's locked in pot)
    if (
      mouseX > egg.x - egg.w / 2 &&
      mouseX < egg.x + egg.w / 2 &&
      mouseY > egg.y - egg.h / 2 &&
      mouseY < egg.y + egg.h / 2 && !(eggLocked !== null && frameCount - eggLocked > 120 && !cookedEgg)
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
    //pick up ramen (unless it's locked in pot)
    if (
      mouseX > ramen.x - ramen.w / 2 &&
      mouseX < ramen.x + ramen.w / 2 &&
      mouseY > ramen.y - ramen.h / 2 &&
      mouseY < ramen.y + ramen.h / 2 && !(ramenLocked !== null && frameCount - ramenLocked > 120 && !cookedRamen)
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
  input1.show();
  background(255, 173, 173);
  textAlign(CENTER);
  imageMode(CENTER);
  image(titleImg, width / 1.8, height / 30, width * 0.75, height * 0.55);

  //noodles/chopsticks
  image(chopsticks, width / 1.2, height / 1.6, width / 4.5, height / 1.);

  //instructions
  push();
  textSize(22);
  fill("black");
  text("Who can make a bowl of ramen the fastest?", width / 2, height / 2.3);
  pop();

  //player names text input
  push();
  textSize(18);
  fill("black");
  text("Player Name:", width / 2 - 100, height / 1.78);
  if (inputState === 'enterName') {
    input1.show();
    input1.position(width / 2, height / 1.85);
    submitButton.show();
    submitButton.position(width / 2 + 120, height / 1.85);
  }
  pop();

  // Different states of matching process: waiting, matched, countdown
  push();
  textAlign(CENTER);
  fill('black');
  if (inputState === 'enterName') {
    // show nothing extra
  } else if (inputState === 'waiting') {
    textSize(20);
    text('Waiting for opponent to submit...', width / 2, height / 1.5);
  } else if (inputState === 'matched') {
    textSize(24);
    text('Matched with ' + (opponentName || 'Player'), width / 2, height / 1.5);
    if (countdownActive) {
      textSize(48);
      text(countdown, width / 2, height / 1.3);
    }
  }

  pop();
}

function mouseReleased() {
  //let go of object if mouse is released
  holdingObject = null;
}

//accomodate other screen sizes
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  kitchenSprites();
}
