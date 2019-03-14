import React, { Component } from 'react';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import ReactLoading from 'react-loading';
import KmerInfoBody from './kmer-info.js';
import BSJQueryBody from './bsj-query.js';
import './text.css';
import './layout.css';

const conf = require('./conf');
const dd_mode_options =  [ { value:"query", label:'Query datasets' }, { value: "kmerinfo", label:'K-mer info' } ];
const dd_mode_default = "query";
const subtitles = { "query":'Query RNA-seq datasets for backsplice junctions', "kmerinfo":'K-mer info' };

class HeaderBox extends Component {
  render() {
		return (
			<div className="box" id="header">
				<header id="rightHeader">
				<Dropdown options={dd_mode_options} onChange={this.props.changeHandlerMode} value={this.props.selected_mode} className='dropdownMode' placeholder="Select an option" />
				<Dropdown options={conf.dd_genome_options} onChange={this.props.changeHandlerGenome} value={this.props.selected_genome} className='dropdownGenome' placeholder="Select an option" />
				<a id="forkme_banner" title="View source code on GitHub" href="https://github.com/pmenzel/biq">Source</a>
				</header>
				<h1>BIQ</h1>
				<h2>{subtitles[this.props.mode]}</h2>
			</div>
		);
	}
}


class App extends Component {

  constructor() {
    super();
    this.state = {
    	store_genes : null,
    	selected_genome : conf.dd_genome_default,
			genes_url : conf.genome_urls[conf.dd_genome_default],
			query_url : conf.query_urls[conf.dd_genome_default],
    	mode : dd_mode_default,
			isLoading : true,
			isError : false,
			error_msg : ''
		};
		this.change_genome = this.change_genome.bind(this);
		this.change_mode = this.change_mode.bind(this);
	}

	load_genes() {
		this.setState({isLoading : true});
    let xhr = new XMLHttpRequest();
    xhr.open("GET",this.state.genes_url, true);
		console.log("Fetching "+this.state.genes_url);
		xhr.onreadystatechange = (e) => {
			console.log(e);
			if(xhr.readyState !== 4) { return; }
			if(xhr.status === 200) {
				//console.log(xhr.response);
				var r = JSON.parse(xhr.response);
				//console.log(r);
				//this.state.store_genes = r;
				this.setState({store_genes : r}, () => this.setState({ isLoading : false}));
			} else {
				console.error(xhr.statusText);
				this.setState({isLoading:false, isError:true, error_msg:'Error while getting file "'+this.state.genes_url+'": '+xhr.statusText});
			}
    }
		xhr.send();

	}

	componentDidMount() {
		this.load_genes();
	}

	change_genome(option) {
		this.setState({
			selected_genome : option.value,
			genes_url: conf.genome_urls[option.value],
			query_url: conf.query_urls[option.value],
			isLoading : true
		},this.load_genes);
	}

	change_mode(option) {
		this.setState({
			mode : option.value,
		});
	}

  render() {
  	var error_msg;
		if(this.state.genes_url === undefined || this.state.genes_url === '') {
			error_msg = 'No genes info URL configured';
		}

		if(error_msg !== undefined) {
			return (
				<div id="outer">
						<HeaderBox changeHandler={this.change_genome} selected_genome={this.state.selected_genome} />
						<div className="box" id="globalerrorbox">
						{error_msg}
						</div>
				</div>
			);
		}
		else if(this.state.isLoading===true) {
			return (
				<div id="outer">
					<HeaderBox mode={this.state.mode} genes_url={this.state.genes_url} changeHandlerGenome={this.change_genome} selected_genome={this.state.selected_genome} changeHandlerMode={this.change_mode} selected_mode={this.state.mode} />
					<div id="loading"><ReactLoading color={"#8fc1e3"} type={"spin"} /></div>
				</div>
			);

		}
		else if(this.state.mode==="query") {
			return (
				<div id="outer">
					<HeaderBox mode={this.state.mode} genes_url={this.state.genes_url} changeHandlerGenome={this.change_genome} selected_genome={this.state.selected_genome} changeHandlerMode={this.change_mode} selected_mode={this.state.mode} />
					<BSJQueryBody storeGenes={this.state.store_genes} query_url={this.state.query_url} />
				</div>
			);
		}
		else {
			return (
				<div id="outer">
					<HeaderBox mode={this.state.mode} genes_url={this.state.genes_url} changeHandlerGenome={this.change_genome} selected_genome={this.state.selected_genome} changeHandlerMode={this.change_mode} selected_mode={this.state.mode} />
					<KmerInfoBody storeGenes={this.state.store_genes} />
				</div>
			);
		}
	}


}

export default App;
