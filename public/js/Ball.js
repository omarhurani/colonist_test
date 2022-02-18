class Ball extends CircularNode{
    constructor(id, {x, y}, speed = 0.5, direction = 0, bounceAudio = null){
        super(id, {x, y}, 10, 'red', speed, direction);
        this.bounceAudio = bounceAudio;
    }

    _bounce({lowerBoundry = 0, upperBoundry = Number.MAX_VALUE}){        
        
        if(this.y <= lowerBoundry || (this.y + this.height) >= upperBoundry ){
            this.direction = -this.direction;
            this.bounceAudio?.play();
        }
        
    }

    update(time, {minX = 0, minY = 0, maxX = Number.MAX_VALUE, maxY = Number.MAX_VALUE}){
        this._bounce({lowerBoundry: minY, upperBoundry: maxY})
        super.update(time, {minX, minY, maxX, maxY});
    }


}