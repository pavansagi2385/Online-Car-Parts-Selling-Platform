-- MySQL dump 10.13  Distrib 8.0.36, for macos14 (x86_64)
--
-- Host: localhost    Database: carpart_fdb
-- ------------------------------------------------------
-- Server version	8.3.0

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
-- Table structure for table `carPart`
--

DROP TABLE IF EXISTS `carPart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carPart` (
  `car_part_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `description` text,
  `price` decimal(10,2) DEFAULT NULL,
  `quantity_in_stock` int DEFAULT NULL,
  `model` varchar(50) DEFAULT NULL,
  `manufactured_date` date DEFAULT NULL,
  `manufactured_details` text,
  `instructions_to_use` text,
  `compactability` varchar(50) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  `offers` text,
  `category_id` int DEFAULT NULL,
  `owner_id` int DEFAULT NULL,
  PRIMARY KEY (`car_part_id`),
  KEY `category_id` (`category_id`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `carpart_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`),
  CONSTRAINT `carpart_ibfk_2` FOREIGN KEY (`owner_id`) REFERENCES `garageOwner` (`owner_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carPart`
--

LOCK TABLES `carPart` WRITE;
/*!40000 ALTER TABLE `carPart` DISABLE KEYS */;
INSERT INTO `carPart` VALUES (1,'Spark Plug','Image of spark plug',20.00,100,'ModelX','2024-11-05','Manufacturer A','Use as per manual','CarX',1,'10% off',1,1),(2,'Brake Pad','Image of brake pad',50.00,50,'ModelY','2024-11-21','Manufacturer B','Replace regularly','CarY',1,'15% off',2,2),(3,'Battery','Image of battery',150.00,20,'ModelZ','2024-11-14','Manufacturer C','Charge before use','CarZ',1,'5% off',1,3),(4,'Mirror','Image of mirror',30.00,200,'ModelA','2024-11-21','Manufacturer D','Handle with care','CarA',1,'No offers',4,4),(5,'Tire','Image of tire',100.00,300,'ModelB','2024-11-12','Manufacturer E','Install correctly','CarB',1,'20% off',5,5);
/*!40000 ALTER TABLE `carPart` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-28 20:26:05
