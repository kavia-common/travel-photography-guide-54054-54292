import React from 'react';
import { matchSorter } from 'match-sorter';

const sampleLocations = [
  'Paris, France', 'New York, USA', 'Tokyo, Japan', 'Sydney, Australia',
  'Reykjavík, Iceland', 'Cape Town, South Africa', 'Cusco, Peru',
  'Marrakesh, Morocco', 'Rome, Italy', 'Banff, Canada',
];

// PUBLIC_INTERFACE
export default function SearchBar({ value, onChange, placeholder = 'Search...', onSelect }) {
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const suggestions = value
    ? matchSorter(sampleLocations, value).slice(0, 6)
    : sampleLocations.slice(0, 6);

  React.useEffect(() => { setActiveIndex(0); }, [value]);

  function handleSelect(v) {
    onChange?.(v);
    onSelect?.(v);
    setOpen(false);
  }

  return (
    <div role="combobox" aria-expanded={open} aria-haspopup="listbox" aria-owns="search-suggestions" className="combobox">
      <input
        className="input"
        type="text"
        value={value}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
        onChange={(e) => onChange?.(e.target.value)}
        aria-autocomplete="list"
        aria-controls="search-suggestions"
        aria-activedescendant={open ? `sugg-${activeIndex}` : undefined}
      />
      {open && suggestions.length > 0 && (
        <ul role="listbox" id="search-suggestions" className="suggestions">
          {suggestions.map((s, idx) => (
            <li
              id={`sugg-${idx}`}
              key={s}
              role="option"
              aria-selected={idx === activeIndex}
              className={`suggestion ${idx === activeIndex ? 'active' : ''}`}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(s); }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
      <style>{`
        .combobox { position: relative; }
        .suggestions { position: absolute; top: calc(100% + 4px); left: 0; right: 0; background: var(--bg-primary); border: 1px solid var(--border); border-radius: .5rem; padding: .25rem; list-style: none; margin: 0; z-index: 20; max-height: 240px; overflow: auto; }
        .suggestion { padding: .5rem .5rem; border-radius: .375rem; cursor: pointer; }
        .suggestion:hover, .suggestion.active { background: var(--bg-secondary); }
      `}</style>
    </div>
  );
}
