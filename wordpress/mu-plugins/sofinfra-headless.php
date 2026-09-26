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

    // C. Contact Inquiries & Leads Post Type
    register_post_type('contact_inquiries', array(
        'labels' => array(
            'name' => 'Inquiries & Leads',
            'singular_name' => 'Inquiry',
            'add_new' => 'Add Inquiry',
            'add_new_item' => 'Add New Inquiry',
            'edit_item' => 'View / Edit Inquiry',
            'new_item' => 'New Inquiry',
            'view_item' => 'View Inquiry',
            'search_items' => 'Search Inquiries',
            'not_found' => 'No inquiries found',
            'menu_name' => 'Inquiries & Leads',
        ),
        'public' => true,
        'publicly_queryable' => false,
        'exclude_from_search' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_nav_menus' => false,
        'show_in_admin_bar' => true,
        'show_in_rest' => true,
        'capability_type' => 'post',
        'map_meta_cap' => true,
        'hierarchical' => false,
        'menu_icon' => 'dashicons-email-alt',
        'menu_position' => 7,
        'supports' => array('title', 'editor', 'custom-fields', 'author'),
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

    // POST /wp-json/sofinfra/v1/contact
    register_rest_route('sofinfra/v1', '/contact', array(
        'methods' => 'POST',
        'permission_callback' => '__return_true',
        'callback' => 'sofinfra_handle_contact_submission',
    ));

    // POST /wp-json/sofinfra/v1/submit-property
    register_rest_route('sofinfra/v1', '/submit-property', array(
        'methods' => 'POST',
        'permission_callback' => '__return_true',
        'callback' => 'sofinfra_handle_property_submission',
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

    // Ensure contact_section returns sales@sofinfra.com and updated HQ address
    if (is_array($sections)) {
        foreach ($sections as &$sec) {
            if (isset($sec['acf_fc_layout']) && $sec['acf_fc_layout'] === 'contact_section') {
                if (empty($sec['email']) || $sec['email'] === 'contact@sofinfra.com' || strpos($sec['email'], 'sofinfra') !== false) {
                    $sec['email'] = 'sales@sofinfra.com';
                }
                if (empty($sec['address']) || strpos($sec['address'], 'Golf Course') !== false) {
                    $sec['address'] = 'S-306-308, 2nd Floor, Tower A, Palam Vihar, Gurugram(HR)-122017';
                }
            }
            if (isset($sec['acf_fc_layout']) && $sec['acf_fc_layout'] === 'about_section') {
                if (empty($sec['approach_heading'])) {
                    $sec['approach_heading'] = 'An Uncompromised Approach to Real Estate';
                }
                if (!empty($sec['image'])) {
                    if (is_array($sec['image']) && isset($sec['image']['url'])) {
                        $sec['image_url'] = $sec['image']['url'];
                    } elseif (is_numeric($sec['image'])) {
                        $sec['image_url'] = wp_get_attachment_url($sec['image']);
                    } elseif (is_string($sec['image'])) {
                        $sec['image_url'] = $sec['image'];
                    }
                }
                if (empty($sec['image_url'])) {
                    $sec['image_url'] = '/images/luxury-architecture.jpg';
                }
                if (empty($sec['image_badge'])) {
                    $sec['image_badge'] = 'Excellence In Execution';
                }
                if (empty($sec['image_caption'])) {
                    $sec['image_caption'] = 'Transforming premier spaces into generational legacies.';
                }
            }
            if (isset($sec['acf_fc_layout']) && $sec['acf_fc_layout'] === 'testimonials_section') {
                if (empty($sec['trust_metrics']) || !is_array($sec['trust_metrics'])) {
                    $sec['trust_metrics'] = array(
                        array('label' => 'RERA Certified Advisory', 'desc' => '100% compliant documentation'),
                        array('label' => '₹1,500+ Cr Handled', 'desc' => 'In Delhi NCR luxury transactions'),
                        array('label' => 'Zero Hidden Charges', 'desc' => 'Complete fiduciary transparency'),
                        array('label' => 'Verified Societies Only', 'desc' => 'Clear legal & structural titles'),
                    );
                }
            }
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
                } elseif (is_numeric($img)) {
                    $img_url = wp_get_attachment_url(intval($img));
                    if ($img_url) $gallery[] = $img_url;
                } elseif (is_string($img)) {
                    if (is_numeric($img)) {
                        $img_url = wp_get_attachment_url(intval($img));
                        if ($img_url) $gallery[] = $img_url;
                    } else {
                        $gallery[] = $img;
                    }
                }
            }
        }
        if ($thumb_url) {
            $main_img = $thumb_url;
        } elseif (!empty($gallery)) {
            $main_img = $gallery[0];
        } elseif (!empty($acf['image_url'])) {
            $main_img = $acf['image_url'];
        } else {
            $main_img = '';
        }
        if (empty($gallery) && $main_img) {
            $gallery = array($main_img);
        } elseif (!empty($gallery) && $main_img && !in_array($main_img, $gallery)) {
            array_unshift($gallery, $main_img);
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
                } elseif (is_numeric($img)) {
                    $img_url = wp_get_attachment_url(intval($img));
                    if ($img_url) $gallery[] = $img_url;
                } elseif (is_string($img)) {
                    if (is_numeric($img)) {
                        $img_url = wp_get_attachment_url(intval($img));
                        if ($img_url) $gallery[] = $img_url;
                    } else {
                        $gallery[] = $img;
                    }
                }
            }
        }

        // Main image priority: 1. WP post thumbnail, 2. First gallery image, 3. ACF featured_image_url
        if ($thumb_url) {
            $main_img = $thumb_url;
        } elseif (!empty($gallery)) {
            $main_img = $gallery[0];
        } elseif (!empty($acf['featured_image_url'])) {
            $main_img = $acf['featured_image_url'];
        } else {
            $main_img = '';
        }

        // Ensure gallery is populated and includes main image
        if (empty($gallery) && $main_img) {
            $gallery = array($main_img);
        } elseif (!empty($gallery) && $main_img && !in_array($main_img, $gallery)) {
            array_unshift($gallery, $main_img);
        }

        $developer = !empty($acf['developer']) ? $acf['developer'] : (get_post_meta($id, 'developer', true) ?: 'SOFINFRA Prime');
        $rera_id = !empty($acf['rera_id']) ? $acf['rera_id'] : (get_post_meta($id, 'rera_id', true) ?: 'RERA Approved');
        $sub_location = !empty($acf['sub_location']) ? $acf['sub_location'] : (get_post_meta($id, 'sub_location', true) ?: '');
        $prop_status = !empty($acf['property_status']) ? $acf['property_status'] : (get_post_meta($id, 'property_status', true) ?: 'Ready to Move');
        $configs = !empty($acf['configurations']) ? $acf['configurations'] : (get_post_meta($id, 'configurations', true) ?: '');

        $properties[] = array(
            'id' => $id,
            'title' => $post->post_title,
            'slug' => $post->post_name,
            'developer' => $developer,
            'reraId' => $rera_id,
            'category' => !empty($acf['category']) ? $acf['category'] : 'residential',
            'propertyType' => !empty($acf['property_type']) ? $acf['property_type'] : 'Apartment',
            'listingType' => !empty($acf['listing_type']) ? $acf['listing_type'] : 'For Sale',
            'propertyStatus' => $prop_status,
            'featured' => !empty($acf['featured']) ? (bool)$acf['featured'] : false,
            'location' => array(
                'city' => !empty($acf['city']) ? $acf['city'] : 'Gurugram',
                'state' => !empty($acf['state']) ? $acf['state'] : 'Haryana',
                'country' => 'India',
                'locality' => !empty($acf['locality']) ? $acf['locality'] : '',
                'subLocation' => $sub_location,
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
                'configurations' => $configs,
                'developer' => $developer,
                'reraId' => $rera_id,
                'furnishingStatus' => !empty($acf['furnishing_status']) ? $acf['furnishing_status'] : (get_post_meta($id, 'furnishing_status', true) ?: 'Furnished'),
                'parking' => !empty($acf['parking']) ? $acf['parking'] : (get_post_meta($id, 'parking', true) ?: 'Available'),
                'floor' => !empty($acf['floor']) ? strval($acf['floor']) : (get_post_meta($id, 'floor', true) ?: '1'),
                'totalFloors' => !empty($acf['total_floors']) ? strval($acf['total_floors']) : (get_post_meta($id, 'total_floors', true) ?: '1'),
                'propertyAge' => !empty($acf['property_age']) ? $acf['property_age'] : (get_post_meta($id, 'property_age', true) ?: '1 Year'),
                'facing' => !empty($acf['facing']) ? $acf['facing'] : (get_post_meta($id, 'facing', true) ?: 'Open View'),
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

    $frontend_url = sofinfra_get_frontend_url();

    // Route single projects or properties directly to the Next.js section
    if (is_singular('projects')) {
        wp_redirect(rtrim($frontend_url, '/') . '/#buy-properties', 302);
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
    $frontend_url = sofinfra_get_frontend_url();
    if ($post->post_type === 'projects' || $post->post_type === 'properties') {
        return $frontend_url . '/#buy-properties';
    }
    return $frontend_url;
}

function sofinfra_headless_filter_post_link($url, $post) {
    if (is_admin()) {
        $frontend_url = sofinfra_get_frontend_url();
        if ($post->post_type === 'projects' || $post->post_type === 'properties') {
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
// 7. PUBLISH TRIGGER: INSTANT ON-DEMAND REVALIDATION FOR NEXT.JS FRONTEND
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
    return 'https://sofinfra.com';
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

// Add 1-Click "Sync Frontend (sofinfra.com)" Button to WordPress Admin Bar
add_action('admin_bar_menu', 'sofinfra_add_admin_bar_purge_button', 100);

function sofinfra_add_admin_bar_purge_button($admin_bar) {
    if (!current_user_can('edit_posts')) {
        return;
    }

    $admin_bar->add_node(array(
        'id' => 'sofinfra_purge_cache',
        'title' => '<span style="color:#c59b27;font-weight:bold;">⚡ Sync Frontend (sofinfra.com)</span>',
        'href' => wp_nonce_url(admin_url('admin-post.php?action=sofinfra_purge_cache'), 'sofinfra_purge_nonce'),
        'meta' => array(
            'title' => 'Instantly purge frontend cache and publish latest changes to sofinfra.com',
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
            echo '<div class="notice notice-success is-dismissible"><p><strong>sofinfra.com Frontend Synced:</strong> The cache has been successfully purged and updated!</p></div>';
        } else {
            echo '<div class="notice notice-warning is-dismissible"><p><strong>sofinfra.com Sync Dispatched:</strong> Request was sent to frontend.</p></div>';
        }
    }
});

// =========================================================================
// 8. CONTACT INQUIRIES ADMIN CUSTOMIZATION (COLUMNS, SORTING, FILTERING)
// =========================================================================

// Custom admin columns for Inquiries
add_filter('manage_contact_inquiries_posts_columns', 'sofinfra_contact_inquiries_columns');
function sofinfra_contact_inquiries_columns($columns) {
    $new = array();
    $new['cb'] = $columns['cb'];
    $new['title'] = 'Lead / Contact Name';
    $new['lead_phone'] = 'Phone / WhatsApp';
    $new['lead_email'] = 'Email';
    $new['lead_subject'] = 'Requirement Type';
    $new['lead_message'] = 'Message Preview';
    $new['date'] = 'Submission Date';
    return $new;
}

add_action('manage_contact_inquiries_posts_custom_column', 'sofinfra_contact_inquiries_column_content', 10, 2);
function sofinfra_contact_inquiries_column_content($column, $post_id) {
    switch ($column) {
        case 'lead_phone':
            $phone = get_post_meta($post_id, '_sofinfra_contact_phone', true);
            if ($phone) {
                $clean = preg_replace('/[^\d+]/', '', $phone);
                echo '<strong><a href="tel:' . esc_attr($clean) . '">' . esc_html($phone) . '</a></strong><br>';
                echo '<a href="https://wa.me/' . esc_attr(ltrim($clean, '+')) . '" target="_blank" style="color:#25D366;font-size:11px;font-weight:600;text-decoration:none;">💬 WhatsApp</a>';
            } else {
                echo '<span style="color:#999;">—</span>';
            }
            break;
        case 'lead_email':
            $email = get_post_meta($post_id, '_sofinfra_contact_email', true);
            if ($email) {
                echo '<a href="mailto:' . esc_attr($email) . '">' . esc_html($email) . '</a>';
            } else {
                echo '<span style="color:#999;">—</span>';
            }
            break;
        case 'lead_subject':
            $subj = get_post_meta($post_id, '_sofinfra_contact_subject', true);
            if ($subj) {
                echo '<span class="badge" style="background:#0b2240;color:#c59b27;padding:3px 8px;border-radius:4px;font-size:11px;font-weight:600;display:inline-block;">' . esc_html($subj) . '</span>';
            } else {
                echo '<span style="color:#999;">General</span>';
            }
            break;
        case 'lead_message':
            $msg = get_post_meta($post_id, '_sofinfra_contact_message', true) ?: get_the_content(null, false, $post_id);
            echo '<span style="color:#555;font-size:12px;">' . esc_html(wp_trim_words($msg, 12, '...')) . '</span>';
            break;
    }
}

// Make Columns Sortable in WordPress Admin
add_filter('manage_edit-contact_inquiries_sortable_columns', 'sofinfra_contact_inquiries_sortable_columns');
function sofinfra_contact_inquiries_sortable_columns($columns) {
    $columns['title'] = 'title';
    $columns['lead_subject'] = 'lead_subject';
    $columns['date'] = 'date';
    return $columns;
}

// Order by custom meta if requested
add_action('pre_get_posts', 'sofinfra_contact_inquiries_custom_orderby');
function sofinfra_contact_inquiries_custom_orderby($query) {
    if (!is_admin() || !$query->is_main_query() || $query->get('post_type') !== 'contact_inquiries') {
        return;
    }
    $orderby = $query->get('orderby');
    if ($orderby === 'lead_subject') {
        $query->set('meta_key', '_sofinfra_contact_subject');
        $query->set('orderby', 'meta_value');
    }
}

// Add Filter Dropdown by Requirement Type in WP Admin
add_action('restrict_manage_posts', 'sofinfra_filter_inquiries_by_subject');
function sofinfra_filter_inquiries_by_subject($post_type) {
    if ($post_type !== 'contact_inquiries') {
        return;
    }
    $selected = $_GET['inquiry_subject'] ?? '';
    $options = array(
        'Buying Residential (Gurugram/Noida)',
        'Commercial Acquisition / Cyber City',
        'Listing My Property For Sale',
        'NRI Investment Consultation',
    );
    echo '<select name="inquiry_subject">';
    echo '<option value="">All Requirement Types</option>';
    foreach ($options as $opt) {
        $sel = ($selected === $opt) ? ' selected="selected"' : '';
        echo '<option value="' . esc_attr($opt) . '"' . $sel . '>' . esc_html($opt) . '</option>';
    }
    echo '</select>';
}

add_filter('parse_query', 'sofinfra_apply_inquiry_subject_filter');
function sofinfra_apply_inquiry_subject_filter($query) {
    global $pagenow;
    if (is_admin() && $pagenow === 'edit.php' && isset($_GET['post_type']) && $_GET['post_type'] === 'contact_inquiries' && !empty($_GET['inquiry_subject'])) {
        $query->query_vars['meta_key'] = '_sofinfra_contact_subject';
        $query->query_vars['meta_value'] = sanitize_text_field($_GET['inquiry_subject']);
    }
}

// Meta Box to view full details when viewing the inquiry
add_action('add_meta_boxes', function() {
    add_meta_box(
        'sofinfra_inquiry_details',
        'Inquiry & Client Dossier',
        'sofinfra_render_inquiry_metabox',
        'contact_inquiries',
        'normal',
        'high'
    );
});

function sofinfra_render_inquiry_metabox($post) {
    $name = get_post_meta($post->ID, '_sofinfra_contact_name', true);
    $email = get_post_meta($post->ID, '_sofinfra_contact_email', true);
    $phone = get_post_meta($post->ID, '_sofinfra_contact_phone', true);
    $subject = get_post_meta($post->ID, '_sofinfra_contact_subject', true);
    $message = get_post_meta($post->ID, '_sofinfra_contact_message', true) ?: $post->post_content;
    $date = get_the_date('F j, Y, g:i a', $post->ID);
    $clean_phone = preg_replace('/[^\d+]/', '', $phone);
    ?>
    <table class="form-table" style="max-width:800px;">
        <tr>
            <th style="width:180px;"><strong>Client Full Name:</strong></th>
            <td><span style="font-size:15px;font-weight:bold;color:#0b2240;"><?php echo esc_html($name); ?></span></td>
        </tr>
        <tr>
            <th><strong>Phone / WhatsApp:</strong></th>
            <td>
                <a href="tel:<?php echo esc_attr($clean_phone); ?>" style="font-size:14px;font-weight:600;"><?php echo esc_html($phone); ?></a>
                &nbsp;|&nbsp;
                <a href="https://wa.me/<?php echo esc_attr(ltrim($clean_phone, '+')); ?>" target="_blank" style="display:inline-block;background:#25D366;color:#fff;padding:3px 10px;border-radius:4px;text-decoration:none;font-size:11px;font-weight:bold;">💬 Open in WhatsApp</a>
            </td>
        </tr>
        <tr>
            <th><strong>Email Address:</strong></th>
            <td><a href="mailto:<?php echo esc_attr($email); ?>"><?php echo esc_html($email); ?></a></td>
        </tr>
        <tr>
            <th><strong>Requirement Type:</strong></th>
            <td><span style="background:#0b2240;color:#c59b27;padding:4px 10px;border-radius:4px;font-weight:bold;"><?php echo esc_html($subject); ?></span></td>
        </tr>
        <tr>
            <th><strong>Date Submitted:</strong></th>
            <td><?php echo esc_html($date); ?></td>
        </tr>
        <tr>
            <th><strong>Detailed Requirements:</strong></th>
            <td>
                <div style="background:#f8fafc;border:1px solid #cbd5e1;padding:14px 18px;border-radius:6px;font-size:13px;line-height:1.6;white-space:pre-wrap;color:#1e293b;">
                    <?php echo esc_html($message); ?>
                </div>
            </td>
        </tr>
    </table>
    <?php
}

// =========================================================================
// 9. REST API HANDLER: CONTACT INQUIRY SUBMISSION WITH EMAIL
// =========================================================================

function sofinfra_handle_contact_submission($request) {
    $params = $request->get_json_params();

    $name = !empty($params['name']) ? sanitize_text_field($params['name']) : '';
    $email = !empty($params['email']) ? sanitize_email($params['email']) : '';
    $phone = !empty($params['phone']) ? sanitize_text_field($params['phone']) : '';
    $subject = !empty($params['subject']) ? sanitize_text_field($params['subject']) : 'General Advisory Inquiry';
    $message = !empty($params['message']) ? sanitize_textarea_field($params['message']) : 'Client requested consultation regarding ' . $subject;

    if (empty($name) || (empty($email) && empty($phone))) {
        return new WP_Error('missing_required_fields', 'Name and at least Phone or Email are required.', array('status' => 400));
    }

    $admin_user = get_user_by('email', get_option('admin_email'));
    $author_id = $admin_user ? $admin_user->ID : 1;

    $post_id = wp_insert_post(array(
        'post_type' => 'contact_inquiries',
        'post_title' => $name . ' — ' . $phone . ' (' . $subject . ')',
        'post_content' => $message,
        'post_status' => 'publish',
        'post_author' => $author_id,
    ));

    if (is_wp_error($post_id)) {
        return new WP_Error('insert_failed', 'Could not record inquiry in database.', array('status' => 500));
    }

    update_post_meta($post_id, '_sofinfra_contact_name', $name);
    update_post_meta($post_id, '_sofinfra_contact_email', $email);
    update_post_meta($post_id, '_sofinfra_contact_phone', $phone);
    update_post_meta($post_id, '_sofinfra_contact_subject', $subject);
    update_post_meta($post_id, '_sofinfra_contact_message', $message);
    update_post_meta($post_id, '_sofinfra_contact_date', current_time('mysql'));

    // Send email to admin
    $admin_email = get_option('admin_email') ?: 'sales@sofinfra.com';
    $clean_phone = preg_replace('/[^\d+]/', '', $phone);
    $wa_link = 'https://wa.me/' . ltrim($clean_phone, '+');
    $admin_link = admin_url('post.php?post=' . $post_id . '&action=edit');

    $email_subject = '[SOFINFRA New Inquiry] ' . $name . ' — ' . $subject;
    $email_body = "
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;'>
        <div style='background: #0b2240; padding: 22px; text-align: center; color: #ffffff;'>
            <h2 style='margin: 0; color: #c59b27; font-size: 20px; letter-spacing: 1px;'>SOFINFRA REAL ESTATE ADVISORY</h2>
            <p style='margin: 6px 0 0; font-size: 13px; color: #cbd5e1;'>New Client Inquiry Received</p>
        </div>
        <div style='padding: 24px; background: #ffffff; color: #334155; line-height: 1.6;'>
            <h3 style='margin-top: 0; color: #0b2240; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; font-size: 16px;'>Inquiry Details</h3>
            <p style='margin: 8px 0;'><strong>Client Name:</strong> {$name}</p>
            <p style='margin: 8px 0;'><strong>Phone / WhatsApp:</strong> <a href='tel:{$clean_phone}'>{$phone}</a> &nbsp;|&nbsp; <a href='{$wa_link}' style='color:#25D366;font-weight:bold;text-decoration:none;'>Chat on WhatsApp</a></p>
            <p style='margin: 8px 0;'><strong>Email:</strong> <a href='mailto:{$email}'>{$email}</a></p>
            <p style='margin: 8px 0;'><strong>Requirement:</strong> <span style='background:#faf7f2;border:1px solid #c59b27;color:#ab841b;padding:3px 8px;border-radius:4px;font-weight:bold;font-size:12px;'>{$subject}</span></p>
            
            <h4 style='color: #0b2240; margin: 18px 0 6px;'>Detailed Message / Target Society:</h4>
            <div style='background: #f8fafc; border-left: 4px solid #c59b27; padding: 14px 16px; margin-bottom: 22px; font-size: 13px; white-space: pre-wrap; color: #1e293b;'>{$message}</div>
            
            <div style='text-align: center; margin: 28px 0 10px;'>
                <a href='{$admin_link}' style='background: #0b2240; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 13px; display: inline-block;'>View Inquiry in WordPress Admin</a>
            </div>
        </div>
        <div style='background: #f8fafc; padding: 14px 20px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;'>
            SOFINFRA Headless Real Estate Platform · Delhi NCR
        </div>
    </div>
    ";

    $headers = array(
        'Content-Type: text/html; charset=UTF-8',
        'From: SOFINFRA Desk <' . $admin_email . '>',
        'Reply-To: ' . $name . ' <' . $email . '>',
    );

    @wp_mail($admin_email, $email_subject, $email_body, $headers);

    return rest_ensure_response(array(
        'success' => true,
        'message' => 'Your inquiry has been received! Our senior advisory desk will connect with you within 30 minutes.',
        'id' => $post_id,
    ));
}

// =========================================================================
// 10. REST API HANDLER: PROPERTY SUBMISSION (PENDING REVIEW) WITH EMAIL
// =========================================================================

function sofinfra_handle_property_submission($request) {
    $params = $request->get_json_params();

    $title = !empty($params['title']) ? sanitize_text_field($params['title']) : '';
    if (empty($title)) {
        return new WP_Error('missing_title', 'Property title is required', array('status' => 400));
    }

    $description = !empty($params['description']) ? sanitize_textarea_field($params['description']) : '';
    $fullName = !empty($params['fullName']) ? sanitize_text_field($params['fullName']) : '';
    $email = !empty($params['email']) ? sanitize_email($params['email']) : '';
    $phone = !empty($params['phone']) ? sanitize_text_field($params['phone']) : '';
    $whatsapp = !empty($params['whatsapp']) ? sanitize_text_field($params['whatsapp']) : $phone;
    $city = !empty($params['city']) ? sanitize_text_field($params['city']) : 'Gurugram';
    $propertyType = !empty($params['propertyType']) ? sanitize_text_field($params['propertyType']) : 'Apartment';
    $listingType = !empty($params['listingType']) ? sanitize_text_field($params['listingType']) : 'For Sale';
    $price = !empty($params['price']) ? sanitize_text_field($params['price']) : '';
    $area = !empty($params['area']) ? sanitize_text_field($params['area']) : '';

    $admin_user = get_user_by('email', get_option('admin_email'));
    $author_id = $admin_user ? $admin_user->ID : 1;

    // 1. Create PENDING Property Listing
    $post_id = wp_insert_post(array(
        'post_title' => $title,
        'post_content' => $description,
        'post_status' => 'pending',
        'post_type' => 'properties',
        'post_author' => $author_id,
    ));

    if (is_wp_error($post_id)) {
        return new WP_Error('insert_failed', 'Failed to create property submission', array('status' => 500));
    }

    // Save metadata on property
    update_post_meta($post_id, '_sofinfra_owner_name', $fullName);
    update_post_meta($post_id, '_sofinfra_owner_email', $email);
    update_post_meta($post_id, '_sofinfra_owner_phone', $phone);
    update_post_meta($post_id, '_sofinfra_owner_whatsapp', $whatsapp);
    update_post_meta($post_id, 'property_type', $propertyType);
    update_post_meta($post_id, 'listing_type', $listingType);
    update_post_meta($post_id, 'city', $city);
    update_post_meta($post_id, 'price', $price);
    update_post_meta($post_id, 'area', $area);

    // 2. ALSO record as Lead in "Inquiries & Leads" so admin sees it there too!
    $lead_summary = "Property Listing Submission:\n" .
                    "Title: {$title}\n" .
                    "Type: {$propertyType} ({$listingType})\n" .
                    "City: {$city}\n" .
                    "Area: {$area} sq ft\n" .
                    "Price: ₹{$price}\n" .
                    "WhatsApp: {$whatsapp}\n\n" .
                    "Description:\n{$description}";

    $lead_id = wp_insert_post(array(
        'post_type' => 'contact_inquiries',
        'post_title' => $fullName . ' — ' . $phone . ' (Listing: ' . $title . ')',
        'post_content' => $lead_summary,
        'post_status' => 'publish',
        'post_author' => $author_id,
    ));

    if (!is_wp_error($lead_id)) {
        update_post_meta($lead_id, '_sofinfra_contact_name', $fullName);
        update_post_meta($lead_id, '_sofinfra_contact_email', $email);
        update_post_meta($lead_id, '_sofinfra_contact_phone', $phone);
        update_post_meta($lead_id, '_sofinfra_contact_subject', 'Listing My Property For Sale');
        update_post_meta($lead_id, '_sofinfra_contact_message', $lead_summary);
        update_post_meta($lead_id, '_sofinfra_contact_date', current_time('mysql'));
        update_post_meta($lead_id, '_sofinfra_related_property_id', $post_id);
    }

    // Send email to admin
    $admin_email = get_option('admin_email');
    $clean_phone = preg_replace('/[^\d+]/', '', $phone);
    $admin_link = admin_url('post.php?post=' . $post_id . '&action=edit');

    $email_subject = '[SOFINFRA Pending Review] New Property Submission: ' . $title;
    $email_body = "
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;'>
        <div style='background: #0b2240; padding: 22px; text-align: center; color: #ffffff;'>
            <h2 style='margin: 0; color: #c59b27; font-size: 20px;'>SOFINFRA INVENTORY DESK</h2>
            <p style='margin: 6px 0 0; font-size: 13px; color: #cbd5e1;'>New Property Submission Pending Review</p>
        </div>
        <div style='padding: 24px; background: #ffffff; color: #334155; line-height: 1.6;'>
            <h3 style='margin-top: 0; color: #0b2240; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;'>Property Details</h3>
            <p><strong>Property Title:</strong> {$title}</p>
            <p><strong>Type / Category:</strong> {$propertyType} ({$listingType})</p>
            <p><strong>City / Hub:</strong> {$city}</p>
            <p><strong>Area:</strong> {$area} sq ft</p>
            <p><strong>Price:</strong> ₹{$price}</p>
            
            <h3 style='color: #0b2240; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 20px;'>Owner / Broker Contact</h3>
            <p><strong>Name:</strong> {$fullName}</p>
            <p><strong>Phone:</strong> <a href='tel:{$clean_phone}'>{$phone}</a></p>
            <p><strong>Email:</strong> <a href='mailto:{$email}'>{$email}</a></p>

            <h4 style='color: #0b2240; margin: 18px 0 6px;'>Description:</h4>
            <div style='background: #f8fafc; border-left: 4px solid #c59b27; padding: 12px 16px; margin-bottom: 22px; font-size: 13px; white-space: pre-wrap;'>{$description}</div>
            
            <div style='text-align: center; margin: 28px 0 10px;'>
                <a href='{$admin_link}' style='background: #c59b27; color: #07162c; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 13px; display: inline-block;'>Review &amp; Publish Listing</a>
            </div>
        </div>
        <div style='background: #f8fafc; padding: 14px 20px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;'>
            SOFINFRA Headless Real Estate Platform · Delhi NCR
        </div>
    </div>
    ";

    $headers = array(
        'Content-Type: text/html; charset=UTF-8',
        'From: SOFINFRA Submissions <' . $admin_email . '>',
        'Reply-To: ' . $fullName . ' <' . $email . '>',
    );

    @wp_mail($admin_email, $email_subject, $email_body, $headers);

    return rest_ensure_response(array(
        'success' => true,
        'message' => 'Property submitted successfully! It has been placed in Pending Review for administrative diligence.',
        'post_id' => $post_id,
        'status' => 'pending',
    ));
}

