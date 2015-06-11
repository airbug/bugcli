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
         */
        initWithCliAction: function(cliAction) {
            this.init();
            this.cliAction = cliAction;
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
            this.cliOptionInstanceMap.put(cliOptionInstance.getCliOption().getName(), cliOptionInstance);
        },

        /**
         * @param {string} parameterName
         * @param {string} value
         */
        addCliParameterInstance: function(parameterName, value) {
            var cliParameter = this.cliAction.getParameterWithParameterName(parameterName);
            var cliParameterInstance = new CliParameterInstance(cliParameter, value);
            this.cliParameterInstanceMap.put(parameterName, cliParameterInstance);
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
