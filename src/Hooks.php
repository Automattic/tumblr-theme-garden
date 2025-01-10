<?php
/**
 * TumblrThemeGarden theme hooks.
 *
 * @package TumblrThemeGarden
 */

namespace CupcakeLabs\TumblrThemeGarden;

defined( 'ABSPATH' ) || exit;

/**
 * Logical node for all integration functionalities.
 *
 * @since   1.0.0
 * @version 1.0.0
 */
class Hooks {
	/**
	 * The TumblrThemeGarden active status.
	 *
	 * @since   1.0.0
	 * @version 1.0.0
	 *
	 * @var     bool
	 */
	private $is_ttgarden_active;

	/**
	 * Initializes the Hooks.
	 *
	 * @since   1.0.0
	 * @version 1.0.0
	 *
	 * @param boolean $is_ttgarden_active The TumblrThemeGarden active status.
	 *
	 * @return  void
	 */
	public function initialize( $is_ttgarden_active ): void {
		$this->is_ttgarden_active = $is_ttgarden_active;

		// Flush permalink rules when switching to the Tumblr theme.
		add_action( 'switch_theme', array( $this, 'switch_theme' ), 10 );

		add_action( 'after_plugin_row_meta', array( $this, 'plugin_row_meta' ), 10 );

		add_filter( 'wp_prepare_themes_for_js', array( $this, 'prepare_themes_for_js' ) );

		// Only run these if the TumblrThemeGarden theme is active or we're in a customizer preview.
		if ( $this->is_ttgarden_active ) {
			add_filter( 'template_include', array( $this, 'template_include' ) );

			add_filter( 'comments_template', array( $this, 'comments_template' ) );

			add_action( 'enqueue_block_editor_assets', array( $this, 'ttgarden_enqueue_block_editor_assets' ) );

			add_filter( 'block_editor_settings_all', array( $this, 'ttgarden_disable_post_format_ui' ) );

			add_action( 'after_setup_theme', array( $this, 'ttgarden_theme_support' ) );

			add_action( 'wp_enqueue_scripts', array( $this, 'ttgarden_enqueue_scripts' ) );

			add_action( 'init', array( $this, 'ttgarden_rewrite_rules' ) );

			add_filter( 'query_vars', array( $this, 'ttgarden_add_tumblr_search_var' ) );

			add_action( 'template_redirect', array( $this, 'ttgarden_template_redirects' ), 1 );

			add_action( 'init', array( $this, 'ttgarden_disable_emojis' ) );
		}
	}

	/**
	 * Filters the prepared themes list for display in wp-admin/themes.php
	 * Updates customize and live preview buttons for Tumblr themes to use the customizer.
	 *
	 * @param array $prepared_themes Array of JS prepared themes.
	 *
	 * @return array
	 */
	public function prepare_themes_for_js( $prepared_themes ): array {
		foreach ( $prepared_themes as $key => $theme ) {
			if ( false !== strpos( $theme['tags'], 'tumblr-theme' ) ) {
				$prepared_themes[ $key ]['actions']['customize'] = admin_url( 'customize.php?theme=' . $theme['id'] . '&return=%2Fwp-admin%2Fthemes.php' );
			}
		}

		return $prepared_themes;
	}

	/**
	 * Returns the comments template path.
	 *
	 * @since   1.0.0
	 * @version 1.0.0
	 *
	 * @return  string
	 */
	public function comments_template(): string {
		return TTGARDEN_PATH . 'comments.php';
	}

	/**
	 * Enqueues the block editor assets.
	 *
	 * @since   1.0.0
	 * @version 1.0.0
	 *
	 * @return  void
	 */
	public function ttgarden_enqueue_block_editor_assets(): void {
		$deps = ttgarden_get_asset_meta( TTGARDEN_PATH . 'assets/js/build/editor.asset.php' );

		wp_enqueue_script(
			'cupcakelabs-tumblr-theme-garden',
			TTGARDEN_URL . 'assets/js/build/editor.js',
			$deps['dependencies'],
			$deps['version'],
			true
		);

		wp_enqueue_style(
			'cupcakelabs-tumblr-theme-garden',
			TTGARDEN_URL . 'assets/js/build/editor.css',
			array(),
			$deps['version']
		);
	}

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
	public function ttgarden_disable_post_format_ui( array $settings ): array {
		$settings['disablePostFormats'] = true;
		return $settings;
	}

	/**
	 * Setup theme support.
	 *
	 * @return void
	 */
	public function ttgarden_theme_support(): void {
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

	/**
	 * Enqueue theme styles and scripts.
	 *
	 * @return void
	 */
	public function ttgarden_enqueue_scripts(): void {
		wp_enqueue_style(
			'tumblr-theme-garden-style',
			TTGARDEN_URL . 'assets/css/build/index.css',
			array(),
			TTGARDEN_METADATA['Version']
		);
	}

	/**
	 * Adds a random endpoint to match Tumblr's behavior.
	 *
	 * @return void
	 */
	public function ttgarden_rewrite_rules(): void {
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

	/**
	 * Add a new query variable for Tumblr search.
	 *
	 * @param array $vars Registered query variables.
	 *
	 * @return array
	 */
	public function ttgarden_add_tumblr_search_var( $vars ): array {
		$vars[] = 'q';
		$vars[] = 'random';
		$vars[] = 'ttgarden_html_comments';
		return $vars;
	}

	/**
	 * Handles template redirects for Tumblr theme.
	 *
	 * - If 'random' is set, redirect to a random post.
	 * - If 'q' is set, redirect to the core search page.
	 * - If 'ttgarden_html_comments' is set, redirect to a HTML only comments page.
	 *
	 * @return void
	 */
	public function ttgarden_template_redirects(): void {
		// If 'ttgarden_html_comments' is set, redirect to a HTML only comments page. /?p=85&ttgarden_html_comments=true
		if ( get_query_var( 'ttgarden_html_comments' ) ) {
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
						'callback' => 'ttgarden_comment_markup',
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

	/**
	 * Disable emojis.
	 *
	 * @return void
	 */
	public function ttgarden_disable_emojis(): void {
		// Remove the emoji script from the front end and admin
		remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
		remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );

		// Remove the emoji styles from the front end and admin
		remove_action( 'wp_print_styles', 'print_emoji_styles' );
		remove_action( 'admin_print_styles', 'print_emoji_styles' );
	}

	/**
	 * Include the Tumblr theme template on all requests.
	 *
	 * @return string
	 */
	public function template_include(): string {
		return get_template_directory() . '/index.php';
	}

	/**
	 * Flush rewrite rules when switching to the Tumblr theme.
	 *
	 * @return void
	 */
	public function switch_theme(): void {
		flush_rewrite_rules();
	}

	/**
	 * Fires after plugin row meta.
	 *
	 * @since 6.5.0
	 *
	 * @param string $plugin_file Refer to {@see 'plugin_row_meta'} filter.
	 */
	public function plugin_row_meta( $plugin_file ): void {
		// Only show the message on the TumblrThemeGarden plugin.
		if ( 'tumblr-theme-garden/tumblr-theme-garden.php' !== $plugin_file ) {
			return;
		}

		$features = new FeatureSniffer();

		// If there are no unsupported features, return early.
		if ( empty( $features->get_unsupported_features( 'plugins' ) ) ) {
			return;
		}

		printf(
			'<div class="requires"><p><strong>%s:</strong></p>%s</div>',
			esc_html__( 'The active Tumblr Theme recommends the following additional plugins', 'tumblr-theme-garden' ),
			wp_kses_post( $features->get_unsupported_features_html( true ) )
		);
	}
}
