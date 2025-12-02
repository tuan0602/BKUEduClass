CREATE DATABASE  IF NOT EXISTS `school` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `school`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: school
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `adminId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `permissions` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`adminId`),
  UNIQUE KEY `userId` (`userId`),
  CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES ('a-001','u-admin-001','FULL_ACCESS');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assignment`
--

DROP TABLE IF EXISTS `assignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignment` (
  `assignmentId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `dueDate` datetime DEFAULT NULL,
  `maxScore` int DEFAULT '100',
  `status` enum('pending','submitted','graded','overdue') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  PRIMARY KEY (`assignmentId`),
  KEY `courseId` (`courseId`),
  CONSTRAINT `assignment_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `course` (`courseId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignment`
--

LOCK TABLES `assignment` WRITE;
/*!40000 ALTER TABLE `assignment` DISABLE KEYS */;
INSERT INTO `assignment` VALUES ('as-001','c-001','Bài tập 1 - Hello World','Viết chương trình in ra Hello World','2025-11-20 23:59:00',100,'pending');
/*!40000 ALTER TABLE `assignment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `courseId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `teacherId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `semester` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `coverImage` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `studentCount` int DEFAULT '0',
  `enrollmentCode` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isLocked` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`courseId`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `enrollmentCode` (`enrollmentCode`),
  KEY `teacherId` (`teacherId`),
  CONSTRAINT `course_ibfk_1` FOREIGN KEY (`teacherId`) REFERENCES `teacher` (`teacherId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES ('c-001','Lập trình Java','JAVA101','Khóa học nhập môn Java cơ bản','t-001','HK1-2025',NULL,1,'JOINJAVA',0);
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discussion`
--

DROP TABLE IF EXISTS `discussion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discussion` (
  `discussionId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `authorId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `isPinned` tinyint(1) DEFAULT '0',
  `pinned` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`discussionId`),
  KEY `courseId` (`courseId`),
  KEY `authorId` (`authorId`),
  CONSTRAINT `discussion_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `course` (`courseId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `discussion_ibfk_2` FOREIGN KEY (`authorId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discussion`
--

LOCK TABLES `discussion` WRITE;
/*!40000 ALTER TABLE `discussion` DISABLE KEYS */;
INSERT INTO `discussion` VALUES ('dis-001','c-001','u-student-001','Thắc mắc về bài tập 1','Thầy ơi, bài tập 1 có cần nộp file .java không ạ?','2025-11-05 08:00:00',0,0);
/*!40000 ALTER TABLE `discussion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `document`
--

DROP TABLE IF EXISTS `document`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `document` (
  `documentId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('pdf','video','slide') COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uploadedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`documentId`),
  KEY `courseId` (`courseId`),
  CONSTRAINT `document_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `course` (`courseId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `document`
--

LOCK TABLES `document` WRITE;
/*!40000 ALTER TABLE `document` DISABLE KEYS */;
INSERT INTO `document` VALUES ('doc-001','c-001','Slide bài 1 - Giới thiệu Java','slide','https://example.com/docs/slide1.pdf','2025-11-01 09:00:00','Bài giảng');
/*!40000 ALTER TABLE `document` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enrollment`
--

DROP TABLE IF EXISTS `enrollment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrollment` (
  `enrollmentId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `studentId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `enrolledAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`enrollmentId`),
  UNIQUE KEY `courseId` (`courseId`,`studentId`),
  UNIQUE KEY `UKfryhyhx5ym55ipr33l5iqkrwx` (`courseId`,`studentId`),
  KEY `studentId` (`studentId`),
  CONSTRAINT `enrollment_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `course` (`courseId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `enrollment_ibfk_2` FOREIGN KEY (`studentId`) REFERENCES `student` (`studentId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollment`
--

LOCK TABLES `enrollment` WRITE;
/*!40000 ALTER TABLE `enrollment` DISABLE KEYS */;
INSERT INTO `enrollment` VALUES ('en-001','c-001','s-001','2025-11-01 08:00:00');
/*!40000 ALTER TABLE `enrollment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reply`
--

DROP TABLE IF EXISTS `reply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reply` (
  `replyId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discussionId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `authorId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`replyId`),
  KEY `discussionId` (`discussionId`),
  KEY `authorId` (`authorId`),
  CONSTRAINT `reply_ibfk_1` FOREIGN KEY (`discussionId`) REFERENCES `discussion` (`discussionId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reply_ibfk_2` FOREIGN KEY (`authorId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reply`
--

LOCK TABLES `reply` WRITE;
/*!40000 ALTER TABLE `reply` DISABLE KEYS */;
INSERT INTO `reply` VALUES ('rep-001','dis-001','u-teacher-001','Chỉ cần nộp file .zip chứa mã nguồn là được em nhé.','2025-11-05 09:00:00');
/*!40000 ALTER TABLE `reply` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `studentId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `major` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `year` int DEFAULT NULL,
  `className` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`studentId`),
  UNIQUE KEY `userId` (`userId`),
  CONSTRAINT `student_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES ('cd5132da-4256-416e-b82f-80a96cf5d0f2','ef38652c-00fa-49b1-90e5-8c6a7b0c2fdc','Computer Science',3,'CS2022A'),('s-001','u-student-001','Khoa học máy tính',3,'DHKTPM19A');
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submission`
--

DROP TABLE IF EXISTS `submission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `submission` (
  `submissionId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `assignmentId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `studentId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `submittedAt` datetime DEFAULT NULL,
  `fileUrl` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `score` int DEFAULT NULL,
  `feedback` text COLLATE utf8mb4_unicode_ci,
  `fileName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `status` enum('submitted','graded') COLLATE utf8mb4_unicode_ci DEFAULT 'submitted',
  PRIMARY KEY (`submissionId`),
  KEY `assignmentId` (`assignmentId`),
  KEY `studentId` (`studentId`),
  CONSTRAINT `submission_ibfk_1` FOREIGN KEY (`assignmentId`) REFERENCES `assignment` (`assignmentId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `submission_ibfk_2` FOREIGN KEY (`studentId`) REFERENCES `student` (`studentId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submission`
--

LOCK TABLES `submission` WRITE;
/*!40000 ALTER TABLE `submission` DISABLE KEYS */;
INSERT INTO `submission` VALUES ('sub-001','as-001','s-001','2025-11-05 10:30:00','https://example.com/uploads/helloworld.zip',95,'Tốt, cần chú ý format code.','helloworld.zip','Làm đúng yêu cầu','graded');
/*!40000 ALTER TABLE `submission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher`
--

DROP TABLE IF EXISTS `teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher` (
  `teacherId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hireDate` date DEFAULT NULL,
  PRIMARY KEY (`teacherId`),
  UNIQUE KEY `userId` (`userId`),
  CONSTRAINT `teacher_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher`
--

LOCK TABLES `teacher` WRITE;
/*!40000 ALTER TABLE `teacher` DISABLE KEYS */;
INSERT INTO `teacher` VALUES ('t-001','u-teacher-001','Công nghệ thông tin','2020-09-01');
/*!40000 ALTER TABLE `teacher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `userId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('ADMIN','TEACHER','STUDENT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isLocked` tinyint(1) DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('00d3d256-6a78-4275-8642-e867258df989','student1@gmail.com','$2a$10$7K4Qz8X/kEwrLFmWkXhx4eKZvHeZvWbAtcraoUVNY1N22l1HaXipq','Student One','STUDENT',NULL,NULL,0,'2025-11-15 20:07:48'),('872d5b20-6634-4478-bb5f-94429e87eadd','tuan.le060201@hcmut.edu.vn','$2a$10$xJBJTJ7EBxyEyifLpVWieeeBEqhGMSfwhkNK3wcU/AfaWohxiklBe','Lê nguyễn Anh Tuấn','STUDENT',NULL,NULL,0,'2025-11-20 20:14:54'),('9559f54f-f3ed-42c6-a72d-9564c205c967','phuongnguyen@gmail.com','$2a$10$aF.PuE7/zZoRq3/H3VIthuEyLIpx2Pmrm3bqlR7G6Sptppwmax2Ki','nguyễn thị phương','STUDENT',NULL,NULL,0,'2025-11-22 07:42:31'),('a2c5a742-94df-461e-9e03-6754335c69a0','minhduc0601@gmail.com','$2a$10$/6zGzMHcoznY2veFEFWXWOLZ9aAcZx6U/VzeDiMNTcogyzDYv5CCy','lê minh đức','TEACHER',NULL,NULL,0,'2025-11-22 05:34:12'),('bc0245d0-e592-4b78-a674-fee88c5ae967','minhquan200@gmail.com','$2a$10$N.7WFqamRfYjwrz13AucP.Tv48eut5sL7KPJFA8TcgRmZucXHBUlS','nguyên minh quân','STUDENT',NULL,NULL,0,'2025-11-22 05:33:09'),('be446977-b802-4857-a529-3a78b926c9c3','minhnguyen1003@gmail.com','$2a$10$jC/T1Ph8wysVPvx5idqRMu/X55aMme9PGR7wZUdKa4bhQM.fFp/4S','Nguyễn Văn Minh','TEACHER',NULL,NULL,0,'2025-11-22 05:35:50'),('c3e8bf9d-319e-4b55-9c59-1252e2e69efd','anhtuan060201@gmail.com','$2a$10$4UfC28wgVvmkdqvUtFZEVOitq1iBSv6ND1DylC9L6.nNI3v0zqzpO','anh tuấn','TEACHER',NULL,NULL,0,'2025-11-20 20:17:42'),('c87695cf-e987-4d45-813d-c52e250d9f79','b@gmail.com','$2a$10$hRnV6LBprqwHXV5Y701JxO6DaGgzSFwYorgzGLDGb5wS5V9ieNtua','nguyễn văn B','STUDENT',NULL,NULL,0,'2025-11-22 06:38:01'),('ef38652c-00fa-49b1-90e5-8c6a7b0c2fdc','student2@example.com','$2a$10$KCL.ysN.0/leKbebW1yGtuRo97aDzEoP4QMKMqKRtk6HyqgYtLM6i','Nguyen Van A','STUDENT',NULL,'0123456789',0,'2025-11-24 19:38:51'),('u-admin-001','admin@example.com','$2a$10$drFSoBA4JI/NYcuwYl.xruDt6vm1AHr/WhRXaW4DK4A5NPrctKRsi','Quản trị viên','ADMIN',NULL,'0909000000',0,'2025-11-16 03:06:37'),('u-student-001','student@example.com','123456','Sinh viên Trần Văn B','STUDENT',NULL,'0909000002',0,'2025-11-16 03:06:37'),('u-teacher-001','teacher@example.com','123456','Thầy Nguyễn Văn A','TEACHER',NULL,'0909000001',0,'2025-11-16 03:06:37');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-25 22:38:20
