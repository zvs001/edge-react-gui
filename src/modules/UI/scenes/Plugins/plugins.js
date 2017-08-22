
import {Platform} from 'react-native'
import plugins from '../../../../assets/plugins.json'

function loadPlugins (ls) {
  return ls.map(function(plugin) {
    let sourceFile;
    if (Platform.OS === 'android') {
      sourceFile = {uri:`file:///android_asset/plugins/${plugin.pluginId}/index.html`}
    } else {
      sourceFile = {uri:plugin.pluginId}
    }
    return {
      pluginId: plugin.pluginId,
      sourceFile: sourceFile,
      name: plugin.name,
      subtitle: plugin.subtitle,
      provider: plugin.provider,
      imageUrl: plugin.iconUrl,
      environment: plugin.environment
    }
  })
}

export const BUY_SELL = loadPlugins(plugins.buysell)
export const SPEND = loadPlugins(plugins.spend)
