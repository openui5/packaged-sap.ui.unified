/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.unified.CalendarAppointment.
sap.ui.define(['jquery.sap.global', './DateTypeRange', 'sap/ui/core/format/DateFormat', './library'],
	function(jQuery, DateTypeRange, DateFormat, library) {
	"use strict";

	/**
	 * Constructor for a new <code>CalendarAppointment</code>.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * An appointment for use in a <code>PlanningCalendar</code> or similar. The rendering must be done in the Row collecting the appointments.
	 * (Because there are different visualizations possible.)
	 *
	 * Applications could inherit from this element to add own fields.
	 * @extends sap.ui.unified.DateTypeRange
	 * @version 1.44.35
	 *
	 * @constructor
	 * @public
	 * @since 1.34.0
	 * @alias sap.ui.unified.CalendarAppointment
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var CalendarAppointment = DateTypeRange.extend("sap.ui.unified.CalendarAppointment", /** @lends sap.ui.unified.CalendarAppointment.prototype */ { metadata : {

		library : "sap.ui.unified",
		properties : {

			/**
			 * Title of the appointment.
			 */
			title : {type : "string", group : "Data"},

			/**
			 * Text of the appointment.
			 */
			text : {type : "string", group : "Data"},

			/**
			 * Icon of the Appointment. (e.g. picture of the person)
			 *
			 * URI of an image or an icon registered in sap.ui.core.IconPool.
			 */
			icon : {type : "sap.ui.core.URI", group : "Data", defaultValue : null},

			/**
			 * Indicates if the icon is tentative.
			 */
			tentative : {type : "boolean", group : "Data", defaultValue : false},

			/**
			 * Indicates if the icon is selected.
			 */
			selected : {type : "boolean", group : "Data", defaultValue : false},

			/**
			 * Can be used as identifier of the appointment
			 */
			key : {type : "string", group : "Data", defaultValue : null}

		}
	}});

	CalendarAppointment.prototype.applyFocusInfo = function (oFocusInfo) {

		// let the parent handle the focus assignment after rerendering
		var oParent = this.getParent();

		if (oParent) {
			oParent.applyFocusInfo(oFocusInfo);
		}

		return this;

	};

	/**
	 * Gets the text for an appointment that intersects with a given date.
	 * @param {object} oCurrentlyDisplayedDate The displayed day
	 * @returns {string} A string that shows how the appointment intersects with the given date
	 * @private
	 */
	CalendarAppointment.prototype._getDateRangeIntersectionText = function (oCurrentlyDisplayedDate) {
		var oStartDate = this.getStartDate(),
			oEndDate = this.getEndDate() ? this.getEndDate() : new Date(864000000000000), //in case of emergency call this number
			sText,
			oCurrentDayStart = new Date(oCurrentlyDisplayedDate.getFullYear(), oCurrentlyDisplayedDate.getMonth(), oCurrentlyDisplayedDate.getDate(), 0, 0, 0),
			oNextDayStart = new Date(oCurrentDayStart.getTime() + 24 * 60 * 60 * 1000),
			oTimeFormat = DateFormat.getTimeInstance({pattern: "HH:mm"}),
			oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.m");

		//have no intersection with the given day
		if (oStartDate.getTime() > oNextDayStart.getTime() || oEndDate.getTime() < oCurrentDayStart.getTime()) {
			sText = "";
		} else if (oStartDate.getTime() < oCurrentDayStart.getTime() && oEndDate.getTime() > oNextDayStart.getTime()) {
			sText = oResourceBundle.getText("PLANNINGCALENDAR_ALLDAY");
		} else if (oStartDate.getTime() < oCurrentDayStart.getTime()) {
			sText = oResourceBundle.getText("PLANNINGCALENDAR_UNTIL", [oTimeFormat.format(oEndDate)]);
		} else if (oEndDate.getTime() > oNextDayStart.getTime()) {
			sText = oTimeFormat.format(oStartDate);
		} else {
			sText = oTimeFormat.format(oStartDate) + " - " + oTimeFormat.format(oEndDate);
		}

		return sText;
	};

	/**
	 * Returns a sort comparer that considers all day events, respective to a given date, the smallest.
	 * The rest sorts first by start date, then by end date.
	 * @param oDate
	 * @returns {Function}
	 * @private
	 */
	CalendarAppointment._getComparer = function(oDate) {
		var ONE_DAY = 24 * 60 * 60 * 1000,
			iCurrentDayStartTime = new Date(oDate.getFullYear(), oDate.getMonth(), oDate.getDate(), 0, 0, 0).getTime(),
			iNextDayStart = iCurrentDayStartTime + ONE_DAY;

		return function(oAppInfo1, oAppInfo2) {
			var iStartDateTime1 = oAppInfo1.appointment.getStartDate().getTime(),
				iStartDateTime2 = oAppInfo2.appointment.getStartDate().getTime(),
				iEndDateTime1 = oAppInfo1.appointment.getEndDate() ? oAppInfo1.appointment.getEndDate().getTime() : 864000000000000, //this is max date in case of no max date
				iEndDateTime2 = oAppInfo2.appointment.getEndDate() ? oAppInfo2.appointment.getEndDate().getTime() : 864000000000000,
				bWholeDay1 = iStartDateTime1 <= iCurrentDayStartTime && iEndDateTime1 >= iNextDayStart,
				bWholeDay2 = iStartDateTime2 <= iCurrentDayStartTime && iEndDateTime2 >= iNextDayStart,
				iResult;

			if ((bWholeDay1 && bWholeDay2) || (!bWholeDay1 && !bWholeDay2)) {
				iResult = iStartDateTime1 - iStartDateTime2;
				if (iResult === 0) {
					// same start date -> longest appointment should be on top
					iResult = iEndDateTime2 - iEndDateTime1;
				}
			} else if (bWholeDay1) {
				iResult =  -1;
			} else { //bWholeDay2
				iResult =  1;
			}

			return iResult;
		};
	};

	return CalendarAppointment;

}, /* bExport= */ true);
