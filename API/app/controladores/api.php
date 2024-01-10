<?php
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

class api extends Controlador{
    private $categoriasmodelo;
    private $apimodelo;
    public function __construct(){
        $this->categoriasmodelo = $this->modelo('categoriasmodelo');
        $this->apimodelo = $this->modelo('apimodelo');
    }

    public function index(){
        $this->login();
    }

    public function login(){
        if($_SERVER["REQUEST_METHOD"]=="POST"){
            $jsonDatos =file_get_contents("php://input");
            $json=json_decode($jsonDatos,true);

            if($json===null|| !isset($json["usuario"]) || !isset($json["password"])){
                echo "Error en el Json";
            }else if($this->apimodelo->validarlogin($json["usuario"],$json["password"])){
                try{
                    $secret=JWTKEY;
                    $usuario=$json["usuario"];

                    $tiempoExpiracion =3600;
                    $payload = array(
                        "iss" => "Alejandro Ojeda",
                        "aud" => "Mi audiencia",
                        "iat" => time(),
                        "exp" => time() + $tiempoExpiracion,
                        "sub" => $usuario,
                    );

                    $token =JWT::encode($payload, $secret,'HS256');

                    echo json_encode("Bearer:".$token."");
                }catch(Exception $e){
                    echo "Error al generar el token";
                }
            }else{
                echo "No se ha podido validar correctamente";
            }
        }
    }
    public function categorias(){
        if($_SERVER["REQUEST_METHOD"]=="GET"){
            if($this->validarBearerToken()){
                $datos = $this->categoriasmodelo->categorias();
                $json=[];
                foreach ($datos as $categoria) {
                    array_push($json,$categoria);
                }
                echo json_encode($json);
            }else{
                header('HTTP/1.1 403 Unauthorized');
                header('WWW-Authenticate: Basic realm="Tienda"');
                die('Acceso denegado');
            }
        }else{
            header('HTTP/1.1 400 Bad Request');
            die('Bad Request');
        }
    }

    public function productos($cat=null){
        if($_SERVER["REQUEST_METHOD"]=="GET"){
            if($this->validarBearerToken()){
                if($cat !== null){
                    $datos = $this->categoriasmodelo->productos($cat);
                    $json=[];
                    foreach ($datos['productos'] as $producto) {
                        array_push($json,$producto);
                    }
                    echo json_encode($json);
                }
            }else{
                header('HTTP/1.1 403 Unauthorized');
                header('WWW-Authenticate: Basic realm="Tienda"');
                die('Acceso denegado');
            }
        }else{
            header('HTTP/1.1 400 Bad Request');
            die('Bad Request');
        }
    }

    public function pedidos($res){
        if($_SERVER["REQUEST_METHOD"]=="GET"){
            if($this->validarBearerToken()){
                if($res !== null){
                    $datos = $this->categoriasmodelo->devolverPedidosPorRestaurante($res);
                    echo json_encode($datos);
                }
            }else{
                header('HTTP/1.1 403 Unauthorized');
                header('WWW-Authenticate: Basic realm="Tienda"');
                die('Acceso denegado');
            }
        }else{
            header('HTTP/1.1 400 Bad Request');
            die('Bad Request');
        }
    }

    private function getAuthorizationHeader(){
        $headers = null;
        if (isset($_SERVER['Authorization'])) {
            $headers = trim($_SERVER["Authorization"]);
        }
        else if (isset($_SERVER['HTTP_AUTHORIZATION'])) { //Nginx or fast CGI
            $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
        } elseif (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            // Server-side fix for bug in old Android versions (a nice side-effect of this fix means we don't care about capitalization for Authorization)
            $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
            //print_r($requestHeaders);
            if (isset($requestHeaders['Authorization'])) {
                $headers = trim($requestHeaders['Authorization']);
            }
        }
        return $headers;
    }
    private function getBearerToken() {
        $headers = $this->getAuthorizationHeader();
        // HEADER: Get the access token from the header
        if (!empty($headers)) {
            if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
                return $matches[1];
            }
        }
        return null;
    }
    private function validarBearerToken(){
        $jwt = $this->getBearerToken();
        $secret = JWTKEY;
        try{
            JWT::decode($jwt,new Key($secret,'HS256'));
            return true;
        }catch(Exception $e){
            return false;
        }
    }
}