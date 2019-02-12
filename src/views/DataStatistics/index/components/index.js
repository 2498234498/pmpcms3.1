const requireAll = requireContext => requireContext.keys().reduce((prev, cur) => {
  return Object.assign(prev, {
    [cur.replace(/\.|\/|vue$/g, '')]: requireContext(cur).default
  })
}, {})
const req = require.context('./', false, /\.vue$/)

export default requireAll(req) || {}
