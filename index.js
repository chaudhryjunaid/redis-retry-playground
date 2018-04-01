'use strict';

const _ = require('lodash');
const args = require('minimist')(process.argv.slice(2));
const redis = require('redis');

let redisDefaultOptions = {
	debug_mode: false
};

let redisOptions = _.defaults({}, args, redisDefaultOptions);

console.log('Connecting redis...');
if (args.retry_strategy) {
	console.log('Using retry_strategy...');
	redisOptions = _.omit(redisOptions, ['retry_max_delay', 'connect_timeout', 'max_attempts'])
	redisOptions.retry_strategy(function(options) {
		return 0;
	});
	redis.createClient(redisOptions)
} else {
	console.log('Using deprecated retry params...');
	redis.createClient(redisOptions);
}

console.log('*** after connection call...');

process.on('uncaughtException', (e) => {
	console.log(e.message, e.stack);
});