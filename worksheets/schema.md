# Schema

This document will gives user a good idea of how your database's  structure looks like.

You may refer to the following link to learn more about postgresql schema:

1. [CREATE statements](https://www.postgresqltutorial.com/postgresql-create-table/)
2. [Foreign Keys](https://www.postgresqltutorial.com/postgresql-foreign-key/)

The following are examples of how you can create a table, replace the examples with your own create statements of all your table.

```sql
CREATE TABLE Performance(
    performanceId BIGINT PRIMARY KEY NOT NULL CHECK (performanceId BETWEEN 0000000001 and 9999999999) UNIQUE,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    festivalId BIGINT CHECK (festivalId BETWEEN 0000000001 and 9999999999),
    FOREIGN KEY (festivalId) REFERENCES MusicFestival(festivalId)
);
```

```sql
CREATE TABLE MusicFestival(
    festivalId BIGINT PRIMARY KEY NOT NULL CHECK (festivalId BETWEEN 0000000001 AND 9999999999)
);
```

> [!IMPORTANT]
> ADVANCED FEATURE (CA3 & CA4)
```sql
CREATE TABLE PerformanceWithPopularity(
    performanceId BIGINT PRIMARY KEY NOT NULL CHECK (performanceId BETWEEN 0000000001 and 9999999999) UNIQUE,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    festivalId BIGINT NOT NULL CHECK (festivalId BETWEEN 0000000001 and 9999999999),
    popularity SMALLINT NOT NULL,
    FOREIGN KEY (festivalId) REFERENCES MusicFestival(festivalId)
);
```
