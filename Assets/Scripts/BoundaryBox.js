#pragma strict
public var nodeID:int = 0;
public var path1:Transform[] = new Transform[4];
public var path2:Transform[] = new Transform[4];

function Start () {

}

function Update () {

}

function getNodeID() : int{
	return nodeID;
}

/*function getNextNode(v1:Vector3, id:int) : Transform {
	var node1:Transform = path1[id];
	if (node1 == null)
	{
		return this.GetComponent(Transform);
	}
	if (node1 != null) {
		if (hasSight(v1, node1.position))
		{
			return node1;
		}
	}
	node1 = path2[id];
	if (node1 != null) {
		if (hasSight(v1, node1.position))
		{
			return node1;
		}
	}
	return this.GetComponent(Transform);
}*/

/*function hasSight(v1:Vector3,v2:Vector3) : boolean {
	Debug.Log(Vector3.Distance(v1,v2));
	if (Physics.Raycast(new Vector3(v1.x,-3,v1.z), new Vector3(v2.x-v1.x,-3,v2.z-v1.z), Vector3.Distance(v1,v2),Constants.PathingLayer))
	{
		return false;
	}
	if (Physics.Raycast(new Vector3(v2.x,-3,v2.z), new Vector3(v1.x-v2.x,-3,v1.z-v2.z), Vector3.Distance(v2,v1),Constants.PathingLayer))
	{
		return false;
	}
	return true;	
}*/