#pragma strict

//Style
var customGuiStyle : GUIStyle;
var robotGuiStyle : GUIStyle;

//Camera
var menuCam : Camera;

//Menu States
var currentMenu : String;
var creditsMenu : String;
var helpMenu : int;
var ingameMenu : boolean;
var ingameOptions : boolean;

//MenuCam Positions
var mainPosition = Vector3(-11.12546,21.9434,-43.26293);
var mainRotation = Vector3(0.0,0.0,0.0);

var playPosition = Vector3(-11.12546,21.9434,-16.61255);

var optionsPosition = Vector3(-28.40992,21.9434,-35.73129);
var optionsRotation = Vector3(0.0,301.6794,0.0);

var helpPosition = Vector3(11.48621,21.9434,-20.62492);
var helpRotation = Vector3(0.0,-312.6038,0.0);

var creditsPosition = Vector3(-15.36142,21.9434,-79.00731);
var creditsRotation = Vector3(0.0,89.5792,0.0);

//Misc
var vsyncStatus : boolean;
var playMenu : boolean;
var clientWindow:boolean;
var hostWindow:boolean;
var hostIPAddress:String;
var teamFull : boolean;

//Network Vars
var teamRoster : String[];
var currentSlot : int;

//Click Sound
var click : AudioClip;

//Music
var menuTheme:AudioClip;
var ninjaTheme:AudioClip;
var pirateTheme:AudioClip;

//Options
var fullScrn : String;
var SFXvol : float;
var VoiceVol : float;
var MusicVol : float;


//Logos
var mainlog : Texture;
var log1 : Texture;
var log2 : Texture;
var log3 : Texture;

//Credits Screens
var codeCred : Texture;
var artCred : Texture;
var voiceCred : Texture;
var otherCred : Texture;
var plumberC : Texture;
var unityC : Texture;
var stateC : Texture;

//Help Screens
var basicHelp : Texture;
var teamHelp : Texture;
var moveHelp : Texture;
var mapHelp : Texture;

function Start () {

	//Instantiations
	currentMenu = "Main";
	creditsMenu = "Zed";
	ingameMenu = false;
	ingameOptions = false;
	helpMenu = 1;
	
	//Positions/Rotations
	mainPosition.x = -11.12546;
	playPosition.x = -11.12546;
	optionsPosition.x = -28.40992;
	helpPosition.x = 11.48621;
	creditsPosition.x = -15.36142;
	
	mainPosition.y = 21.9434;
	playPosition.y = 21.9434;
	optionsPosition.y = 21.9434;
	helpPosition.y = 21.9434;
	creditsPosition.y = 21.9434;
	
	mainPosition.z = -43.26293;
	playPosition.z = -16.61255;
	optionsPosition.z = -35.73129;
	helpPosition.z = -20.62492;
	creditsPosition.z = -79.00731;
	
	mainRotation.y = 0;
	optionsRotation.y = 0;
	helpRotation.y = 0;
	creditsRotation.y = 0;
	
	mainRotation.x = 0;
	optionsRotation.x = -30;
	helpRotation.x = 60;
	creditsRotation.x = 89.579;
	
	mainRotation.z = 0;
	optionsRotation.z = 20;
	helpRotation.z = 0;
	creditsRotation.z = 0;
	
	
	
	if(QualitySettings.vSyncCount >= 1){
		vsyncStatus = true;
	}else{
		vsyncStatus = false;
	}//endElseIf
	
	playMenu = false;
	clientWindow = false;
	hostWindow = false;
	teamFull = false;
	hostIPAddress = GameObject.Find("NetworkControlObject").GetComponent(NetworkController).hostIP;
	
	teamRoster = new String[7];
	currentSlot = 0;
	
	audio.clip=menuTheme;
	audio.Play();
	
	if(!Screen.fullScreen){
		fullScrn = "Off";
	}else{
		fullScrn = "On";
	}
	
	SFXvol = 1;
	VoiceVol = 1;
	MusicVol = 1;

}

function Update () {

	//Keeps Persistence
	//**Moved to the Awake() funciton
	//DontDestroyOnLoad (this.transform.gameObject);

	var Cameras:Camera[] = FindObjectsOfType (Camera);
	if(menuCam == null && currentMenu != "PLAYING"){
		for (var c in Cameras){
		menuCam = c;
		}
	}
	
	for(var n = 0; n < 7; n++){
		if(teamRoster[n] == null || teamRoster[n] == ""){
			teamFull = false;
			currentSlot = n;
			break;
		} else{
			teamFull = true;
			currentSlot = 6;
		}
	}
	
	//Camera Movement
	//Main
	if(currentMenu == "Main" && !playMenu){
		menuCam.transform.position = Vector3.MoveTowards(menuCam.transform.position, mainPosition, 15*Time.deltaTime);
		menuCam.transform.rotation = Quaternion.Slerp(menuCam.transform.rotation, Quaternion.LookRotation(mainRotation), 2*Time.deltaTime);
	}
	
	//Play
	if(currentMenu == "Main" && playMenu){
		menuCam.transform.position = Vector3.MoveTowards(menuCam.transform.position, playPosition, 15*Time.deltaTime);
		menuCam.transform.rotation = Quaternion.Slerp(menuCam.transform.rotation, Quaternion.LookRotation(mainRotation), 2*Time.deltaTime);
	}
	
	//Options
	if(currentMenu == "Options"){
		menuCam.transform.position = Vector3.MoveTowards(menuCam.transform.position, optionsPosition, 15*Time.deltaTime);
		menuCam.transform.rotation = Quaternion.Lerp(menuCam.transform.rotation, Quaternion.LookRotation(optionsRotation), 2*Time.deltaTime);
	}
	
	//Help
	if(currentMenu == "Help"){
		menuCam.transform.position = Vector3.MoveTowards(menuCam.transform.position, helpPosition, 15*Time.deltaTime);
		menuCam.transform.rotation = Quaternion.Slerp(menuCam.transform.rotation, Quaternion.LookRotation(helpRotation), 2*Time.deltaTime);
	}
	
	//Credits
	if(currentMenu == "Credits"){
		menuCam.transform.position = Vector3.MoveTowards(menuCam.transform.position, creditsPosition, 25*Time.deltaTime);
		menuCam.transform.rotation = Quaternion.Slerp(menuCam.transform.rotation, Quaternion.LookRotation(creditsRotation), 2*Time.deltaTime);
	}
	
	if (Input.GetKeyDown(KeyCode.Escape) && currentMenu == "PLAYING") {
		if(ingameMenu == false){
        ingameMenu = true;
        }else{
        ingameMenu = false;
        }
    }
    
	//Menu Music
	if (currentMenu != "PLAYING" && !audio.isPlaying)
	audio.Play();
	
    //Game Music
    if (currentMenu == "PLAYING" && !audio.isPlaying){
    if (hostWindow==false)
    audio.clip = ninjaTheme;
    else {
    audio.clip = pirateTheme; 
    SoundRegulatorScript.isLocalPlayerPirates=false;
    }
    audio.Play();
    
    }

}

function OnGUI () {

	GUI.depth = 1;
	if(currentMenu != "PLAYING"){
		Screen.showCursor = true;
	}
	//Main Menu
	if(currentMenu == "Main" && menuCam.transform.position.z == -43.26293 && playMenu == false){
	//Box & Title
		GUI.Box (Rect ((Screen.width/2)-((Screen.width/3)/2)+55,28,(Screen.width/3)-105,Screen.height-56), "");
		GUI.Box (Rect ((Screen.width/2)-((Screen.width/3)/2)+55,28,(Screen.width/3)-105,Screen.height-56), currentMenu, customGuiStyle);
		//Logo
		if(GUI.Button (Rect ((Screen.width/2)-((Screen.width/5)/2),Screen.height/11,(Screen.width/5),100), mainlog, customGuiStyle)){
			//
		}
		// Play Button
		if (GUI.Button (Rect ((Screen.width/2)-((Screen.width/5)/2),Screen.height/4,(Screen.width/5),50), "Play", robotGuiStyle)) {
			playMenu = true;
			audio.PlayOneShot(click);
		}
		// Options Button
		if (GUI.Button (Rect ((Screen.width/2)-((Screen.width/5)/2),(Screen.height/4)*1.5,(Screen.width/5),50), "Options", robotGuiStyle)) {
			currentMenu = "Options";
			audio.PlayOneShot(click);
		}
		// Credits Button
		if (GUI.Button (Rect ((Screen.width/2)-((Screen.width/5)/2),(Screen.height/4)*2,(Screen.width/5),50), "Help", robotGuiStyle)) {
			currentMenu = "Help";
			audio.PlayOneShot(click);
		}
		// Credits Button
		if (GUI.Button (Rect ((Screen.width/2)-((Screen.width/5)/2),(Screen.height/4)*2.5,(Screen.width/5),50), "Credits", robotGuiStyle)) {
			currentMenu = "Credits";
			audio.PlayOneShot(click);
		}
		// Quit Button
		if (GUI.Button (Rect ((Screen.width/2)-((Screen.width/5)/2),(Screen.height/4)*3,(Screen.width/5),50), "Quit", robotGuiStyle)) {
			 audio.PlayOneShot(click);
			 Application.Quit();
		}
	}//endif
	
	//Play Menu
	if(currentMenu == "Main" && menuCam.transform.position.z == -16.61255 && playMenu == true){
	//Box & Title
		GUI.Box (Rect ((Screen.width/2)-((Screen.width/3)/2),28,Screen.width/3,Screen.height-56), "");
		GUI.Box (Rect ((Screen.width/2)-((Screen.width/3)/2),28,Screen.width/3,Screen.height-56), currentMenu, customGuiStyle);
		
		if(!clientWindow && !hostWindow) {
			// Host Button
			if (GUI.Button (Rect ((Screen.width/2)-((Screen.width/5)/2),Screen.height/4,(Screen.width/5),50), "Host", robotGuiStyle)) {
				hostWindow = true;
				audio.PlayOneShot(click);
			}
			// Client Button
			if (GUI.Button (Rect ((Screen.width/2)-((Screen.width/5)/2),(Screen.height/4)*1.5,(Screen.width/5),50), "Client", robotGuiStyle)) {
				clientWindow = true;
				audio.PlayOneShot(click);
			}
			// Back Button
			if (GUI.Button (Rect ((Screen.width/2)-((Screen.width/5)/2),(Screen.height/4)*2,(Screen.width/5),50), "Back", robotGuiStyle)) {
				playMenu = false;
				audio.PlayOneShot(click);
			}
		}		
		// Client connection information
		else if (!hostWindow && clientWindow) {
			GUI.Window(0,Rect ((Screen.width/2)-((Screen.width/3)/2),(Screen.height/12),(Screen.width*0.333),(Screen.height/8)*6.3),DoTeamWindow,"Team Roster:");
			GUI.Window(1,Rect ((Screen.width/2)-((Screen.width/3)/2),(Screen.height/8)*7,(Screen.width*0.333),45),DoClientWindow,"Fill Team Roster, Then & Enter Host IP & Press 'Connect'");
		} 
		//Host connection information
		else if (!clientWindow && hostWindow){
			GUI.Window(0,Rect ((Screen.width/2)-((Screen.width/3)/2),(Screen.height/12),(Screen.width*0.333),(Screen.height/8)*6.3),DoTeamWindow,"Team Roster:");
			GUI.Window(1,Rect ((Screen.width/2)-((Screen.width/3)/2),(Screen.height/8)*7,(Screen.width*0.333),45),DoHostWindow,"Fill Team Roster, Then Press 'Host'");	
		}
		
	}//endif
	
	//Options Menu
	if(currentMenu == "Options" && menuCam.transform.position.z == -35.73129){
	//Box & Title
		GUI.Box (Rect (35,28,Screen.width-60,25), "");
		GUI.Box (Rect (35,28,Screen.width-60,25), currentMenu, customGuiStyle);
		//Video Options Box
		GUI.Box (Rect ((Screen.width/4),60,(Screen.width/2),(Screen.height/2.5)), "");
		GUI.Box (Rect ((Screen.width/4),60,(Screen.width/2),(Screen.height/2.5)), "Graphics", customGuiStyle);
			//Fullscreen Toggle
				//GUI.Toggle (new Rect ((Screen.width/2)+90, 90, 100, 30), fullScrn, " Fullscreen");
				if (GUI.Button (Rect ((Screen.width/3.7),(Screen.height/8),(Screen.width/5),30), "FullScreen: "+fullScrn, robotGuiStyle)) {
					Screen.fullScreen = !Screen.fullScreen;
					audio.PlayOneShot(click);
					if(fullScrn == "On"){
						fullScrn = "Off";
					}else{
						fullScrn = "On";
					}
				}
			//Resolution Options
			/*
				if (GUI.Button (Rect ((Screen.width/3.7),(Screen.height/8)+45,(Screen.width/5),30), "Set 800x600", robotGuiStyle)) {
					audio.PlayOneShot(click);
					Screen.SetResolution (800, 600, false);
				}
			*/
				if (GUI.Button (Rect ((Screen.width/3.7),(Screen.height/8)+80,(Screen.width/5),30), "Set 1024x768", robotGuiStyle)) {
					audio.PlayOneShot(click);
					Screen.SetResolution (1024, 768, false);
				}
				if (GUI.Button (Rect ((Screen.width/3.7),(Screen.height/8)+115,(Screen.width/5),30), "Set 1280x768", robotGuiStyle)) {
					audio.PlayOneShot(click);
					Screen.SetResolution (1280, 768, false);
				}
				if (GUI.Button (Rect ((Screen.width/3.7),(Screen.height/8)+150,(Screen.width/5),30), "Set 1280x800", robotGuiStyle)) {
					audio.PlayOneShot(click);
					Screen.SetResolution (1280, 800, false);
				}
				if (GUI.Button (Rect ((Screen.width/3.7),(Screen.height/8)+185,(Screen.width/5),30), "Set 1360x768", robotGuiStyle)) {
					audio.PlayOneShot(click);
					Screen.SetResolution (1360, 768, false);
				}
				if (GUI.Button (Rect ((Screen.width/3.7),(Screen.height/8)+220,(Screen.width/5),30), "Set 1366x768", robotGuiStyle)) {
					audio.PlayOneShot(click);
					Screen.SetResolution (1366, 768, false);
				}
			//Quality Options
				GUI.Box (Rect ((Screen.width/1.9),(Screen.height/8),(Screen.width/5),30), "");
				GUI.Box (Rect ((Screen.width/1.9),(Screen.height/8)+5,(Screen.width/5),30), "Current Quality: "+(QualitySettings.GetQualityLevel()+1), customGuiStyle);
				//Settings Buttons
				if (GUI.Button (Rect ((Screen.width/1.9),(Screen.height/8)+45,(Screen.width/5),30), "1: Fastest Quality", robotGuiStyle)) {
					audio.PlayOneShot(click);
					QualitySettings.SetQualityLevel (0, true);
				}
				if (GUI.Button (Rect ((Screen.width/1.9),(Screen.height/8)+80,(Screen.width/5),30), "2: Fast Quality", robotGuiStyle)) {
					audio.PlayOneShot(click);
					QualitySettings.SetQualityLevel (1, true);
				}
				if (GUI.Button (Rect ((Screen.width/1.9),(Screen.height/8)+115,(Screen.width/5),30), "3: Simple Quality", robotGuiStyle)) {
					audio.PlayOneShot(click);
					QualitySettings.SetQualityLevel (2, true);
				}
				if (GUI.Button (Rect ((Screen.width/1.9),(Screen.height/8)+150,(Screen.width/5),30), "4: Good Quality", robotGuiStyle)) {
					audio.PlayOneShot(click);
					QualitySettings.SetQualityLevel (3, true);
				}
				if (GUI.Button (Rect ((Screen.width/1.9),(Screen.height/8)+185,(Screen.width/5),30), "5: Beautiful Quality", robotGuiStyle)) {
					audio.PlayOneShot(click);
					QualitySettings.SetQualityLevel (4, true);
				}
				if (GUI.Button (Rect ((Screen.width/1.9),(Screen.height/8)+220,(Screen.width/5),30), "6: Fantastic Quality", robotGuiStyle)) {
					audio.PlayOneShot(click);
					QualitySettings.SetQualityLevel (5, true);
				}
			
		//Sound Options Box
		GUI.Box (Rect ((Screen.width/4),70+(Screen.height/2.5),(Screen.width/2),(Screen.height/3)-5), "");
		GUI.Box (Rect ((Screen.width/4),70+(Screen.height/2.5),(Screen.width/2),(Screen.height/3)-5), "Sound", customGuiStyle);
			//Master Slider & Label
				GUI.Box (Rect ((Screen.width/1.9),(Screen.height/2.5)+99,(Screen.width/5),30), "");
				var disMasVol : int = AudioListener.volume*100;
				GUI.Box (Rect ((Screen.width/1.9),(Screen.height/2.5)+105,(Screen.width/5),30), "Master Volume: "+disMasVol, customGuiStyle);
				AudioListener.volume = GUI.HorizontalSlider(Rect ((Screen.width/3.7), (Screen.height/2.5)+105, (Screen.width/5), 30),AudioListener.volume, 0.0, 1.0);
			/*
			//Voice Slider & Label
				GUI.Box (Rect ((Screen.width/1.9),(Screen.height/2.5)+150,(Screen.width/5),30), "");
				var disVoicVol : int = VoiceVol*100;
				GUI.Box (Rect ((Screen.width/1.9),(Screen.height/2.5)+155,(Screen.width/5),30), "Voice Volume: "+disVoicVol, customGuiStyle);
				VoiceVol = GUI.HorizontalSlider(Rect ((Screen.width/3.7), (Screen.height/2.5)+155, (Screen.width/5), 30),VoiceVol, 0.0, 1.0);
			//Music Slider & Label
				GUI.Box (Rect ((Screen.width/1.9),(Screen.height/2.5)+200,(Screen.width/5),30), "");
				var disMusVol : int = MusicVol*100;
				GUI.Box (Rect ((Screen.width/1.9),(Screen.height/2.5)+205,(Screen.width/5),30), "Music Volume: "+disMusVol, customGuiStyle);
				MusicVol = GUI.HorizontalSlider(Rect ((Screen.width/3.7), (Screen.height/2.5)+205, (Screen.width/5), 30),MusicVol, 0.0, 1.0);
			//SFX Slider & Label
				GUI.Box (Rect ((Screen.width/1.9),(Screen.height/2.5)+250,(Screen.width/5),30), "");
				var disSfxVol : int = SFXvol*100;
				GUI.Box (Rect ((Screen.width/1.9),(Screen.height/2.5)+255,(Screen.width/5),30), "SFX Volume: "+disSfxVol, customGuiStyle);
				SFXvol = GUI.HorizontalSlider(Rect ((Screen.width/3.7), (Screen.height/2.5)+255, (Screen.width/5), 30),SFXvol, 0.0, 1.0);
			*/
		// Back Button
		if (GUI.Button (Rect ((Screen.width/2)-((Screen.width/5)/2),(Screen.height)-80,(Screen.width/5),50), "Back", robotGuiStyle)) {
			 currentMenu = "Main";
			 audio.PlayOneShot(click);
		}
	}//endif
	
	//Help Menu
	if(currentMenu == "Help" && menuCam.transform.position.z == -20.62492){
	//Box & Title
		GUI.Box (Rect ((Screen.width/2)-((Screen.width/3)/2),(Screen.height)/30,Screen.width/3,25), "");
		GUI.Box (Rect ((Screen.width/2)-((Screen.width/3)/2),(Screen.height)/30,Screen.width/3,25), currentMenu, customGuiStyle);
		//Coding Button
		if (GUI.Button (Rect ((Screen.width/6),(Screen.height)/12,(Screen.width/7),30), "Basic Help", robotGuiStyle)) {
			 helpMenu = 1;
			 audio.PlayOneShot(click);
		}
		//Art Button
		if (GUI.Button (Rect (((Screen.width/2)-((Screen.width/7)/2)-120),(Screen.height)/12,(Screen.width/7),30), "The Team", robotGuiStyle)) {
			 helpMenu = 2;
			 audio.PlayOneShot(click);
		}
		//Voice Roles Button
		if (GUI.Button (Rect (((Screen.width/2)-((Screen.width/7)/2)+120),(Screen.height)/12,(Screen.width/7),30), "Move & Attack", robotGuiStyle)) {
			 helpMenu = 3;
			 audio.PlayOneShot(click);
		}
		//Attributions Button
		if (GUI.Button (Rect (4.2*(Screen.width/6),(Screen.height)/12,(Screen.width/7),30), "The Arena", robotGuiStyle)) {
			 helpMenu = 4;
			 audio.PlayOneShot(click);
		}
		
	//Basic Help
	if(helpMenu == 1){
		GUI.Box (Rect ((Screen.width/10),(Screen.height)/7+20,(Screen.width/10)*8,((Screen.height)/7)*4.6), basicHelp, customGuiStyle);
	}
	//Team Help
	if(helpMenu == 2){
		GUI.Box (Rect ((Screen.width/10),(Screen.height)/7+20,(Screen.width/10)*8,((Screen.height)/7)*4.6), teamHelp, customGuiStyle);
	}
	//Attack & Move Help
	if(helpMenu == 3){
		GUI.Box (Rect ((Screen.width/10),(Screen.height)/7+20,(Screen.width/10)*8,((Screen.height)/7)*4.6), moveHelp, customGuiStyle);
	}
	//Map Helps
	if(helpMenu == 4){
		GUI.Box (Rect ((Screen.width/10),(Screen.height)/7+20,(Screen.width/10)*8,((Screen.height)/7)*4.6), mapHelp, customGuiStyle);
	}
	
	// Back Button
		if (GUI.Button (Rect ((Screen.width/2)-((Screen.width/5)/2),(Screen.height)-70,(Screen.width/5),50), "Back", robotGuiStyle)) {
			 currentMenu = "Main";
			 helpMenu = 1;
			 audio.PlayOneShot(click);
		}
	
	}
	
	
	//Credits Menu
	if(currentMenu == "Credits" && menuCam.transform.position.z == -79.00731){
	//Box & Title
		GUI.Box (Rect ((Screen.width/2)-((Screen.width/3)/2),(Screen.height)/30,Screen.width/3,25), "");
		GUI.Box (Rect ((Screen.width/2)-((Screen.width/3)/2),(Screen.height)/30,Screen.width/3,25), currentMenu, customGuiStyle);
		//Coding Button
		if (GUI.Button (Rect ((Screen.width/6),(Screen.height)/12,(Screen.width/7),30), "Coding Team", robotGuiStyle)) {
			 creditsMenu = "Coding";
			 audio.PlayOneShot(click);
		}
		//Art Button
		if (GUI.Button (Rect (((Screen.width/2)-((Screen.width/7)/2)-120),(Screen.height)/12,(Screen.width/7),30), "Art Team", robotGuiStyle)) {
			 creditsMenu = "Art";
			 audio.PlayOneShot(click);
		}
		//Voice Roles Button
		if (GUI.Button (Rect (((Screen.width/2)-((Screen.width/7)/2)+120),(Screen.height)/12,(Screen.width/7),30), "Voice Roles", robotGuiStyle)) {
			 creditsMenu = "Voices";
			 audio.PlayOneShot(click);
		}
		//Attributions Button
		if (GUI.Button (Rect (4.2*(Screen.width/6),(Screen.height)/12,(Screen.width/7),30), "Attributions", robotGuiStyle)) {
			 creditsMenu = "Attributions";
			 audio.PlayOneShot(click);
		}
		
	//Coding Window
	if(creditsMenu == "Coding"){
		GUI.Box (Rect ((Screen.width/10),(Screen.height)/7,(Screen.width/10)*8,((Screen.height)/7)*4.6), codeCred, customGuiStyle);
	}
	//Art Window
	if(creditsMenu == "Art"){
		GUI.Box (Rect ((Screen.width/10),(Screen.height)/7,(Screen.width/10)*8,((Screen.height)/7)*4.6), artCred, customGuiStyle);
	}
	//Voice Roles Window
	if(creditsMenu == "Voices"){
		GUI.Box (Rect ((Screen.width/10),(Screen.height)/7,(Screen.width/10)*8,((Screen.height)/7)*4.6), voiceCred, customGuiStyle);
	}
	//Attributions Window
	if(creditsMenu == "Attributions"){
		GUI.Box (Rect ((Screen.width/10),(Screen.height)/7,(Screen.width/10)*8,((Screen.height)/7)*4.6), otherCred, customGuiStyle);
	}
	//Plumberbird Windows
	if(creditsMenu == "Plumberbird"){
		GUI.Box (Rect ((Screen.width/10),(Screen.height)/7,(Screen.width/10)*8,((Screen.height)/7)*4.6), plumberC, customGuiStyle);
	}
	//Unity Window
	if(creditsMenu == "Unity"){
		GUI.Box (Rect ((Screen.width/10),(Screen.height)/7,(Screen.width/10)*8,((Screen.height)/7)*4.6), unityC, customGuiStyle);
	}
	//NCSU Window
	if(creditsMenu == "NCState"){
		GUI.Box (Rect ((Screen.width/10),(Screen.height)/7,(Screen.width/10)*8,((Screen.height)/7)*4.6), stateC, customGuiStyle);
	}
		
		//Logo Pane
		GUI.Box (Rect ((Screen.width/2)-((Screen.width/3)/2),(Screen.height)-132,Screen.width/3,50), "");
		GUI.Box (Rect ((Screen.width/2)-((Screen.width/3)/2),(Screen.height)-132,Screen.width/3,50), "", customGuiStyle);
		//Logos
		if(GUI.Button (Rect ((Screen.width/2)-((Screen.width/20)+50),(Screen.height)-132,Screen.width/20,50), log1)){
			creditsMenu = "Plumberbird";
			audio.PlayOneShot(click);
		}
		if(GUI.Button (Rect ((Screen.width/2)-((Screen.width/20)/2),(Screen.height)-132,Screen.width/20,50), log2)){
			creditsMenu = "Unity";
			audio.PlayOneShot(click);
		}
		if(GUI.Button (Rect ((Screen.width/2)+((Screen.width/20)-15),(Screen.height)-132,Screen.width/20,50), log3)){
			creditsMenu = "NCState";
			audio.PlayOneShot(click);
		}
		
		
		// Back Button
		if (GUI.Button (Rect ((Screen.width/2)-((Screen.width/5)/2),(Screen.height)-70,(Screen.width/5),50), "Back", robotGuiStyle)) {
			 currentMenu = "Main";
			 creditsMenu = "Zed";
			 audio.PlayOneShot(click);
		}
	}//endif
	
	//Ingame Menu
	if(currentMenu == "PLAYING"){
		if(ingameMenu){
			//Box
			GUI.Box (Rect ((Screen.width/2)-((Screen.width/4)/2),68,Screen.width/4,Screen.height/4), "");
			GUI.Box (Rect ((Screen.width/2)-((Screen.width/4)/2),68,Screen.width/4,Screen.height/4), "Menu", customGuiStyle);
				/*
				//Options Button
				if (GUI.Button (Rect ((Screen.width/2)-((Screen.width/5)/2),(Screen.height/4)-55,(Screen.width/5),50), "Options", robotGuiStyle)) {
			 		//ingameOptions = true;
			 		audio.PlayOneShot(click);
				}
				*/
				//Quit Button
				if (GUI.Button (Rect ((Screen.width/2)-((Screen.width/5)/2),(Screen.height/4)+5,(Screen.width/5),50), "Quit", robotGuiStyle)) {
			 		Application.LoadLevel (1);
			 		ingameMenu = false;
			 		audio.PlayOneShot(click);
			 		currentMenu = "Main";
			 		audio.clip=menuTheme;
					audio.Play();
			 		//Destroy(this);
				}
		}//endnested
	}//endif
}

function GetConnectionInfo() {
	//Debug.Log("What the fuck");
	//GUI.Box(Rect(20,20,70,70),"Client Window");
}

function DoClientWindow(windowID : int) {
	
	hostIPAddress = GUI.TextField(Rect(145,20,200,20),hostIPAddress);
	
	if(GUI.Button (Rect (350,20,100,20), "Connect", robotGuiStyle) && hostIPAddress != ""  && teamFull) {
		/*GameObject.Find("NetworkControlObject").GetComponent(NetworkController).host = false;
		GameObject.Find("NetworkControlObject").GetComponent(NetworkController).hostIP = hostIPAddress;*/
		GameObject.Find("NetworkControlObject").GetComponent(NetworkController).ConnectAsClient(hostIPAddress);
		clientWindow = false;
		playMenu = false;
		currentMenu = "PLAYING";
		audio.Stop();
		audio.PlayOneShot(click);
		Application.LoadLevel (2);
	}
	
	
	if(GUI.Button (Rect (5,20,100,20), "Back", robotGuiStyle)) {
		audio.PlayOneShot(click);
		clientWindow = false;
		playMenu = true;
		hostIPAddress = "";
		for(var n = 0; n < 7; n++){
			teamRoster[n] = null;
		}
	}
	
}


function DoHostWindow(windowID : int) {
	
	GUI.Label(Rect(145,20,200,20),"Your IP: "+Network.player.ipAddress);
	
	if(GUI.Button (Rect (350,20,100,20), "Host", robotGuiStyle) && teamFull) {
		GameObject.Find("NetworkControlObject").GetComponent(NetworkController).ConnectAsHost(true);
		hostWindow = false;
		playMenu = false;
		currentMenu = "PLAYING";
		audio.Stop();
		audio.PlayOneShot(click);
		Application.LoadLevel (2);
	}
	
	
	if(GUI.Button (Rect (5,20,100,20), "Back", robotGuiStyle)) {
		audio.PlayOneShot(click);
		hostWindow = false;
		playMenu = true;
		hostIPAddress = "";
		for(var n = 0; n < 7; n++){
			teamRoster[n] = null;
		}
	}
	
}

//DoTeamMenu
function DoTeamWindow(windowID : int) {
	
	//Light Button
	if(GUI.Button (Rect (35,20,125,125), "Assign\nLight\nTo Slot "+(currentSlot+1), robotGuiStyle)) {
		audio.PlayOneShot(click);
		teamRoster[currentSlot] = "light";
	}
	
	//Medium Button
	if(GUI.Button (Rect (35,150,125,125), "Assign\nMedium\nTo Slot "+(currentSlot+1), robotGuiStyle)) {
		audio.PlayOneShot(click);
		teamRoster[currentSlot] = "medium";
	}
	
	
	//Heavy Button
	if(GUI.Button (Rect (35,280,125,125), "Assign\nHeavy\nTo Slot "+(currentSlot+1), robotGuiStyle)) {
		audio.PlayOneShot(click);
		teamRoster[currentSlot] = "heavy";
	}
	
	
	//7 Team Slot Buttons
	if(GUI.Button (Rect (250,20,200,20), "Slot 1: "+teamRoster[0], robotGuiStyle)) {
		audio.PlayOneShot(click);
		teamRoster[0] = null;
	}
	if(GUI.Button (Rect (250,45,200,20), "Slot 2: "+teamRoster[1], robotGuiStyle)) {
		audio.PlayOneShot(click);
		teamRoster[1] = null;
	}
	if(GUI.Button (Rect (250,70,200,20), "Slot 3: "+teamRoster[2], robotGuiStyle)) {
		audio.PlayOneShot(click);
		teamRoster[2] = null;
	}
	if(GUI.Button (Rect (250,95,200,20), "Slot 4: "+teamRoster[3], robotGuiStyle)) {
		audio.PlayOneShot(click);
		teamRoster[3] = null;
	}
	if(GUI.Button (Rect (250,120,200,20), "Slot 5: "+teamRoster[4], robotGuiStyle)) {
		audio.PlayOneShot(click);
		teamRoster[4] = null;
	}
	if(GUI.Button (Rect (250,145,200,20), "Slot 6: "+teamRoster[5], robotGuiStyle)) {
		audio.PlayOneShot(click);
		teamRoster[5] = null;
	}
	if(GUI.Button (Rect (250,170,200,20), "Slot 7: "+teamRoster[6], robotGuiStyle)) {
		audio.PlayOneShot(click);
		teamRoster[6] = null;
	}
	
}



function Awake () {
	DontDestroyOnLoad (this.transform.gameObject);
	Application.LoadLevel(1);
}
