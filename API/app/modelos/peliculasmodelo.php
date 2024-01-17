<?php

class peliculasmodelo{ 
    private $bd;
    public function __construct()
    {
        $this->bd = new Db();
    }

    public function agregarPelicula($original,$titulo,$duraccion,$director,$reparto,$sinopsis,$generos,$imagen,$anno){
        $this->bd->query("insert into peliculas (titulooriginal,titulocastellano,anno,duraccion,director,reparto,sinopsis,portada,generos)" 
        .`values($original,$titulo,$anno,$duraccion,$director,$reparto,$sinopsis,$imagen,$generos);`);
        return $this->bd->registro();
    }
}