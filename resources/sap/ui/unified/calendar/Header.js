/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

//Provides control sap.ui.unified.Calendar.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', 'sap/ui/core/LocaleData', 'sap/ui/unified/library'],
		function(jQuery, Control, LocaleData, library) {
	"use strict";

	/**
	 * Constructor for a new Header.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * renders a calendar header
	 *
	 * The calendar header consists of 3 buttons where the text can be set and a previous and a next button.
	 * In the normal calendar the first button contains the displayed day, the second button the displayed month and the third button the displayed year.
	 *
	 * <b>Note:</b> This is used inside the calendar. Not for standalone usage
	 * @extends sap.ui.core.Control
	 * @version 1.34.12
	 *
	 * @constructor
	 * @public
	 * @since 1.28.0
	 * @alias sap.ui.unified.calendar.Header
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Header = Control.extend("sap.ui.unified.calendar.Header", /** @lends sap.ui.unified.calendar.Header.prototype */ { metadata : {

		library : "sap.ui.unified",
		properties : {

			/**
			 * Text of the first button (normally day)
			 * @since 1.32.0
			 */
			textButton0 : {type : "string", group : "Appearance"},

			/**
			 * Additional text of the first button (normally day)
			 * @since 1.34.0
			 */
			additionalTextButton0 : {type : "string", group : "Appearance"},

			/**
			 * aria-label of the first button (normally day)
			 * @since 1.32.0
			 */
			ariaLabelButton0 : {type : "string", group : "Misc"},

			/**
			 * If set, the first button will be displayed
			 *
			 * <b>Note:</b> The default is set to false to be compatible to older versions
			 * @since 1.32.0
			 */
			visibleButton0 : {type : "boolean", group : "Appearance", defaultValue : false},

			/**
			 * Text of the second button (normally month)
			 */
			textButton1 : {type : "string", group : "Appearance"},

			/**
			 * Additional text of the second button (normally month)
			 * @since 1.34.0
			 */
			additionalTextButton1 : {type : "string", group : "Appearance"},

			/**
			 * aria-label of the second button (normally month)
			 */
			ariaLabelButton1 : {type : "string", group : "Misc"},

			/**
			 * If set, the second button will be displayed
			 * @since 1.32.0
			 */
			visibleButton1 : {type : "boolean", group : "Appearance", defaultValue : true},

			/**
			 * Text of the third button (normally year)
			 */
			textButton2 : {type : "string", group : "Appearance"},

			/**
			 * Additional text of the third button (normally year)
			 * @since 1.34.0
			 */
			additionalTextButton2 : {type : "string", group : "Appearance"},

			/**
			 * aria-label of the third button (normally year)
			 */
			ariaLabelButton2 : {type : "string", group : "Misc"},

			/**
			 * If set, the third button will be displayed
			 * @since 1.32.0
			 */
			visibleButton2 : {type : "boolean", group : "Appearance", defaultValue : true},

			/**
			 * Enables the previous button
			 */
			enabledPrevious : {type : "boolean", group : "Behavior", defaultValue : true},

			/**
			 * Enables the Next button
			 */
			enabledNext : {type : "boolean", group : "Behavior", defaultValue : true}

		},
		events : {

			/**
			 * Previous button pressed
			 */
			pressPrevious : {},

			/**
			 * Next button pressed
			 */
			pressNext : {},

			/**
			 * First button pressed (normally day)
			 * @since 1.32.0
			 */
			pressButton0 : {},

			/**
			 * Second button pressed (normally month)
			 */
			pressButton1 : {},

			/**
			 * Third button pressed (normally year)
			 */
			pressButton2 : {}

		}
	}});

	Header.prototype.setTextButton0 = function(sText){

		_setText.call(this, 0, sText);

		return this;

	};

	Header.prototype.setAdditionalTextButton0 = function(sText){

		_setAdditionalText.call(this, 0, sText);

		return this;

	};

	Header.prototype.setAriaLabelButton0 = function(sText){

		_setAriaLabel.call(this, 0, sText);

		return this;

	};

	Header.prototype.setTextButton1 = function(sText){

		_setText.call(this, 1, sText);

		return this;

	};

	Header.prototype.setAdditionalTextButton1 = function(sText){

		_setAdditionalText.call(this, 1, sText);

		return this;

	};

	Header.prototype.setAriaLabelButton1 = function(sText){

		_setAriaLabel.call(this, 1, sText);

		return this;

	};

	Header.prototype.setTextButton2 = function(sText){

		_setText.call(this, 2, sText);

		return this;

	};

	Header.prototype.setAdditionalTextButton2 = function(sText){

		_setAdditionalText.call(this, 2, sText);

		return this;

	};

	Header.prototype.setAriaLabelButton2 = function(sText){

		_setAriaLabel.call(this, 2, sText);

		return this;

	};

	Header.prototype.setEnabledPrevious = function(bEnabled){

		this.setProperty("enabledPrevious", bEnabled, true);

		if (this.getDomRef()) {
			if (bEnabled) {
				this.$("prev").toggleClass("sapUiCalDsbl", false).removeAttr("disabled");
			}else {
				this.$("prev").toggleClass("sapUiCalDsbl", true).attr("disabled", "disabled");
			}
		}

		return this;

	};

	Header.prototype.setEnabledNext = function(bEnabled){

		this.setProperty("enabledNext", bEnabled, true);

		if (this.getDomRef()) {
			if (bEnabled) {
				this.$("next").toggleClass("sapUiCalDsbl", false).removeAttr("disabled");
			}else {
				this.$("next").toggleClass("sapUiCalDsbl", true).attr("disabled", "disabled");
			}
		}

		return this;

	};

	Header.prototype.onclick = function(oEvent){

		if (oEvent.isMarked("delayedMouseEvent") ) {
			return;
		}

		if (jQuery.sap.containsOrEquals(this.getDomRef("prev"), oEvent.target) && this.getEnabledPrevious()) {
			this.firePressPrevious();
		} else if (jQuery.sap.containsOrEquals(this.getDomRef("next"), oEvent.target) && this.getEnabledNext()){
			this.firePressNext();
		} else if (jQuery.sap.containsOrEquals(this.getDomRef("B0"), oEvent.target)){
			this.firePressButton0();
		} else if (jQuery.sap.containsOrEquals(this.getDomRef("B1"), oEvent.target)){
			this.firePressButton1();
		} else if (jQuery.sap.containsOrEquals(this.getDomRef("B2"), oEvent.target)){
			this.firePressButton2();
		}

	};

	Header.prototype.onsapnext = function(oEvent){

		//prevent browser scrolling
		oEvent.preventDefault();

	};

	function _setText(iButton, sText){

		this.setProperty("textButton" + iButton, sText, true);

		if (this.getDomRef() && this["getVisibleButton" + iButton]()) {
			if (this.$("B" + iButton + "-Text").get(0)) {
				this.$("B" + iButton + "-Text").text(sText);
			} else {
				this.$("B" + iButton).text(sText);
			}
		}

	}

	function _setAdditionalText(iButton, sText){

		var bRerender = false;
		var sOldText = this["getAdditionalTextButton" + iButton]();

		if (sOldText == sText) {
			return;
		}

		if ((!sOldText && sText) || (sOldText && !sText)) {
			bRerender = true;
		}

		this.setProperty("additionalTextButton" + iButton, sText, !bRerender);

		if (!bRerender && this.getDomRef() && this["getVisibleButton" + iButton]()) {
			this.$("B" + iButton + "-AddText").text(sText);
		}

	}

	function _setAriaLabel(iButton, sText){

		this.setProperty("ariaLabelButton" + iButton, sText, true);

		if (this.getDomRef() && this["getVisibleButton" + iButton]()) {
			if (sText) {
				this.$("B" + iButton).attr("aria-label", sText);
			} else {
				this.$("B" + iButton).removeAttr("aria-label");
			}
		}

	}

	return Header;

}, /* bExport= */ true);
