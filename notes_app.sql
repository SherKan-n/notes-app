-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/

-- --------------------------------------------------------

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL,
  `password` varchar(128) DEFAULT NULL,
  `email` varchar(128) DEFAULT 'example@email.com',
  `location` varchar(32) DEFAULT 'Unknown',
  `gender` varchar(10) NOT NULL DEFAULT '-',
  `lastOnline` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `avatar` varchar(128) NOT NULL DEFAULT 'avatar0.png',
  `registerDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

DROP TABLE IF EXISTS `notes`;
CREATE TABLE `notes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT NULL,
  `title` varchar(64) DEFAULT NULL,
  `type` varchar(32) NOT NULL DEFAULT "normal",
  `typeLevel` tinyint(2) NOT NULL DEFAULT 0,
  `text` text DEFAULT NULL,
  `folder` int(11) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

DROP TABLE IF EXISTS `folders`;
CREATE TABLE `folders` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT NULL,
  `title` varchar(64) DEFAULT NULL,
  `type` varchar(32) NOT NULL DEFAULT "normal",
  `typeLevel` tinyint(2) NOT NULL DEFAULT 0,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------