<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "SELECT `userid`, `user_name`, `password`, case when role = 'A' then 'Administrador' else 'Registrador' end as role, case when active = '1' then 'SI' else 'NO' end as active, `name` FROM `user` ORDER BY name";
	$data = $db->qryData($sql);
	echo json_encode($data);
?>