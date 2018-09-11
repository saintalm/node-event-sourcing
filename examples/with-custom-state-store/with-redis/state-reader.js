const { StateReader, RedisStateStore } = require('node-event-sourcing')
const redis = require('redis')

const state = new StateReader({
  stateStore: new RedisStateStore(redis.createClient('6379'))
})

setInterval(
  async () =>
    console.log('Reading current counter values:', {
      'counter:1': await state.get('counter:1'),
      'counter:2': await state.get('counter:2')
    }),
  5000
)
console.log('Subscribing to counter state change')
const unsubscribe1 = state.subscribe('counter:1', value => console.log('Counter 1 changed:', value))
const unsubscribe2 = state.subscribe('counter:2', value => console.log('Counter 2 changed:', value))
setTimeout(() => {
  console.log('Unsubscribing state change')
  unsubscribe1()
  unsubscribe2()
}, 6000)
setTimeout(() => {
  console.log('Stopping')
  process.exit(0)
}, 11000)
