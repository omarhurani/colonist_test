app.onInit = function(){    

    this.initializeSize()
    this.initializeSeparator()
    this.initializePlayers()
    this.initializeKeyListeners()
    this.initializeBall()
    this.initializePauseScreen()
    
    this.resetBall()

};

app.onUpdate = function(time){
    if(this.paused)
        return

    this.updateNodes(time)

    // Ball scoring
    let ball = this.getNode('ball')
    if(ball.x == null || ball.y == null)
        return

    let scoredAt = {
        right : ball.x <= 0,
        left : ball.x + ball.width >= this.width
    }    
    

    if(ball.speed != 0 && (scoredAt.left || scoredAt.right)){
        for(let side in scoredAt){
            if(scoredAt[side]){
                let player = this.players[side]
                if(player.score == null)
                    player.score = 0
                player.score++
                this.getNode(`${side}_score`).text = player.score
                this.audio.death.play()
            }
        }
        this.resetBall()
    }

    let paddles = [this.getNode('left'), this.getNode('right')]
    for(let paddle of paddles){
        let newBallInfo = paddle.getBallInfoFromBounce(ball)
        if(newBallInfo == null)
            continue
        ball.speed = newBallInfo.speed ?? ball.speed
        ball.direction = newBallInfo.direction ?? ball.direction
        ball.position = newBallInfo.position ?? ball.position
        this.audio.bounce.play()
    }

};

app.initializeSize = function(){
    this.onResize()
    window.addEventListener('resize', () => this.onResize())
}

app.initializeSeparator = function(){
    const center = {
        x : this.width / 2,
        y : this.height / 2
    }
    const size = {
        width: 2,
        height: this.height
    }
    const transparentBlack = 'rgba(0,0,0,0.25)'
    this.nodes.push(
        new RectangularNode(
            'separator',
            center,
            size,
            transparentBlack, 0, 0
        )
    )
}

app.initializePaddles = function(){
    const distanceFromLeft = 50
    const distanceFromRight = this.width - distanceFromLeft
    const centerY = this.height / 2
    const [leftPosition, rightPosition] = [
        { x : distanceFromLeft , y : centerY },
        
        { x : distanceFromRight , y : centerY }
    ]
    this.nodes.push(
        new Paddle(
            'left', 
            leftPosition,
        ),
        new Paddle(
            'right',
            rightPosition,
        )
    )
}

app.initializeScores = function(){
    const color = 'black'
    const fontSize = 54
    const font = `${fontSize}px Arial`
    const centerX = this.width / 2
    const margin = 30
    const [leftScoreX, rightScoreX] = [centerX - margin, centerX + margin]
    const scoreY = fontSize
    const [leftScorePosition, rightScorePosition] = [
        {x : leftScoreX, y : scoreY},
        {x : rightScoreX, y : scoreY}
    ]
    const startingScore = 0
    this.nodes.push(
        new TextNode('left_score', leftScorePosition, startingScore, font, color, 'right'),
        new TextNode('right_score', rightScorePosition, startingScore, font, color, 'left')
    )
}

app.initializePlayers = function(){
    this.initializePaddles()

    const [leftPaddle, rightPaddle] = [this.getNode('left'), this.getNode('right')]
    const [leftKeys, rightKeys] = [
        { up: Keys.W, down: Keys.S },
        { up: Keys.UP, down: Keys.DOWN }
    ]

    this.players = {
        left : new Player(leftPaddle, leftKeys),
        right : new Player(rightPaddle, rightKeys)
    }

    this.initializeScores()
}

app.initializeKeyListeners = function(){
    window.addEventListener('keydown', (event) => this.onKey(true, event));
    window.addEventListener('keyup', (event) => this.onKey(false, event));
}

app.initializeBall = function(){
    const center = { x : this.width / 2, y : this.height / 2 }
    const [speed, direction] = [0.5, getRandomAngle()]
    const bounceAudio = this.audio.bounce
    this.nodes.push(new Ball('ball', center, speed, direction, bounceAudio))
}

app.initializePauseScreen = function(){
    const center = { x : this.width / 2, y : this.height / 2 }
    const size = { width: this.width, height: this.height }
    const backgroundColor = 'rgba(0,0,0,0.5)'

    const text = 'PAUSED'
    const font = '72px Arial'
    const textColor = 'white'
    this.nodes.push(
        new RectangularNode('pauseScreen', center, size, backgroundColor, 0, 0,),        
        new TextNode('pauseText', center, text, font, textColor)
    )
}

app.updateNodes = function(time){
    this.nodes.forEach(node => 
        node.update(time, {
            minX : 0,
            minY : 0,
            maxX : this.width,
            maxY : this.height
        })
    )
}

app.onResize = function(){
    
    const referenceAspectRatio = 2;
    let [width, height] = [window.innerWidth, window.innerHeight];

    const aspectRatioLargerThanReference = window.innerWidth / window.innerHeight > referenceAspectRatio

    if(aspectRatioLargerThanReference){
        const scaledWidth = window.innerHeight * referenceAspectRatio
        width = scaledWidth;
    } else{
        const scaledHeight = window.innerWidth / referenceAspectRatio;
        height = scaledHeight;
    }

    this.scale = width / this.width
    this.canvas.width = width
    this.canvas.height = height
    
}

app.resetBall = async function(wait = true){
    let ball = this.getNode('ball')
    let speed = ball.speed
    ball.speed = 0

    // Wait for 1.5 seconds
    if(wait){
        await new Promise(resolve => setTimeout(resolve, 1500))
    }
    
    ball.speed = speed

    const center = {
        x : this.width / 2,
        y : this.height / 2
    }
    ball.position = center
    ball.direction = getRandomAngle()
}

app.togglePause = function(){
    this.paused = !this.paused
    const [pauseScreen, pauseText] = [this.getNode('pauseScreen'), this.getNode('pauseText')]
    pauseScreen.visible = this.paused
    pauseText.visible = this.paused
}

app.start = function(){
    if(this.paused)
        this.togglePause()
}

app.pause = function(){
    const notPaused = !this.paused
    if(notPaused)
        this.togglePause()
}

app.reset = function() {
    this.pause()
    this.resetBall(false)

    for(const id in this.players){
        const player = this.players[id]
        player.score = 0
        const playerScore = this.getNode(`${id}_score`)
        playerScore.text = 0
        const paddle = this.getNode(id)
        const x = paddle.position.x
        const yCenter = this.height / 2
        paddle.position = {
            x,
            y : yCenter,
        }
    }
}

app.onKey = function(pressed, event){

    const key = event.code

    // The event keeps firing while the key is held down
    // We only want to act on the first event when pausing/resuming
    const notHoldingKeyDown = !event.repeat

    if(key == Keys.SPACE && pressed && notHoldingKeyDown){
        this.togglePause()
        return
    }

    if(this.players == null)
        return    

    const players = Object.values(this.players)

    players.forEach(player => {
        player.keys = { [key]: pressed }
    })
}

app.paused = true
app.scale = 1
app.audio = {
    bounce: new MyAudio('audio/bounce.aac'),
    death: new MyAudio('audio/death.aac'),
}