<?php

class comentariomodelo{ 
    private $bd;
    public function __construct()
    {
        $this->bd = new Db();
    }

    public function insertComentario($id,$usuarioId,$comentario){
        $query="insert into comentarios (id_usuario,id_pelicula,comentario) values($usuarioId,$id,'$comentario');";
        $this->bd->query($query);
        return $this->bd->execute();
    }

    public function getComentarios($id){
        $query="select u.nombre,c.comentario,u.fotoPerfil,c.id from comentarios c inner join usuarios u on u.id = c.id_usuario where c.id_pelicula=$id;";
        $this->bd->query($query);
        return $this->bd->registros();
    }

    public function deleteComentario($id){
        $query="delete from comentarios where id=$id;";
        $this->bd->query($query);
        return $this->bd->registro();
    }

    public function updateComentario($id,$comentario){
        $query="update comentarios set comentario='$comentario' where id=$id;";
        $this->bd->query($query);
        return $this->bd->execute();
    }
}