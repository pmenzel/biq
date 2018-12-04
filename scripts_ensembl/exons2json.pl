#!/usr/bin/perl -w
# usage:
#
# perl exons2json.pl exons.fa genes.gtf >genes.json
# exons.fa headers must only contain the exon id from Ensembl, e.g.
# >FBtr0077957-E4
# ACTTAAACGCGACACCCAGCTCAATCCCGCCGACATGCTGGCCCTGGTTGCCCTGGTGGA
#

use strict;

my $seq = "";
my $gene_id = "";
my $K = 16;

my %id2seq;

if(@ARGV < 2) { die "Usage: exons2json.pl exons.fa genes.gtf\n"; }

open(my $gtf_file, $ARGV[1]) or die "Cannot open file $ARGV[1]\n";
open(my $fa_file, $ARGV[0]) or die "Cannot open file $ARGV[0]\n";


while(<$fa_file>) {
	chomp;
	next unless length;
	if(/^>(.*)/) {
		if(length($gene_id)>0 and length($seq) > 0) {
			$id2seq{$gene_id} = $seq;
		}
		$gene_id = $1;
		$seq = "";
	}
	else {
		$seq .= $_;
	}
}
#add last entry
if(length($gene_id)>0 and length($seq) >= $K) {
	$id2seq{$gene_id} = $seq;
}


print STDERR "Found ". scalar(keys(%id2seq)) . " exon sequences\n";


print '{"genes" : [' , "\n";

my $curr_gene_id = "";
my $curr_tr_id = "";
my $first_gene = 1;
my $first_tr = 1;
my $first_exon = 1;



while(my $line = <$gtf_file>) {
	next if $line =~ /^#/;
	my @F = split(/\t/,$line);

	if($F[2] eq "gene") {
		if($line !~ /gene_biotype "protein_coding"/) {$curr_gene_id = ""; next;}
		$line =~ /gene_id "([^"]+)"/;
		$curr_gene_id = $1;
		$line =~ /gene_name "([^"]+)"/;
		my $gene_name = $1;
		if($first_tr==0) { print '  ]}',"\n"; }
		if($first_gene==0) { print ']},',"\n"; } else {$first_gene=0;}
		print '{ "id" : "' , $curr_gene_id , '", "name" : "' , $gene_name , '", "transcripts" : [', "\n";
		$first_tr=1;
	}
	elsif($curr_gene_id ne "" and $F[2] eq "transcript") {
		$line =~ /transcript_id "([^"]+)"/;
		$curr_tr_id = $1;
		$line =~ /transcript_name "([^"]+)"/;
		my $tr_name = $1;
		if($first_tr==0) { print '  ]},',"\n  "; } else {$first_tr=0; print '  ';}
		print '{ "id" : "' , $curr_tr_id , '", "name" : "' , $tr_name , '", "exons" : [', "\n";
		$first_exon=1;
	}
	elsif($curr_gene_id ne "" and $F[2] eq "exon") {
		$line =~ /exon_id "([^"]+)"/;
		my $exon_id = $1;
		$line =~ /exon_number "([^"]+)"/;
		my $exon_nr = $1;
		my $key = $exon_id;
		if(!defined($id2seq{$key})) { die "No sequence found for exon $key\n"; }
		my $exon_seq = $id2seq{$key};
		if($first_exon==0) { print '    ,'; } else {$first_exon=0; print '    ';}
		print '{"id" : "', $exon_nr ,'", "first16": "', substr($exon_seq,0,$K) , '", "last16":"', substr($exon_seq,-$K) ,'" }', "\n";
	}
}
print "    ]}\n  ]}\n]}\n";


