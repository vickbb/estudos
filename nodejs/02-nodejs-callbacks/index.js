/*
    0 - Obter um usuario
    1 - Obter o numero de telefone a partir do id
    2 - Obter o endereco do usuario pelo id
*/

function obterUsuario(callback){
    setTimeout(function () {
        return callback(null, {
            id: 1,
            nome: 'Joé',
            dataNasc: new Date()
        })
    }, 1000)
}

function obterTelefone(idUsuario, callback){
    setTimeout( ()  => {
        return callback (null, {
            telefone: '123123123132',
            ddd: '12'
        })
    }, 2000);
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

obterUsuario(function resolverUsuario(error, usuario){
    // null || "" || 0 === false
    if(error) {
        console.error('Não recuperou usuario', error)
        return;
    }
    obterTelefone(usuario.id, function resolverTelefone(error1, telefone){
        if(error1) {
            console.error('Não recuperou telefone', error)
            return;
        }
        obterEndereco(usuario.id, function resolverEndereco(error2, endereco){
            if(error2) {
                console.error('Não recuperou endereco', error)
                return;
            }
        console.log(`
            Nome: ${usuario.nome}
            Endereco: ${endereco.rua}, ${endereco.numero}
            Telefone: (${telefone.ddd}) ${telefone.telefone}
            `)
        })
    })
})
// const telefone = obterTelefone(usuario.id)


// console.log('telefone', telefone)
