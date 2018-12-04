These scripts are used for processing the Ensembl gene annotation and exon sequences
into proper formats usable by KIQ and BIQ.

## Enumerating backsplice junctions

For enumerating the k-mers spanning all possible backsplice junctions (BSJ),
two files are needed from [Ensembl](http://ensembl.org):

1. The gene annoation in GTF format, which can be downloaded from the Ensembl FTP server.  
For example: `ftp://ftp.ensembl.org/pub/current_gtf/homo_sapiens/Homo_sapiens.GRCh38.94.gtf.gz`
2. The exon sequences from [Ensembl BioMart](https://www.ensembl.org/biomart/martview/).  
Export them in FASTA format, with the exon ID as single header, e.g. for human:
```
>ENSE00001216745
GAAAGGAAACCAGGCACTGCCTGCCGGCTTTACATCTGTTGATCTGACCTGACTGGAAGC
GTCCAAAGAGGGACGGCTGTCAGCCCTGCTTGACTGAGAACCCACCAGCTCATCCCAGAC
```

Then run `enumerate_BSJs.pl` as follows:
```
./enumerate_BSJs.pl exons.fa Homo_sapiens.GRCh38.94.gtf > bsj_kmers.txt
```

The output file `bsj_kmers.txt` contains the list of all BSJ-spanning 32-mers,
which can be used as input for [kiq index](https://github.com/pmenzel/kiq#create-k-mer-index).



## Creating JSON file for BIQ

BIQ requires a JSON file containing the first and last 16 nucleotides
from each exon of all genes.

This file can be created from the same FASTA and GTF files as above:

```
exons2json.pl exons.fa Homo_sapiens.GRCh38.94.gtf > ensembl_genes.json
```

The `ensembl_genes.json` file needs to be added to the `/public` folder and its
name set in the `genome_urls` section in `/src/conf.js`.

