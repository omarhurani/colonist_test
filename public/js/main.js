app.onInit = function(){

    this.onResize()
    window.addEventListener('resize', () => this.onResize())

    this.nodes.push(new Node(
        'red-box',
        { x : 100, y : 0 },
        { width : 100, height : 100 },
        'red',
        0.5,
        0
    ));

    this.nodes.push(new Node(
        'black-box',
        { x : 50, y : 50 },
        { width : 150, height : 150 },
        'black',
        0.25,
        Math.PI / 2
    ));
};

app.onUpdate = function(time){

    for(let node of this.nodes){
        node.update(time, {
            minX : 0,
            minY : 0,
            maxX : this.width,
            maxY : this.height
        });
    }

    let red = this.getNode('red-box')
    if(red.x + red.width >= this.width){
        red.direction = Math.PI - red.direction
    }
    if(red.x <= 0){
        red.direction = Math.PI - red.direction
    }
};

app.onResize = function(){
    {
        let aspectRatio = 2;
        let width, height
        if(window.innerWidth / window.innerHeight > aspectRatio){
            width = window.innerHeight * aspectRatio;
            height = window.innerHeight;
        } else{
            width = window.innerWidth;
            height = window.innerWidth / aspectRatio;
        }
        
        this.context.mozImageSmoothingEnabled = false;
        this.context.webkitImageSmoothingEnabled = false;
        this.context.msImageSmoothingEnabled = false;
        this.context.imageSmoothingEnabled = false;

        // By changing the canvas.style size, the contents of the canvas are scaled to the new size
        // This will make it such that absolute sizes become relative to the canvas.style size
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;

    }
}