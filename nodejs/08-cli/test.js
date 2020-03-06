const {
    deepEqual,
    ok
} = require('assert')

const database = require('./database')

const DEFAULT_ITEM_CADASTRAR = {
    nome: 'Flash', 
    poder: 'Speed',
    id: 1
}

describe('Suite de manipulação de herois', () => {
    
    it('deve pesquisar um herois usando arquivos', async () => {
        const expected = DEFAULT_ITEM_CADASTRAR
        const [result] = await database.listar(expected.id)
        
        deepEqual(result, expected)
    })

    // it('deve cadastrar um heroi, usando arquivos', async () => {
    //     const expected = DEFAULT_ITEM_CADASTRAR
    //     //
    //     ok(null, expected)
    // })
})