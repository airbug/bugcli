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

require('bugpack').context("*", function(bugpack) {

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

        _name: "bugcli.CliRunner",


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
         * @param {function(Throwable=)} callback
         */
        run: function(callback) {
            var _this = this;
            if (!this.ran) {
                this.ran = true;
                $series([
                    $task(function(flow) {
                        _this.validate(function(error) {
                            flow.complete(error);
                        });
                    }),
                    $task(function(flow) {
                        _this.initialize(function(error) {
                            flow.complete(error);
                        });
                    }),
                    $task(function(flow) {
                        _this.executeCliAction(function(error) {
                            flow.complete(error);
                        })
                    })
                ]).execute(callback);
            } else {
                callback(Throwables.exception("IllegalState", {}, "CliRunner should only be run once"));
            }
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {function(Throwable=)} callback
         */
        initialize: function(callback) {
            callback();
        },

        /**
         * @protected
         * @param {function(Throwable=)} callback
         */
        validate: function(callback) {
            var cliActionInstance = this.cliBuild.getCliActionInstance();
            if (cliActionInstance) {
                var cliAction = cliActionInstance.getCliAction();
                this.validateCliAction(cliAction, callback);
            } else {
                callback(Throwables.exception("CliRunnerException", {}, "An action must be specified"));
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {function(Throwable=)} callback
         */
        executeCliAction: function(callback) {
            var cliActionInstance = this.cliBuild.getCliActionInstance();
            var cliAction = cliActionInstance.getCliAction();
            var executeMethod = cliAction.getExecuteMethod();
            executeMethod(this.cliBuild, cliActionInstance, function(error) {
                callback(error);
            });
        },

        /**
         * @private
         * @param {CliAction} cliAction
         * @param {function(Throwable=)} callback
         */
        validateCliAction: function(cliAction, callback) {
            var cliActionInstance   = this.cliBuild.getCliActionInstance();
            var validateMethod      = cliAction.getValidateMethod();
            if (validateMethod) {
                validateMethod(this.cliBuild, cliActionInstance, function(error) {
                    callback(error);
                });
            } else {
                callback();
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugcli.CliRunner', CliRunner);
});
