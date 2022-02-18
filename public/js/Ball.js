class Ball extends CircularNode{
    constructor(id, {x, y}, speed = 0.5, direction = 0, bounceAudio = null){
        super(id, {x, y}, 10, 'red', speed, direction);
        this.bounceAudio = bounceAudio;
    }

    _bounce({lowerBoundry = 0, upperBoundry = Number.MAX_VALUE}){        
        
        const [minY, maxY] = [lowerBoundry, upperBoundry - this.height]
        const outsideBoundries = this.y < minY || this.y > maxY

        if(outsideBoundries){
            const reversedDirection = -this.direction
            this.direction = reversedDirection
            this.bounceAudio?.play()
        }
        
    }

    update(time, {minX = 0, minY = 0, maxX = Number.MAX_VALUE, maxY = Number.MAX_VALUE}){
        this._bounce({lowerBoundry: minY, upperBoundry: maxY})
        super.update(time, {minX, minY, maxX, maxY});
    }


}