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

// insertPerformance() function to dump in some random generated data for Performance table
function insertPerformance(performance, callback) {
    let i = 1;
    const template = performance.map(performance => `($${i++}, $${i++}, $${i++}, $${i++})`).join(',');
    const values = performance.reduce((reduced, performance) => [...reduced, performance.performanceId, performance.startTime, performance.endTime, performance.fk_festivalId], [])
    const query = `INSERT INTO Performance (performanceId, startTime, endTime, fk_festivalId) VALUES ${template};`;
    const client = connect();
    client.query(query, values, (err, result) => {
        callback(err, result);
        client.end();
    });
}

// insertFestival() function to dump in some random generated data for MusicFestival table
function insertFestival(MusicFestival, callback) {
    let i = 1;
    const templates = MusicFestival.map(MusicFestival => `($${i++})`).join(',');
    const values = MusicFestival.reduce((reduced, MusicFestival) => [...reduced, MusicFestival.festivalId], [])
    const query = `INSERT INTO MusicFestival (festivalId) VALUES ${templates};`;
    const client = connect();
    client.query(query, values, (err, result) => {
        callback(err, result);
        client.end();
    });
}

// Function to push data from db to frontend, getting all data from Performance table
function getFestivals(fk_festivalId, startTime, page=0, pageSize=5, callback) {
    let whereClause;
    let i = 1;
    const values = [];
    if (!fk_festivalId && !startTime) whereClause = '';
    else {
        whereClause = 'WHERE'
        if (fk_festivalId) {
            whereClause += ` fk_festivalId = $${i++}`;
            values.push(parseInt(fk_festivalId));
        }
        if (startTime) {
            whereClause += ` startTime >= $${i++}`;
            values.push(parseInt(startTime))
        }
    }
    let limitoffsetClause = `LIMIT $${i++} OFFSET $${i++}`
    values.push(parseInt(pageSize)); //Limit = pageSize
    values.push(parseInt(page) * parseInt(pageSize)); //offset = page * pageSize
    const query = `SELECT * FROM Performance ${whereClause} ${limitoffsetClause}`;
    const client = connect();
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
















