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
//@Require('bugcli.BugCli')
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
    var BugCli      = bugpack.require('bugcli.BugCli');
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
    var registerActionOptionAndRunTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.bugCli = BugCli.alloc().init();
            this.argv = [
                "dummy",
                "dummy",
                "testAction",
                "--testOption",
                "optionParam",
                "actionParam"
            ];
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var _this = this;
            var validateCalled = false;
            var executeCalled = false;
            this.bugCli.action({
                command: 'testAction',
                options: [
                    {
                        name: 'testOption',
                        flags: [
                            '--testOption'
                        ],
                        parameters: [
                            {
                                name: "testOptionParam"
                            }
                        ]
                    }
                ],
                parameters: [
                    {
                        name: "testActionParam"
                    }
                ],
                executeMethod: function(cliBuild, cliActionInstance, callback) {
                    executeCalled = true;
                    test.assertEqual(cliActionInstance.getCommand(), "testAction",
                        "Assert that the cliAction is 'testAction'");
                    test.assertEqual(cliActionInstance.getParameter("testActionParam"), "actionParam",
                        "Assert that the parameter 'testActionParam' is 'actionParam'");
                    var testOption = cliActionInstance.getOption("testOption");
                    test.assertEqual(testOption.getParameter("testOptionParam"), "optionParam",
                        "Assert that the parameter 'testOptionParam' is 'optionParam'");
                    callback();
                },
                validateMethod: function(cliBuild, cliActionInstance, callback) {
                    validateCalled = true;
                    test.assertEqual(cliActionInstance.getCommand(), "testAction",
                        "Assert that the cliActionInstance.command is 'testAction'");
                    callback();
                }
            });

            this.bugCli.run(this.argv, function(error) {
                if (!error) {
                    test.assertTrue(validateCalled,
                        "Assert that validate was called");
                    test.assertTrue(executeCalled,
                        "Assert that execute was called");
                } else {
                    test.error(error);
                }
            });
        }
    };

    /**
     *
     */
    var defaultActionNoOptionsNoParamsRunTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.bugCli = BugCli.alloc().init();
            this.argv = [
                "dummy",
                "dummy"
            ];
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var validateCalled = false;
            var executeCalled = false;
            this.bugCli.action({
                command: 'testAction',
                default: true,
                executeMethod: function(cliBuild, cliActionInstance, callback) {
                    executeCalled = true;
                    test.assertEqual(cliActionInstance.getCommand(), "testAction",
                        "Assert that the cliActionInstance.command is 'testAction'");
                    callback();
                },
                validateMethod: function(cliBuild, cliActionInstance, callback) {
                    validateCalled = true;
                    test.assertEqual(cliActionInstance.getCommand(), "testAction",
                        "Assert that the cliActionInstance.command is 'testAction'");
                    callback();
                }
            });

            this.bugCli.run(this.argv, function(error) {
                if (!error) {
                    test.assertTrue(validateCalled,
                        "Assert that validate was called");
                    test.assertTrue(executeCalled,
                        "Assert that execute was called");
                } else {
                    test.error(error);
                }
            });
        }
    };

    /**
     *
     */
    var defaultActionOptionAndRunTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.bugCli = BugCli.alloc().init();
            this.argv = [
                "dummy",
                "dummy",
                "--testOption",
                "optionParam",
                "actionParam"
            ];
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            var validateCalled = false;
            var executeCalled = false;
            this.bugCli.action({
                command: 'testAction',
                default: true,
                options: [
                    {
                        name: 'testOption',
                        flags: [
                            '--testOption'
                        ],
                        parameters: [
                            {
                                name: "testOptionParam"
                            }
                        ]
                    }
                ],
                parameters: [
                    {
                        name: "testActionParam"
                    }
                ],
                executeMethod: function(cliBuild, cliActionInstance, callback) {
                    executeCalled = true;
                    test.assertEqual(cliActionInstance.getCommand(), "testAction",
                        "Assert that the cliActionInstance.command is 'testAction'");
                    test.assertEqual(cliActionInstance.getParameter("testActionParam"), "actionParam",
                        "Assert that the parameter 'testActionParam' is 'actionParam'");
                    var testOption = cliActionInstance.getOption("testOption");
                    test.assertEqual(testOption.getParameter("testOptionParam"), "optionParam",
                        "Assert that the parameter 'testOptionParam' is 'optionParam'");
                    callback();
                },
                validateMethod: function(cliBuild, cliActionInstance, callback) {
                    validateCalled = true;
                    test.assertEqual(cliActionInstance.getCommand(), "testAction",
                        "Assert that the cliActionInstance.command is 'testAction'");
                    callback();
                }
            });

            this.bugCli.run(this.argv, function(error) {
                if (!error) {
                    test.assertTrue(validateCalled,
                        "Assert that validate was called");
                    test.assertTrue(executeCalled,
                        "Assert that execute was called");
                } else {
                    test.error(error);
                }
            });
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(registerActionOptionAndRunTest).with(
        test().name("BugCli - Register CliAction and CliOption then run")
    );
    bugmeta.tag(defaultActionNoOptionsNoParamsRunTest).with(
        test().name("BugCli -  Register a default CliAction with no options and no parameters and then run")
    );
    bugmeta.tag(defaultActionOptionAndRunTest).with(
        test().name("BugCli - Register a default CliAction and a CliOption then run")
    );
});
