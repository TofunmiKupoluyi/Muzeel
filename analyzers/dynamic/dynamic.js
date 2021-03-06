'use strict';

const jdce = require('./jdce.js');



module.exports = function(directory, html_path, timeout, scripts, url, proxy, callback)
{
	jdce.run(
	{
		directory: directory,
		html_path: html_path,
		timeout: timeout,
		scripts: scripts,
		url: url,
		proxy: proxy
	}, callback);
};
