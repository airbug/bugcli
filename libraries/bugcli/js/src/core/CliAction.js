/*
 * Copyright (c) 2015 airbug inc. http://airbug.com
 *
 * bugcli may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugcli.CliAction')

//@Require('Class')
//@Require('Collections')
//@Require('Obj')
//@Require('Throwables')
//@Require('TypeUtil')
//@Require('bugcli.CliOption')
//@Require('bugcli.CliParameter')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Collections     = bugpack.require('Collections');
    var Obj             = bugpack.require('Obj');
    var Throwables      = bugpack.require('Throwables');
    var TypeUtil        = bugpack.require('TypeUtil');
    var CliOption       = bugpack.require('bugcli.CliOption');
    var CliParameter    = bugpack.require('bugcli.CliParameter');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var CliAction = Class.extend(Obj, {

        _name: 'bugcli.CliAction',


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
             * @type {string}
             */
            this.command                = '';

            /**
             * @private
             * @type {boolean}
             */
            this.default                = false;

            /**
             * @private
             * @type {function(Map.<string, *>, function(Throwable=))}
             */
            this.executeMethod          = null;

            /**
             * @private
             * @type {Map.<string, CliOption>}
             */
            this.flagToOptionMap        = new Collections.map();

            /**
             * @private
             * @type {Set.<CliOption>}
             */
            this.optionSet              = Collections.set();

            /**
             * @private
             * @type {List.<CliParameter>}
             */
            this.parameterList          = Collections.list();

            /**
             * @private
             * @type {Map.<string, CliParameter>}
             */
            this.parameterMap           = Collections.map();

            /**
             * @private
             * @type {function(Map.<string, *>, function(Throwable=))}
             */
            this.validateMethod         = null;
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Object} cliActionObject
         * @return {CliAction}
         */
        initWithObject: function(cliActionObject) {
            this.init();

            var _this = this;
            if (TypeUtil.isObject(cliActionObject)) {
                if (TypeUtil.isString(cliActionObject.command)) {
                    this.command = cliActionObject.command;
                } else {
                    throw Throwables.illegalArgumentBug('CliAction.initWithObject', cliActionObject, 'cliActionObject.command must be specified and must be a string');
                }
                if (TypeUtil.isBoolean(cliActionObject.default)) {
                    this.default = cliActionObject.default;
                }
                if (TypeUtil.isFunction(cliActionObject.executeMethod)) {
                    this.executeMethod = cliActionObject.executeMethod;
                } else {
                    throw Throwables.illegalArgumentBug('CliAction.initWithObject', cliActionObject, 'cliActionObject.executeMethod must be specified and must be a function');
                }
                if (TypeUtil.isFunction(cliActionObject.validateMethod)) {
                    this.validateMethod = cliActionObject.validateMethod;
                }
                if (TypeUtil.isArray(cliActionObject.options)) {
                    cliActionObject.options.forEach(function(optionObject) {
                        var cliOption = CliOption.alloc().initWithObject(optionObject);
                        if (!_this.optionSet.contains(cliOption)) {
                            _this.optionSet.add(cliOption);
                            cliOption.getFlagSet().forEach(function(flag) {
                                if (!_this.flagToOptionMap.containsKey(flag)) {
                                    _this.flagToOptionMap.put(flag, cliOption);
                                } else {
                                    throw Throwables.illegalArgumentBug('CliAction.initWithObject', cliActionObject, 'cliActionObject.options - duplicate flag found');
                                }
                            });
                        } else {
                            throw Throwables.illegalArgumentBug('CliAction.initWithObject', cliActionObject, 'cliActionObject.options - duplicate option found');
                        }
                    });
                }
                if (TypeUtil.isArray(cliActionObject.parameters)) {
                    cliActionObject.parameters.forEach(function (parameterObject) {
                        var cliParameter = CliParameter.alloc().initWithObject(parameterObject);
                        _this.parameterList.add(cliParameter);
                        _this.parameterMap.put(cliParameter.getName(), cliParameter);
                    });
                }
            }
            return this;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getCommand: function() {
            return this.command;
        },

        /**
         * @return {boolean}
         */
        getDefault: function() {
            return this.default;
        },

        /**
         * @return {function(Map.<string, *>, function(Throwable=))}
         */
        getExecuteMethod: function() {
            return this.executeMethod;
        },

        /**
         * @return {Set.<CliOption>}
         */
        getOptionSet: function() {
            return this.optionSet;
        },

        /**
         * @return {List.<CliParameter>}
         */
        getParameterList: function() {
            return this.parameterList;
        },

        /**
         * @return {function(Map.<string, *>, function(Throwable=))}
         */
        getValidateMethod: function() {
            return this.validateMethod;
        },


        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {*} value
         * @return {boolean}
         */
        equals: function(value) {
            if (Class.doesExtend(value, CliAction)) {
                return Obj.equals(this.command, value.getCommand());
            }
            return false;
        },

        /**
         * @return {number}
         */
        hashCode: function() {
            if (!this._hashCode) {
                this._hashCode = Obj.hashCode('[CliAction]' +
                    Obj.hashCode(this.command));
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
         * @return {CliOption}
         */
        getOptionWithFlag: function(flag) {
            return this.flagToOptionMap.get(flag);
        },

        /**
         * @param {string} flag
         * @return {boolean}
         */
        hasOptionForFlag: function(flag) {
            return this.flagToOptionMap.containsKey(flag);
        },

        /**
         * @return {boolean}
         */
        hasOptions: function() {
            return !this.optionSet.isEmpty();
        },

        /**
         * @return {boolean}
         */
        hasParameters: function() {
            return !this.parameterList.isEmpty();
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugcli.CliAction', CliAction);
});
