class Player{

    static paddleSpeed = 0.25

    constructor(paddle, {up, down}, score = 0){
        this.id = `${paddle.id}_player`
        this.paddle = paddle
        this._keyCodes = {
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
            if(this._keys[key] != null && keys[key] != null)
                this._keys[key] = keys[key]
        }

        let [speed, direction] = [0, 0]
        let [up, down] = [this.keys[this._keyCodes.up], this.keys[this._keyCodes.down]]
        
        if(up){
            direction -= Math.PI / 2
        }

        if(down){
            direction += Math.PI / 2
        }

        // XOR; if player is only pressing one key
        if(up ^ down)
            speed = Player.paddleSpeed

        this.paddle.speed = speed
        this.paddle.direction = direction
        
    }
    
}