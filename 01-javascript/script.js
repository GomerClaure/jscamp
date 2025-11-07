import { renderJobs, renderPagination } from './components.js';
import { nextIcon, prevIcon } from './icons.js';

let jobs = [];
let jobsFiltrados = [];
let jobsPaginados = [];
let currentPage = 1;
let rowsPerPage = 4;
// Cargar datos desde el archivo JSON


fetch('./data/jobs.json')
    .then(response => response.json())
    .then(data => {
        jobs = data;
        jobsFiltrados = jobs; // Inicialmente, todos los empleos están en la lista filtrada
        mostrarEmpleos();
    })
    .catch(error => console.error(error));



let inputSeeker = document.getElementById("job-seeker");
inputSeeker.addEventListener("input", (e) => {
    let valor = e.target.value.toLowerCase();
    filtrarEmpleos(valor, "input-seeker");
});



// Delegación de eventos: seleccionar el contenedor de filtros (un solo elemento)
const filters = document.querySelector('.filters');
if (filters) {
    filters.addEventListener('click', (e) => {
        // Solo actuamos si el origen del evento es un <select> donde el id define el tipo de filtro
        console.log(e.target);
        if (e.target && e.target.tagName === 'SELECT') {
            let valor = e.target.value.toLowerCase();
            filtrarEmpleos(valor, "select-filter");
        }
    });
}

const jobList = document.getElementById("job-list");
if (jobList) {
    jobList.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('apply-button')) {
            let button = e.target;
            button.textContent = '¡Aplicado!';
            button.classList.add('is-applied');
            button.disabled = true;
        }
    });
}

function filtrarEmpleos(valor, kindOfFilter) {
    currentPage = 1; // Reiniciar a la primera página en cada filtrado
    let resultados = jobs.filter((job) => {
        if (kindOfFilter === "input-seeker") {
            // Buscar empleos por título, habilidad o empresa
            return (
                job.titulo.toLowerCase().includes(valor) ||
                job.tecnologia.toLowerCase().includes(valor) ||
                job.empresa.toLowerCase().includes(valor)
            );
        } else if (kindOfFilter === "select-filter") {
            // Filtrar empleos por ubicación, tipo de contrato o experiencia
            return (
                job.ubicacion.toLowerCase().includes(valor) ||
                job.tecnologia.toLowerCase().includes(valor) ||
                job.tipoContrato.toLowerCase().includes(valor) ||
                job.experiencia.toLowerCase().includes(valor)
            );
        }
    });
    jobsFiltrados = resultados;
    mostrarEmpleos();
}

function mostrarEmpleos() {
    paginationFilter(); 
    renderJobs(jobsPaginados, "job-list");

}

function paginationFilter() {

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const totalPages = Math.ceil(jobsFiltrados.length / rowsPerPage);
    jobsPaginados = jobsFiltrados.slice(start, end); 
    if (jobsFiltrados.length != 0) {
        // --- LÓGICA DE CAMBIO DE PÁGINA (Callback) ---
        const handlePageChange = (newPage) => {
            currentPage = newPage;
            mostrarEmpleos(); 
        };
        // --- RENDERIZADO DEL COMPONENTE HTML ---
        // Se llama al componente importado para que DIBUJE la paginación.
        renderPagination(
            currentPage, 
            totalPages, 
            handlePageChange, 
            prevIcon, 
            nextIcon
        );
    } else {
        // Limpiar la paginación si no hay resultados
        document.getElementById("pagination-jobs").innerHTML = "";
    }
}
