<?php

/**
 * MySQLi database; only one connection is allowed.
 */
class Database
{
  public $connection;
  // Store the single instance.
  private static $instance;

  /**
   * Get an instance of the Database.
   * @return Database
   */
  public static function getInstance()
  {
    if (!self::$instance) {
      self::$instance = new self();
    }
    return self::$instance;
  }

  /**
   * Constructor.
   */
  private function __construct()
  {
    try {

      try{
          $actual_link = "$_SERVER[REQUEST_URI]";
          $arr= explode('/', $actual_link);
          if('business'  ==  $arr[2])
            require_once("../class.Constant.inc");
          else
              require_once("class.Constant.inc");
      }
      catch (Exception $e){}

      $this->connection = Constant::createConnectionForDB();
      $this->connection->exec("SET CHARACTER SET utf8");
    } // Error handling.
    catch (PDOException $e) {
      print "Error!: " . $e->getMessage() . "<br/>";
      die();
    }
  }

  /**
   * Empty clone magic method to prevent duplication.
   */
  private function __clone()
  {
  }

  /**
   * Get the mysqli connection.
   */
  public function getConnection()
  {
    return $this->connection;
  }

  public function runSelectQuery($query)
  {
    try {
      // dbh = database handler
      $dbh = $this->connection;
      $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      // sth = statement handler
      $sth = $dbh->prepare($query);

      // set fetch mode
      $sth->setFetchMode(PDO::FETCH_ASSOC);
      // execute query with parameters
      $sth->execute();
      return $sth;
    } catch (PDOException $ex) {
    }
  }

  public function runInsertQuery($query)
  {
    try {
      // dbh = database handler
      $dbh = $this->connection;
      $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      // sth = statement handler
      $sth = $dbh->prepare($query);
      return $sth->execute();
    } catch (PDOException $ex) {
    }
  }


    public static function runInsertQuery2($query)
    {
        try {
            $db = Database::getInstance();
            $mysqli = $db->getConnection();
            $mysqli->query($query);
        } catch (PDOException $ex) {
            return FALSE;
        }
        return TRUE;
    }

    public static function runSelectQuery2($query)
    {
        try {
            $db = Database::getInstance();
            $mysqli = $db->getConnection();

            $result = $mysqli->query($query);
            return $result;
        } catch (PDOException $ex) {
            return NULL;
        }
    }
}
