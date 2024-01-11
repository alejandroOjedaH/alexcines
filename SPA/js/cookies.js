function setCookie(nombre, valor, expiracion) {
    var fechaExpiracion = new Date();
    fechaExpiracion.setTime(fechaExpiracion.getTime() + (expiracion * 24 * 60 * 60 * 1000));
    var expires = "expires=" + fechaExpiracion.toUTCString();
    document.cookie = nombre + "=" + valor + "; " + expires + "; path=/";
}

function getCookie(nombre) {
    var nombreCookie = nombre + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(nombreCookie) === 0) {
            return cookie.substring(nombreCookie.length, cookie.length);
        }
    }
    return "";
}

function updateCookie(nombre, nuevoValor, expiracion) {
    var valorActual = getCookie(nombre);
    if (valorActual !== "") {
        valorActual = nuevoValor;
        setCookie(nombre, valorActual, expiracion);
    } else {
    }
}