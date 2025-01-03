<?php
/**
 * TumblrThemeGarden functions and definitions
 *
 * @package TumblrThemeGarden
 */

defined( 'ABSPATH' ) || exit;

/**
 * Enqueues the block editor assets.
 *
 * @since   1.0.0
 * @version 1.0.0
 *
 * @return  void
 */
function clttg_enqueue_block_editor_assets(): void {
	$deps = clttg_get_asset_meta( CLTTG_PATH . 'assets/js/build/editor.asset.php' );

	wp_enqueue_script(
		'cupcakelabs-tumblr-theme-garden',
		CLTTG_URL . 'assets/js/build/editor.js',
		$deps['dependencies'],
		$deps['version'],
		true
	);

	wp_enqueue_style(
		'cupcakelabs-tumblr-theme-garden',
		CLTTG_URL . 'assets/js/build/editor.css',
		array(),
		$deps['version']
	);
}
add_action( 'enqueue_block_editor_assets', 'clttg_enqueue_block_editor_assets' );

/**
 * Filters the block editor settings.
 *
 * @since   1.0.0
 * @version 1.0.0
 * @see https://developer.wordpress.org/block-editor/reference-guides/filters/editor-filters/
 *
 * @param   array $settings The block editor settings.
 *
 * @return  array
 */
function clttg_disable_post_format_ui( array $settings ): array {
	$settings['disablePostFormats'] = true;
	return $settings;
}
add_filter( 'block_editor_settings_all', 'clttg_disable_post_format_ui' );

/**
 * Setup theme support.
 *
 * @return void
 */
function clttg_theme_support(): void {
	add_theme_support( 'post-formats', array( 'image', 'gallery', 'link', 'audio', 'video', 'quote', 'chat' ) );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'custom-background' );
	add_theme_support( 'custom-header' );
	add_theme_support( 'header-text' );
	add_theme_support( 'custom-logo' );

	// Register widget area to support an edge case of Tumblr's theme.
	register_sidebar(
		array(
			'name' => esc_html__( 'Sidebar', 'tumblr-theme-garden' ),
			'id'   => 'sidebar-1',
		)
	);
}
add_action( 'after_setup_theme', 'clttg_theme_support' );

/**
 * Enqueue theme styles and scripts.
 *
 * @return void
 */
function clttg_enqueue_scripts(): void {
	wp_enqueue_style(
		'tumblr-theme-garden-style',
		CLTTG_URL . 'assets/css/build/index.css',
		array(),
		CLTTG_METADATA['Version']
	);
}
add_action( 'wp_enqueue_scripts', 'clttg_enqueue_scripts' );

/**
 * Adds a random endpoint to match Tumblr's behavior.
 *
 * @return void
 */
function clttg_rewrite_rules(): void {
	// Handle the Tumblr random endpoint.
	add_rewrite_rule(
		'^random/?$',
		'index.php?random=1',
		'top'
	);

	// Redirect the Tumblr archive endpoint to the homepage.
	add_rewrite_rule(
		'^archive/?$',
		'index.php',
		'top'
	);
}
add_action( 'init', 'clttg_rewrite_rules' );

/**
 * Add a new query variable for Tumblr search.
 *
 * @param array $vars Registered query variables.
 *
 * @return array
 */
function clttg_add_tumblr_search_var( $vars ): array {
	$vars[] = 'q';
	$vars[] = 'random';
	$vars[] = 'clttg_html_comments';
	return $vars;
}
add_filter( 'query_vars', 'clttg_add_tumblr_search_var' );

/**
 * Handles template redirects for Tumblr theme.
 *
 * - If 'random' is set, redirect to a random post.
 * - If 'q' is set, redirect to the core search page.
 * - If 'clttg_html_comments' is set, redirect to a HTML only comments page.
 *
 * @return void
 */
function clttg_template_redirects(): void {
	// If 'clttg_html_comments' is set, redirect to a HTML only comments page. /?p=85&clttg_html_comments=true
	if ( get_query_var( 'clttg_html_comments' ) ) {
		$post_id = get_query_var( 'p' );

		// Ensure this is a valid post, it's published, not private.
		if ( ! 'post' === get_post_type( $post_id ) || 'publish' !== get_post_status( $post_id ) ) {
			exit;
		}

		// Get the comments.
		$comments = get_comments(
			array(
				'post_id' => $post_id,
				'status'  => 'approve',
			)
		);

		// Build the HTML output.
		$html_output = sprintf(
			'<ol class="notes">%s</ol>',
			wp_list_comments(
				array(
					'style'    => 'ol',
					'callback' => 'clttg_comment_markup',
					'echo'     => false,
					'per_page' => 100,
				),
				$comments
			)
		);

		echo wp_kses_post( $html_output );
		exit;
	}

	// If random is set, redirect to a random post.
	if ( get_query_var( 'random' ) ) {
		// @see https://docs.wpvip.com/databases/optimize-queries/using-post__not_in/
		$rand_post = get_posts(
			array(
				'posts_per_page' => 2,
				'orderby'        => 'rand',
				'post_type'      => 'post',
				'fields'         => 'ids',
			)
		);

		if ( ! empty( $rand_post ) ) {
			$redirect_id = ( isset( $rand_post[1] ) && get_the_ID() !== $rand_post[1] ) ? $rand_post[1] : $rand_post[0];
			wp_safe_redirect( get_permalink( $redirect_id ) );
			exit;
		}
	}

	// If 'q' is set, redirect to the core search page.
	if ( get_query_var( 'q' ) ) {
		wp_safe_redirect( home_url( '/?s=' . get_query_var( 'q' ) ) );
		exit;
	}
}
add_action( 'template_redirect', 'clttg_template_redirects', 1 );

/**
 * Custom comment markup.
 *
 * @param WP_Comment $comment The comment object.
 * @param array      $args    An array of arguments.
 *
 * @return void
 */
function clttg_comment_markup( $comment, $args ): void {
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
 * Disable emojis.
 *
 * @return void
 */
function clttg_disable_emojis(): void {
	// Remove the emoji script from the front end and admin
	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );

	// Remove the emoji styles from the front end and admin
	remove_action( 'wp_print_styles', 'print_emoji_styles' );
	remove_action( 'admin_print_styles', 'print_emoji_styles' );
}
add_action( 'init', 'clttg_disable_emojis' );
