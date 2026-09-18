<?php
/**
 * Plugin Name: SOFINFRA Properties Engine
 * Plugin URI:  http://sofinfra.local/
 * Description: Premium Real Estate & Infrastructure Property Engine for SOFINFRA. Powers the property CPT, custom meta fields, visitor submission pending workflow, and REST API.
 * Version:     1.0.0
 * Author:      SOFINFRA Digital
 * Text Domain: sofinfra-properties
 * License:     GPL-2.0+
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class Sofinfra_Properties_Plugin {

    public function __construct() {
        // Register CPT and Taxonomies
        add_action('init', [$this, 'register_property_cpt']);
        add_action('init', [$this, 'register_taxonomies']);

        // Custom Meta Boxes in Admin
        add_action('add_meta_boxes', [$this, 'add_property_meta_boxes']);
        add_action('save_post_property', [$this, 'save_property_meta']);

        // Admin Columns
        add_filter('manage_property_posts_columns', [$this, 'set_custom_property_columns']);
        add_action('manage_property_posts_custom_column', [$this, 'render_custom_property_columns'], 10, 2);

        // REST API Endpoints
        add_action('rest_api_init', [$this, 'register_rest_routes']);

        // Enable CORS for Next.js Frontend
        add_action('rest_api_init', [$this, 'enable_cors']);

        // Activation hook to seed sample properties
        register_activation_hook(__FILE__, [$this, 'on_activate']);
    }

    /**
     * Register Custom Post Type: property
     */
    public function register_property_cpt() {
        $labels = [
            'name'               => _x('Properties', 'post type general name', 'sofinfra-properties'),
            'singular_name'      => _x('Property', 'post type singular name', 'sofinfra-properties'),
            'menu_name'          => _x('SOFINFRA Properties', 'admin menu', 'sofinfra-properties'),
            'name_admin_bar'     => _x('Property', 'add new on admin bar', 'sofinfra-properties'),
            'add_new'            => _x('Add New Property', 'property', 'sofinfra-properties'),
            'add_new_item'       => __('Add New Property', 'sofinfra-properties'),
            'new_item'           => __('New Property', 'sofinfra-properties'),
            'edit_item'          => __('Edit Property', 'sofinfra-properties'),
            'view_item'          => __('View Property', 'sofinfra-properties'),
            'all_items'          => __('All Properties', 'sofinfra-properties'),
            'search_items'       => __('Search Properties', 'sofinfra-properties'),
            'not_found'          => __('No properties found.', 'sofinfra-properties'),
            'not_found_in_trash' => __('No properties found in Trash.', 'sofinfra-properties'),
        ];

        $args = [
            'labels'             => $labels,
            'public'             => true,
            'publicly_queryable' => true,
            'show_ui'            => true,
            'show_in_menu'       => true,
            'query_var'          => true,
            'rewrite'            => ['slug' => 'properties'],
            'capability_type'    => 'post',
            'has_archive'        => true,
            'hierarchical'       => false,
            'menu_position'      => 5,
            'menu_icon'          => 'dashicons-building',
            'supports'           => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
            'show_in_rest'       => true,
        ];

        register_post_type('property', $args);
    }

    /**
     * Register Taxonomies
     */
    public function register_taxonomies() {
        // Property Type
        register_taxonomy('property_type', ['property'], [
            'hierarchical'      => true,
            'labels'            => [
                'name'          => __('Property Types', 'sofinfra-properties'),
                'singular_name' => __('Property Type', 'sofinfra-properties'),
            ],
            'show_ui'           => true,
            'show_admin_column' => true,
            'show_in_rest'      => true,
            'query_var'         => true,
            'rewrite'           => ['slug' => 'property-type'],
        ]);

        // Listing Type (For Sale, Rent, Lease)
        register_taxonomy('listing_type', ['property'], [
            'hierarchical'      => true,
            'labels'            => [
                'name'          => __('Listing Types', 'sofinfra-properties'),
                'singular_name' => __('Listing Type', 'sofinfra-properties'),
            ],
            'show_ui'           => true,
            'show_admin_column' => true,
            'show_in_rest'      => true,
            'query_var'         => true,
            'rewrite'           => ['slug' => 'listing-type'],
        ]);
    }

    /**
     * Meta Boxes
     */
    public function add_property_meta_boxes() {
        // Pricing Meta Box
        add_meta_box(
            'sofinfra_pricing_meta',
            __('Pricing & Valuation Configuration', 'sofinfra-properties'),
            [$this, 'render_pricing_meta_box'],
            'property',
            'normal',
            'high'
        );

        // Display Mode & External URL
        add_meta_box(
            'sofinfra_display_mode_meta',
            __('Property Detail Display Mode (Popup vs External URL)', 'sofinfra-properties'),
            [$this, 'render_display_mode_meta_box'],
            'property',
            'normal',
            'high'
        );

        // Architectural & Location Specs
        add_meta_box(
            'sofinfra_specs_meta',
            __('Architectural Specifications & Location', 'sofinfra-properties'),
            [$this, 'render_specs_meta_box'],
            'property',
            'normal',
            'default'
        );

        // Submitter / Owner Information
        add_meta_box(
            'sofinfra_owner_meta',
            __('Owner / Submitter Contact Information (Confidential)', 'sofinfra-properties'),
            [$this, 'render_owner_meta_box'],
            'property',
            'side',
            'default'
        );
    }

    public function render_pricing_meta_box($post) {
        wp_nonce_field('sofinfra_meta_action', 'sofinfra_meta_nonce');
        $price_avail = get_post_meta($post->ID, '_sofinfra_price_availability', true) ?: 'request';
        $price = get_post_meta($post->ID, '_sofinfra_price', true);
        $price_max = get_post_meta($post->ID, '_sofinfra_price_max', true);
        $currency = get_post_meta($post->ID, '_sofinfra_currency', true) ?: 'USD';
        ?>
        <table class="form-table">
            <tr>
                <th><label for="price_availability">Price Availability:</label></th>
                <td>
                    <select name="price_availability" id="price_availability" style="width: 250px;">
                        <option value="request" <?php selected($price_avail, 'request'); ?>>Price on Request (Do not show exact price)</option>
                        <option value="contact" <?php selected($price_avail, 'contact'); ?>>Contact for Price</option>
                        <option value="price" <?php selected($price_avail, 'price'); ?>>Enter Exact Price / Range</option>
                    </select>
                    <p class="description">If 'Price on Request' is chosen, the price is not mandatory and 'Price on Request' will display gracefully.</p>
                </td>
            </tr>
            <tr>
                <th><label for="price">Price Amount:</label></th>
                <td>
                    <input type="number" name="price" id="price" value="<?php echo esc_attr($price); ?>" style="width: 250px;" placeholder="e.g. 14500000" />
                    <select name="currency" style="width: 100px;">
                        <option value="USD" <?php selected($currency, 'USD'); ?>>USD ($)</option>
                        <option value="AED" <?php selected($currency, 'AED'); ?>>AED</option>
                        <option value="GBP" <?php selected($currency, 'GBP'); ?>>GBP (£)</option>
                        <option value="EUR" <?php selected($currency, 'EUR'); ?>>EUR (€)</option>
                        <option value="INR" <?php selected($currency, 'INR'); ?>>INR (₹)</option>
                    </select>
                </td>
            </tr>
            <tr>
                <th><label for="price_max">Max Price (If Price Range):</label></th>
                <td>
                    <input type="number" name="price_max" id="price_max" value="<?php echo esc_attr($price_max); ?>" style="width: 250px;" placeholder="Optional upper boundary" />
                </td>
            </tr>
        </table>
        <?php
    }

    public function render_display_mode_meta_box($post) {
        $detail_mode = get_post_meta($post->ID, '_sofinfra_detail_mode', true) ?: 'popup';
        $external_url = get_post_meta($post->ID, '_sofinfra_external_url', true);
        ?>
        <table class="form-table">
            <tr>
                <th><label for="detail_mode">Detail Click Behavior:</label></th>
                <td>
                    <select name="detail_mode" id="detail_mode" style="width: 250px;">
                        <option value="popup" <?php selected($detail_mode, 'popup'); ?>>Option A — Open In Popup Modal</option>
                        <option value="external" <?php selected($detail_mode, 'external'); ?>>Option B — Redirect to External URL</option>
                    </select>
                    <p class="description">Select whether clicking this property opens the luxury popup dossier or redirects to an external project website.</p>
                </td>
            </tr>
            <tr>
                <th><label for="external_url">External Project URL:</label></th>
                <td>
                    <input type="url" name="external_url" id="external_url" value="<?php echo esc_attr($external_url); ?>" class="large-text" placeholder="https://example.com/project-showcase" />
                    <p class="description">Used when Detail Mode is set to 'Option B — Redirect to External URL'.</p>
                </td>
            </tr>
        </table>
        <?php
    }

    public function render_specs_meta_box($post) {
        $city = get_post_meta($post->ID, '_sofinfra_city', true);
        $state = get_post_meta($post->ID, '_sofinfra_state', true);
        $country = get_post_meta($post->ID, '_sofinfra_country', true);
        $locality = get_post_meta($post->ID, '_sofinfra_locality', true);
        $pincode = get_post_meta($post->ID, '_sofinfra_pincode', true);

        $area = get_post_meta($post->ID, '_sofinfra_area', true);
        $area_unit = get_post_meta($post->ID, '_sofinfra_area_unit', true) ?: 'sq ft';
        $bedrooms = get_post_meta($post->ID, '_sofinfra_bedrooms', true);
        $bathrooms = get_post_meta($post->ID, '_sofinfra_bathrooms', true);
        $furnishing = get_post_meta($post->ID, '_sofinfra_furnishing', true) ?: 'Furnished';
        $parking = get_post_meta($post->ID, '_sofinfra_parking', true);
        $amenities = get_post_meta($post->ID, '_sofinfra_amenities', true);
        ?>
        <table class="form-table">
            <tr>
                <th><label>Geographic Location:</label></th>
                <td>
                    <input type="text" name="city" value="<?php echo esc_attr($city); ?>" placeholder="City (e.g. Dubai)" style="width: 200px;" />
                    <input type="text" name="locality" value="<?php echo esc_attr($locality); ?>" placeholder="Locality / Area" style="width: 200px;" />
                    <input type="text" name="state" value="<?php echo esc_attr($state); ?>" placeholder="State / Region" style="width: 150px;" />
                    <input type="text" name="country" value="<?php echo esc_attr($country); ?>" placeholder="Country" style="width: 150px;" />
                </td>
            </tr>
            <tr>
                <th><label>Area & Dimensions:</label></th>
                <td>
                    <input type="number" name="area" value="<?php echo esc_attr($area); ?>" placeholder="Total Area" style="width: 150px;" />
                    <select name="area_unit" style="width: 100px;">
                        <option value="sq ft" <?php selected($area_unit, 'sq ft'); ?>>sq ft</option>
                        <option value="sq m" <?php selected($area_unit, 'sq m'); ?>>sq m</option>
                        <option value="acres" <?php selected($area_unit, 'acres'); ?>>acres</option>
                    </select>
                    &nbsp;&nbsp;
                    <input type="number" name="bedrooms" value="<?php echo esc_attr($bedrooms); ?>" placeholder="Beds" style="width: 90px;" />
                    <input type="number" name="bathrooms" value="<?php echo esc_attr($bathrooms); ?>" placeholder="Baths" style="width: 90px;" />
                </td>
            </tr>
            <tr>
                <th><label>Furnishing & Parking:</label></th>
                <td>
                    <select name="furnishing" style="width: 180px;">
                        <option value="Furnished" <?php selected($furnishing, 'Furnished'); ?>>Furnished</option>
                        <option value="Semi-Furnished" <?php selected($furnishing, 'Semi-Furnished'); ?>>Semi-Furnished</option>
                        <option value="Unfurnished" <?php selected($furnishing, 'Unfurnished'); ?>>Unfurnished</option>
                    </select>
                    <input type="text" name="parking" value="<?php echo esc_attr($parking); ?>" placeholder="Parking bays (e.g. 4 Covered Bays)" style="width: 240px;" />
                </td>
            </tr>
            <tr>
                <th><label for="amenities">Key Amenities (Comma separated):</label></th>
                <td>
                    <textarea name="amenities" id="amenities" rows="3" class="large-text" placeholder="Private Pool, Helipad Access, Concierge, Wine Cellar"><?php echo esc_textarea(is_array($amenities) ? implode(', ', $amenities) : $amenities); ?></textarea>
                </td>
            </tr>
        </table>
        <?php
    }

    public function render_owner_meta_box($post) {
        $owner_name = get_post_meta($post->ID, '_sofinfra_owner_name', true);
        $owner_email = get_post_meta($post->ID, '_sofinfra_owner_email', true);
        $owner_phone = get_post_meta($post->ID, '_sofinfra_owner_phone', true);
        $owner_whatsapp = get_post_meta($post->ID, '_sofinfra_owner_whatsapp', true);
        ?>
        <p>
            <label><strong>Owner Full Name:</strong></label><br>
            <input type="text" name="owner_name" value="<?php echo esc_attr($owner_name); ?>" class="widefat" />
        </p>
        <p>
            <label><strong>Email:</strong></label><br>
            <input type="email" name="owner_email" value="<?php echo esc_attr($owner_email); ?>" class="widefat" />
        </p>
        <p>
            <label><strong>Phone Number:</strong></label><br>
            <input type="text" name="owner_phone" value="<?php echo esc_attr($owner_phone); ?>" class="widefat" />
        </p>
        <p>
            <label><strong>WhatsApp:</strong></label><br>
            <input type="text" name="owner_whatsapp" value="<?php echo esc_attr($owner_whatsapp); ?>" class="widefat" />
        </p>
        <?php
    }

    public function save_property_meta($post_id) {
        if (!isset($_POST['sofinfra_meta_nonce']) || !wp_verify_nonce($_POST['sofinfra_meta_nonce'], 'sofinfra_meta_action')) {
            return;
        }

        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        if (!current_user_can('edit_post', $post_id)) return;

        $fields = [
            'price_availability', 'price', 'price_max', 'currency',
            'detail_mode', 'external_url',
            'city', 'state', 'country', 'locality', 'pincode',
            'area', 'area_unit', 'bedrooms', 'bathrooms', 'furnishing', 'parking',
            'owner_name', 'owner_email', 'owner_phone', 'owner_whatsapp'
        ];

        foreach ($fields as $field) {
            if (isset($_POST[$field])) {
                update_post_meta($post_id, '_sofinfra_' . $field, sanitize_text_field($_POST[$field]));
            }
        }

        if (isset($_POST['amenities'])) {
            $raw = sanitize_textarea_field($_POST['amenities']);
            $items = array_map('trim', explode(',', $raw));
            update_post_meta($post_id, '_sofinfra_amenities', array_filter($items));
        }
    }

    /**
     * Admin Columns Customization
     */
    public function set_custom_property_columns($columns) {
        $new = [];
        $new['cb'] = $columns['cb'];
        $new['title'] = __('Title', 'sofinfra-properties');
        $new['property_location'] = __('Location', 'sofinfra-properties');
        $new['property_valuation'] = __('Valuation / Price', 'sofinfra-properties');
        $new['detail_mode'] = __('Detail Mode', 'sofinfra-properties');
        $new['owner_info'] = __('Submitter / Owner', 'sofinfra-properties');
        $new['date'] = $columns['date'];
        return $new;
    }

    public function render_custom_property_columns($column, $post_id) {
        switch ($column) {
            case 'property_location':
                $city = get_post_meta($post_id, '_sofinfra_city', true);
                $country = get_post_meta($post_id, '_sofinfra_country', true);
                echo esc_html($city ? "$city, $country" : '—');
                break;

            case 'property_valuation':
                $avail = get_post_meta($post_id, '_sofinfra_price_availability', true);
                $price = get_post_meta($post_id, '_sofinfra_price', true);
                if ($avail === 'request') {
                    echo '<em>Price on Request</em>';
                } elseif ($avail === 'contact') {
                    echo '<em>Contact for Price</em>';
                } elseif ($price) {
                    $curr = get_post_meta($post_id, '_sofinfra_currency', true) ?: 'USD';
                    echo '<strong>' . esc_html($curr) . ' ' . number_format((float)$price) . '</strong>';
                } else {
                    echo '<em>Price on Request</em>';
                }
                break;

            case 'detail_mode':
                $mode = get_post_meta($post_id, '_sofinfra_detail_mode', true) ?: 'popup';
                if ($mode === 'external') {
                    $url = get_post_meta($post_id, '_sofinfra_external_url', true);
                    echo '<span style="color: #2271b1;">External URL</span>';
                } else {
                    echo '<span style="color: #0b2240; font-weight: 600;">Popup Modal</span>';
                }
                break;

            case 'owner_info':
                $owner = get_post_meta($post_id, '_sofinfra_owner_name', true);
                $phone = get_post_meta($post_id, '_sofinfra_owner_phone', true);
                if ($owner) {
                    echo esc_html($owner) . '<br><small>' . esc_html($phone) . '</small>';
                } else {
                    echo '<span style="color:#888;">SOFINFRA Direct</span>';
                }
                break;
        }
    }

    /**
     * REST API Routes
     */
    public function register_rest_routes() {
        // GET /wp-json/sofinfra/v1/properties
        register_rest_route('sofinfra/v1', '/properties', [
            'methods'  => 'GET',
            'callback' => [$this, 'rest_get_properties'],
            'permission_callback' => '__return_true',
        ]);

        // POST /wp-json/sofinfra/v1/submit-property
        // CRITICAL: Property submission forces 'post_status' => 'pending'
        register_rest_route('sofinfra/v1', '/submit-property', [
            'methods'  => 'POST',
            'callback' => [$this, 'rest_submit_property'],
            'permission_callback' => '__return_true',
        ]);
    }

    /**
     * Get Published Properties REST Callback
     * Only approved ('publish') properties are returned to the public frontend
     */
    public function rest_get_properties($request) {
        $args = [
            'post_type'      => 'property',
            'post_status'    => 'publish', // Strictly published only!
            'posts_per_page' => 50,
            'orderby'        => 'date',
            'order'          => 'DESC',
        ];

        $query = new WP_Query($args);
        $results = [];

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $id = get_the_ID();

                $featured_img_id = get_post_thumbnail_id($id);
                $featured_img_url = $featured_img_id ? wp_get_attachment_image_url($featured_img_id, 'full') : '';

                $results[] = [
                    'id'    => $id,
                    'title' => ['rendered' => get_the_title()],
                    'slug'  => get_post_field('post_name', $id),
                    'content' => ['rendered' => get_the_content()],
                    'excerpt' => ['rendered' => get_the_excerpt()],
                    'featured_image_url' => $featured_img_url,
                    'meta' => [
                        'price_availability' => get_post_meta($id, '_sofinfra_price_availability', true) ?: 'request',
                        'price'              => get_post_meta($id, '_sofinfra_price', true),
                        'price_max'          => get_post_meta($id, '_sofinfra_price_max', true),
                        'currency'           => get_post_meta($id, '_sofinfra_currency', true) ?: 'USD',
                        'detail_mode'        => get_post_meta($id, '_sofinfra_detail_mode', true) ?: 'popup',
                        'external_url'       => get_post_meta($id, '_sofinfra_external_url', true),
                        'city'               => get_post_meta($id, '_sofinfra_city', true),
                        'country'            => get_post_meta($id, '_sofinfra_country', true),
                        'locality'           => get_post_meta($id, '_sofinfra_locality', true),
                        'area'               => get_post_meta($id, '_sofinfra_area', true),
                        'area_unit'          => get_post_meta($id, '_sofinfra_area_unit', true) ?: 'sq ft',
                        'bedrooms'           => get_post_meta($id, '_sofinfra_bedrooms', true),
                        'bathrooms'          => get_post_meta($id, '_sofinfra_bathrooms', true),
                        'furnishing_status'  => get_post_meta($id, '_sofinfra_furnishing', true),
                        'parking'            => get_post_meta($id, '_sofinfra_parking', true),
                        'amenities'          => get_post_meta($id, '_sofinfra_amenities', true) ?: [],
                    ],
                ];
            }
            wp_reset_postdata();
        }

        return new WP_REST_Response($results, 200);
    }

    /**
     * Submit Property REST Callback
     * Enforces post_status => 'pending'
     */
    public function rest_submit_property($request) {
        $params = $request->get_json_params();

        if (empty($params['title'])) {
            return new WP_Error('missing_title', __('Property title is required', 'sofinfra-properties'), ['status' => 400]);
        }

        // Create new post strictly as PENDING REVIEW
        $post_data = [
            'post_title'   => sanitize_text_field($params['title']),
            'post_content' => isset($params['description']) ? sanitize_textarea_field($params['description']) : '',
            'post_status'  => 'pending', // NEVER PUBLISH AUTOMATICALLY
            'post_type'    => 'property',
        ];

        $post_id = wp_insert_post($post_data);

        if (is_wp_error($post_id)) {
            return new WP_Error('insert_failed', __('Failed to create property submission', 'sofinfra-properties'), ['status' => 500]);
        }

        // Save Owner details
        if (isset($params['fullName'])) update_post_meta($post_id, '_sofinfra_owner_name', sanitize_text_field($params['fullName']));
        if (isset($params['email'])) update_post_meta($post_id, '_sofinfra_owner_email', sanitize_email($params['email']));
        if (isset($params['phone'])) update_post_meta($post_id, '_sofinfra_owner_phone', sanitize_text_field($params['phone']));
        if (isset($params['whatsapp'])) update_post_meta($post_id, '_sofinfra_owner_whatsapp', sanitize_text_field($params['whatsapp']));

        // Save Pricing details
        $price_avail = isset($params['priceAvailability']) ? sanitize_text_field($params['priceAvailability']) : 'request';
        update_post_meta($post_id, '_sofinfra_price_availability', $price_avail);
        if (isset($params['price'])) update_post_meta($post_id, '_sofinfra_price', sanitize_text_field($params['price']));
        if (isset($params['priceMax'])) update_post_meta($post_id, '_sofinfra_price_max', sanitize_text_field($params['priceMax']));
        if (isset($params['currency'])) update_post_meta($post_id, '_sofinfra_currency', sanitize_text_field($params['currency']));

        // Save Location & Specs
        if (isset($params['city'])) update_post_meta($post_id, '_sofinfra_city', sanitize_text_field($params['city']));
        if (isset($params['locality'])) update_post_meta($post_id, '_sofinfra_locality', sanitize_text_field($params['locality']));
        if (isset($params['country'])) update_post_meta($post_id, '_sofinfra_country', sanitize_text_field($params['country']));
        if (isset($params['area'])) update_post_meta($post_id, '_sofinfra_area', sanitize_text_field($params['area']));
        if (isset($params['areaUnit'])) update_post_meta($post_id, '_sofinfra_area_unit', sanitize_text_field($params['areaUnit']));
        if (isset($params['bedrooms'])) update_post_meta($post_id, '_sofinfra_bedrooms', sanitize_text_field($params['bedrooms']));
        if (isset($params['bathrooms'])) update_post_meta($post_id, '_sofinfra_bathrooms', sanitize_text_field($params['bathrooms']));

        // Save Amenities
        if (!empty($params['amenities']) && is_array($params['amenities'])) {
            $cleaned = array_map('sanitize_text_field', $params['amenities']);
            update_post_meta($post_id, '_sofinfra_amenities', $cleaned);
        }

        // Default detail mode is popup
        update_post_meta($post_id, '_sofinfra_detail_mode', 'popup');

        return new WP_REST_Response([
            'success' => true,
            'message' => 'Property submitted successfully! It has been placed in Pending Review for administrative diligence.',
            'post_id' => $post_id,
            'status'  => 'pending',
        ], 201);
    }

    /**
     * Enable CORS for Frontend Development
     */
    public function enable_cors() {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce");
    }

    /**
     * Activation Hook: Add sample properties if none exist
     */
    public function on_activate() {
        $this->register_property_cpt();
        $this->register_taxonomies();
        flush_rewrite_rules();
    }
}

new Sofinfra_Properties_Plugin();
