const fs = require('fs');
const path = require('path');
const db = require('./src/config/db');

const mediaDir = path.join(__dirname, '../Media');
const uploadsDir = path.join(__dirname, 'src/public/uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

function copyFile(src, destName) {
    if (fs.existsSync(src)) {
        const destPath = path.join(uploadsDir, destName);
        fs.copyFileSync(src, destPath);
        return `/uploads/${destName}`;
    }
    return '';
}

// 1. Dark Revival
const drId = db.prepare('INSERT INTO Coleccion (nombre, descripcion, imagen_inspiracion_url, orden) VALUES (?, ?, ?, ?)').run('Dark Revival', 'Colección inspirada en el caos, la distorsión y el lado oscuro del arte.', copyFile(path.join(mediaDir, 'DarkRevivalCollection', 'insipiracion.png'), 'dr_inspiracion.png'), 1).lastInsertRowid;

for(let i=1; i<=5; i++) {
    const imgUrl = copyFile(path.join(mediaDir, 'DarkRevivalCollection', `diseño${i}.png`), `dr_diseno${i}.png`);
    if(imgUrl) {
        db.prepare('INSERT INTO Trabajo (titulo, imagen_url, coleccion_id, orden) VALUES (?, ?, ?, ?)').run(`Dark Revival #${i}`, imgUrl, drId, i);
    }
}

// 2. Mapa Mental
const mmId = db.prepare('INSERT INTO Coleccion (nombre, descripcion, imagen_inspiracion_url, orden) VALUES (?, ?, ?, ?)').run('Mapa Mental', 'Conceptos desestructurados materializados en prendas.', copyFile(path.join(mediaDir, 'MapaMentalEsquema', 'inspiracion.png'), 'mm_inspiracion.png'), 2).lastInsertRowid;

for(let i=1; i<=7; i++) {
    const imgUrl = copyFile(path.join(mediaDir, 'MapaMentalEsquema', 'Materializados', `diseño${i}.png`), `mm_diseno${i}.png`);
    if(imgUrl) {
        db.prepare('INSERT INTO Trabajo (titulo, imagen_url, coleccion_id, orden) VALUES (?, ?, ?, ?)').run(`Mapa Mental #${i}`, imgUrl, mmId, i);
    }
}

// 3. Tipologia Conceptual
const tcId = db.prepare('INSERT INTO Coleccion (nombre, descripcion, imagen_inspiracion_url, orden) VALUES (?, ?, ?, ?)').run('Tipología Conceptual', 'Estudios de morfología y estructura textil.', copyFile(path.join(mediaDir, 'Tipologia Conceptual', 'DiseñoPrincipal.png'), 'tc_inspiracion.png'), 3).lastInsertRowid;

const tcVistas = ['vista1.png', 'vista2.png', 'vista3.png', 'vistageneral.png'];
tcVistas.forEach((v, i) => {
    const imgUrl = copyFile(path.join(mediaDir, 'Tipologia Conceptual', v), `tc_${v}`);
    if(imgUrl) {
        db.prepare('INSERT INTO Trabajo (titulo, imagen_url, coleccion_id, orden) VALUES (?, ?, ?, ?)').run(`Tipología - ${v.replace('.png','')}`, imgUrl, tcId, i+1);
    }
});

console.log('Migración completada!');
