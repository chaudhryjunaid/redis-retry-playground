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
	redisOptions.retry_strategy = function(options) {
		if (args.connect_timeout && options.total_retry_time > args.connect_timeout) {
			// End reconnecting after a specific timeout and flush all commands
			// with a individual error
			return new Error('Retry time exhausted');
		}
		if (args.max_attempts && options.attempt >= args.max_attempts) {
			// End reconnecting with built in error
			return new Error('Max retry attempts exhausted');
		}
		if (args.retry_max_delay) {
			return Math.min(Math.pow(2, options.attempt+7), args.retry_max_delay);
		}
		// reconnect after
		return Math.pow(2, options.attempt+7);
	};
	redis.createClient(redisOptions)
} else {
	console.log('Using deprecated retry params...');
	redis.createClient(redisOptions);
}

console.log('*** after connection call...');

process.on('uncaughtException', (e) => {
	console.log(e.message, e.stack);
});