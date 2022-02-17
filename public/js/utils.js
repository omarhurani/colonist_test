const maxAngle = Math.PI * 65 / 180

class Keys{
    static W = 'KeyW'
    static S = 'KeyS'

    static UP = 'ArrowUp'
    static DOWN = 'ArrowDown'

    static SPACE = 'Space'
}

function clamp(value, min, max){
    const valueLargerThanMax = value > max
    const valueSmallerThanMin = value < min
    if(valueLargerThanMax)
        return max
    else if(valueSmallerThanMin)
        return min
    else
        return value
}