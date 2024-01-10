<?php

class apimodelo{ 
    private $bd;
    public function __construct()
    {
        $this->bd = new Db();
    }

    public function validarlogin($usuario,$contrasena){
            $this->bd->query("select correo, clave from restaurante where correo ='".$usuario."' and clave = '".$contrasena."'");
            foreach($this->bd->registros() as $row){
                if(isset($row["correo"]) && isset($row["clave"])){
                    session_start();
                    $_SESSION["username"] = $row["correo"];
                    $_SESSION["clave"] = $row["clave"];
                    $_SESSION["logeado"] = true;
                    $_SESSION["carrito"] = [];
                    return true;
                }
            }
        return false;
    }
}