const getToken = () => localStorage.getItem('jwt');
const setToken = (t) => localStorage.setItem('jwt', t);
const logout = () => { localStorage.removeItem('jwt'); window.location.href = '/admin/login.html'; };

const checkAuth = () => {
    if (!getToken() && !window.location.pathname.includes('login.html')) {
        window.location.href = '/admin/login.html';
    }
};

const apiFetch = async (url, options = {}) => {
    const headers = { 'Authorization': `Bearer ${getToken()}` };
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) { logout(); }
    return res;
};
checkAuth();
