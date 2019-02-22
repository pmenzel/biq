# BIQ

Back-splice junction indexing and querying

## About

BIQ is a tool for searching k-mers that span backsplice junctions (BSJs) in a large collection of RNA-Seq experiments.
The main use case is to identify experiments in which a particular circular RNA, identified by its backsplice junction, is expressed.

BIQ builds on top of [KIQ](https://github.com/pmenzel/kiq), a software for indexing and querying k-mers in sequencing data sets.

![Flow chart](flowchart/BIQ_flow.png?raw=true "BIQ flow chart")

An example installation can be found at [e-rna.org](http://e-rna.org/biq/) or at [GitHub](https://pmenzel.github.io/biq/).  
It contains three BSJ k-mer indexes:
1. Drosophila melanogaster, [103 RNA-Seq datasets](https://plot.ly/~pmenzel/15) from [Westholm et al 2014](https://www.ncbi.nlm.nih.gov/pubmed/25544350).
2. Human, [386 SRA files](https://plot.ly/~pmenzel/17) from [ENCODE (only total RNA-Seq)](https://www.encodeproject.org/).
3. Human, [2652 SRA files](https://plot.ly/~pmenzel/19) from [Solomon et al. 2016](https://www.ncbi.nlm.nih.gov/pubmed/26854477).


## Installation
BIQ is a React app built with [create-react-app](https://github.com/facebook/create-react-app),
which requires [Node.js](https://nodejs.org/) to be installed.

Download:
```
git clone https://github.com/pmenzel/biq
cd biq
```
First install the required packages:
```
npm install
```
Run the app locally in the development mode:
```
npm start
```
Open http://localhost:3000 to view it in the browser.

For preparing the installation on a web server, first run
```
npm run build
```
and then copy content of the `build/` folder to the web server.

## Configuration

BIQ accesses KIQ and the backsplice junction index through an HTTP
endpoint.  The folder `http_endpoints` contains HTTP wrappers for PHP
and AWS Lambda that can be used to call KIQ. The URLs for these endpoints
can be set in `src/conf.js`.

The enumeration of BSJ k-mers from annotated transcripts and
their exons is done with the script `scripts_ensembl/enumerate_BSJs.pl`.

BIQ also needs a JSON file containing the 5' and 3' sequences of the exons,
which are used to create a query k-mer.  This JSON file is created with the
script `scripts_ensembl/exons2json.pl`.


## License

Copyright (c) 2018,2019 Peter Menzel <pmenzel@gmail.com>

See the file LICENSE.

