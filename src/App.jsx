import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState("");

  const API_KEY = "43e6549d511b779a98d0bde8ddf5a9a6";

  // Load 20 Trending Movies
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`;
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

      setTrending([]); 
    } catch (err) {
      console.error("Error fetching movies:", err);
      setWarning("⚠️ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex p-0 m-0 text-white">
      <div className="w-[100%] flex flex-col p-4 items-center justify-center ">
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-red-600 font-bold mb-6">
          SEARCHFLIX
        </h1>

        <div className="w-full flex">
          <div className="flex w-[90%] h-fit flex-col ">

            
            <div className="flex w-full mb-4">
              <input
                type="text"
                placeholder="Search movie..."
                className="bg-black/30 backdrop-blur-lg border border-white/10  p-4 text-2xl font-bold capitalize rounded-3xl w-[95%] text-white outline-0  
                hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)] 
                focus:shadow-[0_15px_30px_rgba(255,165,0,0.6)] 
                transition-shadow duration-300 ease-in-out"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
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
              <div className="mt-10 w-full flex flex-col items-center ">
                <h2 className="text-3xl font-bold text-orange-800 mb-6">
                  Trending Movies 🔥
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                  {trending.map((movie) => (
                    <div
                      key={movie.id}
                      className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6 p-4 rounded-xl shadow-xl flex flex-col items-center transition-all duration-400 hover:scale-110 shadow-[10px_10px_10px_10px_25px] shadow-black" 
                    >
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                            : "https://via.placeholder.com/300x450?text=No+Image"
                        }
                        className="w-[150px] h-[170px] rounded-lg transi duration-500 hover:scale-110 "
                      />

                      <div className="mt-3 text-center">
                        <h2 className="text-2xl font-bold text-yellow-400">
                          {movie.title}
                        </h2>

                        <p className="mt-2 text-gray-400">
                          ⭐ Rating: {movie.vote_average}
                        </p>

                        <button className="mt-3 bg-red-600 px-4 py-2 rounded-lg text-white font-bold hover:bg-red-800 transition-all">
                          <a href="https://support.strikingly.com/hc/article_attachments/28715460014491" className="cursor-pointer">Watch Trailer</a>
                        </button>
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
                      className="bg-glass p-4 rounded-xl shadow-xl flex flex-col items-center transition-all duration-400 hover:scale-110"
                    >
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                            : "https://via.placeholder.com/300x450?text=No+Image"
                        }
                        className="w-[150px] h-[150px] rounded-lg transition-all duration-500 hover:scale-110"
                      />

                      <div className="mt-3 text-center">
                        <h2 className="text-2xl font-bold text-yellow-400 transition-all duration-500 hover:text-teal-600">
                          {movie.title}
                        </h2>

                        <p className="mt-2 text-gray-400">
                          ⭐ Rating: {movie.vote_average}
                        </p>

                        <p className="text-gray-400">
                          📅 Release: {movie.release_date}
                        </p>

                        <button className="mt-3 bg-red-600 px-4 py-2 rounded-lg text-white font-bold hover:bg-red-800 transition-all">
                          <a href="https://support.strikingly.com/hc/article_attachments/28715460014491">Watch Trailer</a>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
