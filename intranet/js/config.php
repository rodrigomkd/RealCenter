<?php
	define("__HOST__", "192.254.234.193");
	define("__USER__", "adrianf_rcenter");
	define("__PASS__", "irH?APae3K,b");
	define("__BASE__", "adrianf_RealCenter_Tarjeta");
	
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
		
		public function getClients() {
			$sql = "SELECT * FROM `client` ORDER BY `name` ASC";
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
		public function qryFire($sql=null) {
			echo $sql;
			if($sql == null) {
				$this->qryPop();
			} else {
				$this->con->query($sql);
				$this->qryPop();	
			}
			//$this->con->close();
			return $this->data;
			//return $last_id = $conn->insert_id;
		}
		
		public function qryPop() {
			$sql = "SELECT `clientid`, `credential_number`, c.name, `last_name`, `email`, `phone`, DATE_FORMAT(birthdate,'%d/%m/%Y') as birthdate, DATE_FORMAT(register_date,'%d/%m/%Y') as register_date, `colony`, `zip`, `gender`, DATE_FORMAT(verification_date,'%d/%m/%Y') as verification_date, u.name AS user FROM client c LEFT OUTER JOIN user u ON c.userid = u.userid ORDER BY `clientid` DESC";
			$qry = $this->con->query($sql);
			if($qry->num_rows > 0) {
				while($row = $qry->fetch_object()) {
					//echo "$row->credential_number";
					//echo "$row->last_name";
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
		
		public function prueba(){
 $query = "SELECT * FROM commerce";
 $sql = $this->conex->query($query); //Se ejecuta directo la consulta, ya que no hay parámetros
 $sql->setFetchMode(PDO::FETCH_ASSOC);
 $movs = array(); //array auxiliar para guardar los movimientos
 while ($row = $sql->fetch()) { //recomerremos una a una las filas obtenidas
    array_push($movs, $row); //guardamos el elemento en el array auxiliar
    unset($row); //eliminamos la fila para evitar sobrecargar la memoria
 }
    return $movs;
 }
 
		public function qryCommerces($sql=null) {
			echo $sql;
			if($sql == null) {
				$this->qryPopCommerces();
			} else {
				$this->con->query($sql);
				$this->qryPopCommerces();	
			}
			return $this->data;
		}
		
		public function qryPopCommerces() {
			$sql = "SELECT `commerceid`, c.commercetypeid, ct.description as category, `commerce_name`, `commerce_number`, ct.limited, `percent` FROM commerce c left outer join commerce_type ct on c.commercetypeid = ct.commercetypeid order by c.commerce_name";
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
	}
?>