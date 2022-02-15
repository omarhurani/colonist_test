class Paddle extends RectangularNode{
    constructor(id, {x, y},){
        super(id, {x, y}, { width: 10, height: 100}, 'black', 0, 0);
    }

    getBallInfoFromBounce(ball){

        if(!this.collidesWith(ball))
            return {}

        const offset = Math.abs(ball.position.y - this.position.y)

        let direction = offset / (this.height/2) * maxAngle * (ball.position.y > this.position.y ? 1 : -1)
        let speed = ball.speed

        if(ball.position.x < this.position.x){
            direction = -(direction + Math.PI)
            speed = -speed
        }
           
        let x

        // Clamp the ball x position to stay outside the paddle
        if(ball.position.x > this.position.x)
            x = this.position.x + this.width / 2 + ball.width / 2
        else
            x = this.position.x - this.width / 2 - ball.width / 2


        return {
            speed,
            direction,
            position: {
                x,
                y: ball.position.y
            }
        }

    }
}