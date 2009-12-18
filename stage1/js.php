<?php
	$s = microtime(1);
	header('Content-Type:application/x-javascript');
	$files = array_merge(
		glob('./lib/jquery/*.js'),
		glob('./lib/classes/*.js'),
		glob('./lib/extend/*.js'),
		glob('./lib/output/*.js'),
		glob('./lib/*.js')
	);
	foreach ($files as $js) {
		echo "// $js \n";
		echo file_get_contents($js), "\n\n";
	}
	echo '//', microtime(1) - $s;