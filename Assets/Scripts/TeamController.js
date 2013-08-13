#pragma strict

var pLight:Transform;
var pMedium:Transform;
var pHeavy:Transform;

var nLight:Transform;
var nMedium:Transform;
var nHeavy:Transform;

var unit1:Transform;
var unit2:Transform;
var unit3:Transform;
var unit4:Transform;
var unit5:Transform;
var unit6:Transform;
var unit7:Transform;
var sSpawn1:Vector3;
var sSpawn2:Vector3;
var sSpawn3:Vector3;
var uSpawn1:Vector3;
var uSpawn2:Vector3;
var uSpawn3:Vector3;
var uSpawn4:Vector3;
var uSpawn5:Vector3;
var uSpawn6:Vector3;
var uSpawn7:Vector3;

function Start () {
	
}

function Update () {

}

 
function CreateTeam(host:boolean) {
	var amIHost:boolean = host;	
	
	var teamArray:String [] = GameObject.Find("MenuControlObject").GetComponent(MenuController).teamRoster;	
	
	if(amIHost) {
		uSpawn1 = GameObject.Find("pTeamSpawn1").transform.position;
		uSpawn1.y = 1;
		uSpawn2 = GameObject.Find("pTeamSpawn2").transform.position;
		uSpawn2.y = 1;
		uSpawn3 = GameObject.Find("pTeamSpawn3").transform.position;
		uSpawn3.y = 1;
		uSpawn4 = GameObject.Find("pTeamSpawn4").transform.position;
		uSpawn4.y = 1;
		uSpawn5 = GameObject.Find("pTeamSpawn5").transform.position;
		uSpawn5.y = 1;
		uSpawn6 = GameObject.Find("pTeamSpawn6").transform.position;
		uSpawn6.y = 1;
		uSpawn7 = GameObject.Find("pTeamSpawn7").transform.position;
		uSpawn7.y = 1;
		sSpawn1 = GameObject.Find("pSquadSpawn1").transform.position;
		sSpawn1.y = 1.1;
		sSpawn2 = GameObject.Find("pSquadSpawn2").transform.position;
		sSpawn2.y = 1.1;
		sSpawn3 = GameObject.Find("pSquadSpawn3").transform.position;
		sSpawn3.y = 1.1;
		
		if(teamArray[0] == "light")
			unit1 = Network.Instantiate(pLight,uSpawn1,transform.rotation,0);
		else if (teamArray[0] == "medium")
			unit1 = Network.Instantiate(pMedium,uSpawn1,transform.rotation,0);
		else if (teamArray[0] == "heavy")
			unit1 = Network.Instantiate(pHeavy,uSpawn1,transform.rotation,0);
		unit1.name = "p1Unit";
		unit1.gameObject.layer = 8;
		unit1.GetComponent(Unit).unitID = 1;
		//GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).squad[0] = unit1.GetComponent(Unit);
		GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).team[0] = unit1.GetComponent(Unit);
		
		if(teamArray[1] == "light")
			unit2 = Network.Instantiate(pLight,uSpawn2,transform.rotation,0);
		else if (teamArray[1] == "medium")
			unit2 = Network.Instantiate(pMedium,uSpawn2,transform.rotation,0);
		else if (teamArray[1] == "heavy")
			unit2 = Network.Instantiate(pHeavy,uSpawn2,transform.rotation,0);
		unit2.name = "p2Unit";
		unit2.gameObject.layer = 8;
		unit2.GetComponent(Unit).unitID = 2;
		//GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).squad[1] = unit2.GetComponent(Unit);
		GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).team[1] = unit2.GetComponent(Unit);
		
		if(teamArray[2] == "light")
			unit3 = Network.Instantiate(pLight,uSpawn3,transform.rotation,0);
		else if (teamArray[2] == "medium")
			unit3 = Network.Instantiate(pMedium,uSpawn3,transform.rotation,0);
		else if (teamArray[2] == "heavy")
			unit3 = Network.Instantiate(pHeavy,uSpawn3,transform.rotation,0);
		unit3.name = "p3Unit";
		unit3.gameObject.layer = 8;
		unit3.GetComponent(Unit).unitID = 3;
		//GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).squad[2] = unit3.GetComponent(Unit);
		GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).team[2] = unit3.GetComponent(Unit);
		
		if(teamArray[3] == "light")
			unit4 = Network.Instantiate(pLight,uSpawn4,transform.rotation,0);
		else if (teamArray[3] == "medium")
			unit4 = Network.Instantiate(pMedium,uSpawn4,transform.rotation,0);
		else if (teamArray[3] == "heavy")
			unit4 = Network.Instantiate(pHeavy,uSpawn4,transform.rotation,0);
		unit4.name = "p4Unit";
		unit4.gameObject.layer = 8;
		unit4.GetComponent(Unit).unitID = 4;
		GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).team[3] = unit4.GetComponent(Unit);
		
		if(teamArray[4] == "light")
			unit5 = Network.Instantiate(pLight,uSpawn5,transform.rotation,0);
		else if (teamArray[4] == "medium")
			unit5 = Network.Instantiate(pMedium,uSpawn5,transform.rotation,0);
		else if (teamArray[4] == "heavy")
			unit5 = Network.Instantiate(pHeavy,uSpawn5,transform.rotation,0);
		unit5.name = "p5Unit";
		unit5.gameObject.layer = 8;
		unit5.GetComponent(Unit).unitID = 5;
		GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).team[4] = unit5.GetComponent(Unit);
		
		if(teamArray[5] == "light")
			unit6 = Network.Instantiate(pLight,uSpawn6,transform.rotation,0);
		else if (teamArray[5] == "medium")
			unit6 = Network.Instantiate(pMedium,uSpawn6,transform.rotation,0);
		else if (teamArray[5] == "heavy")
			unit6 = Network.Instantiate(pHeavy,uSpawn6,transform.rotation,0);
		unit6.name = "p6Unit";
		unit6.GetComponent(Unit).gameObject.layer = 8;
		unit6.GetComponent(Unit).unitID = 6;
		GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).team[5] = unit6.GetComponent(Unit);
		
		if(teamArray[6] == "light")
			unit7 = Network.Instantiate(pLight,uSpawn7,transform.rotation,0);
		else if (teamArray[6] == "medium")
			unit7 = Network.Instantiate(pMedium,uSpawn7,transform.rotation,0);
		else if (teamArray[6] == "heavy")
			unit7 = Network.Instantiate(pHeavy,uSpawn7,transform.rotation,0);
		unit7.name = "p7Unit";
		unit7.gameObject.layer = 8;
		unit7.GetComponent(Unit).unitID = 7;
		GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).team[6] = unit7.GetComponent(Unit);
			
		
	} else {
	
		uSpawn1 = GameObject.Find("nTeamSpawn1").transform.position;
		uSpawn1.y = 1;
		uSpawn2 = GameObject.Find("nTeamSpawn2").transform.position;
		uSpawn2.y = 1;
		uSpawn3 = GameObject.Find("nTeamSpawn3").transform.position;
		uSpawn3.y = 1;
		uSpawn4 = GameObject.Find("nTeamSpawn4").transform.position;
		uSpawn4.y = 1;
		uSpawn5 = GameObject.Find("nTeamSpawn5").transform.position;
		uSpawn5.y = 1;
		uSpawn6 = GameObject.Find("nTeamSpawn6").transform.position;
		uSpawn6.y = 1;
		uSpawn7 = GameObject.Find("nTeamSpawn7").transform.position;
		uSpawn7.y = 1;
		sSpawn1 = GameObject.Find("nSquadSpawn1").transform.position;
		sSpawn1.y = 1;
		sSpawn2 = GameObject.Find("nSquadSpawn2").transform.position;
		sSpawn2.y = 1;
		sSpawn3 = GameObject.Find("nSquadSpawn3").transform.position;
		sSpawn3.y = 1;
		
		if(teamArray[0] == "light")
			unit1 = Network.Instantiate(nLight,uSpawn1,transform.rotation,0);
		else if (teamArray[0] == "medium")
			unit1 = Network.Instantiate(nMedium,uSpawn1,transform.rotation,0);
		else if (teamArray[0] == "heavy")
			unit1 = Network.Instantiate(nHeavy,uSpawn1,transform.rotation,0);
		unit1.name = "n1Unit";
		unit1.gameObject.layer = 8;
		unit1.GetComponent(Unit).unitID = 8;
		//GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).squad[0] = unit1.GetComponent(Unit);
		GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).team[0] = unit1.GetComponent(Unit);
		
		if(teamArray[1] == "light")
			unit2 = Network.Instantiate(nLight,uSpawn2,transform.rotation,0);
		else if (teamArray[1] == "medium")
			unit2 = Network.Instantiate(nMedium,uSpawn2,transform.rotation,0);
		else if (teamArray[1] == "heavy")
			unit2 = Network.Instantiate(nHeavy,uSpawn2,transform.rotation,0);
		unit2.name = "n2Unit";
		unit2.gameObject.layer = 8;
		unit2.GetComponent(Unit).unitID = 9;
		//GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).squad[1] = unit2.GetComponent(Unit);
		GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).team[1] = unit2.GetComponent(Unit);
		
		if(teamArray[2] == "light")
			unit3 = Network.Instantiate(nLight,uSpawn3,transform.rotation,0);
		else if (teamArray[2] == "medium")
			unit3 = Network.Instantiate(nMedium,uSpawn3,transform.rotation,0);
		else if (teamArray[2] == "heavy")
			unit3 = Network.Instantiate(nHeavy,uSpawn3,transform.rotation,0);
		unit3.name = "n3Unit";
		unit3.gameObject.layer = 8;
		unit3.GetComponent(Unit).unitID = 10;
		//GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).squad[2] = unit3.GetComponent(Unit);
		GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).team[2] = unit3.GetComponent(Unit);
		
		if(teamArray[3] == "light")
			unit4 = Network.Instantiate(nLight,uSpawn4,transform.rotation,0);
		else if (teamArray[3] == "medium")
			unit4 = Network.Instantiate(nMedium,uSpawn4,transform.rotation,0);
		else if (teamArray[3] == "heavy")
			unit4 = Network.Instantiate(nHeavy,uSpawn4,transform.rotation,0);
		unit4.name = "n4Unit";
		unit4.gameObject.layer = 8;
		unit4.GetComponent(Unit).unitID = 11;
		GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).team[3] = unit4.GetComponent(Unit);
		
		if(teamArray[4] == "light")
			unit5 = Network.Instantiate(nLight,uSpawn5,transform.rotation,0);
		else if (teamArray[4] == "medium")
			unit5 = Network.Instantiate(nMedium,uSpawn5,transform.rotation,0);
		else if (teamArray[4] == "heavy")
			unit5 = Network.Instantiate(nHeavy,uSpawn5,transform.rotation,0);
		unit5.name = "n5Unit";
		unit5.gameObject.layer = 8;
		unit5.GetComponent(Unit).unitID = 12;
		GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).team[4] = unit5.GetComponent(Unit);
		
		if(teamArray[5] == "light")
			unit6 = Network.Instantiate(nLight,uSpawn6,transform.rotation,0);
		else if (teamArray[5] == "medium")
			unit6 = Network.Instantiate(nMedium,uSpawn6,transform.rotation,0);
		else if (teamArray[5] == "heavy")
			unit6 = Network.Instantiate(nHeavy,uSpawn6,transform.rotation,0);
		unit6.name = "n6Unit";
		unit6.gameObject.layer = 8;
		unit6.GetComponent(Unit).unitID = 13;
		GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).team[5] = unit6.GetComponent(Unit);
		
		if(teamArray[6] == "light")
			unit7 = Network.Instantiate(nLight,uSpawn7,transform.rotation,0);
		else if (teamArray[6] == "medium")
			unit7 = Network.Instantiate(nMedium,uSpawn7,transform.rotation,0);
		else if (teamArray[6] == "heavy")
			unit7 = Network.Instantiate(nHeavy,uSpawn7,transform.rotation,0);
		unit7.name = "n7Unit";
		unit7.gameObject.layer = 8;
		unit7.GetComponent(Unit).unitID = 14;
		GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).team[6] = unit7.GetComponent(Unit);
		
		GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).locallyControlled =
			!GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).locallyControlled;
		GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).locallyControlled =
			!GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).locallyControlled;
			
		GameObject.Find("CameraFocus").transform.position.x = 38;
		
	}
}