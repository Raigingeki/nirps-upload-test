#pragma strict

static var announcerCode:int;
var gameStart1:AudioClip;
var gameStart2:AudioClip;
var gameStart3:AudioClip;
var round1Pirates:AudioClip;
var round1Ninjas:AudioClip;
var round2Begin:AudioClip;
var round2Pirates:AudioClip;
var round2Ninjas:AudioClip;
var round3Begin:AudioClip;
var gamePirates:AudioClip;
var gameNinjas:AudioClip;
var westCapNinjas:AudioClip;
var westCapPirates:AudioClip;
var southCapNinjas:AudioClip;
var southCapPirates:AudioClip;
var eastCapNinjas:AudioClip;
var eastCapPirates:AudioClip;
var westNeutNinjas:AudioClip;
var westNeutPirates:AudioClip;
var southNeutNinjas:AudioClip;
var southNeutPirates:AudioClip;
var eastNeutNinjas:AudioClip;
var eastNeutPirates:AudioClip;

function Start () {
announcerCode=0;
}

function Update () {

//Here we check for the value of the 'announcerCode' value
//and play the appropriate clip.

//Do nothing
if (announcerCode!=0){
Debug.Log(announcerCode);
//This half of the codes concerns the one-use codes.
if (announcerCode<18){

//Game is starting
if (announcerCode==1){
audio.PlayOneShot(gameStart1);
} else
//Game is halfway to starting
if (announcerCode==2){
audio.PlayOneShot(gameStart2);
} else
//Game starts
if (announcerCode==3){
audio.PlayOneShot(gameStart3);
} else

//Round/Game End 
//Round 1
if (announcerCode==10){
audio.PlayOneShot(round1Pirates);
} else if (announcerCode==11){
audio.PlayOneShot(round1Ninjas);
} else if (announcerCode==12)
audio.PlayOneShot(round2Begin);

//Round 2
else if (announcerCode==13)
audio.PlayOneShot(round2Pirates);
else if (announcerCode==14)
audio.PlayOneShot(round2Ninjas);
else if (announcerCode==15)
audio.PlayOneShot(round3Begin);

//Round 3
else if (announcerCode==16)
audio.PlayOneShot(gamePirates);
else if (announcerCode==17)
audio.PlayOneShot(gameNinjas);

} else if (announcerCode>18){ 
//This half of the codes is exclusively for captures/neutralizations.

//West, south, then east caps.
if (announcerCode==20)
audio.PlayOneShot(westCapPirates);
else if (announcerCode==21)
audio.PlayOneShot(westCapNinjas);
else if (announcerCode==22)
audio.PlayOneShot(southCapPirates);
else if (announcerCode==23)
audio.PlayOneShot(southCapNinjas);
else if (announcerCode==24)
audio.PlayOneShot(eastCapPirates);
else if (announcerCode==25)
audio.PlayOneShot(eastCapNinjas);

//West, south, then east neutralizations.
if (announcerCode==26)
audio.PlayOneShot(westNeutPirates);
else if (announcerCode==27)
audio.PlayOneShot(westNeutNinjas);
else if (announcerCode==28)
audio.PlayOneShot(southNeutPirates);
else if (announcerCode==29)
audio.PlayOneShot(southNeutNinjas);
else if (announcerCode==30)
audio.PlayOneShot(eastNeutPirates);
else if (announcerCode==31)
audio.PlayOneShot(eastNeutNinjas);
}



announcerCode=0;
}
}