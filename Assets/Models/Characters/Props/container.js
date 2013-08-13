#pragma strict

//My Target
var target : Unit;
//Alive?
var alive : boolean;
//Impact Prefab
var impacter : GameObject;

function Start () {
	
	//Destroy Within 4 Seconds Period
   	Destroy(gameObject, 4);
   	Destroy(this, 4);

}

function Update () {

	//Point @ Target
	if(alive && target != null){
		rigidbody.AddForce((target.transform.position - this.transform.position) * 15);
	}
	
	//Spin Me
	transform.Rotate(Vector3.forward * 180*Time.deltaTime);
	
	//Target Death Check
	if(alive && target == null){
		//Destroy Immediately
		Destroy(gameObject);
		Destroy(this);
	}

}

function OnCollisionEnter (other : Collision) {
   	//Create Impact At Self
		//Make Impact
		var clone : GameObject;
		//Set Rots to Projectile
    	clone = Instantiate(impacter, this.transform.position, this.transform.rotation);
   	//Destroy Self Immediately
   	Destroy(gameObject);
   	Destroy(this);
}

function setTarget (targ : Unit) {

	//Set Target
	target = targ;
	alive = true;

}