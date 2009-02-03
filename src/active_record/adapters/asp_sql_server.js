/* ***** BEGIN LICENSE BLOCK *****
 * 
 * Copyright (c) 2009 Aptana, Inc.
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * 
 * ***** END LICENSE BLOCK ***** */

/**
 * Adapter for ASP configured with SQL Server.
 * @alias ActiveRecord.Adapters.ASPSQLServer
 * @property {ActiveRecord.Adapter}
 */ 
Adapters.ASPSQLServer = function ASPSQLServer(db) {
    this.db = db;
    ActiveSupport.extend(this,Adapters.InstanceMethods);
    ActiveSupport.extend(this,Adapters.SQLServer);
    ActiveSupport.extend(this,{
        log: function log()
        {
            if (!ActiveRecord.logging)
            {
                return;
            }
            if (arguments[0])
            {
                arguments[0] = 'ActiveRecord: ' + arguments[0];
            }
            return ActiveSupport.log(ActiveSupport,arguments || []);
        },

        executeSQL: function executeSQL(sql) {
            var db = this.db;
            var params = Array.prototype.slice.call(arguments, 1);
            sql = this.applyParams(sql, params);
console.info(sql);
            ActiveRecord.connection.log("Adapters.ASPSQLServer.executeSQL: " + sql + " [" + params.join(',') + "]");
            var response = this.recordsetToObject(db.execute(sql));
            return response;
        },

        getLastInsertedRowId: function getLastInsertedRowId() {
            var id = 0;
            try {
                id = this.executeSQL("SELECT @@IDENTITY").rows[0][""];
            } catch (e) {}
            return id;
        },

        iterableFromResultSet: function iterableFromResultSet(result) {
            result.iterate = function iterate(iterator) {
                if (typeof iterator === 'number') {
                    if (this.rows[iterator]) {
                        return ActiveSupport.clone(this.rows[iterator]);
                    }
                    else { return false; }
                } else {
                    for(var i = 0; i < this.rows.length; ++i) {
                        var row = ActiveSupport.clone(this.rows[i]);
                        iterator(row);
                    }
                }
            };
            return result;
        },

        transaction: function transaction(proceed) {
            try {
                ActiveRecord.connection.executeSQL('BEGIN TRANSACTION');
                proceed();
                ActiveRecord.connection.executeSQL('COMMIT TRANSACTION');
            } catch(e) {
                ActiveRecord.connection.executeSQL('ROLLBACK TRANSACTION');
                return ActiveSupport.throwError(e);
            }
        },

        /**
         * ADO & SQL Server make parameterized queries real hard. Apply the 
         * parameters to the SQL here, it should be good enough
         */
        applyParams : function applyParams(sql, params) {
            params = params || [];
            var newSql = [];
            var parts = [];
            
            // Replace all ' with '' in strings just to be safe, and quote, too
            for (var i = 0; i < params.length; i += 1) {
                if (typeof params[i] === "string") {
                    params[i] = "'" + params[i].replace(/\'/g, "''") + "'";
                // Send a string for null & undefined
                } else if (params[i] === null || params[i] === undefined) {
                    params[i] = "NULL";
                }
            }
            
            parts = sql.split("?"); // Split the query into parts

            // If there are not enough parameters, throw an error, 
            // if there are too many, ignore the extras
            if ((params.length + 1) < parts.length) {
                throw new Error("SQL parameter mismatch");
            }
            
            for (var i = 0; i < parts.length; i += 1) {
                newSql.push(parts[i], params[i]);
            }
            
            return newSql.join("");
        },

        /**
         * Convert a recordset collection returned from a query to a 
         * javascript object containing a rows property with the row
         * as an object
         */
        recordsetToObject : function recordsetToObject(rs) {
            var result = { rows : [] };
            var adStateClosed = 0; // Closed state constant.
            var adDBTimeStamp = 135; // DATETIME type
            var o = {}; // The record object
            var fieldCount = 0;
            var value;

            if (rs.State !== adStateClosed) { // Only build if object is open.
                fieldCount = rs.fields.count;
                while (!rs.EOF) {
                    o = {};
                    try {
                        for (var i = 0; i != fieldCount; i += 1) {
                            value = rs.fields(i).value;
                            // If the field is a datetime, format it
                            if (rs.fields(i).type === adDBTimeStamp) {
                                value = ActiveSupport.dateFormat(value, 
                                    'yyyy-mm-dd HH:MM:ss'
                                ); 
                            }  
                            // Try to convert to string if bad value
                            o[rs.fields(i).name] = value || String(value); 
                        }
                    } catch (e) {}
                    result.rows.push(o);
                    rs.moveNext();
                }
                rs.close();
            }
            return result;
        }
    });
};

Adapters.ASPSQLServer.connect = function connect(options) {
    var provider = "SQLOLEDB";
    var defaultOptions = {
        HOST : "localhost",
        PORT : 1433,
        USER : "sa",
        PASS : "",
        NAME : ""    
    };
    var connection;
    var connString = ""

    // Uppercase option keys and extend with defaults
    options = options || {};
    for(var key in options) { options[key.toUpperCase()] = options[key]; }
    options = ActiveSupport.extend(defaultOptions, options);

    try {
        connection = new ActiveXObject("ADODB.Connection");
    } catch (e) { throw new Error("ASP SQLServer adapter requires ASP"); }

    connString = "Provider=" + provider + 
        ";Server=" + options.HOST + 
	    ";Database=" + options.NAME + 
        ";User Id=" + options.USER + 
	    ";Password=" + options.PASS;

    connection.open(connString); 
    return new Adapters.ASPSQLServer(connection);
};

