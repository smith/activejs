<<<<<<< HEAD:latest/active.air.packed.js
 
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
 
var ActiveRecord = null;

if(typeof exports != "undefined"){
    exports.ActiveRecord = ActiveRecord;
}

(function() {

/**
 * @namespace {ActiveRecord}
 * @example
 * 
 * ActiveRecord.js
 * ===============
 * 
 * ActiveRecord.js is a cross browser, cross platform, stand-alone object
 * relational mapper. It shares a very similar vocabulary to the Ruby
 * ActiveRecord implementation, but uses JavaScript idioms and best
 * practices -- it is not a direct port. It can operate using an in memory
 * hash table, or with a SQL back end on the Jaxer platform (SQLite and
 * MySQL), Adobe's AIR (SQLite) and Google Gears (SQLite). Support
 * for the HTML 5 SQL storage spec is planned.
 * 
 * Setup
 * -----
 * To begin using ActiveRecord.js, you will need to include the
 * activerecord.js file and establish a connection. If you do not specify
 * a connection type, one will be automatically chosen.
 * 
 *     ActiveRecord.connect();
 * 
 * You can also specify a specific type of adapter. Jaxer requires
 * pre-configuring of the database for the entire application, and Gears
 * automatically configures the database, so simply passing the type of
 * connection is enough. In all of the SQLite implementations you can
 * optionally specify a database name (browser) or path (Jaxer):
 * 
 *     ActiveRecord.connect(ActiveRecord.Adapters.InMemory); //in JS memory
 *     ActiveRecord.connect(ActiveRecord.Adapters.JaxerMySQL); //Jaxer MySQL
 *     ActiveRecord.connect(ActiveRecord.Adapters.JaxerSQLite); //Jaxer SQLite
 *     ActiveRecord.connect(ActiveRecord.Adapters.AIR); //Adobe AIR
 *     ActiveRecord.connect(ActiveRecord.Adapters.Gears,'my_database'); //Gears or HTML5, name is optional
 *     
 * Once connected you can always execute SQL statements directly:
 * 
 *     ActiveRecord.execute('CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY, user_id, title, text)');
 *     
 * Logging (to either the Jaxer log or browser console) can be turned on by setting:
 * 
 *     ActiveRecord.logging = true;
 * 
 * InMemory Adapter
 * ----------------
 * If you are using a browser or platform that does not have access to a SQL
 * database, you can use the InMemory adapter which will store your objects
 * in memory. All features (including find by SQL) will still work, but you
 * will not be able to use the Migration features, since there is no table
 * schema. Since your objects will not persist, the second parameter to
 * establish a connection is a hash with the data you would like to use
 * in this format: {table_name: {id: row}}. The InMemory adapter will also
 * trigger three observable events that allow you to write an AJAX
 * persistence layer.
 * 
 *     ActiveRecord.connect(ActiveRecord.Adapters.InMemory,{
 *         table_one: {
 *             1: {row_data},
 *             2: {row_data}
 *         },
 *         table_two: {
 *             1: {row_data},
 *             2: {row_data}
 *         }
 *     });
 * 
 *     ActiveRecord.connection.observe('created',function(table_name,id,data){});
 *     ActiveRecord.connection.observe('updated',function(table_name,id,data){});
 *     ActiveRecord.connection.observe('destroyed',function(table_name,id){});
 *     
 * Defining Your Model
 * -------------------
 * ActiveRecord classes are created using the ActiveRecord.create method which
 * takes three arguments: the name of the table that the class will reference,
 * a field definition hash, and optionally a hash of instance methods that
 * will be added to the class. If the table does not exist it will be
 * automically created.
 *
 *     var User = ActiveRecord.create('users',{
 *         username: '',
 *         password: '',
 *         post_count: 0,
 *         profile: {
 *             type: 'TEXT',
 *             value: ''
 *         }
 *     },{
 *         getProfileWordCount: function(){
 *             return this.get('profile').split(/\s+/).length;
 *         }
 *     });
 * 
 * Class & Instance Methods
 * ------------------------
 * JavaScript does not have true static methods or classes, but in this case any
 * method of the User variable above is refered to as a class method, and any
 * method of a particular user (that the User class would find) is refered to as
 * an instance method. The most important class methods are create() and find():
 * 
 *     var jessica = User.create({
 *         username: 'Jessica',
 *         password: 'rabbit'
 *     });
 * 
 * Add new class or instance methods to all ActiveRecord models in the following
 * way:
 * 
 *     ActiveRecord.ClassMethods.myClassMethod = function(){
 *         //this === model class
 *     };
 *     ActiveRecord.InstanceMethods.myInstanceMethod = function(){
 *         // this === model instance
 *     };
 * 
 * Getters & Setters
 * -----------------
 * It is extremely important to note that all of the attributes/columns of the user
 * are accessible directly for reading (for convenience), but cannot be written
 * directly. You **must** use the set() method to set an attribute, you **should**
 * use the get() method to access all attributes, but you **must** use the get()
 * method if your attribute/column is a method of the object or a JavaScript
 * reserved keyword ('save,'initialize','default', etc).
 * 
 *     jessica.username // 'Jessica'
 *     jessica.get('username'); // 'Jessica'
 *     jessica.username = 'new username';
 *     jessica.get('username'); // 'Jessica'
 *     jessica.set('username','new username');
 *     jessica.get('username'); // 'new username'
 * 
 * When Data is Persisted
 * ----------------------
 * Data is only persisted to the database in three cases: when you explicitly call
 * save() on a record, when you call create() on a record, or create a child record
 * through a relationship (the method will contain the word "create" in this case),
 * or when you call updateAttribute() on a record. In the case of the latter, only
 * the attribute you update will be saved, the rest of the record will not be
 * persisted to the database, even if changes have been made. Calling save() may
 * add an "id" property to the record if it does not exist, but if there are no
 * errors, it's state will otherwise be unchanged. You can call refresh() on any
 * record to ensure it is not out of synch with your database at any time.
 * 
 * Finding Records
 * ---------------
 * If you created the User class using the define() method you automatically have
 * free "finder" methods:
 * 
 *     User.findByUsername('Jessica');
 *     User.findAllByPassword(''); //finds all with blank passwords
 * 
 * Otherwise you can use the base find() method, which takes a hash of options,
 * a numeric id or a complete SQL string:
 * 
 *     var posts = Post.find({
 *         all: true,
 *         order: 'id DESC',
 *         limit: 10
 *     });
 * 
 * Synchronization
 * ---------------
 * It is sometimes useful to keep records that have already been found in synch
 * with the database. Each found record has a synchronize() method that will keep
 * the values of that record in synch with the database. If you pass the parameter
 * synchronize: true to find(), all objects will have their values synchronized,
 * and in addition the result set itself will update as objects are destroyed or
 * created. Both features are relatively expensive operations, and are not
 * automatically garbage collected/stopped when the record or result set goes
 * out of scope, so you will need to explicitly stop both record and result set
 * synchronization.
 * 
 *     var aaron = User.findByName('aaron');
 *     aaron.synchronize();
 * 
 *     var aaron_clone = User.findByName('aaron');
 *     aaron_clone.set('name','Aaron!');
 *     aaron_clone.save();
 * 
 *     aaron.get('name') === 'Aaron!';
 *     aaron.stop(); //record will no longer be synchronized
 * 
 *     var users = User.find({
 *         all: true,
 *         synchronize: true
 *     });
 *     //users contains aaron
 *     aaron.destroy();
 *     //users will no longer contain aaron
 *     users.stop(); //result set will no longer be synchronized
 * 
 * Calculations (count, min, max, etc) can also be synchronized. As a second
 * parameter to the calculation function, pass a hash with a synchronize
 * property that contains a function. That function will be called when the
 * result of the calculation changes. Instead of returning the value of the
 * calculation the initial call to the calculation function will return a
 * function that will stop the synchronization.
 *
 *     var current_count;
 *     var stop = User.count({
 *         synchronize: function(updated_count){
 *             current_count = updated_count;
 *         }
 *     });
 *     var new_user = User.create({params}); //current_count incremented
 *     new_user.destroy();  //current_count decremented
 *     stop();
 *     User.create({params}); //current_count unchanged
 *
 * Lifecycle
 * ---------
 * There are 8 currently supported lifecycle events which allow granular control
 * over your data, and are convenient to build user interface components and
 * interactions around on the client side:
 * 
 * - afterFind
 * - afterInitialize
 * - beforeSave
 * - afterSave
 * - beforeCreate
 * - afterCreate
 * - beforeDestroy
 * - afterDestroy
 * 
 * beforeSave and afterSave are called when both creating (inserting) and saving
 * (updating) a record. You can observe events on all instances of a class, or
 * just a particular instnace:
 * 
 *     User.observe('afterCreate',function(user){
 *         console.log('User with id of ' + user.id + ' was created.');
 *     });
 * 
 *     var u = User.find(5);
 *     u.observe('afterDestroy',function(){
 *         //this particular user was destroyed
 *     });
 * 
 * In the example above, each user that is created will be passed to the first
 * callback. You can also call stopObserving() to remove a given observer, and
 * use the observeOnce() method (same arguments as observe()) method if needed.
 * Alternately, each event name is also a convience method and the following
 * example is functionally equivelent to the prior example:
 * 
 *     User.afterCreate(function(user){
 *         console.log('User with id of ' + user.id + ' was created.');
 *     });
 * 
 *     var u = User.find(5);
 *     u.afterDestroy(function(){
 *         //this particular user was destroyed
 *     });
 * 
 * You can stop the creation, saving or destruction of a record by returning
 * false inside any observers of the beforeCreate, beforeSave and
 * beforeDestroy events respectively:
 * 
 *     User.beforeDestroy(function(user){
 *         if(!allow_deletion_checkbox.checked){
 *             return false; //record will not be destroyed
 *         }
 *     });
 *
 * Returning null, or returning nothing is equivelent to returning true in
 * this context and will not stop the event.
 *     
 * To observe a given event on all models, you can do the following: 
 * 
 *     ActiveRecord.observe('created',function(model_class,model_instance){});
 *     
 * afterFind works differently than all of the other events. It is only available
 * to the model class, not the instances, and is called only when a result set is
 * found. A find first, or find by id call will not trigger the event.
 * 
 *     User.observe('afterFind',function(users,params){
 *         //params contains the params used to find the array of users
 *     });
 *     
 * Validation
 * ----------
 * Validation is performed on each model instance when create() or save() is
 * called. Validation can be applied either by using pre defined validations
 * (validatesPresenceOf, validatesLengthOf, more will be implemented soon), or by
 * defining a valid() method in the class definition. (or by both). If a record is
 * not valid, save() will return false. create() will always return the record,
 * but in either case you can call getErrors() on the record to determine if
 * there are any errors present.
 * 
 *     User = ActiveRecord.define('users',{
 *         username: '',
 *         password: ''
 *     },{
 *         valid: function(){
 *             if(User.findByUsername(this.username)){
 *                 this.addError('The username ' + this.username + ' is already taken.');
 *             }
 *         }
 *     });
 * 
 *     User.validatesPresenceOf('password');
 * 
 *     var user = User.build({
 *         'username': 'Jessica'
 *     });
 * 
 *     user.save(); //false
 *     var errors = user.getErrors(); //contains a list of the errors that occured
 *     user.set('password','rabbit');
 *     user.save(); //true
 *     
 * Relationships
 * -------------
 * Relationships are declared with one of three class methods that are available
 *  to all models:
 * 
 * - belongsTo
 * - hasMany
 * - hasOne
 * 
 * The related model name can be specified in a number of ways, assuming that you
 * have a Comment model already declared, any of the following would work:
 * 
 *     User.hasMany(Comment)
 *     User.hasMany('Comment')
 *     User.hasMany('comment')
 *     User.hasMany('comments')
 * 
 * Each relationship adds various instance methods to each instance of that
 * model. This differs significantly from the Rails "magical array" style of
 * handling relationship logic:
 * 
 * Rails:
 * 
 *     u = User.find(5)
 *     u.comments.length
 *     u.comments.create :title => 'comment title'
 * 
 * ActiveRecord.js:
 * 
 *     var u = User.find(5);
 *     u.getCommentList().length;
 *     u.createComment({title: 'comment title'});
 * 
 * You can name the relationship (and thus the generate methods) by passing
 * a name parameter:
 * 
 *     TreeNode.belongsTo(TreeNode,{name: 'parent'});
 *     TreeNode.hasMany(TreeNode,{name: 'child'});
 *     //instance now have, getParent(), getChildList(), methods
 * 
 * Missing Features
 * ----------------
 * ActiveRecord.js will not support all of the advanced features of the Ruby
 * ActiveRecord implementation, but several key features are currently missing
 * and will be added soon:
 * 
 * - complete set of default validations from ActiveRecord::Validations::ClassMethods
 * - ActsAsList
 * - ActsAsTree
 * - hasMany :through (which will likely be the only supported many to many relationship)
 * 
 */
ActiveRecord = {
    /**
     * Defaults to false.
     * @alias ActiveRecord.logging
     * @property {Boolean}
     */
    logging: false,
    /**
     * Will automatically create a table when create() is called. Defaults to true.
     * @alias ActiveRecord.autoMigrate
     * @property {Boolean}
     */
     autoMigrate: true,
    /**
     * Tracks the number of records created.
     * @alias ActiveRecord.internalCounter
     * @property {Number}
     */
    internalCounter: 0,
    /**
     * Contains model_name, ActiveRecord.Class pairs.
     * @alias ActiveRecord.Models
     * @property {Object} 
     */
    Models: {},
    /**
     * @namespace {ActiveRecord.Class} Each generated class will inherit all of
     * the methods in this class, in addition to the ones dynamically generated
     * by finders, validators, relationships, or your own definitions.
     */
    /**
     * Contains all methods that will become available to ActiveRecord classes.
     * @alias ActiveRecord.ClassMethods
     * @property {Object} 
     */
    ClassMethods: {},
    /**
     * @namespace {ActiveRecord.Instance} Each found instance will inherit all of
      * the methods in this class, in addition to the ones dynamically generated
      * by finders, validators, relationships, or your own definitions.
     */
    /**
     * Contains all methods that will become available to ActiveRecord instances.
     * @alias ActiveRecord.InstanceMethods
     * @property {Object}
     */
    InstanceMethods: {},
    /**
     * Creates an ActiveRecord class, returning the class and storing it inside
     * ActiveRecord.Models[model_name]. model_name is a singularized,
     * capitalized form of table name.
     * @example
     *     var User = ActiveRecord.create('users');
     *     var u = User.find(5);
     * @alias ActiveRecord.create
     * @param {String} table_name
     * @param {Object} fields
     *      Should consist of column name, default value pairs. If an empty
     *      array or empty object is set as the default, any arbitrary data
     *      can be set and will automatically be serialized when saved. To
     *      specify a specific type, set the value to an object that contains
     *      a "type" key, with optional "length" and "value" keys.
     * @param {Object} [methods]
     * @return {Object}
     */
    create: function create(options, fields, methods)
    {
        if (!ActiveRecord.connection)
        {
            return ActiveSupport.throwError(ActiveRecord.Errors.ConnectionNotEstablished);
        }
        
        if(typeof(options) === 'string')
        {
            options = {
                tableName: options
            };
        }

        //determine proper model name
        var model = null;
        if(!options.modelName)
        {
            var model_name = ActiveSupport.camelize(ActiveSupport.Inflector.singularize(options.tableName) || options.tableName);
            options.modelName = model_name.charAt(0).toUpperCase() + model_name.substring(1);
        }

        //constructor
        model = ActiveRecord.Models[options.modelName] = function initialize(data)
        {
            this.modelName = this.constructor.modelName;
            this.tableName = this.constructor.tableName;
            this.primaryKeyName = this.constructor.primaryKeyName;
            this._object = {};
            for(var key in data)
            {
                //third param is to supress notifications on set
                this.set(key,data[key],true);
            }
            this._errors = [];
            for(var key in this.constructor.fields)
            {
                if(!this.constructor.fields[key].primaryKey)
                {
                    var value = ActiveRecord.connection.fieldOut(this.constructor.fields[key],this.get(key));
                    if(Migrations.objectIsFieldDefinition(value))
                    {
                        value = value.value;
                    }
                    //don't supress notifications on set since these are the processed values
                    this.set(key,value);
                }
            }
            //performance optimization if no observers
            this.notify('afterInitialize', data);
        };
        model.modelName = options.modelName;
        model.tableName = options.tableName;
        model.primaryKeyName = 'id';
        
        //mixin instance methods
        ActiveSupport.extend(model.prototype, ActiveRecord.InstanceMethods);

        //user defined take precedence
        if(methods && typeof(methods) !== 'function')
        {
            ActiveSupport.extend(model.prototype, methods || {});
        }

        //mixin class methods
        ActiveSupport.extend(model, ActiveRecord.ClassMethods);

        //add lifecycle abilities
        ActiveEvent.extend(model);
        
        //clean and set field definition
        if(!fields)
        {
            fields = {};
        }
        var custom_primary_key = false;
        for(var field_name in fields)
        {
            if(typeof(fields[field_name]) === 'object' && fields[field_name].type && !('value' in fields[field_name]))
            {
                fields[field_name].value = null;
            }
            if(typeof(fields[field_name]) === 'object' && fields[field_name].primaryKey)
            {
                custom_primary_key = field_name;
            }
        }
        if(!custom_primary_key)
        {
            fields['id'] = {
                primaryKey: true
            };
        }
        model.fields = fields;
        if(custom_primary_key)
        {
            model.primaryKeyName = custom_primary_key;
        }
        
        //generate finders
        for(var key in model.fields)
        {
            Finders.generateFindByField(model,key);
            Finders.generateFindAllByField(model,key);
        }
        
        //create table for model if autoMigrate enabled
        if(ActiveRecord.autoMigrate)
        {
            Migrations.Schema.createTable(options.tableName,ActiveSupport.clone(model.fields));
        }
        
        return model;
    }
};
ActiveRecord.define = ActiveRecord.create;

/**
 * If the table for your ActiveRecord does not exist, this will define the
 * ActiveRecord and automatically create the table.
 * @alias ActiveRecord.define
 * @param {String} table_name
 * @param {Object} fields
 *      Should consist of column name, default value pairs. If an empty array or empty object is set as the default, any arbitrary data can be set and will automatically be serialized when saved. To specify a specific type, set the value to an object that contains a "type" key, with optional "length" and "value" keys.
 * @param {Object} [methods]
 * @param {Function} [readyCallback]
 *      Must be specified if running in asynchronous mode.
 * @return {Object}
 * @example
 * 
 *     var User = ActiveRecord.define('users',{
 *         name: '',
 *         password: '',
 *         comment_count: 0,
 *         profile: {
 *             type: 'text',
 *             value: ''
 *         },
 *         serializable_field: {}
 *     });
 *     var u = User.create({
 *         name: 'alice',
 *         serializable_field: {a: '1', b: '2'}
 *     }); 
 */
 
ActiveEvent.extend(ActiveRecord);

ActiveRecord.eventNames = [
    'afterInitialize',
    'afterFind',
    'beforeSave',
    'afterSave',
    'beforeCreate',
    'afterCreate',
    'beforeDestroy',
    'afterDestroy'
];

//add lifecycle method names to classes and models (model_instance.beforeDestory() model_class.beforeDestroy())
(function(){
    for (var i = 0; i < ActiveRecord.eventNames.length; ++i)
    {
        ActiveRecord.ClassMethods[ActiveRecord.eventNames[i]] = ActiveRecord.InstanceMethods[ActiveRecord.eventNames[i]] = ActiveSupport.curry(function event_name_delegator(event_name, observer){
            return this.observe(event_name, observer);
        },ActiveRecord.eventNames[i]);
    }
})();

/**
 * Observe an event on all models. observer will be called with model_class, model_instance.
 * @alias ActiveRecord.observe
 * @param {String} event_name
 * @param {Function} observer
 * @return {Array} Array of observers 
 */
ActiveRecord.old_observe = ActiveRecord.observe;
ActiveRecord.observe = function observe(event_name,observer)
{
    for(var i = 0; i < ActiveRecord.eventNames.length; ++i)
    {
        if(ActiveRecord.eventNames[i] === event_name)
        {
            var observers = [];
            var model_observer;
            for(var model_name in ActiveRecord.Models)
            {
                model_observer = ActiveSupport.curry(observer,ActiveRecord.Models[model_name]);
                observers.push(model_observer);
                ActiveRecord.Models[model_name].observe(event_name,model_observer);
            }
            return observers;
        }
    }
    return ActiveRecord.old_observe(event_name,observer);
};

//add lifecycle method names to ActiveRecord (ActiveRecord.beforeDestory)
(function(){
    for (var i = 0; i < ActiveRecord.eventNames.length; ++i)
    {
        ActiveRecord[ActiveRecord.eventNames[i]] = ActiveSupport.curry(function event_name_delegator(event_name, observer){
            ActiveRecord.observe(event_name, observer);
        },ActiveRecord.eventNames[i]);
    }
})();

var Errors = {
    /**
     * @alias ActiveRecord.Errors.ConnectionNotEstablished
     * @property {String} Error that will be thrown if ActiveRecord is used without a connection.
     */
    ConnectionNotEstablished: ActiveSupport.createError('No ActiveRecord connection is active.'),
    /**
     * @alias ActiveRecord.Errors.MethodDoesNotExist
     * @property {String} Error that will be thrown if using InMemory based adapter, and a method called inside a SQL statement cannot be found.
     */
    MethodDoesNotExist: ActiveSupport.createError('The requested method does not exist.'),
    /**
     * @alias ActiveRecord.Errors.InvalidFieldType
     * @property {String} Error that will be thrown if an unrecognized field type definition is used.
     */
    InvalidFieldType: ActiveSupport.createError('The field type does not exist:')
};

ActiveRecord.Errors = Errors;

ActiveSupport.extend(ActiveRecord.InstanceMethods,{
    /**
     * Sets a given key on the object. You must use this method to set a property, properties assigned directly (instance.key_name = value) will not persist to the database and may cause errors.
     * @alias ActiveRecord.Instance.set
     * @param {String} key
     * @param {mixed} value
     * @param {Boolean} surpress_notifications Defaults to false
     * @return {mixed} the value that was set
     */
    set: function set(key, value, surpress_notifications)
    {
        if (typeof(this[key]) !== "function")
        {
            this[key] = value;
        }
        this._object[key] = value;
        if(!surpress_notifications)
        {
            this.notify('set',key,value);
        }
    },
    /**
     * Get a given key on the object. If your field name is a reserved word, or the name of a method (save, updateAttribute, etc) you must use the get() method to access the property. For convenience non reserved words (title, user_id, etc) can be accessed directly (instance.key_name)
     * @alias ActiveRecord.Instance.get
     * @param {String} key
     * @return {mixed}
     */
    get: function get(key)
    {
        return this._object[key];
    },
    /**
     * Returns a "clean" version of the object, with just the data and no methods.
     * @alias ActiveRecord.Instance.toObject
     * @return {Object}
     */
    toObject: function toObject()
    {
        return ActiveSupport.clone(this._object);
    },
    /**
     * Returns an array of the column names that the instance contains.
     * @alias ActiveRecord.Instance.keys
     * @return {Array}
     */
    keys: function keys()
    {
        var keys_array = [];
        for(var key_name in this._object)
        {
            keys_array.push(key_name);
        }
        return keys_array;
    },
    /**
     * Returns an array of the column values that the instance contains.
     * @alias ActiveRecord.Instance.values
     * @return {Array}
     */
    values: function values()
    {
        var values_array = [];
        for(var key_name in this._object)
        {
            values_array.push(this._object[key_name]);
        }
        return values_array;
    },
    /**
     * Sets a given key on the object and immediately persists that change to the database triggering any callbacks or validation .
     * @alias ActiveRecord.Instance.updateAttribute
     * @param {String} key
     * @param {mixed} value
     */
    updateAttribute: function updateAttribute(key, value)
    {
        this.set(key, value);
        return this.save();
    },
    /**
     * Updates all of the passed attributes on the record and then calls save().
     * @alias ActiveRecord.Instance.updateAttributes
     * @param {Object} attributes
     */
    updateAttributes: function updateAttributes(attributes)
    {
        for(var key in attributes)
        {
            this.set(key, attributes[key]);
        }
        return this.save();
    },
    /**
     * Loads the most current data for the object from the database.
     * @alias ActiveRecord.Instance.reload
     * @return {Boolean}
     */
    reload: function reload()
    {
        if (!this.get(this.constructor.primaryKeyName))
        {
            return false;
        }
        var record = this.constructor.find(this.get(this.constructor.primaryKeyName));
        if (!record)
        {
            return false;
        }
        this._object = {};
        var raw = record.toObject();
        for (var key in raw)
        {
            this.set(key,raw[key]);
        }
        return true;
    },
    /**
     * Persists the object, creating or updating as nessecary. 
     * @alias ActiveRecord.Instance.save
     * @param {Boolean} force_created_mode Defaults to false, will force the
     *     record to act as if it was created even if an id property was passed.
     * @return {Boolean}
     */
    save: function save(force_created_mode)
    {
        //callbacks/proxy not working
        if (!this._valid())
        {
            return false;
        }
        //apply field in conversions
        for (var key in this.constructor.fields)
        {
            if(!this.constructor.fields[key].primaryKey)
            {
                //third param is to surpress observers
                this.set(key,ActiveRecord.connection.fieldIn(this.constructor.fields[key],this.get(key)),true);
            }
        }
        if (this.notify('beforeSave') === false)
        {
            return false;
        }
        if ('updated' in this._object)
        {
            this.set('updated',ActiveSupport.dateFormat('yyyy-mm-dd HH:MM:ss'));
        }
        if (force_created_mode || !this.get(this.constructor.primaryKeyName))
        {
            if (this.notify('beforeCreate') === false)
            {
                return false;
            }
            if ('created' in this._object)
            {
                this.set('created',ActiveSupport.dateFormat('yyyy-mm-dd HH:MM:ss'));
            }
            var id = this.get(this.constructor.primaryKeyName);
            ActiveRecord.connection.insertEntity(this.tableName, this.constructor.primaryKeyName, this.toObject());
            if(!id)
            {
                this.set(this.constructor.primaryKeyName, ActiveRecord.connection.getLastInsertedRowId());
            }
            Synchronization.triggerSynchronizationNotifications(this,'afterCreate');
            this.notify('afterCreate');
        }
        else
        {
            ActiveRecord.connection.updateEntity(this.tableName, this.constructor.primaryKeyName, this.get(this.constructor.primaryKeyName), this.toObject());
        }
        //apply field out conversions
        for (var key in this.constructor.fields)
        {
            if(!this.constructor.fields[key].primaryKey)
            {
                //third param is to surpress observers
                this.set(key,ActiveRecord.connection.fieldOut(this.constructor.fields[key],this.get(key)),true);
            }
        }
        Synchronization.triggerSynchronizationNotifications(this,'afterSave');
        this.notify('afterSave');
        return this;
    },
    /**
     * Removes the object from the database, but does not destroy the object in memory itself.
     * @alias ActiveRecord.Instance.destroy
     * @return {Boolean}
     */
    destroy: function destroy()
    {
        if (!this.get(this.constructor.primaryKeyName))
        {
            return false;
        }
        if (this.notify('beforeDestroy') === false)
        {
            return false;
        }
        ActiveRecord.connection.deleteEntity(this.tableName,this.constructor.primaryKeyName,this.get(this.constructor.primaryKeyName));
        Synchronization.triggerSynchronizationNotifications(this,'afterDestroy');
        if (this.notify('afterDestroy') === false)
        {
            return false;
        }
        return true;
    },
    /**
     * toJSON and toXML will call this instead of toObject() to get the
     * data they will serialize. By default this calls toObject(), but 
     * you can override this method to easily create custom JSON and XML
     * output.
     * @alias ActiveRecord.Instance.toSerializableObject
     * @return {Object}
     */
    toSerializableObject: function toSerializableObject()
    {
        return this.toObject();
    },
    /**
     * Serializes the record to an JSON string. If object_to_inject is passed
     * that object will override any values of the record.
     * @alias ActiveRecord.Instance.toJSON
     * @param {Object} [object_to_inject]
     * @return {String}
     */
    toJSON: function toJSON(object_to_inject)
    {
        return ActiveSupport.JSON.stringify(ActiveSupport.extend(this.toSerializableObject(),object_to_inject || {}));
    },
    /**
     * Serializes the record to an XML string. If object_to_inject is passed
     * that object will override any values of the record.
     * @alias ActiveRecord.Instance.toXML
     * @param {Object} [object_to_inject]
     * @return {String}
     */
    toXML: function toXML(object_to_inject)
    {
        return ActiveSupport.XMLFromObject(this.modelName,ActiveSupport.extend(this.toSerializableObject(),object_to_inject || {}));
    }
});
ActiveSupport.extend(ActiveRecord.ClassMethods,{
    /**
     * Find a given record, or multiple records matching the passed conditions.
     * @alias ActiveRecord.Class.find
     * @param {mixed} params
     *      Can be an integer to try and find a record by id, a complete SQL statement String, or Object of params, params may contain:
     *          select: Array of columns to select (default ['*'])
     *          where: String or Object or Array
     *          joins: String
     *          order: String
     *          limit: Number
     *          offset: Number
     *          synchronize: Boolean
     * @return {mixed}
     *      If finding a single record, response will be Boolean false or ActiveRecord.Instance. Otherwise an Array of ActiveRecord.Instance s will be returned (which may be empty).
     * @example
     *
     *     var user = User.find(5); //finds a single record
     *     var user = User.find({
     *         first: true,
     *         where: {
     *             id: 5
     *         }
     *     });
     *     var user = User.find({
     *         first: true,
     *         where: ['id = ?',5]
     *     });
     *     var users = User.find(); //finds all
     *     var users = User.find({
     *         where: 'name = "alice" AND password = "' + md5('pass') + '"',
     *         order: 'id DESC'
     *     });
     *     //using the where syntax below, the parameters will be properly escaped
     *     var users = User.find({
     *         where: {
     *             name: 'alice',
     *             password: md5('pass')
     *         }
     *         order: 'id DESC'
     *     });
     *     var users = User.find('SELECT * FROM users ORDER id DESC');
     */
    find: function find(params)
    {
        var result;
        if (!params)
        {
            params = {};
        }
        if ((params.first && typeof params.first === "boolean") || ((typeof(params) === "number" || (typeof(params) === "string" && params.match(/^\d+$/))) && arguments.length == 1))
        {
            if (params.first)
            {
                //find first
                params.limit = 1;
                result = ActiveRecord.connection.findEntities(this.tableName,params);
            }
            else
            {
                //single id
                result = ActiveRecord.connection.findEntitiesById(this.tableName,this.primaryKeyName,[params]);
            }
            if (result && result.iterate && result.iterate(0))
            {
                return this.build(result.iterate(0));
            }
            else
            {
                return false;
            }
        }
        else
        {
            result = null;
            if (typeof(params) === 'string' && !params.match(/^\d+$/))
            {
                //find by sql
                result = ActiveRecord.connection.findEntities.apply(ActiveRecord.connection,arguments);
            }
            else if (params && ((typeof(params) == 'object' && 'length' in params && 'slice' in params) || ((typeof(params) == 'number' || typeof(params) == 'string') && arguments.length > 1)))
            {
                //find by multiple ids
                var ids = ((typeof(params) == 'number' || typeof(params) == 'string') && arguments.length > 1) ? ActiveSupport.arrayFrom(arguments) : params;
                result = ActiveRecord.connection.findEntitiesById(this.tableName,this.primaryKeyName,ids);
            }
            else
            {
                //result find
                result = ActiveRecord.connection.findEntities(this.tableName,params);
            }
            var response = [];
            if (result)
            {
                result.iterate(ActiveSupport.bind(function result_iterator(row){
                    response.push(this.build(row));
                }, this));
            }
            this.resultSetFromArray(response,params);
            this.notify('afterFind',response,params);
            return response;
        }
    },
    /**
     * Deletes a given id (if it exists) calling any callbacks or validations
     * on the record. If "all" is passed as the ids, all records will be found
     * and destroyed.
     * @alias ActiveRecord.Class.destroy
     * @param {Number} id 
     * @return {Boolean}
     */
    destroy: function destroy(id)
    {
        if(id == 'all')
        {
            var instances = this.find({
                all: true
            });
            var responses = [];
            for(var i = 0; i < instances.length; ++i)
            {
                responses.push(instances[i].destroy());
            }
            return responses;
        }
        else
        {
            var instance = this.find(id);
            if(!instance)
            {
                return false;
            }
            return instance.destroy();
        }
    },
    /**
     * Identical to calling create(), but does not save the record.
     * @alias ActiveRecord.Class.build
     * @param {Object} data
     * @return {ActiveRecord.Instance}
     */
    build: function build(data)
    {
        ++ActiveRecord.internalCounter;
        var record = new this(ActiveSupport.clone(data));
        record.internalCount = parseInt(new Number(ActiveRecord.internalCounter), 10); //ensure number is a copy
        return record;
    },
    /**
     * @alias ActiveRecord.Class.create
     * @param {Object} data 
     * @return {ActiveRecord.Instance}
     * @example
     *     var u = User.create({
     *         name: 'alice',
     *         password: 'pass'
     *     });
     *     u.id //will now contain the id of the user
     */
    create: function create(data)
    {
        var record = this.build(data);
        record.save(true);
        return record;
    },
    /**
     * @alias ActiveRecord.Class.update
     * @param {Number} id
     * @param {Object} attributes
     * @return {ActiveRecord.Instance}
     * @example
     * 
     *     Article.update(3,{
     *         title: 'New Title'
     *     });
     *     //or pass an array of ids and an array of attributes
     *     Article.update([5,7],[
     *         {title: 'Title for 5'},
     *         {title: 'Title for 7'}
     *     ]);
     */
    update: function update(id, attributes)
    {
        //array of ids and array of attributes passed in
        if(typeof(id.length) !== 'undefined')
        {
            var results = [];
            for(var i = 0; i < id.length; ++i)
            {
                results.push(this.update(id[i], attributes[i]));
            }
            return results;
        }
        else
        {
            var record = this.find(id);
            if(!record)
            {
                return false;
            }
            record.updateAttributes(attributes);
            return record;
        }
    },
    /**
     * @alias ActiveRecord.Class.updateAll
     * @param {Object} updates
     *      A string of updates to make, or a Hash of column value pairs.
     * @param {String} [conditions]
     *      Optional where condition, or Hash of column name, value pairs.
     */
    updateAll: function updateAll(updates, conditions)
    {
        ActiveRecord.connection.updateMultitpleEntities(this.tableName, updates, conditions);
    },
    /**
     * @alias ActiveRecord.Class.transaction
     * @param {Function} proceed
     *      The block of code to execute inside the transaction.
     * @param {Function} [error]
     *      Optional error handler that will be called with an exception if one is thrown during a transaction. If no error handler is passed the exception will be thrown.
     * @example
     *     Account.transaction(function(){
     *         var from = Account.find(2);
     *         var to = Account.find(3);
     *         to.despoit(from.withdraw(100.00));
     *     });
     */
    transaction: function transaction(proceed,error)
    {
        try
        {
            ActiveRecord.connection.transaction(proceed);
        }
        catch(e)
        {
            if(error)
            {
                error(e);
            }
            else
            {
                return ActiveSupport.throwError(e);
            }
        }
    },
    /**
     * Extends a vanilla array with ActiveRecord.ResultSet methods allowing for
     * the construction of custom result set objects from arrays where result 
     * sets are expected. This will modify the array that is passed in and
     * return the same array object.
     * @alias ActiveRecord.Class.resultSetFromArray
     * @param {Array} result_set
     * @param {Object} [params]
     * @return {Array}
     * @example
     *     var one = Comment.find(1);
     *     var two = Comment.find(2);
     *     var result_set = Comment.resultSetFromArray([one,two]);
     */
    resultSetFromArray: function resultSetFromArray(result_set,params)
    {
        if(!params)
        {
            params = {};
        }
        for(var method_name in ResultSet.InstanceMethods)
        {
            result_set[method_name] = ActiveSupport.curry(ResultSet.InstanceMethods[method_name],result_set,params,this);
        }
        if(params.synchronize)
        {
            Synchronization.synchronizeResultSet(this,params,result_set);
        }
        return result_set;
    }
});

ActiveSupport.extend(ActiveRecord.ClassMethods,{
    processCalculationParams: function processCalculationParams(operation,params)
    {
        if(!params)
        {
            params = {};
        }
        if(typeof(params) === 'string')
        {
            params = {
                where: params
            };
        }
        return params;
    },
    performCalculation: function performCalculation(operation,params,sql_fragment)
    {
        if(params && params.synchronize)
        {
            return Synchronization.synchronizeCalculation(this,operation,params);
        }
        else
        {
            return ActiveRecord.connection.calculateEntities(this.tableName,this.processCalculationParams(operation,params),sql_fragment);
        }
    },
    /**
     * options can contain all params that find() can
     * @alias ActiveRecord.Class.count
     * @param {Object} [params] 
     * @return {Number}
     */
    count: function count(params)
    {
        return this.performCalculation('count',params,'COUNT(*)');
    },
    /**
     * options can contain all params that find() can
     * @alias ActiveRecord.Class.average
     * @param {String} column_name
     * @param {Object} [params] 
     * @return {Number}
     */
    average: function average(column_name,params)
    {
        return this.performCalculation('average',params,'AVG(' + column_name + ')');
    },
    /**
     * options can contain all params that find() can
     * @alias ActiveRecord.Class.max
     * @param {String} column_name
     * @param {Object} [params] 
     * @return {Number}
     */
    max: function max(column_name,params)
    {
        return this.performCalculation('max',params,'MAX(' + column_name + ')');
    },
    /**
     * options can contain all params that find() can
     * @alias ActiveRecord.Class.min
     * @param {String} column_name
     * @param {Object} [params] 
     * @return {Number}
     */
    min: function min(column_name,params)
    {
        return this.performCalculation('min',params,'MIN(' + column_name + ')');
    },
    /**
     * options can contain all params that find() can
     * @alias ActiveRecord.Class.sum
     * @param {String} column_name
     * @param {Object} [params]
     * @return {Number}
     */
    sum: function sum(column_name,params)
    {
        return this.performCalculation('sum',params,'SUM(' + column_name + ')');
    },
    /**
     * Returns the first record sorted by id.
     * @alias ActiveRecord.Class.first
     * @return {ActiveRecord.Instance} 
     */
    first: function first()
    {
        return this.find({
            first: true
        });
    },
    /**
     * Returns the last record sorted by id.
     * @alias ActiveRecord.Class.last
     * @return {ActiveRecord.Instance} 
     */
    last: function last()
    {
        return this.find({
            first: true,
            order: this.primaryKeyName + ' DESC'
        });
    }
});
 
 /**
 * @namespace {ActiveRecord.Adapters}
 */
 var Adapters = {};

/**
 * null if no connection is active, or the class that created the connection.
 * @alias ActiveRecord.adapter
 * @property {mixed}
 */
ActiveRecord.adapter = null;

/**
 * null if no connection is active, or the connection object.
 * @alias ActiveRecord.connection
 * @property {mixed}
 */
ActiveRecord.connection = null;

/**
 * Must be called before using ActiveRecord. If the adapter requires arguments, those must be passed in after the type of adapter.
 * @alias ActiveRecord.connect
 * @param {Object} adapter
 * @param {mixed} [args]
 * @example
 * 
 *     ActiveRecord.connect(ActiveRecord.Adapters.JaxerSQLite,'path_to_database_file');
 *     ActiveRecord.adapter === ActiveRecord.Adapters.JaxerSQLite;
 *     ActiveRecord.connection.executeSQL('SELECT * FROM sqlite_master');
 *     //or you can have ActiveRecord try to auto detect the enviornment
 *     ActiveRecord.connect();
 */
ActiveRecord.connect = function connect(adapter)
{   
    if(!adapter)
    {
        ActiveRecord.connection = Adapters.Auto.connect.apply(Adapters.Auto, ActiveSupport.arrayFrom(arguments).slice(1));
        ActiveRecord.adapter = ActiveRecord.connection.constructor;
    }
    else
    {
        ActiveRecord.adapter = adapter;
        ActiveRecord.connection = adapter.connect.apply(adapter, ActiveSupport.arrayFrom(arguments).slice(1));
    }
    ActiveEvent.extend(ActiveRecord.connection);
    if(!ActiveRecord.connection.preventConnectedNotification)
    {
        ActiveRecord.notify('connected');
    }
};

/**
 * Execute a SQL statement on the active connection. If the statement requires arguments they must be passed in after the SQL statement.
 * @alias ActiveRecord.execute
 * @param {String} sql
 * @return {mixed}
 * @example
 *
 *     ActiveRecord.execute('DELETE FROM users WHERE user_id = ?',5);
 */
ActiveRecord.execute = function execute()
{
    if (!ActiveRecord.connection)
    {
        return ActiveSupport.throwError(ActiveRecord.Errors.ConnectionNotEstablished);
    }
    return ActiveRecord.connection.executeSQL.apply(ActiveRecord.connection, arguments);
};

/**
 * Escapes a given argument for use in a SQL string. By default
 * the argument passed will also be enclosed in quotes.
 * @alias ActiveRecord.escape
 * @param {mixed} argument
 * @param {Boolean} [supress_quotes] Defaults to false.
 * @return {mixed}
 * ActiveRecord.escape(5) == 5
 * ActiveRecord.escape('tes"t') == '"tes\"t"';
 */
ActiveRecord.escape = function escape(argument,supress_quotes)
{
    var quote = supress_quotes ? '' : '"';
    return typeof(argument) == 'number'
        ? argument
        : quote + (new String(argument)).toString().replace(/\"/g,'\\"').replace(/\\/g,'\\\\').replace(/\0/g,'\\0') + quote
    ;
};

Adapters.defaultResultSetIterator = function defaultResultSetIterator(iterator)
{
    if (typeof(iterator) === 'number')
    {
        if (this.rows[iterator])
        {
            return ActiveSupport.clone(this.rows[iterator]);
        }
        else
        {
            return false;
        }
    }
    else
    {
        for (var i = 0; i < this.rows.length; ++i)
        {
            var row = ActiveSupport.clone(this.rows[i]);
            iterator(row);
        }
    }
};


Adapters.InstanceMethods = {
    setValueFromFieldIfValueIsNull: function setValueFromFieldIfValueIsNull(field,value)
    {
        //no value was passed
        if (value === null || typeof(value) === 'undefined')
        {
            //default value was in field specification
            if(Migrations.objectIsFieldDefinition(field))
            {
                var default_value = this.getDefaultValueFromFieldDefinition(field);
                if(typeof(default_value) === 'undefined')
                {
                    return ActiveSupport.throwError(Errors.InvalidFieldType,(field ? (field.type || '[object]') : 'false'));
                }
                return field.value || default_value;
            }
            //default value was set, but was not field specification 
            else
            {
                return field;
            }
        }
        return value;
    },
    getColumnDefinitionFragmentFromKeyAndColumns: function getColumnDefinitionFragmentFromKeyAndColumns(key,columns)
    {
        return key + ' ' + ((typeof(columns[key]) === 'object' && typeof(columns[key].type) !== 'undefined') ? columns[key].type : this.getDefaultColumnDefinitionFragmentFromValue(columns[key]));
    },
    getDefaultColumnDefinitionFragmentFromValue: function getDefaultColumnDefinitionFragmentFromValue(value)
    {
        if (typeof(value) === 'string')
        {
            return 'VARCHAR(255)';
        }
        if (typeof(value) === 'number')
        {
            return 'INT';
        }
        if (typeof(value) == 'boolean')
        {
            return 'TINYINT(1)';
        }
        return 'TEXT';
    },
    getDefaultValueFromFieldDefinition: function getDefaultValueFromFieldDefinition(field)
    {
        return field.value ? field.value : Migrations.fieldTypesWithDefaultValues[field.type ? field.type.replace(/\(.*/g,'').toLowerCase() : ''];
    },
    log: function log()
    {
        if(!ActiveRecord.logging)
        {
            return;
        }
        if(arguments[0])
        {
            arguments[0] = 'ActiveRecord: ' + arguments[0];
        }
        return ActiveSupport.log.apply(ActiveSupport,arguments || {});
    }
};

ActiveRecord.Adapters = Adapters;

Adapters.SQL = {
    schemaLess: false,
    insertEntity: function insertEntity(table, primary_key_name, data)
    {
        var keys = ActiveSupport.keys(data).sort();
        var values = [];
        var args = [];
        for(var i = 0; i < keys.length; ++i)
        {
            args.push(data[keys[i]]);
            values.push('?');
        }
        args.unshift("INSERT INTO " + table + " (" + keys.join(',') + ") VALUES (" + values.join(',') + ")");
        var response = this.executeSQL.apply(this,args);
        var id = data[primary_key_name] || this.getLastInsertedRowId();
        var data_with_id = ActiveSupport.clone(data);
        data_with_id[primary_key_name] = id;
        this.notify('created',table,id,data_with_id);
        return response;
    },
    updateMultitpleEntities: function updateMultitpleEntities(table, updates, conditions)
    {
        var args = [];
        if(typeof(updates) !== 'string')
        {
            var values = [];
            var keys = ActiveSupport.keys(updates).sort();
            for (var i = 0; i < keys.length; ++i)
            {
                args.push(updates[keys[i]]);
                values.push(updates[i] + " = ?");
            }
            updates = values.join(',');
        }
        args.unshift('UPDATE ' + table + ' SET ' + updates + this.buildWhereSQLFragment(conditions, args));
        return this.executeSQL.apply(this, args);
    },
    updateEntity: function updateEntity(table, primary_key_name, id, data)
    {
        var keys = ActiveSupport.keys(data).sort();
        var args = [];
        var values = [];
        for (var i = 0; i < keys.length; ++i)
        {
            args.push(data[keys[i]]);
            values.push(keys[i] + " = ?");
        }
        args.push(id);
        args.unshift("UPDATE " + table + " SET " + values.join(',') + " WHERE " + primary_key_name + " = ?");
        var response = this.executeSQL.apply(this, args);
        this.notify('updated',table,id,data);
        return response;
    },
    calculateEntities: function calculateEntities(table, params, operation)
    {
        var process_count_query_result = function process_count_query_result(response)
        {
            if(!response)
            {
                return 0;
            }
            return parseInt(ActiveRecord.connection.iterableFromResultSet(response).iterate(0)['calculation'], 10);
        };
        var args = this.buildSQLArguments(table, params, operation);
        return process_count_query_result(this.executeSQL.apply(this, args));
    },
    deleteEntity: function deleteEntity(table, primary_key_name, id)
    {
        var args, response;
        if (id === 'all')
        {
            args = ["DELETE FROM " + table];
            var ids = [];
            var ids_result_set = this.executeSQL('SELECT ' + primary_key_name + ' FROM ' + table);
            if(!ids_result_set)
            {
                return null;
            }
            this.iterableFromResultSet(ids_result_set).iterate(function id_collector_iterator(row){
                ids.push(row[primary_key_name]);
            });
            response = this.executeSQL.apply(this,args);
            for(var i = 0; i < ids.length; ++i)
            {
                this.notify('destroyed',table,ids[i]);
            }
            return response;
        }
        else
        {
            args = ["DELETE FROM " + table + " WHERE " + primary_key_name + " = ?",id];
            response = this.executeSQL.apply(this,args);
            this.notify('destroyed',table,id);
            return response;
        }
    },
    findEntitiesById: function findEntityById(table, primary_key_name, ids)
    {
        var response = this.executeSQL.apply(this,['SELECT * FROM ' + table + ' WHERE ' + primary_key_name + ' IN (' + ids.join(',') + ')']);
        if (!response)
        {
            return false;
        }
        else
        {
            return ActiveRecord.connection.iterableFromResultSet(response);
        }
    },
    findEntities: function findEntities(table, params)
    {
        var args;
        if (typeof(table) === 'string' && !table.match(/^\d+$/) && typeof(params) != 'object')
        {
            args = arguments;
        }
        else
        {
            args = this.buildSQLArguments(table, params, false);
        }
        var response = this.executeSQL.apply(this,args);
        if (!response)
        {
            return false;
        }
        else
        {
            return ActiveRecord.connection.iterableFromResultSet(response);
        }
    },
    buildSQLArguments: function buildSQLArguments(table, params, calculation)
    {
        var args = [];
        var sql = 'SELECT ' + (calculation ? (calculation + ' AS calculation') : (params.select ? params.select.join(',') : '*')) + ' FROM ' + table +
            this.buildWhereSQLFragment(params.where, args) +
            (params.joins ? ' ' + params.joins : '') + 
            (params.group ? ' GROUP BY ' + params.group : '') + 
            (params.order ? ' ORDER BY ' + params.order : '') + 
            (params.offset && params.limit ? ' LIMIT ' + params.offset + ',' + params.limit : '') + 
            (!params.offset && params.limit ? ' LIMIT ' + params.limit : '');
        args.unshift(sql);
        return args;
    },
    buildWhereSQLFragment: function buildWhereSQLFragment(fragment, args)
    {
        var where, keys, i;
        if(fragment && ActiveSupport.isArray(fragment))
        {
            for(i = 1; i < fragment.length; ++i)
            {
                args.push(fragment[i]);
            }
            return ' WHERE ' + fragment[0];
        }
        else if(fragment && typeof(fragment) !== "string")
        {
            where = '';
            keys = ActiveSupport.keys(fragment);
            for(i = 0; i < keys.length; ++i)
            {
                where += keys[i] + " = ? AND ";
                var value;
                if(typeof(fragment[keys[i]]) === 'number')
                {
                    value = fragment[keys[i]];
                }
                else if(typeof(fragment[keys[i]]) == 'boolean')
                {
                    value = parseInt(new Number(fragment[keys[i]]));
                }
                else
                {
                    value = new String(fragment[keys[i]]).toString();
                }
                args.push(value);
            }
            where = ' WHERE ' + where.substring(0,where.length - 4);
        }
        else if(fragment)
        {
            where = ' WHERE ' + fragment;
        }
        else
        {
            where = '';
        }
        return where;
    },
    //schema
    dropTable: function dropTable(table_name)
    {
        return this.executeSQL('DROP TABLE IF EXISTS ' + table_name);
    },
    addIndex: function addIndex(table_name,column_names,options)
    {
        
    },
    renameTable: function renameTable(old_table_name,new_table_name)
    {
        this.executeSQL('ALTER TABLE ' + old_table_name + ' RENAME TO ' + new_table_name);
    },
    removeIndex: function removeIndex(table_name,index_name)
    {
        
    },
    addColumn: function addColumn(table_name,column_name,data_type)
    {
        return this.executeSQL('ALTER TABLE ' + table_name + ' ADD COLUMN ' + this.getColumnDefinitionFragmentFromKeyAndColumns(key,columns));
    },
    fieldIn: function fieldIn(field, value)
    {
        if(value && value instanceof Date)
        {
            return ActiveSupport.dateFormat(value,'yyyy-mm-dd HH:MM:ss');
        }
        if(Migrations.objectIsFieldDefinition(field))
        {
            field = this.getDefaultValueFromFieldDefinition(field);
        }
        value = this.setValueFromFieldIfValueIsNull(field,value);
        if (typeof(field) === 'string')
        {
            return (new String(value)).toString();
        }
        if (typeof(field) === 'number')
        {
            return (new String(value)).toString();
        }
        if(typeof(field) === 'boolean')
        {
            return (new String(parseInt(new Number(value), 10))).toString();
        }
        //array or object
        if (typeof(value) === 'object' && !ActiveRecord.Migrations.objectIsFieldDefinition(field))
        {
            return ActiveSupport.JSON.stringify(value);
        }
    },
    fieldOut: function fieldOut(field, value)
    {
        if(ActiveRecord.Migrations.objectIsFieldDefinition(field))
        {
            //date handling
            if(field.type.toLowerCase().match(/date/) && typeof(value) == 'string')
            {
                return ActiveSupport.dateFromDateTime(value);
            }
            field = this.getDefaultValueFromFieldDefinition(field);
        }
        value = this.setValueFromFieldIfValueIsNull(field,value);
        if (typeof(field) === 'string')
        {
            return value;
        }
        if(typeof(field) === 'boolean')
        {
            if(value === '0' || value === 0 || value === 'false')
            {
                value = false;
            }
            return !!value;
        }
        if (typeof(field) === 'number')
        {
            var trim = function(str)
            {
                return (new String(str)).toString().replace(/^\s+|\s+$/g,"");
            };
            return (trim(value).length > 0 && !(/[^0-9.]/).test(trim(value)) && (/\.\d/).test(trim(value))) ? parseFloat(new Number(value)) : parseInt(new Number(value), 10);
        }
        //array or object (can come from DB (as string) or coding enviornment (object))
        if ((typeof(value) === 'string' || typeof(value) === 'object') && (typeof(field) === 'object' && (typeof(field.length) !== 'undefined' || typeof(field.type) === 'undefined')))
        {
            if (typeof(value) === 'string')
            {
                return ActiveSupport.JSON.parse(value);
            }
            else
            {
                return value;
            }
        }
    },
    transaction: function transaction(proceed)
    {
        try
        {
            ActiveRecord.connection.executeSQL('BEGIN');
            proceed();
            ActiveRecord.connection.executeSQL('COMMIT');
        }
        catch(e)
        {
            ActiveRecord.connection.executeSQL('ROLLBACK');
            return ActiveSupport.throwError(e);
        }
    }
};

Adapters.SQLite = ActiveSupport.extend(ActiveSupport.clone(Adapters.SQL),{
    createTable: function createTable(table_name,columns)
    {
        var keys = ActiveSupport.keys(columns);
        var fragments = [];
        for (var i = 0; i < keys.length; ++i)
        {
            var key = keys[i];
            if(columns[key].primaryKey)
            {
                var type = columns[key].type || 'INTEGER';
                fragments.unshift(key + ' ' + type + ' PRIMARY KEY');
            }
            else
            {
                fragments.push(this.getColumnDefinitionFragmentFromKeyAndColumns(key,columns));
            }
        }
        return this.executeSQL('CREATE TABLE IF NOT EXISTS ' + table_name + ' (' + fragments.join(',') + ')');
    },
    dropColumn: function dropColumn(table_name,column_name)
    {
        this.transaction(ActiveSupport.bind(function drop_column_transaction(){
            var description = ActiveRecord.connection.iterableFromResultSet(ActiveRecord.connection.executeSQL('SELECT * FROM sqlite_master WHERE tbl_name = "' + table_name + '"')).iterate(0);
            var temp_table_name = 'temp_' + table_name;
            ActiveRecord.execute(description['sql'].replace(new RegExp('^CREATE\s+TABLE\s+' + table_name),'CREATE TABLE ' + temp_table_name).replace(new RegExp('(,|\()\s*' + column_name + '[\s\w]+(\)|,)'),function(){
                return (args[1] == '(' ? '(' : '' ) + args[2];
            }));
            ActiveRecord.execute('INSERT INTO ' + temp_table_name + ' SELECT * FROM ' + table_name);
            this.dropTable(table_name);
            this.renameTable(temp_table_name,table_name);
        },this));
    }
});

/**
 * In memory, non persistent storage.
 * @alias ActiveRecord.Adapters.InMemory
 * @property {ActiveRecord.Adapter}
 */
Adapters.InMemory = function InMemory(storage){
    this.storage = typeof(storage) === 'string' ? ActiveSupport.JSON.parse(storage) : (storage || {});
    this.lastInsertId = null;
};

ActiveSupport.extend(Adapters.InMemory.prototype,Adapters.InstanceMethods);

ActiveSupport.extend(Adapters.InMemory.prototype,{
    schemaLess: true,
    entityMissing: function entityMissing(id){
        return {};
    },
    serialize: function serialize()
    {
        return ActiveSupport.JSON.stringify(this.storage);
    },
    executeSQL: function executeSQL(sql)
    {
        ActiveRecord.connection.log('Adapters.InMemory could not execute SQL:' + sql);
    },
    insertEntity: function insertEntity(table, primary_key_name, data)
    {
        this.setupTable(table);
        var max = 1;
        var table_data = this.storage[table];
        if(!data.id)
        {
            for(var id in table_data)
            {
                if(parseInt(id, 10) >= max)
                {
                    max = parseInt(id, 10) + 1;
                }
            }
            data.id = max;
        }
        this.lastInsertId = data.id;
        this.storage[table][data.id] = data;
        this.notify('created',table,data.id,data);
        return true;
    },
    getLastInsertedRowId: function getLastInsertedRowId()
    {
        return this.lastInsertId;
    },
    updateMultitpleEntities: function updateMultitpleEntities(table, updates, conditions)
    {
        
    },
    updateEntity: function updateEntity(table, primary_key_name, id, data)
    {
        this.setupTable(table);
        this.storage[table][id] = data;
        this.notify('updated',table,id,data);
        return true;
    },
    calculateEntities: function calculateEntities(table, params, operation)
    {
        this.setupTable(table);
        var entities = this.findEntities(table,params);
        var parsed_operation = operation.match(/([A-Za-z]+)\(([^\)]+)\)/);
        var operation_type = parsed_operation[1].toLowerCase();
        var column_name = parsed_operation[2];
        switch(operation_type){
            case 'count':
                return entities.length;
            case 'max':
                var max = 0;
                for(var i = 0; i < entities.length; ++i)
                {
                    if(parseInt(entities[i][column_name], 10) > max)
                    {
                        max = parseInt(entities[i][column_name], 10);
                    }
                }
                return max;
            case 'min':
                var min = 0;
                if(entities[0])
                {
                    min = entities[0][column_name];
                }
                for(var i = 0; i < entities.length; ++i)
                {
                    if(entities[i][column_name] < min)
                    {
                        min = entities[i][column_name];
                    }
                }
                return min;
            case 'avg':
            case 'sum':
                var sum = 0;
                for(var i = 0; i < entities.length; ++i)
                {
                    sum += entities[i][column_name];
                }
                return operation_type === 'avg' ? sum / entities.length : sum;
        }
    },
    deleteEntity: function deleteEntity(table, primary_key_name, id)
    {
        this.setupTable(table);
        if(!id || id === 'all')
        {
            for(var id_to_be_deleted in this.storage[table])
            {
                this.notify('destroyed',table,id_to_be_deleted);
            }
            this.storage[table] = {};
            return true;
        }
        else if(this.storage[table][id])
        {
            delete this.storage[table][id];
            this.notify('destroyed',table,id);
            return true;
        }
        return false;
    },
    findEntitiesById: function findEntitiesById(table, primary_key_name, ids)
    {
        var table_data = this.storage[table];
        var response = [];
        for(var i = 0; i < ids.length; ++i)
        {
            var id = parseInt(ids[i],10);
            if(table_data[id])
            {
                response.push(table_data[id]);
            }
        }
        return this.iterableFromResultSet(response);
    },
    findEntities: function findEntities(table, params)
    {
        if (typeof(table) === 'string' && !table.match(/^\d+$/) && typeof(params) != 'object')
        {
            //find by SQL

            //replace ? in SQL strings
            var sql = table;
            var sql_args = ActiveSupport.arrayFrom(arguments).slice(1);
            for(var i = 0; i < sql_args.length; ++i)
            {
                sql = sql.replace(/\?/,ActiveRecord.escape(sql_args[i]));
            }
            var response = this.paramsFromSQLString(sql);
            table = response[0];
            params = response[1];
        }
        else if(typeof(params) === 'undefined')
        {
            params = {};
        }
        this.setupTable(table);
        var entity_array = [];
        var table_data = this.storage[table];
        if(params && params.where && params.where.id)
        {
            if(table_data[parseInt(params.where.id, 10)])
            {
                entity_array.push(table_data[parseInt(params.where.id, 10)]);
            }
        }
        else
        {
            for(var id in table_data)
            {
                entity_array.push(table_data[id]);
            }
        }
        var filters = [];
        if(params && params.group)
        {
            filters.push(this.createGroupBy(params.group));
        }
        if(params && params.where)
        {
            filters.push(this.createWhere(params.where));
        }
        if(params && params.order)
        {
            filters.push(this.createOrderBy(params.order));
        }
        if(params && params.limit || params.offset)
        {
            filters.push(this.createLimit(params.limit,params.offset));
        }
        for(var i = 0; i < filters.length; ++i)
        {
            entity_array = filters[i](entity_array);
        }
        return this.iterableFromResultSet(entity_array);
    },
    paramsFromSQLString: function paramsFromSQLString(sql)
    {
        var params = {};
        var select = /\s*SELECT\s+.+\s+FROM\s+(\w+)\s+/i;
        var select_match = sql.match(select); 
        var table = select_match[1];
        sql = sql.replace(select,'');
        var fragments = [
            ['limit',/(^|\s+)LIMIT\s+(.+)$/i],
            ['order',/(^|\s+)ORDER\s+BY\s+(.+)$/i],
            ['group',/(^|\s+)GROUP\s+BY\s+(.+)$/i],
            ['where',/(^|\s+)WHERE\s+(.+)$/i]
        ];
        for(var i = 0; i < fragments.length; ++i)
        {
            var param_name = fragments[i][0];
            var matcher = fragments[i][1];
            var match = sql.match(matcher);
            if(match)
            {
                params[param_name] = match[2];
                sql = sql.replace(matcher,'');
            }
        }
        return [table,params];
    },
    transaction: function transaction(proceed)
    {
        var backup = {};
        for(var table_name in this.storage)
        {
            backup[table_name] = ActiveSupport.clone(this.storage[table_name]);
        }
        try
        {
            proceed();
        }
        catch(e)
        {
            this.storage = backup;
            return ActiveSupport.throwError(e);
        }
    },
    /* PRVIATE */
    iterableFromResultSet: function iterableFromResultSet(result)
    {
        result.iterate = function iterate(iterator)
        {
            if (typeof(iterator) === 'number')
            {
                if (this[iterator])
                {
                    return ActiveSupport.clone(this[iterator]);
                }
                else
                {
                    return false;
                }
            }
            else
            {
                for (var i = 0; i < this.length; ++i)
                {
                    var row = ActiveSupport.clone(this[i]);
                    iterator(row);
                }
            }
        };
        return result;
    },
    setupTable: function setupTable(table)
    {
        if(!this.storage[table])
        {
            this.storage[table] = {};
        }
    },
    createWhere: function createWhere(where)
    {   
        if(ActiveSupport.isArray(where))
        {
            var where_fragment = where[0];
            for(var i = 1; i < where.length; ++i)
            {
                where_fragment = where_fragment.replace(/\?/,ActiveRecord.escape(where[i]));
            }
            where = where_fragment;
        }
        if(typeof(where) === 'string')
        {
            return function json_result_where_processor(result_set)
            {
                var response = [];
                var where_parser = new WhereParser();
                var abstract_syntax_tree = where_parser.parse(where);
                for(var i = 0; i < result_set.length; ++i)
                {
                    if(abstract_syntax_tree.execute(result_set[i],Adapters.InMemory.method_call_handler))
                    {
                        response.push(result_set[i]);
                    }
                }
                return response;
            };
        }
        else
        {
            return function json_result_where_processor(result_set)
            {
                var response = [];
                for(var i = 0; i < result_set.length; ++i)
                {
                    var included = true;
                    for(var column_name in where)
                    {
                        if((new String(result_set[i][column_name]).toString()) != (new String(where[column_name]).toString()))
                        {
                            included = false;
                            break;
                        }
                    }
                    if(included)
                    {
                        response.push(result_set[i]);
                    }
                }
                return response;
            };
        }
    },
    createLimit: function createLimit(limit,offset)
    {
        return function json_result_limit_processor(result_set)
        {
            return result_set.slice(offset || 0,limit);
        };
    },
    createGroupBy: function createGroupBy(group_by)
    {
        if(!group_by || group_by == '')
        {
            return function json_result_group_by_processor(result_set)
            {
                return result_set;
            }
        }
        var group_key = group_by.replace(/(^[\s]+|[\s]+$)/g,'');
        return function json_result_group_by_processor(result_set)
        {
            var response = [];
            var indexed_by_group = {};
            for(var i = 0; i < result_set.length; ++i)
            {
                indexed_by_group[result_set[i][group_key]] = result_set[i];
            }
            for(var group_key_value in indexed_by_group)
            {
                response.push(indexed_by_group[group_key_value]);
            }
            return response;
        }
    },
    createOrderBy: function createOrderBy(order_by)
    {
        if(!order_by || order_by === '')
        {
            return function json_result_order_by_processor(result_set)
            {
                return result_set;
            };
        }
        var order_statements = order_by.split(',');
        var trimmed_order_statements = [];
        for(var i = 0; i < order_statements.length; ++i)
        {
            trimmed_order_statements.push(order_statements[i].replace(/(^[\s]+|[\s]+$)/g,'').replace(/[\s]{2,}/g,'').toLowerCase());
        }
        return function json_result_order_by_processor(result_set)
        {
            for(var i = 0; i < trimmed_order_statements.length; ++i)
            {
                var trimmed_order_statements_bits = trimmed_order_statements[i].split(/\s/);
                var column_name = trimmed_order_statements_bits[0];
                var reverse = trimmed_order_statements_bits[1] && trimmed_order_statements_bits[1] === 'desc';
                result_set = result_set.sort(function result_set_sorter(a,b){
                    return a[column_name] < b[column_name] ? -1 : a[column_name] > b[column_name] ? 1 : 0;
                });
                if(reverse)
                {
                    result_set = result_set.reverse();
                }
            }
            return result_set;
        };
    },
    //schema
    createTable: function createTable(table_name,columns)
    {
        if(!this.storage[table_name])
        {
            this.storage[table_name] = {};
        }
    },
    dropTable: function dropTable(table_name)
    {
        delete this.storage[table_name];
    },
    addColumn: function addColumn(table_name,column_name,data_type)
    {
        return; //no action needed
    },
    removeColumn: function removeColumn(table_name,column_name)
    {
        return; //no action needed
    },
    addIndex: function addIndex(table_name,column_names,options)
    {
        return; //no action needed
    },
    removeIndex: function removeIndex(table_name,index_name)
    {
        return; //no action needed
    },
    fieldIn: function fieldIn(field, value)
    {
        if(value && value instanceof Date)
        {
            return ActiveSupport.dateFormat(value,'yyyy-mm-dd HH:MM:ss');
        }
        if(Migrations.objectIsFieldDefinition(field))
        {
            field = this.getDefaultValueFromFieldDefinition(field);
        }
        value = this.setValueFromFieldIfValueIsNull(field,value);
        return value;
    },
    fieldOut: function fieldOut(field, value)
    {
        if(Migrations.objectIsFieldDefinition(field))
        {
            //date handling
            if(field.type.toLowerCase().match(/date/) && typeof(value) == 'string')
            {
                return ActiveSupport.dateFromDateTime(value);
            }
            field = this.getDefaultValueFromFieldDefinition(field);
        }
        value = this.setValueFromFieldIfValueIsNull(field,value);
        return value;
    }
});

Adapters.InMemory.method_call_handler = function method_call_handler(name,row,args)
{
    if(!Adapters.InMemory.MethodCallbacks[name])
    {
        name = name.toLowerCase().replace(/\_[0-9A-Z-a-z]/g,function camelize_underscores(match){
            return match.toUpperCase();
        });
    }
    if(!Adapters.InMemory.MethodCallbacks[name])
    {
        return ActiveSupport.throwError(Errors.MethodDoesNotExist);
    }
    else
    {
        return Adapters.InMemory.MethodCallbacks[name].apply(Adapters.InMemory.MethodCallbacks[name],[row].concat(args || []));
    }
};
Adapters.InMemory.MethodCallbacks = (function(){
    var methods = {};
    var math_methods = ['abs','acos','asin','atan','atan2','ceil','cos','exp','floor','log','max','min','pow','random','round','sin','sqrt','tan'];
    for(var i = 0; i < math_methods.length; ++i)
    {
        methods[math_methods[i]] = (function math_method_generator(i){
            return function generated_math_method(){
                return Math[math_methods[i]].apply(Math.math_methods[i],ActiveSupport.arrayFrom(arguments).slice(1));
            };
        })(i);
    }
    return methods;
})();

Adapters.InMemory.connect = function(storage){
  return new Adapters.InMemory(storage || {});
};
 
/**
 * Default adapter, will try to automatically pick the appropriate adapter
 * for the current environment.
 * @alias ActiveRecord.Adapters.Auto
 * @property {ActiveRecord.Adapter}
 */
Adapters.Auto = {};
Adapters.Auto.connect = function connect()
{
    if(typeof(Jaxer) !== 'undefined')
    {
        if(Jaxer.DB.connection.constructor == Jaxer.DB.MySQL.Connection)
        {
            return Adapters.JaxerMySQL.connect.apply(Adapters.JaxerMySQL.connect,arguments);
        }
        else
        {
            return Adapters.JaxerSQLite.connect.apply(Adapters.JaxerSQLite.connect,arguments);
        }
    }
    else if(typeof(air) !== 'undefined')
    {
        return Adapters.AIR.connect.apply(Adapters.AIR.connect,arguments);
    }
    else
    {
        try{
            return Adapters.Gears.connect.apply(Adapters.Gears.connect,arguments);
        }catch(e){
            return Adapters.InMemory.connect.apply(Adapters.InMemory.connect,arguments);
        }
    }
};

//var WhereLexer;
var WhereParser;

//(function() {

// token types
var $c$ = 0,
    ERROR              = -1,
    AND                = $c$++,
    COMMA              = $c$++,
    EQUAL              = $c$++,
    FALSE              = $c$++,
    GREATER_THAN       = $c$++,
    GREATER_THAN_EQUAL = $c$++,
    IDENTIFIER         = $c$++,
    IN                 = $c$++,
    LESS_THAN          = $c$++,
    LESS_THAN_EQUAL    = $c$++,
    LPAREN             = $c$++,
    NOT_EQUAL          = $c$++,
    NUMBER             = $c$++,
    RPAREN             = $c$++,
    STRING             = $c$++,
    TRUE               = $c$++,
    OR                 = $c$++,
    WHITESPACE         = $c$++;

// this is here mostly for debugging messages
var TypeMap = [];
TypeMap[AND]                = "AND";
TypeMap[COMMA]              = "COMMA";
TypeMap[EQUAL]              = "EQUAL";
TypeMap[FALSE]              = "FALSE";
TypeMap[GREATER_THAN]       = "GREATER_THAN";
TypeMap[GREATER_THAN_EQUAL] = "GREATER_THAN_EQUAL";
TypeMap[IDENTIFIER]         = "IDENTIFIER";
TypeMap[IN]                 = "IN";
TypeMap[LESS_THAN]          = "LESS_THAN";
TypeMap[LESS_THAN_EQUAL]    = "LESS_THAN_EQUAL";
TypeMap[LPAREN]             = "LPAREN";
TypeMap[NOT_EQUAL]          = "NOT_EQUAL";
TypeMap[NUMBER]             = "NUMBER";
TypeMap[RPAREN]             = "RPAREN";
TypeMap[STRING]             = "STRING";
TypeMap[TRUE]               = "TRUE";
TypeMap[OR]                 = "OR";
TypeMap[WHITESPACE]         = "WHITESPACE";

// map operators and keywords to their propery type
var OperatorMap = {
    "&&":    AND,
    ",":     COMMA,
    "||":    OR,
    "<":     LESS_THAN,
    "<=":    LESS_THAN_EQUAL,
    "=":     EQUAL,
    "!=":    NOT_EQUAL,
    ">":     GREATER_THAN,
    ">=":    GREATER_THAN_EQUAL,
    "(":     LPAREN,
    ")":     RPAREN
};
var KeywordMap = {
    "and":   AND,
    "false": FALSE,
    "in":    IN,
    "or":    OR,
    "true":  TRUE
};

// Lexer token patterns
var WHITESPACE_PATTERN = /^\s+/;
var IDENTIFIER_PATTERN = /^[a-zA-Z][a-zA-Z]*/;
var OPERATOR_PATTERN   = /^(?:&&|\|\||<=|<|=|!=|>=|>|,|\(|\))/i;
var KEYWORD_PATTERN    = /^(true|or|in|false|and)\b/i;
var STRING_PATTERN     = /^(?:'(\\.|[^'])*'|"(\\.|[^"])*")/;
var NUMBER_PATTERN     = /^[1-9][0-9]*/;

// Current lexeme to parse
var currentLexeme;

// *** Lexeme class ***

/*
 * Lexeme
 * 
 * @param {Number} type
 * @param {String} text
 */
function Lexeme(type, text)
{
    this.type = type;
    this.typeName = null;
    this.text = text;
}

/*
 * toString
 * 
 * @return {String}
 */
Lexeme.prototype.toString = function toString()
{
    if (this.typeName) 
    {
        return "[" + this.typeName + "]~" + this.text + "~";
    }
    else 
    {
        return "[" + this.type + "]~" + this.text + "~";
    }
};

// *** Lexer class ***

/*
 * WhereLexer
 */
function WhereLexer()
{
    // initialize
    this.setSource(null);
}

/*
 * setSource
 * 
 * @param {String} source
 */
WhereLexer.prototype.setSource = function setSource(source)
{
    this.source = source;
    this.offset = 0;
    this.length = (source !== null) ? source.length : 0;

    currentLexeme = null;
};

/*
 * advance
 */
WhereLexer.prototype.advance = function advance()
{
    var inWhitespace = true;
    var result = null;

    while (inWhitespace) 
    {
        // assume not in whitespace
        inWhitespace = false;

        // clear possible last whitespace result
        result = null;

        if (this.offset < this.length) 
        {
            var match, text, type;

            // NOTE: [KEL] Switching on the first character may speed things up
            // here.

            if ((match = WHITESPACE_PATTERN.exec(this.source)) !== null)
            {
                result = new Lexeme(WHITESPACE, match[0]);
                inWhitespace = true;
            }
            else if ((match = OPERATOR_PATTERN.exec(this.source)) !== null) 
            {
                text = match[0];
                type = OperatorMap[text.toLowerCase()];

                result = new Lexeme(type, text);
            }
            else if ((match = KEYWORD_PATTERN.exec(this.source)) !== null) 
            {
                text = match[0];
                type = KeywordMap[text.toLowerCase()];

                result = new Lexeme(type, text);
            }
            else if ((match = STRING_PATTERN.exec(this.source)) !== null) 
            {
                result = new Lexeme(STRING, match[0]);
            }
            else if ((match = NUMBER_PATTERN.exec(this.source)) !== null) 
            {
                result = new Lexeme(NUMBER, match[0]);
            }
            else if ((match = IDENTIFIER_PATTERN.exec(this.source)) !== null) 
            {
                result = new Lexeme(IDENTIFIER, match[0]);
            }
            else
            {
                result = new Lexeme(ERROR, this.source);
            }

            // assign type name, if we have one
            if (TypeMap[result.type]) 
            {
                result.typeName = TypeMap[result.type];
            }

            // update source state
            var length = result.text.length;
            this.offset += length;
            this.source = this.source.substring(length);
        }
    }

    // expose result
    currentLexeme = result;

    return result;
};

// Binary operator node

/*
 * BinaryOperatorNode
 * 
 * @param {Node} identifier
 * @param {Number} identifier
 * @param {Node} identifier
 */
function BinaryOperatorNode(lhs, operator, rhs)
{
    this.lhs = lhs;
    this.operator = operator;
    this.rhs = rhs;
}

/*
 * execute
 * 
 * @param {Object} row
 * @param {Function} functionProvider
 */
BinaryOperatorNode.prototype.execute = function execute(row, functionProvider)
{
    var result = null;
    var lhs = this.lhs.execute(row, functionProvider);

    if (this.operator == IN)
    {
        // assume failure
        result = false;

        // see if the lhs value is in the rhs list
        for (var i = 0; i < this.rhs.length; i++)
        {
            var rhs = this.rhs[i].execute(row, functionProvider);

            if (lhs == rhs)
            {
                result = true;
                break;
            }
        }
    }
    else
    {
        var rhs = this.rhs.execute(row, functionProvider);
        
        switch (this.operator)
        {
            case EQUAL:
                result = (lhs === rhs);
                break;
                
            case NOT_EQUAL:
                result = (lhs !== rhs);
                break;
                
            case LESS_THAN:
                result = (lhs < rhs);
                break;
                
            case LESS_THAN_EQUAL:
                result = (lhs <= rhs);
                break;
                
            case GREATER_THAN:
                result = (lhs > rhs);
                break;
                
            case GREATER_THAN_EQUAL:
                result = (lhs >= rhs);
                break;
                
            case AND:
                result = (lhs && rhs);
                break;
                
            case OR:
                result = (lhs || rhs);
                break;
                
            default:
                return ActiveSupport.throwError(new Error("Unknown operator type: " + this.operator));
        }
    }
    
    return result;
};

// Identifer node

/*
 * Parser.IdentifierNode
 * 
 * @param {Object} identifier
 */
function IdentifierNode(identifier)
{
    this.identifier = identifier;
}

/*
 * execute
 * 
 * @param {Object} row
 * @param {Function} functionProvider
 */
IdentifierNode.prototype.execute = function execute(row, functionProvider)
{
    return row[this.identifier];
};

// Function node

/*
 * FunctionNode
 * 
 * @param {String} name
 * @param {Array} args
 */
function FunctionNode(name, args)
{
    this.name = name;
    this.args = args;
}

/*
 * execute
 * 
 * @param {Object} row
 * @param {Function} functionProvider
 */
FunctionNode.prototype.execute = function execute(row, functionProvider)
{
    // evaluate arguments
    var args = new Array(this.args.length);

    for (var i = 0; i < this.args.length; i++)
    {
        args[i] = this.args[i].execute(row, functionProvider);
    }

    // evaluate function and return result
    return functionProvider(this.name, row, args);
};

// Scalar node

/*
 * Parser.ScalarNode
 */
function ScalarNode(value)
{
    this.value = value;
}

/*
 * execute
 * 
 * @param {Object} row
 * @param {Function} functionProvider
 */
ScalarNode.prototype.execute = function execute(row, functionProvider)
{
    return this.value;
};


// Parser class

/*
 * WhereParser
 */
WhereParser = function WhereParser()
{
    this._lexer = new WhereLexer();
};

/*
 * parse
 * 
 * @param {String} source
 */
WhereParser.prototype.parse = function parse(source)
{
    var result = null;

    // clear current lexeme cache
    currentLexeme = null;

    // pass source to lexer
    this._lexer.setSource(source);

    // prime the lexeme pump
    this._lexer.advance();

    // parse it
    while (currentLexeme !== null)
    {
        // fast fail
        switch (currentLexeme.type)
        {
            case IDENTIFIER:
            case FALSE:
            case LPAREN:
            case NUMBER:
            case STRING:
            case TRUE:
                result = this.parseInExpression();
                break;

            default:
                throw new Error("Unrecognized starting token in where-clause:" + this._lexer.currentLexeme);
                return ActiveSupport.throwError(new Error("Unrecognized starting token in where-clause:" + this._lexer.currentLexeme));
        }
    }
    return result;
};

/*
 * parseWhereExpression
 */
WhereParser.prototype.parseInExpression = function parseInExpression()
{
    var result = this.parseOrExpression();

    while (currentLexeme !== null && currentLexeme.type === IN) 
    {
        // advance over 'in'
        this._lexer.advance();

        var rhs = [];

        if (currentLexeme !== null && currentLexeme.type === LPAREN)
        {
            // advance over '('
            this._lexer.advance();

            while (currentLexeme !== null)
            {
                rhs.push(this.parseOrExpression());

                if (currentLexeme !== null && currentLexeme.type === COMMA)
                {
                    this._lexer.advance();
                }
                else
                {
                    break;
                }
            }

            if (currentLexeme !== null && currentLexeme.type === RPAREN)
            {
                this._lexer.advance();

                result = new BinaryOperatorNode(result, IN, rhs);
            }
            else
            {
                return ActiveSupport.throwError(new Error("'in' list did not end with a right parenthesis." + currentLexeme));
            }
        }
        else
        {
            return ActiveSupport.throwError(new Error("'in' list did not start with a left parenthesis"));
        }
    }

    return result;
};

/*
 * parseOrExpression
 */
WhereParser.prototype.parseOrExpression = function parseOrExpression()
{
    var result = this.parseAndExpression();

    while (currentLexeme !== null && currentLexeme.type === OR) 
    {
        // advance over 'or' or '||'
        this._lexer.advance();

        var rhs = this.parseAndExpression();

        result = new BinaryOperatorNode(result, OR, rhs);
    }

    return result;
};

/*
 * parseAndExpression
 */
WhereParser.prototype.parseAndExpression = function parseAndExpression()
{
    var result = this.parseEqualityExpression();

    while (currentLexeme !== null && currentLexeme.type === AND) 
    {
        // advance over 'and' or '&&'
        this._lexer.advance();

        var rhs = this.parseEqualityExpression();

        result = new BinaryOperatorNode(result, AND, rhs);
    }

    return result;
};

/*
 * parseEqualityExpression
 */
WhereParser.prototype.parseEqualityExpression = function parseEqualityExpression()
{
    var result = this.parseRelationalExpression();

    if (currentLexeme !== null) 
    {
        var type = currentLexeme.type;

        switch (type)
        {
            case EQUAL:
            case NOT_EQUAL:
                // advance over '=' or '!='
                this._lexer.advance();

                var rhs = this.parseRelationalExpression();

                result = new BinaryOperatorNode(result, type, rhs);
                break;
        }
    }

    return result;
};

/*
 * parseRelationalExpression
 */
WhereParser.prototype.parseRelationalExpression = function()
{
    var result = this.parseMemberExpression();

    if (currentLexeme !== null) 
    {
        var type = currentLexeme.type;

        switch (type)
        {
            case LESS_THAN:
            case LESS_THAN_EQUAL:
            case GREATER_THAN:
            case GREATER_THAN_EQUAL:
                // advance over '<', '<=', '>' or '>='
                this._lexer.advance();

                var rhs = this.parseMemberExpression();

                result = new BinaryOperatorNode(result, type, rhs);
                break;
        }
    }

    return result;
};

/*
 * parseMemberExpression
 */
WhereParser.prototype.parseMemberExpression = function parseMemberExpression()
{
    var result = null;

    if (currentLexeme !== null) 
    {
        switch (currentLexeme.type)
        {
            case IDENTIFIER:
                result = new IdentifierNode(currentLexeme.text);
                // advance over identifier
                this._lexer.advance();

                if (currentLexeme !== null && currentLexeme.type === LPAREN) 
                {
                    // this is a function
                    var name = result.identifier;
                    var args = [];

                    // advance over '('
                    this._lexer.advance();

                    // process arguments
                    while (currentLexeme !== null && currentLexeme.type !== RPAREN) 
                    {
                        args.push(this.parseOrExpression());

                        if (currentLexeme !== null && currentLexeme.type === COMMA)
                        {
                            this._lexer.advance();
                        }
                    }

                    // advance over ')'
                    if (currentLexeme !== null) 
                    {
                        this._lexer.advance();
                        result = new FunctionNode(name, args);
                    }
                    else 
                    {
                        return ActiveSupport.throwError(new Error("Function argument list was not closed with a right parenthesis."));
                    }
                }
                break;

            case TRUE:
                result = new ScalarNode(true);

                // advance over 'true'
                this._lexer.advance();
                break;

            case FALSE:
                result = new ScalarNode(false);

                // advance over 'false'
                this._lexer.advance();
                break;

            case NUMBER:
                result = new ScalarNode(currentLexeme.text - 0);

                // advance over number
                this._lexer.advance();
                break;

            case STRING:
                var text = currentLexeme.text;

                result = new ScalarNode(text.substring(1, text.length - 1));

                // advance over string
                this._lexer.advance();
                break;

            case LPAREN:
                // advance over '('
                this._lexer.advance();

                result = this.parseOrExpression();

                if (currentLexeme !== null && currentLexeme.type === RPAREN)
                {
                    // advance over ')'
                    this._lexer.advance();
                }
                else
                {
                    return ActiveSupport.throwError(new Error("Missing closing right parenthesis: " + currentLexeme));
                }
                break;
        }
    }

    return result;
};


//})();

//ActiveRecord.WhereLexer = WhereLexer;
ActiveRecord.WhereParser = WhereParser;

var Finders = {
    mergeOptions: function mergeOptions(field_name, value, options)
    {
        if(!options){
            options = {};
        }
        options = ActiveSupport.clone(options);
        if(options.where)
        {
            options.where[field_name] = value;
        }
        else
        {
            options.where = {};
            options.where[field_name] = value;
        }
        return options;
    },
    /**
     * Generates a findByField method for a ActiveRecord.Class (User.findByName)
     * @private
     * @alias ActiveRecord.Finders.generateFindByField
     * @param {Object} ActiveRecord.Class
     * @param {String} field_name
     */
    generateFindByField: function generateFindByField(klass, field_name)
    {
        klass['findBy' + ActiveSupport.camelize(field_name, true)] = ActiveSupport.curry(function generated_find_by_field_delegator(klass, field_name, value, options){
            return klass.find(ActiveSupport.extend(Finders.mergeOptions(field_name, value, options), {
                first: true
            }));
        }, klass, field_name);
    },
    /**
     * Generates a findAllByField method for a ActiveRecord.Class (User.findAllByName)
     * @private
     * @alias ActiveRecord.Finders.generateFindAllByField
     * @param {Object} ActiveRecord.Class
     * @param {String} field_name
     */
    generateFindAllByField: function generateFindAllByField(klass, field_name)
    {
        klass['findAllBy' + ActiveSupport.camelize(field_name, true)] = ActiveSupport.curry(function generated_find_all_by_field_delegator(klass, field_name, value, options){
            return klass.find(ActiveSupport.extend(Finders.mergeOptions(field_name, value, options), {
                all: true
            }));
        }, klass, field_name);
    }
};
ActiveRecord.Finders = Finders;

/**
 * When using any finder method, the returned array will be extended
 * with the methods in this namespace. A returned result set is still
 * an instance of Array.
 * @namespace {ActiveRecord.ResultSet}
 */
var ResultSet = {};

ResultSet.InstanceMethods = {
    /**
     * Re-runs the query that generated the result set. This modifies the
     * array in place and does not return a new array.
     * @alias ActiveRecord.ResultSet.reload
     */
    reload: function reload(result_set,params,model){
        result_set.length = 0;
        var new_response = model.find(ActiveSupport.extend(ActiveSupport.clone(params),{synchronize: false}));
        for(var i = 0; i < new_response.length; ++i)
        {
            result_set.push(new_response[i]);
        }
    },
    /**
     * Builds an array calling toObject() on each instance in the result
     * set, thus reutrning a vanilla array of vanilla objects.
     * @alias ActiveRecord.ResultSet.toArray
     * @return {Array}
     */
    toArray: function toArray(result_set,params,model)
    {
        var items = [];
        for(var i = 0; i < result_set.length; ++i)
        {
            items.push(result_set[i].toObject());
        }
        return items;
    },
    /**
     * @alias ActiveRecord.ResultSet.toJSON
     * @return {String}
     */
    toJSON: function toJSON(result_set,params,model)
    {
        var items = [];
        for(var i = 0; i < result_set.length; ++i)
        {
            items.push(result_set[i].toSerializableObject());
        }
        return ActiveSupport.JSON.stringify(items);
    },
    /**
     * @alias ActiveRecord.ResultSet.toXML
     * @return {String}
     */
    toXML: function toXML(result_set,params,model)
    {
        var items = [];
        for(var i = 0; i < result_set.length; ++i)
        {
            items.push(result_set[i].toSerializableObject());
        }
        return ActiveSupport.XMLFromObject(ActiveSupport.Inflector.pluralize(model.modelName),items);
    }
};

var Relationships = {
    normalizeModelName: function(related_model_name)
    {
        var plural = ActiveSupport.camelize(related_model_name, true);
        var singular = ActiveSupport.Inflector.singularize(plural) || plural;
        return singular || plural;
    },
    normalizeForeignKey: function(foreign_key, related_model_name)
    {
        var plural = ActiveSupport.underscore(related_model_name).toLowerCase();
        var singular = ActiveSupport.Inflector.singularize(plural) || plural;
        if (!foreign_key || typeof(foreign_key) === 'undefined')
        {
            return (singular || plural) + '_id';
        }
        else
        {
            return foreign_key;
        }
    }
};
ActiveRecord.Relationships = Relationships;

/**
 * Sepcifies a 1->1 relationship between models. The foreign key will reside in the related object.
 * @alias ActiveRecord.Class.hasOne
 * @param {String} related_model_name
 *      Can be a plural or singular referring to the related table, the model name, or a reference to the model itself ("users","User" or User would all work).
 * @param {Object} [options]
 *      Can contain {String} "foreignKey", {String} "name", {Boolean} "dependent" keys.
 * @example
 * 
 *     User.hasOne(CreditCard);
 *     var u = User.find(5);
 *     //each User instance will gain the following 3 methods
 *     u.getCreditCard()
 *     u.buildCreditCard()
 *     u.createCreditCard()
 */
ActiveRecord.ClassMethods.hasOne = function hasOne(related_model_name, options)
{
    if(related_model_name && related_model_name.modelName)
    {
        related_model_name = related_model_name.modelName;
    }
    if(!options)
    {
        options = {};
    }
    related_model_name = Relationships.normalizeModelName(related_model_name);
    var relationship_name = options.name ? Relationships.normalizeModelName(options.name) : related_model_name;
    var foreign_key = Relationships.normalizeForeignKey(options.foreignKey, Relationships.normalizeModelName(related_model_name));
    var class_methods = {};
    var instance_methods = {};
    instance_methods['get' + relationship_name] = ActiveSupport.curry(function getRelated(related_model_name, foreign_key){
        var id = this.get(foreign_key);
        if (id)
        {
            return ActiveRecord.Models[related_model_name].find(id);
        }
        else
        {
            return false;
        }
    }, related_model_name, foreign_key);
    class_methods['build' + relationship_name] = instance_methods['build' + relationship_name] = ActiveSupport.curry(function buildRelated(related_model_name, foreign_key, params){
        return ActiveRecord.Models[related_model_name].build(params || {});
    }, related_model_name, foreign_key);
    instance_methods['create' + relationship_name] = ActiveSupport.curry(function createRelated(related_model_name, foreign_key, params){
        var record = ActiveRecord.Models[related_model_name].create(params || {});
        if(this.get(this.constructor.primaryKeyName))
        {
            this.updateAttribute(foreign_key, record.get(record.constructor.primaryKeyName));
        }
        return record;
    }, related_model_name, foreign_key);
    ActiveSupport.extend(this.prototype, instance_methods);
    ActiveSupport.extend(this, class_methods);
    
    //dependent
    if(options.dependent)
    {
        this.observe('afterDestroy',function destroyRelatedDependent(record){
            var child = record['get' + relationship_name]();
            if(child)
            {
                child.destroy();
            }
        });
    }
};

/**
 * Sepcifies a 1->N relationship between models. The foreign key will reside in the child (related) object.
 * @alias ActiveRecord.Class.hasMany
 * @param {String} related_model_name
 *      Can be a plural or singular referring to the related table, the model name, or a reference to the model itself ("users","User" or User would all work).
 * @param {Object} [options]
 *      Can contain {String} "foreignKey", {Sting} "name", {Boolean} "dependent", {String} "order" and {String} "where" keys.
 * @example
 *
 *     User.hasMany('comments',{
 *         dependent: true
 *     });
 *     var u = User.find(5);
 *     //each User instance will gain the following 5 methods
 *     u.createComment()
 *     u.buildComment()
 *     u.destroyComment()
 *     u.getCommentList() //takes the same options as find()
 *     u.getCommentCount() //takes the same options as count() 
 */
ActiveRecord.ClassMethods.hasMany = function hasMany(related_model_name, options){
    if(related_model_name && related_model_name.modelName)
    {
        related_model_name = related_model_name.modelName;
    }
    if(!options)
    {
        options = {};
    }
    related_model_name = Relationships.normalizeModelName(related_model_name);
    var relationship_name = options.name ? Relationships.normalizeModelName(options.name) : related_model_name;
    var original_related_model_name = related_model_name;
    var foreign_key = Relationships.normalizeForeignKey(options.foreignKey, Relationships.normalizeModelName(this.modelName));
    var class_methods = {};
    var instance_methods = {};
    
    if(options.through)
    {
        var through_model_name = Relationships.normalizeModelName(options.through);
        instance_methods['get' + relationship_name + 'List'] = ActiveSupport.curry(function getRelatedListForThrough(through_model_name, related_model_name, foreign_key, params){
            var related_list = this['get' + through_model_name + 'List']();
            var ids = [];
            var response = [];
            for(var i = 0; i < related_list.length; ++i)
            {
                response.push(related_list[i]['get' + related_model_name]());
            }
            return response;
        }, through_model_name, related_model_name, foreign_key);
        
        instance_methods['get' + relationship_name + 'Count'] = ActiveSupport.curry(function getRelatedCountForThrough(through_model_name, related_model_name, foreign_key, params){
            if(!params)
            {
                params = {};
            }
            if(!params.where)
            {
                params.where = {};
            }
            params.where[foreign_key] = this.get(this.constructor.primaryKeyName);
            return ActiveRecord.Models[through_model_name].count(params);
        }, through_model_name, related_model_name, foreign_key);
    }
    else
    {
        instance_methods['destroy' + relationship_name] = class_methods['destroy' + relationship_name] = ActiveSupport.curry(function destroyRelated(related_model_name, foreign_key, params){
            var record = ActiveRecord.Models[related_model_name].find((params && typeof(params.get) === 'function') ? params.get(params.constructor.primaryKeyName) : params);
            if (record)
            {
                return record.destroy();
            }
            else
            {
                return false;
            }
        }, related_model_name, foreign_key);

        instance_methods['get' + relationship_name + 'List'] = ActiveSupport.curry(function getRelatedList(related_model_name, foreign_key, params){
            var id = this.get(this.constructor.primaryKeyName);
            if(!id)
            {
                return this.constructor.resultSetFromArray([]);
            }
            if(!params)
            {
                params = {};
            }
            if(options.order)
            {
                params.order = options.order;
            }
            if(options.synchronize)
            {
                params.synchronize = options.synchronize;
            }
            if(!params.where)
            {
                params.where = {};
            }
            params.where[foreign_key] = id;
            params.all = true;
            return ActiveRecord.Models[related_model_name].find(params);
        }, related_model_name, foreign_key);

        instance_methods['get' + relationship_name + 'Count'] = ActiveSupport.curry(function getRelatedCount(related_model_name, foreign_key, params){
            var id = this.get(this.constructor.primaryKeyName);
            if(!id)
            {
                return 0;
            }
            if(!params)
            {
                params = {};
            }
            if(!params.where)
            {
                params.where = {};
            }
            params.where[foreign_key] = id;
            return ActiveRecord.Models[related_model_name].count(params);
        }, related_model_name, foreign_key);

        instance_methods['build' + relationship_name] = ActiveSupport.curry(function buildRelated(related_model_name, foreign_key, params){
            var id = this.get(this.constructor.primaryKeyName);
            if(!params)
            {
                params = {};
            }
            params[foreign_key] = id;
            return ActiveRecord.Models[related_model_name].build(params);
        }, related_model_name, foreign_key);

        instance_methods['create' + relationship_name] = ActiveSupport.curry(function createRelated(related_model_name, foreign_key, params){
            var id = this.get(this.constructor.primaryKeyName);
            if(!params)
            {
                params = {};
            }
            params[foreign_key] = id;
            return ActiveRecord.Models[related_model_name].create(params);
        }, related_model_name, foreign_key);
    }
    
    ActiveSupport.extend(this.prototype, instance_methods);
    ActiveSupport.extend(this, class_methods);
    
    //dependent
    if(options.dependent)
    {
        this.observe('afterDestroy', function destroyDependentChildren(record){
            var list = record['get' + relationship_name + 'List']();
            ActiveRecord.connection.log('Relationships.hasMany destroy ' + list.length + ' dependent ' + related_model_name + ' children of ' + record.modelName);
            for(var i = 0; i < list.length; ++i)
            {
                list[i].destroy();
            }
        });
    }
};

/**
 * Sepcifies a 1<-1 relationship between models. The foreign key will reside in the declaring object.
 * @alias ActiveRecord.Class.belongsTo
 * @param {String} related_model_name
 *      Can be a plural or singular referring to the related table, the model name, or a reference to the model itself ("users","User" or User would all work).
 * @param {Object} [options]
 *      Can contain {String} "foreignKey", {String} name, {String} "counter" keys.
 * @example
 *
 *     Comment.belongsTo('User',{
 *         counter: 'comment_count' //comment count must be a column in User
 *     });
 *     var c = Comment.find(5);
 *     //each Comment instance will gain the following 3 methods
 *     c.getUser()
 *     c.buildUser()
 *     c.createUser()
 */
ActiveRecord.ClassMethods.belongsTo = function belongsTo(related_model_name, options){
    if(related_model_name && related_model_name.modelName)
    {
        related_model_name = related_model_name.modelName;
    }
    if(!options)
    {
        options = {};
    }
    related_model_name = Relationships.normalizeModelName(related_model_name);
    var relationship_name = options.name ? Relationships.normalizeModelName(options.name) : related_model_name;
    var foreign_key = Relationships.normalizeForeignKey(options.foreignKey, related_model_name);
    var class_methods = {};
    var instance_methods = {};
    instance_methods['get' + relationship_name] = ActiveSupport.curry(function getRelated(related_model_name,foreign_key){
        var id = this.get(foreign_key);
        if (id)
        {
            return ActiveRecord.Models[related_model_name].find(id);
        }
        else
        {
            return false;
        }
    }, related_model_name, foreign_key);
    instance_methods['build' + relationship_name] = class_methods['build' + relationship_name] = ActiveSupport.curry(function buildRelated(related_model_name, foreign_key, params){
        var record = ActiveRecord.Models[related_model_name].build(params || {});
        if(options.counter)
        {
            record[options.counter] = 1;
        }
        return record;
    }, related_model_name, foreign_key);
    instance_methods['create' + relationship_name] = ActiveSupport.curry(function createRelated(related_model_name, foreign_key, params){
        var record = this['build' + related_model_name](params);
        if(record.save() && this.get(this.constructor.primaryKeyName))
        {
            this.updateAttribute(foreign_key, record.get(record.constructor.primaryKeyName));
        }
        return record;
    }, related_model_name, foreign_key);
    ActiveSupport.extend(this.prototype, instance_methods);
    ActiveSupport.extend(this, class_methods);
    
    //counter
    if(options.counter)
    {
        this.observe('afterDestroy', function decrementBelongsToCounter(record){
            var child = record['get' + relationship_name]();
            if(child)
            {
                var current_value = child.get(options.counter);
                if(typeof(current_value) === 'undefined')
                {
                    current_value = 0;
                }
                child.updateAttribute(options.counter, Math.max(0, parseInt(current_value, 10) - 1));
            }
        });
        this.observe('afterCreate', function incrementBelongsToCounter(record){
            var child = record['get' + relationship_name]();
            if(child)
            {
                var current_value = child.get(options.counter);
                if(typeof(current_value) === 'undefined')
                {
                    current_value = 0;
                }
                child.updateAttribute(options.counter, parseInt(current_value, 10) + 1);
            }
        });
    }
};
 
/**
 * @namespace {ActiveRecord.Migrations}
 * @example
 * 
 * Migrations
 * ----------
 * 
 * Migrations are a method of versioining the database schema used by your
 * application. All of your migrations must be defined in an object assigned
 * to ActiveRecord.Migrations.migrations. The keys need not be numerically
 * sequential, but must be numeric (i.e. 1,2,3 or 100,200,300).
 * 
 * Each migration object must have an up() and down() method which will
 * recieve an ActiveRecord.Migrations.Schema object. createTable() and
 * addColumn() both use the same syntax as define() to specify default
 * values and field types.
 * 
 *     ActiveRecord.Migrations.migrations = {
 *         1: {
 *             up: function(schema){
 *                 schema.createTable('one',{
 *                     a: '',
 *                     b: {
 *                         type: 'TEXT',
 *                         value: 'default'
 *                     }
 *                 });
 *             },
 *             down: function(schema){
 *                 schema.dropTable('one');
 *             }
 *         },
 *         2: {
 *             up: function(schema){
 *                 schema.addColumn('one','c');
 *             },
 *             down: function(schema){
 *                 schema.dropColumn('one','c');
 *             }
 *         }
 *     };
 *     
 *     ActiveRecord.Migrations.migrate(); //will migrate to the highest available (2 in this case)
 *     ActiveRecord.Migrations.migrate(0); //migrates down below 1, effectively erasing the schema
 *     ActiveRecord.Migrations.migrate(1); //migrates to version 1
 */
var Migrations = {
    fieldTypesWithDefaultValues: {
        'tinyint': 0,
        'smallint': 0,
        'mediumint': 0,
        'int': 0,
        'integer': 0,
        'bitint': 0,
        'float': 0,
        'double': 0,
        'double precision': 0,
        'real': 0,
        'decimal': 0,
        'numeric': 0,

        'date': '',
        'datetime': '',
        'timestamp': '',
        'time': '',
        'year': '',

        'char': '',
        'varchar': '',
        'tinyblob': '',
        'tinytext': '',
        'blob': '',
        'text': '',
        'mediumtext': '',
        'mediumblob': '',
        'longblob': '',
        'longtext': '',
        
        'enum': '',
        'set': ''
    },    
    migrations: {},
    /**
     * Migrates a database schema to the given version.
     * @alias ActiveRecord.Migrations.migrate
     * @param {Number} target
     */
    migrate: function migrate(target)
    {
        if(typeof(target) === 'undefined' || target === false)
        {
            target = Migrations.max();
        }
        
        Migrations.setup();
        ActiveRecord.connection.log('Migrations.migrate(' + target + ') start.');
        
        var current_version = Migrations.current();
        ActiveRecord.connection.log('Current schema version is ' + current_version);
        
        var migrations, i, versions;
        Migrations.Meta.transaction(function(){
            if(target > current_version)
            {
                migrations = Migrations.collectAboveIndex(current_version,target);
                for(i = 0; i < migrations.length; ++i)
                {
                    ActiveRecord.connection.log('Migrating up to version ' + migrations[i][0]);
                    migrations[i][1].up(Migrations.Schema);
                    Migrations.Meta.create({
                        version: migrations[i][0]
                    });
                }
            }
            else if(target < current_version)
            {
                migrations = Migrations.collectBelowIndex(current_version,target);
                for(i = 0; i < migrations.length; ++i)
                {
                    ActiveRecord.connection.log('Migrating down to version ' + migrations[i][0]);
                    migrations[i][1].down(Migrations.Schema);
                }
                versions = Migrations.Meta.find({
                    all: true
                });
                for(i = 0; i < versions.length; ++i)
                {
                    if(versions[i].get('version') > target)
                    {
                        versions[i].destroy();
                    }
                }
                ActiveRecord.connection.log('Migrate to version ' + target + ' complete.');
            }
            else
            {
                ActiveRecord.connection.log('Current schema version is current, no migrations were run.');
            }
        },function(e){
            ActiveRecord.connection.log('Migration failed: ' + e);
        });
        ActiveRecord.connection.log('Migrations.migrate(' + target + ') finished.');
    },
    /**
     * Returns the current schema version number.
     * @alias ActiveRecord.Migrations.current
     * @return {Number}
     */
    current: function current()
    {
        Migrations.setup();
        return Migrations.Meta.max('version') || 0;
    },
    /**
     * Returns the highest key name in the ActiveRecord.Migrations hash.
     * @alias ActiveRecord.Migrations.max
     * @return {Number}
     */
    max: function max()
    {
        var max_val = 0;
        for(var key_name in Migrations.migrations)
        {
            key_name = parseInt(key_name, 10);
            if(key_name > max_val)
            {
                max_val = key_name;
            }
        }
        return max_val;
    },
    setup: function setMigrationsTable()
    {
        if(!Migrations.Meta)
        {
            Migrations.Meta = ActiveRecord.create('schema_migrations',{
                version: 0
            });
            delete ActiveRecord.Models.SchemaMigrations;
        }
    },
    /**
     * Returns an array of [key_name,migration] pairs in the order they should be run to migrate down.
     * @private
     * @alias ActiveRecord.Migrations.collectBelowIndex
     * @param {Number} index
     * @param {Number} target
     * @return {Array}
     */
    collectBelowIndex: function collectBelowIndex(index,target)
    {
        return [[index,Migrations.migrations[index]]].concat(Migrations.collectMigrations(index,target + 1,'down'));
    },
    /**
     * Returns an array of [key_name,migration] pairs in the order they should be run to migrate up.
     * @private
     * @alias ActiveRecord.Migrations.collectAboveIndex
     * @param {Number} index
     * @param {Number} target
     * @return {Array}
     */
    collectAboveIndex: function collectAboveIndex(index,target)
    {
        return Migrations.collectMigrations(index,target,'up');
    },
    collectMigrations: function collectMigrations(index,target,direction)
    {
        var keys = [];
        for(var key_name in Migrations.migrations)
        {
            key_name = parseInt(key_name, 10);
            if((direction === 'up' && key_name > index) || (direction === 'down' && key_name < index))
            {
                keys.push(key_name);
            }
        }
        keys = keys.sort();
        if(direction === 'down')
        {
            keys = keys.reverse();
        }
        var migrations = [];
        for(var i = 0; i < keys.length; ++i)
        {
            if((direction === 'down' && typeof(target) !== 'undefined' && target > keys[i]) || (direction === 'up' && typeof(target) !== 'undefined' && target < keys[i]))
            {
                break;
            }
            migrations.push([keys[i],Migrations.migrations[keys[i]]]);
        }
        return migrations;
    },
    objectIsFieldDefinition: function objectIsFieldDefinition(object)
    {
        return typeof(object) === 'object' && ActiveSupport.keys(object).length === 2 && ('type' in object) && ('value' in object);
    },
    /**
     * @namespace {ActiveRecord.Migrations.Schema} This object is passed to all migrations as the only parameter.
     */
    Schema: {
        /**
         * @alias ActiveRecord.Migrations.Schema.createTable
         * @param {String} table_name
         * @param {Object} columns
         */
        createTable: function createTable(table_name,columns)
        {
            return ActiveRecord.connection.createTable(table_name,columns);
        },
        /**
         * @alias ActiveRecord.Migrations.Schema.dropTable
         * @param {String} table_name
         */
        dropTable: function dropTable(table_name)
        {
            return ActiveRecord.connection.dropTable(table_name);
        },
        /**
         * @alias ActiveRecord.Migrations.Schema.addColumn
         * @param {String} table_name
         * @param {String} column_name
         * @param {mixed} [data_type]
         */
        addColumn: function addColumn(table_name,column_name,data_type)
        {
            return ActiveRecord.connection.addColumn(table_name,column_name,data_type);
        },
        /**
         * @alias ActiveRecord.Migrations.Schema.dropColumn
         * @param {String} table_name
         * @param {String} column_name
         */
        dropColumn: function removeColumn(table_name,column_name)
        {
            return ActiveRecord.connection.dropColumn(table_name,column_name);
        },
        /**
         * @alias ActiveRecord.Migrations.Schema.addIndex
         * @param {String} table_name
         * @param {Array} column_names
         * @param {Object} options
         */
        addIndex: function addIndex(table_name,column_names,options)
        {
            return ActiveRecord.connection.addIndex(table_name,column_names,options);
        },
        /**
         * @alias ActiveRecord.Migrations.Schema.removeIndex
         * @param {String} table_name
         * @param {String} index_name
         */
        removeIndex: function removeIndex(table_name,index_name)
        {
            return ActiveRecord.connection.removeIndex(table_name,index_name);
        }
    }
};

ActiveRecord.Migrations = Migrations;

ActiveSupport.extend(ActiveRecord.ClassMethods,{
    /**
     * Adds the validator to the _validators array of a given ActiveRecord.Class.
     * @alias ActiveRecord.Class.addValidator
     * @param {Function} validator
     */
    addValidator: function addValidator(validator)
    {
        if(!this._validators)
        {
            this._validators = [];
        }
        this._validators.push(validator);
    },
    /**
     * @alias ActiveRecord.Class.validatesPresenceOf
     * @param {String} field
     * @param {Object} [options]
     */
    validatesPresenceOf: function validatesPresenceOf(field, options)
    {
        options = ActiveSupport.extend({
            
        },options || {});
        this.addValidator(function validates_presence_of_callback(){
            if(!this.get(field) || this.get(field) === '')
            {
                this.addError(options.message || (field + ' is not present.'));
            }
        });
    },
    /**
     * Accepts "min" and "max" numbers as options.
     * @alias ActiveRecord.Class.validatesLengthOf
     * @param {String} field
     * @param {Object} [options]
     */
    validatesLengthOf: function validatesLengthOf(field, options)
    {
        options = ActiveSupport.extend({
            min: 1,
            max: 9999
        },options || {});
        //will run in scope of an ActiveRecord instance
        this.addValidator(function validates_length_of_callback(){
            var value = new String(this.get(field));
            if (value.length < options.min)
            {
                this.addError(options.message || (field + ' is too short.'));
            }
            if (value.length > options.max)
            {
                this.addError(options.message || (field + ' is too long.'));
            }
        });
    }
});
ActiveSupport.extend(ActiveRecord.InstanceMethods,{
    /**
     * @alias ActiveRecord.Instance.addError
     * @param {String} message
     * @param {String} field_name
     */
    addError: function addError(str, field)
    {
        var error = null;
        if(field)
        {
            error = [str,field];
            error.toString = function toString()
            {
                return str;
            };
        }
        else
        {
            error = str;
        }
        this._errors.push(str);
    },
    _valid: function _valid()
    {
        this._errors = [];
        var validators = this._getValidators();
        for (var i = 0; i < validators.length; ++i)
        {
            validators[i].apply(this);
        }
        if (typeof(this.valid) === 'function')
        {
            this.valid();
        }
        ActiveRecord.connection.log('ActiveRecord.valid()? ' + (new String(this._errors.length === 0).toString()) + (this._errors.length > 0 ? '. Errors: ' + (new String(this._errors)).toString() : ''));
        return this._errors.length === 0;
    },
    _getValidators: function _getValidators()
    {
        return this.constructor._validators || [];
    },
    /**
     * @alias ActiveRecord.Instance.getErrors
     * @return {Array}
     */
    getErrors: function getErrors()
    {
        return this._errors;
    }
});
 
ActiveRecord.asynchronous = false; //deprecated until we have HTML5 support

var Synchronization = {};

Synchronization.calculationNotifications = {};

Synchronization.resultSetNotifications = {};

Synchronization.notifications = {};

Synchronization.setupNotifications = function setupNotifications(record)
{
    if(!record.get(record.constructor.primaryKeyName))
    {
        return false;
    }
    if(!Synchronization.notifications[record.tableName])
    {
        Synchronization.notifications[record.tableName] = {};
    }
    if(!Synchronization.notifications[record.tableName][record[record.constructor.primaryKeyName]])
    {
        Synchronization.notifications[record.tableName][record[record.constructor.primaryKeyName]] = {};
    }    
    return true;
};

Synchronization.triggerSynchronizationNotifications = function triggerSynchronizationNotifications(record,event_name)
{
    var found_records, internal_count_id;
    if(!Synchronization.setupNotifications(record))
    {
        return false;
    }
    if(event_name === 'afterSave')
    {
        found_records = Synchronization.notifications[record.tableName][record[record.constructor.primaryKeyName]];
        for(internal_count_id in found_records)
        {
            if(internal_count_id !== record.internalCount)
            {
                var found_record = found_records[internal_count_id];
                var keys = found_record.keys();
                for(var i = 0; i < keys.length; ++i)
                {
                    var key_name = keys[i];
                    found_record.set(key_name,record.get(key_name));
                }
                found_record.notify('synchronization:afterSave');
            }
        }
    }
    else if(event_name === 'afterDestroy' || event_name === 'afterCreate')
    {
        if(Synchronization.calculationNotifications[record.tableName])
        {
            for(var synchronized_calculation_count in Synchronization.calculationNotifications[record.tableName])
            {
                Synchronization.calculationNotifications[record.tableName][synchronized_calculation_count]();
            }
        }
        if(Synchronization.resultSetNotifications[record.tableName])
        {
            for(var synchronized_result_set_count in Synchronization.resultSetNotifications[record.tableName])
            {
                var old_result_set = Synchronization.resultSetNotifications[record.tableName][synchronized_result_set_count].resultSet;
                var new_params = ActiveSupport.clone(Synchronization.resultSetNotifications[record.tableName][synchronized_result_set_count].params);
                var new_result_set = record.constructor.find(ActiveSupport.extend(new_params,{synchronize: false}));
                var splices = Synchronization.spliceArgumentsFromResultSetDiff(old_result_set,new_result_set,event_name);
                for(var x = 0; x < splices.length; ++x)
                {
                    if(event_name == 'afterCreate')
                    {
                        var to_synchronize = splices[x].slice(2);
                        for(var s = 0; s < to_synchronize.length; ++s)
                        {
                            to_synchronize[s].synchronize();
                        }
                    }
                    old_result_set.splice.apply(old_result_set,splices[x]);
                }
            }
        }
        if(event_name === 'afterDestroy')
        {
            found_records = Synchronization.notifications[record.tableName][record[record.constructor.primaryKeyName]];
            for(internal_count_id in found_records)
            {
                if(internal_count_id !== record.internalCount)
                {
                    found_records[internal_count_id].notify('synchronization:afterDestroy');
                    Synchronization.notifications[record.tableName][record[record.constructor.primaryKeyName]][internal_count_id] = null;
                    delete Synchronization.notifications[record.tableName][record[record.constructor.primaryKeyName]][internal_count_id];
                }
            }
        }
    }
};

ActiveSupport.extend(ActiveRecord.InstanceMethods,{
    /**
     * Once synchronized a found instance will have it's values updated if
     * other records with the same id change in the database.
     * @alias ActiveRecord.Instance.synchronize
     * @return {null}
     */
    synchronize: function synchronize()
    {
        if(!this.isSynchronized)
        {
            this.isSynchronized = true;
            Synchronization.setupNotifications(this);
            Synchronization.notifications[this.tableName][this[this.constructor.primaryKeyName]][this.internalCount] = this;
        }
    },
    /**
     * Stops the synchronization of the record with the database.
     * @alias ActiveRecord.Instance.stop
     * @return {null}
     */
    stop: function stop()
    {
        Synchronization.setupNotifications(this);
        Synchronization.notifications[this.tableName][this[this.constructor.primaryKeyName]][this.internalCount] = null;
        delete Synchronization.notifications[this.tableName][this[this.constructor.primaryKeyName]][this.internalCount];
    }
});

Synchronization.synchronizedCalculationCount = 0;

Synchronization.synchronizeCalculation = function synchronizeCalculation(klass,operation,params)
{
    ++Synchronization.synchronizedCalculationCount;
    var callback = params.synchronize;
    var callback_params = ActiveSupport.clone(params);
    delete callback_params.synchronize;
    if(!Synchronization.calculationNotifications[klass.tableName])
    {
        Synchronization.calculationNotifications[klass.tableName] = {};
    }
    Synchronization.calculationNotifications[klass.tableName][Synchronization.synchronizedCalculationCount] = (function calculation_synchronization_executer_generator(klass,operation,params,callback){
        return function calculation_synchronization_executer(){
            callback(klass[operation](callback_params));
        };
    })(klass,operation,params,callback);
    Synchronization.calculationNotifications[klass.tableName][Synchronization.synchronizedCalculationCount]();
    return (function calculation_synchronization_stop_generator(table_name,synchronized_calculation_count){
        return function calculation_synchronization_stop(){
            Synchronization.calculationNotifications[table_name][synchronized_calculation_count] = null;
            delete Synchronization.calculationNotifications[table_name][synchronized_calculation_count];
        };
    })(klass.tableName,Synchronization.synchronizedCalculationCount);
};

Synchronization.synchronizedResultSetCount = 0;

Synchronization.synchronizeResultSet = function synchronizeResultSet(klass,params,result_set)
{
    ++Synchronization.synchronizedResultSetCount;
    if(!Synchronization.resultSetNotifications[klass.tableName])
    {
        Synchronization.resultSetNotifications[klass.tableName] = {};
    }
    Synchronization.resultSetNotifications[klass.tableName][Synchronization.synchronizedResultSetCount] = {
        resultSet: result_set,
        params: params
    };
    for(var i = 0; i < result_set.length; ++i)
    {
        result_set[i].synchronize();
    }
    result_set.stop = (function result_set_synchronization_stop_generator(table_name,synchronized_result_set_count){
        return function stop(){
            for(var i = 0; i < this.length; ++i)
            {
                this[i].stop();
            }
            Synchronization.resultSetNotifications[table_name][synchronized_result_set_count] = null;
            delete Synchronization.resultSetNotifications[table_name][synchronized_result_set_count];
        };
    })(klass.tableName,Synchronization.synchronizedResultSetCount);
};

Synchronization.spliceArgumentsFromResultSetDiff = function spliceArgumentsFromResultSetDiff(a,b,event_name)
{
    var diffs = [];
    if(event_name === 'afterCreate')
    {
        for(var i = 0; i < b.length; ++i)
        {
            if(!a[i] || (a[i] && (a[i][a[i].constructor.primaryKeyName] !== b[i][b[i].constructor.primaryKeyName])))
            {
                diffs.push([i,null,b[i]]);
                break;
            }
        }
    }
    else if(event_name === 'afterDestroy')
    {
        for(var i = 0; i < a.length; ++i)
        {
            if(!b[i] || (b[i] && (b[i][b[i].constructor.primaryKeyName] !== a[i][a[i].constructor.primaryKeyName])))
            {
                diffs.push([i,1]);
                break;
            }
        }
    }
    return diffs;
};

ActiveRecord.Synchronization = Synchronization;

})();

(function(){

/**
 * Adapter for browsers supporting a SQL implementation (Gears, HTML5).
 * @alias ActiveRecord.Adapters.Gears
 * @property {ActiveRecord.Adapter}
 */
ActiveRecord.Adapters.Gears = function Gears(db){
    this.db = db;
    ActiveSupport.extend(this,ActiveRecord.Adapters.InstanceMethods);
    ActiveSupport.extend(this,ActiveRecord.Adapters.SQLite);
    ActiveSupport.extend(this,{
        executeSQL: function executeSQL(sql)
        {
            var args = ActiveSupport.arrayFrom(arguments);
            var proceed = null;
            if(typeof(args[args.length - 1]) === 'function')
            {
                proceed = args.pop();
            }
            ActiveRecord.connection.log("Adapters.Gears.executeSQL: " + sql + " [" + args.slice(1).join(',') + "]");
            var response = ActiveRecord.connection.db.execute(sql,args.slice(1));
            if(proceed)
            {
                proceed(response);
            }
            return response;
        },
        getLastInsertedRowId: function getLastInsertedRowId()
        {
            return this.db.lastInsertRowId;
        },
        iterableFromResultSet: function iterableFromResultSet(result)
        {
            var response = {
                rows: []
            };
            var count = result.fieldCount();
            while(result.isValidRow())
            {
                var row = {};
                for(var i = 0; i < count; ++i)
                {
                    row[result.fieldName(i)] = result.field(i);
                }
                response.rows.push(row);
                result.next();
            }
            result.close();
            response.iterate = ActiveRecord.Adapters.defaultResultSetIterator;
            return response;
        },
        fieldListFromTable: function(table_name)
        {
            var response = {};
            var description = ActiveRecord.connection.iterableFromResultSet(ActiveRecord.connection.executeSQL('SELECT * FROM sqlite_master WHERE tbl_name = "' + table_name + '"')).iterate(0);
            var columns = description.sql.match(new RegExp('CREATE[\s]+TABLE[\s]+' + table_name + '[\s]+(\([^\)]+)'));
            var parts = columns.split(',');
            for(var i = 0; i < parts.length; ++i)
            {
                //second half of the statement should instead return the type that it is
                response[parts[i].replace(/(^\s+|\s+$)/g,'')] = parts[i].replace(/^\w+\s?/,'');
            }
            return response;
        }
    });
};
ActiveRecord.Adapters.Gears.DatabaseUnavailableError = 'ActiveRecord.Adapters.Gears could not find a Google Gears database to connect to.';
ActiveRecord.Adapters.Gears.connect = function connect(name, version, display_name, size)
{
    var global_context = ActiveSupport.getGlobalContext();
    var db = null;
    
    if(!(global_context.google && google.gears))
    {
        var gears_factory = null;
        if('GearsFactory' in global_context)
        {
            gears_factory = new GearsFactory();
        }
        else if('ActiveXObject' in global_context)
        {
            try
            {
                gears_factory = new ActiveXObject('Gears.Factory');
                if(gears_factory.getBuildInfo().indexOf('ie_mobile') !== -1)
                {
                    gears_factory.privateSetGlobalObject(this);
                }
            }
            catch(e)
            {
                return ActiveSupport.throwError(ActiveRecord.Adapters.Gears.DatabaseUnavailableError);
            }
        }
        else if(('mimeTypes' in navigator) && ('application/x-googlegears' in navigator.mimeTypes))
        {
            gears_factory = ActiveSupport.getGlobalContext().document.createElement("object");
            gears_factory.style.display = "none";
            gears_factory.width = 0;
            gears_factory.height = 0;
            gears_factory.type = "application/x-googlegears";
            ActiveSupport.getGlobalContext().document.documentElement.appendChild(gears_factory);
        }
        
        if(!gears_factory)
        {
            return ActiveSupport.throwError(ActiveRecord.Adapters.Gears.DatabaseUnavailableError);
        }
        
        if(!('google' in global_context))
        {
            google = {};
        }
        
        if(!('gears' in google))
        {
            google.gears = {
                factory: gears_factory
            };
        }
    }

    db = google.gears.factory.create('beta.database');
    db.open(name || 'ActiveRecord');
        
    return new ActiveRecord.Adapters.Gears(db);
};

})();

var ActiveView = null;

(function(){
 
/**
 * @namespace {ActiveView}
 * @example
 * 
 * ActiveView.js
 * ===============
 * Tutorial coming soon.
 */
ActiveView = {};

ActiveView.logging = false;

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
    if(typeof(content) === 'function' && !content.prototype.structure)
    {
        content = content(scope);
    }
    
    if(content && (typeof(content) == 'string' || content.nodeType == 1))
    {
        return content;
    }
    else if(content && content.container && content.container.nodeType == 1)
    {
        //is ActiveView instance
        return content.container;
    }
    else if(content && content.prototype && content.prototype.structure)
    {
        //is ActiveView class
        return new content(scope).container;
    }
    return ActiveSupport.throwError(Errors.InvalidContent);
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
        this.builder = ActiveView.Builder;
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
    get: function get(key)
    {
        return this.scope.get(key);
    },
    set: function set(key,value)
    {
        if((value !== null && typeof value === "object" && 'splice' in value && 'join' in value) && !value.observe)
        {
            ActiveView.makeArrayObservable(value);
        }
        return this.scope.set(key,value);
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

var Builder = {
    createElement: function createElement(tag,attributes)
    {
        var global_context = ActiveSupport.getGlobalContext();
        var ie = !!(global_context.attachEvent && !global_context.opera);
        attributes = attributes || {};
        tag = tag.toLowerCase();
        if(ie && attributes.name)
        {
            tag = '<' + tag + ' name="' + attributes.name + '">';
            delete attributes.name;
        }
        var element = Builder.extendCreatedElement(global_context.document.createElement(tag));
        Builder.writeAttribute(element,attributes);
        return element;
    },
    extendCreatedElement: function extendCreatedElement(element)
    {
        return element;
    },
    writeAttribute: function writeAttribute(element,name,value)
    {
        var transitions = {
            className: 'class',
            htmlFor:   'for'
        };
        var attributes = {};
        if(typeof name === 'object')
        {
            attributes = name;
        }
        else
        {
            attributes[name] = typeof(value) === 'undefined' ? true : value;
        }
        for(var attribute_name in attributes)
        {
            name = transitions[attribute_name] || attribute_name;
            value = attributes[attribute_name];
            if(value === false || value === null)
            {
                element.removeAttribute(name);
            }
            else if(value === true)
            {
                element.setAttribute(name,name);
            }
            else
            {
                element.setAttribute(name,value);
            }
        }
        return element;
    },
    addMethods: function addMethods(methods)
    {
        ActiveSupport.extend(Builder,methods || {});
    }
};

(function builder_generator(){
    var tags = ("A ABBR ACRONYM ADDRESS APPLET AREA B BASE BASEFONT BDO BIG BLOCKQUOTE BODY " +
        "BR BUTTON CAPTION CENTER CITE CODE COL COLGROUP DD DEL DFN DIR DIV DL DT EM FIELDSET " +
        "FONT FORM FRAME FRAMESET H1 H2 H3 H4 H5 H6 HEAD HR HTML I IFRAME IMG INPUT INS ISINDEX "+
        "KBD LABEL LEGEND LI LINK MAP MENU META NOFRAMES NOSCRIPT OBJECT OL OPTGROUP OPTION P "+
        "PARAM PRE Q S SAMP SCRIPT SELECT SMALL SPAN STRIKE STRONG STYLE SUB SUP TABLE TBODY TD "+
        "TEXTAREA TFOOT TH THEAD TITLE TR TT U UL VAR").split(/\s+/);
    var global_context = ActiveSupport.getGlobalContext();
    for(var t = 0; t < tags.length; ++t)
    {
        var tag = tags[t];
        (function tag_iterator(tag){
            Builder[tag.toLowerCase()] = Builder[tag] = function tag_generator(){
                var i, argument, attributes, text_nodes, elements, element;
                text_nodes = [];
                elements = [];
                for(i = 0; i < arguments.length; ++i)
                {
                    argument = arguments[i];
                    if(typeof(argument) === 'undefined' || argument === null || argument === false)
                    {
                        continue;
                    }
                    if(typeof(argument) === 'function')
                    {
                        argument = argument();
                    }
                    if(typeof(argument) !== 'string' && typeof(argument) !== 'number' && !(argument !== null && typeof argument === "object" && 'splice' in argument && 'join' in argument) && !(argument && argument.nodeType === 1))
                    {
                        attributes = argument;
                    }
                    else if(argument !== null && typeof argument === "object" && 'splice' in argument && 'join' in argument)
                    {
                        elements = argument;
                    }
                    else if((argument && argument.nodeType === 1) || typeof(argument) === 'string' || typeof(argument) === 'number')
                    {
                        elements.push(argument);
                    }
                }
                element = Builder.createElement(tag,attributes);
                for(i = 0; i < elements.length; ++i)
                {
                    element.appendChild((elements[i] && elements[i].nodeType === 1) ? elements[i] : global_context.document.createTextNode((new String(elements[i])).toString()));
                }
                return element;
            };
        })(tag);
    }
})();

ActiveView.Builder = Builder;

ActiveView.generateBinding = function generateBinding(instance)
{
    instance.binding = {};
    instance.binding.update = function update(element)
    {
        if(!element || !element.nodeType === 1)
        {
            return ActiveSupport.throwError(Errors.MismatchedArguments,'expected Element, recieved ',typeof(element),element);
        }
        return {
            from: function from(observe_key)
            {
                var object = instance.scope;
                if(arguments.length === 2)
                {
                    object = arguments[1];
                    observe_key = arguments[2];
                }
                
                var transformation = null;
                var condition = function default_condition(){
                    return true;
                };
                
                var transform = function transform(callback)
                {
                    if(!callback || typeof(callback) !== 'function')
                    {
                        return ActiveSupport.throwError(Errors.MismatchedArguments,'expected Function, recieved ',typeof(callback),callback);
                    }
                    transformation = callback;
                    return {
                        when: when
                    };
                };

                var when = function when(callback)
                {
                    if(!callback || typeof(callback) !== 'function')
                    {
                        return ActiveSupport.throwError(Errors.MismatchedArguments,'expected Function, recieved ',typeof(callback),callback);
                    }
                    condition = callback;
                    return {
                        transform: transform
                    };
                };

                object.observe('set',function update_from_observer(set_key,value){
                    if(observe_key == set_key)
                    {
                        if(condition())
                        {
                            element.innerHTML = transformation ? transformation(value) : value;
                        }
                    }
                });
                
                return {
                    transform: transform,
                    when: when
                };
            }
        };
    };

    instance.binding.collect = function collect(view)
    {
        if(!view)
        {
            return ActiveSupport.throwError(Errors.MismatchedArguments,'expected string, ActiveView class or function, recieved ',typeof(view),view);
        }
        return {
            from: function from(collection)
            {
                if(!collection || (typeof(collection) !== 'object' && typeof(collection) !== 'string'))
                {
                    return ActiveSupport.throwError(Errors.MismatchedArguments,'expected array, recieved ',typeof(collection),collection);
                }
                return {
                    into: function into(element)
                    {
                        if(!element || !element.nodeType === 1)
                        {
                            return ActiveSupport.throwError(Errors.MismatchedArguments,'expected Element, recieved ',typeof(element),element);
                        }
                        //if a string is passed make sure that the view is re-built when the key is set
                        if(typeof(collection) === 'string')
                        {
                            var collection_name = collection;
                            instance.scope.observe('set',function collection_key_change_observer(key,value){
                                if(key == collection_name)
                                {
                                    element.innerHTML = '';
                                    instance.binding.collect(view).from(value).into(element);
                                }
                            });
                        }
                        else
                        {
                            //loop over the collection when it is passed in to build the view the first time
                            var collected_elements = [];
                            for(var i = 0; i < collection.length; ++i)
                            {
                                var generated_element = ActiveView.render(view,collection[i]);
                                element.appendChild(generated_element);
                                collected_elements.push(element.childNodes[element.childNodes.length - 1]);
                            }
                            //these handlers will add or remove elements from the view as the collection changes
                            if(collection.observe)
                            {
                                collection.observe('pop',function pop_observer(){
                                    collected_elements[collected_elements.length - 1].parentNode.removeChild(collected_elements[collected_elements.length - 1]);
                                    collected_elements.pop();
                                });
                                collection.observe('push',function push_observer(item){
                                    var generated_element = ActiveView.render(view,item);
                                    element.appendChild(generated_element);
                                    collected_elements.push(element.childNodes[element.childNodes.length - 1]);
                                });
                                collection.observe('unshift',function unshift_observer(item){
                                    var generated_element = ActiveView.render(view,item);
                                    element.insertBefore(generated_element,element.firstChild);
                                    collected_elements.unshift(element.firstChild);
                                });
                                collection.observe('shift',function shift_observer(){
                                    element.removeChild(element.firstChild);
                                    collected_elements.shift(element.firstChild);
                                });
                                collection.observe('splice',function splice_observer(index,to_remove){
                                    var children = [];
                                    var i;
                                    for(i = 2; i < arguments.length; ++i)
                                    {
                                        children.push(arguments[i]);
                                    }
                                    if(to_remove)
                                    {
                                        for(i = index; i < (index + to_remove); ++i)
                                        {
                                            collected_elements[i].parentNode.removeChild(collected_elements[i]);
                                        }
                                    }
                                    for(i = 0; i < children.length; ++i)
                                    {
                                        var generated_element = ActiveView.render(view,children[i]);
                                        element.insertBefore((typeof(generated_element) === 'string'
                                            ? document.createTextNode(generated_element)
                                            : generated_element
                                        ),element.childNodes[index + i]);
                                        children[i] = element.childNodes[index + i];
                                    }
                                    collected_elements.splice.apply(collected_elements,[index,to_remove].concat(children));
                                });
                            }
                        }
                    }
                };
            }
        };
    };

    instance.binding.when = function when(outer_key)
    {
        var outer_keys;
        if(arguments.length > 1)
        {
            outer_keys = ActiveSupport.arrayFrom(arguments);
        }
        else if(ActiveSupport.isArray(outer_key))
        {
            outer_keys = outer_key;
        }
        else
        {
            outer_keys = [outer_key];
        }
        return {
            changes: function changes(callback)
            {
                if(!callback || typeof(callback) !== 'function')
                {
                    return ActiveSupport.throwError(Errors.MismatchedArguments,'expected Function, recieved ',typeof(callback),callback);
                }
                instance.scope.observe('set',function changes_observer(inner_key,value){
                    for(var i = 0; i < outer_keys.length; ++i)
                    {
                        if(outer_keys[i] == inner_key)
                        {
                            callback(value);
                        }
                    }
                });
            }
        };
    };
};

ActiveView.Template = {
    create: function create(src,helpers)
    {
        var klass = function klass(){};
        klass.helpers = {};
        ActiveSupport.extend(klass.helpers,helpers || {});
        ActiveSupport.extend(klass.helpers,ActiveView.Template.Helpers);
        ActiveSupport.extend(klass,ActiveView.Template.ClassMethods);
        klass.template = ActiveView.Template.generateTemplate(src);
        return klass;
    }
};

ActiveView.Template.generateTemplate = function generateTemplate(source)
{
    try
    {
        // Original Implementation: Simple JavaScript Templating
        // John Resig - http://ejohn.org/ - MIT Licensed
        var processed_source = source
            .replace(/<%([^\=](.+?))\)(\s*)%>/g,'<%$1);$3%>') //fix missing semi-colons
            .replace(/[\r\t\n]/g, " ")
            .replace(/'(?=[^%]*%>)/g,"\t")
            .split("'").join("\\'")
            .split("\t").join("'")
            .replace(/<%=(.+?)%>/g, "',$1,'")
            .split("<%").join("');")
            .split("%>").join("p.push('")
        ;
        return new Function("data",[
            "var p = [];",
            "var print = function(){p.push.apply(p,arguments);};",
            "with(this.helpers){with(data){p.push('",
            processed_source,
            "');}}",
            "return p.join('');"
        ].join(''));
    }
    catch(e)
    {
        ActiveSupport.throwError(ActiveView.Template.Errors.CompilationFailed,'input:',source,'processed:',processed_source,e);
    }
};

ActiveView.Template.Errors = {
    CompilationFailed: ActiveSupport.createError('The template could not be compiled:')
};

ActiveView.Template.ClassMethods = {
    render: function render(data)
    {
        return ActiveSupport.bind(this.template,this)(data || {});
    }
};

ActiveView.Template.Helpers = {};

})();

var ActiveController = null;

if(typeof exports != "undefined"){
    exports.ActiveController = ActiveController;
}

(function(){

/**
 * @namespace {ActiveController}
 * @example
 * 
 * ActiveController.js
 * ===============
 * Tutorial coming soon.
 */
ActiveController = {};

ActiveController.logging = false;

ActiveController.create = function create(actions,methods)
{
    var klass = function klass(container,parent,params){
        this.container = container;
        this.setRenderTarget(this.container);
        this.parent = parent;
        this.children = [];
        this.history = ActiveSupport.clone(ActiveController.History);
        this.history.callActionAtIndex = ActiveSupport.bind(this.history.callActionAtIndex,this);
        this.params = params || {};
        this.scope = new ActiveEvent.ObservableHash({});
        this.initialize();
    };
    ActiveSupport.extend(klass,ClassMethods);
    for(var action_name in actions || {})
    {
        if(typeof(actions[action_name]) == 'function')
        {
            ActiveController.createAction(klass,action_name,actions[action_name]);
        }
        else
        {
            //plain old property
            klass.prototype[action_name] = actions[action_name];
        }
    }
    ActiveSupport.extend(klass.prototype,InstanceMethods);
    ActiveSupport.extend(klass.prototype,methods || {});
    ActiveEvent.extend(klass);
    return klass;
};

ActiveController.createDefaultContainer = function createDefaultContainer()
{
    var global_context = ActiveSupport.getGlobalContext();
    var div = ActiveView.Builder.div();
    if(!global_context.document.body)
    {
        return ActiveSupport.throwError(Errors.BodyNotAvailable);
    }
    global_context.document.body.appendChild(div);
    return div;
};

ActiveController.createAction = function createAction(klass,action_name,action)
{
    klass.prototype[action_name] = function action_wrapper(){
        if(arguments[0] && typeof(arguments[0]) == 'object')
        {
            this.params = arguments[0];
        }
        this.notify('beforeCall',action_name,this.params);
        this.renderLayout();
        ActiveSupport.bind(action,this)();
        this.history.history.push([action_name,this.params]);
        this.notify('afterCall',action_name,this.params);
    };
};

var InstanceMethods = {
    initialize: function initialize()
    {
        
    },
    get: function get(key)
    {
        return this.scope.get(key);
    },
    set: function set(key,value)
    {
        return this.scope.set(key,value);
    },
    render: function render(params)
    {
        if(typeof(params) !== 'object')
        {
            return ActiveSupport.throwError(Errors.InvalidRenderParams);
        }
        for(var flag_name in params || {})
        {
            if(!RenderFlags[flag_name])
            {
                if(ActiveController.logging)
                {
                    ActiveSupport.log('ActiveController: render() failed with params:',params);
                }
                return ActiveSupport.throwError(Errors.UnknownRenderFlag,flag_name);
            }
            ActiveSupport.bind(RenderFlags[flag_name],this)(params[flag_name],params);
        }
        return params;
    },
    getRenderTarget: function getRenderTarget()
    {
        return this.renderTarget;
    },
    setRenderTarget: function setRenderTarget(target)
    {
        this.renderTarget = target;
    },
    renderLayout: function renderLayout()
    {
        if(this.layout && !this.layoutRendered && typeof(this.layout) == 'function')
        {
            this.layoutRendered = true;
            this.container.innerHtml = '';
            this.container.appendChild(this.layout.bind(this)());
        }
    }
};
ActiveController.InstanceMethods = InstanceMethods;

var RenderFlags = {
    view: function view(view_class,params)
    {
        if(typeof(view_class) === 'string')
        {
            var klass = ActiveSupport.getClass(view_class);
            if(!klass)
            {
                return ActiveSupport.throwError(Errors.ViewDoesNotExist,view_class);
            }
        }
        else
        {
            klass = view_class;
        }
        var response = ActiveView.render(klass,params.scope || this.scope);
        var container = params.target || this.getRenderTarget();
        if(container)
        {
            container.innerHTML = '';
            container.appendChild(response);
        }
    },
    text: function text(text,params)
    {
        var container = params.target || this.getRenderTarget();
        if(container)
        {
            container.innerHTML = text;
        }
    },
    target: function target(target,params)
    {
        //target only available for text + view, needs no processing
    },
    scope: function scope(scope,params)
    {
        //scope only available for text + view, needs no processing
    }
};
ActiveController.RenderFlags = RenderFlags;

var ClassMethods = {
    createAction: function wrapAction(action_name,action)
    {
        return ActiveController.createAction(this,action_name,action);
    }
};
ActiveController.ClassMethods = ClassMethods;

var Errors = {
    BodyNotAvailable: ActiveSupport.createError('Controller could not attach to a DOM element, no container was passed and document.body is not available'),
    InvalidRenderParams: ActiveSupport.createError('The parameter passed to render() was not an object.'),
    UnknownRenderFlag: ActiveSupport.createError('The following render flag does not exist: '),
    ViewDoesNotExist: ActiveSupport.createError('The specified view does not exist: ')
};
ActiveController.Errors = Errors;

ActiveController.History = {
    index: 0,
    history: [],
    //"this" will be bound to the controller instance
    callActionAtIndex: function callActionAtIndex(index)
    {
        this[this.history.history[index][0]].apply(this,this.history.history[index][1]);
    },
    goToIndex: function goToIndex(index)
    {
        if(!this.history[index])
        {
            return false;
        }
        this.index = index;
        this.callActionAtIndex(this.index);
        return true;
    },
    /**
     * Calls the previously called action in the history.
     * @alias ActiveController.prototype.history.back
     * @return {Boolean}
     */
    back: function back()
    {
        if(this.index == 0)
        {
            return false;
        }
        --this.index;
        this.callActionAtIndex(this.index);
        return true;
    },

    /**
     * Calls the next called action in the history if back() has already
     * been called.
     * @alias ActiveController.prototype.history.next
     * @return {Boolean}
     */
    next: function next()
    {
        if(this.index >= this.history.length - 1)
        {
            return false;
        }
        ++this.index;
        this.callActionAtIndex(this.index);
        return true;
    }
};

})();
=======
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
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('K R=1b;if(W 35!="1C"){35.R=R}(O(p){R={2U:O 2U(){N p},6L:O 6L(a,b){b=b||R.2U();K c=b[a];if(!c){K d=(W(b.iK)!==\'1C\');if(d){46{b[a]();c=b[a]}43(e){N 15}}}N c},1I:O 1I(){if(W(3P)!==\'1C\'){if(W 3P.4m!==\'1C\'){4m.1I.1n(4m,18||[])}3P.8M.iA.1n(3P.8M,18||[])}if(W(6m)!==\'1C\'){6m.8N.8O.1I.1n(6m.8N.8O,18||[])}if(W(4m)!==\'1C\'){4m.1I.1n(4m,18||[])}},1V:O 1V(a){N 17 2V(a)},8R:1g,8T:1g,1u:O 1u(a){if(W(a)==\'1t\'){a=17 2V(a);}K b=R.25(18).1M(1);if(R.8R){R.1I.1n(R,[\'ii 2M:\',a].41(b))}if(R.8T){K e=R.1K(a);e.5o=e.5o+b.1N(\',\');8W e;}},25:O 25(a){if(!a){N[]}K b=a.X||0;K c=17 8Z(b);2R(b--){c[b]=a[b]}N c},4n:O 4n(a){N a&&W(a)==\'1m\'&&\'X\'in a&&\'39\'in a&&\'1N\'in a},4p:O 4p(a,b,i){i=i||(0);K c=a.X;if(i<0){i=c+i}Y(;i<c;i++){if(a[i]===b){N i}}N-1},7H:O 7H(a){K b=R.25(18).1M(1);K c=[];Y(K i=0;i<a.X;i++){if(!(R.4p(b,a[i])>-1)){c.19(a[i])}}N c},2P:O 2P(a,b){if(W(b)==\'1C\'){N a}N O hW(){N a.1n(b,18)}},1W:O 1W(a){if(18.X==1){N a}K b=R.25(18).1M(1);N O hU(){N a.1n(8,b.41(R.25(18)))}},5r:O 5r(a,b){N O hR(){b.1n(8,[R.2P(a,8)].41(R.25(18)))}},21:O 21(a){K b=[];Y(K c in a){b.19(c)}N b},7C:O 7C(b){N b.1k(/::/g,\'/\').1k(/([A-Z]+)([A-Z][a-z])/g,O(a){a=a.2s("");N a[0]+\'2e\'+a[1]}).1k(/([a-z\\d])([A-Z])/g,O(a){a=a.2s("");N a[0]+\'2e\'+a[1]}).1k(/-/g,\'2e\').1U()},2E:O 2E(a,b){K c,31=a.1k(/\\2e/g,\'-\').2s(\'-\'),7B=31.X;if(7B===1){if(b){N 31[0].3f(0).4E()+31[0].3x(1)}14{N 31[0]}}if(a.3f(0)===\'-\'){c=31[0].3f(0).4E()+31[0].3x(1)}14{c=31[0]}Y(K i=1;i<7B;i++){c+=31[i].3f(0).4E()+31[i].3x(1)}if(b){N c.3f(0).4E()+c.3x(1)}14{N c}},1l:O 1l(a,b){Y(K c in b){a[c]=b[c]}N a},1K:O 1K(a){N R.1l({},a)},hz:O a(a){N W(a)===\'O\'?a:O(){N a}},1p:O a(a){N W(a)===\'O\'?a():a},2n:O 2n(g,h){K j={};K k=[];k.5q={};k.94=O 94(e){K f=R.5r(e||O(){},O hq(a){K i=1b;K b=R.4p(k,f);k.5q[b]=[a,R.25(18)];K c=1g;Y(i=0;i<k.X;++i){if(!k.5q[i]){c=15}}if(c){Y(i=0;i<k.X;++i){K d=k.5q[i];d[0].1n(d[0],d[1]);2w k.5q[i]}}if(c&&i===k.X){if(h){h(j)}}});k.19(f);N f};g(k,j);if(k.X===0&&h){h(j)}},1R:{2h:{5M:[[/(95)$/i,"$hk"],[/^(96)$/i,"$hi"],[/([m|l])hd$/i,"$hc"],[/(97|98|9c)ix|ex$/i,"$h8"],[/(x|ch|2t|9e)$/i,"$7w"],[/([^9i]|9l)y$/i,"$gZ"],[/(9p)$/i,"$1s"],[/(?:([^f])fe|([9q])f)$/i,"$1$gW"],[/gV$/i,"7m"],[/([9s])gT$/i,"$1a"],[/(gS|gR)o$/i,"$gP"],[/(bu)s$/i,"$gN"],[/(9t|9u)$/i,"$7w"],[/(9v|9w)gI$/i,"$1i"],[/(ax|34)is$/i,"$7w"],[/s$/i,"s"],[/$/,"s"]],64:[[/(95)gD$/i,"$1"],[/(97)9x$/i,"$gB"],[/(98|9c)9x$/i,"$gA"],[/^(96)en/i,"$1"],[/(9t|9u)es$/i,"$1"],[/(9v|9w)i$/i,"$gy"],[/(gx|ax|34)es$/i,"$gw"],[/(gv)s$/i,"$1"],[/(o)es$/i,"$1"],[/(gu)es$/i,"$1"],[/([m|l])gt$/i,"$gs"],[/(x|ch|2t|9e)es$/i,"$1"],[/(m)gr$/i,"$gq"],[/(s)gp$/i,"$go"],[/([^9i]|9l)gn$/i,"$1y"],[/([9q])9y$/i,"$1f"],[/(gl)s$/i,"$1"],[/(9p)s$/i,"$1"],[/([^f])9y$/i,"$gk"],[/(^gj)7m$/i,"$gi"],[/((a)gh|(b)a|(d)gg|(p)gf|(p)ge|(s)gd|(t)he)7m$/i,"$1$gb"],[/([9s])a$/i,"$ga"],[/(n)g8$/i,"$g7"],[/s$/i,""]],4d:[[\'g5\',\'g4\'],[\'g3\',\'g2\'],[\'g1\',\'7d\'],[\'fZ\',\'fY\'],[\'fX\',\'fW\']],5d:["fU","fT","fS","fR","fQ","fP","fO","fN"]},9z:O 9z(a){if(11<=2b(a,10)%6d&&2b(a,10)%6d<=13){N a+"79"}14{3F(2b(a,10)%10){1v 1:N a+"9B";1v 2:N a+"9C";1v 3:N a+"9D";57:N a+"79"}}},76:O 76(a){K i;Y(i=0;i<R.1R.2h.5d.X;i++){K b=R.1R.2h.5d[i];if(a.1U===b){N b}}Y(i=0;i<R.1R.2h.4d.X;i++){K c=R.1R.2h.4d[i][0];K d=R.1R.2h.4d[i][1];if((a.1U===c)||(a===d)){N d}}Y(i=0;i<R.1R.2h.5M.X;i++){K e=R.1R.2h.5M[i][0];K f=R.1R.2h.5M[i][1];if(e.34(a)){N a.1k(e,f)}}},4N:O 4N(a){K i;Y(i=0;i<R.1R.2h.5d.X;i++){K b=R.1R.2h.5d[i];if(a.1U===b){N b}}Y(i=0;i<R.1R.2h.4d.X;i++){K c=R.1R.2h.4d[i][0];K d=R.1R.2h.4d[i][1];if((a.1U===c)||(a===d)){N d}}Y(i=0;i<R.1R.2h.64.X;i++){K e=R.1R.2h.64[i][0];K f=R.1R.2h.64[i][1];if(e.34(a)){N a.1k(e,f)}}}},6l:O 6l(a){K b=a.1k(/^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9]) (?:([0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/,"$1 $2 $3 $4 $5 $6").2s(\' \');N 17 4b(b[0],b[1]-1,b[2],b[3],b[4],b[5])},4Z:O fq(){K f=/d{1,4}|m{1,4}|6D(?:6D)?|([fo])\\1?|[fn]|"[^"]*"|\'[^\']*\'/g,9E=/\\b(?:[fl][fk]T|(?:fi|fh|fg|ff|fd) (?:fc|fb|fa) f9|(?:bs|6I)(?:[\\-\\+]\\d{4})?)\\b/g,9F=/[^\\-\\+\\dA-Z]/g,2S=O(a,b){a=1G(a);b=b||2;2R(a.X<b){a="0"+a}N a};K g=O g(a,b,c){K e=g;if(18.X===1&&(W a==="1t"||a 6R 1G)&&!/\\d/.34(a)){b=a;a=1C}a=a?17 4b(a):17 4b();if(f2(a)){N R.1u(17 9G("f0 6K"));}b=1G(e.6P[b]||b||e.6P["57"]);if(b.1M(0,4)==="6I:"){b=b.1M(4);c=1g}K 2e=c?"eX":"1h",d=a[2e+"4b"](),D=a[2e+"eU"](),m=a[2e+"eT"](),y=a[2e+"eS"](),H=a[2e+"eQ"](),M=a[2e+"eO"](),s=a[2e+"eN"](),L=a[2e+"eL"](),o=c?0:a.eK(),7V={d:d,dd:2S(d),9K:e.4T.6Q[D],9M:e.4T.6Q[D+7],m:m+1,3e:2S(m+1),6S:e.4T.6U[m],6Y:e.4T.6U[m+12],6D:1G(y).1M(2),2A:y,h:H%12||12,hh:2S(H%12||12),H:H,36:2S(H),M:M,2B:2S(M),s:s,2t:2S(s),l:2S(L,3),L:2S(L>99?3Y.a0(L/10):L),t:H<12?"a":"p",eq:H<12?"am":"ep",T:H<12?"A":"P",50:H<12?"el":"ek",Z:c?"6I":(1G(a).1T(9E)||[""]).5b().1k(9F,""),o:(o>0?"-":"+")+2S(3Y.ag(3Y.7i(o)/60)*6d+3Y.7i(o)%60,4),S:["79","9B","9C","9D"][d%10>3?0:(d%6d-d%10!==10)*d%10]};N b.1k(f,O($0){N $0 in 7V?7V[$0]:$0.1M(1,$0.X-1)})};g.6P={"57":"9K 6S dd 2A 36:2B:2t",ed:"m/d/6D",ec:"6S d, 2A",eb:"6Y d, 2A",ea:"9M, 6Y d, 2A",e9:"h:2B 50",e8:"h:2B:2t 50",e7:"h:2B:2t 50 Z",e6:"2A-3e-dd",e5:"36:2B:2t",e4:"2A-3e-dd\'T\'36:2B:2t",ah:"2A-3e-dd 36:2B:2t",e2:"6I:2A-3e-dd\'T\'36:2B:2t\'Z\'"};g.4T={6Q:["e1","e0","dZ","dY","dX","dW","dV","dU","dT","dS","dR","dQ","dP","dO"],6U:["dN","dM","dL","dK","ai","dI","dH","dG","dF","dE","dD","dC","dB","dz","dy","dx","ai","dw","dv","du","dt","ds","dr","dq"]};N g}(),aj:O aj(a){N R.2q.3B(a)},5X:O 5X(f,g){K h=0;K j=O j(a,b){K c=\'\';Y(K i=0;i<b;++i){c+=a}N c};K k=O k(a,b,c){K d=\'\';if(W(b)===\'1t\'||W(b)===\'2g\'||W(b)===\'3R\'){d=\'<![dj[\'+(17 1G(b)).1Q()+\']]>\'}14 if(W(b)===\'1m\'){d+=1G.al(10);if(\'X\'in b&&\'39\'in b){Y(K i=0;i<b.X;++i){d+=m(R.1R.4N(a)||a,b[i],c+1)}}14{K e=b.2C&&W(b.2C)===\'O\'?b.2C():b;Y(a in e){d+=m(a,e[a],c+1)}}d+=j(\' \',4*c)}N d};K l=O l(a){N a.1k(/[\\s\\2e]+/g,\'-\').1U()};K m=O m(a,b,c){a=l(a);N j(\' \',4*c)+\'<\'+a+\'>\'+k(a,b,c)+\'</\'+a+\'>\'+1G.al(10)};f=l(f);N\'<\'+f+\'>\'+k(f,g,0)+\'</\'+f+\'>\'},2q:O(){if(p&&\'2q\'in p&&\'3B\'in p.2q&&\'3H\'in p.2q){N p.2q}O f(n){N n<10?\'0\'+n:n}4b.1c.3O=O(a){N 8.da()+\'-\'+f(8.d9()+1)+\'-\'+f(8.d8())+\'T\'+f(8.d7())+\':\'+f(8.d6())+\':\'+f(8.d5())+\'Z\'};K e=/[\\d4\\aw\\ay-\\az\\aA\\aB\\aC\\aD-\\aE\\aH-\\aI\\aJ-\\aK\\aL\\aM-\\aN]/g,5W=/[\\\\\\"\\cN-\\cM\\cL-\\cK\\aw\\ay-\\az\\aA\\aB\\aC\\aD-\\aE\\aH-\\aI\\aJ-\\aK\\aL\\aM-\\aN]/g,2v,5j,aR={\'\\b\':\'\\\\b\',\'\\t\':\'\\\\t\',\'\\n\':\'\\\\n\',\'\\f\':\'\\\\f\',\'\\r\':\'\\\\r\',\'"\':\'\\\\"\',\'\\\\\':\'\\\\\\\\\'},3I;O 5U(b){5W.aT=0;N 5W.34(b)?\'"\'+b.1k(5W,O(a){K c=aR[a];if(W c===\'1t\'){N c}N\'\\\\u\'+(\'aV\'+(+(a.aX(0))).1Q(16)).1M(-4)})+\'"\':\'"\'+b+\'"\'}O 5k(a,b){K i,k,v,X,5m=2v,2Q,1p=b[a];if(1p&&W 1p===\'1m\'&&W 1p.3O===\'O\'&&!R.4n(1p)){1p=1p.3O(a)}if(W 3I===\'O\'){1p=3I.5O(b,a,1p)}3F(W 1p){1v\'1t\':N 5U(1p.7l());1v\'2g\':N cs(1p)?1G(1p.7l()):\'1b\';1v\'3R\':N 1G(1p.7l());1v\'1b\':N 1G(1p);1v\'1m\':if(!1p){N\'1b\'}2v+=5j;2Q=[];if(W 1p.X===\'2g\'&&!(1p.cr(\'X\'))){X=1p.X;Y(i=0;i<X;i+=1){2Q[i]=5k(i,1p)||\'1b\'}v=2Q.X===0?\'[]\':2v?\'[\\n\'+2v+2Q.1N(\',\\n\'+2v)+\'\\n\'+5m+\']\':\'[\'+2Q.1N(\',\')+\']\';2v=5m;N v}if(3I&&W 3I===\'1m\'){X=3I.X;Y(i=0;i<X;i+=1){k=3I[i];if(W k===\'1t\'){v=5k(k,1p);if(v){2Q.19(5U(k)+(2v?\': \':\':\')+v)}}}}14{Y(k in 1p){if(b0.b1.5O(1p,k)){v=5k(k,1p);if(v){2Q.19(5U(k)+(2v?\': \':\':\')+v)}}}}v=2Q.X===0?\'{}\':2v?\'{\\n\'+2v+2Q.1N(\',\\n\'+2v)+\'\\n\'+5m+\'}\':\'{\'+2Q.1N(\',\')+\'}\';2v=5m;N v}}N{3B:O(a,b,c){K i;2v=\'\';5j=\'\';if(W c===\'2g\'){Y(i=0;i<c;i+=1){5j+=\' \'}}14 if(W c===\'1t\'){5j=c}3I=b;if(b&&W b!==\'O\'&&(W b!==\'1m\'||W b.X!==\'2g\')){N R.1u(17 2V(\'2q.3B\'));}N 5k(\'\',{\'\':a})},3H:O(c,d){K j;O 7x(a,b){K k,v,1p=a[b];if(1p&&W 1p===\'1m\'){Y(k in 1p){if(b0.b1.5O(1p,k)){v=7x(1p,k);if(v!==1C){1p[k]=v}14{2w 1p[k]}}}}N d.5O(a,b,1p)}e.aT=0;if(e.34(c)){c=c.1k(e,O(a){N\'\\\\u\'+(\'aV\'+(+(a.aX(0))).1Q(16)).1M(-4)})}if(/^[\\],:{}\\s]*$/.34(c.1k(/\\\\(?:["\\\\\\/cn]|u[0-9a-fA-F]{4})/g,\'@\').1k(/"[^"\\\\\\n\\r]*"|1g|15|1b|-?\\d+(?:\\.\\d*)?(?:[eE][+\\-]?\\d+)?/g,\']\').1k(/(?:^|:|,)(?:\\s*\\[)+/g,\'\'))){j=cl(\'(\'+c+\')\');N W d===\'O\'?7x({\'\':j},\'\'):j}N R.1u(17 9G(\'2q.3H\'));}}}()}})(8);K 27=1b;if(W 35!="1C"){35.27=27}(O(){27={};27.1l=O 1l(f){f.33=O 33(d){if(8[d]){8.30(d);8[d]=R.5r(8[d],O cg(a){K b=R.25(18).1M(1);K c=a.1n(8,b);b.2I(d);8.1A.1n(8,b);N c})}if(8.1c){8.1c.33(d)}};f.5I=O 5I(a,b,c){N 17 27.7D([[8,a]],b,c)};f.30=O 30(a){8.1D=8.1D||{};8.1D[a]=8.1D[a]||[]};f.1H=O 1H(a,b){if(W(a)===\'1t\'&&W(b)!==\'1C\'){8.30(a);if(!(R.4p(8.1D[a],b)>-1)){8.1D[a].19(b)}}14{Y(K e in a){8.1H(e,a[e])}}N b};f.5x=O 5x(a,b){8.30(a);if(a&&b){8.1D[a]=R.7H(8.1D[a],b)}14 if(a){8.1D[a]=[]}14{8.1D={}}};f.5G=O 5G(a,b){K c=R.2P(O c7(){b.1n(8,18);8.5x(a,c)},8);8.30(a);8.1D[a].19(c);N c};f.1A=O 1A(a){if(!8.1D||!8.1D[a]||(8.1D[a]&&8.1D[a].X==0)){N[]}8.30(a);K b=[];K c=R.25(18).1M(1);Y(K i=0;i<8.1D[a].X;++i){K d=8.1D[a][i].1n(8.1D[a][i],c);if(d===15){N 15}14{b.19(d)}}N b};if(f.1c){f.1c.33=f.33;f.1c.5I=f.5I;f.1c.30=f.30;f.1c.1H=f.1H;f.1c.5x=f.5x;f.1c.5G=f.5G;f.1c.1A=O 1A(a){if((!f.1D||!f.1D[a]||(f.1D[a]&&f.1D[a].X==0))&&(!8.26||!8.26[a])&&(!8.1D||!8.1D[a]||(8.1D[a]&&8.1D[a].X==0))){N[]}K b=R.25(18).1M(1);K c=[];if(f.1A){5Q=R.25(18).1M(1);5Q.2I(8);5Q.2I(a);K d=f.1A.1n(f,5Q);if(d===15){N 15}c=c.41(d)}8.30(a);K e;if(8.26&&8.26[a]&&W(8.26[a])===\'O\'){e=8.26[a].1n(8,b);if(e===15){N 15}14{c.19(e)}}Y(K i=0;i<8.1D[a].X;++i){e=8.1D[a][i].1n(8.1D[a][i],b);if(e===15){N 15}14{c.19(e)}}N c}}};27.7D=O 7D(c,d,e){8.3w=O 3w(){Y(K i=0;i<8.2N.X;++i){8.2N[i][0][8.2N[i][1]]=8.80[i]}};8.2N=c;8.80=[];Y(K i=0;i<8.2N.X;++i){8.80.19(8.2N[i][0][8.2N[i][1]]);8.2N[i][0][8.2N[i][1]]=R.5r(8.2N[i][0][8.2N[i][1]],O(a){K b=R.25(18).1M(1);d.1n(8,b);N a.1n(8,b)})}if(e){e();8.3w()}};K g=O g(a){8.22=a||{}};g.1c.1E=O 1E(a,b){8.22[a]=b;8.1A(\'1E\',a,b);N b};g.1c.1h=O 1h(a){8.1A(\'1h\',a);N 8.22[a]};g.1c.81=O 81(a){8.1A(\'81\',a);K b=8.22[a];2w 8.22[a];N b};g.1c.2C=O 2C(){N 8.22};27.1l(g);27.61=g})();K 1x=1b;if(W 35!="1C"){35.1x=1x}(O(){1x=O 3u(a,b,c){8.6h=15;8.2M=15;8.1B=b||R.2U();8.2k=[];8.1J=0;8.1Y=[];8.26=R.1l({89:\'\',8b:1g,bd:1g,8f:1g,bh:\'\',4a:8.8g},c||{});8.4a=8.26.4a;K i;Y(i=0;i<a.X;++i){if(a[i]){8.8k.1n(8,a[i])}}K d=8;8.1B[8.26.8f?\'4P\':\'bH\']=O bG(){d.4P.1n(d,18)};8.6h=1g};27.1l(1x);1x.3d=15;1x.1c.6v=O 6v(a){if(!8.1Y[a]){N 15}8.1J=a;8.4a(8.1Y[8.1J]);N 1g};1x.1c.6r=O 6r(){if(8.1J==0){N 15}--8.1J;8.4a(8.1Y[8.1J]);N 1g};1x.1c.51=O 51(){if(8.1J>=8.1Y.X-1){N 15}++8.1J;8.4a(8.1Y[8.1J]);N 1g};1x.1c.bl=O bl(){N 8.2M};1x.1c.8k=O 8k(){K a,23,1d,2r;if(18.X==3){a=18[0];23=18[1];1d=18[2]}14 if(18.X==2){if(W(18[0])==\'1t\'&&W(18[1])==\'1t\'){a=18[0];23=18[1]}14{23=18[0];1d=18[1]}}14 if(18.X==1){23=18[0]}2r={24:a,23:1x.6k(23),1d:1d||{}};if(!q.bm(2r)){N R.1u(o.bn);}if(!q.br(2r)){N R.1u(o.bq,2r.23);}if(!q.bp(2r)){N R.1u(o.bo,2r.23);}if(8.6h){8.2k.2I(2r)}14{8.2k.19(2r)}8.88(2r)};1x.87=/[^\\/\\\\]+[\\/\\\\]\\.\\.[\\/\\\\]/;1x.6k=O 6k(a){a=a.1k(/\\#.+$/,\'\');a=a.1k(/\\?.+$/,\'\');a=a.1k(/\\/{2,}/g,"/").1k(/\\\\\\\\/g,"\\\\").1k(/(\\/|\\\\)$/,\'\').1k(/\\\\/g,\'/\').1k(/^\\//,\'\');2R(a.1T(1x.87)){a=a.1k(1x.87,\'\')}a=a.1k(/(\\/1J$|^1J$)/i,\'\');N a};K o={bn:R.1V(\'5a 23 45 6b in 6a 2r\'),bq:R.1V(\'5a :1m 45 6b in 6a 2r: \'),bo:R.1V(\'5a :1S 45 6b in 6a 2r: \'),bg:R.1V(\'2K 5f 1m 40 20 3W: \'),5V:R.1V(\'2K 5f 1S 40 20 3W: \'),b8:R.1V(\'2K 5f 1S is 20 c3: \'),c6:R.1V(\'2K 5f c9 2r 40 20 3W: \'),b4:R.1V(\'ca 20 cb 6a cp: \')};1x.3r=o;1x.1c.5l=O 5l(a,b){if(!a.1d.1S){a.1d.1S=\'1J\'}if(8.26.8b){a.1d.1m=R.2E(a.1d.1m,1g)}if(a.1d.2G){2w a.1d.2G}if(8.26.89){a.1d.1m+=8.26.89}if(!8.7Z(a.1d.1m)){8.2M=o.bg+a.1d.1m}if(!8.7W(a.1d.1m,a.1d.1S)){8.2M=o.5V+a.1d.1m+\'.\'+a.1d.1S}if(!8.aW(a.1d.1m,a.1d.1S)){8.2M=o.b8+a.1d.1m+\'.\'+a.1d.1S}if(8.2M){if(1x.3d){R.1I(\'1x: 5a 1T Y "\'+b+\'" (\'+8.2M+\')\')}N 15}14{if(1x.3d){R.1I(\'1x: cB "\'+b+\'" 3A "\'+(a.24||a.23)+\'"\')}N a}};1x.1c.1T=O(a){K b=a;8.2M=15;a=1x.6k((17 1G(a)).1Q());K c=a.1T(/\\.([^\\.]+)$/);if(c){c=c[1];a=a.1k(/\\.[^\\.]+$/,\'\')}K d=a.2s(\'/\');K e=d.X;Y(K i=0;i<8.2k.X;++i){K f=R.1K(8.2k[i]);f.1d=R.1K(8.2k[i].1d||{});f.cD=c;f.aS=[];if(f.23==a){N 8.5l(f,b)}K g=f.23.2s(\'/\');K h=g.X;K j=1g;if(e<=h||g[g.X-1]==\'*\'){Y(K k=0;k<g.X;++k){K l=d[k];K m=g[k];if(m.3f(0)==\'*\'){f.1d.23=d.1M(k);N 8.5l(f,b)}14 if(m.3f(0)==\':\'){K n=m.cH(1);if(l&&f.1d.2G&&f.1d.2G[n]&&!(W(f.1d.2G[n])==\'O\'?f.1d.2G[n]((17 1G(l).1Q())):l.1T(f.1d.2G[n]))){j=15;1F}14{if(W(l)==\'1C\'&&n!=\'1S\'&&n!=\'1m\'&&n!=\'id\'){j=15;1F}14{f.1d[n]=l;f.aS.19(l)}}}14 if(l!=m){j=15;1F}}if(j){N 8.5l(f,b)}}}N 15};1x.1c.7R=O 7R(a){K b;if(W(a)==\'1t\'){b=8.1T(a);if(!b){if(8.2M){N R.1u(8.2M);}14{N R.1u(o.b4,a);}}}14{b={1d:a}}8.1Y.19(b);8.1J=8.1Y.X-1;if(8.1A(\'cP\',b,a)===15){N 15}8.4a(b);8.1A(\'cQ\',b,a)};1x.1c.8g=O 8g(a){8.1B[a.1d.1m][a.1d.1S](a.1d)};K q={bm:O(a){if(a.23===\'\'){N 1g}14{N!!a.23}},bp:O(a){N!(!a.23.1T(\':1S\')&&(!a.1d||!a.1d.1S))},br:O(a){N!(!a.23.1T(\':1m\')&&(!a.1d||!a.1d.1m))}};1x.1c.7Z=O(a){N!!R.6L(a,8.1B)};1x.1c.7Q=O(a,b){if(8.1B[a].1c&&8.1B[a].1c[b]){N 8.1B[a].1c[b]}14{N 8.1B[a][b]}};1x.1c.7W=O(a,b){N!(!8.7Z(a)||!8.7Q(a,b))};1x.1c.aW=O(a,b){N(8.7W(a,b)&&(W(8.7Q(a,b))===\'O\'))};1x.cS=q;1x.1c.5D=O 5D(a,b,c){if(!b.id){a=a.1k(/\\/?\\:id/,\'\')}if(b.1S==\'1J\'){a=a.1k(/\\/?\\:1S/,\'\')}a=a.1k(/\\/?1J$/,\'\');if(a.3f(0)!=\'/\'){a=\'/\'+a}a=c?a:8.26.bh+a;N a};1x.5C=O 5C(a,b,c){Y(K p in c){if(a.1T(\':\'+p)&&c[p]){if(b.1d.2G&&b.1d.2G[p]){if(W(b.1d.2G[p])==\'O\'&&!b.1d.2G[p]((17 1G(c[p]).1Q()))){7O}14 if(!b.1d.2G[p].42((17 1G(c[p]).1Q()))){7O}}a=a.1k(\':\'+p,c[p].1Q())}}N a};1x.1c.4P=O 4P(a){K b=15;if(a.aF){b=1g;2w a.aF}if(W(a)==\'1t\'){K c=15;Y(K i=0;i<8.2k.X;++i){if(8.2k[i].24&&8.2k[i].24==a){c=i;1F}}if(c===15){N R.1u(o.cW,a);}14{K d={};K e=R.1K(8.2k[c].1d);Y(K f in e){d[f]=e[f]}if(W(18[1])==\'1m\'){Y(K f in 18[1]){d[f]=18[1][f]}}N 8.4P(d)}}if(!a.1S){a.1S=\'1J\'}if(8.26.bd){a.1S=R.2E(a.1S,15)}if(8.26.8b){a.1m=R.2E(a.1m,1g)}Y(K i=0;i<8.2k.X;++i){K g=R.1K(8.2k[i]);g.1d=R.1K(8.2k[i].1d||{});K h=g.23;if((g.1d.1S||\'\').1U()==(a.1S||\'\').1U()&&(g.1d.1m||\'\').1U()==(a.1m||\'\').1U()){h=1x.5C(h,g,a);K j=8.5D(h,a,b);if(!j.1T(\':\')){N j}}}Y(K i=0;i<8.2k.X;++i){K g=R.1K(8.2k[i]);g.1d=R.1K(8.2k[i].1d||{});K h=g.23;if(g.1d.1m==a.1m){h=1x.5C(h,g,a);K j=8.5D(h,a,b);if(!j.1T(\':\')){N j}}}N 15};1x.1c.88=O 88(d){K e=8;if(d.24){K f=d.24+\'cX\';K g=d.24+\'cY\';K h=\'cZ\'+d.24;if(e.26.8f){f=R.2E(f.1k(/\\2e/g,\'-\'));g=R.2E(g.1k(/\\2e/g,\'-\'));h=R.2E(h.1k(/\\2e/g,\'-\'))}e.1B[f]=O d0(a){K b={};Y(K c in d.1d||{}){b[c]=d.1d[c]}Y(K c in a){b[c]=a[c]}N b};e.1B[g]=O d1(a){N e.4P(e.1B[f](a))};e.1B[h]=O d2(a){N e.7R(e.1B[f](a))}}}})();K V=1b;if(W 35!="1C"){35.V=V}(O(){V={3d:15,av:1g,7M:0,2j:{},2Y:{},2o:{},2f:O 2f(d,e,f){if(!V.1e){N R.1u(V.3r.7n);}if(W(d)===\'1t\'){d={1o:d}}K g=1b;if(!d.2i){K h=R.2E(R.1R.4N(d.1o)||d.1o);d.2i=h.3f(0).4E()+h.3x(1)}g=V.2j[d.2i]=O 3u(a){8.2i=8.1j.2i;8.1o=8.1j.1o;8.1q=8.1j.1q;8.22={};Y(K b in a){8.1E(b,a[b],1g)}8.3z=[];Y(K b in 8.1j.2J){if(!8.1j.2J[b].4k){K c=V.1e.4l(8.1j.2J[b],8.1h(b));if(I.3m(c)){c=c.1p}8.1E(b,c)}}8.1A(\'ad\',a)};g.2i=d.2i;g.1o=d.1o;g.1q=\'id\';R.1l(g.1c,V.2o);if(f&&W(f)!==\'O\'){R.1l(g.1c,f||{})}R.1l(g,V.2Y);27.1l(g);if(!e){e={}}K i=15;Y(K j in e){if(W(e[j])===\'1m\'&&e[j].1w&&!(\'1p\'in e[j])){e[j].1p=1b}if(W(e[j])===\'1m\'&&e[j].4k){i=j}}if(!i){e[\'id\']={4k:1g}}g.2J=e;if(i){g.1q=i}Y(K k in g.2J){F.7f(g,k);F.7e(g,k)}if(V.av){I.6c.3v(d.1o,R.1K(g.2J))}N g}};V.eo=V.2f;27.1l(V);V.32=[\'ad\',\'a6\',\'a5\',\'58\',\'a3\',\'3T\',\'a1\',\'2T\'];(O(){Y(K i=0;i<V.32.X;++i){V.2Y[V.32[i]]=V.2o[V.32[i]]=R.1W(O 9Z(a,b){N 8.1H(a,b)},V.32[i])}})();V.9Y=V.1H;V.1H=O 1H(a,b){Y(K i=0;i<V.32.X;++i){if(V.32[i]===a){K c=[];K d;Y(K e in V.2j){d=R.1W(b,V.2j[e]);c.19(d);V.2j[e].1H(a,d)}N c}}N V.9Y(a,b)};(O(){Y(K i=0;i<V.32.X;++i){V[V.32[i]]=R.1W(O 9Z(a,b){V.1H(a,b)},V.32[i])}})();K q={7n:R.1V(\'5a V 1e is et.\'),5V:R.1V(\'2K eu 1S 40 20 3W.\'),9V:R.1V(\'2K 9U 1w 40 20 3W:\')};V.3r=q;R.1l(V.2o,{1E:O 1E(a,b,c){if(W(8[a])!=="O"){8[a]=b}8.22[a]=b;if(!c){8.1A(\'1E\',a,b)}},1h:O 1h(a){N 8.22[a]},2C:O 2C(){N R.1K(8.22)},21:O 21(){K a=[];Y(K b in 8.22){a.19(b)}N a},9T:O 9T(){K a=[];Y(K b in 8.22){a.19(8.22[b])}N a},4v:O 4v(a,b){8.1E(a,b);N 8.4w()},6X:O 6X(a){Y(K b in a){8.1E(b,a[b])}N 8.4w()},6G:O 6G(){if(!8.1h(8.1j.1q)){N 15}K a=8.1j.2d(8.1h(8.1j.1q));if(!a){N 15}8.22={};K b=a.2C();Y(K c in b){8.1E(c,b[c])}N 1g},4w:O 4w(a){if(!8.6W()){N 15}Y(K b in 8.1j.2J){if(!8.1j.2J[b].4k){8.1E(b,V.1e.4X(8.1j.2J[b],8.1h(b)),1g)}}if(8.1A(\'a5\')===15){N 15}if(\'6A\'in 8.22){8.1E(\'6A\',R.4Z(\'2A-3e-dd 36:2B:2t\'))}if(a||!8.1h(8.1j.1q)){if(8.1A(\'a3\')===15){N 15}if(\'6z\'in 8.22){8.1E(\'6z\',R.4Z(\'2A-3e-dd 36:2B:2t\'))}K c=8.1h(8.1j.1q);V.1e.4Y(8.1o,8.1j.1q,8.2C());if(!c){8.1E(8.1j.1q,V.1e.4K())}J.53(8,\'3T\');8.1A(\'3T\')}14{V.1e.55(8.1o,8.1j.1q,8.1h(8.1j.1q),8.2C())}Y(K b in 8.1j.2J){if(!8.1j.2J[b].4k){8.1E(b,V.1e.4l(8.1j.2J[b],8.1h(b)),1g)}}J.53(8,\'58\');8.1A(\'58\');N 8},2z:O 2z(){if(!8.1h(8.1j.1q)){N 15}if(8.1A(\'a1\')===15){N 15}V.1e.56(8.1o,8.1j.1q,8.1h(8.1j.1q));J.53(8,\'2T\');if(8.1A(\'2T\')===15){N 15}N 1g},4O:O 4O(){N 8.2C()},3O:O 3O(a){N R.2q.3B(R.1l(8.4O(),a||{}))},6i:O 6i(a){N R.5X(8.2i,R.1l(8.4O(),a||{}))}});R.1l(V.2Y,{2d:O 2d(b){K c;if(!b){b={}}if((b.3E&&W b.3E==="3R")||((W(b)==="2g"||(W(b)==="1t"&&b.1T(/^\\d+$/)))&&18.X==1)){if(b.3E){b.3G=1;c=V.1e.3J(8.1o,b)}14{c=V.1e.5c(8.1o,8.1q,[b])}if(c&&c.2L&&c.2L(0)){N 8.2u(c.2L(0))}14{N 15}}14{c=1b;if(W(b)===\'1t\'&&!b.1T(/^\\d+$/)){c=V.1e.3J.1n(V.1e,18)}14 if(b&&((W(b)==\'1m\'&&\'X\'in b&&\'1M\'in b)||((W(b)==\'2g\'||W(b)==\'1t\')&&18.X>1))){K d=((W(b)==\'2g\'||W(b)==\'1t\')&&18.X>1)?R.25(18):b;c=V.1e.5c(8.1o,8.1q,d)}14{c=V.1e.3J(8.1o,b)}K e=[];if(c){c.2L(R.2P(O gL(a){e.19(8.2u(a))},8))}8.69(e,b);8.1A(\'a6\',e,b);N e}},2z:O 2z(a){if(a==\'4f\'){K b=8.2d({4f:1g});K c=[];Y(K i=0;i<b.X;++i){c.19(b[i].2z())}N c}14{K d=8.2d(a);if(!d){N 15}N d.2z()}},2u:O 2u(a){++V.7M;K b=17 8(R.1K(a));b.4Q=2b(17 5g(V.7M),10);N b},2f:O 2f(a){K b=8.2u(a);b.4w(1g);N b},5n:O 5n(a,b){if(W(a.X)!==\'1C\'){K c=[];Y(K i=0;i<a.X;++i){c.19(8.5n(a[i],b[i]))}N c}14{K d=8.2d(a);if(!d){N 15}d.6X(b);N d}},9o:O 9o(a,b){V.1e.5p(8.1o,a,b)},3g:O 3g(a,b){46{V.1e.3g(a)}43(e){if(b){b(e)}14{N R.1u(e);}}},69:O 69(a,b){if(!b){b={}}Y(K c in G.2o){a[c]=R.1W(G.2o[c],a,b,8)}if(b.2n){J.7p(8,b,a)}N a}});R.1l(V.2Y,{7v:O 7v(a,b){if(!b){b={}}if(W(b)===\'1t\'){b={1O:b}}N b},48:O 48(a,b,c){if(b&&b.2n){N J.7z(8,a,b)}14{N V.1e.5t(8.1o,8.7v(a,b),c)}},4q:O 4q(a){N 8.48(\'4q\',a,\'h6(*)\')},7I:O 7I(a,b){N 8.48(\'7I\',b,\'h9(\'+a+\')\')},2D:O 2D(a,b){N 8.48(\'2D\',b,\'ha(\'+a+\')\')},3M:O 3M(a,b){N 8.48(\'3M\',b,\'hj(\'+a+\')\')},5A:O 5A(a,b){N 8.48(\'5A\',b,\'hs(\'+a+\')\')},3E:O 3E(){N 8.2d({3E:1g})},93:O 93(){N 8.2d({3E:1g,3l:8.1q+\' i5\'})}});K r={};V.7P=1b;V.1e=1b;V.1Z=O 1Z(a){if(!a){V.1e=r.5F.1Z.1n(r.5F,R.25(18).1M(1));V.7P=V.1e.1j}14{V.7P=a;V.1e=a.1Z.1n(a,R.25(18).1M(1))}27.1l(V.1e);if(!V.1e.i9){V.1A(\'ia\')}};V.2a=O 2a(){if(!V.1e){N R.1u(V.3r.7n);}N V.1e.1L.1n(V.1e,18)};V.5N=O 5N(a,b){K c=b?\'\':\'"\';N W(a)==\'2g\'?a:c+(17 1G(a)).1Q().1k(/\\"/g,\'\\\\"\').1k(/\\\\/g,\'\\\\\\\\\').1k(/\\0/g,\'\\\\0\')+c};r.6N=O 6N(a){if(W(a)===\'2g\'){if(8.4j[a]){N R.1K(8.4j[a])}14{N 15}}14{Y(K i=0;i<8.4j.X;++i){K b=R.1K(8.4j[i]);a(b)}}};r.2o={4i:O 4i(a,b){if(b===1b||W(b)===\'1C\'){if(I.3m(a)){K c=8.44(a);if(W(c)===\'1C\'){N R.1u(q.9V,(a?(a.1w||\'[1m]\'):\'15\'));}N a.1p||c}14{N a}}N b},5P:O 5P(a,b){N a+\' \'+((W(b[a])===\'1m\'&&W(b[a].1w)!==\'1C\')?b[a].1w:8.82(b[a]))},82:O 82(a){if(W(a)===\'1t\'){N\'iB(iC)\'}if(W(a)===\'2g\'){N\'iG\'}if(W(a)==\'3R\'){N\'iH(1)\'}N\'iI\'},44:O 44(a){N a.1p?a.1p:I.8H[a.1w?a.1w.1k(/\\(.*/g,\'\').1U():\'\']},1I:O 1I(){if(!V.3d){N}if(18[0]){18[0]=\'V: \'+18[0]}N R.1I.1n(R,18||{})}};V.2x=r;r.84={8E:15,4Y:O 4Y(a,b,c){K d=R.21(c).59();K e=[];K f=[];Y(K i=0;i<d.X;++i){f.19(c[d[i]]);e.19(\'?\')}f.2I("8C 8B "+a+" ("+d.1N(\',\')+") iO ("+e.1N(\',\')+")");K g=8.1L.1n(8,f);K h=c[b]||8.4K();K j=R.1K(c);j[b]=h;8.1A(\'6z\',a,h,j);N g},5p:O 5p(a,b,c){K d=[];if(W(b)!==\'1t\'){K e=[];K f=R.21(b).59();Y(K i=0;i<f.X;++i){d.19(b[f[i]]);e.19(b[i]+" = ?")}b=e.1N(\',\')}d.2I(\'8z \'+a+\' 8y \'+b+8.6f(c,d));N 8.1L.1n(8,d)},55:O 55(a,b,c,d){K e=R.21(d).59();K f=[];K g=[];Y(K i=0;i<e.X;++i){f.19(d[e[i]]);g.19(e[i]+" = ?")}f.19(c);f.2I("8z "+a+" 8y "+g.1N(\',\')+" 3n "+b+" = ?");K h=8.1L.1n(8,f);8.1A(\'6A\',a,c,d);N h},5t:O 5t(b,c,d){K e=O e(a){if(!a){N 0}N 2b(V.1e.2H(a).2L(0)[\'8u\'],10)};K f=8.6y(b,c,d);N e(8.1L.1n(8,f))},56:O 56(b,c,d){K e,4V;if(d===\'4f\'){e=["8r 3j "+b];K f=[];K g=8.1L(\'3y \'+c+\' 3j \'+b);if(!g){N 1b}8.2H(g).2L(O iS(a){f.19(a[c])});4V=8.1L.1n(8,e);Y(K i=0;i<f.X;++i){8.1A(\'6M\',b,f[i])}N 4V}14{e=["8r 3j "+b+" 3n "+c+" = ?",d];4V=8.1L.1n(8,e);8.1A(\'6M\',b,d);N 4V}},5c:O gH(a,b,c){K d=8.1L.1n(8,[\'3y * 3j \'+a+\' 3n \'+b+\' 3o (\'+c.1N(\',\')+\')\']);if(!d){N 15}14{N V.1e.2H(d)}},3J:O 3J(a,b){K c;if(W(a)===\'1t\'&&!a.1T(/^\\d+$/)&&W(b)!=\'1m\'){c=18}14{c=8.6y(a,b,15)}K d=8.1L.1n(8,c);if(!d){N 15}14{N V.1e.2H(d)}},6y:O 6y(a,b,c){K d=[];K e=\'3y \'+(c?(c+\' iQ 8u\'):(b.8q?b.8q.1N(\',\'):\'*\'))+\' 3j \'+a+8.6f(b.1O,d)+(b.8s?\' \'+b.8s:\'\')+(b.4W?\' 8t 6p \'+b.4W:\'\')+(b.3l?\' 8v 6p \'+b.3l:\'\')+(b.3L&&b.3G?\' 8d \'+b.3L+\',\'+b.3G:\'\')+(!b.3L&&b.3G?\' 8d \'+b.3G:\'\');d.2I(e);N d},6f:O 6f(a,b){K c,21,i;if(a&&R.4n(a)){Y(i=1;i<a.X;++i){b.19(a[i])}N\' 3n \'+a[0]}14 if(a&&W(a)!=="1t"){c=\'\';21=R.21(a);Y(i=0;i<21.X;++i){c+=21[i]+" = ? 3a ";K d;if(W(a[21[i]])===\'2g\'){d=a[21[i]]}14 if(W(a[21[i]])==\'3R\'){d=2b(17 5g(a[21[i]]))}14{d=17 1G(a[21[i]]).1Q()}b.19(d)}c=\' 3n \'+c.3x(0,c.X-4)}14 if(a){c=\' 3n \'+a}14{c=\'\'}N c},3p:O 3p(a){N 8.1L(\'iP 3K 8x 8D \'+a)},4e:O 4e(a,b,c){},85:O 85(a,b){8.1L(\'8F 3K \'+a+\' iN iy \'+b)},4c:O 4c(a,b){},47:O 47(a,b,c){N 8.1L(\'8F 3K \'+a+\' iw iv \'+8.5P(iu,ir))},4X:O 4X(a,b){if(b&&b 6R 4b){N R.4Z(b,\'2A-3e-dd 36:2B:2t\')}if(I.3m(a)){a=8.44(a)}b=8.4i(a,b);if(W(a)===\'1t\'){N(17 1G(b)).1Q()}if(W(a)===\'2g\'){N(17 1G(b)).1Q()}if(W(a)===\'3R\'){N(17 1G(2b(17 5g(b),10))).1Q()}if(W(b)===\'1m\'&&!I.3m(a)){N R.2q.3B(b)}},4l:O 4l(b,c){if(I.3m(b)){if(b.1w.1U().1T(/6K/)&&W(c)==\'1t\'){N R.6l(c)}b=8.44(b)}c=8.4i(b,c);if(W(b)===\'1t\'){N c}if(W(b)===\'3R\'){if(c===\'0\'||c===0||c===\'15\'){c=15}N!!c}if(W(b)===\'2g\'){K d=O(a){N(17 1G(a)).1Q().1k(/^\\s+|\\s+$/g,"")};N(d(c).X>0&&!(/[^0-9.]/).34(d(c))&&(/\\.\\d/).34(d(c)))?iq(17 5g(c)):2b(17 5g(c),10)}if((W(c)===\'1t\'||W(c)===\'1m\')&&(W(b)===\'1m\'&&(W(b.X)!==\'1C\'||W(b.1w)===\'1C\'))){if(W(c)===\'1t\'){N R.2q.3H(c)}14{N c}}},3g:O 3g(a){46{V.1e.1L(\'ip\');a();V.1e.1L(\'il\')}43(e){V.1e.1L(\'ih\');N R.1u(e);}}};r.8Y=R.1l(R.1K(r.84),{3v:O 3v(a,b){K c=R.21(b);K d=[];Y(K i=0;i<c.X;++i){K e=c[i];if(b[e].4k){K f=b[e].1w||\'i7\';d.2I(e+\' \'+f+\' i6 i4\')}14{d.19(8.5P(e,b))}}N 8.1L(\'6j 3K 8x hl 8D \'+a+\' (\'+d.1N(\',\')+\')\')},5B:O 5B(c,d){8.3g(R.2P(O hb(){K a=V.1e.2H(V.1e.1L(\'3y * 3j 9b 3n 9d = "\'+c+\'"\')).2L(0);K b=\'h4\'+c;V.2a(a[\'9f\'].1k(17 7F(\'^6j\\s+3K\\s+\'+c),\'6j 3K \'+b).1k(17 7F(\'(,|\\()\\s*\'+d+\'[\\s\\w]+(\\)|,)\'),O(){N(4s[1]==\'(\'?\'(\':\'\')+4s[2]}));V.2a(\'8C 8B \'+b+\' 3y * 3j \'+c);8.3p(c);8.85(b,c)},8))}});r.2l=O 2l(a){8.29=W(a)===\'1t\'?R.2q.3H(a):(a||{});8.7A=1b};R.1l(r.2l.1c,r.2o);R.1l(r.2l.1c,{8E:1g,9g:O 9g(a){N{}},9h:O 9h(){N R.2q.3B(8.29)},1L:O 1L(a){V.1e.1I(\'2x.2l 5K 20 2a 84:\'+a)},4Y:O 4Y(a,b,c){8.49(a);K d=1;K e=8.29[a];if(!c.id){Y(K f in e){if(2b(f,10)>=d){d=2b(f,10)+1}}c.id=d}8.7A=c.id;8.29[a][c.id]=c;8.1A(\'6z\',a,c.id,c);N 1g},4K:O 4K(){N 8.7A},5p:O 5p(a,b,c){},55:O 55(a,b,c,d){8.49(a);8.29[a][c]=d;8.1A(\'6A\',a,c,d);N 1g},5t:O 5t(a,b,c){8.49(a);K d=8.3J(a,b);K e=c.1T(/([A-h2-z]+)\\(([^\\)]+)\\)/);K f=e[1].1U();K g=e[2];3F(f){1v\'4q\':N d.X;1v\'2D\':K h=0;Y(K i=0;i<d.X;++i){if(2b(d[i][g],10)>h){h=2b(d[i][g],10)}}N h;1v\'3M\':K j=0;if(d[0]){j=d[0][g]}Y(K i=0;i<d.X;++i){if(d[i][g]<j){j=d[i][g]}}N j;1v\'9j\':1v\'5A\':K k=0;Y(K i=0;i<d.X;++i){k+=d[i][g]}N f===\'9j\'?k/d.X:k}},56:O 56(a,b,c){8.49(a);if(!c||c===\'4f\'){Y(K d in 8.29[a]){8.1A(\'6M\',a,d)}8.29[a]={};N 1g}14 if(8.29[a][c]){2w 8.29[a][c];8.1A(\'6M\',a,c);N 1g}N 15},5c:O 5c(a,b,c){K d=8.29[a];K e=[];Y(K i=0;i<c.X;++i){K f=2b(c[i],10);if(d[f]){e.19(d[f])}}N 8.2H(e)},3J:O 3J(a,b){if(W(a)===\'1t\'&&!a.1T(/^\\d+$/)&&W(b)!=\'1m\'){K c=a;K d=R.25(18).1M(1);Y(K i=0;i<d.X;++i){c=c.1k(/\\?/,V.5N(d[i]))}K e=8.7u(c);a=e[0];b=e[1]}14 if(W(b)===\'1C\'){b={}}8.49(a);K f=[];K g=8.29[a];if(b&&b.1O&&b.1O.id){if(g[2b(b.1O.id,10)]){f.19(g[2b(b.1O.id,10)])}}14{Y(K h in g){f.19(g[h])}}K j=[];if(b&&b.4W){j.19(8.7t(b.4W))}if(b&&b.1O){j.19(8.7s(b.1O))}if(b&&b.3l){j.19(8.7r(b.3l))}if(b&&b.3G||b.3L){j.19(8.7q(b.3G,b.3L))}Y(K i=0;i<j.X;++i){f=j[i](f)}N 8.2H(f)},7u:O 7u(a){K b={};K c=/\\s*3y\\s+.+\\s+3j\\s+(\\w+)\\s+/i;K d=a.1T(c);K e=d[1];a=a.1k(c,\'\');K f=[[\'3G\',/(^|\\s+)8d\\s+(.+)$/i],[\'3l\',/(^|\\s+)8v\\s+6p\\s+(.+)$/i],[\'4W\',/(^|\\s+)8t\\s+6p\\s+(.+)$/i],[\'1O\',/(^|\\s+)3n\\s+(.+)$/i]];Y(K i=0;i<f.X;++i){K g=f[i][0];K h=f[i][1];K j=a.1T(h);if(j){b[g]=j[2];a=a.1k(h,\'\')}}N[e,b]},3g:O 3g(a){K b={};Y(K c in 8.29){b[c]=R.1K(8.29[c])}46{a()}43(e){8.29=b;N R.1u(e);}},2H:O 2H(c){c.2L=O 2L(a){if(W(a)===\'2g\'){if(8[a]){N R.1K(8[a])}14{N 15}}14{Y(K i=0;i<8.X;++i){K b=R.1K(8[i]);a(b)}}};N c},49:O 49(a){if(!8.29[a]){8.29[a]={}}},7s:O 7s(e){if(R.4n(e)){K f=e[0];Y(K i=1;i<e.X;++i){f=f.1k(/\\?/,V.5N(e[i]))}e=f}if(W(e)===\'1t\'){N O 9k(a){K b=[];K c=17 t();K d=c.3H(e);Y(K i=0;i<a.X;++i){if(d.2a(a[i],r.2l.7o)){b.19(a[i])}}N b}}14{N O 9k(a){K b=[];Y(K i=0;i<a.X;++i){K c=1g;Y(K d in e){if((17 1G(a[i][d]).1Q())!=(17 1G(e[d]).1Q())){c=15;1F}}if(c){b.19(a[i])}}N b}}},7q:O 7q(b,c){N O h1(a){N a.1M(c||0,b)}},7t:O 7t(e){if(!e||e==\'\'){N O 9m(a){N a}}K f=e.1k(/(^[\\s]+|[\\s]+$)/g,\'\');N O 9m(a){K b=[];K c={};Y(K i=0;i<a.X;++i){c[a[i][f]]=a[i]}Y(K d in c){b.19(c[d])}N b}},7r:O 7r(g){if(!g||g===\'\'){N O 9n(a){N a}}K h=g.2s(\',\');K j=[];Y(K i=0;i<h.X;++i){j.19(h[i].1k(/(^[\\s]+|[\\s]+$)/g,\'\').1k(/[\\s]{2,}/g,\'\').1U())}N O 9n(c){Y(K i=0;i<j.X;++i){K d=j[i].2s(/\\s/);K e=d[0];K f=d[1]&&d[1]===\'gY\';c=c.59(O gX(a,b){N a[e]<b[e]?-1:a[e]>b[e]?1:0});if(f){c=c.9r()}}N c}},3v:O 3v(a,b){if(!8.29[a]){8.29[a]={}}},3p:O 3p(a){2w 8.29[a]},47:O 47(a,b,c){N},7h:O 7h(a,b){N},4e:O 4e(a,b,c){N},4c:O 4c(a,b){N},4X:O 4X(a,b){if(b&&b 6R 4b){N R.4Z(b,\'2A-3e-dd 36:2B:2t\')}if(I.3m(a)){a=8.44(a)}b=8.4i(a,b);N b},4l:O 4l(a,b){if(I.3m(a)){if(a.1w.1U().1T(/6K/)&&W(b)==\'1t\'){N R.6l(b)}a=8.44(a)}b=8.4i(a,b);N b}});r.2l.7o=O 7o(b,c,d){if(!r.2l.5e[b]){b=b.1U().1k(/\\2e[0-9A-Z-a-z]/g,O gM(a){N a.4E()})}if(!r.2l.5e[b]){N R.1u(q.5V);}14{N r.2l.5e[b].1n(r.2l.5e[b],[c].41(d||[]))}};r.2l.5e=(O(){K a={};K b=[\'7i\',\'gK\',\'gJ\',\'gC\',\'gm\',\'fM\',\'fF\',\'fD\',\'ag\',\'1I\',\'2D\',\'3M\',\'fB\',\'fm\',\'a0\',\'f6\',\'f1\',\'eR\'];Y(K i=0;i<b.X;++i){a[b[i]]=(O eP(i){N O eI(){N 3Y[b[i]].1n(3Y.eH[i],R.25(18).1M(1))}})(i)}N a})();r.2l.1Z=O(a){N 17 r.2l(a||{})};r.5F={};r.5F.1Z=O 1Z(){if(W(3P)!==\'1C\'){if(3P.9L.1e.1j==3P.9L.ah.eD){N r.9N.1Z.1n(r.9N.1Z,18)}14{N r.9O.1Z.1n(r.9O.1Z,18)}}14 if(W(6m)!==\'1C\'){N r.9P.1Z.1n(r.9P.1Z,18)}14{46{N r.2y.1Z.1n(r.2y.1Z,18)}43(e){N r.2l.1Z.1n(r.2l.1Z,18)}}};K t;K $c$=0,9Q=-1,3a=$c$++,4J=$c$++,4I=$c$++,4H=$c$++,4G=$c$++,4F=$c$++,4D=$c$++,3o=$c$++,4C=$c$++,4B=$c$++,3t=$c$++,4A=$c$++,4z=$c$++,4g=$c$++,4y=$c$++,4x=$c$++,3s=$c$++,6E=$c$++;K u=[];u[3a]="3a";u[4J]="4J";u[4I]="4I";u[4H]="4H";u[4G]="4G";u[4F]="4F";u[4D]="4D";u[3o]="3o";u[4C]="4C";u[4B]="4B";u[3t]="3t";u[4A]="4A";u[4z]="4z";u[4g]="4g";u[4y]="4y";u[4x]="4x";u[3s]="3s";u[6E]="6E";K v={"&&":3a,",":4J,"||":3s,"<":4C,"<=":4B,"=":4I,"!=":4A,">":4G,">=":4F,"(":3t,")":4g};K w={"6V":3a,"15":4H,"in":3o,"6C":3s,"1g":4x};K y=/^\\s+/;K z=/^[a-9R-Z][a-9R-Z]*/;K A=/^(?:&&|\\|\\||<=|<|=|!=|>=|>|,|\\(|\\))/i;K B=/^(1g|6C|in|15|6V)\\b/i;K C=/^(?:\'(\\\\.|[^\'])*\'|"(\\\\.|[^"])*")/;K D=/^[1-9][0-9]*/;K E;O 3h(a,b){8.1w=a;8.6w=1b;8.2m=b}3h.1c.1Q=O 1Q(){if(8.6w){N"["+8.6w+"]~"+8.2m+"~"}14{N"["+8.1w+"]~"+8.2m+"~"}};O 6u(){8.6t(1b)}6u.1c.6t=O 6t(a){8.2W=a;8.3L=0;8.X=(a!==1b)?a.X:0;E=1b};6u.1c.1X=O 1X(){K a=1g;K b=1b;2R(a){a=15;b=1b;if(8.3L<8.X){K c,2m,1w;if((c=y.42(8.2W))!==1b){b=17 3h(6E,c[0]);a=1g}14 if((c=A.42(8.2W))!==1b){2m=c[0];1w=v[2m.1U()];b=17 3h(1w,2m)}14 if((c=B.42(8.2W))!==1b){2m=c[0];1w=w[2m.1U()];b=17 3h(1w,2m)}14 if((c=C.42(8.2W))!==1b){b=17 3h(4y,c[0])}14 if((c=D.42(8.2W))!==1b){b=17 3h(4z,c[0])}14 if((c=z.42(8.2W))!==1b){b=17 3h(4D,c[0])}14{b=17 3h(9Q,8.2W)}if(u[b.1w]){b.6w=u[b.1w]}K d=b.2m.X;8.3L+=d;8.2W=8.2W.3x(d)}}E=b;N b};O 3X(a,b,c){8.9S=a;8.4S=b;8.6o=c}3X.1c.2a=O 2a(a,b){K c=1b;K d=8.9S.2a(a,b);if(8.4S==3o){c=15;Y(K i=0;i<8.6o.X;i++){K e=8.6o[i].2a(a,b);if(d==e){c=1g;1F}}}14{K e=8.6o.2a(a,b);3F(8.4S){1v 4I:c=(d===e);1F;1v 4A:c=(d!==e);1F;1v 4C:c=(d<e);1F;1v 4B:c=(d<=e);1F;1v 4G:c=(d>e);1F;1v 4F:c=(d>=e);1F;1v 3a:c=(d&&e);1F;1v 3s:c=(d||e);1F;57:N R.1u(17 2V("er 4S 1w: "+8.4S));}}N c};O 73(a){8.74=a}73.1c.2a=O 2a(a,b){N a[8.74]};O 75(a,b){8.24=a;8.4s=b}75.1c.2a=O 2a(a,b){K c=17 8Z(8.4s.X);Y(K i=0;i<8.4s.X;i++){c[i]=8.4s[i].2a(a,b)}N b(8.24,a,c)};O 4u(a){8.1p=a}4u.1c.2a=O 2a(a,b){N 8.1p};t=O t(){8.1P=17 6u()};t.1c.3H=O 3H(a){K b=1b;E=1b;8.1P.6t(a);8.1P.1X();2R(E!==1b){3F(E.1w){1v 4D:1v 4H:1v 3t:1v 4z:1v 4y:1v 4x:b=8.78();1F;57:8W 17 2V("a2 a4 a7 in 1O-a8:"+8.1P.a9);N R.1u(17 2V("a2 a4 a7 in 1O-a8:"+8.1P.a9));}}N b};t.1c.78=O 78(){K a=8.4r();2R(E!==1b&&E.1w===3o){8.1P.1X();K b=[];if(E!==1b&&E.1w===3t){8.1P.1X();2R(E!==1b){b.19(8.4r());if(E!==1b&&E.1w===4J){8.1P.1X()}14{1F}}if(E!==1b&&E.1w===4g){8.1P.1X();a=17 3X(a,3o,b)}14{N R.1u(17 2V("\'in\' 7c aa 20 em 3A a 7g 66."+E));}}14{N R.1u(17 2V("\'in\' 7c aa 20 ac 3A a ej 66"));}}N a};t.1c.4r=O 4r(){K a=8.63();2R(E!==1b&&E.1w===3s){8.1P.1X();K b=8.63();a=17 3X(a,3s,b)}N a};t.1c.63=O 63(){K a=8.62();2R(E!==1b&&E.1w===3a){8.1P.1X();K b=8.62();a=17 3X(a,3a,b)}N a};t.1c.62=O 62(){K a=8.7j();if(E!==1b){K b=E.1w;3F(b){1v 4I:1v 4A:8.1P.1X();K c=8.7j();a=17 3X(a,b,c);1F}}N a};t.1c.7j=O(){K a=8.5Z();if(E!==1b){K b=E.1w;3F(b){1v 4C:1v 4B:1v 4G:1v 4F:8.1P.1X();K c=8.5Z();a=17 3X(a,b,c);1F}}N a};t.1c.5Z=O 5Z(){K a=1b;if(E!==1b){3F(E.1w){1v 4D:a=17 73(E.2m);8.1P.1X();if(E!==1b&&E.1w===3t){K b=a.74;K c=[];8.1P.1X();2R(E!==1b&&E.1w!==4g){c.19(8.4r());if(E!==1b&&E.1w===4J){8.1P.1X()}}if(E!==1b){8.1P.1X();a=17 75(b,c)}14{N R.1u(17 2V("5i 1z 7c 45 20 ei 3A a 7g 66."));}}1F;1v 4x:a=17 4u(1g);8.1P.1X();1F;1v 4H:a=17 4u(15);8.1P.1X();1F;1v 4z:a=17 4u(E.2m-0);8.1P.1X();1F;1v 4y:K d=E.2m;a=17 4u(d.3x(1,d.X-1));8.1P.1X();1F;1v 3t:8.1P.1X();a=8.4r();if(E!==1b&&E.1w===4g){8.1P.1X()}14{N R.1u(17 2V("eh ef 7g 66: "+E));}1F}}N a};V.ee=t;K F={5S:O 5S(a,b,c){if(!c){c={}}c=R.1K(c);if(c.1O){c.1O[a]=b}14{c.1O={};c.1O[a]=b}N c},7f:O 7f(e,f){e[\'e3\'+R.2E(f,1g)]=R.1W(O dJ(a,b,c,d){N a.2d(R.1l(F.5S(b,c,d),{3E:1g}))},e,f)},7e:O 7e(e,f){e[\'dp\'+R.2E(f,1g)]=R.1W(O dn(a,b,c,d){N a.2d(R.1l(F.5S(b,c,d),{4f:1g}))},e,f)}};V.dh=F;K G={};G.2o={6G:O 6G(a,b,c){a.X=0;K d=c.2d(R.1l(R.1K(b),{2n:15}));Y(K i=0;i<d.X;++i){a.19(d[i])}},ao:O ao(a,b,c){K d=[];Y(K i=0;i<a.X;++i){d.19(a[i].2C())}N d},3O:O 3O(a,b,c){K d=[];Y(K i=0;i<a.X;++i){d.19(a[i].4O())}N R.2q.3B(d)},6i:O 6i(a,b,c){K d=[];Y(K i=0;i<a.X;++i){d.19(a[i].4O())}N R.5X(R.1R.76(c.2i),d)}};K H={38:O(a){K b=R.2E(a,1g);K c=R.1R.4N(b)||b;N c||b},5L:O(a,b){K c=R.7C(b).1U();K d=R.1R.4N(c)||c;if(!a||W(a)===\'1C\'){N(d||c)+\'de\'}14{N a}}};V.aq=H;V.2Y.ar=O ar(e,f){if(e&&e.2i){e=e.2i}if(!f){f={}}e=H.38(e);K g=f.24?H.38(f.24):e;K h=H.5L(f.7y,H.38(e));K i={};K j={};j[\'1h\'+g]=R.1W(O as(a,b){K c=8.1h(b);if(c){N V.2j[a].2d(c)}14{N 15}},e,h);i[\'2u\'+g]=j[\'2u\'+g]=R.1W(O 7E(a,b,c){N V.2j[a].2u(c||{})},e,h);j[\'2f\'+g]=R.1W(O 7G(a,b,c){K d=V.2j[a].2f(c||{});if(8.1h(8.1j.1q)){8.4v(b,d.1h(d.1j.1q))}N d},e,h);R.1l(8.1c,j);R.1l(8,i);if(f.7K){8.1H(\'2T\',O dc(a){K b=a[\'1h\'+g]();if(b){b.2z()}})}};V.2Y.7L=O 7L(h,j){if(h&&h.2i){h=h.2i}if(!j){j={}}h=H.38(h);K k=j.24?H.38(j.24):h;K l=h;K m=H.5L(j.7y,H.38(8.2i));K n={};K o={};if(j.au){K p=H.38(j.au);o[\'1h\'+k+\'5z\']=R.1W(O d3(a,b,c,d){K e=8[\'1h\'+a+\'5z\']();K f=[];K g=[];Y(K i=0;i<e.X;++i){g.19(e[i][\'1h\'+b]())}N g},p,h,m);o[\'1h\'+k+\'aG\']=R.1W(O cV(a,b,c,d){if(!d){d={}}if(!d.1O){d.1O={}}d.1O[c]=8.1h(8.1j.1q);N V.2j[a].4q(d)},p,h,m)}14{o[\'2z\'+k]=n[\'2z\'+k]=R.1W(O cU(a,b,c){K d=V.2j[a].2d((c&&W(c.1h)===\'O\')?c.1h(c.1j.1q):c);if(d){N d.2z()}14{N 15}},h,m);o[\'1h\'+k+\'5z\']=R.1W(O cT(a,b,c){K d=8.1h(8.1j.1q);if(!d){N 8.1j.69([])}if(!c){c={}}if(j.3l){c.3l=j.3l}if(j.2n){c.2n=j.2n}if(!c.1O){c.1O={}}c.1O[b]=d;c.4f=1g;N V.2j[a].2d(c)},h,m);o[\'1h\'+k+\'aG\']=R.1W(O cR(a,b,c){K d=8.1h(8.1j.1q);if(!d){N 0}if(!c){c={}}if(!c.1O){c.1O={}}c.1O[b]=d;N V.2j[a].4q(c)},h,m);o[\'2u\'+k]=R.1W(O 7E(a,b,c){K d=8.1h(8.1j.1q);if(!c){c={}}c[b]=d;N V.2j[a].2u(c)},h,m);o[\'2f\'+k]=R.1W(O 7G(a,b,c){K d=8.1h(8.1j.1q);if(!c){c={}}c[b]=d;N V.2j[a].2f(c)},h,m)}R.1l(8.1c,o);R.1l(8,n);if(j.7K){8.1H(\'2T\',O cO(a){K b=a[\'1h\'+k+\'5z\']();V.1e.1I(\'aq.7L 2z \'+b.X+\' 7K \'+h+\' 7d cJ \'+a.2i);Y(K i=0;i<b.X;++i){b[i].2z()}})}};V.2Y.aQ=O aQ(e,f){if(e&&e.2i){e=e.2i}if(!f){f={}}e=H.38(e);K g=f.24?H.38(f.24):e;K h=H.5L(f.7y,e);K i={};K j={};j[\'1h\'+g]=R.1W(O as(a,b){K c=8.1h(b);if(c){N V.2j[a].2d(c)}14{N 15}},e,h);j[\'2u\'+g]=i[\'2u\'+g]=R.1W(O 7E(a,b,c){K d=V.2j[a].2u(c||{});if(f.3Q){d[f.3Q]=1}N d},e,h);j[\'2f\'+g]=R.1W(O 7G(a,b,c){K d=8[\'2u\'+a](c);if(d.4w()&&8.1h(8.1j.1q)){8.4v(b,d.1h(d.1j.1q))}N d},e,h);R.1l(8.1c,j);R.1l(8,i);if(f.3Q){8.1H(\'2T\',O cC(a){K b=a[\'1h\'+g]();if(b){K c=b.1h(f.3Q);if(W(c)===\'1C\'){c=0}b.4v(f.3Q,3Y.2D(0,2b(c,10)-1))}});8.1H(\'3T\',O cA(a){K b=a[\'1h\'+g]();if(b){K c=b.1h(f.3Q);if(W(c)===\'1C\'){c=0}b.4v(f.3Q,2b(c,10)+1)}})}};K I={8H:{\'cz\':0,\'cy\':0,\'cx\':0,\'cq\':0,\'c0\':0,\'bX\':0,\'bS\':0,\'bc\':0,\'bc bO\':0,\'bN\':0,\'bM\':0,\'bJ\':0,\'6K\':\'\',\'bI\':\'\',\'bF\':\'\',\'bB\':\'\',\'bt\':\'\',\'f8\':\'\',\'bv\':\'\',\'bw\':\'\',\'bx\':\'\',\'by\':\'\',\'2m\':\'\',\'bz\':\'\',\'bA\':\'\',\'bC\':\'\',\'bD\':\'\',\'bE\':\'\',\'1E\':\'\'},4M:{},6B:O 6B(a){if(W(a)===\'1C\'||a===15){a=I.2D()}I.8i();V.1e.1I(\'8j.6B(\'+a+\') ac.\');K b=I.6F();V.1e.1I(\'bk bj 3k is \'+b);K c,i,52;I.4R.3g(O(){if(a>b){c=I.8n(b,a);Y(i=0;i<c.X;++i){V.1e.1I(\'bi 4U 3D 3k \'+c[i][0]);c[i][1].4U(I.6c);I.4R.2f({3k:c[i][0]})}}14 if(a<b){c=I.8h(b,a);Y(i=0;i<c.X;++i){V.1e.1I(\'bi 4L 3D 3k \'+c[i][0]);c[i][1].4L(I.6c)}52=I.4R.2d({4f:1g});Y(i=0;i<52.X;++i){if(52[i].1h(\'3k\')>a){52[i].2z()}}V.1e.1I(\'bK 3D 3k \'+a+\' bL.\')}14{V.1e.1I(\'bk bj 3k is 6F, bf 4M bP bQ.\')}},O(e){V.1e.1I(\'bR bb: \'+e)});V.1e.1I(\'8j.6B(\'+a+\') bT.\')},6F:O 6F(){I.8i();N I.4R.2D(\'3k\')||0},2D:O 2D(){K a=0;Y(K b in I.4M){b=2b(b,10);if(b>a){a=b}}N a},8i:O bU(){if(!I.4R){I.4R=V.2f(\'bV\',{3k:0});2w V.2j.bW}},8h:O 8h(a,b){N[[a,I.4M[a]]].41(I.6e(a,b+1,\'4L\'))},8n:O 8n(a,b){N I.6e(a,b,\'4U\')},6e:O 6e(a,b,c){K d=[];Y(K e in I.4M){e=2b(e,10);if((c===\'4U\'&&e>a)||(c===\'4L\'&&e<a)){d.19(e)}}d=d.59();if(c===\'4L\'){d=d.9r()}K f=[];Y(K i=0;i<d.X;++i){if((c===\'4L\'&&W(b)!==\'1C\'&&b>d[i])||(c===\'4U\'&&W(b)!==\'1C\'&&b<d[i])){1F}f.19([d[i],I.4M[d[i]]])}N f},3m:O 3m(a){N W(a)===\'1m\'&&R.21(a).X===2&&(\'1w\'in a)&&(\'1p\'in a)},6c:{3v:O 3v(a,b){N V.1e.3v(a,b)},3p:O 3p(a){N V.1e.3p(a)},47:O 47(a,b,c){N V.1e.47(a,b,c)},5B:O 7h(a,b){N V.1e.5B(a,b)},4e:O 4e(a,b,c){N V.1e.4e(a,b,c)},4c:O 4c(a,b){N V.1e.4c(a,b)}}};V.8j=I;R.1l(V.2Y,{68:O 68(a){if(!8.67){8.67=[]}8.67.19(a)},ba:O ba(a,b){b=R.1l({},b||{});8.68(O bY(){if(!8.1h(a)||8.1h(a)===\'\'){8.5h(b.5o||(a+\' is 20 bZ.\'))}})},b9:O b9(b,c){c=R.1l({3M:1,2D:c1},c||{});8.68(O c2(){K a=17 1G(8.1h(b));if(a.X<c.3M){8.5h(c.5o||(b+\' is b7 c4.\'))}if(a.X>c.2D){8.5h(c.5o||(b+\' is b7 c5.\'))}})}});R.1l(V.2o,{5h:O 5h(a,b){K c=1b;if(b){c=[a,b];c.1Q=O 1Q(){N a}}14{c=a}8.3z.19(a)},6W:O 6W(){8.3z=[];K a=8.7U();Y(K i=0;i<a.X;++i){a[i].1n(8)}if(W(8.7S)===\'O\'){8.7S()}V.1e.1I(\'V.7S()? \'+(17 1G(8.3z.X===0).1Q())+(8.3z.X>0?\'. 3r: \'+(17 1G(8.3z)).1Q():\'\'));N 8.3z.X===0},7U:O 7U(){N 8.1j.67||[]},b6:O b6(){N 8.3z}});V.c8=15;K J={};J.2Z={};J.37={};J.2F={};J.5s=O 5s(a){if(!a.1h(a.1j.1q)){N 15}if(!J.2F[a.1o]){J.2F[a.1o]={}}if(!J.2F[a.1o][a[a.1j.1q]]){J.2F[a.1o][a[a.1j.1q]]={}}N 1g};J.53=O 53(a,b){K c,3b;if(!J.5s(a)){N 15}if(b===\'58\'){c=J.2F[a.1o][a[a.1j.1q]];Y(3b in c){if(3b!==a.4Q){K d=c[3b];K e=d.21();Y(K i=0;i<e.X;++i){K f=e[i];d.1E(f,a.1h(f))}d.1A(\'b5:58\')}}}14 if(b===\'2T\'||b===\'3T\'){if(J.2Z[a.1o]){Y(K g in J.2Z[a.1o]){J.2Z[a.1o][g]()}}if(J.37[a.1o]){Y(K h in J.37[a.1o]){K j=J.37[a.1o][h].b3;K k=R.1K(J.37[a.1o][h].1d);K l=a.1j.2d(R.1l(k,{2n:15}));K m=J.7N(j,l,b);Y(K x=0;x<m.X;++x){if(b==\'3T\'){K n=m[x].1M(2);Y(K s=0;s<n.X;++s){n[s].2n()}}j.39.1n(j,m[x])}}}if(b===\'2T\'){c=J.2F[a.1o][a[a.1j.1q]];Y(3b in c){if(3b!==a.4Q){c[3b].1A(\'b5:2T\');J.2F[a.1o][a[a.1j.1q]][3b]=1b;2w J.2F[a.1o][a[a.1j.1q]][3b]}}}}};R.1l(V.2o,{2n:O 2n(){if(!8.b2){8.b2=1g;J.5s(8);J.2F[8.1o][8[8.1j.1q]][8.4Q]=8}},3w:O 3w(){J.5s(8);J.2F[8.1o][8[8.1j.1q]][8.4Q]=1b;2w J.2F[8.1o][8[8.1j.1q]][8.4Q]}});J.5v=0;J.7z=O 7z(e,f,g){++J.5v;K h=g.2n;K i=R.1K(g);2w i.2n;if(!J.2Z[e.1o]){J.2Z[e.1o]={}}J.2Z[e.1o][J.5v]=(O cc(a,b,c,d){N O cd(){d(a[b](i))}})(e,f,g,h);J.2Z[e.1o][J.5v]();N(O ce(a,b){N O cf(){J.2Z[a][b]=1b;2w J.2Z[a][b]}})(e.1o,J.5v)};J.5J=0;J.7p=O 7p(c,d,e){++J.5J;if(!J.37[c.1o]){J.37[c.1o]={}}J.37[c.1o][J.5J]={b3:e,1d:d};Y(K i=0;i<e.X;++i){e[i].2n()}e.3w=(O ci(a,b){N O 3w(){Y(K i=0;i<8.X;++i){8[i].3w()}J.37[a][b]=1b;2w J.37[a][b]}})(c.1o,J.5J)};J.7N=O 7N(a,b,c){K d=[];if(c===\'3T\'){Y(K i=0;i<b.X;++i){if(!a[i]||(a[i]&&(a[i][a[i].1j.1q]!==b[i][b[i].1j.1q]))){d.19([i,1b,b[i]]);1F}}}14 if(c===\'2T\'){Y(K i=0;i<a.X;++i){if(!b[i]||(b[i]&&(b[i][b[i].1j.1q]!==a[i][a[i].1j.1q]))){d.19([i,1]);1F}}}N d};V.cj=J})();(O(){V.2x.2y=O 2y(f){8.db=f;R.1l(8,V.2x.2o);R.1l(8,V.2x.8Y);R.1l(8,{1L:O 1L(a){K b=R.25(18);K c=1b;if(W(b[b.X-1])===\'O\'){c=b.5b()}V.1e.1I("2x.2y.1L: "+a+" ["+b.1M(1).1N(\',\')+"]");K d=V.1e.db.2a(a,b.1M(1));if(c){c(d)}N d},4K:O 4K(){N 8.db.ck},2H:O 2H(a){K b={4j:[]};K c=a.cm();2R(a.co()){K d={};Y(K i=0;i<c;++i){d[a.ct(i)]=a.9U(i)}b.4j.19(d);a.51()}a.cu();b.2L=V.2x.6N;N b},cv:O(a){K b={};K c=V.1e.2H(V.1e.1L(\'3y * 3j 9b 3n 9d = "\'+a+\'"\')).2L(0);K d=c.9f.1T(17 7F(\'6j[\\s]+3K[\\s]+\'+a+\'[\\s]+(\\([^\\)]+)\'));K e=d.2s(\',\');Y(K i=0;i<e.X;++i){b[e[i].1k(/(^\\s+|\\s+$)/g,\'\')]=e[i].1k(/^\\w+\\s?/,\'\')}N b}})};V.2x.2y.7k=\'V.2x.2y 5K 20 2d a cw 2y aZ 3D 1Z 3D.\';V.2x.2y.1Z=O 1Z(a,b,c,d){K f=R.2U();K g=1b;if(!(f.3V&&3V.5R)){K h=1b;if(\'aY\'in f){h=17 aY()}14 if(\'aU\'in f){46{h=17 aU(\'2y.cE\');if(h.cF().4p(\'cG\')!==-1){h.cI(8)}}43(e){N R.1u(V.2x.2y.7k);}}14 if((\'aP\'in aO)&&(\'at/x-ap\'in aO.aP)){h=R.2U().3i.4o("1m");h.df.dg="di";h.dk=0;h.dl=0;h.1w="at/x-ap";R.2U().3i.dm.3C(h)}if(!h){N R.1u(V.2x.2y.7k);}if(!(\'3V\'in f)){3V={}}if(!(\'5R\'in 3V)){3V.5R={ak:h}}}g=3V.5R.ak.2f(\'do.aZ\');g.eg(a||\'V\');N 17 V.2x.2y(g)}})();K 1r=1b;(O(){1r={};1r.3d=15;1r.2f=O 2f(a,b){if(W(26)===\'O\'){26={65:26}}K c=O c(){8.3u.1n(8,18)};R.1l(c,n);R.1l(c.1c,b||{});R.1l(c.1c,m);c.1c.65=a||1r.7b;27.1l(c);N c};1r.7b=O 7b(){N 1r.7a.af()};1r.6g=O 6g(a){27.1l(a);a.33(\'77\');a.33(\'2I\');a.33(\'5b\');a.33(\'19\');a.33(\'39\')};1r.2p=O 2p(a,b){if(!b){b={}}if(W(a)===\'O\'&&!1r.4t(a)){a=a(b)}if(a&&(W(a)==\'1t\'||a.3c==1)){N a}14 if(1r.5y(a)){N a.28}14 if(1r.4t(a)){N 17 a(b).28}N R.1u(o.ae);};1r.5y=O 5y(a){N a&&a.28&&a.28.3c==1&&a.1B&&a.72};1r.4t=O 4t(a){N a&&a.1c&&a.1c.65&&a.1c.6q&&a.1c.71};K m={3u:O 3u(a,b){8.ab=b;8.6q(a);if(1r.3d){R.1I(\'1r: 6h 3A 1B:\',a)}8.72={};p.6s(8.72,8.1B);1r.70(8);8.28=8.65();if(!8.28||!8.28.3c||8.28.3c!==1){N R.1u(o.9X,W(8.28),8.28);}Y(K c in 8.1B.22){8.1B.1E(c,8.1B.22[c])}},6q:O 6q(a){8.1B=(a?(a.2C?a:17 27.61(a)):17 27.61({}));Y(K b in 8.1B.22){K c=8.1B.22[b];if((c!==1b&&W c==="1m"&&\'39\'in c&&\'1N\'in c)&&!c.1H){1r.6g(c)}}},1h:O 1h(a){N 8.1B.1h(a)},1E:O 1E(a,b){if((b!==1b&&W b==="1m"&&\'39\'in b&&\'1N\'in b)&&!b.1H){1r.6g(b)}N 8.1B.1E(a,b)},9W:O 9W(a){a.3C(8.28);N 8.28},71:O 71(a,b,c){8.ev.19([a,b,c])}};K n={};K o={9X:R.1V(\'2K 6x 1j ew N a 6Z 3Z. ey: \'),ae:R.1V(\'2K ez 3D 2p 45 20 a 1t, 6Z 3Z 6C 1r.\'),3q:R.1V(\'eA 1z 1w 6T: \')};K p={6H:{},4o:O 4o(a,b){K c=R.2U();K d=!!(c.eB&&!c.eC);b=b||{};a=a.1U();K e;if(d&&b.24){a=\'<\'+a+\' 24="\'+b.24+\'">\';2w b.24;e=p.6J(c.3i.4o(a))}14{if(!p.6H[a]){p.6H[a]=p.6J(c.3i.4o(a))}e=p.6H[a].eF(15)}p.6O(e,b);N e},6J:O 6J(a){N a},6O:O 6O(a,b,c){K d={eG:\'9J\',eJ:\'Y\'};K e={};if(W b===\'1m\'){e=b}14{e[b]=W(c)===\'1C\'?1g:c}Y(K f in e){b=d[f]||f;c=e[f];if(c===15||c===1b){a.eM(b)}14 if(c===1g){a.9I(b,b)}14{a.9I(b,c)}}N a},9H:O 9H(a){R.1l(p,a||{})}};p.6s=O 6s(b,c){K d=("A eV eW eY eZ f3 B f4 f5 f7 fj fp fr "+"fs ft fu fv fw fx fy fz fC fE fG fH fI fJ fK fL fV "+"g0 g6 g9 gc gz gE gF gG gO gQ gU h0 h3 I h5 h7 hf hg hm "+"hn ho hp hr ht hu hv hw hx hy hA hB hC hD P "+"hE hF Q S hG hH 3y hI hJ hK hL hM hN hO 3K hP hQ "+"hS hT hV hX hY hZ 50 U i0 i1").2s(/\\s+/);K e=R.2U();Y(K t=0;t<d.X;++t){K f=d[t];(O i2(a){b[a.1U()]=b[a]=O i3(){K i,1z,7J,92,2O,3Z;92=[];2O=[];Y(i=0;i<18.X;++i){1z=18[i];if(W(1z)===\'1C\'||1z===1b||1z===15){7O}if(W(1z)===\'O\'&&!1r.4t(1z)){1z=1z()}if(W(1z)!==\'1t\'&&W(1z)!==\'2g\'&&!(1z!==1b&&W 1z==="1m"&&\'39\'in 1z&&\'1N\'in 1z)&&!(1z&&1z.3c===1)){7J=1z}14 if(1z!==1b&&W 1z==="1m"&&\'39\'in 1z&&\'1N\'in 1z){2O=1z}14 if((1z&&1z.3c===1)||W(1z)===\'1t\'||W(1z)===\'2g\'){2O.19(1z)}14 if(1r.5y(1z)){N 2O.19(1z.28)}14 if(1r.4t(1z)){N 2O.19(17 1z(c||{}).28)}}3Z=p.4o(a,7J);Y(i=0;i<2O.X;++i){3Z.3C((2O[i]&&2O[i].3c===1)?2O[i]:e.3i.91((17 1G(2O[i])).1Q()))}N 3Z}})(f)}};p.6s(p);1r.7a=p;1r.70=O 70(l){l.5u={};l.5u.5n=O 5n(i){if(!i||!i.3c===1){N R.1u(o.3q,\'3N 90, 3S \',W(i),i);}N{5w:O 5w(c){K d=l.1B;if(18.X===2){d=18[1];c=18[2]}K e=1b;K f=O i8(){N 1g};K g=O g(a){if(!a||W(a)!==\'O\'){N R.1u(o.3q,\'3N 5i, 3S \',W(a),a);}e=a;N{5E:h}};K h=O h(a){if(!a||W(a)!==\'O\'){N R.1u(o.3q,\'3N 5i, 3S \',W(a),a);}f=a;N{8X:g}};d.1H(\'1E\',O ib(a,b){if(c==a){if(f()){i.5H=e?e(b):b}}});N{8X:g,5E:h}}}};l.5u.7T=O 7T(k){if(!k){N R.1u(o.3q,\'3N 1t, 1r 9J 6C O, 3S \',W(k),k);}N{5w:O 5w(j){if(!j||(W(j)!==\'1m\'&&W(j)!==\'1t\')){N R.1u(o.3q,\'3N ic, 3S \',W(j),j);}N{7X:O 7X(e){if(!e||!e.3c===1){N R.1u(o.3q,\'3N 90, 3S \',W(e),e);}if(W(j)===\'1t\'){K f=j;l.1B.1H(\'1E\',O ie(a,b){if(a==f){e.5H=\'\';l.5u.7T(k).5w(b).7X(e)}})}14{K g=[];Y(K i=0;i<j.X;++i){K h=1r.2p(k,j[i]);e.3C(h);g.19(e.4h[e.4h.X-1])}if(j.1H){j.1H(\'5b\',O ig(){g[g.X-1].8V.7Y(g[g.X-1]);g.5b()});j.1H(\'19\',O ij(a){K b=1r.2p(k,a);e.3C(b);g.19(e.4h[e.4h.X-1])});j.1H(\'2I\',O ik(a){K b=1r.2p(k,a);e.8U(b,e.5T);g.2I(e.5T)});j.1H(\'77\',O im(){e.7Y(e.5T);g.77(e.5T)});j.1H(\'39\',O io(a,b){K c=[];K i;Y(i=2;i<18.X;++i){c.19(18[i])}if(b){Y(i=a;i<(a+b);++i){g[i].8V.7Y(g[i])}}Y(i=0;i<c.X;++i){K d=1r.2p(k,c[i]);e.8U((W(d)===\'1t\'?3i.91(d):d),e.4h[a+i]);c[i]=e.4h[a+i]}g.39.1n(g,[a,b].41(c))})}}}}}}};l.5u.5E=O 5E(d){K e;if(18.X>1){e=R.25(18)}14 if(R.4n(d)){e=d}14{e=[d]}N{8S:O 8S(c){if(!c||W(c)!==\'O\'){N R.1u(o.3q,\'3N 5i, 3S \',W(c),c);}l.1B.1H(\'1E\',O it(a,b){Y(K i=0;i<e.X;++i){if(e[i]==a){c(b)}}})}}}};1r.2X=O 2X(a,b){8.5Y={};R.1l(8.5Y,b||{});R.1l(8.5Y,1r.2X.8Q);8.83=1r.2X.86(a);R.1l(8,1r.2X.2o)};1r.2X.86=O 86(a){46{K b=a.1k(/<%([^\\=](.+?))\\)(\\s*)%>/g,\'<%$1);$3%>\').1k(/[\\r\\t\\n]/g," ").1k(/\'(?=[^%]*%>)/g,"\\t").2s("\'").1N("\\\\\'").2s("\\t").1N("\'").1k(/<%=(.+?)%>/g,"\',$1,\'").2s("<%").1N("\');").2s("%>").1N("p.19(\'");N 17 5i("8P",["K p = [];","K iz = O(){p.19.1n(p,18);};","3A(8.5Y){3A(8P){p.19(\'",b,"\');}}","N p.1N(\'\');"].1N(\'\'))}43(e){R.1u(1r.2X.3r.8L,\'iD:\',a,\'iE:\',b,e);}};1r.2X.3r={8L:R.1V(\'2K 83 5K 20 be iF:\')};1r.2X.2o={2p:O 2p(a){N R.2P(8.83,8)(a||{})}};1r.2X.8Q={}})();K 2c=1b;if(W 35!="1C"){35.2c=2c}(O(){2c={};2c.3d=15;2c.2f=O 2f(d,e){K f=O f(a,b,c){8.28=a;8.8a(8.28);8.ab=b;8.7d=[];8.1Y=R.1K(2c.8K);8.1Y.3U=R.2P(8.1Y.3U,8);8.1d=c||{};8.1B=17 27.61({});8.3u()};R.1l(f,j);Y(K g in d||{}){if(W(d[g])==\'O\'){2c.54(f,g,d[g])}14{f.1c[g]=d[g]}}R.1l(f.1c,h);R.1l(f.1c,e||{});27.1l(f);N f};2c.8J=O 8J(){K a=R.2U();K b=1r.7a.af();if(!a.3i.8c){N R.1u(k.8I);}a.3i.8c.3C(b);N b};2c.54=O 54(a,b,c){a.1c[b]=O iJ(){if(18[0]&&W(18[0])==\'1m\'){8.1d=18[0]}8.1A(\'iL\',b,8.1d);8.8e();R.2P(c,8)();8.1Y.1Y.19([b,8.1d]);8.1A(\'iM\',b,8.1d)}};K h={3u:O 3u(){},1h:O 1h(a){N 8.1B.1h(a)},1E:O 1E(a,b){N 8.1B.1E(a,b)},2p:O 2p(a){if(W(a)!==\'1m\'){N R.1u(k.8G);}Y(K b in a||{}){if(!i[b]){if(2c.3d){R.1I(\'2c: 2p() bb 3A 1d:\',a)}N R.1u(k.8A,b);}R.2P(i[b],8)(a[b],a)}N a},6n:O 6n(){N 8.8w},8a:O 8a(a){8.8w=a},8e:O 8e(){if(8.8l&&!8.8p&&W(8.8l)==\'O\'){8.8p=1g;8.28.iR=\'\';8.28.3C(8.8l.2P(8)())}}};2c.2o=h;K i={6x:O 6x(a,b){if(W(a)===\'1t\'){K c=R.6L(a);if(!c){N R.1u(k.8o,a);}}14{c=a}K d=1r.2p(c,b.1B||8.1B);K e=b.8m||8.6n();if(e){e.5H=\'\';e.3C(d)}},2m:O a(a,b){K c=b.8m||8.6n();if(c){c.5H=a}},8m:O a(a,b){},1B:O a(a,b){}};2c.iT=i;K j={54:O iU(a,b){N 2c.54(8,a,b)}};2c.2Y=j;K k={8I:R.1V(\'iV 5K 20 iW 3D a 6Z 3Z, bf 28 45 6T 6V 3i.8c is 20 iX\'),8G:R.1V(\'2K iY 6T 3D 2p() 45 20 an 1m.\'),8A:R.1V(\'2K 5f 2p iZ 40 20 3W: \'),8o:R.1V(\'2K 6b 6x 40 20 3W: \')};2c.3r=k;2c.8K={1J:0,1Y:[],3U:O 3U(a){8[8.1Y.1Y[a][0]].1n(8,8.1Y.1Y[a][1])},6v:O 6v(a){if(!8.1Y[a]){N 15}8.1J=a;8.3U(8.1J);N 1g},6r:O 6r(){if(8.1J==0){N 15}--8.1J;8.3U(8.1J);N 1g},51:O 51(){if(8.1J>=8.1Y.X-1){N 15}++8.1J;8.3U(8.1J);N 1g}}})();',62,1178,'||||||||this||||||||||||||||||||||||||||||||||||||var|||return|function|||ActiveSupport||||ActiveRecord|typeof|length|for||||||else|false||new|arguments|push||null|prototype|params|connection||true|get||constructor|replace|extend|object|apply|tableName|value|primaryKeyName|ActiveView||string|throwError|case|type|ActiveRoutes||argument|notify|scope|undefined|_observers|set|break|String|observe|log|index|clone|executeSQL|slice|join|where|_lexer|toString|Inflector|method|match|toLowerCase|createError|curry|advance|history|connect|not|keys|_object|path|name|arrayFrom|options|ActiveEvent|container|storage|execute|parseInt|ActiveController|find|_|create|number|Inflections|modelName|Models|routes|InMemory|text|synchronize|InstanceMethods|render|JSON|route|split|ss|build|gap|delete|Adapters|Gears|destroy|yyyy|MM|toObject|max|camelize|notifications|requirements|iterableFromResultSet|unshift|fields|The|iterate|error|methods|elements|bind|partial|while|pad|afterDestroy|getGlobalContext|Error|source|Template|ClassMethods|calculationNotifications|_objectEventSetup|parts|eventNames|makeObservable|test|exports|HH|resultSetNotifications|normalizeModelName|splice|AND|internal_count_id|nodeType|logging|mm|charAt|transaction|Lexeme|document|FROM|version|order|objectIsFieldDefinition|WHERE|IN|dropTable|MismatchedArguments|Errors|OR|LPAREN|initialize|createTable|stop|substring|SELECT|_errors|with|stringify|appendChild|to|first|switch|limit|parse|rep|findEntities|TABLE|offset|min|expected|toJSON|Jaxer|counter|boolean|recieved|afterCreate|callActionAtIndex|google|exist|BinaryOperatorNode|Math|element|does|concat|exec|catch|getDefaultValueFromFieldDefinition|was|try|addColumn|performCalculation|setupTable|dispatcher|Date|removeIndex|irregular|addIndex|all|RPAREN|childNodes|setValueFromFieldIfValueIsNull|rows|primaryKey|fieldOut|console|isArray|createElement|indexOf|count|parseOrExpression|args|isActiveViewClass|ScalarNode|updateAttribute|save|TRUE|STRING|NUMBER|NOT_EQUAL|LESS_THAN_EQUAL|LESS_THAN|IDENTIFIER|toUpperCase|GREATER_THAN_EQUAL|GREATER_THAN|FALSE|EQUAL|COMMA|getLastInsertedRowId|down|migrations|singularize|toSerializableObject|urlFor|internalCount|Meta|operator|i18n|up|response|group|fieldIn|insertEntity|dateFormat|TT|next|versions|triggerSynchronizationNotifications|createAction|updateEntity|deleteEntity|default|afterSave|sort|No|pop|findEntitiesById|uncountable|MethodCallbacks|following|Number|addError|Function|indent|str|checkAndCleanRoute|mind|update|message|updateMultitpleEntities|waiting|wrap|setupNotifications|calculateEntities|binding|synchronizedCalculationCount|from|stopObserving|isActiveViewInstance|List|sum|dropColumn|performParamSubstitution|cleanPath|when|Auto|observeOnce|innerHTML|observeMethod|synchronizedResultSetCount|could|normalizeForeignKey|plural|escape|call|getColumnDefinitionFragmentFromKeyAndColumns|object_args|gears|mergeOptions|firstChild|quote|MethodDoesNotExist|escapeable|XMLFromObject|helpers|parseMemberExpression||ObservableHash|parseEqualityExpression|parseAndExpression|singular|structure|parenthesis|_validators|addValidator|resultSetFromArray|the|specified|Schema|100|collectMigrations|buildWhereSQLFragment|makeArrayObservable|initialized|toXML|CREATE|normalizePath|dateFromDateTime|air|getRenderTarget|rhs|BY|setupScope|back|generator|setSource|WhereLexer|goToIndex|typeName|view|buildSQLArguments|created|updated|migrate|or|yy|WHITESPACE|current|reload|cache|UTC|extendCreatedElement|date|getClass|destroyed|defaultResultSetIterator|writeAttribute|masks|dayNames|instanceof|mmm|passed|monthNames|and|_valid|updateAttributes|mmmm|DOM|generateBinding|registerEventHandler|builder|IdentifierNode|identifier|FunctionNode|pluralize|shift|parseInExpression|th|Builder|defaultStructure|list|children|generateFindAllByField|generateFindByField|right|removeColumn|abs|parseRelationalExpression|DatabaseUnavailableError|valueOf|ses|ConnectionNotEstablished|method_call_handler|synchronizeResultSet|createLimit|createOrderBy|createWhere|createGroupBy|paramsFromSQLString|processCalculationParams|1es|walk|foreignKey|synchronizeCalculation|lastInsertId|len|underscore|MethodCallObserver|buildRelated|RegExp|createRelated|without|average|attributes|dependent|hasMany|internalCounter|spliceArgumentsFromResultSetDiff|continue|adapter|getMethod|dispatch|valid|collect|_getValidators|flags|methodExists|into|removeChild|objectExists|originals|unset|getDefaultColumnDefinitionFragmentFromValue|template|SQL|renameTable|generateTemplate|normalizePathDotDotRegexp|generateMethodsForRoute|classSuffix|setRenderTarget|camelizeObjectName|body|LIMIT|renderLayout|camelizeGeneratedMethods|defaultDispatcher|collectBelowIndex|setup|Migrations|addRoute|layout|target|collectAboveIndex|ViewDoesNotExist|layoutRendered|select|DELETE|joins|GROUP|calculation|ORDER|renderTarget|IF|SET|UPDATE|UnknownRenderFlag|INTO|INSERT|EXISTS|schemaLess|ALTER|InvalidRenderParams|fieldTypesWithDefaultValues|BodyNotAvailable|createDefaultContainer|History|CompilationFailed|Log|Introspector|Console|data|Helpers|logErrors|changes|throwErrors|insertBefore|parentNode|throw|transform|SQLite|Array|Element|createTextNode|text_nodes|last|add|quiz|ox|matr|vert|||sqlite_master|ind|tbl_name|sh|sql|entityMissing|serialize|aeiouy|avg|json_result_where_processor|qu|json_result_group_by_processor|json_result_order_by_processor|updateAll|hive|lr|reverse|ti|alias|status|octop|vir|ices|ves|ordinalize||st|nd|rd|timezone|timezoneClip|SyntaxError|addMethods|setAttribute|class|ddd|DB|dddd|JaxerMySQL|JaxerSQLite|AIR|ERROR|zA|lhs|values|field|InvalidFieldType|attachTo|ViewDoesNotReturnContainer|old_observe|event_name_delegator|round|beforeDestroy|Unrecognized|beforeCreate|starting|beforeSave|afterFind|token|clause|currentLexeme|did|parent|start|afterInitialize|InvalidContent|div|floor|MySQL|May|JSONFromObject|factory|fromCharCode|||toArray|googlegears|Relationships|hasOne|getRelated|application|through|autoMigrate|u00ad||u0600|u0604|u070f|u17b4|u17b5|u200c|u200f|only_path|Count|u2028|u202f|u2060|u206f|ufeff|ufff0|uffff|navigator|mimeTypes|belongsTo|meta|orderedParams|lastIndex|ActiveXObject|0000|methodCallable|charCodeAt|GearsFactory|database|Object|hasOwnProperty|isSynchronized|resultSet|UnresolvableUrl|synchronization|getErrors|too|MethodNotCallable|validatesLengthOf|validatesPresenceOf|failed|double|camelizeMethodName||no|ObjectDoesNotExist|base|Migrating|schema|Current|getError|hasPath|NoPathInRoute|NoMethodInRoute|hasMethod|NoObjectInRoute|hasObject|GMT|year||varchar|tinyblob|tinytext|blob|mediumtext|mediumblob|time|longblob|longtext|enum|timestamp|generatedUrlFor|url_for|datetime|numeric|Migrate|complete|decimal|real|precision|were|run|Migration|float|finished|setMigrationsTable|schema_migrations|SchemaMigrations|bitint|validates_presence_of_callback|present|integer|9999|validates_length_of_callback|callable|short|long|NamedRouteDoesNotExist|bound_inner_observer|asynchronous|named|Could|resolve|calculation_synchronization_executer_generator|calculation_synchronization_executer|calculation_synchronization_stop_generator|calculation_synchronization_stop|wrapped_observer||result_set_synchronization_stop_generator|Synchronization|lastInsertRowId|eval|fieldCount|bfnrt|isValidRow|url|int|propertyIsEnumerable|isFinite|fieldName|close|fieldListFromTable|Google|mediumint|smallint|tinyint|incrementBelongsToCounter|matched|decrementBelongsToCounter|extension|Factory|getBuildInfo|ie_mobile|substr|privateSetGlobalObject|of|x9f|x7f|x1f|x00|destroyDependentChildren|beforeDispatch|afterDispatch|getRelatedCount|Validations|getRelatedList|destroyRelated|getRelatedCountForThrough|NamedRouteDoesNotExistError|_params|_url|call_|generated_params_for|generated_url_for|generated_call|getRelatedListForThrough|u0000|getUTCSeconds|getUTCMinutes|getUTCHours|getUTCDate|getUTCMonth|getUTCFullYear||destroyRelatedDependent||_id|style|display|Finders|none|CDATA|width|height|documentElement|generated_find_all_by_field_delegator|beta|findAllBy|December|November|October|September|August|July|June|April|March|February||January|Dec|Nov|Oct|Sep|Aug|Jul|Jun|generated_find_by_field_delegator|Apr|Mar|Feb|Jan|Saturday|Friday|Thursday|Wednesday|Tuesday|Monday|Sunday|Sat|Fri|Thu|Wed|Tue|Mon|Sun|isoUtcDateTime|findBy|isoDateTime|isoTime|isoDate|longTime|mediumTime|shortTime|fullDate|longDate|mediumDate|shortDate|WhereParser|closing|open|Missing|closed|left|PM|AM|end||define|pm|tt|Unknown||active|requested|eventHandlers|must||Returned|content|Incorrect|attachEvent|opera|Connection||cloneNode|className|math_methods|generated_math_method|htmlFor|getTimezoneOffset|Milliseconds|removeAttribute|Seconds|Minutes|math_method_generator|Hours|tan|FullYear|Month|Day|ABBR|ACRONYM|getUTC|ADDRESS|APPLET|invalid|sqrt|isNaN|AREA|BASE|BASEFONT|sin|BDO|char|Time|Prevailing|Daylight|Standard|Atlantic||Eastern|Central|Mountain|Pacific|BIG|SDP|PMCEA|random|LloSZ|HhMsTt|BLOCKQUOTE|date_format_wrapper|BODY|BR|BUTTON|CAPTION|CENTER|CITE|CODE|COL|COLGROUP||pow|DD|exp|DEL|cos|DFN|DIR|DIV|DL|DT|EM|ceil|equipment|information|rice|money|species|series|fish|sheep|FIELDSET|people|person|men|man|FONT|child|sexes|sex|moves|move|FORM|1ews|ews|FRAME|1um|2sis|FRAMESET|ynop|rogno|arenthe|iagno|naly|1sis|analy|1fe|tive|atan2|ies|1eries|eries|1ovie|ovies|1ouse|ice|bus|shoe|1is|cris|1us|H1|1ex|1ix|atan|zes|H2|H3|H4|findEntityById|us|asin|acos|result_iterator|camelize_underscores|1ses|H5|1oes|H6|tomat|buffal|um|HEAD|sis|2ves|result_set_sorter|desc|1ies|HR|json_result_limit_processor|Za|HTML|temp_|IFRAME|COUNT|IMG|1ices|AVG|MAX|drop_column_transaction|1ice|ouse||INPUT|INS||1en|MIN|1zes|NOT|ISINDEX|KBD|LABEL|LEGEND|synchronizationWrapper|LI|SUM|LINK|MAP|MENU|META|NOFRAMES|NOSCRIPT|proc|OBJECT|OL|OPTGROUP|OPTION|PARAM|PRE|SAMP|SCRIPT|SMALL|SPAN|STRIKE|STRONG|STYLE|SUB|SUP|TBODY|TD|wrapped|TEXTAREA|TFOOT|curried|TH|bound|THEAD|TITLE|TR|UL|VAR|tag_iterator|tag_generator|KEY|DESC|PRIMARY|INTEGER|default_condition|preventConnectedNotification|connected|update_from_observer|array||collection_key_change_observer||pop_observer|ROLLBACK|Throwing|push_observer|unshift_observer|COMMIT|shift_observer||splice_observer|BEGIN|parseFloat|columns||changes_observer|key|COLUMN|ADD||TO|print|info|VARCHAR|255|input|processed|compiled|INT|TINYINT|TEXT|action_wrapper|__noSuchMethod__|beforeCall|afterCall|RENAME|VALUES|DROP|AS|innerHtml|id_collector_iterator|RenderFlags|wrapAction|Controller|attach|available|parameter|flag'.split('|'),0,{}))
>>>>>>> 995bbe8fa64f252c01ed60909eb9544630fcba03:latest/active.air.packed.js
