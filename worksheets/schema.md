# Schema

This document will gives user a good idea of how your database's  structure looks like.

You may refer to the following link to learn more about postgresql schema:

1. [CREATE statements](https://www.postgresqltutorial.com/postgresql-create-table/)
2. [Foreign Keys](https://www.postgresqltutorial.com/postgresql-foreign-key/)

The following are examples of how you can create a table, replace the examples with your own create statements of all your table.
```sql
CREATE TABLE festivals(
   `performanceId` INT(10) SERIAL PRIMARY KEY NOT NULL UNIQUE,
   `festivalId` INT(10) SERIAL NOT NULL,
   `startTime` TIME NOT NULL,
   `endTime` TIME NOT NULL
);
```
