const ICrud = require('./interfaces/interfaceCrud')
const Mongoose = require('mongoose')
const STATUS = {
    0: 'desconectado',
    1: 'conectado',
    2: 'conectando',
    3: 'disconectando'
}
    class MongoDB extends ICrud {
    constructor() {
        super()
        this._driver = null
        this._herois = null
    }

    async isConnected() {
        const state = STATUS[this._driver.readyState]
        if(state === 'conectado') return state;
        if(state !== 'conectando') return state;
        
        await new Promise(resolve => setTimeout(resolve, 1000))

        return STATUS[this._driver.readyState]
    }

    defineModel() {
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
        this._herois = Mongoose.model('herois', heroiSchema)
    }

    connect() {
        Mongoose.connect('mongodb://victorbarreiros:root@localhost:27017/herois', 
        { useNewUrlParser: true }, (error) => {
            if(!error) return;
            console.log('Falha na conexão', error)
        })
    
        const connection = Mongoose.connection
        
        this._driver = connection
        connection.once('open', () => console.log('Banco de dados conectado!'))
        this.defineModel()
    }

    create(item) {
        return this._herois.create(item)
    }

    read(item, skip=0, limit=10) {
        return this._herois.find(item).skip(skip).limit(limit)
    }

    update(id, item) {
        return this._herois.updateOne({ _id: id}, {$set: item})
    }

    delete(id) {
        return this._herois.deleteOne({ _id: id })
    }
}

module.exports = MongoDB