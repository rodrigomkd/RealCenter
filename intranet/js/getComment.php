<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "SELECT `commentsid`, `clientid`, DATE_FORMAT(comments_date,'%d/%m/%Y') as comments_date, `description` FROM `comments` WHERE commentsid = '$data->commentsid'";
	$data = $db->qryRow($sql);
	echo json_encode($data);
?>