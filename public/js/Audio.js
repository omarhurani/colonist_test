class MyAudio extends Audio{

    static volume = 0.25

    constructor(...params){
        super(...params)
    }
    play(){
        this.volume = MyAudio.volume
        this.currentTime = 0
        super.play()
    }
}