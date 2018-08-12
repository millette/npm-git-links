#!/usr/bin/env node

'use strict'

// self
const { ret, Doit } = require('.')

console.log('RET:', ret)

const x = new Doit(ret.repository, ret.headHash)
console.log(x.browse)

x.clearVersion()
console.log(x.browse)
