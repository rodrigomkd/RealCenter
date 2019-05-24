<?php
	define("__HOST__", "localhost");
	define("__USER__", "rea1908403561174");
	define("__PASS__", "k0G%Gp7160LWC");
	define("__BASE__", "rea1908403561174");
	
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

			$this->execute();
		}
		
		public function execute() {
			
			echo "Started CRON at " . date("Y-m-d h:i:sa");
			
			$current_date = date("Y-m-d");
			echo "Current Date: " . $current_date;

			//insert new clients
			$sql_clients = "SELECT clientid, register_date FROM client WHERE register_date = '" . $current_date . "'";
			$new_clients = $this->qryData($sql_clients);

			if(count($new_clients) > 0) {
				foreach($new_clients as $row => $val) {
					$sql_clients2 = "INSERT INTO verification_points (clientid, start_date, next_date) values (" . $val->clientid . ", '" . $current_date . "', DATE_ADD('" . $current_date . "', INTERVAL 1 YEAR))";				
					$this->qryFire($sql_clients2);
				}
			}

			//Limit points
			$sql = "SELECT verificationid, clientid, start_date, next_date, points FROM verification_points WHERE next_date = '" . $current_date . "'";
			$clients = $this->qryData($sql);

			if(count($clients) > 0) {
				foreach($clients as $row => $val) {
					if(isset($val->clientid)){
						continue;
					}
					$sql2 = "SELECT SUM(points) as points FROM points WHERE clientid = " . $val->clientid . " AND register_date BETWEEN '" . $val->start_date ."' AND '" . $val->next_date . "'";
					$points = $this->qryRow($sql2);

					$setpoints = 0;
					if($points->points != null) {
						$setpoints = $points->points;
					}
					
					//update values
					$sql3 = "UPDATE verification_points SET points = " . $setpoints . " WHERE verificationid = " . $val->verificationid;
					$this->qryFire($sql3);

					//insert new record
					$sql4 = "INSERT INTO verification_points (clientid, start_date, next_date) values (" . $val->clientid . ", '" . $val->next_date . "', DATE_ADD('" . $val->next_date. "', INTERVAL 1 YEAR))";
					echo "id: " . $val->clientid;
					$this->qryFire($sql4);
					
					if($setpoints < $this->points_per_year){
						$sql5 = "UPDATE points SET valid = 0 WHERE clientid = " . $val->clientid . " AND register_date BETWEEN '" . $val->start_date ."' AND '" . $val->next_date . "'";
						$this->qryFire($sql5);
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