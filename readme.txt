=== Tumblr Theme Garden ===
Contributors: automattic, tommusrhodus, aaronjbaptiste, rtio, roccotripaldi
Tags: tumblr, theme
Requires at least: 6.5
Tested up to: 6.7
Stable tag: 0.1.19
Requires PHP: 8.2
License: GPLv2 or later
Text Domain: tumblr-theme-garden
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Browse all of the themes available on Tumblr and use them on your WordPress site.

== Description ==

Enables WordPress to use [Tumblr themes](https://www.tumblr.com/themes/). Browse the Tumblr Theme Garden directly from your WordPress dashboard, find an awesome theme and simply click Activate to use it.

**Features:**

- **Tumblr Theme Browser**: Find a Tumblr theme, search by name or filter by category.
- **One click to Activate**: Activate the theme with a single click.
- **Customize**: Change and personalize the theme as you would any other WordPress theme.

== Installation ==

1. Download the plugin and upload it to your WordPress site's `wp-content/plugins` directory.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. Navigate to Tumblr Themes (Appearance > Tumblr Themes) to browse and activate a theme.

== Usage ==

- Navigate to Tumblr Themes (Appearance > Tumblr Themes) to browse themes.
- Find a theme you like in the preview section using search and the category dropdown filter.
- Click Activate to use that theme
- You will then be redirected to the Customizer to access theme settings.

== External services ==

This plugin connects to the official Tumblr API to obtain data and associated files for Tumblr Themes, it is required to browse and use [Tumblr Themes](https://www.tumblr.com/themes/)

For theme searches, it sends your entered search term and category inputs.
For activating a theme, it will send your selected theme_id and a timestamp used for cache busting.

This service is provided by "Tumblr": [API Agreement](https://www.tumblr.com/docs/en/api_agreement), [Tumblr privacy policy](https://www.tumblr.com/privacy/en)

== Source Code and Development ==

The source code for the Tumblr Theme Garden plugin is publicly available and maintained on GitHub. [Tumblr Theme Garden Repository](https://github.com/Automattic/tumblr-theme-garden).

This repository includes all of the necessary build tools and documentation on how to use them. We encourage developers to explore and contribute to the project!

== Changelog ==

= 0.1.19 =

* Removes Pseudo-theme, Tumblr themes are now WP Themes

= 0.1.16 =

* Fixes theme html option in customizer
* Display more links to Tumblr theme browser
* fix: undefined pinned post key in lang array
* Always show active theme in theme browser

= 0.1.15 =
* Initial release for browsing and activating Tumblr themes
