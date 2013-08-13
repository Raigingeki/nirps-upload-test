#pragma strict

var roundNumber:int = 0;
var player1Score:int;
var player2Score:int;
var timeRemaining:double;
var isGameOver:boolean;
var bossHealthTrigger:boolean;
var debugInfo:boolean = false;
var lastToHit:Faction = Faction.Neutral;
var gameStart:boolean = false;

var GUICont : GUIController;

static var SETUP_TIME:int = 15;
static var MATCH_TIME:int = 780;

private var playedFirst:boolean = false;
private var playedSecond:boolean = false;
private var playedThird:boolean = false;
private var announcerPiratesWin:boolean = false;
private var announcerNinjasWin:boolean = false;

private var calledGameEnd:boolean = false;

function Start () {
	player1Score = 0;
	player2Score = 0;
	timeRemaining = SETUP_TIME;
	isGameOver = false;	
	bossHealthTrigger = false;
}

function Update () {
	/*if(bossHealthTrigger){
		roundEnd(roundNumber);
		if(lastToHit == Faction.Pirates){
			if (roundNumber!=3 && !calledGameEnd){
				AnnouncerManager.announcerCode=7+3*roundNumber;
				calledGameEnd = true;
			}
		} else if (lastToHit == Faction.Ninjas){
			if (roundNumber!=3 && !calledGameEnd){			
				AnnouncerManager.announcerCode=8+3*roundNumber;
				calledGameEnd = true;
			}
		}
	}*/
	
	if(gameStart && Network.isServer) {
		if(GameObject.Find("Boss") != null){
			var bossHealth:int = GameObject.Find("Boss").GetComponent(Unit).currentHealth;
		}
		if (debugInfo)
		{
			Debug.Log("Round: " + roundNumber + ", Time Remaining: " + timeRemaining);
		}
		
		//Figuring out the phase
		if(roundNumber == 0 && timeRemaining <= 0) {
			roundNumber++;
			//setBossHealthTrigger(false);
			networkView.RPC("setBossHealthTrigger",RPCMode.All,false);
			timeRemaining = MATCH_TIME;
		}
		else if (roundNumber > 0 && roundNumber < 4 && bossHealthTrigger){
			roundNumber++;
			//setBossHealthTrigger(false);
			networkView.RPC("setBossHealthTrigger",RPCMode.All,false);
			//roundEnd(roundNumber);
			//networkView.RPC("roundEnd", RPCMode.All, roundNumber);
		}		
		else if (roundNumber == 4 || timeRemaining <= 0)
			isGameOver = true;
			
		if(!isGameOver){
			timeRemaining -= Time.deltaTime;
		}
			
		//Boss Health Phases
		if ((roundNumber > 0 && roundNumber < 4) && (bossHealth <= (Class.BossMaxHp - (Class.BossMaxHp/3)*roundNumber))){
			//setBossHealthTrigger(true);
			networkView.RPC("setBossHealthTrigger",RPCMode.All,true);
			//round end points thingers
			var pointsToGet:int = 0;
			if (roundNumber == 1){
				pointsToGet+=Constants.RoundOnePointValue;
			}
			if (roundNumber == 2){
				pointsToGet+=Constants.RoundTwoPointValue;
			}
			if (roundNumber == 3){
				pointsToGet+=Constants.RoundThreePointValue;
			}
			if(lastToHit == Faction.Pirates){
				//player1Score += pointsToGet;
				//AddP1Points(pointsToGet);
				networkView.RPC("AddP1Points",RPCMode.All,pointsToGet);
				
			} else if (lastToHit == Faction.Ninjas){
				//player2Score += pointsToGet;
				//AddP2Points(pointsToGet);
				networkView.RPC("AddP2Points",RPCMode.All,pointsToGet);
			}
		}
		
		if(bossHealthTrigger){
		networkView.RPC("roundEnd",RPCMode.All, roundNumber);
		if(lastToHit == Faction.Pirates){
			if (roundNumber!=3 && !calledGameEnd){
				AnnouncerManager.announcerCode=7+3*roundNumber;
				calledGameEnd = true;
			}
		} else if (lastToHit == Faction.Ninjas){
			if (roundNumber!=3 && !calledGameEnd){			
				AnnouncerManager.announcerCode=8+3*roundNumber;
				calledGameEnd = true;
			}
		}
	}
	}
	if (timeRemaining>-1){
		//Sound Effects
		if (timeRemaining<=(SETUP_TIME-1) && !playedFirst){
			AnnouncerManager.announcerCode=1;
			playedFirst = true;
		}
		if (timeRemaining<=SETUP_TIME/2 && !playedSecond){
			AnnouncerManager.announcerCode=2;
			playedSecond = true;
		}
		if (timeRemaining<=1 && !playedThird){
			AnnouncerManager.announcerCode=3;
			playedThird = true;
		}
	}
	

	
	if(isGameOver){
			//Run Win Screens Via GUI Controller
			if((player1Score > player2Score) || ((player1Score == player2Score) && lastToHit == Faction.Pirates)){
				//Pirates Win
				GUICont.winner = "pirates";
				if(announcerPiratesWin == false)
					AnnouncerManager.announcerCode=16;				
				announcerPiratesWin = true;
			}else if ((player1Score < player2Score) || ((player1Score == player2Score) && lastToHit == Faction.Ninjas)){
				//Ninjas Win
				GUICont.winner = "ninjas";
				if(announcerNinjasWin == false)
					AnnouncerManager.announcerCode=17;
				announcerNinjasWin = true;
			} else if ((player1Score == 0) && (player2Score == 0) && lastToHit == Faction.Neutral) {
				GUICont.winner = "pirates";
				if(announcerPiratesWin == false)
					AnnouncerManager.announcerCode=16;				
				announcerPiratesWin = true;
			}
		}
		
		//check for total wipe
	if(GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).livingUnits == 0
			|| GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).livingUnits == 0){
		isGameOver = true;
	}
}

//note: this function should only be run for start-of-round-2 and start-of-round-3
@RPC
function roundEnd(newRoundNum:int){
	Debug.Log("Starting round Number "+newRoundNum);
	//reset unit positions
	var units:Unit [] = new Unit[7];
	var NSelector:TeamSelector = GameObject.Find("TeamSelector_N").GetComponent(TeamSelector);
	var PSelector:TeamSelector = GameObject.Find("TeamSelector_P").GetComponent(TeamSelector);
	var selTeam:Faction = Faction.Neutral;
	if(Network.isClient){
		Debug.Log("client - ninjas");
		units = NSelector.team;
		selTeam = Faction.Ninjas;
	} else if (Network.isServer){
		Debug.Log("client - pirates");
		units = PSelector.team;
		selTeam = Faction.Pirates;
	}
	for(var i:int = 0; i < 7; i++){
		var padName:String = "";
		if(Network.isClient){
			padName = "n";
		} else if (Network.isServer){
			padName = "p";
		}
		padName += "TeamSpawn"+(i+1);
		if (units[i] != null){
			units[i].transform.position.x = GameObject.Find(padName).transform.position.x;
			units[i].transform.position.z = GameObject.Find(padName).transform.position.z;
			//resetting local isSelected boolean - not sure if vestigial but should be reset anyways for completeness' sake
			units[i].isSelected = false;
			//health restored here
			units[i].currentHealth = units[i].GetComponent(Class).MaxHealthPoints();
			//attack script things reset here
			var atk:Attack = units[i].GetComponent(Attack);
			atk.isAttacking = false;
			atk.target = null;
			atk.attackCounter = 0;
			//move script things reset here
			var mov:Movement = units[i].GetComponent(Movement);
			mov.destination.transform.position = mov.transform.position;
			mov.isMoving = false;
			mov.destinationAttack = null;
			mov.movementTimeout = 0;
			mov.prevDistance = 0;
			mov.distance = 0;
			mov.currentRotation = 0;
		}
	}
	//empty selected squads
	if (selTeam == Faction.Pirates){
		PSelector.GetComponent(typeof(TeamSelector)).ClearSelectedUnitsList();
		PSelector.GetComponent(typeof(TeamSelector)).squad = new Unit[3];
	} else if (selTeam == Faction.Ninjas){
		NSelector.GetComponent(typeof(TeamSelector)).ClearSelectedUnitsList();
		NSelector.GetComponent(typeof(TeamSelector)).squad = new Unit[3];
	}
	//reset camera
	var camera:GameObject = GameObject.Find("CameraFocus");
	if (selTeam == Faction.Pirates){
		camera.transform.position.x = -37.97823; //whee default values magically set magically
		camera.transform.position.z = -50; //woooooooooo
	} else if (selTeam == Faction.Ninjas){
		camera.transform.position.x = 38; //this one came from the TeamController if-not-host initialization block
		camera.transform.position.z = -50; //woooooooooo
	}
	//reset Turrets
	var cpt1:Capture = GameObject.Find("cPoint1").GetComponent(Capture);
	var cpt2:Capture = GameObject.Find("cPoint2").GetComponent(Capture);
	var cpt3:Capture = GameObject.Find("cPoint3").GetComponent(Capture);
	
	cpt1.captureProgress = 0;
	cpt1.currentOwner = Faction.Neutral;
	cpt1.myFlag.renderer.material = cpt1.nirMat;
	cpt1.myLight.light.color = Color.white;
	cpt1.GetComponent(Turret).stopDoingDamages();
	cpt1.captured = false;
	cpt1.neutralized = false;
	
	cpt2.captureProgress = 0;
	cpt2.currentOwner = Faction.Neutral;
	cpt2.myFlag.renderer.material = cpt2.nirMat;
	cpt2.myLight.light.color = Color.white;
	cpt2.GetComponent(Turret).stopDoingDamages();
	cpt2.captured = false;
	cpt2.neutralized = false;
	
	cpt3.captureProgress = 0;
	cpt3.currentOwner = Faction.Neutral;
	cpt3.myFlag.renderer.material = cpt3.nirMat;
	cpt3.myLight.light.color = Color.white;
	cpt3.GetComponent(Turret).stopDoingDamages();
	cpt3.captured = false;
	cpt3.neutralized = false;
	
}

function OnSerializeNetworkView(stream:BitStream, info:NetworkMessageInfo) {
	var rN:int;
	var p1Score:int;
	var p2Score:int;
	var timeRem:float;
	var isGO:boolean;
	var bossHPTrigg:boolean;
	var last2Hit:int;
	var gStart:boolean ;
	
	if (stream.isWriting) {	
		//if(GameObject.Find("NetworkControlObject").GetComponent(NetworkController).host) {
		if(Network.isServer) {
			rN = roundNumber;
		 	p1Score = player1Score;
		 	//p2Score = player2Score;
		 	timeRem = timeRemaining;
		 	
		 	bossHPTrigg = bossHealthTrigger;
		 	if(lastToHit == Faction.Neutral)
		 		last2Hit = 0;
		 	else if (lastToHit == Faction.Pirates)
		 		last2Hit = 1;
		 	else if (lastToHit == Faction.Ninjas)
		 		last2Hit = 2;
		 	gStart = gameStart;
		 	
		 	stream.Serialize(rN);
		 	stream.Serialize(p1Score);
		 	//stream.Serialize(p2Score);
		 	stream.Serialize(timeRem);
		 	
		 	stream.Serialize(bossHPTrigg);
		 	stream.Serialize(last2Hit);
		 	stream.Serialize(gStart);
		} else if (Network.isClient) {
			p2Score = player2Score;
			stream.Serialize(p2Score);
		}
		
		isGO = isGameOver;
		stream.Serialize(isGO);
		 	
	    } else{
	    	if (Network.isClient){   
		        stream.Serialize(rN);
			 	stream.Serialize(p1Score);
			 	//stream.Serialize(p2Score);
			 	stream.Serialize(timeRem);
			 	stream.Serialize(bossHPTrigg);
			 	stream.Serialize(last2Hit);
			 	stream.Serialize(gStart);
			 	
		        
		        roundNumber = rN;
		        player1Score = p1Score;
		       // player2Score = p2Score;
		        timeRemaining = timeRem;
		        bossHealthTrigger = bossHPTrigg;
		        
		     	if (last2Hit == 0)
		     		lastToHit = Faction.Neutral;
		     	else if (last2Hit == 1)
		     		lastToHit = Faction.Pirates;
		     	else if (last2Hit == 2)
		     		lastToHit = Faction.Ninjas;
		     		
		     	gameStart = gStart;
			} else if (Network.isServer) {
				stream.Serialize(p2Score);
				
				player2Score = p2Score;
			}
			stream.Serialize(isGO);  
			isGameOver = isGO;   
	    }
}

@RPC
function AddP1Points(points:int){
	player1Score += points;
}

@RPC
function AddP2Points(points:int){
	player2Score += points;
}

@RPC
function setBossHealthTrigger(val:boolean){
	bossHealthTrigger = val;
}