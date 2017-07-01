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
    hasControls: false,
    allowTouchScrolling: true,
    renderOnAddRemove: false
});
var isChoreographer = false;
var selected;
var width = 1025;
var height = 449;
var namesVisible = true;

canvas.selection = false;

$('<input/>').attr({ type: 'text', id: 'name', autocomplete: 'off'}).appendTo('.canvas-container');

// create grid
for (var i = 0; i < ((1024 + grid) / grid); i++) {

    canvas.add(new fabric.Line([ i * grid, 0, i * grid, 448], { stroke: '#4b4b4b', selectable: false, evented: false }));

    if(i <= 448/grid) {
    canvas.add(new fabric.Line([ 0, i * grid, 1024, i * grid], { stroke: '#4b4b4b', selectable: false, evented: false }));
    }
}

canvas.add(new fabric.Line([ 0, 7 * grid, 1024, 7 * grid], { stroke: '#005cba', selectable: false, evented: false }));
canvas.add(new fabric.Line([ 16 * grid, 0, 16 * grid, 448], { stroke: '#005cba', selectable: false, evented: false }));

firebase.initializeApp(config);

var database = firebase.database();

firebase.auth().signOut().then(function() {
}).catch(function(error) {
});

window.onkeyup = function(e) {
    var code = e.which || e.keyCode || 0;
    if(isChoreographer && selected == null){        
        if(code == 8 || code == 46){
            var activeObject = canvas.getActiveObject();
            if(activeObject != null) {
                database.ref("/" + id + "/" + currentFormation + "/").off();
                var removedID = activeObject.id;
                dancers[removedID] = dancers[dancerCount];   
                dancers[removedID].item(1).setText(removedID+"");
                dancers[removedID].id = removedID;
                dancerCount--;
                var removedDancer = dancerCount + 1;
                for(var j = 1; j <= maxFormation; j++) {
                    replaceDancer(j, removedID, removedDancer);
                    
                }
     
                database.ref("/" + id + "/dancerCount").set(dancerCount);
                dancers[dancerCount+1] = null;
                $("#dancerCount").html("Dancers: " + dancerCount);
                canvas.remove(activeObject);
                canvas.renderAll();
                database.ref("/" + id + "/" + currentFormation + "/").on('value', drawDancers);
            }
        }
    }
    if(code == 37){
        previousFormation();
    }
    else if(code == 39){
        nextFormation();
    }
}

function updateNamesVisible(checkbox) {
    namesVisible = checkbox.checked;
    for(var i = 1; i <= dancerCount; i++) {
        dancers[i].item(2).visible = checkbox.checked;
        dancers[i].addWithUpdate();
    }
    canvas.renderAll();
}

function replaceDancer(j, removedID, removedDancer){
    database.ref("/" + id + "/" + j + "/" + removedDancer).once('value', function(snapshot){
        database.ref("/" + id + "/" + j + "/" + removedID).set({
            x: snapshot.val().x,
            y: snapshot.val().y,
            name: snapshot.val().name
        });
        database.ref("/" + id + "/" + j + "/" + removedDancer).remove(); 
    });  
}

function loadFormation(x) {
    isChoreographer = x;
    id = $("#id").val();
    var email = $("#email").val();
    var password = $("#password").val();
    
    if(id == "") {
        alert("Please enter an ID");
        return;
    }
    
    if(isChoreographer) {
        if(email == "" || password == ""){
            alert("Please enter email and password");
            return;
        }
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
            database.ref("/"+id+"/").once('value', function(snapshot){
                if(snapshot.val()==null){
                    alert("Not a valid formation ID");
                }
                else{
                    $("#first").css("display","none");
                    $("#second").css("display","inherit");
                    maxFormation = parseInt(snapshot.val().maxFormation);
                    dancerCount = parseInt(snapshot.val().dancerCount);
                    canvas.allowTouchScrolling = false;
                    pullDancers(1);
                    drawCanvas(id);
                }
            })
        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
            return;
        });
    }
    if(!isChoreographer){
        database.ref("/"+id+"/").once('value', function(snapshot){
            if(snapshot.val()==null){
                alert("Not a valid formation ID");
            }
            else{
                $("#first").css("display","none");
                $("#second").css("display","inherit");
                if(!isChoreographer){
                    $("#choreographer").css("display","none");
                    $("#deleteFormation").css("display", "none");
                }
                maxFormation = parseInt(snapshot.val().maxFormation);
                dancerCount = parseInt(snapshot.val().dancerCount);
                pullDancers(1);
                drawCanvas(id);
            }
        });
    }
    
}

function drawCanvas(id) { 
    
    // update the canvas when a change is made
    database.ref("/" + id + "/" + currentFormation + "/").on('value', drawDancers);
    
    // events triggered
    canvas.on({

        'object:moving': function(e) { 
            e.target.set({
                left: Math.round(e.target.left / (grid/2)) * (grid/2),
                top: Math.round(e.target.top / (grid/2)) * (grid/2)
            });
            if(e.target.top < 0) e.target.top = 0;
            if(e.target.left < grid/2) e.target.left = grid/2;
            if(e.target.top > height - grid - 1) e.target.top = height - grid - 1;
            if(e.target.left > width - 1 - grid/2) e.target.left = width - 1 - grid/2;
        },

        'selection:created': function(e) {
            canvas.getActiveGroup().set({
                hasControls: false,
                borderColor: '#91ff9e'
            });
        },

        'mouse:down': function(e) {
            if(selected != null) {
                var name = selected.item(2).clone();
                name.set({
                    text: $("#name").val(),
                    left: selected.getLeft(),
                    top: selected.getTop() + 32,
                    originX: 'center',
                    originY: 'top'
                });
                for(var i = 1; i <= maxFormation; i++){
                    database.ref("/" + id + "/" + i + "/" + selected.id ).update({
                        name: $("#name").val()
                    });
                }
                
                selected.remove(selected.item(2));
                selected.addWithUpdate(name);
                selected.set({
                    name: $("#name").val()
                })
                canvas.renderAll();
                selected = null;
                $("#name").val("");
            }
            $("#name").css("display","none");
            if (e.target && isChoreographer) {
                if(e.e.shiftKey){
                    addName(e.target);
                }
                else {
                    e.target.opacity = 0.5;
                    canvas.renderAll();
                }
                
            }
        },

        'mouse:up': function(e) {
            if (e.target && isChoreographer) {
                e.target.opacity = 1;
                canvas.renderAll();
                database.ref("/" + id + "/" + currentFormation + "/" + e.target.id).set({
                    x: e.target.left,
                    y: e.target.top,
                    name: e.target.name
                });
            }
        },

    });
}

function addName(target) {
    selected = target;
    var nameText = selected.item(2).text;
    $("#name").val(nameText);
    $("#name").css("display","inherit");
    $("#name").css("top", target.getTop() + 34);
    $("#name").css("left", target.getLeft() - 25);        
}

// initial pull of all dancers
function pullDancers(formation){
    database.ref("/" + id + "/"+formation+"/").once('value', drawDancers);
    
}

function drawDancers(snapshot) {
    var oldDancerCount = dancerCount;
    if(snapshot.val() != null) {
        dancerCount = Object.keys(snapshot.val()).length;
    }
    if(oldDancerCount > dancerCount){
        canvas.remove(dancers[oldDancerCount]);    
        dancers[oldDancerCount] = null;
        canvas.renderAll();
    }
    for(var i = 1; i <= dancerCount; i++){
        if(dancers[i] == null){
            var circle = new fabric.Circle({
                radius: 16,
                fill : 'rgba(255, 255, 255, 0.2)',
                stroke: 'white',
                strokeWidth: 2,
                hasControls: false,
                lockScalingX: true,
                lockScalingY: true,
                lockRotation: true,
                selectable: false,
                originX: 'center',
                originY: 'center',             
            });
            var text = new fabric.Text(i.toString(), {
                textAlign: 'center',
                originX: 'center',
                originY: 'center',
                fontSize: 14,
                fontFamily: 'sans-serif',
                hasControls: false,
                lockScalingX: true,
                lockScalingY: true,
                lockRotation: true,
                selectable: false,
                evented: false,
                fill: 'white'
            });
            var name = new fabric.Text(snapshot.val()[i].name, {
                textAlign: 'center',
                originX: 'center',
                originY: 'top',
                top: 16,
                fill: 'white',
                fontSize: 14,
                fontFamily: 'sans-serif',
                hasControls: false,
                lockScalingX: true,
                lockScalingY: true,
                lockRotation: true,
                selectable: false,
                evented: false,
                visible: namesVisible,
            });
            dancers[i] = new fabric.Group([circle, text, name], {
                top : snapshot.val()[i].y,
                left : snapshot.val()[i].x,
                selectable: isChoreographer,
                borderColor: '#ffffff', 
                hasControls: false,
                lockScalingX: true,
                lockScalingY: true,
                lockRotation: true,
                id: i,
                originX: 'center',
                name: snapshot.val()[i].name
            });
            canvas.add(dancers[i]);
        }
        else {
            dancers[i].name = snapshot.val()[i].name;
            dancers[i].item(2).setText(snapshot.val()[i].name);
            dancers[i].addWithUpdate();
            if(i == dancerCount){
                dancers[i].animate('top', snapshot.val()[i].y, {
                    duration: 700,
                    easing: fabric.util.ease['easeInOutQuad']
                });
                dancers[i].animate('left', snapshot.val()[i].x, {
                    duration: 700,
                    onChange: canvas.renderAll.bind(canvas),
                    easing: fabric.util.ease['easeInOutQuad']
                });
            }
            else {
                dancers[i].animate('top', snapshot.val()[i].y, {
                    duration: 700,
                    easing: fabric.util.ease['easeInOutQuad']
                });
                dancers[i].animate('left', snapshot.val()[i].x, {
                    duration: 700,
                    easing: fabric.util.ease['easeInOutQuad']
                });
            }
            dancers[i].setCoords();
        }
    }

    $("#dancerCount").html("Dancers: " + dancerCount);
    $("#currentFormation").html("Formation: " + currentFormation + " of " + maxFormation);
    canvas.renderAll();
}

// function to add dancers to both database and canvas, called by button
function addDancer() {
    if(!isChoreographer) return;
    var amount = $("#amount").val();
    var y = 0;
    var xOffset = 0;
    var oldDancerCount = dancerCount;
    dancerCount += parseInt(amount);
    database.ref("/" + id + "/dancerCount").set(dancerCount);
    
    for(var i = 0; i < amount; i++) {
        var t = oldDancerCount + i + 1;
        var circle = new fabric.Circle({
            radius: 16,
            fill : 'rgba(255, 255, 255, 0.2)',
            stroke: 'white',
            strokeWidth: 2,
            hasControls: false,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            selectable: false,
            originX: 'center',
            originY: 'center',             
        });
        var text = new fabric.Text(t.toString(), {
            textAlign: 'center',
            originX: 'center',
            originY: 'center',
            fontSize: 14,
            fill: 'white',
            fontFamily: 'sans-serif',
            hasControls: false,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            selectable: false,
            evented: false,
        });
        var name = new fabric.Text("", {
            textAlign: 'center',
            originX: 'center',
            originY: 'top',
            top: 16,
            fill: 'white',
            fontSize: 14,
            fontFamily: 'sans-serif',
            hasControls: false,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            selectable: false,
            evented: false,
            visible: namesVisible,
        });
        y = grid * Math.floor((i*grid+16)/width);
        xOffset = width * (Math.floor((i*grid+16)/width));
        dancers[t] = new fabric.Group([circle, text, name], {
            top : y,
            left : i*grid + 16 - xOffset,
            borderColor: '#ffffff', 
            selectable: isChoreographer,
            hasControls: false,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            originX: 'center',
            id: t,
            name: ""
        });
        for(var j = 1; j <= maxFormation; j++){
            database.ref("/" + id + "/" + j + "/" + t ).set({
                x: i*grid + 16 - xOffset,
                y: y,
                name: ""
            });
        }
        
        canvas.add(dancers[t]);
        
    }
    canvas.renderAll();
    $("#dancerCount").html("Dancers: " + dancerCount); 
}

function nextFormation() {
    if(currentFormation == maxFormation){
        if(isChoreographer)
            addFormation();
    }
    else {
        database.ref("/" + id + "/" + currentFormation + "/").off();
        currentFormation++;
        database.ref("/" + id + "/" + currentFormation + "/").on('value', drawDancers);
        pullDancers(currentFormation);
        $("#currentFormation").html("Formation: " + currentFormation + " of " + maxFormation);
    } 
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

function deleteFormation() {
    if(maxFormation > 1){
        database.ref("/" + id + "/" + currentFormation + "/").off();
        if(currentFormation == maxFormation) {
            database.ref("/" + id + "/" + currentFormation + "/").remove();
        }
        for(var i = currentFormation; i < maxFormation; i++) {
            copyNextFormation(i);
        }
        if(currentFormation > 1) currentFormation--;
        maxFormation--;
        database.ref("/" + id + "/maxFormation/").set(maxFormation);
        database.ref("/" + id + "/" + currentFormation + "/").on('value', drawDancers);
    }
}

function copyNextFormation(i){
    var next = i+1;
    database.ref("/" + id + "/" + next + "/").once('value', function(snapshot){
        database.ref("/" + id + "/" + i + "/" ).set(snapshot.val());
        database.ref("/" + id + "/" + next + "/").remove();
    });
}