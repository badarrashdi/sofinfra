<?php
/**
 * Plugin Name: SOFINFRA Headless Support & Custom Post Types
 * Description: Registers Custom Post Types (Projects & Properties), enables CORS headers, and provides dedicated REST API endpoints.
 * Version: 2.0.0
 * Author: SOFINFRA
 */

if (!defined('ABSPATH')) {
    exit;
}

// 1. Register Custom Post Types: Projects and Properties
add_action('init', 'sofinfra_register_cpts');

function sofinfra_register_cpts() {
    // A. Projects / Societies Post Type
    register_post_type('projects', array(
        'labels' => array(
            'name' => 'Projects & Societies',
            'singular_name' => 'Project',
            'add_new' => 'Add New Project',
            'add_new_item' => 'Add New Project / Society',
            'edit_item' => 'Edit Project',
            'new_item' => 'New Project',
            'view_item' => 'View Project',
            'search_items' => 'Search Projects',
            'not_found' => 'No projects found',
            'menu_name' => 'Projects & Societies',
        ),
        'public' => true,
        'has_archive' => true,
        'show_in_rest' => true,
        'menu_icon' => 'dashicons-building',
        'menu_position' => 5,
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'revisions', 'custom-fields'),
        'rewrite' => array('slug' => 'projects'),
    ));

    // B. Individual Property Units Post Type
    register_post_type('properties', array(
        'labels' => array(
            'name' => 'Property Listings',
            'singular_name' => 'Property',
            'add_new' => 'Add New Property',
            'add_new_item' => 'Add New Property Listing',
            'edit_item' => 'Edit Property',
            'new_item' => 'New Property',
            'view_item' => 'View Property',
            'search_items' => 'Search Properties',
            'not_found' => 'No properties found',
            'menu_name' => 'Property Listings',
        ),
        'public' => true,
        'has_archive' => true,
        'show_in_rest' => true,
        'menu_icon' => 'dashicons-admin-home',
        'menu_position' => 6,
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'revisions', 'custom-fields'),
        'rewrite' => array('slug' => 'properties'),
    ));
}

// 2. CORS Headers for Headless Next.js
add_action('init', function () {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
    header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With, Origin, Accept');
});

add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With, Origin, Accept');
        return $value;
    });

    // Dedicated REST routes
    register_rest_route('sofinfra/v1', '/homepage', array(
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'callback' => 'sofinfra_get_homepage_endpoint_data',
    ));

    register_rest_route('sofinfra/v1', '/projects', array(
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'callback' => 'sofinfra_get_projects_endpoint_data',
    ));

    register_rest_route('sofinfra/v1', '/properties', array(
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'callback' => 'sofinfra_get_properties_endpoint_data',
    ));
});

// 3. Homepage Endpoint Callback
function sofinfra_get_homepage_endpoint_data() {
    $frontpage_id = get_option('page_on_front');
    if (!$frontpage_id) {
        $home_page = get_page_by_path('home');
        if ($home_page) {
            $frontpage_id = $home_page->ID;
        }
    }

    if (!$frontpage_id) {
        $pages = get_posts(array(
            'post_type' => 'page',
            'posts_per_page' => 1,
            'post_status' => 'publish',
        ));
        if (!empty($pages)) {
            $frontpage_id = $pages[0]->ID;
        }
    }

    $page = $frontpage_id ? get_post($frontpage_id) : null;
    $sections = array();

    if ($frontpage_id && function_exists('get_field')) {
        $raw_sections = get_field('sections', $frontpage_id);
        if (is_array($raw_sections)) {
            $sections = $raw_sections;
        }
    }

    return rest_ensure_response(array(
        'id' => $frontpage_id ? intval($frontpage_id) : 0,
        'title' => $page ? $page->post_title : 'Home',
        'slug' => $page ? $page->post_name : 'home',
        'updated_at' => $page ? $page->post_modified : null,
        'sections' => $sections,
    ));
}

// 4. Projects Endpoint Callback
function sofinfra_get_projects_endpoint_data() {
    $posts = get_posts(array(
        'post_type' => 'projects',
        'posts_per_page' => 50,
        'post_status' => 'publish',
        'orderby' => 'menu_order date',
        'order' => 'ASC',
    ));

    $projects = array();
    foreach ($posts as $post) {
        $id = $post->ID;
        $thumb_url = get_the_post_thumbnail_url($id, 'full');
        $acf = function_exists('get_fields') ? get_fields($id) : array();

        $amenities = array();
        if (!empty($acf['amenities'])) {
            if (is_array($acf['amenities'])) {
                foreach ($acf['amenities'] as $am) {
                    $amenities[] = is_array($am) && isset($am['name']) ? $am['name'] : (is_string($am) ? $am : '');
                }
            } elseif (is_string($acf['amenities'])) {
                $amenities = array_map('trim', explode(',', $acf['amenities']));
            }
        }

        $gallery = array();
        if (!empty($acf['gallery_images']) && is_array($acf['gallery_images'])) {
            foreach ($acf['gallery_images'] as $img) {
                if (is_array($img) && isset($img['url'])) {
                    $gallery[] = $img['url'];
                } elseif (is_string($img)) {
                    $gallery[] = $img;
                }
            }
        }
        $main_img = !empty($acf['image_url']) ? $acf['image_url'] : ($thumb_url ? $thumb_url : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85');
        if (empty($gallery)) {
            $gallery = array($main_img);
        }

        $projects[] = array(
            'id' => 'project-' . $id,
            'wp_id' => $id,
            'name' => $post->post_title,
            'slug' => $post->post_name,
            'developer' => !empty($acf['developer']) ? $acf['developer'] : 'Premier Developer',
            'location' => !empty($acf['location']) ? $acf['location'] : 'Delhi NCR',
            'subLocation' => !empty($acf['sub_location']) ? $acf['sub_location'] : '',
            'city' => !empty($acf['city']) ? $acf['city'] : 'Gurugram',
            'type' => !empty($acf['project_type']) ? $acf['project_type'] : 'Ultra Luxury Residential',
            'status' => !empty($acf['status']) ? $acf['status'] : 'Ready to Move',
            'priceRange' => !empty($acf['price_range']) ? $acf['price_range'] : 'Price on Request',
            'units' => !empty($acf['units']) ? $acf['units'] : '',
            'configurations' => !empty($acf['configurations']) ? $acf['configurations'] : '',
            'image' => $main_img,
            'images' => $gallery,
            'gallery' => $gallery,
            'featured' => !empty($acf['featured']) ? (bool)$acf['featured'] : false,
            'amenities' => array_filter($amenities),
            'reraId' => !empty($acf['rera_id']) ? $acf['rera_id'] : 'Verified',
            'description' => $post->post_content,
        );
    }

    return rest_ensure_response($projects);
}

// 5. Properties Endpoint Callback
function sofinfra_get_properties_endpoint_data() {
    $posts = get_posts(array(
        'post_type' => 'properties',
        'posts_per_page' => 100,
        'post_status' => 'publish',
        'orderby' => 'menu_order date',
        'order' => 'DESC',
    ));

    $properties = array();
    foreach ($posts as $post) {
        $id = $post->ID;
        $thumb_url = get_the_post_thumbnail_url($id, 'full');
        $acf = function_exists('get_fields') ? get_fields($id) : array();

        $amenities = array();
        if (!empty($acf['amenities'])) {
            if (is_array($acf['amenities'])) {
                foreach ($acf['amenities'] as $am) {
                    $amenities[] = is_array($am) && isset($am['name']) ? $am['name'] : (is_string($am) ? $am : '');
                }
            } elseif (is_string($acf['amenities'])) {
                $amenities = array_map('trim', explode(',', $acf['amenities']));
            }
        }

        $gallery = array();
        if (!empty($acf['gallery_images']) && is_array($acf['gallery_images'])) {
            foreach ($acf['gallery_images'] as $img) {
                if (is_array($img) && isset($img['url'])) {
                    $gallery[] = $img['url'];
                } elseif (is_string($img)) {
                    $gallery[] = $img;
                }
            }
        }
        $main_img = !empty($acf['featured_image_url']) ? $acf['featured_image_url'] : ($thumb_url ? $thumb_url : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85');
        if (empty($gallery)) {
            $gallery = array($main_img);
        }

        $properties[] = array(
            'id' => $id,
            'title' => $post->post_title,
            'slug' => $post->post_name,
            'category' => !empty($acf['category']) ? $acf['category'] : 'residential',
            'propertyType' => !empty($acf['property_type']) ? $acf['property_type'] : 'Apartment',
            'listingType' => !empty($acf['listing_type']) ? $acf['listing_type'] : 'For Sale',
            'propertyStatus' => !empty($acf['property_status']) ? $acf['property_status'] : 'Ready to Move',
            'featured' => !empty($acf['featured']) ? (bool)$acf['featured'] : false,
            'location' => array(
                'city' => !empty($acf['city']) ? $acf['city'] : 'Gurugram',
                'state' => !empty($acf['state']) ? $acf['state'] : 'Haryana',
                'country' => 'India',
                'locality' => !empty($acf['locality']) ? $acf['locality'] : '',
                'fullAddress' => !empty($acf['full_address']) ? $acf['full_address'] : '',
            ),
            'pricing' => array(
                'priceAvailability' => !empty($acf['price']) ? 'price' : 'request',
                'amount' => !empty($acf['price']) ? floatval($acf['price']) : null,
                'currency' => 'INR',
                'formattedPrice' => !empty($acf['formatted_price']) ? $acf['formatted_price'] : 'Price on Request',
            ),
            'specs' => array(
                'area' => !empty($acf['area']) ? floatval($acf['area']) : 0,
                'areaUnit' => !empty($acf['area_unit']) ? $acf['area_unit'] : 'sq ft',
                'bedrooms' => !empty($acf['bedrooms']) ? intval($acf['bedrooms']) : 0,
                'bathrooms' => !empty($acf['bathrooms']) ? intval($acf['bathrooms']) : 0,
                'furnishingStatus' => !empty($acf['furnishing_status']) ? $acf['furnishing_status'] : 'Furnished',
                'parking' => !empty($acf['parking']) ? $acf['parking'] : 'Available',
                'floor' => !empty($acf['floor']) ? strval($acf['floor']) : '1',
                'totalFloors' => !empty($acf['total_floors']) ? strval($acf['total_floors']) : '1',
                'propertyAge' => !empty($acf['property_age']) ? $acf['property_age'] : '1 Year',
                'facing' => !empty($acf['facing']) ? $acf['facing'] : 'Open View',
                'availability' => 'Immediate',
            ),
            'amenities' => array_filter($amenities),
            'description' => $post->post_content,
            'shortDescription' => $post->post_excerpt,
            'featuredImage' => $main_img,
            'galleryImages' => $gallery,
            'images' => $gallery,
            'videoUrl' => !empty($acf['video_url']) ? $acf['video_url'] : null,
            'status' => $post->post_status,
            'createdAt' => $post->post_date,
        );
    }

    return rest_ensure_response($properties);
}

// =========================================================================
// 6. HEADLESS MODE: DISABLE WORDPRESS FRONTEND & REDIRECT TO NEXT.JS
// =========================================================================

add_action('template_redirect', 'sofinfra_headless_disable_wp_frontend');

function sofinfra_headless_disable_wp_frontend() {
    // Never block WP Admin, Cron, AJAX, or REST API
    if (is_admin() || wp_doing_ajax() || wp_doing_cron()) {
        return;
    }

    // Never block REST API requests
    if (defined('REST_REQUEST') && REST_REQUEST) {
        return;
    }

    $request_uri = $_SERVER['REQUEST_URI'] ?? '';
    if (
        strpos($request_uri, '/wp-json') !== false ||
        strpos($request_uri, 'wp-login.php') !== false ||
        strpos($request_uri, 'wp-admin') !== false
    ) {
        return;
    }

    $frontend_url = getenv('FRONTEND_URL') ?: 'http://localhost:3000';

    // Route single projects or properties directly to the Next.js section
    if (is_singular('projects')) {
        wp_redirect(rtrim($frontend_url, '/') . '/#societies', 302);
        exit;
    }

    if (is_singular('properties')) {
        wp_redirect(rtrim($frontend_url, '/') . '/#buy-properties', 302);
        exit;
    }

    // Redirect all WordPress frontend pages to Next.js
    wp_redirect(rtrim($frontend_url, '/'), 302);
    exit;
}

// Preview and permalinks in WordPress Admin point directly to Next.js
add_filter('preview_post_link', 'sofinfra_headless_filter_preview_link', 10, 2);
add_filter('post_type_link', 'sofinfra_headless_filter_post_link', 10, 2);

function sofinfra_headless_filter_preview_link($link, $post) {
    $frontend_url = rtrim(getenv('FRONTEND_URL') ?: 'http://localhost:3000', '/');
    if ($post->post_type === 'projects') {
        return $frontend_url . '/#societies';
    }
    if ($post->post_type === 'properties') {
        return $frontend_url . '/#buy-properties';
    }
    return $frontend_url;
}

function sofinfra_headless_filter_post_link($url, $post) {
    if (is_admin()) {
        $frontend_url = rtrim(getenv('FRONTEND_URL') ?: 'http://localhost:3000', '/');
        if ($post->post_type === 'projects') {
            return $frontend_url . '/#societies';
        }
        if ($post->post_type === 'properties') {
            return $frontend_url . '/#buy-properties';
        }
    }
    return $url;
}

// Clean up unnecessary WordPress frontend assets
add_action('after_setup_theme', function () {
    remove_action('wp_head', 'wp_generator');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wp_shortlink_wp_head');
    remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10);
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');
});

// =========================================================================
// 7. PUBLISH TRIGGER: INSTANT ON-DEMAND REVALIDATION FOR VERCEL NEXT.JS
// =========================================================================

function sofinfra_get_frontend_url() {
    $url = getenv('FRONTEND_URL');
    if ($url) {
        return rtrim($url, '/');
    }
    $host = $_SERVER['HTTP_HOST'] ?? '';
    if (strpos($host, 'local') !== false) {
        return 'http://localhost:3000';
    }
    return 'https://sofinfra.vercel.app';
}

function sofinfra_get_revalidate_secret() {
    return getenv('REVALIDATION_SECRET') ?: 'sofinfra_publish_secret_2026';
}

function sofinfra_trigger_frontend_revalidate($path = '/') {
    $frontend_url = sofinfra_get_frontend_url();
    $secret = sofinfra_get_revalidate_secret();
    $target_url = add_query_arg(array(
        'secret' => $secret,
        'path' => $path,
    ), rtrim($frontend_url, '/') . '/api/revalidate');

    wp_remote_get($target_url, array(
        'timeout' => 5,
        'blocking' => false, // Non-blocking so saving in WP admin is instant
        'sslverify' => false,
    ));
}

// Automatically trigger on publish, update, trash of pages, projects, and properties
add_action('save_post', 'sofinfra_on_save_post_trigger_revalidate', 20, 2);
add_action('trashed_post', 'sofinfra_on_trash_post_trigger_revalidate');
add_action('untrashed_post', 'sofinfra_on_trash_post_trigger_revalidate');

function sofinfra_on_save_post_trigger_revalidate($post_id, $post) {
    if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
        return;
    }
    if (!in_array($post->post_type, array('page', 'projects', 'properties'), true)) {
        return;
    }
    sofinfra_trigger_frontend_revalidate('/');
}

function sofinfra_on_trash_post_trigger_revalidate($post_id) {
    sofinfra_trigger_frontend_revalidate('/');
}

// Add 1-Click "Sync Frontend (Vercel)" Button to WordPress Admin Bar
add_action('admin_bar_menu', 'sofinfra_add_admin_bar_purge_button', 100);

function sofinfra_add_admin_bar_purge_button($admin_bar) {
    if (!current_user_can('edit_posts')) {
        return;
    }

    $admin_bar->add_node(array(
        'id' => 'sofinfra_purge_cache',
        'title' => '<span style="color:#c59b27;font-weight:bold;">⚡ Sync Frontend (Vercel)</span>',
        'href' => wp_nonce_url(admin_url('admin-post.php?action=sofinfra_purge_cache'), 'sofinfra_purge_nonce'),
        'meta' => array(
            'title' => 'Instantly purge Vercel cache and publish latest changes to frontend',
        ),
    ));
}

add_action('admin_post_sofinfra_purge_cache', 'sofinfra_handle_admin_bar_purge');

function sofinfra_handle_admin_bar_purge() {
    check_admin_referer('sofinfra_purge_nonce');

    if (!current_user_can('edit_posts')) {
        wp_die('Unauthorized');
    }

    $frontend_url = sofinfra_get_frontend_url();
    $secret = sofinfra_get_revalidate_secret();
    $target_url = add_query_arg(array(
        'secret' => $secret,
        'path' => '/',
    ), rtrim($frontend_url, '/') . '/api/revalidate');

    $res = wp_remote_get($target_url, array(
        'timeout' => 10,
        'sslverify' => false,
    ));

    $status = wp_remote_retrieve_response_code($res);
    $msg = ($status === 200) ? 'success' : 'error';

    wp_safe_redirect(add_query_arg('sofinfra_cache_purged', $msg, wp_get_referer() ?: admin_url()));
    exit;
}

add_action('admin_notices', function () {
    if (isset($_GET['sofinfra_cache_purged'])) {
        if ($_GET['sofinfra_cache_purged'] === 'success') {
            echo '<div class="notice notice-success is-dismissible"><p><strong>Vercel Frontend Synced:</strong> The cache has been successfully purged and updated!</p></div>';
        } else {
            echo '<div class="notice notice-warning is-dismissible"><p><strong>Vercel Sync Dispatched:</strong> Request was sent to frontend.</p></div>';
        }
    }
});
