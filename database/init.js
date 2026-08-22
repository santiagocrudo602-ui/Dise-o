const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const schemaPath = path.join(__dirname, 'schema.sql');
const seedPath = path.join(__dirname, 'seed.sql');

const dbExists = fs.existsSync(dbPath);

if (!dbExists) {
    console.log('Creando base de datos y tablas...');
    const db = new Database(dbPath);

    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema);

    console.log('Insertando datos iniciales (seed)...');
    const seed = fs.readFileSync(seedPath, 'utf8');
    db.exec(seed);

    console.log('Base de datos inicializada correctamente.');
    db.close();
} else {
    console.log('La base de datos ya existe. No se realizaron cambios.');
}
