/* eslint-disable react-hooks/rules-of-hooks */
import { registerPlugin } from '@wordpress/plugins';
import { PluginPostStatusInfo } from '@wordpress/editor';
import { __, sprintf } from '@wordpress/i18n';
import { useDispatch, useSelect, dispatch } from '@wordpress/data';
import { Button } from '@wordpress/components';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';

/**
 * @see https://github.com/WordPress/gutenberg/blob/dd7451ff41acae3c2e9fa56b6ed7a1f14db04a55/packages/editor/src/components/post-format/index.js#L83
 */
const POST_FORMATS = [
	{
		id: 'standard',
		caption: __( 'Text' ),
		icon: (
			<svg height="35" width="40" viewBox="0 0 20.8 13">
				<path d="M.1 13h2.8l.9-3h4.7l.8 3h2.9L7.7 0h-3L.1 13zm6-10.1l2 5.1H4.2l1.9-5.1zM20 10V6c0-1.1-.2-1.9-1-2.3-.7-.5-1.7-.7-2.7-.7-1.6 0-2.7.4-3.4 1.2-.4.5-.6 1.2-.7 2h2.4c.1-.4.2-.6.4-.8.2-.3.6-.4 1.2-.4.5 0 .9.1 1.2.2.3.1.4.4.4.8 0 .3-.2.5-.5.7-.2.1-.5.2-1 .2l-.9.1c-1 .1-1.7.3-2.2.6-.9.5-1.4 1.3-1.4 2.5 0 .9.3 1.6.8 2 .6.5 1.3.9 2.2.9.7 0 1.2-.3 1.7-.6.4-.2.8-.6 1.2-.9 0 .2 0 .4.1.6 0 .2.1.8.2 1h2.7v-.8c-.1-.1-.3-.2-.4-.3.1-.3-.3-1.7-.3-2zm-2.2-1.1c0 .8-.3 1.4-.7 1.7-.4.3-1 .5-1.5.5-.3 0-.6-.1-.9-.3-.2-.2-.4-.5-.4-.9 0-.5.2-.8.6-1 .2-.1.6-.2 1.1-.3l.6-.1c.3-.1.5-.1.7-.2.2-.1.3-.1.5-.2v.8z"></path>
			</svg>
		),
	},
	{
		id: 'image',
		caption: __( 'Image' ),
		icon: (
			<svg height="35" width="40" viewBox="0 0 17 15">
				<path d="M14.6 1h-2.7l-.6-1h-6l-.6 1H2.4C1.1 1 0 2 0 3.3v9.3C0 13.9 1.1 15 2.4 15h12.2c1.3 0 2.4-1.1 2.4-2.4V3.3C17 2 15.9 1 14.6 1zM8.3 13.1c-2.9 0-5.2-2.3-5.2-5.1s2.3-5.1 5.2-5.1c2.9 0 5.2 2.3 5.2 5.1s-2.3 5.1-5.2 5.1zm5.9-8.3c-.6 0-1.1-.5-1.1-1.1 0-.6.5-1.1 1.1-1.1s1.1.5 1.1 1.1c0 .6-.5 1.1-1.1 1.1zm-10 3.1c0 1.2.5 2.2 1.3 3 0-.2 0-.4-.1-.6 0-2.2 1.8-4 4.1-4 1.1 0 2 .4 2.8 1.1-.3-2-2-3.4-4-3.4-2.2-.1-4.1 1.7-4.1 3.9z"></path>
			</svg>
		),
	},
	{
		id: 'gallery',
		caption: __( 'Gallery' ),
		icon: (
			<svg height="35" width="40" viewBox="0 0 24 24">
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M16 3H4C3.44772 3 3 3.44772 3 4V16C3 16.5523 3.44772 17 4 17C4.55229 17 5 16.5523 5 16V8C5 6.34315 6.34315 5 8 5H16C16.5523 5 17 4.55228 17 4C17 3.44772 16.5523 3 16 3ZM20 5C19.4477 5 19 4.55228 19 4C19 2.34315 17.6569 1 16 1H4C2.34315 1 1 2.34315 1 4V16C1 17.6569 2.34315 19 4 19C4.55229 19 5 19.4477 5 20C5 21.6569 6.34315 23 8 23H20C21.6569 23 23 21.6569 23 20V8C23 6.34315 21.6569 5 20 5ZM14 10C14 11.1046 13.1046 12 12 12C10.8954 12 10 11.1046 10 10C10 8.89543 10.8954 8 12 8C13.1046 8 14 8.89543 14 10ZM7 17.6829C7 17.4082 7.11304 17.1455 7.31257 16.9567L8.79638 15.5522C9.54271 14.8457 10.7029 14.8198 11.48 15.4923L12.4939 16.3698C12.9005 16.7216 13.5125 16.689 13.8794 16.2959L16.3619 13.636C17.1761 12.7637 18.568 12.7938 19.3437 13.7005L20.7599 15.3557C20.9148 15.5368 21 15.7674 21 16.0058V20C21 20.5523 20.5523 21 20 21H8C7.44772 21 7 20.5523 7 20V17.6829Z"
				></path>
			</svg>
		),
	},
	{
		id: 'quote',
		caption: __( 'Quote' ),
		icon: (
			<svg height="35" width="40" viewBox="0 0 17 13">
				<path d="M3.5 5.5C4 3.7 5.8 2.4 7.2 1.3L5.9 0C3 1.8 0 5 0 8.5 0 11 1.3 13 4 13c2 0 3.7-1.5 3.7-3.6C7.7 7 6 5.5 3.5 5.5zm9.3 0c.4-1.8 2.2-3.1 3.7-4.2L15.2 0c-2.8 1.8-5.9 5-5.9 8.5 0 2.4 1.3 4.5 4 4.5 2 0 3.7-1.5 3.7-3.6 0-2.4-1.7-3.9-4.2-3.9z"></path>
			</svg>
		),
	},
	{
		id: 'link',
		caption: __( 'Link' ),
		icon: (
			<svg height="35" width="40" viewBox="0 0 17 17">
				<path d="M9.9 5.1c-.2.3-.5 1.4-.6 2.6l1.1-.1c.7-.1 1.3-.3 1.5-.5.6-.6.6-1.4 0-2-.6-.5-1.4-.5-2 0zM8.5 0C3.8 0 0 3.8 0 8.5S3.8 17 8.5 17 17 13.2 17 8.5 13.2 0 8.5 0zm4.4 8.2c-.5.5-1.5.8-2.5.9l-1.2.2c-.1 1.3-.4 2.9-1 3.6-1.1 1.1-3 1.2-4.1 0-1.1-1.1-1.1-3 0-4.1.5-.5 1.5-.8 2.6-.9v1.5c-1.2.3-1.5.5-1.6.5-.6.6-.6 1.4 0 2 .5.5 1.4.5 2 0 .2-.2.5-1.1.6-2.5l.1-.9c0-1.3.2-3.6 1-4.4 1.1-1.1 3-1.2 4.1 0 1.2 1.1 1.2 2.9 0 4.1z"></path>
			</svg>
		),
	},
	{
		id: 'chat',
		caption: __( 'Chat' ),
		icon: (
			<svg height="35" width="40" viewBox="0 0 18.7 17">
				<path d="M16 6.1V2.6C16 .8 15 0 13.1 0H2.9C1 0 0 1.1 0 3.3v10.4C0 15.9 1 17 2.9 17h10.2c1.9 0 2.9-.8 2.9-2.6v-2.9l2.7-2.9c0-.1-2.7-2.5-2.7-2.5zm-4.5-.7c0-.5.3-.8.7-.8s.8.3.8.8v1.7l-.3 2.5c0 .3-.2.4-.4.4s-.4-.1-.4-.4l-.3-2.5V5.4zm-3.8 6.4c0 .4-.1.8-.7.8-.5 0-.7-.4-.7-.8V9.1C6.3 8.4 6 8 5.4 8c-.5 0-1 .4-1 1.2v2.6c0 .4-.1.8-.7.8s-.7-.4-.7-.8V5.4c0-.5.3-.8.7-.8.4 0 .7.3.7.8v2.1c.3-.4.7-.8 1.5-.8s1.7.5 1.7 2c.1.1.1 3.1.1 3.1zm2.5 0c0 .4-.1.8-.7.8-.5 0-.7-.4-.7-.8V7.5c0-.4.1-.8.7-.8.5 0 .7.4.7.8v4.3zm-.7-5.6c-.4 0-.7-.4-.7-.8s.3-.8.7-.8c.4 0 .7.4.7.8s-.3.8-.7.8zm2.8 6.3c-.4 0-.8-.4-.8-.9s.3-.9.8-.9.8.4.8.9-.4.9-.8.9z"></path>
			</svg>
		),
	},
	{
		id: 'audio',
		caption: __( 'Audio' ),
		icon: (
			<svg height="35" width="40" viewBox="0 0 19 16">
				<path d="M17.7 7.3c-.4-4.4-4-7.3-8.3-7.3-4.3 0-7.9 2.9-8.3 7.4C.5 7.4 0 8 0 8.6v5c0 .8.6 1.4 1.3 1.4H4c.2.4.8 1 1.2 1 .6 0 .8-1 .8-1.6V7.8c0-.5-.2-1.6-.8-1.6-.4 0-1 .8-1.2 1.1H2.9c.4-3.5 3.2-5.6 6.5-5.6s6.2 2.1 6.5 5.6H15c0-.3-.7-1.1-1.1-1.1-.6 0-.9 1-.9 1.6v6.6c0 .5.3 1.6.9 1.6.4 0 1.1-.6 1.2-1h2.6c.7 0 1.3-.6 1.3-1.3v-5c0-.8-.6-1.3-1.3-1.4zM3 8.5v1l-2 1.3V8.5h2zm15 .9l-2 1.3V8.5h2v.9zm-6.4.3l-1.6.5V6.4c0-.1-.1-.2-.2-.2s-.2 0-.2.1L7.2 12v.2c.1.1.1.1.2.1L9 12v3.8c0 .1-.2.2-.1.2h.3c.1 0 .2 0 .2-.1l2.4-5.9v-.2c-.1-.1-.2-.1-.2-.1z"></path>
			</svg>
		),
	},
	{
		id: 'video',
		caption: __( 'Video' ),
		icon: (
			<svg height="35" width="40" viewBox="0 0 16 15">
				<path d="M15.7 7.8c-.2-.1-.5 0-.6.1l-2.9 2.2c-.1.1-.1.1-.2.1V8H0v3h2v3.2c0 .4.3.8.8.8h8.4c.5 0 .8-.4.8-.8V12c0 .1.1.2.2.2l2.9 2.2c.2.2.4.2.6.1.2-.1.3-.3.3-.5V8.4c0-.2-.1-.5-.3-.6zM2.8 6.9c.3 0 .8.1 1.1.1h5.5c.3 0 .8-.1 1-.1 1.6-.3 2.8-1.7 2.8-3.4 0-1.9-1.6-3.5-3.5-3.5-1.2 0-2.4.6-3 1.7h-.1C5.9.6 4.8 0 3.6 0 1.6 0 0 1.6 0 3.5c0 1.7 1.2 3 2.8 3.4zM9 4.2c1 0 1.8-.8 1.8-1.8v-.3c.4.3.6.8.6 1.4 0 1-.8 1.8-1.8 1.8-.9 0-1.6-.6-1.8-1.5.3.3.7.4 1.2.4zm-6.2.1c1 0 1.8-.8 1.8-1.8v-.3c.4.2.6.7.6 1.3 0 1-.8 1.8-1.8 1.8-.9 0-1.6-.6-1.8-1.5.3.3.7.5 1.2.5z"></path>
			</svg>
		),
	},
];

registerPlugin( 'tumblr-theme-garden-updated-postformat-ui', {
	render: () => {
		// Create a suggestion for the post format based on the blocks in the content.
		const createSuggestion = blocks => {
			if ( blocks.length > 2 ) {
				return null;
			}

			let name;

			// If there is only one block in the content of the post grab its name
			// so we can derive a suitable post format from it.
			if ( blocks.length === 1 ) {
				name = blocks[ 0 ].name;
				// Check for core/embed `video` and `audio` eligible suggestions.
				if ( name === 'core/embed' ) {
					const provider = blocks[ 0 ].attributes?.providerNameSlug;
					if ( [ 'youtube', 'vimeo' ].includes( provider ) ) {
						name = 'core/video';
					} else if ( [ 'spotify', 'soundcloud' ].includes( provider ) ) {
						name = 'core/audio';
					}
				}
			}

			// If there are two blocks in the content and the last one is a text blocks
			// grab the name of the first one to also suggest a post format from it.
			if ( blocks.length === 2 && blocks[ 1 ].name === 'core/paragraph' ) {
				name = blocks[ 0 ].name;
			}

			// We only convert to default post formats in core.
			switch ( name ) {
				case 'core/image':
					return 'image';
				case 'core/quote':
				case 'core/pullquote':
					return 'quote';
				case 'core/gallery':
					return 'gallery';
				case 'core/video':
					return 'video';
				case 'core/audio':
					return 'audio';
				default:
					return null;
			}
		};

		// Get the `editPost` action from the `core/editor` store.
		const { editPost } = useDispatch( 'core/editor' );

		// Get the current post format from the store.
		const activeFormat = useSelect(
			select => select( 'core/editor' ).getEditedPostAttribute( 'format' ),
			[]
		);

		const blocks = useSelect( select => select( blockEditorStore ).getBlocks(), [] );

		// Get the suggestion for the post format.
		const suggestion = createSuggestion( blocks );

		// Update the post format.
		const updatePostFormat = id => {
			editPost( { format: id } );

			// Finish early if there are already blocks in the content.
			if ( blocks.length > 1 ) {
				return;
			}

			// Finish early if there is only one block in the content and it is not a paragraph.
			if ( blocks.length === 1 && blocks[ 0 ].name !== 'core/paragraph' ) {
				return;
			}

			// Insert block format based on the selected post format.
			switch ( id ) {
				case 'image':
					dispatch( 'core/block-editor' ).insertBlocks( createBlock( 'core/image' ), 0 );
					break;
				case 'quote':
					dispatch( 'core/block-editor' ).insertBlocks( createBlock( 'core/quote' ), 0 );
					break;
				case 'gallery':
					dispatch( 'core/block-editor' ).insertBlocks( createBlock( 'core/gallery' ), 0 );
					break;
				case 'video':
					dispatch( 'core/block-editor' ).insertBlocks( createBlock( 'core/video' ), 0 );
					break;
				case 'audio':
					dispatch( 'core/block-editor' ).insertBlocks( createBlock( 'core/audio' ), 0 );
					break;
				default:
					break;
			}
		};

		return (
			<PluginPostStatusInfo>
				<div className="tumblr-theme-garden-post-format-selector">
					<p>
						<strong>{ __( 'Post Formats', 'tumblr-theme-garden' ) }</strong>
					</p>

					{ POST_FORMATS.map( ( { id, caption, icon } ) => (
						<Button
							key={ id }
							onClick={ () => updatePostFormat( id ) }
							className={ `post-format-${ id } ${ id === activeFormat ? 'active' : '' }` }
							align="center"
						>
							{ icon }
							{ caption }
						</Button>
					) ) }
					<span></span>

					{ suggestion && suggestion !== activeFormat && (
						<p className="editor-post-format__suggestion">
							<Button
								__next40pxDefaultSize
								variant="link"
								onClick={ () => updatePostFormat( suggestion ) }
								style={ { width: '100%' } }
							>
								{ sprintf(
									/* translators: %s: post format */
									__( 'Apply suggested format: %s', 'tumblr-theme-garden' ),
									suggestion
								) }
							</Button>
						</p>
					) }
				</div>
			</PluginPostStatusInfo>
		);
	},
} );
