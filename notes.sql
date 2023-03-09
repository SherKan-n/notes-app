-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: db-eu-01.sparkedhost.us:3306
-- Generation Time: Mar 05, 2023 at 02:38 PM
-- Server version: 10.6.12-MariaDB-1:10.6.12+maria~ubu1804
-- PHP Version: 8.1.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `notes`
--
CREATE DATABASE IF NOT EXISTS `notes` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `notes`;

-- --------------------------------------------------------

--
-- Table structure for table `folders`
--

CREATE TABLE `folders` (
  `id` bigint(20) NOT NULL,
  `uid` int(11) DEFAULT NULL,
  `title` varchar(64) DEFAULT NULL,
  `type` varchar(32) NOT NULL DEFAULT 'normal',
  `typeLevel` tinyint(1) NOT NULL DEFAULT 0,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `folders`
--

INSERT INTO `folders` (`id`, `uid`, `title`, `type`, `typeLevel`, `date`) VALUES
(10, 1, 'TEST FOLDER', 'informative', 1, '2023-02-19 20:18:35'),
(12, 1, '12E123F23F23F', 'important', 2, '2023-02-19 20:19:46'),
(13, 1, '12E12EX12E12EX12EX', 'urgent', 3, '2023-02-19 20:19:51'),
(14, 1, '12EX1E12E 1E12E 12E ', 'completed', -1, '2023-02-19 20:19:59'),
(15, 1, 'WAFWAFAWFWAFZ2E1', 'urgent', 3, '2023-02-19 21:03:07'),
(16, 1, 'WGWGWGWGWEGWEG', 'informative', 1, '2023-02-19 21:06:23'),
(17, 1, 'AWFWAFWAFWF', 'important', 2, '2023-02-19 21:07:44'),
(18, 1, 'WETWW3GW3 W3 R', 'normal', 0, '2023-02-19 21:07:54'),
(19, 1, 'AWFAWFAWFAWFAWFAW', 'normal', 0, '2023-02-19 21:08:45'),
(20, 5, '1', 'normal', 0, '2023-02-19 21:09:43'),
(21, 5, '2', 'informative', 1, '2023-02-19 21:09:46'),
(22, 5, '3', 'completed', -1, '2023-02-19 21:09:49'),
(23, 5, '4', 'important', 2, '2023-02-19 21:09:54'),
(24, 5, '5', 'urgent', 3, '2023-02-19 21:10:00');

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

CREATE TABLE `notes` (
  `id` bigint(20) NOT NULL,
  `uid` int(11) DEFAULT NULL,
  `title` varchar(64) DEFAULT NULL,
  `type` varchar(32) NOT NULL DEFAULT 'normal',
  `typeLevel` tinyint(1) NOT NULL DEFAULT 0,
  `text` text DEFAULT NULL,
  `folder` int(11) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `notes`
--

INSERT INTO `notes` (`id`, `uid`, `title`, `type`, `typeLevel`, `text`, `folder`, `date`) VALUES
(53, 5, 'AWDADAWD', 'normal', 0, 'awfawfawfawf', 1, '2023-01-30 00:02:25'),
(54, 5, 'AWFAWFAWFFAHH', 'informative', 1, 'wfawfawfawf', 1, '2023-01-30 00:02:30'),
(55, 5, '123131321', 'important', 2, '13135532', 1, '2023-01-30 00:02:36'),
(56, 5, 'AWFAWFAWGGW4G', 'urgent', 3, 'awfawfawfawf', 2, '2023-01-30 00:02:41'),
(57, 5, '131414142', 'important', 2, '14124124', 3, '2023-01-30 00:03:30'),
(58, 5, 'AWAWFAWF', 'informative', 1, 'ffawfawf', 2, '2023-01-30 00:03:58'),
(80, 1, '21412414', 'informative', 1, 'fawfwaf\nawd awd\na\nw dawd', NULL, '2023-02-19 20:18:03'),
(81, 1, '123123123123123', 'important', 2, '2r1', NULL, '2023-02-19 20:18:10'),
(82, 1, '131231231312312312', 'urgent', 3, '12312312312312', NULL, '2023-02-19 20:18:23'),
(84, 1, 'TEST 2222', 'informative', 1, 'testttt', 10, '2023-02-19 20:19:04'),
(85, 1, 'AWFAWFWAF', 'informative', 1, 'teawfawf', 10, '2023-02-19 20:19:14'),
(86, 1, 'TESFAWFAW', 'informative', 1, 'wfawfawfaf', 10, '2023-02-19 20:19:23'),
(87, 1, 'WT2323F23F', 'informative', 1, '23f32g23g', 10, '2023-02-19 20:19:32'),
(88, 1, 'WADAWDAW', 'completed', -1, 'dawdawd', NULL, '2023-02-19 20:20:15'),
(90, 1, 'TEST', 'urgent', 3, 'test', 13, '2023-02-19 20:21:58'),
(91, 1, 'TEST', 'important', 2, 'test', 12, '2023-02-19 20:22:08'),
(93, 1, 'AFWAFAWF', 'completed', -1, '23r32r  23r\n23r 23r', NULL, '2023-02-19 21:04:00'),
(94, 1, 'AWFAWFAWFAF', 'important', 2, 'awfawfawf', NULL, '2023-02-19 21:05:25'),
(98, 5, 'TEST1', 'normal', 0, '1', NULL, '2023-02-19 21:09:15'),
(99, 5, 'TEST2', 'informative', 1, '2', NULL, '2023-02-19 21:09:22'),
(100, 5, 'TEST3', 'completed', -1, '3', NULL, '2023-02-19 21:09:27'),
(101, 5, 'TEST4', 'urgent', 3, '3', NULL, '2023-02-19 21:09:33'),
(102, 5, 'TEST5', 'important', 2, 'test', NULL, '2023-02-19 21:09:39'),
(103, 5, 'TEST2', 'urgent', 3, 'test', 24, '2023-02-19 21:10:26'),
(104, 5, 'TEST2222', 'urgent', 3, 'tes', 24, '2023-02-19 21:10:36'),
(105, 5, 'TESFAWFAWF', 'urgent', 3, 'atawfawf', 24, '2023-02-19 21:10:43'),
(106, 5, 'AWFAWFA23R2R', 'urgent', 3, '3f2f2', 24, '2023-02-19 21:10:48'),
(107, 5, 'TEST', 'important', 2, 'wfawf', 23, '2023-02-19 21:14:20'),
(108, 5, 'TEAWF', 'informative', 1, 'tawfwf', 21, '2023-02-19 21:14:30'),
(109, 5, 'AWFWAF', 'normal', 0, 'awfawfwf', 20, '2023-02-19 21:14:35'),
(110, 5, 'AFAWF', 'completed', -1, 'awfwaf', 22, '2023-02-19 21:14:49'),
(111, 1, 'AWFAWF', 'important', 2, 'awfwaf', 17, '2023-02-19 21:32:37'),
(112, 1, 'AWFAWF', 'urgent', 3, 'awfawf', 15, '2023-02-19 21:32:47'),
(113, 1, 'AWFAWF213123', 'important', 2, 'awfawfwaf', 17, '2023-02-19 21:32:57'),
(114, 1, 'TEST', 'informative', 1, '242342', 16, '2023-02-19 21:33:30'),
(115, 1, 'AWFAWF4234234', 'normal', 0, '23423424', 19, '2023-02-19 21:34:17'),
(116, 1, '324234', 'normal', 0, '23424', 18, '2023-02-19 21:34:48'),
(118, 1, '1', 'completed', -1, '1', 14, '2023-02-19 21:35:08'),
(119, 1, 'TESTAWAAWF', 'important', 2, '23123123', 17, '2023-02-19 21:50:07'),
(122, 1, 'WWAFWAF', 'completed', -1, 'awfawf', 14, '2023-02-27 21:37:43'),
(123, 1, 'AWFWAF', 'normal', 0, 'awfwaf', NULL, '2023-02-27 21:37:59'),
(124, 1, 'AWFAWFAWF', 'normal', 0, 'awfawfawf', NULL, '2023-02-27 22:12:12');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(64) DEFAULT NULL,
  `password` varchar(128) DEFAULT NULL,
  `email` varchar(128) DEFAULT 'example@email.com',
  `location` varchar(32) DEFAULT 'Unknown',
  `gender` varchar(10) NOT NULL DEFAULT '-',
  `lastOnline` timestamp NOT NULL DEFAULT current_timestamp(),
  `avatar` varchar(128) NOT NULL DEFAULT 'avatar0.png',
  `registerDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `password`, `email`, `location`, `gender`, `lastOnline`, `avatar`, `registerDate`) VALUES
(1, 'SherKan', '$2a$08$CSJDr01.dIe0eNkDVabxruzW.KMdUpEsILWJjg0SIBzv5JUuXaTUu', 'balasca_e@yahoo.ro', 'Romania', 'male', '2023-01-14 23:13:39', 'avatar0.png', '2023-01-14 23:13:39'),
(2, 'test', '$2a$08$Sib/LjhfJaBzbFRUIBa3E.txLTNbtJz6f3eMz.322B54lw4kH7UFC', 'afawfw@fawf.com', 'Aruba', 'male', '2023-01-15 21:34:44', 'avatar0.png', '2023-01-15 21:34:44'),
(3, 'Ioana', '$2a$08$VrLPkjMPY9HIRqtDscNhh.MR1qamg8zoSb1CzStgY4jHhjT9C//Ne', '123@123.22', 'Australia', 'female', '2023-01-15 23:32:37', 'avatar0.png', '2023-01-15 23:32:37'),
(4, 'Alexa', '$2a$08$SBo4ThwaVw3TE4maDJKr5uOjNebvwHcf4LhKHXtVrMK6zYx03L4Fy', '123@12322.22', 'Algeria', 'female', '2023-01-15 23:36:50', 'avatar1.png', '2023-01-15 23:36:50'),
(5, 'Test', '$2a$08$1/YE5jC9AJZbJpyalhZUvev.zp8qh0jfxL.ZZNdXDKDGCZ0dug6Gq', 'test@test.com', 'Aruba', 'male', '2023-01-29 23:48:39', 'avatar0.png', '2023-01-29 23:48:39');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `folders`
--
ALTER TABLE `folders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `folders`
--
ALTER TABLE `folders`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `notes`
--
ALTER TABLE `notes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=127;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
