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
    if(ActiveRecord.asynchronous)
    {
        ActiveRecord.execute('SELECT * FROM sqlite_master');
        
    }
    else
    {
        
        ActiveRecord.execute('DROP TABLE IF EXISTS schema_migrations');
        if(ActiveRecord.Migrations.Meta)
        {
            delete ActiveRecord.Migrations.Meta;
        }
        ActiveRecord.execute('DROP TABLE IF EXISTS posts');
        ActiveRecord.execute('DROP TABLE IF EXISTS comments');
        ActiveRecord.execute('DROP TABLE IF EXISTS users');
        ActiveRecord.execute('DROP TABLE IF EXISTS credit_cards');
        ActiveRecord.execute('DROP TABLE IF EXISTS string_dates');
        ActiveRecord.execute('DROP TABLE IF EXISTS dates');
        ActiveRecord.execute('DROP TABLE IF EXISTS articles');
        ActiveRecord.execute('DROP TABLE IF EXISTS categories');
        ActiveRecord.execute('DROP TABLE IF EXISTS categorizations');
        ActiveRecord.execute('DROP TABLE IF EXISTS field_type_testers');
        ActiveRecord.execute('DROP TABLE IF EXISTS singular_table_name');
        ActiveRecord.execute('DROP TABLE IF EXISTS custom_table');
        ActiveRecord.execute('DROP TABLE IF EXISTS guid');
        ActiveRecord.execute('DROP TABLE IF EXISTS reserved');

        //define Posts via SQL
        if(ActiveRecord.adapter == ActiveRecord.Adapters.JaxerMySQL)
        {
            ActiveRecord.execute('CREATE TABLE IF NOT EXISTS posts(id INT NOT NULL AUTO_INCREMENT, user_id INT, title VARCHAR(255), body TEXT, PRIMARY KEY(id))');
        }
        else
        {
            ActiveRecord.execute('CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY,user_id,title,body)');
        }
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
        
        FieldTypeTester = ActiveRecord.create('field_type_testers',{
            string_field: '',
            number_field: 0,
            default_value_field: 'DEFAULT',
            boolean_field: true,
            custom_type_field: {
                type: 'MEDIUMTEXT'
            },
            custom_type_field_with_default: {
                type: 'MEDIUMTEXT',
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

        Guid = ActiveRecord.create('guid',{
            guid: {
                primaryKey: true,
                type: 'VARCHAR(255)'
            },
            data: ''
        });

        Reserved = ActiveRecord.create('reserved',{
            to: { primaryKey: true },
            from: '',
            select: ''
        });
        
        if(proceed)
            proceed();
    }
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

            // Identifiers that are reserved words should be quoted automatically.
            var reserved_test = Reserved.create({
                from: 'b',
                select: 'c'
            });
            assert(Reserved.count() == 1,'Reserved.create');
            assert(Reserved.find(reserved_test.to).from == 'b','Reserved.find');
            assert(Reserved.findByFrom('b').select == 'c','Reserved.findByFrom');

            // Identifiers must be quoted explicitly in SQL fragments.
            assert(Reserved.find({
              select: ['"to" + "from"', '"select"']
            })[0].select == 'c','Reserved.find({select:...})');

            // Keys of {where: {...}} properties are assumed to be column names...
            assert(Reserved.find({
              where: {select: 'c'}
            })[0].select == 'c','Reserved.find({where:{...}})');
            try {
              // ...so that format won't work for arbitrary SQL fragments...
              Reserved.find({
                where: {'length("select")': 1}
              });
              assert(false,'Reserved.find({where:{\'length...\': 1}) throws an exception')
            } catch (e) {
            }
            // ...but you can use {where: '...'} instead.
            assert(Reserved.find({
              where: 'length("select") = 1'
            })[0].select == 'c','Reserved.find({where:\'length... = 1\'})');

            reserved_test.set('select', 'd');
            assert(reserved_test.select == 'd','reserved_test.set');
            reserved_test.save();
            assert(Reserved.find(reserved_test.to).select == 'd','reserved_test.save');

            Reserved.updateAll({from: 'me'}, {select: 'd'});
            assert(Reserved.find(reserved_test.to).from == 'me','Reserved.updateAll');

            reserved_test.destroy();
            assert(Reserved.count() == 0,'Reserved.destroy');
            
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
            assert(Comment.find({
                all: true,
                where: 'title = "c"'
            })[0].title == 'c','find({where: String})');
            assert(Comment.find({
                first: true,
                where: {
                    title: 'b'
                }
            }).title == 'b','find({first: true, where: Hash})');
            assert(Comment.find({
                first: true,
                where: 'title = "b"'
            }).title == 'b','find({first: true, where: string})');
            b = Comment.find('SELECT * FROM comments WHERE title = ? LIMIT 1','b');
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
            var result = Comment.find({
                group: 'title',
                order: 'id ASC'
            });
            assert(result[0].title == 'a' && result[1].title == 'b','GROUP BY clause via params works');
            var result = Comment.find('SELECT * FROM comments GROUP BY title ORDER BY id ASC');
            assert(result[0].title == 'a' && result[1].title == 'b','GROUP BY clause via SQL works');
            
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

            var b = Guid.create({guid: '123', data: 'test'});
            assert(Guid.primaryKeyName == 'guid', 'model.primaryKeyName');
            assert(b.primaryKeyName == 'guid', 'record.primaryKeyName');
            assert(Guid.findByGuid('123').data == 'test', 'findByGuid');
            assert(Guid.get('123').data == 'test', 'get(guid)');

            Guid.update('123', {data: 'changed'});
            assert(b.reload() && b.data == 'changed', 'Guid.update && b.reload');

            b.set('guid', 'abc');
            assert(b.guid == 'abc', 'guid change');
            b.save();
            assert(!Guid.get('123'), 'old guid is gone');
            assert(Guid.get('abc').data == 'changed', 'new guid is saved');

            assert(Guid.destroy('abc') && Guid.count() == 0, 'Guid.destroy');

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

ActiveTest.Tests.Routes = {};

var logged_actions = [];
var action_logger = function action_logger(){
    logged_actions.push(arguments);
};
var test_scope = {
    Blog: {
        index: action_logger,
        post: action_logger,
        edit: action_logger
    },
    Page: {
        index: action_logger,
        about: action_logger,
        contact: action_logger
    },
    AddressBook: {
        index: action_logger,
        address: action_logger
    },
    Test: {
        test: action_logger,
        index: action_logger
    },
    Article: {
        article: action_logger
    },
    Wiki: {
        wiki: action_logger
    },
    Welcome: {
        index: action_logger
    }
};
var test_valid_route_set = [
    ['article','article/:id',{object:'article',method:'article',requirements: {id:/\d+/}}],
    ['article_comment','article/:id/:comment_id',{
      object:'article',
      method:'article',
      requirements: {
        id: /\d+/,
        comment_id: function(comment_id){
          return comment_id.match(/^\d+$/)
        }
      }
    }],
    ['post','/blog/post/:id',{object:'blog',method: 'post'}],
    ['/blog/:method/:id',{object:'blog'}],
    ['/pages/:method',{object:'page'}],
    ['/address/',{object: 'AddressBook',method:'index'}],
    ['address','/address/:state/:zip',{object: 'AddressBook',method:'address'}],
    ['/my/application/wiki/*',{object: 'Wiki',method:'wiki'}],
    ['root','/',{object:'welcome',method:'index'}],
    ['default','/:object/:method/:id']
];

ActiveTest.Tests.Routes.normalize = function(proceed)
{
    with(ActiveTest)
    {
        assert(ActiveRoutes.normalizePath('a/b/c?a/b/c'),'removes query string');
        assert(ActiveRoutes.normalizePath('a/b/c#a/b/c'),'removes hash');
        assert(ActiveRoutes.normalizePath('a/b/c?a/b/c#a/b/c'),'removes both hash and query string');
        assert(ActiveRoutes.normalizePath('a/b/c#a/b/c?a/b/c'),'removes both hash and query string');
        assert(ActiveRoutes.normalizePath('a/b/c') == 'a/b/c','does not replace single non trailing or leading slashes');
        assert(ActiveRoutes.normalizePath('//x//y/z') == 'x/y/z','deletes leading slash and multiple slash');
        assert(ActiveRoutes.normalizePath('/////one/two//three///four////') == 'one/two/three/four','combined');
    }
    if(proceed())
        proceed();
};

ActiveTest.Tests.Routes.validation = function(proceed)
{
    with(ActiveTest)
    {
        var no_object_no_method = {
            path: 'a/b/c'
        };
        var no_object_method_in_string = {
            path: 'a/:method'
        };
        var no_object_method_in_params = {
            path: 'a',
            params: {
                method: 'b'
            }
        };
        var no_method_object_in_string = {
            path: 'a/:object'
        };
        var no_method_object_in_params = {
            path: 'a',
            params: {
                object: 'b'
            }
        };
        
        //only the following two are valid
        var method_and_object_in_params = {
            path: '/a/b',
            params: {
                object: 'a',
                method: 'b'
            }
        };
        var method_and_object_in_string = {
            path: ':object/:method'
        };
        
        assert(!ActiveRoutes.Validations.hasObject(no_object_no_method),'no_object_no_method: !hasObject()');
        assert(!ActiveRoutes.Validations.hasMethod(no_object_no_method),'no_object_no_method: !hasMethod()');
        assert(!ActiveRoutes.Validations.hasObject(no_object_method_in_string),'no_object_method_in_string: !hasObject()');
        assert(ActiveRoutes.Validations.hasMethod(no_object_method_in_string),'no_object_method_in_string: hasMethod()');
        assert(!ActiveRoutes.Validations.hasObject(no_object_method_in_params),'no_object_method_in_params: !hasObject()');
        assert(ActiveRoutes.Validations.hasMethod(no_object_method_in_params),'no_object_method_in_params: hasMethod()');
        assert(ActiveRoutes.Validations.hasObject(no_method_object_in_string),'no_object_method_in_params: hasObject()');
        assert(!ActiveRoutes.Validations.hasMethod(no_method_object_in_string),'no_object_method_in_params: !hasMethod()');
        assert(ActiveRoutes.Validations.hasObject(no_method_object_in_params),'no_method_object_in_params: hasObject()');
        assert(!ActiveRoutes.Validations.hasMethod(no_method_object_in_params),'no_method_object_in_params: !hasMethod()');
        assert(ActiveRoutes.Validations.hasObject(method_and_object_in_params) && ActiveRoutes.Validations.hasMethod(method_and_object_in_params),'method_and_object_in_params: valid?');
        assert(ActiveRoutes.Validations.hasObject(method_and_object_in_string) && ActiveRoutes.Validations.hasMethod(method_and_object_in_string),'method_and_object_in_string: valid?');
    
        var test_scope = {
            object_one: {
                method_one: function(){},
                method_two: 'a string'
            }
        };
        var r = new ActiveRoutes([],test_scope);
        assert(r.objectExists('object_one'),'Routes.objectExists()');
        assert(!r.objectExists('object_two'),'!Routes.objectExists()');
        
        assert(!r.methodExists('object_two','method_one'),'!Routes.methodExists()');
        assert(!r.methodExists('object_two','method_three'),'!Routes.methodExists()');
        assert(!r.methodExists('object_one','method_three'),'!Routes.methodExists()');
        assert(r.methodExists('object_one','method_one'),'Routes.methodExists()');
        assert(r.methodExists('object_one','method_two'),'Routes.methodExists()');
        assert(r.methodCallable('object_one','method_one'),'Routes.methodCallable()');
    }
    if(proceed())
        proceed();
};

ActiveTest.Tests.Routes.generator = function(proceed)
{
    with(ActiveTest)
    {
        var routes = new ActiveRoutes(test_valid_route_set,test_scope);
        assert('articleUrl' in test_scope,'url_for method generated');
        assert('articleParams' in test_scope,'params_for method generated');
        
        var params = test_scope.articleParams({id: 5});
        assert(params.method == 'article' && params.id == 5,'generated params_for returns correct params');
        assert(routes.urlFor('root') == '/','root route');
        assert(routes.urlFor('article',{id :5}) == '/article/5','named route with params');
        assert(routes.urlFor({object: 'article', method: 'article', id: 5}) == '/article/5','unname route with params');
        assert(test_scope.articleUrl({id: 5}) == '/article/5','generated url method with params');
        assert(!test_scope.articleUrl({id: 'TEST'}),'generated url still processes requirements');
        assert(test_scope.addressUrl({state:'wa',zip:'98102'}) == '/address/wa/98102','generated url with multiple params');
        assert(!routes.routes[5].params.state,'url generation does not contaminate params');
    }
    if(proceed())
        proceed();
};

ActiveTest.Tests.Routes.matching = function(proceed)
{
    with(ActiveTest)
    {
        //test exact matches
        var routes_without_params = new ActiveRoutes([
            ['index','/home',{object: 'page',method: 'index'}],
            ['contact','pages/contact',{object: 'page', method: 'index'}],
            ['/pages/about/',{object: 'page',method: 'about'}]
        ],test_scope);
        
        assert(routes_without_params.match('/home').name == 'index','match() /home');
        assert(routes_without_params.match('home').name == 'index','match() home');
        assert(routes_without_params.match('/home/').name == 'index','match() home/');
        
        assert(routes_without_params.match('/pages/contact/').name == 'contact','match() /pages/contact/');
        assert(routes_without_params.match('/pages/contact').name == 'contact','match() /pages/contact');
        assert(routes_without_params.match('pages/contact/').name == 'contact','match() pages/contact/');
        assert(routes_without_params.match('pages/contact').name == 'contact','match() pages/contact');
        
        assert(routes_without_params.match('/pages/about/').params.method == 'about','match() /pages/about/');
        assert(routes_without_params.match('/pages/about').params.method == 'about','match() /pages/about');
        assert(routes_without_params.match('pages/about/').params.method == 'about','match() pages/about/');
        assert(routes_without_params.match('pages/about').params.method == 'about','match() pages/about');
        
        //test index handling
        var routes_without_params = new ActiveRoutes([
            ['index','pages',{object: 'page',method: 'index'}],
            ['contact','pages/contact',{object: 'page', method: 'index'}]
        ],test_scope);
        
        assert(routes_without_params.match('pages').name == 'index','index match() pages');
        assert(routes_without_params.match('pages/contact').name == 'contact','index match() pages/contact');
        assert(routes_without_params.match('pages/').name == 'index','index match() pages/');
        assert(routes_without_params.match('pages/index').name == 'index','index match() pages/index');
        
        var routes_without_params = new ActiveRoutes([
            ['index','pages/index',{object: 'page',method: 'index'}],
            ['contact','pages/contact',{object: 'page', method: 'index'}]
        ],test_scope);
        
        assert(routes_without_params.match('pages').name == 'index','index match() pages');
        assert(routes_without_params.match('pages/contact').name == 'contact','index match() pages/contact');
        assert(routes_without_params.match('pages/').name == 'index','index match() pages/');
        assert(routes_without_params.match('pages/index').name == 'index','index match() pages/index');
        
        //test complex route set with params
        var routes = new ActiveRoutes(test_valid_route_set,test_scope);
            
        var match;
        match = routes.match('/blog/post/5');
        assert(match.name == 'post' && match.params.id == 5 && match.params.method == 'post','complex match() /blog/post/5');
        
        match = routes.match('/blog/post/5.xml');
        assert(match.name == 'post' && match.extension == 'xml' && match.params.id == 5 && match.params.method == 'post','match() with extension /blog/post/5.xml');
        
        match = routes.match('/blog/edit/5');
        assert(match.params.id == 5 && match.params.method == 'edit','complex match() /blog/edit/5');
        
        match = routes.match('/blog/edit');
        assert(!match.params.id && match.params.method == 'edit','complex match() /blog/edit');
        
        match = routes.match('/blog/edit/');
        assert(!match.params.id && match.params.method == 'edit','complex match() /blog/edit/');
        
        match = routes.match('/pages/');
        assert(match.params.method == 'index','complex match() /pages/');
        
        match = routes.match('/pages/index');
        assert(match.params.method == 'index','complex match() /pages/index');
        
        match = routes.match('/pages/contact');
        assert(match.params.method == 'contact','complex match() /pages/contact');
        
        match = routes.match('/pages/about');
        assert(match.params.method == 'about','complex match() /pages/about');
        
        match = routes.match('/pages/about/');
        assert(match.params.method == 'about','complex match() /pages/about/');
        
        match = routes.match('/address/');
        assert(match.params.method == 'index','complex match() /address/');
        
        match = routes.match('/address');
        assert(match.params.method == 'index','complex match() /address');
        
        match = routes.match('/address/wa');
        assert(!match,'complex match() /address/wa');
        
        match = routes.match('/address/wa/98103');
        assert(match.params.method == 'address' && match.params.state == 'wa' && match.params.zip == '98103','complex match() /address/wa/98103');
        
        match = routes.match('/test');
        assert(match.params.method == 'index','complex match() /test');
        
        match = routes.match('/test/');
        assert(match.params.method == 'index','complex match() /test/');
        
        match = routes.match('/test/test');
        assert(match.params.method == 'test','complex match() /test/test');
        
        match = routes.match('/test/test/');
        assert(match.params.method == 'test','complex match() /test/test/');
        
        match = routes.match('/test/test/id');
        assert(match.params.method == 'test' && match.params.id == 'id','complex match() /test/test/id');
        
        match = routes.match('/test/test/id/');
        assert(match.params.method == 'test' && match.params.id == 'id','complex match() /test/test/id/');
        
        //test requirements
        match = routes.match('article/test');
        assert(!match,'requirements article/test');
        match = routes.match('article/53');
        assert(match.params.method == 'article' && match.params.id == '53' && !match.params.requirements,'requirements article/53');
        
        //with callback
        match = routes.match('article/53/54');
        assert(match.params.method == 'article' && match.params.id == '53' && match.params.comment_id == '54' && !match.params.requirements,'requirements article/53/54');
        
        //test catch all
        match = routes.match('my/application/wiki');
        assert(match.params.method == 'wiki' && match.params.path.length == 0,'catch all my/application/wiki');
        
        match = routes.match('my/application/wiki/');
        assert(match.params.method == 'wiki' && match.params.path.length == 0,'catch all my/application/wiki/');
        
        match = routes.match('my/application/wiki/a');
        assert(match.params.method == 'wiki' && match.params.path.length == 1 && match.params.path[0] == 'a','catch all my/application/wiki/a');
        
        match = routes.match('my/application/wiki/a/b/');
        assert(match.params.method == 'wiki' && match.params.path.length == 2 && match.params.path[1] == 'b','catch all my/application/wiki/a/b/');
        
        match = routes.match('my/application/wiki/a/b/c');
        assert(match.params.method == 'wiki' && match.params.path.length == 3 && match.params.path[2] == 'c','catch all my/application/wiki/a/b/c');
        
        match = routes.match('my/application/wiki/a/b/c/d/');
        assert(match.params.method == 'wiki' && match.params.path.length == 4 && match.params.path[3] == 'd','catch all my/application/wiki/a/b/c/d/');
                
        //test root
        match = routes.match('');
        assert(match.params.method == 'index' && match.params.object == 'Welcome','test root ""');
        match = routes.match('/');
        assert(match.params.method == 'index' && match.params.object == 'Welcome','test root "/"');
        
        //test class suffix
        routes.scope.BlogController = {
            post: function post(){}
        };
        var old_suffix = routes.options.classSuffix;
        routes.options.classSuffix = 'Controller';
        match = routes.match('/blog/post/5');
        routes.options.classSuffix = old_suffix;
        assert(match.name == 'post' && match.params.id == 5 && match.params.method == 'post' && match.params.object == 'BlogController','test of classSuffix');
    }
    if(proceed())
        proceed();
};

ActiveTest.Tests.Routes.dispatch = function(proceed)
{
    with(ActiveTest)
    {
        var last_action;
        var routes = new ActiveRoutes(test_valid_route_set,test_scope);
        assert(routes.history.length == 0,'history starts empty');
        
        routes.dispatch('/address/wa/98103');
        assert(routes.history.length == 1,'history incremented');
        assert(routes.history[routes.history.length - 1].params.zip == '98103' == 1,'history contains params');
        last_action = logged_actions.pop()[0];
        assert(last_action.zip == '98103' && last_action.method == 'address','dispatcher called action from string');
        
        routes.dispatch(test_scope.addressParams({zip:'83340',state:'id'}))
        last_action = logged_actions.pop()[0];
        assert(last_action.zip == '83340' && last_action.method == 'address','dispatcher called action from params');
        
        test_scope.callAddress({zip:'83340',state:'id'});
        last_action = logged_actions.pop()[0];
        assert(last_action.zip == '83340' && last_action.method == 'address','dispatcher called action from generated call method');
    }
    if(proceed())
        proceed();
};

ActiveTest.Tests.Routes.history = function(proceed)
{
    with(ActiveTest)
    {
        var last_action;
        
        var routes = new ActiveRoutes(test_valid_route_set,test_scope);
        assert(routes.history.length == 0,'history starts empty');
        
        routes.dispatch('/address/wa/98103');
        routes.dispatch('/address/wa/98104');
        routes.dispatch('/address/wa/98105');
        
        assert(routes.history.length == 3,'history incremented');
        assert(routes.index == 2,'index incremented');
        
        var back_response = routes.back();
        assert(routes.history.length == 3,'history not incremented by back()');
        assert(routes.index == 1,'index decrimented by back()');
        last_action = logged_actions.pop()[0];
        assert(back_response && last_action.zip == '98104','back() calls correct action');
        
        routes.back();
        var back_response = routes.back();
        assert(!back_response && routes.index == 0,'back cannot traverse below 0');
        
        routes.next();
        routes.next();
        assert(routes.history.length == 3,'history not incremented by next()');
        assert(routes.index == 2,'index incremented by next()');
        last_action = logged_actions.pop()[0];
        assert(last_action.zip == '98105','next() calls correct action');
        
        var next_response = routes.next();
        assert(!next_response && routes.index == 2,'next() cannot traverse beyond history length');
    }
    if(proceed())
        proceed();
};

ActiveTest.Tests.ActiveSupport = {};
ActiveTest.Tests.ActiveSupport.ActiveSupport = function(proceed)
{
    with (ActiveTest)
    {
        // Inflector
        assert(ActiveSupport.Inflector.pluralize('cat') == 'cats', 'pluralize(cat)');
        assert(ActiveSupport.Inflector.pluralize('cats') == 'cats', 'pluralize(cats)');

        assert(ActiveSupport.Inflector.singularize('cat') == 'cat', 'singularize(cat)');
        assert(ActiveSupport.Inflector.singularize('cats') == 'cat', 'singularize(cats)');

        assert(ActiveSupport.Inflector.pluralize('person') == 'people', 'pluralize(person)');
        assert(ActiveSupport.Inflector.pluralize('people') == 'people', 'pluralize(people)');

        assert(ActiveSupport.Inflector.singularize('people') == 'person', 'singularize(people)');
        assert(ActiveSupport.Inflector.singularize('person') == 'person', 'singularize(person)');

        if(proceed)
            proceed();
    }
};

ActiveTest.Tests.View = {};

ActiveTest.Tests.View.builder = function(proceed)
{
    with(ActiveTest)
    {
        var ArgumentsTestView = ActiveView.create(function(){
           with(ActiveView.Builder){
               return ul(
                   li('one','two',b('three'),'four',b('five')),
                   li({className: 'test'}),
                   {className: 'blarg'}
               );
           } 
        });
        
        var DeepView = ActiveView.create(function(){
            with(ActiveView.Builder){
                return div(
                    table(
                        tbody(
                            tr(
                                td(
                                    ul(
                                        li(span(b('test'))),
                                        li()
                                    )
                                ),
                                td(
                                    p(span('test'))
                                )
                            ),
                            tr(
                                td(
                                    
                                ),
                                td(
                                    
                                )
                            )
                        )
                    )
                );
            }
        });
        var deep_instance = new DeepView();
        var arguments_instance = new ArgumentsTestView();
        assert(arguments_instance.container.firstChild.firstChild.nodeValue == 'one' && arguments_instance.container.firstChild.childNodes[2].tagName == 'B','mix and match of text and elements');
        assert(deep_instance.container.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.nodeValue == 'test','deep builder node test');
        
        if(proceed)
            proceed()
    }
};

ActiveTest.Tests.View.template = function(proceed)
{
    with(ActiveTest)
    {
        var simple_template = new ActiveView.Template('<b><%= test %></b>');
        var output_a = simple_template.render({
            test: 'a'
        });
        assert(output_a == '<b>a</b>','Simple render with variable replacement.');
        var output_b = simple_template.render({
            test: 'b'
        });
        assert(output_b == '<b>b</b>','Render output is not cached.');
        var loop_template = new ActiveView.Template('<% for(var i = 0; i < list.length; ++i){ %><%= list[i] %><% } %>');
        var loop_output = loop_template.render({list:['a','b','c']});
        assert(loop_output == 'abc','Loop functions correctly.');
    }
    if(proceed)
        proceed()
};

ActiveTest.Tests.Controller = {};

ActiveTest.Tests.Controller.scoping = function(proceed)
{
    with(ActiveTest)
    {
        TestController = ActiveController.create({
            index: function index(){
                this.set('a',1);
                this.render({
                    view: TestView
                });
                assert(this.get('a') == 3,'view set() persisted to controller');
                this.set('a',4);
                assert(changes_call_count == 3,'controller triggers view binding change()');
            }
        });
        
        var changes_call_count = 0;
        
        TestView = ActiveView.create(function(){
            assert(this.get('a') == 1,'controller set() persisted to view');
            this.set('a',2);
            this.binding.when('a').changes(function(value){
                ++changes_call_count;
            });
            this.set('a',3);
            return this.builder.div();
        });
        
        TestViewFragment = ActiveView.create(function(){
            return div();
        });
        
        var controller = new TestController();
        controller.index();
        
        if(proceed)
            proceed()
    }
};
