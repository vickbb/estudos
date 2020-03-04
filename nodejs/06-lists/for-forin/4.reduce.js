const { obterPessoas } = require('./service');

Array.prototype.meuReduce = function (callback, valorInicial) {
    let valorFinal = typeof valorInicial !== undefined ? valorInicial : this[0]

    for(let i = 0; i<=this.length - 1; i++){
        valorFinal = callback(valorFinal, this[i], this)
    }
    return valorFinal
}

async function main(){
    try {
        const { results } = await obterPessoas('a');
        const pesos = results.map(item => parseInt(item.height))
        
        console.log('pesos', pesos)

        // const total = pesos.reduce((anterior, proximo) => {
        //     return anterior + proximo
        // })

        const minhaLista = [
            ['Victor', 'jose'],
            ['jucelino', 'kubi']
        ]

        const total = minhaLista.meuReduce((anterior, proximo) => {
            return anterior.concat(proximo)
        }, [])
        .join(',')

        console.log('total', total)

    } catch (error) {
        console.error('ERROR: ', error);
    }
}

main();