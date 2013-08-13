#pragma strict

//Style
var customGuiStyle : GUIStyle;
var gangamStyle : GUIStyle;
var selectorStyle : GUIStyle;
var bawssStyle : GUIStyle;
var pirateStyle : GUIStyle;
var ninjaStyle : GUIStyle;

//Click Sound
var click : AudioClip;

//Skins
var pirateSkin : GUISkin;
var ninjaSkin : GUISkin;

//Controllers
var GameControlObject : GameObject;
var ninjaController : GameObject;
var pirateController : GameObject;
var boss : GameObject;

//Remaining time
var minutesLeft : String;
var secondsLeft : String;
var intSeconds : int;
var intMinutes : int;

//Score
var currentScore : String;
var bossDeficit : float;

//Cursor Textures
var cursorImage : Texture;
var normalCursor : Texture;
var moveCursor : Texture;
var captureCursor : Texture;
var attackCursor : Texture;

//Cursor Textures - Pirate
var PnormalCursor : Texture;
var PmoveCursor : Texture;
var PcaptureCursor : Texture;
var PattackCursor : Texture;

//Cursor Textures - Ninja
var NnormalCursor : Texture;
var NmoveCursor : Texture;
var NcaptureCursor : Texture;
var NattackCursor : Texture;

//Bars
var ninjaBar : Texture;
var pirateBar : Texture;

//Portraits
var lightIcon : Texture;
var mediumIcon : Texture;
var heavyIcon : Texture;
var emptyIcon : Texture;
var port1 : Texture;
var port2 : Texture;
var port3 : Texture;

//Ninja Portraits
var n_light_1 : Texture;
var n_light_2 : Texture;
var n_light_3 : Texture;

var n_med_1 : Texture;
var n_med_2 : Texture;
var n_med_3 : Texture;

var n_hvy_1 : Texture;
var n_hvy_2 : Texture;
var n_hvy_3 : Texture;

//Pirate Portraits
var p_light_1 : Texture;
var p_light_2 : Texture;
var p_light_3 : Texture;

var p_med : Texture;

var p_hvy_1 : Texture;
var p_hvy_2 : Texture;
var p_hvy_3 : Texture;



//Booleans
var typingBox : boolean;
var updateBox : boolean;

//String for Team
var currentTeam : String;

//Chatbox
var chatString : String;
var textField = new Array ("", "", "", "", "", "", "", "", "Welcome to NiRPS");

//Winner Variable
var winner : String;

//Cameras
var mainCam : Camera;
var mapCam : Camera;
var winCam : Camera;


function Start () {

	//Hide Wincam Right Away
	winCam.active = false;

	//Hide Hardware Cursor
	Screen.showCursor = false;
	
	//Typing Box Off
	typingBox = false;
	updateBox = true;

	//Instantiate vars
	minutesLeft = "ZED";
	secondsLeft = "ZED";
	currentScore = "ZED";
	currentTeam = "ZED";
	
	//Empty Portraits
	port1 = emptyIcon;
	port2 = emptyIcon;
	port3 = emptyIcon;
	
	//No Winner Yet
	winner = "none";

}

function Update () {


	//Continue Hiding Cursor
	Screen.showCursor = false;
	
	//Check TypingBox
	if (Input.GetKeyDown(KeyCode.Return)){
		if(typingBox == false){
			typingBox = true;
			updateBox = true;
		} else {
			typingBox = false;
		}
	}//end typingbox check
	
	//Boss Health Deficit Ratio Calculation
	if(boss != null){
	bossDeficit = (boss.GetComponent(Unit).currentHealth);
	bossDeficit = bossDeficit/(boss.GetComponent(Class).BossMaxHp);
	}

	//Time Remaining calculations
	intSeconds = (Mathf.Round(GameControlObject.GetComponent(GameController).timeRemaining)%60);
	intMinutes = (Mathf.FloorToInt((Mathf.Round(GameControlObject.GetComponent(GameController).timeRemaining))/60));
	
	secondsLeft = intSeconds.ToString();
	minutesLeft = intMinutes.ToString();
	
	//Add 0's
	if(intSeconds < 10){
		secondsLeft = "0"+secondsLeft;
	}//endif
	
	if(intMinutes < 10){
		minutesLeft = "0"+minutesLeft;
	}//endif
	
	//Score Getter
	if(ninjaController.GetComponent(TeamSelector).locallyControlled){
		currentScore = (GameControlObject.GetComponent(GameController).player1Score).ToString();
		currentTeam = "ninja";
	}else if(pirateController.GetComponent(TeamSelector).locallyControlled){
		currentScore = (GameControlObject.GetComponent(GameController).player2Score).ToString();
		currentTeam = "pirate";
	}//endIfElse
	
	//Set font size
	customGuiStyle.fontSize = (Mathf.Sqrt(Screen.width^2/Screen.height^2))*0.55;
	
	//Set Portraits
	if(currentTeam == "pirate"){
		//Portrait1
		if(pirateController.GetComponent(TeamSelector).squad[0] != null){
			if(pirateController.GetComponent(TeamSelector).squad[0].GetComponent(Class).classType == UnitClass.HeavyClass){
				port1 = p_hvy_1;
			}else if(pirateController.GetComponent(TeamSelector).squad[0].GetComponent(Class).classType == UnitClass.MediumClass){
				port1 = p_med;
			}else{
				port1 = p_light_1;
			}
		}else{
			port1 = emptyIcon;
		}//endif
		//Portrait2
		if(pirateController.GetComponent(TeamSelector).squad[1] != null){
			if(pirateController.GetComponent(TeamSelector).squad[1].GetComponent(Class).classType == UnitClass.HeavyClass){
				port2 = p_hvy_2;
			}else if(pirateController.GetComponent(TeamSelector).squad[1].GetComponent(Class).classType == UnitClass.MediumClass){
				port2 = p_med;
			}else{
				port2 = p_light_2;
			}
		}else{
			port2 = emptyIcon;
		}//endif
		//Portrait3
		if(pirateController.GetComponent(TeamSelector).squad[2] != null){
			if(pirateController.GetComponent(TeamSelector).squad[2].GetComponent(Class).classType == UnitClass.HeavyClass){
				port3 = p_hvy_3;
			}else if(pirateController.GetComponent(TeamSelector).squad[2].GetComponent(Class).classType == UnitClass.MediumClass){
				port3 = p_med;
			}else{
				port3 = p_light_3;
			}
		}else{
			port3 = emptyIcon;
		}//endif
	}else if (currentTeam == "ninja"){
		//Portrait1
		if(ninjaController.GetComponent(TeamSelector).squad[0] != null){
			if(ninjaController.GetComponent(TeamSelector).squad[0].GetComponent(Class).classType == UnitClass.HeavyClass){
				port1 = n_hvy_1;
			}else if(ninjaController.GetComponent(TeamSelector).squad[0].GetComponent(Class).classType == UnitClass.MediumClass){
				port1 = n_med_1;
			}else{
				port1 = n_light_1;
			}
		}else{
			port1 = emptyIcon;
		}//endif
		//Portrait2
		if(ninjaController.GetComponent(TeamSelector).squad[1] != null){
			if(ninjaController.GetComponent(TeamSelector).squad[1].GetComponent(Class).classType == UnitClass.HeavyClass){
				port2 = n_hvy_2;
			}else if(ninjaController.GetComponent(TeamSelector).squad[1].GetComponent(Class).classType == UnitClass.MediumClass){
				port2 = n_med_2;
			}else{
				port2 = n_light_2;
			}
		}else{
			port2 = emptyIcon;
		}//endif
		//Portrait3
		if(ninjaController.GetComponent(TeamSelector).squad[2] != null){
			if(ninjaController.GetComponent(TeamSelector).squad[2].GetComponent(Class).classType == UnitClass.HeavyClass){
				port3 = n_hvy_3;
			}else if(ninjaController.GetComponent(TeamSelector).squad[2].GetComponent(Class).classType == UnitClass.MediumClass){
				port3 = n_med_3;
			}else{
				port3 = n_light_3;
			}
		}else{
			port3 = emptyIcon;
		}//endif
	}//endElseIf
	
	//Change Cursor
	var mousePosition : Vector3 = Input.mousePosition;
	if(Camera.main != null){
    	var screenRay : Ray = Camera.main.ScreenPointToRay( mousePosition );
    }
    var hitInfo : RaycastHit;
    if((currentTeam == "ninja" && ninjaController.GetComponent(TeamSelector).hasSelections()) || (currentTeam == "pirate" && pirateController.GetComponent(TeamSelector).hasSelections())){ 
	    if(Physics.Raycast(screenRay, hitInfo, Mathf.Infinity, Constants.UnitLayer)){
	    	if(currentTeam == "pirate"){
	    		cursorImage = PattackCursor;
		    }else if(currentTeam == "ninja"){
		    	cursorImage = NattackCursor;
		    }else{
		    	cursorImage = attackCursor;
		    }
	    }else if(Physics.Raycast(screenRay, hitInfo, Mathf.Infinity, Constants.CaptureLayer)){
	    	if(currentTeam == "pirate"){
	    		cursorImage = PcaptureCursor;
		    }else if(currentTeam == "ninja"){
		    	cursorImage = NcaptureCursor;
		    }else{
		    	cursorImage = captureCursor;
		    }
	    }else if(Physics.Raycast(screenRay, hitInfo, Mathf.Infinity, Constants.TerrainLayer)){
	    	if(currentTeam == "pirate"){
	    		cursorImage = PmoveCursor;
		    }else if(currentTeam == "ninja"){
		    	cursorImage = NmoveCursor;
		    }else{
		    	cursorImage = moveCursor;
		    }
	    }//endNestedIfs
    }else{
    if(currentTeam == "pirate"){
    	cursorImage = PnormalCursor;
    }else if(currentTeam == "ninja"){
    	cursorImage = NnormalCursor;
    }else{
    	cursorImage = normalCursor;
    }
    }//endIfs
    
}

function OnGUI () {

if(winner == "none"){

	//Set GUI depth to backmost position
	GUI.depth = 0;
	
	//Set Faction Appropriate Skin
	if(currentTeam == "pirate"){
		GUI.skin = pirateSkin;
	}else if(currentTeam == "ninja"){
		GUI.skin = ninjaSkin;
	}
	
	//Upper Screen Items
	
	//Boss Health Bar
	GUI.Box (Rect (Screen.width/4.3,1,Screen.width/1.87,15), "", GUI.skin.GetStyle("Clock"));
	GUI.Box (Rect (Screen.width/4,2.5,(Screen.width/2)*(bossDeficit),11), "", bawssStyle);
	
	// Time Remaining Box
	GUI.Box (Rect ((Screen.width/2)-((Screen.width/13.66)/2),17,Screen.width/13.66,24), minutesLeft+":"+secondsLeft, GUI.skin.GetStyle("Clock"));
	
	//Score Box 1
	GUI.Box (Rect (1.5+(((Screen.width/2)-((Screen.width/13.66)/2))+Screen.width/13.66)-1.75*(Screen.width/10)-1,17,(Screen.width/10),20), "", GUI.skin.GetStyle("Backing"));
	GUI.Box (Rect (1.5+(((Screen.width/2)-((Screen.width/13.66)/2))+Screen.width/13.66)-1.75*(Screen.width/10)-1,17,(Screen.width/10),20), (GameControlObject.GetComponent(GameController).player1Score).ToString());
	
	//Score Box 2
	GUI.Box (Rect (2+(((Screen.width/2)-((Screen.width/13.66)/2))+Screen.width/13.66),17,(Screen.width/10),20), "", GUI.skin.GetStyle("Backing"));
	GUI.Box (Rect (2+(((Screen.width/2)-((Screen.width/13.66)/2))+Screen.width/13.66),17,(Screen.width/10),20), (GameControlObject.GetComponent(GameController).player2Score).ToString());
	
	//Prematch Bar
	if(!GameControlObject.GetComponent(GameController).gameStart){
	GUI.Box (Rect (Screen.width/4.3,1,Screen.width/1.87,40), "", GUI.skin.GetStyle("Clock"));
		GUI.Box (Rect (Screen.width/4.3,1,Screen.width/1.87,40), "Welcome to the Arena! [Rightclick] On Team Members to Select a 3 Player Squad! Match Begins In: "+GameControlObject.GetComponent(GameController).timeRemaining, gangamStyle);
		//GUI.Box (Rect (Screen.width/4,2.5,(Screen.width/2)*(bossDeficit),11), "Poop");
	}
	
	//Lower Screen Items
	
	/*
	//Chat Subsystem
	//Chat Box
		GUI.TextArea (Rect (3,Screen.height-125,200,124), textField[1]+"\n"+textField[2]+"\n"+textField[3]+"\n"+textField[4]+"\n"+textField[5]+"\n"+textField[6]+"\n"+textField[7]+"\n"+textField[8]);
		GUI.Box (Rect (2,Screen.height-126,200,124), "");
	//Message Box
	Input.eatKeyPressOnTextFieldFocus = false;
	if(typingBox){
		GUI.Box (Rect (2,Screen.height-152,200,25), "", GUI.skin.GetStyle("Backing"));
	}
	GUI.SetNextControlName ("MyTextField");
	textField[0] = GUI.TextField (Rect (2,Screen.height-152,200,25), textField[0]);
	GUI.Label(new Rect(-100, -100, 1, 1), "");
		if(typingBox){
		  		GUI.FocusControl("MyTextField");
		  		if(Input.GetKeyDown(KeyCode.Return)){
		  			GUIUtility.keyboardControl = 0;
		  			if(updateBox){
		  			textField[8] = textField[7];
		  			textField[7] = textField[6];
		  			textField[6] = textField[5];
		  			textField[5] = textField[4];
		  			textField[4] = textField[3];
		  			textField[3] = textField[2];
		  			textField[2] = textField[1];
		  			chatString = textField[0];
		  			chatString = chatString.Replace("\n","");
		  			textField[1] = chatString;
		  			textField[0] = "";
		  			updateBox = false;
		  			}
		  		}
		  	}
		  	*/
	
	
	//Minimap Subsystem
	//Minimap Box
	
	var mapStartX:double = (Screen.width/7)*6;
    var mapStartY:double = (Screen.height/7)*5.45;
    var mapWide:double = (Screen.width/7.1);
    var mapHigh:double = Screen.height/4.4;
	
    GUI.Box (Rect (mapStartX,mapStartY,mapWide,mapHigh), "", GUI.skin.GetStyle("Map"));
    
    if (Input.GetButtonDown("Fire1")) {
    	var mouseX:double = Input.mousePosition.x - mapStartX;
    	var mouseY:double = Screen.height - Input.mousePosition.y - mapStartY;
    	
    	Debug.Log("button down");
    	Debug.Log("Mouse: "+mouseX+", "+mouseY);
    	Debug.Log("Box  : "+mapWide+", "+mapHigh);
		if (mouseX > 0 && mouseX < mapWide && mouseY > 0 && mouseY < mapHigh) {
				GameObject.Find("CameraFocus").GetComponent(typeof(CameraMovement)).moveOnMiniMap(mouseX/mapWide,mouseY/mapHigh);
		}
	}
	
	//Portraits
	//1
	if (GUI.Button (Rect (Screen.width/2-167,Screen.height-121, 120, 120), port1)) {
		if(currentTeam == "pirate"){
			if(pirateController.GetComponent(TeamSelector).squad[0] != null){
				pirateController.GetComponent(TeamSelector).selectUnit0(pirateController.GetComponent(TeamSelector).squad[0]);
			}
		//pirateController.GetComponent(TeamSelector).raycastme = true;
		}else if (currentTeam == "ninja"){
			if(ninjaController.GetComponent(TeamSelector).squad[0] != null){
				ninjaController.GetComponent(TeamSelector).selectUnit0(ninjaController.GetComponent(TeamSelector).squad[0]);
			}
		}
		audio.PlayOneShot(click);
	}//endif
	GUI.Label (Rect (Screen.width/2-167,Screen.height-121, 120, 120), "  1");

	
	//2
	if (GUI.Button (Rect (Screen.width/2-46,Screen.height-121, 120, 120), port2)) {
			if(currentTeam == "pirate"){
			if(pirateController.GetComponent(TeamSelector).squad[1] != null){
				pirateController.GetComponent(TeamSelector).selectUnit1(pirateController.GetComponent(TeamSelector).squad[1]);
			}
		//pirateController.GetComponent(TeamSelector).raycastme = true;
		}else if (currentTeam == "ninja"){
			if(ninjaController.GetComponent(TeamSelector).squad[1] != null){
				ninjaController.GetComponent(TeamSelector).selectUnit1(ninjaController.GetComponent(TeamSelector).squad[1]);
			}
		}
		audio.PlayOneShot(click);
	}
	GUI.Label (Rect (Screen.width/2-46,Screen.height-121, 120, 120), "  2");
	
	//3
	if (GUI.Button (Rect (Screen.width/2+75,Screen.height-121, 120, 120), port3)) {
			if(currentTeam == "pirate"){
			if(pirateController.GetComponent(TeamSelector).squad[2] != null){
				pirateController.GetComponent(TeamSelector).selectUnit2(pirateController.GetComponent(TeamSelector).squad[2]);
			}
		//pirateController.GetComponent(TeamSelector).raycastme = true;
		}else if (currentTeam == "ninja"){
			if(ninjaController.GetComponent(TeamSelector).squad[2] != null){
				ninjaController.GetComponent(TeamSelector).selectUnit2(ninjaController.GetComponent(TeamSelector).squad[2]);
			}
		}
		audio.PlayOneShot(click);
	}
	GUI.Label (Rect (Screen.width/2+75,Screen.height-121, 120, 120), "  3");
	
	/*
	//Selektors
	if(currentTeam == "ninja"){
		if(ninjaController.GetComponent(TeamSelector).selected[0] != null){
			GUI.Label (Rect (Screen.width/2-167,Screen.height-100, 120, 120), "  *");
		}
		if(ninjaController.GetComponent(TeamSelector).selected[1] != null){
			GUI.Label (Rect (Screen.width/2-46,Screen.height-100, 120, 120), "  *");
		}
		if(ninjaController.GetComponent(TeamSelector).selected[2] != null){
			GUI.Label (Rect (Screen.width/2+75,Screen.height-100, 120, 120), "  *");
		}
	}else{
		if(pirateController.GetComponent(TeamSelector).selected[0] != null){
			GUI.Label (Rect (Screen.width/2-167,Screen.height-100, 120, 120), "  *");
		}
		if(pirateController.GetComponent(TeamSelector).selected[1] != null){
			GUI.Label (Rect (Screen.width/2-46,Screen.height-100, 120, 120), "  *");
		}
		if(pirateController.GetComponent(TeamSelector).selected[2] != null){
			GUI.Label (Rect (Screen.width/2+75,Screen.height-100, 120, 120), "  *");
		}
	}
	*/
	
	//Health bars
	//Pirate
	//Bar 1
	if(pirateController.GetComponent(TeamSelector).squad[0] != null){
		var floatdeficit : float = (pirateController.GetComponent(TeamSelector).squad[0].currentHealth);
		floatdeficit = floatdeficit/(pirateController.GetComponent(TeamSelector).squad[0].transform.GetComponent(Class).MaxHealthPoints());
		GUI.Box (Rect ((Camera.main.WorldToScreenPoint(pirateController.GetComponent(TeamSelector).squad[0].transform.position)).x-50,(Screen.height-(Camera.main.WorldToScreenPoint(pirateController.GetComponent(TeamSelector).squad[0].transform.position)).y)-60,100,10), "");
		GUI.Box (Rect ((Camera.main.WorldToScreenPoint(pirateController.GetComponent(TeamSelector).squad[0].transform.position)).x-48,(Screen.height-(Camera.main.WorldToScreenPoint(pirateController.GetComponent(TeamSelector).squad[0].transform.position)).y)-58,93*floatdeficit,6), "1", pirateStyle);
	}
	
	//Bar2
	if(pirateController.GetComponent(TeamSelector).squad[1] != null){
		floatdeficit = (pirateController.GetComponent(TeamSelector).squad[1].currentHealth);
		floatdeficit = floatdeficit/(pirateController.GetComponent(TeamSelector).squad[1].transform.GetComponent(Class).MaxHealthPoints());
		GUI.Box (Rect ((Camera.main.WorldToScreenPoint(pirateController.GetComponent(TeamSelector).squad[1].transform.position)).x-50,(Screen.height-(Camera.main.WorldToScreenPoint(pirateController.GetComponent(TeamSelector).squad[1].transform.position)).y)-60,100,10), "");
		GUI.Box (Rect ((Camera.main.WorldToScreenPoint(pirateController.GetComponent(TeamSelector).squad[1].transform.position)).x-48,(Screen.height-(Camera.main.WorldToScreenPoint(pirateController.GetComponent(TeamSelector).squad[1].transform.position)).y)-58,93*floatdeficit,6), "2", pirateStyle);
	}
	
	//Bar 3
	if(pirateController.GetComponent(TeamSelector).squad[2] != null){
		floatdeficit = (pirateController.GetComponent(TeamSelector).squad[2].currentHealth);
		floatdeficit = floatdeficit/(pirateController.GetComponent(TeamSelector).squad[2].transform.GetComponent(Class).MaxHealthPoints());
		GUI.Box (Rect ((Camera.main.WorldToScreenPoint(pirateController.GetComponent(TeamSelector).squad[2].transform.position)).x-50,(Screen.height-(Camera.main.WorldToScreenPoint(pirateController.GetComponent(TeamSelector).squad[2].transform.position)).y)-60,100,10), "");
		GUI.Box (Rect ((Camera.main.WorldToScreenPoint(pirateController.GetComponent(TeamSelector).squad[2].transform.position)).x-48,(Screen.height-(Camera.main.WorldToScreenPoint(pirateController.GetComponent(TeamSelector).squad[2].transform.position)).y)-58,93*floatdeficit,6), "3", pirateStyle);
	}
	
	//Ninja
	//Bar 1
	if(ninjaController.GetComponent(TeamSelector).squad[0] != null){
		floatdeficit = (ninjaController.GetComponent(TeamSelector).squad[0].currentHealth);
		floatdeficit = floatdeficit/(ninjaController.GetComponent(TeamSelector).squad[0].transform.GetComponent(Class).MaxHealthPoints());
		GUI.Box (Rect ((Camera.main.WorldToScreenPoint(ninjaController.GetComponent(TeamSelector).squad[0].transform.position)).x-50,(Screen.height-(Camera.main.WorldToScreenPoint(ninjaController.GetComponent(TeamSelector).squad[0].transform.position)).y)-60,100,10), "");
		GUI.Box (Rect ((Camera.main.WorldToScreenPoint(ninjaController.GetComponent(TeamSelector).squad[0].transform.position)).x-48,(Screen.height-(Camera.main.WorldToScreenPoint(ninjaController.GetComponent(TeamSelector).squad[0].transform.position)).y)-58,93*floatdeficit,6), "1", ninjaStyle);
	}
	
	
	
	//Bar2
	if(ninjaController.GetComponent(TeamSelector).squad[1] != null){
		floatdeficit = (ninjaController.GetComponent(TeamSelector).squad[1].currentHealth);
		floatdeficit = floatdeficit/(ninjaController.GetComponent(TeamSelector).squad[1].transform.GetComponent(Class).MaxHealthPoints());
		GUI.Box (Rect ((Camera.main.WorldToScreenPoint(ninjaController.GetComponent(TeamSelector).squad[1].transform.position)).x-50,(Screen.height-(Camera.main.WorldToScreenPoint(ninjaController.GetComponent(TeamSelector).squad[1].transform.position)).y)-60,100,10), "");
		GUI.Box (Rect ((Camera.main.WorldToScreenPoint(ninjaController.GetComponent(TeamSelector).squad[1].transform.position)).x-48,(Screen.height-(Camera.main.WorldToScreenPoint(ninjaController.GetComponent(TeamSelector).squad[1].transform.position)).y)-58,93*floatdeficit,6), "2", ninjaStyle);
	}
	
	//Bar 3
	if(ninjaController.GetComponent(TeamSelector).squad[2] != null){
		floatdeficit = (ninjaController.GetComponent(TeamSelector).squad[2].currentHealth);
		floatdeficit = floatdeficit/(ninjaController.GetComponent(TeamSelector).squad[2].transform.GetComponent(Class).MaxHealthPoints());
		GUI.Box (Rect ((Camera.main.WorldToScreenPoint(ninjaController.GetComponent(TeamSelector).squad[2].transform.position)).x-50,(Screen.height-(Camera.main.WorldToScreenPoint(ninjaController.GetComponent(TeamSelector).squad[2].transform.position)).y)-60,100,10), "");
		GUI.Box (Rect ((Camera.main.WorldToScreenPoint(ninjaController.GetComponent(TeamSelector).squad[2].transform.position)).x-48,(Screen.height-(Camera.main.WorldToScreenPoint(ninjaController.GetComponent(TeamSelector).squad[2].transform.position)).y)-58,93*floatdeficit,6), "3", ninjaStyle);
	}
	
	//Software Cursor
	var mousePos : Vector3 = Input.mousePosition;
    var pos : Rect = Rect(mousePos.x,Screen.height - mousePos.y,cursorImage.width,cursorImage.height);
    GUI.Label(pos,cursorImage);

}else if(winner == "pirates"){
	GUI.skin = pirateSkin;
	mainCam.active = false;
	mapCam.active = false;
	winCam.active = true;
	//Winner Screen
	GUI.Box (Rect (Screen.width/3,Screen.height/11,Screen.width/3,Screen.height/3), "Pirates Win!", GUI.skin.GetStyle("Win"));
	GUI.Box (Rect (Screen.width/4,(Screen.height/11)*9,Screen.width/2,Screen.height/8), "Press ESC to Exit", GUI.skin.GetStyle("Win"));
}else if(winner == "ninjas"){
	GUI.skin = ninjaSkin;
	mainCam.active = false;
	mapCam.active = false;
	winCam.active = true;
	//Winner Screen
	GUI.Box (Rect (Screen.width/3,Screen.height/11,Screen.width/3,Screen.height/3), "Ninjas Win!", GUI.skin.GetStyle("Win"));
	GUI.Box (Rect (Screen.width/4,(Screen.height/11)*9,Screen.width/2,Screen.height/8), "Press ESC To Exit", GUI.skin.GetStyle("Win"));
}//endifs

}//end ongui