<?php
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

class comentario extends Controlador{
    private $comentariomodelo;
    private $apimodelo;
    public function __construct(){
        $this->comentariomodelo = $this->modelo('comentariomodelo');
        $this->apimodelo = $this->modelo('apimodelo');
    }

    public function index(){
        
    }

    public function insertComentario(){
        try{
            $jsonDatos =file_get_contents("php://input");
            $json=json_decode($jsonDatos,true);
            $id = $json["id"];
            $usuario= $json["usuario"];
            $comentario= $json["comentario"];

            $usuarioId= $this->apimodelo->getUsuarioId($usuario);
            $usuarioId= intval($usuarioId->id);
            
            $this->comentariomodelo->insertComentario($id,$usuarioId,$comentario);
            echo 1;
        }catch(Exception $e){
            echo 0;
        }
    }

    public function getComentarios(){
        try{
            $jsonDatos =file_get_contents("php://input");
            $json=json_decode($jsonDatos,true);
            $id = $json["id"];
            
            $respuesta=$this->comentariomodelo->getcomentarios($id);

            echo json_encode($respuesta);
        }catch(Exception $e){
            echo 0;
        }
    }

    public function deleteComentario(){
        try{
            $jsonDatos =file_get_contents("php://input");
            $json=json_decode($jsonDatos,true);
            $id = $json["id"];

            $this->comentariomodelo->deleteComentario($id);
            echo 1;
        }catch(Exception $e){
            echo 0;
        }
    }

    public function updateComentario(){
        try{
            $jsonDatos =file_get_contents("php://input");
            $json=json_decode($jsonDatos,true);
            $id = $json["id"];
            $comentario= $json["comentario"];

            $this->comentariomodelo->updateComentario($id,$comentario);
            echo 1;
        }catch(Exception $e){
            echo 0;
        }
    }
}