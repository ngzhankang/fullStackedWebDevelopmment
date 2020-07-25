-- ATTENTION! THIS SCRIPT IS NOT PART OF THE FILE SYSTEM AND
--      IS PLACED HERE JUST TO FACILITATE THE TEAM FOR CODING 
--      THE SQL QUERIES IN VS CODE.
--      THIS SCRIPT HERE CONTROLS THE 'public' SCHEMAS IN PGADMIN4

-- NOTE! INTEGER CHECK MIGHT NEED TO BE REMOVED BASED ON CIRCUMSTANCE IN FUTURE.

-- Performance 
DROP TABLE IF EXISTS MusicFestival;
DROP TABLE IF EXISTS Performance;
DROP TABLE IF EXISTS PerformanceWithPopularity;
CREATE TABLE Performance(
    performanceId BIGINT PRIMARY KEY NOT NULL CHECK (performanceId BETWEEN 0000000001 and 9999999999) UNIQUE,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    festivalId BIGINT NOT NULL CHECK (festivalId BETWEEN 0000000001 and 9999999999),
    FOREIGN KEY (festivalId) REFERENCES MusicFestival(festivalId)
);

-- Music Festival Table
CREATE TABLE MusicFestival(
    festivalId BIGINT PRIMARY KEY NOT NULL CHECK (festivalId BETWEEN 0000000001 AND 9999999999)
);

-- Performance With Popularity Table
CREATE TABLE PerformanceWithPopularity(
    performanceId BIGINT PRIMARY KEY NOT NULL CHECK (performanceId BETWEEN 0000000001 and 9999999999) UNIQUE,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    festivalId BIGINT NOT NULL CHECK (festivalId BETWEEN 0000000001 and 9999999999),
    popularity SMALLINT NOT NULL,
    FOREIGN KEY (festivalId) REFERENCES MusicFestival(festivalId)
);

SELECT * FROM Performance
SELECT * FROM MusicFestival
SELECT * FROM PerformanceWithPopularity
SELECT * FROM Performance WHERE festivalId = 2234567891
SELECT * FROM PerformanceWithPopularity WHERE festivalId = 9900000003 AND startTime = '11:00:00' AND endTime = '12:00:00'
SELECT * FROM PerformanceWithPopularity WHERE startTime = '11:00:00' AND endTime = '12:00:00'