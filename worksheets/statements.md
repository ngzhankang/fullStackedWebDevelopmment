# SQL Statements

For this worksheet you will need to provide an example of your own SQL statement. The two given are examples.

## INSERT INTO performance Table
```sql
INSERT INTO​ Performance (festivalId, performanceId, startTime, endTime) ​VALUES ​(1234567890, 1234567890, 1010, 2020); 
```

## INSERT INTO PerformanceWithPopularity Table
```sql
INSERT INTO​ PerformanceWithPopularity (festivalId, performanceId, startTime, endTime, popularity) ​VALUES ​(1234567890, 1234567890, 1010, 2020, 5); 
```

## INSERT INTO MusicFestival Table
```sql
INSERT INTO​ MusicFestival (festivalId) ​VALUES ​(1234567890); 
```

## SELECT with Filtering only startTime and Pagination
```sql
SELECT ​* ​FROM ​Performance ​WHERE startTime >= 1330 LIMIT ​1 ​OFFSET ​1;
```

## SELECT with Filtering only festivalId and Pagination
```sql
SELECT ​* ​FROM ​Performance ​WHERE festivalId = 123456781 LIMIT ​1 ​OFFSET ​1;
```

## SELECT with Filtering both festivalId, startTime and Pagination
```sql
SELECT ​* ​FROM ​Performance ​WHERE festivalId = 123456781 AND startTime >= 1330 LIMIT ​1 ​OFFSET ​1;
```

## SELECT with Filtering only festivalId and Pagination
```sql
SELECT ​* ​FROM PerformanceWithPopularity ​WHERE festivalId = 123456781 LIMIT ​1 ​OFFSET ​1;
```

## SELECT with Filtering only startTime and Pagination
```sql
SELECT ​* ​FROM PerformanceWithPopularity ​WHERE startTime >= 1330 LIMIT ​1 ​OFFSET ​1;
```

## SELECT with Filtering only endTime and Pagination
```sql
SELECT ​* ​FROM PerformanceWithPopularity ​WHERE endTime < 1330 LIMIT ​1 ​OFFSET ​1;
```

## SELECT with Filtering both festivalId, startTime and Pagination
```sql
SELECT ​* ​FROM PerformanceWithPopularity ​WHERE festivalId = 123456781 AND startTime >= 1330 LIMIT ​1 ​OFFSET ​1;
```

## SELECT with Filtering both festivalId, endTime and Pagination
```sql
SELECT ​* ​FROM PerformanceWithPopularity ​WHERE festivalId = 123456781 AND endTime < 1330 LIMIT ​1 ​OFFSET ​1;
```

## SELECT with Filtering both festivalId, startTime, endTime and Pagination
```sql
SELECT ​* ​FROM PerformanceWithPopularity ​WHERE festivalId = 123456781 AND endTime < 1330 AND startTime >= 1440 LIMIT ​1 ​OFFSET ​1;
```

## SELECT a specific number of performance based on festivalId
```sql
SELECT performanceid AS "performanceId", to_char(startTime, 'HH24MI') AS "startTime", to_char(endTime, 'HH24MI') AS "endTime" FROM Performance WHERE festivalId = 1234567890
```

## SELECT a specific number of performance based on festivalId
```sql
SELECT performanceid AS "performanceId", to_char(startTime, 'HH24MI') AS "startTime", to_char(endTime, 'HH24MI') AS "endTime" FROM PerformanceWithPopularity WHERE festivalId = 1234567890
```