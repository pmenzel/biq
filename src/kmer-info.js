import React, { Component } from 'react';

class Exon extends Component {
	render() {
    return (
				<tr>
					<td>{this.props.gene.name}</td>
					<td>{this.props.tx.name}</td>
					<td>{this.props.exon.id}</td>
				</tr>
    );
  }
}

class Exons extends Component {
	render() {
    return (
				<tr>
					<td>{this.props.gene.name}</td>
					<td>{this.props.tx.name}</td>
					<td>{this.props.exon1.id} + {this.props.exon2.id}</td>
				</tr>
    );
  }
}

class KmerInfo extends Component {
	render() {
		var q = this.props.kmer;
		if(q === null || q==='') {
			return (
				<div className="box" id="container_geneinfo">
					<h3>Selected k-mer</h3>
					<p></p>
				</div>
			)
    }

		if(q.length !== 32) {
			return (
				<div className="box" id="container_geneinfo">
					<h3>Selected k-mer</h3>
					<p>Selected k-mer must have length 32!</p>
				</div>
			)
    }

		var kmer_first16 = q.substring(0,16);
		var kmer_last16 = q.substring(16,32);
		console.log("Qfirst16: "+kmer_first16);
		console.log(" Qlast16: "+kmer_last16);
		var results = [];
		for(var g = 0; g < this.props.storeGenes.genes.length; g++) {
			var gene = this.props.storeGenes.genes[g];
			for(var t = 0; t < gene.transcripts.length; t++) {
				var tx = gene.transcripts[t];
				var e1 = null, e2 = null;
				for(var e = 0; e < tx.exons.length; e++) {
					var exon = tx.exons[e];
					if(exon.first16 === kmer_last16 && exon.last16 === kmer_first16) {
						results.push(<Exon key={g+t+e} gene={gene} tx={tx} exon={exon} />);
					}
					if(exon.first16 === kmer_last16) {
						e1 = tx.exons[e];
					}
					else if(exon.last16 === kmer_first16) {
						e2 = tx.exons[e];
					}
					if(e1!==null && e2!==null) {
						results.push(<Exons key={g+t+e1+e2} gene={gene} tx={tx} exon1={e1} exon2={e2} />);
						e1=null;e2=null;
					}
				}
			}
		}

		if(results.length===0) {
			return (
				<div className="box" id="container_geneinfo">
					<h3>Selected k-mer</h3>
					<p>k-mer {q} not found!</p>
				</div>
			)
		}

		return (
			<div>
				<div className="box" id="container_geneinfo">
					<h3>Selected k-mer</h3>
					<div id="div_selectedgenename"><span className="span_selectedtext">{this.props.kmer}</span></div>
				</div>
				<div id="container_transcripts" className="box">
					<table id="table_searchresults">
						<thead>
							<tr>
								<th>Gene</th>
								<th>Transcipt</th>
								<th>Exon #</th>
							</tr>
						</thead>
						<tbody>
							{results}
						</tbody>
					</table>
				</div>
			</div>
		)
  }
}

class KmerSearchInput extends Component {
	render() {
		return (
				<input id="input_kmersearch" className="normalText" type="text" placeholder="Start Typing" value={this.props.filterText} onChange={this.props.changeHandler} autoFocus />
		);
  }
}


export default class KmerInfoBody extends Component {
  constructor() {
    super();
    this.state = { filterText : '' };
	}
  change_kmer = (event) => {
    this.setState({ filterText: event.target.value });
  };

  render() {
			return (
					<div>
						<div id="leftcol">
							<div id="container_genesearch" className="box">
								<h3>Search for k-mer</h3>
								<KmerSearchInput filterText={this.state.filterText} changeHandler={this.change_kmer} />
							</div>
						</div>
						<div id="midcol">
							<KmerInfo storeGenes={this.props.storeGenes} kmer={this.state.filterText} />
						</div>
				</div>
			);
		}
}

