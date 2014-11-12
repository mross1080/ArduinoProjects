

int redLightPin =  2;
int greenLightPin = 4;
int yellowLightPin=3;
const int buttonPin = 13;
int buttonState =0;
int speakerPin = 6;


// The setup() method runs once, when the sketch starts

void setup()   {                
  // initialize the digital pin as an output:
  Serial.begin(9600);
  pinMode(redLightPin, OUTPUT);    
 pinMode(yellowLightPin, OUTPUT);
pinMode(greenLightPin, OUTPUT); 
pinMode(buttonPin, INPUT);
pinMode(speakerPin, OUTPUT);
}

// the loop() method runs over and over again,
// as long as the Arduino has power

void loop()                     
{
  buttonState= digitalRead(buttonPin);
 
  trafficLightOn(redLightPin, 2500);
  if(buttonState == LOW){
    initiateCrossing();
  }
  trafficLightOff(redLightPin);                                  
  trafficLightOn(greenLightPin,2500);                  
  trafficLightOff(greenLightPin);                 
  trafficLightOn(yellowLightPin, 1500);                
  trafficLightOff(yellowLightPin); 
}

void trafficLightOn(int pin, int delayTime){
  digitalWrite(pin, HIGH);
  delay(delayTime);g
}

void trafficLightOff(int pin){
  digitalWrite(pin, LOW);
  delay(200);
}

void initiateCrossing(){
  playWarningTone();
  int x =0;
  //Turn Crosswalk Light On
  trafficLightOn(5, 5000);
  //Play warning tone 6 times to alert crosswalk ending
  while( x < 6){
    playWarningTone();
    delay(200);
    x++;
   }
  trafficLightOff(5);
    
  }

void playWarningTone(){
{

  for (long i = 0; i < 300 * 1000L; i += 1915 * 2) {
    digitalWrite(speakerPin, HIGH);
    delayMicroseconds(1915);
    digitalWrite(speakerPin, LOW);
    delayMicroseconds(1915);
  }

}
}


