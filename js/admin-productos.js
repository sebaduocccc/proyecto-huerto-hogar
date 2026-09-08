document.addEventListener('DOMContentLoaded', () => {
    renderAdminTable();

    const form=document.getElementById('product-form');
    const cancelBtn=document.getElementById('cancel-btn');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const sku = document.getElementById('sku-input').value.trim().toUpperCase();
        const name = document.getElementById('name-input').value.trim();
        const category = document.getElementById('category-input').value;
        const stock = parseInt(document.getElementById('stock-input').value, 10)
        const price = parseInt(document.getElementById('price-input').value);
        const image = document.getElementById('image-input').value.trim() || 'img/not-found.svg';
        const description = document.getElementById('description-input').value.trim();
        const isEditing = document.getElementById('is-editing').value === 'true';

        const catalog = getCatalog();
         
        if (!isEditing && catalog[sku]){
            alert(`"${sku}" ya existe.`)
            return;
        }

        const existingGallery = catalog[sku]?.gallery;
        const gallery = (existingGallery && existingGallery.length)
            ? [image, ...existingGallery.slice(1)]
            : [image];

        catalog[sku] = {
            sku: sku,
            name: name,
            category: category,
            stock: stock,
            price: price,
            image: image,
            gallery: [image],
            description: description,
            longDescription: catalog[sku]?.longDescription || {"Origen": "Chile"}
        };

        saveCatalog(catalog);
        resetForm();
        renderAdminTable();
        alert(`${sku} guardado correctamente`)
    });

    cancelBtn.addEventListener('click', resetForm);
});

function renderAdminTable() {
    const tableBody = document.getElementById('admin-table-body');
    const catalog = getCatalog();
    const products = Object.values(catalog);

    if (products.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">El catálogo está vacío</td></tr>`;
        return;
    }

    tableBody.innerHTML = products.map(product => `
        <tr>
            <td><strong>${product.sku}</strong></td>
            <td>
                <div class="d-flex align-items-center gap-2">
                    <img src="${product.image}" alt="" style="width: 35px; height: 35px; object-fit: contain;">
                    <span>${product.name}</span>
                </div>
            </td>
            <td>${product.category}</td>
            <td>${product.stock}</td>
            <td>$${product.price.toLocaleString('es-CL')}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editProduct('${product.sku}')">Editar</button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct('${product.sku}')">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

function editProduct(sku) {
    const catalog = getCatalog();
    const product = catalog[sku];
    if (!product) return;

    document.getElementById('form-title').textContent=`Editar Producto (${sku})`;
    document.getElementById('sku-input').value = product.sku;
    document.getElementById('sku-input').disabled = true; // no se puede editar el sku mientras se edita porque sino sería lo mismo que crear

    document.getElementById('name-input').value = product.name;
    document.getElementById('category-input').value = product.category;
    document.getElementById('stock-input').value = product.stock;
    document.getElementById('price-input').value = product.price;
    document.getElementById('image-input').value = product.image;
    document.getElementById('description-input').value = product.description;

    document.getElementById('is-editing').value = 'true';
    document.getElementById('save-btn').textContent='Actualizar Producto';

    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) cancelBtn.classList.remove('d-none');
}

function deleteProduct(sku) {
    if(confirm(`¿Estás seguro de que deseas eliminar el producto ${sku}?`)){
        const catalog = getCatalog();
        delete catalog[sku];
        saveCatalog(catalog);
        renderAdminTable();
    }
}

function resetForm() {
    const form=document.getElementById('product-form');
    form.reset();

    document.getElementById('form-title').textContent = 'Agregar Nuevo Producto';
    document.getElementById('sku-input').disabled = false;
    document.getElementById('is-editing').value = 'false';
    document.getElementById('save-btn').textContent = 'Guardar Producto';
    document.getElementById('cancel-btn').classList.add('d-none');
}