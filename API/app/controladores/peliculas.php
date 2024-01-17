<?php
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

class peliculas extends Controlador{
    private $apimodelo;
    public function __construct(){
        $this->apimodelo = $this->modelo('apimodelo');
    }

    public function index(){
        
    }

    public function agregarPelicula(){
        try{
            $jsonDatos =file_get_contents("php://input");
            $json=json_decode($jsonDatos,true);
            $original = $json["original"];
            $titulo = $json["titulo"];
            $duraccion = $json["duraccion"];
            $anno = $json["anno"];
            $director = $json["director"];
            $reparto = $json["reparto"];
            $sinopsis = $json["sinopsis"];
            $generos = $json["generos"];
            $imagen = $json["imagen"];
            
            $datos = $this->apimodelo->agregarPelicula($original,$titulo,$duraccion,$director,$reparto,$sinopsis,$generos,$imagen,$anno);
            echo json_encode($datos);
        }catch(Exception $e){
            echo json_encode($e);
        }
    }
}