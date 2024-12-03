import apiFetch from '@wordpress/api-fetch';
import { createReduxStore, register } from '@wordpress/data';

/**
 * Default state is loaded from an inline script declared in ThemeGarden.php.
 */
const DEFAULT_STATE = {
	logoUrl: themeGardenData.logoUrl, // eslint-disable-line no-undef
	themes: themeGardenData.themes, // eslint-disable-line no-undef
	categories: themeGardenData.categories, // eslint-disable-line no-undef
	selectedCategory: themeGardenData.selectedCategory, // eslint-disable-line no-undef
	search: themeGardenData.search, // eslint-disable-line no-undef
	baseUrl: themeGardenData.baseUrl, // eslint-disable-line no-undef
	isFetchingThemes: false,
	isOverlayOpen: false,
	themeDetails: null,
	isFetchingTheme: false,
};

const reducer = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case 'BEFORE_FETCH_THEMES':
			return { ...state, isFetchingThemes: true };
		case 'BEFORE_FETCH_THEME':
			return { ...state, isFetchingTheme: true, isOverlayOpen: true, };
		case 'RECEIVE_THEMES':
			return { ...state, themes: action.themes, isFetchingThemes: false };
		case 'RECEIVE_THEME':
			return { ...state, isFetchingTheme: false, themeDetails: action.theme };
		case 'CLOSE_OVERLAY':
			return { ...state, isOverlayOpen: false, isFetchingTheme: false, themeDetails: null };
		default:
			return state;
	}
};

const actions = {
	closeOverlay() {
		return {
			type: 'CLOSE_OVERLAY'
		};
	},
	receiveTheme( theme ) {
		return {
			type: 'RECEIVE_THEME',
			theme: theme,
		};
	},
	receiveThemes( themes ) {
		return {
			type: 'RECEIVE_THEMES',
			themes,
		};
	},
	beforeFetchTheme() {
		return { type: 'BEFORE_FETCH_THEME' };
	},
	beforeFetchThemes() {
		return { type: 'BEFORE_FETCH_THEMES' };
	},
	*fetchThemes( category ) {
		try {
			return controls.FETCH_THEMES( category );
		} catch ( error ) {
			throw new Error( 'Failed to fetch themes' );
		}
	},
	*searchThemes( query ) {
		try {
			return controls.SEARCH_THEMES( query );
		} catch ( error ) {
			throw new Error( 'Failed to search themes' );
		}
	},
	*fetchTheme( id ) {
		try {
			return controls.FETCH_THEME( id );
		} catch ( error ) {
			throw new Error( 'Failed to fetch theme' );
		}
	}
};

const selectors = {
	getLogoUrl() {
		return DEFAULT_STATE.logoUrl;
	},
	getInitialFilterBarProps() {
		return {
			categories: DEFAULT_STATE.categories,
			selectedCategory: DEFAULT_STATE.selectedCategory,
			baseUrl: DEFAULT_STATE.baseUrl,
			search: DEFAULT_STATE.search,
		};
	},
	getIsFetchingThemes( state ) {
		return state.isFetchingThemes;
	},
	getIsFetchingTheme( state ) {
		return state.isFetchingTheme;
	},
	getThemes( state ) {
		return state.themes;
	},
	getIsOverlayOpen( state ) {
		return state.isOverlayOpen;
	},
	getThemeDetails( state ) {
		return state.themeDetails;
	},
};

const controls = {
	FETCH_THEMES( category ) {
		return apiFetch( {
			path: '/tumblr3/v1/themes?category=' + category,
			method: 'GET',
		} )
			.then( response => {
				return response;
			} )
			.catch( error => {
				throw error;
			} );
	},
	SEARCH_THEMES( query ) {
		return apiFetch( {
			path: '/tumblr3/v1/themes?search=' + query,
			method: 'GET',
		} )
			.then( response => {
				return response;
			} )
			.catch( error => {
				console.error( 'API Error:', error ); // eslint-disable-line no-console
				throw error;
			} );
	},
	FETCH_THEME( id ) {
		return apiFetch( {
			path: '/tumblr3/v1/theme?theme=' + id,
			method: 'GET',
		} )
			.then( response => {
				return response;
			} )
			.catch( error => {
				console.error( 'API Error:', error ); // eslint-disable-line no-console
				throw error;
			} );
	},
};

const store = createReduxStore( 'tumblr3/theme-garden-store', {
	reducer,
	actions,
	selectors,
	controls,
} );

register( store );

export default store;
