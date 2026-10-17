# Blush & Bloom - Stationery Product Showcase

A responsive stationery product catalog built with plain HTML, CSS and JavaScript. Visitors can browse products, search, filter by category, sort by price, open a product page, save favourites and manage a shopping cart. It is a static site with no build step, so it deploys easily to Vercel, Netlify or Render.

**Live URL:** https://prathiksha-v123.github.io/Blush-Bloom-Stationery-Product-Showcase/

---

## Features

- **Product catalog:** 16 stationery products across 5 categories (pens, pencils, pouches, notebooks, accessories)
- **Live search:** filters products by name, category or description as you type
- **Category filters:** pills that show how many products each category has
- **Sorting:** featured, price low to high, price high to low, or name A to Z
- **Product detail page:** a separate page for each product, with related items from the same category
- **Client-side routing:** hash-based routes such as `#/product/pastel-colour-pens`, so the page never reloads
- **Shopping cart:** a slide-in drawer with quantity controls, remove, clear and a running total
- **Saved items:** a heart button on every product, plus a filter to show only saved items
- **Persistence:** the cart and saved items are remembered in `localStorage`
- **Responsive design:** works on desktop, tablet and mobile
- **Accessibility:** keyboard focus styles, ARIA labels, alt text, and reduced-motion support

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5 |
| Styling | CSS3 (custom properties, Grid, Flexbox, media queries) |
| Logic | Vanilla JavaScript (ES6+) |
| Fonts | Google Fonts (Fraunces, Manrope) |
| Images | Unsplash, with a placeholder fallback |
| Storage | Browser `localStorage` |
| Hosting | Vercel / Netlify / Render (static site) |

## Project Structure

```
blush-and-bloom/
├── index.html    # Page layout: header, catalog view, detail view, cart drawer
├── style.css     # All styling, with design tokens defined in :root
├── script.js     # Data, rendering, routing, cart and event handling
└── README.md     # Project documentation
```

## Architecture

The project follows a simple separation of concerns:

1. **Data layer:** the `products` array in `script.js` holds every product. Each product gets a URL-friendly `id` generated from its name.
2. **State:** the current category, the saved-items set and the cart object are kept in memory and synced to `localStorage`.
3. **Rendering layer:** functions such as `renderProducts()`, `renderDetail()` and `renderCart()` build the HTML from the current state.
4. **Router:** `route()` listens to the `hashchange` event and switches between the catalog view and the product detail view without reloading the page.
5. **Events:** a single delegated click listener handles add to cart, save, category filter and cart quantity actions.

```
User action  ->  Update state  ->  Re-render the affected view  ->  Save to localStorage
```

## Routes

| Route | Page |
|-------|------|
| `#/` or `#home` | Catalog home page |
| `#collection` | Scrolls to the product collection |
| `#/product/<product-id>` | Product detail page |

## Performance and Optimisation

- No frameworks or build tools, so there is nothing extra to download
- Images are loaded lazily and requested at the size they are shown (`w=600`, `w=1000`)
- A fallback placeholder image appears if an image fails to load
- Fonts are loaded with `display=swap` so text appears straight away
- Styles use CSS custom properties, which makes the theme easy to change in one place

## Run Locally

No installation is needed.

1. Download or clone the project folder.
2. Open `index.html` in any modern browser.

Or serve it with a local server:

```bash
# Python
python -m http.server 5500

# Node
npx serve .
```

Then open `http://localhost:5500`.

## Deployment

### Netlify
1. Push the project to GitHub.
2. Go to Netlify, choose **Add new site**, then **Import an existing project**.
3. Select your repository. Leave the build command empty and set the publish directory to `.`.
4. Click **Deploy**.

### Vercel
1. Push the project to GitHub.
2. Go to Vercel, choose **Add New**, then **Project**, and import your repository.
3. Set the framework preset to **Other**. Leave the build command empty.
4. Click **Deploy**.

### Render
1. Create a new **Static Site** and connect your repository.
2. Leave the build command empty and set the publish directory to `.`.
3. Click **Create Static Site**.

## Customisation

- **Add or edit products:** change the `products` array at the top of `script.js`.
- **Change the colours:** edit the variables in `:root` at the top of `style.css`.
- **Change the fonts:** update the Google Fonts `@import` line and the `font-family` rules in `style.css`.

## Future Improvements

- Connect to a backend or database for products and orders
- Add user accounts and a real checkout with UPI payment
- Add product reviews and ratings
- Add a dark mode

## Note

This is a demo project. Prices are illustrative, and checkout is not enabled.

## Author

**Prathiksha V**
B.Tech Artificial Intelligence & Data Science
Dr. N.G.P. Institute of Technology
