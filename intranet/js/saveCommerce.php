<?php
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "INSERT INTO `commerce`(`commercetypeid`, `commerce_name`, `commerce_number`, `active`) VALUES ('$data->commercetypeid','$data->commerce_name','$data->commerce_number','$data->active')";
	$data = $db->qryFire($sql);
?>