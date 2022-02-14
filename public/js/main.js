app.onInit = function(){

    this.onResize()
    window.addEventListener('resize', () => this.onResize())

    this.nodes.push(new Ball(
        'ball',
        {x : this.width / 2, y : this.height / 2},     
        0.5,
    ))

    this.nodes.push(
        new Paddle(
            'left',
            {x : 50, y : this.height / 2},
        ),
        new Paddle(
            'right',
            {x : this.width - 50, y : this.height / 2},
        )        
    )

    this.players = {
        left : new Player(this.getNode('left'), { up: Keys.W, down: Keys.S }),
        right : new Player(this.getNode('right'), { up: Keys.UP, down: Keys.DOWN })
    }

    window.addEventListener('keydown', (event) => this.onKey(true, event));
    window.addEventListener('keyup', (event) => this.onKey(false, event));
    
    this.resetBall()

};

app.onUpdate = function(time){
    for(let node of this.nodes){
        node.update(time, {
            minX : 0,
            minY : 0,
            maxX : this.width,
            maxY : this.height
        });
    }

    // Ball scoring
    let ball = this.getNode('ball')
    if(ball.x == null || ball.y == null)
        return

    let touching = {
        left : ball.x <= 0,
        right : ball.x + ball.width >= this.width
    }    
    

    if(ball.speed != 0 && (touching.left || touching.right)){
        for(let side in touching){
            if(touching[side]){
                let player = this.players[side]
                if(player.score == null)
                    player.score = 0
                player.score++
            }
        }
        console.log(Object.entries(this.players).forEach(([side, player]) => console.log(`${side}: ${player.score}`)));
        this.resetBall()
    }

    let paddles = [this.getNode('left'), this.getNode('right')]
    for(let paddle of paddles){
        let newBallInfo = paddle.getBallInfoFromBounce(ball)
        ball.speed = newBallInfo.speed ?? ball.speed
        ball.direction = newBallInfo.direction ?? ball.direction
        ball.position = newBallInfo.position ?? ball.position
    }

};

app.onResize = function(){
    
    let aspectRatio = 2;
    let width, height
    if(window.innerWidth / window.innerHeight > aspectRatio){
        width = window.innerHeight * aspectRatio;
        height = window.innerHeight;
    } else{
        width = window.innerWidth;
        height = window.innerWidth / aspectRatio;
    }
    
    this.context.mozImageSmoothingEnabled = false;
    this.context.webkitImageSmoothingEnabled = false;
    this.context.msImageSmoothingEnabled = false;
    this.context.imageSmoothingEnabled = false;

    // By changing the canvas.style size, the contents of the canvas are scaled to the new size
    // This will make it such that absolute sizes become relative to the canvas.style size
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    
}

app.resetBall = async function(){
    let ball = this.getNode('ball')
    let speed = ball.speed
    ball.speed = 0

    // Wait for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 1500))
    ball.speed = speed

    ball.position = {
        x : this.width / 2,
        y : this.height / 2
    }
    ball.direction = ((Math.random() * maxAngle) - (maxAngle / 2)) + (Math.random() < 0.5 ? 0 : Math.PI)
}

app.onKey = function(pressed, event){
    if(this.players == null)
        return

    Object.values(this.players).forEach(player => {
        player.keys = { [event.code]: pressed }
    })
}