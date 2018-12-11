# BIQ

Back-splice junction indexing and querying

## About

BIQ is a tool for searching k-mers that span backsplice junctions (BSJs) in a large collection of RNA-Seq experiments.
The main use case is to identify experiments in which a particular circular RNA, identified by its backsplice junction, is expressed.

BIQ builds on top of [KIQ](https://github.com/pmenzel/kiq), a software for indexing and querying k-mers in sequencing data sets.

![Flow chart](flowchart/BIQ_flow.png?raw=true "BIQ flow chart")

An example installation can be found at [e-rna.org](http://e-rna.org/biq/) or at [GitHub](https://pmenzel.github.io/biq/).  
It contains two BSJ indezes:
1. Drosophila melanogaster, 103 RNA-Seq datasets from [Westholm et al 2014](https://www.ncbi.nlm.nih.gov/pubmed/25544350).
2. Human, [2652 RNA-Seq data sets](http://www.cs.cmu.edu/~ckingsf/software/bloomtree/srr-list.txt), [UMAP plot](https://plot.ly/~pmenzel/13/#/) based on BSJ coverage in all 2652 data sets.


## Installation
BIQ is a ReactJS app built with [create-react-app](https://github.com/facebook/create-react-app).

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
npm run-script build
```
and then copy content of the `build/` folder to the web server.

## Configuration

BIQ accesses KIQ and the backsplice junction index through an HTTP
endpoint.  The folder `http_endpoints` contains HTTP wrappers for PHP
and AWS Lambda that can be used to call KIQ.



