// Función auxiliar para crear un solo elemento de tarjeta de empleo
function createJobCard(job) {
    let jobElement = document.createElement("article");
    jobElement.classList.add("job-card");
    
    // **NOTA DE SANITIZACIÓN:** Usar innerHTML aquí es seguro
    // si confías en la fuente de los datos (job.titulo, job.empresa, etc.).
    // Si estos datos vinieran directamente de un usuario sin validación,
    // usar textContent o un sanitizer (como DOMPurify) sería mejor.
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
    
    // Aquí puedes añadir listeners de eventos específicos para 'Aplicar' si lo necesitas
    
    return jobElement;
}

// Función principal para renderizar la lista de empleos
// Toma los datos a mostrar y el ID del contenedor
export function renderJobs(jobsList, containerId = "job-list") {
    const resultadosContainer = document.getElementById(containerId);
    resultadosContainer.innerHTML = ""; // Limpiar resultados anteriores

    if (jobsList.length === 0) {
        resultadosContainer.innerHTML = "<p class='no-results'>No se encontraron empleos.</p>";
        return;
    }

    jobsList.forEach((job) => {
        const jobElement = createJobCard(job);
        resultadosContainer.appendChild(jobElement);
    });
}


export function renderPagination(currentPage, totalPages, onPageChange, prevIcon, nextIcon) {
    const paginationContainer = document.getElementById("pagination-jobs");
    paginationContainer.innerHTML = ""; // Limpiar el contenedor

    if (totalPages === 0) {
        return; // No renderizar nada si no hay páginas
    }

    // --- Botón de página anterior ---
    const prevButton = document.createElement("button");
    prevButton.setAttribute("aria-label", "Página anterior");
    prevButton.classList.add("button-before");
    prevButton.disabled = currentPage === 1;
    // Asignar el contenido del icono de forma sanitizada (más sobre esto abajo)
    prevButton.innerHTML = prevIcon; 
    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1); // Llama al callback con la nueva página
        }
    });
    paginationContainer.appendChild(prevButton);

    // --- Botones de páginas ---
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.setAttribute("aria-label", `Página ${i}`);
        pageButton.textContent = i;
        if (i === currentPage) {
            pageButton.classList.add("active");
        }
        pageButton.addEventListener("click", () => {
            onPageChange(i); // Llama al callback con la página seleccionada
        });
        paginationContainer.appendChild(pageButton);
    }

    // --- Botón de página siguiente ---
    const nextButton = document.createElement("button");
    nextButton.setAttribute("aria-label", "Página siguiente");
    nextButton.classList.add("button-next");
    nextButton.disabled = currentPage === totalPages;
    // Asignar el contenido del icono de forma sanitizada (más sobre esto abajo)
    nextButton.innerHTML = nextIcon;
    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1); // Llama al callback con la nueva página
        }
    });
    paginationContainer.appendChild(nextButton);
}
// También podrías mover 'mostrarTrabajos' o renombrarla a algo como 'renderJobs' aquí