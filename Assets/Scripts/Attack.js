#pragma strict

@script RequireComponent(Unit);
@script RequireComponent(Class);

var isAttacking:boolean;
var target:Unit;
var agroRange:double = 1;
var attackCounter:double = 0;


function Start () {

	//Set Aggro Range
	agroRange = (gameObject.GetComponent(Class).AttackRange());
	isAttacking = false;

}

function Update () {

	//Targeting Behavior
	//------------------
	
	//Choosing a Target
	if (gameObject.GetComponent(Movement).isMoving == false){
		if (target == null){
		var units:Unit[] = FindObjectsOfType (Unit);
			for (var u in units){
				//Check distance == valid and owner == enemy
				if(Vector3.Distance(this.transform.position , u.transform.position ) <= agroRange){
					if(u.owner != this.GetComponent(Unit).owner){
					target = u;
					}//end ownerif
				}//end-nestedif
			}//end forloop
		}//endif
	}
	
	/*
	//Deciding whether to re-target
	//Checks if target is in aggro range
	//but not in attack range to see if
	//there are new targets within attack range
	if (target != null){
		if((Vector3.Distance(this.transform.position , target.transform.position) <= agroRange)){
			if(!((Vector3.Distance(this.transform.position , target.transform.position)) <= gameObject.GetComponent(Class).AttackRange())){
				//Retargeting Code
				for (var u in units){
					//Check distance == valid and owner == enemy
					if(Vector3.Distance(this.transform.position , u.transform.position ) <= gameObject.GetComponent(Class).AttackRange()){
						if(u.owner != this.GetComponent(Unit).owner){
							target = u;
						}//end ownerif
					}//end-nestedif
				}//end forloop
				//
			}//end-nested-nestedif
		}//end-nestedif
	}//endif
	*/
	
	//Deciding whether to clear target
	if (gameObject.GetComponent(Movement).isMoving == false){
		if (target != null){
			if((Vector3.Distance(this.transform.position , target.transform.position) > agroRange) ){
				target = null;
			}
		}
	}
	
	//Attack/Range Behavior
	if(target != null){
	
		//Face the target
		var targetAngle = this.GetComponent(Movement).getAngle(this.GetComponent(Transform).position,target.GetComponent(Transform).position);
		if (this.GetComponent(Class).classType == UnitClass.BossClass) {
			targetAngle += 180;
		}
		this.GetComponent(Transform).rotation = Quaternion.identity;
		this.GetComponent(Transform).Rotate(new Vector3(0,0-targetAngle,0));
		
		
		if(Vector3.Distance(this.transform.position , target.transform.position) <= gameObject.GetComponent(Class).AttackRange()
			&& GetComponent(Movement).destinationAttack != null){
			isAttacking = true;
			gameObject.GetComponent(Movement).isMoving = false;
			//gameObject.GetComponent(Class).AttackSpeed());
			//transform.Rotate(Vector3.right*Time.deltaTime*(360/gameObject.GetComponent(Class).AttackSpeed()));
			attackCounter += Time.deltaTime;
			if(attackCounter >= gameObject.GetComponent(Class).AttackSpeed()){
				attackCounter = 0;
				//Attack Message/Action/Speed                  \/--Set to Class Damage Value
				if (target.GetComponent(Unit).owner != Faction.Neutral && target.GetComponent(Unit).owner != GetComponent(Unit).owner){
					target.networkView.RPC("ApplyDamage", RPCMode.All, GetComponent(Class).AttackDamage());
				}
				else if (target.GetComponent(Unit).owner == Faction.Neutral){
					if (Network.isServer)
						target.gameObject.SendMessage ("ApplyDamage", GetComponent(Class).AttackDamage());
					else if (Network.isClient)
						target.networkView.RPC("ApplyDamage", RPCMode.All, GetComponent(Class).AttackDamage());
					
				}
				if(target.GetComponent(Class).classType == UnitClass.BossClass){
					var gc:GameController = FindObjectsOfType(GameController)[0];
					var pointsToGet:int = GetComponent(Class).AttackDamage();
					gc.lastToHit = GetComponent(Unit).owner;
					if(GetComponent(Unit).owner == Faction.Pirates){
						gc.AddP1Points(pointsToGet);
					} else if (GetComponent(Unit).owner == Faction.Ninjas){
						gc.networkView.RPC("AddP2Points", RPCMode.All, pointsToGet);
					}
					target.GetComponent(BOSS_LOGIC).hurtBoss(GetComponent(Unit), GetComponent(Class).AttackDamage());
				}
				Debug.Log(gameObject.name + " completed an attack.");
			}//endif
		} else if (gameObject.GetComponent(Movement).isMoving == false){
			if(Vector3.Distance(this.transform.position , target.transform.position) > gameObject.GetComponent(Class).AttackRange()){
				isAttacking = false;
				//transform.rotation = Quaternion.identity;
				target = null;
				GetComponent(Movement).destinationAttack = null;
				attackCounter = 0;
			}//end-nestedif
		}
		//Colin change 4/26
		if(target.GetComponent(Unit).currentHealth <= 0) {
			isAttacking = false;
			target = null;
			GetComponent(Movement).destinationAttack = null;
			attackCounter = 0;
		}
	}//endif
	else {
		isAttacking = false;
		//transform.rotation = Quaternion.identity;
	}
	

	
}

//distance from the target along the x axis
function distX(){
	return -transform.position.x + target.transform.position.x;
}

//distance from the target along the y axis
function distY(){
	return -transform.position.y + target.transform.position.y;
}

//distance from the target along the z axis
function distZ(){
	return -transform.position.z + target.transform.position.z;
}

//total geometric distance from target
function dist(){
	return Mathf.Sqrt(distX() * distX() + distY() * distY() + distZ() * distZ());
}

function OnSerializeNetworkView(stream:BitStream, info:NetworkMessageInfo) {
	var isAttack:boolean;
	var targetID:NetworkViewID;
	var aCounter:float;
	
	if (stream.isWriting) {	 	
		 	isAttack = isAttacking;
		 	/*if (target != null)
		 		targetID = target.unitID;
		 	else
		 		targetID = -1;*/
		 	if(target != null && target.unitID != 0)
		 		targetID = target.networkView.viewID;
		 	
		 	aCounter = attackCounter;
		 	
		 	stream.Serialize(isAttack);
		 	stream.Serialize(targetID);
		 	stream.Serialize(aCounter);
	    } else {        
	        stream.Serialize(isAttack);
		 	stream.Serialize(targetID);
		 	stream.Serialize(aCounter);
	        
	        isAttacking = isAttack;
	        attackCounter = aCounter;
	        
	       // Debug.Log(targetID.ToString);

	        if(targetID != NetworkViewID.unassigned)
	       		 target = NetworkView.Find(targetID).gameObject.GetComponent(Unit);
	        
	        /*if (targetID == -1){
	        	target = null;
	        } else if(targetID <= 7) {
	        	if(GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).team[targetID-1] != null)
	        		target = GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).team[targetID-1];
	        	else
	        		target = null;
	        } else {
	        	if(GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).team[targetID-8] != null)
	        		target = GameObject.Find("NTeamSelector_N").GetComponent(TeamSelector).team[targetID-8];
	        	else
	        		target = null;
	       	}  */
	    }
}