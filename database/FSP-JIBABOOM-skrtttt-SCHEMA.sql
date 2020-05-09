-- ATTENTION! THIS SCRIPT IS NOT PART OF THE FILE SYSTEM AND
--      IS PLACED HERE JUST TO FACILITATE THE TEAM FOR CODING 
--      THE SQL QUERIES IN VS CODE.
--      THIS SCRIPT HERE CONTROLS THE 'public' SCHEMAS IN PGADMIN4

-- NOTE! INTEGER CHECK MIGHT NEED TO BE REMOVED BASED ON CIRCUMSTANCE IN FUTURE.

-- Performance Table
CREATE TABLE Performance(
    performanceId NUMERIC PRIMARY KEY NOT NULL CHECK (performanceId BETWEEN 0000000001 and 9999999999) UNIQUE,
    startTime TIME,
    endTime TIME
);

INSERT INTO Performance VALUES (
    0000000001, '0800', '1200'
);

SELECT performanceId, startTime, endTime FROM Performance;

DROP TABLE Performance;

-- Performance With Popularity Table
CREATE TABLE PerformanceWithPopularity(
    performanceId NUMERIC(10) PRIMARY KEY NOT NULL CHECK (performanceId BETWEEN 0000000001 and 9999999999) UNIQUE,
    startTime TIME,
    endTime TIME,
    popularity NUMERIC
);

INSERT INTO PerformanceWithPopularity VALUES(
    2234567789, '0800', '1200', 10
);

SELECT * FROM PerformanceWithPopularity;

DROP TABLE PerformanceWithPopularity

-- Music Festival Table
CREATE TABLE MusicFestival(
    festivalId NUMERIC PRIMARY KEY NOT NULL CHECK (festivalId BETWEEN 0000000000 AND 9999999999) UNIQUE
);

INSERT INTO MusicFestival VALUES(
    '222'
);

SELECT festivalId FROM MusicFestival;

DROP TABLE MusicFestival;
