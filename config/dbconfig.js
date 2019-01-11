// Use restrict to prevent es5 errors
"use strict"
// const in ES6 value could not be change
const mysql = require("mysql");

// Export DB with ES6 class constructor.

module.exports = class DB {
    constructor() {
        this.dbConnection = mysql.createConnection({
            hostname: 'localhost',
            user: 'root',
            password: '',
            database: 'node'
        });
    }
    /**
     * It use to check connection is stabilished or not!
     */
    connection() {
        this.dbConnection.connect(function (err, res) {
            if (err) {
                console.error("Something went wrong," + err.stack);
                return;
            } else {
                console.log("Database connected!" + res);
            }
        });

    }
    /**
     * It use to insert data into table.
     * @param {string} table_name 
     * @param {array} post_data 
     */
    InsertData(table_name = "", post_data = [], callback) {

        this.dbConnection.query(`INSERT INTO ${table_name} SET ?`, post_data, (err, res) => {
            if (err) {
                console.error("Something went wrong: " + err.stack);
            } else {
                //console.log("Data successfully inserted!--" + JSON.stringify(res));
                callback(res.insertId);
                return;
            }
        });
    }
    /**
     * It use to get data from table.
     * @param {string} table_name 
     * @param {()} callback 
     */
    getDatas(table_name = "", callback) {

        var query = this.dbConnection.query(`SELECT * FROM ${table_name} WHERE role_id !=1`, (err, rows) => {
            if (err) {
                console.log("Something went wrong!" + err);
                return err;
            } else {
                callback(rows);
                return;
            }
        });
    }
    /**
     * It use to delete data with WhereClause basis.
     * @param {string} table_name 
     * @param {array} whereClause 
 
     */
    removeWhereClause(table_name = "", whereClause) {

        var js = this.dbConnection.query(`DELETE FROM ${table_name}  WHERE user_id = ? `, [whereClause], (err, rows) => {
            if (err) {
                console.log("Something went wrong!" + err.stack);
            }
        })
    }
    /**
     * Authenticate user information
     * @param {*} table_name 
     * @param {*} whereClause 
     * @param {*} callback 
     */

    authWherClause(table_name = "", whereClause, callback) {
        var js = this.dbConnection.query(`SELECT * FROM ${table_name} WHERE email_id = ? AND password = ?`,
            whereClause, (err, rows) => {
                if (err) {
                    console.log("Something went wrong" + err.stack);
                    return;
                }
                callback(rows);
                return;
            });
    }

    /**
     * It use to update data on the basis of whereClause
     * @param {string} table_name 
     * @param {array} whereClause 
     * @param {()} callback 
     */
    updateWhereClause(table_name = "", updateData, whereClause, callback) {

        var js = this.dbConnection.query("UPDATE users  SET ? WHERE ?",
            [updateData, whereClause], (err, rows) => {
                if (err) {
                    console.log("Something went wrong!" + err.stack)
                    return;
                }
                //console.log(mysql.format(js));
                callback(rows.affectedRows);
                return;
            })
    }
    /**
     * It use to get user' name.
     * @param {*} table_name 
     * @param {*} whereClause 
     * @param {*} callback 
     */
    getUserDetails(table_name = "", whereClause, callback) {
        var js = this.dbConnection.query(`SELECT * FROM ${table_name} WHERE
                     user_id = ?`,
            whereClause, (err, rows) => {
                if (err) {
                    console.log("Something went wrong" + err.stack);
                    return;
                }
                callback(rows);
                return;
            });
    }
    /**
    * Authenticate user information
    * @param {*} table_name 
    * @param {*} whereClause 
    * @param {*} callback 
    */

    authEmailExist(table_name = "", whereClause, callback) {
        var js = this.dbConnection.query(`SELECT * FROM ${table_name} WHERE email_id = ?`,
            whereClause, (err, rows) => {
                if (err) {
                    console.log("Something went wrong" + err.stack);
                    return;
                }
                callback(rows);
                return;
            });
    }
    getusersBlogs(sql = "", callback) {
        var js = this.dbConnection.query(sql, (err, rows) => {
            if (err) {
                console.log("Something went wrong" + err.stack);
                return;
            }
            console.log(rows);
            callback(rows);
            return;
        });

    }

}
