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

//@Export('bugcli.CliProgram')

//@Require('Class')
//@Require('Collections')
//@Require('Flows')
//@Require('Obj')
//@Require('Throwables')
//@Require('bugcli.CliAction')
//@Require('bugcli.CliBuild')
//@Require('bugcli.CliConfiguration')
//@Require('bugcli.CliOption')
//@Require('bugcli.CliParser')
//@Require('bugcli.CliRunner')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Common Modules
    //-------------------------------------------------------------------------------

    var path                = require('path');


    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Collections         = bugpack.require('Collections');
    var Flows               = bugpack.require('Flows');
    var Obj                 = bugpack.require('Obj');
    var Throwables          = bugpack.require('Throwables');
    var CliAction           = bugpack.require('bugcli.CliAction');
    var CliBuild            = bugpack.require('bugcli.CliBuild');
    var CliConfiguration    = bugpack.require('bugcli.CliConfiguration');
    var CliOption           = bugpack.require('bugcli.CliOption');
    var CliParser           = bugpack.require('bugcli.CliParser');
    var CliRunner           = bugpack.require('bugcli.CliRunner');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $series             = Flows.$series;
    var $task               = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var CliProgram = Class.extend(Obj, {

        _name: "bugcli.CliProgram",


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
             * @type {CliConfiguration}
             */
            this.cliConfiguration   = null;

            /**
             * @private
             * @type {CliParser}
             */
            this.cliParser          = null;
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        init: function() {
            this._super();
            this.cliConfiguration   = this.cliConfiguration || CliConfiguration.alloc().init();
            this.cliParser          = this.cliParser || CliParser.alloc().initWithCliConfiguration(this);
        },

        /**
         * @param {CliConfiguration} cliConfiguration
         */
        initWithCliConfiguration: function(cliConfiguration) {
            this.cliConfiguration = cliConfiguration;
            this.init();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {CliConfiguration}
         */
        getCliConfiguration: function() {
            return this.cliConfiguration;
        },

        /**
         * @return {CliParser}
         */
        getCliParser: function() {
            return this.cliParser;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {{
         *      command: string,
         *      default: boolean=,
         *      options: Array.<{
         *          name: string,
         *          flags: Array.<string>,
         *          parameters: Array.<{
         *              name: string
         *          }>
         *      }>,
         *      parameters: Array.<{
         *          name: string
         *      }>,
         *      executeMethod: function(CliBuild, CliAction, function(Throwable=)),
         *      validateMethod: function(CliBuild, CliAction, function(Throwable=))
         * }} cliActionObject
         */
        action: function(cliActionObject) {
            var cliAction   = CliAction.alloc().initWithObject(cliActionObject);
            this.registerCliAction(cliAction);
        },

        /**
         * @return {string}
         */
        generateHelpText: function() {

            //TODO BRN: generate help text based on cliActions and cliOptions

            return "TODO add help text";
        },

        /**
         * @param {CliAction} cliAction
         */
        registerCliAction: function(cliAction) {
            this.cliConfiguration.addCliAction(cliAction);
        },

        /**
         * @param {Array.<string>} argv
         * @param {function(Throwable=)} callback
         */
        run: function(argv, callback) {
            var _this       = this;
            var cliBuild    = CliBuild.alloc().init();
            var cliRunner   = CliRunner.alloc().initWithCliBuild(cliBuild);
            $series([
                $task(function(flow) {
                    _this.configure(function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.cliParser.parse(argv, cliBuild, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    cliRunner.run(function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(callback);
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {function(Throwable=)} callback
         */
        doConfigure: function(callback) {
            callback();
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {function(Throwable=)} callback
         */
        configure: function(callback) {
            var _this = this;
            $series([
                $task(function(flow) {
                    _this.doConfigure(function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(callback)
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugcli.CliProgram', CliProgram);
});
