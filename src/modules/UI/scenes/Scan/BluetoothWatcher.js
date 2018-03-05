
function bleWatcherListener (emitter, event) {
  const timeout = 7000 // 7 sec for connection
  let finished = false

  return new Promise(function (resolve, reject) {
    function fn (msg) {
      close()
      setTimeout(() => resolve(msg), 500)
    }

    function close () {
      finished = true
      emitter.off(event, fn)
    }

    emitter.on(event, fn)

    setTimeout(() => {
      if (!finished) {
        close()
        reject(new Error('Timeout error'))
      }
    }, timeout)
  })
}

export default {
  bleWatcherListener
}
