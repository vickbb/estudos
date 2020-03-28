const assert = require('assert')
const PasswordHelper = require('../helpers/passwordHelper')

const SENHA = 'Victor@10293847'
const HASH = '$2b$04$.VF2RIW4aT6I88ONtrsbfuq1HAtC3hZWQvgPQ2OV11LUu4dAG9g8q'

describe('UserHelper test Suite', function () {
    it('deve gerar um hash a partir de uma senha', async () => {
        const result = await PasswordHelper.hashPassword(SENHA)

        assert.ok(result.length > 10)
    })

    it('deve comparar uma senha e seu hash', async () => {
        const result = await PasswordHelper.comparePassword(SENHA, HASH)
        
        assert.ok(result)
    })
})