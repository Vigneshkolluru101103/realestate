import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check, User, Search } from 'lucide-react';
import './GlassSelect.css';

/**
 * Reusable, accessible Glassmorphism Select / Dropdown Component
 * Conforms to the ZapDocs light-theme glass design system.
 */
export default function GlassSelect({
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder = '-- Select an option --',
  prefixIcon: PrefixIcon = null,
  disabled = false,
  searchable = false,
  required = false,
  className = '',
  style = {},
  panelStyle = {},
  ariaLabel
}) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const containerRef = useRef(null);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState('');
  const [openUpward, setOpenUpward] = useState(false);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(spaceBelow < 220 && rect.top > 200);
    }
  }, [isOpen]);

  // Normalize options to { value, label, subtitle, icon, role }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { value: String(opt), label: String(opt), raw: opt };
    }
    return {
      value: opt.value !== undefined ? String(opt.value) : String(opt.id || opt.name || ''),
      label: opt.label || opt.name || String(opt.value || ''),
      subtitle: opt.subtitle || (opt.role && opt.address ? `(${opt.role} - ${opt.address})` : ''),
      icon: opt.icon,
      role: opt.role,
      raw: opt
    };
  });

  const filteredOptions = searchable && searchTerm.trim()
    ? normalizedOptions.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        (opt.subtitle && opt.subtitle.toLowerCase().includes(searchTerm.toLowerCase().trim()))
      )
    : normalizedOptions;

  const selectedOption = normalizedOptions.find(
    (opt) => String(opt.value) === String(value)
  );

  // Close when clicking outside
  useEffect(() => {
    function handlePointerDown(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handlePointerDown);
      document.addEventListener('touchstart', handlePointerDown);
    }
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isOpen]);

  // Handle option selection
  function handleSelect(optValue) {
    if (disabled) return;
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);

    if (triggerRef.current) {
      triggerRef.current.focus();
    }

    if (onChange) {
      // Pass synthetic event for standard form onChange compatibility
      const syntheticEvent = {
        target: { id: selectId, name: name || selectId, value: optValue },
        currentTarget: { id: selectId, name: name || selectId, value: optValue }
      };
      onChange(syntheticEvent, optValue);
    }
  }

  // Keyboard navigation
  function handleKeyDown(e) {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[highlightedIndex].value);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm('');
        if (triggerRef.current) triggerRef.current.focus();
        break;
      case 'Tab':
        setIsOpen(false);
        setSearchTerm('');
        break;
      default:
        break;
    }
  }

  // Auto-scroll highlighted option into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && panelRef.current) {
      const optionElements = panelRef.current.querySelectorAll('.zd-glass-select-option');
      if (optionElements[highlightedIndex]) {
        optionElements[highlightedIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  return (
    <div
      ref={containerRef}
      className={`zd-glass-select-container ${isOpen ? 'is-open' : ''} ${disabled ? 'is-disabled' : ''} ${className}`}
      style={style}
      onKeyDown={handleKeyDown}
    >
      {/* Hidden native select for FormData, tests, and programmatic access */}
      <select
        id={selectId}
        name={name || selectId}
        value={value || ''}
        onChange={(e) => handleSelect(e.target.value)}
        tabIndex={-1}
        aria-hidden="true"
        className="zd-glass-select-native"
        required={required}
      >
        <option value="">{placeholder}</option>
        {normalizedOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label} {opt.subtitle ? ` ${opt.subtitle}` : ''}
          </option>
        ))}
      </select>

      {/* Glassmorphism Trigger Button */}
      <button
        type="button"
        ref={triggerRef}
        id={`${selectId}-trigger`}
        className={`zd-glass-select-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || placeholder}
        disabled={disabled}
      >
        <div className="zd-glass-select-trigger-content">
          {PrefixIcon && (
            <span className="zd-glass-select-icon">
              {React.isValidElement(PrefixIcon) ? PrefixIcon : <PrefixIcon size={16} />}
            </span>
          )}
          <span className={`zd-glass-select-label ${!selectedOption?.value ? 'is-placeholder' : ''}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`zd-glass-select-chevron ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Floating Glassmorphism Options Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className={`zd-glass-select-panel ${openUpward ? 'open-upward' : ''}`}
          style={panelStyle}
          role="listbox"
          id={`${selectId}-listbox`}
        >
          {searchable && (
            <div className="zd-glass-select-search-wrap">
              <Search size={14} className="zd-glass-select-search-icon" />
              <input
                type="text"
                className="zd-glass-select-search-input"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setHighlightedIndex(0);
                }}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          )}

          {/* Placeholder / Empty option */}
          <div
            className={`zd-glass-select-option ${!value ? 'is-selected' : ''}`}
            role="option"
            aria-selected={!value}
            onClick={() => handleSelect('')}
          >
            <span className="zd-glass-select-option-dash">--</span>
            <span className="zd-glass-select-option-text is-placeholder-text">
              {placeholder}
            </span>
            {!value && <Check size={14} className="zd-glass-select-check" />}
          </div>

          {filteredOptions.length === 0 ? (
            <div className="zd-glass-select-empty">No options found</div>
          ) : (
            filteredOptions.map((opt, index) => {
              const isSelected = String(opt.value) === String(value);
              const isHighlighted = index === highlightedIndex;
              const OptionIcon = opt.icon || User;

              return (
                <div
                  key={opt.value}
                  className={`zd-glass-select-option ${isSelected ? 'is-selected' : ''} ${
                    isHighlighted ? 'is-highlighted' : ''
                  }`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <span className="zd-glass-select-option-icon">
                    {React.isValidElement(opt.icon) ? opt.icon : <OptionIcon size={15} />}
                  </span>
                  <div className="zd-glass-select-option-info">
                    <span className="zd-glass-select-option-name">{opt.label}</span>
                    {opt.subtitle && (
                      <span className="zd-glass-select-option-subtitle">{opt.subtitle}</span>
                    )}
                  </div>
                  {isSelected && <Check size={14} className="zd-glass-select-check" />}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
