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
        console.log(getCookie("paginaActual"));
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
            ocultar();
            mostrarCabecera();
            cuerpo.appendChild(principalPag);
            mostrarPie();
            setCookie("paginaActual",2,1);
        }else{
            cargarPantallaLogin();
        }
    });
}

function cargarPerilUsuario(){
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
            ocultar();
            mostrarCabecera();
            mostrarPie();
            setCookie("paginaActual",3,1);
        }else{
            cargarPantallaLogin();
        }
    });
}

//cabecera y pie
function mostrarCabecera(){
    let cabecera = document.createElement("div");
    let usuario = document.createElement("div");
    let logo =document.createElement("img");
    let perfil = document.createElement("span");
    let sesion =document.createElement("span");

    cabecera.id= "cabecera";
    cuerpo.appendChild(cabecera);

    logo.src="./img/logocines.png";
    logo.classList.add("icologo");
    logo.id = "logo";

    usuario.id="usuarioheader";

    perfil.classList.add("elemento");
    perfil.innerText="Perfil";
    sesion.classList.add("elemento");
    sesion.innerText="Cerrar Sesion";

    logo.onclick = ()=> {cargarPantallaPrincipal()};
    sesion.onclick = ()=> {mostrarSesion()};
    perfil.onclick = ()=> {cargarPerilUsuario()};

    cabecera.appendChild(logo);
    usuario.appendChild(perfil);
    usuario.appendChild(sesion);
    cabecera.appendChild(usuario);
}

function mostrarPie(){
    let pie = document.createElement("div");
    pie.id = "piedepagina";

    cuerpo.appendChild(pie);
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