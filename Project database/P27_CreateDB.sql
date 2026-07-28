CREATE DATABASE  IF NOT EXISTS `bookwormfinal_backup` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `bookwormfinal_backup`;
-- MySQL dump 10.13  Distrib 8.0.25, for Win64 (x86_64)
--
-- Host: localhost    Database: bookwormfinal_backup
-- ------------------------------------------------------
-- Server version	8.2.0

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
-- Table structure for table `attribute`
--

DROP TABLE IF EXISTS `attribute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attribute` (
  `attribute_id` int NOT NULL AUTO_INCREMENT,
  `Attribute Desc` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`attribute_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `author`
--

DROP TABLE IF EXISTS `author`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `author` (
  `author_id` int NOT NULL AUTO_INCREMENT,
  `bio` text,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`author_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `beneficiary`
--

DROP TABLE IF EXISTS `beneficiary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beneficiary` (
  `beneficiary_id` int NOT NULL AUTO_INCREMENT,
  `beneficiary_acc_no` varchar(255) DEFAULT NULL,
  `beneficiary_acc_type` varchar(255) DEFAULT NULL,
  `beneficiary_bank_branch` varchar(255) DEFAULT NULL,
  `beneficiary_bank_name` varchar(255) DEFAULT NULL,
  `beneficiary_contact_no` varchar(255) DEFAULT NULL,
  `beneficiary_email_id` varchar(255) DEFAULT NULL,
  `beneficiary_ifsc` varchar(255) DEFAULT NULL,
  `beneficiary_name` varchar(255) DEFAULT NULL,
  `beneficiary_pan` varchar(255) DEFAULT NULL,
  `product_id` int NOT NULL,
  PRIMARY KEY (`beneficiary_id`),
  KEY `FKbxg0dfum4rlk8wwv9o6y1ma0d` (`product_id`),
  CONSTRAINT `FKbxg0dfum4rlk8wwv9o6y1ma0d` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `cart_id` int NOT NULL AUTO_INCREMENT,
  `qty` int NOT NULL,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`cart_id`),
  KEY `FK3d704slv66tw6x5hmbm6p2x3u` (`product_id`),
  KEY `FKl70asp4l4w0jmbm1tqyofho4o` (`user_id`),
  CONSTRAINT `FK3d704slv66tw6x5hmbm6p2x3u` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`),
  CONSTRAINT `FKl70asp4l4w0jmbm1tqyofho4o` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=158 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `genere`
--

DROP TABLE IF EXISTS `genere`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genere` (
  `genere_id` int NOT NULL AUTO_INCREMENT,
  `genere_desc` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`genere_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `language`
--

DROP TABLE IF EXISTS `language`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `language` (
  `language_id` int NOT NULL AUTO_INCREMENT,
  `language_desc` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`language_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `library_package`
--

DROP TABLE IF EXISTS `library_package`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `library_package` (
  `package_id` int NOT NULL AUTO_INCREMENT,
  `book_limit` int DEFAULT NULL,
  `cost` decimal(10,2) NOT NULL,
  `description` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `validity_days` int DEFAULT NULL,
  PRIMARY KEY (`package_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `library_package_purchase`
--

DROP TABLE IF EXISTS `library_package_purchase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `library_package_purchase` (
  `purchase_id` int NOT NULL AUTO_INCREMENT,
  `transaction_id` bigint NOT NULL,
  `user_id` int NOT NULL,
  `package_id` int NOT NULL,
  `package_price` decimal(38,2) NOT NULL,
  `allowed_books` int NOT NULL,
  `avg_book_price` decimal(38,2) NOT NULL,
  `purchase_date` datetime NOT NULL,
  PRIMARY KEY (`purchase_id`),
  KEY `idx_lpp_transaction` (`transaction_id`),
  KEY `idx_lpp_user` (`user_id`),
  KEY `idx_lpp_package` (`package_id`),
  CONSTRAINT `fk_lpp_package` FOREIGN KEY (`package_id`) REFERENCES `library_package` (`package_id`),
  CONSTRAINT `fk_lpp_transaction` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`transaction_id`),
  CONSTRAINT `fk_lpp_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `library_package_purchase_item`
--

DROP TABLE IF EXISTS `library_package_purchase_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `library_package_purchase_item` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `purchase_id` int NOT NULL,
  `product_id` int NOT NULL,
  `royalty_percent` decimal(38,2) NOT NULL,
  `royalty_amount` decimal(38,2) NOT NULL,
  PRIMARY KEY (`item_id`),
  KEY `idx_lppi_purchase` (`purchase_id`),
  KEY `idx_lppi_product` (`product_id`),
  CONSTRAINT `fk_lppi_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`),
  CONSTRAINT `fk_lppi_purchase` FOREIGN KEY (`purchase_id`) REFERENCES `library_package_purchase` (`purchase_id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `my_library`
--

DROP TABLE IF EXISTS `my_library`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `my_library` (
  `my_lib_id` int NOT NULL AUTO_INCREMENT,
  `books_allowed` int NOT NULL,
  `books_taken` int NOT NULL,
  `end_date` date DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `package_id` int NOT NULL,
  `product_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`my_lib_id`),
  KEY `FKjbvvfdmgstwlwn8ntsl3biw4c` (`package_id`),
  KEY `FKip8g980dpsj8kyuc29yhjvcmq` (`product_id`),
  KEY `FKj1bkdl8fyy4p3omi59flyqq00` (`user_id`),
  CONSTRAINT `FKip8g980dpsj8kyuc29yhjvcmq` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`),
  CONSTRAINT `FKj1bkdl8fyy4p3omi59flyqq00` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `FKjbvvfdmgstwlwn8ntsl3biw4c` FOREIGN KEY (`package_id`) REFERENCES `library_package` (`package_id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `my_shelf`
--

DROP TABLE IF EXISTS `my_shelf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `my_shelf` (
  `shelf_id` int NOT NULL AUTO_INCREMENT,
  `product_expiry_date` datetime(6) DEFAULT NULL,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`shelf_id`),
  KEY `FKi9jt4pby2o2jrf15ltnwth8bk` (`product_id`),
  KEY `FKph5mtfix6ti7nwnsf4xn59a1m` (`user_id`),
  CONSTRAINT `FKi9jt4pby2o2jrf15ltnwth8bk` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`),
  CONSTRAINT `FKph5mtfix6ti7nwnsf4xn59a1m` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pdf_book`
--

DROP TABLE IF EXISTS `pdf_book`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pdf_book` (
  `pdf_id` int NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) DEFAULT NULL,
  `pdf_data` longblob,
  `product_id` int NOT NULL,
  PRIMARY KEY (`pdf_id`),
  KEY `FKbj6akvkak2ehhya0wnsf0weht` (`product_id`),
  CONSTRAINT `FKbj6akvkak2ehhya0wnsf0weht` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `discount_percent` decimal(5,2) DEFAULT NULL,
  `is_library` bit(1) DEFAULT NULL,
  `min_rent_days` int DEFAULT NULL,
  `product_baseprice` decimal(38,2) NOT NULL,
  `product_description_long` text,
  `product_description_short` varchar(255) DEFAULT NULL,
  `product_image` varchar(255) DEFAULT NULL,
  `product_isbn` varchar(255) NOT NULL,
  `product_name` varchar(150) NOT NULL,
  `product_off_price_expirydate` date DEFAULT NULL,
  `product_offerprice` decimal(38,2) DEFAULT NULL,
  `rent_per_day` decimal(5,2) DEFAULT NULL,
  `is_rentable` bit(1) DEFAULT NULL,
  `royalty_percent` decimal(38,2) DEFAULT NULL,
  `attribute_id` int DEFAULT NULL,
  `product_author` int DEFAULT NULL,
  `product_genere` int DEFAULT NULL,
  `product_lang` int DEFAULT NULL,
  `product_type` int DEFAULT NULL,
  `product_publisher` int DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  KEY `FKk3j4x5gp4cs69mquqe893i3hl` (`attribute_id`),
  KEY `FKn0k3dgs9nbb0tnolhg1af4s83` (`product_author`),
  KEY `FKk630ngm1ti3hucpttardvn910` (`product_genere`),
  KEY `FK4t9pvspkgp6ev2o32evhevy48` (`product_lang`),
  KEY `FKij1k07u3o1luyr3duuk4glewn` (`product_type`),
  KEY `FKb8lf9e3p2wad5qyyu08jx6ebs` (`product_publisher`),
  CONSTRAINT `FK4t9pvspkgp6ev2o32evhevy48` FOREIGN KEY (`product_lang`) REFERENCES `language` (`language_id`),
  CONSTRAINT `FKb8lf9e3p2wad5qyyu08jx6ebs` FOREIGN KEY (`product_publisher`) REFERENCES `publisher` (`publisher_id`),
  CONSTRAINT `FKij1k07u3o1luyr3duuk4glewn` FOREIGN KEY (`product_type`) REFERENCES `product_type_master` (`type_id`),
  CONSTRAINT `FKk3j4x5gp4cs69mquqe893i3hl` FOREIGN KEY (`attribute_id`) REFERENCES `attribute` (`attribute_id`),
  CONSTRAINT `FKk630ngm1ti3hucpttardvn910` FOREIGN KEY (`product_genere`) REFERENCES `genere` (`genere_id`),
  CONSTRAINT `FKn0k3dgs9nbb0tnolhg1af4s83` FOREIGN KEY (`product_author`) REFERENCES `author` (`author_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_attribute`
--

DROP TABLE IF EXISTS `product_attribute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_attribute` (
  `prod_att_id` int NOT NULL AUTO_INCREMENT,
  `atttribute_value` varchar(255) DEFAULT NULL,
  `attribute_id` int NOT NULL,
  `product_id` int NOT NULL,
  PRIMARY KEY (`prod_att_id`),
  KEY `FKefc9famxhv98xs6686269a79` (`attribute_id`),
  KEY `FKlefs59y5kmsbu017n1wp10gf2` (`product_id`),
  CONSTRAINT `FKefc9famxhv98xs6686269a79` FOREIGN KEY (`attribute_id`) REFERENCES `attribute` (`attribute_id`),
  CONSTRAINT `FKlefs59y5kmsbu017n1wp10gf2` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_beneficiary`
--

DROP TABLE IF EXISTS `product_beneficiary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_beneficiary` (
  `prodben_id` int NOT NULL AUTO_INCREMENT,
  `royalty_received` decimal(38,2) DEFAULT NULL,
  `beneficiary_id` int NOT NULL,
  `product_id` int NOT NULL,
  `roycal_id` int NOT NULL,
  PRIMARY KEY (`prodben_id`),
  KEY `FKcry2xtp9lj2xd0a4ua4l5y6en` (`beneficiary_id`),
  KEY `FKkhfp9o212p3x1e5rhts34qqli` (`product_id`),
  KEY `FKkx1d3hr3vyno6q02do5ueygs4` (`roycal_id`),
  CONSTRAINT `FKcry2xtp9lj2xd0a4ua4l5y6en` FOREIGN KEY (`beneficiary_id`) REFERENCES `beneficiary` (`beneficiary_id`),
  CONSTRAINT `FKkhfp9o212p3x1e5rhts34qqli` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`),
  CONSTRAINT `FKkx1d3hr3vyno6q02do5ueygs4` FOREIGN KEY (`roycal_id`) REFERENCES `royalty_calculation` (`roycal_id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_type_master`
--

DROP TABLE IF EXISTS `product_type_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_type_master` (
  `type_id` int NOT NULL AUTO_INCREMENT,
  `type_desc` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `publisher`
--

DROP TABLE IF EXISTS `publisher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `publisher` (
  `publisher_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(80) NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`publisher_id`),
  UNIQUE KEY `UKtq31gshjc2w4bjif7cw51o25` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `royalty_calculation`
--

DROP TABLE IF EXISTS `royalty_calculation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `royalty_calculation` (
  `roycal_id` int NOT NULL AUTO_INCREMENT,
  `royalty_percent` decimal(38,2) DEFAULT NULL,
  `roycal_trandate` date DEFAULT NULL,
  `total_amount` decimal(38,2) DEFAULT NULL,
  `total_royalty` decimal(38,2) DEFAULT NULL,
  `item_id` int NOT NULL,
  `product_id` int NOT NULL,
  PRIMARY KEY (`roycal_id`),
  KEY `FKh50sq6rrpjk0h50de0d82ip3l` (`item_id`),
  KEY `FK9vc0u607pogh735h76dqmth3l` (`product_id`),
  CONSTRAINT `FK9vc0u607pogh735h76dqmth3l` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=120 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `transaction_items`
--

DROP TABLE IF EXISTS `transaction_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_items` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `price` decimal(38,2) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `transaction_id` bigint DEFAULT NULL,
  PRIMARY KEY (`item_id`),
  KEY `FKaghtk4pgcgrsf2c4n1rueb613` (`product_id`),
  KEY `FKfaqqkmi2ahnahay1ciwffqwyp` (`transaction_id`),
  CONSTRAINT `FKaghtk4pgcgrsf2c4n1rueb613` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`),
  CONSTRAINT `FKfaqqkmi2ahnahay1ciwffqwyp` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`transaction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `transaction_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `status` enum('FAILED','PENDING','SUCCESS') DEFAULT NULL,
  `total_amount` decimal(38,2) DEFAULT NULL,
  `transaction_type` enum('BUY','RENT') DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`transaction_id`),
  KEY `FK9e5ssu5c6n40gw5bgt5dg4mph` (`user_id`),
  CONSTRAINT `FK9e5ssu5c6n40gw5bgt5dg4mph` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=147 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `is_admin` bit(1) DEFAULT NULL,
  `join_date` date DEFAULT NULL,
  `user_address` text,
  `user_email` varchar(80) NOT NULL,
  `user_name` varchar(80) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_phone` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UKj09k2v8lxofv2vecxu2hde9so` (`user_email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-02 12:26:31
