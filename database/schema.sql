CREATE TABLE IF NOT EXISTS Administrador (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    twofa_secret TEXT,
    twofa_habilitado INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS Trabajo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    imagen_url TEXT NOT NULL,
    categoria TEXT,
    orden INTEGER DEFAULT 0,
    fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP,
    administrador_id INTEGER,
    FOREIGN KEY(administrador_id) REFERENCES Administrador(id)
);

CREATE TABLE IF NOT EXISTS PerfilInfo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    texto_sobre_mi TEXT,
    foto_perfil_url TEXT,
    administrador_id INTEGER UNIQUE,
    FOREIGN KEY(administrador_id) REFERENCES Administrador(id)
);

CREATE TABLE IF NOT EXISTS Contacto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT CHECK(tipo IN ('Instagram','WhatsApp','Email')),
    valor TEXT NOT NULL,
    visible INTEGER DEFAULT 1,
    perfil_info_id INTEGER,
    FOREIGN KEY(perfil_info_id) REFERENCES PerfilInfo(id)
);

CREATE TABLE IF NOT EXISTS ConfiguracionTextos (
    clave TEXT PRIMARY KEY,
    valor TEXT
);
