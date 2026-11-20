const searchForm = document.querySelector("#property-search");
const locationInput = document.querySelector("#location-search");
const typeSelect = document.querySelector("#home-type");
const budgetSelect = document.querySelector("#max-budget");
const listingCards = [...document.querySelectorAll(".listing-card")];
const listingsGrid = document.querySelector("#listings-grid");
const resultsCount = document.querySelector("#results-count span");
const emptyState = document.querySelector("#empty-state");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-nav");
const listingDialog = document.querySelector("#listing-dialog");

function transitionListings(update) {
  if (document.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.startViewTransition(update);
    return;
  }
  update();
}

function filterListings() {
  const location = locationInput.value.trim().toLowerCase();
  const selectedType = typeSelect.value;
  const maxBudget = budgetSelect.value === "any" ? Infinity : Number(budgetSelect.value);
  let visibleCount = 0;

  transitionListings(() => {
    for (const card of listingCards) {
      const matchesLocation = !location || card.dataset.neighborhood.includes(location);
      const matchesType = selectedType === "all" || card.dataset.type === selectedType;
      const matchesBudget = Number(card.dataset.price) <= maxBudget;
      const isVisible = matchesLocation && matchesType && matchesBudget;
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    }

    resultsCount.textContent = String(visibleCount);
    emptyState.hidden = visibleCount > 0;
    listingsGrid.hidden = visibleCount === 0;
  });
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  filterListings();
  document.querySelector("#homes").scrollIntoView({ behavior: "smooth", block: "start" });
});

searchForm.addEventListener("reset", () => {
  requestAnimationFrame(filterListings);
});

document.querySelector("#reset-search").addEventListener("click", () => {
  searchForm.reset();
});

document.querySelectorAll("[data-neighborhood-link]").forEach((link) => {
  link.addEventListener("click", () => {
    locationInput.value = link.dataset.neighborhoodLink;
    filterListings();
  });
});

document.querySelectorAll(".save-button").forEach((button) => {
  button.addEventListener("click", () => {
    const isSaved = button.getAttribute("aria-pressed") === "true";
    button.setAttribute("aria-pressed", String(!isSaved));
    button.setAttribute("aria-label", `${isSaved ? "Save" : "Remove saved"} ${button.closest(".listing-card").dataset.title}`);
  });
});

function openListing(card) {
  const image = card.querySelector(".listing-image-wrap img");
  const price = Number(card.dataset.price).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  document.querySelector("#dialog-image").src = image.src;
  document.querySelector("#dialog-image").alt = image.alt;
  document.querySelector("#dialog-address").textContent = card.dataset.address;
  document.querySelector("#dialog-title").textContent = card.dataset.title;
  document.querySelector("#dialog-price").textContent = price;
  document.querySelector("#dialog-facts").textContent = `${card.dataset.beds} · ${card.dataset.baths} · ${card.dataset.area}`;
  document.querySelector("#dialog-description").textContent = card.dataset.description;
  listingDialog.showModal();
}

document.querySelectorAll("[data-open-listing]").forEach((button) => {
  button.addEventListener("click", () => openListing(button.closest(".listing-card")));
});

document.querySelector(".dialog-close").addEventListener("click", () => listingDialog.close());
listingDialog.addEventListener("click", (event) => {
  if (event.target === listingDialog) listingDialog.close();
});

menuButton.addEventListener("click", () => {
  const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isExpanded));
  menuButton.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("is-open", !isExpanded);
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
  });
});
