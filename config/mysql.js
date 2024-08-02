const mysql = require('mysql2');
const { promisify } = require('util');

const db_info = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "123456",
    database: "yourboard",
};

const pool = mysql.createPool(db_info);
const query = promisify(pool.query).bind(pool);

module.exports = {
    query,
    connect: function () {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.error("mysql connection error : " + err);
            } else {
                console.log("mysql is connected successfully!");
                connection.release();
            }
        });
    },
};
