console.log("King DS Store Berhasil Dibuat");

/* =========================================================
   KING DS STORE - MAIN SCRIPT
========================================================= */

const ADMIN_WA = "6285143887892";

/* =========================================================
   INIT
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    initRainEffect();
    initFloatingAI();
    initMobileNavbar();
    initPremiumTabs();
    initFaqAccordion();
    initCopyButtons();
    initOrderModal();
    initAiFaqModal();
    initSmoothScroll();
    initEscClose();
    initResizeRain();
});

/* =========================================================
   RAIN EFFECT
   - Membuat elemen hujan ke #rainLayer
   - Pastikan HTML punya <div id="rainLayer"></div>
   - Pastikan CSS punya .rain-layer dan .rain-drop
========================================================= */
function initRainEffect() {
    const rainLayer = document.getElementById("rainLayer");
    if (!rainLayer) {
        console.warn("rainLayer tidak ditemukan.");
        return;
    }

    const isMobile = window.innerWidth <= 768;
    const rainCount = isMobile ? 35 : 70;

    rainLayer.innerHTML = "";

    for (let i = 0; i < rainCount; i++) {
        const drop = document.createElement("span");
        drop.className = "rain-drop";

        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = 1.8 + Math.random() * 1.8;
        const opacity = 0.12 + Math.random() * 0.35;
        const height = 40 + Math.random() * 60;

        drop.style.left = `${left}%`;
        drop.style.animationDelay = `${delay}s`;
        drop.style.animationDuration = `${duration}s`;
        drop.style.opacity = opacity;
        drop.style.height = `${height}px`;

        rainLayer.appendChild(drop);
    }
}

/* =========================================================
   FLOATING AI ASSISTANT
   - Klik icon AI -> buka modal FAQ AI
   - Ada efek gerak halus mengikuti cursor
   - Aman untuk desktop dan mobile
========================================================= */
/* =========================================================
   FLOATING AI ASSISTANT
========================================================= */
function initFloatingAI() {
    const floatingAI = document.getElementById("floatingAI");
    if (!floatingAI) return;

    const aiFaqModal = document.getElementById("aiFaqModal");
    const aiFaqInput = document.getElementById("aiFaqInput");

    /* =========================
       OPEN MODAL WHEN CLICKED
    ========================= */
    floatingAI.addEventListener("click", () => {
        if (!aiFaqModal) return;

        aiFaqModal.classList.add("active");
        document.body.classList.add("modal-open");

        setTimeout(() => {
            aiFaqInput?.focus();
        }, 200);
    });

    /* =========================
       FOLLOW CURSOR (DESKTOP ONLY)
    ========================= */
    const isDesktop = window.matchMedia("(min-width: 769px)").matches;

    if (!isDesktop) {
        floatingAI.style.setProperty("--tx", "0px");
        floatingAI.style.setProperty("--ty", "0px");
        return;
    }

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = null;

    document.addEventListener("mousemove", (e) => {
        const xRatio = (e.clientX / window.innerWidth) - 0.5;
        const yRatio = (e.clientY / window.innerHeight) - 0.5;

        targetX = xRatio * 16;
        targetY = yRatio * 16;

        if (!rafId) {
            rafId = requestAnimationFrame(updateFloatingAI);
        }
    });

    function updateFloatingAI() {
        currentX += (targetX - currentX) * 0.12;
        currentY += (targetY - currentY) * 0.12;

        floatingAI.style.setProperty("--tx", `${currentX}px`);
        floatingAI.style.setProperty("--ty", `${currentY}px`);

        const stillMoving =
            Math.abs(targetX - currentX) > 0.1 ||
            Math.abs(targetY - currentY) > 0.1;

        if (stillMoving) {
            rafId = requestAnimationFrame(updateFloatingAI);
        } else {
            rafId = null;
        }
    }
}


/* =========================================================
   MOBILE NAVBAR
========================================================= */
function initMobileNavbar() {
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener("click", () => {
        menuToggle.classList.toggle("active");
        navMenu.classList.toggle("active");
        document.body.classList.toggle("menu-open");
    });

    const navLinks = navMenu.querySelectorAll("a");
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            menuToggle.classList.remove("active");
            navMenu.classList.remove("active");
            document.body.classList.remove("menu-open");
        });
    });
}

/* =========================================================
   PREMIUM APPS TAB
========================================================= */
function initPremiumTabs() {
    const premiumTabs = document.querySelectorAll(".premium-tab");
    const premiumPanels = document.querySelectorAll(".premium-panel");

    if (!premiumTabs.length || !premiumPanels.length) return;

    premiumTabs.forEach(tab => {
        tab.addEventListener("click", function () {
            const target = this.getAttribute("data-target");
            if (!target) return;

            premiumTabs.forEach(btn => btn.classList.remove("active"));
            premiumPanels.forEach(panel => panel.classList.remove("active"));

            this.classList.add("active");

            const targetPanel = document.getElementById(target);
            if (targetPanel) {
                targetPanel.classList.add("active");
            }
        });
    });
}

/* =========================================================
   FAQ ACCORDION
========================================================= */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll(".faq-item");
    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        if (!question || !answer) return;

        question.addEventListener("click", () => {
            const isActive = item.classList.contains("active");

            faqItems.forEach(otherItem => {
                otherItem.classList.remove("active");
                const otherAnswer = otherItem.querySelector(".faq-answer");
                if (otherAnswer) {
                    otherAnswer.style.maxHeight = null;
                }
            });

            if (!isActive) {
                item.classList.add("active");
                answer.style.maxHeight = `${answer.scrollHeight}px`;
            }
        });
    });
}

/* =========================================================
   COPY BUTTON PEMBAYARAN
========================================================= */
function initCopyButtons() {
    const copyButtons = document.querySelectorAll(".copy-btn");
    if (!copyButtons.length) return;

    copyButtons.forEach(button => {
        button.addEventListener("click", async function () {
            const textToCopy = this.getAttribute("data-copy");
            if (!textToCopy) return;

            const originalText = this.textContent;

            try {
                await navigator.clipboard.writeText(textToCopy);
            } catch (err) {
                // fallback browser lama
                const textArea = document.createElement("textarea");
                textArea.value = textToCopy;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
            }

            this.textContent = "Berhasil Disalin";
            this.classList.add("copied");

            setTimeout(() => {
                this.textContent = originalText;
                this.classList.remove("copied");
            }, 1800);
        });
    });
}

/* =========================================================
   ORDER MODAL
========================================================= */
function initOrderModal() {
    const orderModal = document.getElementById("orderModal");
    const closeOrderModal = document.getElementById("closeOrderModal");
    const orderForm = document.getElementById("orderForm");

    const orderProductInput = document.getElementById("orderProduct");
    const orderCategoryInput = document.getElementById("orderCategory");
    const orderPriceInput = document.getElementById("orderPrice");

    const premiumOrderButtons = document.querySelectorAll(".premium-order-btn");
    const botOrderButtons = document.querySelectorAll(".bot-order-btn");

    function openOrderModal(productName, categoryName, priceText) {
        if (!orderModal) return;

        if (orderProductInput) orderProductInput.value = productName || "";
        if (orderCategoryInput) orderCategoryInput.value = categoryName || "";
        if (orderPriceInput) orderPriceInput.value = priceText || "";

        orderModal.classList.add("active");
        document.body.classList.add("modal-open");
    }

    function closeOrderModalFunc() {
        if (!orderModal) return;
        orderModal.classList.remove("active");
        document.body.classList.remove("modal-open");
    }

    premiumOrderButtons.forEach(button => {
        button.addEventListener("click", e => {
            e.preventDefault();

            const product = button.getAttribute("data-product") || "Produk";
            const category = button.getAttribute("data-category") || "Premium Apps";
            const price = button.getAttribute("data-price") || "-";

            openOrderModal(product, category, price);
        });
    });

    botOrderButtons.forEach(button => {
        button.addEventListener("click", e => {
            e.preventDefault();

            const product = button.getAttribute("data-product") || "Sewa Bot WhatsApp";
            const category = button.getAttribute("data-category") || "Bot WhatsApp";
            const price = button.getAttribute("data-price") || "-";

            openOrderModal(product, category, price);
        });
    });

    if (closeOrderModal) {
        closeOrderModal.addEventListener("click", closeOrderModalFunc);
    }

    if (orderModal) {
        orderModal.addEventListener("click", e => {
            if (e.target === orderModal) {
                closeOrderModalFunc();
            }
        });
    }

    if (orderForm) {
        orderForm.addEventListener("submit", e => {
            e.preventDefault();

            const customerName = document.getElementById("customerName")?.value.trim() || "";
            const customerWhatsapp = document.getElementById("customerWhatsapp")?.value.trim() || "";
            const orderProduct = document.getElementById("orderProduct")?.value.trim() || "";
            const orderCategory = document.getElementById("orderCategory")?.value.trim() || "";
            const orderVariant = document.getElementById("orderVariant")?.value.trim() || "-";
            const orderPrice = document.getElementById("orderPrice")?.value.trim() || "";
            const paymentMethod = document.getElementById("paymentMethod")?.value.trim() || "";
            const orderNotes = document.getElementById("orderNotes")?.value.trim() || "-";

            if (!customerName || !customerWhatsapp || !orderProduct || !paymentMethod) {
                alert("Mohon lengkapi data order terlebih dahulu.");
                return;
            }

            const waMessage = `Halo admin King DS Store, saya ingin order.

*DATA PEMBELI*
Nama: ${customerName}
No. WhatsApp: ${customerWhatsapp}

*DETAIL PESANAN*
Produk: ${orderProduct}
Kategori: ${orderCategory}
Varian/Paket: ${orderVariant}
Harga: ${orderPrice}
Metode Pembayaran: ${paymentMethod}
Catatan: ${orderNotes}

Saya akan / sudah melakukan pembayaran. Mohon diproses ya admin.`;

            const waUrl = `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(waMessage)}`;
            window.open(waUrl, "_blank");

            closeOrderModalFunc();
            orderForm.reset();

            if (orderProductInput) orderProductInput.value = orderProduct;
            if (orderCategoryInput) orderCategoryInput.value = orderCategory;
            if (orderPriceInput) orderPriceInput.value = orderPrice;
        });
    }

    // expose untuk ESC handler
    window.closeOrderModalFunc = closeOrderModalFunc;
}

/* =========================================================
   AI FAQ MODAL
========================================================= */
function initAiFaqModal() {
    const openAiFaqBtn = document.getElementById("openAiFaqBtn");
    const aiFaqModal = document.getElementById("aiFaqModal");
    const closeAiFaq = document.getElementById("closeAiFaq");
    const aiFaqBody = document.getElementById("aiFaqBody");
    const aiFaqInput = document.getElementById("aiFaqInput");
    const sendAiFaq = document.getElementById("sendAiFaq");

    function openAiFaqModal() {
        if (!aiFaqModal) return;
        aiFaqModal.classList.add("active");
        document.body.classList.add("modal-open");
        setTimeout(() => aiFaqInput?.focus(), 200);
    }

    function closeAiFaqModal() {
        if (!aiFaqModal) return;
        aiFaqModal.classList.remove("active");
        document.body.classList.remove("modal-open");
    }

    function addAiMessage(message, type = "bot") {
        if (!aiFaqBody) return;

        const messageDiv = document.createElement("div");
        messageDiv.className = `ai-message ${type === "user" ? "ai-user" : "ai-bot"}`;
        messageDiv.innerHTML = message.replace(/\n/g, "<br>");
        aiFaqBody.appendChild(messageDiv);
        aiFaqBody.scrollTop = aiFaqBody.scrollHeight;
    }

    function getAiFaqResponse(userText) {
        const text = userText.toLowerCase().trim();

        // sapaan
        if (
            text.includes("halo") ||
            text.includes("hai") ||
            text.includes("hi") ||
            text === "p" ||
            text === "permisi"
        ) {
            return `Halo juga 👋
Selamat datang di King DS Store.
Saya bisa bantu jawab pertanyaan seputar:
- cara order
- metode pembayaran
- premium apps
- jasa edit
- starlight
- bot WhatsApp`;
        }

        // cara order
        if (
            text.includes("cara order") ||
            text.includes("gimana order") ||
            text.includes("bagaimana order") ||
            text.includes("cara pesan") ||
            text.includes("pesan produk")
        ) {
            return `Cara order di King DS Store:
1. Pilih produk / layanan yang diinginkan
2. Klik tombol Order
3. Isi form pesanan
4. Pilih metode pembayaran
5. Lanjutkan konfirmasi ke WhatsApp admin

Untuk jasa edit video dan Starlight, order langsung lewat tombol WhatsApp.`;
        }

        // pembayaran
        if (
            text.includes("pembayaran") ||
            text.includes("bayar") ||
            text.includes("metode bayar") ||
            text.includes("qris") ||
            text.includes("dana") ||
            text.includes("bri")
        ) {
            return `Metode pembayaran yang tersedia:
- DANA: 085143887892
- BRI: 6254 0102 7303 531
- QRIS DANA tersedia di website

Setelah bayar, lanjutkan konfirmasi ke WhatsApp admin agar pesanan diproses.`;
        }

        // seller / buyer
        if (
            text.includes("akun seller") ||
            text.includes("seller") ||
            text.includes("akun buyer") ||
            text.includes("buyer")
        ) {
            return `Penjelasan singkat:
- Akun seller = akun disediakan oleh admin / penjual
- Akun buyer = memakai akun milik pembeli sendiri

Setiap produk bisa punya ketentuan berbeda, jadi cek keterangan produk atau tanyakan admin saat order.`;
        }

        // stok
        if (
            text.includes("stok") ||
            text.includes("ready") ||
            text.includes("tersedia")
        ) {
            return `Untuk stok produk tertentu, sebaiknya tanyakan admin terlebih dahulu melalui WhatsApp.
Beberapa produk ready selalu, tapi ada juga yang menyesuaikan ketersediaan seller / slot.`;
        }

        // premium apps
        if (
            text.includes("premium") ||
            text.includes("aplikasi") ||
            text.includes("apps") ||
            text.includes("canva") ||
            text.includes("alight motion") ||
            text.includes("capcut") ||
            text.includes("spotify") ||
            text.includes("netflix") ||
            text.includes("youtube") ||
            text.includes("chatgpt") ||
            text.includes("gemini") ||
            text.includes("grok")
        ) {
            return `King DS Store menyediakan berbagai premium apps seperti:
- Canva Pro
- Alight Motion
- CapCut Pro
- Lightroom
- Netflix
- Spotify
- YouTube Premium
- ChatGPT / Gemini / Grok
dan lainnya.

Silakan buka bagian Premium Apps di website lalu klik tombol Order pada produk yang diinginkan.`;
        }

        // jasa edit
        if (
            text.includes("edit") ||
            text.includes("jasa edit") ||
            text.includes("video")
        ) {
            return `Jasa edit video tersedia mulai Rp2.000 - Rp20.000 / video.
Harga menyesuaikan tingkat kesulitan edit, durasi, dan kebutuhan konten.

Untuk jasa edit, silakan langsung klik tombol "Chat Admin" pada bagian layanan Jasa Edit Video.`;
        }

        // starlight
        if (
            text.includes("starlight") ||
            text.includes("ml") ||
            text.includes("mobile legends")
        ) {
            return `Harga Starlight saat ini:
- Starlight Member: Rp35.000
- Starlight Premium: Rp55.000

Untuk pemesanan Starlight, silakan klik tombol WhatsApp pada bagian layanan Starlight Mobile Legends.`;
        }

        // bot whatsapp
        if (
            text.includes("bot wa") ||
            text.includes("bot whatsapp") ||
            text.includes("sewa bot") ||
            text.includes("premium user")
        ) {
            return `Layanan Bot WhatsApp:
- Sewa bot 1 bulan biasa — Rp15.000
- Sewa bot 1 bulan + 1 user prem — Rp20.000
- Sewa bot 1 bulan + premium grup — Rp40.000
- Premium user limit 1 nomor — Rp5.000
- Premium user limit 2 nomor — Rp10.000

Untuk bot WA, Anda bisa klik tombol Order Bot WA di website.`;
        }

        // coming soon
        if (
            text.includes("joki") ||
            text.includes("top up")
        ) {
            return `Untuk saat ini:
- Joki Rank = Coming Soon
- Top Up Game = Coming Soon

Nanti akan dibuka kembali setelah ada update dari King DS Store.`;
        }

        // kontak
        if (
            text.includes("kontak") ||
            text.includes("wa admin") ||
            text.includes("nomor admin") ||
            text.includes("whatsapp admin")
        ) {
            return `Kontak admin King DS Store:
WhatsApp: 085143887892
Email: topdragonfly15@gmail.com

Anda juga bisa langsung klik tombol WhatsApp di website untuk chat admin.`;
        }

        return `Maaf, saya belum paham pertanyaan itu sepenuhnya 🙏

Coba gunakan kata kunci seperti:
- cara order
- pembayaran
- premium apps
- jasa edit
- starlight
- bot whatsapp
- akun seller / buyer

Atau langsung hubungi admin via WhatsApp untuk pertanyaan yang lebih spesifik.`;
    }

    function handleAiFaqSend() {
        const text = aiFaqInput?.value.trim();
        if (!text) return;

        addAiMessage(text, "user");
        aiFaqInput.value = "";

        setTimeout(() => {
            const response = getAiFaqResponse(text);
            addAiMessage(response, "bot");
        }, 350);
    }

    // tombol buka AI FAQ manual (kalau ada)
    if (openAiFaqBtn) {
        openAiFaqBtn.addEventListener("click", openAiFaqModal);
    }

    // tombol close modal AI
    if (closeAiFaq) {
        closeAiFaq.addEventListener("click", closeAiFaqModal);
    }

    // klik area gelap luar modal -> tutup
    if (aiFaqModal) {
        aiFaqModal.addEventListener("click", e => {
            if (e.target === aiFaqModal) {
                closeAiFaqModal();
            }
        });
    }

    // tombol kirim
    if (sendAiFaq) {
        sendAiFaq.addEventListener("click", handleAiFaqSend);
    }

    // enter untuk kirim
    if (aiFaqInput) {
        aiFaqInput.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleAiFaqSend();
            }
        });
    }

    // pesan pembuka default saat modal dibuka pertama kali
    if (aiFaqBody && aiFaqBody.children.length === 0) {
        addAiMessage(`Halo, saya AI Assistant King DS Store 👋
Silakan tanya apa saja seputar produk, pembayaran, cara order, premium apps, bot WhatsApp, atau jasa edit.`, "bot");
    }

    // expose untuk ESC handler
    window.closeAiFaqModal = closeAiFaqModal;
}

/* =========================================================
   ESC CLOSE MODAL
========================================================= */
function initEscClose() {
    document.addEventListener("keydown", e => {
        if (e.key !== "Escape") return;

        if (typeof window.closeOrderModalFunc === "function") {
            window.closeOrderModalFunc();
        }

        if (typeof window.closeAiFaqModal === "function") {
            window.closeAiFaqModal();
        }

        const menuToggle = document.getElementById("menuToggle");
        const navMenu = document.getElementById("navMenu");

        if (menuToggle && navMenu && navMenu.classList.contains("active")) {
            menuToggle.classList.remove("active");
            navMenu.classList.remove("active");
            document.body.classList.remove("menu-open");
        }
    });
}

/* =========================================================
   SMOOTH SCROLL NAV LINK
========================================================= */
function initSmoothScroll() {
    const allNavAnchors = document.querySelectorAll('a[href^="#"]');
    if (!allNavAnchors.length) return;

    allNavAnchors.forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (!targetId || targetId === "#") return;

            const targetEl = document.querySelector(targetId);
            if (!targetEl) return;

            e.preventDefault();

            const headerOffset = 90;
            const elementPosition = targetEl.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        });
    });
}

/* =========================================================
   REGENERATE RAIN ON RESIZE
========================================================= */
function initResizeRain() {
    let resizeTimer;

    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initRainEffect();
        }, 250);
    });
}