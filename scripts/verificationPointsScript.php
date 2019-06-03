<?php
	define("__HOST__", "localhost");
	define("__USER__", "rea1908403561174");
	define("__PASS__", "k0G%Gp7160LWC");
	define("__BASE__", "rea1908403561174");
	
	class CRON {
		private $con = false;
		private $data = array();
		
		public function __construct() {
			$this->con = new mysqli(__HOST__, __USER__, __PASS__, __BASE__);
			$this->con->set_charset("utf8");
				
			if(mysqli_connect_errno()) {
				die("DB connection failed:" . mysqli_connect_error());
			}

			$this->execute();
		}
		
		public function execute() {
			
			echo "Execute CRON at " . date("h:i:sa");
			echo "Truncate verification_points table. ";
			$sql_truncate = "DELETE FROM verification_points";
			$this->qryFire($sql_truncate);
			
			$current_date = date("Y-m-d");
			$next_date = null;
			echo "Current Date: " . $current_date;

			$sql = "SELECT clientid, register_date, DATE_ADD(register_date, INTERVAL 1 year) AS register_date2, DATE_ADD(register_date, INTERVAL 2 year) AS register_date3, DATE_ADD(register_date, INTERVAL 3 year) AS register_date4 FROM `client`";
			$clients = $this->qryData($sql);
			echo "count clientL" . count($clients);
			if(count($clients) > 0) {
				foreach($clients as $row => $val) {
					if($val->register_date2 < $current_date){
						$next_date = $val->register_date2;
						$sql = "SELECT SUM(points) AS points FROM points WHERE clientid = " . $val->clientid . " AND register_date BETWEEN '" . $val->register_date . "' AND '" . $val->register_date2 . "'";
						echo "sql" . $sql;
						$points = $this->qryRow($sql);

						$setpoints = 0;
						if($points->points != null) {
							$setpoints = $points->points;
						}

						//expire points 2016
						$sql = "UPDATE points SET valid = 0 WHERE clientid = " . $val->clientid . " AND register_date BETWEEN '" . $val->register_date ."' AND '" . $val->register_date2 . "'";
						$this->qryFire($sql);

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

						//expire points 2017
						$sql = "UPDATE points SET valid = 0 WHERE clientid = " . $val->clientid . " AND register_date BETWEEN '" . $val->register_date2 ."' AND '" . $val->register_date3 . "'";
						$this->qryFire($sql);

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

						//expire points 2018
						$sql = "UPDATE points SET valid = 0 WHERE clientid = " . $val->clientid . " AND register_date BETWEEN '" . $val->register_date3 ."' AND '" . $val->register_date4 . "'";
						$this->qryFire($sql);

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