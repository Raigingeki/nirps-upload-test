#pragma strict

var units:Unit[];
private var numUnits:int = 14;
var aggro:double[] = new double[numUnits]; //hardcoded because instantiation -> eventually move this to logic controller
var aggroCooldown:double = 1.0;
private var aoe_charge:double;
var aoe_targets:Unit[];
//public for purposes of tuning, changing throughout rounds, etc
var aoe_charge_rate:double = 1;
var aoe_charge_max:double = 5;
var aoe_range:double = 6;
//ratio of normal attack damage to do in the aoe attack
var aoe_damage_ratio:double = .5;

var aoeing : boolean;

function Start () {
	aoe_charge = 0;
	aoeing = false;
}

function Update () {

if(NetworkController.ready){

	//mite b silly to read this in each frame - who knows how good unity's optimization routines are
	units = FindObjectsOfType(Unit);
	aoe_targets = new Unit[units.length];
	//basic targeting logic: aim for nearest guy
	var nearest:double = 999;  //arbitrary huge
	var nearestUnit:Unit = null;
	for(var k = 0; k < units.length; k++){
		if (units[k].GetComponent(Class).classType != UnitClass.BossClass){
			var dist:double = Vector3.Distance(transform.position, units[k].transform.position);
			if (dist < nearest){
				nearest = dist;
				nearestUnit = units[k];
			}
		}
	}
	//if the nearest guy is not null and is in range, target him
	//otherwise target nothing
	if (nearestUnit == null){
		GetComponent(Attack).target = null;
		GetComponent(Attack).isAttacking = false;
	} else {
		dist = Vector3.Distance(transform.position, nearestUnit.transform.position);
		if (dist <= GetComponent(Class).AttackRange()){
			GetComponent(Attack).target = nearestUnit;
			GetComponent(Attack).isAttacking = true;
		} else {
			GetComponent(Attack).target = null;
			GetComponent(Attack).isAttacking = false;
		}
	}
	//charge up timer for aoe attack based on rate and deltaTime
	aoe_charge += aoe_charge_rate * Time.deltaTime;
	//fill up targets array
	var aoe_target_count = 0;
	var target:Unit = GetComponent(Attack).target;
	if (target != null){
		for(var i = 0; i < units.length; i++){
			if (units[i].GetComponent(Class).classType != UnitClass.BossClass
				&& units[i] != target){
				dist = Vector3.Distance(target.transform.position, units[i].transform.position);
				if (dist <= aoe_range){
					aoe_targets[aoe_target_count] = units[i];
					aoe_target_count++;
				}
			}
		}
	}
	//if we've charged enough, do the aoe
	if (aoe_charge >= aoe_charge_max && GetComponent(Attack).isAttacking){
		aoeing = true;
		var guylist:String = "";
		for(var j = 0; j < aoe_targets.length; j++){
			if (aoe_targets[j] != null){
				aoe_targets[j].ApplyDamage(parseInt(GetComponent(Class).AttackDamage() * aoe_damage_ratio));
				guylist+=aoe_targets[j] + " ";
			}
		}
		Debug.Log("Aoe Splat on " + guylist);
		aoe_charge = 0;
		aoeing = false;
	}
	//target setting and aggro cooldown
	var inRange:boolean[] = new boolean[numUnits];
	for(i = 0; i < numUnits; i++){
		if (units.length >= i){
			if (Vector3.Distance(units[i].transform.position, transform.position) <= GetComponent(Class).AttackRange()){
				inRange[i] = true;
			}
		}
	}
	var highestVal:int = -1;
	var highestIndex:int = -1;
	for(i = 0; i < numUnits; i++){
		if (inRange[i]){
			if (aggro[i] > highestVal){
				highestVal = aggro[i];
				highestIndex = i;
			}
		}
	}
	if (highestIndex != -1){
		GetComponent(Attack).target = units[highestIndex];
	}
	for(a in aggro){
		a -= aggroCooldown * Time.deltaTime;
	}
	
}//endif
}

function hurtBoss(u:Unit, amount:double){
	for(var i:int = 0; i < numUnits; i++){
		if (u == units[i]){
			aggro[i]+=amount;
		}
	}
}