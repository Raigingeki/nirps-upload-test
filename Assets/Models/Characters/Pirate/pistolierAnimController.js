#pragma strict

//Attached Scripts
 var myAnim : Animation;
 var myAttack : Attack;
 var myUnit : Unit;
 var myMove : Movement;

//Am I Dying or Shooting? (For Animation Purposes)
var dying : boolean;
var shooting : boolean;

//Muzzle1 Hardpoint
var wepHardpt1 : GameObject;
//Muzzle2 Hardpoint
var wepHardpt2 : GameObject;

//Weapon FX
var fireFX : GameObject;

function Start () {

	//Get My Animation, Attack, and Unit
	//We do this only once, to save calls
	myAnim = this.GetComponentInChildren(Animation);
	myAttack = this.GetComponent(Attack);
	myUnit = this.GetComponent(Unit);
	myMove = this.GetComponent(Movement);
	
	//Not Dying or Curb-Stomping... Yet
	dying = false;
	shooting = false;

}

function Update () {

	//Animation Behavior
	//------------------
	//Default Idle
		if(!(myMove.isMoving) && !(myAttack.isAttacking) && !dying){
			myAnim.CrossFade("Idle");
			shooting = false;
		}
	//'Walking'
		if(myMove.isMoving){
			myAnim.CrossFade("Run");
			//make sound
		}
	//Attacking
		if(myAttack.isAttacking){
			if(!shooting){
				myAnim.CrossFade("Attack");
				//make sound
				//Fire Guns
				firePistols();
				shooting = true;
			}else if (shooting && !(myAnim.isPlaying)){
				shooting = false;
			}
		}
	//Dying
		if(myUnit.currentHealth <= 0 ){
			myAttack.isAttacking = false;
			myMove.isMoving = false;
			if(!dying){
				dying = true;
				//make sound
				myAnim.CrossFade("Death");
			}else if(!(myAnim.isPlaying)){
				//Destroy(gameObject);
			}
		}
		
}

function firePistols () {

	//Fire Particle FX on Both Muzzles
	//Muzzle1
		//Make Projectile
		var clone1 : GameObject;
		//Set Rots to Hardpoint
   		 clone1 = Instantiate(fireFX, this.wepHardpt1.transform.position, this.wepHardpt1.transform.rotation);
	//Muzzle2
		//Make Projectile
		var clone2 : GameObject;
		//Set Rots to Hardpoint
    	clone2 = Instantiate(fireFX, this.wepHardpt2.transform.position, this.wepHardpt2.transform.rotation);

}