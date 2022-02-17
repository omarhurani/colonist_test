class Node{
    constructor(id, {x, y}, speed, direction, visible = true){
        this.id = id
        this.position = {x, y}
        this.speed = speed
        this.direction = direction
        this.visible = visible
    }

    update(time, {minX = 0, minY = 0, maxX = Number.MAX_VALUE, maxY = Number.MAX_VALUE}){
        const [speed, direction] = [this.speed, this.direction]
        const [speedX, speedY] = [speed * Math.cos(direction), speed * Math.sin(direction)]
        const [distanceX, distanceY] = [speedX * time, speedY * time]
        let [newX, newY] = [this.position.x + distanceX, this.position.y + distanceY]

        newX = clamp(newX, minX, maxX)
        newY = clamp(newY, minY, maxY)

        this.position = { x: newX , y: newY }
    }    

    get direction(){
        return this._direction
    }

    set direction(direction){
        let directionLargerThan360 = direction > Math.PI * 2
        while(directionLargerThan360){
            direction -= Math.PI * 2 // subtract 360 degress
            directionLargerThan360 = direction > Math.PI * 2
        }            

        let directionLessThan0 = direction < 0
        while(directionLessThan0){
            direction += Math.PI * 2 // Add 360 degrees
            directionLessThan0 = direction < 0
        }            

        this._direction = direction
    }

    draw(context, scale = 1){}

    collidesWith(other){
        const [sameX, sameY] = [this.position.x === other.position.x, this.position.y === other.position.y]
        const areColliding = sameX && sameY
        return areColliding
    }
}

class SizedNode extends Node{
    constructor(id, {x, y}, {width, height}, speed, direction){
        super(id, {x, y}, speed, direction)
        this.size = {width, height}
    }

    update(time, {minX = 0, minY = 0, maxX = Number.MAX_VALUE, maxY = Number.MAX_VALUE}){
        super.update(time, {minX, minY, maxX, maxY})

        const [rectangleMinX, rectangleMinY, rectangleMaxX, rectangleMaxY] = [minX, minY, maxX - this.width, maxY - this.height]

        this.x = clamp(this.x, rectangleMinX, rectangleMaxX)
        this.y = clamp(this.y, rectangleMinY, rectangleMaxY)

    }

    collidesWith(other){
        const otherIsNotSizedNode = !(other instanceof SizedNode)
        if(otherIsNotSizedNode)
            return other.collidesWith(this)            
        
        const [x, y, otherX, otherY] = [this.x, this.y, other.x, other.y]
        const [width, height, otherWidth, otherHeight] = [this.width, this.height, other.width, other.height]

        // Rectangle intersection
        const xOverlap = (x < otherX + otherWidth) && (x + width > otherX)
        const yOverlap = (y < otherY + otherHeight) && (y + height > otherY)

        return xOverlap && yOverlap
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
}

class RectangularNode extends SizedNode{
    constructor(id, {x, y}, {width, height}, color, speed, direction){
        super(id, {x, y}, {width, height}, speed, direction)
        this.color = color
    }

    collidesWith(other){
        const otherIsCircularNode = other instanceof CircularNode
        if(otherIsCircularNode)
            return other.collidesWith(this)
            
        return super.collidesWith(other)
    }

    draw(context, scale = 1){
        context.save()
        context.fillStyle = this.color
        context.fillRect(this.x*scale, this.y*scale, this.width*scale, this.height*scale)
        context.restore()
    }
}



class TextNode extends Node{
    constructor(id, {x, y}, text, font, color, align = 'center', speed = 0, direction = 0){
        super(id, {x, y}, speed, direction)

        this.text = text
        this.font = font
        this.color = color
        this.align = align
    }

    draw(context, scale = 1){
        context.save()
        let fontSize = parseInt(this.font.match(/\d+px/)[0].substring(0, this.font.length - 2))
        let scaledFontSize = Math.floor(fontSize * scale)

        context.font = this.font.replace(/\d+px/, `${scaledFontSize}px`)
        context.fillStyle = this.color
        context.textAlign = this.align
        context.textBaseLine = "middle"
        context.fillText(this.text, this.position.x*scale, this.position.y*scale)
        context.restore()
    }

    static extractFontSizeFromFont(font){
        const fontSize = font.match(/\d+px/)
        const fontSizeWithoutPx = fontSize[0].substring(0, fontSize[0].length - 2)
        const fontSizeAsNumber = parseInt(fontSizeWithoutPx)

        return fontSizeAsNumber
    }

    static replaceFontSizeInFont(font, newFontSize){
        const oldFontSize = font.match(/\d+px/)

        const newFontSizeAsString = `${newFontSize}px`
        const newFont = font.replace(oldFontSize, newFontSizeAsString)

        return newFont
    }
}

class CircularNode extends SizedNode{
    constructor(id, {x, y}, radius, color, speed, direction){
        super(id, {x, y}, {width: radius*2, height: radius*2}, speed, direction)
        this.color = color
    }

    collidesWith(other){
        if(other instanceof CircularNode){
            let [x, y] = [this.x, this.y]
            let [ox, oy] = [other.x, other.y]
            let [dx, dy] = [ox - x, oy - y]
            let distance = Math.sqrt(dx * dx + dy * dy)
            return distance < this.radius + other.radius
        }
        if(other instanceof SizedNode){
            let dx = Math.abs(this.position.x - other.position.x);
            let dy = Math.abs(this.position.y - other.position.y);

            if (dx > (other.width/2 + this.radius) || dy > (other.height/2 + this.radius))
                return false;

            if (dx <= (other.width/2) || dy <= (other.height/2))
                return true;

            dx = dx - other.width/2;
            dy = dy - other.height/2;
            return ((dx * dx + dy * dy) <= (this.radius * this.radius));
        }

    }

    get radius(){
        return this.width / 2
    }

    set radius(radius){
        this.width = radius * 2
        this.height = radius * 2
    }

    draw(context, scale = 1){
        context.save()
        context.fillStyle = this.color
        context.beginPath()
        context.arc(this.position.x*scale, this.position.y*scale, this.radius*scale, 0, Math.PI*2)
        context.fill()
        context.restore()
    }
}