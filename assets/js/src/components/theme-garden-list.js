import { useEffect, useState } from '@wordpress/element';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { ThemeGardenNoThemes } from './theme-garden-no-themes';
import './theme-garden-store';
import { ThemeGardenListItem } from './theme-garden-list-item';

/**
 * Displays a list of Tumblr themes.
 *
 * CSS classNames reference built-in wp-admin styles, and styles declared in _theme_garden.scss.
 *
 * @param {Object}   props
 * @param {Array}    props.themes
 * @param {boolean}  props.isFetchingThemes
 * @param {Function} props.fetchThemeById
 * @param {Object}   props.activeTheme
 * @param {string}   props.customizeUrl
 * @param {string}   props.search
 */
const _ThemeGardenList = ( {
	themes,
	isFetchingThemes,
	fetchThemeById,
	activeTheme,
	customizeUrl,
	search,
} ) => {
	const [ localThemes, setLocalThemes ] = useState( themes );

	useEffect( () => {
		setLocalThemes( themes );
	}, [ themes ] );

	const handleDetailsClick = async ( { currentTarget: { value: themeId } } ) => {
		if ( activeTheme && themeId === activeTheme.id ) {
			window.location.href = customizeUrl;
			return;
		}

		const currentUrl = new URL( window.location.href );
		const params = new URLSearchParams( currentUrl.search );
		params.append( 'theme', themeId );
		currentUrl.search = params.toString();
		await fetchThemeById( themeId );
		window.history.pushState( {}, '', currentUrl.toString() );
	};

	if ( isFetchingThemes ) {
		return (
			<div className="loading-content">
				<span className="spinner"></span>
			</div>
		);
	}

	if ( localThemes.length === 0 ) {
		return <ThemeGardenNoThemes />;
	}

	return (
		<div className="tumblr-themes">
			{ activeTheme && ! search && (
				<ThemeGardenListItem
					theme={ activeTheme }
					handleDetailsClick={ handleDetailsClick }
					isActive
				/>
			) }
			{ themes.map( theme => (
				<ThemeGardenListItem
					theme={ theme }
					handleDetailsClick={ handleDetailsClick }
					key={ theme.title }
				/>
			) ) }
		</div>
	);
};

export const ThemeGardenList = compose(
	withSelect( select => ( {
		themes: select( 'tumblr-theme-garden/theme-garden-store' ).getThemes(),
		isFetchingThemes: select( 'tumblr-theme-garden/theme-garden-store' ).getIsFetchingThemes(),
		activeTheme: select( 'tumblr-theme-garden/theme-garden-store' ).getActiveTheme(),
		customizeUrl: select( 'tumblr-theme-garden/theme-garden-store' ).getCustomizeUrl(),
		search: select( 'tumblr-theme-garden/theme-garden-store' ).getSearch(),
	} ) ),
	withDispatch( dispatch => ( {
		closeOverlay: () => {
			return dispatch( 'tumblr-theme-garden/theme-garden-store' ).closeOverlay();
		},
	} ) )
)( _ThemeGardenList );
