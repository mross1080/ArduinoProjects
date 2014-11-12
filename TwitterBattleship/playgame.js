
var util = require('util');
var Twit = require('twit');
var arduino = require('duino'),
    board = new arduino.Board();

var T = new Twit({
    consumer_key:         'uzeQbml7yduHIjUszvaUKg'
  , consumer_secret:      'ETFlzxypPq2JXvBTbAqMGYADBao5kW2XvSKTZjOThbw'
  , access_token:         '2307061710-zvl1iJDrUcO0ERlSNnyezniepghSE6kmjwKbU80'
  , access_token_secret:  'KlxuYIxyovWUect3ZZFDCKwu4TLbCq0RJ6sexHJYxTyet'
})

userledLocations = [2,3,4,5,6,7];
computerLedLocations = [1,8,9,10,11,12];
var previousMove = "";

var piezo = new arduino.Piezo({
  board: board,
  pin: 13
});

var userBattleShip = {
  ship: [],
  gamedone: true
}

var computerBattleShip = {
  ship: [],
  gamedone: true,
  waitingForMove: true
}



  var runProcess = setInterval(function(){

    T.get('users/show', { screen_name: 'ECS507Battle' },  function (err, data, response) {
      console.log("Waiting for new game to start");
      move = data.status.text;
      console.log(userBattleShip.gamedone);
      console.log(move);
      console.log(data.status.text.split(" "));
      var str = data.status.text.split(" ");
      console.log(computerBattleShip.ship);


      if(str[0] == "NEW" && isGameOver()){
        computerBattleShip.ship = generateRandomLocations();
        userBattleShip.ship.push(str[4]);
        userBattleShip.ship.push(str[5]);
        userBattleShip.ship.push(str[6]);
        setupNewGame(userBattleShip.ship);
        readyBoard(computerLedLocations);
        console.log(userBattleShip.ship);
        userBattleShip.gamedone = false;
        computerBattleShip.gamedone = false;

      }
     
      if(!isGameOver()){
        console.log("Playing Game")
        if (move != previousMove) {
        for( var x =0; x < computerBattleShip.ship.length; x++){
            if((str[0] == computerBattleShip.ship[x]) && (computerBattleShip.ship[x] != "HIT")){
              console.log("You the computer battleship!")
              piezo.tone(1915, 2000);
              board.digitalWrite(computerBattleShip.ship[x], board.LOW);
              piezo.tone(1915, 2000);
              computerBattleShip.ship[x] = "Hit";
            }
            computerBattleShip.waitingForMove = false;
        }
        previousMove = move;
        computerBattleShip.waitingForMove= false;
      }

        if (battleshipSunk(computerBattleShip.ship)){
              piezo.tone(1915, 2000);
              readyBoard(computerLedLocations);
              board.delay(2000);
              readyBoard(computerLedLocations);
              board.delay(2000);
            computerBattleShip.gamedone = true;
            clearBoard();
        }
        var computerMove = generateMove();
        if(!computerBattleShip.waitingForMove){
          console.log("Computer launching hit to" + computerMove);
        for( var x =0; x < userBattleShip.ship.length; x++){
            if((computerMove == userBattleShip.ship[x]) && (userBattleShip.ship[x] != "HIT")){
              console.log("You Hit the user battleship!")
              piezo.tone(1915, 2000);
              board.digitalWrite(userBattleShip.ship[x], board.LOW);
              piezo.tone(1915, 2000);
              userBattleShip.ship[x] = "Hit";
            }
        }
        computerBattleShip.waitingForMove = true;
       //board.delay(10000);
      }
        if (battleshipSunk(userBattleShip.ship)){
              piezo.tone(1915, 2000);
              readyBoard(userledLocations);
              board.delay(2000);
              readyBoard(userledLocations);
              board.delay(2000);
            userBattleShip.gamedone = true;
            clearBoard();
        }
        
      }
    
    })
  }, 5000);

function setupNewGame(userBanks, computerBanks){
  console.log("Setting Up New Game");
  clearBoard();
    console.log("Turning on LEDS for banks");

    for(var x =0; x < userBanks.length; x++){
      board.digitalWrite(userBanks[x], board.HIGH);
      console.log("Turning on" + userBanks[x]);
    }
    
}

function generateRandomLocations(){

  banks = [];
      location = (Math.floor(Math.random() * computerLedLocations.length-2)+1);
      console.log(location);
      for(var x =0; x < 3; x++){
      banks.push(computerLedLocations[location] + x);
    }
    return banks;
}

function battleshipSunk(banks){
  for( var x =0; x < banks.length; x++){
      if("Hit" != banks[x]){
        return false
      }
  }
    console.log("You sunk my battleship!!");
    return true;
}

function readyBoard(leds){
  //Turn off All LEDS
  for(var x =0; x < leds.length; x++){
      board.digitalWrite(leds[x], board.HIGH);
      console.log("Turning on" + leds[x]);
    }
}

function clearBoard(){
 for(var x =0; x < computerLedLocations.length; x++){
      board.digitalWrite(computerLedLocations[x], board.LOW);
      console.log("Turning on" + computerLedLocations[x]);
    }

  for(var x =0; x < userledLocations.length; x++){
      board.digitalWrite(userledLocations[x], board.LOW);
      console.log("Turning on" + userledLocations[x]);
    }
}

function generateMove(){
        return (Math.floor(Math.random() * userledLocations.length-1)+1);

}

function isGameOver(){
  if(userBattleShip.gamedone == true || computerBattleShip.gamedone == true){
    return true;
  }
  return false;

}



runProcess;

