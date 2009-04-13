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
 * @namespace {ActiveSupport} Provides a number of methods from the
 *  Prototype.js framework, without modifying any built in prototypes to
 *  ensure compatibility and portability.
 */
var ActiveSupport = null;

if(typeof exports != "undefined"){
    exports.ActiveSupport = ActiveSupport;
}

(function(global_context){
ActiveSupport = {
    /**
     * Returns the global context object (window in most implementations).
     * @alias ActiveSupport.getGlobalContext
     * @return {Object}
     */
    getGlobalContext: function getGlobalContext()
    {
        return global_context;
    },
    /**
     * Returns a class if it exists. If the context (default window / global
     * context) does not contain the class, but does have a __noSuchMethod__
     * property, it will attempt to call context[class_name]() to trigger
     * the __noSuchMethod__ handler.
     * @alias ActiveSupport.getClass
     * @param {String} class_name
     * @param {Object} context
     * @return {Mixed}
     */
    getClass: function getClass(class_name,context)
    {
        context = context || ActiveSupport.getGlobalContext();
        var klass = context[class_name];
        if(!klass)
        {
            var trigger_no_such_method = (typeof(context.__noSuchMethod__) !== 'undefined');
            if(trigger_no_such_method)
            {
                try
                {
                    context[class_name]();
                    klass = context[class_name];
                }
                catch(e)
                {
                    return false;
                }
            }
        }
        return klass;
    },
    /**
     * Logs a message to the available logging resource. Accepts a variable
     * number of arguments.
     * @alias ActiveSupport.log
     */
    log: function log()
    {
        if(typeof(Jaxer) !== 'undefined')
        {
            if (typeof Jaxer.console !== 'undefined') {
                console.log.apply(console, arguments || []);
            }
            Jaxer.Log.info.apply(Jaxer.Log,arguments || []);
        }
        if(typeof(air) !== 'undefined')
        {
            air.Introspector.Console.log.apply(air.Introspector.Console,arguments || []);
        }
        if(typeof(console) !== 'undefined')
        {
            console.log.apply(console,arguments || []);
        }
    },
    /**
     * Creates an Error object (but does not throw it).
     * @alias ActiveSupport.createError
     * @param {String} message
     * @return {null}
     */
    createError: function createError(message)
    {
        return new Error(message);
    },
    /**
     * @alias ActiveSupport.logErrors
     * @property {Boolean}
     */
    logErrors: true,
    /**
     * @alias ActiveSupport.throwErrors
     * @property {Boolean}
     */
    throwErrors: true,
    /**
     * Accepts a variable number of arguments, that may be logged and thrown in
     * @alias ActiveSupport.throwError
     * @param {Error} error
     * @return {null}
     */
    throwError: function throwError(error)
    {
        if(typeof(error) == 'string')
        {
            error = new Error(error);
        }
        var error_arguments = ActiveSupport.arrayFrom(arguments).slice(1);
        if(ActiveSupport.logErrors)
        {
            ActiveSupport.log.apply(ActiveSupport,['Throwing error:',error].concat(error_arguments));
        }
        if(ActiveSupport.throwErrors)
        {
            var e = ActiveSupport.clone(error);
            e.message = e.message + error_arguments.join(',');
            throw e;
        }
    },
    /**
     * Returns an array from an array or array like object.
     * @alias ActiveSupport.arrayFrom
     * @param {Object} object
     *      Any iterable object (Array, NodeList, arguments)
     * @return {Array}
     */
    arrayFrom: function arrayFrom(object)
    {
        if(!object)
        {
            return [];
        }
        var length = object.length || 0;
        var results = new Array(length);
        while (length--)
        {
            results[length] = object[length];
        }
        return results;
    },
    /**
     * @alias ActiveSupport.isArray
     * @param {mixed} object
     * @return {Boolean}
     */
    isArray: function isArray(object)
    {
        return object && typeof(object) == 'object' && 'length' in object && 'splice' in object && 'join' in object;
    },
    /**
     * Emulates Array.indexOf for implementations that do not support it.
     * @alias ActiveSupport.indexOf
     * @param {Array} array
     * @param {mixed} item
     * @return {Number}
     */
    indexOf: function indexOf(array,item,i)
    {
        i = i || (0);
        var length = array.length;
        if(i < 0)
        {
            i = length + i;
        }
        for(; i < length; i++)
        {
            if(array[i] === item)
            {
                return i;
            }
        }
        return -1;
    },
    /**
     * Returns an array without the given item.
     * @alias ActiveSupport.without
     * @param {Array} arr
     * @param {mixed} item to remove
     * @return {Array}
     */
    without: function without(arr){
        var values = ActiveSupport.arrayFrom(arguments).slice(1);
        var response = [];
        for(var i = 0 ; i < arr.length; i++)
        {
            if(!(ActiveSupport.indexOf(values,arr[i]) > -1))
            {
                response.push(arr[i]);
            }
        }
        return response;
    },
    /**
     * Emulates Prototype's Function.prototype.bind. Unlike Prototype's
     * version you must explicitly use curry() to pass extra arguments
     * to the bound function.
     * @alias ActiveSupport.bind
     * @param {Function} func
     * @param {Object} object
     *      object will be in scope as "this" when func is called.
     * @return {Function}
     */
    bind: function bind(func,object)
    {
        if(typeof(object) == 'undefined')
        {
            return func;
        }
        return function bound()
        {
            return func.apply(object,arguments);
        };
    },
    /**
     * Emulates Prototype's Function.prototype.curry.
     * @alias ActiveSupport.curry
     * @param {Function} func
     * @return {Function}
     */
    curry: function curry(func)
    {
        if(arguments.length == 1)
        {
            return func;
        }
        var args = ActiveSupport.arrayFrom(arguments).slice(1);
        return function curried()
        {
            return func.apply(this,args.concat(ActiveSupport.arrayFrom(arguments)));
        };
    },
    /**
     * Returns a function wrapped around the original function.
     * @alias ActiveSupport.wrap
     * @param {Function} func
     * @param {Function} wrapper
     * @return {Function} wrapped
     * @example
     *
     *     String.prototype.capitalize = String.prototype.capitalize.wrap( 
     *     function(proceed, eachWord) { 
     *         if (eachWord && this.include(" ")) {
     *             // capitalize each word in the string
     *             return this.split(" ").invoke("capitalize").join(" ");
     *         } else {
     *             // proceed using the original function
     *             return proceed(); 
     *         }
     *     });
     */
    wrap: function wrap(func,wrapper)
    {
        return function wrapped()
        {
            wrapper.apply(this,[ActiveSupport.bind(func,this)].concat(ActiveSupport.arrayFrom(arguments)));
        };
    },
    /**
     * Returns an array of keys from an object.
     * @alias ActiveSupport.keys
     * @param {Object} object
     * @return {Array}
     */
    keys: function keys(object)
    {
        var keys_array = [];
        for (var property_name in object)
        {
            keys_array.push(property_name);
        }
        return keys_array;
    },
    /**
     * Emulates Prototype's String.prototype.underscore
     * @alias ActiveSupport.underscore
     * @param {String} str
     * @return {String}
     */
    underscore: function underscore(str)
    {
        return str.replace(/::/g, '/').replace(/([A-Z]+)([A-Z][a-z])/g, function(match){
            match = match.split("");
            return match[0] + '_' + match[1];
        }).replace(/([a-z\d])([A-Z])/g, function(match){
            match = match.split("");
            return match[0] + '_' + match[1];
        }).replace(/-/g, '_').toLowerCase();
    },
    /**
     * Emulates Prototype's String.prototype.camelize
     * @alias ActiveSupport.camelize
     * @param {String} str
     * @param {Boolean} [capitalize]
     * @return {String}
     */
    camelize: function camelize(str, capitalize){
        var camelized,
            parts = str.replace(/\_/g,'-').split('-'), len = parts.length;
        if (len === 1)
        {
            if(capitalize)
            {
                return parts[0].charAt(0).toUpperCase() + parts[0].substring(1);
            }
            else
            {
                return parts[0];
            }
        }
        if(str.charAt(0) === '-')
        {
            camelized = parts[0].charAt(0).toUpperCase() + parts[0].substring(1);
        }
        else
        {
            camelized = parts[0];
        }
        for (var i = 1; i < len; i++)
        {
            camelized += parts[i].charAt(0).toUpperCase() + parts[i].substring(1);
        }
        if(capitalize)
        {
            return camelized.charAt(0).toUpperCase() + camelized.substring(1);
        }
        else
        {
            return camelized;
        }
    },
    /**
     * Emulates Prototype's Object.extend
     * @alias ActiveSupport.extend
     * @param {Object} destination
     * @param {Object} source
     * @return {Object}
     */
    extend: function extend(destination, source)
    {
        for (var property in source)
        {
            destination[property] = source[property];
        }
        return destination;
    },
    /**
     * Emulates Prototype's Object.clone
     * @alias ActiveSupport.clone
     * @param {Object} object
     * @return {Object}
     */
    clone: function clone(object)
    {
        return ActiveSupport.extend({}, object);
    },
    
    /**
     * If the value passed is a function the value passed will be returned,
     * otherwise a function returning the value passed will be returned.
     * @alias ActiveSupport.proc
     * @param {mixed} proc
     * @return {Function}
     */
    proc: function proc(proc)
    {
        return typeof(proc) === 'function' ? proc : function(){return proc;};
    },
    
    /**
     * If the value passed is a function, the function is called and the value
     * returned, otherwise the value passed in is returned.
     * @alias ActiveSupport.value
     * @param {mixed} value
     * @return {scalar}
     */
    value: function value(value)
    {
        return typeof(value) === 'function' ? value() : value;
    },
    /**
     * @alias ActiveSupport.synchronize
     */
    synchronize: function synchronize(execute,finish)
    {
        var scope = {};
        var stack = [];
        stack.waiting = {};
        stack.add = function add(callback){
            var wrapped = ActiveSupport.wrap(callback || function(){},function synchronizationWrapper(proceed){
                var i = null;
                var index = ActiveSupport.indexOf(stack,wrapped);
                stack.waiting[index] = [proceed,ActiveSupport.arrayFrom(arguments)];
                var all_present = true;
                for(i = 0; i < stack.length; ++i)
                {
                    if(!stack.waiting[i])
                    {
                        all_present = false;
                    }
                }
                if(all_present)
                {
                    for(i = 0; i < stack.length; ++i)
                    {
                        var item = stack.waiting[i];
                        item[0].apply(item[0],item[1]);
                        delete stack.waiting[i];
                    }
                }
                if(all_present && i === stack.length)
                {
                    if(finish)
                    {
                        finish(scope);
                    }
                }
            });
            stack.push(wrapped);
            return wrapped;
        };
        execute(stack,scope);
        if(stack.length === 0 && finish)
        {
            finish(scope);
        }
    },
    
    /**
     * @namespace {ActiveSupport.Inflector} A port of Rails Inflector class.
     */
    Inflector: {
        Inflections: {
            plural: [
                [/(quiz)$/i,               "$1zes"  ],
                [/^(ox)$/i,                "$1en"   ],
                [/([m|l])ouse$/i,          "$1ice"  ],
                [/(matr|vert|ind)ix|ex$/i, "$1ices" ],
                [/(x|ch|ss|sh)$/i,         "$1es"   ],
                [/([^aeiouy]|qu)y$/i,      "$1ies"  ],
                [/(hive)$/i,               "$1s"    ],
                [/(?:([^f])fe|([lr])f)$/i, "$1$2ves"],
                [/sis$/i,                  "ses"    ],
                [/([ti])um$/i,             "$1a"    ],
                [/(buffal|tomat)o$/i,      "$1oes"  ],
                [/(bu)s$/i,                "$1ses"  ],
                [/(alias|status)$/i,       "$1es"   ],
                [/(octop|vir)us$/i,        "$1i"    ],
                [/(ax|test)is$/i,          "$1es"   ],
                [/s$/i,                    "s"      ],
                [/$/,                      "s"      ]
            ],
            singular: [
                [/(quiz)zes$/i,                                                    "$1"     ],
                [/(matr)ices$/i,                                                   "$1ix"   ],
                [/(vert|ind)ices$/i,                                               "$1ex"   ],
                [/^(ox)en/i,                                                       "$1"     ],
                [/(alias|status)es$/i,                                             "$1"     ],
                [/(octop|vir)i$/i,                                                 "$1us"   ],
                [/(cris|ax|test)es$/i,                                             "$1is"   ],
                [/(shoe)s$/i,                                                      "$1"     ],
                [/(o)es$/i,                                                        "$1"     ],
                [/(bus)es$/i,                                                      "$1"     ],
                [/([m|l])ice$/i,                                                   "$1ouse" ],
                [/(x|ch|ss|sh)es$/i,                                               "$1"     ],
                [/(m)ovies$/i,                                                     "$1ovie" ],
                [/(s)eries$/i,                                                     "$1eries"],
                [/([^aeiouy]|qu)ies$/i,                                            "$1y"    ],
                [/([lr])ves$/i,                                                    "$1f"    ],
                [/(tive)s$/i,                                                      "$1"     ],
                [/(hive)s$/i,                                                      "$1"     ],
                [/([^f])ves$/i,                                                    "$1fe"   ],
                [/(^analy)ses$/i,                                                  "$1sis"  ],
                [/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/i, "$1$2sis"],
                [/([ti])a$/i,                                                      "$1um"   ],
                [/(n)ews$/i,                                                       "$1ews"  ],
                [/s$/i,                                                            ""       ]
            ],
            irregular: [
                ['move',   'moves'   ],
                ['sex',    'sexes'   ],
                ['child',  'children'],
                ['man',    'men'     ],
                ['person', 'people'  ]
            ],
            uncountable: [
                "sheep",
                "fish",
                "series",
                "species",
                "money",
                "rice",
                "information",
                "equipment"
            ]
        },
        /**
         * Generates an ordinalized version of a number as a string (9th, 2nd, etc)
         * @alias ActiveSupport.Inflector.ordinalize
         * @param {Number} number
         * @return {String}
         */
        ordinalize: function ordinalize(number)
        {
            if (11 <= parseInt(number, 10) % 100 && parseInt(number, 10) % 100 <= 13)
            {
                return number + "th";
            }
            else
            {
                switch (parseInt(number, 10) % 10)
                {
                    case  1: return number + "st";
                    case  2: return number + "nd";
                    case  3: return number + "rd";
                    default: return number + "th";
                }
            }
        },
        /**
         * Generates a plural version of an english word.
         * @alias ActiveSupport.Inflector.pluralize
         * @param {String} word
         * @return {String}
         */
        pluralize: function pluralize(word)
        {
            var i;
            for (i = 0; i < ActiveSupport.Inflector.Inflections.uncountable.length; i++)
            {
                var uncountable = ActiveSupport.Inflector.Inflections.uncountable[i];
                if (word.toLowerCase === uncountable)
                {
                    return uncountable;
                }
            }
            for (i = 0; i < ActiveSupport.Inflector.Inflections.irregular.length; i++)
            {
                var singular = ActiveSupport.Inflector.Inflections.irregular[i][0];
                var plural = ActiveSupport.Inflector.Inflections.irregular[i][1];
                if ((word.toLowerCase === singular) || (word === plural))
                {
                    return plural;
                }
            }
            for (i = 0; i < ActiveSupport.Inflector.Inflections.plural.length; i++)
            {
                var regex = ActiveSupport.Inflector.Inflections.plural[i][0];
                var replace_string = ActiveSupport.Inflector.Inflections.plural[i][1];
                if (regex.test(word))
                {
                    return word.replace(regex, replace_string);
                }
            }
        },
        /**
         * Generates a singular version of an english word.
         * @alias ActiveSupport.Inflector.singularize
         * @param {String} word
         * @return {String}
         */
        singularize: function singularize(word) {
            var i;
            for (i = 0; i < ActiveSupport.Inflector.Inflections.uncountable.length; i++)
            {
                var uncountable = ActiveSupport.Inflector.Inflections.uncountable[i];
                if (word.toLowerCase === uncountable)
                {
                    return uncountable;
                }
            }
            for (i = 0; i < ActiveSupport.Inflector.Inflections.irregular.length; i++)
            {
                var singular = ActiveSupport.Inflector.Inflections.irregular[i][0];
                var plural   = ActiveSupport.Inflector.Inflections.irregular[i][1];
                if ((word.toLowerCase === singular) || (word === plural))
                {
                    return plural;
                }
            }
            for (i = 0; i < ActiveSupport.Inflector.Inflections.singular.length; i++)
            {
                var regex = ActiveSupport.Inflector.Inflections.singular[i][0];
                var replace_string = ActiveSupport.Inflector.Inflections.singular[i][1];
                if (regex.test(word))
                {
                    return word.replace(regex, replace_string);
                }
            }
        }
    },
    /**
     * Generates a JavaScript Date object from a MySQL DATETIME formatted
     * string (yyyy-mm-dd HH:MM:ss).
     * @alias ActiveSupport.dateFromDateTime
     * @param {String} date_time
     * @return {Date}
     */
    dateFromDateTime: function dateFromDateTime(date_time)
    {
        var parts = date_time.replace(/^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9]) (?:([0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/,"$1 $2 $3 $4 $5 $6").split(' ');
        return new Date(parts[0],parts[1]-1,parts[2],parts[3],parts[4],parts[5]);
    },
    /*
     * Date Format 1.2.2
     * (c) 2007-2008 Steven Levithan <stevenlevithan.com>
     * MIT license
     * Includes enhancements by Scott Trenda <scott.trenda.net> and Kris Kowal <cixar.com/~kris.kowal/>
     *
     * http://blog.stevenlevithan.com/archives/date-time-format
     * 
     * Accepts a date, a mask, or a date and a mask.
     * Returns a formatted version of the given date.
     * The date defaults to the current date/time.
     * The mask defaults to dateFormat.masks.default.
     */
     
    /**
     * See: http://blog.stevenlevithan.com/archives/date-time-format
     * 
     * If convert_to_local_time is true the Date object will be assume to be GMT
     * and be converted from GMT to the local time. Local time will be the local
     * time of the server if running server side, or local time of the client
     * side if running in the browser.
     * @alias ActiveSupport.dateFormat
     * @param {Date} date
     * @param {String} format
     * @param {Boolean} [convert_to_local_time]
     * @return {String}
     * @example
     *     ActiveSupport.dateFormat('yyyy-mm-dd HH:MM:ss');
     */
    dateFormat: function date_format_wrapper()
    {
        var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
            timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[\-\+]\d{4})?)\b/g,
            timezoneClip = /[^\-\+\dA-Z]/g,
            pad = function (val, len) {
                val = String(val);
                len = len || 2;
                while (val.length < len) {
                    val = "0" + val;
                }
                return val;
            };

        // Regexes and supporting functions are cached through closure
        var dateFormat = function dateFormat(date, mask, utc) {
            var dF = dateFormat;

            // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
            if (arguments.length === 1 && (typeof date === "string" || date instanceof String) && !/\d/.test(date)) {
                mask = date;
                date = undefined;
            }

            // Passing date through Date applies Date.parse, if necessary
            date = date ? new Date(date) : new Date();
            if (isNaN(date)) {
                return ActiveSupport.throwError(new SyntaxError("invalid date"));
            }

            mask = String(dF.masks[mask] || mask || dF.masks["default"]);

            // Allow setting the utc argument via the mask
            if (mask.slice(0, 4) === "UTC:") {
                mask = mask.slice(4);
                utc = true;
            }

            var _ = utc ? "getUTC" : "get",
                d = date[_ + "Date"](),
                D = date[_ + "Day"](),
                m = date[_ + "Month"](),
                y = date[_ + "FullYear"](),
                H = date[_ + "Hours"](),
                M = date[_ + "Minutes"](),
                s = date[_ + "Seconds"](),
                L = date[_ + "Milliseconds"](),
                o = utc ? 0 : date.getTimezoneOffset(),
                flags = {
                    d:    d,
                    dd:   pad(d),
                    ddd:  dF.i18n.dayNames[D],
                    dddd: dF.i18n.dayNames[D + 7],
                    m:    m + 1,
                    mm:   pad(m + 1),
                    mmm:  dF.i18n.monthNames[m],
                    mmmm: dF.i18n.monthNames[m + 12],
                    yy:   String(y).slice(2),
                    yyyy: y,
                    h:    H % 12 || 12,
                    hh:   pad(H % 12 || 12),
                    H:    H,
                    HH:   pad(H),
                    M:    M,
                    MM:   pad(M),
                    s:    s,
                    ss:   pad(s),
                    l:    pad(L, 3),
                    L:    pad(L > 99 ? Math.round(L / 10) : L),
                    t:    H < 12 ? "a"  : "p",
                    tt:   H < 12 ? "am" : "pm",
                    T:    H < 12 ? "A"  : "P",
                    TT:   H < 12 ? "AM" : "PM",
                    Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                    o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                    S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 !== 10) * d % 10]
                };

            return mask.replace(token, function ($0) {
                return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
            });
        };
        
        // Some common format strings
        dateFormat.masks = {
            "default":      "ddd mmm dd yyyy HH:MM:ss",
            shortDate:      "m/d/yy",
            mediumDate:     "mmm d, yyyy",
            longDate:       "mmmm d, yyyy",
            fullDate:       "dddd, mmmm d, yyyy",
            shortTime:      "h:MM TT",
            mediumTime:     "h:MM:ss TT",
            longTime:       "h:MM:ss TT Z",
            isoDate:        "yyyy-mm-dd",
            isoTime:        "HH:MM:ss",
            isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
            MySQL:          "yyyy-mm-dd HH:MM:ss",
            isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
        };

        // Internationalization strings
        dateFormat.i18n = {
            dayNames: [
                "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
                "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
            ],
            monthNames: [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
            ]
        };
        
        return dateFormat;
    }(),
    /**
     * Serializes an object to a JSON string.
     * @alias ActiveSupport.JSONFromObject
     * @param {Object} object
     * @return {String} json
     */ 
    JSONFromObject: function JSONFromObject(object)
    {
        return ActiveSupport.JSON.stringify(object);
    },
    /**
     * Serializes an object to an XML string.
     * @alias ActiveSupport.XMLFromObject
     * @param {String} outer_key_name
     * @param {Object} object
     * @return {String} xml
     */ 
    XMLFromObject: function XMLFromObject(outer_key_name,object)
    {
        var indent = 0;
        
        var str_repeat = function str_repeat(string,repeat)
        {
            var response = '';
            for(var i = 0; i < repeat; ++i)
            {
                response += string;
            }
            return response;
        };
        
        var serialize_value = function serialize_value(key_name,value,indent)
        {
            var response = '';
            if(typeof(value) === 'string' || typeof(value) === 'number' || typeof(value) === 'boolean')
            {
                response = '<![CDATA[' + (new String(value)).toString() + ']]>';
            }
            else if(typeof(value) === 'object')
            {
                response += String.fromCharCode(10);
                if('length' in value && 'splice' in value)
                {
                    for(var i = 0; i < value.length; ++i)
                    {
                        response += wrap_value(ActiveSupport.Inflector.singularize(key_name) || key_name,value[i],indent + 1);
                    }
                }
                else
                {
                    var object = value.toObject && typeof(value.toObject) === 'function' ? value.toObject() : value;
                    for(key_name in object)
                    {
                        response += wrap_value(key_name,object[key_name],indent + 1);
                    }
                }
                response += str_repeat(' ',4 * indent);
            }
            return response;
        };
        
        var sanitize_key_name = function sanitize_key_name(key_name)
        {
            return key_name.replace(/[\s\_]+/g,'-').toLowerCase();
        };
        
        var wrap_value = function wrap_value(key_name,value,indent)
        {
            key_name = sanitize_key_name(key_name);
            return str_repeat(' ',4 * indent) + '<' + key_name + '>' + serialize_value(key_name,value,indent) + '</' + key_name + '>' + String.fromCharCode(10);
        };
        
        outer_key_name = sanitize_key_name(outer_key_name);
        return '<' + outer_key_name + '>' + serialize_value(outer_key_name,object,0) + '</' + outer_key_name + '>';
    },
    /*
        http://www.JSON.org/json2.js
        2008-07-15

        Public Domain.

        NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

        See http://www.JSON.org/js.html

        This file creates a global JSON object containing two methods: stringify
        and parse.

            JSON.stringify(value, replacer, space)
                value       any JavaScript value, usually an object or array.

                replacer    an optional parameter that determines how object
                            values are stringified for objects. It can be a
                            function or an array.

                space       an optional parameter that specifies the indentation
                            of nested structures. If it is omitted, the text will
                            be packed without extra whitespace. If it is a number,
                            it will specify the number of spaces to indent at each
                            level. If it is a string (such as '\t' or '&nbsp;'),
                            it contains the characters used to indent at each level.

                This method produces a JSON text from a JavaScript value.

                When an object value is found, if the object contains a toJSON
                method, its toJSON method will be called and the result will be
                stringified. A toJSON method does not serialize: it returns the
                value represented by the name/value pair that should be serialized,
                or undefined if nothing should be serialized. The toJSON method
                will be passed the key associated with the value, and this will be
                bound to the object holding the key.

                For example, this would serialize Dates as ISO strings.

                    Date.prototype.toJSON = function (key) {
                        function f(n) {
                            // Format integers to have at least two digits.
                            return n < 10 ? '0' + n : n;
                        }

                        return this.getUTCFullYear()   + '-' +
                             f(this.getUTCMonth() + 1) + '-' +
                             f(this.getUTCDate())      + 'T' +
                             f(this.getUTCHours())     + ':' +
                             f(this.getUTCMinutes())   + ':' +
                             f(this.getUTCSeconds())   + 'Z';
                    };

                You can provide an optional replacer method. It will be passed the
                key and value of each member, with this bound to the containing
                object. The value that is returned from your method will be
                serialized. If your method returns undefined, then the member will
                be excluded from the serialization.

                If the replacer parameter is an array, then it will be used to
                select the members to be serialized. It filters the results such
                that only members with keys listed in the replacer array are
                stringified.

                Values that do not have JSON representations, such as undefined or
                functions, will not be serialized. Such values in objects will be
                dropped; in arrays they will be replaced with null. You can use
                a replacer function to replace those with JSON values.
                JSON.stringify(undefined) returns undefined.

                The optional space parameter produces a stringification of the
                value that is filled with line breaks and indentation to make it
                easier to read.

                If the space parameter is a non-empty string, then that string will
                be used for indentation. If the space parameter is a number, then
                the indentation will be that many spaces.

                Example:

                text = JSON.stringify(['e', {pluribus: 'unum'}]);
                // text is '["e",{"pluribus":"unum"}]'


                text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
                // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

                text = JSON.stringify([new Date()], function (key, value) {
                    return this[key] instanceof Date ?
                        'Date(' + this[key] + ')' : value;
                });
                // text is '["Date(---current time---)"]'


            JSON.parse(text, reviver)
                This method parses a JSON text to produce an object or array.
                It can throw a SyntaxError exception.

                The optional reviver parameter is a function that can filter and
                transform the results. It receives each of the keys and values,
                and its return value is used instead of the original value.
                If it returns what it received, then the structure is not modified.
                If it returns undefined then the member is deleted.

                Example:

                // Parse the text. Values that look like ISO date strings will
                // be converted to Date objects.

                myData = JSON.parse(text, function (key, value) {
                    var a;
                    if (typeof value === 'string') {
                        a =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                        if (a) {
                            return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                                +a[5], +a[6]));
                        }
                    }
                    return value;
                });

                myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                    var d;
                    if (typeof value === 'string' &&
                            value.slice(0, 5) === 'Date(' &&
                            value.slice(-1) === ')') {
                        d = new Date(value.slice(5, -1));
                        if (d) {
                            return d;
                        }
                    }
                    return value;
                });


        This is a reference implementation. You are free to copy, modify, or
        redistribute.

        This code should be minified before deployment.
        See http://javascript.crockford.com/jsmin.html

        USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
        NOT CONTROL.
    */
    
    /**
     * @namespace {ActiveSupport.JSON} Provides JSON support if a native implementation is not available.
     */
    JSON: function()
    {
        //use native support if available
        if(global_context && 'JSON' in global_context && 'stringify' in global_context.JSON && 'parse' in global_context.JSON)
        {
            return global_context.JSON;
        }
        
        function f(n) {
            // Format integers to have at least two digits.
            return n < 10 ? '0' + n : n;
        }
        
        Date.prototype.toJSON = function (key) {
            return this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z';
        };
        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            escapeable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            gap,
            indent,
            meta = {    // table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"' : '\\"',
                '\\': '\\\\'
            },
            rep;
        
        function quote(string) {
            escapeable.lastIndex = 0;
            return escapeable.test(string) ?
                '"' + string.replace(escapeable, function (a) {
                    var c = meta[a];
                    if (typeof c === 'string') {
                        return c;
                    }
                    return '\\u' + ('0000' +
                            (+(a.charCodeAt(0))).toString(16)).slice(-4);
                }) + '"' :
                '"' + string + '"';
        }
        
        function str(key, holder) {
            var i,          // The loop counter.
                k,          // The member key.
                v,          // The member value.
                length,
                mind = gap,
                partial,
                value = holder[key];
            if (value && typeof value === 'object' &&
                    typeof value.toJSON === 'function' && !ActiveSupport.isArray(value)) {
                value = value.toJSON(key);
            }
            if (typeof rep === 'function') {
                value = rep.call(holder, key, value);
            }
            switch (typeof value) {
            case 'string':
                return quote(value.valueOf());
            case 'number':
                return isFinite(value) ? String(value.valueOf()) : 'null';
            case 'boolean':
                return String(value.valueOf());
            case 'null':
                return String(value);
            case 'object':
                if (!value) {
                    return 'null';
                }
                gap += indent;
                partial = [];
                if (typeof value.length === 'number' &&
                        !(value.propertyIsEnumerable('length'))) {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }
                    v = partial.length === 0 ? '[]' :
                        gap ? '[\n' + gap +
                                partial.join(',\n' + gap) + '\n' +
                                    mind + ']' :
                              '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }
                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === 'string') {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }
                v = partial.length === 0 ? '{}' :
                    gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                            mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
            }
        }
        
        return {
            /**
             * @alias ActiveSupport.JSON.stringify
             * @param {Object} value
             * @return {String}
             */
            stringify: function (value, replacer, space) {
                var i;
                gap = '';
                indent = '';
                if (typeof space === 'number') {
                    for (i = 0; i < space; i += 1) {
                        indent += ' ';
                    }
                } else if (typeof space === 'string') {
                    indent = space;
                }
                rep = replacer;
                if (replacer && typeof replacer !== 'function' &&
                        (typeof replacer !== 'object' ||
                         typeof replacer.length !== 'number')) {
                    return ActiveSupport.throwError(new Error('JSON.stringify'));
                }
                return str('', {'': value});
            },
            /**
             * @alias ActiveSupport.JSON.parse
             * @param {String} text
             * @return {Object}
             */
            parse: function (text, reviver) {
                var j;
                
                function walk(holder, key) {
                    var k, v, value = holder[key];
                    if (value && typeof value === 'object') {
                        for (k in value) {
                            if (Object.hasOwnProperty.call(value, k)) {
                                v = walk(value, k);
                                if (v !== undefined) {
                                    value[k] = v;
                                } else {
                                    delete value[k];
                                }
                            }
                        }
                    }
                    return reviver.call(holder, key, value);
                }
                
                cx.lastIndex = 0;
                if (cx.test(text)) {
                    text = text.replace(cx, function (a) {
                        return '\\u' + ('0000' +
                                (+(a.charCodeAt(0))).toString(16)).slice(-4);
                    });
                }
                if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                    j = eval('(' + text + ')');
                    return typeof reviver === 'function' ?
                        walk({'': j}, '') : j;
                }
                return ActiveSupport.throwError(new SyntaxError('JSON.parse'));
            }
        };
    }()
};

})(this);

/**
 * @namespace {ActiveEvent}
 * @example
 * 
 * ActiveEvent.js
 * ==============
 * 
 * ActiveEvent allows you to create observable events, and attach event
 * handlers to any class or object.
 *
 * Setup
 * -----
 * Before you can use ActiveEvent you must call extend a given class or object
 * with ActiveEvent's methods. If you extend a class, both the class itself
 * will become observable, as well as all of it's instances.
 *
 *     ActiveEvent.extend(MyClass); //class and all instances are observable
 *     ActiveEvent.extend(my_object); //this object becomes observable
 * 
 * Creating Events
 * ---------------
 * You can create an event inside any method of your class or object by calling
 * the notify() method with name of the event followed by any arguments to be
 * passed to observers. You can also have an existing method fire an event with
 * the same name as the method using makeObservable().
 * 
 *     var Message = function(){};
 *     ActiveEvent.extend(Message);
 *     Message.prototype.send = function(text){
 *         //message sending code here...
 *         this.notify('sent',text);
 *     };
 * 
 *     //make an existing method observable
 *     var observable_hash = new Hash({});
 *     ActiveEvent.extend(observable_hash);
 *     observable_hash.makeObservable('set');
 * 
 * Observing Events
 * ----------------
 * To observe an event call the observe() method with the name of the event you
 * want to observe, and the observer function. The observer function will
 * receive any additional arguments passed to notify(). If observing a class,
 * the instance that triggered the event will always be the first argument
 * passed to the observer. observeOnce() works just like observe() in every
 * way, but is only called once.
 * 
 *     Message.observe('sent',function(message,text){
 *         //responds to all sent messages
 *     });
 * 
 *     var m = new Message();
 *     m.observe('sent',function(text){
 *         //this will only be called when "m" is sent
 *     });
 * 
 *     observable_hash.observe('set',function(key,value){
 *         console.log('observable_hash.set: ' + key + '=' + value);
 *     });
 
 *     observable_hash.observeOnce('set',function(key,value){
 *         //this will only be called once
 *     });
 * 
 * Control Flow
 * ------------
 * When notify() is called, if any of the registered observers for that event
 * return false, no other observers will be called and notify() will return
 * false. Returning null or not calling return will not stop the event.
 *
 * Otherwise notify() will return an array of the
 * collected return values from any registered observer functions. Observers
 * can be unregistered with the stopObserving() method. If no observer is
 * passed, all observers of that object or class with the given event name
 * will be unregistered. If no event name and no observer is passed, all
 * observers of that object or class will be unregistered.
 *
 *     Message.prototype.send = function(text){
 *         if(this.notify('send',text) === false)
 *             return false;
 *         //message sending code here...
 *         this.notify('sent',text);
 *         return true;
 *     };
 * 
 *     var m = new Message();
 *     
 *     var observer = m.observe('send',function(message,text){
 *         if(text === 'test')
 *             return false;
 *     });
 *     
 *     m.send('my message'); //returned true
 *     m.send('test'); //returned false
 *     
 *     m.stopObserving('send',observer);
 *     
 *     m.send('test'); //returned true
 * 
 * Object.options
 * --------------
 * If an object has an options property that contains a callable function with
 * the same name as an event triggered with <b>notify()</b>, it will be
 * treated just like an instance observer. So the following code is equivalent:
 *
 *     var rating_one = new Control.Rating('rating_one',{  
 *         afterChange: function(new_value){}    
 *     });  
 *     
 *     var rating_two = new Control.Rating('rating_two');  
 *     rating_two.observe('afterChange',function(new_value){});
 * 
 * MethodCallObserver
 * ------------------
 * The makeObservable() method permanently modifies the method that will
 * become observable. If you need to temporarily observe a method call without
 * permanently modifying it, use observeMethod(). Pass the name of the
 * method to observe and the observer function will receive all of the
 * arguments passed to the method. An ActiveEvent.MethodCallObserver object is
 * returned from the call to observeMethod(), which has a stop() method on it.
 * Once stop() is called, the method is returned to it's original state. You
 * can optionally pass another function to observeMethod(), if you do the
 * MethodCallObserver will be automatically stopped when that function
 * finishes executing.
 * 
 *     var h = new Hash({});
 *     ActiveEvent.extend(h);
 *     
 *     var observer = h.observeMethod('set',function(key,value){
 *         console.log(key + '=' + value);
 *     });
 *     h.set('a','one');
 *     h.set('a','two');
 *     observer.stop();
 *     
 *     //console now contains:
 *     //"a = one"
 *     //"b = two"
 *     
 *     //the following does the same as above
 *     h.observeMethod('set',function(key,value){
 *         console.log(key + '=' + value);
 *     },function(){
 *         h.set('a','one');
 *         h.set('b','two');
 *     });
 */
var ActiveEvent = null;

if(typeof exports != "undefined"){
    exports.ActiveEvent = ActiveEvent;
}

/**
 * @namespace {ActiveEvent.ObservableObject} After calling
 *  ActiveEvent.extend(object), the given object will inherit the
 *  methods in this namespace. If the given object has a prototype
 *  (is a class constructor), the object's prototype will inherit
 *  these methods as well.
 */

(function(){

ActiveEvent = {};

/**
 * After extending a given object, it will inherit the methods described in
 *  ActiveEvent.ObservableObject.
 * @alias ActiveEvent.extend
 * @param {Object} object
 */
ActiveEvent.extend = function extend(object){
    
    /**
     * Wraps the given method_name with a function that will call the method,
     *  then trigger an event with the same name as the method. This can
     *  safely be applied to virtually any method, including built in
     *  Objects (Array.pop, etc), but cannot be undone.
     * @alias ActiveEvent.ObservableObject.makeObservable
     * @param {String} method_name
     */
    object.makeObservable = function makeObservable(method_name)
    {
        if(this[method_name])
        {
            this._objectEventSetup(method_name);
            this[method_name] = ActiveSupport.wrap(this[method_name],function wrapped_observer(proceed){
                var args = ActiveSupport.arrayFrom(arguments).slice(1);
                var response = proceed.apply(this,args);
                args.unshift(method_name);
                this.notify.apply(this,args);
                return response;
            });
        }
        if(this.prototype)
        {
            this.prototype.makeObservable(method_name);
        }
    };
    
    /**
     * Similiar to makeObservable(), but after the callback is called, the
     *  method will be returned to it's original state and will no longer
     *  be observable.
     * @alias ActiveEvent.ObservableObject.observeMethod
     * @param {String} method_name
     * @param {Function} observe
     * @param {Function} [callback]
     */
    object.observeMethod = function observeMethod(method_name,observer,scope)
    {
        return new ActiveEvent.MethodCallObserver([[this,method_name]],observer,scope);
    };
    
    object._objectEventSetup = function _objectEventSetup(event_name)
    {
        this._observers = this._observers || {};
        this._observers[event_name] = this._observers[event_name] || [];
    };
    
    /**
     * @alias ActiveEvent.ObservableObject.observe
     * @param {String} event_name
     * @param {Function} observer
     * @return {Function} observer
     */
    object.observe = function observe(event_name,observer)
    {
        if(typeof(event_name) === 'string' && typeof(observer) !== 'undefined')
        {
            this._objectEventSetup(event_name);
            if(!(ActiveSupport.indexOf(this._observers[event_name],observer) > -1))
            {
                this._observers[event_name].push(observer);
            }
        }
        else
        {
            for(var e in event_name)
            {
                this.observe(e,event_name[e]);
            }
        }
        return observer;
    };
    
    /**
     * Removes a given observer. If no observer is passed, removes all
     *   observers of that event. If no event is passed, removes all
     *   observers of the object.
     * @alias ActiveEvent.ObservableObject.stopObserving
     * @param {String} [event_name]
     * @param {Function} [observer]
     */
    object.stopObserving = function stopObserving(event_name,observer)
    {
        this._objectEventSetup(event_name);
        if(event_name && observer)
        {
            this._observers[event_name] = ActiveSupport.without(this._observers[event_name],observer);
        }
        else if(event_name)
        {
            this._observers[event_name] = [];
        }
        else
        {
            this._observers = {};
        }
    };
    
    /**
     * Works exactly like observe(), but will stopObserving() after the next
     *   time the event is fired.
     * @alias ActiveEvent.ObservableObject.observeOnce
     * @param {String} event_name
     * @param {Function} observer
     * @return {Function} The observer that was passed in will be wrapped,
     *  this generated / wrapped observer is returned.
     */
    object.observeOnce = function observeOnce(event_name,outer_observer)
    {
        var inner_observer = ActiveSupport.bind(function bound_inner_observer(){
            outer_observer.apply(this,arguments);
            this.stopObserving(event_name,inner_observer);
        },this);
        this._objectEventSetup(event_name);
        this._observers[event_name].push(inner_observer);
        return inner_observer;
    };
    
    /**
     * Triggers event_name with the passed arguments.
     * @alias ActiveEvent.ObservableObject.notify
     * @param {String} event_name
     * @param {mixed} [args]
     * @return {mixed} Array of return values, or false if the event was
     *  stopped by an observer.
     */
    object.notify = function notify(event_name)
    {
        if(!this._observers || !this._observers[event_name] || (this._observers[event_name] && this._observers[event_name].length == 0))
        {
            return [];
        }
        this._objectEventSetup(event_name);
        var collected_return_values = [];
        var args = ActiveSupport.arrayFrom(arguments).slice(1);
        for(var i = 0; i < this._observers[event_name].length; ++i)
        {
            var response = this._observers[event_name][i].apply(this._observers[event_name][i],args);
            if(response === false)
            {
                return false;
            }
            else
            {
                collected_return_values.push(response);
            }
        }
        return collected_return_values;
    };
    if(object.prototype)
    {
        object.prototype.makeObservable = object.makeObservable;
        object.prototype.observeMethod = object.observeMethod;
        object.prototype._objectEventSetup = object._objectEventSetup;
        object.prototype.observe = object.observe;
        object.prototype.stopObserving = object.stopObserving;
        object.prototype.observeOnce = object.observeOnce;
        
        object.prototype.notify = function notify(event_name)
        {
            if(
              (!object._observers || !object._observers[event_name] || (object._observers[event_name] && object._observers[event_name].length == 0)) &&
              (!this.options || !this.options[event_name]) &&
              (!this._observers || !this._observers[event_name] || (this._observers[event_name] && this._observers[event_name].length == 0))
            )
            {
                return [];
            }
            var args = ActiveSupport.arrayFrom(arguments).slice(1);
            var collected_return_values = [];
            if(object.notify)
            {
                object_args = ActiveSupport.arrayFrom(arguments).slice(1);
                object_args.unshift(this);
                object_args.unshift(event_name);
                var collected_return_values_from_object = object.notify.apply(object,object_args);
                if(collected_return_values_from_object === false)
                {
                    return false;
                }
                collected_return_values = collected_return_values.concat(collected_return_values_from_object);
            }
            this._objectEventSetup(event_name);
            var response;
            if(this.options && this.options[event_name] && typeof(this.options[event_name]) === 'function')
            {
                response = this.options[event_name].apply(this,args);
                if(response === false)
                {
                    return false;
                }
                else
                {
                    collected_return_values.push(response);
                }
            }
            for(var i = 0; i < this._observers[event_name].length; ++i)
            {
                response = this._observers[event_name][i].apply(this._observers[event_name][i],args);
                if(response === false)
                {
                    return false;
                }
                else
                {
                    collected_return_values.push(response);
                }
            }
            return collected_return_values;
        };
    }
};

ActiveEvent.MethodCallObserver = function MethodCallObserver(methods,observer,scope)
{
    this.stop = function stop(){
        for(var i = 0; i < this.methods.length; ++i)
        {
            this.methods[i][0][this.methods[i][1]] = this.originals[i];
        }
    };
    this.methods = methods;
    this.originals = [];
    for(var i = 0; i < this.methods.length; ++i)
    {
        this.originals.push(this.methods[i][0][this.methods[i][1]]);
        this.methods[i][0][this.methods[i][1]] = ActiveSupport.wrap(this.methods[i][0][this.methods[i][1]],function(proceed){
            var args = ActiveSupport.arrayFrom(arguments).slice(1);
            observer.apply(this,args);
            return proceed.apply(this,args);
        });
    }
    if(scope)
    {
        scope();
        this.stop();
    }
};

var ObservableHash = function ObservableHash(object)
{
    this._object = object || {};
};

ObservableHash.prototype.set = function set(key,value)
{
    this._object[key] = value;
    this.notify('set',key,value);
    return value;
};

ObservableHash.prototype.get = function get(key)
{
    this.notify('get',key);
    return this._object[key];
};

ObservableHash.prototype.unset = function unset(key)
{
    this.notify('unset',key);
    var value = this._object[key];
    delete this._object[key];
    return value;
};

ObservableHash.prototype.toObject = function toObject()
{
    return this._object;
};

ActiveEvent.extend(ObservableHash);

ActiveEvent.ObservableHash = ObservableHash;

})();
 
var ActiveRoutes = null;

if(typeof exports != "undefined"){
    exports.ActiveRoutes = ActiveRoutes;
}

(function() {
 
/**
 * @alias ActiveRoutes
 * @constructor
 * @param {Array} routes
 * @param {Object} [scope] defaults to window
 * @param {Object} [options]
 * @return {ActiveRoutes}
 * @example
 *
 * ActiveRoutes.js
 * ===============
 * 
 * ActiveRoutes maps URI strings to method calls, and visa versa. It shares a
 * similar syntax to Rails Routing, but is framework agnostic and can map
 * calls to any type of object. Server side it can be used to map requests for
 * a given URL to a method that will render a page, client side it can be used
 * to provide deep linking and back button / history support for your Ajax
 * application.
 * 
 * Declaring Routes
 * ----------------
 * Wether declared in the constructor, or with addRoute(), routes can have up
 * to three parameters, and can be declared in any of the follow ways:
 * 
 * - "name", "path", {params}
 * - "path", {params}
 * - "path"
 * 
 * The path portion of a route is a URI string. Parameters that will be passed
 * to the method called are represented with a colon. Names are optional, but
 * the path and the params together must declare "object" and "method"
 * parameters. The following are all valid routes:
 * 
 *     var routes = new ActiveRoutes([
 *       ['root','/',{object:'Pages',method:'index'}],
 *       ['contact','/contact',{object:'Pages',method:'contact'}],
 *       ['blog','/blog',{object:'Blog',method:'index'}],
 *       ['post','/blog/post/:id',{object:'Blog',method:'post'}],
 *       ['/pages/*',{object:'Pages',method:'page'}],
 *       ['/:object/:method']
 *     ],Application);
 * 
 * Options
 * -------
 * You can pass a hash of options as the third parameter to the ActiveRoutes
 * constructor. This hash can contain the following keys:
 * 
 * - base: default '', the default path / url prefix to be used in a generated url
 * - classSuffix: default '' if it was "Controller", calling "/blog/post/5" would call BlogController.post instead of Blog.post
 * - dispatcher: default ActiveRoutes.prototype.defaultDispatcher, the dispatcher function to be called when dispatch() is called and a route is found
 * - camelizeObjectName: default true, if true, trying to call "blog_controller" through routes will call "BlogController"
 * - camelizeMethodName: default true, if true, trying to call "my_method_name" through routes will call "myMethodName"
 * - camelizeGeneratedMethods: default true, will export generated methods into the scope as "articleUrl" instead of "article_url"
 * 
 * Catch All Routes
 * ----------------
 * If you want to route all requests below a certain path to a given method,
 * place an asterisk in your route. When a matching path is dispatched to
 * that route the path components will be available in an array called "path".
 * 
 *     route_set.addRoute('/wiki/*',{object:'WikiController',method:'page'})
 *     route_set.dispatch('/wiki/a/b/c');
 *     //calls: WikiController.page({object:'WikiController',method:'page',path:['a','b','c']})
 * 
 * Route Requirements
 * ------------------
 * Each route can take a special "requirements" parameter that will not be
 * passed in the params passed to the called method. Each requirement
 * can be a regular expression or a function, which the value of the
 * parameter will be checked against. Each value checked by a regular
 * expression or function is always a string.
 * 
 *     route_set.addRoute('/article/:article_id/:comment_id',{
 *         article_id: /^\d+$/,
 *         comment_id: function(comment_id){
 *             return comment_id.match(/^\d+$/);
 *         }
 *     });
 * 
 * Scope
 * -----
 * You can specify what scope an ActiveRoutes instance will look in to call
 * the specified objects and methods. This defaults to window but can be
 * specified as the second parameter to the constructor.
 * 
 * Generating URLs
 * ---------------
 * The method urlFor() is available on every route set, and can generate a
 * URL from an object. Using the routes declared in the example above:
 * 
 *     routes.urlFor({object:'Blog',method:'post',id:5}) == '/blog/post/5';
 * 
 * If named routes are given, corresponding methods are generated in the
 * passed scope to resolve these urls.
 * 
 *     Application.postUrl({id: 5}) == '/blog/post/5';
 * 
 * To get the params to generate a url, a similar method is generated:
 * 
 *     Application.postParams({id: 5}) == {object:'Blog',method:'post',id:5};
 * 
 * To call a named route directly without round-tripping to a string and
 * back to params use:
 * 
 *     Application.callPost({id: 5});
 *
 * Dispatching
 * -----------
 * To call a given method from a URL string, use the dispatch() method.
 * 
 *     routes.dispatch('/'); //will call Pages.index()
 *     routes.dispatch('/blog/post/5'); //will call Blog.post({id: 5});
 * 
 * History
 * -------
 * Most server side JavaScript implementations will not preserve objects
 * between requests, so the history is not of use. Client side, after each
 * dispatch, the route and parameters are recorded. The history itself is
 * accessible with the "history" property, and is traversable with the
 * next() and back() methods.
 */
ActiveRoutes = function initialize(routes,scope,options)
{
    this.initialized = false;
    this.error = false;
    this.scope = scope || ActiveSupport.getGlobalContext();
    this.routes = [];
    this.index = 0;
    /**
     * @alias ActiveRoutes.prototype.history
     * @property {Array}
     */
    this.history = [];
    this.options = ActiveSupport.extend({
        classSuffix: '',
        camelizeObjectName: true,
        camelizeMethodName: true,
        camelizeGeneratedMethods: true,
        base: '',
        dispatcher: this.defaultDispatcher
    },options || {});
    this.dispatcher = this.options.dispatcher;
    var i;
    for(i = 0; i < routes.length; ++i)
    {
        if(routes[i]) //fix for accidental trailing commas in IE arrays
        {
            this.addRoute.apply(this,routes[i]);
        }
    }
    var current_route_set = this;
    this.scope[this.options.camelizeGeneratedMethods ? 'urlFor' : 'url_for'] = function generatedUrlFor(){
        current_route_set.urlFor.apply(current_route_set,arguments);
    };
    this.initialized = true;
};
ActiveEvent.extend(ActiveRoutes);

/**
 * @alias ActiveRoutes.logging
 * @property {Boolean}
 */
ActiveRoutes.logging = false;

ActiveRoutes.prototype.goToIndex = function goToIndex(index)
{
    if(!this.history[index])
    {
        return false;
    }
    this.index = index;
    this.dispatcher(this.history[this.index]);
    return true;
};

/**
 * Calls to the previous dispatched route in the history.
 * @alias ActiveRoutes.prototype.back
 * @return {Boolean}
 */
ActiveRoutes.prototype.back = function back()
{
    if(this.index == 0)
    {
        return false;
    }
    --this.index;
    this.dispatcher(this.history[this.index]);
    return true;
};

/**
 * Calls to the next dispatched route in the history if back() has already
 * been called.
 * @alias ActiveRoutes.prototype.next
 * @return {Boolean}
 */
ActiveRoutes.prototype.next = function next()
{
    if(this.index >= this.history.length - 1)
    {
        return false;
    }
    ++this.index;
    this.dispatcher(this.history[this.index]);
    return true;
};

/**
 * If match() returns false, the error it generates can be retrieved with this
 *  function.
 * @alias ActiveRoutes.prototype.getError
 * @return {mixed} String or null
 */
ActiveRoutes.prototype.getError = function getError()
{
    return this.error;
};

/**
 * Add a new route to the route set. When adding routes via the constructor
 * routes will be pushed onto the array, if called after the route set is
 * initialized, the route will be unshifted onto the route set (and will
 * have the highest priority).
 * @alias ActiveRoutes.prototype.addRoute
 * @exception {ActiveRoutes.Errors.NoPathInRoute}
 * @exception {ActiveRoutes.Errors.NoObjectInRoute}
 * @exception {ActiveRoutes.Errors.NoMethodInRoute}
 * @example
 * routes.addRoute('route_name','/route/path',{params});<br/>
 * routes.addRoute('/route/path',{params});<br/>
 * routes.addRoute('/route/path');
 */
ActiveRoutes.prototype.addRoute = function addRoute()
{
    var name,path,params,route;
    if(arguments.length == 3)
    {
        name = arguments[0];
        path = arguments[1];
        params = arguments[2];
    }
    else if(arguments.length == 2)
    {
        if(typeof(arguments[0]) == 'string' && typeof(arguments[1]) == 'string')
        {
            name = arguments[0];
            path = arguments[1];
        }
        else
        {
            path = arguments[0];
            params = arguments[1];
        }
    }
    else if(arguments.length == 1)
    {
        path = arguments[0];
    }
    route = {
        name: name,
        path: ActiveRoutes.normalizePath(path),
        params: params || {}
    };
    if(!Validations.hasPath(route))
    {
        return ActiveSupport.throwError(Errors.NoPathInRoute);
    }
    if(!Validations.hasObject(route))
    {
        return ActiveSupport.throwError(Errors.NoObjectInRoute,route.path);
    }
    if(!Validations.hasMethod(route))
    {
        return ActiveSupport.throwError(Errors.NoMethodInRoute,route.path);
    }
    if(this.initialized)
    {
        this.routes.unshift(route);
    }
    else
    {
        this.routes.push(route);
    }
    this.generateMethodsForRoute(route);
};

ActiveRoutes.normalizePathDotDotRegexp = /[^\/\\]+[\/\\]\.\.[\/\\]/;
ActiveRoutes.normalizePath = function normalizePath(path)
{
    //remove hash
    path = path.replace(/\#.+$/,'');
    //remove query string
    path = path.replace(/\?.+$/,'');
    //remove trailing and starting slashes, replace backslashes, replace multiple slashes with a single slash
    path = path.replace(/\/{2,}/g,"/").replace(/\\\\/g,"\\").replace(/(\/|\\)$/,'').replace(/\\/g,'/').replace(/^\//,'');
    while(path.match(ActiveRoutes.normalizePathDotDotRegexp))
    {
        path = path.replace(ActiveRoutes.normalizePathDotDotRegexp,'');
    }
    //replace /index with /
    path = path.replace(/(\/index$|^index$)/i,'');
    return path;
};

var Errors = {
    NoPathInRoute: ActiveSupport.createError('No path was specified in the route'),
    NoObjectInRoute: ActiveSupport.createError('No :object was specified in the route: '),
    NoMethodInRoute: ActiveSupport.createError('No :method was specified in the route: '),
    ObjectDoesNotExist: ActiveSupport.createError('The following object does not exist: '),
    MethodDoesNotExist: ActiveSupport.createError('The following method does not exist: '),
    MethodNotCallable: ActiveSupport.createError('The following method is not callable: '),
    NamedRouteDoesNotExist: ActiveSupport.createError('The following named route does not exist: '),
    UnresolvableUrl: ActiveSupport.createError('Could not resolve the url: ')
};
ActiveRoutes.Errors = Errors;

ActiveRoutes.prototype.checkAndCleanRoute = function checkAndCleanRoute(route,original_path)
{
    if(!route.params.method)
    {
        route.params.method = 'index';
    }
    if(this.options.camelizeObjectName)
    {
        route.params.object = ActiveSupport.camelize(route.params.object,true);
    }
    if(route.params.requirements)
    {
        delete route.params.requirements;
    }
    if(this.options.classSuffix)
    {
        route.params.object += this.options.classSuffix;
    }
    if(!this.objectExists(route.params.object))
    {
        this.error = Errors.ObjectDoesNotExist + route.params.object;
    }
    if(!this.methodExists(route.params.object,route.params.method))
    {
        this.error = Errors.MethodDoesNotExist + route.params.object + '.' + route.params.method;
    }
    if(!this.methodCallable(route.params.object,route.params.method))
    {
        this.error = Errors.MethodNotCallable + route.params.object + '.' + route.params.method;
    }
    if(this.error)
    {
        if(ActiveRoutes.logging)
        {
            ActiveSupport.log('ActiveRoutes: No match for "' + original_path + '" (' + this.error + ')');
        }
        return false;
    }
    else
    {
        if(ActiveRoutes.logging)
        {
            ActiveSupport.log('ActiveRoutes: matched "' + original_path + '" with "' + (route.name || route.path) + '"');
        }
        return route;
    }
};

/**
 * @alias ActiveRoutes.prototype.match
 * @param {String} path
 * @return {mixed} false if no match, otherwise the matching route.
 * @example
 * var route = routes.match('/blog/post/5');<br/>
 * route == {object: 'blog',method: 'post', id: 5};
 */
ActiveRoutes.prototype.match = function(path){
    var original_path = path;
    this.error = false;
    //make sure the path is a copy
    path = ActiveRoutes.normalizePath((new String(path)).toString());
    //handle extension
    var extension = path.match(/\.([^\.]+)$/);
    if(extension)
    {
        extension = extension[1];
        path = path.replace(/\.[^\.]+$/,'');
    }
    var path_components = path.split('/');
    var path_length = path_components.length;
    for(var i = 0; i < this.routes.length; ++i)
    {
        var route = ActiveSupport.clone(this.routes[i]);
        route.params = ActiveSupport.clone(this.routes[i].params || {});
        route.extension = extension;
        route.orderedParams = [];
        
        //exact match
        if(route.path == path)
        {
            return this.checkAndCleanRoute(route,original_path);
        }
        
        //perform full match
        var route_path_components = route.path.split('/');
        var route_path_length = route_path_components.length;
        var valid = true;
        //length of path components must match, but must treat "/blog", "/blog/action", "/blog/action/id" the same
        if(path_length <= route_path_length || route_path_components[route_path_components.length - 1] == '*'){
            for(var ii = 0; ii < route_path_components.length; ++ii)
            {
                var path_component = path_components[ii];
                var route_path_component = route_path_components[ii];
                //catch all
                if(route_path_component.charAt(0) == '*')
                {
                    route.params.path = path_components.slice(ii);
                    return this.checkAndCleanRoute(route,original_path); 
                }
                //named component
                else if(route_path_component.charAt(0) == ':')
                {
                    var key = route_path_component.substr(1);
                    if(path_component && route.params.requirements && route.params.requirements[key] &&
                        !(typeof(route.params.requirements[key]) == 'function'
                            ? route.params.requirements[key]((new String(path_component).toString()))
                            : path_component.match(route.params.requirements[key])))
                    {
                        valid = false;
                        break;
                    }
                    else
                    {
                        if(typeof(path_component) == 'undefined' && key != 'method' && key != 'object' && key != 'id')
                        {
                            valid = false;
                            break;
                        }
                        else
                        {
                            route.params[key] = path_component;
                            route.orderedParams.push(path_component);
                        }
                    }
                }
                else if(path_component != route_path_component)
                {
                    valid = false;
                    break;
                }
            }
            if(valid)
            {
                return this.checkAndCleanRoute(route,original_path);
            }
        }
    }
    return false;
};
 
/**
 * Will match() the given path and call the dispatcher if one is found.
 * @alias ActiveRoutes.prototype.dispatch
 * @param {String} path
 * @exception {ActiveRoutes.Errors.UnresolvableUrl}
 * @example
 *     var routes = new ActiveRoutes([['post','/blog/post/:id',{object:'blog',method: 'post'}]]);
 *     routes.dispatch('/blog/post/5');
 *     //by default calls Blog.post({object:'blog',method: 'post',id: 5});
 */
ActiveRoutes.prototype.dispatch = function dispatch(path)
{
    var route;
    if(typeof(path) == 'string')
    {
        route = this.match(path);
        if(!route)
        {
            if(this.error)
            {
                return ActiveSupport.throwError(this.error);
            }
            else
            {
                return ActiveSupport.throwError(Errors.UnresolvableUrl,path);
            }
        }
    }
    else
    {
        route = {
            params: path
        };
    }
    this.history.push(route);
    this.index = this.history.length - 1;
    if(this.notify('beforeDispatch',route,path) === false)
    {
        return false;
    }
    this.dispatcher(route);
    this.notify('afterDispatch',route,path);
};

/**
 * If no "dispatcher" key is passed into the options to contstruct a route set
 *  this is used. It will call scope.object_name.method_name(route.params)
 * @property {Function}
 * @alias ActiveRoutes.prototype.defaultDispatcher
 */
ActiveRoutes.prototype.defaultDispatcher = function defaultDispatcher(route)
{
    this.scope[route.params.object][route.params.method](route.params);
};

var Validations = {
    hasPath: function(route)
    {
        if(route.path === '')
        {
            return true;
        }
        else
        {
            return !!route.path;
        }
    },
    hasMethod: function(route)
    {
        return !(!route.path.match(':method') && (!route.params || !route.params.method));
    },
    hasObject: function(route)
    {
        return !(!route.path.match(':object') && (!route.params || !route.params.object));
    }
};

ActiveRoutes.prototype.objectExists = function(object_name)
{
    return !!ActiveSupport.getClass(object_name,this.scope);
};

ActiveRoutes.prototype.getMethod = function(object_name,method_name)
{
    if(this.scope[object_name].prototype && this.scope[object_name].prototype[method_name])
    {
        return this.scope[object_name].prototype[method_name];
    }
    else
    {
        return this.scope[object_name][method_name];
    }
};

ActiveRoutes.prototype.methodExists = function(object_name,method_name)
{
    return !(!this.objectExists(object_name) || !this.getMethod(object_name,method_name));
};

ActiveRoutes.prototype.methodCallable = function(object_name,method_name)
{
    return (this.methodExists(object_name,method_name) && (typeof(this.getMethod(object_name,method_name)) === 'function'));
};


ActiveRoutes.Validations = Validations;

ActiveRoutes.prototype.cleanPath = function cleanPath(path,params,only_path)
{
    if(!params.id)
    {
        path = path.replace(/\/?\:id/,'');
    }
    if(params.method == 'index')
    {
        path = path.replace(/\/?\:method/,'');
    }
    path = path.replace(/\/?index$/,'');
    if(path.charAt(0) != '/')
    {
        path = '/' + path;
    }
    path = only_path ? path : this.options.base + path;
    return path;
};

ActiveRoutes.performParamSubstitution = function performParamSubstitution(path,route,params)
{
    for(var p in params)
    {
        if(path.match(':' + p) && params[p])
        {
            if(route.params.requirements && route.params.requirements[p]){
                if(typeof(route.params.requirements[p]) == 'function' && !route.params.requirements[p]((new String(params[p]).toString())))
                {
                    continue;
                }
                else if(!route.params.requirements[p].exec((new String(params[p]).toString())))
                {
                    continue;
                }
            }
            path = path.replace(':' + p,params[p].toString());
        }
    }
    return path;
};

/**
 * @alias ActiveRoutes.prototype.urlFor
 * @param {Object} [params]
 * @return {String}
 * @exception {ActiveRoutes.Errors.NamedRouteDoesNotExistError}
 * @example
 * var routes = new ActiveRoutes([['post','/blog/post/:id',{object:'blog',method: 'post'}]]);<br/>
 * routes.urlFor({object: 'blog',method: 'post', id: 5}) == '/blog/post/5';
 */
ActiveRoutes.prototype.urlFor = function urlFor(params)
{
    var only_path = false;
    if(params.only_path){
        only_path = true;
        delete params.only_path;
    }
  
    //get a named route with no params
    if(typeof(params) == 'string')
    {
        var found = false;
        for(var i = 0; i < this.routes.length; ++i)
        {
            if(this.routes[i].name && this.routes[i].name == params)
            {
                found = i;
                break;
            }
        }
        if(found === false)
        {
            return ActiveSupport.throwError(Errors.NamedRouteDoesNotExistError,params);
        }
        else
        {
            var final_params = {};
            var found_params = ActiveSupport.clone(this.routes[found].params);
            for(var name in found_params)
            {
                final_params[name] = found_params[name];
            }
            if(typeof(arguments[1]) == 'object')
            {
                for(var name in arguments[1])
                {
                    final_params[name] = arguments[1][name];
                }
            }
            return this.urlFor(final_params);
        }
    }
    
    if(!params.method)
    {
        params.method = 'index';
    }
    
    if(this.options.camelizeMethodName)
    {
        params.method = ActiveSupport.camelize(params.method,false);
    }
    
    if(this.options.camelizeObjectName)
    {
        params.object = ActiveSupport.camelize(params.object,true);
    }
    
    //first past for exact match
    for(var i = 0; i < this.routes.length; ++i)
    {
        var route = ActiveSupport.clone(this.routes[i]);
        route.params = ActiveSupport.clone(this.routes[i].params || {});
        var path = route.path;
        if((route.params.method || '').toLowerCase() == (params.method || '').toLowerCase() && (route.params.object || '').toLowerCase() == (params.object || '').toLowerCase())
        {
            path = ActiveRoutes.performParamSubstitution(path,route,params);
            var cleaned = this.cleanPath(path,params,only_path);
            if(!cleaned.match(':'))
            {
                return cleaned;
            }
            
        }
    }
    //match that requires param replacement
    for(var i = 0; i < this.routes.length; ++i)
    {
        var route = ActiveSupport.clone(this.routes[i]);
        route.params = ActiveSupport.clone(this.routes[i].params || {});
        var path = route.path;
        if(route.params.object == params.object)
        {
            path = ActiveRoutes.performParamSubstitution(path,route,params);
            var cleaned = this.cleanPath(path,params,only_path);
            if(!cleaned.match(':'))
            {
                return cleaned;
            }
        }
    }
    return false;
};

ActiveRoutes.prototype.generateMethodsForRoute = function generateMethodsForRoute(route)
{
    var current_route_set = this;
    if(route.name)
    {
        var params_for_method_name = route.name + '_params';
        var url_for_method_name = route.name + '_url';
        var call_method_name = 'call_' + route.name;
        if(current_route_set.options.camelizeGeneratedMethods)
        {
            params_for_method_name = ActiveSupport.camelize(params_for_method_name.replace(/\_/g,'-'));
            url_for_method_name = ActiveSupport.camelize(url_for_method_name.replace(/\_/g,'-'));
            call_method_name = ActiveSupport.camelize(call_method_name.replace(/\_/g,'-'));
        }
        
        current_route_set.scope[params_for_method_name] = function generated_params_for(params){
            var final_params = {};
            for(var name in route.params || {})
            {
                final_params[name] = route.params[name];
            }
            for(var name in params)
            {
                final_params[name] = params[name];
            }
            return final_params;
        };
        
        current_route_set.scope[url_for_method_name] = function generated_url_for(params){
            return current_route_set.urlFor(current_route_set.scope[params_for_method_name](params));
        };
        
        current_route_set.scope[call_method_name] = function generated_call(params){
            return current_route_set.dispatch(current_route_set.scope[params_for_method_name](params));
        };
    }
};

})();
