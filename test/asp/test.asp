<html>
	<head>
	  <!--[if IE ]>
	    <script type="text/javascript" src="http://getfirebug.com/releases/lite/1.2/firebug-lite-compressed.js"></script>
	  <![endif]-->
		<script src="../latest/active.packed.js" runat="server"></script>
		<script src="test.js" runat="server"></script>
		<script runat="server">
		  window.onload = function(){
  			ActiveRecord.connect(window.location.href.match(/in\_memory\=true/) ? ActiveRecord.Adapters.InMemory : null);
  			ActiveRecord.logging = false;
  			ActiveTest.run();
		  };
		</script>
	</head>
	<body>
		<h1>ActiveJS Tests</h1>
		<p>Check console for test results.</p>
	</body>
</html>