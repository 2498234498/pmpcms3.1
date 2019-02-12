const requireAll = requireContext => requireContext.keys().reduce((prev, cur) => {
  if (cur.replace(/\.|\/|js$/g, '') === 'index') {
    return prev
  }
  return [...prev, requireContext(cur).default]
}, [])
const req = require.context('./', false, /\.js$/)

export default requireAll(req) || {}
