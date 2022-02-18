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

        const fontSize = extractFontSizeFromFont(this.font)
        const scaledFontSize = Math.floor(fontSize * scale)
        const newFont = replaceFontSizeInFont(this.font, scaledFontSize)

        const [scaledX, scaledY] = [this.position.x * scale, this.position.y * scale]

        context.font = newFont
        context.fillStyle = this.color
        context.textAlign = this.align
        context.textBaseLine = "middle"
        context.fillText(this.text, scaledX, scaledY)
        context.restore()
    }
}

class CircularNode extends SizedNode{
    constructor(id, {x, y}, radius, color, speed, direction){
        super(id, {x, y}, {width: radius*2, height: radius*2}, speed, direction)
        this.color = color
    }

    collidesWith(other){
        const otherIsCircularNode = other instanceof CircularNode
        if(otherIsCircularNode){
            const intersecting = circleIntersectsCircle({
                x: this.position.x,
                y: this.positiony,
                radius: this.radius
            }, {
                x: other.position.x,
                y: other.position.y,
                radius: other.radius
            })

            return intersecting
        }

        const otherIsSizedNode = other instanceof SizedNode
        if(otherIsSizedNode){
            const intersecting = circleIntersectsRectangle({
                x: this.position.x,
                y: this.position.y,
                radius: this.radius
            }, {
                x: other.position.x,
                y: other.position.y,
                width: other.width,
                height: other.height
            })
            
            return intersecting
        }

        return super.collidesWith(other)
    }

    get radius(){
        return this.width / 2
    }

    set radius(radius){
        const diameter = radius * 2
        this.width = diameter
        this.height = diameter
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