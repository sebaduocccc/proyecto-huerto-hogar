import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar(){
    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        const q = query.trim();
        if (!q) return;
        navigate(`/productos?q=${encodeURIComponent(q)}`);
    };

    return(
        <form className="d-flex ms-lg-3 my-2 my-lg-0" role="search" onSubmit={handleSubmit}>
            <input 
                type="search"
                className="form-control me-2"
                placeholder="Buscar..."
                aria-label="Buscar..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-primary" type="submit" aria-label="Buscar">
                <i className="fa-solid fa-magnifying-glass"></i>
            </button>
        </form>
    );

}