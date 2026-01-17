const jstz = require('jstimezonedetect')

// get current timezone name
const timezoneName = () => {
  return jstz.determine().name()
}

export default timezoneName
