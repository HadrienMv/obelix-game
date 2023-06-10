// Creating the game area
backgroundImg = new Image()
backgroundImg.src = `../resources/backgroundimage.jpg`

startButtonImg = new Image()
startButtonImg.src = `../resources/startbutton.png`

const myGameArea = {    
    canvas: document.createElement('canvas'),
    set: function () {
      this.canvas.width = 900;
      this.canvas.height = 420;
      this.context = this.canvas.getContext('2d');
      this.context.drawImage(backgroundImg, 0, 0, this.canvas.width, this.canvas.height);
      document.querySelector('div').insertBefore(this.canvas, document.querySelector('div').childNodes[0]);
      this.interval = setInterval(updateGameArea, 20);
    },    
    start: function () {
        spawnRomans()
        setInterval(spawnRomans, Math.random() * (6000 - 3000) + 3000);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.drawImage(backgroundImg, 0, 0, this.canvas.width, this.canvas.height);
    },    
    stop: function () {
        clearInterval(this.interval);
    },
}

myGameArea.set()

// Start Game
let gameStarted = false
document.addEventListener('keydown',()=>{
    myGameArea.start()
}, {once : true})

// Creating the object component 
class Component {
    constructor(shape, x, y, width, height) {
        this.shape = shape;
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    } 
    update() {
        const ctx = myGameArea.context;
        ctx.drawImage(this.shape, this.x, this.y, this.width, this.height);
    }
    crashWith(roman) {
        return !(this.x + this.width < roman.x + 50 || this.y + this.height < roman.y + 20 );
    }
    move() {
        setInterval(this.x -= 2, 150)
    }
    fly() {
        setInterval(this.x += 4, 150)
    }
}

// Creating the player
playerImg = new Image()
playerImg.src = '../resources/obelix-nav.png' 
const obelix = new Component(playerImg, 20, 235, 160, 160);

// Player controls
document.addEventListener('keydown',(event)=>{
    if(event.key === 'ArrowUp') {
        jumping = setInterval(jump, 30);
    }
    if(event.key === 'ArrowRight') {
        spawnBoulders()
    }
})

// Player actions
let jumping
let goingDown = false

function jump() {
    if(obelix.y > 40 && !goingDown){
        obelix.y -= 10;
    } else{
        goingDown = true;
        obelix.y += 10;
        if(obelix.y > 235){
            clearInterval(jumping);
            goingDown = false;
        }
    }
}

boulderImg = new Image()
boulderImg.src = '../resources/boulderimg.png'
let boulderInventory = 3
let bouldersFlying = []

function spawnBoulders() {
    if(boulderInventory > 0) {
        const newBoulder = new Component(boulderImg, 130, 225, boulderImg.width/9, boulderImg.height/9);
        bouldersFlying.push(newBoulder)
        boulderInventory -= 1
    }
}

function flyBoulders(boulders) {
    for(let y = 0; y < boulders.length; y++) {
        boulders[y].update();
        boulders[y].fly();
        if(boulders[y].x > 950) {
            boulders.splice(y, 1)
        }
    }
}

// Creating the ennemies
romanOneImg = new Image()
romanOneImg.src = `../resources/Romain1.png`
romanTwoImg = new Image()
romanTwoImg.src = `../resources/Romain2.png`
romanThreeImg = new Image()
romanThreeImg.src = `../resources/Romain4.png`
romanFourImg = new Image()
romanFourImg.src = `../resources/Romain5.png`
romanDeadImg = new Image()
romanDeadImg.src = `../resources/romaindead.png`

let myRomansLibrary = [romanOneImg, romanTwoImg, romanThreeImg, romanFourImg]
let myRomans = []

function spawnRomans() {
    const spawnedRomanImg = myRomansLibrary[Math.round(Math.random() * 4)]
    const newRoman = new Component (spawnedRomanImg, 800, 390-spawnedRomanImg.height/2, spawnedRomanImg.width/2, spawnedRomanImg.height/2)
    myRomans.push(newRoman)
}

function moveRomans(romans) {
    for(let y = 0; y < romans.length; y++) {
        romans[y].update();
        romans[y].move();
        if(romans[y].x < -20) {
            romans.splice(y, 1)
        }
    }
}

// Creating the boulder rewards
miniBoulderImg = new Image()
miniBoulderImg.src = `../resources/Romain1.png`

function spawnRomans() {
    const spawnedRomanImg = myRomansLibrary[Math.round(Math.random() * 4)]
    const newRoman = new Component (spawnedRomanImg, 800, 390-spawnedRomanImg.height/2, spawnedRomanImg.width/2, spawnedRomanImg.height/2)
    myRomans.push(newRoman)
}

function moveRomans(romans) {
    for(let y = 0; y < romans.length; y++) {
        romans[y].update();
        romans[y].move();
        if(romans[y].x < -20) {
            romans.splice(y, 1)
        }
    }
}

// Handling player collision
function checkGameOver() {
    const crashed = myRomans.some(function (roman) {
      return obelix.crashWith(roman);
    })
    
    if (crashed && !goingDown) {
      myGameArea.stop();
    }
  }

// Handling kills
let smashedIndex
let smashedRoman
function smashAndScore() {
    let smashed = false
    for(let i=0; i < myRomans.length; i++) {
        let checkedRoman = myRomans[i]
        if(obelix.crashWith(checkedRoman)) {
            smashed = true
            smashedIndex = i
            smashedRoman = checkedRoman
        }
    }
    if (goingDown && smashed) {
        myRomans.splice(smashedIndex, 1)
        myGameArea.context.drawImage(romanDeadImg, smashedRoman.x, smashedRoman.y-50)
    }
  }

let hitIndex
let hitRoman
let hittingBoulder
function hitAndScore() {
    let hit = false
    bouldersFlying.forEach((boulder) => {
        for(let i=0; i < myRomans.length; i++) {
            let checkedRoman = myRomans[i]
            if(boulder.crashWith(checkedRoman)) {
                hit = true
                hitIndex = i
                hitRoman = checkedRoman
                hittingBoulder = boulder
            }
        } 
        if (hit) {
            myRomans.splice(smashedIndex, 1)
            bouldersFlying.splice(hittingBoulder, 1)
            // myGameArea.context.drawImage(romanDeadImg, smashedRoman.x, smashedRoman.y-50)
        }
    })
    
  }
  

// Updater function
function updateGameArea() {
    myGameArea.clear();
    obelix.update();
    moveRomans(myRomans);
    flyBoulders(bouldersFlying);
    checkGameOver();
    smashAndScore();
    hitAndScore();
}