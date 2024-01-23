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
        mostrarPaginaPrincipal();

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

function cargarBusquedaUsuarioPeliculas(tipo, datos){
    comprobarToken()
    .then(tokenValido => {
        ocultar();
        mostrarCabecera();

        if(tipo ==="nombre"){
            mostrarBusqueda("usuario",datos);
        }
        else{
            mostrarBusqueda("peliculas",datos);
        }
    });
}

function cargarFichaUsuario(datos){
    comprobarToken()
    .then(tokenValido => {
        ocultar();
        mostrarCabecera();
        if(getCookie("esAdmin") ==="true"){
            mostrarFichaUsuario(datos);
        }else{
            cargarPantallaPrincipal();
        }
    });
}

function cargarFichaPelicula(datos){
    comprobarToken()
    .then(tokenValido => {
        ocultar();
        mostrarCabecera();
            mostrarFichaPelicula(datos);
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
    admin.innerText="Añadir Pelicula";
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
    let usuario=document.createElement("option");
    let buscador=document.createElement("input");
    let aceptar=document.createElement("span");

    tipoBusqueda.name="busqueda";
    original.value="titulooriginal";
    original.innerText="Original";
    castellano.value="titulocastellano";
    castellano.innerText="Castellano";
    anno.value="anno";
    anno.innerText="Año";
    duraccion.value="duracion";
    duraccion.innerText="Duracion";
    director.value="director";
    director.innerText="Director";
    miembros.value="reparto";
    miembros.innerText="Miembros";
    genero.value="generos";
    genero.innerText="Genero";
    usuario.value="nombre";
    usuario.innerText="Usuario";
    buscador.type="text";
    aceptar.innerText="Buscar";

    buscadorContainer.id="buscadorContainer";
    buscador.id="buscador"
    aceptar.classList.add("elementoHeader");
    aceptar.classList.add("verde"); 

    aceptar.onclick=()=>{buscarElementos(tipoBusqueda.value,buscador.value).then( datos=>{
        cargarBusquedaUsuarioPeliculas(tipoBusqueda.value,datos);
    })};

    tipoBusqueda.appendChild(original);
    tipoBusqueda.appendChild(castellano);
    tipoBusqueda.appendChild(genero);
    tipoBusqueda.appendChild(anno);
    tipoBusqueda.appendChild(duraccion);
    tipoBusqueda.appendChild(director);
    tipoBusqueda.appendChild(original);
    tipoBusqueda.appendChild(miembros);
    if(getCookie("esAdmin") ==="true"){
        tipoBusqueda.appendChild(usuario);
    }

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
    duracion.type="number";
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

    aceptarBut.onclick= () =>{agregarPeliula(original.value,titulo.value,anno.value,duracion.value,director.value,reparto.value,sinopsis.value,generos.value,imagenPortada.src)};

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

function mostrarBusqueda(tipo,datos){
    let main = document.createElement("div");

    main.id="busquedaPrincipal";

    if(tipo === "peliculas"){
        let filaCab =document.createElement("div");
        let nombreCabDiv =document.createElement("div");
        let directorCabDiv =document.createElement("div");
        let generoCabDiv =document.createElement("div");
        let annoCabDiv =document.createElement("div");
        let duracionCabDiv =document.createElement("div");
        let repartoCabDiv =document.createElement("div");
        let portadaCabDiv =document.createElement("div");
        let nombreCab =document.createElement("span");
        let directorCab =document.createElement("span");
        let generoCab =document.createElement("span");
        let annoCab =document.createElement("span");
        let duracionCab =document.createElement("span");
        let repartoCab =document.createElement("span");
        let portadaCab =document.createElement("span");
        
        filaCab.classList.add("contenedorCabDatos");
        nombreCabDiv.classList.add("camposDatosPelicula");
        directorCabDiv.classList.add("camposDatosPelicula");
        generoCabDiv.classList.add("camposDatosPelicula");
        annoCabDiv.classList.add("camposDatosPelicula");
        duracionCabDiv.classList.add("camposDatosPelicula");
        repartoCabDiv.classList.add("camposDatosPelicula");
        portadaCabDiv.classList.add("camposDatosPelicula");
        

        nombreCab.innerText="Titulo";
        directorCab.innerText="Director";
        generoCab.innerText="Genero";
        annoCab.innerText="Año";
        duracionCab.innerText="Duracion";
        repartoCab.innerText="Reparto";
        portadaCab.innerText="Portada";

        nombreCabDiv.appendChild(nombreCab);
        directorCabDiv.appendChild(directorCab);
        generoCabDiv.appendChild(generoCab);
        annoCabDiv.appendChild(annoCab);
        duracionCabDiv.appendChild(duracionCab);
        repartoCabDiv.appendChild(repartoCab);
        portadaCabDiv.appendChild(portadaCab);
        filaCab.appendChild(portadaCabDiv);
        filaCab.appendChild(nombreCabDiv);
        filaCab.appendChild(directorCabDiv);
        filaCab.appendChild(generoCabDiv);
        filaCab.appendChild(annoCabDiv);
        filaCab.appendChild(duracionCabDiv);
        filaCab.appendChild(repartoCabDiv);
        main.appendChild(filaCab);

        datos.forEach(dato => {
            let fila =document.createElement("div");
            let nombreDiv =document.createElement("div");
            let directorDiv =document.createElement("div");
            let generoDiv =document.createElement("div");
            let annoDiv =document.createElement("div");
            let duracionDiv =document.createElement("div");
            let repartoDiv =document.createElement("div");
            let portadaDiv =document.createElement("div");
            let nombre =document.createElement("span");
            let director =document.createElement("span");
            let genero =document.createElement("span");
            let anno =document.createElement("span");
            let duracion =document.createElement("span");
            let reparto =document.createElement("span");
            let portada =document.createElement("img");
            
            fila.classList.add("contenedorDatos");
            nombreDiv.classList.add("camposDatosPelicula");
            directorDiv.classList.add("camposDatosPelicula");
            generoDiv.classList.add("camposDatosPelicula");
            annoDiv.classList.add("camposDatosPelicula");
            duracionDiv.classList.add("camposDatosPelicula");
            repartoDiv.classList.add("camposDatosPelicula");
            portadaDiv.classList.add("camposDatosPelicula");

            nombre.innerText=dato.titulocastellano;
            director.innerText=dato.director;
            genero.innerText=dato.generos;
            anno.innerText=dato.anno;
            duracion.innerText=dato.duracion;
            reparto.innerText=dato.reparto;
            if(dato.portada !==null){
                portada.src= dato.portada;
            }

            fila.onclick=()=>{cargarFichaPelicula(dato)};

            nombreDiv.appendChild(nombre);
            directorDiv.appendChild(director);
            generoDiv.appendChild(genero);
            annoDiv.appendChild(anno);
            duracionDiv.appendChild(duracion);
            repartoDiv.appendChild(reparto);
            portadaDiv.appendChild(portada);
            fila.appendChild(portadaDiv);
            fila.appendChild(nombreDiv);
            fila.appendChild(directorDiv);
            fila.appendChild(generoDiv);
            fila.appendChild(annoDiv);
            fila.appendChild(duracionDiv);
            fila.appendChild(repartoDiv);
            main.appendChild(fila);
        });
    }else if(tipo === "usuario"){
        let filaCab =document.createElement("div");
        let nombreCabDiv =document.createElement("div");
        let mailCabDiv =document.createElement("div");
        let adminCabDiv =document.createElement("div");
        let fotoCabDiv =document.createElement("div");
        let nombreCab =document.createElement("span");
        let mailCab =document.createElement("span");
        let adminCab =document.createElement("span");
        let fotoCab =document.createElement("span");
        
        filaCab.classList.add("contenedorCabDatos");
        nombreCabDiv.classList.add("camposDatosUsuario");
        mailCabDiv.classList.add("camposDatosUsuario");
        adminCabDiv.classList.add("camposDatosUsuario");
        fotoCabDiv.classList.add("camposDatosUsuario");

        nombreCab.innerText="Nombre";
        mailCab.innerText="Mail";
        adminCab.innerText="Admin";
        fotoCab.innerText="Foto";

        nombreCabDiv.appendChild(nombreCab);
        mailCabDiv.appendChild(mailCab);
        adminCabDiv.appendChild(adminCab);
        fotoCabDiv.appendChild(fotoCab);
        filaCab.appendChild(nombreCabDiv);
        filaCab.appendChild(mailCabDiv);
        filaCab.appendChild(adminCabDiv);
        filaCab.appendChild(fotoCabDiv);
        main.appendChild(filaCab);

        datos.forEach(dato => {
            let fila =document.createElement("div");
            let nombreDiv =document.createElement("div");
            let mailDiv =document.createElement("div");
            let adminDiv =document.createElement("div");
            let fotoDiv =document.createElement("div");
            let nombre =document.createElement("span");
            let mail =document.createElement("span");
            let admin =document.createElement("span");
            let foto =document.createElement("img");

            fila.classList.add("contenedorDatos");
            nombreDiv.classList.add("camposDatosUsuario");
            mailDiv.classList.add("camposDatosUsuario");
            adminDiv.classList.add("camposDatosUsuario");
            fotoDiv.classList.add("camposDatosUsuario");

            nombre.innerText=dato.nombre;
            mail.innerText=dato.mail;
            if(dato.isAdmin=== 1){
                admin.innerText="Es admin";
            }else{
                admin.innerText="No es admin";
            }
            if(dato.fotoPerfil === null){
                foto.src="./img/defaultuser.png";
            }else{
                foto.src=dato.fotoPerfil;
            }

            fila.onclick=()=>{cargarFichaUsuario(dato)};

            nombreDiv.appendChild(nombre);
            mailDiv.appendChild(mail);
            adminDiv.appendChild(admin);
            fotoDiv.appendChild(foto);
            fila.appendChild(nombreDiv);
            fila.appendChild(mailDiv);
            fila.appendChild(adminDiv);
            fila.appendChild(fotoDiv);
            main.appendChild(fila);
        });
    }

    cuerpo.appendChild(main);
    mostrarPie();
}

function mostrarFichaUsuario(datos){
    let main = document.createElement("div");
    let fotoContainer = document.createElement("div");
    let datosContainer = document.createElement("div");
    let imagenPerfil = document.createElement("img");
    let cambiarImagen = document.createElement("span");
    let emailSpan = document.createElement("span");
    let usuarioSpan = document.createElement("span");
    let adminSpan = document.createElement("span");
    let claveSpan = document.createElement("span");
    let email = document.createElement("input");
    let usuario = document.createElement("input");
    let clave = document.createElement("input");
    let select=document.createElement("select");
    let si=document.createElement("option");
    let no=document.createElement("option");
    let guardar=document.createElement("span");
    let eliminar=document.createElement("span");


    main.id="perfilUsuairo";
    fotoContainer.id="fotoContainer";
    datosContainer.id="datosContainer";
    imagenPerfil.classList.add("imagenPerfil");
    cambiarImagen.classList.add("verde");
    cambiarImagen.classList.add("elemento");
    cambiarImagen.innerHTML="Cambiar foto de perfil";
    emailSpan.innerText="Email";
    usuarioSpan.innerText="Usuario";
    adminSpan.innerText="Admin";
    claveSpan.innerText="Contraseña";
    guardar.classList.add("amarillo");
    guardar.classList.add("elemento");
    eliminar.classList.add("rojo");
    eliminar.classList.add("elemento");

    email.type="text";
    usuario.type="text";
    clave.type="password";
    guardar.innerText="Guardar";
    eliminar.innerText="Eliminar";

    select.name="esAdmin";
    si.value=1;
    no.value=0;
    si.innerText="Si";
    no.innerText="No";
    select.appendChild(si);
    select.appendChild(no);
    if(datos.isAdmin*1===1){
        si.selected=true;
    }else{
        no.selected=true;
    }

    email.value=datos.mail;
    usuario.value=datos.nombre;

    if(datos.fotoPerfil === null){
        imagenPerfil.src="./img/defaultuser.png";
    }else{
        let descodificado= datos.fotoPerfil;

        imagenPerfil.src=descodificado;
    }

    cambiarImagen.onclick = () => {
        mostrarTarjetaFotoUsuario(imagenPerfil);
    };

    eliminar.onclick=()=>{eliminarUsuario(datos.id)}
    guardar.onclick=()=>{
        actualizarUsuario(datos.id,email.value, usuario.value, select.value, clave.value,imagenPerfil.src);
    }

    fotoContainer.appendChild(imagenPerfil);
    fotoContainer.appendChild(cambiarImagen);
    datosContainer.appendChild(emailSpan);
    datosContainer.appendChild(email);
    datosContainer.appendChild(usuarioSpan);
    datosContainer.appendChild(usuario);
    datosContainer.appendChild(adminSpan);
    datosContainer.appendChild(select);
    datosContainer.appendChild(claveSpan);
    datosContainer.appendChild(clave);
    datosContainer.appendChild(guardar);
    datosContainer.appendChild(eliminar);
    main.appendChild(fotoContainer);
    main.appendChild(datosContainer);
    cuerpo.appendChild(main);
    mostrarPie();
}

function mostrarTarjetaFotoUsuario(imagenPerfil){
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
        imagenPerfil.src="";
        todo.remove();
    };
    aceptar.onclick=()=>{
        if(archivo===null){
            todo.remove();
        }else if(archivo){
            let reader= new FileReader();
            reader.onload=()=>{
                console.log(reader.result)
                let codificado = reader.result;
                imagenPerfil.src=codificado
                todo.remove();
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

function mostrarFichaPelicula(datos){
    let imagenDatosContainer=null;
    let main=null;
    //puntuacion
    let puntuacionContainer = document.createElement("div");
    let valorarCab =document.createElement("span");
    let puntuacionSlider = document.createElement("input");
    let puntuacionUsuario =document.createElement("span");
    let puntuacionMediaCab =document.createElement("span");
    let puntuacionMedia =document.createElement("span");
    let eliminarPuntuacion =document.createElement("span");

    puntuacionContainer.id="puntuacionContainerFicha";
    eliminarPuntuacion.classList.add("elemento");
    eliminarPuntuacion.classList.add("rojo");

    puntuacionSlider.type="range";
    puntuacionSlider.min="1";
    puntuacionSlider.max="10";
    puntuacionMediaCab.innerText="Puntuación media";
    valorarCab.innerText="Valorar";
    eliminarPuntuacion.innerText="Eliminar valoración";
    getPuntuacion(datos.id).then( respuesta=>{
        if(respuesta.puntuacion!==undefined){
            puntuacionUsuario.innerText=respuesta.puntuacion;
            puntuacionSlider.value=parseInt(respuesta.puntuacion);
        }else{
            puntuacionUsuario.innerText="No has puntuado esta pelicula todavía";
        }
    });
    getPuntuacionMedia(datos.id).then(respuesta=>{
        if (respuesta.media!==undefined){
            puntuacionMedia.innerText=respuesta.media;
        }else{
            puntuacionMedia.innerHTML="No se ha puntuado todavía";
        }
    });

    puntuacionSlider.oninput=(evento)=>{
        puntuacionUsuario.innerText=evento.target.value;
    };
    puntuacionSlider.onmouseup=(evento)=>{
        insertarPuntuacion(datos.id,evento.target.value).then(algo=>{
                getPuntuacionMedia(datos.id).then(respuesta=>{
                puntuacionMedia.innerText=respuesta.media;
            });
        });
    };
    
    eliminarPuntuacion.onclick=()=>{
        deletePuntuacion(datos.id).then(nada =>{
            getPuntuacionMedia(datos.id).then(respuesta=>{
                if (respuesta.media!==undefined){
                    puntuacionMedia.innerText=respuesta.media;
                }else{
                    puntuacionMedia.innerHTML="No se ha puntuado todavía";
                }
            });
            getPuntuacion(datos.id).then( respuesta=>{
                if(respuesta.puntuacion!==undefined){
                    puntuacionUsuario.innerText=respuesta.puntuacion;
                    puntuacionSlider.value=parseInt(respuesta.puntuacion);
                }else{
                    puntuacionUsuario.innerText="No has puntuado esta pelicula todavía";
                }
            });
        });
    };
    //comentarios
    let comentariosContainer = document.createElement("div");
    let comentariosTitulo = document.createElement("h1");
    let comentariosUsuariosContainer = document.createElement("div");
    let comentarioUsuarioContainer = document.createElement("div");
    let comentarioUsuarioInput = document.createElement("input");
    let comentarioUsuarioEnviar= document.createElement("span");
    
    comentariosContainer.id="comentariosContainer";
    comentarioUsuarioContainer.id="comentarioUsuarioContainer";
    comentarioUsuarioEnviar.classList.add("verde");
    comentarioUsuarioEnviar.classList.add("elemento");
    comentariosTitulo.innerText="Comentarios";
    comentarioUsuarioEnviar.innerText="Añadir comentario";
    comentarioUsuarioInput.type="textarea";
    comentariosUsuariosContainer.id="comentariosUsuariosContainer";

    comentarioUsuarioEnviar.onclick=()=>{
        insertarComentario(datos.id, comentarioUsuarioInput.value).then(()=>{
            mostrarComentarios();
        });
        
    }

    mostrarComentarios();
    function mostrarComentarios(){
        comentariosUsuariosContainer.innerHTML="";
        //si es admin comentarios
        if(getCookie("esAdmin")==="true"){
            getComentarios(datos.id).then(comentarios=>{
                comentarios.forEach(comentario => {
                    let comentarioIndividualContainer =document.createElement("div");
                    let comentarioUsuarioPerfilContainer =document.createElement("div");
                    let comentarioBotonesContainer =document.createElement("div");
                    let mostrarComentarioNombre=document.createElement("span");
                    let mostrarComentarioContenido=document.createElement("input");
                    let mostrarComentarioFoto=document.createElement("img");
                    let mostrarComentarioEditar=document.createElement("span");
                    let mostrarComentarioEliminar=document.createElement("span");

                    mostrarComentarioEditar.classList.add("containerVertical");
                    mostrarComentarioEditar.innerText="Editar";
                    mostrarComentarioEliminar.innerText="Eliminar";
                    mostrarComentarioEditar.classList.add("amarillo");
                    mostrarComentarioEliminar.classList.add("rojo");
                    mostrarComentarioEditar.classList.add("elemento");
                    mostrarComentarioEliminar.classList.add("elemento");
                    mostrarComentarioNombre.innerText=comentario.nombre;
                    mostrarComentarioContenido.value=comentario.comentario;
                    comentarioIndividualContainer.classList.add("comentarioIndividualContainer");
                    comentarioUsuarioPerfilContainer.classList.add("containerVertical");

                    if(comentario.fotoPerfil === null){
                        mostrarComentarioFoto.src="./img/defaultuser.png";
                    }else{
                        mostrarComentarioFoto.src=comentario.fotoPerfil;
                    }

                    mostrarComentarioEditar.onclick=()=>{
                        updateComentario(comentario.id,mostrarComentarioContenido.value);
                    }

                    mostrarComentarioEliminar.onclick= ()=>{
                        deleteComentario(comentario.id);
                        comentarioIndividualContainer.remove();
                    };
                    
                    comentarioUsuarioPerfilContainer.appendChild(mostrarComentarioNombre);
                    comentarioUsuarioPerfilContainer.appendChild(mostrarComentarioFoto);
                    comentarioBotonesContainer.appendChild(mostrarComentarioEditar);
                    comentarioBotonesContainer.appendChild(mostrarComentarioEliminar);
                    comentarioIndividualContainer.appendChild(comentarioUsuarioPerfilContainer);
                    comentarioIndividualContainer.appendChild(mostrarComentarioContenido);
                    comentarioIndividualContainer.appendChild(comentarioBotonesContainer);
                    comentariosUsuariosContainer.appendChild(comentarioIndividualContainer);
                });
            });
        }else{
            getComentarios(datos.id).then(comentarios=>{
                comentarios.forEach(comentario => {
                    if(comentario.nombre === usuarioToken()){
                        let comentarioIndividualContainer =document.createElement("div");
                        let comentarioUsuarioPerfilContainer =document.createElement("div");
                        let comentarioBotonesContainer =document.createElement("div");
                        let mostrarComentarioNombre=document.createElement("span");
                        let mostrarComentarioContenido=document.createElement("input");
                        let mostrarComentarioFoto=document.createElement("img");
                        let mostrarComentarioEditar=document.createElement("span");
                        let mostrarComentarioEliminar=document.createElement("span");

                        mostrarComentarioEditar.classList.add("containerVertical");
                        mostrarComentarioEditar.innerText="Editar";
                        mostrarComentarioEliminar.innerText="Eliminar";
                        mostrarComentarioEditar.classList.add("amarillo");
                        mostrarComentarioEliminar.classList.add("rojo");
                        mostrarComentarioEditar.classList.add("elemento");
                        mostrarComentarioEliminar.classList.add("elemento");
                        mostrarComentarioNombre.innerText=comentario.nombre;
                        mostrarComentarioContenido.value=comentario.comentario;
                        comentarioIndividualContainer.classList.add("comentarioIndividualContainer");
                        comentarioUsuarioPerfilContainer.classList.add("containerVertical");

                        if(comentario.fotoPerfil === null){
                            mostrarComentarioFoto.src="./img/defaultuser.png";
                        }else{
                            mostrarComentarioFoto.src=comentario.fotoPerfil;
                        }

                        mostrarComentarioEditar.onclick=()=>{
                            updateComentario(comentario.id,mostrarComentarioContenido.value);
                        }

                        mostrarComentarioEliminar.onclick= ()=>{
                            deleteComentario(comentario.id);
                            comentarioIndividualContainer.remove();
                        };
                        
                        comentarioUsuarioPerfilContainer.appendChild(mostrarComentarioNombre);
                        comentarioUsuarioPerfilContainer.appendChild(mostrarComentarioFoto);
                        comentarioBotonesContainer.appendChild(mostrarComentarioEditar);
                        comentarioBotonesContainer.appendChild(mostrarComentarioEliminar);
                        comentarioIndividualContainer.appendChild(comentarioUsuarioPerfilContainer);
                        comentarioIndividualContainer.appendChild(mostrarComentarioContenido);
                        comentarioIndividualContainer.appendChild(comentarioBotonesContainer);
                        comentariosUsuariosContainer.appendChild(comentarioIndividualContainer);
                    }else{
                        let comentarioIndividualContainer =document.createElement("div");
                        let comentarioUsuarioPerfilContainer =document.createElement("div");
                        let mostrarComentarioNombre=document.createElement("span");
                        let mostrarComentarioContenido=document.createElement("span");
                        let mostrarComentarioFoto=document.createElement("img");
    
                        mostrarComentarioNombre.innerText=comentario.nombre;
                        mostrarComentarioContenido.innerText=comentario.comentario;
                        comentarioIndividualContainer.classList.add("comentarioIndividualContainer");
                        comentarioUsuarioPerfilContainer.classList.add("containerVertical");

                        if(comentario.fotoPerfil === null){
                            mostrarComentarioFoto.src="./img/defaultuser.png";
                        }else{
                            mostrarComentarioFoto.src=comentario.fotoPerfil;
                        }
                        
                        comentarioUsuarioPerfilContainer.appendChild(mostrarComentarioNombre);
                        comentarioUsuarioPerfilContainer.appendChild(mostrarComentarioFoto);
                        comentarioIndividualContainer.appendChild(comentarioUsuarioPerfilContainer);
                        comentarioIndividualContainer.appendChild(mostrarComentarioContenido);
                        comentariosUsuariosContainer.appendChild(comentarioIndividualContainer);
                    }
                });
            });
        }
    }
    //si es admin
    if(getCookie("esAdmin")==="true"){
        main = document.createElement("div");
        let fotoContainer = document.createElement("div");
        let datosContainer = document.createElement("div");
        let botonesContainer = document.createElement("div");
        imagenDatosContainer = document.createElement("div");
        let imagenPortada = document.createElement("img");
        let cambiarImagen = document.createElement("span");
        let originalTag = document.createElement("span");
        let tituloTag = document.createElement("span");
        let annoTag = document.createElement("span");
        let guardarBut = document.createElement("span");
        let eliminarBut = document.createElement("span");
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

        main.id="fichaPeliculamain";
        fotoContainer.id="fotoContainer";
        datosContainer.id="datosContainerFicha";
        botonesContainer.id="botonesContainer";
        imagenDatosContainer.id="imagenesDatosFicha";
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
        duracion.type="number";
        director.type="textarea";
        reparto.type="textarea";
        sinopsis.type="textarea";
        generos.type="textarea";
        guardarBut.classList.add("elemento");
        guardarBut.classList.add("amarillo");
        guardarBut.innerText="Guardar";
        eliminarBut.classList.add("elemento");
        eliminarBut.classList.add("rojo");
        eliminarBut.innerText="Eliminar";

        original.value=datos.titulooriginal;
        titulo.value=datos.titulocastellano;
        sinopsis.value=datos.sinopsis;
        generos.value=datos.generos;
        anno.value=datos.anno;
        duracion.value=datos.duracion;
        director.value=datos.director;
        reparto.value=datos.reparto;
        imagenPortada.src=datos.portada;

        cambiarImagen.onclick = () => {
            mostrarTarjetaPortadaFicha(imagenPortada);
        };
        
        guardarBut.onclick=()=>{
            updatePelicula(datos.id,original.value,titulo.value,anno.value,duracion.value,director.value,reparto.value,sinopsis.value,imagenPortada.src,generos.value);
        }

        eliminarBut.onclick=()=>{
           delelePelicula(datos.id); 
        }

        fotoContainer.appendChild(imagenPortada);
        fotoContainer.appendChild(cambiarImagen);
        agreagarDivEnDiv(datosContainer,originalTag,original);
        agreagarDivEnDiv(datosContainer,tituloTag,titulo);
        agreagarDivEnDiv(datosContainer,sinopsisTag,sinopsis);
        agreagarDivEnDiv(datosContainer,generosTag,generos);
        agreagarDivEnDiv(datosContainer,annoTag,anno);
        agreagarDivEnDiv(datosContainer,duracionTag,duracion);
        agreagarDivEnDiv(datosContainer,directorTag,director);
        agreagarDivEnDiv(datosContainer,repartoTag,reparto);
        botonesContainer.appendChild(guardarBut);
        botonesContainer.appendChild(eliminarBut);
        imagenDatosContainer.appendChild(fotoContainer);
        imagenDatosContainer.appendChild(datosContainer);
        main.appendChild(botonesContainer);
        main.appendChild(imagenDatosContainer);
        cuerpo.appendChild(main);
    }else{
        //si no es admin
        main = document.createElement("div");
        let fotoContainer = document.createElement("div");
        let datosContainer = document.createElement("div");
        imagenDatosContainer = document.createElement("div");
        let imagenPortada = document.createElement("img");
        let originalTag = document.createElement("h1");
        let tituloTag = document.createElement("h1");
        let annoTag = document.createElement("h1");
        let duracionTag = document.createElement("h1");
        let directorTag = document.createElement("h1");
        let repartoTag = document.createElement("h1");
        let sinopsisTag = document.createElement("h1");
        let generosTag = document.createElement("h1");
        let original = document.createElement("span");
        let titulo = document.createElement("span");
        let anno = document.createElement("span");
        let duracion = document.createElement("span");
        let director = document.createElement("span");
        let reparto = document.createElement("span");
        let sinopsis = document.createElement("span");
        let generos = document.createElement("span");

        main.id="fichaPeliculamain";
        fotoContainer.id="fotoContainer";
        datosContainer.id="datosContainerFicha";
        datosContainer.classList.add("mostrarUsuarioFichaPelicula");
        imagenDatosContainer.id="imagenesDatosFicha";
        imagenPortada.id="imagenPortada";
        originalTag.innerText="Titulo original";
        tituloTag.innerText="Titulo español";
        annoTag.innerText="Año";
        duracionTag.innerText="Duraccion";
        directorTag.innerText="Director";
        repartoTag.innerText="Reparto";
        sinopsisTag.innerText="Sinopsis";
        generosTag.innerText="Generos";

        original.innerText=datos.titulooriginal;
        titulo.innerText=datos.titulocastellano;
        sinopsis.innerText=datos.sinopsis;
        generos.innerText=datos.generos;
        anno.innerText=datos.anno;
        duracion.innerText=datos.duracion;
        director.innerText=datos.director;
        reparto.innerText=datos.reparto;
        imagenPortada.src=datos.portada;

        fotoContainer.appendChild(imagenPortada);
        agreagarDivEnDiv(datosContainer,originalTag,original);
        agreagarDivEnDiv(datosContainer,tituloTag,titulo);
        agreagarDivEnDiv(datosContainer,sinopsisTag,sinopsis);
        agreagarDivEnDiv(datosContainer,generosTag,generos);
        agreagarDivEnDiv(datosContainer,annoTag,anno);
        agreagarDivEnDiv(datosContainer,duracionTag,duracion);
        agreagarDivEnDiv(datosContainer,directorTag,director);
        agreagarDivEnDiv(datosContainer,repartoTag,reparto);
        imagenDatosContainer.appendChild(fotoContainer);
        imagenDatosContainer.appendChild(datosContainer);
        main.appendChild(imagenDatosContainer);
        cuerpo.appendChild(main); 
    }

    //agregar a la pagina
    puntuacionContainer.appendChild(valorarCab);
    puntuacionContainer.appendChild(puntuacionSlider);
    puntuacionContainer.appendChild(puntuacionUsuario);
    puntuacionContainer.appendChild(eliminarPuntuacion);
    puntuacionContainer.appendChild(puntuacionMediaCab);
    puntuacionContainer.appendChild(puntuacionMedia);
    imagenDatosContainer.appendChild(puntuacionContainer);
    comentarioUsuarioContainer.appendChild(comentarioUsuarioInput);
    comentarioUsuarioContainer.appendChild(comentarioUsuarioEnviar);
    comentariosContainer.appendChild(comentariosTitulo);
    comentariosContainer.appendChild(comentarioUsuarioContainer);
    comentariosContainer.appendChild(comentariosUsuariosContainer);
    main.appendChild(comentariosContainer);

    mostrarPie();
}

function mostrarTarjetaPortadaFicha(portada){
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
        if(archivo===null){
            todo.remove();
        }else if(archivo){
            let reader= new FileReader();
            reader.onload=()=>{
                console.log(reader.result)
                let codificado = reader.result;
                portada.src=codificado
                todo.remove();
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

function mostrarPaginaPrincipal(){
    masValorada().then(peliculas=>{
        let main=document.createElement("div");
        let masValoradaTitulo= document.createElement("h1");
        let imageSlider=document.createElement("div");

        main.id="principal";
        imageSlider.classList.add("slideshow-container");

        masValoradaTitulo.innerText="Mejor valoradas";

        
            peliculas.forEach(pelicula => {
                let sliderContentContenedor= document.createElement("div");
                let portadaSlider= document.createElement("img");
                let textoSlider= document.createElement("div");

                sliderContentContenedor.classList.add("mySlides");
                sliderContentContenedor.classList.add("fade");
                portadaSlider.classList.add("imageSlider");
                textoSlider.classList.add("text");
                
                portadaSlider.src=pelicula.portada;
                textoSlider.innerText=pelicula.titulocastellano;

                sliderContentContenedor.appendChild(portadaSlider);
                sliderContentContenedor.appendChild(textoSlider);
                imageSlider.appendChild(sliderContentContenedor);
            });

        main.appendChild(masValoradaTitulo);
        main.appendChild(imageSlider);
        cuerpo.appendChild(main);
        mostrarPie();
        showSlides(slideIndex);
    });
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
    }).then(respuesta =>{
        if(respuesta === 1){
            alert("Contraseña cambiada");
        }else{
            alert("Error al cambiar la contraseña");
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
            if(respuesta.isadmin*1 === 1){
                resolve(true);
            }else{
                resolve(false);
            }
        });
    });
}

function agregarPeliula(original,titulo,anno,duracion,director,reparto,sinopsis,generos,imagenPortada){
    let datos ={
        usuario: usuarioToken(),
        original: original,
        titulo: titulo,
        duracion: duracion,
        anno: anno,
        director: director,
        reparto: reparto,
        sinopsis: sinopsis,
        generos: generos,
        imagen: imagenPortada
    }
    fetch("http://localhost/alexcines/api/peliculas/agregarPelicula",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(datos)})
    .then(response => {
        if(!response.ok){
            console.error("Error al agregar pelicula");
        }else{
            return response.json();
        }
    }).then(respuesta =>{
        if(respuesta === 1){
            alert("Pelicula agregada correctamente");
        }else{
            alert("Error al guardar pelicula");
        }
    });
}

function buscarElementos(tipo, contenido){
    let datos ={
        tipo: tipo,
        contenido: contenido
    }

    if(tipo === "nombre"){
        return fetch("http://localhost/alexcines/api/api/buscarPorNombre",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(datos)})
        .then(response => {
            if(!response.ok){
                console.error("Error al agrgar pelicula");
            }else{
                return response.json();
            }
        });
    }else{
        return fetch("http://localhost/alexcines/api/peliculas/buscarPeliculas",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(datos)})
        .then(response => {
            if(!response.ok){
                console.error("Error al buscar");
            }else{
                return response.json();
            }
        });
    } 
}

function eliminarUsuario(id){
    let datos ={
        id: id,
    }
    fetch("http://localhost/alexcines/api/api/deleteUser",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(datos)})
    .then(response => {
        if(!response.ok){
            console.error("Error al borrar usuario");
        }else{
            return response.json();
        }
    }).then(respuesta =>{
        if(respuesta === 1){
            cargarPantallaPrincipal();
            alert("Usuario eliminado correctamente");
        }else{
            alert("Error al eliminar usuario");
        }
    });
}

function actualizarUsuario(id,mail,nombre,admin,clave,imagen){
    let datos ={
        id: id,
        mail: mail,
        nombre: nombre,
        admin: admin,
        clave: clave,
        imagen: imagen
    }
    fetch("http://localhost/alexcines/api/api/updateUser",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(datos)})
    .then(response => {
        if(!response.ok){
            console.error("Error al actualizar usuario");
        }else{
            return response.json();
        }
    }).then(respuesta =>{
        if(respuesta===1){
            alert("Usuario actualizado correctamente");
        }else{
            alert("Error al actualizado usuario");
        }
    });
}

function agreagarDivEnDiv(div,...args){
    let nuevo=document.createElement("div");
    Array.from(args).forEach(argumento => {
        nuevo.appendChild(argumento);
    });
    div.appendChild(nuevo);
}

function delelePelicula(id){
    let datos ={
        id: id
    }
    fetch("http://localhost/alexcines/api/peliculas/deletepelicula",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(datos)})
    .then(response => {
        if(!response.ok){
            console.error("Error al eliminar pelicula");
        }else{
            return response.json();
        }
    }).then(respuesta =>{
        if(respuesta===1){
            cargarPantallaPrincipal();
            alert("Pelicula eliminada correctamente");
        }else{
            alert("Error al eliminar pelicula");
        }
    });
}

function updatePelicula(id,original,castellano,anno,duracion,director,reparto,sinopsis,portada,generos){
    let datos ={
        id: id,
        original: original,
        castellano: castellano,
        anno: anno,
        duracion: duracion,
        director: director,
        reparto: reparto,
        sinopsis: sinopsis,
        portada: portada,
        generos: generos
    }
    fetch("http://localhost/alexcines/api/peliculas/updatepelicula",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(datos)})
    .then(response => {
        if(!response.ok){
            console.error("Error al actualizar pelicula");
        }else{
            return response.json();
        }
    }).then(respuesta =>{
        if(respuesta===1){
            alert("Pelicula actualizada correctamente");
        }else{
            alert("Error al actualizar pelicula");
        }
    });
}

function insertarPuntuacion(id,puntuacion){
    let datos ={
        id: id,
        usuario: usuarioToken(),
        puntuacion: puntuacion
    }
    return fetch("http://localhost/alexcines/api/puntuacion/insertPuntuacion",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(datos)})
    .then(response => {
        if(!response.ok){
            console.error("Error al insertar puntuacion");
        }else{
            return response.json();
        }
    }).then(respuesta =>{
        if(respuesta===1){
            alert("Puntuacion insertada correctamente");
        }else{
            alert("Error al insertar puntuacion");
        }
    });
}

function getPuntuacion(id){
    let datos ={
        id: id,
        usuario: usuarioToken()
    }
    return fetch("http://localhost/alexcines/api/puntuacion/getPuntuacion",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(datos)})
    .then(response => {
        if(!response.ok){
            console.error("Error al conseguir puntuacion");
        }else{
            return response.json();
        }
    });
}

function getPuntuacionMedia(id){
    let datos ={
        id: id
    }
    return fetch("http://localhost/alexcines/api/puntuacion/getPuntuacionMedia",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(datos)})
    .then(response => {
        if(!response.ok){
            console.error("Error al conseguir puntuacion media");
        }else{
            return response.json();
        }
    });
}

function deletePuntuacion(id){
    let datos ={
        id: id,
        usuario: usuarioToken()
    }
    return fetch("http://localhost/alexcines/api/puntuacion/deletePuntuacion",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(datos)})
    .then(response => {
        if(!response.ok){
            console.error("Error al eliminar puntuacion");
        }else{
            return response.json();
        }
    }).then(respuesta =>{
        if(respuesta===1){
            alert("Puntuacion eliminada correctamente");
        }else{
            alert("Error al eliminar puntuacion");
        }
    });
}

function insertarComentario(id,comentario){
    let datos ={
        id: id,
        usuario: usuarioToken(),
        comentario: comentario
    }
    return fetch("http://localhost/alexcines/api/comentario/insertComentario",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(datos)})
    .then(response => {
        if(!response.ok){
            console.error("Error al insertar comentario");
        }else{
            return response.json();
        }
    }).then(respuesta =>{
        if(respuesta===1){
            alert("Comentario insertada correctamente");
        }else{
            alert("Error al insertar comentario");
        }
    });
}

function getComentarios(id){
    let datos ={
        id: id
    }
    return fetch("http://localhost/alexcines/api/comentario/getComentarios",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(datos)})
    .then(response => {
        if(!response.ok){
            console.error("Error al conseguir comentarios");
        }else{
            return response.json();
        }
    });
}

function deleteComentario(id){
    let datos ={
        id: id
    }
    return fetch("http://localhost/alexcines/api/comentario/deleteComentario",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(datos)})
    .then(response => {
        if(!response.ok){
            console.error("Error al eliminar comentario");
        }else{
            return response.json();
        }
    }).then(respuesta =>{
        if(respuesta===1){
            alert("Comentario eliminado correctamente");
        }else{
            alert("Error al eliminar comentario");
        }
    });
}

function updateComentario(id,comentario){
    let datos ={
        id: id,
        comentario: comentario
    }
    return fetch("http://localhost/alexcines/api/comentario/updateComentario",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(datos)})
    .then(response => {
        if(!response.ok){
            console.error("Error al modificar comentario");
        }else{
            return response.json();
        }
    }).then(respuesta =>{
        if(respuesta===1){
            alert("Comentario modificado correctamente");
        }else{
            alert("Error al modificar comentario");
        }
    });
}

function masValorada(){
    return fetch("http://localhost/alexcines/api/peliculas/masValorada",{method:"POST", headers:{"Content-Type":"application/json"}})
    .then(response => {
        if(!response.ok){
            console.error("Error al modificar comentario");
        }else{
            return response.json();
        }
    });
}