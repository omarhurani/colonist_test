class Paddle extends RectangularNode{
    constructor(id, {x, y},){
        super(id, {x, y}, { width: 10, height: 100}, 'black', 0, 0);
    }

    getBallInfoFromBounce(ball){

        const ballIsNotCircularNode = !(ball instanceof CircularNode)
        if(ballIsNotCircularNode)
            return null
        
        const notCollidingWithBall = !this.collidesWith(ball) 
        if(notCollidingWithBall)
            return null

        const yCentersOffset = ball.position.y - this.position.y

        const offsetToHeightRatio = yCentersOffset / (this.height/2)
        let bounceAngle = offsetToHeightRatio * maxAngle
        
        let newBallSpeed = ball.speed

        // This calculation assumes that that the ball is bouncing off the right of the paddle
        // If the ball is moving bouncing off the left of the paddle,
        // the speed is reversed and the actual bounce angle is the supplementary of the calculated bounce angle

        const ballIsToLeftOfPaddle = ball.position.x < this.position.x
        if(ballIsToLeftOfPaddle){
            const reversedSpeed = -newBallSpeed
            newBallSpeed = reversedSpeed

            const supplementaryBounceAngle = Math.PI - bounceAngle
            bounceAngle = supplementaryBounceAngle
        }

        const newBallDirection = bounceAngle
           
        let newBallX

        if(ballIsToLeftOfPaddle){
            const ballXPositionToTheLeftOfPaddle = this.x - ball.radius
            newBallX = ballXPositionToTheLeftOfPaddle
        }            
        else{
            const ballXPositionToTheRightOfPaddle = this.x + this.width + ball.radius
            newBallX = ballXPositionToTheRightOfPaddle
        }            


        return {
            speed: newBallSpeed,
            direction: newBallDirection,
            position: {
                x: newBallX,
                y: ball.position.y
            }
        }

    }
}