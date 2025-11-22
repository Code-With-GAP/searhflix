import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState("");

  



  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [movieDetails, setMovieDetails] = useState(null);

  const API_KEY = "43e6549d511b779a98d0bde8ddf5a9a6";

  


  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&with_original_language=hi`;
        const res = await fetch(url);
        const data = await res.json();
        setTrending(data.results.slice(0, 20));
      } catch (err) {
        console.error("Error loading trending movies:", err);
      }
    };

    fetchTrending();
  }, []);

  


  const searchMovie = async () => {
    if (!query.trim()) {
      setWarning("⚠️ Please enter a movie name!");
      setMovies([]);
      return;
    }

    setWarning("");
    setLoading(true);

    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        setWarning(`⚠️ No movies found for "${query}"!`);
        setMovies([]);
      } else {
        setMovies(data.results);
      }

      
      


    } catch (err) {
      console.error("Error fetching movies:", err);
      setWarning("⚠️ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  
  

  const openMovieDetails = async (movie) => {
    setSelectedMovie(movie);
    setShowPopup(true);

    try {
      const detailsUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}`;
      const castUrl = `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${API_KEY}`;

      const [detailsRes, castRes] = await Promise.all([
        fetch(detailsUrl),
        fetch(castUrl),
      ]);

      const detailsData = await detailsRes.json();
      const castData = await castRes.json();

      setMovieDetails({
        ...detailsData,
        cast: castData.cast.slice(0, 3), 
      });
    } catch (err) {
      console.error("Error fetching movie details:", err);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setMovieDetails(null);
  };

  return (
    <div className="w-full flex p-0 m-0 text-white">
      <div className="w-full flex flex-col p-4 items-center justify-center ">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-red-700 font-bold mb-6">
          SEARCHFLIX
        </h1>

        <div className="w-full flex">
          <div className="flex w-[90%] h-fit flex-col ">
            
            

            <div className="flex w-full mb-4">
              <input
                type="text"
                placeholder="Search movie..."
                className="bg-black/30 backdrop-blur-lg border border-white/10 p-4 text-2xl font-bold capitalize rounded-3xl w-[95%] text-white outline-0  
                hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)] 
                focus:shadow-[0_15px_30px_rgba(255,165,0,0.6)] 
                transition-shadow duration-300 ease-in-out"
                value={query}
                onChange={(e) => {
                  const value = e.target.value;
                  setQuery(value);

                  
                  
                  if (!value.trim()) {
                    setMovies([]);
                    setWarning("");
                  }
                }}
                onKeyDown={(e) => e.key === "Enter" && searchMovie()}
              />

              <button
                onClick={searchMovie}
                className="w-5% cursor-pointer ml-3 bg-red-500 px-3 py-2 rounded-2xl text-3xl transition-all duration-350 hover:bg-red-700 hover:scale-110 
                shadow-[0_10px_25px_rgba(0,0,0,0.3)] 
                hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)]"
              >
                🔍
              </button>
            </div>

            {warning && (
              <p className="text-red-500 text-xl font-bold mb-4">{warning}</p>
            )}

            {loading && (
              <div className="flex justify-center items-center mt-10">
                <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            
            


            {!loading && trending.length > 0 && movies.length === 0 && (
              <div className="mt-10 w-full flex flex-col items-start ">
                <h2 className="text-3xl font-bold text-red-600 mb-6">
                  Trending Movies 🔥
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                  {trending.map((movie) => (
                    <div
                      key={movie.id}
                      onClick={() => openMovieDetails(movie)}
                      className="cursor-pointer bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6 flex flex-col items-center transition-all duration-400 hover:scale-110 shadow-[10px_10px_25px] shadow-black"
                    >
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                            : "https://via.placeholder.com/300x450?text=No+Image"
                        }
                        className="w-full h-[80%] rounded-lg transition duration-500 hover:scale-110 "
                      />

                      <div className="mt-3 text-center">
                        <h2 className="text-2xl font-bold text-yellow-400">
                          {movie.title}
                        </h2>

                        <p className="text-black font-bold ">
                          {movie.release_date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            
            

            {!loading && movies.length > 0 && (
              <div className="mt-10 w-full flex flex-col items-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                  {movies.map((movie) => (
                    <div
                      key={movie.id}
                      onClick={() => openMovieDetails(movie)}
                      className="cursor-pointer bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6 flex flex-col items-center transition-all duration-400 hover:scale-110 shadow-[10px_10px_25px] shadow-black"
                    >
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                            : "https://via.placeholder.com/300x450?text=No+Image"
                        }
                        className="w-full h-[80%] rounded-lg transition duration-500 hover:scale-110 "
                      />

                      <div className="mt-3 text-center">
                        <h2 className="text-2xl font-bold text-yellow-400 transition-all duration-500 hover:text-teal-600">
                          {movie.title}
                        </h2>

                        <p className="text-gray-400">{movie.release_date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        
        
        {showPopup && movieDetails && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex justify-center items-center z-50">
            <div className="flex bg-black/80 border border-white/20 rounded-2xl w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] p-6 relative">
              
              
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 text-white text-3xl hover:text-red-500"
              >
                ✖
              </button>

              
              
              <div className="w-[60%] pr-6 text-white">
                <h2 className="text-4xl font-bold text-yellow-400">
                  {movieDetails.title}
                </h2>

                <p className="mt-2 text-gray-300">
                  <strong>Release Date:</strong> {movieDetails.release_date}
                </p>

                <p className="mt-2 text-gray-300">
                  <strong>Rating:</strong> ⭐ {movieDetails.vote_average}
                </p>

                <p className="mt-4 text-gray-200">
                  <strong>Top Cast:</strong>
                  <ul className="list-disc ml-6 mt-2">
                    {movieDetails.cast.map((actor) => (
                      <li key={actor.id}>{actor.name}</li>
                    ))}
                  </ul>
                </p>

                <p className="mt-4 text-gray-200">
                  <strong>Description:</strong> <br />
                  {movieDetails.overview}
                </p>

                
              </div>

              
              
              <div className="w-[40%] flex justify-end">
                <img
                  src={
                    movieDetails.poster_path
                      ? `https://image.tmdb.org/t/p/w300${movieDetails.poster_path}`
                      : "https://via.placeholder.com/300x450?text=No+Image"
                  }
                  className="w-[220px] h-[330px] rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
