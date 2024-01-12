<?php

class apimodelo{ 
    private $bd;
    public function __construct()
    {
        $this->bd = new Db();
    }

    public function validarlogin($usuario,$contrasena){
        $this->bd->query("select nombre, clave from usuarios where nombre ='".$usuario."' and clave = '".sha1($contrasena)."'");
        $user=$this->bd->registro();
            if(isset($user->nombre) && isset($user->clave)){
                session_start();
                return true;
            }
        return false;
    }

    public function registrar($usuario){
        $this->bd->query("insert into usuarios (nombre, mail, clave) values('".$usuario["usuario"]."', '".$usuario["email"]."', '".$usuario["clave"]."')");
        $this->bd->execute();
    }

    public function getDatosUsuario($usuario){
        $this->bd->query("select nombre, mail, clave, fotoPerfil from usuarios where nombre = '".$usuario."'");
        return $this->bd->registro();
    }
}