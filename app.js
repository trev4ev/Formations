var canvas = new fabric.Canvas('canvas', {
    selectionLineWidth: 0,
    selectionColor: 'rgba(0,0,0,0.3)',
    backgroundColor: 'black',
    left: 500
});

canvas.setBackgroundImage('grid.jpg', canvas.renderAll.bind(canvas), {
    width: canvas.width,
    height: canvas.height,
    left: 0,
    top: 0,
    originX: 'left',
    originY: 'top'
});

canvas.add();

function add() {
    var temp = new fabric.Circle({
        top : 250-7,
        left : 500-7,
        radius: 14,
        fill : 'white'
    });

    canvas.add(temp);
}