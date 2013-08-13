#pragma strict

//My Target
var target : Unit;
//Alive?
var alive : boolean;
//Impact Sound
//

function Start () {
	
	//Destroy Within 1 Second Period
   	Destroy(gameObject, 1);
   	Destroy(this, 1);

}

function Update () {

	//Point @ Target
	if(alive && target != null){
		rigidbody.AddForce((target.transform.position - this.transform.position) * 45);
	}
	
	//Spin Me
	transform.Rotate(Vector3.forward * 280*Time.deltaTime);
	
	//Target Death Check
	if(alive && target == null){
		//Destroy Immediately
		Destroy(gameObject);
		Destroy(this);
	}

}

function OnCollisionEnter (other : Collision) {
   	//Hide us
   	this.renderer.enabled = false;
   	//Destroy With Pause of 3 seconds
   	Destroy(gameObject, 3);
   	Destroy(this, 3);
   	//Play sound
	//
}

function setTarget (targ : Unit) {

	//Set Target
	target = targ;
	alive = true;

}