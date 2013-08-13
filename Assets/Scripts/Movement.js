#pragma strict

@script RequireComponent(Unit);
@script RequireComponent(Class);

var currentSpd:double;
var isMoving:boolean;
var destination:GameObject;
var currentNode:Transform;
var lastNode:Transform;
var destinationAttack:GameObject;
var movementTimeout:int;
var prevDistance:double;
var deltaDist:float;
var distance:double;
var rotationSpeed:float = 5.0;
var currentRotation = 0;

static var MINIMUM_STOP_DISTANCE = .0001;

function Start () {
	destination = new GameObject();
	currentSpd = gameObject.GetComponent(Class).MaxMovementSpeed();
	//controller = new CharacterController();
	movementTimeout = 0;
	deltaDist = 0;
	prevDistance = 0;
	distance = 0;
	destinationAttack = null;
}
/*
function hasSight(v1:Vector3,v2:Vector3) : boolean {
	if (Physics.Raycast(new Vector3(v1.x,-5,v1.z), new Vector3(v2.x-v1.x,-5,v2.z-v1.z), Vector3.Distance(v1,v2),Constants.PathingLayer))
	{
		return false;
	}
	if (Physics.Raycast(new Vector3(v2.x,-5,v2.z), new Vector3(v1.x-v2.x,-5,v1.z-v2.z), Vector3.Distance(v1,v2),Constants.PathingLayer))
	{
		return false;
	}
	return true;	
}*/


function hasSight(v1:Vector3,v2:Vector3) : boolean {
	if (Physics.Linecast(new Vector3(v1.x,-5,v1.z), new Vector3(v2.x,-5,v2.z)))
	{
		return false;
	}
	return true;	
}

//Function: moves the respective distance towards target
//   calculated based on movement speed and the time tick for
//   this game loop
//TODO: when a pathfinding script exists, have it use the
//   next-node or whichever for all the distance calculations and position
//   maths.  Still keep the same destination for the total end-point, but
//   somehow communicate that a node has been reached to the pathfinding script and
//   update the next one (NOTE ON THIS:  The unit wiki has an A* project full of pathfinding
//   scripts to use, including ones for RTS pathfinding.  We'll likely find good stuff
//   in there.  - Colin)
function Update () {
	
	//Bill's code, with some modifications trying to get collision based movement going.
	if (!isMoving && destinationAttack != null)
	{
		//Debug.Log("Not moving and has target");
		var targetAngle = getAngle(this.GetComponent(Transform).position,currentNode.position);
		var newAngle = nextRotation(currentRotation,targetAngle);
			
		this.GetComponent(Transform).rotation = Quaternion.identity;
		this.GetComponent(Transform).Rotate(new Vector3(0,0-newAngle,0));
	}
	if(isMoving){
		if (destinationAttack != null)
		{
			//Debug.Log("Has target object");
			destination.transform.position = destinationAttack.transform.position;
		}
		if (hasSight(this.GetComponent(Transform).position,destination.transform.position))
		{
			//Debug.Log("Can See Target");
			currentNode = destination.transform;
		}
		else
		{
			//Debug.Log("Could Not See Target");
			currentNode = GameObject.Find("PathingManager").GetComponent(typeof(PathingManager)).closestNode(this.GetComponent(Transform));
			//Debug.Log("First NODE: "+currentNode);
			lastNode = GameObject.Find("PathingManager").GetComponent(typeof(PathingManager)).closestNode(destination.GetComponent(Transform));
			currentNode =  GameObject.Find("PathingManager").GetComponent(typeof(PathingManager)).getNextNode(this.GetComponent(Transform).position,
			currentNode.GetComponent(BoundaryBox).getNodeID(), lastNode.GetComponent(BoundaryBox).getNodeID(),destination.transform);
			if (currentNode != null)
			{
				//Debug.Log(currentNode +" "+lastNode);
			}
		}
		
		distance = dist();
		if (distance > .1)
		{
			targetAngle = getAngle(this.GetComponent(Transform).position,currentNode.position);
			newAngle = nextRotation(currentRotation,targetAngle);
			
			this.GetComponent(Transform).rotation = Quaternion.identity;
			this.GetComponent(Transform).Rotate(new Vector3(0,0-newAngle,0));
		}
		
		if(prevDistance == 0)
			prevDistance = distance;
		if (distance >= MINIMUM_STOP_DISTANCE && movementTimeout < 50){ //if we're not close enough (within tolerance)
			var tickD = distanceForTimeTick(Time.deltaTime);
			var controller : CharacterController = GetComponent(CharacterController);
			if (tickD > dist())  tickD = dist();
			var velX:double = tickD * unitX();
			var velZ:double = tickD * unitZ();
			var moveVel: Vector3 = Vector3(velX, 0, velZ);			
			deltaDist = distance - prevDistance;
			
			controller.Move(moveVel);
			prevDistance = distance;
			
			if(Mathf.Abs(deltaDist) <= .01)
				movementTimeout += 1;
			
		} else {
			isMoving = false;
			movementTimeout = 0;
			prevDistance = 0;
		}
	}
	
}
//Returns the angle between the source and the target
function getAngle(source:Vector3, target:Vector3) {
	var angle = Mathf.Atan((target.z-source.z)/(target.x-source.x))*180/Mathf.PI + 90;
	if (target.x > source.x)
	{
		angle -= 180;
	}
	return angle;
}

//Determines the shortest direction to turn and returns the next rotation for this unit
function nextRotation(cAngle:float, tAngle:float) {
	//Debug.Log(cAngle+" === "+tAngle);	
	
	var originalDiff = Mathf.Abs(cAngle - tAngle);
	
	var cAngle2 = ((cAngle+360)%360);
	var tAngle2 = ((tAngle+360)%360);
	var reversedDiff = Mathf.Abs(cAngle2 - tAngle2);
	
	var useCurAngle = cAngle2;
	var useTarAngle = tAngle2;
	if (reversedDiff > originalDiff)
	{
		useCurAngle = cAngle;
		useTarAngle = tAngle;
	} 
	
	if (useTarAngle > useCurAngle) {
		currentRotation = cAngle + rotationSpeed;
		if (currentRotation > tAngle)
		{
			currentRotation = tAngle;
		}
	} else {
		currentRotation = cAngle - rotationSpeed;
		if (currentRotation < tAngle)
		{
			currentRotation = tAngle;
		}
	}
	//Debug.Log(currentRotation);
	if (currentRotation > 180)
	{
		currentRotation -= 360;
	}
	if (currentRotation < -180)
	{
		currentRotation += 360;
	}
	return currentRotation;
}

//Stops the movement if within a threshold for the destination but is unable to get to it. 
//Fixes the constant rotation when two units try to get to the same spot.
function OnControllerColliderHit (hit : ControllerColliderHit) {
	//Debug.Log(name + " hit " + hit.gameObject.name);
	if(isMoving) {
		if(dist() >= 2) {
			isMoving = false;
		}
	}
	
}

//returns portion of movement for given time.deltatime
//NOTE: movement speed is assumed to be in units of pixels moved per 1 second of movement
function distanceForTimeTick(deltat:double){
	return deltat * currentSpd;
}

//distance from the target along the x axis
function distX(){
	return -transform.position.x + currentNode.position.x;
}

//distance from the target along the y axis
function distY(){
	return -transform.position.y + currentNode.position.y;
}

//distance from the target along the z axis
function distZ(){
	return -transform.position.z + currentNode.position.z;
}

//total geometric distance from target
function dist(){
	var ret:double = 0.0;
	ret += distX() * distX();
	//ret += distY() * distY();
	ret += distZ() * distZ();
	return Mathf.Sqrt(ret);
}

//x-component of unit vector to target
function unitX(){
	return distX()/dist();
}

//y-component of unit vector to target
function unitY(){
	return distY()/dist();
}

//z-component of unit vector to target
function unitZ(){
	return distZ()/dist();
}


//Working on serialization code in NetworkController
/*function OnSerializeNetworkView(stream:BitStream, info:NetworkMessageInfo) {
	
	var pos:Vector3;
	
	 if (stream.isWriting) {
	 	pos = transform.position;
        stream.Serialize(pos);
    } else {
        stream.Serialize(pos);
        transform.position = pos;
    }
}*/

function OnSerializeNetworkView(stream:BitStream, info:NetworkMessageInfo) {
	var isMov:boolean;
	var destX:float;
	var destY:float;
	var destZ:float;
	
	var currNodeX:float;
	var currNodeY:float;
	var currNodeZ:float;
	
	var lNodeX:float;
	var lNodeY:float;
	var lNodeZ:float;
	
	var currRot:float;
	
	var hasDest:int;
	var hasCurrNode:int;
	var hasLastNode:int;
	
	if (stream.isWriting) {	 	
		 	isMov = isMoving;
		 	if (destination != null){
			 	destX = destination.transform.position.x;
		 		destY = destination.transform.position.y;
			 	destZ = destination.transform.position.z;
			 	hasDest = 1;
			} else {
				hasDest = -1;
			}
			if (currentNode != null){
			 	currNodeX = currentNode.position.x;
			 	currNodeY = currentNode.position.y;
			 	currNodeZ = currentNode.position.z;
			 	hasCurrNode = 1;
			} else {
				hasCurrNode = -1;
			}
			if (lastNode != null){
			 	lNodeX = lastNode.position.x;
			 	lNodeY = lastNode.position.y;
			 	lNodeZ = lastNode.position.z;
			 	hasLastNode = 1;
			} else {
				hasLastNode = -1;
			}
		 	currRot = currentRotation;
		 	
	        stream.Serialize(isMov);
	        stream.Serialize(destX);
	        stream.Serialize(destY);
	        stream.Serialize(destZ);
	        stream.Serialize(currNodeX);
	        stream.Serialize(currNodeY);
	        stream.Serialize(currNodeZ);
	        stream.Serialize(lNodeX);
	        stream.Serialize(lNodeY);
	        stream.Serialize(lNodeZ);
	        stream.Serialize(currRot);

	    } else {        
	        stream.Serialize(isMov);
	        stream.Serialize(destX);
	        stream.Serialize(destY);
	        stream.Serialize(destZ);
	        stream.Serialize(currNodeX);
	        stream.Serialize(currNodeY);
	        stream.Serialize(currNodeZ);
	        stream.Serialize(lNodeX);
	        stream.Serialize(lNodeY);
	        stream.Serialize(lNodeZ);
	        stream.Serialize(currRot);
	        stream.Serialize(hasDest);
	        stream.Serialize(hasCurrNode);
	        stream.Serialize(hasLastNode);
	        
	        isMoving = isMov;
	        if (hasDest == 1) {
		 		destination.transform.position.x = destX ;
			 	destination.transform.position.y = destY;
		 		destination.transform.position.z = destZ;
		 	} else if (hasDest == -1){
		 		//nothings
		 	}
		 	if (hasCurrNode == 1){
			 	currentNode.position.x = currNodeX;
			 	currentNode.position.y = currNodeY;
			 	currentNode.position.z = currNodeZ;
			} else if (hasCurrNode == -1){
				//nothings
			}
			if (hasLastNode == 1){
			 	lastNode.position.x = lNodeX;
			 	lastNode.position.y = lNodeY;
			 	lastNode.position.z = lNodeZ;
			} else if (hasLastNode == -1){
				//nothings
			}
		 	currentRotation = currRot;      
	    }
}