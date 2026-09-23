<?php
// Sideload and attach all images to WordPress Featured Images

require_once(ABSPATH . 'wp-admin/includes/media.php');
require_once(ABSPATH . 'wp-admin/includes/file.php');
require_once(ABSPATH . 'wp-admin/includes/image.php');

echo "=== 1. PROCESSING PROPERTIES ===\n";

$properties_meta = array(
    16 => array(
        'developer' => 'DLF Luxury Living',
        'rera_id' => 'RC/REP/HARERA/GGM/2018/12',
        'sub_location' => 'Golf Course Road',
        'configurations' => '5 BHK + Private Pool',
        'status' => 'Ready to Move',
        'furnishing' => 'Furnished',
        'parking' => '4 Dedicated Covered Bays',
        'floor' => '32',
        'total_floors' => '38',
        'age' => 'Brand New',
        'facing' => 'Golf Course Facing',
    ),
    17 => array(
        'developer' => 'ATS Infrastructure',
        'rera_id' => 'UPRERAPRJ3574',
        'sub_location' => 'Sector 124, Noida Expressway',
        'configurations' => '4 BHK Luxury Suite',
        'status' => 'Ready to Move',
        'furnishing' => 'Semi-Furnished',
        'parking' => '3 Covered Bays',
        'floor' => '24',
        'total_floors' => '47',
        'age' => '1 Year',
        'facing' => 'Yamuna River & City View',
    ),
    18 => array(
        'developer' => 'DLF Commercial',
        'rera_id' => 'Commercial Grade-A Certified',
        'sub_location' => 'Golf Course Road',
        'configurations' => 'Grade-A Office Floor',
        'status' => 'Ready to Move',
        'furnishing' => 'Furnished',
        'parking' => '10 Dedicated Bays',
        'floor' => '18',
        'total_floors' => '25',
        'age' => '3 Years',
        'facing' => 'Arterial Road & Skyline View',
    ),
    19 => array(
        'developer' => 'M3M India',
        'rera_id' => 'RC/REP/HARERA/GGM/2018/25',
        'sub_location' => 'Golf Course Extension Road',
        'configurations' => '4 BHK Sky Duplex',
        'status' => 'Ready to Move',
        'furnishing' => 'Furnished',
        'parking' => '3 Covered Bays',
        'floor' => '19',
        'total_floors' => '32',
        'age' => '2 Years',
        'facing' => 'Golf Greens Facing',
    ),
    20 => array(
        'developer' => 'Godrej Properties',
        'rera_id' => 'UPRERAPRJ704730',
        'sub_location' => 'Central Noida / Sector 43',
        'configurations' => '4 BHK Forest Penthouse',
        'status' => 'Ready to Move',
        'furnishing' => 'Furnished',
        'parking' => '3 Covered Bays',
        'floor' => '28',
        'total_floors' => '32',
        'age' => '1 Year',
        'facing' => 'Urban Forest Canopy & Golf View',
    ),
    21 => array(
        'developer' => 'Unity Group',
        'rera_id' => 'DLRERA2018P0008',
        'sub_location' => 'Karol Bagh / Central Delhi',
        'configurations' => '4 BHK Skywalk Residence',
        'status' => 'Ready to Move',
        'furnishing' => 'Furnished',
        'parking' => '2 Covered Bays',
        'floor' => '22',
        'total_floors' => '36',
        'age' => 'Brand New',
        'facing' => 'Panoramic Delhi Green Ridge View',
    ),
);

// Map of downloaded URLs to attachment IDs so we don't re-download identical images
$url_to_attachment_id = array();

// Check existing media attachments
$existing_attachments = get_posts(array(
    'post_type' => 'attachment',
    'posts_per_page' => -1,
    'post_status' => 'any',
));
foreach ($existing_attachments as $att) {
    $src = wp_get_attachment_url($att->ID);
    echo "Found existing attachment ID {$att->ID}: {$src}\n";
}

// 1. First handle Godrej (ID 20) with user's uploaded images
echo "\n--- Configuring Godrej (ID 20) with local uploads ---\n";
// Set attachment 30 as featured thumbnail for post 20
if (wp_get_attachment_url(30)) {
    set_post_thumbnail(20, 30);
    $local_url_30 = wp_get_attachment_url(30);
    update_post_meta(20, 'featured_image_url', $local_url_30);
    update_post_meta(20, 'gallery_images', array(30, 29));
    echo "Set Post 20 Featured Image to Attachment 30 ({$local_url_30})\n";
} elseif (wp_get_attachment_url(29)) {
    set_post_thumbnail(20, 29);
    $local_url_29 = wp_get_attachment_url(29);
    update_post_meta(20, 'featured_image_url', $local_url_29);
    update_post_meta(20, 'gallery_images', array(29));
    echo "Set Post 20 Featured Image to Attachment 29 ({$local_url_29})\n";
}

// 2. Now process other properties
$props = get_posts(array('post_type' => 'properties', 'posts_per_page' => -1, 'post_status' => 'any'));

foreach ($props as $p) {
    $pid = $p->ID;
    echo "\nProcessing Property ID {$pid}: {$p->post_title}\n";

    // Update specs & fields
    if (isset($properties_meta[$pid])) {
        $meta = $properties_meta[$pid];
        update_post_meta($pid, 'developer', $meta['developer']);
        update_post_meta($pid, 'rera_id', $meta['rera_id']);
        update_post_meta($pid, 'sub_location', $meta['sub_location']);
        update_post_meta($pid, 'configurations', $meta['configurations']);
        update_post_meta($pid, 'property_status', $meta['status']);
        update_post_meta($pid, 'furnishing_status', $meta['furnishing']);
        update_post_meta($pid, 'parking', $meta['parking']);
        update_post_meta($pid, 'floor', $meta['floor']);
        update_post_meta($pid, 'total_floors', $meta['total_floors']);
        update_post_meta($pid, 'property_age', $meta['age']);
        update_post_meta($pid, 'facing', $meta['facing']);
        echo "Updated ACF specs (Developer: {$meta['developer']}, RERA: {$meta['rera_id']}, Sub-Location: {$meta['sub_location']})\n";
    }

    if ($pid == 20) {
        // Godrej is already handled with local uploads
        continue;
    }

    $current_thumb = get_post_thumbnail_id($pid);
    $feat_url = get_post_meta($pid, 'featured_image_url', true);

    if ($current_thumb > 0) {
        echo "Property {$pid} already has featured thumbnail ID {$current_thumb}\n";
        continue;
    }

    if (!empty($feat_url) && strpos($feat_url, 'unsplash.com') !== false) {
        echo "Downloading Unsplash image for Property {$pid}: {$feat_url}\n";
        if (isset($url_to_attachment_id[$feat_url])) {
            $att_id = $url_to_attachment_id[$feat_url];
            echo "Reusing previously downloaded attachment ID {$att_id}\n";
        } else {
            $tmp = download_url($feat_url);
            if (is_wp_error($tmp)) {
                echo "Error downloading url: " . $tmp->get_error_message() . "\n";
                continue;
            }
            $file_array = array(
                'name' => sanitize_title($p->post_title) . '.jpg',
                'tmp_name' => $tmp,
            );
            $att_id = media_handle_sideload($file_array, $pid, $p->post_title);
            if (is_wp_error($att_id)) {
                @unlink($tmp);
                echo "Error sideloading media: " . $att_id->get_error_message() . "\n";
                continue;
            }
            $url_to_attachment_id[$feat_url] = $att_id;
            echo "Downloaded and created attachment ID {$att_id}\n";
        }

        set_post_thumbnail($pid, $att_id);
        $local_url = wp_get_attachment_url($att_id);
        update_post_meta($pid, 'featured_image_url', $local_url);
        update_post_meta($pid, 'gallery_images', array($att_id));
        echo "Attached as Featured Image and set gallery for Property {$pid} ({$local_url})\n";
    }
}

echo "\n=== 2. PROCESSING PROJECTS (SOCIETIES) ===\n";

$projects = get_posts(array('post_type' => 'projects', 'posts_per_page' => -1, 'post_status' => 'any'));

foreach ($projects as $proj) {
    $prid = $proj->ID;
    echo "\nProcessing Project ID {$prid}: {$proj->post_title}\n";
    $current_thumb = get_post_thumbnail_id($prid);
    $img_url = get_post_meta($prid, 'image_url', true);

    if ($current_thumb > 0) {
        echo "Project {$prid} already has featured thumbnail ID {$current_thumb}\n";
        continue;
    }

    if (!empty($img_url) && strpos($img_url, 'unsplash.com') !== false) {
        echo "Downloading Unsplash image for Project {$prid}: {$img_url}\n";
        if (isset($url_to_attachment_id[$img_url])) {
            $att_id = $url_to_attachment_id[$img_url];
            echo "Reusing previously downloaded attachment ID {$att_id}\n";
        } else {
            $tmp = download_url($img_url);
            if (is_wp_error($tmp)) {
                echo "Error downloading url: " . $tmp->get_error_message() . "\n";
                continue;
            }
            $file_array = array(
                'name' => sanitize_title($proj->post_title) . '.jpg',
                'tmp_name' => $tmp,
            );
            $att_id = media_handle_sideload($file_array, $prid, $proj->post_title);
            if (is_wp_error($att_id)) {
                @unlink($tmp);
                echo "Error sideloading media: " . $att_id->get_error_message() . "\n";
                continue;
            }
            $url_to_attachment_id[$img_url] = $att_id;
            echo "Downloaded and created attachment ID {$att_id}\n";
        }

        set_post_thumbnail($prid, $att_id);
        $local_url = wp_get_attachment_url($att_id);
        update_post_meta($prid, 'image_url', $local_url);
        update_post_meta($prid, 'gallery_images', array($att_id));
        echo "Attached as Featured Image and set gallery for Project {$prid} ({$local_url})\n";
    }
}

echo "\n=== ALL MEDIA PROCESSED SUCCESSFULLY! ===\n";
