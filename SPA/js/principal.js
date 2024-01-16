var cuerpo;
var logeoPag;
var principalPag;
var registro;
var paginas = [];

window.onload= ()=>{
    cuerpo = document.getElementsByTagName("body")[0];
    logeoPag = document.getElementById("login");
    principalPag = document.getElementById("principal");
    registro = document.getElementById("registro");
    ocultar();

    paginas.push(cargarPantallaLogin);
    paginas.push(cargarPantallaRegistro);
    paginas.push(cargarPantallaPrincipal);
    paginas.push(cargarPerilUsuario);

    if(getCookie("paginaActual") == ""){
        setCookie("paginaActual",null,1);
        paginas[0]();
    }else{
        paginas[getCookie("paginaActual")]();
    }
    if(getCookie("token") == ""){
        setCookie("token",null,1);
        paginas[0]();
    }
}

// Paginas
function cargarPantallaLogin(){
    ocultar();
    cuerpo.appendChild(logeoPag);
    const logeoBut = document.getElementById("logear");
    const regrisBut = document.getElementById("registrarboton");

    logeoBut.onclick = function(){
        const usuario = document.getElementById("usuario");
        const clave = document.getElementById("contrasenna");
        let datos ={
            usuario: usuario.value,
            password: clave.value
        }
        
        fetch("http://localhost/alexcines/api/api",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(datos)})
        .then(response => {
            if(!response.ok){
                console.error("Error Logeo");
            }else{
                return response.json();
            }
        })
        .then(esto =>{
            if(esto.split(":")[0] === "Bearer"){
                setCookie("token",esto.split(":")[1],1);
                cargarPantallaPrincipal();
            }
        });
    }
    regrisBut.onclick=function(){
        cargarPantallaRegistro();
    }
    
    mostrarPie();
    setCookie("paginaActual",0,1);
}

function cargarPantallaRegistro(){
    ocultar();
    cuerpo.appendChild(registro);
    const registrarBut = document.getElementById("registrar");
    const volverBut = document.getElementById("volver");

    volverBut.onclick = function(){
        mostrarSesion();
    }
    
    registrarBut.onclick = function(){
        const usuario = document.getElementById("usuario");
        const email = document.getElementById("email");
        const clave = document.getElementById("contrasenna");
        const reclave = document.getElementById("recontrasenna");

        let datos ={
            usuario: usuario.value,
            email: email.value,
            clave: clave.value,
            reclave: reclave.value
        }
        fetch("http://localhost/alexcines/api/api/registrar",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(datos)})
        .then(response => {
            if(!response.ok){
                console.error("Error al registrarse");
            }else{
                return response.json();
            }
        });
        mostrarSesion();
    }

    mostrarPie();
    setCookie("paginaActual",1,1);
}

function cargarPantallaPrincipal(){
    comprobarToken()
    .then(tokenValido => {
        ocultar();
        mostrarCabecera();
        cuerpo.appendChild(principalPag);
        mostrarPie();
        setCookie("paginaActual",2,1);
    });   
}

function cargarPerilUsuario(){
    comprobarToken()
    .then(tokenValido => {
        ocultar();
        mostrarCabecera();
        getPerfil();
        setCookie("paginaActual",3,1);
    });
}

//Segmentos
function mostrarCabecera(){
    let cabecera = document.createElement("div");
    let usuario = document.createElement("div");
    let logo =document.createElement("img");
    let admin = document.createElement("span");
    let perfil = document.createElement("span");
    let sesion =document.createElement("span");

    cabecera.id= "cabecera";
    cuerpo.appendChild(cabecera);

    logo.src="./img/logocines.png";
    logo.classList.add("icologo");
    logo.id = "logo";

    usuario.id="usuarioheader";

    admin.classList.add("elementoHeader");
    admin.classList.add("verde");
    perfil.classList.add("elementoHeader");
    perfil.classList.add("verde");
    perfil.innerText="Perfil";
    admin.innerText="admin";
    sesion.classList.add("elementoHeader");
    sesion.classList.add("amarillo");
    sesion.innerText="Cerrar Sesion";

    logo.onclick = ()=> {cargarPantallaPrincipal()};
    sesion.onclick = ()=> {mostrarSesion()};
    perfil.onclick = ()=> {cargarPerilUsuario()};
    admin.onclick = ()=> {cargarPantallaPrincipal()};

    cabecera.appendChild(logo);
    comprobarAdmin().then(isAdmin=>{
        if(isAdmin){
            usuario.appendChild(admin);
        }
    });
    usuario.appendChild(perfil);
    usuario.appendChild(sesion);
    cabecera.appendChild(usuario);
}

function mostrarPie(){
    let pie = document.createElement("div");
    pie.id = "piedepagina";

    cuerpo.appendChild(pie);
}

function getPerfil(){
    let datos ={
        usuario: usuarioToken()
    }
    fetch("http://localhost/alexcines/api/api/devolverDatos",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(datos)})
    .then(response => {
        if(!response.ok){
            console.error("Error cargando usuario");
            cargarPantallaLogin();
        }else{
            return response.json();
        }
    })
    .then(usuario =>{
        mostrarPerfil(usuario);
    });
}

function mostrarPerfil(usuario){
    let main = document.createElement("div");
    let fotoContainer = document.createElement("div");
    let datosContainer = document.createElement("div");
    let imagenPerfil = document.createElement("img");
    let cambiarImagen = document.createElement("span");
    let emailSpan = document.createElement("span");
    let usuarioSpan = document.createElement("span");
    let cambiarClave = document.createElement("span");

    main.id="perfilUsuairo";
    fotoContainer.id="fotoContainer";
    datosContainer.id="datosContainer";
    imagenPerfil.classList.add("imagenPerfil");
    cambiarImagen.classList.add("verde");
    cambiarImagen.classList.add("elemento");
    cambiarImagen.innerHTML="Cambiar foto de perfil";
    emailSpan.innerText="Email: "+usuario.mail;
    usuarioSpan.innerText="Usuario: "+usuario.nombre;
    cambiarClave.innerHTML="Cambiar contraseña";
    cambiarClave.classList.add("amarillo");
    cambiarClave.classList.add("elemento");

    if(usuario.fotoPerfil === null){
        imagenPerfil.src="./img/defaultuser.png";
    }else{
        let descodificado= usuario.fotoPerfil;

        imagenPerfil.src=descodificado;
    }

    cambiarImagen.onclick = () => {
        mostrarTarjetaFotoPerfil();
    };

    cambiarClave.onclick = () => {
        mostrarTarjetaClave();
    };

    fotoContainer.appendChild(imagenPerfil);
    fotoContainer.appendChild(cambiarImagen);
    datosContainer.appendChild(emailSpan);
    datosContainer.appendChild(usuarioSpan);
    datosContainer.appendChild(cambiarClave);
    main.appendChild(fotoContainer);
    main.appendChild(datosContainer);
    cuerpo.appendChild(main);
    mostrarPie();
}

function mostrarTarjetaFotoPerfil(){
    let todo=document.createElement("div");
    let bloqueo =document.createElement("div");
    let tarjeta =document.createElement("div");
    let selector =document.createElement("input");
    let botonesTarjetaFotos=document.createElement("div");
    let aceptar =document.createElement("span");
    let volver =document.createElement("span");
    let eliminar =document.createElement("span");
    let archivo =null;

    todo.classList.add("todoTarjeta");
    bloqueo.classList.add("bloqueo");
    tarjeta.classList.add("tarjeta");
    botonesTarjetaFotos.classList.add("botonesTarjetaFotos");
    aceptar.classList.add("elemento");
    aceptar.classList.add("verde");
    volver.classList.add("elemento");
    volver.classList.add("verde");
    eliminar.classList.add("elemento");
    eliminar.classList.add("amarillo");
    selector.classList.add("selectorFilesTarjeta");
    

    selector.type="file";
    selector.id="imagenSelector";
    selector.accept="image/*";
    selector.multiple="false";
    aceptar.innerText="Aceptar";
    volver.innerText="Volver";
    eliminar.innerText="Eliminar";

    selector.onchange =(event)=>{archivo= event.target.files[0];};
    
    volver.onclick=()=>{
        todo.remove();
    };
    eliminar.onclick=()=>{
        quitarFotoPerfil();
        cargarPerilUsuario();
    };
    aceptar.onclick=()=>{
        if(archivo===null){
            todo.remove();
        }else if(archivo){
            let reader= new FileReader();
            reader.onload=()=>{
                console.log(reader.result)
                let codificado = reader.result;
                enviarFotoPerfil(codificado);
                cargarPerilUsuario();
            }
            reader.readAsDataURL(archivo);
        }
    };

    botonesTarjetaFotos.appendChild(aceptar);
    botonesTarjetaFotos.appendChild(eliminar);
    botonesTarjetaFotos.appendChild(volver);
    tarjeta.appendChild(selector);
    tarjeta.appendChild(botonesTarjetaFotos);
    todo.appendChild(bloqueo);
    todo.appendChild(tarjeta);
    cuerpo.appendChild(todo);
}

function mostrarTarjetaClave(){
    let todo=document.createElement("div");
    let bloqueo =document.createElement("div");
    let tarjeta =document.createElement("div");
    let botonesTarjetaFotos=document.createElement("div");
    let aceptar =document.createElement("span");
    let volver =document.createElement("span");
    let claveActual=document.createElement("input");
    let claveNueva=document.createElement("input");
    let nuevaClave=document.createElement("input");
    let tagClaveActual=document.createElement("span");
    let tagClaveNueva=document.createElement("span");
    let tagNuevaClave=document.createElement("span");


    todo.classList.add("todoTarjeta");
    bloqueo.classList.add("bloqueo");
    tarjeta.classList.add("tarjeta");
    botonesTarjetaFotos.classList.add("botonesTarjetaFotos");
    aceptar.classList.add("elemento");
    aceptar.classList.add("verde");
    volver.classList.add("elemento");
    volver.classList.add("verde");
    claveActual.classList.add("camposTarjeta");
    claveNueva.classList.add("camposTarjeta");
    nuevaClave.classList.add("camposTarjeta");
    
    claveActual.type="password";
    claveNueva.type="password";
    nuevaClave.type="password";
    aceptar.innerText="Aceptar";
    volver.innerText="Volver";
    tagClaveActual.innerText= "Contraseña actual";
    tagClaveNueva.innerText= "Nueva contraseña";
    tagNuevaClave.innerText= "Repita la contraseña";

    
    volver.onclick=()=>{
        todo.remove();
    };

    aceptar.onclick=()=>{
        cambiarClave(claveActual.value,claveNueva.value,nuevaClave.value);
        todo.remove();
    };

    botonesTarjetaFotos.appendChild(aceptar);
    botonesTarjetaFotos.appendChild(volver);
    tarjeta.appendChild(tagClaveActual);
    tarjeta.appendChild(claveActual);
    tarjeta.appendChild(tagClaveNueva);
    tarjeta.appendChild(claveNueva);
    tarjeta.appendChild(tagNuevaClave);
    tarjeta.appendChild(nuevaClave);
    tarjeta.appendChild(botonesTarjetaFotos);
    todo.appendChild(bloqueo);
    todo.appendChild(tarjeta);
    cuerpo.appendChild(todo);
}

//Otras funciones

function mostrarSesion(){
    setCookie("token",null,1);
    cargarPantallaLogin();
}

function mostrarProducto(codigo){
    console.log(codigo)
}

function ocultar(){
    cuerpo.innerHTML="";
}

function comprobarToken(){
    return new Promise((resolve, reject) => {
        let datos ={
            jwt: getCookie("token")
        }
        fetch("http://localhost/alexcines/api/api/validarToken",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(datos)})
        .then(response => {
            if(!response.ok){
                console.error("Error Logeo");
                cargarPantallaLogin();
            }else{
                return response.json();
            }
        })
        .then(esto =>{
            if(esto ==true){
                resolve(true);
            }else{
                cargarPantallaLogin();
            }
        });
    });
}

function usuarioToken(){
    const token = getCookie("token");
    const partes = token.split('.');
    const cuerpoCodificado = partes[1];
    const cuerpoDecodificado = atob(cuerpoCodificado);
    const cuerpoObjeto = JSON.parse(cuerpoDecodificado);
    const usuario = cuerpoObjeto.sub;

    return usuario;
}


function enviarFotoPerfil(archivo){
    let datos ={
        usuario: usuarioToken(),
        archivo: archivo
    }
    fetch("http://localhost/alexcines/api/api/agregarFotoPerfil",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(datos)})
    .then(response => {
        if(!response.ok){
            console.error("Error al guardar la imagen");
        }else{
            return response.json();
        }
    });
}

function quitarFotoPerfil(){
    let datos ={
        usuario: usuarioToken()
    }
    fetch("http://localhost/alexcines/api/api/quitarFotoPerfil",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(datos)})
    .then(response => {
        if(!response.ok){
            console.error("Error al quitar la imagen");
        }else{
            return response.json();
        }
    });
}

function cambiarClave(claveActual, claveNueva, nuevaClave){
    let datos ={
        usuario: usuarioToken(),
        claveActual: claveActual,
        claveNueva: claveNueva,
        nuevaClave: nuevaClave,
    }
    fetch("http://localhost/alexcines/api/api/cambiarClave",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(datos)})
    .then(response => {
        if(!response.ok){
            console.error("Error al cambiar la clave");
        }else{
            return response.json();
        }
    });
}

function comprobarAdmin(){
    return new Promise((resolve, reject) => {
        let datos ={
            usuario: usuarioToken(),
        }
        fetch("http://localhost/alexcines/api/api/comprobarAdmin",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(datos)})
        .then(response => {
            if(!response.ok){
                console.error("Error al comprobar admin");
            }else{
                return response.json();
            }
        }).then(respuesta=>{
            if(respuesta.isAdmin){
                resolve(true);
            }else{
                resolve(false);
            }
        });
    });
}