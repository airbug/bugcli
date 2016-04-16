/*
 * Copyright (c) 2015 airbug inc. http://airbug.com
 *
 * bugcli may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugcli.CliRunner')

//@Require('Class')
//@Require('Flows')
//@Require('Obj')
//@Require('Throwables')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Flows       = bugpack.require('Flows');
    var Obj         = bugpack.require('Obj');
    var Throwables  = bugpack.require('Throwables');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $series     = Flows.$series;
    var $task       = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var CliRunner = Class.extend(Obj, {

        _name: 'bugcli.CliRunner',


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
             * @type {CliBuild}
             */
            this.cliBuild   = null;

            /**
             * @private
             * @type {boolean}
             */
            this.ran        = false;
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {CliBuild} cliBuild
         * @return {CliRunner}
         */
        initWithCliBuild: function(cliBuild) {
            this.init();
            this.cliBuild = cliBuild;
            return this;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {CliBuild}
         */
        getCliBuild: function() {
            return this.cliBuild;
        },

        /**
         * @return {boolean}
         */
        getRan: function() {
            return this.ran;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        run: function() {
            if (!this.ran) {
                this.ran = true;
                return $series([
                    () => {
                        return this.validate();
                    },
                    () => {
                        return this.initialize();
                    },
                    () => {
                        return this.executeCliAction();
                    }
                ]).then();
            } else {
                throw Throwables.exception('IllegalState', {}, 'CliRunner should only be run once');
            }
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @return {*}
         */
        initialize: function() {
            return true;
        },

        /**
         * @protected
         * @return {*}
         */
        validate: function() {
            var cliActionInstance = this.cliBuild.getCliActionInstance();
            if (cliActionInstance) {
                var cliAction = cliActionInstance.getCliAction();
                return this.validateCliAction(cliAction, callback);
            } else {
                throw Throwables.exception('CliRunnerException', {}, 'An action must be specified');
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @return {*}
         */
        executeCliAction: function() {
            var cliActionInstance = this.cliBuild.getCliActionInstance();
            var cliAction = cliActionInstance.getCliAction();
            var executeMethod = cliAction.getExecuteMethod();
            return executeMethod(cliActionInstance);
        },

        /**
         * @private
         * @param {CliAction} cliAction
         * @return {*}
         */
        validateCliAction: function(cliAction) {
            var cliActionInstance   = this.cliBuild.getCliActionInstance();
            var validateMethod      = cliAction.getValidateMethod();
            if (validateMethod) {
                return validateMethod(cliActionInstance);
            } else {
                return true;
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugcli.CliRunner', CliRunner);
});
