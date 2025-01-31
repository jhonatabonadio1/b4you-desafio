import Csrf from 'csrf'

export const tokens = new Csrf()
export const secret = tokens.secretSync()
