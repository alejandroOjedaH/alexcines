var token = null;
var cuerpo;
var logeoPag;
var principalPag;
var registro;

window.onload= ()=>{
    cuerpo = document.getElementsByTagName("body")[0];
    logeoPag = document.getElementById("login");
    principalPag = document.getElementById("principal");
    registro = document.getElementById("registro");

    cargarPantallaLogin();
}

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
                token = esto.split(":")[1];
                cargarPantallaPrincipal();
            }
        });
    }
    regrisBut.onclick=function(){
        cargarPantallaRegistro();
    }
    
    mostrarPie();
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
}

function cargarPantallaPrincipal(){
    
    let datos ={
        jwt: token
    }

    fetch("http://localhost/alexcines/api/api/validarToken",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(datos)})
    .then(response => {
        if(!response.ok){
            console.error("Error Logeo");
        }else{
            return response.json();
        }
    })
    .then(esto =>{
        if(esto ==true){
            ocultar();
            mostrarCabecera();
            cuerpo.appendChild(principalPag);
        }else{
            cargarPantallaLogin();
        }
    });
}

function mostrarCabecera(){
    let cabecera = document.createElement("div");
    let sesion =document.createElement("span");

    cabecera.id= "cabecera";
    cuerpo.appendChild(cabecera);
    sesion.innerText="Cerrar Sesion";

    sesion.onclick = ()=> {mostrarSesion()};

    categoria.style.cursor = "pointer";
    carrito.style.cursor = "pointer";
    sesion.style.cursor = "pointer";

    cabecera.appendChild(categoria);
    cabecera.appendChild(carrito);
    cabecera.appendChild(sesion);
}

function mostrarPie(){
    let pie = document.createElement("div");
    pie.id = "piedepagina";

    cuerpo.appendChild(pie);
}

function mostrarSesion(){
    token = null;
    cargarPantallaLogin();
}

function mostrarProducto(codigo){
    console.log(codigo)
}

function ocultar(){
    cuerpo.innerHTML="";
}