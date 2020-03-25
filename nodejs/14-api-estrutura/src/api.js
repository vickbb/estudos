// npm i hapi
// npm i vision inert hapi-swagger@9.1.3
// Project dependencies
const Context = require('./db/stratagies/base/contextStrategy')
const MongoDb = require('./db/stratagies/mongodb/mongodb')
const HeroiSchema = require('./db/stratagies/mongodb/schemas/heroisSchema')
const HeroRoute = require('./routes/heroRoutes')
// External dependencies
const Hapi = require('hapi')
const HapiSwagger = require('hapi-swagger')
const Vision = require('vision')
const Inert = require('inert')

const app = new Hapi.Server({
    port: 5000
})

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    const connection = MongoDb.connect()
    const context = new Context(new MongoDb(connection, HeroiSchema))
    
    const swaggerOptions = {
        info: {
            title: 'API Herois',
            version: 'v1.0'
        },
        lang: 'pt'
    }

    await app.register([
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ])

    app.route(
        mapRoutes(new HeroRoute(context), HeroRoute.methods())
    )

    await app.start()
    console.log(`Servidor online
    Caminho: ${app.info.uri}
    Endereço:${app.info.address}
    Porta: ${app.info.port}
    `)

    return app
}

module.exports = main()