<?php

define("KIQ",'/path/to/kiq/bin/kiq');
define("DBPATH",'/path/to/biq/database/');
define("KMERINDEX",'kmerindex.bin');
define("KMERCOUNTS",'kmercounts.bin');
define("METADATA",'metadata.bin');

$doGET = ($_SERVER['REQUEST_METHOD']=="GET")?true:false;

$K = 32;

if(!$doGET) {
	header("HTTP/1.0 405 Method Not Allowed");
	header("Allow: GET");
	exit;
}

if(!isset($_GET['q']) || empty($_GET['q'])) {
	header("HTTP/1.0 400 Bad Request");
	exit;
}

$q = preg_replace("/[^ACGTacgt,]/", "", $_GET['q']);

$a = "";
if(preg_match("/,/",$q)) {
	$a = " -a ";
}
else { // single k-mer submitted
	if(strlen($q)!=$K) {
		header("HTTP/1.0 400 Bad Request");
		exit;
	}
}

$kiq_call = KIQ.' query -i '.DBPATH.KMERINDEX.' -k '.DBPATH.KMERCOUNTS.' -m '.DBPATH.METADATA.' -j '.$a.' -Q '.$q;
$kiq_out = array();
$kiq_status;
exec($kiq_call,$kiq_out,$kiq_status);
if($kiq_status!=0) {
	header("HTTP/1.0 500 Internal Server Error");
	exit;
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

print implode(" ",$kiq_out);

?>


