/* =========================================================
   PENCARIAN PRODUK (products.html)
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("catalogSearchInput");
    const clearBtn = document.getElementById("catalogSearchClear");
    const resultInfo = document.getElementById("catalogResultInfo");
    const emptyState = document.getElementById("catalogEmpty");
    const cards = Array.from(document.querySelectorAll(".catalog-card"));

    if (!searchInput || !cards.length) return;

    const totalCount = cards.length;

    function updateResultInfo(visibleCount, query) {
        if (!resultInfo) return;
        if (!query) {
            resultInfo.textContent = `Menampilkan semua ${totalCount} produk`;
        } else {
            resultInfo.textContent = `${visibleCount} produk ditemukan untuk "${query}"`;
        }
    }

    function filterCards() {
        const query = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        cards.forEach(card => {
            const name = card.dataset.search || "";
            const match = !query || name.includes(query);
            card.classList.toggle("is-hidden", !match);
            if (match) visibleCount++;
        });

        updateResultInfo(visibleCount, query);

        if (emptyState) {
            emptyState.style.display = visibleCount === 0 ? "block" : "none";
        }

        if (clearBtn) {
            clearBtn.style.display = query ? "inline-flex" : "none";
        }
    }

    searchInput.addEventListener("input", filterCards);

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            searchInput.value = "";
            filterCards();
            searchInput.focus();
        });
    }

    // Dukung ?q=... di URL, misalnya dari hasil pencarian luar
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("q");
    if (initialQuery) {
        searchInput.value = initialQuery;
    }

    filterCards();
});
