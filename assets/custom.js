(function () {
  const PRODUCTS = {
    "black-leather-bag": {
      name: "Black Leather Bag",
      price: 30,
      sizes: ["XS", "S", "M", "L"],
      colors: ["Black", "White"],
    },
    "blue-silk-tuxedo": {
      name: "Blue Silk Tuxedo",
      price: 70,
      sizes: ["XS", "S", "M", "L"],
      colors: ["Black", "White"],
    },
    "chequered-red-shirt": {
      name: "Chequered Red Shirt",
      price: 50,
      sizes: ["XS", "S", "M", "L"],
      colors: ["Black", "White"],
    },
    "classic-leather-jacket": {
      name: "Classic Leather Jacket",
      price: 80,
      sizes: ["XS", "S", "M", "L"],
      colors: ["Black", "White"],
    },
    "classic-varsity-top": {
      name: "Classic Varsity Top",
      price: 60,
      sizes: ["XS", "S", "M", "L"],
      colors: ["Black", "White"],
    },
    "dark-denim-top": {
      name: "Dark Denim Top",
      price: 60,
      sizes: ["XS", "S", "M", "L"],
      colors: ["Black", "White"],
    },
  };

  const cart = {};
  let activeProduct = null;
  let selectedSize = null;
  let selectedColor = null;

  const cartToggle = document.getElementById("cartToggle");
  const cartClose = document.getElementById("cartClose");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartSidebar = document.getElementById("cartSidebar");
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");

  const menuToggle = document.getElementById("menuToggle");
  const menuClose = document.getElementById("menuClose");
  const mobileMenu = document.getElementById("mobileMenu");
  const menuOverlay = document.getElementById("menuOverlay");

  const productPopup = document.getElementById("productPopup");
  const productPopupOverlay = document.getElementById("productPopupOverlay");
  const popupClose = document.getElementById("popupClose");
  const popupTitle = document.getElementById("popupTitle");
  const popupPrice = document.getElementById("popupPrice");
  const popupSizes = document.getElementById("popupSizes");
  const popupColors = document.getElementById("popupColors");
  const popupAddBtn = document.getElementById("popupAddBtn");

  function getTotalItems() {
    return Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
  }

  function getTotalPrice() {
    return Object.values(cart).reduce((sum, item) => sum + item.qty * item.price, 0);
  }

  function updateCartUI() {
    const totalItems = getTotalItems();
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? "flex" : "none";
    cartToggle.classList.toggle("visible", totalItems > 0);
    cartTotal.textContent = "$" + getTotalPrice().toFixed(2);

    if (totalItems === 0) {
      cartItems.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
      return;
    }

    cartItems.innerHTML = Object.values(cart)
      .map(
        (item) => `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p class="cart-item-variant">${item.size} / ${item.color}</p>
            <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            <div class="cart-item-controls">
              <button type="button" class="qty-btn qty-minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
              <span class="qty-value">${item.qty}</span>
              <button type="button" class="qty-btn qty-plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <button type="button" class="remove-btn" data-id="${item.id}" aria-label="Remove item">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>`
      )
      .join("");
  }

  function renderOptionButtons(container, options, type, selected, onSelect) {
    container.innerHTML = options
      .map((opt) => {
        const isActive = opt === selected ? " active" : "";
        if (type === "color") {
          const swatchClass = opt.toLowerCase();
          return `<button type="button" class="option-btn color-btn${isActive}" data-value="${opt}">
            <span class="color-swatch ${swatchClass}"></span>${opt}
          </button>`;
        }
        return `<button type="button" class="option-btn${isActive}" data-value="${opt}">${opt}</button>`;
      })
      .join("");

    container.querySelectorAll(".option-btn").forEach((btn) => {
      btn.addEventListener("click", () => onSelect(btn.dataset.value));
    });
  }

  function renderSizeButtons() {
    renderOptionButtons(popupSizes, activeProduct.sizes, "size", selectedSize, (val) => {
      selectedSize = val;
      renderSizeButtons();
    });
  }

  function renderColorButtons() {
    renderOptionButtons(popupColors, activeProduct.colors, "color", selectedColor, (val) => {
      selectedColor = val;
      renderColorButtons();
    });
  }

  function openProductPopup(handle, card) {
    const product = PRODUCTS[handle];
    if (!product) return;

    activeProduct = { handle, card, ...product };
    selectedSize = product.sizes[0];
    selectedColor = product.colors[0];

    popupTitle.textContent = product.name;
    popupPrice.textContent = "$" + product.price.toFixed(2);

    renderSizeButtons();
    renderColorButtons();

    productPopup.classList.add("open");
    productPopupOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeProductPopup() {
    productPopup.classList.remove("open");
    productPopupOverlay.classList.remove("open");
    document.body.style.overflow = "";
    activeProduct = null;
  }

  function addToCart() {
    if (!activeProduct || !selectedSize || !selectedColor) return;

    const { handle, name, price, card } = activeProduct;
    const id = `${handle}-${selectedSize}-${selectedColor}`;
    const image = card.querySelector("img").src;

    if (cart[id]) {
      cart[id].qty += 1;
    } else {
      cart[id] = { id, handle, name, price, image, size: selectedSize, color: selectedColor, qty: 1 };
    }

    updateCartUI();
    closeProductPopup();

    const btn = card.querySelector(".add-btn");
    btn.classList.add("added");
    setTimeout(() => btn.classList.remove("added"), 400);
  }

  function openCart() {
    cartSidebar.classList.add("open");
    cartOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeCart() {
    cartSidebar.classList.remove("open");
    cartOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  function openMenu() {
    mobileMenu.classList.add("open");
    menuOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    mobileMenu.classList.remove("open");
    menuOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".product-card .add-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const card = btn.closest(".product-card");
      openProductPopup(card.dataset.handle, card);
    });
  });

  popupClose.addEventListener("click", closeProductPopup);
  productPopupOverlay.addEventListener("click", closeProductPopup);
  popupAddBtn.addEventListener("click", addToCart);

  cartToggle.addEventListener("click", openCart);
  cartClose.addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);

  menuToggle.addEventListener("click", openMenu);
  menuClose.addEventListener("click", closeMenu);
  menuOverlay.addEventListener("click", closeMenu);

  cartItems.addEventListener("click", (e) => {
    const plusBtn = e.target.closest(".qty-plus");
    const minusBtn = e.target.closest(".qty-minus");
    const removeBtn = e.target.closest(".remove-btn");

    if (plusBtn) {
      cart[plusBtn.dataset.id].qty += 1;
      updateCartUI();
    }

    if (minusBtn) {
      const id = minusBtn.dataset.id;
      if (cart[id].qty > 1) {
        cart[id].qty -= 1;
      } else {
        delete cart[id];
      }
      updateCartUI();
    }

    if (removeBtn) {
      delete cart[removeBtn.dataset.id];
      updateCartUI();
    }
  });

  checkoutBtn.addEventListener("click", () => {
    if (getTotalItems() === 0) return;
    alert("Thank you! Your order total is $" + getTotalPrice().toFixed(2));
    Object.keys(cart).forEach((key) => delete cart[key]);
    updateCartUI();
    closeCart();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeProductPopup();
      closeCart();
      closeMenu();
    }
  });

  updateCartUI();
})();
