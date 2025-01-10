<?php
/**
 * TumblrThemeGarden theme functions.
 *
 * @package TumblrThemeGarden
 */

defined( 'ABSPATH' ) || exit;

use CupcakeLabs\TumblrThemeGarden\Plugin;

/**
 * Returns the plugin's main class instance.
 *
 * @since   1.0.0
 * @version 1.0.0
 *
 * @return  Plugin
 */
function ttgarden_get_plugin_instance(): Plugin {
	return Plugin::get_instance();
}

/**
 * Returns the plugin's slug.
 *
 * @since   1.0.0
 * @version 1.0.0
 *
 * @return  string
 */
function ttgarden_get_plugin_slug(): string {
	return sanitize_key( TTGARDEN_METADATA['TextDomain'] );
}

/**
 * Returns an array with meta information for a given asset path. First, it checks for an .asset.php file in the same directory
 * as the given asset file whose contents are returns if it exists. If not, it returns an array with the file's last modified
 * time as the version and the main stylesheet + any extra dependencies passed in as the dependencies.
 *
 * @since   1.0.0
 * @version 1.0.0
 *
 * @param   string     $asset_path         The path to the asset file.
 * @param   array|null $extra_dependencies Any extra dependencies to include in the returned meta.
 *
 * @return  array|null
 */
function ttgarden_get_asset_meta( string $asset_path, ?array $extra_dependencies = null ): ?array {
	if ( ! file_exists( $asset_path ) || ! str_starts_with( $asset_path, TTGARDEN_PATH ) ) {
		return null;
	}

	$asset_path_info = pathinfo( $asset_path );
	if ( file_exists( $asset_path_info['dirname'] . '/' . $asset_path_info['filename'] . '.php' ) ) {
		$asset_meta  = require $asset_path_info['dirname'] . '/' . $asset_path_info['filename'] . '.php';
		$asset_meta += array( 'dependencies' => array() ); // Ensure 'dependencies' key exists.
	} else {
		$asset_meta = array(
			'dependencies' => array(),
			'version'      => filemtime( $asset_path ),
		);
		if ( false === $asset_meta['version'] ) { // Safeguard against filemtime() returning false.
			$asset_meta['version'] = TTGARDEN_METADATA['Version'];
		}
	}

	if ( is_array( $extra_dependencies ) ) {
		$asset_meta['dependencies'] = array_merge( $asset_meta['dependencies'], $extra_dependencies );
		$asset_meta['dependencies'] = array_unique( $asset_meta['dependencies'] );
	}

	return $asset_meta;
}

/**
 * We need a custom do_shortcode implementation because do_shortcodes_in_html_tags()
 * is run before running reguular shortcodes, which means that things like link hrefs
 * get populated before they even have context.
 *
 * @param string $content The content to parse.
 *
 * @return string The parsed content.
 */
function ttgarden_do_shortcode( $content ): string {
	global $shortcode_tags;
	static $pattern = null;

	// Avoid generating this multiple times.
	if ( null === $pattern ) {
		$pattern = get_shortcode_regex( array_keys( $shortcode_tags ) );
	}

	$content = preg_replace_callback( "/$pattern/", 'do_shortcode_tag', $content );

	// Always restore square braces so we don't break things like <!--[if IE ]>.
	$content = unescape_invalid_shortcodes( $content );

	return $content;
}

/**
 * Gets the current parse context.
 * Used for informing data tags of their context.
 * Also used for storing data to pass between tags.
 *
 * @return array|null|string The current parse context.
 */
function ttgarden_get_parse_context() {
	global $ttgarden_parse_context;
	return $ttgarden_parse_context;
}

/**
 * Sets the global parse context.
 *
 * @param string $key   The key to set.
 * @param mixed  $value The value to set.
 *
 * @return void
 */
function ttgarden_set_parse_context( $key, $value ): void {
	global $ttgarden_parse_context;
	$ttgarden_parse_context = array( $key => $value );
}

/**
 * Normalizes a theme option name.
 *
 * @param string $name The name to normalize.
 *
 * @return string The normalized name.
 */
function ttgarden_normalize_option_name( $name ): string {
	return strtolower(
		str_replace(
			array_merge(
				array( ' ' ),
				TTGARDEN_OPTIONS
			),
			'',
			$name
		)
	);
}

/**
 * Gets the Tumblr Theme Garden regex.
 *
 * @return string The Tumblr Theme Garden regex.
 */
function ttgarden_get_tumblr_regex(): string {
	return '/\{([a-zA-Z0-9][a-zA-Z0-9\\-\/=" ]*|font\:[a-zA-Z0-9 ]+|text\:[a-zA-Z0-9 ]+|select\:[a-zA-Z0-9 ]+|image\:[a-zA-Z0-9 ]+|color\:[a-zA-Z0-9 ]+|RGBcolor\:[a-zA-Z0-9 ]+|lang\:[a-zA-Z0-9- ]+|[\/]?block\:[a-zA-Z0-9]+( [a-zA-Z0-9=" ]+)*)\}/i';
}

/**
 * Custom comment markup.
 *
 * @param WP_Comment $comment The comment object.
 * @param array      $args    An array of arguments.
 *
 * @return void
 */
function ttgarden_comment_markup( $comment, $args ): void {
	?>
<li class="note">

	<a href="#" class="avatar_frame">
		<?php echo get_avatar( $comment, $args['avatar_size'] ); ?>
	</a>

	<span class="action">
		<?php
			echo wp_kses_post(
				sprintf(
					// Translators: 1 is the author name.
					__( '%s <span class="says">says:</span>', 'tumblr-theme-garden' ),
					sprintf( '<b class="fn">%s</b>', get_comment_author_link( $comment ) )
				)
			);
			comment_text();
		?>

			<?php if ( '0' === $comment->comment_approved ) : ?>
			<p class="comment-awaiting-moderation"><?php esc_html_e( 'Your comment is awaiting moderation.', 'tumblr-theme-garden' ); ?></p>
		<?php endif; ?>

	</span>

	<div class="clear"></div>

	<?php
}

/**
 * Get the Tumblr theme HTML content.
 *
 * @return string The HTML content.
 */
function ttgarden_get_theme_html(): string {
	global $wp_filesystem;
	require_once ABSPATH . 'wp-admin/includes/file.php';

	if ( ! WP_Filesystem() ) {
		wp_die( 'Failed to access the filesystem.' );
	}

	// Get the HTML content from our templates/index.html file.
	return $wp_filesystem->get_contents( get_template_directory() . '/templates/index.html' );
}

/**
 * This is the main output function for the plugin.
 * This function pulls in the Tumblr theme content and then processes it.
 *
 * @return void
 */
function ttgarden_page_output(): void {
	// Get the HTML content from the themes template part.
	$content = ttgarden_get_theme_html();

	// Shortcodes don't currently have a doing_shortcode() or similar.
	// So we need a global to track the context.
	ttgarden_set_parse_context( 'theme', true );

	/**
	 * Capture wp_head output.
	 *
	 * @todo Can this be done in a more elegant way?
	 */
	ob_start();
	wp_head();
	$ttgarden_head = ob_get_contents();
	ob_end_clean();

	// Build page content and then remove any closing shortcodes.
	$content = apply_filters( 'ttgarden_theme_output', $content );

	/**
	 * Capture wp_footer output.
	 *
	 * @todo Can this be done in a more elegant way?
	 */
	ob_start();
	wp_footer();
	$ttgarden_footer = ob_get_contents();
	ob_end_clean();

	// Add the head and footer to the theme.
	$content = str_replace( '</head>', $ttgarden_head . '</head>', $content );
	$content = str_replace( '</body>', $ttgarden_footer . '</body>', $content );

	echo $content;
}

// Include tag and block hydration functions for each Tumblr Theme tag|block.
require TTGARDEN_PATH . 'includes/block-functions.php';
require TTGARDEN_PATH . 'includes/tag-functions.php';
