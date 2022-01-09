'use strict';

const path = require('path')

let buildConfig = require('./base_webpack.js')

const mainConfig = buildConfig('electron-main', path.join(__dirname, 'src/main/index.ts'), false)
mainConfig.context = path.resolve(__dirname),
mainConfig.node = {
    __dirname: true,
}

module.exports = mainConfig