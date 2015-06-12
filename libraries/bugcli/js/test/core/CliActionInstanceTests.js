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
//@Require('bugcli.CliActionInstance')
//@Require('bugcli.CliOptionInstance')
//@Require('bugcli.CliParameterInstance')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var CliAction               = bugpack.require('bugcli.CliAction');
    var CliActionInstance       = bugpack.require('bugcli.CliActionInstance');
    var CliOptionInstance       = bugpack.require('bugcli.CliOptionInstance');
    var CliParameterInstance    = bugpack.require('bugcli.CliParameterInstance');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var TestTag                 = bugpack.require('bugunit.TestTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                 = BugMeta.context();
    var test                    = TestTag.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    /**
     *
     */
    var cliActionInstanceInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testCliActionObject    = {
                command: "test-command",
                executeMethod: function() {}
            };
            this.testCliAction          = CliAction.alloc().initWithObject(this.testCliActionObject);
            this.testCliActionInstance  = CliActionInstance.alloc().initWithCliAction(this.testCliAction);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testCliActionInstance, CliActionInstance),
                "Assert instance of CliActionInstance");
            test.assertEqual(this.testCliActionInstance.getCliAction(), this.testCliAction,
                "Assert CliActionInstance.cliAction was set correctly");
            test.assertTrue(this.testCliActionInstance.getCliOptionInstanceMap().isEmpty(),
                "Assert CliActionInstance.cliOptionInstanceMap is empty");
            test.assertTrue(this.testCliActionInstance.getCliParameterInstanceMap().isEmpty(),
                "Assert CliActionInstance.cliParameterInstanceMap is empty");
            test.assertEqual(this.testCliActionInstance.getCommand(), this.testCliActionObject.command,
                "Assert CliActionInstance#getCommand method correctly returns command value");
        }
    };

    /**
     *
     */
    var cliActionInstanceAddCliParameterInstanceTest = {

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
                executeMethod: function() {},
                validateMethod: function() {}
            };
            this.testParameterInstanceValue = "testParameterInstanceValue";

            this.testCliAction          = CliAction.alloc().initWithObject(this.testCliActionObject);
            this.testCliActionInstance  = CliActionInstance.alloc().initWithCliAction(this.testCliAction);
            var cliParameter = this.testCliAction.getParameterWithParameterName(this.testCliActionObject.parameters[0].name);
            this.testCliParameterInstance = CliParameterInstance.alloc().initWithCliParameterAndValue(cliParameter, this.testParameterInstanceValue);
            this.testCliActionInstance.addCliParameterInstance(this.testCliParameterInstance);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testCliActionInstance, CliActionInstance),
                "Assert instance of CliActionInstance");
            var cliParameterInstance = this.testCliActionInstance.getCliParameterInstance(this.testCliActionObject.parameters[0].name);
            test.assertEqual(cliParameterInstance, this.testCliParameterInstance,
                "Assert CliActionInstance.getCliParameterInstance returned the newly added CliParameterInstance");
        }
    };

    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(cliActionInstanceInstantiationTest).with(
        test().name("CliActionInstance - instantiation test")
    );
    bugmeta.tag(cliActionInstanceAddCliParameterInstanceTest).with(
        test().name("CliActionInstance - #addCliParameterInstance test")
    );
});
