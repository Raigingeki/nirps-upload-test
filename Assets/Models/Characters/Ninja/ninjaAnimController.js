#pragma strict

//Attached Scripts
private var myAnim : Animation;
private var myAttack : Attack;
private var myUnit : Unit;
private var myMove : Movement;

//Am I Dying or Throwing? (For Animation Purposes)
var dying : boolean;
var throwing : boolean;

//Shruiken Hardpoint
var wepHardpt : GameObject;

//Shruiken Projectile
var wepProj : GameObject;

function Start () {

	//Get My Animation, Attack, and Unit
	//We do this only once, to save calls
	myAnim = this.GetComponentInChildren(Animation);
	myAttack = this.GetComponent(Attack);
	myUnit = this.GetComponent(Unit);
	myMove = this.GetComponent(Movement);
	
	//Not Dying or Curb-Stomping... Yet
	dying = false;
	throwing = false;
	
	//Hide Hardpoint
	wepHardpt.renderer.enabled = false;

}

function Update () {

	//Animation Behavior
	//------------------
	//Default Idle
		if(!(myMove.isMoving) && !(myAttack.isAttacking) && !dying){
			myAnim.CrossFade("Idle");
			throwing = false;
		}
	//'Walking'
		if(myMove.isMoving){
			myAnim.CrossFade("Run");
			//make sound
		}
	//Attacking
		if(myAttack.isAttacking){
			if(!throwing && !(myAnim.IsPlaying("Throw"))){
				//Do Prefire
				myAnim.CrossFade("Prethrow");
				//Make Voice Sound
				//
				throwing = true;
			}else if (throwing && !(myAnim.isPlaying)){
				//Hide Hardpoint
				wepHardpt.renderer.enabled = false;
				//Throw Shruiken
				throwWep();
				//Play Followthru
				myAnim.Play("Throw");
				throwing = false;
			}
			if((myAnim.IsPlaying("Prethrow") && myAnim.animation["Prethrow"].time >= 0.295)){
				//Show Hardpoint
				wepHardpt.renderer.enabled = true;
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

function throwWep(){
	if(myAttack.target != null){
	//Make Projectile
	var clone : GameObject;
	//Set Rots to Hardpoint
    clone = Instantiate(wepProj, this.wepHardpt.transform.position, this.wepHardpt.transform.rotation);
	//Give Speed
	clone.rigidbody.AddForce((myAttack.target.transform.position - this.wepHardpt.transform.position) * 25);
	//Give Target
	clone.SendMessage("setTarget",myAttack.target);
	//Make Throw Sound
	//
	}
}