#pragma strict

@script RequireComponent(AudioSource)

function Start () {

	//Start

}

function OnCollisionEnter(collision : Collision) { 

	//Impact Sound
	//audio.Play();
	//Destroy Projectile
	Destroy(gameObject, 0.25);
	Destroy(this);


}