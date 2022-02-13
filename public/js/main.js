app.onInit = function(){
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