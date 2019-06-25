<?php
	define("__HOST__", "localhost");
	define("__USER__", "realcent_tarjeta");
	define("__PASS__", "bw[4z-CwRge8");
	define("__BASE__", "realcent_tarjeta");
	
	class DB {
		private $con = false;
		private $data = array();
		
		public function __construct() {
			$this->con = new mysqli(__HOST__, __USER__, __PASS__, __BASE__);
			$this->con->set_charset("utf8");
				
			if(mysqli_connect_errno()) {
				die("DB connection failed:" . mysqli_connect_error());
			}
		}

		public function qryFire($sql=null) {
			echo $sql;
			if($sql == null) {
				$this->qryPop();
			} else {
				$this->con->query($sql);
				$this->qryPop();	
			}
			return $this->data;
		}
		
		public function qryPop() {
			$sql = "SELECT `clientid`, `credential_number`, c.name, `last_name`, `email`, `phone`, DATE_FORMAT(birthdate,'%d/%m/%Y') as birthdate, DATE_FORMAT(register_date,'%d/%m/%Y') as register_date, `colony`, `zip`, `gender`, DATE_FORMAT(verification_date,'%d/%m/%Y') as verification_date, u.name AS user FROM client c LEFT OUTER JOIN user u ON c.userid = u.userid ORDER BY `clientid` DESC";
			$qry = $this->con->query($sql);
			if($qry->num_rows > 0) {
				while($row = $qry->fetch_object()) {
					$this->data[] = $row;
				}
			} else {
				$this->data[] = null;
			}
			$this->con->close();
		}
				
		public function qryRow($sql=null) {
			$result = $this->con->query($sql);
			$row = $result->fetch_object();
			return $row;
		}
		
		public function qryData($sql=null) {
			$qry = $this->con->query($sql);
			if($qry->num_rows > 0) {
				while($row = $qry->fetch_object()) {
					$this->data[] = $row;
				}
			} else {
				$this->data[] = null;
			}
			$this->con->close();
			return $this->data;
		}
	}
?>