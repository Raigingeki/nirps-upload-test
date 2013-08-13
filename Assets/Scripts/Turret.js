#pragma strict

static var turretDamage:int = 2;
static var attackRate:double = 4;
var doingDamages:boolean = false;
var forTeam:Faction = Faction.Neutral;

//Ref to Models & Rotation
var gun : GameObject;
var base : GameObject;
var marker : GameObject;
var boss : GameObject;
var rotStr : double;
private var target : Transform;
private var targetRotation : Quaternion;
var pirMat : Material;
var ninMat : Material;
var muzzle : GameObject;
var projectile : GameObject;

private var attackTimer:double;

function Start () {
	
	//Set Rotation Strength
	rotStr = 0.05;
	
	//Disable Marker
	marker.active = false;
	
}

function Update () {
	
	//Keep Track of Boss Transform
	if(boss != null){
	target = boss.GetComponent(Transform);
	}else{
	target = this.GetComponent(Transform);
	}
	
	
	//Shut off Muzzle if Applicable
	if((attackTimer >= attackRate/10) || boss == null){
		muzzle.light.enabled = false;
	}
	
	if (doingDamages && (boss != null)){
		//increment timer by deltatime
		attackTimer += Time.deltaTime;
		
		//Track Boss With Rotation
			targetRotation = Quaternion.LookRotation (target.position - (gun.GetComponent(Transform)).position);
			//rotStr = Mathf.Min (rotStr * Time.deltaTime, 1);
			(gun.GetComponent(Transform)).rotation = Quaternion.Lerp ((gun.GetComponent(Transform)).rotation, targetRotation, rotStr);
		
		//Set Marker Team
		if(forTeam == Faction.Pirates){
				marker.renderer.material = pirMat;
			} else if (forTeam == Faction.Ninjas){
				marker.renderer.material = ninMat;
			}
		//Marker On
		marker.active = true;
		
		//attack if we can
		if (attackTimer >= attackRate){
			attackTimer -= attackRate;
			var b:BOSS_LOGIC = FindObjectsOfType(BOSS_LOGIC)[0];
			var gc:GameController = FindObjectsOfType(GameController)[0];
			gc.lastToHit = forTeam;
			var prevRnd:int = gc.roundNumber;
			var pointsToGet:int = (Constants.PointsPerBossHP) * turretDamage;
			b.GetComponent(Unit).ApplyDamage(turretDamage);
			
			//Fire Gun
				//VFX Trigger
				muzzle.light.enabled = true;
				var clone : GameObject;
    			clone = Instantiate(projectile, muzzle.transform.position, ((gun.GetComponent(Transform)).rotation));
				clone.rigidbody.AddForce(clone.transform.forward * 500);
				//Audio Cue
				(gun.GetComponent(AudioSource)).Play();
			
			if(forTeam == Faction.Pirates){
				gc.player1Score += pointsToGet;
			} else if (forTeam == Faction.Ninjas){
				gc.player2Score += pointsToGet;
			}
		}
	}else{
	//Resetting Turret
	(gun.GetComponent(Transform)).rotation = Quaternion.Lerp ((gun.GetComponent(Transform)).rotation, Quaternion.Euler(0, 180, 0), rotStr);
	
	//Resetting Marker
	marker.active = false;
	
	}
}

function startDoingDamages(f:Faction){
	forTeam = f;
	doingDamages = true;
	attackTimer = 0;
	
	//Rotate Gun
		//Audiosource of Base
		(base.GetComponent(AudioSource)).Play();
		
}

function stopDoingDamages(){
	forTeam = Faction.Neutral;
	doingDamages = false;

	/*
	//Unrotate Gun
		//Reset Quaternion to Identity
		(gun.GetComponent(Transform)).rotation = Quaternion.identity;
	*/

}