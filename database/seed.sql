INSERT INTO Administrador (usuario, password_hash)
VALUES ('magnet', '$2b$10$mLtOAtM6mpDiT.DktFLDPeJMirPefjzdtH3H/0LRaKot.lF5pNP4G');

INSERT INTO PerfilInfo (texto_sobre_mi, foto_perfil_url, administrador_id)
VALUES (
    'Nuestra visión es redefinir los límites entre lo casual y lo provocativo. Cada pieza es una declaración de intenciones diseñada para empoderar a quien la lleva.',
    '',
    1
);

INSERT INTO Contacto (tipo, valor, visible, perfil_info_id) VALUES ('Instagram', '@magnet.is', 1, 1);
INSERT INTO Contacto (tipo, valor, visible, perfil_info_id) VALUES ('WhatsApp', '+54 9 11 1234-5678', 1, 1);
INSERT INTO Contacto (tipo, valor, visible, perfil_info_id) VALUES ('Email', 'hola@magnet.is', 1, 1);

INSERT INTO Trabajo (titulo, descripcion, imagen_url, categoria, orden, administrador_id)
VALUES ('Campera Voltaje', 'Eco-cuero, tachas y un corte que no pide permiso.', '', 'Abrigos', 1, 1);
INSERT INTO Trabajo (titulo, descripcion, imagen_url, categoria, orden, administrador_id)
VALUES ('Top Fricción', 'Transparencias estratégicas y asimetría total.', '', 'Tops', 2, 1);
INSERT INTO Trabajo (titulo, descripcion, imagen_url, categoria, orden, administrador_id)
VALUES ('Pantalón Static', 'Cargo reinventado con cintas y herrajes.', '', 'Pantalones', 3, 1);
INSERT INTO Trabajo (titulo, descripcion, imagen_url, categoria, orden, administrador_id)
VALUES ('Chaleco Nocturno', 'Denim intervenido, cadenas y actitud dark.', '', 'Abrigos', 4, 1);
INSERT INTO Trabajo (titulo, descripcion, imagen_url, categoria, orden, administrador_id)
VALUES ('Conjunto Magnetic', 'Dos piezas en rojo sangre que paralizan la pista.', '', 'Conjuntos', 5, 1);
INSERT INTO Trabajo (titulo, descripcion, imagen_url, categoria, orden, administrador_id)
VALUES ('Buzo Static', 'Oversize, oscuro y con detalles reflectivos.', '', 'Abrigos', 6, 1);
