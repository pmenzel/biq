#!/usr/bin/perl -w
# usage:
#
# perl enumerate_BSJs.pl exons.fa genes.gtf >all_BSJs.txt
# sort all_BSJs.txt | uniq > unique_BSJs.txt
#
use strict;

my $seq = "";
my $gene_id = "";
my $K = 32;
my $K2 = 16;

my $debug = 0;

my %exon_id2seq;

sub enumerate_BSJ {

	return unless @_ > 2;
	if($debug) { print STDERR scalar @_,"\n"; }
	if($debug) { print STDERR "@_\n"; }
	my @exon_seqs;
	foreach my $k (@_) {
		my $seq = $exon_id2seq{$k};
		if(length($seq) >= $K) {
			push(@exon_seqs,$exon_id2seq{$k});
		}
	}
	if($debug) { 
		foreach my $k (@exon_seqs) {
			print STDERR substr($k,0,$K2) ," ... ", substr($k,-$K2),"\n";;
		}
	}
	pop(@exon_seqs); # take out last exon in the list, it will not be used
	shift(@exon_seqs); # take out first exon in the list, it will not be used
	while(@exon_seqs) {
		my $exon = pop(@exon_seqs); # take out last exon in the list

		# make BSJ containing only that one exon
		print substr($exon,-$K2),substr($exon,0,$K2),"\n";
		$exon = substr($exon,-$K2); #reduce exon to its last 16 chars
		foreach my $exon2 (@exon_seqs) { #and combine its last 16 chars with the first 16 chars of the remaining exons
			print $exon,substr($exon2,0,$K2),"\n";
		}
		if($debug) { print STDERR "----\n"; }
	}

}


if(@ARGV < 2) { die "Usage: exons2json.pl exons.fa genes.gtf\n"; }

open(my $gtf_file, $ARGV[1]) or die "Cannot open file $ARGV[1]\n";
open(my $fa_file, $ARGV[0]) or die "Cannot open file $ARGV[0]\n";

# Go through fasta file with exon sequences and make map exon_id -> sequence
while(<$fa_file>) {
	chomp;
	next unless length;
	if(/^>(.*)/) {
		if(length($gene_id)>0 and length($seq) > 0) {
			$exon_id2seq{$gene_id} = $seq;
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
	$exon_id2seq{$gene_id} = $seq;
}

print STDERR "Found ". scalar(keys(%exon_id2seq)) . " sequences\n";

my @curr_exon_ids;
my $curr_gene_id = "";
my $curr_tr_id = "";

while(my $line = <$gtf_file>) {
	next if $line =~ /^#/;
	my @F = split(/\t/,$line);

	if($F[2] eq "gene") {
		if(@curr_exon_ids) {
			# all exons from last transcript of last protein-coding gene should have been read in, now enumerate (B)SJs
			enumerate_BSJ(@curr_exon_ids);
			@curr_exon_ids = ();
		}
		if($line !~ /gene_biotype "protein_coding"/) {
			$curr_gene_id = "";
			next;
		}
		$line =~ /gene_id "([^"]+)"/;
		$curr_gene_id = $1;
	}
	elsif($curr_gene_id ne "" and $F[2] eq "transcript") {
		if(@curr_exon_ids) {
			# all exons should have been read in, now enumerate (B)SJs
			if($debug) { print STDERR "$curr_tr_id\n"; }
			enumerate_BSJ(@curr_exon_ids);
			@curr_exon_ids = ();
		}
		$line =~ /transcript_id "([^"]+)"/;
		$curr_tr_id = $1;
	}
	elsif($curr_gene_id ne "" and $F[2] eq "exon") {
		$line =~ /exon_id "([^"]+)"/;
		my $exon_id = $1;
		if(!defined($exon_id2seq{$exon_id})) { die "No sequence found for exon $exon_id\n"; }
		push(@curr_exon_ids,$exon_id);
	}
}

if(@curr_exon_ids) {
	if($debug) { print STDERR "$curr_tr_id\n"; }
	enumerate_BSJ(@curr_exon_ids);
}

