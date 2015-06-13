/*
 * Copyright (c) 2015 airbug inc. http://airbug.com
 *
 * bugcli may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugcli.CliParameter')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Obj         = bugpack.require('Obj');
    var TypeUtil    = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var CliParameter = Class.extend(Obj, {

        _name: "bugcli.CliParameter",


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
            this.name   = "";

            /**
             * @private
             * @type {string}
             */
            this.type   = "string";
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {{
         *      name: string,
         *      type: string
         * }} cliParameterObject
         * @return {CliParameter}
         */
        initWithObject: function(cliParameterObject) {
            this.init();
            if (TypeUtil.isObject(cliParameterObject)) {
                if (TypeUtil.isString(cliParameterObject.name)) {
                    this.name = cliParameterObject.name;
                }
                if (TypeUtil.isString(cliParameterObject.type)) {
                    switch (cliParameterObject.type) {
                        case CliParameter.Types.NUMBER:
                        case CliParameter.Types.STRING:
                            this.type = cliParameterObject.type;
                            break;
                    }
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
        getName: function() {
            return this.name;
        },

        /**
         * @return {string}
         */
        getType: function() {
            return this.type;
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @enum {string}
     */
    CliParameter.Types = {
        NUMBER: "number",
        STRING: "string"
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugcli.CliParameter', CliParameter);
});
