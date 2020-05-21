-- ATTENTION! THIS SCRIPT IS NOT PART OF THE FILE SYSTEM AND
--      IS PLACED HERE JUST TO FACILITATE THE TEAM FOR CODING 
--      THE SQL QUERIES IN VS CODE.
--      THIS SCRIPT HERE CONTROLS THE 'public' SCHEMAS IN PGADMIN4

-- NOTE! INTEGER CHECK MIGHT NEED TO BE REMOVED BASED ON CIRCUMSTANCE IN FUTURE.

-- Performance 
DROP TABLE IF EXISTS Performance;
CREATE TABLE Performance(
    performanceId BIGINT PRIMARY KEY NOT NULL CHECK (performanceId BETWEEN 0000000001 and 9999999999) UNIQUE,
    startTime SMALLINT,
    endTime SMALLINT,
    -- FOREIGN KEY (performanceId) REFERENCES MusicFestival(festivalId)
);

INSERT INTO Performance VALUES (
    0000000001, '0800', '1200'
);

SELECT performanceId, startTime, endTime FROM Performance;


-- Performance With Popularity Table
CREATE TABLE PerformanceWithPopularity(
    performanceId BIGINT PRIMARY KEY NOT NULL CHECK (performanceId BETWEEN 0000000001 and 9999999999) UNIQUE,
    startTime TIME,
    endTime TIME,
    popularity NUMERIC,
    FOREIGN KEY (performanceId) REFERENCES MusicFestival(festivalId)
);

INSERT INTO PerformanceWithPopularity VALUES(
    2234567789, '0800', '1200', 10
);

SELECT * FROM PerformanceWithPopularity;
DROP TABLE PerformanceWithPopularity

-- Music Festival Table
CREATE TABLE MusicFestival(
    festivalId BIGINT PRIMARY KEY NOT NULL CHECK (festivalId BETWEEN 0000000001 AND 9999999999) UNIQUE
);

INSERT INTO MusicFestival VALUES(
    '222'
);

SELECT festivalId FROM MusicFestival;
DROP TABLE MusicFestival;

--Alter Table to Add In Foreign Keys
ALTER TABLE ADD Performance FOREIGN KEY (performanceId) REFERENCES MusicFestival(festivalId)