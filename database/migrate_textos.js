const db = require('../src/config/db');

const defaultTexts = {
    hero_eyebrow: 'ADN de marca — moda urbana',
    hero_title: 'Un imán<br>para los que<br>se atreven',
    hero_sub: '[Nombre de la diseñadora] — MAGNET. Diseño desestructurado, artesanal y sin pedir permiso. Cada pieza está hecha para atraer, no para pasar desapercibida.',
    hero_meta_1_title: 'Estilo',
    hero_meta_1_text: 'Rockero · Sensual · Urbano',
    hero_meta_2_title: 'Cultura',
    hero_meta_2_text: 'Vida nocturna, arte y música',
    hero_meta_3_title: 'Origen',
    hero_meta_3_text: 'Hecho a mano, pieza por pieza',
    pers_eyebrow: 'Personalidad',
    pers_title: 'Desestructurada.<br>Rebelde. Arriesgada.',
    pers_quote: '"Cada puntada tiene una intención. Cada pieza, una actitud."',
    val_title: 'Valores',
    val_note: 'Originalidad, libertad y distorsión — los tres ejes que guían cada diseño de la marca.',
    val_1_num: '01 / ORIGINALIDAD',
    val_1_title: 'Nada de moldes ajenos',
    val_1_text: 'Cada estampa y cada corte se piensa desde cero. Innovar en el arte y en la industria es el punto de partida, no la excepción.',
    val_2_num: '02 / LIBERTAD',
    val_2_title: 'Ropa que no ata',
    val_2_text: 'Siluetas amplias, cinturas regulables, telas que se mueven. La comodidad no se negocia, se fusiona con el estilo.',
    val_3_num: '03 / DISTORSIÓN',
    val_3_title: 'La belleza del caos',
    val_3_text: 'Lavados intensos, costuras expuestas, roturas estratégicas. El desgaste es parte de la historia de la prenda.',
    proceso_title: 'Cómo nace cada pieza',
    proc_1_num: '01',
    proc_1_title: 'Boceto & actitud',
    proc_1_text: 'No empezamos con un molde, empezamos con una idea. Una silueta, una canción o un sentimiento de rebeldía.',
    proc_2_num: '02',
    proc_2_title: 'Selección de material',
    proc_2_text: 'Buscamos texturas con peso. Denims rígidos, cueros, algodones pesados y avíos metálicos de alta calidad.',
    proc_3_num: '03',
    proc_3_title: 'Patronaje y corte',
    proc_3_text: 'Moldería experimental. Desarmamos lo clásico para armar algo con mucho más carácter y movimiento.',
    proc_4_num: '04',
    proc_4_title: 'Intervención final',
    proc_4_text: 'El toque final es manual. Roturas, tachas puestas a mano o tinturas especiales que hacen que la pieza sea única.',
    contacto_eyebrow: 'Te leo',
    contacto_title: 'Sumate a la manada',
    contacto_text: 'Para consultas, pedidos a medida o simplemente conocer más de la marca, escribime por WhatsApp o seguí el proceso día a día en Instagram.',
    footer_text: 'MAGNET. Prototipo de presentación.'
};

try {
    db.prepare('CREATE TABLE IF NOT EXISTS ConfiguracionTextos (clave TEXT PRIMARY KEY, valor TEXT);').run();
    
    const stmt = db.prepare('INSERT OR IGNORE INTO ConfiguracionTextos (clave, valor) VALUES (?, ?)');
    const updateStmt = db.prepare('UPDATE ConfiguracionTextos SET valor = ? WHERE clave = ? AND valor IS NULL'); // Sólo por si acaso
    
    let insertados = 0;
    for (const [key, value] of Object.entries(defaultTexts)) {
        const info = stmt.run(key, value);
        if (info.changes > 0) insertados++;
    }
    
    console.log(`Migración completada. ${insertados} textos iniciales insertados.`);
} catch (e) {
    console.error('Error migrando textos:', e);
}
