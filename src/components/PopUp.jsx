import { useState, useEffect, useRef } from 'react';
import '../styles/popup.css'; // Opcional: para los estilos


const PopUp = ({ children, delay = 400 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisibleClass, setIsVisibleClass] = useState(false);
  const contentRef = useRef(null);

  // useEffect 1: Se encarga de la apertura inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
      setTimeout(() => setIsVisibleClass(true), 50);
    }, delay);

    // Limpia el temporizador al desmontar
    return () => clearTimeout(timer);
  }, [delay]); // El arreglo de dependencias vacío le dice a React: "solo ejecuta esto una vez"

  // useEffect 2: Se encarga de escuchar los clics fuera del pop-up
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
        closePopUp();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Limpia el event listener al desmontar o cuando 'isOpen' cambia a false
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]); // Se ejecuta cada vez que 'isOpen' cambia

  const closePopUp = () => {
    setIsVisibleClass(false);
    setTimeout(() => {
      setIsOpen(false);
    }, 400);
  };

  if (!isOpen && !isVisibleClass) {
    return null;
  }

  return (
    <div className={`popup-overlay ${isVisibleClass ? 'is-visible' : ''}`}>
      <div className="popup-content" ref={contentRef} onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={closePopUp}>&times;</button>
        {children}
      </div>
    </div>
  );
};

export default PopUp;