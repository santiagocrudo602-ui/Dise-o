# Prompts de desarrollo — Magnet.is Portfolio

Pensados para pegar en orden en Claude Code (o Antigravity) en el mismo repo/sesión, uno por uno. Cada prompt asume que el anterior ya se aplicó. Están escritos para que el agente actúe con criterio de Analista de Sistemas Senior: no solo "que ande", sino que respete el modelo de datos y las reglas del Documento Funcional (Etapas 1 y 2).

Antes de arrancar: subí `magnet-portfolio.html` (el prototipo estático) al repo, va a ser el punto de partida del sitio público.

---

## Prompt 1 — Scaffold del proyecto

```
Actuá como un Analista de Sistemas Senior implementando un proyecto real a partir de una especificación funcional ya cerrada. No propongas cambios de alcance ni de stack: implementá exactamente lo que se pide.

Contexto del proyecto: "Magnet.is Portfolio", sitio web para una diseñadora de indumentaria independiente. Arquitectura MVC. Stack obligatorio: Node.js + Express + SQLite (better-sqlite3). Autenticación con key + JWT, 2FA opcional vía TOTP (Authenticator).

Tarea: creá el scaffold inicial del proyecto con esta estructura:

/src
  /config      -> conexión a SQLite, variables de entorno
  /models      -> acceso a datos (una clase/módulo por entidad)
  /controllers -> lógica de cada endpoint
  /routes      -> definición de rutas Express
  /middlewares -> auth (JWT), manejo de errores, validaciones
  /public      -> sitio público estático (acá va magnet-portfolio.html)
  /admin       -> frontend del panel /admin (a construir en un prompt posterior)
/database
  schema.sql
  seed.sql

Package.json con dependencias: express, better-sqlite3, bcrypt, jsonwebtoken, dotenv, multer, speakeasy, qrcode, cors. Agregá scripts "dev" (con nodemon) y "start".

Creá un .env.example con: PORT, JWT_SECRET, ADMIN_KEY_HASH.

No implementes lógica de negocio todavía, solo el esqueleto y un servidor Express que levante y sirva /src/public en la raíz.
```

---

## Prompt 2 — Esquema de base de datos

```
Actuá como Analista de Sistemas Senior. Implementá el esquema SQLite en /database/schema.sql siguiendo exactamente este modelo de Entidad-Relación (ya validado en el Documento Funcional, no lo modifiques):

Administrador
- id INTEGER PK
- usuario TEXT
- password_hash TEXT       (hash de la key de acceso, con bcrypt)
- twofa_secret TEXT NULL
- twofa_habilitado INTEGER DEFAULT 0  (0/1)

Trabajo (relación: Administrador gestiona (1,N) Trabajo)
- id INTEGER PK
- titulo TEXT NOT NULL
- descripcion TEXT
- imagen_url TEXT NOT NULL
- categoria TEXT
- orden INTEGER DEFAULT 0
- fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP
- administrador_id INTEGER FK -> Administrador(id)

PerfilInfo (relación: Administrador gestiona (1,1) PerfilInfo — registro único)
- id INTEGER PK
- texto_sobre_mi TEXT
- foto_perfil_url TEXT
- administrador_id INTEGER FK -> Administrador(id)

Contacto (relación: PerfilInfo incluye (1,N) Contacto)
- id INTEGER PK
- tipo TEXT CHECK(tipo IN ('Instagram','WhatsApp','Email'))
- valor TEXT NOT NULL
- visible INTEGER DEFAULT 1  (0/1)
- perfil_info_id INTEGER FK -> PerfilInfo(id)

Agregá los FOREIGN KEY constraints correspondientes. Después armá /database/seed.sql que inserte:
- Un Administrador con usuario "magnet" y password_hash de la key "magnet2026" (generá el hash real con bcrypt, no lo dejes en texto plano).
- Un PerfilInfo con un texto de ejemplo de "Sobre mí" (podés usar el contenido de la sección "personalidad" del archivo magnet-portfolio.html si está disponible en el repo).
- 3 Contacto: Instagram, WhatsApp, Email, todos visible=1.
- Los 6 Trabajo que ya están hardcodeados en la sección .coleccion de magnet-portfolio.html (Campera Voltaje, Top Fricción, Pantalón Static, Chaleco Nocturno, Conjunto Magnetic, Buzo Static) — usá sus nombres y "materiales" actuales como titulo/descripcion, e imagen_url = "" por ahora (se reemplaza después por fotos reales).

Creá también un script /database/init.js que ejecute schema.sql y seed.sql contra un archivo local database.sqlite si no existe todavía.
```

---

## Prompt 3 — Autenticación (Key + JWT + 2FA opcional)

```
Actuá como Analista de Sistemas Senior. Implementá el caso de uso "Iniciar sesión (con validación de credenciales)" del Documento Funcional, con este flujo exacto:

1. POST /api/auth/login recibe { key }. Busca al Administrador, compara la key contra password_hash con bcrypt.
   - Si no coincide: 401 con mensaje de error genérico (no revelar si el usuario existe).
   - Si coincide y twofa_habilitado = 0: devolver un JWT de sesión completa (payload: { adminId }, expiración 2 horas).
   - Si coincide y twofa_habilitado = 1: devolver un JWT "parcial" de corta duración (5 minutos, claim { adminId, stage: "pending_2fa" }) en vez del de sesión completa, indicando que falta el segundo factor.

2. POST /api/auth/verify-2fa recibe { token_parcial, codigo }. Valida el JWT parcial, y con la librería speakeasy verifica el código TOTP contra twofa_secret del Administrador.
   - Si es válido: devuelve el JWT de sesión completa.
   - Si no: 401, permitir reintentar (no bloquear cuenta en este caso, no está en el alcance).

3. Middleware requireAuth: valida el JWT de sesión completa en el header Authorization, rechaza si es un JWT parcial (stage "pending_2fa") o si no es válido/expiró.

4. Endpoints para gestionar el 2FA (requieren requireAuth, y ambos corresponden al caso de uso "Configurar 2FA"):
   - POST /api/auth/2fa/setup: genera un secret con speakeasy.generateSecret, lo guarda temporalmente (no lo actives todavía), devuelve el otpauth_url convertido a QR (con la librería qrcode) en base64 para que el frontend lo muestre.
   - POST /api/auth/2fa/enable: recibe { codigo }, valida contra el secret generado en el paso anterior, y si es correcto, guarda twofa_secret y pone twofa_habilitado = 1.
   - POST /api/auth/2fa/disable: pone twofa_habilitado = 0 y borra twofa_secret.

No implementes recuperación de contraseña ni bloqueo por intentos fallidos — están fuera de alcance según el Documento Funcional.
```

---

## Prompt 4 — API pública (lectura)

```
Actuá como Analista de Sistemas Senior. Implementá los endpoints públicos (sin autenticación) que cubren los casos de uso del Visitante:

GET /api/trabajos
  -> Devuelve todos los Trabajo, ordenados por el campo "orden". Este endpoint cubre "Ver portfolio (catálogo público)".

GET /api/trabajos/:id
  -> Devuelve un Trabajo por id con todos sus campos. Si no existe, 404 con mensaje "diseño no disponible" (así lo especifica el flujo alternativo del caso de uso "Ver vista previa detallada de un diseño"). Este endpoint alimenta esa vista previa.

GET /api/perfil
  -> Devuelve el registro único de PerfilInfo (texto_sobre_mi, foto_perfil_url). Cubre "Ver sección Sobre mí".

GET /api/contactos
  -> Devuelve solo los Contacto con visible = 1. Cubre el caso de uso "Contactar". Los que tengan visible = 0 nunca deben llegar a este endpoint, ni siquiera ocultos en el JSON.

Ningún endpoint de este prompt requiere el middleware requireAuth.
```

---

## Prompt 5 — Conectar el sitio público al API

```
Actuá como Analista de Sistemas Senior trabajando sobre el archivo /src/public/magnet-portfolio.html ya existente en el repo. No rediseñes el HTML/CSS — mantené la identidad visual actual (negro, rojo, violeta, azul, tipografía existente). Solo agregá JavaScript para que el sitio deje de tener datos hardcodeados y consuma el API real:

1. La sección .coleccion debe pedir GET /api/trabajos al cargar la página y generar dinámicamente las .piece-card con los datos reales (titulo, descripcion como el <span> dentro de .piece-tag). Si imagen_url no está vacío, usalo como background-image en vez del gradiente; si está vacío, mantené el gradiente placeholder actual.

2. Al hacer click en una .piece-card, abrir un modal (creá uno nuevo, consistente con la estética dark del sitio) que llame a GET /api/trabajos/:id y muestre título, descripción completa, categoría — este es el caso de uso "Ver vista previa detallada de un diseño". Si el fetch devuelve 404, mostrar en el modal el mensaje "Este diseño ya no está disponible".

3. La sección #personalidad (o donde esté el texto "Sobre mí") debe reemplazar su contenido estático por el resultado de GET /api/perfil.

4. La sección #contacto debe pedir GET /api/contactos y generar los botones de WhatsApp/Instagram/Email dinámicamente según lo que venga marcado como visible. Si algún tipo no está presente en la respuesta, no mostrar ese botón.

No toques el CSS existente salvo lo mínimo necesario para el modal nuevo.
```

---

## Prompt 6 — API de administración (ABM de diseños)

```
Actuá como Analista de Sistemas Senior. Implementá los endpoints del panel /admin para gestionar Trabajo, todos protegidos con el middleware requireAuth. Estos cubren los casos de uso "Crear diseño (alta)", "Modificar diseño" y "Eliminar diseño (baja)" del Documento Funcional:

GET /api/admin/trabajos
  -> Devuelve TODOS los Trabajo (a diferencia del endpoint público, sin filtrar), para que el panel los liste.

POST /api/admin/trabajos
  -> Body: { titulo, descripcion, imagen_url, categoria, orden }. Validar que titulo e imagen_url estén presentes y no vacíos (son obligatorios según el Documento Funcional) — si falta alguno, 400 con el detalle de qué campo falta. Inserta el registro con administrador_id del usuario autenticado.

PUT /api/admin/trabajos/:id
  -> Mismo body y mismas validaciones que el alta. 404 si el id no existe.

DELETE /api/admin/trabajos/:id
  -> Elimina el registro. 404 si no existe. No implementes soft-delete: el Documento Funcional especifica baja física, con confirmación resuelta del lado del frontend (no acá).

Manejá la subida de imagen_url con multer: agregá también POST /api/admin/upload que reciba un archivo (campo "imagen"), lo guarde en /src/public/uploads/, valide que sea jpg o png (si no, 400 "Formato de imagen no soportado", tal como dice el flujo alternativo del caso de uso), y devuelva la URL pública para usar como imagen_url.
```

---

## Prompt 7 — API de administración (perfil, contacto y 2FA)

```
Actuá como Analista de Sistemas Senior. Implementá, todos protegidos con requireAuth:

PUT /api/admin/perfil
  -> Body: { texto_sobre_mi, foto_perfil_url }. Actualiza el único registro de PerfilInfo existente (no crear uno nuevo — el Documento Funcional aclara que el Alta de PerfilInfo "no aplica", es un registro único).

GET /api/admin/contactos
  -> Devuelve TODOS los Contacto (visibles y no visibles), a diferencia del endpoint público.

POST /api/admin/contactos
  -> Body: { tipo, valor, visible }. tipo debe ser uno de 'Instagram' | 'WhatsApp' | 'Email'. Cubre el Alta de Contacto.

PUT /api/admin/contactos/:id
  -> Actualiza valor y/o visible de un contacto existente. Cubre Modificación (incluye el caso particular de "ocultar sin borrar" que menciona el Documento Funcional).

DELETE /api/admin/contactos/:id
  -> Elimina el contacto. Cubre la Baja.

No agregues validación de formato de teléfono/email/usuario de Instagram — no está especificado en el Documento Funcional, dejalo para una iteración futura si Santiago lo pide.
```

---

## Prompt 8 — Frontend del panel /admin

```
Actuá como Analista de Sistemas Senior. Construí el frontend de /src/admin como una SPA simple (HTML + JS vanilla, sin framework — mantené el proyecto liviano igual que el resto del stack). Reusá la paleta oscura del sitio público (negro, rojo, violeta, azul) para que se sienta parte del mismo producto, pero es una interfaz de trabajo, no necesita ser tan visual como el sitio público.

Pantallas:

1. /admin/login.html — formulario de key. Si el login devuelve stage "pending_2fa", mostrar un segundo input para el código de Authenticator y llamar a /api/auth/verify-2fa. Guardar el JWT resultante en memoria (no localStorage, no está permitido en este contexto — usá una variable de módulo o sessionStorage si preferís algo que sobreviva un refresh).

2. /admin/dashboard.html — tabla con todos los Trabajo (GET /api/admin/trabajos), con botones Editar y Eliminar por fila (Eliminar pide confirmación con un simple confirm() o modal antes de llamar al DELETE), y un botón "Nuevo diseño" que abre un formulario (título, descripción, categoría, orden, y un input file que sube la imagen contra /api/admin/upload antes de guardar el Trabajo).

3. /admin/perfil.html — formulario para editar texto_sobre_mi y foto_perfil_url (PUT /api/admin/perfil), y una sección aparte para gestionar Contacto: listar los existentes con toggle de visible, botón eliminar, y un mini formulario para agregar uno nuevo.

4. /admin/seguridad.html — pantalla de "Configurar 2FA": si no está habilitado, botón "Activar 2FA" que llama a /api/auth/2fa/setup, muestra el QR devuelto, y un input para el primer código que confirma con /api/auth/2fa/enable. Si ya está habilitado, mostrar un botón "Desactivar 2FA".

Todas las pantallas excepto login.html deben chequear que hay un JWT válido en memoria antes de renderizar, y redirigir a login.html si no lo hay.
```

---

## Prompt 9 — Seed de datos reales y checklist final

```
Actuá como Analista de Sistemas Senior haciendo el control de calidad final antes de la demo. Repasá el proyecto completo contra este checklist y corregí lo que no cumpla, sin agregar funcionalidades nuevas fuera de este alcance:

- [ ] El panel /admin es inaccesible sin JWT válido (probar a mano pegando una URL de /admin sin loguearse).
- [ ] Login con key incorrecta devuelve 401 y no filtra información sobre si el usuario existe.
- [ ] Con 2FA activado, el login en dos pasos funciona (key -> código) y el JWT parcial no sirve para llamar a ningún endpoint de /api/admin.
- [ ] Crear un diseño sin título o sin imagen devuelve 400 y el formulario del admin lo señala.
- [ ] Eliminar un diseño desde el admin lo hace desaparecer también del catálogo público sin refrescar caché rota.
- [ ] Ocultar un contacto (visible=0) hace que deje de aparecer en el sitio público, sin borrarlo de la base.
- [ ] La vista previa detallada de un diseño eliminado muestra el mensaje de "diseño no disponible" en vez de romper el frontend.
- [ ] El archivo .env real (con el JWT_SECRET y la key de administrador) NO está commiteado — confirmá que está en .gitignore.

Al final, generá un archivo README.md corto con: cómo instalar dependencias, cómo correr database/init.js, cómo levantar el server en modo dev, y la key de administrador de prueba (la del seed, no la real).
```

---

### Notas para vos, Santiago

- El orden importa: cada prompt da por hecho que el anterior ya se aplicó y compiló sin errores. Si alguno falla, resolvé el error antes de pasar al siguiente.
- Las credenciales reales de SMTP no aplican acá (el 2FA es TOTP/Authenticator, no por mail) — no hay nada que diferir a Etapa 4 en ese sentido, a diferencia de Festival Folklore.
- Cuando tengas fotos reales de las prendas, solo hace falta cargarlas desde el panel admin (Prompt 6/8) — no hay que tocar código.
- Si en algún punto el agente propone cambiar el modelo de datos o el stack, cortalo ahí: la especificación ya está cerrada en el Documento Funcional, cualquier cambio de fondo debería pasar primero por una actualización de ese documento.
