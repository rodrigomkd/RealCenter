<?php	
	$data = json_decode(file_get_contents("php://input"));
	include('config.php');
	$db = new DB();
	$sql = "SELECT case when DAY(register_date) >= 1 AND DAY(register_date) <= 7 then CONCAT(YEAR(register_date),'-',MONTH(register_date), '-01') when DAY(register_date) >= 8 AND DAY(register_date) <= 14 then CONCAT(YEAR(register_date),'-',MONTH(register_date), '-08') when DAY(register_date) >= 15 AND DAY(register_date) <= LAST_DAY(register_date) then CONCAT(YEAR(register_date),'-',MONTH(register_date), '-15') else register_date end as initial_date, case when DAY(register_date) >= 1 AND DAY(register_date) <= 7 then CONCAT(YEAR(register_date),'-',MONTH(register_date), '-07') when DAY(register_date) >= 8 AND DAY(register_date) <= 14 then CONCAT(YEAR(register_date),'-',MONTH(register_date), '-14') when DAY(register_date) >= 15 AND DAY(register_date) <= LAST_DAY(register_date) then CONCAT(YEAR(register_date),'-',MONTH(register_date), '-', day(last_day(register_date))) else register_date end as final_date, case when DAY(register_date) >= 1 AND DAY(register_date) <= 7 then CONCAT('01/',MONTH(register_date), '/', YEAR(register_date), ' - 07/', MONTH(register_date), '/', YEAR(register_date)) when DAY(register_date) >= 8 AND DAY(register_date) <= 14 then CONCAT('08/',MONTH(register_date), '/', YEAR(register_date), ' - 14/', MONTH(register_date), '/', YEAR(register_date)) when DAY(register_date) >= 15 AND DAY(register_date) <= LAST_DAY(register_date) then CONCAT('15/',MONTH(register_date), '/', YEAR(register_date), ' - ', DAY(last_day(register_date)), '/', MONTH(register_date), '/', YEAR(register_date)) else register_date end as week_s, count(*) as cards, (select count(*) from client where active=1 and register_date between initial_date and final_date) as registers from client c group by 1 ORDER BY DATE(final_date) ASC";

	$data = $db->qryData($sql);
	echo json_encode($data);
?>