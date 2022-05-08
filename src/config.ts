import { packageJson }  from './package-json.js'

export const VERSION = packageJson.version || '0.0.0'
export const NAME    = packageJson.name    || 'NONAME'
