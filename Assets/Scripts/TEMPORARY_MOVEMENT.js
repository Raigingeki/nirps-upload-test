#pragma strict

var speed:double = .03;
var goNegative:boolean = false;
var length:double = 10;

function Start () {

}

function Update () {

if (goNegative)
{
	transform.Translate(0-speed,0,0);
}
else
{
	transform.Translate(speed,0,0);
}	

if (transform.position.x > length)
{
	goNegative = true;
}
if (transform.position.x < 0-length)
{
	goNegative = false;
}


}