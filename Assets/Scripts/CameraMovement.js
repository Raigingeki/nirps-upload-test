#pragma strict

var scrollSpeed = 5.0;
var mouseSpeed = 5.0;
var scrollBoarderX = 20.0;
var scrollBoarderY = 20.0;
var zoomSpeed:double = 50;
var zoomCeiling:double = 4;
var zoomFloor:double = 0;
var xLeft:double = -35.0;
var xRight:double = 35.0;
var yBot:double = -50.0;
var yTop:double = 35.0;

function Start () {

}

function Update () {
	var x = Input.GetAxis("Horizontal") * Time.deltaTime * scrollSpeed * zoomFactor();
	var y = Input.GetAxis("Vertical") * Time.deltaTime * scrollSpeed * zoomFactor();
	var scroll = -Input.GetAxis("Mouse ScrollWheel") * Time.deltaTime * zoomSpeed;
	transform.Translate(x, 0, y);
	if (transform.position.x < xLeft) {
		transform.position = new Vector3(xLeft,transform.position.y,transform.position.z);
	} else if (transform.position.x > xRight) {
		transform.position = new Vector3(xRight,transform.position.y,transform.position.z);
	}
	
	if (transform.position.z < yBot){
		transform.position = new Vector3(transform.position.x,transform.position.y,yBot);
	} else if (transform.position.z > yTop){
		transform.position = new Vector3(transform.position.x,transform.position.y,yTop);
	}
	// On PC, the cursor point is the mouse position
	var cursorScreenPosition : Vector3 = Input.mousePosition;
	if (x == 0 && y == 0)
	{
		if (cursorScreenPosition.x <= scrollBoarderX && cursorScreenPosition.x > 0)
		{
			x = -1 * Time.deltaTime * mouseSpeed * zoomFactor();
		}
		else if (cursorScreenPosition.x >= Screen.width - scrollBoarderX && cursorScreenPosition.x < Screen.width)
		{
			if ((Screen.height - cursorScreenPosition.y) < (Screen.height/7)*5.45) { 
				x = 1 * Time.deltaTime * mouseSpeed * zoomFactor();
			}
		}
		if (cursorScreenPosition.y <= scrollBoarderY && cursorScreenPosition.y > 0)
		{
			if (cursorScreenPosition.x < (Screen.width/7)*6) {
				y = -1 * Time.deltaTime * mouseSpeed * zoomFactor();
			}
		}
		else if (cursorScreenPosition.y >= Screen.height - scrollBoarderY && cursorScreenPosition.y < Screen.height)
		{
			y = 1 * Time.deltaTime * mouseSpeed * zoomFactor();
		}
		transform.Translate(x, 0, y);
	}
	//scroll out or in only if it won't put us past our ceiling and floor
	if (scroll > 0){
		if (transform.position.y + scroll < zoomCeiling)
			transform.Translate(0,scroll,0);
		else
			transform.Translate(0,zoomCeiling - transform.position.y, 0);
	} else if (scroll < 0){
		if (transform.position.y + scroll > zoomFloor)
			transform.Translate(0,scroll,0);
		else
			transform.Translate(0,zoomFloor - transform.position.y, 0);
	}
}

function moveOnMiniMap(wide:double, high:double) {
	var xPos:double = ((xRight - xLeft) * wide + xLeft)* 1.55;
	var yPos:double = ((yBot - yTop) * high + yTop +5)*1.1;
	if (xPos < xLeft) {
		xPos = xLeft;
	} else if (xPos > xRight) {
		xPos = xRight;
	}
	if (yPos < yBot) {
		yPos = yBot;
	} else if (yPos > yTop) {
		yPos = yTop;
	}
	transform.position = new Vector3(xPos,transform.position.y,yPos);
}

//calculation: scroll 1x at floor up to 2x at ceiling
function zoomFactor(){
	var percentOffFloor = (transform.position.y - zoomFloor)/zoomCeiling;
	return percentOffFloor + 1;
}