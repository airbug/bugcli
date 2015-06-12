/*
 * Copyright (c) 2015 airbug inc. http://airbug.com
 *
 * bugcli may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugcli.CliActionInstance')

//@Require('Class')
//@Require('Collections')
//@Require('Obj')
//@Require('bugcli.CliParameterInstance')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Collections             = bugpack.require('Collections');
    var Obj                     = bugpack.require('Obj');
    var CliParameterInstance    = bugpack.require('bugcli.CliParameterInstance');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var CliActionInstance = Class.extend(Obj, {

        _name: "bugcli.CliActionInstance",


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
             * @type {CliAction}
             */
            this.cliAction                  = null;

            /**
             * @private
             * @type {Map.<string, CliOptionInstance>}
             */
            this.cliOptionInstanceMap       = Collections.map();

            /**
             * @private
             * @type {Map.<string, CliParameterInstance>}
             */
            this.cliParameterInstanceMap    = Collections.map();
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {CliAction} cliAction
         * @return {CliActionInstance}
         */
        initWithCliAction: function(cliAction) {
            this.init();
            this.cliAction = cliAction;
            return this;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {CliAction}
         */
        getCliAction: function() {
            return this.cliAction;
        },

        /**
         * @return {Map.<string, CliOptionInstance>}
         */
        getCliOptionInstanceMap: function() {
            return this.cliOptionInstanceMap;
        },

        /**
         * @return {Map.<string, CliParameterInstance>}
         */
        getCliParameterInstanceMap: function() {
            return this.cliParameterInstanceMap;
        },


        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {*} value
         * @return {boolean}
         */
        equals: function(value) {
            if (Class.doesExtend(value, CliActionInstance)) {
                return Obj.equals(this.cliAction, value.getCliAction());
            }
            return false;
        },

        /**
         * @return {number}
         */
        hashCode: function() {
            if (!this._hashCode) {
                this._hashCode = Obj.hashCode("[CliActionInstance]" +
                    Obj.hashCode(this.cliAction));
            }
            return this._hashCode;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {CliOptionInstance} cliOptionInstance
         */
        addCliOptionInstance: function(cliOptionInstance) {
            this.cliOptionInstanceMap.put(cliOptionInstance.getOptionName(), cliOptionInstance);
        },

        /**
         * @param {CliParameterInstance} cliParameterInstance
         */
        addCliParameterInstance: function(cliParameterInstance) {
            this.cliParameterInstanceMap.put(cliParameterInstance.getParameterName(), cliParameterInstance);
        },

        /**
         * @return {CliOptionInstance}
         */
        getCliOptionInstance: function(optionName) {
            return this.cliOptionInstanceMap.get(optionName);
        },

        /**
         * @param {string} parameterName
         * @return {CliParameterInstance}
         */
        getCliParameterInstance: function(parameterName) {
            return this.cliParameterInstanceMap.get(parameterName);
        },

        /**
         * @param {CliOptionInstance} cliOptionInstance
         * @return {boolean}
         */
        hasCliOptionInstance: function(cliOptionInstance) {
            return this.cliOptionInstanceMap.containsValue(cliOptionInstance);
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getCommand: function() {
            return this.cliAction.getCommand();
        },

        /**
         * @param {string} optionName
         * @return {CliOptionInstance}
         */
        getOption: function(optionName) {
            return this.getCliOptionInstance(optionName);
        },

        /**
         * @param {string} parameterName
         * @return {*}
         */
        getParameter: function(parameterName) {
            var cliParameterInstance = this.getCliParameterInstance(parameterName);
            if (cliParameterInstance) {
                return cliParameterInstance.getValue();
            }
            return null;
        },

        /**
         * @param {string} optionName
         * @return {boolean}
         */
        hasOption: function(optionName) {
            return this.cliOptionInstanceMap.containsKey(optionName);
        },

        /**
         * @param {string} parameterName
         * @return {boolean}
         */
        hasParameter: function(parameterName) {
            return this.cliParameterInstanceMap.containsKey(parameterName);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugcli.CliActionInstance', CliActionInstance);
});
