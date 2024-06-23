import './style.css';

// Importar la API de Unsplash
import { createApi } from 'unsplash-js';

// Inicializar la instancia de Unsplash API
const unsplash = createApi({
  accessKey: import.meta.env.VITE_UNSPLASH_API_KEY,
});

// Función para buscar fotos en Unsplash basado en una palabra clave
const searchPhotos = async (keyword) => {
  const images = await unsplash.search.getPhotos({
    query: keyword,
    page: 1,
    perPage: 30,
  });
  return images;
};

// HEADER
const headerTemplate = () => {
  return `
      <h1>P</h1>
      <input type="text" placeholder="Search" id="searchinput"/>
      <button id="searchbtn"><img src="/assets/icon/search-alt-2-svgrepo-com.svg" alt="Search icon"/></button>
      <button id="darkmodebtn"><img src="/assets/icon/moon-svgrepo-com.svg" alt="Dark mode icon" id="darkmodeicon"></button>
      <img src="/assets/img/DSC_0032.jpg" alt="Profile image" class="profileimg">
  `;
};

// Función para cambiar entre modos claro y oscuro
const themeSwitch = () => {
  document.body.classList.toggle('dark');
  const theme = document.body.classList.contains('dark');
  const darkmodeicon = document.querySelector('#darkmodeicon');
  if (theme) {
    darkmodeicon.src = '/assets/icon/light-svgrepo-com.svg';
  } else {
    darkmodeicon.src = '/assets/icon/moon-svgrepo-com.svg';
  }
};

// Función para añadir event listeners a los elementos del encabezado
const headerListeners = () => {
  const darkmodebtn = document.querySelector('#darkmodebtn');
  darkmodebtn.addEventListener('click', themeSwitch);

  const searchbtn = document.querySelector('#searchbtn');
  searchbtn.addEventListener('click', async () => {
    const keyword = document.querySelector('#searchinput').value;
    await searchAndPrint(keyword);
  });

  const searchinput = document.querySelector('#searchinput');
  searchinput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
      const keyword = searchinput.value;
      await searchAndPrint(keyword);
    }
  });
};

// Función para imprimir el template del encabezado en el DOM
const printHeaderTemplate = () => {
  const header = document.querySelector('header');
  if (header) {
    header.innerHTML = headerTemplate();
    headerListeners();
  }
};

// Función para generar el template de las tarjetas de la galería
const cardTemplate = (item) => {
  return `
  <li class="gallery-item" style="background-image: url(${item.urls.regular}); border: 10px solid ${item.color}">
    <div class="info">
      <div class="save-btn">
        <button>Guardar</button>
      </div>
      <div class="links">
        <a href=${item.links.html} class="full-link">${item.links.html}</a>
        <div>
          <a href=${item.urls.full} target="_blank" class="links-icon">
            <img src="/assets/icon/upload-minimalistic-svgrepo-com.svg" alt="Upload icon"/>
          </a>
          <a href="#null" class="links-icon">
            <img src="/assets/icon/plus-large-svgrepo-com.svg" alt="More icon"/>
          </a>
        </div>
      </div>
    </div>
  </li>
  `;
};

// Función para imprimir los elementos en la galería
const printItems = (items) => {
  const gallery = document.querySelector('.gallery');
  if (gallery) {
    gallery.innerHTML = '';
    items.forEach(item => {
      gallery.innerHTML += cardTemplate(item);
    });
  }
};

// Función para buscar y mostrar imágenes
const searchAndPrint = async (keyword) => {
  const images = await searchPhotos(keyword);

  if (images.errors) {
    // Manejar el caso de error de la API
    console.error('Error al buscar imágenes:', images.errors);
    alert('Error al buscar imágenes. Por favor, inténtelo de nuevo más tarde.');
    return;
  }

  if (images.response.results.length === 0) {
    // Mostrar mensaje de que no se encontraron imágenes
    const gallery = document.querySelector('.gallery');
    if (gallery) {
      gallery.innerHTML = '<p>No se encontraron imágenes. Prueba con otra palabra clave.</p>';
    }
  } else {
    // Mostrar las imágenes encontradas
    printItems(images.response.results);
  }
};

// Función para añadir event listeners al botón de búsqueda y filtrado
const galleryListeners = async () => {
  const filters = document.querySelectorAll('.filtros div');
  filters.forEach(filter => {
    filter.addEventListener('click', async (e) => {
      const keyword = e.target.innerText;
      await searchAndPrint(keyword);
    });
  });
};

// Función para generar el template principal que incluye filtros y galería
const mainTemplate = () => {
  return `
      <div class="filtros">
        <div>Gato</div>
        <div>Naturaleza</div>
        <div>Futbol</div>
        <div>Coches</div>
      </div>
      <ul class="gallery"></ul>
  `;
};

// Función para imprimir el template principal en el DOM
const printMainTemplate = () => {
  const main = document.querySelector('main');
  if (main) {
    main.innerHTML = mainTemplate();
    galleryListeners();
  }
};

// Función para generar el template del pie de página
const footerTemplate = () => {
  return `
    <h4>Copyright 2023 - Pinterest - Rock the Code</h4>
  `;
};

// Función para imprimir el template del pie de página en el DOM
const printFooterTemplate = () => {
  const footer = document.querySelector('footer');
  if (footer) {
    footer.innerHTML = footerTemplate();
  }
};

// Función para inicializar la aplicación
const initializeApp = async () => {
  printHeaderTemplate();
  printMainTemplate();
  printFooterTemplate();

  // Cargar imágenes por defecto al cargar la página
  const defaultKeyword = 'landscape';
  await searchAndPrint(defaultKeyword);
};

// Llamar a initializeApp() para iniciar la aplicación
initializeApp();
