<?php

//Configuración acceso a base de datos
define('DB_HOST', 'localhost'); //tu servidor de BD.
define('DB_USUARIO', 'root');
define('DB_PASSWORD', '');
define('DB_NOMBRE', 'logrocines'); // Tu base de datos



//Ruta de la aplicación. /app o /src
define('RUTA_APP', dirname(dirname(__FILE__))); 

//Ruta url Ejemplo: http://localhost/ud5/mvc2app
//define ('RUTA_URL', '_URL_');
define ('RUTA_URL', 'http://localhost/alexcines/api');

//define ('NOMBRESITIO', '_NOMBRE_SITIO');
define ('NOMBRESITIO', 'API');


define ('JWTKEY', "dfu438ry8b8qtb91nsdf1831ads34");

// Cargar archivo INI si es necesario.
//$config = parse_ini_file(RUTA_APP . '/config/config.ini', true);

// Otras configuraciones iniciales pueden ir aquí