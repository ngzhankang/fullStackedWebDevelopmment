const { Client } = require('pg')
const CONNECTION_STRING = "postgres://bgilaiqx:kJY6ssE7RrYm2_jdceNA0SB8kMRguZK4@john.db.elephantsql.com:5432/bgilaiqx";

function connect() {
    const client = new Client({
        connectionString: CONNECTION_STRING,
    })
    client.connect();
    return client;
}

function resetTable() {
    const client = connect();
    const query = `
    DROP TABLE IF EXISTS Performance;
    CREATE TABLE Performance(
        performanceId BIGINT PRIMARY KEY NOT NULL CHECK (performanceId BETWEEN 0000000001 and 9999999999) UNIQUE,
        startTime TIME,
        endTime TIME
    );
    `;
    client.query(query, (err, res) => {
        console.log(err, res)
        client.end()
    });
}

function InsertPerformance(performance, callback) {
    let i = 1234567890;
    const template = performance.map(performance => `(${i++}, ${i++}, ${i++})`).join(',');
    const values = performance.reduce((reduced, performance) => [...reduced, performance.performanceId, performance.startTime, performance.endTime], [])
    const query = `INSERT INTO Performance (performanceId, startTime, endTime) VALUES ${template};`;
    
    const client = connect();
    client.query(query, values, (err, result) => {
        callback(err, result);
        client.end();
    })
}

module.exports = {
    resetTable,
    InsertPerformance,
}
















