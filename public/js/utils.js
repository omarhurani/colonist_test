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