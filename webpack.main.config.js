'use strict';

const path = require('path')

let buildConfig = require('./base_webpack.js')

const mainConfig = buildConfig('electron-main', path.join(__dirname, 'src/main/index.ts'), false)

module.exports = mainConfig