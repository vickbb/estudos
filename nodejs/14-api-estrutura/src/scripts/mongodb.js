// docker ps
// docker exec -it 200bb82863cb mongo -u victorbarreiros -p root --authenticationDatabase herois
 
// database
show dbs

// mudando o contexto para uma base
use herois

//mostrar tabelas (colecoes)
show collections

db.herois.insert({
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
})

db.herois.find()
db.herois.find.prety()

for(let i=0; i<=10000; i++) {
    db.herois.insert({
        nome: `Clone-${i}`,
        poder: 'Velocidade',
        dataNascimento: '1998-01-01'
    })
}

db.herois.count()
db.herois.findOne()
db.herois.find().limit(1000).sort({ nome: -1 })
db.herois.find({}, {nome: 1, _id: 0})

//create
db.herois.insert({
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
})
//read
db.herois.find()
db.herois.find({nome: 'Flash'})
//update
db.herois.update({_id: ObjectId("5e6ea1ba538323f796a62fd4")},
{nome: 'Mulher Gato'})

db.herois.update({_id: ObjectId("5e6ea261538323f796a633bc")},
                 {$set: {nome: 'Lanterna Verde'}})
db.herois.find({_id: ObjectId("5e6ea261538323f796a633bc")})
//delete
db.herois.remove({_id: ObjectId("5e6ea1ba538323f796a62fd4")})