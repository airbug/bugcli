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

//@TestFile

//@Require('Class')
//@Require('bugcli.CliAction')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var CliAction   = bugpack.require('bugcli.CliAction');
    var BugMeta     = bugpack.require('bugmeta.BugMeta');
    var TestTag     = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta     = BugMeta.context();
    var test        = TestTag.test;


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
                        name: "testFlag"
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
            if (this.testCliAction.getParameterList().getCount() === 1) {
                test.assertEqual(this.testCliAction.getParameterList().getAt(0).getName(), this.testCliActionObject.parameters[0].name,
                    "Assert CliAction.parameterList was set correctly");
            }
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(cliActionInstantiationTest).with(
        test().name("CliAction - instantiation test")
    );
});
