// var arduino = require('duino'),
//     board = new arduino.Board();
var util = require('util');
var Twit = require('twit')

var T = new Twit({
    consumer_key:         'uzeQbml7yduHIjUszvaUKg'
  , consumer_secret:      'ETFlzxypPq2JXvBTbAqMGYADBao5kW2XvSKTZjOThbw'
  , access_token:         '2307061710-zvl1iJDrUcO0ERlSNnyezniepghSE6kmjwKbU80'
  , access_token_secret:  'KlxuYIxyovWUect3ZZFDCKwu4TLbCq0RJ6sexHJYxTyet'
})

var battleship = {
  ship: ['mom','pop','sis']

}



var runProcess = function(){

T.get('users/show', { screen_name: 'ECS507Battle' },  function (err, data, response) {
  move = data.status.text;
  console.log(data.status.text);
  for( var x =0; x < battleship.ship.length; x++){
      if((move == battleship.ship[x]) && (battleship[x] != "HIT")){
        console.log("You Hit my battleship!")
        battleship.ship[x] = "Hit";
        
      }
  }
  if (battleshipSunk()){
          return;
        }

})


}

function battleshipSunk(){
  for( var x =0; x < battleship.ship.length; x++){
      if("Hit" != battleship.ship[x]){
        return false
      }
  }
    console.log("You sunk my battleship!!");
    clearInterval(runProcess);
    return true;
}


setInterval(runProcess, 3000);