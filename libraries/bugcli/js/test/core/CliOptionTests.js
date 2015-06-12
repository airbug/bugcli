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
//@Require('bugcli.CliOption')
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
    var CliOption   = bugpack.require('bugcli.CliOption');
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
    var cliOptionInstantiationTest = {

        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function() {
            this.testCliOptionObject    = {
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
            };
            this.testCliOption      = CliOption.alloc().initWithObject(this.testCliOptionObject);
        },


        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testCliOption, CliOption),
                "Assert instance of CliOption");
            test.assertEqual(this.testCliOption.getName(), this.testCliOptionObject.name,
                "Assert CliOption.name was set correctly");
            test.assertEqual(this.testCliOption.getFlagSet().getCount(), 2,
                "Assert CliOption.flagSet count is 2");
            if (this.testCliOption.getFlagSet().getCount() === 2) {
                test.assertTrue(this.testCliOption.getFlagSet().contains(this.testCliOptionObject.flags[0]),
                    "Assert CliOption.flagSet[0] was set correctly");
                test.assertTrue(this.testCliOption.getFlagSet().contains(this.testCliOptionObject.flags[1]),
                    "Assert CliOption.flagSet[1] was set correctly");
            }
            test.assertEqual(this.testCliOption.getRequired(), this.testCliOptionObject.required,
                "Assert CliOption.required was set correctly");
            test.assertEqual(this.testCliOption.getParameterList().getCount(), 1,
                "Assert CliOption.parameterList count is 1");
            test.assertEqual(this.testCliOption.hasParameters(), true,
                "Assert CliOption#hasParameters returns true");
            if (this.testCliOption.getParameterList().getCount() === 1) {
                test.assertEqual(this.testCliOption.getParameterList().getAt(0).getName(), this.testCliOptionObject.parameters[0].name,
                    "Assert CliOption.parameterList was set correctly");
            }
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(cliOptionInstantiationTest).with(
        test().name("CliOption - instantiation test")
    );
});
