<!doctype html>
<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=utf8" />
    <title>Active Record ASP SQL Server Adapter Tests</title>
<script src="../../latest/active.js" runat="server" language="javascript"></script>
<script src="test.js" runat="server" language="javascript"></script>
<script runat="server" language="javascript">
// Console object for output
var console = { 
    log : function log(s, color) {
        Response.write('<span ' + 
            (color ? 'style="color:' + color + ';"' : '') + '>' +
            (typeof s === "string" ? s : ActiveSupport.JSON.stringify(s)) +
            '</span><br />'); 
    } 
};

ActiveRecord.connect(ActiveRecord.Adapters.ASPSQLServer, {
    USER : 'test',
    PASS : 'test123',
    NAME : 'activerecord_test'
});
ActiveRecord.logging = false;
ActiveTest.run();
</script>
</head><body></body></html>
