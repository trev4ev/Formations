var canvas = new fabric.Canvas('canvas', {
    selectionLineWidth: 0,
    selectionColor: 'rgba(0,0,0,0.3)',
    backgroundColor: 'black',
    left: 500,
    hasControls: false
    
});

var grid = 32;

// create grid

for (var i = 0; i < ((1024 + grid) / grid); i++) {
    
    canvas.add(new fabric.Line([ i * grid, 0, i * grid, 512], { stroke: '#919191', selectable: false }));
    
    if(i <= 512/grid) {
    canvas.add(new fabric.Line([ 0, i * grid, 1024, i * grid], { stroke: '#919191', selectable: false }));
    }
}

function addDancer() {
    
    var amount = $("#amount").val();
    
    for(var i = 0; i < amount; i++) {
        var temp = new fabric.Circle({
            top : 0,
            left : i*grid,
            radius: 16,
            fill : 'white',
            hasControls: false,
            hasBorders: false,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true
        });

        canvas.add(temp);
    }
}

canvas.on({
    
    'object:moving': function(options) { 
        options.target.set({
            left: Math.round(options.target.left / (grid/2)) * (grid/2),
            top: Math.round(options.target.top / (grid/2)) * (grid/2)
        });
    },
    
    'selection:created': function(e) {
        canvas.getActiveGroup().set({
            hasControls: false,
            borderColor: '#91ff9e'
        });
    },
    
    'mouse:down': function(e) {
        if (e.target) {
            e.target.opacity = 0.5;
            canvas.renderAll();
        }
    },
    
    'mouse:up': function(e) {
        if (e.target) {
            e.target.opacity = 1;
            canvas.renderAll();
        }
    },
    
});