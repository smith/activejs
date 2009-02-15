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
            //FIXME: Identity insert on in SQL server
            //var called = false;
            //Comment.observeOnce('afterCreate',function(){
                //called = true;
            //});
            //var d = Comment.create({
                //id: 50,
                //title: 'd',
                //body: 'dd'
            //});
            //d.reload();
            //assert(d.id == 50 && called,'create with an id preserves id and still acts as "created"');
            
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
