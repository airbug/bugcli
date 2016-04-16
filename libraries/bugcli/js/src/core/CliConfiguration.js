/*
 * Copyright (c) 2015 airbug inc. http://airbug.com
 *
 * bugcli may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugcli.CliConfiguration')

//@Require('Class')
//@Require('Collections')
//@Require('Obj')
//@Require('Throwables')
//@Require('TypeUtil')


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


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var CliConfiguration = Class.extend(Obj, {

        _name: 'bugcli.CliConfiguration',


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
             * @type {Set.<CliAction>}
             */
            this.cliActionSet               = Collections.set();

            /**
             * @private
             * @type {Map.<string, CliAction>}
             */
            this.commandToCliActionMap      = new Collections.map();

            /**
             * @private
             * @type {CliAction}
             */
            this.defaultCliAction           = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Set.<CliAction>}
         */
        getCliActionSet: function() {
            return this.cliActionSet;
        },

        /**
         * @return {CliAction}
         */
        getDefaultCliAction: function() {
            return this.defaultCliAction;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {CliAction} cliAction
         */
        addCliAction: function(cliAction) {
            if (this.cliActionSet.contains(cliAction)) {
                throw Throwables.exception('CliConfigurationException', {}, 'CliAction already exists for the command "' + cliAction.getCommand() + '"');
            }
            this.commandToCliActionMap.put(cliAction.getCommand(), cliAction);
            if (cliAction.getDefault()) {
                if (!this.hasDefaultCliAction()) {
                    this.defaultCliAction = cliAction;
                } else {
                    throw Throwables.exception('CliConfigurationException', {}, 'Can only specify one cliAction default. Found a second "' + cliAction.getCommand() + '"');
                }
            }
        },

        /**
         * @param {string} command
         * @return {CliAction}
         */
        getCliActionWithCommand: function(command) {
            return this.commandToCliActionMap.get(command);
        },

        /**
         * @param {string} command
         * @returns {boolean}
         */
        hasCliActionWithCommand: function(command) {
            return this.commandToCliActionMap.containsKey(command);
        },

        /**
         * @return {boolean}
         */
        hasDefaultCliAction: function() {
            return !!this.defaultCliAction;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugcli.CliConfiguration', CliConfiguration);
});
