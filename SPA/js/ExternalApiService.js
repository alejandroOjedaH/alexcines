class ExternalApiService {
    tmdbApiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5N2VlYTcwZTgyZGM1NGMyMTEyZmJkNDEyYjRmNjQxZiIsInN1YiI6IjY1YTZjOTdlZWE4OWY1MDEyNGU1YzMwYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8jQUhKQpg_Kc4MnZKPAOThExI9RJBU7GWwppaTW6uR8';
    omdbApiKey = '7fab66d1';
 
    movieTitlesESP = null;
    resumenesESP = null;
    movies = [];
 
 
    async getPeliculas(title) {
        this.movies.push(await this.fetchMovies(title));
 
        const allMovies = this.movies;
        const mapaDeGeneros = {
            "Action": "Acción",
            "Adventure": "Aventura",
            "Animation": "Animación",
            "Biography": "Biografía",
            "Comedy": "Comedia",
            "Crime": "Crimen",
            "Documentary": "Documental",
            "Family": "Familia",
            "Fantasy": "Fantasía",
            "History": "Historia",
            "Horror": "Terror",
            "Music": "Música",
            "Mystery": "Misterio",
            "Sci-Fi": "Ciencia ficción",
            "Short": "Cortometraje",
            "Thriller": "Suspense",
            "War": "Guerra",
            "Western": "Western"
          };
         
        let peliculas = allMovies.map((movie, index) => {
            const { Error, Awards, Poster, Actors, Title, Genre, Year, Runtime, Director, BoxOffice, Country, DVD, Language, Metascore, Plot, Production, Rated, Ratings, Released, Response, Type, Website, Write, Writer, imdbID, imdbRating, imdbVotes } = movie;
            if (!Error) {
                const ActorsSplited = Actors.split(", ");
                const GenresSplited = Genre.split(", ");
 
                GenresSplited.forEach((genre, index) => {
                    if (mapaDeGeneros[genre]) {
                        GenresSplited[index] = mapaDeGeneros[genre];
                    }
                });
               
                return {
                    title: Title,
                    titEspanol: this.movieTitlesESP,
                    sinopsis: this.resumenesESP,
                    reparto: ActorsSplited,
                    genero: GenresSplited,
                    duracion: Runtime ? parseInt(Runtime) : null,
                    ano: Year,
                    director: Director,
                    imagenPortada:Poster
                };
            }
 
        });
 
        return peliculas[0];
    }
    async fetchMovies(title) {
        try {
            const tmdbUrl = `https://api.themoviedb.org/3/search/movie?query=${title}&language=es-ES`;
            const tmdbOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.tmdbApiKey}`
                }
            };
 
            const tmdbResponse = await fetch(tmdbUrl, tmdbOptions);
            const tmdbData = await tmdbResponse.json();
 
            const movies = tmdbData.results;

            const omdbPromises = movies.map(movie => {
                if(movie.original_title.toLowerCase() === title.toLowerCase() || movie.title.toLowerCase() === title.toLowerCase() ){
                    this.movieTitlesESP = movie.title;
                    this.resumenesESP = movie.overview;
                    const omdbUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(movie.original_title)}&plot=full&apikey=${this.omdbApiKey}`;
                    return fetch(omdbUrl).then(response => response.json());
                }
            });  
            const omdbResponses = await Promise.all(omdbPromises);
            this.movies = this.movies.concat(omdbResponses);
        } catch (error) {
            console.error('Error RESPONSE:', error);
            throw error;
        }
        
        this.movies = this.movies.filter(elemento => elemento !== undefined);
        return this.movies;
    }
}