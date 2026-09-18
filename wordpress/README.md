# SOFINFRA WordPress Backend Integration

This directory contains the WordPress plugin for **SOFINFRA** (`http://sofinfra.local/`).

## How to Install & Activate in Local WP

1. Open **Local WP** on your machine.
2. Right click your `sofinfra` site in Local WP and select **Go to site folder**, or navigate to:
   ```bash
   ~/Local\ Sites/sofinfra/app/public/wp-content/plugins/
   ```
3. Copy or symlink the `sofinfra-properties` folder into your Local WP plugins directory:
   ```bash
   cp -r /Users/badarrashdi/Sites/sofinfra/wordpress/plugins/sofinfra-properties ~/Local\ Sites/sofinfra/app/public/wp-content/plugins/
   ```
4. Log into your WordPress Admin at [http://sofinfra.local/wp-admin/](http://sofinfra.local/wp-admin/).
5. Navigate to **Plugins** and click **Activate** under **SOFINFRA Properties Engine**.
6. You will see the new menu item **SOFINFRA Properties** in the WordPress sidebar:
   - **All Properties**: View, edit, and publish properties.
   - **Add New Property**: Add residential and commercial properties with custom pricing, specs, and detail display mode (Popup vs External URL).
   - **Pending Submissions**: Submissions from the Next.js frontend are automatically saved as **Pending Review**, allowing you to verify owner contact info, review uploaded photos, set pricing, and publish.

## REST API Endpoints Provided

- `GET http://sofinfra.local/wp-json/sofinfra/v1/properties`
  - Returns only approved, published properties for the public Next.js frontend.
- `POST http://sofinfra.local/wp-json/sofinfra/v1/submit-property`
  - Public submission endpoint that creates properties with `post_status: 'pending'` for administrator review.
