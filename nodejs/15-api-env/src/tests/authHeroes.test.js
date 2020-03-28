const assert = require('assert')
const api = require('../api')

const Context = require('./../db/stratagies/base/contextStrategy')
const PostGres = require('./../db/stratagies/postgres/postgres')
const UsuarioSchema = require('./../db/stratagies/postgres/schemas/usuarioSchema')

let app = {}
const USER = {
    username: 'Xuxinha',
    password: '123'
}

const USER_DB = {
    username: USER.username.toLowerCase(),
    password: '$2b$04$hGC3Oy9uS/auuUPLH3ahLOU5BnBD1ueiBe05hq2gih8MKVFCMJWq6'
}
describe('Auth test suite', function () {
    this.beforeAll(async () => {
        app = await api

        const connectionPostgres = await PostGres.connect()
        const model = await PostGres.defineModel(connectionPostgres, UsuarioSchema)
        const postgres = new Context(new PostGres(connectionPostgres, model))
        const result = await postgres.update(null, USER_DB, true)
    })

    it('deve obter um token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USER
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.deepEqual(statusCode, 200)
        assert.ok(dados.token.length > 10)
    })

    it('deve retornar não autorizado ao usar um login invalido', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'blaabla',
                password: '123'
            }
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.deepEqual(statusCode, 401)
        assert.deepEqual(dados.error, "Unauthorized")
    })

})
