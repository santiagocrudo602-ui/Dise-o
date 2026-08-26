const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src/admin');

const files = ['colecciones.html', 'dashboard.html', 'login.html', 'perfil.html', 'seguridad.html', 'textos.html'];

files.forEach(f => {
    const p = path.join(dir, f);
    let c = fs.readFileSync(p, 'utf8');
    
    // Replace the specific inline styled link with a clean class
    const oldLink = '<a href="/" style="color:var(--muted); font-size:12px; margin-top:-35px; margin-bottom:15px; background:none; padding:0; display:inline-block;">← Volver al sitio</a>';
    const newLink = '<a href="/" class="back-link">← Volver al sitio</a>';
    
    if (c.includes(oldLink)) {
        c = c.replace(oldLink, newLink);
        fs.writeFileSync(p, c);
        console.log('Updated inline style in ' + f);
    }
});
