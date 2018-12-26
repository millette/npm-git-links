'use strict'

if (typeof window !== 'undefined') {
  throw new Error('Browser not supported')
  /*
  module.exports = {
    localRet: {},
    Doit: DoitImp = () => { throw new Error('Browser not supported') }
  }
  return
  */
}

// npm
const { fromUrl } = require('hosted-git-info')

// core
const { readFileSync } = require('fs')
const resolveCwd = require('path').resolve.bind(null, process.cwd())

class Doit {
  constructor (u, v) {
    this._u = u
    this.version = v
  }

  set version (v) {
    this._version = v
    const u = v ? `${this._u}#${v}` : this._u
    this._z = fromUrl(u)
    if (!this._z) {
      const error = new Error('URL is not supported.')
      error.url = u
      throw error
    }
    this._y = this._z.browse()
  }

  clearVersion () {
    this.version = undefined
  }

  get browse () {
    return this._y
  }
}

let ret

try {
  const { name, version, repository } = JSON.parse(readFileSync(resolveCwd('package.json'), 'utf-8'))
  const versionTag = `v${version}`
  const localRet = { name, version, versionTag, repository }
  ret = localRet

  const p1 = resolveCwd('.git/HEAD')
  const p2 = resolveCwd(
    `.git/${readFileSync(p1, 'utf-8')
      .slice(5)
      .trim()}`
  )
  localRet.headHash = readFileSync(p2, 'utf-8').trim()
  const p3 = resolveCwd('.git/refs/tags', versionTag)

  localRet.versionHash = readFileSync(p3, 'utf-8').trim()
  localRet.dev = localRet.versionHash !== localRet.headHash
} catch (e) {
  if (!ret) { throw e }
  if (!ret.versionHash) {
    delete ret.versionTag
  }
}

module.exports = {
  ret,
  Doit
}
