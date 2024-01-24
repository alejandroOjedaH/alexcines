<?php

class puntuacionmodelo{ 
    private $bd;
    public function __construct()
    {
        $this->bd = new Db();
    }

    public function insertPuntuacion($id,$usuarioId,$puntuacion){
        $query="insert into puntuacion (id_usuario,id_pelicula,puntuacion) values($usuarioId,$id,$puntuacion);";
        $this->bd->query($query);
        return $this->bd->execute();
    }

    public function updatePuntuacion($id,$usuarioId,$puntuacion){
        $query="update puntuacion set puntuacion=$puntuacion where id_usuario = $usuarioId and id_pelicula =$id;";
        $this->bd->query($query);
        return $this->bd->execute();
    }

    public function getPuntuacion($id,$usuarioId){
        try{
            $query="select puntuacion from puntuacion where id_usuario = $usuarioId and id_pelicula =$id;";
            $this->bd->query($query);
            return $this->bd->registro();
        }catch(Exception $e){
            return false;
        }
    }

    public function getPuntuacionMedia($id){
        $query="select sum(p.puntuacion)/count(p.id_usuario) as media from puntuacion p where p.id_pelicula = $id group by p.id_pelicula;";
        $this->bd->query($query);
        return $this->bd->registro();
    }

    public function deletePuntuacion($id,$usuarioId){
        $query="delete from puntuacion where id_usuario = $usuarioId and id_pelicula =$id;";
        $this->bd->query($query);
        return $this->bd->registro();
    }
}