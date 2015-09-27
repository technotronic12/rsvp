<?php
/**
 * Created by JetBrains PhpStorm.
 * User: aviad
 * Date: 11/05/14
 * Time: 23:05
 * To change this template use File | Settings | File Templates.
 */

// SWITCH TO LOCAL
define( "FLAG_LOCAL", TRUE );
//define("FLAG_LOCAL", FALSE );




class Constant {

    /**
     *
     * return connection for DB
     *
     * @return PDO
     */
    public static function createConnectionForDB(){
        if( FLAG_LOCAL == FALSE){// ONLINE
            return new PDO("mysql:host=ponyatovskicom.ipagemysql.com; dbname=mips", 'aviad_eli', 'qweqwe');
        }
        else if( FLAG_LOCAL == TRUE){// LOCAL
            return new PDO("mysql:host=localhost; dbname=mips", 'root', '');
        }
    }

}
