# AutoShow

AutoShow is a Romanian-language front-end concept for an automotive shop. It showcases selected car models and includes demo account, vehicle-listing, contact, and profile flows.

## Features

- Landing page with featured vehicle stories
- Car catalog loaded from JSON, with search and category filtering
- Individual pages for selected vehicles
- Demo login and registration, user profile, and listing history
- Vehicle-sale and contact forms
- Responsive layouts and custom styling

## Tech stack

- HTML5
- CSS3
- Vanilla JavaScript
- JSON

## Project structure

```text
index.html          # Redirects to the application home page
pages/              # HTML pages
assets/
  css/              # Stylesheets
  data/             # Catalog data (cars.json)
  images/           # Project images
  js/               # JavaScript files
```

## Run locally

The catalog loads its JSON data with `fetch`, so serve the project over HTTP instead of opening the HTML files directly with `file://`. From the project directory, run:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000/>. The root `index.html` redirects to the application home page.

## Main pages

| Page | Purpose |
| --- | --- |
| `pages/index.html` | Home page and featured vehicles |
| `pages/modele.html` | Searchable vehicle catalog |
| `pages/supra.html`, `pages/nissan.html`, `pages/mert.html` | Featured vehicle pages |
| `pages/login.html`, `pages/profil.html` | Demo account and profile pages |
| `pages/vanzare.html`, `pages/confirmare.html` | Vehicle-listing form and confirmation |
| `pages/contact.html` | Contact form |

## Demo data

Account and form data are stored in the browser's `localStorage`. This project currently has no server-side authentication, database, or form-delivery service; the account and submission flows are demonstrations.
