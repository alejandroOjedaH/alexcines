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

    public function deletePelicula(){
        try{
            $jsonDatos =file_get_contents("php://input");
            $json=json_decode($jsonDatos,true);
            $id = $json["id"];
            
            $this->peliculasmodelo->deletePelicula($id);
            echo 1;
        }catch(Exception $e){
            echo 0;
        }
    }

    public function updatePelicula(){
        try{
            $jsonDatos =file_get_contents("php://input");
            $json=json_decode($jsonDatos,true);
            $id = $json["id"];
            $original= $json["original"];
            $castellano= $json["castellano"];
            $anno= $json["anno"];
            $duracion= $json["duracion"];
            $director= $json["director"];
            $reparto= $json["reparto"];
            $sinopsis= $json["sinopsis"];
            $portada= $json["portada"];
            $generos= $json["generos"];
            
            $this->peliculasmodelo->updatePelicula($id,$original,$castellano,$anno,$duracion,$director,$reparto,$sinopsis,$portada,$generos);
            echo 1;
        }catch(Exception $e){
            echo 0;
        }
    }

    public function masValorada(){
        try{          
            $datos = $this->peliculasmodelo->masValorada();
            echo json_encode($datos);
        }catch(Exception $e){
            echo 0;
        }
    }
}