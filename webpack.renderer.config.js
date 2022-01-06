'use strict';

const path = require('path')


let buildConfig = require('./base_webpack.js')

const renderConfig = buildConfig('electron-renderer', path.join(__dirname, 'src/renderer/index.tsx'), true)
renderConfig.devServer = {
  port: '3000',
}

module.exports = renderConfig