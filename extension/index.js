module.exports = (nodecg) => {
  [
    'achievements',
    'checkpoints',
    'events',
    'guests',
    'tiltify',
    'chatbot'
  ].forEach(
    module => require(`./${module}`)(nodecg)
  )
}
