<?php
/**
 * The Tumblr Theme Garden bootstrap file.
 *
 * @since       1.0.0
 * @version     1.0.0
 * @author      Cupcake Labs
 * @license     GPL-2.0-or-later
 * @package    TumblrThemeGarden
 *
 * @noinspection    ALL
 *
 * @wordpress-plugin
 * Plugin Name:             Tumblr Theme Garden
 * Plugin URI:              https://github.com/Automattic/tumblr-theme-garden/
 * Description:             Allows WordPress to run on Tumblr themes.
 * Version:                 0.1.19
 * Requires at least:       6.5
 * Tested up to:            6.7
 * Requires PHP:            8.2
 * Author:                  Cupcake Labs
 * Author URI:              https://www.automattic.com/
 * License:                 GPLv2 or later
 * License URI:             https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:             tumblr-theme-garden
 * Domain Path:             /languages
 **/

defined( 'ABSPATH' ) || exit;

// Define plugin constants.
function_exists( 'get_plugin_data' ) || require_once ABSPATH . 'wp-admin/includes/plugin.php';
define( 'TTGARDEN_METADATA', get_plugin_data( __FILE__, false, false ) );

define( 'TTGARDEN_BASENAME', plugin_basename( __FILE__ ) );
define( 'TTGARDEN_PATH', plugin_dir_path( __FILE__ ) );
define( 'TTGARDEN_URL', plugin_dir_url( __FILE__ ) );

// Define REST API namespace.
define( 'TTGARDEN_REST_NAMESPACE', 'tumblr-theme-garden/v1' );

// Define tag and block names from Tumblr Theme language.
define( 'TTGARDEN_TAGS', require_once TTGARDEN_PATH . 'includes/tumblr-theme-language/tags.php' );
define( 'TTGARDEN_BLOCKS', require_once TTGARDEN_PATH . 'includes/tumblr-theme-language/blocks.php' );
define( 'TTGARDEN_OPTIONS', require_once TTGARDEN_PATH . 'includes/tumblr-theme-language/options.php' );
define( 'TTGARDEN_MODIFIERS', require_once TTGARDEN_PATH . 'includes/tumblr-theme-language/modifiers.php' );
define( 'TTGARDEN_MISSING_BLOCKS', require_once TTGARDEN_PATH . 'includes/tumblr-theme-language/missing-blocks.php' );
define( 'TTGARDEN_MISSING_TAGS', require_once TTGARDEN_PATH . 'includes/tumblr-theme-language/missing-tags.php' );

$lang = require_once TTGARDEN_PATH . 'includes/tumblr-theme-language/lang.php';
define( 'TTGARDEN_LANG', array_change_key_case( $lang, CASE_LOWER ) );

// Load plugin translations so they are available even for the error admin notices.
add_action(
	'init',
	static function () {
		load_plugin_textdomain(
			TTGARDEN_METADATA['TextDomain'],
			false,
			dirname( TTGARDEN_BASENAME ) . TTGARDEN_METADATA['DomainPath']
		);
	}
);

// Load the autoloader.
if ( ! is_file( TTGARDEN_PATH . '/vendor/autoload.php' ) ) {
	add_action(
		'admin_notices',
		static function () {
			$message      = __( 'It seems like <strong>Tumblr Theme Garden</strong> failed to autoload. Run composer i.', 'tumblr-theme-garden' );
			$html_message = wp_sprintf( '<div class="error notice ttgarden-error">%s</div>', wpautop( $message ) );
			echo wp_kses_post( $html_message );
		}
	);
	return;
}
require_once TTGARDEN_PATH . '/vendor/autoload.php';

require_once TTGARDEN_PATH . 'functions.php';
add_action( 'after_setup_theme', array( ttgarden_get_plugin_instance(), 'initialize' ) );
