var config = {
    apiKey: "AIzaSyDwDVJ4DIHFWPBQYMaiARoiEFGy9Bfa3ZE",
    authDomain: "formations-7d385.firebaseapp.com",
    databaseURL: "https://formations-7d385.firebaseio.com",
    storageBucket: "formations-7d385.appspot.com",
    messagingSenderId: "666535513846"
};

var dancerCount = 0;

firebase.initializeApp(config);
var database = firebase.database();

database.ref("/").on('value', function(snapshot){
    canvas.clear();
    for (var i = 0; i < ((1024 + grid) / grid); i++) {

        canvas.add(new fabric.Line([ i * grid, 0, i * grid, 512], { stroke: '#919191', selectable: false, evented: false }));

        if(i <= 512/grid) {
            canvas.add(new fabric.Line([ 0, i * grid, 1024, i * grid], { stroke: '#919191', selectable: false, evented: false }));
        }
    }
    dancerCount = parseInt(snapshot.val().dancerCount);
    for(var i = 1; i <= dancerCount; i++){
        var temp = new fabric.Circle({
            top : snapshot.val().dancer[i].y,
            left : snapshot.val().dancer[i].x,
            radius: 16,
            fill : 'white',
            borderColor: '#91ff9e', 
            hasControls: false,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            id: i
        });
        canvas.add(temp);
    }
    $("#dancerCount").html("Dancers: " + dancerCount); 
});

var canvas = new fabric.Canvas('canvas', {
    selectionLineWidth: 2,
    selectionColor: 'rgba(0,0,0,0.3)',
    backgroundColor: 'black',
    left: 500,
    hasControls: false
    
});

var grid = 32;

// create grid

for (var i = 0; i < ((1024 + grid) / grid); i++) {
    
    canvas.add(new fabric.Line([ i * grid, 0, i * grid, 512], { stroke: '#919191', selectable: false, evented: false }));
    
    if(i <= 512/grid) {
    canvas.add(new fabric.Line([ 0, i * grid, 1024, i * grid], { stroke: '#919191', selectable: false, evented: false }));
    }
}

// function to add dancers, called by button

function addDancer() {
    
    var amount = $("#amount").val();
    for(var i = 0; i < amount; i++) {
        var id = dancerCount + i + 1;
        var temp = new fabric.Circle({
            top : 0,
            left : i*grid,
            radius: 16,
            fill : 'white',
            borderColor: '#91ff9e', 
            hasControls: false,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            id: id
        });
        database.ref("dancer/" + id).set({
            x: i*grid,
            y: 0,
        });
        canvas.add(temp);
    }
    dancerCount += parseInt(amount);
    database.ref("dancerCount").set(dancerCount);
    $("#dancerCount").html("Dancers: " + dancerCount); 
}

// events triggered

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
            database.ref("dancer/" + e.target.id).set({
                x: e.target.left,
                y: e.target.top
            });
        }
    },
    
});