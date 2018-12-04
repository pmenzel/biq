module.exports = {
 "genome_urls" : {
 	 "hsa_ens90" : "./hs_bsj_ensembl90.json",
 	 "dme_ens88" : "./dm_bsj_ensembl88.json"
 },
 "query_urls" : {
 	 "hsa_ens90" : "https://e-rna.org/biq/kiq/human_2652/q.php?q=",
 	 "dme_ens88" : "https://e-rna.org/biq/kiq/fly_lai/q.php?q="
 },
 "dd_genome_options" : [
   { value:"dme_ens88", label:'D.mel. Ensembl88' },
   { value: "hsa_ens90", label:'H.sap. Ensembl90' }
 ],
 "dd_genome_default" : "hsa_ens90"
}
