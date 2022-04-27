class Player{

    static paddleSpeed = 0.25

    constructor(paddle, {up, down}, score = 0){
        this.id = `${paddle.id}_player`
        this.paddle = paddle
        this._keyCodeDefenitions = {
            up,
            down
        }
        this._keys = {
            [up]: false,
            [down]: false
        }
        this.score = score
    }

    get keys(){
        return this._keys
    }

    set keys(keys){

        for(let key in keys){
            const keyExistsForPlayer = this._keys[key] != null
            const keyExistsInKeys = keys[key] != null
            if(keyExistsForPlayer && keyExistsInKeys){
                const keyIsPressed = keys[key]
                this._keys[key] = keyIsPressed
            }
                
        }

        let [speed, direction] = [0, 0]
        const [upKeycode, downKeycode] = [this._keyCodeDefenitions.up, this._keyCodeDefenitions.down]
        const [upPressed, downPressed] = [this.keys[upKeycode], this.keys[downKeycode]]
        
        if(upPressed){
            direction -= Math.PI / 2 // 180 degrees up
        }

        if(downPressed){
            direction += Math.PI / 2 // 180 degrees down
        }

        const onlyOneKeyPressed = upPressed ^ downPressed
        if(onlyOneKeyPressed){
            speed = Player.paddleSpeed
        }

        this.paddle.speed = speed
        this.paddle.direction = direction
        
    }
    
}