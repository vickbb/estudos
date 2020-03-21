// npm i hapi
const Hapi = require('hapi')
const Context = require('./db/stratagies/base/contextStrategy')
const MongoDb = require('./db/stratagies/mongodb/mongodb')
const HeroiSchema = require('./db/stratagies/mongodb/schemas/heroisSchema')
const HeroRoute = require('./routes/heroRoutes')

const app = new Hapi.Server({
    port: 5000
})

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    const connection = MongoDb.connect()
    const context = new Context(new MongoDb(connection, HeroiSchema))

    console.log('Olá mundo')
    app.route([
        ...mapRoutes(new HeroRoute(context), HeroRoute.methods())
    ])

    await app.start()
    console.log(`Servidor online
    Caminho: ${app.info.uri}
    Endereço:${app.info.address}
    Porta: ${app.info.port}
    `)

    return app
}

module.exports = main()