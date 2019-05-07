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
		}
		
		public function execute() {
			
			echo "Execute CRON at " . date("h:i:sa");
			
			$current_date = date("Y-m-d");
			$next_date = null;
			echo "Current Date: " . $current_date;

			$sql = "SELECT clientid, register_date, DATE_ADD(register_date, INTERVAL 1 year) AS register_date2, DATE_ADD(register_date, INTERVAL 2 year) AS register_date3, DATE_ADD(register_date, INTERVAL 3 year) AS register_date4 FROM `client`";
			$clients = $this->qryData($sql);

			if(count($clients) > 0) {
				foreach($clients as $row => $val) {
					if($val->register_date2 < $current_date){
						$next_date = $val->register_date2;
						$sql = "SELECT SUM(points) AS points FROM points WHERE clientid = " . $val->clientid . " AND register_date BETWEEN '" . $val->register_date . "' AND '" . $val->register_date2 . "'";
						$points = $this->qryRow($sql);

						$setpoints = 0;
						if($points->points != null) {
							$setpoints = $points->points;
						}

						if($setpoints < $this->points_per_year){
							$sql = "UPDATE points SET valid = 0 WHERE clientid = " . $val->clientid . " AND register_date BETWEEN '" . $val->register_date ."' AND '" . $val->register_date2 . "'";
							$this->qryFire($sql);
						}

						$sql = "INSERT INTO verification_points (clientid, start_date, next_date, points) values (" . $val->clientid . ", '" . $val->register_date . "', DATE_ADD('" . $val->register_date. "', INTERVAL 1 YEAR), " .$setpoints. ")";
						$this->qryFire($sql);
					}

					if($val->register_date3 < $current_date){
						$next_date = $val->register_date3;
						$sql = "SELECT SUM(points) AS points FROM points WHERE clientid = " . $val->clientid . " AND register_date BETWEEN '" . $val->register_date2 . "' AND '" . $val->register_date3 . "'";
						$points = $this->qryRow($sql);

						$setpoints = 0;
						if($points->points != null) {
							$setpoints = $points->points;
						}

						if($setpoints < $this->points_per_year){
							$sql = "UPDATE points SET valid = 0 WHERE clientid = " . $val->clientid . " AND register_date BETWEEN '" . $val->register_date2 ."' AND '" . $val->register_date3 . "'";
							$this->qryFire($sql);
						}

						$sql = "INSERT INTO verification_points (clientid, start_date, next_date, points) values (" . $val->clientid . ", '" . $val->register_date2 . "', DATE_ADD('" . $val->register_date2. "', INTERVAL 1 YEAR), " .$setpoints. ")";
						$this->qryFire($sql);
					}

					if($val->register_date4 < $current_date){
						$next_date = $val->register_date4;
						$sql = "SELECT SUM(points) AS points FROM points WHERE clientid = " . $val->clientid . " AND register_date BETWEEN '" . $val->register_date3 . "' AND '" . $val->register_date4 . "'";
						$points = $this->qryRow($sql);

						$setpoints = 0;
						if($points->points != null) {
							$setpoints = $points->points;
						}

						if($setpoints < $this->points_per_year){
							$sql = "UPDATE points SET valid = 0 WHERE clientid = " . $val->clientid . " AND register_date BETWEEN '" . $val->register_date3 ."' AND '" . $val->register_date4 . "'";
							$this->qryFire($sql);
						}

						$sql = "INSERT INTO verification_points (clientid, start_date, next_date, points) values (" . $val->clientid . ", '" . $val->register_date3 . "', DATE_ADD('" . $val->register_date3. "', INTERVAL 1 YEAR), " .$setpoints. ")";
						$this->qryFire($sql);
					}

					//set last verification_points register
					$sql = "INSERT INTO verification_points (clientid, start_date, next_date) values (" . $val->clientid . ", '" . $next_date . "', DATE_ADD('" . $next_date. "', INTERVAL 1 YEAR))";
					
					$this->qryFire($sql);
				}
			} 
					
			echo "Finished CRON at " . date("h:i:sa");

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