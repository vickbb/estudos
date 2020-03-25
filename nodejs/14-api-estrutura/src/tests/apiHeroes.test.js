const assert = require('assert')
const api = require('./../api')
let app = {}
const MOCK_HEROI_CADASTRAR = {
    nome: 'Jasão',
    poder: 'Navegador'
}

const MOCK_HEROI_INICIAL = {
    nome: 'Elvis',
    poder: 'Rocking hips'
}

let MOCK_ID = ''
describe('Suite de testes API heroes', function () {
    this.beforeAll(async () => {
        app = await api
        const result = await app.inject({
            method: 'POST',
            url: '/herois',
            payload: JSON.stringify(MOCK_HEROI_INICIAL)
        })
        const dados = JSON.parse(result.payload)
        MOCK_ID = dados._id
    })

    it('listar /herois',  async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/herois'
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))
    })

    it('listar /herois - listar 5 registros', async () => {
        const TAMANHO_LIMITE = 5
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        assert.ok(dados.length === TAMANHO_LIMITE)
    })

    it('listar /herois - limit invalido', async () => {
        const TAMANHO_LIMITE = 'ABC'
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        })
        const errorResult = {
            "statusCode": 400,
            "error": "Bad Request",
            "message": "child \"limit\" fails because [\"limit\" must be a number]",
            "validation": {
                "source": "query",
                "keys": ["limit"]
            }
        }
        
        assert.deepEqual(result.statusCode, 400)
        assert.deepEqual(result.payload, JSON.stringify(errorResult))
        
    })
    
    it('listar /herois - filtrar um item', async () => {
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=10&nome=${MOCK_HEROI_INICIAL.nome}`
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.deepEqual(statusCode, 200)
        assert.deepEqual(dados[0].nome, MOCK_HEROI_INICIAL.nome)
    })

    it('cadastrar POST - /herois', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/herois',
            payload: MOCK_HEROI_CADASTRAR
        })

        const statusCode = result.statusCode
        const { message, _id } = JSON.parse(result.payload)
        assert.ok(statusCode === 200)
        assert.notStrictEqual(_id, undefined)
        assert.deepEqual(message, "Heroi cadastrado com sucesso!")
    })

    it('atualizar PATCH /herois/:id', async () => {
        const _id = MOCK_ID
        const expected = {
            poder: 'Guitarrista'
        }
        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${_id}`,
            payload: JSON.stringify(expected)
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        assert.ok(statusCode === 200)
        assert.deepEqual(dados.message, 'Heroi atualizado com sucesso!')
    })

    it('atualizar PATCH /herois/:id - ID incorreto', async () => {
        const _id = '5e735ba32ed5b909ccba2ea6'
        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${_id}`,
            payload: JSON.stringify({ poder: 'Guitarrista' })
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        const expected = {
                statusCode: 412,
                error: 'Precondition Failed',
                message: 'Não encontrado no banco'
        }
        assert.ok(statusCode === 412)
        assert.deepEqual(dados, expected)
    })

    it('remover DELETE /herois/:id', async () => {
        const result = await app.inject({
            method: 'DELETE',
            url: `/herois/${MOCK_ID}`
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepEqual(dados.message, 'Heroi removido com sucesso')
    })

    it('remover DELETE /herois/:id - ID incorreto', async () => {
        const _id = '5e735ba32ed5b909ccba2ea6'
        const result = await app.inject({
            method: 'DELETE',
            url: `/herois/${_id}`
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        const expected = {
            "statusCode":412,
            "error":"Precondition Failed",
            "message":"Não encontrado no banco"
        }
        assert.ok(statusCode === 412)
        assert.deepEqual(dados, expected)
    })

    it('remover DELETE /herois/:id - ID invalido', async () => {
        const _id = 'ID_INVALIDO'
        const result = await app.inject({
            method: 'DELETE',
            url: `/herois/${_id}`
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        const expected = {
            "error": 'Internal Server Error',
            "message": 'An internal server error occurred',
            "statusCode": 500
        }
        assert.ok(statusCode === 500)
        assert.deepEqual(dados, expected)
    })
})