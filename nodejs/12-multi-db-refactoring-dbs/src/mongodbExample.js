const Mongoose = require('mongoose')
Mongoose.connect('mongodb://victorbarreiros:root@localhost:27017/herois', 
    { useNewUrlParser: true }, (error) => {
        if(!error) return;
        console.log('Falha na conexão', error)
    })

const connection = Mongoose.connection

connection.once('open', () => console.log('Database conectada'))
// setTimeout(() => {
    //     console.log('state', state)
    // const state = connection.readyState
// }, 1000);
/**
 * 0: desconectado
 * 1: conectado
 * 2: conectando
 * 3: disconectando
 */

 const heroiSchema = new Mongoose.Schema({
     nome: {
         type: String,
         required: true
     },
     poder: {
         type: String,
         required: true
     },
     insertedAt: {
         type: Date,
         default: new Date()
     }
 })
 const model = Mongoose.model('herois', heroiSchema)

 async function main() {
     const resultCadastrar = await model.create({
         nome: 'Batman',
         poder: 'Dinheiro'
     })
     console.log('result cadastrar', resultCadastrar)

     const listItens = await model.find()
     console.log('itens', listItens)
 }
 main()