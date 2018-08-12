'use strict'

// npm
const { fromUrl } = require('hosted-git-info')

// self
const { name, version, repository } = require('./package.json')
const versionTag = `v${version}`
const ret = { name, version, versionTag, repository }
if (typeof window === 'undefined') {
  // npm
  const { readFileSync } = require('fs')
  try {
    ret.versionHash = readFileSync(`.git/refs/tags/${versionTag}`, 'utf-8').trim()
    ret.headHash = readFileSync(
      `.git/${readFileSync('.git/HEAD', 'utf-8')
        .slice(5)
        .trim()}`,
      'utf-8'
    ).trim()
    ret.dev = ret.versionHash !== ret.headHash
  } catch (e) {
    // nop
  }
}

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

console.log('RET:', ret)

const x = new Doit(ret.repository, ret.versionTag)
console.log(x.browse)

x.clearVersion()
console.log(x.browse)
