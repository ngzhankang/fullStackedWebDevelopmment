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
        startTime SMALLINT NOT NULL,
        endTime SMALLINT NOT NULL,
        festivalId BIGINT NOT NULL CHECK (festivalId BETWEEN 0000000001 and 9999999999)
    );
    `;
    client.query(query, (err, res) => {
        console.log(err, res);
        client.end();
    });
}

// insertPerformance() function to dump in some random generated data for Performance table
function insertPerformance(performance, callback) {
    let i = 1;
    const template = performance.map(performance => `($${i++}, $${i++}, $${i++}, $${i++})`).join(',');
    const values = performance.reduce((reduced, performance) => [...reduced, performance.festivalId, performance.performanceId, performance.startTime, performance.endTime], [])
    const query = `INSERT INTO Performance (festivalId, performanceId, startTime, endTime) VALUES ${template};`;
    const client = connect();
    client.query(query, values, (err, result) => {
        callback(err, result);
        client.end();
    });
}

// insertFestival() function to dump in some random generated data for MusicFestival table
function insertFestival(performance, callback) {
    let i = 1;
    const templates = performance.map(MusicFestival => `($${i++})`).join(',');
    const values = performance.reduce((reduced, performance) => [...reduced, performance.festivalId], [])
    const query = `INSERT INTO MusicFestival (festivalId) VALUES ${templates} ON CONFLICT DO NOTHING;`;
    const client = connect();
    client.query(query, values, (err, result) => {
        callback(err, result);
        client.end();
    });
}

// Function to push data from db to frontend, getting all data from Performance table
function getFestivals(festivalId, startTime, page=0, pageSize=5, callback) {
    let whereClause;
    let i = 1;
    const values = [];
    if (!festivalId && !startTime) {whereClause = ''}
    else {
        whereClause = 'WHERE'
        if (festivalId) {
            whereClause += ` festivalId = $${i++}`;
            values.push(parseInt(festivalId));
        }
        if (startTime) {
            whereClause += festivalId ? ` AND startTime >= $${i++}` : ` startTime >= $${i++}`;
            values.push(parseInt(startTime))
        }
    }
    let limitoffsetClause = `LIMIT $${i++} OFFSET $${i++}`
    values.push(parseInt(pageSize)); //Limit = pageSize
    values.push(parseInt(page) * parseInt(pageSize)); //offset = page * pageSize
    const query = `SELECT * FROM Performance ${whereClause} ${limitoffsetClause}`;
    const client = connect();
    console.log(query)
    client.query(query, values, function(err, rows) {
        console.log(query)
        client.end();
        callback(err, rows);
    });
}

// export functions out of this script
module.exports = {
    resetTable,
    insertPerformance,
    insertFestival,
    getFestivals
}