'use strict';
process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT']

const file_i = 'kmer_index.bin';
const file_k = 'kiq_database.bin';

const { execFile } = require('child_process');
exports.handler = (event, context, callback) => {
	const child = execFile('./kiq', ['query', '-i',file_i,'-k',file_k,'-j','-a','-Q',event["queryStringParameters"]['q']], (error, stdout, stderr) => {
		if (error) {
			throw error;
		}
		console.log(stderr);
		console.log(stdout);
		callback(null, {"statusCode": 200, "headers": { "Access-Control-Allow-Origin": "*"}, "body": stdout})
	});
};
