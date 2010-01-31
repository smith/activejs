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
 * @namespace {ActiveSupport.Inflector} A port of Rails Inflector class.
 */
ActiveSupport.Inflector = {
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
            "info",
            "equipment",
            "media"
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
        var i, lc = word.toLowerCase();
        for (i = 0; i < ActiveSupport.Inflector.Inflections.uncountable.length; i++)
        {
            var uncountable = ActiveSupport.Inflector.Inflections.uncountable[i];
            if (lc === uncountable)
            {
                return word;
            }
        }
        for (i = 0; i < ActiveSupport.Inflector.Inflections.irregular.length; i++)
        {
            var singular = ActiveSupport.Inflector.Inflections.irregular[i][0];
            var plural = ActiveSupport.Inflector.Inflections.irregular[i][1];
            if ((lc === singular) || (lc === plural))
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
        return word;
    },
    /**
     * Generates a singular version of an english word.
     * @alias ActiveSupport.Inflector.singularize
     * @param {String} word
     * @return {String}
     */
    singularize: function singularize(word)
    {
        var i, lc = word.toLowerCase();
        for (i = 0; i < ActiveSupport.Inflector.Inflections.uncountable.length; i++)
        {
            var uncountable = ActiveSupport.Inflector.Inflections.uncountable[i];
            if (lc === uncountable)
            {
                return word;
            }
        }
        for (i = 0; i < ActiveSupport.Inflector.Inflections.irregular.length; i++)
        {
            var singular = ActiveSupport.Inflector.Inflections.irregular[i][0];
            var plural   = ActiveSupport.Inflector.Inflections.irregular[i][1];
            if ((lc === singular) || (lc === plural))
            {
                return singular;
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
        return word;
    }
};