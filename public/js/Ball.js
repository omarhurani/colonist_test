class Ball extends RectangularNode{
    constructor(id, {x, y}, speed = 0.5, direction = 0,){
        super(id, {x, y}, {width: 10, height: 10}, 'red', speed, direction);
    }

    _bounce({minY = 0, maxY = Number.MAX_VALUE}){
        // If this.y is at the minY or maxY, reverse the Y direction
        if(this.y <= minY || (this.y + this.height) >= maxY ){
            this.direction = -this.direction;
        }
        
    }

    update(time, {minX = 0, minY = 0, maxX = Number.MAX_VALUE, maxY = Number.MAX_VALUE}){
        this._bounce({minY, maxY})
        super.update(time, {minX, minY, maxX, maxY});
    }


}