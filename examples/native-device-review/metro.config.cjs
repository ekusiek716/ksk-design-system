const path = require('node:path')
const { getDefaultConfig } = require('expo/metro-config')
const config = getDefaultConfig(__dirname)
const root = path.resolve(__dirname, '../..')
config.watchFolders = [root]
// Source imports must resolve a single React/RN copy from this SDK's app.
config.resolver.nodeModulesPaths = [path.join(__dirname, 'node_modules'), path.join(root, 'node_modules')]
config.resolver.disableHierarchicalLookup = true
module.exports = config
