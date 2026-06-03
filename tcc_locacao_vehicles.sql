-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: tcc_locacao
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `vehicles`
--

DROP TABLE IF EXISTS `vehicles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `owner_id` int NOT NULL,
  `brand` varchar(50) NOT NULL,
  `model` varchar(50) NOT NULL,
  `year` int NOT NULL,
  `plate` varchar(10) NOT NULL,
  `daily_rate` decimal(10,2) NOT NULL,
  `description` text,
  `image_url` varchar(500) DEFAULT NULL,
  `city` varchar(80) NOT NULL,
  `state` varchar(2) NOT NULL,
  `status` enum('available','unavailable') NOT NULL DEFAULT 'available',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `vehicles_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicles`
--

LOCK TABLES `vehicles` WRITE;
/*!40000 ALTER TABLE `vehicles` DISABLE KEYS */;
INSERT INTO `vehicles` VALUES (1,2,'Chevrolet','Onix',2022,'ABC-1234',500.00,'Onix 2022 automático, ar-condicionado, direção elétrica, IPVA pago.XXXX','https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80','São Paulo','SP','available','2026-06-03 04:33:51'),(2,2,'Volkswagen','Gol',2020,'DEF-5678',90.00,'Gol 1.0 2020, econômico, ideal para cidade, revisado recentemente.','https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80','Rio de Janeiro','RJ','available','2026-06-03 04:33:51'),(3,2,'Fiat','Argo',2023,'GHI-9012',130.00,'Argo Drive 1.3 2023, completo, central multimídia, câmera de ré.','https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80','Belo Horizonte','MG','available','2026-06-03 04:33:51'),(4,2,'Hyundai','HB20',2021,'JKL-3456',110.00,'HB20 Comfort 2021, muito conservado, com Bluetooth e controle de estabilidade.','https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80','Curitiba','PR','available','2026-06-03 04:33:51'),(5,2,'Toyota','Corolla',2022,'MNO-7890',200.00,'Corolla XEI 2022 automático, bancos de couro, teto solar, excelente conforto.','https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80','Porto Alegre','RS','available','2026-06-03 04:33:51'),(6,2,'Honda','Civic',2021,'PQR-1122',180.00,'Civic Touring 2021, completo, piloto automático adaptativo e Honda Sensing.','https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80','Campinas','SP','available','2026-06-03 04:33:51'),(7,2,'Jeep','Renegade',2023,'STU-3344',250.00,'Renegade Longitude 2023 automático, 4x2, tração inteligente e teto solar panorâmico.','https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800&q=80','Florianópolis','SC','available','2026-06-03 04:33:51'),(8,2,'Ford','Ka',2020,'VWX-5566',85.00,'Ka SE 1.0 2020, econômico e ágil, perfeito para o dia a dia na cidade.','https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80','Salvador','BA','available','2026-06-03 04:33:51'),(9,2,'Renault','Kwid',2022,'YZA-7788',95.00,'Kwid Intense 2022, com câmera de ré, central multimídia e ar-condicionado.','https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80','Recife','PE','available','2026-06-03 04:33:51'),(10,2,'Nissan','Versa',2023,'BCD-9900',160.00,'Versa Advance 2023 automático, espaçoso, confortável e muito econômico.','https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80','Fortaleza','CE','available','2026-06-03 04:33:51');
/*!40000 ALTER TABLE `vehicles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-03  1:57:24
