/*
 * Copyright (c) 2015 airbug inc. http://airbug.com
 *
 * bugcli may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugcli.CliParser')

//@Require('Class')
//@Require('Obj')
//@Require('Throwables')
//@Require('bugcli.CliAction')
//@Require('bugcli.CliActionInstance')
//@Require('bugcli.CliOption')
//@Require('bugcli.CliOptionInstance')
//@Require('bugcli.CliParameter')
//@Require('bugcli.CliParameterInstance')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Obj                     = bugpack.require('Obj');
    var Throwables              = bugpack.require('Throwables');
    var CliAction               = bugpack.require('bugcli.CliAction');
    var CliActionInstance       = bugpack.require('bugcli.CliActionInstance');
    var CliOption               = bugpack.require('bugcli.CliOption');
    var CliOptionInstance       = bugpack.require('bugcli.CliOptionInstance');
    var CliParameter            = bugpack.require('bugcli.CliParameter');
    var CliParameterInstance    = bugpack.require('bugcli.CliParameterInstance');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var CliParser = Class.extend(Obj, {

        _name: 'bugcli.CliParser',


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
            this.cliConfiguration       = null;

            /**
             * @private
             * @type {number}
             */
            this.index                  = 0;
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {CliConfiguration} cliConfiguration
         * @return {CliParser}
         */
        initWithCliConfiguration: function(cliConfiguration) {
            this.init();
            this.cliConfiguration = cliConfiguration;
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
         * @return {number}
         */
        getIndex: function() {
            return this.index;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array.<string>} argv
         * @param {CliBuild} cliBuild
         */
        parse: function(argv, cliBuild) {

            //TODO BRN: rework this..
            this.index = 1;
            var unknownArguments = [];
            while (this.hasNextArg(argv)) {
                var arg = this.peekArg(argv);
                if (this.cliConfiguration.hasCliActionWithCommand(arg)) {
                    if (!cliBuild.hasCliActionInstance()) {
                        this.parseCliActionInstance(argv, cliBuild);
                    } else {
                       throw Throwables.exception('CliParserException', {}, 'Duplicate action "' + arg + '" found. Can only specify one action.')
                    }
                } else if (this.cliConfiguration.hasDefaultCliAction()) {
                    this.parseDefaultCliActionInstance(argv, cliBuild)
                } else {
                    unknownArguments.push(arg);
                }
            }
 
            if (!cliBuild.hasCliActionInstance()) {
                if (this.cliConfiguration.hasDefaultCliAction()) {
                    this.parseDefaultCliActionInstance(argv, cliBuild);
                } else {
                    throw Throwables.exception('CliParserException', {}, 'No action specified and no default action found.');
                }
            }

            if (unknownArguments.length > 0 && !throwable) {
                throw Throwables.exception('CliParserException', {}, 'Unknown argument "' + unknownArguments[0] + '"');
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Array.<string>} argv
         * @return {*}
         */
        currentArg: function(argv) {
            return argv[this.index];
        },

        /**
         * @private
         * @param {Array.<string>} argv
         * @return {boolean}
         */
        hasNextArg: function(argv) {
            return (this.index < (argv.length - 1));
        },

        /**
         * @private
         * @param {Array.<string>} argv
         * @return {*}
         */
        nextArg: function(argv) {
            this.index++;
            return argv[this.index];
        },

        /**
         * @private
         * @param {Array.<string>} argv
         * @return {*}
         */
        peekArg: function(argv) {
            return argv[this.index + 1];
        },

        /**
         * @private
         * @param {Array.<string>} argv
         * @param {CliBuild} cliBuild
         */
        parseCliActionInstance: function(argv, cliBuild) {
            var command     = this.nextArg(argv);
            var cliAction   = this.cliConfiguration.getCliActionWithCommand(command);
            if (!cliAction) {
                throw Throwables.bug('CliParserBug', {}, 'No CliAction found with command "' + command + '"');
            }
            var cliActionInstance = CliActionInstance.alloc().initWithCliAction(cliAction);
            if (cliBuild.hasCliActionInstance()) {
                throw Throwables.exception('CliParserException', {}, 'Duplicate action found "' + command + '"');
            }
            cliBuild.setCliActionInstance(cliActionInstance);
            this.parseCliActionInstanceOptionsAndParameters(argv, cliActionInstance);
        },

        /**
         * @private
         * @param {Array.<string>} argv
         * @param {CliActionInstance} cliActionInstance
         */
        parseCliActionInstanceOptionsAndParameters: function(argv, cliActionInstance) {
            var cliAction = cliActionInstance.getCliAction();
            if (cliAction.hasOptions()) {
                var noOptionsFound = false;
                while (this.hasNextArg(argv) && !noOptionsFound) {
                    var possibleOptionFlag = this.peekArg(argv);
                    if (cliAction.hasOptionForFlag(possibleOptionFlag)) {
                        this.parseCliOptionInstanceForCliActionInstance(argv, cliActionInstance);
                    } else {
                        noOptionsFound = true;
                    }
                }
            }

            if (cliAction.hasParameters()) {
                var cliParameterList = cliAction.getParameterList();
                for (var i = 0, size = cliParameterList.getCount(); i < size; i++) {
                    var cliParameter = cliParameterList.getAt(i);
                    if (this.hasNextArg(argv)) {
                        var nextArg = this.nextArg(argv);
                        var value = this.parseParameterValue(nextArg, cliParameter);
                        var cliParameterInstance = CliParameterInstance.alloc().initWithCliParameterAndValue(cliParameter, value);
                        cliActionInstance.addCliParameterInstance(cliParameterInstance);
                    } else {
                        throw Throwables.exception('Could not find parameter "' + cliParameter.getName() + '" for command "' + cliAction.getCommand() + '"');
                    }
                }
            }
        },

        /**
         * @private
         * @param {Array.<string>} argv
         * @param {CliActionInstance} cliActionInstance
         */
        parseCliOptionInstanceForCliActionInstance: function(argv, cliActionInstance) {
            var flag = this.nextArg(argv);
            var cliOption = cliActionInstance.getCliAction().getOptionWithFlag(flag);
            if (!cliOption) {
                throw Throwables.bug('CliParserBug', {}, 'No CliOption found with flag "' + flag + '"');
            }
            var cliOptionInstance = CliOptionInstance.alloc().initWithCliOption(cliOption);
            if (cliActionInstance.hasCliOptionInstance(cliOptionInstance)) {
                throw Throwables.exception('ParseException', {}, 'Duplicate option found "' + flag + '"');
            }
            cliActionInstance.addCliOptionInstance(cliOptionInstance);
            if (cliOption.hasParameters()) {
                var cliParameterList = cliOption.getParameterList();
                for (var i = 0, size = cliParameterList.getCount(); i < size; i++) {
                    var cliParameter = cliParameterList.getAt(i);
                    if (this.hasNextArg(argv)) {
                        var nextArg = this.nextArg(argv);
                        var value = this.parseParameterValue(nextArg, cliParameter);
                        var cliParameterInstance = CliParameterInstance.alloc().initWithCliParameterAndValue(cliParameter, value);
                        cliOptionInstance.addCliParameterInstance(cliParameterInstance);
                    } else {
                        throw Throwables.exception('Could not find parameter "' + cliParameter.getName() + '" for option "' + cliOption.getName() + '"');
                    }
                }
            }
        },

        /**
         * @private
         * @param {Array.<string>} argv
         * @param {CliBuild} cliBuild
         */
        parseDefaultCliActionInstance: function(argv, cliBuild) {
            var defaultCliAction = this.cliConfiguration.getDefaultCliAction();
            if (!defaultCliAction) {
                throw Throwables.bug('CliParserBug', {}, 'No default CliAction found.');
            }
            var cliActionInstance = CliActionInstance.alloc().initWithCliAction(defaultCliAction);
            cliBuild.setCliActionInstance(cliActionInstance);
            this.parseCliActionInstanceOptionsAndParameters(argv, cliActionInstance);
        },

        /**
         * @private
         * @param {*} value
         * @param {CliParameter} cliParameter
         * @return {*}
         */
        parseParameterValue: function(value, cliParameter) {
            switch(cliParameter.getType()) {
            case CliParameter.Types.NUMBER:
                return parseFloat(value);
                break;
            default:
                return value;
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('bugcli.CliParser', CliParser);
});
