<?php
/**
 * Plugin Name: SOFINFRA ACF Flexible Content Schema
 * Description: Registers ACF Pro Flexible Content fields for SOFINFRA Homepage sections.
 * Version: 1.0.0
 * Author: SOFINFRA
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('acf/init', 'sofinfra_register_homepage_acf_fields');

function sofinfra_register_homepage_acf_fields() {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    acf_add_local_field_group(array(
        'key' => 'group_sofinfra_homepage_sections',
        'title' => 'Homepage Flexible Sections',
        'fields' => array(
            array(
                'key' => 'field_homepage_sections',
                'label' => 'Homepage Sections',
                'name' => 'sections',
                'type' => 'flexible_content',
                'instructions' => 'Add, edit, or reorder sections on the homepage. Drag to change display order.',
                'button_label' => 'Add Section',
                'layouts' => array(
                    // 1. HERO SECTION
                    'layout_hero_section' => array(
                        'key' => 'layout_hero_section',
                        'name' => 'hero_section',
                        'label' => '1. Hero Section (Cinematic Drone Video & Search)',
                        'display' => 'block',
                        'sub_fields' => array(
                            array(
                                'key' => 'field_hero_headline',
                                'label' => 'Headline Top',
                                'name' => 'headline',
                                'type' => 'text',
                                'default_value' => 'Premier Real Estate Across',
                            ),
                            array(
                                'key' => 'field_hero_headline_gradient',
                                'label' => 'Headline Gradient Accent',
                                'name' => 'headline_gradient',
                                'type' => 'text',
                                'default_value' => 'Delhi NCR & Global Capitals.',
                            ),
                            array(
                                'key' => 'field_hero_subheadline',
                                'label' => 'Subheadline',
                                'name' => 'subheadline',
                                'type' => 'textarea',
                                'rows' => 3,
                                'default_value' => 'Curated collection of ultra-luxury residences, penthouses, and institutional commercial spaces with verified titles and fiduciary diligence.',
                            ),
                            array(
                                'key' => 'field_hero_video_url',
                                'label' => 'Background Drone Video URL (MP4)',
                                'name' => 'video_url',
                                'type' => 'text',
                                'default_value' => '/videos/hero-noida-drone.mp4',
                            ),
                            array(
                                'key' => 'field_hero_trending_societies',
                                'label' => 'Trending Societies Ticker',
                                'name' => 'trending_societies',
                                'type' => 'repeater',
                                'button_label' => 'Add Society',
                                'sub_fields' => array(
                                    array(
                                        'key' => 'field_hero_soc_name',
                                        'label' => 'Society Name',
                                        'name' => 'name',
                                        'type' => 'text',
                                    ),
                                ),
                            ),
                        ),
                    ),

                    // 2. PROPERTY LISTINGS SECTION
                    'layout_property_listings' => array(
                        'key' => 'layout_property_listings',
                        'name' => 'property_listings_section',
                        'label' => '2. Property Listings Showcase (Buy & Rent)',
                        'display' => 'block',
                        'sub_fields' => array(
                            array(
                                'key' => 'field_listings_badge',
                                'label' => 'Badge',
                                'name' => 'badge',
                                'type' => 'text',
                                'default_value' => 'Verified Inventory',
                            ),
                            array(
                                'key' => 'field_listings_heading',
                                'label' => 'Heading',
                                'name' => 'heading',
                                'type' => 'text',
                                'default_value' => 'Featured Properties',
                            ),
                            array(
                                'key' => 'field_listings_subheading',
                                'label' => 'Subheading',
                                'name' => 'subheading',
                                'type' => 'textarea',
                                'rows' => 2,
                                'default_value' => 'Handpicked premium residences and commercial suites with verified legal provenance and fiduciary transparency.',
                            ),
                        ),
                    ),

                    // 3. TOP SOCIETIES SECTION
                    'layout_societies_section' => array(
                        'key' => 'layout_societies_section',
                        'name' => 'societies_section',
                        'label' => '3. Top Societies & Townships',
                        'display' => 'block',
                        'sub_fields' => array(
                            array(
                                'key' => 'field_societies_badge',
                                'label' => 'Badge',
                                'name' => 'badge',
                                'type' => 'text',
                                'default_value' => 'Elite Living Communities',
                            ),
                            array(
                                'key' => 'field_societies_heading',
                                'label' => 'Heading',
                                'name' => 'heading',
                                'type' => 'text',
                                'default_value' => 'Top Societies & Townships',
                            ),
                            array(
                                'key' => 'field_societies_subheading',
                                'label' => 'Subheading',
                                'name' => 'subheading',
                                'type' => 'textarea',
                                'rows' => 2,
                                'default_value' => 'Discover prestigious gated communities, sky-mansion condominiums, and signature developments across Delhi NCR with premier lifestyle amenities.',
                            ),
                            array(
                                'key' => 'field_societies_items',
                                'label' => 'Featured Societies List (Optional overrides)',
                                'name' => 'societies',
                                'type' => 'repeater',
                                'button_label' => 'Add Featured Society',
                                'sub_fields' => array(
                                    array(
                                        'key' => 'field_soc_name',
                                        'label' => 'Society Name',
                                        'name' => 'name',
                                        'type' => 'text',
                                    ),
                                    array(
                                        'key' => 'field_soc_location',
                                        'label' => 'Location / Sector',
                                        'name' => 'location',
                                        'type' => 'text',
                                    ),
                                    array(
                                        'key' => 'field_soc_price',
                                        'label' => 'Price Range',
                                        'name' => 'price_range',
                                        'type' => 'text',
                                    ),
                                    array(
                                        'key' => 'field_soc_image',
                                        'label' => 'Image URL',
                                        'name' => 'image_url',
                                        'type' => 'text',
                                    ),
                                    array(
                                        'key' => 'field_soc_description',
                                        'label' => 'Description',
                                        'name' => 'description',
                                        'type' => 'textarea',
                                        'rows' => 2,
                                    ),
                                ),
                            ),
                        ),
                    ),

                    // 4. ABOUT SECTION
                    'layout_about_section' => array(
                        'key' => 'layout_about_section',
                        'name' => 'about_section',
                        'label' => '4. About SOFINFRA',
                        'display' => 'block',
                        'sub_fields' => array(
                            array(
                                'key' => 'field_about_badge',
                                'label' => 'Badge',
                                'name' => 'badge',
                                'type' => 'text',
                                'default_value' => 'The SOFINFRA Standard',
                            ),
                            array(
                                'key' => 'field_about_heading',
                                'label' => 'Heading',
                                'name' => 'heading',
                                'type' => 'text',
                                'default_value' => 'Building Trust, Delivering Excellence in Prime Real Estate',
                            ),
                            array(
                                'key' => 'field_about_story_p1',
                                'label' => 'Paragraph 1',
                                'name' => 'paragraph_1',
                                'type' => 'textarea',
                                'rows' => 3,
                                'default_value' => 'Founded with a clear vision to eliminate friction and ambiguity in real estate transactions, SOFINFRA represents a new paradigm in property acquisition and investment across Delhi NCR.',
                            ),
                            array(
                                'key' => 'field_about_approach_heading',
                                'label' => 'Approach Sub-heading',
                                'name' => 'approach_heading',
                                'type' => 'text',
                                'default_value' => 'An Uncompromised Approach to Real Estate',
                            ),
                            array(
                                'key' => 'field_about_story_p2',
                                'label' => 'Paragraph 2 (Approach Description)',
                                'name' => 'paragraph_2',
                                'type' => 'textarea',
                                'rows' => 3,
                                'default_value' => 'We do not treat real estate as a static transaction. From zoning intricacies and structural feasibility to private wealth preservation, our multidisciplinary team ensures every asset adheres to the highest benchmarks of value creation.',
                            ),
                            array(
                                'key' => 'field_about_image',
                                'label' => 'Highlight Feature Image',
                                'name' => 'image',
                                'type' => 'image',
                                'instructions' => 'Upload or select an architectural image from the Media Library.',
                                'return_format' => 'url',
                                'preview_size' => 'medium',
                                'library' => 'all',
                            ),
                            array(
                                'key' => 'field_about_image_url',
                                'label' => 'Feature Image URL (Fallback / CDN)',
                                'name' => 'image_url',
                                'type' => 'text',
                                'default_value' => '/images/luxury-architecture.jpg',
                            ),
                            array(
                                'key' => 'field_about_image_badge',
                                'label' => 'Feature Image Badge',
                                'name' => 'image_badge',
                                'type' => 'text',
                                'default_value' => 'Excellence In Execution',
                            ),
                            array(
                                'key' => 'field_about_image_caption',
                                'label' => 'Feature Image Caption',
                                'name' => 'image_caption',
                                'type' => 'text',
                                'default_value' => 'Transforming premier spaces into generational legacies.',
                            ),
                            array(
                                'key' => 'field_about_stats',
                                'label' => 'Key Stats Counter',
                                'name' => 'stats',
                                'type' => 'repeater',
                                'button_label' => 'Add Stat',
                                'sub_fields' => array(
                                    array(
                                        'key' => 'field_stat_value',
                                        'label' => 'Value',
                                        'name' => 'value',
                                        'type' => 'text',
                                    ),
                                    array(
                                        'key' => 'field_stat_label',
                                        'label' => 'Label',
                                        'name' => 'label',
                                        'type' => 'text',
                                    ),
                                ),
                            ),
                            array(
                                'key' => 'field_about_pillars',
                                'label' => 'Core Pillars',
                                'name' => 'pillars',
                                'type' => 'repeater',
                                'button_label' => 'Add Pillar',
                                'sub_fields' => array(
                                    array(
                                        'key' => 'field_pillar_title',
                                        'label' => 'Title',
                                        'name' => 'title',
                                        'type' => 'text',
                                    ),
                                    array(
                                        'key' => 'field_pillar_description',
                                        'label' => 'Description',
                                        'name' => 'description',
                                        'type' => 'textarea',
                                        'rows' => 2,
                                    ),
                                ),
                            ),
                        ),
                    ),

                    // 5. SERVICES & ADVISORY
                    'layout_services_section' => array(
                        'key' => 'layout_services_section',
                        'name' => 'services_section',
                        'label' => '5. Services & Advisory',
                        'display' => 'block',
                        'sub_fields' => array(
                            array(
                                'key' => 'field_services_badge',
                                'label' => 'Badge',
                                'name' => 'badge',
                                'type' => 'text',
                                'default_value' => 'End-to-End Capabilities',
                            ),
                            array(
                                'key' => 'field_services_heading',
                                'label' => 'Heading',
                                'name' => 'heading',
                                'type' => 'text',
                                'default_value' => 'Comprehensive Real Estate Solutions',
                            ),
                            array(
                                'key' => 'field_services_subheading',
                                'label' => 'Subheading',
                                'name' => 'subheading',
                                'type' => 'textarea',
                                'rows' => 2,
                                'default_value' => 'From strategic asset acquisition to fiduciary closing, we provide full-spectrum advisory across premium asset classes.',
                            ),
                            array(
                                'key' => 'field_services_items',
                                'label' => 'Services List',
                                'name' => 'services',
                                'type' => 'repeater',
                                'button_label' => 'Add Service',
                                'sub_fields' => array(
                                    array(
                                        'key' => 'field_service_title',
                                        'label' => 'Service Title',
                                        'name' => 'title',
                                        'type' => 'text',
                                    ),
                                    array(
                                        'key' => 'field_service_tag',
                                        'label' => 'Tag / Category',
                                        'name' => 'tag',
                                        'type' => 'text',
                                    ),
                                    array(
                                        'key' => 'field_service_desc',
                                        'label' => 'Description',
                                        'name' => 'description',
                                        'type' => 'textarea',
                                        'rows' => 2,
                                    ),
                                ),
                            ),
                        ),
                    ),

                    // 6. TESTIMONIALS SECTION
                    'layout_testimonials_section' => array(
                        'key' => 'layout_testimonials_section',
                        'name' => 'testimonials_section',
                        'label' => '6. Client Reviews & Ratings',
                        'display' => 'block',
                        'sub_fields' => array(
                            array(
                                'key' => 'field_reviews_badge',
                                'label' => 'Badge',
                                'name' => 'badge',
                                'type' => 'text',
                                'default_value' => 'Client Trust',
                            ),
                            array(
                                'key' => 'field_reviews_heading',
                                'label' => 'Heading',
                                'name' => 'heading',
                                'type' => 'text',
                                'default_value' => 'Trusted by High-Net-Worth Individuals & Corporates',
                            ),
                            array(
                                'key' => 'field_reviews_subheading',
                                'label' => 'Subheading',
                                'name' => 'subheading',
                                'type' => 'textarea',
                                'rows' => 2,
                                'default_value' => 'Real experiences from discerning buyers, investors, and corporate leaders who chose SOFINFRA for their benchmark real estate transactions.',
                            ),
                            array(
                                'key' => 'field_reviews_rating',
                                'label' => 'Average Rating',
                                'name' => 'average_rating',
                                'type' => 'text',
                                'default_value' => '4.9/5',
                            ),
                            array(
                                'key' => 'field_reviews_total',
                                'label' => 'Total Reviews Count',
                                'name' => 'total_reviews',
                                'type' => 'text',
                                'default_value' => '120+ Verified Client Reviews',
                            ),
                            array(
                                'key' => 'field_reviews_trust_metrics',
                                'label' => 'Trust Metrics & Compliance Badges',
                                'name' => 'trust_metrics',
                                'type' => 'repeater',
                                'button_label' => 'Add Trust Metric Badge',
                                'sub_fields' => array(
                                    array(
                                        'key' => 'field_trust_metric_label',
                                        'label' => 'Metric Label',
                                        'name' => 'label',
                                        'type' => 'text',
                                        'default_value' => 'RERA Certified Advisory',
                                    ),
                                    array(
                                        'key' => 'field_trust_metric_desc',
                                        'label' => 'Metric Description',
                                        'name' => 'desc',
                                        'type' => 'text',
                                        'default_value' => '100% compliant documentation',
                                    ),
                                ),
                            ),
                            array(
                                'key' => 'field_reviews_items',
                                'label' => 'Testimonials List',
                                'name' => 'testimonials',
                                'type' => 'repeater',
                                'button_label' => 'Add Testimonial',
                                'sub_fields' => array(
                                    array(
                                        'key' => 'field_test_name',
                                        'label' => 'Client Name',
                                        'name' => 'author_name',
                                        'type' => 'text',
                                    ),
                                    array(
                                        'key' => 'field_test_role',
                                        'label' => 'Role & Locality',
                                        'name' => 'role_locality',
                                        'type' => 'text',
                                    ),
                                    array(
                                        'key' => 'field_test_rating',
                                        'label' => 'Rating (1-5)',
                                        'name' => 'rating',
                                        'type' => 'number',
                                        'default_value' => 5,
                                    ),
                                    array(
                                        'key' => 'field_test_review',
                                        'label' => 'Review Text',
                                        'name' => 'review_text',
                                        'type' => 'textarea',
                                        'rows' => 3,
                                    ),
                                ),
                            ),
                        ),
                    ),

                    // 7. CTA SECTION
                    'layout_cta_section' => array(
                        'key' => 'layout_cta_section',
                        'name' => 'cta_section',
                        'label' => '7. List Property CTA Bar',
                        'display' => 'block',
                        'sub_fields' => array(
                            array(
                                'key' => 'field_cta_badge',
                                'label' => 'Badge',
                                'name' => 'badge',
                                'type' => 'text',
                                'default_value' => 'Owner & Developer Concierge',
                            ),
                            array(
                                'key' => 'field_cta_heading',
                                'label' => 'Heading',
                                'name' => 'heading',
                                'type' => 'text',
                                'default_value' => 'Looking to Sell or Lease a Prime Asset?',
                            ),
                            array(
                                'key' => 'field_cta_subheading',
                                'label' => 'Subheading',
                                'name' => 'subheading',
                                'type' => 'textarea',
                                'rows' => 2,
                                'default_value' => 'List your luxury residence, commercial floor, or institutional parcel with SOFINFRA for targeted exposure to qualified high-net-worth buyers.',
                            ),
                            array(
                                'key' => 'field_cta_btn_text',
                                'label' => 'Button Text',
                                'name' => 'button_text',
                                'type' => 'text',
                                'default_value' => 'Submit Property for Listing',
                            ),
                        ),
                    ),

                    // 8. CONTACT SECTION
                    'layout_contact_section' => array(
                        'key' => 'layout_contact_section',
                        'name' => 'contact_section',
                        'label' => '8. Contact Section',
                        'display' => 'block',
                        'sub_fields' => array(
                            array(
                                'key' => 'field_contact_badge',
                                'label' => 'Badge',
                                'name' => 'badge',
                                'type' => 'text',
                                'default_value' => 'Connect Directly',
                            ),
                            array(
                                'key' => 'field_contact_heading',
                                'label' => 'Heading',
                                'name' => 'heading',
                                'type' => 'text',
                                'default_value' => 'Speak With Our Senior Real Estate Advisors',
                            ),
                            array(
                                'key' => 'field_contact_subheading',
                                'label' => 'Subheading',
                                'name' => 'subheading',
                                'type' => 'textarea',
                                'rows' => 2,
                                'default_value' => 'Our private client desk is available 7 days a week to arrange private site viewings, portfolio valuations, or bespoke advisory.',
                            ),
                            array(
                                'key' => 'field_contact_phones',
                                'label' => 'Phone Numbers',
                                'name' => 'phone_numbers',
                                'type' => 'repeater',
                                'button_label' => 'Add Phone',
                                'sub_fields' => array(
                                    array(
                                        'key' => 'field_phone_num',
                                        'label' => 'Phone Number',
                                        'name' => 'number',
                                        'type' => 'text',
                                    ),
                                    array(
                                        'key' => 'field_phone_label',
                                        'label' => 'Label',
                                        'name' => 'label',
                                        'type' => 'text',
                                    ),
                                ),
                            ),
                            array(
                                'key' => 'field_contact_email',
                                'label' => 'Email Address',
                                'name' => 'email',
                                'type' => 'text',
                                'default_value' => 'sales@sofinfra.com',
                            ),
                            array(
                                'key' => 'field_contact_address',
                                'label' => 'Office Address',
                                'name' => 'address',
                                'type' => 'textarea',
                                'rows' => 2,
                                'default_value' => 'S-306-308, 2nd Floor, Tower A, Palam Vihar, Gurugram(HR)-122017',
                            ),
                            array(
                                'key' => 'field_contact_hours',
                                'label' => 'Office Hours',
                                'name' => 'office_hours',
                                'type' => 'text',
                                'default_value' => 'Mon – Sun: 9:00 AM – 8:00 PM IST',
                            ),
                        ),
                    ),
                ),
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'page_type',
                    'operator' => '==',
                    'value' => 'front_page',
                ),
            ),
            array(
                array(
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'page',
                ),
            ),
        ),
        'menu_order' => 0,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
        'hide_on_screen' => array(
            0 => 'the_content',
        ),
        'active' => true,
        'description' => 'Flexible Content layouts controlling SOFINFRA homepage sections.',
        'show_in_rest' => 1,
    ));
}

// 2. PROJECT DETAILS FIELD GROUP
add_action('acf/init', 'sofinfra_register_project_acf_fields');

function sofinfra_register_project_acf_fields() {
    if (!function_exists('acf_add_local_field_group')) return;

    acf_add_local_field_group(array(
        'key' => 'group_sofinfra_project_details',
        'title' => 'Project & Society Details',
        'fields' => array(
            array(
                'key' => 'field_proj_developer',
                'label' => 'Developer',
                'name' => 'developer',
                'type' => 'text',
                'default_value' => 'DLF Luxury Living',
            ),
            array(
                'key' => 'field_proj_location',
                'label' => 'Location / Sector',
                'name' => 'location',
                'type' => 'text',
                'default_value' => 'Golf Course Road',
            ),
            array(
                'key' => 'field_proj_sub_location',
                'label' => 'Sub-Location / Landmark',
                'name' => 'sub_location',
                'type' => 'text',
            ),
            array(
                'key' => 'field_proj_city',
                'label' => 'City',
                'name' => 'city',
                'type' => 'select',
                'choices' => array(
                    'Gurugram' => 'Gurugram',
                    'Noida' => 'Noida',
                    'New Delhi' => 'New Delhi',
                    'Greater Noida' => 'Greater Noida',
                ),
                'default_value' => 'Gurugram',
            ),
            array(
                'key' => 'field_proj_type',
                'label' => 'Project Typology',
                'name' => 'project_type',
                'type' => 'text',
                'default_value' => 'Ultra Luxury Residential',
            ),
            array(
                'key' => 'field_proj_status',
                'label' => 'Status',
                'name' => 'status',
                'type' => 'select',
                'choices' => array(
                    'Ready to Move' => 'Ready to Move',
                    'Under Construction' => 'Under Construction',
                    'Newly Launched' => 'Newly Launched',
                ),
                'default_value' => 'Ready to Move',
            ),
            array(
                'key' => 'field_proj_price_range',
                'label' => 'Price Range',
                'name' => 'price_range',
                'type' => 'text',
                'default_value' => '₹15 Cr - ₹45 Cr',
            ),
            array(
                'key' => 'field_proj_units',
                'label' => 'Total Units',
                'name' => 'units',
                'type' => 'text',
            ),
            array(
                'key' => 'field_proj_configs',
                'label' => 'Configurations (e.g. 4 & 5 BHK)',
                'name' => 'configurations',
                'type' => 'text',
            ),
            array(
                'key' => 'field_proj_image_url',
                'label' => 'Featured Image URL (Optional Fallback)',
                'name' => 'image_url',
                'type' => 'text',
            ),
            array(
                'key' => 'field_proj_gallery',
                'label' => 'Project Gallery (Multiple Image Uploads)',
                'name' => 'gallery_images',
                'type' => 'gallery',
                'instructions' => 'Upload or select multiple high-resolution photos, architectural renders, and master plans for this project.',
                'return_format' => 'array',
                'preview_size' => 'medium',
                'insert' => 'append',
                'library' => 'all',
            ),
            array(
                'key' => 'field_proj_rera_id',
                'label' => 'RERA Registration ID',
                'name' => 'rera_id',
                'type' => 'text',
            ),
            array(
                'key' => 'field_proj_featured',
                'label' => 'Featured on Homepage',
                'name' => 'featured',
                'type' => 'true_false',
                'default_value' => 1,
            ),
            array(
                'key' => 'field_proj_amenities',
                'label' => 'Key Amenities',
                'name' => 'amenities',
                'type' => 'repeater',
                'button_label' => 'Add Amenity',
                'sub_fields' => array(
                    array(
                        'key' => 'field_proj_amenity_name',
                        'label' => 'Amenity Name',
                        'name' => 'name',
                        'type' => 'text',
                    ),
                ),
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'projects',
                ),
            ),
        ),
        'show_in_rest' => 1,
    ));
}

// 3. PROPERTY DETAILS FIELD GROUP
add_action('acf/init', 'sofinfra_register_property_acf_fields');

function sofinfra_register_property_acf_fields() {
    if (!function_exists('acf_add_local_field_group')) return;

    acf_add_local_field_group(array(
        'key' => 'group_sofinfra_property_details',
        'title' => 'Property Specifications & Pricing',
        'fields' => array(
            array(
                'key' => 'field_prop_category',
                'label' => 'Category',
                'name' => 'category',
                'type' => 'select',
                'choices' => array(
                    'residential' => 'Residential',
                    'commercial' => 'Commercial',
                ),
                'default_value' => 'residential',
            ),
            array(
                'key' => 'field_prop_type',
                'label' => 'Property Type',
                'name' => 'property_type',
                'type' => 'text',
                'default_value' => 'Penthouse',
            ),
            array(
                'key' => 'field_prop_listing_type',
                'label' => 'Listing Type',
                'name' => 'listing_type',
                'type' => 'select',
                'choices' => array(
                    'For Sale' => 'For Sale',
                    'For Rent' => 'For Rent',
                ),
                'default_value' => 'For Sale',
            ),
            array(
                'key' => 'field_prop_developer',
                'label' => 'Developer / Builder',
                'name' => 'developer',
                'type' => 'text',
                'default_value' => 'DLF Luxury Living',
            ),
            array(
                'key' => 'field_prop_status',
                'label' => 'Property Status',
                'name' => 'property_status',
                'type' => 'select',
                'choices' => array(
                    'Ready to Move' => 'Ready to Move',
                    'Under Construction' => 'Under Construction',
                    'Newly Launched' => 'Newly Launched',
                    'Resale' => 'Resale',
                ),
                'default_value' => 'Ready to Move',
            ),
            array(
                'key' => 'field_prop_rera_id',
                'label' => 'RERA Registration ID',
                'name' => 'rera_id',
                'type' => 'text',
                'default_value' => 'RERA Approved',
            ),
            array(
                'key' => 'field_prop_configs',
                'label' => 'Configurations (e.g. 4 BHK Penthouse)',
                'name' => 'configurations',
                'type' => 'text',
            ),
            array(
                'key' => 'field_prop_price',
                'label' => 'Price (Numeric in INR)',
                'name' => 'price',
                'type' => 'number',
            ),
            array(
                'key' => 'field_prop_formatted_price',
                'label' => 'Formatted Display Price (e.g. ₹45.0 Cr)',
                'name' => 'formatted_price',
                'type' => 'text',
            ),
            array(
                'key' => 'field_prop_area',
                'label' => 'Super Built-Up Area (sq ft)',
                'name' => 'area',
                'type' => 'number',
            ),
            array(
                'key' => 'field_prop_bedrooms',
                'label' => 'Bedrooms',
                'name' => 'bedrooms',
                'type' => 'number',
            ),
            array(
                'key' => 'field_prop_bathrooms',
                'label' => 'Bathrooms',
                'name' => 'bathrooms',
                'type' => 'number',
            ),
            array(
                'key' => 'field_prop_furnishing',
                'label' => 'Furnishing Status',
                'name' => 'furnishing_status',
                'type' => 'select',
                'choices' => array(
                    'Furnished' => 'Furnished',
                    'Semi-Furnished' => 'Semi-Furnished',
                    'Unfurnished' => 'Unfurnished',
                ),
                'default_value' => 'Furnished',
            ),
            array(
                'key' => 'field_prop_parking',
                'label' => 'Parking',
                'name' => 'parking',
                'type' => 'text',
                'default_value' => '2 Covered Bays',
            ),
            array(
                'key' => 'field_prop_floor',
                'label' => 'Floor Level',
                'name' => 'floor',
                'type' => 'text',
                'default_value' => '14',
            ),
            array(
                'key' => 'field_prop_total_floors',
                'label' => 'Total Floors',
                'name' => 'total_floors',
                'type' => 'text',
                'default_value' => '38',
            ),
            array(
                'key' => 'field_prop_age',
                'label' => 'Property Age / Possession',
                'name' => 'property_age',
                'type' => 'text',
                'default_value' => 'Ready to Move',
            ),
            array(
                'key' => 'field_prop_facing',
                'label' => 'Orientation / Facing',
                'name' => 'facing',
                'type' => 'text',
                'default_value' => 'North-East / Golf View',
            ),
            array(
                'key' => 'field_prop_city',
                'label' => 'City',
                'name' => 'city',
                'type' => 'text',
                'default_value' => 'Gurugram',
            ),
            array(
                'key' => 'field_prop_locality',
                'label' => 'Locality / Sector',
                'name' => 'locality',
                'type' => 'text',
            ),
            array(
                'key' => 'field_prop_sub_location',
                'label' => 'Sub-Location / Prime Corridor',
                'name' => 'sub_location',
                'type' => 'text',
            ),
            array(
                'key' => 'field_prop_address',
                'label' => 'Full Address',
                'name' => 'full_address',
                'type' => 'textarea',
                'rows' => 2,
            ),
            array(
                'key' => 'field_prop_featured',
                'label' => 'Featured on Homepage',
                'name' => 'featured',
                'type' => 'true_false',
                'default_value' => 1,
            ),
            array(
                'key' => 'field_prop_image_url',
                'label' => 'Featured Image URL (Optional Fallback)',
                'name' => 'featured_image_url',
                'type' => 'text',
            ),
            array(
                'key' => 'field_prop_gallery',
                'label' => 'Property Gallery (Multiple Image Uploads)',
                'name' => 'gallery_images',
                'type' => 'gallery',
                'instructions' => 'Upload or select multiple high-resolution photos, floor plans, and interior views for this listing.',
                'return_format' => 'array',
                'preview_size' => 'medium',
                'insert' => 'append',
                'library' => 'all',
            ),
            array(
                'key' => 'field_prop_video_url',
                'label' => 'Video Tour URL',
                'name' => 'video_url',
                'type' => 'text',
            ),
            array(
                'key' => 'field_prop_amenities',
                'label' => 'Amenities',
                'name' => 'amenities',
                'type' => 'repeater',
                'button_label' => 'Add Amenity',
                'sub_fields' => array(
                    array(
                        'key' => 'field_prop_amenity_name',
                        'label' => 'Amenity Name',
                        'name' => 'name',
                        'type' => 'text',
                    ),
                ),
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'properties',
                ),
            ),
        ),
        'show_in_rest' => 1,
    ));
}

// Pre-fill default Trust Metrics & Compliance Badges in ACF editor when empty
add_filter('acf/load_value/name=trust_metrics', function ($value, $post_id, $field) {
    if (empty($value) || !is_array($value)) {
        return array(
            array(
                'field_trust_metric_label' => 'RERA Certified Advisory',
                'field_trust_metric_desc' => '100% compliant documentation',
                'label' => 'RERA Certified Advisory',
                'desc' => '100% compliant documentation',
            ),
            array(
                'field_trust_metric_label' => '₹1,500+ Cr Handled',
                'field_trust_metric_desc' => 'In Delhi NCR luxury transactions',
                'label' => '₹1,500+ Cr Handled',
                'desc' => 'In Delhi NCR luxury transactions',
            ),
            array(
                'field_trust_metric_label' => 'Zero Hidden Charges',
                'field_trust_metric_desc' => 'Complete fiduciary transparency',
                'label' => 'Zero Hidden Charges',
                'desc' => 'Complete fiduciary transparency',
            ),
            array(
                'field_trust_metric_label' => 'Verified Societies Only',
                'field_trust_metric_desc' => 'Clear legal & structural titles',
                'label' => 'Verified Societies Only',
                'desc' => 'Clear legal & structural titles',
            ),
        );
    }
    return $value;
}, 10, 3);
