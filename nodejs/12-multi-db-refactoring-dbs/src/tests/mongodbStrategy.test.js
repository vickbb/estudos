const assert = require('assert')
const MongoDb = require('../db/stratagies/mongodb/mongodb')
const HeroiSchema = require('./../db/stratagies/mongodb/schemas/heroisSchema')
const Context = require('../db/stratagies/base/contextStrategy')

const MOCK_HEROI_CADASTRAR = {
    nome: 'Mulher Gato',
    poder: 'Garras'
}
const MOCK_HEROI_DEFAULT = {
    nome: `Homen Aranha-${Date.now()}`,
    poder: 'Teia'
}
const MOCK_HEROI_ATUALIZAR = {
    nome: `Pernalonga-${Date.now()}`,
    poder: 'Encheção de saco'
}
let MOCK_HEROI_ID = ''

let context = {}

describe('MongoDB Strategy', function() {
    this.beforeAll(async () => {
        const connection = MongoDb.connect()
        context = new Context(new MongoDb(connection, HeroiSchema))

        await context.create(MOCK_HEROI_DEFAULT)
        const result = await context.create(MOCK_HEROI_ATUALIZAR)
        MOCK_HEROI_ID = result._id 
    })

    it('MongoDB Verificar conexao', async () => {
        const result = await context.isConnected()
        const expected = 'conectado'

        assert.deepEqual(result, expected)
    })

    it('MongoDB cadastrar', async () => {
        const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR)
        assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR)
    })

    it('MongoDB listar', async () => {
        const [{nome, poder}] = await context.read({ nome: MOCK_HEROI_DEFAULT.nome })
        const result = { nome, poder }
        assert.deepEqual(result, MOCK_HEROI_DEFAULT)
    })

    it('MongoDB atualizar', async () => {
        const result = await context.update(MOCK_HEROI_ID, {
            nome: 'Joselito'
        })
        assert.deepEqual(result.nModified, 1)
    })

    it('MongoDB excluir', async () => {
        const result = await context.delete(MOCK_HEROI_ID)
        assert.deepEqual(result.n, 1)
    })
})
