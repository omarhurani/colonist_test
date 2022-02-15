class Node{
    constructor(id, {x, y}, speed, direction, visible = true){
        this.id = id
        this.position = {x, y}
        this.speed = speed
        this.direction = direction
        this.visible = visible
    }

    update(time, {minX = 0, minY = 0, maxX = Number.MAX_VALUE, maxY = Number.MAX_VALUE}){
        let [speed, direction] = [this.speed, this.direction]
        let [sx, sy] = [speed * Math.cos(direction), speed * Math.sin(direction)]
        let [dx, dy] = [sx * time, sy * time]
        let [x, y] = [this.position.x + dx, this.position.y + dy]
        if(x <= minX)
            x = minX
        else if(x >= maxX)
            x = maxX
        
        if(y <= minY)
            y = minY
        else if(y >= maxY)
            y = maxY

        this.position = { x , y }
    }

    get direction(){
        return this._direction
    }

    set direction(direction){
        while(direction > Math.PI * 2)
            direction -= Math.PI * 2
        while(direction < 0)
            direction += Math.PI * 2

        this._direction = direction
    }

    draw(context, scale = 1){}

    collidesWith(other){
        return this.position.x == other.position.x && this.position.y == other.position.y
    }
}

class RectangularNode extends Node{
    constructor(id, {x, y}, {width, height}, color, speed, direction){
        super(id, {x, y}, speed, direction)
        this.size = {width, height}
        this.color = color
    }

    update(time, {minX = 0, minY = 0, maxX = Number.MAX_VALUE, maxY = Number.MAX_VALUE}){
        super.update(time, {minX, minY, maxX, maxY})

        if(this.x <= minX)
            this.x = minX
        else if(this.x + this.width >= maxX)
            this.x = maxX - this.width

        if(this.y <= minY)
            this.y = minY
        else if(this.y + this.height >= maxY)
            this.y = maxY - this.height     
    }

    collidesWith(other){
        if(!(other instanceof RectangularNode))
            return super.collidesWith(other)
        let [x, y] = [this.x, this.y]
        let [ox, oy] = [other.x, other.y]
        return x < ox + other.width && x + this.width > ox && y < oy + other.height && y + this.height > oy
    }

    get x(){
        return this.position.x - this.size.width / 2
    }

    get y(){
        return this.position.y - this.size.height / 2
    }

    set x(x){
        this.position.x = x + this.size.width / 2
    }

    set y(y){
        this.position.y = y + this.size.height / 2
    }

    get width(){
        return this.size.width
    }

    get height(){
        return this.size.height
    }

    get direction(){
        return this._direction
    }

    set direction(direction){
        while(direction > Math.PI * 2)
            direction -= Math.PI * 2
        while(direction < 0)
            direction += Math.PI * 2

        this._direction = direction
    }

    draw(context, scale = 1){
        context.save()
        context.fillStyle = this.color
        context.fillRect(this.x*scale, this.y*scale, this.width*scale, this.height*scale)
        context.restore()
    }
}

class TextNode extends Node{
    constructor(id, {x, y}, text, font, color, speed = 0, direction = 0){
        super(id, {x, y}, speed, direction)

        this.text = text
        this.font = font
        this.color = color
    }

    draw(context, scale = 1){
        context.save()
        context.font = this.font
        context.fillStyle = this.color
        context.textAlign = "center"
        context.fillText(this.text, this.position.x*scale, this.position.y*scale)
        context.restore()
    }
}