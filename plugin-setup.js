const fs = require('fs')
const path = require('path')
const {plugins} = require('./package.json')

const pluginsFile = './src/assets/plugins.json'
const androidDir = './android/app/src/main/assets/plugins/'

const platforms = [androidDir]
const pluginManifests = {
  buysell:[],
  spend:[]
}

if (!fs.existsSync(androidDir)) {
  fs.mkdirSync(androidDir)
}

function copyAssets (plugin) {
  let manifest = require(`./node_modules/${plugin}/manifest.json`)
  platforms.forEach((platformDir) => {
    const pluginDir = path.join(platformDir, manifest.pluginId)
    if (!fs.existsSync(pluginDir)) {
      fs.mkdirSync(pluginDir)
    }
    fs.copyFileSync(`./node_modules/${plugin}/build/index.html`, `${pluginDir}/index.html`)
  })
  return manifest
}

plugins.buysell.forEach(function(plugin) {
  let manifest = copyAssets(plugin)
  pluginManifests.buysell.push(manifest)
})

plugins.spend.forEach(function(plugin) {
  let manifest = copyAssets(plugin)
  pluginManifests.spend.push(manifest)
})

fs.writeFileSync(pluginsFile, JSON.stringify(pluginManifests, null, 2))
