# Magnet.is Portfolio

Este es el repositorio del backend y panel de administración para el portfolio de Magnet.is. Provee una API RESTful pública para consumir los datos del portfolio y un panel de administración seguro para gestionar el contenido.

## 🚀 Características Principales (Features)

- **API Pública**: Endpoints para obtener los trabajos del portfolio, información de perfil, enlaces de contacto y textos de la interfaz.
- **Panel de Administración**: Interfaz privada para gestionar el contenido del portfolio.
- **Gestión de Proyectos (Trabajos)**: Crear, editar, eliminar y listar proyectos, incluyendo la subida de imágenes de los trabajos.
- **Gestión de Perfil y Contacto**: Modificar la biografía/información del perfil y los enlaces de contacto.
- **Textos Dinámicos**: Administrar los textos configurables del frontend (como títulos o descripciones) directamente desde el panel.
- **Subida de Archivos**: Integración para la subida local segura de imágenes (formato JPEG, PNG) para los proyectos.

## 🛠️ Stack Tecnológico

El proyecto está construido utilizando tecnologías modernas y ligeras:

- **Entorno de ejecución**: [Node.js](https://nodejs.org/)
- **Framework Web**: [Express.js](https://expressjs.com/) (API REST & Servidor de archivos estáticos)
- **Base de Datos**: [SQLite3](https://sqlite.org/) (usando la librería `better-sqlite3` para un alto rendimiento sin necesidad de un servidor de BD externo)
- **Frontend (Panel & Cliente)**: HTML5, Vanilla CSS, Vanilla JavaScript (servido de manera estática desde las carpetas `/public` y `/admin`).

## 🔒 Seguridad

La seguridad es una prioridad en la gestión de este proyecto:

- **Autenticación mediante JWT**: Uso de JSON Web Tokens (`jsonwebtoken`) para proteger de forma asíncrona las rutas del panel de administración (`/api/admin/*`).
- **Hashing de Contraseñas**: Encriptación segura de contraseñas de administrador utilizando `bcrypt`.
- **Autenticación Multifactor (MFA/2FA)**: Preparado con `speakeasy` y `qrcode` para proveer una capa extra de seguridad en el inicio de sesión.
- **Gestión de Sesiones Seguras**: Middleware de autenticación personalizado (`requireAuth`).
- **Seguridad en Entorno y CORS**: Configuración de variables de entorno mediante `dotenv` para mantener las claves seguras y manejo de recursos compartidos (`cors`).

## ⚙️ Instalación

1. Clona el repositorio e instala las dependencias:
   ```bash
   npm install
   ```

2. Configura las variables de entorno:
   Crea tu archivo `.env` en la raíz del proyecto copiando el contenido de `.env.example` y configurando tus propios secretos.

3. Inicializa la base de datos con los datos de prueba (seed):
   ```bash
   node database/init.js
   ```

## 🚀 Ejecución

Para iniciar el servidor en **modo desarrollo** (con recarga automática mediante `nodemon`):
```bash
npm run dev
```

Para iniciar el servidor en **producción**:
```bash
npm start
```
El servidor por defecto correrá en el puerto configurado o en `http://localhost:3000`.

## 🔑 Credenciales de prueba (Admin)

- **URL de administración**: [http://localhost:3000/admin/login.html](http://localhost:3000/admin/login.html)
- **Key de acceso (Contraseña)**: `magnet2026`

> **⚠️ Importante:** Por razones de seguridad, asegúrate de modificar las claves secretas del entorno y las credenciales de administrador al momento de realizar el despliegue a producción.
