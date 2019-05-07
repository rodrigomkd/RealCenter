<?php
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "UPDATE `commerce` SET `commercetypeid`='$data->commercetypeid',`commerce_name`='$data->commerce_name',`commerce_number`='$data->commerce_number',`active`='$data->active'  WHERE `commerceid`='$data->commerceid'";
		
	$data = $db->qryFire($sql);
?>