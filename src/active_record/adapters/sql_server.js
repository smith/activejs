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

Adapters.SQLServer = ActiveSupport.extend(ActiveSupport.clone(Adapters.SQL),{
    createTable: function createTable(table_name,columns) {
        var keys = ActiveSupport.keys(columns);
        var fragments = [];
        var pk = "id";

        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            fragments.push(this.getColumnDefinitionFragmentFromKeyAndColumns(
                key,columns
            ));
        }
        fragments.unshift(pk + " INT NOT NULL IDENTITY");
        return this.executeSQL("IF NOT EXISTS (SELECT name FROM sysobjects WHERE name = '" + 
            table_name + "' AND xtype = 'U') CREATE TABLE " + table_name + " (" +
            fragments.join(",") + ")"
        );
    },

    // TODO: Offset
    buildSQLArguments: function buildSQLArguments(table, params, calculation) {
        var args = [];
        var sql = 'SELECT ' + 
            (params.limit ? ' TOP ' + params.limit : '') +
            (calculation ? (calculation + ' AS calculation') 
                         : (params.select ? params.select.join(',') : '*')
            ) + ' FROM ' + table +
            this.buildWhereSQLFragment(params.where, args) +
            (params.joins ? ' ' + params.joins : '') + 
            (params.group ? ' GROUP BY ' + params.group : '') + 
            (params.order ? ' ORDER BY ' + params.order : '')
        args.unshift(sql);
        return args;
    },

    fieldIn: function fieldIn(field, value) {
        if (Migrations.objectIsFieldDefinition(field)) {
            field = this.getDefaultValueFromFieldDefinition(field);
        }
        value = this.setValueFromFieldIfValueIsNull(field,value);
        if (typeof field === 'string') {
            return String(value);
        }
        if (typeof field === 'number') {
            return value
        }
        if(typeof(field) === 'boolean') {
            return value ? 1 : 0;
        }
        //array or object
        if (typeof value === 'object' && 
            !Migrations.objectIsFieldDefinition(field)) {
            return ActiveSupport.JSON.stringify(value);
        }
    }
});
