/*
	JavaScript dead code elimination tool.
	Niels Groot Obbink
*/

'use strict';


// Import libraries.
require('./native_extentions');

const argument_parser = require('command-line-args'),
      file_system = require('fs'),
      path = require('path'),
      csv_factory = require('./csv.js'),
      jdce = require('./jdce.js');
	  DBModelMySql = require('./db_mysql');


// Get command line arguments.
let options;

try
{
	options = argument_parser(
	[
		{ name: 'directory', type: String },

		{ name: 'url', type: String, defaultOption: true },

		{name: 'dbName', type: String},

		{name: 'dbHost', type: String},

		{name: 'dbUser', type: String},

		{name: 'dbPassword', type: String},

		{name: 'dbPort', type: Number},

		{name: 'cacheDirectory', type: String},

		{name: 'proxy', type: String},

		{ name: 'index', type: String, alias: 'i' },

		{ name: 'csv', type: Boolean, alias: 'c' },

		{ name: 'csvfile', type: String, alias: 'f' },

		{ name: 'graph', type: Boolean, alias: 'g' },

		{ name: 'graphfile', type: String, alias: 'd' },

		{ name: 'verbose', type: Boolean, alias: 'v' },

		{ name: 'analyzer', type: String, multiple: true, alias: 'a' },

		{ name: 'noremove', type: Boolean, alias: 'n' },

		{ name: 'entire', type: Boolean, alias: 'e' },

		{ name: 'timeout', type: Number, alias: 't' },

		{ name: 'pace', type: Boolean, alias: 'p' },

		{name: 'missteps', type: Boolean, alias: 'm' }
	]);
}catch(exception)
{
	console.log(exception.message);
	process.exit(1);
}

if (!options['url']) {
	console.error('No url specified.');
 	process.exit(2);
}

// Extend our default settings with the command line arguments (if available).
let settings =
{
	index: 'index.html',
	verbose: false,
	csv: false,
	csvfile: 'output.csv',
	graph: false,
	graphfile: 'output.dot',
	analyzer: ['dynamic'],
	noremove: false,
	entire: false,
	pace: false,
	missteps: false,
}.extend(options);


// Create a CSV output instance.
let csv = new csv_factory(settings.csvfile, function(data)
{
	// Filter function; preprocess data to uniform output.
	return [
		settings.directory,
		data.js_files,
		data.function_count,
		data.functions_removed,
		data.run_time,
		data.analyzer_info,
		data.error
	];
});


try
{
	DBModelMySql.connect({
		host: settings.dbHost,
		user: settings.dbUser,
		port: settings.dbPort,
		password: settings.dbPassword,
		database: settings.dbName,
		cacheDirectory: settings.cacheDirectory,
		autocommit:true
	});
	// Run the JDCE.
	jdce.run({
		directory: settings.directory,
		html_path: settings.html_path,
		url: settings.url,
		analyzer: settings.analyzer,
		noremove: settings.noremove,
		graph: settings.graph,
		show_disconnected: settings.entire,
		timeout: settings.timeout,
		pace: settings.pace,
		missteps: settings.missteps,
		dbName: settings.dbName,
		dbPassword: settings.dbPassword,
		dbHost: settings.dbHost,
		dbPort: settings.dbPort,
		dbUser: settings.dbUser,
		proxy: settings.proxy
	}, function(results)
	{
		// If the CSV option was set, output result data to the csv file (see 'csv' above).
		if( settings.csv )
		{
			csv.append(results);
		}

		// If the graph option was set, output the graph.
		if( settings.graph )
		{
			file_system.writeFileSync( settings.graphfile, results.graph );
		}

		if( settings.verbose )
		{
			// Don't show graph DOT string in output
			delete results.graph;
		}
		console.log("Analysis complete");
		process.exit(1);
	});
	// Keep waiting
	process.stdin.resume();

}catch(error)
{
	console.log('jdce.js error:');
	console.log(error);
}