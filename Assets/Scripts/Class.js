#pragma strict

@script RequireComponent(Unit);

var classType:UnitClass;
//Heavy
static var HeavyMaxHp:int = 20;
static var HeavyMaxSpd:int = 3;
static var HeavyAtkSpd:int = 3;  //NO
static var HeavyAtkDmg:int = 3;
static var HeavyAtkRng:int = 3;
//Medium
static var MediumMaxHp:int = 15;
static var MediumMaxSpd:int = 4;
static var MediumAtkSpd:int = 4;
static var MediumAtkDmg:int = 2;
static var MediumAtkRng:int = 4;

static var HealingRange:double = 3;
static var HealingRate:int = 1;
//Light
static var LightMaxHp:int = 10;
static var LightMaxSpd:int = 5;
static var LightAtkSpd:int = 2;  //NO
static var LightAtkDmg:float = 4/3;
static var LightAtkRng:int = 6;

//Boss
static var BossMaxHp:int = 300;
static var BossMaxSpd:int;
static var BossAtkSpd:int = 3;
static var BossAtkDmg:int = 4;
static var BossAtkRng:int = 6;

function MaxHealthPoints():int{
	switch(classType){
		case UnitClass.HeavyClass:
			return HeavyMaxHp;
		case UnitClass.MediumClass:
			return MediumMaxHp;
		case UnitClass.LightClass:
			return LightMaxHp;
		case UnitClass.BossClass:
			return BossMaxHp;
	}
	return 0;
};

function MaxMovementSpeed():int{
	switch(classType){
		case UnitClass.HeavyClass:
			return HeavyMaxSpd;
		case UnitClass.MediumClass:
			return MediumMaxSpd;
		case UnitClass.LightClass:
			return LightMaxSpd;
		case UnitClass.BossClass:
			return BossMaxSpd;
	}
	return 0;
};

function AttackSpeed():int{
	switch(classType){
		case UnitClass.HeavyClass:
			return HeavyAtkSpd;
		case UnitClass.MediumClass:
			return MediumAtkSpd;
		case UnitClass.LightClass:
			return LightAtkSpd;
		case UnitClass.BossClass:
			return BossAtkSpd;
	}
	return 0;
};

function AttackDamage():float{
	switch(classType){
		case UnitClass.HeavyClass:
			return HeavyAtkDmg;
		case UnitClass.MediumClass:
			return MediumAtkDmg;
		case UnitClass.LightClass:
			return LightAtkDmg;
		case UnitClass.BossClass:
			return BossAtkDmg;
	}
	return 0;
};

function AttackRange():int{
	switch(classType){
		case UnitClass.HeavyClass:
			return HeavyAtkRng;
		case UnitClass.MediumClass:
			return MediumAtkRng;
		case UnitClass.LightClass:
			return LightAtkRng;
		case UnitClass.BossClass:
			return BossAtkRng;
	}
	return 0;
};