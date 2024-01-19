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

    public function cambiarFoto($archivo,$usuario){
        $this->bd->query("update usuarios set fotoPerfil = '".$archivo."' where nombre ='".$usuario."'");
        return $this->bd->execute();
    }

    public function quitarFoto($usuario){
        $this->bd->query("update usuarios set fotoPerfil = null where nombre ='".$usuario."'");
        return $this->bd->execute();
    }

    public function cambiarClave($usuario,$clave){
        $this->bd->query("update usuarios set clave ='".$clave."' where nombre ='".$usuario."'");
        return $this->bd->execute();
    }

    public function comprobarAdmin($usuario){
        $this->bd->query("select isadmin from usuarios where nombre ='".$usuario."'");
        return $this->bd->registro();
    }

    public function buscarPorNombre($tipo, $contenido){
        $sql= "select id,nombre,mail,isAdmin,fotoPerfil from usuarios where UPPER($tipo) like UPPER('%$contenido%');";
        $this->bd->query($sql);
        return $this->bd->registros();
    }

    public function setToken($usuario,$token){
        $this->bd->query("update usuarios set token ='$token' where nombre ='".$usuario."'");
        return $this->bd->execute();
    }

    public function deleteUser($id){
        $query="delete from usuarios where id=$id;";
        $this->bd->query($query);
        return $this->bd->execute();
    }

    public function updateUser($id,$mail,$nombre,$admin,$clave,$imagen){
        if($clave=="" || $clave ==null){
            $query="update usuarios set mail='$mail',nombre ='$nombre',isAdmin = $admin,fotoPerfil ='$imagen' where id =$id;";
        }else{
            $clave = sha1($clave);
            $query="update usuarios set mail='$mail',nombre ='$nombre',isAdmin = $admin, fotoPerfil ='$imagen', clave='$clave' where id =$id;";
        }
        
        $this->bd->query($query);
        return $this->bd->execute();
    }
}