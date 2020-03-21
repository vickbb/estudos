## POSTGRES
```bash
docker run --name postgres -e POSTGRES_USER=victorbarreiros -e POSTGRES_PASSWORD=root -e POSTGRES_DB=heroes -p 5432:5432 -d postgres

docker ps
docker exec -it postgres /bin/bash

docker run --name adminer -p 8080:8080 --link postgres:postgres -d adminer
```

## MONGODB
```bash
docker run --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=root -d mongo:4

docker run --name mongoclient -p 3000:3000 --link mongodb:mongodb -d mongoclient/mongoclient
```

-- Criando um usuario com permissão de leitura e escrita no mongo
```bash
docker exec -it mongodb mongo --host localhost -u admin -p root --authenticationDatabase admin --eval "db.getSiblingDB('herois').createUser({user: 'victorbarreiros', pwd: 'root', roles: [{role: 'readWrite', db: 'herois'}]})"
```