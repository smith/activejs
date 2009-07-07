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

ActiveRecord.Adapters.SQLServer = ActiveSupport.extend(ActiveSupport.clone(ActiveRecord.Adapters.SQL),{
    insertEntity: function insertEntity(table, primary_key_name, data) {
        var keys = ActiveSupport.keys(data).sort();
        var values = [];
        var args = [];
        var sql = "";
        var response, id, data_with_id;

        for(var i = 0; i < keys.length; ++i) {
            args.push(data[keys[i]]);
            values.push('?');
        }
        sql = "INSERT INTO " + table + " (" + keys.join(',') + ") VALUES (" + 
            values.join(',') + ");";

        // If we're trying to insert a primary key, turn identity insert on 
        // then off
        if (primary_key_name in data) {
            sql = "SET IDENTITY_INSERT " + table + " ON;" + sql + 
                "SET IDENTITY_INSERT " + table + " OFF;";
        }

        args.unshift(sql);
        response = this.executeSQL.apply(this,args);
        id = this.getLastInsertedRowId();
        data_with_id = ActiveSupport.clone(data);
        data_with_id[primary_key_name] = id;
        this.notify('created',table,id,data_with_id);
        return response;
    },

    createTable: function createTable(table_name,columns) {
        var keys = ActiveSupport.keys(columns);
        var fragments = [];
        var type;

        for (var i = 0; i < keys.length; i += 1) {
            var key = keys[i];
            if (columns[key].primaryKey) {
                type = columns[key].type || "INT";
                fragments.unshift(key + " " + type + " NOT NULL " + 
                    (type === "INT" ? "IDENTITY" : ""));
            } else {
                fragments.push(this.getColumnDefinitionFragmentFromKeyAndColumns(key,columns));
            }
        }
        return this.executeSQL("IF NOT EXISTS (SELECT name FROM sysobjects WHERE name = '" + 
            table_name + "' AND xtype = 'U') CREATE TABLE " + table_name + " (" +
            fragments.join(",") + ")");
    },

    getDefaultColumnDefinitionFragmentFromValue: function getDefaultColumnDefinitionFragmentFromValue(value) {
        if (typeof value === "string") { return "VARCHAR(255)"; }
        if (typeof value === "number") { return "INT"; }
        if (typeof value === "boolean") { return "BIT"; }
        return "TEXT";
    },

    updateEntity: function updateEntity(table, primary_key_name, id, data) {
        var keys = ActiveSupport.keys(data).sort();
        var args = [];
        var values = [];

        for (var i = 0; i < keys.length; i += 1) {
            if (keys[i] !== primary_key_name) {
                args.push(data[keys[i]]);
                values.push(keys[i] + " = ?");
            }
        }
        args.push(id);
        args.unshift("UPDATE " + table + " SET " + values.join(',') + 
            " WHERE " + primary_key_name + " = ?");
        var response = this.executeSQL.apply(this, args);
        this.notify('updated',table,id,data);
        return response;
    },

    // TODO: Offset
    // TODO: Get primary key
    // FIXME: GROUP BY fails because of SQL Server being finicky. Skip it for 
    // now
    buildSQLArguments: function buildSQLArguments(table, params, calculation) {
        var args = [];
        var pk = "id";
        var sql = 'SELECT ' + 
            (params.limit ? ' TOP ' + params.limit : '') + ' ' +
            (calculation ? (calculation + ' AS calculation') : (params.select ? params.select.join(',') : '*')) + 
            ' FROM ' + table +
            this.buildWhereSQLFragment(params.where, args) +
            (params.joins ? ' ' + params.joins : '');// + 
            //(params.group ? ' GROUP BY ' + params.group : '');
        // Order by primary key name by default, but only if there is no
        // caculation
        if (!calculation) {
            sql += ' ORDER BY ' + (params.order ? params.order : pk);
        }
        args.unshift(sql);
        return args;
    },

    dropTable: function dropTable(table_name) {
        return this.executeSQL("IF EXISTS (SELECT name " + 
            "FROM sysobjects WHERE xtype = 'U' AND name = '" + table_name + 
            "') DROP TABLE " + table_name);
    },

    fieldIn: function fieldIn(field, value) {
        if (value && value instanceof Date) {
            return ActiveSupport.dateFormat(value,'yyyy-mm-dd HH:MM:ss');
        }
        if (ActiveRecord.Migrations.objectIsFieldDefinition(field)) {
            field = this.getDefaultValueFromFieldDefinition(field);
        }
        value = this.setValueFromFieldIfValueIsNull(field,value);
        if (typeof field === 'string') {
            return String(value);
        }
        if (typeof field === 'number') {
            return value;
        }
        if(typeof(field) === 'boolean') {
            return value ? 1 : 0;
        }
        //array or object
        if (typeof value === 'object' && 
            !ActiveRecord.Migrations.objectIsFieldDefinition(field)) {
            return ActiveSupport.JSON.stringify(value);
        }
    }
});
