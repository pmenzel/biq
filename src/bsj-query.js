import React from 'react';
//import ReactDOM from 'react-dom';
import Griddle, { plugins, RowDefinition, ColumnDefinition } from 'griddle-react';
import {CSVLink} from 'react-csv';

//for Griddle
const griddleLayout = ({ Table, Pagination, Filter, SettingsWrapper }) => (
  <div>
    <Pagination />
    <Table />
  </div>
);
const griddleSortProperties = [
  { id: 'rpm', sortAscending: false }
];

class KmerSearchResult extends React.Component {
	render() {
		if(this.props.isLoading) {
			return (
				<div className="box">
					<p>Searching...</p>
				</div>
			)
		}
		if(this.props.data === null) { return null; }
		if(this.props.data.experiments.length === 0) { // no results were found
			return (
				<div className="box">
					<div className="closeIcon"><img id="clearResultsImg" onClick={this.props.clearHandler} src={require('./images/clear.png')} alt={'Clear results'} title={'Clear'}/><br/></div>
					<h4>Search results</h4>
					<p>No data sets found.</p>
				</div>
			)
    }
		let csvData;
		let columnDefs = [];
		if(this.props.data.query !== undefined) { // single kmer query case
			csvData = [ ['ID', 'readcount', 'rpm'] ];
			for(let i = 0; i < this.props.data.experiments.length; i++) {
				let srr = this.props.data.experiments[i];
				csvData.push([srr.name, srr.count, srr.rpm]);
			}
			columnDefs.push(<ColumnDefinition id="name" title="Name" order={1} width={170}/>);
			columnDefs.push(<ColumnDefinition id="rpm" title="RPM" order={2} width={80}/>);
			columnDefs.push(<ColumnDefinition id="count" title="#reads" width={60}/>);
		}
		else {
			csvData = [ ['ID'] ];
			for(let i = 0; i < this.props.data.experiments.length; i++) {
				let srr = this.props.data.experiments[i];
				csvData.push([srr.name]);
			}
			columnDefs.push(<ColumnDefinition id="name" title="Name" order={1} width={170}/>);
		}
		return  (
			<div id="kmersearch_result" className="box">
				<div className="closeIcon"><img id="clearResultsImg" onClick={this.props.clearHandler} src={require('./images/clear.png')} alt={'Clear results'} title={'Clear'}/><br/></div>
				<h4>Search results</h4>
				<p>{this.props.data.experiments.length} experiments were found.</p>
				<Griddle resultsPerPage={10} components={{Layout: griddleLayout}} sortProperties={griddleSortProperties} data={this.props.data.experiments} plugins={[plugins.LocalPlugin]}>
					<RowDefinition>
						{columnDefs}
					</RowDefinition>
				</Griddle>
				<div className="csvLink">
				<CSVLink data={csvData} separator={","} filename={"biq_"+this.props.data.query+".csv"}>Download CSV</CSVLink>
				</div>
			</div>
		);
	}
}

class KmerQueryList extends React.Component {
	render() {
		if(this.props.queryList === null) { return null; }
		if(this.props.queryList.length === 0) { return null; }
		let rows = [];
		for(var i = 0; i < this.props.queryList.length; i++){
			const kmer = this.props.queryList[i];
			rows.push(<li onClick={()=>this.props.liClickHandler(kmer)} key={i}>{kmer}</li>);
		}
		return (
			<div className="box" id="KmerQueryListDiv">
				<div id="csv">
				<div className="closeIcon"><img id="clearResultsImg" onClick={this.props.clearHandler} src={require('./images/clear.png')} alt={'Clear results'} title={'Clear'}/></div></div>
				<h4>Query List</h4>
				<div id="KmerQueryListSearchButtonDiv">
					<button onClick={this.props.buttonClickHandler} id="KmerQueryListSearchButton">Search all</button>
				</div>
				<ol id="KmerQueryList">
				{rows}
				</ol>
			</div>
		)
	}
}

class KmerSearch extends React.Component {
  constructor() {
    super();
    this.state = { query_result : null, queryList : null, isLoading : false }
		this.startWebSearch = this.startWebSearch.bind(this);
		this.startWebSearchAll = this.startWebSearchAll.bind(this);
		this.addKmerToQueryList = this.addKmerToQueryList.bind(this);
		this.delKmerFromQueryList = this.delKmerFromQueryList.bind(this);
		this.clearQueryResult = this.clearQueryResult.bind(this);
		this.clearQueryList = this.clearQueryList.bind(this);
	}

	clearQueryList() {
		this.setState({ query_result : null });
		this.setState({ queryList : null });
	}

	clearQueryResult() {
		this.setState({ query_result : null });
	}

	addKmerToQueryList() {
		var q = this.props.exon5p.last16 + this.props.exon3p.first16;
		if(this.state.queryList == null){
			this.setState({queryList : [q]});
		}
		else {
			this.setState({queryList : [...this.state.queryList, q]});
		}
	}

	delKmerFromQueryList(kmer) {
		let temp = [];
		for(let i = 0; i < this.state.queryList.length; i++) {
			if(this.state.queryList[i] !== kmer) {
				temp.push(kmer);
			}
		}
		this.setState({ queryList : temp });
		this.setState({ query_result : null });
		this.forceUpdate();
	}

	startWebSearchAll() {
		this.setState({ query_result : null, isLoading : true });
		let q = this.state.queryList.join();
		console.log(q);
    var xhr = new XMLHttpRequest();
    xhr.open("GET",this.props.query_url + q, true);
		xhr.onreadystatechange = (e) => {
//			console.log(e);
			if(xhr.readyState !== 4) { return; }
			this.setState({ isLoading : false });
			if(xhr.status === 200) {
			console.log(xhr.response);
				var r = JSON.parse(xhr.response);
				console.log(r);
				this.setState({ query_result : r });
			} else {
				console.error(xhr.statusText);
			}
    }
		xhr.send();
	}

	startWebSearch() {
		this.setState({ queryList : null,  query_result : null, isLoading : true });
		var q =this.props.exon5p.last16 + this.props.exon3p.first16;
		console.log(q);
    var xhr = new XMLHttpRequest();
    xhr.open("GET",this.props.query_url + q, true);
		xhr.onreadystatechange = (e) => {
//			console.log(e);
			if(xhr.readyState !== 4) { return; }
			this.setState({ isLoading : false });
			if (xhr.status === 200){
				var r = JSON.parse(xhr.response);
				console.log(r);
				this.setState({ query_result : r });
			} else {
				console.error(xhr.statusText);
			}
    }
		xhr.send();
	}

	render() {
		if(this.props.exon5p.last16.length===16 && this.props.exon3p.first16.length===16) {
			return (
				<div>
					<div className="box" id="container_kmerquery">
						<h3>Search in SRA</h3>
						<div className="input1"><span className="span_selectedtext">{this.props.exon5p.last16}</span></div>
						<div className="input2"><span className="span_selectedtext">{this.props.exon3p.first16}</span></div>
						<button id="HttpSearchButton" onClick={this.startWebSearch} disabled={!(this.props.exon3p.first16 && this.props.exon5p.last16)}>Search</button>
						<button id="AddKmerToSearchListButton" onClick={this.addKmerToQueryList} disabled={!(this.props.exon3p.first16 && this.props.exon5p.last16)}>+</button>
					</div>
					<KmerQueryList liClickHandler={this.delKmerFromQueryList} clearHandler={this.clearQueryList} buttonClickHandler={this.startWebSearchAll} queryList={this.state.queryList} />
					<KmerSearchResult isLoading={this.state.isLoading} clearHandler={this.clearQueryResult} data={this.state.query_result} queryList={this.state.queryList} />
				</div>
			);
		}
		else {
			return (
				<div className="box" id="container_kmerquery">
					<h3>Search in SRA</h3>
				</div>
			);
		}
  }
}

class ExonRow extends React.Component {
	render() {
    return (
        <li>
					5'-<a style={{color:this.props.exon.color3p}} href="#" onClick={()=>this.props.clickHandler(this.props.exon,'3p')}>{this.props.exon.first16}</a> ... <a style={{color:this.props.exon.color5p}} href="#" onClick={()=>this.props.clickHandler(this.props.exon,'5p')}>{this.props.exon.last16}</a>-3'
				</li>
    );
  }
}

class GeneInfo extends React.Component {
	render() {
		if(this.props.gene === null) {
			return (
				<div className="box" id="container_geneinfo">
					<h3>Selected Gene</h3>
					<p></p>
				</div>
			);
		}
    else {
			return (
				<div className="box" id="container_geneinfo">
					<h3>Selected Gene</h3>
					<div id="div_selectedgenename"><span className="span_selectedtext">{this.props.gene.name}</span></div> 
				</div>
			);
    }
  }
}

class Transcript extends React.Component {
	render() {
		if(this.props.transcript === null) { return(null);}
		var exons = [];
		for (var i = 0; i < this.props.transcript.exons.length; i++){
			var exon = this.props.transcript.exons[i];
			exons.push( <ExonRow clickHandler={this.props.clickHandler} key={i} exon={exon} />);
		}
    return (
				<div>
				<h5>{this.props.transcript.name}</h5>
				<ol>
					{exons}
				</ol>
				</div>
    );
  }
}

class TranscriptList extends React.Component {
	render() {
		if(this.props.gene === null) { return(null);}
    //var geneId = this.props.gene.id;
    //var geneName = this.props.gene.name;
    //var chr = this.props.gene.chr;
		var transcripts = [];
		for (var i = 0; i < this.props.gene.transcripts.length; i++){
			var t = this.props.gene.transcripts[i];
			transcripts.push( <Transcript clickHandler={this.props.clickHandler} key={i} transcript={t} />);
		}
    return (
			<div id="container_transcripts" className="box">
				<h4>Transcripts</h4>
					{transcripts}
				<div className="smallText">Select a 5'-sequence and a 3'-sequence for creating the database query.</div>
			</div>
    );
  }
}

class SearchTableRow extends React.Component {
	render() {
    return (
      <tr>
        <td><a href="#" onClick={()=>this.props.clickHandler(this.props.gene)}>{this.props.gene.name}</a></td>
        <td className="smallText">{this.props.gene.id}</td>
			</tr>
    );
	}
}


class GeneSearchTable extends React.Component {
	render() {
    var q = this.props.filterText.toLowerCase();
		if(q === '') { return(null); }
    var results = [];
		for (var i = 0; i < this.props.storeGenes.genes.length; i++){
			var gene = this.props.storeGenes.genes[i];
			if(gene.name.toLowerCase().startsWith(q)) {
				results.push( <SearchTableRow clickHandler={this.props.clickHandler} key={i} gene={gene} />);
			}
		}

		if(results.length===0) { return(null);}

    return (
				<div className="box" id="div_searchresults">
					<table id="table_searchresults">
						<tbody>
							{results}
						</tbody>
					</table>
				</div>
    );
  }
}

class GeneSearchInput extends React.Component {
	render() {
		return (
			<input id="input_genesearch" className="normalText" type="text" placeholder="Start Typing" value={this.props.filterText} onChange={this.props.changeHandler} autoFocus />
		);
	}
}



export default class BSJQueryBody extends React.Component {

  constructor() {
    super();
    this.state = { filterText : '', selectedGene : null, selectedExon3p : {first16:''}, selectedExon5p : {last16:''} };
		this.changeGeneId = this.changeGeneId.bind(this);
		this.changeQueryKmer = this.changeQueryKmer.bind(this);
	}

  handleUserInput = (event) => {
    this.setState({ filterText: event.target.value });
  };

	changeGeneId(gene) {
    this.setState({ selectedGene: gene, selectedExon1 : {first16:''}, selectedExon2 : {last16:''}});
	}

	changeQueryKmer(exon,pos) {
	 if(exon.first16.length !== 16) { return; }
    if(pos==='3p') {
			const oldExon = this.state.selectedExon3p;
			oldExon.color3p='';
			this.setState({oldExon});
			//exon.color3p = "#3E31BD";
			exon.color3p = "#232e9c";
			this.setState({ selectedExon3p : exon});
		}
		else {
			const oldExon = this.state.selectedExon5p;
			oldExon.color5p='';
			this.setState({oldExon});
			//exon.color5p = "#FF3600";
			exon.color5p = "#9c232e";
			this.setState({ selectedExon5p : exon});
		}
	}

  render() {
			return (
					<div>
						<div id="leftcol">
							<div id="container_genesearch" className="box">
								<h3>Search for gene by name</h3>
								<GeneSearchInput filterText={this.state.filterText} changeHandler={this.handleUserInput} />
							</div>
							<GeneSearchTable storeGenes={this.props.storeGenes} filterText={this.state.filterText} clickHandler={this.changeGeneId} />
						</div>
						<div id="rightcol">
							<KmerSearch query_url={this.props.query_url} exon3p={this.state.selectedExon3p} exon5p={this.state.selectedExon5p}  />
						</div>
						<div id="midcol">
							<GeneInfo gene={this.state.selectedGene} />
							<TranscriptList gene={this.state.selectedGene} clickHandler={this.changeQueryKmer} />
						</div>
					</div>
			);
	}
}

