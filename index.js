'use strict'

if (typeof window !== 'undefined') {
  throw new Error('Browser not supported')
  /*
  module.exports = {
    ret: {},
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

// self
const { name, version, repository } = require(resolveCwd('package.json'))
const versionTag = `v${version}`
const ret = { name, version, versionTag, repository }

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

try {
  const p1 = resolveCwd('.git/HEAD')
  const p2 = resolveCwd(
      `.git/${readFileSync(p1, 'utf-8')
        .slice(5)
        .trim()}`
  )
  ret.headHash = readFileSync(p2, 'utf-8').trim()
  const p3 = resolveCwd('.git/refs/tags', versionTag)

  ret.versionHash = readFileSync(p3, 'utf-8').trim()
  ret.dev = ret.versionHash !== ret.headHash
} catch (e) {
  if (!ret.versionHash) {
    delete ret.versionTag
  }
}

module.exports = {
  ret,
  Doit
}
