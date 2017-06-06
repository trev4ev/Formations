var config = {
    apiKey: "AIzaSyDwDVJ4DIHFWPBQYMaiARoiEFGy9Bfa3ZE",
    authDomain: "formations-7d385.firebaseapp.com",
    databaseURL: "https://formations-7d385.firebaseio.com",
    storageBucket: "formations-7d385.appspot.com",
    messagingSenderId: "666535513846"
};

var currentFormation = 1;
var id;
var maxFormation = 1;
var dancerCount = 0;
var grid = 32;
var dancers = new Array();
var canvas = new fabric.Canvas('canvas', {
    selectionLineWidth: 2,
    selectionColor: 'rgba(0,0,0,0.3)',
    backgroundColor: 'black',
    left: 500,
    hasControls: false
});

// create grid
for (var i = 0; i < ((1024 + grid) / grid); i++) {

    canvas.add(new fabric.Line([ i * grid, 0, i * grid, 448], { stroke: '#919191', selectable: false, evented: false }));

    if(i <= 448/grid) {
    canvas.add(new fabric.Line([ 0, i * grid, 1024, i * grid], { stroke: '#919191', selectable: false, evented: false }));
    }
}

firebase.initializeApp(config);

var database = firebase.database();

function loadFormation() {
    id = $("#id").val();
    if(id == "")
        return;
    database.ref("/"+id+"/").once('value', function(snapshot){
        if(snapshot.val()==null){
            alert("Not a valid formation ID");
        }
        else{
            $("#first").css("display","none");
            $("#second").css("display","inherit");
            maxFormation = parseInt(snapshot.val().maxFormation);
            dancerCount = parseInt(snapshot.val().dancerCount);
            pullDancers(1);
            drawCanvas(id);
        }
    });
    
}

function drawCanvas(id) { 
    
    // update the canvas when a change is made
    database.ref("/" + id + "/" + currentFormation + "/").on('value', drawDancers);
    
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
                database.ref("/" + id + "/" + currentFormation + "/" + e.target.id).set({
                    x: e.target.left,
                    y: e.target.top
                });
            }
        },

    });
}

// initial pull of all dancers
function pullDancers(formation){
    database.ref("/" + id + "/"+formation+"/").once('value', drawDancers);
}

function drawDancers(snapshot) {
    for(var i = 1; i <= dancerCount; i++){
        if(dancers[i] == null){
            dancers[i] = new fabric.Circle({
                top : snapshot.val()[i].y,
                left : snapshot.val()[i].x,
                radius: 16,
                fill : 'white',
                borderColor: '#91ff9e', 
                hasControls: false,
                lockScalingX: true,
                lockScalingY: true,
                lockRotation: true,
                id: i
            });
            canvas.add(dancers[i]);
        }
        else {
            dancers[i].animate('top', snapshot.val()[i].y, {
                duration: 500,
                onChange: canvas.renderAll.bind(canvas),
                easing: fabric.util.ease['easeInOutQuad']
            });
            dancers[i].animate('left', snapshot.val()[i].x, {
                duration: 500,
                onChange: canvas.renderAll.bind(canvas),
                easing: fabric.util.ease['easeInOutQuad']
            });
            dancers[i].setCoords()
        }
    }

    $("#dancerCount").html("Dancers: " + dancerCount);
    $("#currentFormation").html("Formation: " + currentFormation + " of " + maxFormation);
    canvas.renderAll();
}

// function to add dancers to both database and canvas, called by button
function addDancer() {
    
    var amount = $("#amount").val();
    for(var i = 0; i < amount; i++) {
        var t = dancerCount + i + 1;
        dancers[dancerCount + i + 1] = new fabric.Circle({
            top : 0,
            left : i*grid,
            radius: 16,
            fill : 'white',
            borderColor: '#91ff9e', 
            hasControls: false,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            id: t
        });
        for(var j = 1; j <= maxFormation; j++){
            database.ref("/" + id + "/" + j + "/" + t ).set({
                x: i*grid,
                y: 0,
            });
        }
        
        canvas.add(dancers[dancerCount + i + 1]);
        
    }
    dancerCount += parseInt(amount);
    database.ref("/" + id + "/dancerCount").set(dancerCount);
    $("#dancerCount").html("Dancers: " + dancerCount); 
}

function nextFormation() {
    if(currentFormation == maxFormation){
        addFormation();
    }
    else {
        database.ref("/" + id + "/" + currentFormation + "/").off();
        currentFormation++;
        database.ref("/" + id + "/" + currentFormation + "/").on('value', drawDancers);
        pullDancers(currentFormation);
        $("#currentFormation").html("Formation: " + currentFormation + " of " + maxFormation);
    } 
    console.log(dancers);
}

function previousFormation() {
    if(currentFormation > 1) {
        database.ref("/" + id + "/" + currentFormation + "/").off();
        currentFormation--;
        database.ref("/" + id + "/" + currentFormation + "/").on('value', drawDancers);
        pullDancers(currentFormation);
        $("#currentFormation").html("Formation: " + currentFormation + " of " + maxFormation);
    }
}

function addFormation() {
    maxFormation++;
    database.ref("/" + id + "/" + currentFormation + "/").once('value', function(snapshot){
        
        database.ref("/" + id + "/" + maxFormation + "/" ).set(snapshot.val());
    });
    currentFormation++;
    database.ref("/" + id + "/maxFormation").set(maxFormation);
    $("#currentFormation").html("Formation: " + currentFormation + " of " + maxFormation);
}
