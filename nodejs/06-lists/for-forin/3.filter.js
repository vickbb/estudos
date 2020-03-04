const { obterPessoas } = require('./service');

// const item = {
//     nome: 'Victor',
//     idade: 17
// }

// const { nome , idade } = item
// console.log(nome, idade)

Array.prototype.meuFilter = function (callback) {
    
    const lista = []
    
    for(index in this) {
        const item = this[index];
        const resultado = callback(item, index, this)
        if (!resultado) continue;
        lista.push(item)
    }
    return lista
}

async function main() {
    try {
        const { results } = await obterPessoas('a');

        // const familia = results.filter(function (item) {
        //     // por padrão retorn bool para informar se deve manter ou remover da lista
        //     const result = item.name.toLowerCase().indexOf('lars') !== -1
        //     return result;
        // })

        const familia = results.meuFilter((item, index, lista) => {
            console.log(`index: ${index}`, lista.length)
            return item.name.toLowerCase().indexOf('lars') !== -1
        })

        const names = familia.map((pessoa) => pessoa.name);
        console.log('Nome: ', names);
    } catch (error) {
        console.error('ERROR: ', error);
    }
}

main();