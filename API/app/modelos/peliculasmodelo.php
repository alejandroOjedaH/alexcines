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

    public function updatePelicula($id,$original,$castellano,$anno,$duracion,$director,$reparto,$sinopsis,$portada,$generos){
        $sql = "update peliculas  set titulooriginal='$original', titulocastellano='$castellano', anno=$anno, duracion=$duracion, director='$director', reparto='$reparto', sinopsis='$sinopsis',portada='$portada', generos='$generos'  where id =$id;";
        $this->bd->query($sql);
        return $this->bd->execute();
    }

    public function masValorada(){
        $sql = "select peli.id, COALESCE(comen.contada,0)+COALESCE(puntu.contada,0) as valorada, peli.portada, peli.titulocastellano
        from peliculas peli 
        left join (select c.id_pelicula,count(c.comentario) contada from comentarios c group by c.id_pelicula) as comen on comen.id_pelicula = peli.id
        left join (select p.id_pelicula, count(p.id_pelicula) contada from puntuacion p group by p.id_pelicula) as puntu on puntu.id_pelicula = peli.id
        group by peli.id
        having valorada !=0
        order by valorada desc
        limit 10;";
        $this->bd->query($sql);
        return $this->bd->registros();
    }
}