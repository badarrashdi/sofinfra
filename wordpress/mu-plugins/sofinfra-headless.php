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
            'image' => !empty($acf['image_url']) ? $acf['image_url'] : ($thumb_url ? $thumb_url : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85'),
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
            'videoUrl' => !empty($acf['video_url']) ? $acf['video_url'] : null,
            'status' => $post->post_status,
            'createdAt' => $post->post_date,
        );
    }

    return rest_ensure_response($properties);
}
