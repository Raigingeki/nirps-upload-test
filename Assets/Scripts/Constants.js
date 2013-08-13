#pragma strict

enum Faction {
	Pirates,
	Ninjas,
	Neutral
};

enum UnitClass {
	LightClass,
	MediumClass,
	HeavyClass,
	BossClass
};

static var UnitLayer:int = 1<<8;
static var TerrainLayer:int = 1<<8 + 1;
static var CaptureLayer:int = 1<<8 + 2;
static var PathingLayer:int = 1<<8 + 3;
static var PointsPerBossHP:int = 1;
static var BossDamagePerTurretAttack:int = 1;
static var TurretAttackRate:int = 1;

static var RoundOnePointValue = 40;
static var RoundTwoPointValue = 40;
static var RoundThreePointValue = 61;