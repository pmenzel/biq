'use strict';
process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT']

const file_i = 'kmerindex.bin';
const file_k = 'kmercounts.bin';
const file_m = 'metadata.bin';

const { execFile } = require('child_process');
exports.handler = (event, context, callback) => {
	const child = execFile('./kiq', ['query', '-i',file_i,'-k',file_k,'-m',file_m,'-j','-a','-Q',event["queryStringParameters"]['q']], (error, stdout, stderr) => {
		if (error) {
			throw error;
		}
		console.log(stderr);
		console.log(stdout);
		callback(null, {"statusCode": 200, "headers": { "Access-Control-Allow-Origin": "*"}, "body": stdout})
	});
};
