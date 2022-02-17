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

function extractFontSizeFromFont(font){
    const fontSize = font.match(/\d+px/)
    const fontSizeWithoutPx = fontSize[0].substring(0, fontSize[0].length - 2)
    const fontSizeAsNumber = parseInt(fontSizeWithoutPx)

    return fontSizeAsNumber
}

function replaceFontSizeInFont(font, newFontSize){
    const oldFontSize = font.match(/\d+px/)

    const newFontSizeAsString = `${newFontSize}px`
    const newFont = font.replace(oldFontSize, newFontSizeAsString)

    return newFont
}

function circleIntersectsCircle(circle1, circle2){
    
    const [x1, y1] = [circle1.x, circle1.y]
    const [x2, y2] = [circle2.x, circle2.y]
    const [distanceX, distanceY] = [x2 - x1, y2 - y1]

    // Pythagorean theorem
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

    const [radius1, radius2] = [circle1.radius, circle2.radius]
    const sumOfRadii = radius1 + radius2
    const circlesIntersecting = distance < sumOfRadii

    return circlesIntersecting
}