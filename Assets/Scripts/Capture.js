#pragma strict
var captureProgress:double;
var captureIndicator:int;
var currentFactions:int[] = new int[2]; //currentFactions[0] = Pirates, currentFactions[1] = Ninja
var currentOwner:Faction;
var unitsOnMap:Unit[] = new Unit[6]; //all the units on the map
var myFlag : GameObject; // The Flag associated with this point
var myLight : Light; //The Light of this CP
var pirMat : Material;
var ninMat : Material;
var nirMat : Material;
var pirPart : GameObject;
var ninPart : GameObject;

var captured:boolean = false;
var neutralized:boolean = false;

static var CAPTURE_MAX = 250;

//This is pseudocody as all hell.  It needs refinement into actual Javascript,
//I just don't know how to do that at the moment.  Will be updating once I figure it out.


function Start () {
 	captureProgress = 0;
 	currentOwner = Faction.Neutral;
}

function Update () {
	if (captureProgress != CAPTURE_MAX && currentFactions[0] > 0 && currentFactions[1] == 0) {
		captureProgress+=1;
		Debug.Log("Pirates +1 (" + captureProgress + ")");
		
		//Particles ACTIVATE!
		pirPart.active = true;
		
		if(captureProgress == CAPTURE_MAX) {
			currentOwner = Faction.Pirates;
			GetComponent(Turret).startDoingDamages(currentOwner);
			Debug.Log("Pirates Got It");
			//Raise Jolly Roger
			myFlag.renderer.material = pirMat;
			myLight.light.color = Color.blue;
			//Announce Pirate Capture
			if(!captured)
				AnnouncerManager.announcerCode=18+(2*captureIndicator);
			captured = true;
			neutralized = false;
		}
		else if (captureProgress == 0 && currentOwner == Faction.Ninjas) {
			currentOwner = Faction.Neutral;
			GetComponent(Turret).stopDoingDamages();
			Debug.Log("Ninjas Lost It");
			//Raise NiRPS Flag
			myFlag.renderer.material = nirMat;
			myLight.light.color = Color.white;
			//Announce Pirate Neutralization
			if(!neutralized)
				AnnouncerManager.announcerCode=24+(2*captureIndicator);
				
			captured = false;
			neutralized = true;
		}
	}
	else if (captureProgress != -CAPTURE_MAX && currentFactions[1] > 0 && currentFactions[0] == 0) {
		captureProgress-=1;
		Debug.Log("Ninjas +1 (" + captureProgress + ")");
		
		//Particles ACTIVATE!
		ninPart.active = true;
		
		if(captureProgress == -CAPTURE_MAX) {
			currentOwner = Faction.Ninjas;
			GetComponent(Turret).startDoingDamages(currentOwner);
			Debug.Log("Ninjas Got It");
			//Raise Ninja Flag
			myFlag.renderer.material = ninMat;
			myLight.light.color = Color.red;
			//Announce Ninja Capture
			if(!captured)
				AnnouncerManager.announcerCode=19+(2*captureIndicator);
				
			captured = true;
			neutralized = false;
		}
		else if (captureProgress == 0 && currentOwner == Faction.Pirates) {
			currentOwner = Faction.Neutral;
			GetComponent(Turret).stopDoingDamages();
			Debug.Log("Pirates Lost It");
			//Raise NiRPS Flag
			myFlag.renderer.material = nirMat;
			myLight.light.color = Color.white;
			//Announce Ninja  Neutralization
			if(!neutralized)
				AnnouncerManager.announcerCode=25+(2*captureIndicator);
				
			captured = false;
			neutralized = true;
		}
	}else{
	//Particles DEActivate
	ninPart.active = false;
	pirPart.active = false;
	
	}
}

function OnTriggerEnter(otherCollider : Collider) {
    Debug.Log("Capturing n' shit");
    	
    if(otherCollider.GetComponent(Unit)!=null) {
    	Debug.Log("IS UNIT");
    	if (otherCollider.GetComponent(Unit).owner == Faction.Pirates) {
    		currentFactions[0]++;
    		Debug.Log("IS PIRAT");
    	}
    	else if (otherCollider.GetComponent(Unit).owner == Faction.Ninjas) {
    		currentFactions[1]++;
    		Debug.Log("IS NONJO");
    	}
    }   
}

function OnTriggerExit(otherCollider : Collider) {
	if (otherCollider.GetComponent(Unit).owner == Faction.Pirates) {
		currentFactions[0]--;
	}
	else if (otherCollider.GetComponent(Unit).owner == Faction.Ninjas) {
		currentFactions[1]--;
	}
}

function OnSerializeNetworkView(stream:BitStream, info:NetworkMessageInfo) {
	var capProg:float;
	var capInd:int;
	var currFact0:int; //currentFactions[0] = Pirates, currentFactions[1] = Ninja
	var currFact1:int;
	var currOwn:int;
	
	if (stream.isWriting) {	
		capProg = captureProgress;
		capInd = captureIndicator;
		currFact0 = currentFactions[0];
		currFact1 = currentFactions[1];
		
		if(currentOwner == Faction.Neutral)
			currOwn = 0;
		else if (currentOwner == Faction.Pirates)
			currOwn = 1;
		else if (currentOwner == Faction.Ninjas)
			currOwn = 2;
			
		stream.Serialize(capProg);
		stream.Serialize(capInd);
		stream.Serialize(currFact0);
		stream.Serialize(currFact1);
		stream.Serialize(currOwn);
		
	} else {
	
		stream.Serialize(capProg);
		stream.Serialize(capInd);
		stream.Serialize(currFact0);
		stream.Serialize(currFact1);
		stream.Serialize(currOwn);
		
		captureProgress = capProg;
		captureIndicator = capInd;
		currentFactions[0] = currFact0;
		currentFactions[1] = currFact1;
		
		if(currOwn == 0)
			currentOwner = Faction.Neutral;
		else if (currOwn == 1)
			currentOwner = Faction.Pirates;
		else if (currOwn == 2)
			currentOwner = Faction.Ninjas;
	
	}
}