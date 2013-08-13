#pragma strict

static var cooldown:double;
static var isLocalPlayerPirates:boolean=true;

function Start () {
cooldown=0;
}

function Update () {
if (cooldown>0)
cooldown=cooldown-1;
//Debug.Log("Cooldown is at "+cooldown);
}