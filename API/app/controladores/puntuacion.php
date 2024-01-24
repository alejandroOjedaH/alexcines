<?php
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

class puntuacion extends Controlador{
    private $puntuacionmodelo;
    private $apimodelo;
    public function __construct(){
        $this->puntuacionmodelo = $this->modelo('puntuacionmodelo');
        $this->apimodelo = $this->modelo('apimodelo');
    }

    public function index(){
        
    }

    public function insertPuntuacion(){
        try{
            $jsonDatos =file_get_contents("php://input");
            $json=json_decode($jsonDatos,true);
            $id = $json["id"];
            $usuario= $json["usuario"];
            $puntuacion= $json["puntuacion"];

            $usuarioId= $this->apimodelo->getUsuarioId($usuario);
            $usuarioId= intval($usuarioId->id);
            
            if($this->puntuacionmodelo->getPuntuacion($id,$usuarioId) ===false){
                $this->puntuacionmodelo->insertPuntuacion($id,$usuarioId,floatval($puntuacion));
            }else{
                $this->puntuacionmodelo->updatePuntuacion($id,$usuarioId,floatval($puntuacion));
            }
            echo 1;
        }catch(Exception $e){
            echo 0;
        }
    }

    public function getPuntuacion(){
        try{
            $jsonDatos =file_get_contents("php://input");
            $json=json_decode($jsonDatos,true);
            $id = $json["id"];
            $usuario= $json["usuario"];

            $usuarioId= $this->apimodelo->getUsuarioId($usuario);
            $usuarioId= intval($usuarioId->id);
            
            $respuesta=$this->puntuacionmodelo->getPuntuacion($id,$usuarioId);

            if($respuesta===false){
                echo 0;
            }else{
                echo json_encode($respuesta);
            }
        }catch(Exception $e){
            echo 0;
        }
    }

    public function getPuntuacionMedia(){
        try{
            $jsonDatos =file_get_contents("php://input");
            $json=json_decode($jsonDatos,true);
            $id = $json["id"];

            $respuesta=$this->puntuacionmodelo->getPuntuacionMedia($id);
            echo json_encode($respuesta);
        }catch(Exception $e){
            echo 0;
        }
    }

    public function updatePuntuacion(){
        try{
            $jsonDatos =file_get_contents("php://input");
            $json=json_decode($jsonDatos,true);
            $id = $json["id"];
            $usuario= $json["usuario"];
            $puntuacion= $json["puntuacion"];

            $usuarioId= $this->apimodelo->getUsuarioId($usuario);
            $usuarioId= intval($usuarioId->id);

            $this->puntuacionmodelo->updatePuntuacion($id,$usuarioId,floatval($puntuacion));
            echo 1;
        }catch(Exception $e){
            echo 0;
        }
    }

    public function deletePuntuacion(){
        try{
            $jsonDatos =file_get_contents("php://input");
            $json=json_decode($jsonDatos,true);
            $id = $json["id"];
            $usuario= $json["usuario"];

            $usuarioId= $this->apimodelo->getUsuarioId($usuario);
            $usuarioId= intval($usuarioId->id);

            $this->puntuacionmodelo->deletePuntuacion($id,$usuarioId);
            echo 1;
        }catch(Exception $e){
            echo 0;
        }
    }
}