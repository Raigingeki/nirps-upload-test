#pragma strict
@script RequireComponent(Unit);
@script RequireComponent(Movement);
@script RequireComponent(Attack);
@script RequireComponent(Class);

var isAuraActive:boolean = false;
private var auraTick:double = 0;

function Update () {
	if (gameObject.GetComponent(Movement).isMoving
			&& gameObject.GetComponent(Attack).isAttacking){
		isAuraActive = true;
	} else {
		isAuraActive = false;
	}
	
	if (isAuraActive)
		auraTick += Time.deltaTime;
	if (auraTick >= 1){
		auraTick = 0;
		doAuraHeal();
	}
}

function doAuraHeal(){
	var units:Unit[] = FindObjectsOfType(Unit);
	for (u in units){
		//if they are in range
		var dist = Mathf.Sqrt((u.transform.position.x - transform.position.x) * (u.transform.position.x - transform.position.x)
				+ (u.transform.position.z - transform.position.z) * (u.transform.position.z - transform.position.z));
		if (dist <= Class.HealingRange){
			//if on same team
			if (u.owner == gameObject.GetComponent(Unit).owner){
				u.currentHealth += Class.HealingRate;
			}
		}
	}
}