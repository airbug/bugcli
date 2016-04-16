/*
 * Copyright (c) 2015 airbug inc. http://airbug.com
 *
 * bugcli may be freely distributed under the MIT license.
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

require('bugpack').context('*', function(bugpack) {

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

        _name: 'bugcli.CliProgram',


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
         * @return {CliProgram}
         */
        init: function() {
            this._super();
            this.cliConfiguration   = this.cliConfiguration || CliConfiguration.alloc().init();
            this.cliParser          = this.cliParser || CliParser.alloc().initWithCliConfiguration(this.cliConfiguration);
            return this;
        },

        /**
         * @param {CliConfiguration} cliConfiguration
         * @return {CliProgram}
         */
        initWithCliConfiguration: function(cliConfiguration) {
            this.cliConfiguration = cliConfiguration;
            this.init();
            return this;
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

            return 'TODO add help text';
        },

        /**
         * @param {CliAction} cliAction
         */
        registerCliAction: function(cliAction) {
            this.cliConfiguration.addCliAction(cliAction);
        },

        /**
         * @param {Array.<string>} argv
         * @return {Promise}
         */
        run: function(argv) {
            var cliBuild    = CliBuild.alloc().init();
            var cliRunner   = CliRunner.alloc().initWithCliBuild(cliBuild);
            return $series([
                () => {
                    return this.configure();
                },
                () => {
                    return this.cliParser.parse(argv, cliBuild);
                },
                () => {
                    return cliRunner.run();
                }
            ]).then();
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @return {*}
         */
        doConfigure: function() {
            return true;
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @return {*}
         */
        configure: function() {
            return this.doConfigure();
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugcli.CliProgram', CliProgram);
});
