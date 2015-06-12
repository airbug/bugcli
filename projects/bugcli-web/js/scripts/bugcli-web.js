/*
 * Copyright (c) 2015 airbug inc. http://airbug.com
 *
 * bugcli may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Script
//-------------------------------------------------------------------------------

(function(window) {
    var bugpack     = require("bugpack").context();
    var BugCli      = bugpack.require("bugcli.BugCli");
    window.bugcli   = window.bugcli || BugCli.getInstance();;
})(window);
