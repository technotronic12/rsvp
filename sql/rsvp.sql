-- phpMyAdmin SQL Dump
-- version 4.0.4.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Sep 26, 2015 at 11:41 AM
-- Server version: 5.6.11
-- PHP Version: 5.4.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `mips`
--

-- --------------------------------------------------------

--
-- Table structure for table `rsvp`
--

CREATE TABLE IF NOT EXISTS `rsvp` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'auto increment index',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(255) NOT NULL,
  `adults` int(10) unsigned NOT NULL,
  `kids` int(10) unsigned DEFAULT NULL,
  `vegetarian` tinyint(1) NOT NULL,
  `vegan` tinyint(1) NOT NULL,
  `vegan_num` int(10) unsigned DEFAULT NULL,
  `vegan_text` text,
  PRIMARY KEY (`id`),
  KEY `name` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `rsvp`
--

INSERT INTO `rsvp` (`id`, `date`, `name`, `adults`, `kids`, `vegetarian`, `vegan`, `vegan_num`, `vegan_text`) VALUES
(2, '2015-09-25 21:22:50', 'nueh', 3, 3, 0, 0, 0, 'no'),
(3, '2015-09-25 21:23:09', 'nueh', 3, 3, 1, 0, 3, 'no'),
(4, '2015-09-25 21:36:25', 'רשדשג שדג', 5, 0, 0, 0, 0, 'no');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
