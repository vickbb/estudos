const ContextStrategy = require('./db/stratagies/base/contextStrategy')
const MongoDB = require('./db/stratagies/mongodb')
const Postgres = require('./db/stratagies/postgres')

const contextMongo = new ContextStrategy(new MongoDB())
contextMongo.create()

const contextPostgres = new ContextStrategy(new Postgres())
contextPostgres.create()