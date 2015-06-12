/*
 * Copyright (c) 2015 airbug inc. http://airbug.com
 *
 * bugcli may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugcli.CliAction')
//@Require('bugcli.CliParameter')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var CliAction       = bugpack.require('bugcli.CliAction');
    var CliParameter    = bugpack.require('bugcli.CliParameter');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var TestTag         = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta         = BugMeta.context();
    var test            = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    /**
     *
     */
    var cliActionInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testCliActionObject    = {
                command: "test-command",
                default: true,
                parameters: [
                    {
                        name: "testParameter"
                    }
                ],
                options: [
                    {
                        name: "test-option",
                        flags: [
                            '-to',
                            '--test-option'
                        ],
                        required: true,
                        parameters: [
                            {
                                name: "testOption"
                            }
                        ]
                    }
                ],
                executeMethod: function() {},
                validateMethod: function() {}
            };
            this.testCliAction          = CliAction.alloc().initWithObject(this.testCliActionObject);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testCliAction, CliAction),
                "Assert instance of CliAction");
            test.assertEqual(this.testCliAction.getCommand(), this.testCliActionObject.command,
                "Assert CliAction.command was set correctly");
            test.assertEqual(this.testCliAction.getDefault(), this.testCliActionObject.default,
                "Assert CliAction.default was set correctly");
            test.assertEqual(this.testCliAction.getExecuteMethod(), this.testCliActionObject.executeMethod,
                "Assert CliAction.executeMethod was set correctly");
            test.assertEqual(this.testCliAction.getValidateMethod(), this.testCliActionObject.validateMethod,
                "Assert CliAction.validateMethod was set correctly");
            test.assertEqual(this.testCliAction.getOptionSet().getCount(), 1,
                "Assert CliAction.optionSet count is 1");
            if (this.testCliAction.getOptionSet().getCount() === 1) {
                test.assertEqual(this.testCliAction.getOptionSet().toArray()[0].getName(), this.testCliActionObject.options[0].name,
                    "Assert CliAction.optionSet was set correctly");
            }
            test.assertEqual(this.testCliAction.getParameterList().getCount(), 1,
                "Assert CliAction.parameterList count is 1");
            test.assertEqual(this.testCliAction.hasParameters(), true,
                "Assert CliAction#hasParameters returns true");
            if (this.testCliAction.getParameterList().getCount() === 1) {
                test.assertEqual(this.testCliAction.getParameterList().getAt(0).getName(), this.testCliActionObject.parameters[0].name,
                    "Assert CliAction.parameterList was set correctly");
            }
        }
    };

    /**
     *
     */
    var cliActionGetParameterWithParameterNameTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testCliActionObject    = {
                command: "test-command",
                parameters: [
                    {
                        name: "testParameter"
                    }
                ],
                executeMethod: function() {}
            };
            this.testCliAction          = CliAction.alloc().initWithObject(this.testCliActionObject);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var cliParameter = this.testCliAction.getParameterWithParameterName("testParameter");
            test.assertTrue(Class.doesExtend(cliParameter, CliParameter),
                "Assert returned cliParameter is a CliParameter instance");
            if (Class.doesExtend(cliParameter, CliParameter)) {
                test.assertEqual(cliParameter.getName(), this.testCliActionObject.parameters[0].name,
                    "Assert returned CliParameter has the correct name");
            }
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(cliActionInstantiationTest).with(
        test().name("CliAction - instantiation test")
    );
    bugmeta.tag(cliActionGetParameterWithParameterNameTest).with(
        test().name("CliAction - #getParameterWithParameterName test")
    );
});
