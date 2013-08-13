#pragma strict

//Attached Scripts
private var myAnim : Animation;
private var myAttack : Attack;
private var myUnit : Unit;
private var myMove : Movement;

//Am I Dying? (For Animation Purposes)
var dying : boolean;

function Start () {

	//Get My Animation, Attack, and Unit
	//We do this only once, to save calls
	myAnim = this.GetComponentInChildren(Animation);
	myAttack = this.GetComponent(Attack);
	myUnit = this.GetComponent(Unit);
	myMove = this.GetComponent(Movement);
	
	//Not Dying... Yet
	dying = false;
	
}

function Update () {

	//Animation Behavior
	//------------------
	//Default Idle
		if(!(myMove.isMoving) && !(myAttack.isAttacking) && !dying){
			myAnim.CrossFade("Idle");
		}
	//'Walking'
		if(myMove.isMoving){
			myAnim.CrossFade("Walk");
			//make sound
		}
	//Attacking
		if(myAttack.isAttacking){
			myAnim.CrossFade("Attack");
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