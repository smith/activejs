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
 * @namespace {ActiveView}
 * @example
 * 
 * ActiveView
 * ==========
 * ActiveView allows for the creation of complex, stateful views. ActiveView
 * requires a paradigm shift in view programming away from ERB/PHP/ASP, but
 * will result in significantly more compartmentalized and reusable code.
 * The basic flow of a view goes like this: 
 * 
 * - Create DOM nodes with the Builder library.
 * - Bind data to those nodes or sub views with the Binding library.
 * - Observe DOM events with the Ajax library of your choice.
 * 
 * Use ActiveView.create() to create a new class. The first parameter to
 * the class creator is a function in which all of your view logic is,
 * declared, followed by an option second paramter of instance methods the
 * view will have.
 * 
 *     var MyView = ActiveView.create(function(){
 *         //DOM creation code (Builder)
 *         //data binding code (Binding)
 *         //Ajax / DOM event observation code (Prototype, jQuery, etc)
 *     },{instance_methods});
 * 
 * The only requirement of the main function is that it return a DOM node.
 * MyView is now a constructor which can be called with a scope / hash.
 * Data that is passed into the view can be retrieved with get() and set().
 * Once initialized, the DOM node returned by the main function will be
 * available in the "container" property. The convenience method "attachTo"
 * will attach the container to a given Element.
 * 
 *     var MyView = ActiveView.create(function(){
 *         return this.builder.h2(this.get('title'));
 *     },{instance_methods});
 *     var instance = new MyView({title: 'The Title'});
 *     document.body.appendChild(instance.container);
 *     //or
 *     instance.attachTo(document.body);
 * 
 * The scope property (accessed with get() / set()) is an ObservableHash,
 * so you can observe changes in the view data like so:
 * 
 *     instance.scope.observe('set',function(key,value){});
 * 
 * Builder
 * -------
 * The builder object in each template contains a collection of methods for
 * each standard HTML tag name, b(), span(), h1(), etc. All of these methods
 * are also available statically as ActiveView.Builder.tagName anywhere in
 * your application.
 * 
 * Each method returns a DOM node type corresponding to it's name.
 * 
 *     var MyView = ActiveView.create(function(){
 *         return this.builder.div();
 *     });
 * 
 * Each method can accept a variable number of arguments including other DOM
 * nodes or an array of DOM nodes.
 * 
 *     var MyView = ActiveView.create(function(){
 *         var container = this.builder.div(
 *             this.builder.span('Some text.')
 *         );
 *         return container;
 *     });
 *     
 * You can use the "with" construct to eliminate the need to call tyhis.builder.
 * The "with" construct has some side effects (var label = div() would overwrite
 * the label() method globally for instance) that may be difficult to debug, but
 * when used carefully it can make for more readable code.
 *     
 *     var MyView = ActiveView.create(function(){
 *         with(this.builder){
 *             var container = div(span('Some text.'));
 *         }
 *         return container;
 *     });
 *     
 * Builder methods can also accept a hash of attributes, text nodes, or functions
 * that return text or DOM nodes, in any order. If a Builder method requires no
 * parameters (hr, br, etc) you can declare it without parenthesis.
 * 
 * Note that you can assign DOM nodes to local variables or properties of "this"
 * inline (a language feature, not a  library feature). This technique comes in
 * handy when you want to attach behaviors to your elements without having to
 * query for them.
 *     
 *     var MyView = ActiveView.create(function(){
 *         with(this.builder){
 *             this.myDiv = div(
 *                 ul(
 *                     li({className: 'first'},'List Item One'),
 *                     li('List Item Two'),
 *                     li(
 *                         b(span('List item Three')),
 *                         'Extra Text',
 *                         {className:'third'}
 *                     ),
 *                     li(function(){
 *                         return 'List Item Four';
 *                     })
 *                 ),
 *                 br,
 *                 this.secondList = ul([
 *                     li('List Item One'),
 *                     li('List Item Two')
 *                 ])
 *             );
 *         }
 *         return this.myDiv;
 *     });
 * 
 * Lastly, you can embed other views inside any builder node. You can either
 * initialize a view, or just pass the class. If only the class is passed,
 * the instance of the class that is created will inherit the scope of the
 * current view.
 * 
 *     var MyView = ActiveView.create(function(){
 *         with(this.builder){
 *             var container = div({className: 'result_set_container'},
 *                 PaginationView,
 *                 hr,
 *                 new ResultSetView({
 *                     result_set: my_result_set
 *                 })
 *             );
 *         }
 *     });
 * 
 * Enabling Prototype / jQuery Element Extensions
 * ----------------------------------------------
 * By default the DOM nodes generated by Builder will be standard unextended
 * Element objects regardless of the Ajax framework you are using. It is
 * however quite useful to have those nodes automatically be compatible
 * with your framework of choice (although you will take a performance hit).
 * 
 * To enable this feature add this code anywhere in your application:
 * 
 *     //for Prototype
 *     ActiveView.Builder.extendCreatedElement = function extendCreatedElement(element){
 *         return Element.extend(element);
 *     };
 * 
 *     //for jQuery
 *     ActiveView.Builder.extendCreatedElement = function extendCreatedElement(element){
 *         return jQuery(element)[0];
 *     };
 *     
 *     //alternates for above, and most other frameworks
 *     ActiveView.Builder.extendCreatedElement = function extendCreatedElement(element){
 *         return $(element);
 *     };
 *     
 * Once enabled this allows you to do your typical Ajax framework programming right
 * in your view. Notice that because you already have access to those objects as
 * DOM elements that you do not need to query for them or worry if or when they
 * become attached to the document.
 * 
 *     with(this.builder){
 *         var container = div(
 *             this.linkOne = a({href: '#'},'Link One'),
 *             this.linkTwo = a({href: '#'},'Link Two')
 *         );
 *     }
 *     this.linkOne.observe('click',function(){});
 *     this.linkTwo.hide();
 * 
 * Data Binding
 * ------------
 * Each view instance has a data scope associated with it which can be accessed
 * with the get() and set() methods. In a stateless (server) enviornment data
 * bindings are not needed, one can simply insert data directly into the DOM.
 * 
 *     var MyView = ActiveView.create(function(){
 *         return this.builder.h2(this.get('title'));
 *     });
 * 
 * However in a stateful (client side) enviornment it is often useful to
 * automatically update the DOM as data in the view changes. Apple has a
 * [useful article about Cocoa data bindings](http://developer.apple.com/documentation/Cocoa/Conceptual/CocoaBindings/Concepts/WhatAreBindings.html)
 * that explains the concept very well. ActiveView data bindings are
 * vastly simpler and offer fewer features, but provide the same general
 * functionality.
 * 
 * There are three core "sentance" structures that are used
 * to create your bindings:
 * 
 * - update(element).from(key)
 * - when(key).changes(callback)
 * - collect(active_view_class).from(key).into(element)
 * 
 * These are accessed from the "binding" property of any view.
 * 
 * The first construct, update(element).from(key) will set the innerHTML
 * property of the specified element to the value of the specificed key
 * whenever the value of the key changes.
 * 
 * The second construct is a generic way of observing when a key changes.
 * When "key" changes, the callback function will be called with the
 * new value.
 * 
 *     var MyView = ActiveView.create(function(){
 *         var container = this.builder.h2();
 *         with(this.binding){
 *             update(container).from('title');
 *             when('title').changes(function(title){
 *                 console.log('title was changed to:',title);
 *             });
 *         }
 *         return container;
 *     });
 *     var instance = new MyView({title: 'The Title'});
 *     //instance.container == <h2>The Title</h2>
 *     instance.set('title','New Title');
 *     //instance.container == <h2>New Title</h2>
 *     
 * The third construct is the data binding equivelent of a loop. It
 * will iterate over a given array, render a new view with each item
 * in that array, collecting the resulting DOM nodes and inserting it
 * into the given container. If the array is modified with pop(),
 * push(), shift(), unshift() or splice() the resulting DOM nodes will
 * be inserted, updated or removed.
 * 
 *     var ListView = ActiveView.create(function(){
 *         var container = this.builder.ul();
 *         with(this.binding){
 *             collect(ListItemView).from('items').into(container);
 *         }
 *         return container;
 *     });
 *     var ListItemView = ActiveView.create(function(){
 *         var container = this.builder.li();
 *         with(this.binding){
 *             update(container).from('body');
 *         }
 *         return container;
 *     });
 *     var items = [
 *         {body: 'one'},
 *         {body: 'two'},
 *         {body: 'three'}
 *     ];
 *     var instance = new ListView(items);
 *     //instance.container == <ul><li>one</li><li>two</li><li>three</li></ul>
 *     items.pop();
 *     //instance.container == <ul><li>one</li><li>two</li></ul>
 * 
 * ActiveRecord Data Binding Integration
 * -------------------------------------
 * Data bindings can be programmed and triggered directly as described above
 * but significant integration is built right into ActiveRecord. Each
 * ActiveRecord instance has a synchronize() method that will trigger the
 * individual key data bindings (when() and update())
 *     
 *     var Article = ActiveRecord.create({
 *         title: '',
 *         body: ''
 *     });
 *     
 *     var article_one = Article.create({
 *         title: 'First Title',
 *         body: 'First Body'
 *     });
 *     article_one.synchronize();
 *     
 *     var ArticleView = ActiveView.create(function(){
 *         with(this.builder){
 *             var container = div(
 *                 this.titleContainer = h2(),
 *                 this.bodyContainer = p()
 *             );
 *         }
 *         with(this.binding){
 *             update(this.titleContainer).from('title');
 *             update(this.bodyContainer).from('body');
 *         }
 *         return container;
 *     });
 *     
 *     var article_one_view = new ArticleView(article_one);
 *     //article_one_view.container == <div><h2>First Title</h2><p>First Body</p></div>
 *     
 *     article_one.set('title','New Title');
 *     article_one.save();
 *     //article_one_view.container == <div><h2>New Title</h2><p>First Body</p></div>
 * 
 * ActiveRecord.ResultSet objects are designed to integrate with the collect()
 * data binding construct. If a result set should change as a result of records
 * matching it's conditions being included or excluded, it will update the DOM
 * accordingly.
 * 
 *     var ArticleListView = ActiveView.create(function(){
 *         var container = this.builder.div();
 *         this.binding.collect(ArticleView).from('list').into(container);
 *         return container;
 *     });
 *     var articles = Article.find({
 *         all: true,
 *         synchronize: true
 *     });
 *     var article_list_instance = new ArticleListView({
 *         list: articles
 *     });
 *     //article_list_instance.container == <div><h2>New Title...
 *     
 *     Article.create({
 *         title: 'Second Title',
 *         body: 'Second Body'
 *     });
 *     //articles.length == 2
 *     //article_list_instance.container == <div><h2>New Title...<h2>Second Title...
 * 
 * Because the query matched all records, and the newly created article would fall
 * within that result set, the result set was automatically updated (a result of
 * the synchronize parameter) and the DOM was automatically udpated to match this
 * (a result of our collect() data binding call).
 * 
 */
ActiveView = {};

/**
 * Defaults to false.
 * @alias ActiveView.logging
 * @property {Boolean}
 */
ActiveView.logging = false;

/**
 * Creates a new ActiveView class. The structure function must return a DOM node.
 * @alias ActiveView.create
 * @param {Function} structure
 * @param {Object} [instance_methods]
 * @return {ActiveView}
 */
ActiveView.create = function create(structure,methods)
{
    if(typeof(options) === 'function')
    {
        options = {
            structure: options
        };
    }
    var klass = function klass(){
        this.initialize.apply(this,arguments);
    };
    ActiveSupport.extend(klass,ClassMethods);
    ActiveSupport.extend(klass.prototype,methods || {});
    ActiveSupport.extend(klass.prototype,InstanceMethods);
    klass.prototype.structure = structure || ActiveView.defaultStructure;
    ActiveEvent.extend(klass);
    return klass;
};

ActiveView.defaultStructure = function defaultStructure()
{
    return ActiveView.Builder.div();
};

ActiveView.makeArrayObservable = function makeArrayObservable(array)
{
    ActiveEvent.extend(array);
    array.makeObservable('shift');
    array.makeObservable('unshift');
    array.makeObservable('pop');
    array.makeObservable('push');
    array.makeObservable('splice');
};

/**
 * This method is not usually called directly but is utilized by data
 * bindings and ActiveControllers.
 * 
 * This method is normalizes or renders a variety of inputs. Strings or
 * Element objects are returned untouched, ActiveView instances will have
 * their DOM container returned, ActiveView classes will be rendered and
 * the DOM container returned. If a function is passed in it will be called
 * with the passed scope. That function should return a string or Element.
 * 
 * @alias ActiveView.render
 * @param {mixed} content
 * @param {Object} [scope]
 * @return {mixed}
 */
ActiveView.render = function render(content,scope)
{
    if(!scope)
    {
        scope = {};
    }
    
    //if content is a function, that function can return nodes or an ActiveView class or instance
    if(typeof(content) === 'function' && !ActiveView.isActiveViewClass(content))
    {
        content = content(scope);
    }
    
    if(content && (typeof(content) == 'string' || content.nodeType == 1))
    {
        return content;
    }
    else if(ActiveView.isActiveViewInstance(content))
    {
        return content.container;
    }
    else if(ActiveView.isActiveViewClass(content))
    {
        return new content(scope).container;
    }
    return ActiveSupport.throwError(Errors.InvalidContent);
};

ActiveView.isActiveViewInstance = function isActiveViewInstance(object)
{
    return object && object.container && object.container.nodeType == 1 && object.scope && object.builder;
};

ActiveView.isActiveViewClass = function isActiveViewClass(object)
{
    return object && object.prototype && object.prototype.structure && object.prototype.setupScope && object.prototype.registerEventHandler;
};

var InstanceMethods = {
    initialize: function initialize(scope,parent)
    {
        this.parent = parent;
        this.setupScope(scope);
        if(ActiveView.logging)
        {
            ActiveSupport.log('ActiveView: initialized with scope:',scope);
        }
        this.builder = {};
        Builder.generator(this.builder,this.scope);
        ActiveView.generateBinding(this);
        this.container = this.structure();
        if(!this.container || !this.container.nodeType || this.container.nodeType !== 1)
        {
            return ActiveSupport.throwError(Errors.ViewDoesNotReturnContainer,typeof(this.container),this.container);
        }
        for(var key in this.scope._object)
        {
            this.scope.set(key,this.scope._object[key]);
        }
    },
    setupScope: function setupScope(scope)
    {
        this.scope = (scope ? (scope.toObject ? scope : new ActiveEvent.ObservableHash(scope)) : new ActiveEvent.ObservableHash({}));
        for(var key in this.scope._object)
        {
            var item = this.scope._object[key];
            if((item !== null && typeof item === "object" && 'splice' in item && 'join' in item) && !item.observe)
            {
                ActiveView.makeArrayObservable(item);
            }
        }
    },
    /**
     * @alias ActiveView.prototype.get
     * @param {String} key
     * @return {mixed}
     */
    get: function get(key)
    {
        return this.scope.get(key);
    },
    /**
     * @alias ActiveView.prototype.set
     * @param {String} key
     * @param {mixed} value
     * @return {mixed}
     */
    set: function set(key,value)
    {
        if((value !== null && typeof value === "object" && 'splice' in value && 'join' in value) && !value.observe)
        {
            ActiveView.makeArrayObservable(value);
        }
        return this.scope.set(key,value);
    },
    /**
     * @alias ActiveView.prototype.attachTo
     * @param {Element} element
     * @return {Element}
     */
    attachTo: function attachTo(element)
    {
        element.appendChild(this.container);
        return this.container;
    },
    registerEventHandler: function registerEventHandler(element,event_name,observer)
    {
        this.eventHandlers.push([element,event_name,observer]);
    }
};

var ClassMethods = {

};

var Errors = {
    ViewDoesNotReturnContainer: ActiveSupport.createError('The view constructor must return a DOM element. Returned: '),
    InvalidContent: ActiveSupport.createError('The content to render was not a string, DOM element or ActiveView.'),
    MismatchedArguments: ActiveSupport.createError('Incorrect argument type passed: ')
};