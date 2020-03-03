/*
    0 - Obter um usuario
    1 - Obter o numero de telefone a partir do id
    2 - Obter o endereco do usuario pelo id
*/
// importar modulo interno do nodejs

const util = require('util')
const obterEnderecoAsync = util.promisify(obterEndereco)

function obterUsuario(){
    //  quando algo inesperado acontecer -> reject ERRO
    //  quando sucesso -> Resolve
    return new Promise(function resolvePromise(resolve, reject) {
        setTimeout(function () {
            // return reject(new Error('Deu ruim de verdade!'))
            return resolve({
                id: 1,
                nome: 'Joé',
                dataNasc: new Date()
            })
        }, 1000)
    })
}

function obterTelefone(idUsuario){
    return new Promise(function resolverPromise(resolve, reject) {
        setTimeout( ()  => {
            return resolve ({
                telefone: '123123123132',
                ddd: '12'
            })
        }, 2000);
    })
}

function obterEndereco(idUsuario, callback){
    setTimeout( () => {
        return callback (null, {
            rua: 'Jacinto pinto',
            numero: '198'
        })
    }, 2000);
}

function resolverUsuario(erro, usuario) {
    console.log('usuario', usuario)
}

const usuarioPromise = obterUsuario();
// para manipular o sucesso usamos a função .then
// para manipular erros, usamos o .catch
//  usuario -> telefone -> telefone
usuarioPromise
    .then(function (usuario){
        return obterTelefone(usuario.id)
        .then(function resolverTelefone(result){
            return {
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome
                },
                telefone: result
            }
        })
    })
    .then(function (resultado) {
        const endereco = obterEnderecoAsync(resultado.usuario.id)
        return endereco.then(function resolverEndereco(result) {
            return {
                usuario: resultado.usuario,
                telefone: resultado.telefone,
                endereco: result
            }
        })
    })
    .then(function (resultado) {
    console.log(`
        Nome: ${resultado.usuario.nome}
        Endereço: ${resultado.endereco.rua}, ${resultado.endereco.numero}
        Telefone: (${resultado.telefone.ddd}) ${resultado.telefone.telefone}
    `)
    })
    .catch(function (error) {
        console.error('Error: ', error)
    })