#pragma strict

function Start () {

	//Destroy Within 2 Second
   	Destroy(gameObject, 2);
   	Destroy(this, 2);
   	
   	var flare : Light;
   	flare = this.GetComponent(Light);
   	
   	//Destroy Flare Within 0.3 Second
   	Destroy(flare, 0.1);
   	
   	
	
}