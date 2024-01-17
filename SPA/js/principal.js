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
    paginas.push(cargarPerfilUsuario);
    paginas.push(cargarRegistroPelicula);

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
                
                comprobarAdmin().then(isAdmin=>{
                    if(isAdmin){
                        setCookie("esAdmin",true,1);
                    }else{
                        setCookie("esAdmin",false,1);
                    }
                    cargarPantallaPrincipal();
                });
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

function cargarPerfilUsuario(){
    comprobarToken()
    .then(tokenValido => {
        ocultar();
        mostrarCabecera();
        getPerfil();
        setCookie("paginaActual",3,1);
    });
}

function cargarRegistroPelicula(){
    comprobarToken()
    .then(tokenValido => {
        ocultar();
        mostrarCabecera();
        mostrarRegistroPelicula();
        setCookie("paginaActual",4,1);
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
    admin.innerText="Admin";
    sesion.classList.add("elementoHeader");
    sesion.classList.add("amarillo");
    sesion.innerText="Cerrar Sesion";

    logo.onclick = ()=> {cargarPantallaPrincipal()};
    sesion.onclick = ()=> {mostrarSesion()};
    perfil.onclick = ()=> {cargarPerfilUsuario()};
    admin.onclick = ()=> {cargarRegistroPelicula()};

    cabecera.appendChild(logo);
    cabecera.appendChild(mostrarBuscador());
    if(getCookie("esAdmin") ==="true"){
        usuario.appendChild(admin);
    }
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
    volver.classList.add("amarillo");
    eliminar.classList.add("elemento");
    eliminar.classList.add("rojo");
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
        cargarPerfilUsuario();
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
                cargarPerfilUsuario();
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
    volver.classList.add("amarillo");
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

function mostrarBuscador(){
    let buscadorContainer = document.createElement("div");
    let tipoBusqueda=document.createElement("select");
    let original=document.createElement("option");
    let castellano=document.createElement("option");
    let anno=document.createElement("option");
    let duraccion=document.createElement("option");
    let director=document.createElement("option");
    let miembros=document.createElement("option");
    let genero=document.createElement("option");
    let buscador=document.createElement("input");
    let aceptar=document.createElement("span");

    tipoBusqueda.name="busqueda";
    original.value="original";
    original.innerText="Original";
    castellano.value="castellano";
    castellano.innerText="Castellano";
    anno.value="anno";
    anno.innerText="Año";
    duraccion.value="duraccion";
    duraccion.innerText="Duraccion";
    director.value="director";
    director.innerText="Director";
    miembros.value="miembros";
    miembros.innerText="Miembros";
    genero.value="genero";
    genero.innerText="Genero";
    buscador.type="text";
    aceptar.innerText="Buscar";

    buscadorContainer.id="buscadorContainer";
    buscador.id="buscador"
    aceptar.classList.add("elementoHeader");
    aceptar.classList.add("verde"); 

    tipoBusqueda.appendChild(original);
    tipoBusqueda.appendChild(castellano);
    tipoBusqueda.appendChild(genero);
    tipoBusqueda.appendChild(anno);
    tipoBusqueda.appendChild(duraccion);
    tipoBusqueda.appendChild(director);
    tipoBusqueda.appendChild(original);
    tipoBusqueda.appendChild(miembros);

    buscadorContainer.appendChild(tipoBusqueda);
    buscadorContainer.appendChild(buscador);
    buscadorContainer.appendChild(aceptar);

    return buscadorContainer;
}

function mostrarRegistroPelicula(){
    let main = document.createElement("div");
    let fotoContainer = document.createElement("div");
    let datosContainer = document.createElement("div");
    let botonesContainer = document.createElement("div");
    let imagenPortada = document.createElement("img");
    let cambiarImagen = document.createElement("span");
    let originalTag = document.createElement("span");
    let tituloTag = document.createElement("span");
    let annoTag = document.createElement("span");
    let aceptarBut = document.createElement("span");
    let buscarBut = document.createElement("span");
    let limpiarBut = document.createElement("span");
    let duracionTag = document.createElement("span");
    let directorTag = document.createElement("span");
    let repartoTag = document.createElement("span");
    let sinopsisTag = document.createElement("span");
    let generosTag = document.createElement("span");
    let original = document.createElement("input");
    let titulo = document.createElement("input");
    let anno = document.createElement("input");
    let duracion = document.createElement("input");
    let director = document.createElement("input");
    let reparto = document.createElement("input");
    let sinopsis = document.createElement("input");
    let generos = document.createElement("input");

    main.id="adminAgregarPelicula";
    fotoContainer.id="fotoContainer";
    datosContainer.id="datosContainer";
    botonesContainer.id="botonesContainer";
    original.classList.add("rellenar");
    titulo.classList.add("rellenar");
    anno.classList.add("rellenar");
    duracion.classList.add("rellenar");
    director.classList.add("rellenar");
    reparto.classList.add("rellenar");
    sinopsis.classList.add("rellenar");
    generos.classList.add("rellenar");
    imagenPortada.id="imagenPortada";
    cambiarImagen.classList.add("verde");
    cambiarImagen.classList.add("elemento");
    cambiarImagen.innerHTML="Cambiar portada";
    originalTag.innerText="Titulo original";
    tituloTag.innerText="Titulo español";
    annoTag.innerText="Año";
    duracionTag.innerText="Duraccion";
    directorTag.innerText="Director";
    repartoTag.innerText="Reparto";
    sinopsisTag.innerText="Sinopsis";
    generosTag.innerText="Generos";
    original.type="textarea";
    titulo.type="textarea";
    anno.type="number";
    duracion.type="textarea";
    director.type="textarea";
    reparto.type="textarea";
    sinopsis.type="textarea";
    generos.type="textarea";
    aceptarBut.classList.add("elemento");
    aceptarBut.classList.add("verde");
    aceptarBut.innerText="Agregar";
    buscarBut.classList.add("elemento");
    buscarBut.classList.add("amarillo");
    buscarBut.innerText="Buscar";
    limpiarBut.classList.add("elemento");
    limpiarBut.classList.add("rojo");
    limpiarBut.innerText="Limpiar";

    cambiarImagen.onclick = () => {
        mostrarTarjetaPortada();
    };
    
    buscarBut.onclick=()=>{
        let apiExternas=new ExternalApiService;
        apiExternas.getPeliculas(original.value).then(datos=>{
            original.value=datos.title;
            titulo.value=datos.titEspanol;
            anno.value=parseInt(datos.ano);
            duracion.value=datos.duracion;
            director.value=datos.director;
            reparto.value=datos.reparto;
            sinopsis.value=datos.sinopsis;
            generos.value=datos.genero;
            imagenPortada.src=datos.imagenPortada;
        });
    }

    limpiarBut.onclick=()=>{
        original.value="";
        titulo.value="";
        anno.value="";
        duracion.value="";
        director.value="";
        reparto.value="";
        sinopsis.value="";
        generos.value="";
        imagenPortada.src="";
    }

    fotoContainer.appendChild(imagenPortada);
    fotoContainer.appendChild(cambiarImagen);
    datosContainer.appendChild(originalTag);
    datosContainer.appendChild(original);
    datosContainer.appendChild(tituloTag);
    datosContainer.appendChild(titulo);
    datosContainer.appendChild(sinopsisTag);
    datosContainer.appendChild(sinopsis);
    datosContainer.appendChild(generosTag);
    datosContainer.appendChild(generos);
    datosContainer.appendChild(annoTag);
    datosContainer.appendChild(anno);
    datosContainer.appendChild(duracionTag);
    datosContainer.appendChild(duracion);
    datosContainer.appendChild(directorTag);
    datosContainer.appendChild(director);
    datosContainer.appendChild(repartoTag);
    datosContainer.appendChild(reparto);
    botonesContainer.appendChild(aceptarBut);
    botonesContainer.appendChild(buscarBut);
    botonesContainer.appendChild(limpiarBut);
    main.appendChild(fotoContainer);
    main.appendChild(datosContainer);
    main.appendChild(botonesContainer);
    cuerpo.appendChild(main);
    mostrarPie();
}

function mostrarTarjetaPortada(){
    let portada=document.getElementById("imagenPortada");
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
    volver.classList.add("amarillo");
    eliminar.classList.add("elemento");
    eliminar.classList.add("rojo");
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
        portada.src="";
        todo.remove();
    };
    aceptar.onclick=()=>{
        const blob = new Blob([archivo], { type: archivo.type });

        portada.src=URL.createObjectURL(blob);
        todo.remove();
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

//Otras funciones

function mostrarSesion(){
    setCookie("token",null,1);
    cargarPantallaLogin();
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
            if(respuesta.isadmin === "1"){
                resolve(true);
            }else{
                resolve(false);
            }
        });
    });
}