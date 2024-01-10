var token = null;
var cuerpo;
var logeoPag;
var principalPag;

window.onload= ()=>{
    cuerpo = document.getElementsByTagName("body")[0];
    logeoPag = document.getElementById("login");
    principalPag = document.getElementById("principal");


    cargarPantallaLogin();
}

function cargarPantallaLogin(){
    ocultar();
    cuerpo.appendChild(logeoPag);
    const logeoBut = document.getElementById("logear");

    logeoBut.onclick = function(){
        const usuario = document.getElementById("usuario");
        const clave = document.getElementById("contrasenna");
        let datos ={
            usuario: usuario.value,
            password: clave.value
        }

        fetch("http://localhost/php/practica14/api",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(datos)})
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
}

function cargarPantallaPrincipal(){
    ocultar();
    mostrarCabecera();
    cuerpo.appendChild(principalPag);
    const lista = document.getElementById("listaCategorias");

    fetch("http://localhost/php/practica14/api/categorias",{method:"GET", headers:{"Content-Type":"application/json", "Authorization": `Bearer ${token}`}})
        .then(response => {
            if(!response.ok){
                console.error("Error Cargar Categorias");
            }else{
                return response.json();
            }
        })
        .then(esto =>{
            lista.innerHTML="";
            esto.forEach(cosa => {
                const elemento = document.createElement("li");
                elemento.innerText = cosa.descripcion;
                elemento.style.cursor = "pointer";
                elemento.onclick = ()=>{ mostrarProducto(cosa.codCat)};
                lista.appendChild(elemento);
            });
        });
}

function mostrarCabecera(){
    let cabecera = document.createElement("div");
    let categoria =document.createElement("span");
    let carrito =document.createElement("span");
    let sesion =document.createElement("span");

    cabecera.id= "cabecera";
    cuerpo.appendChild(cabecera);
    categoria.innerText="Categorias ";
    carrito.innerText="Ver carrito ";
    sesion.innerText="Cerrar Sesion";

    categoria.onclick = ()=> {mostrarCategoria()};
    carrito.onclick = ()=> {mostrarCarrito()};
    sesion.onclick = ()=> {mostrarSesion()};

    categoria.style.cursor = "pointer";
    carrito.style.cursor = "pointer";
    sesion.style.cursor = "pointer";

    cabecera.appendChild(categoria);
    cabecera.appendChild(carrito);
    cabecera.appendChild(sesion);
}

function mostrarCategoria(){

}

function mostrarCarrito(){

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