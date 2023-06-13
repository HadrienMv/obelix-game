// Loading main resources
backgroundImg = new Image()
backgroundImg.src = `../resources/backgroundimage.jpg`

startButtonImg = new Image()
startButtonImg.src = `../resources/startbutton.png`

themeAudio = new Audio('../resources/themeobelix.mp3')
themeAudio.loop = true
themeAudio.volume = 0.4
playAudio = new Audio('../resources/gameobelix.mp3')
playAudio.loop = true
playAudio.volume = 0.4

killAudio1 = new Audio('../resources/audiofrappe1.mp3')
killAudio2 = new Audio('../resources/audiofrappe2.mp3')
killAudio3 = new Audio('../resources/audiofrappe3.mp3')
killAudio4 = new Audio('../resources/audiofrappe4.mp3')
let killAudios = [killAudio1, killAudio2, killAudio3, killAudio4]

gameOverAudio = new Audio('../resources/audiogameover.mp3')
reloadAudio = new Audio('../resources/gunreload.mp3')
jumpAudio = new Audio('../resources/jump.mp3')

let killCounter = 0
let globalScore = 0
let globalLevel = 1
speedDifficulty = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

// Creating the game area
const myGameArea = {    
    canvas: document.createElement('canvas'),
    set: function () {
        this.canvas.width = 900;
        this.canvas.height = 420;
        this.context = this.canvas.getContext('2d');
        this.context.drawImage(backgroundImg, 0, 0, this.canvas.width, this.canvas.height);
        document.querySelector('div').insertBefore(this.canvas, document.querySelector('div').childNodes[0]);
        themeAudio.play()
        this.interval = setInterval(updateGameArea, 20);
    },    
    start: function () {
        themeAudio.pause()
        playAudio.play()
        spawnRomans()
        setInterval(spawnRomans, Math.random() * (6000/globalLevel - 3000/globalLevel) + 3000/globalLevel);
        setInterval(spawnRewards, Math.random() * (12000 - 9000) + 9000);
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
    move(speed) {
        setInterval(this.x -= speed, 150)
    }
    fly() {
        setInterval(this.x += 8, 150)
    }
    moveleft() {
        this.x -= 10
    }
    moveright() {
        this.x += 10
    }
}

// Creating the player
playerImg = new Image()
playerImg.src = '../resources/obelix-nav.png' 
const obelix = new Component(playerImg, 20, 235, 160, 160);

// Player controls
document.addEventListener('keydown',(event)=>{
    switch (event.key) {
        case 'ArrowUp':
            if(obelix.y > 220) {
                jumping = setInterval(jump, 30);
                jumpAudio.play()
            }
            break;
        case 'ArrowLeft':
            obelix.moveleft()
            break;
        case 'ArrowRight':
            obelix.moveright()
            break;
        case 't':
            spawnBoulders()
            break;
    }
})

// Player actions
let jumping
let goingDown = false

function jump() {
    if(obelix.y > 40 && !goingDown){
        obelix.y -= 10;
    } 
    else{
        goingDown = true;
        obelix.y += 10;
        if(obelix.y > 225){
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
        const newBoulder = new Component(boulderImg, obelix.x + 50, obelix.y, boulderImg.width/10, boulderImg.height/10);
        bouldersFlying.push(newBoulder)
        boulderInventory -= 1
    }
}

function flyBoulders(boulders) {
    for(let y = 0; y < boulders.length; y++) {
        boulders[y].update();
        boulders[y].fly();
        if(boulders[y].x > 910) {
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
    const spawnedRomanImg = myRomansLibrary[Math.round(Math.random() * 3)]
    const newRoman = new Component (spawnedRomanImg, 800, 390-spawnedRomanImg.height/2, spawnedRomanImg.width/2, spawnedRomanImg.height/2)
    myRomans.push(newRoman)
}

function moveRomans(romans) {
    for(let y = 0; y < romans.length; y++) {
        romans[y].update();
        romans[y].move(speedDifficulty[0]);
        if(romans[y].x < -20) {
            romans.splice(y, 1)
        }
    }
}

// Creating the boulder rewards
miniBoulderImg = new Image()
miniBoulderImg.src = `../resources/miniboulder.png`

let myRewards = []

function spawnRewards() {
    const newReward = new Component (miniBoulderImg, 800, 80, miniBoulderImg.width/5 , miniBoulderImg.height/5)
    myRewards.push(newReward)
}

function moveRewards(rewards) {
    for(let y = 0; y < rewards.length; y++) {
        rewards[y].update();
        rewards[y].move(speedDifficulty[0]);
        if(rewards[y].x < -20) {
            rewards.splice(y, 1)
        }
    }
}

// Handling player collision
function checkGame() {
    const crashed = myRomans.some(function (roman) {
      return obelix.crashWith(roman);
    })
    
    if (crashed && !goingDown) {
        playAudio.pause()
        gameOverAudio.play()
        myGameArea.stop();
    }
    
    const crashedReward = myRewards.some(function (boulder) {
        return obelix.crashWith(boulder)
    })

    if(crashedReward && obelix.y<225) {
        boulderInventory += 1
        reloadAudio.play()
        myRewards.shift()
    }

    if(killCounter>4) {
        killCounter = 0
        speedDifficulty.shift()
        globalLevel += 1
        playAudio.playbackRate *= 1.05
    }
  }

// Handling kills
let smashedRoman
function smashAndScore() {
    const smashed = myRomans.some(function (roman) {
        return obelix.crashWith(roman);
    })

    if (goingDown && smashed) {
        killAudios[Math.round(Math.random() * 3)].play()
        smashedRoman = myRomans[0]
        myRomans.shift()
        myGameArea.context.drawImage(romanDeadImg, smashedRoman.x, smashedRoman.y-50)
        killCounter += 1
        globalScore += 1
    }
  }

let hitRoman
function hitAndScore() {
    const hit = bouldersFlying.some(function (boulder) {
        return boulder.crashWith(myRomans[0]);
    })

    if (hit) {
        killAudios[Math.round(Math.random() * 3)].play()
        hitRoman = myRomans[0]
        myRomans.shift()
        bouldersFlying.shift()
        myGameArea.context.drawImage(romanDeadImg, hitRoman.x, hitRoman.y-50)
        killCounter += 1
        globalScore += 1
    }
}

function updateScore() {
    document.querySelector('.score').innerHTML = globalScore*10
}

function updateLevel() {
    document.querySelector('.level').innerHTML = globalLevel
}

miniBoulderInventoryImg = new Image()
miniBoulderInventoryImg.src = '../resources/boulderinventory.png'
function showBoulderInventory() {
    let boulderOffset = 0
    let boulderInventoryImg = []
    for(let i=0; i<boulderInventory; i++) {
        boulderInInventory = new Component (miniBoulderInventoryImg, 850 - boulderOffset, 10, miniBoulderInventoryImg.width/10 , miniBoulderInventoryImg.height/10)
        boulderInventoryImg.push(boulderInInventory)
        boulderOffset += 35
    }

    for(let i=0; i<boulderInventoryImg.length; i++) {
        boulderInventoryImg[i].update()
    }
}

// Updater function
function updateGameArea() {
    myGameArea.clear();
    obelix.update();
    moveRomans(myRomans);
    moveRewards(myRewards);
    flyBoulders(bouldersFlying);
    checkGame();
    smashAndScore();
    hitAndScore();
    updateScore();
    updateLevel();
    showBoulderInventory()
}