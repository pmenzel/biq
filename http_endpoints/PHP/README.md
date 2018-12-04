This is a simple wrapper around [KIQ](http://github.com/pmenzel/kiq)
written in PHP for access through HTTP (as done by BIQ).

Setup: install KIQ and the three files comprising the KIQ k-mer database
on the web server and properly set their paths and filenames in the beginning
of q.php.

Example query: q.php?q=AATCTCGGTACTACAGGTATGGCCTCACAAGT

The output is in JSON format.

