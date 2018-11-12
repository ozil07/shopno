# jQuery plugin to show/hide additional items 

This is just very simple jQuery plugin to show/hide additional items of some DOM element.

Usage
--------------------------------------

```bash
...
<script src="jquery-1.9.1.js"></script>
<script src="jquery.showmore.js"></script>
<script>
jQuery(document).ready(function(){

	jQuery(".ul").showmore({visible:5});

	jQuery(".div").showmore({

		childElement:"div"

		});

	});

</script>
...
```

```bash
<body>
	
   	<div class="div">
		
		<div>lorem ipsum doret</div>
		<div>lorem ipsum doret</div>
		<div>lorem ipsum doret</div>
		<div>lorem ipsum doret</div>
		<div>lorem ipsum doret</div>
		<div>lorem ipsum doret</div>
		<div>lorem ipsum doret</div>
		<div>lorem ipsum doret</div>
		
	</div>	
		
	<ul class="ul">
		
		<li>lorem ipsum doret</li>
		<li>lorem ipsum doret</li>
		<li>lorem ipsum doret</li>
		<li>lorem ipsum doret</li>
		<li>lorem ipsum doret</li>
		<li>lorem ipsum doret</li>
		<li>lorem ipsum doret</li>
		<li>lorem ipsum doret</li>
		<li>lorem ipsum doret</li>
		<li>lorem ipsum doret</li>
		<li>lorem ipsum doret</li>
		<li>lorem ipsum doret</li>
		
	</ul>
		
</body>
```




