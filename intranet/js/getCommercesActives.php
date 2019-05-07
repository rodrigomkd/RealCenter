<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "SELECT `commerceid`, c.commercetypeid, ct.description as category, `commerce_name`, `commerce_number`, ct.limited, `percent`, CASE WHEN active = '1' THEN 'SI' else 'NO' END AS active FROM commerce c left outer join commerce_type ct on c.commercetypeid = ct.commercetypeid WHERE active = 1 order by c.commerce_name";
	$data = $db->qryData($sql);
	echo json_encode($data);
?>