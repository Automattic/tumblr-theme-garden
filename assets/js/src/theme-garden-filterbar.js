import { useState } from '@wordpress/element';
import { __, _x } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import './theme-garden-store';

/**
 * ThemeGardenFilterBar component
 *
 * This component appears at the top of the theme browser, and has a category selector and a search bar.
 *
 * @param props
 * @param props.themes
 * @param props.categories
 * @param props.initialCategory
 * @param props.baseUrl
 */
const _ThemeGardenFilterBar = ({themes, categories, initialCategory, baseUrl}) => {
	const [currentCategory, setCurrentCategory] = useState(initialCategory);

	const onChangeCategory = ({currentTarget}) => {
		setCurrentCategory(currentTarget.value);
		window.history.pushState( {}, '', baseUrl + '&category=' + currentTarget.value);
	}

	return (
		<div className="wp-filter">
			<div className="filter-count">
				<span className="count">{themes.length}</span>
			</div>
			<label htmlFor="t3-categories">{__('Categories', 'tumblr3')}</label>
			<select id="t3-categories" name="category" onChange={onChangeCategory}>
				<option value="featured">{_x('Featured', 'The name of a category in a list of categories.', 'tumblr3')}</option>
				{categories.map(
					(category) => {
						return(
							<option value={category.text_key} selected={currentCategory === category.text_key}>
								{category.name}
							</option>
						);
					}
				)}
			</select>
		</div>
	);
}

export const ThemeGardenFilterBar = compose(
	withSelect( ( select ) => ( select( 'tumblr3/theme-garden-store' ).getFilterBarProps() ) ),
)( _ThemeGardenFilterBar );
