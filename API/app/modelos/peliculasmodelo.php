<?php

class peliculasmodelo{ 
    private $bd;
    public function __construct()
    {
        $this->bd = new Db();
    }

    public function agregarPelicula($original,$titulo,$duracion,$director,$reparto,$sinopsis,$generos,$imagen,$anno){
        $sql = "insert into peliculas (titulooriginal,titulocastellano,anno,duracion,director,reparto,sinopsis,portada,generos) values('$original','$titulo',$anno,$duracion,'$director','$reparto','$sinopsis','$imagen','$generos');";
        $this->bd->query($sql);
        return $this->bd->execute();
    }

    public function buscarPeliculas($tipo, $contenido){
        $sql= "select * from peliculas where UPPER($tipo) like UPPER('%$contenido%');";
        $this->bd->query($sql);
        return $this->bd->registros();
    }

    public function deletePelicula($id){
        $sql = "delete from peliculas where id = $id;";
        $this->bd->query($sql);
        return $this->bd->execute();
    }
}