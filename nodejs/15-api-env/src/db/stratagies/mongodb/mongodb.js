const ICrud = require('./../interfaces/interfaceCrud')
const Mongoose = require('mongoose')
const STATUS = {
    0: 'desconectado',
    1: 'conectado',
    2: 'conectando',
    3: 'disconectando'
}
    class MongoDB extends ICrud {
    constructor(connection, schema) {
        super()
        this._connection = connection
        this._schema = schema
    }

    async isConnected() {
        const state = STATUS[this._connection.readyState]
        if(state === 'conectado') return state;
        if(state !== 'conectando') return state;
        
        await new Promise(resolve => setTimeout(resolve, 1000))

        return STATUS[this._connection.readyState]
    }

    static connect() {
        Mongoose.connect(process.env.MONGODB_URL, { 
            useNewUrlParser: true 
        }, function (error) {
            if(!error) return;
            console.log('Falha na conexão', error)
        })
    
        const connection = Mongoose.connection
        
        connection.once('open', () => console.log('Banco de dados conectado!'))
        return connection
    }

    create(item) {
        return this._schema.create(item)
    }

    read(item, skip=0, limit=10) {
        return this._schema.find(item).skip(skip).limit(limit)
    }

    update(id, item) {
        return this._schema.updateOne({ _id: id}, {$set: item})
    }

    delete(id) {
        return this._schema.deleteOne({ _id: id })
    }
}

module.exports = MongoDB