#pragma strict

public var squad:Unit[] = new Unit[3];
public var team : Unit[] = new Unit[7];
public var selected:Unit[] = new Unit[3];
var selectIndicators:TechDemoSelect[] = new TechDemoSelect[3];
var keySelectInputBuffer:int = 10;
var locallyControlled:boolean = true;
var unitClass:UnitClass;
var faction:Faction;

var livingUnits:int = 7;

// Pirate Quotes
var pirateLightMove:AudioClip;
var pirateMediumMove:AudioClip;
var pirateHeavyMove:AudioClip;
var pirateLightAttack:AudioClip;
var pirateMediumAttack:AudioClip;
var pirateHeavyAttack:AudioClip;
var pirateLightHello:AudioClip;
var pirateMediumHello:AudioClip;
var pirateHeavyHello:AudioClip;


// Ninja Quotes
var ninjaLightMove:AudioClip;
var ninjaMediumMove:AudioClip;
var ninjaHeavyMove:AudioClip;
var ninjaLightAttack:AudioClip;
var ninjaMediumAttack:AudioClip;
var ninjaHeavyAttack:AudioClip;
var ninjaLightHello:AudioClip;
var ninjaMediumHello:AudioClip;
var ninjaHeavyHello:AudioClip;

private static var CONTROL_SWITCH_KEY = KeyCode.G;

private var lowestSpeedOfSelection:double;
private var oneCooldown:int;
private var twoCooldown:int;
private var threeCooldown:int;
private var one:boolean;
private var two:boolean;
private var three:boolean;



public var raycastme : boolean; 

private var raycastLength : float = 200.0;
private var mouseButton1DownPoint : Vector2;
private var mouseButton1UpPoint : Vector2;
private var mouseButton1DownTerrainHitPoint : Vector3;
//private var mouseButton2DownPoint : Vector2;
//private var mouseButton2UpPoint : Vector2;
private var selectionPointStart : Vector3;
private var selectionPointEnd : Vector3;
private var mouseLeftDrag : boolean = false;
//private var terrainLayerMask = 1 << 8;

// semi transparent texture for the selection rectangle
var selectionTexture : Texture;
// range in which a mouse down and mouse up event will be treated as "the same location" on the map.
private var mouseButtonReleaseBlurRange : int = 20;

function Start () {
	raycastme = true;
}

//ORDER OF FUNCTIONS:
/*
Update
Mouse1Up
Mouse1Down
Mouse1Drag
Mouse2Down
DoKeySelect
Select

*/

function Update () {
	//check for the key to change whether we're in control
	//doControlCheck();
	//if we're the active controller, do input checks and operations
	if (locallyControlled){
		//If the user has clicked Right Mouse button
		if (Input.GetButtonUp("Fire2")){
			Mouse2Down();
		}
		
		//If Mouse is within lower GUI area; do NOT raycast
		if(Input.mousePosition.y <= 120){
		 	raycastme = false;
		}else{
			raycastme = true;
		}
		
		//If the user pushes left Mouse Button
		
		//Mouse went Down - the first coordinate of the unit selection box
		if (Input.GetButtonDown("Fire1")) {
				Mouse1Down(Input.mousePosition);
		}
		
		//Mouse came Up - the last coordinate of the unit selection box
		if (Input.GetButtonUp("Fire1")) {
				Mouse1Up(Input.mousePosition);
		}
		
		//Mouse is down - Dragging the unit selection box rectangle
		if (Input.GetButton("Fire1")) {
			Mouse1DownDrag(Input.mousePosition);
		}
		
		if (Input.GetButton("Fire2")){
			Mouse2DownDrag(Input.mousePosition);
		}
		
		//do the unit selection by key inputs/chords
		doKeySelect();
	}
}

function hasSelections (){
	for(var i = 0; i < selected.length; i++){
		if(selected[i] != null){
		return true;
		}
	}
	return false;
}

function Mouse1Down(screenPosition : Vector2) {
		
		mouseButton1DownPoint = screenPosition;
		
		var hit : RaycastHit;
		if(Camera.main != null){
			var ray = Camera.main.ScreenPointToRay (mouseButton1DownPoint); 
		}
		if ( Physics.Raycast(ray, hit, raycastLength,Constants.TerrainLayer) ) // terrainLayerMask can be added later
		{ 
			//added condition to be finished later for layer checking
			//if (hit.collider.name == "Floor")
			//{
				mouseButton1DownTerrainHitPoint = hit.point;
				selectionPointStart = hit.point;
			//} 
			//else
			//{
				
			//}
		}
}

function Mouse1Up(screenPosition : Vector2) {
	
	mouseButton1UpPoint = screenPosition;
	var hit : RaycastHit;
	
	//print("currently selected units: " + UnitManager.GetInstance().GetSelectedUnitsCount());	
	mouseLeftDrag = false;
	
	//Checks to see if the user has only clicked, not dragged
	if (IsInRange(mouseButton1DownPoint, mouseButton1UpPoint)) {
		// user just did a click, no dragging. mouse 1 down and up pos are equal.
		if(raycastme){
			if ((Screen.height - mouseButton1UpPoint.y) < (Screen.height/7)*5.45 &&
				mouseButton1UpPoint.x < (Screen.width/7)*6) { 
				ClearSelectedUnitsList();
			}
		}
		if(Camera.main != null){
			var ray = Camera.main.ScreenPointToRay (mouseButton1DownPoint);
		}
		if ( Physics.Raycast (ray, hit, raycastLength,Constants.UnitLayer))
		{ 
			// Ray hit something. Try to select that hit target. 
			//print ("Hit something: " + hit.collider.name);
			for (var i:int = 0; i < 3; ++i)
			{
				if (squad[i] == hit.collider.gameObject.GetComponent("Unit"))
				{
					selected[0] = squad[i];
					selectIndicators[0].lockedUnit = squad[i];
					//voiceQuote(squad[i],2);
					break;
				}
			}
			//hit.collider.gameObject.SendMessage("SetSelected");
		}
	}	
}

function Mouse1DownDrag(screenPosition : Vector2) {
	// Only show the drag selection texture if the mouse has been moved and not if the user made only a single left mouse click
	if (screenPosition != mouseButton1DownPoint) {
		mouseLeftDrag = true;
		// while dragging, update the current mouse pos for the selection rectangle.
		mouseButton1UpPoint = screenPosition;
		
		var hit : RaycastHit;
		var ray = Camera.main.ScreenPointToRay (screenPosition); 		
		if ( Physics.Raycast (ray, hit, raycastLength,Constants.TerrainLayer)) //, terrainLayerMask) )
		{ 
			//print ("Hit Terrain 2 " + hit.point);
			selectionPointEnd = hit.point;
			if(raycastme){
				ClearSelectedUnitsList();
			}
			SelectUnitsInArea(selectionPointStart, selectionPointEnd);
		}	
	}
}

function Mouse2Down() {
	//Check if clicked on non friendly unit
	
	//Get the mouse position
    var mousePosition : Vector3 = Input.mousePosition;
    
    //Cast it into a ray
    var screenRay : Ray = Camera.main.ScreenPointToRay( mousePosition );
    
    //Initializing some variables
    var hitInfo : RaycastHit;
    
    //Grab the information we need
    if (Physics.Raycast( screenRay, hitInfo, Mathf.Infinity, Constants.UnitLayer))
    {
	    //Note this function also returns a boolean about whether it
	    //And find the point of impact
	    var pointOfImpact : Vector3 = hitInfo.point;
	    var hitObject:GameObject = hitInfo.collider.gameObject;
	    //42
	    
	    Debug.Log(hitObject.name);
	    
	    //Move the object in question
	    //FIND: NEED TO CHANGE SQUAD TO TEAM ONCE WE HAVE A TEAM LIST
	    var isEnemy = true;
	    for (var i:int = 0; i < team.length; ++i)
	    {
	    	//if (team[i] == hitInfo.collider.gameObject.GetComponent("Unit"))
	    	if (team[i] == hitObject.GetComponent("Unit"))
	    	{
	    		Debug.Log("Selected team member");
	    		isEnemy = false;
	    		
	    		if(squad[0] == null || squad[1] == null || squad[2] == null)
	    		{
    				if(hitObject.GetComponent("Unit") != squad[0] && hitObject.GetComponent("Unit") != squad[1] && hitObject.GetComponent("Unit") != squad[2]){
    					if(squad[0] == null) {
    						squad[0] = hitObject.GetComponent("Unit");
    						squad[0].gameObject.transform.position = 
    							GameObject.Find("TeamControlObject").GetComponent(TeamController).sSpawn1;
    						voiceQuote(squad[0],2);
    							
    					}    						
    					else if (squad[1] == null) {
    						squad[1] = hitObject.GetComponent("Unit");
    						squad[1].gameObject.transform.position = 
    							GameObject.Find("TeamControlObject").GetComponent(TeamController).sSpawn2;
    						voiceQuote(squad[1],2);
    						
    					}    						
    					else if (squad[2] == null) {
    						squad[2] = hitObject.GetComponent("Unit");
    						squad[2].gameObject.transform.position = 
    							GameObject.Find("TeamControlObject").GetComponent(TeamController).sSpawn3;
    						voiceQuote(squad[2],2);
    						
    					}
    						
    				}    		
	    		}
	    		break;
	    	}
	    }
	    if (isEnemy)
	    {
	    	Debug.Log("Selected Enemy");
	    	for (i = 0; i < selected.length; ++i)
	    	{
	    		if (selected[i] != null)
		    	{
		    		if (selected[i].GetComponent(Movement).destinationAttack != hitInfo.collider.gameObject) {
	    				selected[i].GetComponent(Movement).destinationAttack = hitInfo.collider.gameObject;
	    				if(GameObject.Find("GameControlObject").GetComponent(GameController).roundNumber > 0)
	    					selected[i].GetComponent(Movement).isMoving = true;
	    				selected[i].GetComponent(Attack).target = hitObject.GetComponent(Unit);
	    			}
	    			this.voiceQuote(selected[i],1);
	    		}
	    	}
	    }
    }
	else
	{
	    //ELSE CHECK FOR POSITION ON LAND
	    //Get the mouse position
	    mousePosition = Input.mousePosition;
	    
	    //Cast it into a ray
	    screenRay = Camera.main.ScreenPointToRay( mousePosition );

	    //Grab the information we need
	    if (Physics.Raycast( screenRay, hitInfo, Mathf.Infinity, Constants.TerrainLayer))
	    {
		    //Note this function also returns a boolean about whether it
		    //And find the point of impact
		    pointOfImpact = hitInfo.point;
		    //42
		    
		    //Move the object in question
		    for (i = 0; i < selected.length; ++i)
		    {
		    	if (selected[i] != null)
		    	{
		    		//selected[i].transform.position = pointOfImpact;
		    		//made this script communicate with the movement script
		    		//TODO: make holding down the mouse constantly update the target point
		    		//TODO: make group move at slowest speed
		    		selected[i].GetComponent(Movement).destination.transform.position = pointOfImpact;
		    		selected[i].GetComponent(Movement).destinationAttack = null;
		    		if(GameObject.Find("GameControlObject").GetComponent(GameController).roundNumber > 0) 
		    			selected[i].GetComponent(Movement).isMoving = true;
		    		selected[i].GetComponent(Attack).target = null;
		    		selected[i].GetComponent(Attack).isAttacking = false;
		    		selected[i].GetComponent(Attack).attackCounter = 0;
		    		this.voiceQuote(selected[i],0);
		    	}
		    }
	    }
    }
}


function Mouse2DownDrag(screenPosition : Vector2) {
	//Get the mouse position
	/*
    var mousePosition : Vector3 = Input.mousePosition;
    
    //Cast it into a ray
    var screenRay : Ray = Camera.main.ScreenPointToRay( mousePosition );
    
    //Initializing some variables
    var hitInfo : RaycastHit;
    
    //Grab the information we need
    if (Physics.Raycast( screenRay, hitInfo, Mathf.Infinity, Constants.TerrainLayer))
    {
	    //Note this function also returns a boolean about whether it
	    //And find the point of impact
	    var pointOfImpact : Vector3 = hitInfo.point;
	    //42
	    
	    //Move the object in question
	    for (var i:int = 0; i < selected.length; ++i)
	    {
	    	if (selected[i] != null)
	    	{
	    		//selected[i].transform.position = pointOfImpact;
	    		//made this script communicate with the movement script
	    		//TODO: make holding down the mouse constantly update the target point
	    		//TODO: make group move at slowest speed
	    		selected[i].GetComponent(Movement).destination.transform.position = pointOfImpact;
				selected[i].GetComponent(Movement).destinationAttack = null;
	    		if(GameObject.Find("GameControlObject").GetComponent(GameController).roundNumber > 0) 
	    			selected[i].GetComponent(Movement).isMoving = true;
	    	}
	    }
    }*/
}

//BASIC EXPLANATION OF FUNCTION:
//   Each key (1-3) has a BOOLEAN FLAG for whether it "counts" as having been hit
//   within the buffer, as well as an INT cooldown-timer, which ticks up to the buffer
//   number of frames (game loops).  Each game loop, if the key has been hit, the flag is set and the
//   cooldown reset to 0.  If the key press times out, the button no longer "counts" as
//   being pressed for the current game loop.  Each turn a key was pressed, the chords are detected
//   among the keys that "count" as having been pressed.  This way, one doesn't have to press all the
//   buttons on *exactly* the same frame to select the units together.
function doKeySelect(){
	//selection by key inputs (1-3)
	var oneKey = Input.GetKeyDown(KeyCode.Alpha1);
	var twoKey = Input.GetKeyDown(KeyCode.Alpha2);
	var threeKey = Input.GetKeyDown(KeyCode.Alpha3);
	//reset key cooldowns and update key booleans if pressed
	//   else increment their cooldowns and check for timeout
	if (oneKey) {
		one = true;
		oneCooldown = 0;
	} else {
		if (one){
			oneCooldown++;
			if (oneCooldown == keySelectInputBuffer){
				one = false;
			}
		}
	}
	if (twoKey) {
		two = true;
		twoCooldown = 0;
	} else {
		if (two){
			twoCooldown++;
			if (twoCooldown == keySelectInputBuffer){
				two = false;
			}
		}
	}
	if (threeKey) {
		three = true;
		threeCooldown = 0;
	} else {
		if(three){
			threeCooldown++;
			if (threeCooldown == keySelectInputBuffer){
				three = false;
			}
		}
	}
	//chord processing
	if (oneKey || twoKey || threeKey){
		Debug.Log(one + ", " + two + ", " + three);
		var index = 0;
		if (one) {
			selected[index] = squad[0];
			selectIndicators[index].lockedUnit = squad[0];
			index++;
			//voiceQuote(squad[0],2);
		}
		if (two) {
			selected[index] = squad[1];
			selectIndicators[index].lockedUnit = squad[1];
			index++;
			//voiceQuote(squad[1],2);
		}
		if (three) {
			selected[index] = squad[2];
			selectIndicators[index].lockedUnit = squad[2];
			index++;
			//voiceQuote(squad[2],2);
		}
		for(; index < 3; index++){
			selectIndicators[index].lockedUnit = null;
			selected[index] = null;
		}
	}
	
}

function IsInRange(v1 : Vector2, v2 : Vector2) : boolean {
	var dist = Vector2.Distance(v1, v2);
	//print("Right click release button distance: " + dist);
	if (Vector2.Distance(v1, v2) < mouseButtonReleaseBlurRange) {
		return true;
	}
	return false;
}

function ClearSelectedUnitsList()
{
	selected[0] = null;
	selected[1] = null;
	selected[2] = null;
	selectIndicators[0].lockedUnit = null;
	selectIndicators[1].lockedUnit = null;
	selectIndicators[2].lockedUnit = null;
}

//Finds all Squad Units within the bounding box, projected onto the play field.
function SelectUnitsInArea(point1 : Vector3, point2 : Vector3) {
	
	if (point2.x < point1.x) {
		// swap x positions. Selection rectangle is beeing drawn from right to left
		var x1 = point1.x;
		var x2 = point2.x;
		point1.x = x2;
		point2.x = x1;
	}
	
	if (point2.z > point1.z) {
		// swap z positions. Selection rectangle is beeing drawn from bottom to top
		var z1 = point1.z;
		var z2 = point2.z;
		point1.z = z2;
		point2.z = z1;
	}
	
	for (var go : Unit in squad) {
		if(go != null) {
			var goPos : Vector3 = go.transform.position;
			//print("goPos:" + goPos + " 1:" + point1 + " 2:" + point2);
			//Debug.Log("["+goPos.x +", "+goPos.z+"], ["+point1.x+", "+point1.z+"], ["+point2.x+", "+point2.z+"]");
			if (goPos.x >= point1.x && goPos.x <= point2.x && goPos.z <= point1.z && goPos.z >= point2.z) {
				for (var i:int = 0; i < 3; ++i)
				{
					if (selected[i] == null)
					{
						selected[i] = go;
						selectIndicators[i].lockedUnit = go;
						//voiceQuote(go,2);
						break;
					}
				}
					
				//go.SendMessage("SetUnitSelected", true);
			}
		}
		
	}
}

	function selectUnit0(Unit : Unit){
		selected[0] = Unit;
		selectIndicators[0].lockedUnit = Unit;
		Unit.isSelected = true;
		//voiceQuote(Unit,2);
	}
	
	function selectUnit1(Unit : Unit){
		selected[1] = Unit;
		selectIndicators[1].lockedUnit = Unit;
		Unit.isSelected = true;
		//voiceQuote(Unit,2);
	}
	
	function selectUnit2(Unit : Unit){
		selected[2] = Unit;
		selectIndicators[2].lockedUnit = Unit;
		Unit.isSelected = true;
		//voiceQuote(Unit,2);
	}

function OnGUI() {
	if (mouseLeftDrag) {
		
		var width : int = mouseButton1UpPoint.x - mouseButton1DownPoint.x;
		var height : int = (Screen.height - mouseButton1UpPoint.y) - (Screen.height - mouseButton1DownPoint.y);
		var rect : Rect = Rect(mouseButton1DownPoint.x, Screen.height - mouseButton1DownPoint.y, width, height);
		GUI.DrawTexture (rect, selectionTexture, ScaleMode.StretchToFill, true);
	}
}

function doControlCheck(){
	//if we press the magical switch key
	/*
	if(Input.GetKeyDown(CONTROL_SWITCH_KEY)){
		locallyControlled = !locallyControlled;
		ClearSelectedUnitsList();
	}
	*/
	
}

function playHelloQuote(Unit : Unit){

	//Don't play quote if a quote has been played recently.
	if (SoundRegulatorScript.cooldown<1){
		if (Unit.owner==Faction.Ninjas && Network.isClient){
		
		}
		unitClass=Unit.GetComponent(Class).classType;
		faction=Unit.owner;
		
		//Pirate quotes
		if (SoundRegulatorScript.isLocalPlayerPirates){
			if (unitClass==UnitClass.LightClass)
				audio.PlayOneShot(pirateLightHello);
			else if (unitClass==UnitClass.MediumClass)
				audio.PlayOneShot(pirateMediumHello);
			else if (unitClass==UnitClass.HeavyClass)
				audio.PlayOneShot(pirateHeavyHello);
		} else {
		
		//Ninja quotes
		if (unitClass==UnitClass.LightClass)
		audio.PlayOneShot(ninjaLightHello);
		else if (unitClass==UnitClass.MediumClass)
		audio.PlayOneShot(ninjaMediumHello);
		else if (unitClass==UnitClass.HeavyClass)
		audio.PlayOneShot(ninjaHeavyHello);
	}
	
	//This value is used twice in 'TeamSelector.js' if it needs to be edited.
	SoundRegulatorScript.cooldown=250;
	}
	}
	
	//play sound effect
	//soundType:
	//0 = movement
	//1 = attack
	//2 = select
function voiceQuote(Unit : Unit, soundType:int){

	if ((SoundRegulatorScript.cooldown<1 || soundType == 2) && Unit.owner!=Faction.Neutral){
	//assign the appropriate sound clip
	// if the unit is not attacking, play 'move' quote.
		if (soundType == 0){
			if (Unit.owner==Faction.Ninjas && Network.isClient){
				if (Unit.GetComponent(Class).classType==UnitClass.LightClass)
					audio.clip = ninjaLightMove;
				else if (Unit.GetComponent(Class).classType==UnitClass.MediumClass)
					audio.clip = ninjaMediumMove;
				else if (Unit.GetComponent(Class).classType==UnitClass.HeavyClass)
					audio.clip = ninjaHeavyMove;
			} else if (Unit.owner==Faction.Pirates && Network.isServer){
				if (Unit.GetComponent(Class).classType==UnitClass.LightClass)
				audio.clip = pirateLightMove;
				else if (Unit.GetComponent(Class).classType==UnitClass.MediumClass)
				audio.clip = pirateMediumMove;
				else if (Unit.GetComponent(Class).classType==UnitClass.HeavyClass)
				audio.clip = pirateHeavyMove;
			}
		} else if (soundType == 1){
			// if the unit is attacking, play 'attack' quote.
			if (Unit.owner==Faction.Ninjas && Network.isClient){
				if (Unit.GetComponent(Class).classType==UnitClass.LightClass)
					audio.clip = ninjaLightAttack;
				else if (Unit.GetComponent(Class).classType==UnitClass.MediumClass)
					audio.clip = ninjaMediumAttack;
				else if (Unit.GetComponent(Class).classType==UnitClass.HeavyClass)
					audio.clip = ninjaHeavyAttack;
			} else if (Unit.owner==Faction.Pirates && Network.isServer){
				if (Unit.GetComponent(Class).classType==UnitClass.LightClass)
					audio.clip = pirateLightAttack;
				else if (Unit.GetComponent(Class).classType==UnitClass.MediumClass)
					audio.clip = pirateMediumAttack;
				else if (Unit.GetComponent(Class).classType==UnitClass.HeavyClass)
					audio.clip = pirateHeavyAttack;
			}
		} else if (soundType == 2){
			// if the unit is attacking, play 'select' quote.
			if (Unit.owner==Faction.Ninjas && Network.isClient){
				if (Unit.GetComponent(Class).classType==UnitClass.LightClass)
					audio.clip = ninjaLightHello;
				else if (Unit.GetComponent(Class).classType==UnitClass.MediumClass)
					audio.clip = ninjaMediumHello;
				else if (Unit.GetComponent(Class).classType==UnitClass.HeavyClass)
					audio.clip = ninjaHeavyHello;
			} else if (Unit.owner==Faction.Pirates && Network.isServer){
				if (Unit.GetComponent(Class).classType==UnitClass.LightClass)
					audio.clip = pirateLightHello;
				else if (Unit.GetComponent(Class).classType==UnitClass.MediumClass)
					audio.clip = pirateMediumHello;
				else if (Unit.GetComponent(Class).classType==UnitClass.HeavyClass)
					audio.clip = pirateHeavyHello;
			}
		}
		Debug.Log("SoundType: "+ soundType +" FromNinja: "+(Unit.owner==Faction.Ninjas) +" PlayerPirate: "+Network.isServer);
		audio.Play();
		//This value is used twice in 'TeamSelector.js' if it needs to be edited.
		SoundRegulatorScript.cooldown=250;
	}
}

/*function OnSerializeNetworkView(stream:BitStream, info:NetworkMessageInfo) {

	/*var unit1:NetworkViewID;
	var unit1ID:int;
	var unit2:NetworkViewID;
	var unit2ID:int;
	var unit3:NetworkViewID;
	var unit3ID:int;
	var unit4:NetworkViewID;
	var unit4ID:int;
	var unit5:NetworkViewID;
	var unit5ID:int;
	var unit6:NetworkViewID;
	var unit6ID:int;
	var unit7:NetworkViewID;
	var unit7ID:int;
	
	if (stream.isWriting) {	
	
		/*if (!Network.isServer) {
			unit1 = GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).team[0].gameObject.networkView.viewID;
			Debug.Log("Sent NetworkView:  " + unit1);
			unit2 = GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).team[1].gameObject.networkView.viewID;
			Debug.Log("Sent NetworkView:  " + unit2);
			unit3 = GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).team[2].gameObject.networkView.viewID;
			Debug.Log("Sent NetworkView:  " + unit3);
			unit4 = GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).team[3].gameObject.networkView.viewID;
			Debug.Log("Sent NetworkView:  " + unit4);
			unit5 = GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).team[4].gameObject.networkView.viewID;
			Debug.Log("Sent NetworkView:  " + unit5);
			unit6 = GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).team[5].gameObject.networkView.viewID;
			Debug.Log("Sent NetworkView:  " + unit6);
			unit7 = GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).team[6].gameObject.networkView.viewID;
			Debug.Log("Sent NetworkView:  " + unit7);
		}
		if(Network.isServer) {
			unit1 = GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).team[0].gameObject.networkView.viewID;
			Debug.Log("Sent NetworkView:  " + unit1);
			unit2 = GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).team[1].gameObject.networkView.viewID;
			Debug.Log("Sent NetworkView:  " + unit2);
			unit3 = GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).team[2].gameObject.networkView.viewID;
			Debug.Log("Sent NetworkView:  " + unit3);
			unit4 = GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).team[3].gameObject.networkView.viewID;
			Debug.Log("Sent NetworkView:  " + unit4);
			unit5 = GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).team[4].gameObject.networkView.viewID;
			Debug.Log("Sent NetworkView:  " + unit5);
			unit6 = GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).team[5].gameObject.networkView.viewID;
			Debug.Log("Sent NetworkView:  " + unit6);
			unit7 = GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).team[6].gameObject.networkView.viewID;
			Debug.Log("Sent NetworkView:  " + unit7);
		}*/
		/*
		Debug.Log(team[0].unitID+" "+team[0]);
		if(team[0].unitID != 0) {
			unit1 = team[0].gameObject.networkView.viewID;
			Debug.Log(unit1);
			unit1ID = team[0].unitID;
			stream.Serialize(unit1);
			stream.Serialize(unit1ID);
		}
		
		if(team[1].unitID != 0) {
			unit2 = team[1].gameObject.networkView.viewID;
			unit2ID = team[1].unitID;
			stream.Serialize(unit2);
			stream.Serialize(unit2ID);
		}
		
		if(team[2].unitID != 0) {
			unit3 = team[2].gameObject.networkView.viewID;
			unit3ID = team[2].unitID;
			stream.Serialize(unit3);
			stream.Serialize(unit3ID);
		}
		
		if(team[3].unitID != 0) {
			unit4 = team[3].gameObject.networkView.viewID;
			unit4ID = team[3].unitID;
			stream.Serialize(unit4);
			stream.Serialize(unit4ID);
		}
		
		if(team[4].unitID != 0) {
			unit5 = team[4].gameObject.networkView.viewID;
			unit5ID = team[4].unitID;
			stream.Serialize(unit5);
			stream.Serialize(unit5ID);
		}
		
		if(team[5].unitID != 0) {
			unit6 = team[5].gameObject.networkView.viewID;
			unit6ID = team[5].unitID;
			stream.Serialize(unit6);
			stream.Serialize(unit6ID);
		}
		
		if(team[6].unitID != 0) {
			unit7 = team[6].gameObject.networkView.viewID;
			unit7ID = team[6].unitID;
			stream.Serialize(unit7);
			stream.Serialize(unit7ID);
		}
		
		
		
		/*unit2 = team[1].gameObject.networkView.viewID;
		unit3 = team[2].gameObject.networkView.viewID;
		unit4 = team[3].gameObject.networkView.viewID;
		unit5 = team[4].gameObject.networkView.viewID;
		unit6 = team[5].gameObject.networkView.viewID;
		unit7 = team[6].gameObject.networkView.viewID;
		unit1ID = team[0].unitID;
		unit2ID = team[1].unitID;
		unit3ID = team[2].unitID;
		unit4ID = team[3].unitID;
		unit5ID = team[4].unitID;
		unit6ID = team[5].unitID;
		unit7ID = team[6].unitID;
		
		
		
		stream.Serialize(unit1);
		stream.Serialize(unit2);
		stream.Serialize(unit3);
		stream.Serialize(unit4);
		stream.Serialize(unit5);
		stream.Serialize(unit6);
		stream.Serialize(unit7);
		stream.Serialize(unit1ID);
		stream.Serialize(unit2ID);
		stream.Serialize(unit3ID);
		stream.Serialize(unit4ID);
		stream.Serialize(unit5ID);
		stream.Serialize(unit6ID);
		stream.Serialize(unit7ID);*/
		/*
	} else {
		stream.Serialize(unit1);
		stream.Serialize(unit1ID);
		stream.Serialize(unit2);
		stream.Serialize(unit2ID);
		stream.Serialize(unit3);
		stream.Serialize(unit3ID);
		stream.Serialize(unit4);
		stream.Serialize(unit4ID);
		stream.Serialize(unit5);
		stream.Serialize(unit5ID);
		stream.Serialize(unit6);
		stream.Serialize(unit6ID);
		stream.Serialize(unit7);
		stream.Serialize(unit7ID);
		
		
		Debug.Log("rec: " + unit1);
		
		
		
		if(unit1ID == 1)
			GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).team[0] = NetworkView.Find(unit1).gameObject.GetComponent(Unit);
		else 
			GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).team[0] = NetworkView.Find(unit1).gameObject.GetComponent(Unit);
			
		if(unit2ID == 2)
			GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).team[1] = NetworkView.Find(unit1).gameObject.GetComponent(Unit);
		else 
			GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).team[1] = NetworkView.Find(unit1).gameObject.GetComponent(Unit);
		
		if(unit3ID == 3)
			GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).team[2] = NetworkView.Find(unit1).gameObject.GetComponent(Unit);
		else 
			GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).team[2] = NetworkView.Find(unit1).gameObject.GetComponent(Unit);
		
		if(unit4ID == 4)
			GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).team[3] = NetworkView.Find(unit1).gameObject.GetComponent(Unit);
		else 
			GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).team[3] = NetworkView.Find(unit1).gameObject.GetComponent(Unit);
		
		if(unit5ID == 5)
			GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).team[4] = NetworkView.Find(unit1).gameObject.GetComponent(Unit);
		else 
			GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).team[4] = NetworkView.Find(unit1).gameObject.GetComponent(Unit);
		
		if(unit6ID == 6)
			GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).team[5] = NetworkView.Find(unit1).gameObject.GetComponent(Unit);
		else 
			GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).team[5] = NetworkView.Find(unit1).gameObject.GetComponent(Unit);
			
		if(unit7ID == 7)
			GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).team[6] = NetworkView.Find(unit1).gameObject.GetComponent(Unit);
		else 
			GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).team[6] = NetworkView.Find(unit1).gameObject.GetComponent(Unit);
		
		/* if(Network.isServer){
			GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).team[0] = NetworkView.Find(unit1).gameObject.GetComponent(Unit);
			Debug.Log("Recieved NetworkView: " + unit1);
			GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).team[1] = NetworkView.Find(unit2).gameObject.GetComponent(Unit);
			Debug.Log("Recieved NetworkView: " + unit1);
			GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).team[2] = NetworkView.Find(unit3).gameObject.GetComponent(Unit);
			Debug.Log("Recieved NetworkView: " + unit1);
			GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).team[3] = NetworkView.Find(unit4).gameObject.GetComponent(Unit);
			Debug.Log("Recieved NetworkView: " + unit1);
			GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).team[4] = NetworkView.Find(unit5).gameObject.GetComponent(Unit);
			Debug.Log("Recieved NetworkView: " + unit1);
			GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).team[5] = NetworkView.Find(unit6).gameObject.GetComponent(Unit);
			Debug.Log("Recieved NetworkView: " + unit1);
			GameObject.Find("TeamSelector_N").GetComponent(TeamSelector).team[6] = NetworkView.Find(unit7).gameObject.GetComponent(Unit);
			Debug.Log("Recieved NetworkView: " + unit1);
		} 
		if(!Network.isServer){
			GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).team[0] = NetworkView.Find(unit1).gameObject.GetComponent(Unit);
			Debug.Log("Recieved NetworkView: " + unit1);
			GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).team[1] = NetworkView.Find(unit2).gameObject.GetComponent(Unit);
			Debug.Log("Recieved NetworkView: " + unit1);
			GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).team[2] = NetworkView.Find(unit3).gameObject.GetComponent(Unit);
			Debug.Log("Recieved NetworkView: " + unit1);
			GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).team[3] = NetworkView.Find(unit4).gameObject.GetComponent(Unit);
			Debug.Log("Recieved NetworkView: " + unit1);
			GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).team[4] = NetworkView.Find(unit5).gameObject.GetComponent(Unit);
			Debug.Log("Recieved NetworkView: " + unit1);
			GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).team[5] = NetworkView.Find(unit6).gameObject.GetComponent(Unit);
			Debug.Log("Recieved NetworkView: " + unit1);
			GameObject.Find("TeamSelector_P").GetComponent(TeamSelector).team[6] = NetworkView.Find(unit7).gameObject.GetComponent(Unit);
			Debug.Log("Recieved NetworkView: " + unit1);
		}
		
		*/
			
		
//	}
	
	

//}