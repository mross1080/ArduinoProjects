var util = require('util');
var request = require('request');
var sleep = require('sleep');



var arduino = require('duino'),
    board = new arduino.Board();

        var  yell = function() {
          turnOn(arr[XCOUNT]);
          turnOff(arr[XCOUNT]);
          XCOUNT++;
    }

var arr = [];
var previousMove = "";
var LEDS = {"Red": 4,"Yellow": 5, "Green": 8}
var newInfo = {moves:[],
                movesAreSet: false};
var gameInProcess = false;
var waitingForMove = true;

var redButton = new arduino.Button({
  board: board,
  pin: 7
});

var yellowButton = new arduino.Button({
  board: board,
  pin: 2
});

var greenButton = new arduino.Button({
  board: board,
  pin: 9
});

var Red = new arduino.Led({
  board: board,
  pin: 4
});

var Yellow = new arduino.Led({
  board: board,
  pin: 5
});

var Green = new arduino.Led({
  board: board,
  pin: 8
});

XCOUNT =0;


function turnOn (led){
  board.digitalWrite(led, board.HIGH);
  board.delay(400);
}
function turnOff (led){
  board.digitalWrite(led, board.LOW);
  board.delay(400);
}

var moves = [];
redButton.on('up', function(){
  console.log("Red Button Pushed");
  board.digitalWrite(LEDS["Red"], board.HIGH);
  board.delay(300);
  board.digitalWrite(LEDS["Red"], board.LOW)
  moves.push("Red");

});

yellowButton.on('up', function(){
  moves.push("Yellow");
  console.log("yellow button pressed")
  board.digitalWrite(LEDS["Yellow"], board.HIGH);
  board.delay(300);
  board.digitalWrite(LEDS["Yellow"], board.LOW)
 
});

greenButton.on('up', function(){
  moves.push("Green");
  console.log("Green Button Pushed");
  board.digitalWrite(LEDS["Green"], board.HIGH);
  board.delay(300);
  board.digitalWrite(LEDS["Green"], board.LOW)
  board.digitalWrite()
  count =0;



});


 var gameProcess = function(){

    if(waitingForMove){
      request("https://simonsaysserver.herokuapp.com/gameStatus",function(err,httpResponse,body){ 

        var parsedDocs = JSON.parse(body);
        var status = parsedDocs[0];
        console.log(status.currentTurn);
        if(status.currentTurn == "Player 2"){
          gameInProcess = true;
          waitingForMove = false;
        }
      
    })
    }
  if(gameInProcess && !waitingForMove){
    if(moves.length > newInfo.moves.length){
      console.log(moves);
      for(var x =0; x < (moves.length -1); x++){
        if(moves[x] != newInfo.moves[x]){
          console.log("You Lose!!!!");
          gameInProcess = false;
          request.post("https://simonsaysserver.herokuapp.com/newmove", {form:{info: "Game Over", moves: moves}},function(err,httpResponse,body){ 
              console.log(body);
            
          })
        }
      }
        if(gameInProcess){
          request.post("https://simonsaysserver.herokuapp.com/newmove", {form:{info: "Player 2", moves: moves}},function(err,httpResponse,body){ 
            console.log("anybody here?")
            if(err){
              console.log(err);
            } else{
              console.log(body);
              waitingForMove= true;
              console.log("Made move successfully");
            }
          })
        }
    }

    if(!newInfo.movesAreSet){
      console.log("Setting new moves");
      request("https://simonsaysserver.herokuapp.com/moves", function(err, response, docs){
        var parsedDocs = JSON.parse(docs);
        var oMoves = parsedDocs.Moves;
        console.log(oMoves)
        if(newInfo.moves.length != oMoves.length){
          for(var x =0; x < oMoves.length; x++){
            newInfo.moves.push(oMoves[x]);
            arr.push(LEDS[oMoves[x]]);
          }
          newInfo.movesAreSet = true;
        }
        checkIt = setInterval(function(){
          if(XCOUNT == 0){
              interval= setInterval(yell, 750);
          } else if(XCOUNT ==newInfo.moves.length){
            clearInterval(interval);
          }

        },750);
      })

  }
console.log(newInfo.moves);
     
   }
}

var g = setInterval(gameProcess,3000);