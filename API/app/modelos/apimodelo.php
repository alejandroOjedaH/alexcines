<?php

class apimodelo{ 
    private $bd;
    public function __construct()
    {
        $this->bd = new Db();
    }

    public function validarlogin($usuario,$contrasena){
            $this->bd->query("select nombre, clave from usuarios where nombre ='".$usuario."' and clave = '".$contrasena."'");
            foreach($this->bd->registros() as $row){
                if(isset($row["nombre"]) && isset($row["clave"])){
                    session_start();
                    return true;
                }
            }
        return false;
    }
}