let jobs = [];
let jobsFiltrados = [];
let jobsPaginados = [];
let currentPage = 1;
let rowsPerPage = 4;
let nextIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="icon icon-tabler icon-tabler-chevron-right">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <polyline points="9 6 15 12 9 18"></polyline>
    </svg>
`;
let prevIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="icon icon-tabler icon-tabler-chevron-left">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <polyline points="15 6 9 12 15 18"></polyline>
    </svg>
`;
// Cargar datos desde el archivo JSON


fetch('./data/jobs.json')
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
    // Limpiar resultados anteriores
    let resultadosContainer = document.getElementById("job-list");
    resultadosContainer.innerHTML = "";
    paginationFilter();
    if (jobsFiltrados.length === 0) {
        resultadosContainer.innerHTML = "<p class='no-results'>No se encontraron empleos.</p>";
        return;
    } else {
        // Mostrar empleos filtrados paginados

        jobsPaginados.forEach((job) => {
            let jobElement = document.createElement("article");
            jobElement.classList.add("job-card");
            jobElement.innerHTML = `
                <div class="card-container">
                    <h3>${job.titulo}</h3>
                    <div class="card-subtile">
                        <span class="company-name">${job.empresa}</span> |
                        <span class="company-address">${job.ubicacion}</span>
                    </div>
                    <p>${job.descripcion}</p>
                </div>
                <button class="apply-button">Aplicar</button>
            `;
            resultadosContainer.appendChild(jobElement);
        });
    }

}

function paginationFilter() {
    const start = (currentPage - 1) * rowsPerPage; //ejemplo: pagina 1, (1-1)*4=0, pagina 2, (2-1)*4=4
    const end = start + rowsPerPage; //ejemplo: pagina 1, 0+4=4, pagina 2, 4+4=8
    jobsPaginados = jobsFiltrados.slice(start, end);

    // Actualizar la paginación
    const paginationContainer = document.getElementById("pagination-jobs");
    paginationContainer.innerHTML = "";

    if (jobsFiltrados.length != 0) {
        const totalPages = Math.ceil(jobsFiltrados.length / rowsPerPage);// redondea hacia arriba
        // Botón de página anterior
        const prevButton = document.createElement("button");
        prevButton.setAttribute("aria-label", "Página anterior");
        prevButton.classList.add("button-before");
        prevButton.disabled = currentPage === 1;
        prevButton.innerHTML = prevIcon;
        prevButton.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                mostrarEmpleos();
            }
        });
        paginationContainer.appendChild(prevButton);

        // Botones de páginas
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.setAttribute("aria-label", `Página ${i}`);
            pageButton.textContent = i;
            if (i === currentPage) {
                pageButton.classList.add("active");
            }
            pageButton.addEventListener("click", () => {
                currentPage = i;
                mostrarEmpleos();
            });
            paginationContainer.appendChild(pageButton);
        }

        // Botón de página siguiente
        const nextButton = document.createElement("button");
        nextButton.setAttribute("aria-label", "Página siguiente");
        nextButton.classList.add("button-next");
        nextButton.disabled = currentPage === totalPages;
        nextButton.innerHTML = nextIcon
        nextButton.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                mostrarEmpleos();
            }
        });
        paginationContainer.appendChild(nextButton);
    }

}
