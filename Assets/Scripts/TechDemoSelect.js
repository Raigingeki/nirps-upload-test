#pragma strict

var lockedUnit:Unit;
var verticalOffset:double = 2;

function Start () {

}

function Update () {
	if (lockedUnit == null)  renderer.enabled = false;
	else {
		renderer.enabled = true;
		transform.position.x = lockedUnit.transform.position.x;
		transform.position.y = lockedUnit.transform.position.y + verticalOffset;
		transform.position.z = lockedUnit.transform.position.z;
	}
}