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
