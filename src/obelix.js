// Creating the game area
backgroundImg = new Image()
backgroundImg.src = 'https://gamesrocket.com/media/8c/00/c6/1670595381/asterix-obelix-bg.jpg'

startButtonImg = new Image()
startButtonImg.src = 'https://www.pngall.com/wp-content/uploads/9/Start-Button-Vector-PNG-Images.png'

const myGameArea = {    
    canvas: document.createElement('canvas'),
    
    set: function () {
      this.canvas.width = 900;
      this.canvas.height = 420;
      this.context = this.canvas.getContext('2d');
      this.context.drawImage(backgroundImg, 0, 0, this.canvas.width, this.canvas.height);
      document.querySelector('div').insertBefore(this.canvas, document.querySelector('div').childNodes[0]);
    },
    
    start: function () {
        this.interval = setInterval(updateGameArea, 20);
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
myGameArea.start()


// Creating the player
playerImg = new Image()
playerImg.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Asterix%26Obelix_Brussels-cropped2.png/1200px-Asterix%26Obelix_Brussels-cropped2.png"

class Player {
    constructor(shape, x, y, width, height, speedX, speedY) {
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

    jump() {
        const limit = 15;
        const jump_y = this.y;

        while(this.y > jump_y - limit) {
            setTimeout(() => {this.y -= 3}, 20);
            console.log(this.y)
        }
        while(this.y != jump_y) {
            setTimeout(() => {this.y += 3}, 20);
            console.log(this.y)
        }
    }
}

const obelix = new Player(playerImg, 20, 235, 160, 160);

// Listening to user inputs
document.addEventListener('keydown',(event)=>{
    if(event.key === 'ArrowUp') {
        obelix.jump()
    }
    updateGameArea();
})

// Creating the ennemies
romanImg = new Image()
romanImg.src = "https://i.pinimg.com/originals/77/c1/bc/77c1bc4f6a2feaf38bc3d01a9f4bfee8.gif"
myRomans = []

class Roman {
    constructor(shape, x, y, width, height, speedX, speedY) {
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

    move() {
        setInterval(this.x -= 2, 150)
    }

    // delete() {
    //     if(this.x <0) {

    //     }
    // }
}

function spawnRomans() {
    const newRoman = new Roman (romanImg, 800, 230, 180, 180)
    myRomans.push(newRoman)
}

setInterval(spawnRomans, Math.random() * (8000 - 4000) + 4000);


// Handling collisions


// Updater function
function updateGameArea() {
    myGameArea.clear();
    obelix.update();
    myRomans.forEach((ennemy) => {
        ennemy.update();
        ennemy.move();
    })
}