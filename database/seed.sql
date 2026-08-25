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
VALUES ('Vestido Distorsión', 'Vestido gris oscuro con recortes materializado.', '/uploads/design_page_5.png', 'Vestidos', 1, 1);
INSERT INTO Trabajo (titulo, descripcion, imagen_url, categoria, orden, administrador_id)
VALUES ('Conjunto Asimétrico', 'Conjunto top y pantalón con cintas.', '/uploads/design_page_6.png', 'Conjuntos', 2, 1);
INSERT INTO Trabajo (titulo, descripcion, imagen_url, categoria, orden, administrador_id)
VALUES ('Top y Falda Dark', 'Diseño denim oscuro con herrajes.', '/uploads/design_page_7.png', 'Conjuntos', 3, 1);
INSERT INTO Trabajo (titulo, descripcion, imagen_url, categoria, orden, administrador_id)
VALUES ('Conjunto Nocturno', 'Corset con recortes y argollas, diseño exclusivo.', '/uploads/photo.jpeg', 'Tops', 4, 1);
INSERT INTO Trabajo (titulo, descripcion, imagen_url, categoria, orden, administrador_id)
VALUES ('Colección Yámanas', 'Pieles sintéticas y ecocuero inspirados en la herencia cultural.', '/uploads/yamana.jpg', 'Colección', 5, 1);
