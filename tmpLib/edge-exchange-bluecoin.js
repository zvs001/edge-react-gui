/**
 * return array of objects of:
 * {
 *  fromCurrency: "BTC",
 *  toCurrency: "DCR",
 *  rate: "122.46222487"
 * }
 */

export default {
  pluginType: 'exchange',

  makePlugin ({ io }) {
    return Promise.resolve({
      exchangeInfo: {
        exchangeName: 'BluecoinExchange'
      },
      async fetchExchangeRates (pairsHint) {
        const reply = await io.fetch('https://api.coinmarketcap.com/v1/ticker/bluecoin/')
        const json = await reply.json()

        const exchange = {fromCurrency: 'BLU', toCurrency: 'iso:USD', rate: '0.0043'}
        try {
          exchange.rate = json[0].price_usd
        } catch (e) { console.error('edge_exchange_bluecoin parse error', e) }

        // todo delete test data
        exchange.rate = '1234'

        return [exchange]
      }
    })
  }
}
