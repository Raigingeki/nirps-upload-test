#pragma strict

var following:Transform;
var distance:float = 5.0;
var angle:float = 80.0;
//var offSet = 3;

function Start () {
	if (following == null)
	{
		following = transform;
	}
}

function Update () {
	transform.position.x = following.position.x;
	transform.position.z = following.position.z + Mathf.Cos((180 - angle)*Mathf.PI/180)*distance;
	transform.position.y = following.position.y + Mathf.Sin((angle)*Mathf.PI/180)*distance;
	transform.LookAt(following);
}