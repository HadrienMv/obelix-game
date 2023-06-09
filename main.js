// Loading main resources
backgroundImg1= new Image()
backgroundImg1.src = `./assets/backgroundimage1.jpg`
backgroundImg2= new Image()
backgroundImg2.src = `./assets/backgroundimage2.jpg`
backgroundImg3= new Image()
backgroundImg3.src = `./assets/backgroundimage3.jpg`
backgroundImg4= new Image()
backgroundImg4.src = `./assets/backgroundimage4.jpg`
backgroundImg5= new Image()
backgroundImg5.src = `./assets/backgroundimage5.jpg`
backgroundImg6= new Image()
backgroundImg6.src = `./assets/backgroundimage6.jpg`
backgroundImg7= new Image()
backgroundImg7.src = `./assets/backgroundimage7.jpg`
backgroundImg8= new Image()
backgroundImg8.src = `./assets/backgroundimage8.jpg`
backgroundImg9= new Image()
backgroundImg9.src = `./assets/backgroundimage9.jpg`
backgroundImg10= new Image()
backgroundImg10.src = `./assets/backgroundimage10.jpg`
backgroundImg11= new Image()
backgroundImg11.src = `./assets/backgroundimage11.jpg`
backgroundImgs = [backgroundImg1, backgroundImg2, backgroundImg3, backgroundImg4, backgroundImg5, backgroundImg6, backgroundImg7, backgroundImg8, backgroundImg9, backgroundImg10, backgroundImg11]
myBackgroundImg = backgroundImg1

startButtonImg = new Image()
startButtonImg.src = `./assets/startbutton.png`
gameOverButtonImg = new Image()
gameOverButtonImg.src = './assets/gameover.png'
gameOverButtonImg.id = `game-over-img`
replayButtonImg = new Image()
replayButtonImg.src = './assets/replay.png'
replayButtonImg.id = 'replay-button'
replayButtonImg.addEventListener('click',()=>{
    location.reload()
}, {once : true})

themeAudio = new Audio('./assets/themeobelix.mp3')
themeAudio.loop = true
themeAudio.volume = 0.15
playAudio = new Audio('./assets/gameobelix.mp3')
playAudio.loop = true
playAudio.volume = 0.15

killAudio1 = new Audio('./assets/audiofrappe1.mp3')
killAudio2 = new Audio('./assets/audiofrappe2.mp3')
killAudio3 = new Audio('./assets/audiofrappe3.mp3')
killAudio4 = new Audio('./assets/audiofrappe4.mp3')
let killAudios = [killAudio1, killAudio2, killAudio3, killAudio4]

gameOverAudio = new Audio('./assets/audiogameover.mp3')
reloadAudio = new Audio('./assets/gunreload.mp3')
jumpAudio = new Audio('./assets/jump.mp3')

let killCounter = 0
let globalScore = 0
let globalLevel = 1
speedDifficulty = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

// Creating the game area
const myGameArea = {    
    canvas: document.createElement('canvas'),
    set: function (img) {
        this.canvas.width = 900;
        this.canvas.height = 420;
        this.context = this.canvas.getContext('2d');
        this.context.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
        document.querySelector('div').insertBefore(this.canvas, document.querySelector('div').childNodes[0]);
        themeAudio.play()
        this.interval = setInterval(updateGameArea, 20);
    },    
    start: function () {
        themeAudio.pause()
        playAudio.play()
        spawnRomans()
        setInterval(spawnRomans, Math.random() * (3500/globalLevel - 1500/globalLevel) + 1500/globalLevel);
        setInterval(spawnRewards, Math.random() * (15000 - 10000) + 10000);
    },
    clear: function (img) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    },    
    stop: function () {
        clearInterval(this.interval);
    },
}

myGameArea.set(myBackgroundImg)

// Start Game

let startButton = document.getElementById("start-button")
startButton.addEventListener('click',()=>{
    myGameArea.start(myBackgroundImg)
    startButton.remove()
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
playerImg.src = `./assets/obelix-nav.png`
const obelix = new Component(playerImg, 20, 235, 160, 160);

// Player controls
document.addEventListener('keydown',(event)=>{
    switch (event.code) {
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
        case 'Space':
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
boulderImg.src = `./assets/boulderimg.png`
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
romanOneImg.src = `./assets/Romain1.png`
romanTwoImg = new Image()
romanTwoImg.src = `./assets/Romain2.png`
romanThreeImg = new Image()
romanThreeImg.src = `./assets/Romain3.png`
romanFourImg = new Image()
romanFourImg.src = `./assets/Romain4.png`
romanFiveImg = new Image()
romanFiveImg.src = `./assets/Romain5.png`
romanDeadImg = new Image()
romanDeadImg.src = `./assets/romaindead.png`

let myRomansLibrary = [romanOneImg, romanTwoImg, romanThreeImg, romanFourImg, romanFiveImg]
let myRomans = []

function spawnRomans() {
    const spawnedRomanImg = myRomansLibrary[Math.round(Math.random() * 4)]
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
miniBoulderImg.src = `./assets/miniboulder.png`

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
        document.querySelector('div').insertBefore(gameOverButtonImg, document.querySelector('div').childNodes[1])
        document.querySelector('div').insertBefore(replayButtonImg, document.querySelector('div').childNodes[1])
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
        myBackgroundImg = backgroundImgs[(globalLevel -1) % 11]
        playAudio.playbackRate *= 1.075
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
miniBoulderInventoryImg.src = `./assets/boulderinventory.png`
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
    myGameArea.clear(myBackgroundImg);
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