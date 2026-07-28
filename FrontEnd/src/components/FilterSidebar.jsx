import { useEffect, useState } from "react";
import api from "../api/axiosInstance";

function FilterSidebar({ filters, onFilterChange, onClearFilters }) {
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [genreRes, langRes] = await Promise.all([
          api.get("/genres"),
          api.get("/languages"),
        ]);
        setGenres(genreRes.data);
        setLanguages(langRes.data);
      } catch (err) {
        console.log("Could not load filter options", err);
      }
    };

    loadFilters();
  }, []);

  return (
    <div
      style={{
        width: "240px",
        flexShrink: 0,
        padding: "20px",
        borderRight: "1px solid #e5e7eb",
        background: "#fff",
        height: "fit-content",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h4 style={{ margin: 0 }}>Filters</h4>
        <button
          onClick={onClearFilters}
          style={{
            border: "none",
            background: "transparent",
            color: "#7c3aed",
            fontSize: "0.8rem",
            cursor: "pointer",
          }}
        >
          Clear all
        </button>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <h5 style={{ marginBottom: "10px", color: "#374151" }}>Genre</h5>
        {genres.length === 0 && <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>No genres yet</p>}
        {genres.map((g) => (
          <label
            key={g.genreId}
            style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", fontSize: "0.9rem", cursor: "pointer" }}
          >
            <input
              type="radio"
              name="genreFilter"
              checked={filters.genreId === g.genreId}
              onChange={() => onFilterChange({ genreId: g.genreId })}
            />
            {g.genreDesc}
          </label>
        ))}
      </div>

      <div style={{ marginBottom: "24px" }}>
        <h5 style={{ marginBottom: "10px", color: "#374151" }}>Language</h5>
        {languages.length === 0 && <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>No languages yet</p>}
        {languages.map((l) => (
          <label
            key={l.languageId}
            style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", fontSize: "0.9rem", cursor: "pointer" }}
          >
            <input
              type="radio"
              name="languageFilter"
              checked={filters.languageId === l.languageId}
              onChange={() => onFilterChange({ languageId: l.languageId })}
            />
            {l.languageDesc}
          </label>
        ))}
      </div>

      <div style={{ marginBottom: "24px" }}>
        <h5 style={{ marginBottom: "10px", color: "#374151" }}>Price Range</h5>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ""}
            onChange={(e) => onFilterChange({ minPrice: e.target.value })}
            style={{ width: "50%", padding: "6px 8px", borderRadius: "6px", border: "1px solid #d1d5db" }}
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ""}
            onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
            style={{ width: "50%", padding: "6px 8px", borderRadius: "6px", border: "1px solid #d1d5db" }}
          />
        </div>
      </div>

      <div>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={!!filters.isRentable}
            onChange={(e) => onFilterChange({ isRentable: e.target.checked ? true : undefined })}
          />
          Rentable only
        </label>
      </div>
    </div>
  );
}

export default FilterSidebar;