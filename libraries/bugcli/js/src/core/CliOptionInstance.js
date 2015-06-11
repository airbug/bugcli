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

//@Export('bugcli.CliOptionInstance')

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
    var CliOptionInstance = Class.extend(Obj, {

        _name: "bugcli.CliOptionInstance",


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
             * @type {CliOption}
             */
            this.cliOption                  = null;

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
         * @param {CliOption} cliOption
         */
        initWithCliOption: function(cliOption) {
            this.init(cliOption);
            this.cliOption = cliOption;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {CliOption}
         */
        getCliOption: function() {
            return this.cliOption;
        },


        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {*} value
         * @return {boolean}
         */
        equals: function(value) {
            if (Class.doesExtend(value, CliOptionInstance)) {
                return Obj.equals(this.cliOption, value.getCliOption());
            }
            return false;
        },

        /**
         * @return {number}
         */
        hashCode: function() {
            if (!this._hashCode) {
                this._hashCode = Obj.hashCode("[CliOptionInstance]" +
                    Obj.hashCode(this.cliOption));
            }
            return this._hashCode;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} parameterName
         * @param {string} value
         */
        addCliParameterInstance: function(parameterName, value) {
            var cliParameter = this.cliOption.getParameterWithParameterName(parameterName);
            var cliParameterInstance = new CliParameterInstance(cliParameter, value);
            this.cliParameterInstanceMap.put(parameterName, cliParameterInstance);
        },

        /**
         * @param {string} parameterName
         * @return {CliParameterInstance}
         */
        getCliParameterInstance: function(parameterName) {
            return this.cliParameterInstanceMap.get(parameterName);
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getName: function() {
            return this.cliOption.getName();
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

    bugpack.export('bugcli.CliOptionInstance', CliOptionInstance);
});
