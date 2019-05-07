<?php
	define("__HOST__", "199.79.63.142");
	define("__USER__", "gvvcobez_rodrigo");
	define("__PASS__", "Rodrigo.1");
	define("__BASE__", "gvvcobez_real_center");
	
	class CRON {
		private $con = false;
		private $data = array();
		private $points_per_year = 25000;
		
		public function __construct() {
			$this->con = new mysqli(__HOST__, __USER__, __PASS__, __BASE__);
			$this->con->set_charset("utf8");
				
			if(mysqli_connect_errno()) {
				die("DB connection failed:" . mysqli_connect_error());
			}

			//$this->execute();
		}
		
		public function execute() {
			
			echo "Started CRON at " . date("Y-m-d h:i:sa");
			
			$current_date = date("Y-m-d");
			echo "Current Date: " . $current_date;

			$sql = "SELECT verificationid, clientid, start_date, next_date, points FROM verification_points WHERE next_date = '" . $current_date . "'";
			$clients = $this->qryData($sql);

			if(count($clients) > 0) {
				foreach($clients as $row => $val) {
					$sql = "SELECT SUM(points) as points FROM points WHERE clientid = " . $val->clientid . " AND register_date BETWEEN '" . $val->start_date ."' AND '" . $val->next_date . "'";
					$points = $this->qryRow($sql);

					$setpoints = 0;
					if($points->points != null) {
						$setpoints = $points->points;
					}
					
					//update values
					$sql = "UPDATE verification_points SET points = " . $setpoints . " WHERE verificationid = " . $val->verificationid;
					$this->qryFire($sql);

					//insert new record
					$sql = "INSERT INTO verification_points (clientid, start_date, next_date) values (" . $val->clientid . ", '" . $val->next_date . "', DATE_ADD('" . $val->next_date. "', INTERVAL 1 YEAR))";
					$this->qryFire($sql);
					
					if($setpoints < $this->points_per_year){
						$sql = "UPDATE points SET valid = 0 WHERE clientid = " . $val->clientid . " AND register_date BETWEEN '" . $val->start_date ."' AND '" . $val->next_date . "'";
						$this->qryFire($sql);
					}
				}
			} 
					
			echo "Finished CRON at " . date("Y-m-d h:i:sa");

			$this->con->close();

			return $sql;
		}

		public function qryFire($sql=null) {
			if($sql == null) {
				$this->qryPop();
			} else {			
				$this->con->query($sql);
			}

			return $this->con;
		}
				
		public function qryRow($sql=null) {
			$row = null;
			$result = $this->con->query($sql);
			if($result->num_rows > 0) {
				$row = $result->fetch_object();
			}

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

			return $this->data;
		}
	}
?>