const Bcrypt = require('bcrypt')
const { promisify } = require('util')

const hashAsync = promisify(Bcrypt.hash)
const compareAsyn = promisify(Bcrypt.compare)
const SALT = parseInt(process.env.SALT_PWD)

class PasswordHelper {
    
    static hashPassword (pass) {
        return hashAsync(pass, SALT)
    }

    static comparePassword(pass, hash) {
        return compareAsyn(pass, hash)
    }
}

module.exports = PasswordHelper