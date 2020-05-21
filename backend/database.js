// database connection settings
const { Client } = require('pg')
const CONNECTION_STRING = "postgres://bgilaiqx:kJY6ssE7RrYm2_jdceNA0SB8kMRguZK4@john.db.elephantsql.com:5432/bgilaiqx";

// connect() function to connect to the db
function connect() {
    const client = new Client({
        connectionString: CONNECTION_STRING,
    })
    client.connect();
    return client;
}

// resetTable() function to reset the performance table
function resetTable() {
    const client = connect();
    const query = `
    DROP TABLE IF EXISTS Performance;
    CREATE TABLE Performance(
        performanceId BIGINT PRIMARY KEY NOT NULL CHECK (performanceId BETWEEN 0000000001 and 9999999999) UNIQUE,
        startTime SMALLINT,
        endTime SMALLINT
    );
    `;
    client.query(query, (err, res) => {
        console.log(err, res);
        client.end();
    });
}

// insertPerformance() function to dump in some random generated data
function insertPerformance(performance, callback) {
    let i = 1;
    const template = performance.map(performance => `($${i++}, $${i++}, $${i++})`).join(',');
    const values = performance.reduce((reduced, performance) => [...reduced, performance.performanceId, performance.startTime, performance.endTime], [])
    const query = `INSERT INTO Performance (performanceId, startTime, endTime) VALUES ${template};`;
    const client = connect();
    client.query(query, values, (err, result) => {
        callback(err, result);
        client.end();
    })
}

// Function to push data from db to frontend 
function getFestivals(festivalId, startTime, page=0, pageSize=5, callback) {
    let whereClause;
    let i = 1;
    const values = [];
    if (!festivalId && !startTime) whereClause = '';
    else {
        whereClause = 'WHERE'
        if (festivalId) {
            whereClause += ` festivalId = $${i++}`;
            values.push(festivalId);
        }
        if (startTime) {
            whereClause += (festivalId) ? ` AND startTime >= $${i++}` : `startTime >= $${i++}`;
            values.push(startTime)
        }
    }
    let limitoffsetClause = `LIMIT $${i++} OFFSET $${i++}`
    values.push(pageSize); //Limit = pageSize
    values.push(page * pageSize); //offset = page * pageSize
    const query = `SELECT * FROM Performance ${whereClause} ${limitoffsetClause}`;

    console.log(query, values);
    callback(null, { ok: 'ok' })
}

// export functions out of this script
module.exports = {
    resetTable,
    insertPerformance,
    getFestivals
}
















