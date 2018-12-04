This is a simple wrapper around [KIQ](http://github.com/pmenzel/kiq)
that can be used with AWS Lambda.

Setup:

* Download KIQ and compile a static `kiq` binary using `make static`.
* Gather the three database files as `kmercounts.bin`, `kmerindex.bin`, and `metadata.bin`.
* Zip all files: `zip aws.zip index.js kmerindex.bin metadata.bin kmercounts.bin kiq`.
* upload `aws.zip` to AWS lambda and select Node.Js 6.10 as a runtime.


