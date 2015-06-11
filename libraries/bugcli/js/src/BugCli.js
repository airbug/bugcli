/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugmeta may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugcli.BugCli')

//@Require('Class')
//@Require('Obj')
//@Require('Proxy')
//@Require('bugcli.Cli')
//@Require('bugcli.CliAction')
//@Require('bugcli.CliBuild')
//@Require('bugcli.CliOption')
//@Require('bugcli.CliParser')
//@Require('bugcli.CliRunner')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Obj                 = bugpack.require('Obj');
    var Proxy               = bugpack.require('Proxy');
    var CliAction           = bugpack.require('bugcli.CliAction');
    var CliBuild            = bugpack.require('bugcli.CliBuild');
    var CliOption           = bugpack.require('bugcli.CliOption');
    var CliParser           = bugpack.require('bugcli.CliParser');
    var CliProgram          = bugpack.require('bugcli.CliProgram');
    var CliRunner           = bugpack.require('bugcli.CliRunner');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var BugCli = Class.extend(Obj, {

        _name: "bugcli.BugCli",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Public Properties
            //-------------------------------------------------------------------------------

            /**
             * @type {function(new:CliAction)}
             */
            this.CliAction      = CliAction;

            /**
             * @type {function(new:CliBuild)}
             */
            this.CliBuild       = CliBuild;

            /**
             * @type {function(new:CliOption)}
             */
            this.CliOption      = CliOption;

            /**
             * @type {function(new:CliParser)}
             */
            this.CliParser      = CliParser;

            /**
             * @type {function(new:CliProgram)}
             */
            this.CliProgram     = CliProgram;

            /**
             * @type {function(new:CliRunner)}
             */
            this.CliRunner      = CliRunner;


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {CliProgram}
             */
            this.cliProgram     = null;
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
            this.program().action(cliActionObject);
        },

        /**
         * @return {CliProgram}
         */
        program: function() {
            if (!this.cliProgram) {
                this.cliProgram = new CliProgram();
            }
            return this.cliProgram;
        },

        /**
         * @param {Array.<string>} argv
         * @param {function(Throwable=)} callback
         */
        run: function(argv, callback) {
            this.program().run(argv, callback);
        }
    });


    //-------------------------------------------------------------------------------
    // Private Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @private
     * @type {BugCli}
     */
    BugCli.instance = null;


    //-------------------------------------------------------------------------------
    // Public Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @return {BugMeta}
     */
    BugCli.getInstance = function() {
        if (BugCli.instance === null) {
            BugCli.instance = new BugCli();
        }
        return BugCli.instance;
    };


    //-------------------------------------------------------------------------------
    // Static Proxy
    //-------------------------------------------------------------------------------

    Proxy.proxy(BugCli, Proxy.method(BugCli.getInstance), [
        "action",
        "program",
        "run"
    ]);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugcli.BugCli', BugCli);
});
