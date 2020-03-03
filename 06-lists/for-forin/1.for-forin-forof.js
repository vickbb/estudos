const service = require('./service');

async function main() {
    try {
        const result = await service.obterPessoas('a')
        const names = []
        console.time('FOR');
        for(let i=0;i<=result.results.length -1; i++) {
            const pessoa = result.results[i];
            names.push(pessoa.name)
        }
        console.timeEnd('FOR');

        console.time('FOR IN');
        for(let i in result.results) {
            const pessoa = result.results[i];
            names.push(pessoa.name)
        }
        console.timeEnd('FOR IN');
        
        console.time('FOR OF')
        for(pessoa of result.results){
            names.push(pessoa.name)
        }
        console.timeEnd('FOR OF')
        
        console.log(`names`, names);

    } catch (error) {
        console.error('Internal Error: ', error)
    }
}

main();