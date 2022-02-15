class Node{
    constructor(id, {x, y}, {width, height}, color, speed, direction){
        this.id = id
        this.position = {x, y}
        this.size = {width, height}
        this.color = color
        this.speed = speed
        this.direction = direction
    }

    update(time, {minX = 0, minY = 0, maxX = Number.MAX_VALUE, maxY = Number.MAX_VALUE}){
        let [speed, direction] = [this.speed, this.direction]
        let [sx, sy] = [speed * Math.cos(direction), speed * Math.sin(direction)]
        let [dx, dy] = [sx * time, sy * time]
        let [x, y] = [this.x + dx, this.y + dy]
        if(x <= minX)
            this.x = minX
        else if(x + this.width >= maxX)
            this.x = maxX - this.width
        else
            this.x = x

        if(y <= minY)
            this.y = minY
        else if(y + this.height >= maxY)
            this.y = maxY - this.height     
        else
            this.y = y
    }

    collidesWith(other){
        return (this.position.x < other.position.x + other.width &&
            this.position.x + this.width > other.position.x &&
            this.position.y < other.position.y + other.height &&
            this.height + this.position.y > other.position.y)
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

