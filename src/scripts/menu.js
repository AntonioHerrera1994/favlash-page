// Abrir menú

document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('expanded');
  });
  
  // Cerrar menú al hacer clic en el botón "close"
  document.querySelector('.close').addEventListener('click',   
  () => {
  document.querySelector('.nav-links').classList.remove('expanded');
  });
  
  // Cerrar menú al hacer clic en cualquier enlace dentro de nav-links
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelector('.nav-links').classList.remove('expanded');
    });
  });
  
  
  // Cambiar color de fondo al hacer scroll (para #miDiv)
  window.addEventListener('scroll', function() {
    const div = document.getElementById('miDiv');
    const scrollPosition = window.scrollY;
  
    if (scrollPosition > 100) { // Cambia a 100px o la distancia que prefieras
      div.style.backgroundColor = 'white'; // Nuevo color de fondo
    } else {
      div.style.backgroundColor = '#ffffff00'; // Color inicial
    }
  });
  
  
  // Cambiar color de fondo al hacer scroll (para #miMenu)
  window.addEventListener('scroll', function() {
    const div = document.getElementById('miMenu');
    const scrollPosition = window.scrollY;
  
    if (scrollPosition > 100) { // Cambia a 100px o la distancia que prefieras
      div.style.backgroundColor = 'white'; // Nuevo color de fondo
    } else {
      div.style.backgroundColor = 'white'; // Color inicial
    }
  });
  
  