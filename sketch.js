//Jack Morgan - 21029119

let uploadColour = "#fffcc9";
let continueColour = "skyblue";
let uploadButtonText = "Upload Song";
let continueButtonText = "Continue";
let buttons = [];
let emotions = ["Joy", "Love", "Pride", "Fun", "Pleasure", "Excitement", "Surprise", "Power", "Calm", "Hope", "Comfort", "Relief", "Tired", "Fear", "Sad", "Bored", "Regret", "Disappoint\n-ment", "Hate", "Evil", "Disgust", "Anger", "Envy"];
let emotionSelection = [];
let colourLibrary;
let colourCollection = [];
let fileInput;
let song;
let state = "upload";
let fft;
let smoothing = 0.8;
let bins = 1024;
let waveform = [];
let spectrum = [];
let r = 100;
let waveR = 50;
let amplitude;
let sensitivity = 1.5;
let smoothLevel = 0;
let keepCircles = [];
let resolution = 16;
let strokeThickness;
let oomfSize =0;
let treble;
let mids;
let bass;
let smoothTreble = 0;
let trebleSize;
let smoothHighMids = 0;
let highMidsSize
let smoothMids = 0;
let midsSize;
let smoothLowMids = 0;
let lowMidsSize;
let smoothBass = 0;
let bassSize;
let oomfDelay= [];
let oomfDelay1;
let oomfDelay2;
let tdc;
let tangle = 0;
let bigBars;
let bigBarsSpec = [];
let farLeftTriPulse = [];
let leftTriPulse = [];
let centreTriPulse = [];
let rightTriPulse = [];
let farRightTriPulse = [];
let lastPulse = 0;
let pulseDelay = 0;
let circleAmount = 0;
let triangleAmount=0;
let squareAmount=0;
let circleWaveColours = [];
let squareColours = [];
let triangleColours = [];
let uploadErrorTimer = 0;

let emotionTaxonomy = { //defines visual attributes of each emotion

  Joy: {
    colours: {Yellow: 1, Red: 1, Pink: 1, Orange: 1, Green: 1, Blue: 1, White: 1, Teal: 1},
    shape: {Circle: 1},
    smoothness: 1
  },
  
  Love: {
    colours: {Pink: 1, Red:1, Purple: 1},
    shape: {Circle: 1},
    smoothness: 1
  },

  Pride: {
    colours: {Purple: 1},
    shape: {Circle: 1},
    smoothness: 1
  },


  Fun: {
    colours: {Orange:1, Pink:1},
    shape: {Circle: 1},
    smoothness: 1
  },

  Pleasure: {
    colours: {Yellow:1,Pink:1},
    shape: {Circle:1},
    smoothness: 1
  },

  Excitement: {
    colours: {Orange:1},
    shape: {Square:1, Triangle:1, Circle:1},
    smoothness: 1
  },   

  Surprise: {
    colours: {Orange:1},
    shape: {Triangle:1, Circle:1},
    smoothness: 1
  },

  Calm: {
    colours: {Blue:1,Green:1,Purple:1,White:1},
    shape: {Circle:1},
    smoothness: 1
  },

  Hope: {
    colours: {White:1},
    shape: {Circle:1},
    smoothness: 1
  },

  Comfort: {
    colours: {Blue:1},
    shape: {Circle:1},
    smoothness: 1
  },

  Relief: {
    colours: {White:1,Teal:1},
    shape: {Circle:1},
    smoothness: 1
  },

  Tired: {
    colours: {Grey:1},
    shape: {Square:1},
    smoothness: 0
  },

  Power: {
    colours: {Black:1,Purple:1},
    shape: {Square:1},
    smoothness: 0
  },

  Regret: {
    colours: {Grey:1},
    shape: {Square:1, Triangle:1},
    smoothness: -1
  },

  Disappointment: {
    colours: {Grey:1},
    shape: {Square:1, Triangle:1},
    smoothness: -1
  },


  Fear: {
    colours: {Grey:1,Purple:1,Black:1},
    shape: {Square:1, Triangle:1},
    smoothness: -1
  },

  Sad: {
    colours: {Purple:1,Black:1,Blue:1,Brown:1,Grey:1},
    shape: {Square:1, Triangle:1},
    smoothness: -1
  },

  Bored: {
    colours: {Grey:1,Brown:1},
    shape: {Square:1, Triangle:1},
    smoothness: -1
  },

  Hate: {
    colours: {Black:1},
    shape: {Square:1, Triangle:1},
    smoothness: -1
  },

  Evil: {
    colours: {Black:1},
    shape: {Square:1, Triangle:1},
    smoothness: -1
  },

  Disgust: {
    colours: {Brown:1},
    shape: {Square:1, Triangle:1},
    smoothness: -1
  },

  Anger: {
    colours: {Red:1,Black:1},
    shape: {Square:1, Triangle:1},
    smoothness: -1
  },

  Envy: {
    colours: {Green:1},
    shape: {Square:1, Triangle:1},
    smoothness: -1,
  }
}

let visualConfig = { //Combination of visual attributes from all emotions selected
  colours: {},
  shape: {},
  smoothness: 0,
  angularity: 0
}

//GLOBAL FUNCTIONS START__________________________________________________________________________________________________________________________________________

function setup() {
  createCanvas(windowWidth, windowHeight); //draw canvas to window size
  createEmotionButtons(); //create emotions
  fileInput = createFileInput(handleFile); //file upload for songs
  fileInput.hide(); //hide if not on upload page
  fft = new p5.FFT(smoothing, bins);
  bigBars = new p5.FFT(0.8,32);//separate fft for visualiser if squares>4
  amplitude = new p5.Amplitude()
  tdc = createGraphics(windowWidth, windowHeight, WEBGL); //3D canvas
  createBackgroundCircles();

  colourLibrary = { //defines colours referenced in taxonomy
    Black: color(15),
    White: color(255),
    Grey: color(115),
    Red: color(255, 0, 0),
    Blue: color(0, 137, 255),
    Green: color(0, 255, 0),
    Teal: color(0, 171, 171),
    Yellow: color(255, 229, 0),
    Orange: color(255, 114, 0),
    Pink: color(255, 50, 211),
    Purple: color(154, 50, 211),
    Brown: color(122, 72, 36)
  };
}

function draw() { //Draw the page according to current state
  if(state === "upload"){
    uploadPageDraw();
  }
  if(state === "emotion"){
    emotionPageDraw();
  }
  if(state === "visualiser"){
    visualiserPageDraw();
  }
}

function drawBackButton() { //Back button appearance
  push();
  fill(0);
  textSize(windowWidth*0.09);
  push();
  stroke(255,255,255);
  strokeWeight(5);
  text("←", windowWidth/14, windowHeight-windowHeight/10);
  pop();
  pop();
}

function mousePressed(){
  if (mouseX < windowWidth/9 && mouseY > windowHeight-windowHeight/7) {//back button on click
    goBack();
    console.log("Back button selected");
    return;
  }
  if(state === "upload"){ //upload page on click
    uploadMousePressed();
  }
  if(state === "emotion"){ //Emotion page on click
    emotionMousePressed();
  }
  if(state === "visualiser"){ //Visualiser page on click
    visualiserMousePressed();
  }
}

function keyPressed(){ //Keyboard shortcuts for editing visuals on the fly, C for circles, S for Squares, T for triangles, +Shift to minus

  if (keyIsDown(SHIFT) && key === "c" || key === "C"){
    circleAmount--;
    //console.log("Circle amount = " + circleAmount);
  }
  else if (key === "c" || key === "C"){
    circleAmount++;
    //console.log("Circle amount = " + circleAmount);
  }

  if (keyIsDown(SHIFT) && key === "s" || key === "S"){
    squareAmount--;
    //console.log("Square amount = " + squareAmount);
  }
  else if (key === "s" || key === "S"){
    squareAmount++;
    //console.log("Square amount = " + squareAmount);
  }

  if (keyIsDown(SHIFT) && key === "t" || key === "T"){
    triangleAmount--;
    //console.log("Triangle amount = " + triangleAmount);
  }
  else if (key === "t" || key === "T"){
    triangleAmount++;
    //console.log("Triangle amount = " + triangleAmount);
  }
}

function goBack() { //back button functionality
  if (state === "emotion") { //if emotion page - return to upload page
    state = "upload";
  }

  else if (state === "visualiser") { //if visualiser page - return to emotion page
    state = "emotion";
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); //if window resized, redraw canvas to fit window
  createEmotionButtons(); //redraw buttons to fit window size
  tdc.resizeCanvas(windowWidth, windowHeight); //if window resized, redraw 3DC canvas to fit window
}

//GLOBAL FUNCTIONS END__________________________________________________________________________________________________________________________________________

//UPLOAD PAGE START ________________________________________________________________________________________________________________________________________
function uploadPageDraw(){

  let w = windowWidth;
  let h = windowHeight;
  
  background(255);
  rectMode(CENTER); //draw rectangles from center
  strokeWeight(3);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);

  fileInput.position(windowWidth/2 - 100, windowHeight/2.5);

  //UPLOAD BUTTON
  fill(uploadColour); //button colour
  rect(w/2,h/2.5,w/2,h/3,30); //upload button size
  fill("black"); //text colour
  textSize(52); //text size

  if (uploadButtonText.length > 15) { //limits upload button text length
  uploadButtonText = uploadButtonText.substring(0, 15) + "..."; //cut off filename beyond caracter limit
  }

  text(uploadButtonText,w/2,h/2.5); //write button text 


  //error with file type changes button appearance for 2 seconds
  if (uploadErrorTimer > 0 && millis() >= uploadErrorTimer) {//after upload error timer expires
    uploadColour = "#fffcc9"; //reverts button to original state
    uploadButtonText = "Upload Song";
    uploadErrorTimer = 0;//resets timer
    continueButtonText = "Continue"; //revert continue to original state
    continueColour = "skyBlue";
  }

  //CONTINUE BUTTON
  fill(continueColour); //button colour
  rect(w/2,h/1.3,w/4,h/10,30); //continue button size
  fill("black"); //text colour
  textSize(28); //text size
  text(continueButtonText,w/2,h/1.3); //text with position
}

function uploadMousePressed(){ //upload page functionality on mouse click
  let w = windowWidth;
  let h = windowHeight;

  //upload button center xy and rectangle wh
  let ucx = w/2;
  let ucy = h/2.5;
  let urw = w/2;
  let urh = h/3;

  //continue button center xy and rectangle wh
  let ccx = w/2;
  let ccy = h/1.3;
  let crw = w/4;
  let crh = h/10;

  //Upload button click
  if (mouseX > ucx - urw/2 && mouseX < ucx + urw/2 && mouseY > ucy - urh/2 && mouseY < ucy + urh/2) { //if clicked within the button boundary
    fileInput.elt.click(); // opens file picker
  }

  //Continue button click
  if (mouseX > ccx - crw/2 && mouseX < ccx + crw/2 && mouseY > ccy - crh/2 && mouseY < ccy + crh/2) { //if clicked within the button boundary
    if (song){ //if there is a sound file
      state = "emotion"; //go to next page
      console.log("Continue button selected"); //log select to console
    }
    if (!song){ //if no sound file, display error for 2s
      continueButtonText = "Upload Required";
      continueColour = color(255,50,0);
      uploadErrorTimer = millis() + 2000; //timeout
    }
  }
}

function handleFile(file) { //when user uploads a file

  if (file.type === "audio") { //if audio file

    if (song) {
      song.stop(); //stop previous song before replacing it
    } 

    song = loadSound(file.data, audioLoaded); //song = sound file

    function audioLoaded() { //once audio loadded
      console.log("Audio loaded");
      uploadColour = color(162,228,184); //change button colour
      uploadButtonText = file.name; //change upload button text to file name
    };
  }

  else { //if not an audio file
    console.log("Not an audio file")
    uploadColour = color(255,50,0);//button colour red
    uploadButtonText = "Wrong File type"; //display error on button
    uploadErrorTimer = millis() + 2000; //start error timer, reverts to original button after 2 seconds
  }
}

//UPLOAD PAGE END ________________________________________________________________________________________________________________________________________

//EMOTION PAGE START ________________________________________________________________________________________________________________________________________

function emotionPageDraw() {//draws emotion menu page
  background("white");
  drawBackButton();
  rectMode(CORNER);
  textAlign(CENTER, CENTER); //Align text to centers
  push(); //limit style changes to title
  textSize(42); //title text size
  textStyle(BOLD); //title text style
  text("Select emotions of the song", w/2,h/10); //title text 
  pop(); //limit style changes to title
  drawEmotionButtons(); //Draw all emotion buttons
}

function createEmotionButtons(){ //calculate and store emotion button position, size, label. Does not draw them
  buttons=[]; //array with rectangle (button) info
  w = windowWidth;
  h = windowHeight;

  let i = 0; //index of first button in array

  //creates grid of first 3 rows of emotion buttons
  for (let x = w/11; x < w - w/10; x += w/7) {//button spacing width
    for (let y = h/5; y < h - h/2; y += h/7) {//button spacing hieght
      buttons.push({x: x, y: y, w: w/10, h: h/10, label: emotions[i], color: 200}); //stores rectangle info to the array
      i++; //incriment to next button
    }
  }

  for (let x = w/8.9; x < w - w/10; x += w/6) { //bottom row of emotion buttons, different spacing
    buttons.push({x: x, y: h/1.59, w: w/10, h: h/10, label: emotions[i], color: 200}); 
    i++
  }

  buttons.push({x: w/2 - (w/8)/2, y: h-h/6, w: w/8, h: h/8, label: "Continue", isContinue: true, color: color("skyblue")}) //continue button
  
}

function drawEmotionButtons () {//drawing from "buttons" array data created above
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  textSize(12);
  strokeWeight(2); 

  for (let i = 0; i < buttons.length; i++) { //loop through all the buttons 
    let b = buttons[i]; //get current button
    let isHover = mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h; //while hovering within button boundary
    let hoverColor = b.color;

    if (!b.isContinue && emotionSelection.includes(b.label)) { //if an emotion button is selected
      hoverColor = color(162,228,184); //change colour
    } 

    fill(hoverColor); //rectagle fill
    rect(b.x, b.y, b.w, b.h, 25); //draw the button

    if (!b.isContinue && isHover) { //if hovering over an emotion button
      fill(210, 220, 230, 120); //change apperance
      rect(b.x, b.y, b.w, b.h, 25)
    }

    fill("black"); //text colour
    textSize(min(b.w, b.h) * 0.33); //scale text with button size
    text(b.label, b.x, b.y, b.w, b.h); //write button labels
  }
}

function emotionMousePressed() { //for mouse clicks wehn on emotion page
  for (let i = 0; i < buttons.length; i++) {//loop through buttons array
    let b = buttons[i];

    if (mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h) { //if clicked within a button boundary
        
      if (b.label === "Continue") {
        calculateVisualConfig(); 
        fft.setInput(song);
        state = "visualiser"; //if continue button clicked, go to next page
      }

      //keeps track of selected emotions
      if (b.label !== "Continue") { //if the button clicked is not labled continue

        if (emotionSelection.includes(b.label)) { //if button lable is already in the selected emotions array
          let i = emotionSelection.indexOf(b.label);//find it
          emotionSelection.splice(i, 1); //remove it
          console.log(b.label + " deselected")
          console.log("Selected emotions are: "+ emotionSelection);
        } 

        else {
          emotionSelection.push(b.label); //add it
          console.log(b.label + " selected")
          console.log("Selected emotions are: "+ emotionSelection);
        }
      }
    }
  }
}
//EMOTION PAGE END ________________________________________________________________________________________________________________________________________

//VISUALISER PAGE START ________________________________________________________________________________________________________________________________________
function calculateVisualConfig() {//read the emotions selected and calculate the visuals accordingly

  visualConfig = { //stores the visualiser configuration data
    colours: {},
    shape: {},
    smoothness: 0
  };

  for (let i=0; i< emotionSelection.length; i++) { //loop through selected enotions 

    let emotion = emotionSelection[i]; //current emotion
    
    let taxonomy = emotionTaxonomy[emotion]; //the stored visual attributes of each emotion

    if (taxonomy) { //if selection exists

      for (let c in taxonomy.colours) { //for every colour in the emotion

        if (!visualConfig.colours[c]){ //if not already in visual config
          visualConfig.colours[c] = 0; //create colour in visual config
        }

        visualConfig.colours[c] += taxonomy.colours[c]; //add it's value/weight
        //creates running total, so popular colours occur more often
      }

      for (let s in taxonomy.shape) { //same as colours but for shapes

        if (!visualConfig.shape[s]){
          visualConfig.shape[s] = 0;
        }

        visualConfig.shape[s] += taxonomy.shape[s];
      }

      visualConfig.smoothness += taxonomy.smoothness //smoothness is already just a number
    }
  }

  console.log("Visual Configuration Assembled");
  console.log(visualConfig);

  //console.log("Smoothness pre calc: ", visualConfig.smoothness);
  //console.log("Smoothing pre calc: ", smoothing);


  if (visualConfig.smoothness>3){ //smoothness sets resolution of waveforms
    resolution = 16; //lower resolution (fewer data points across the line) gives smoother visual effect
    console.log("Smoothness = "+ resolution);
  }
  if (visualConfig.smoothness===3){
    resolution = 32;
    console.log("Smoothness = "+ resolution);
  }
  if (visualConfig.smoothness===2){
    resolution = 64;
    console.log("Smoothness = "+ resolution);
  }
  if (visualConfig.smoothness===1){
    resolution = 128;
    console.log("Smoothness = "+ resolution);
  }
  if (visualConfig.smoothness<1){
    resolution = 256;
    console.log("Smoothness = "+ resolution);
  }
  
  circleAmount = visualConfig.shape.Circle || 0; //shape values from visual config = shape quantity in visualiser
  squareAmount = visualConfig.shape.Square || 0; 
  triangleAmount = visualConfig.shape.Triangle || 0; //or 0 if none of that shape are in visual config

  //console.log("Square amount: "+squareAmount);
  //console.log("Circle amount: "+circleAmount);
  //console.log("Triangle amount: "+triangleAmount);

  calculateColourCollection(); //converts weighted colours from visual config into usable colour collection
  pickAColour(); //randomly selects colour from collection

  fft.setInput(song);
  bigBars.setInput(song);

  circleWaveColours = []; //clears old colours from arrays if recalculation triggered
  squareColours = [];
  triangleColours = [];


  for (let i = 0; i < 5; i++) {
    circleWaveColours.push(pickAColour()); //genertates new colours
  }
  for (let i = 0; i < 5; i++) {
    squareColours.push(pickAColour()); //genertates new colours
  }
  for (let i=0; i<keepCircles.length; i++) { //recolours pre-existing circles
    keepCircles[i].colour = pickAColour();
  }
  for (let i = 0; i < 5; i++) {
  triangleColours.push(pickAColour()); //genertates new colours
  }
}

function calculateColourCollection(){//calculates weighted colour ratios for visuals

  colourCollection = []; //stores output

  for (let colour in visualConfig.colours) { //loop through every colour configured
    let weight = visualConfig.colours[colour]; //get weight of each colour

    for (let i = 0; i < weight; i++){//for as many times as the colour weight
      colourCollection.push(colour);//add the colour to the list (multiple times)
  }
  }

  console.log("Colour collection bellow");
  console.log(colourCollection);
}

function pickAColour(){
  return colourLibrary[random(colourCollection)]; //output a random colour from the colour collection, as defined in the colour library (in setUp)
}


function visualiserPageDraw(){//draw the visualiser page
  
  push();
  background(25);

  waveform = fft.waveform();
  spectrum = fft.analyze();

  //audio level smoothing
  let rawLevel = amplitude.getLevel();//current value
  let adjustedLevel = constrain(rawLevel*sensitivity, 0, 1);//increase sensitivity
  smoothLevel = lerp(smoothLevel, adjustedLevel, 0.2); //linear interpolation smooths transition between values
  oomfSize = map(smoothLevel,0,1,100,500);//maps output to a size

  //audio processing/smoothing for different frequency bands
  treble = fft.getEnergy("treble");
  lowMids = fft.getEnergy("lowMid");
  mids = fft.getEnergy("mid");
  highMids = fft.getEnergy("highMid");
  bass = fft.getEnergy("bass")
  smoothBass = lerp(smoothBass, bass, 0.2);
  bassSize = map(smoothBass,0, 255,100,200);
  smoothLowMids = lerp(smoothLowMids, lowMids, 0.2);
  lowMidsSize = map(smoothLowMids,0, 255,80,160);
  smoothMids = lerp(smoothMids, mids, 0.2);
  midsSize = map(smoothMids,0, 255,60,120);
  smoothHighMids = lerp(smoothHighMids, highMids, 0.2);
  highMidsSize = map(smoothHighMids,0, 255,40,80);
  smoothTreble = lerp(smoothTreble, treble, 0.2);
  trebleSize = map(smoothTreble,0, 255,20,40);


  //keeps shape quantities within specified range
  if (squareAmount<0){
    squareAmount++;
  }
  if (squareAmount>5){
    squareAmount--;
    }

  if (circleAmount<0){
    circleAmount++;
  }
  if (circleAmount>5){
    circleAmount--;
  }

  if (triangleAmount<0){
    triangleAmount++;
  }
  if (triangleAmount>5){
    triangleAmount--;
  }

  //console.log(trebleSize);

  //audio delay for visual effect
  oomfDelay.unshift(oomfSize); //add current size to beginning
  if (oomfDelay.length > 200){
    oomfDelay.pop();//limit array length
  }
  oomfDelay1 = oomfDelay[5]; //get delayed values from x frames ago
  oomfDelay2 = oomfDelay[10];

  strokeThickness = map(smoothLevel,0,1,3,22); //maps stroke thickness to amplitude
  stroke(150);

  triangleVisuals()//calls triangle visuas to display at the bottom

  if (circleAmount>4){ 
    drawBackgroundCircles(); //background circles appear only when circle quantity is maximum
    }
  if (squareAmount>4){
    draw3D(); //draws biggest square visualiser underneath circles visualiser
  }
  drawWaveformRound(); //draws cirlce waveforms
  if (squareAmount<5){
    draw3D(); //draws squares less than max level over circles
  }

  let totalAmount = squareAmount+circleAmount+triangleAmount;//total amount of shapes

  if (totalAmount<5){
    waveformStraight(); //displays the straight waveform
  }

  drawBackButton();//back button displays on top
  mediaControlls();
  

  pop();
}

function waveformStraight(){ //draws straight waveform accross the screen
  push();
  stroke(255);
  strokeWeight(2);
  noFill();

  let startEndPoints = [];

  for (let i = 0; i <= resolution; i++) { //loop for quantity of resolution points
    let x = map(i, 0, resolution, 0, windowWidth);//spread res drawing points across full screen
    let index = floor(map(i, 0, resolution, 0, waveform.length - 1));//evenly space res points across wavelength data
    let y = waveform[index] * waveR + height/2;//audio level at index, scale wave height, @ screen centre
    startEndPoints.push({ //store
      x, 
      y
    });
  }

  beginShape();
  curveVertex(startEndPoints[0].x, startEndPoints[0].y);//duplicate first point to ensure meets edge

  for (let i=0; i<startEndPoints.length; i++) {
    curveVertex(startEndPoints[i].x, startEndPoints[i].y); //draw all points
  }

  curveVertex(startEndPoints[startEndPoints.length-1].x, startEndPoints[startEndPoints.length-1].y);//duplicate last point to ensure meets edge
  endShape();
  pop();
}

function waveformRound(x,y,minR,maxR,sw, colour = color(0,180,200)){ //Creates a circle waveform
  push();
  angleMode(DEGREES);
  translate(x,y);
  stroke(colour);
  strokeWeight(sw);
  noFill();

  let smoothingArea = max(2, floor(resolution * 0.1));//smooth to blend last 10% of circle
  let resPointContainer = []; //store resolution vertex points

  for (let i = 0; i < resolution; i++) { //loop for quantity of resolution points
    let angle = map(i, 0, resolution, 0, 360); //spread points around a circle
    let index = floor(map(i, 0, resolution, 0, waveform.length - 1)); //evenly space res points across wavelength data
    let r = map(waveform[index], -1, 1, minR, maxR); //map index point to min/maxradius

    if (i > resolution - smoothingArea) {//check if near circle seam for blending
      let startR = map(waveform[0], -1, 1, minR, maxR);//calc radius at circle start
      let t = (i - (resolution - smoothingArea)) / smoothingArea; //progress across blend area
      t = t * t * (3 - 2 * t);//smoothstep the blend
      r = lerp(r, startR, t); //blend R and startR at rate of t
    }

    resPointContainer.push({
      x: r * sin(angle), //converts r and angle to xy
      y: r * cos(angle)
    });
  }

  beginShape();
  for (let i = resPointContainer.length-2; i<resPointContainer.length; i++){ //previous 2 points for curvature direction
    curveVertex(resPointContainer[i].x, resPointContainer[i].y);
  }
  for (let i=0; i < resPointContainer.length; i++){ //actual position
    curveVertex(resPointContainer[i].x, resPointContainer[i].y);
  }
  for (let i = 0; i < 2; i++){ //next two points for curvature direction
    curveVertex(resPointContainer[i].x, resPointContainer[i].y);
  }
  endShape();
  pop();
}

function drawWaveformRound(){//draws round waveforms acording to circle quantity specified in visual config
  if (circleAmount===1){
    push();
    waveformRound(windowWidth/2,windowHeight/2,oomfSize/3,oomfSize/2, strokeThickness/2, circleWaveColours[0]); //defines parameters of the round wavefrom
    pop();
  }
  if (circleAmount===2){
    push();
    waveformRound(windowWidth/3,windowHeight/2,oomfSize/3,oomfSize/2, strokeThickness/2, circleWaveColours[0]);
    pop();
    push();
    waveformRound(windowWidth/1.5,windowHeight/2,oomfSize/3,oomfSize/2, strokeThickness/2, circleWaveColours[1]);
    pop();
  }
  if (circleAmount===3){
    push();
    waveformRound(windowWidth/1.5,windowHeight/2,oomfSize/3.25,oomfSize/2.5, strokeThickness/2, circleWaveColours[0]);
    pop();
    push();
    waveformRound(windowWidth/2,windowHeight/2,oomfSize/2.75,oomfSize/1.75, strokeThickness/2, circleWaveColours[1]);
    pop();
    push();
    waveformRound(windowWidth/3,windowHeight/2,oomfSize/3.25,oomfSize/2.5, strokeThickness/2, circleWaveColours[2]);
    pop();
  }
  if (circleAmount>3){
    push();
    waveformRound(windowWidth/5,windowHeight/2,oomfSize/4,oomfSize/3.5, strokeThickness/2, circleWaveColours[0]);
    pop();
    push();
    waveformRound(windowWidth/1.5,windowHeight/2,oomfSize/3.25,oomfSize/2.5, strokeThickness/2, circleWaveColours[1]);
    pop();
    push();
    waveformRound(windowWidth/2,windowHeight/2,oomfSize/2.75,oomfSize/1.75, strokeThickness/2, circleWaveColours[2]);
    pop();
    push();
    waveformRound(windowWidth/3,windowHeight/2,oomfSize/3.25,oomfSize/2.5, strokeThickness/2, circleWaveColours[3]);
    pop();
    push();
    waveformRound(windowWidth-windowWidth/5,windowHeight/2,oomfSize/4,oomfSize/3.5, strokeThickness/2, circleWaveColours[4]);
    pop();
  }
}

function createBackgroundCircles(cq=250){//precomposes set of background circles that don't overlap
  push();
  let circleQuant = cq; //quantity of background circles
  let failsafe = 0; //prevent endless loop if can't fit all circles on canvas without overlapping
  noFill();
  strokeWeight(strokeThickness);
  
  while (keepCircles.length<circleQuant){ //keep drawing circles

    let circle ={ //object storing per-circle info
      x: random(0,windowWidth), //positions cirlces randomly on canvas
      y: random(0,windowHeight),
      r: 250/3,

      opacity: random(0,100), //set inital opacity
      opacityDirection: random([-1,1]), //set weather to cycle opacity up or down

      colour: color(255)//placeholder value so can be assigned individually
    };

    let overlapping = false;//assume first cirlce doesn't overlap

    for (let j = 0; j<keepCircles.length; j++){ //loop through current created circles
      let other = keepCircles[j]; //stores exisiting circles
      let d = dist(circle.x, circle.y, other.x, other.y); //calculate distance between circle centres
      if (d < circle.r+ other.r){ //if distance between centres is smaller than the combined radius of both cirlces
        overlapping = true; //they are overlapping
        break; //stops checking
      }
    }

    if (!overlapping){ //if not overlapping
      keepCircles.push(circle); //add the cirlce
    }

    failsafe++;//incriment failsafe

    if (failsafe > 1000){ //if over 1000 cycles of trying to fit the circles on canvas, break to prevent crash
      //console.log("Background cirlces: Only "+keepCircles.length+"/250 drawn")
      break;
    }
  }
  pop();
}

function drawBackgroundCircles(opacityCycleSpeed = 0.6, r = oomfSize / 3){ //draws from data created in createBackgroundCirlces
  push();
  strokeWeight(strokeThickness/5);
  noFill();
  
  for (let i=0;i<keepCircles.length;i++){ //for all stored bacgkround circles

    stroke(red(keepCircles[i].colour), green(keepCircles[i].colour), blue(keepCircles[i].colour),keepCircles[i].opacity); //set the cirlce colour
    
    circle(keepCircles[i].x, keepCircles[i].y, r);//draw the circle
   
    keepCircles[i].opacity+=keepCircles[i].opacityDirection*opacityCycleSpeed;//opacity fade in and out
    if(keepCircles[i].opacity<=0){ //reverse direction
      keepCircles[i].opacityDirection = 1;
      }
    if (keepCircles[i].opacity>=100){ //reverse direction
      keepCircles[i].opacityDirection = -1;
    }
    // console.log(opacityDirection);
    //console.log("opacity is running");
  }
  pop();
}

function draw3D(){ //draws squares (as 3d cubes)
  angleMode(RADIANS);
  tdc.push();
  tdc.clear(); //clears the previous frame instead of redrawing background on top
  tdc.resetMatrix();//stops transofrmations stacking
  tdc.rectMode(CENTER);
  //tdc.ambientLight(255);
  tdc.directionalLight(255,255,255,0,0,-1); //lighting to make 3D scene, depth, and surface angle visable 
  tdc.directionalLight(255,255,255,1,0,0);
  tdc.directionalLight(255,255,255,-1,0,0);
  tdc.directionalLight(255,255,255,0.5,0,-0.5);
  tdc.directionalLight(255,255,255,-0.5,0,-0.5);
  //tdc.ambientMaterial(255,0,200);
  //tdc.specularMaterial(255,0,200);

  tdc.resetMatrix();
  tangle+=0.01; //continuos rotation
  let tangleValue = map(sin(tangle), -1,1, -0.6,0.6); //smooth rotation rocking back and forth
  tdc.rotateY(tangleValue/4); //rotates whole scene
  tdc.rotateZ(tangleValue/4);

  bigBarsSpec = bigBars.analyze(); //frequency data for bar graph visualiser
  let bigBarsW = (tdc.width/2)/ bigBarsSpec.length; //calc width of each frequency bar on graph

  tdc.push();
  tdc.rotateX(tangle); //rotates cubes

  if (squareAmount<0){//stop square amount going above or bellow min max
    squareAmount++;
  }
  if (squareAmount>5){
    squareAmount--;
  }
  //console.log(squareAmount);
  if (squareAmount===1){ //if visual config square count = 1, draw one box
    tdc.push();
    tdc.translate(0,0);
    tdc.fill(squareColours[0]);
    tdc.box(oomfSize/3)
    tdc.pop();
  }
  if (squareAmount===2){ //two boxes
    tdc.push();
    tdc.translate(-tdc.width * 0.16,0);
    tdc.fill(squareColours[0]);
    tdc.box(oomfSize/3);
    tdc.pop();
    tdc.push();
    tdc.translate(tdc.width * 0.16,0);
    tdc.fill(squareColours[1]);
    tdc.box(oomfSize/3);
    tdc.pop();
  }
  if (squareAmount===3){ //three boxes
    tdc.push();
    tdc.translate(0,0);
    tdc.fill(squareColours[0]);
    tdc.box(oomfSize/3);
    tdc.pop();
    tdc.push();
    tdc.translate(-tdc.width * 0.17,0);
    tdc.fill(squareColours[1]);
    tdc.box(oomfSize/4);
    tdc.pop();
    tdc.push();
    tdc.translate(tdc.width * 0.17,0);
    tdc.fill(squareColours[2]);
    tdc.box(oomfSize/4);
    tdc.pop();
  }
  if (squareAmount===4){ //draws 5 boxes spinning oposite ways
    tdc.push();
    tdc.translate(0,0);
    tdc.fill(squareColours[0]);
    tdc.box(oomfSize/3);
    tdc.pop();
    tdc.push();
    tdc.translate(-tdc.width * 0.17,0);
    tdc.rotateX(-tangle*2);
    tdc.fill(squareColours[1]);
    tdc.box(oomfDelay1/4);
    tdc.pop();
    tdc.push();
    tdc.translate(tdc.width * 0.17,0);
    tdc.rotateX(-tangle*2);
    tdc.fill(squareColours[2]);
    tdc.box(oomfDelay1/4);
    tdc.pop();
    tdc.push();
    tdc.translate(-tdc.width * 0.32,0);
    tdc.fill(squareColours[3]);
    tdc.box(oomfDelay2/5);
    tdc.pop();
    tdc.push();
    tdc.translate(tdc.width * 0.32,0);
    tdc.fill(squareColours[4]);
    tdc.box(oomfDelay2/5);
    tdc.pop();
    //console.log("Oomf = "+oomfSize)
  }
  tdc.pop();

  if (squareAmount>4){ //bar graph frequency viusaliser

    for(let i = 0; i<bigBarsSpec.length; i++){ //loop through every frequency
  
      tdc.push();
      tdc.rotateX(tangleValue); //rotation
      tdc.fill(squareColours[0]); //colour
      
      let amp = bigBarsSpec[i]; //frequency strenght
      let bigBarsH = map(amp, 0, 256, 0, tdc.height*0.55); //map amplitude to desired bar height
      let x = map(i,0, bigBarsSpec.length,0, tdc.width/2*0.9); //position bars across x from centre

      tdc.push();
      tdc.translate(x,0,0); //spread bars out to the right
      tdc.box(bigBarsW * 0.8, bigBarsH, bigBarsW * 0.8); //draw each bar/box
      tdc.pop();

      tdc.push();
      tdc.translate(-x,0,0); //spread bars out to the left
      tdc.box(bigBarsW * 0.8, bigBarsH, bigBarsW * 0.8);//draw each bar
      tdc.pop();
      tdc.pop();
    }
  }

  tdc.pop();
  image(tdc,0,0)//draws webgl canvas onto the 2d canvas
}

function drawTri(size = 400, x = windowWidth/2, colour = color(255),rotation=-90){ //reusable equalateral triangle shape
  push();;
  //let x= windowWidth/2;
  let y= windowHeight/2; //position in vertical centre
  angleMode(DEGREES);
  noFill();
  stroke(colour);
  strokeWeight(3);

  translate(x,y); //move origin
  
  rotate(rotation);

  //equally space 3 points around 360* of a circle and connects the points to form an equalateral
  let xA = size * cos(0), yA = size * sin(0); //point A of the triangle
  let xB = size * cos(120), yB = size * sin(120); //point B of the triangle
  let xC = size * cos(240), yC = size * sin(240); //point C of the triangle
 
  triangle(xA,yA,xB,yB,xC,yC); //draw the trinalge from those points

  pop();
}

function triPulse(pulseArray, x = windowWidth/2, startSize = 100, colour=color(255), range = lowMids>220, rotation = -90){ //pulsing triangle visualiser functionality

  drawTri(startSize, x, colour, rotation); //draw equalateral
  if (range && millis()-lastPulse>pulseDelay){ //if audio in frequency range is lound enough & pulse delay has expired
    pulseArray.push({speed: 0, size: 0, colour: colour}); //new pulse
      lastPulse= millis();//delays next pulse
  }

  for (let tri of pulseArray){ //for every triangle currently plusing
    tri.speed +=1; //increase speed
    tri.size = tri.speed*tri.speed; //increase size
    drawTri(startSize+tri.size,x, tri.colour, rotation);//draw the pulse
  }

  pulseArray = pulseArray.filter(tri => tri.size <= windowWidth + windowWidth/2);//delete triangle pulses once bigger than the screen
}

function triangleVisuals(){ //draws trangle visualiser
  //console.log(highMids);
  if (triangleAmount===1){ //draw 1 triangle
    pulseDelay = 250; //set delay between pulses in millis
    //console.log("pulse delay = "+pulseDelay+"ms")
    triPulse(centreTriPulse, windowWidth/2, windowHeight/25+oomfSize/6, triangleColours[2]); //draw triangle and pulses
  }
  if (triangleAmount===2){ //draw 2 triangle
    pulseDelay = 250;
    //console.log("pulse delay = "+pulseDelay+"ms")
    triPulse(leftTriPulse, windowWidth/3, windowHeight/25+oomfSize/6, triangleColours[1], smoothLowMids>210);
    triPulse(rightTriPulse, windowWidth-windowWidth/3, windowHeight/25+oomfSize/6, triangleColours[3], smoothTreble>100);
  }
  if (triangleAmount===3){ //draw 3 triangle
    pulseDelay = 250;
    //console.log("pulse delay = "+pulseDelay+"ms")
    triPulse(leftTriPulse, windowWidth/4, windowHeight/25+oomfSize/6, triangleColours[1], smoothBass>250);
    triPulse(centreTriPulse, windowWidth/2, windowHeight/25+oomfSize/3, triangleColours[2], smoothMids>150);
    triPulse(rightTriPulse, windowWidth-windowWidth/4, windowHeight/25+oomfSize/6, triangleColours[3], smoothTreble>100);
  }
  if (triangleAmount===4){ //draw 5 triangle
    pulseDelay = 250;
    //console.log("pulse delay = "+pulseDelay+"ms")
    triPulse(farLeftTriPulse, windowWidth/5, windowHeight/25+oomfSize/24, triangleColours[0], smoothBass>250);
    triPulse(leftTriPulse, windowWidth/3, windowHeight/25+oomfSize/6, triangleColours[1], smoothLowMids>210);
    triPulse(centreTriPulse, windowWidth/2, windowHeight/25+oomfSize/3, triangleColours[2], smoothMids>150);
    triPulse(rightTriPulse, windowWidth-windowWidth/3, windowHeight/25+oomfSize/6, triangleColours[3], smoothHighMids>125);
    triPulse(farRightTriPulse, windowWidth-windowWidth/5, windowHeight/25+oomfSize/24, triangleColours[4], smoothTreble>100);
  }
  if (triangleAmount>4){ //draw 3 triangles stacked with really low pulse delay
    pulseDelay=10;
    triPulse(centreTriPulse, windowWidth/2, windowHeight/25+oomfSize/6, triangleColours[1], smoothMids>145);
    triPulse(leftTriPulse, windowWidth/2,windowHeight/25+oomfSize/24, triangleColours[0],smoothBass>245);
    triPulse(rightTriPulse, windowWidth/2,windowHeight/25+oomfSize/3, triangleColours[2], smoothTreble>110);
  }
}

function mediaControlls(){ //play pause stop

  let pauseH = windowWidth*0.025;
  let pauseW = pauseH*0.4;
  let pauseGap = (pauseW*0.5)+pauseW;
  let x = windowWidth/40;
  let y = windowHeight/20;
  push();
  strokeWeight(pauseH*0.04);
  stroke(255);
  fill(10);

  rectMode(CENTER);

  //Stop button
  fill(200,0,50);
  rect(x+pauseH*2,y, pauseH);

  
  if (song){
    if (song.isPlaying()){
      //Pause button
      fill(0,50,200);
      rect(x,y, pauseW,pauseH);
      rect(x+pauseGap,y, pauseW,pauseH);
    }
    else{
      //Play button
      push();
      let size=pauseH;
      translate(x+size*0.12,y);
      fill(0,200,50);
      triangle(-size/3, -size/2, -size/3, size/2,size/2,0);
      pop();
    }
  }

  pop();
}

function visualiserMousePressed(){ //mouse interactions on visualiser page
  let pauseH = windowWidth*0.025;
  let pauseW = pauseH*0.4;
  //let pauseGap = (pauseW*0.5)+pauseW;
  let x = windowWidth/40;
  let y = windowHeight/20;

  if (song){
    //play pause
    if (mouseX>x-pauseW/2 && mouseX<x+pauseH-pauseW/2 && mouseY>y-pauseH/2 && mouseY<y+pauseH/2) { //if clicked within play/pause button
      if (song.isPlaying()){
        song.pause();
        console.log("Audio Paused");
      }
      else{
        song.play();
        console.log("Audio Playing");
      }
    }
    //stop
    if (mouseX>x+pauseH*1.5 && mouseX<x+pauseH*2.5 && mouseY>y-pauseH/2 && mouseY<y+pauseH/2) { //if clicked within stop button
      song.stop();
    }
  }
}
//VISUALISER PAGE END ________________________________________________________________________________________________________________________________________
