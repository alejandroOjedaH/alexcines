<?php
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

class peliculas extends Controlador{
    private $peliculasmodelo;
    public function __construct(){
        $this->peliculasmodelo = $this->modelo('peliculasmodelo');
    }

    public function index(){
        
    }

    public function agregarPelicula(){
        try{
            $jsonDatos =file_get_contents("php://input");
            $json=json_decode($jsonDatos,true);
            $original = $json["original"];
            $titulo = $json["titulo"];
            $duracion = $json["duracion"];
            $anno = $json["anno"];
            $director = $json["director"];
            $reparto = $json["reparto"];
            $sinopsis = $json["sinopsis"];
            $generos = $json["generos"];
            $imagen = $json["imagen"];
            
            $this->peliculasmodelo->agregarPelicula(str_replace("'","",$original),str_replace("'","",$titulo),$duracion,$director,$reparto,str_replace("'","",$sinopsis),$generos,$imagen,intval($anno));
            echo 1;
        }catch(Exception $e){
            echo 0;
        }
    }

    public function buscarPeliculas(){
        try{
            $jsonDatos =file_get_contents("php://input");
            $json=json_decode($jsonDatos,true);
            $tipo = $json["tipo"];
            $contenido = $json["contenido"];
            
            $datos = $this->peliculasmodelo->buscarPeliculas($tipo,$contenido);
            echo json_encode($datos);
        }catch(Exception $e){
            echo 0;
        }
    }
}