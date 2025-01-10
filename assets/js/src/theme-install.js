/* global TumblrThemeGardenInstall */
window.addEventListener(
	'DOMContentLoaded',
	function () {
		const body = document.getElementById( 'wpbody-content' );
		const filterLinks = body.getElementsByClassName( 'filter-links' );

		const handleClick = function () {
			window.location = TumblrThemeGardenInstall.browseUrl;
		};

		if ( filterLinks[ 0 ] && filterLinks[ 0 ].tagName.toLowerCase() === 'ul' ) {
			const list = filterLinks[ 0 ];
			const listItem = document.createElement( 'li' );
			const link = document.createElement( 'button' );
			listItem.setAttribute( 'class', 'tumblr-theme-garden-list-item' );
			link.setAttribute( 'title', TumblrThemeGardenInstall.buttonText );
			link.addEventListener( 'click', handleClick );
			link.setAttribute( 'class', 'tumblr-theme-garden-link' );
			listItem.appendChild( link );
			list.appendChild( listItem );
		}
	},
	false
);
