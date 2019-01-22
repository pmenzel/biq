module.exports = {
	"genome_urls" : {
		"hsa_solomon2016_ens90" : "./hs_bsj_ensembl90.json",
		"hsa_encode_ens90" : "./hs_bsj_ensembl90.json",
		"dme_westholm2014_ens88" : "./dm_bsj_ensembl88.json"
	},
	"query_urls" : {
		"hsa_solomon2016_ens90" : "https://e-rna.org/biq/kiq/human_2652/q.php?q=",
		"hsa_encode_ens90" : "https://e-rna.org/biq/kiq/human_encode/q.php?q=",
		"dme_westholm2014_ens88" : "https://e-rna.org/biq/kiq/fly_lai/q.php?q="
	},
	"dd_genome_options" : [
		{ value: "dme_westholm2014_ens88", label:'D.mel. Westholm2014 (Ensembl88)' },
		{ value: "hsa_solomon2016_ens90", label:'H.sap. Solomon2016 (Ensebl90)' },
		{ value: "hsa_encode_ens90", label:'H.sap. ENCODE (Ensembl90)' }
	],
	"dd_genome_default" : "hsa_encode_ens90"
}
