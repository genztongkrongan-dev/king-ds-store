
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

    function openOrderModal(productName, categoryName, priceText) {
        if (!orderModal) return;

        if (orderProductInput) orderProductInput.value = productName || "";
        if (orderCategoryInput) orderCategoryInput.value = categoryName || "";
        if (orderPriceInput) orderPriceInput.value = priceText || "";

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