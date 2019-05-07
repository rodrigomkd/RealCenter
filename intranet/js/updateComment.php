<?php
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "UPDATE `comments` SET `description`='$data->description' WHERE `commentsid`='$data->commentsid'";
		
	$data = $db->qryFire($sql);
?>