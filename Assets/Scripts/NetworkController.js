#pragma strict

var playerCount:int = 0;

var host:boolean = false;
var hostIP:String = "";

static var ready:boolean;

function Start () {
	/*if(host) {
		var useNat = !Network.HavePublicAddress();
		Debug.Log("Opening Server....");
		Network.InitializeServer(5,77777,useNat);
		Debug.Log("Server Opened on port 77777");
	} else {
		Debug.Log("Connecting to Server...");
		Network.Connect(hostIP, 77777);  //on NiRPS-NET
		Debug.Log("Connected Successfully!");
	}*/
	
	ready = false;
	
}

function Update () {

}

function Awake () {
	DontDestroyOnLoad(this.transform.gameObject);
}

function ConnectAsHost (h:boolean) {
	host = true;
	var useNat = !Network.HavePublicAddress();
	Debug.Log("Opening Server....");
	Network.InitializeServer(5,77777,useNat);
	Debug.Log("Server Opened on port 77777");
}

function ConnectAsClient (ip:String) {
	hostIP = ip;
	Debug.Log("Connecting to Server...");
	Network.Connect(hostIP, 77777);  //on NiRPS-NET
	Debug.Log("Connected Successfully!");
}

function OnPlayerConnected(player:NetworkPlayer) {

	Debug.Log("Player " + playerCount++ + " connected from " + player.ipAddress + ":" + player.port);
	//Application.LoadLevel (2);
	GameObject.Find("TeamControlObject").GetComponent(TeamController).CreateTeam(true);
	GameObject.Find("GameControlObject").GetComponent(GameController).gameStart = true;
	//GameObject.Find("TeamControlObject").networkView.RPC("CreateTeam",RPCMode.AllBuffered,false);
	
	//fire the boss cannon
	ready = true;
	Debug.Log("WE READY GOGOGO");
	
}

function OnConnectedToServer() {
	Debug.Log("Connected to Server");
	//Application.LoadLevel (2);
	GameObject.Find("TeamControlObject").GetComponent(TeamController).CreateTeam(false);
	GameObject.Find("GameControlObject").GetComponent(GameController).gameStart = true;
	
	//fire the boss cannon
	ready = true;
	Debug.Log("WE READY GOGOGO");
}

function OnSerializeNetworkView(stream:BitStream, info:NetworkMessageInfo) {
	
	var p1Pos:Vector3;
	var p1Atk:boolean;
	var p1HP:int;
	var p1Target:Unit;	
	
	var p2Pos:Vector3;
	var p2Atk:boolean;
	var p2HP:int;
	var p2Target:Unit;
	
	var p3Pos:Vector3;
	var p3Atk:boolean;
	var p3HP:int;
	var p3Target:Unit;
	
	var n1Pos:Vector3;
	var n1Atk:boolean;
	var n1HP:int;
	var n1Target:Unit;
	
	var n2Pos:Vector3;
	var n2Atk:boolean;
	var n2HP:int;
	var n2Target:Unit;
	
	var n3Pos:Vector3;
	var n3Atk:boolean;
	var n3HP:int;
	var n3Target:Unit;
	
	var bossHP:int;
	var pScore:int;
	var nScore:int;
	var time:float;
	var gameOver:boolean;
	var t1Capture:float;
	var t2Capture:float;
	var t3Capture:float;
	
	var units:Unit[];

	
	/*if(host) {
		if (stream.isWriting) {	 	
		 	bossHP = GameObject.Find("Boss").GetComponent(Unit).currentHealth;
		 	pScore = GameObject.Find("GameControlObject").GetComponent(GameController).player1Score;
		 	nScore = GameObject.Find("GameControlObject").GetComponent(GameController).player2Score;
		 	time = GameObject.Find("GameControlObject").GetComponent(GameController).timeRemaining;
		 	gameOver = GameObject.Find("GameControlObject").GetComponent(GameController).isGameOver;
		 	t1Capture = GameObject.Find("cPoint1").GetComponent(Capture).captureProgress;
		 	t2Capture = GameObject.Find("cPoint2").GetComponent(Capture).captureProgress;
		 	t3Capture = GameObject.Find("cPoint3").GetComponent(Capture).captureProgress;
	        
	        stream.Serialize(bossHP);
	        stream.Serialize(pScore);
	        stream.Serialize(nScore);
	        stream.Serialize(time);
	        stream.Serialize(gameOver);
	        stream.Serialize(t1Capture);
	        stream.Serialize(t2Capture);
	        stream.Serialize(t3Capture);
	    } else {        
	        stream.Serialize(bossHP);
	        stream.Serialize(pScore);
	        stream.Serialize(nScore);
	        stream.Serialize(time);
	        stream.Serialize(gameOver);
	        stream.Serialize(t1Capture);
	        stream.Serialize(t2Capture);
	        stream.Serialize(t3Capture);
		 	
		 	GameObject.Find("Boss").GetComponent(Unit).currentHealth = bossHP;
		 	GameObject.Find("GameControlObject").GetComponent(GameController).player1Score = pScore;
		 	GameObject.Find("GameControlObject").GetComponent(GameController).player2Score = nScore;
		 	GameObject.Find("GameControlObject").GetComponent(GameController).timeRemaining = time;
		 	GameObject.Find("GameControlObject").GetComponent(GameController).isGameOver = gameOver;
		 	GameObject.Find("cPoint1").GetComponent(Capture).captureProgress = t1Capture;
		 	GameObject.Find("cPoint2").GetComponent(Capture).captureProgress = t2Capture;
		 	GameObject.Find("cPoint3").GetComponent(Capture).captureProgress = t3Capture;        
	    }
	    
	    ready = true;
	}*/
	 /*if (stream.isWriting) {	 	
	 	bossHP = GameObject.Find("Boss").GetComponent(Unit).currentHealth;
	 	pScore = GameObject.Find("GameControlObject").GetComponent(GameController).player1Score;
	 	nScore = GameObject.Find("GameControlObject").GetComponent(GameController).player2Score;
	 	time = GameObject.Find("GameControlObject").GetComponent(GameController).timeRemaining;
	 	gameOver = GameObject.Find("GameControlObject").GetComponent(GameController).isGameOver;
	 	t1Capture = GameObject.Find("cPoint1").GetComponent(Capture).captureProgress;
	 	t2Capture = GameObject.Find("cPoint2").GetComponent(Capture).captureProgress;
	 	t3Capture = GameObject.Find("cPoint3").GetComponent(Capture).captureProgress;
        
        stream.Serialize(bossHP);
        stream.Serialize(pScore);
        stream.Serialize(nScore);
        stream.Serialize(time);
        stream.Serialize(gameOver);
        stream.Serialize(t1Capture);
        stream.Serialize(t2Capture);
        stream.Serialize(t3Capture);
    } else {        
        stream.Serialize(bossHP);
        stream.Serialize(pScore);
        stream.Serialize(nScore);
        stream.Serialize(time);
        stream.Serialize(gameOver);
        stream.Serialize(t1Capture);
        stream.Serialize(t2Capture);
        stream.Serialize(t3Capture);
	 	
	 	GameObject.Find("Boss").GetComponent(Unit).currentHealth = bossHP;
	 	GameObject.Find("GameControlObject").GetComponent(GameController).player1Score = pScore;
	 	GameObject.Find("GameControlObject").GetComponent(GameController).player2Score = nScore;
	 	GameObject.Find("GameControlObject").GetComponent(GameController).timeRemaining = time;
	 	GameObject.Find("GameControlObject").GetComponent(GameController).isGameOver = gameOver;
	 	GameObject.Find("cPoint1").GetComponent(Capture).captureProgress = t1Capture;
	 	GameObject.Find("cPoint2").GetComponent(Capture).captureProgress = t2Capture;
	 	GameObject.Find("cPoint3").GetComponent(Capture).captureProgress = t3Capture;        
    }
    
    ready = true;*/
    
}