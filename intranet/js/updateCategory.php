<?php
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "UPDATE `commerce_type` SET `description`='$data->description',`limited`='$data->limited',`points`='$data->points' WHERE `commercetypeid`='$data->commercetypeid'";
		
	$data = $db->qryFire($sql);
?>