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
 
var ActiveTest = {
    pass: 0,
    fail: 0,
    error: 0,
    currentGroupName: null,
    currentTestName: null,
    summary: [],
    lastNote: '',
    log: function log(msg)
    {
        if(ActiveTest.currentTestName)
        {
            msg = '[' + ActiveTest.currentTestName + '] ' + msg;
        }
        ActiveSupport.log(msg);
    },
    assert: function assert(condition,note)
    {
        ActiveTest.lastNote = note;
        try
        {
            var pass = !!(typeof(condition) === 'function' ? condition() : condition);
            ++ActiveTest[pass ? 'pass' : 'fail'];
            ActiveTest.log((pass ? 'Pass' : 'Fail') + (note ? ': ' + note : ''));
        }
        catch(e)
        {
            ++ActiveTest.error;
            ActiveTest.log('Error' + (note ? ': ' + note : ''));
            ActiveTest.log(e);
        }
    },
    run: function run()
    {
        ActiveTest.summary = [];
        ActiveTest.lastNote = '';
        ActiveTest.currentGroupName = null;
        ActiveTest.currentTestName = null;
        for(var group_name in ActiveTest.Tests)
        {
            ActiveTest.log(group_name + ' Test Starting');
            ActiveTest.pass = 0;
            ActiveTest.fail = 0;
            ActiveTest.error = 0;
            var stack = [];
            if(ActiveTest.Tests[group_name].setup)
            {
                stack.push(function(){
                    ActiveTest.Tests[group_name].setup(stack.shift());
                });
            }
            for(var test_name in ActiveTest.Tests[group_name])
            {
                if(test_name !== 'setup' && test_name !== 'teardown' && test_name !== 'cleanup')
                {            
                    stack.push(ActiveSupport.curry(function(test_name){
                        ActiveTest.currentTestName = test_name;
                        try
                        {
                            ActiveTest.Tests[group_name][test_name](stack.shift());
                        }
                        catch(e)
                        {
                            ++ActiveTest.error;
                            ActiveTest.log('Error after test' + (ActiveTest.lastNote ? ': ' + ActiveTest.lastNote : ''));
                            ActiveTest.log(e);
                            var output = '[' + group_name + ' Pass:' + ActiveTest.pass +',Fail:' + ActiveTest.fail + ',Error:' + ActiveTest.error + ']';
                            ActiveTest.summary.push(output);
                            ActiveTest.log(output);
                        }
                    },test_name));
                    if(ActiveTest.Tests[group_name].cleanup)
                    {
                        stack.push(function(){
                            ActiveTest.Tests[group_name].cleanup(stack.shift());
                        });
                    }
                }
            }
            if(ActiveTest.Tests[group_name].teardown)
            {
                stack.push(function(){
                    ActiveTest.Tests[group_name].teardown(stack.shift());
                });
            }
            stack.push(function(){
                ActiveTest.currentTestName = null;
                var output = '[' + group_name + ' Pass:' + ActiveTest.pass +',Fail:' + ActiveTest.fail + ',Error:' + ActiveTest.error + ']';
                ActiveTest.summary.push(output);
                ActiveTest.log(output);
            });
            stack.shift()();
        }
        ActiveTest.log('SUMMARY');
        ActiveTest.log('-------');
        for(var i = 0; i < ActiveTest.summary.length; ++i)
        {
            ActiveTest.log(ActiveTest.summary[i]);
        }
    }
};

ActiveTest.Tests = {};

ActiveTest.Tests.ActiveRecord = {};

ActiveTest.Tests.ActiveRecord.setup = function(proceed)
{
        ActiveRecord.execute("IF EXISTS (SELECT name FROM sysobjects WHERE name = 'schema_migrations' AND xtype = 'U') DROP TABLE schema_migrations");
    if(ActiveRecord.Migrations.Meta)
    {
        delete ActiveRecord.Migrations.Meta;
    }
    ActiveRecord.execute("IF EXISTS (SELECT name FROM sysobjects WHERE name = 'posts' AND xtype = 'U') DROP TABLE posts");
    ActiveRecord.execute("IF EXISTS (SELECT name FROM sysobjects WHERE name = 'comments' AND xtype = 'U') DROP TABLE comments");
    ActiveRecord.execute("IF EXISTS (SELECT name FROM sysobjects WHERE name = 'users' AND xtype = 'U') DROP TABLE users");
    ActiveRecord.execute("IF EXISTS (SELECT name FROM sysobjects WHERE name = 'credit_cards' AND xtype = 'U') DROP TABLE credit_cards");
    ActiveRecord.execute("IF EXISTS (SELECT name FROM sysobjects WHERE name = 'string_dates' AND xtype = 'U') DROP TABLE string_dates");
    ActiveRecord.execute("IF EXISTS (SELECT name FROM sysobjects WHERE name = 'dates' AND xtype = 'U') DROP TABLE dates");
    ActiveRecord.execute("IF EXISTS (SELECT name FROM sysobjects WHERE name = 'articles' AND xtype = 'U') DROP TABLE articles");
    ActiveRecord.execute("IF EXISTS (SELECT name FROM sysobjects WHERE name = 'categories' AND xtype = 'U') DROP TABLE categories");
    ActiveRecord.execute("IF EXISTS (SELECT name FROM sysobjects WHERE name = 'categorizations' AND xtype = 'U') DROP TABLE categorizations");
    ActiveRecord.execute("IF EXISTS (SELECT name FROM sysobjects WHERE name = 'field_type_testers' AND xtype = 'U') DROP TABLE field_type_testers");
    ActiveRecord.execute("IF EXISTS (SELECT name FROM sysobjects WHERE name = 'singular_table_name' AND xtype = 'U') DROP TABLE singular_table_name");
    ActiveRecord.execute("IF EXISTS (SELECT name FROM sysobjects WHERE name = 'custom_table' AND xtype = 'U') DROP TABLE custom_table");
    ActiveRecord.execute("IF EXISTS (SELECT name FROM sysobjects WHERE name = 'guid' AND xtype = 'U') DROP TABLE guid");

    //define Posts via SQL
    ActiveRecord.execute("IF NOT EXISTS (SELECT name FROM sysobjects WHERE name = 'posts' AND xtype = 'U') CREATE TABLE posts (id INTEGER IDENTITY,user_id INTEGER,title VARCHAR(255),body TEXT)");

    Post = ActiveRecord.create('posts');
    with(Post)
    {
        belongsTo('user',{
            counter: 'post_count'
        });
        hasMany('comments',{
            dependent: true
        });
    }

    //define Comments via Migrations
    Comment = ActiveRecord.create('comments',{
        title: '',
        post_id: 0,
        user_id: 0,
        body: {
            type: 'text',
            value: ''
        },
        test: {},
        test_2: []
    });
    Comment.validatesPresenceOf('title');
    Comment.belongsTo('user');
    Comment.belongsTo(Post);

    CreditCard = ActiveRecord.create('credit_cards',{
        number: 0
    });

    User = ActiveRecord.create('users',{
        name: '',
        password: '',
        comment_count: 0,
        post_count: 0,
        credit_card_id: 0
    });
    //you can mix and match singular, plural, camelcase, normal
    User.hasMany('Comment',{
        dependent: true
    });
    User.hasMany('posts',{
        dependent: true
    });
    User.hasOne(CreditCard,{
        dependent: true
    });
    
    ModelWithStringDates = ActiveRecord.create('string_dates',{
        name: '',
        created: '',
        updated: ''
    });
    
    ModelWithDates = ActiveRecord.create('dates',{
        name: '',
        created: {
            type: 'DATETIME'
        },
        updated: {
            type: 'DATETIME'
        }
    });
    
    Article = ActiveRecord.create('articles',{
        name: ''
    });
    Article.hasMany('Categorization');
    Article.hasMany('Category',{
        through: 'Categorization'
    });
    
    Category = ActiveRecord.create('categories',{
        name: ''
    });
    Category.hasMany('Categorization');
    Category.hasMany('Article',{
        through: 'Categorization'
    });
    
    Categorization = ActiveRecord.create('categorizations',{
        article_id: 0,
        category_id: 0
    });
    Categorization.belongsTo('Article',{
        dependent: true
    });
    Categorization.belongsTo('Category',{
        dependent: true
    });
    
// SQL Server doesn't have MEDIUMTEXT. Just use TEXT.
    FieldTypeTester = ActiveRecord.create('field_type_testers',{
        string_field: '',
        number_field: 0,
        default_value_field: 'DEFAULT',
        boolean_field: true,
        custom_type_field: {
            //type: 'MEDIUMTEXT'
            type: 'TEXT'
        },
        custom_type_field_with_default: {
            //type: 'MEDIUMTEXT'
            type: 'TEXT',
            value: 'DEFAULT'
        }
    });
    
    SingularTableName = ActiveRecord.create('singular_table_name',{
        string_field: ''
    });

    Custom = ActiveRecord.create({
        tableName: 'custom_table',
        modelName: 'Orange'
    },{
        custom_id: {
            primaryKey: true
        },
        name: ''
    });

// FIXME: SQL Server has problems with non-numeric identities   
//    Guid = ActiveRecord.create({
//        tableName: 'guid'
//    },{
//        guid: {
//            primaryKey: true,
//            type: 'VARCHAR(255)'
//        },
//        data: ''
//    });
 
    if(proceed)
        proceed();
};

ActiveTest.Tests.ActiveRecord.teardown = function(proceed)
{
    with(ActiveTest)
    {
        if(ActiveRecord.asynchronous)
        {

        }
        else
        {
            if(proceed)
                proceed();
        }
    }
};

ActiveTest.Tests.ActiveRecord.basic = function(proceed)
{
    with(ActiveTest)
    {
        if(ActiveRecord.asynchronous)
        {

        }
        else
        {
            //ensure singular table name model can write / read
            var a = SingularTableName.create({string_field: 'test'});
            assert(SingularTableName.find(a.id).string_field == 'test','Singular table names supported.');
            
            //Comment is defined by ActiveRecord, Post is defined by SQL
            var a = new Comment({
                title: 'a',
                body: 'aa'
            });
            assert(a.title == 'a','Record correctly initialized.');

            var b = Comment.create({
                title: 'b',
                body: 'bb'
            });
            assert(b.title == 'b','Record correctly initialized with create().');
            assert(b.id > 0,'Record has id.');
            assert(Comment.find(b.id).title == 'b','Record persisted.');

            var c = Comment.create({
                title: 'c',
                body: 'cc'
            });
            assert(c.id == b.id + 1,'Record incremented id.');
            assert(Comment.find(c.id).title == 'c','Record persisted.');
            assert(Comment.count() == 2,'Record count is correct.');
            assert(Comment.count({
                where: {
                    title: 'c'
                }
            }) == 1,'Record count with conditions is correct.');

            
            assert(b.id == Comment.first().id,'Calculations: first()');
            assert(c.id == Comment.last().id,'Calculations: last()');
            assert(3 == Comment.sum('id'),'Calculations: sum()')
            assert(1 == Comment.min('id'),'Calculations: min()')
            assert(2 == Comment.max('id'),'Calculations: max()')
            
            assert(c.get('title') == 'c','set()')
            c.set('title','ccc');
            assert(c.get('title') == 'ccc' && c.title == 'ccc','set() basic');

            c.set('save','test');
            assert(c.save != 'test' && c.get('save') == 'test','set() does not override protected parameter');

            c.reload();
            assert(c.title == 'c' && c.get('title') == 'c' && typeof(c.save) == 'function','reload()');

            c.updateAttribute('title','ccc');
            assert(c.title == 'ccc' && c.get('title') == 'ccc' && Comment.find(c.id).title == 'ccc','updateAttribute()');

            c.set('title','cccc');
            c.save();
            var _c = Comment.find(c.id);
            assert(_c.title == 'cccc' && _c.title == 'cccc' && c.id == _c.id,'save()');

            var count = Comment.count();
            c.destroy();
            assert(!c.reload() && count - 1 == Comment.count(),'destroy()');
            
            //create with an id preserves id and still acts as "created"
            var called = false;
            Comment.observeOnce('afterCreate',function(){
                called = true;
            });
            var d = Comment.create({
                id: 50,
                title: 'd',
                body: 'dd'
            });
            d.reload();
            assert(d.id == 50 && called,'create with an id preserves id and still acts as "created"');
            
            Comment.destroy('all');
            assert(Comment.count() == 0,'destroy("all")');
            
            //field type testing
            
            var field_test_zero = new FieldTypeTester();
            assert(field_test_zero.string_field == '' && field_test_zero.number_field == 0 && field_test_zero.default_value_field == 'DEFAULT' && field_test_zero.custom_type_field_with_default == 'DEFAULT','correct default values are set on initialize()');            
            
            var field_test_one = FieldTypeTester.create({
                string_field: 'a',
                number_field: 1,
                boolean_field: true
            });
            field_test_one.reload();
            assert(field_test_one.string_field === 'a' && field_test_one.number_field === 1 && field_test_one.boolean_field === true,'String, Number and Boolean(true) field types preserved.');
            
            var field_test_two = FieldTypeTester.create({
                string_field: 'b',
                number_field: 2,
                boolean_field: false
            });
            field_test_two.reload();
            assert(field_test_two.string_field === 'b' && field_test_two.number_field === 2 && field_test_two.boolean_field === false,'String, Number and Boolean(false) field types preserved.');
            
            var empty_record = FieldTypeTester.create();
            empty_record.reload();
            assert(empty_record.default_value_field == 'DEFAULT','Default value is set on simple field type.');
            assert(empty_record.custom_type_field == '','Empty value is set on custom field type with no default specification.');
            assert(empty_record.custom_type_field_with_default == 'DEFAULT','Default value is set on custom field type with default specification.');
            
            //should find one false
            assert(FieldTypeTester.find({
                where: {
                    boolean_field: false
                }
            })[0].id == field_test_two.id,'find({where: {boolean_field: false}})');
            
            //should find two true (since true is the default value and we created an empty record)
            assert(FieldTypeTester.find({
                where: {
                    boolean_field: true
                }
            })[0].id == field_test_one.id,'find({where: {boolean_field: true}})');
            
            assert(FieldTypeTester.findByBooleanField(true).id == field_test_one.id,'findByBooleanField(true)');
            assert(FieldTypeTester.findByBooleanField(false).id == field_test_two.id,'findByBooleanField(false)');
            
            if(proceed)
                proceed();
        }
    }
};

ActiveTest.Tests.ActiveRecord.callbacks = function(proceed)
{
    with(ActiveTest)
    {
        if(ActiveRecord.asynchronous)
        {

        }
        else
        {
            var i = 0;
            var x = 0;
            Comment.observe('beforeCreate',function(){
                ++i;
            });
            var a = Comment.create({
                title: 'a'
            });
            //alternate syntax
            a.afterSave(function(){
                ++x;
            });
            var b = Comment.create({
                title: 'b'
            });
            assert(i == 2,'Class callbacks.');
            a.save();
            assert(i == 2 && x == 1,'Instance.callbacks');
            if(proceed)
                proceed();
        }
    }
};

ActiveTest.Tests.ActiveRecord.cleanup = function(proceed)
{
    if(ActiveRecord.asynchronous)
    {

    }
    else
    {
        Comment.destroy('all');
        Post.destroy('all');
        User.destroy('all');
        ModelWithStringDates.destroy('all');
        ModelWithDates.destroy('all');
        Article.destroy('all');
        Category.destroy('all');
        Categorization.destroy('all');
        
        if(proceed)
            proceed();
    }
};

ActiveTest.Tests.ActiveRecord.date = function(proceed)
{
    with(ActiveTest)
    {
        if(ActiveRecord.asynchronous)
        {

        }
        else
        {
            var a = ModelWithStringDates.create({
                name: 'a'
            });
            assert(a.get('created').match(/^\d{4}/) && a.get('updated').match(/^\d{4}/),'created and updated set via string field');
            var old_date = a.get('updated');
            a.set('updated','');
            a.save();
            var new_date = a.get('updated');
            assert(ModelWithStringDates.find(a.id).get('updated') == new_date,'created and updated persist via string field');

            var a = ModelWithDates.create({
                name: 'a'
            });
            assert(ActiveSupport.dateFormat(a.get('created'),'yyyy-mm-dd HH:MM:ss').match(/^\d{4}/) && ActiveSupport.dateFormat(a.get('updated'),'yyyy-mm-dd HH:MM:ss').match(/^\d{4}/),'created and updated set via date field');
            var old_date = a.get('updated');
            a.set('updated','');
            a.save();
            var new_date = a.get('updated');
            var saved_date = ModelWithDates.find(a.id).get('updated');
            assert(saved_date.toString() == new_date.toString(),'created and updated persist via date field');
            
            //make sure dates are preserved
            var reload_test = ModelWithDates.find(a.id);
            var old_created = reload_test.get('created');
            reload_test.save();
            reload_test.reload();
            reload_test.save();
            reload_test.reload();
            assert(reload_test.get('created').toString() == old_created.toString(),'created time is preserved on update');

            if(proceed)
                proceed();
        }
    }
};

ActiveTest.Tests.ActiveRecord.finders = function(proceed)
{    
    with(ActiveTest)
    {
        if(ActiveRecord.asynchronous)
        {

        }
        else
        {
            var a = Comment.create({
                title: 'a'
            });
            var b = Comment.create({
                title: 'b'
            });
            var c = Comment.create({
                title: 'c'
            });
            assert(Comment.find({
                all: true,
                where: {
                    title: 'b'
                }
            })[0].title == 'b','find({where: Hash})');
// SQL Server does not approve of double quotes
            assert(Comment.find({
                all: true,
                //where: 'title = "c"'
                where: "title = 'c'"
            })[0].title == 'c','find({where: String})');
            assert(Comment.find({
                first: true,
                where: {
                    title: 'b'
                }
            }).title == 'b','find({first: true, where: Hash})');
// SQL Server does not approve of double quotes
            assert(Comment.find({
                first: true,
                //where: 'title = "b"'
                where: "title = 'b'"
            }).title == 'b','find({first: true, where: string})');
// Use TOP instead of LIMIT
            //b = Comment.find('SELECT * FROM comments WHERE title = ? LIMIT 1','b');
            b = Comment.find('SELECT TOP 1 * FROM comments WHERE title = ?','b');
            assert(b[0] && b[0].title == 'b','find(SQL string with WHERE, LIMIT and param substituion)');
            b = Comment.find({
              where: ['title = ?','b'],
              limit: 1
            });
            assert(b[0] && b[0].title == 'b','find(SQL string with WHERE, LIMIT and param substituion via find)');            
            
            assert(Comment.find().length == 3 && Comment.find({all: true}).length == 3,'find({all: true})');

            var asc = Comment.find({
                all: true,
                order: 'id ASC'
            });
            var desc = Comment.find({
                all: true,
                order: 'id DESC'
            });

            var asc_find_by_sql = Comment.find('SELECT * FROM comments ORDER BY id ASC');
            var desc_find_by_sql = Comment.find('SELECT * FROM comments ORDER BY id DESC');

            assert(asc[0].title == asc_find_by_sql[0].title && asc[2].title == asc_find_by_sql[2].title && desc[0].title == desc_find_by_sql[0].title && desc[2].title == desc_find_by_sql[2].title,'find(sql_string)');
            assert(asc[0].title == 'a' && asc[2].title == 'c' && desc[0].title == 'c' && desc[2].title == 'a','find({all: true,order: String})');

            assert(typeof(Comment.findByTitle) != 'undefined','findBy#{X} exists.');
            assert(typeof(Comment.findAllByTitle) != 'undefined','findAllBy#{X} exists.');
            assert(Comment.findByTitle('a').title == a.title && Comment.findById(a.id).id == a.id,'findByX works');
            
            //test GROUP BY
            Comment.destroy('all');
            var one = Comment.create({title: 'a'});
            var two = Comment.create({title: 'a'});
            var three = Comment.create({title: 'b'});
// This 'group' is currently ignored by the sql server adapter
            var result = Comment.find({
                group: 'title',
                order: 'id ASC'
            });
            //assert(result[0].title == 'a' && result[1].title == 'b','GROUP BY clause via params works');
// This is not a valid SQL Server query
            //var result = Comment.find('SELECT * FROM comments GROUP BY title ORDER BY id ASC');
            //assert(result[0].title == 'a' && result[1].title == 'b','GROUP BY clause via SQL works');
            
            //test find multiple by id
            //add extra record to make sure it is not finding all
            Comment.create({
                title: 'c'
            });
            var a = Comment.find(one.id,two.id,three.id);
            assert(a.length == 3 && a[0].id == one.id && a[1].id == two.id && a[2].id == three.id,'WHERE id IN(arguments array)');
            var b = Comment.find([one.id,two.id,three.id]);
            assert(b.length == 3 && b[0].id == one.id && b[1].id == two.id && b[2].id == three.id,'WHERE id IN(array)');
            var c = Comment.find('SELECT * FROM comments WHERE id IN(?,?,?)',one.id,two.id,three.id);
            assert(c.length == 3 && c[0].id == one.id && c[1].id == two.id && c[2].id == three.id,'WHERE id IN(array) via SQL string');
            
            if(proceed)
                proceed();
        }
    }
};

ActiveTest.Tests.ActiveRecord.id = function(proceed)
{
    with (ActiveTest)
    {
        if (ActiveRecord.asynchronous)
        {

        }
        else
        {
            var a = Custom.create({name: 'test'});
            assert(Custom.find(a.custom_id).name == 'test', 'Custom integer primary key.');

            //var b = Guid.create({guid: '123', data: 'test'});
            //var result = Guid.find({first: true, where: ['guid = ?', b.guid]});
            //assert(result.data == 'test', 'String primary key.');

            if(proceed)
                proceed();
        }
    }
};

ActiveTest.Tests.ActiveRecord.migrations = function(proceed)
{
    with(ActiveTest)
    {
        if(ActiveRecord.asynchronous)
        {

        }
        else
        {
            if(ActiveRecord.connection.schemaLess)
            {
                if(proceed)
                    return proceed();
            }
            //test migration versioning with no actual migration
            var times_up_executed = 0;
            var times_down_executed = 0;
            var empty_migration = {
                up: function(){
                    ++times_up_executed;
                },
                down: function(){
                    ++times_down_executed;
                }
            };
            ActiveRecord.Migrations.migrations = {
                1: empty_migration,
                2: empty_migration,
                3: empty_migration,
                4: empty_migration,
                5: empty_migration
            };
            
            //test internals
            assert(ActiveRecord.Migrations.collectAboveIndex(3)[0][0] == 4 && ActiveRecord.Migrations.collectAboveIndex(3)[1][0] == 5,'Migrations.collectAboveIndex(3)');
            assert(ActiveRecord.Migrations.collectBelowIndex(3)[0][0] == 3 && ActiveRecord.Migrations.collectBelowIndex(3)[1][0] == 2  && ActiveRecord.Migrations.collectBelowIndex(3)[2][0] == 1,'Migrations.collectBelowIndex(3)');
            
            assert(ActiveRecord.Migrations.collectAboveIndex(3,4)[0][0] == 4 && !ActiveRecord.Migrations.collectAboveIndex(3,4)[1],'Migrations.collectAboveIndex(3,4)');
            
            assert(ActiveRecord.Migrations.collectBelowIndex(3,2)[0][0] == 3 && !ActiveRecord.Migrations.collectBelowIndex(3,2)[1],'Migrations.collectBelowIndex(3,2)');
            
            assert(ActiveRecord.Migrations.max() == 5,'Migrations.max()');
            assert(ActiveRecord.Migrations.current() == 0,'Migrations.current()');
            
            //0 -> 5
            ActiveRecord.Migrations.migrate();
            assert(times_down_executed == 0 && times_up_executed == 5 && ActiveRecord.Migrations.current() == 5,'Migrations.migrate() 0 -> 5');
            times_up_executed = 0;
            times_down_executed = 0;
            
            //5 -> 0
            ActiveRecord.Migrations.migrate(0);
            assert(times_down_executed == 5 && times_up_executed == 0 && ActiveRecord.Migrations.current() == 0,'Migrations.migrate() 5 -> 0');
            times_up_executed = 0;
            times_down_executed = 0;
            
            //0 -> 3
            ActiveRecord.Migrations.migrate(3);
            assert(times_down_executed == 0 && times_up_executed == 3 && ActiveRecord.Migrations.current() == 3,'Migrations.migrate() 0 -> 3');
            times_up_executed = 0;
            times_down_executed = 0;
            
            //3 -> 5
            ActiveRecord.Migrations.migrate(5);
            assert(times_down_executed == 0 && times_up_executed == 2 && ActiveRecord.Migrations.current() == 5,'Migrations.migrate() 3 -> 5');
            times_up_executed = 0;
            times_down_executed = 0;
            
            //5 -> 3
            ActiveRecord.Migrations.migrate(3);
            assert(times_down_executed == 2 && times_up_executed == 0 && ActiveRecord.Migrations.current() == 3,'Migrations.migrate() 5 -> 3');
            times_up_executed = 0;
            times_down_executed = 0;
            
            //3 -> 0
            ActiveRecord.Migrations.migrate(0);
            assert(times_down_executed == 3 && times_up_executed == 0 && ActiveRecord.Migrations.current() == 0,'Migrations.migrate() 3 -> 0');
            times_up_executed = 0;
            times_down_executed = 0;
            
            //now use real migrations
            ActiveRecord.Migrations.migrations = {
                1: {
                    up: function(schema){
                        schema.createTable('one',{
                            a: '',
                            b: {
                                type: 'TEXT',
                                value: 'default'
                            }
                        });
                    },
                    down: function(schema){
                        schema.dropTable('one');
                    }
                },
                2: {
                    up: function(schema){
                        schema.addColumn('one','c');
                    },
                    down: function(schema){
                        schema.dropColumn('one','c');
                    }
                },
                3: {
                    up: function(schema){
                        schema.addColumn('one','d',{
                            type: 'TEXT',
                            value: 'default'
                        })
                    },
                    down: function(schema){
                        schema.dropColumn('one','d');
                    }
                }
            };
            
            var assertions = {
                1: {
                    up: function(){
                        try{
                            ActiveRecord.execute('SELECT * FROM one');
                            assert(true,'Migrations.migrate() 0 -> 1 (createTable)');
                        }catch(e){
                            assert(false,'Migrations.migrate() 0 -> 1 (createTable)');
                        }
                    },
                    down: function(){
                        try{
                            ActiveRecord.execute('SELECT * FROM one');
                            assert(false,'Migrations.migrate() 1 -> 0 (dropTable)');
                        }catch(e){
                            assert(true,'Migrations.migrate() 1 -> 0 (dropTable)');
                        }
                    }
                },
                2: {
                    up: function(){
                        try{
                            ActiveRecord.execute('SELECT a,b,c FROM one');
                            assert(true,'Migrations.migrate() 0 -> 2 (addColumn)');
                        }catch(e){
                            assert(false,'Migrations.migrate() 0 -> 2 (addColumn)');
                        }
                    },
                    down: function(){
                        try{
                            ActiveRecord.execute('SELECT a,b,c FROM one');
                            assert(false,'Migrations.migrate() 0 -> 2 (dropColumn)');
                        }catch(e){
                            assert(true,'Migrations.migrate() 0 -> 2 (dropColumn)');
                        }
                    }
                },
                3: {
                    up: function(){
                        
                    },
                    down: function(){
                        
                    }
                }
            };
            ActiveRecord.Migrations.migrate(1);
            assertions[1].up();
            ActiveRecord.Migrations.migrate(0);
            assertions[1].down();
            
            //ActiveRecord.logging = true;
            //
            //ActiveRecord.Migrations.migrate(3);
            //assertions[1].up();
            //assertions[2].up();
            //ActiveRecord.Migrations.migrate(0);
            //assertions[2].down();
            //assertions[1].down();
            //
            //ActiveRecord.logging = false;
            
            if(proceed)
                proceed();
        }
    }
};

ActiveTest.Tests.ActiveRecord.relationships = function(proceed)
{
    with(ActiveTest)
    {
        if(ActiveRecord.asynchronous)
        {

        }
        else
        {
            //has many
            var abbey = User.create({
                name: 'Abbey'
            });
            var bailey = User.create({
                name: 'Bailey'
            });

            assert(
                typeof(bailey.getPostList) == 'function' &&
                typeof(bailey.getPostCount) == 'function' &&
                typeof(bailey.destroyPost) == 'function' &&
                typeof(bailey.createPost) == 'function' &&
                typeof(bailey.buildPost) == 'function'
            ,'hasMany methods created.');

            var count = bailey.getPostCount();
            assert(count == 0,'hasMany get#{X}Count()');
            var x = bailey.buildPost({
                title: 'x'
            });
            assert(!x.id && x.user_id == bailey.id,'hasMany build#{X}()')
            var a = bailey.createPost({
                title: 'a'
            });
            
            assert(a.user_id == bailey.id && bailey.getPostCount() == count + 1,'hasMany create#{X}()');
            var b = bailey.createPost({
                title: 'b'
            });
            var list = bailey.getPostList();
            assert(list.length == 2 && list[0].title == 'a' && bailey.getPostList({
                order: 'id DESC'
            })[0].title == 'b','hasMany get#{X}List()');

            bailey.destroyPost(b);
            assert(User.find(bailey.id) && Post.find(a.id) && !Post.find(b.id),'hasMany destroy#{X}()');

            var z = bailey.createPost({
                title: 'z'
            });
            var x = bailey.createPost({
                title: 'x'
            });
            bailey.reload();
            
            var count_one = (bailey.getPostCount() == 3 && bailey.post_count == 3);
            x.destroy();
            bailey.reload();
            
            var count_two = (bailey.getPostCount() == 2 && bailey.post_count == 2);
            assert(count_one && count_two,'hasMany counter');

            bailey.destroy();
            assert(!z.reload() && !Post.find(x.id) && !User.find(bailey.id),'hasMany dependents destroyed');

            //belongs to
            var x = abbey.createPost({
                title: 'x'
            });
            assert(
                typeof(x.getUser) == 'function' &&
                typeof(x.buildUser) == 'function' &&
                typeof(x.createUser) == 'function'
            ,'belongsTo methods created.');

            assert(x.getUser().id == abbey.id,'belongsTo get#{X}()')

            var y = Post.create({
                title: 'y'
            });
            var colin = y.createUser({
                name: 'colin'
            });
            assert(y.user_id == colin.id && Post.find(y.id).user_id == colin.id,'belongsTo create#{X}()');

            //has one
            assert(
                typeof(abbey.getCreditCard) == 'function' &&
                typeof(abbey.buildCreditCard) == 'function' &&
                typeof(abbey.createCreditCard) == 'function'
            ,'hasOne methods created.');

            var before = abbey.getCreditCard();
            var credit_card = abbey.createCreditCard({
                number: '0001'
            });
            assert(credit_card.id == abbey.getCreditCard().id && !before,'hasOne get#{X}() and create#{X}()');
            abbey.destroy();
            assert(!CreditCard.find(credit_card.id),'hasOne dependent destroyed');
            
            //has many through
            var a = Article.create({
                name: 'sports are great'
            });
            var b = Article.create({
                name: 'sports are boring in england'
            });
            var c = Article.create({
                name: 'england is great'
            });
            
            var sports = Category.create({
                name: 'sports'
            });
            var england = Category.create({
                name: 'england'
            });
            
            Categorization.create({
                category_id: sports.id,
                article_id: a.id
            });
            Categorization.create({
                category_id: sports.id,
                article_id: b.id
            });
            Categorization.create({
                category_id: england.id,
                article_id: b.id
            });
            Categorization.create({
                category_id: england.id,
                article_id: c.id
            });
                        
            assert(a.getCategorizationCount() == 1 && b.getCategorizationCount() == 2,'has many through, regular has many in tact');
            assert(typeof(a.getCategoryList) == 'function' && typeof(a.getCategoryCount) == 'function','has many through generates correct methods');
            assert(a.getCategoryList()[0].name == 'sports' && b.getCategoryList()[1].name == 'england' && b.getCategoryCount() == 2,'has many through returns proper results')
            
            if(proceed)
                proceed();
        }
    }
};

ActiveTest.Tests.ActiveRecord.serialization = function(proceed)
{
    with(ActiveTest)
    {
        if(ActiveRecord.asynchronous)
        {

        }
        else
        {
            var a = Comment.create({
                title: 'a',
                test: {
                    a: '1',
                    b: 2,
                    c: {
                        aa: '11',
                        bb: [1,2,3],
                        cc: '33'
                    }
                }
            });
            var sample = Comment.find(a.id).test;
            assert(sample.a == a.test.a && sample.b == a.test.b && a.test.c.bb[1] == sample.c.bb[1],'Object serialization.');
            var b = Comment.create({
                title: 'b',
                test_2: [1,2,['a','b','c']]
            });
            var sample = Comment.find(b.id).test_2;
            assert(sample[0] == b.test_2[0] && sample[2][1] == b.test_2[2][1],'Array serialization.');
            a.destroy();
            b.destroy();
            
            var ted = User.create({name: 'ted'});
            var one = ted.createComment({title: 'title one',body: 'comment one'});
            var two = ted.createComment({title: 'title two',body: 'comment two'});
            //JSON
            
            //item
            assert(ActiveSupport.JSON.parse(ted.toJSON()).name === ted.name && ActiveSupport.JSON.parse(ted.toJSON()).id === ted.id,'JSON parse/serialize item');
            
            //array
            var result = Comment.find({all: true});
            assert(ActiveSupport.JSON.parse(result.toJSON())[0].body === result[0].body,'JSON parse/serialize array');
            
            //nested
            var json = ted.toJSON({
              comments: ted.getCommentList().toArray()
            });
            var parsed = ActiveSupport.JSON.parse(json);
            assert(ted.getCommentList()[0].body === parsed.comments[0].body,'JSON parse/serialize object with nested array');
            
            if(proceed)
                proceed();
        }
    }
};

ActiveTest.Tests.ActiveRecord.synchronization = function(proceed)
{
    with(ActiveTest)
    {
        if(ActiveRecord.asynchronous)
        {

        }
        else
        {   
            //INDIVIDUAL RESULT SYNCHRONIZATION
            
            //test basic synchronization through find
            var abbey = User.create({
                name: 'Abbey'
            });
            
            //ensure no spill over into other records
            var bailey = User.create({
                name: 'Bailey'
            });
            
            //setup events for event count test
            var after_save_event_trigger_count = 0;
            var synchronization_after_save_event_trigger_count = 0;
            var after_destroy_event_trigger_count = 0;
            var synchronization_after_destroy_event_trigger_count = 0;
            
            User.observe('afterSave',function(){
                ++after_save_event_trigger_count;
            });
            User.observe('synchronization:afterSave',function(){
                ++synchronization_after_save_event_trigger_count;
            });
            User.observe('afterDestroy',function(){
                ++after_destroy_event_trigger_count;
            });
            User.observe('synchronization:afterDestroy',function(){
                ++synchronization_after_destroy_event_trigger_count;
            });
            
            
            //test synchronize param works
            var abbey_clone = User.find({
                first: true,
                where: {
                    id: abbey.id
                }
            });
            abbey_clone.synchronize();
            
            var abbey_clone_2 = User.find({
                first: true,
                where: {
                    id: abbey.id
                }
            });
            abbey_clone_2.synchronize();
            
            
            abbey.set('name','Abbey!');
            abbey.save();
            
            assert(abbey_clone.name == 'Abbey!' && abbey_clone_2.name == 'Abbey!','basic synchronization with param');
            assert(after_save_event_trigger_count == 1,'afterSave event not triggered by synchronization');
            assert(synchronization_after_save_event_trigger_count == 2,'synchronization:afterSave event triggered by synchronization');
            
            //ensure created record applies synchronization
            var colin = User.create({
                name: 'colin'
            });
            colin.synchronize();
            var colin_clone = User.findByName('colin');
            colin_clone.set('name','Colin');
            colin_clone.save();
            assert(colin.get('name') == 'Colin','created record synchronizes');
            
            //ensure stop works
            abbey_clone_2.stop();
            abbey.set('name','ABBEY');
            abbey.save();
            assert(abbey_clone.name == 'ABBEY' && abbey_clone_2.name == 'Abbey!','stop() prevents synchronization');
            
            //after destroy triggered
            abbey.destroy();
            assert(after_destroy_event_trigger_count == 1,'afterDestory event not triggered by synchronization');
            assert(synchronization_after_destroy_event_trigger_count == 1,'synchronization:afterDestory event triggered by synchronization');
            
            //RESULT SET SYNCHRONIZATION
            var users = User.find({synchronize: true});
            var dave = User.create({
                name: 'dave'
            });
            assert(users[2] && users[2].name == 'dave','basic result set synchronization');
            
            var users_ordered_by_name = User.find({
                order: 'name DESC',
                synchronize: true
            });
            var freddy = User.create({
                name: 'freddy'
            });
            assert(users_ordered_by_name[0] && users_ordered_by_name[0].name == 'freddy','ordered result set synchronization');
            
            colin_clone.destroy();
            
            assert(users[0].name == 'Bailey' && users[2].name == 'freddy' && users_ordered_by_name[0].name == 'freddy' && users_ordered_by_name[2].name == 'Bailey','result sets synchronized afterDestroy');
            
            users_ordered_by_name.stop();
            users.stop();
            
            users[0].destroy();
            
            assert(users_ordered_by_name[2] && users_ordered_by_name[2].name == 'Bailey','result set stop() prevents synchronization');
            
            //calculation synchronization
            var count_callback_call_count = 0;
            var response;
            var count_synchronization_stopper = User.count({
                synchronize: function(count){
                    ++count_callback_call_count;
                    response = count;
                }
            });
            assert(count_callback_call_count == 1 && response == 2,'count synchronize calls callback with correct value');
            var egor = User.create({
                name: 'egor'
            });
            assert(count_callback_call_count == 2 && response == 3,'count synchronize calls callback with correct value after create');
            egor.destroy();
            assert(count_callback_call_count == 3 && response == 2,'count synchronize calls callback with correct value after destroy');
            count_synchronization_stopper();
            User.create({
                name: 'freddy'
            });
            assert(count_callback_call_count == 3 && response == 2,'count synchronize stoppable');
            
            if(proceed)
                proceed();
        }
    }
};

ActiveTest.Tests.ActiveRecord.transactions = function(proceed)
{
    with(ActiveTest)
    {
        if(ActiveRecord.asynchronous)
        {

        }
        else
        {
            var count = Comment.count();
            Comment.transaction(function(){
                var a = Comment.create({
                    title: 'a'
                });
                var b = Comment.create({
                    title: 'a'
                });
            });
            assert(Comment.count() == count + 2,'Transaction COMMIT');
            try{
                Comment.transaction(function(){
                    var c = Comment.create({
                        title: 'c'
                    });
                    var d = Comment.create({
                        title: 'd'
                    });
                    throw 'error';
                });
                
            }catch(e){
                assert(Comment.count() == count + 2 && e.message == 'error','Transaction ROLLBACK without handler');
            }
            Comment.transaction(function(){
                var c = Comment.create({
                    title: 'c'
                });
                var d = Comment.create({
                    title: 'd'
                });
                throw 'error';
            },function(e){
                assert(Comment.count() == count + 2 && e.message == 'error','Transaction ROLLBACK with handler');
            });
            if(proceed)
                proceed();
        }
    }
};

ActiveTest.Tests.ActiveRecord.validations = function(proceed)
{
    with(ActiveTest)
    {
        if(ActiveRecord.asynchronous)
        {

        }
        else
        {
            var a = Comment.create({});
            assert(!a.id && a.getErrors().length > 0,'create() enforces validations.');
            var b = new Comment();
            assert(!b.save() && !b.id && b.getErrors().length > 0,'save() enforces validations.');
            b.set('title','b');
            b.save();
            assert(b.id && b.getErrors().length == 0,'save() allows save after correction');
            if(proceed)
                proceed();
        }
    }
};

ActiveTest.Tests.ActiveRecord.parser = function(proceed)
{
    with(ActiveTest)
    {
        if(ActiveRecord.asynchronous)
        {

        }
        else
        {

            if(proceed)
                proceed();
        }
    }
};
