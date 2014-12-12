
var util = require('util');
var request = require('request');
var sleep = require('sleep');



var arduino = require('duino'),
    board = new arduino.Board();



var arr = [];
var previousMove = "";
//Hash that holds all LED pin locations
var LEDS = {"Red": 11,"Yellow": 8, "Green": 10, "Blue": 9}
//Info about current move
var newInfo = {moves:[],
                movesAreSet: false};
var gameInProcess = false;;
var waitingForMove = true;


//Insantiate Button Objects for each button 
var redButton = new arduino.Button({
  board: board,
  pin: 5
});

var yellowButton = new arduino.Button({
  board: board,
  pin: 2
});

var greenButton = new arduino.Button({
  board: board,
  pin: 4
});

var blueButton = new arduino.Button({
  board: board,
  pin: 3
});


XCOUNT =0;

function turnOnLargeButton(pin){
  var count =0;
  //Interval must be set in order to light up LED for a specific amount of time
  var x = setInterval(function(){
    board.digitalWrite(pin,board.HIGH);
    count++;
    if(count > 1){
      clearInterval(x);
      board.digitalWrite(pin,board.LOW);
    }
  },100)
  
  console.log("interval over")
  XCOUNT++;
}

//Hold the moves that the current player is pressing
var moves = [];
redButton.on('up', function(){
  moves.push("Red");
  console.log("Red Button Pushed");
  turnOnLargeButton(LEDS["Red"]);


});


yellowButton.on('up', function(){
  moves.push("Yellow");
  console.log("yellow button pressed")
  var count =0;
  turnOnLargeButton(LEDS["Yellow"]);

 
});

greenButton.on('up', function(){
  moves.push("Green");
  console.log("Green Button Pushed");
  turnOnLargeButton(LEDS["Green"]);


});

blueButton.on('up', function(){
  moves.push("Blue");
  console.log("Blue Button Pushed");
  turnOnLargeButton(LEDS["Blue"]);

});



 var gameProcess = function(){

  //If This player is waiting for their turn, poll the API
    if(waitingForMove){
      request("https://simonsaysserver.herokuapp.com/gameStatus",function(err,httpResponse,body){ 

        var parsedDocs = JSON.parse(body);
        var status = parsedDocs[0];
        console.log(status.currentTurn);
        //If the API says that it is now their their turn
        if(status.currentTurn == "Player 1"){
          //Begin the game, establish your turn, and set XCOUNT to 0 which will make the lights blink
          gameInProcess = true;
          waitingForMove = false;
          XCOUNT =0;
        }
      
    })
    }
    console.log(waitingForMove);
    console.log(gameInProcess);
    //Check to see if this player has set their moves
  if(gameInProcess && !waitingForMove){
    console.log("Checking moves")
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
        //Game in process will be false if the player lost
        if(gameInProcess ){
          request.post("https://simonsaysserver.herokuapp.com/newmove", {form:{info: "Player 1", moves: moves}},function(err,httpResponse,body){ 
            console.log("anybody here?")
            if(err){
              console.log(err);
            } else{
              console.log(body);
              //Reset conditions for next move
              waitingForMove= true;
              console.log("Made move successfully");
              moves = [];
              newInfo.movesAreSet = false;
              newInfo.moves = [];
              XCOUNT =0;
            }
          })
        }
    }

    //Set new moves
    if(!newInfo.movesAreSet){
      console.log("Setting new moves");
      request("https://simonsaysserver.herokuapp.com/moves", function(err, response, docs){
        var parsedDocs = JSON.parse(docs);
        var opponentMoves = parsedDocs.Moves;
        console.log(opponentMoves)

        //
        if(newInfo.moves.length != opponentMoves.length){
          for(var x =0; x < opponentMoves.length; x++){
            newInfo.moves.push(opponentMoves[x]);
            arr.push(LEDS[opponentMoves[x]]);
          }
          newInfo.movesAreSet = true;
        }
        console.log(arr);
        //Turn on LEDS
        if(newInfo.movesAreSet)
          //You need to set an interval in order for the digital write to last long enough
        checkIt = setInterval(function(){
          if(XCOUNT == 0){
              interval= setInterval(turnOnLED, 750);
          } else if(XCOUNT ==newInfo.moves.length+4){
            clearInterval(interval);

          }

        },750);
        console.log("Opponents moves are " + newInfo.moves);
      })

  }

     
   }
}

//Declare and start loop function
var loop = setInterval(gameProcess,3000);

//Function to be called in the interval for 
var  turnOnLED = function() {
  console.log("Turning on " + XCOUNT + "'d LED "  + arr[XCOUNT]);
      console.log(XCOUNT)
      turnOnLargeButton(arr[XCOUNT])

    }
