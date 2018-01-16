const fs = require('fs');
const ini = require('ini');

module.exports = ini.parse(fs.readFileSync(__dirname + '/../.env', 'utf-8'));
