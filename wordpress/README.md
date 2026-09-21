# SOFINFRA Headless WordPress Setup

This directory contains the WordPress backend configuration and custom code for SOFINFRA.

## Directory Structure
- `mu-plugins/sofinfra-headless.php`:
  - Registers Custom Post Types:
    - `projects` (Societies & Townships)
    - `properties` (Property Listings)
  - Registers Custom REST API endpoints:
    - `GET /wp-json/sofinfra/v1/homepage`: Returns flexible content sections from the Homepage.
    - `GET /wp-json/sofinfra/v1/projects`: Returns all active societies and megaprojects with ACF meta and gallery images.
    - `GET /wp-json/sofinfra/v1/properties`: Returns all active property listings with ACF meta and gallery images.
    - `POST /wp-json/sofinfra/v1/submit-property`: Public submission endpoint that creates pending listings for admin review.
  - Headless Architecture & Routing:
    - Disables WordPress frontend rendering and automatically redirects any visitor or preview link to the Next.js app (`http://localhost:3000` or `FRONTEND_URL`).
    - Strips frontend clutter (emojis, generator tags, RSD, embeds).
    - Preserves full access to `/wp-admin/`, `/wp-login.php`, and `/wp-json/` REST APIs.
  - Configures CORS headers and REST API permissions.

- `mu-plugins/sofinfra-acf-fields.php`:
  - Programmatically defines all ACF Field Groups (no JSON or manual DB sync required):
    - **Homepage Flexible Content**: Hero, Property Listings, Societies, About, Services, Testimonials, CTA, Contact.
    - **Project / Society Meta**: Developer, Location, City, Price Range, Amenities, RERA ID, **Project Gallery (Multiple Image Uploads via ACF Gallery)**, Brochure URL, etc.
    - **Property Meta**: Category, Property Type, Price, Area, Specs, Location, Highlights, **Property Gallery (Multiple Image Uploads via ACF Gallery)**, Brochure, Featured status.

---

## How to Deploy to a Remote / Production WordPress Site

### 1. Prerequisites on Production WordPress:
1. Install and activate **Advanced Custom Fields Pro** (ACF Pro) on your WordPress host.
2. Ensure Pretty Permalinks are enabled (e.g. `/wp-admin/options-permalink.php` set to `Post name`).

### 2. Install MU-Plugins:
Copy the two files from `wordpress/mu-plugins/` into your live WordPress server's `wp-content/mu-plugins/` folder:
- `wp-content/mu-plugins/sofinfra-headless.php`
- `wp-content/mu-plugins/sofinfra-acf-fields.php`

*(WordPress automatically loads files in `wp-content/mu-plugins/` without needing manual plugin activation).*

### 3. Create the Homepage in WP-Admin:
1. Go to **Pages → Add New**.
2. Title it `Home` (slug: `home`).
3. Set it as your static homepage in **Settings → Reading**.
4. The **Homepage Flexible Content** sections will appear at the bottom of the page editor. Click **Add Row** to customize any section!

---

## How to Connect Next.js to Remote / Production WordPress

In Next.js, the endpoint is controlled by environment variables. No code changes are required!

### For Local Development:
In `.env.local`:
```bash
NEXT_PUBLIC_WORDPRESS_URL=http://sofinfra.local
WORDPRESS_URL=http://sofinfra.local
```

### For Production (e.g. Vercel, Netlify, AWS Amplify, Docker):
In your hosting provider's Environment Variables settings, define:
```bash
NEXT_PUBLIC_WORDPRESS_URL=https://cms.yourdomain.com
WORDPRESS_URL=https://cms.yourdomain.com
```

Next.js will automatically:
- Fetch dynamic homepage sections, properties, and projects from `https://cms.yourdomain.com/wp-json/sofinfra/v1/...`
- Use Incremental Static Regeneration (ISR) to cache and revalidate pages every 60 seconds.
- Fall back gracefully to built-in data if the WordPress server is ever unreachable, ensuring 100% uptime.
