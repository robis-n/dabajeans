document.addEventListener('DOMContentLoaded', () => {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalGallery = document.getElementById('modalImageGallery');
    const modalName = document.getElementById('modalName');
    const modalPrice = document.getElementById('modalPrice');
    const modalDescription = document.getElementById('modalDescription');
    const modalClose = document.getElementById('modalClose');
    const prevButton = document.getElementById('prevImage');
    const nextButton = document.getElementById('nextImage');
    
    const galleryPrev = document.getElementById('galleryPrev');
    const galleryNext = document.getElementById('galleryNext');

    const purchaseOverlay = document.getElementById('purchaseOverlay');
    const openPurchaseBtn = document.getElementById('openPurchaseForm');
    const purchaseClose = document.getElementById('purchaseClose');

    const fullscreenOverlay = document.getElementById('fullscreenOverlay');
    const fullscreenImage = document.getElementById('fullscreenImage');
    const fullscreenClose = document.getElementById('fullscreenClose');
    const fullscreenPrev = document.getElementById('fullscreenPrev');
    const fullscreenNext = document.getElementById('fullscreenNext');
    let currentFullscreenIndex = 0;

    let currentItemIndex = 0;
    const catalogItems = Array.from(document.querySelectorAll('.catalog-item'));

    function openModal(item) {
        // Get first image from HTML and the rest from dataset
        const firstImage = item.querySelector('.item-image-gallery img').src;
        const otherImages = JSON.parse(item.dataset.images || '[]').slice(1); // Skip first image from dataset
        const allImages = [firstImage, ...otherImages];
        const description = item.dataset.description;
        const name = item.querySelector('.item-name').textContent;
        const price = item.querySelector('.item-price').textContent;

        // Clear existing images
        modalGallery.innerHTML = '';
        
        // Add all images to gallery with first image always active
        allImages.forEach((src, index) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = name;
            if (index === 0) {
                img.classList.add('active');
                img.style.opacity = '1';
                img.style.display = 'block';
            }
            modalGallery.appendChild(img);
        });

        modalName.textContent = name;
        modalPrice.textContent = price;
        modalDescription.textContent = description;

        modalOverlay.style.display = 'flex';
        setTimeout(() => modalOverlay.classList.add('active'), 10);
        setTimeout(updateGalleryNavigation, 100);
    }

    function nextItem() {
        currentItemIndex = (currentItemIndex + 1) % catalogItems.length;
        openModal(catalogItems[currentItemIndex]);
    }

    function prevItem() {
        currentItemIndex = (currentItemIndex - 1 + catalogItems.length) % catalogItems.length;
        openModal(catalogItems[currentItemIndex]);
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        modalOverlay.classList.add('closing');
        setTimeout(() => {
            modalOverlay.style.display = 'none';
            modalOverlay.classList.remove('closing');
        }, 300);
    }

    function scrollGallery(direction, gallery, isModal = false) {
        const scrollAmount = gallery.clientWidth;
        gallery.scrollBy({
            left: direction === 'next' ? scrollAmount : -scrollAmount,
            behavior: 'smooth'
        });
    }

    function updateGalleryNavigation() {
        if (!modalGallery) return;
        
        const isAtStart = modalGallery.scrollLeft <= 10; // Adding small threshold
        const isAtEnd = modalGallery.scrollLeft >= modalGallery.scrollWidth - modalGallery.offsetWidth - 10;
        
        if (galleryPrev) galleryPrev.style.display = isAtStart ? 'none' : 'flex';
        if (galleryNext) galleryNext.style.display = isAtEnd ? 'none' : 'flex';
    }

    // Event Listeners
    catalogItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentItemIndex = index;
            openModal(item);
        });
    });

    prevButton.addEventListener('click', (e) => {
        e.stopPropagation();
        prevItem(); // Change this to switch between items
    });

    nextButton.addEventListener('click', (e) => {
        e.stopPropagation();
        nextItem(); // Change this to switch between items
    });

    // Event Listeners for gallery navigation (inside product)
    galleryPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        scrollGallery('prev', modalGallery, true);
    });

    galleryNext.addEventListener('click', (e) => {
        e.stopPropagation();
        scrollGallery('next', modalGallery, true);
    });

    modalClose.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Add scroll event listener to modalGallery
    if (modalGallery) {
        modalGallery.addEventListener('scroll', () => {
            requestAnimationFrame(updateGalleryNavigation);
        });
    }

    function initializeCatalogGalleries() {
        catalogItems.forEach(item => {
            // Keep the original gallery structure, don't recreate it
            const gallery = item.querySelector('.item-image-gallery');
            const container = document.createElement('div');
            container.className = 'item-image-container';
            
            // Create navigation buttons
            const prevBtn = document.createElement('button');
            const nextBtn = document.createElement('button');
            prevBtn.className = 'catalog-nav prev';
            nextBtn.className = 'catalog-nav next';
            prevBtn.innerHTML = '&lt;';
            nextBtn.innerHTML = '&gt;';

            // Wrap existing gallery in container
            gallery.parentNode.insertBefore(container, gallery);
            container.appendChild(gallery);
            container.appendChild(prevBtn);
            container.appendChild(nextBtn);

            function updateNavigation() {
                const isAtStart = gallery.scrollLeft <= 10;
                const isAtEnd = gallery.scrollLeft >= gallery.scrollWidth - gallery.offsetWidth - 10;
                prevBtn.style.display = isAtStart ? 'none' : 'flex';
                nextBtn.style.display = isAtEnd ? 'none' : 'flex';
            }

            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                scrollGallery('prev', gallery, false);
            });

            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                scrollGallery('next', gallery, false);
            });

            gallery.addEventListener('scroll', () => {
                requestAnimationFrame(updateNavigation);
            });

            updateNavigation();
        });
    }

    // Initialize all catalog items
    catalogItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentItemIndex = index;
            openModal(item);
        });
    });

    // Initialize catalog galleries after DOM is loaded
    initializeCatalogGalleries();

    openPurchaseBtn.addEventListener('click', openPurchaseModal);
    purchaseClose.addEventListener('click', closePurchaseModal);

    purchaseOverlay.addEventListener('click', (e) => {
        if (e.target === purchaseOverlay) {
            closePurchaseModal();
        }
    });

    // Add click handler for modal images
    document.querySelector('.modal-image').addEventListener('click', function(e) {
        if (e.target.tagName === 'IMG') {
            currentFullscreenIndex = Array.from(modalImageGallery.children).indexOf(e.target);
            showFullscreen(currentFullscreenIndex);
        }
    });

    function showFullscreen(index) {
        const images = Array.from(modalImageGallery.children);
        fullscreenImage.src = images[index].src;
        fullscreenOverlay.style.display = 'block';
        currentFullscreenIndex = index;
    }

    fullscreenClose.addEventListener('click', () => {
        fullscreenOverlay.style.display = 'none';
    });

    fullscreenPrev.addEventListener('click', () => {
        const images = Array.from(modalImageGallery.children);
        currentFullscreenIndex = (currentFullscreenIndex - 1 + images.length) % images.length;
        showFullscreen(currentFullscreenIndex);
    });

    fullscreenNext.addEventListener('click', () => {
        const images = Array.from(modalImageGallery.children);
        currentFullscreenIndex = (currentFullscreenIndex + 1) % images.length;
        showFullscreen(currentFullscreenIndex);
    });

    // Add keyboard navigation for fullscreen
    document.addEventListener('keydown', (e) => {
        if (fullscreenOverlay.style.display === 'block') {
            if (e.key === 'Escape') {
                fullscreenOverlay.style.display = 'none';
            } else if (e.key === 'ArrowLeft') {
                fullscreenPrev.click();
            } else if (e.key === 'ArrowRight') {
                fullscreenNext.click();
            }
        }
    });
});

function openPurchaseModal() {
    purchaseOverlay.style.display = 'flex';
    setTimeout(() => purchaseOverlay.classList.add('active'), 10);
}

function closePurchaseModal() {
    purchaseOverlay.classList.remove('active');
    setTimeout(() => {
        purchaseOverlay.style.display = 'none';
    }, 300);
}