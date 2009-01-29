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
    ActiveSupport.extend(this,Adapters.MySQL);
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
            ActiveRecord.connection.log("Adapters.ASPSQLServer.executeSQL: " + sql + " [" + ActiveSupport.arrayFrom(arguments).slice(1).join(',') + "]");
            var response = db.execute.apply(arguments);
            return response;
        },

        getLastInsertedRowId: function getLastInsertedRowId() {
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

