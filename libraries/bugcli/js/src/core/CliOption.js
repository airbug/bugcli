/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugcli.CliOption')

//@Require('Class')
//@Require('Collections')
//@Require('Obj')
//@Require('Throwables')
//@Require('TypeUtil')
//@Require('bugcli.CliParameter')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Collections     = bugpack.require('Collections');
    var Obj             = bugpack.require('Obj');
    var Throwables      = bugpack.require('Throwables');
    var TypeUtil        = bugpack.require('TypeUtil');
    var CliParameter    = bugpack.require('bugcli.CliParameter');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var CliOption = Class.extend(Obj, {

        _name: "bugcli.CliOption",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Set.<string>}
             */
            this.flagSet            = Collections.set();

            /**
             * @private
             * @type {string}
             */
            this.name               = "";

            /**
             * @private
             * @type {List.<CliParameter>}
             */
            this.parameterList      = Collections.list();

            /**
             * @private
             * @type {Map.<string, CliParameter>}
             */
            this.parameterMap       = Collections.map();

            /**
             * @private
             * @type {boolean}
             */
            this.required           = false;
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Object} cliOptionObject
         */
        initWithObject: function(cliOptionObject) {
            this.init();
            var _this = this;
            if (TypeUtil.isObject(cliOptionObject)) {
                if (TypeUtil.isString(cliOptionObject.name)) {
                    this.name = cliOptionObject.name;
                }
                if (TypeUtil.isBoolean(cliOptionObject.required)) {
                    this.required = cliOptionObject.required;
                }
                if (TypeUtil.isArray(cliOptionObject.flags) && cliOptionObject.flags.length > 0) {
                    cliOptionObject.flags.forEach(function (flag) {
                        if (TypeUtil.isString(flag)) {
                            _this.flagSet.add(flag);
                        }
                    });
                } else {
                    throw Throwables.illegalArgumentBug("CliOption.initWithObject", cliOptionObject, "cliOptionObject.flags must be specified, must be an array and must not be empty");
                }
                if (TypeUtil.isArray(cliOptionObject.parameters)) {
                    cliOptionObject.parameters.forEach(function (parameterObject) {
                        var cliParameter = new CliParameter(parameterObject);
                        _this.parameterList.add(cliParameter);
                        _this.parameterMap.put(cliParameter.getName(), cliParameter);
                    });
                }
            }
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Set.<string>}
         */
        getFlagSet: function() {
            return this.flagSet;
        },

        /**
         * @return {string}
         */
        getName: function() {
            return this.name;
        },

        /**
         * @return {List.<CliParameter>}
         */
        getParameterList: function() {
            return this.parameterList;
        },

        /**
         * @return {boolean}
         */
        getRequired: function() {
            return this.required;
        },


        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {*} value
         * @return {boolean}
         */
        equals: function(value) {
            if (Class.doesExtend(value, CliOption)) {
                return Obj.equals(this.name, value.getName());
            }
            return false;
        },

        /**
         * @return {number}
         */
        hashCode: function() {
            if (!this._hashCode) {
                this._hashCode = Obj.hashCode("[CliOption]" +
                    Obj.hashCode(this.name));
            }
            return this._hashCode;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} parameterName
         * @return {CliParameter}
         */
        getParameterWithParameterName: function(parameterName) {
            return this.parameterMap.get(parameterName);
        },

        /**
         * @param {string} flag
         * @returns {boolean}
         */
        hasFlag: function(flag) {
            return this.flagSet.contains(flag);
        },

        /**
         * @return {boolean}
         */
        hasParameters: function() {
            return !this.parameterMap.isEmpty();
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugcli.CliOption', CliOption);
});
