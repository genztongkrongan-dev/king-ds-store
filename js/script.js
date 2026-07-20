
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
    initSkeletonLoading();
    initAutoGreeting();
    initBottomNav();
    initQuickAction();
    initScrollProgress();
    initLightbox();
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
    const orderDescriptionBox = document.getElementById("orderDescriptionBox");
    const orderDescriptionText = document.getElementById("orderDescriptionText");

    const premiumOrderButtons = document.querySelectorAll(".premium-order-btn");
    const botOrderButtons = document.querySelectorAll(".bot-order-btn");

    const paymentMethodSelect = document.getElementById("paymentMethod");
    const paymentDetailBox = document.getElementById("paymentDetailBox");
    const paymentDana = document.getElementById("paymentDana");
    const paymentBri = document.getElementById("paymentBri");
    const paymentQris = document.getElementById("paymentQris");

    function hideAllPaymentDetails() {
        if (paymentDana) paymentDana.classList.remove("active");
        if (paymentBri) paymentBri.classList.remove("active");
        if (paymentQris) paymentQris.classList.remove("active");
        if (paymentDetailBox) paymentDetailBox.classList.remove("active");
    }

    function showPaymentDetail(method) {
        hideAllPaymentDetails();

        if (!method || !paymentDetailBox) return;

        paymentDetailBox.classList.add("active");

        if (method === "DANA" && paymentDana) {
            paymentDana.classList.add("active");
        } else if (method === "BRI" && paymentBri) {
            paymentBri.classList.add("active");
        } else if (method === "QRIS" && paymentQris) {
            paymentQris.classList.add("active");
        }
    }

    function openOrderModal(productName, categoryName, priceText, descriptionText) {
        if (!orderModal) return;

        if (orderProductInput) orderProductInput.value = productName || "";
        if (orderCategoryInput) orderCategoryInput.value = categoryName || "";
        if (orderPriceInput) orderPriceInput.value = priceText || "";

        if (orderDescriptionBox && orderDescriptionText) {
            if (descriptionText) {
                orderDescriptionText.textContent = descriptionText;
                orderDescriptionBox.style.display = "block";
            } else {
                orderDescriptionText.textContent = "";
                orderDescriptionBox.style.display = "none";
            }
        }

        if (paymentMethodSelect) paymentMethodSelect.value = "";
        hideAllPaymentDetails();

        orderModal.classList.add("active");
        document.body.classList.add("modal-open");
    }

    function closeOrderModalFunc() {
        if (!orderModal) return;
        orderModal.classList.remove("active");
        document.body.classList.remove("modal-open");
        hideAllPaymentDetails();
    }

    premiumOrderButtons.forEach(button => {
        button.addEventListener("click", e => {
            e.preventDefault();

            const product = button.getAttribute("data-product") || "Produk";
            const category = button.getAttribute("data-category") || "Premium Apps";
            const price = button.getAttribute("data-price") || "-";
            const description = button.getAttribute("data-description") || "";

            openOrderModal(product, category, price, description);
        });
    });

    botOrderButtons.forEach(button => {
        button.addEventListener("click", e => {
            e.preventDefault();

            const product = button.getAttribute("data-product") || "Sewa Bot WhatsApp";
            const category = button.getAttribute("data-category") || "Bot WhatsApp";
            const price = button.getAttribute("data-price") || "-";
            const description = button.getAttribute("data-description") || "";

            openOrderModal(product, category, price, description);
        });
    });

    if (paymentMethodSelect) {
        paymentMethodSelect.addEventListener("change", function () {
            showPaymentDetail(this.value);
        });
    }

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

            let paymentInfo = "-";
            if (paymentMethod === "DANA") {
                paymentInfo = "DANA - 085143887892";
            } else if (paymentMethod === "BRI") {
                paymentInfo = "BRI - 6254 0102 7303 531";
            } else if (paymentMethod === "QRIS") {
                paymentInfo = "QRIS - Scan QRIS di form order";
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
Detail Pembayaran: ${paymentInfo}
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

    window.closeOrderModalFunc = closeOrderModalFunc;
}

/* =========================================================
   AI FAQ MODAL (chat sederhana berbasis kata kunci)
========================================================= */
function initAiFaqModal() {
    const aiFaqModal = document.getElementById("aiFaqModal");
    const closeAiFaqBtn = document.getElementById("closeAiFaq");
    const aiFaqBody = document.getElementById("aiFaqBody");
    const aiFaqInput = document.getElementById("aiFaqInput");
    const sendAiFaqBtn = document.getElementById("sendAiFaq");

    if (!aiFaqModal) return;

    function closeAiFaqModal() {
        aiFaqModal.classList.remove("active");
        aiFaqModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
    }

    function addMessage(text, sender) {
        if (!aiFaqBody) return;
        const bubble = document.createElement("div");
        bubble.className = `ai-message ${sender === "user" ? "ai-user" : "ai-bot"}`;
        bubble.textContent = text;
        aiFaqBody.appendChild(bubble);
        aiFaqBody.scrollTop = aiFaqBody.scrollHeight;
    }

    function getBotReply(rawMessage) {
        const msg = rawMessage.toLowerCase();

        if (msg.includes("harga") || msg.includes("berapa")) {
            return "Harga tiap layanan beda-beda tergantung produk. Cek bagian Produk Populer, Premium Apps, atau Layanan di halaman ini untuk detail harganya ya 😊";
        }
        if (msg.includes("starlight") || msg.includes("ml") || msg.includes("mobile legends")) {
            return "Starlight Mobile Legends tersedia Starlight Member (Rp35.000) dan Starlight Premium (Rp55.000). Proses gift aman dan cepat.";
        }
        if (msg.includes("joki")) {
            return "Joki Rank MLBB dihitung per bintang, mulai dari Rp3.000 (Grand Master) sampai Rp15.000 (Glory). Order 3x bonus 1 video montage, order 5x bonus 2 video.";
        }
        if (msg.includes("edit") || msg.includes("video")) {
            return "Jasa edit video (TikTok, montage, highlight, promosi) mulai dari Rp2.000 sampai Rp20.000 tergantung tingkat kerumitan.";
        }
        if (msg.includes("bot") || msg.includes("whatsapp") && msg.includes("sewa")) {
            return "Sewa Bot WhatsApp mulai dari Rp5.000. Ada paket bulanan biasa, dengan user premium, sampai premium grup.";
        }
        if (msg.includes("bayar") || msg.includes("payment") || msg.includes("dana") || msg.includes("bri") || msg.includes("qris")) {
            return "Pembayaran bisa lewat DANA, BRI, atau QRIS. Detail nomor/rekening otomatis muncul setelah kamu pilih metode pembayaran di form order.";
        }
        if (msg.includes("cara order") || msg.includes("order gimana") || msg.includes("gimana order")) {
            return "Caranya: pilih produk yang kamu mau → klik tombol order → isi data & pilih metode pembayaran → klik lanjutkan ke WhatsApp untuk konfirmasi ke admin.";
        }
        if (msg.includes("admin") || msg.includes("kontak") || msg.includes("hubungi")) {
            return "Kamu bisa hubungi admin langsung lewat WhatsApp di tombol 'Hubungi Admin' atau bagian Kontak di bawah halaman ini.";
        }
        if (msg.includes("premium apps") || msg.includes("aplikasi")) {
            return "Premium Apps tersedia banyak kategori: Editing & Creator, Streaming & Entertainment, Productivity & Utility, sampai AI Tools. Cek bagian Premium Apps ya!";
        }
        if (msg.includes("halo") || msg.includes("hai") || msg.includes("hi")) {
            return "Halo juga 👋 Ada yang bisa saya bantu seputar produk, harga, atau cara order di King DS Store?";
        }
        if (msg.includes("makasih") || msg.includes("terima kasih")) {
            return "Sama-sama! Kalau ada pertanyaan lain seputar King DS Store, tanya aja ya 😊";
        }

        return "Maaf, saya belum punya jawaban pasti untuk itu. Untuk info lebih detail, silakan hubungi admin langsung lewat WhatsApp di bagian Kontak ya 🙏";
    }

    function handleSend() {
        if (!aiFaqInput) return;
        const message = aiFaqInput.value.trim();
        if (!message) return;

        addMessage(message, "user");
        aiFaqInput.value = "";

        setTimeout(() => {
            addMessage(getBotReply(message), "bot");
        }, 400);
    }

    if (sendAiFaqBtn) {
        sendAiFaqBtn.addEventListener("click", handleSend);
    }

    if (aiFaqInput) {
        aiFaqInput.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
            }
        });
    }

    if (closeAiFaqBtn) {
        closeAiFaqBtn.addEventListener("click", closeAiFaqModal);
    }

    aiFaqModal.addEventListener("click", e => {
        if (e.target === aiFaqModal) {
            closeAiFaqModal();
        }
    });

    window.closeAiFaqModalFunc = closeAiFaqModal;
}

/* =========================================================
   SMOOTH SCROLL UNTUK LINK ANCHOR (#section)
========================================================= */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    if (!links.length) return;

    const header = document.querySelector("header");

    links.forEach(link => {
        link.addEventListener("click", e => {
            const targetId = link.getAttribute("href");
            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();

            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition =
                target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });
        });
    });
}

/* =========================================================
   TUTUP MODAL/MENU DENGAN TOMBOL ESC
========================================================= */
function initEscClose() {
    document.addEventListener("keydown", e => {
        if (e.key !== "Escape") return;

        if (typeof window.closeOrderModalFunc === "function") {
            window.closeOrderModalFunc();
        }
        if (typeof window.closeAiFaqModalFunc === "function") {
            window.closeAiFaqModalFunc();
        }
        if (typeof window.closeLightboxFunc === "function") {
            window.closeLightboxFunc();
        }
        if (typeof window.closeQuickActionFunc === "function") {
            window.closeQuickActionFunc();
        }

        const navMenu = document.getElementById("navMenu");
        const menuToggle = document.getElementById("menuToggle");
        if (navMenu && navMenu.classList.contains("active")) {
            navMenu.classList.remove("active");
            menuToggle?.classList.remove("active");
            document.body.classList.remove("menu-open");
        }
    });
}

/* =========================================================
   SKELETON LOADING UNTUK GAMBAR
========================================================= */
function initSkeletonLoading() {
    const images = document.querySelectorAll("img");

    images.forEach(img => {
        // lewati gambar yang sudah selesai dimuat (misal dari cache)
        if (img.complete && img.naturalWidth > 0) return;

        img.classList.add("img-skeleton", "img-fade");

        function reveal() {
            img.classList.add("img-loaded");
            img.addEventListener(
                "transitionend",
                () => img.classList.remove("img-skeleton"),
                { once: true }
            );
        }

        img.addEventListener("load", reveal, { once: true });
        img.addEventListener("error", reveal, { once: true });
    });
}

/* =========================================================
   AUTOMATIC GREETING (berdasarkan jam)
========================================================= */
function initAutoGreeting() {
    const toast = document.getElementById("greetingToast");
    const iconEl = document.getElementById("greetingIcon");
    const titleEl = document.getElementById("greetingTitle");
    const textEl = document.getElementById("greetingText");
    const closeBtn = document.getElementById("closeGreeting");

    if (!toast) return;

    if (sessionStorage.getItem("kingds-greeting-shown")) return;

    const hour = new Date().getHours();
    let greeting = "Selamat Malam";
    let icon = "🌙";
    let message = "Masih terjaga? Yuk cek promo dan layanan terbaru King DS Store.";

    if (hour >= 4 && hour < 11) {
        greeting = "Selamat Pagi";
        icon = "☀️";
        message = "Awali harimu dengan produk digital terbaik dari King DS Store.";
    } else if (hour >= 11 && hour < 15) {
        greeting = "Selamat Siang";
        icon = "🌤️";
        message = "Butuh premium apps atau jasa edit? King DS Store siap bantu.";
    } else if (hour >= 15 && hour < 18) {
        greeting = "Selamat Sore";
        icon = "🌇";
        message = "Cek Premium Apps dan layanan terbaru di King DS Store.";
    } else if (hour >= 18 && hour < 22) {
        greeting = "Selamat Malam";
        icon = "🌆";
        message = "Waktunya santai sambil lihat promo King DS Store malam ini.";
    }

    if (titleEl) titleEl.textContent = `${greeting} 👋`;
    if (textEl) textEl.textContent = message;
    if (iconEl) iconEl.textContent = icon;

    function hideGreeting() {
        toast.classList.remove("active");
        toast.setAttribute("aria-hidden", "true");
    }

    const showTimer = setTimeout(() => {
        toast.classList.add("active");
        toast.setAttribute("aria-hidden", "false");
        sessionStorage.setItem("kingds-greeting-shown", "1");
    }, 1200);

    const hideTimer = setTimeout(hideGreeting, 8000);

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            clearTimeout(hideTimer);
            hideGreeting();
        });
    }

    window.addEventListener("beforeunload", () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
    });
}

/* =========================================================
   BOTTOM NAVIGATION (mobile) - highlight sesuai scroll
========================================================= */
function initBottomNav() {
    const navItems = document.querySelectorAll(".bottom-nav-item");
    if (!navItems.length) return;

    const sections = Array.from(navItems)
        .map(item => document.getElementById(item.dataset.target))
        .filter(Boolean);

    if (!sections.length) return;

    function setActive(id) {
        navItems.forEach(item => {
            item.classList.toggle("active", item.dataset.target === id);
        });
    }

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActive(entry.target.id);
                }
            });
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(section => observer.observe(section));

    navItems.forEach(item => {
        item.addEventListener("click", () => setActive(item.dataset.target));
    });
}

/* =========================================================
   QUICK ACTION FAB
========================================================= */
function initQuickAction() {
    const quickAction = document.getElementById("quickAction");
    const toggleBtn = document.getElementById("quickActionToggle");
    const scrollTopBtn = document.getElementById("quickActionTop");

    if (!quickAction || !toggleBtn) return;

    function closeQuickAction() {
        quickAction.classList.remove("active");
    }

    toggleBtn.addEventListener("click", () => {
        quickAction.classList.toggle("active");
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            closeQuickAction();
        });
    }

    document.addEventListener("click", e => {
        if (!quickAction.contains(e.target)) {
            closeQuickAction();
        }
    });

    window.closeQuickActionFunc = closeQuickAction;
}

/* =========================================================
   SCROLL PROGRESS BAR
========================================================= */
function initScrollProgress() {
    const bar = document.getElementById("scrollProgress");
    if (!bar) return;

    function updateProgress() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
}

/* =========================================================
   LIGHTBOX FOTO TESTIMONI
========================================================= */
function initLightbox() {
    const lightbox = document.getElementById("lightboxModal");
    const lightboxImg = document.getElementById("lightboxImg");
    const closeLightboxBtn = document.getElementById("closeLightbox");
    const galleryImages = document.querySelectorAll(".testimonial-gallery img");

    if (!lightbox || !lightboxImg || !galleryImages.length) return;

    function openLightbox(src, alt) {
        lightboxImg.src = src;
        lightboxImg.alt = alt || "";
        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
    }

    function closeLightbox() {
        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
    }

    galleryImages.forEach(img => {
        img.addEventListener("click", () => openLightbox(img.src, img.alt));
    });

    if (closeLightboxBtn) {
        closeLightboxBtn.addEventListener("click", closeLightbox);
    }

    lightbox.addEventListener("click", e => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    window.closeLightboxFunc = closeLightbox;
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
/* =========================
   THEME TOGGLE (DARK / LIGHT)
========================= */
const themeToggle = document.getElementById("themeToggle");
const themeToggleIcon = document.querySelector(".theme-toggle-icon");
const themeToggleText = document.querySelector(".theme-toggle-text");

function applyTheme(mode) {
    if (mode === "light") {
        document.body.classList.add("light-mode");
        if (themeToggleIcon) themeToggleIcon.textContent = "☀️";
        if (themeToggleText) themeToggleText.textContent = "Mode Siang";
    } else {
        document.body.classList.remove("light-mode");
        if (themeToggleIcon) themeToggleIcon.textContent = "🌙";
        if (themeToggleText) themeToggleText.textContent = "Mode Gelap";
    }
}

const savedTheme = localStorage.getItem("kingds-theme");
if (savedTheme === "light") {
    applyTheme("light");
} else {
    applyTheme("dark");
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const isLight = document.body.classList.contains("light-mode");
        const nextTheme = isLight ? "dark" : "light";
        applyTheme(nextTheme);
        localStorage.setItem("kingds-theme", nextTheme);
    });
}