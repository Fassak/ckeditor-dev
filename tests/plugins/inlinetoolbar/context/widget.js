/* bender-tags: inlinetoolbar,context */
/* bender-ckeditor-plugins: inlinetoolbar,button,widget */
/* bender-include: ../../widget/_helpers/tools.js */
/* global widgetTestsTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			extraAllowedContent: 'div[*];strong'
		}
	};

	bender.test( {
		tearDown: function() {
			this.editor.inlineToolbar._manager._clear();
		},

		'test simple positive matching with one item': function() {
			var editor = this.editor,
				context = this._getContextStub( [ 'positive' ] );

			editor.widgets.add( 'positive' );

			this.editorBot.setData(
				'<p>foo</p><div data-widget="positive" id="w1">foo</div></p>',
				function() {
					var widget = widgetTestsTools.getWidgetById( editor, 'w1' );

					widget.focus();

					this._assertToolbarVisible( true, context );
				} );
		},

		'test simple positive matching with multiple items': function() {
			var editor = this.editor,
				context = this._getContextStub( [ 'foo', 'bar', 'baz' ] );

			editor.widgets.add( 'bar' );

			this.editorBot.setData(
				CKEDITOR.document.getById( 'simpleWidget' ).getHtml(),
				function() {
					var widget = widgetTestsTools.getWidgetById( editor, 'w1' );

					widget.focus();

					this._assertToolbarVisible( true, context );
				} );
		},

		'test simple mismatching with few items': function() {
			var editor = this.editor,
				context = this._getContextStub( [ 'foo', 'bar', 'baz', 'nega', 'negative-postfix' ] );

			editor.widgets.add( 'negative' );

			this.editorBot.setData(
				'<p>foo</p><div data-widget="negative" id="w1">foo</div></p>',
				function() {
					var widget = widgetTestsTools.getWidgetById( editor, 'w1' );

					widget.focus();

					this._assertToolbarVisible( false, context );
				} );
		},

		'test matching with options.widgets as a string': function() {
			var editor = this.editor,
				context = this._getContextStub( 'foo,bar,baz' );

			editor.widgets.add( 'bar' );

			this.editorBot.setData(
				CKEDITOR.document.getById( 'simpleWidget' ).getHtml(),
				function() {
					var widget = widgetTestsTools.getWidgetById( editor, 'w1' );

					widget.focus();

					this._assertToolbarVisible( true, context );
				} );
		},

		'test negation with options.widgets as a string': function() {
			var editor = this.editor,
				context = this._getContextStub( 'foo,zbarz,baz' );

			editor.widgets.add( 'bar' );

			this.editorBot.setData(
				CKEDITOR.document.getById( 'simpleWidget' ).getHtml(),
				function() {
					var widget = widgetTestsTools.getWidgetById( editor, 'w1' );

					widget.focus();

					this._assertToolbarVisible( false, context );
				} );
		},

		'test widget selector does not trigger in nested editable': function() {
			var editor = this.editor,
				context = this._getContextStub( 'widgetWithEditable' );

			editor.widgets.add( 'widgetWithEditable', {
				editables: {
					area: 'div.area'
				}
			} );

			this.editorBot.setData(
				CKEDITOR.document.getById( 'withCaption' ).getHtml(),
				function() {
					this.editor.getSelection().selectElement( this.editor.editable().findOne( 'strong' ) );

					this._assertToolbarVisible( false, context );
				} );
		},

		'test widget toolbar points to a proper element': function() {
			// Toolbar matched to a widget, should point to a widget element.
			var editor = this.editor,
				context = this._getContextStub( [ 'pointing' ] );

			editor.widgets.add( 'pointing' );

			this.editorBot.setData(
				'<p>foo</p><div data-widget="pointing" id="w1">foo</div></p>',
				function() {
					var widget = widgetTestsTools.getWidgetById( editor, 'w1' );

					sinon.stub( context, 'show' );

					widget.focus();

					sinon.assert.calledWithExactly( context.show, widget.element );
					assert.isTrue( true );
				} );
		},

		/*
		 * Returns a Context instance with toolbar show/hide methods stubbed.
		 *
		 * @param {String[]} widgetNames List of widget names to be set as `options.widgets`.
		 * @returns {CKEDITOR.plugins.inlinetoolbar.context}
		 */
		_getContextStub: function( widgetNames ) {
			return this.editor.inlineToolbar.create( {
				widgets: widgetNames
			} );
		},

		/*
		 * @param {Boolean} expected What's the expected visibility? If `true` toolbar must be visible.
		 */
		_assertToolbarVisible: function( expected, context, msg ) {
			assert.areSame( expected, context.toolbar._view.parts.panel.isVisible(), msg || 'Toolbar visibility' );
		}
	} );
} )();
