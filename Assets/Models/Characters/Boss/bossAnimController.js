#pragma strict

//Attached Scripts
private var myAnim : Animation;
private var myAttack : Attack;
private var myUnit : Unit;
private var myMove : Movement;
private var myLogic : BOSS_LOGIC;

//Dead Prefab
var deadFab : GameObject;

//Am I Dying or Stomping? (For Animation Purposes)
var dying : boolean;
var stomping : boolean;
var shooting : boolean;
var defab : boolean;
var kwiktime : double;

//My Last Attack Was?
private var lastAtk : String;

//Plasma Emitter
var plasmaEmit : GameObject;

function Start () {

	//Get My Animation, Attack, and Unit
	//We do this only once, to save calls
	myAnim = this.GetComponentInChildren(Animation);
	myAttack = this.GetComponent(Attack);
	myUnit = this.GetComponent(Unit);
	myMove = this.GetComponent(Movement);
	myLogic = this.GetComponent(BOSS_LOGIC);
	
	//Not Dying or Curb-Stomping... Yet
	dying = false;
	stomping = false;
	shooting = false;
	defab = false;
	kwiktime = 4.95;
	
	//Shut off Plasma
	plasmaEmit.active = false;
	
	//Last Attack
	lastAtk = "A2";

}//end start

function Update () {

	//Animation Behavior
	//------------------
	//Default Idle
		if(!(myMove.isMoving) && !(myAttack.isAttacking) && !(myLogic.aoeing) && !dying){
			myAnim.CrossFade("Idle");
		}
	//Walking
		if(myMove.isMoving){
			myAnim.CrossFade("Walk");
			//make sound
		}
	//Attacking
		if(myAttack.isAttacking){
			if(lastAtk == "A2" && !myAnim.IsPlaying("Attack2")){
				myAnim.CrossFade("Attack1");
				//make sound
				lastAtk = "A1";
			}else if(lastAtk == "A1" && !myAnim.IsPlaying("Attack1")){
				myAnim.CrossFade("Attack2");
				//make sound
				lastAtk = "A2";
			}
		}
	//AoEing
		if(myLogic.aoeing){
		
			myMove.isMoving = false;
			myAttack.isAttacking = false;
			if(!stomping && !shooting && myAnim.isPlaying){
			    stomping = true;
				myAnim.CrossFade("AoE");
			}else if(!(myAnim.isPlaying) && stomping && !shooting){
				plasmaEmit.active = true;
				//Make Sound
				myAnim.CrossFade("AoE2");
				stomping = false;
				shooting = true;
			}else if(!(myAnim.isPlaying) && shooting && !stomping){
				plasmaEmit.active = false;
				shooting = false;
				myLogic.aoeing = false;
			}
			
		}
	//Dying
		if(myUnit.currentHealth <= 0 ){
			myAttack.isAttacking = false;
			myMove.isMoving = false;
			myLogic.aoeing = false;
			if(!dying){
				dying = true;
				//make sound
				myAnim.CrossFade("Death");
			}else if(dying && !defab && kwiktime <= 0){
				//Make Carcass
				var clone : GameObject;
				//Set Rots to Hardpoint
    			clone = Instantiate(deadFab, this.transform.position, this.transform.rotation);
    			dying = false;
    			defab = true;
  
			}else if (dying && !defab && kwiktime >= 0){
				kwiktime -= Time.deltaTime;
			}
		}
		
}//end update