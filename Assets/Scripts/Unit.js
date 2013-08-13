#pragma strict

var owner:Faction;
var currentHealth:float;
var isDead:boolean;
var timer:float; 
var unitID:int;
public var isSelected : boolean;
var decremented:boolean = false;

function Start () {
	currentHealth = GetComponent(Class).MaxHealthPoints();
	isSelected = false;
	isDead = false;
	timer = 0;
}

function Update () {
	
	//death Stuff
	//If the unit has no health and it is not in the setup phase of the game
	if(currentHealth <= 0 && !(GameObject.Find("GameControlObject").GetComponent(GameController).roundNumber == 0)) {
		GetComponent(Attack).isAttacking = false;
		GetComponent(Movement).isMoving = false;
		//Kill, giving 3 second timer for death animation
		var dieTiem : int = 3;
		
		//If we are a boss, take longer to die
		if(GetComponent(Class).classType == UnitClass.BossClass){
			dieTiem = 5;
		}
		
		if(!isDead && owner == Faction.Pirates && !decremented){
			GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).livingUnits -= 1;
			Debug.Log("Pirate Died - LIVING: " + GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).livingUnits);
			decremented = true;
		}
		if (!isDead && owner == Faction.Ninjas && !decremented){
			GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).livingUnits -= 1;
			Debug.Log("Ninja Died - LIVING: " + GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).livingUnits);
			decremented = true;
		}
		
		isDead = true;
		timer = Time.time;
		Destroy(gameObject, dieTiem);
	}
	
	//avoid overheals
	if (currentHealth > GetComponent(Class).MaxHealthPoints()){
		currentHealth = GetComponent(Class).MaxHealthPoints();
	}
	
	if(isDead) {
		 if (Time.time - timer > dieTiem) {
		 	Debug.Log("I R DED");
            Network.Destroy(gameObject);
        }
	}
	
	//avoid uberdeath
	if (currentHealth<= 0)
		currentHealth = 0;
	
}

@RPC
function ApplyDamage(damage:float) {
	//Apply damage
	currentHealth -= damage;
}

function OnSerializeNetworkView(stream:BitStream, info:NetworkMessageInfo) {
	var currHP:float;
	var iD:boolean;
	var unitIdentification:int;
	
	if (stream.isWriting) {	 	
		 	currHP = currentHealth;
		 	iD = isDead;
		 	unitIdentification = unitID;
	        
	        stream.Serialize(currHP);
	        stream.Serialize(iD);
	        stream.Serialize(unitIdentification);

	    } else {        
	        stream.Serialize(currHP);
	        stream.Serialize(iD);
	        stream.Serialize(unitIdentification);
	        
	        currentHealth = currHP;
	        isDead = iD;
	        unitID = unitIdentification;       
	    }
}

function Selectme() {

 isSelected = true;

}