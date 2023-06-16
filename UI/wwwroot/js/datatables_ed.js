/*! DataTables 1.13.1
 * ©2008-2022 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     DataTables
 * @description Paginate, search and order HTML tables
 * @version     1.13.1
 * @author      SpryMedia Ltd
 * @contact     www.datatables.net
 * @copyright   SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

/*jslint evil: true, undef: true, browser: true */
/*globals $,require,jQuery,define,_selector_run,_selector_opts,_selector_first,_selector_row_indexes,_ext,_Api,_api_register,_api_registerPlural,_re_new_lines,_re_html,_re_formatted_numeric,_re_escape_regex,_empty,_intVal,_numToDecimal,_isNumber,_isHtml,_htmlNumeric,_pluck,_pluck_order,_range,_stripHtml,_unique,_fnBuildAjax,_fnAjaxUpdate,_fnAjaxParameters,_fnAjaxUpdateDraw,_fnAjaxDataSrc,_fnAddColumn,_fnColumnOptions,_fnAdjustColumnSizing,_fnVisibleToColumnIndex,_fnColumnIndexToVisible,_fnVisbleColumns,_fnGetColumns,_fnColumnTypes,_fnApplyColumnDefs,_fnHungarianMap,_fnCamelToHungarian,_fnLanguageCompat,_fnBrowserDetect,_fnAddData,_fnAddTr,_fnNodeToDataIndex,_fnNodeToColumnIndex,_fnGetCellData,_fnSetCellData,_fnSplitObjNotation,_fnGetObjectDataFn,_fnSetObjectDataFn,_fnGetDataMaster,_fnClearTable,_fnDeleteIndex,_fnInvalidate,_fnGetRowElements,_fnCreateTr,_fnBuildHead,_fnDrawHead,_fnDraw,_fnReDraw,_fnAddOptionsHtml,_fnDetectHeader,_fnGetUniqueThs,_fnFeatureHtmlFilter,_fnFilterComplete,_fnFilterCustom,_fnFilterColumn,_fnFilter,_fnFilterCreateSearch,_fnEscapeRegex,_fnFilterData,_fnFeatureHtmlInfo,_fnUpdateInfo,_fnInfoMacros,_fnInitialise,_fnInitComplete,_fnLengthChange,_fnFeatureHtmlLength,_fnFeatureHtmlPaginate,_fnPageChange,_fnFeatureHtmlProcessing,_fnProcessingDisplay,_fnFeatureHtmlTable,_fnScrollDraw,_fnApplyToChildren,_fnCalculateColumnWidths,_fnThrottle,_fnConvertToWidth,_fnGetWidestNode,_fnGetMaxLenString,_fnStringToCss,_fnSortFlatten,_fnSort,_fnSortAria,_fnSortListener,_fnSortAttachListener,_fnSortingClasses,_fnSortData,_fnSaveState,_fnLoadState,_fnSettingsFromNode,_fnLog,_fnMap,_fnBindAction,_fnCallbackReg,_fnCallbackFire,_fnLengthOverflow,_fnRenderer,_fnDataSource,_fnRowAttributes*/

(function (factory) {
	"use strict";

	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], function ($) {
			return factory($, window, document);
		});
	}
	else if (typeof exports === 'object') {
		// CommonJS
		module.exports = function (root, $) {
			if (!root) {
				// CommonJS environments without a window global must pass a
				// root. This will give an error otherwise
				root = window;
			}

			if (!$) {
				$ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window
					require('jquery') :
					require('jquery')(root);
			}

			return factory($, root, root.document);
		};
	}
	else {
		// Browser
		window.DataTable = factory(jQuery, window, document);
	}
}
	(function ($, window, document, undefined) {
		"use strict";


		var DataTable = function (selector, options) {
			// When creating with `new`, create a new DataTable, returning the API instance
			if (this instanceof DataTable) {
				return $(selector).DataTable(options);
			}
			else {
				// Argument switching
				options = selector;
			}

			/**
			 * Perform a jQuery selector action on the table's TR elements (from the tbody) and
			 * return the resulting jQuery object.
			 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
			 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
			 *  @param {string} [oOpts.filter=none] Select TR elements that meet the current filter
			 *    criterion ("applied") or all TR elements (i.e. no filter).
			 *  @param {string} [oOpts.order=current] Order of the TR elements in the processed array.
			 *    Can be either 'current', whereby the current sorting of the table is used, or
			 *    'original' whereby the original order the data was read into the table is used.
			 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
			 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
			 *    'current' and filter is 'applied', regardless of what they might be given as.
			 *  @returns {object} jQuery object, filtered by the given selector.
			 *  @dtopt API
			 *  @deprecated Since v1.10
			 *
			 *  @example
			 *    $(document).ready(function() {
			 *      var oTable = $('#example').dataTable();
			 *
			 *      // Highlight every second row
			 *      oTable.$('tr:odd').css('backgroundColor', 'blue');
			 *    } );
			 *
			 *  @example
			 *    $(document).ready(function() {
			 *      var oTable = $('#example').dataTable();
			 *
			 *      // Filter to rows with 'Webkit' in them, add a background colour and then
			 *      // remove the filter, thus highlighting the 'Webkit' rows only.
			 *      oTable.fnFilter('Webkit');
			 *      oTable.$('tr', {"search": "applied"}).css('backgroundColor', 'blue');
			 *      oTable.fnFilter('');
			 *    } );
			 */
			this.$ = function (sSelector, oOpts) {
				return this.api(true).$(sSelector, oOpts);
			};


			/**
			 * Almost identical to $ in operation, but in this case returns the data for the matched
			 * rows - as such, the jQuery selector used should match TR row nodes or TD/TH cell nodes
			 * rather than any descendants, so the data can be obtained for the row/cell. If matching
			 * rows are found, the data returned is the original data array/object that was used to
			 * create the row (or a generated array if from a DOM source).
			 *
			 * This method is often useful in-combination with $ where both functions are given the
			 * same parameters and the array indexes will match identically.
			 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
			 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
			 *  @param {string} [oOpts.filter=none] Select elements that meet the current filter
			 *    criterion ("applied") or all elements (i.e. no filter).
			 *  @param {string} [oOpts.order=current] Order of the data in the processed array.
			 *    Can be either 'current', whereby the current sorting of the table is used, or
			 *    'original' whereby the original order the data was read into the table is used.
			 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
			 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
			 *    'current' and filter is 'applied', regardless of what they might be given as.
			 *  @returns {array} Data for the matched elements. If any elements, as a result of the
			 *    selector, were not TR, TD or TH elements in the DataTable, they will have a null
			 *    entry in the array.
			 *  @dtopt API
			 *  @deprecated Since v1.10
			 *
			 *  @example
			 *    $(document).ready(function() {
			 *      var oTable = $('#example').dataTable();
			 *
			 *      // Get the data from the first row in the table
			 *      var data = oTable._('tr:first');
			 *
			 *      // Do something useful with the data
			 *      alert( "First cell is: "+data[0] );
			 *    } );
			 *
			 *  @example
			 *    $(document).ready(function() {
			 *      var oTable = $('#example').dataTable();
			 *
			 *      // Filter to 'Webkit' and get all data for
			 *      oTable.fnFilter('Webkit');
			 *      var data = oTable._('tr', {"search": "applied"});
			 *
			 *      // Do something with the data
			 *      alert( data.length+" rows matched the search" );
			 *    } );
			 */
			this._ = function (sSelector, oOpts) {
				return this.api(true).rows(sSelector, oOpts).data();
			};


			/**
			 * Create a DataTables Api instance, with the currently selected tables for
			 * the Api's context.
			 * @param {boolean} [traditional=false] Set the API instance's context to be
			 *   only the table referred to by the `DataTable.ext.iApiIndex` option, as was
			 *   used in the API presented by DataTables 1.9- (i.e. the traditional mode),
			 *   or if all tables captured in the jQuery object should be used.
			 * @return {DataTables.Api}
			 */
			this.api = function (traditional) {
				return traditional ?
					new _Api(
						_fnSettingsFromNode(this[_ext.iApiIndex])
					) :
					new _Api(this);
			};


			/**
			 * Add a single new row or multiple rows of data to the table. Please note
			 * that this is suitable for client-side processing only - if you are using
			 * server-side processing (i.e. "bServerSide": true), then to add data, you
			 * must add it to the data source, i.e. the server-side, through an Ajax call.
			 *  @param {array|object} data The data to be added to the table. This can be:
			 *    <ul>
			 *      <li>1D array of data - add a single row with the data provided</li>
			 *      <li>2D array of arrays - add multiple rows in a single call</li>
			 *      <li>object - data object when using <i>mData</i></li>
			 *      <li>array of objects - multiple data objects when using <i>mData</i></li>
			 *    </ul>
			 *  @param {bool} [redraw=true] redraw the table or not
			 *  @returns {array} An array of integers, representing the list of indexes in
			 *    <i>aoData</i> ({@link DataTable.models.oSettings}) that have been added to
			 *    the table.
			 *  @dtopt API
			 *  @deprecated Since v1.10
			 *
			 *  @example
			 *    // Global var for counter
			 *    var giCount = 2;
			 *
			 *    $(document).ready(function() {
			 *      $('#example').dataTable();
			 *    } );
			 *
			 *    function fnClickAddRow() {
			 *      $('#example').dataTable().fnAddData( [
			 *        giCount+".1",
			 *        giCount+".2",
			 *        giCount+".3",
			 *        giCount+".4" ]
			 *      );
			 *
			 *      giCount++;
			 *    }
			 */
			this.fnAddData = function (data, redraw) {
				var api = this.api(true);

				/* Check if we want to add multiple rows or not */
				var rows = Array.isArray(data) && (Array.isArray(data[0]) || $.isPlainObject(data[0])) ?
					api.rows.add(data) :
					api.row.add(data);

				if (redraw === undefined || redraw) {
					api.draw();
				}

				return rows.flatten().toArray();
			};


			/**
			 * This function will make DataTables recalculate the column sizes, based on the data
			 * contained in the table and the sizes applied to the columns (in the DOM, CSS or
			 * through the sWidth parameter). This can be useful when the width of the table's
			 * parent element changes (for example a window resize).
			 *  @param {boolean} [bRedraw=true] Redraw the table or not, you will typically want to
			 *  @dtopt API
			 *  @deprecated Since v1.10
			 *
			 *  @example
			 *    $(document).ready(function() {
			 *      var oTable = $('#example').dataTable( {
			 *        "sScrollY": "200px",
			 *        "bPaginate": false
			 *      } );
			 *
			 *      $(window).on('resize', function () {
			 *        oTable.fnAdjustColumnSizing();
			 *      } );
			 *    } );
			 */
			this.fnAdjustColumnSizing = function (bRedraw) {
				var api = this.api(true).columns.adjust();
				var settings = api.settings()[0];
				var scroll = settings.oScroll;

				if (bRedraw === undefined || bRedraw) {
					api.draw(false);
				}
				else if (scroll.sX !== "" || scroll.sY !== "") {
					/* If not redrawing, but scrolling, we want to apply the new column sizes anyway */
					_fnScrollDraw(settings);
				}
			};


			/**
			 * Quickly and simply clear a table
			 *  @param {bool} [bRedraw=true] redraw the table or not
			 *  @dtopt API
			 *  @deprecated Since v1.10
			 *
			 *  @example
			 *    $(document).ready(function() {
			 *      var oTable = $('#example').dataTable();
			 *
			 *      // Immediately 'nuke' the current rows (perhaps waiting for an Ajax callback...)
			 *      oTable.fnClearTable();
			 *    } );
			 */
			this.fnClearTable = function (bRedraw) {
				var api = this.api(true).clear();

				if (bRedraw === undefined || bRedraw) {
					api.draw();
				}
			};


			/**
			 * The exact opposite of 'opening' a row, this function will close any rows which
			 * are currently 'open'.
			 *  @param {node} nTr the table row to 'close'
			 *  @returns {int} 0 on success, or 1 if failed (can't find the row)
			 *  @dtopt API
			 *  @deprecated Since v1.10
			 *
			 *  @example
			 *    $(document).ready(function() {
			 *      var oTable;
			 *
			 *      // 'open' an information row when a row is clicked on
			 *      $('#example tbody tr').click( function () {
			 *        if ( oTable.fnIsOpen(this) ) {
			 *          oTable.fnClose( this );
			 *        } else {
			 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
			 *        }
			 *      } );
			 *
			 *      oTable = $('#example').dataTable();
			 *    } );
			 */
			this.fnClose = function (nTr) {
				this.api(true).row(nTr).child.hide();
			};


			/**
			 * Remove a row for the table
			 *  @param {mixed} target The index of the row from aoData to be deleted, or
			 *    the TR element you want to delete
			 *  @param {function|null} [callBack] Callback function
			 *  @param {bool} [redraw=true] Redraw the table or not
			 *  @returns {array} The row that was deleted
			 *  @dtopt API
			 *  @deprecated Since v1.10
			 *
			 *  @example
			 *    $(document).ready(function() {
			 *      var oTable = $('#example').dataTable();
			 *
			 *      // Immediately remove the first row
			 *      oTable.fnDeleteRow( 0 );
			 *    } );
			 */
			this.fnDeleteRow = function (target, callback, redraw) {
				var api = this.api(true);
				var rows = api.rows(target);
				var settings = rows.settings()[0];
				var data = settings.aoData[rows[0][0]];

				rows.remove();

				if (callback) {
					callback.call(this, settings, data);
				}

				if (redraw === undefined || redraw) {
					api.draw();
				}

				return data;
			};


			/**
			 * Restore the table to it's original state in the DOM by removing all of DataTables
			 * enhancements, alterations to the DOM structure of the table and event listeners.
			 *  @param {boolean} [remove=false] Completely remove the table from the DOM
			 *  @dtopt API
			 *  @deprecated Since v1.10
			 *
			 *  @example
			 *    $(document).ready(function() {
			 *      // This example is fairly pointless in reality, but shows how fnDestroy can be used
			 *      var oTable = $('#example').dataTable();
			 *      oTable.fnDestroy();
			 *    } );
			 */
			this.fnDestroy = function (remove) {
				this.api(true).destroy(remove);
			};


			/**
			 * Redraw the table
			 *  @param {bool} [complete=true] Re-filter and resort (if enabled) the table before the draw.
			 *  @dtopt API
			 *  @deprecated Since v1.10
			 *
			 *  @example
			 *    $(document).ready(function() {
			 *      var oTable = $('#example').dataTable();
			 *
			 *      // Re-draw the table - you wouldn't want to do it here, but it's an example :-)
			 *      oTable.fnDraw();
			 *    } );
			 */
			this.fnDraw = function (complete) {
				// Note that this isn't an exact match to the old call to _fnDraw - it takes
				// into account the new data, but can hold position.
				this.api(true).draw(complete);
			};


			/**
			 * Filter the input based on data
			 *  @param {string} sInput String to filter the table on
			 *  @param {int|null} [iColumn] Column to limit filtering to
			 *  @param {bool} [bRegex=false] Treat as regular expression or not
			 *  @param {bool} [bSmart=true] Perform smart filtering or not
			 *  @param {bool} [bShowGlobal=true] Show the input global filter in it's input box(es)
			 *  @param {bool} [bCaseInsensitive=true] Do case-insensitive matching (true) or not (false)
			 *  @dtopt API
			 *  @deprecated Since v1.10
			 *
			 *  @example
			 *    $(document).ready(function() {
			 *      var oTable = $('#example').dataTable();
			 *
			 *      // Sometime later - filter...
			 *      oTable.fnFilter( 'test string' );
			 *    } );
			 */
			this.fnFilter = function (sInput, iColumn, bRegex, bSmart, bShowGlobal, bCaseInsensitive) {
				var api = this.api(true);

				if (iColumn === null || iColumn === undefined) {
					api.search(sInput, bRegex, bSmart, bCaseInsensitive);
				}
				else {
					api.column(iColumn).search(sInput, bRegex, bSmart, bCaseInsensitive);
				}

				api.draw();
			};


			/**
			 * Get the data for the whole table, an individual row or an individual cell based on the
			 * provided parameters.
			 *  @param {int|node} [src] A TR row node, TD/TH cell node or an integer. If given as
			 *    a TR node then the data source for the whole row will be returned. If given as a
			 *    TD/TH cell node then iCol will be automatically calculated and the data for the
			 *    cell returned. If given as an integer, then this is treated as the aoData internal
			 *    data index for the row (see fnGetPosition) and the data for that row used.
			 *  @param {int} [col] Optional column index that you want the data of.
			 *  @returns {array|object|string} If mRow is undefined, then the data for all rows is
			 *    returned. If mRow is defined, just data for that row, and is iCol is
			 *    defined, only data for the designated cell is returned.
			 *  @dtopt API
			 *  @deprecated Since v1.10
			 *
			 *  @example
			 *    // Row data
			 *    $(document).ready(function() {
			 *      oTable = $('#example').dataTable();
			 *
			 *      oTable.$('tr').click( function () {
			 *        var data = oTable.fnGetData( this );
			 *        // ... do something with the array / object of data for the row
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Individual cell data
			 *    $(document).ready(function() {
			 *      oTable = $('#example').dataTable();
			 *
			 *      oTable.$('td').click( function () {
			 *        var sData = oTable.fnGetData( this );
			 *        alert( 'The cell clicked on had the value of '+sData );
			 *      } );
			 *    } );
			 */
			this.fnGetData = function (src, col) {
				var api = this.api(true);

				if (src !== undefined) {
					var type = src.nodeName ? src.nodeName.toLowerCase() : '';

					return col !== undefined || type == 'td' || type == 'th' ?
						api.cell(src, col).data() :
						api.row(src).data() || null;
				}

				return api.data().toArray();
			};


			/**
			 * Get an array of the TR nodes that are used in the table's body. Note that you will
			 * typically want to use the '$' API method in preference to this as it is more
			 * flexible.
			 *  @param {int} [iRow] Optional row index for the TR element you want
			 *  @returns {array|node} If iRow is undefined, returns an array of all TR elements
			 *    in the table's body, or iRow is defined, just the TR element requested.
			 *  @dtopt API
			 *  @deprecated Since v1.10
			 *
			 *  @example
			 *    $(document).ready(function() {
			 *      var oTable = $('#example').dataTable();
			 *
			 *      // Get the nodes from the table
			 *      var nNodes = oTable.fnGetNodes( );
			 *    } );
			 */
			this.fnGetNodes = function (iRow) {
				var api = this.api(true);

				return iRow !== undefined ?
					api.row(iRow).node() :
					api.rows().nodes().flatten().toArray();
			};


			/**
			 * Get the array indexes of a particular cell from it's DOM element
			 * and column index including hidden columns
			 *  @param {node} node this can either be a TR, TD or TH in the table's body
			 *  @returns {int} If nNode is given as a TR, then a single index is returned, or
			 *    if given as a cell, an array of [row index, column index (visible),
			 *    column index (all)] is given.
			 *  @dtopt API
			 *  @deprecated Since v1.10
			 *
			 *  @example
			 *    $(document).ready(function() {
			 *      $('#example tbody td').click( function () {
			 *        // Get the position of the current data from the node
			 *        var aPos = oTable.fnGetPosition( this );
			 *
			 *        // Get the data array for this row
			 *        var aData = oTable.fnGetData( aPos[0] );
			 *
			 *        // Update the data array and return the value
			 *        aData[ aPos[1] ] = 'clicked';
			 *        this.innerHTML = 'clicked';
			 *      } );
			 *
			 *      // Init DataTables
			 *      oTable = $('#example').dataTable();
			 *    } );
			 */
			this.fnGetPosition = function (node) {
				var api = this.api(true);
				var nodeName = node.nodeName.toUpperCase();

				if (nodeName == 'TR') {
					return api.row(node).index();
				}
				else if (nodeName == 'TD' || nodeName == 'TH') {
					var cell = api.cell(node).index();

					return [
						cell.row,
						cell.columnVisible,
						cell.column
					];
				}
				return null;
			};


			/**
			 * Check to see if a row is 'open' or not.
			 *  @param {node} nTr the table row to check
			 *  @returns {boolean} true if the row is currently open, false otherwise
			 *  @dtopt API
			 *  @deprecated Since v1.10
			 *
			 *  @example
			 *    $(document).ready(function() {
			 *      var oTable;
			 *
			 *      // 'open' an information row when a row is clicked on
			 *      $('#example tbody tr').click( function () {
			 *        if ( oTable.fnIsOpen(this) ) {
			 *          oTable.fnClose( this );
			 *        } else {
			 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
			 *        }
			 *      } );
			 *
			 *      oTable = $('#example').dataTable();
			 *    } );
			 */
			this.fnIsOpen = function (nTr) {
				return this.api(true).row(nTr).child.isShown();
			};


			/**
			 * This function will place a new row directly after a row which is currently
			 * on display on the page, with the HTML contents that is passed into the
			 * function. This can be used, for example, to ask for confirmation that a
			 * particular record should be deleted.
			 *  @param {node} nTr The table row to 'open'
			 *  @param {string|node|jQuery} mHtml The HTML to put into the row
			 *  @param {string} sClass Class to give the new TD cell
			 *  @returns {node} The row opened. Note that if the table row passed in as the
			 *    first parameter, is not found in the table, this method will silently
			 *    return.
			 *  @dtopt API
			 *  @deprecated Since v1.10
			 *
			 *  @example
			 *    $(document).ready(function() {
			 *      var oTable;
			 *
			 *      // 'open' an information row when a row is clicked on
			 *      $('#example tbody tr').click( function () {
			 *        if ( oTable.fnIsOpen(this) ) {
			 *          oTable.fnClose( this );
			 *        } else {
			 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
			 *        }
			 *      } );
			 *
			 *      oTable = $('#example').dataTable();
			 *    } );
			 */
			this.fnOpen = function (nTr, mHtml, sClass) {
				return this.api(true)
					.row(nTr)
					.child(mHtml, sClass)
					.show()
					.child()[0];
			};


			/**
			 * Change the pagination - provides the internal logic for pagination in a simple API
			 * function. With this function you can have a DataTables table go to the next,
			 * previous, first or last pages.
			 *  @param {string|int} mAction Paging action to take: "first", "previous", "next" or "last"
			 *    or page number to jump to (integer), note that page 0 is the first page.
			 *  @param {bool} [bRedraw=true] Redraw the table or not
			 *  @dtopt API
			 *  @deprecated Since v1.10
			 *
			 *  @example
			 *    $(document).ready(function() {
			 *      var oTable = $('#example').dataTable();
			 *      oTable.fnPageChange( 'next' );
			 *    } );
			 */
			this.fnPageChange = function (mAction, bRedraw) {
				var api = this.api(true).page(mAction);

				if (bRedraw === undefined || bRedraw) {
					api.draw(false);
				}
			};


			/**
			 * Show a particular column
			 *  @param {int} iCol The column whose display should be changed
			 *  @param {bool} bShow Show (true) or hide (false) the column
			 *  @param {bool} [bRedraw=true] Redraw the table or not
			 *  @dtopt API
			 *  @deprecated Since v1.10
			 *
			 *  @example
			 *    $(document).ready(function() {
			 *      var oTable = $('#example').dataTable();
			 *
			 *      // Hide the second column after initialisation
			 *      oTable.fnSetColumnVis( 1, false );
			 *    } );
			 */
			this.fnSetColumnVis = function (iCol, bShow, bRedraw) {
				var api = this.api(true).column(iCol).visible(bShow);

				if (bRedraw === undefined || bRedraw) {
					api.columns.adjust().draw();
				}
			};


			/**
			 * Get the settings for a particular table for external manipulation
			 *  @returns {object} DataTables settings object. See
			 *    {@link DataTable.models.oSettings}
			 *  @dtopt API
			 *  @deprecated Since v1.10
			 *
			 *  @example
			 *    $(document).ready(function() {
			 *      var oTable = $('#example').dataTable();
			 *      var oSettings = oTable.fnSettings();
			 *
			 *      // Show an example parameter from the settings
			 *      alert( oSettings._iDisplayStart );
			 *    } );
			 */
			this.fnSettings = function () {
				return _fnSettingsFromNode(this[_ext.iApiIndex]);
			};


			/**
			 * Sort the table by a particular column
			 *  @param {int} iCol the data index to sort on. Note that this will not match the
			 *    'display index' if you have hidden data entries
			 *  @dtopt API
			 *  @deprecated Since v1.10
			 *
			 *  @example
			 *    $(document).ready(function() {
			 *      var oTable = $('#example').dataTable();
			 *
			 *      // Sort immediately with columns 0 and 1
			 *      oTable.fnSort( [ [0,'asc'], [1,'asc'] ] );
			 *    } );
			 */
			this.fnSort = function (aaSort) {
				this.api(true).order(aaSort).draw();
			};


			/**
			 * Attach a sort listener to an element for a given column
			 *  @param {node} nNode the element to attach the sort listener to
			 *  @param {int} iColumn the column that a click on this node will sort on
			 *  @param {function} [fnCallback] callback function when sort is run
			 *  @dtopt API
			 *  @deprecated Since v1.10
			 *
			 *  @example
			 *    $(document).ready(function() {
			 *      var oTable = $('#example').dataTable();
			 *
			 *      // Sort on column 1, when 'sorter' is clicked on
			 *      oTable.fnSortListener( document.getElementById('sorter'), 1 );
			 *    } );
			 */
			this.fnSortListener = function (nNode, iColumn, fnCallback) {
				this.api(true).order.listener(nNode, iColumn, fnCallback);
			};


			/**
			 * Update a table cell or row - this method will accept either a single value to
			 * update the cell with, an array of values with one element for each column or
			 * an object in the same format as the original data source. The function is
			 * self-referencing in order to make the multi column updates easier.
			 *  @param {object|array|string} mData Data to update the cell/row with
			 *  @param {node|int} mRow TR element you want to update or the aoData index
			 *  @param {int} [iColumn] The column to update, give as null or undefined to
			 *    update a whole row.
			 *  @param {bool} [bRedraw=true] Redraw the table or not
			 *  @param {bool} [bAction=true] Perform pre-draw actions or not
			 *  @returns {int} 0 on success, 1 on error
			 *  @dtopt API
			 *  @deprecated Since v1.10
			 *
			 *  @example
			 *    $(document).ready(function() {
			 *      var oTable = $('#example').dataTable();
			 *      oTable.fnUpdate( 'Example update', 0, 0 ); // Single cell
			 *      oTable.fnUpdate( ['a', 'b', 'c', 'd', 'e'], $('tbody tr')[0] ); // Row
			 *    } );
			 */
			this.fnUpdate = function (mData, mRow, iColumn, bRedraw, bAction) {
				var api = this.api(true);

				if (iColumn === undefined || iColumn === null) {
					api.row(mRow).data(mData);
				}
				else {
					api.cell(mRow, iColumn).data(mData);
				}

				if (bAction === undefined || bAction) {
					api.columns.adjust();
				}

				if (bRedraw === undefined || bRedraw) {
					api.draw();
				}
				return 0;
			};


			/**
			 * Provide a common method for plug-ins to check the version of DataTables being used, in order
			 * to ensure compatibility.
			 *  @param {string} sVersion Version string to check for, in the format "X.Y.Z". Note that the
			 *    formats "X" and "X.Y" are also acceptable.
			 *  @returns {boolean} true if this version of DataTables is greater or equal to the required
			 *    version, or false if this version of DataTales is not suitable
			 *  @method
			 *  @dtopt API
			 *  @deprecated Since v1.10
			 *
			 *  @example
			 *    $(document).ready(function() {
			 *      var oTable = $('#example').dataTable();
			 *      alert( oTable.fnVersionCheck( '1.9.0' ) );
			 *    } );
			 */
			this.fnVersionCheck = _ext.fnVersionCheck;


			var _that = this;
			var emptyInit = options === undefined;
			var len = this.length;

			if (emptyInit) {
				options = {};
			}

			this.oApi = this.internal = _ext.internal;

			// Extend with old style plug-in API methods
			for (var fn in DataTable.ext.internal) {
				if (fn) {
					this[fn] = _fnExternApiFunc(fn);
				}
			}

			this.each(function () {
				// For each initialisation we want to give it a clean initialisation
				// object that can be bashed around
				var o = {};
				var oInit = len > 1 ? // optimisation for single table case
					_fnExtend(o, options, true) :
					options;

				/*global oInit,_that,emptyInit*/
				var i = 0, iLen, j, jLen, k, kLen;
				var sId = this.getAttribute('id');
				var bInitHandedOff = false;
				var defaults = DataTable.defaults;
				var $this = $(this);


				/* Sanity check */
				if (this.nodeName.toLowerCase() != 'table') {
					_fnLog(null, 0, 'Non-table node initialisation (' + this.nodeName + ')', 2);
					return;
				}

				/* Backwards compatibility for the defaults */
				_fnCompatOpts(defaults);
				_fnCompatCols(defaults.column);

				/* Convert the camel-case defaults to Hungarian */
				_fnCamelToHungarian(defaults, defaults, true);
				_fnCamelToHungarian(defaults.column, defaults.column, true);

				/* Setting up the initialisation object */
				_fnCamelToHungarian(defaults, $.extend(oInit, $this.data()), true);



				/* Check to see if we are re-initialising a table */
				var allSettings = DataTable.settings;
				for (i = 0, iLen = allSettings.length; i < iLen; i++) {
					var s = allSettings[i];

					/* Base check on table node */
					if (
						s.nTable == this ||
						(s.nTHead && s.nTHead.parentNode == this) ||
						(s.nTFoot && s.nTFoot.parentNode == this)
					) {
						var bRetrieve = oInit.bRetrieve !== undefined ? oInit.bRetrieve : defaults.bRetrieve;
						var bDestroy = oInit.bDestroy !== undefined ? oInit.bDestroy : defaults.bDestroy;

						if (emptyInit || bRetrieve) {
							return s.oInstance;
						}
						else if (bDestroy) {
							s.oInstance.fnDestroy();
							break;
						}
						else {
							_fnLog(s, 0, 'Cannot reinitialise DataTable', 3);
							return;
						}
					}

					/* If the element we are initialising has the same ID as a table which was previously
					 * initialised, but the table nodes don't match (from before) then we destroy the old
					 * instance by simply deleting it. This is under the assumption that the table has been
					 * destroyed by other methods. Anyone using non-id selectors will need to do this manually
					 */
					if (s.sTableId == this.id) {
						allSettings.splice(i, 1);
						break;
					}
				}

				/* Ensure the table has an ID - required for accessibility */
				if (sId === null || sId === "") {
					sId = "DataTables_Table_" + (DataTable.ext._unique++);
					this.id = sId;
				}

				/* Create the settings object for this table and set some of the default parameters */
				var oSettings = $.extend(true, {}, DataTable.models.oSettings, {
					"sDestroyWidth": $this[0].style.width,
					"sInstance": sId,
					"sTableId": sId
				});
				oSettings.nTable = this;
				oSettings.oApi = _that.internal;
				oSettings.oInit = oInit;

				allSettings.push(oSettings);

				// Need to add the instance after the instance after the settings object has been added
				// to the settings array, so we can self reference the table instance if more than one
				oSettings.oInstance = (_that.length === 1) ? _that : $this.dataTable();

				// Backwards compatibility, before we apply all the defaults
				_fnCompatOpts(oInit);
				_fnLanguageCompat(oInit.oLanguage);

				// If the length menu is given, but the init display length is not, use the length menu
				if (oInit.aLengthMenu && !oInit.iDisplayLength) {
					oInit.iDisplayLength = Array.isArray(oInit.aLengthMenu[0]) ?
						oInit.aLengthMenu[0][0] : oInit.aLengthMenu[0];
				}

				// Apply the defaults and init options to make a single init object will all
				// options defined from defaults and instance options.
				oInit = _fnExtend($.extend(true, {}, defaults), oInit);


				// Map the initialisation options onto the settings object
				_fnMap(oSettings.oFeatures, oInit, [
					"bPaginate",
					"bLengthChange",
					"bFilter",
					"bSort",
					"bSortMulti",
					"bInfo",
					"bProcessing",
					"bAutoWidth",
					"bSortClasses",
					"bServerSide",
					"bDeferRender"
				]);
				_fnMap(oSettings, oInit, [
					"asStripeClasses",
					"ajax",
					"fnServerData",
					"fnFormatNumber",
					"sServerMethod",
					"aaSorting",
					"aaSortingFixed",
					"aLengthMenu",
					"sPaginationType",
					"sAjaxSource",
					"sAjaxDataProp",
					"iStateDuration",
					"sDom",
					"bSortCellsTop",
					"iTabIndex",
					"fnStateLoadCallback",
					"fnStateSaveCallback",
					"renderer",
					"searchDelay",
					"rowId",
					["iCookieDuration", "iStateDuration"], // backwards compat
					["oSearch", "oPreviousSearch"],
					["aoSearchCols", "aoPreSearchCols"],
					["iDisplayLength", "_iDisplayLength"]
				]);
				_fnMap(oSettings.oScroll, oInit, [
					["sScrollX", "sX"],
					["sScrollXInner", "sXInner"],
					["sScrollY", "sY"],
					["bScrollCollapse", "bCollapse"]
				]);
				_fnMap(oSettings.oLanguage, oInit, "fnInfoCallback");

				/* Callback functions which are array driven */
				_fnCallbackReg(oSettings, 'aoDrawCallback', oInit.fnDrawCallback, 'user');
				_fnCallbackReg(oSettings, 'aoServerParams', oInit.fnServerParams, 'user');
				_fnCallbackReg(oSettings, 'aoStateSaveParams', oInit.fnStateSaveParams, 'user');
				_fnCallbackReg(oSettings, 'aoStateLoadParams', oInit.fnStateLoadParams, 'user');
				_fnCallbackReg(oSettings, 'aoStateLoaded', oInit.fnStateLoaded, 'user');
				_fnCallbackReg(oSettings, 'aoRowCallback', oInit.fnRowCallback, 'user');
				_fnCallbackReg(oSettings, 'aoRowCreatedCallback', oInit.fnCreatedRow, 'user');
				_fnCallbackReg(oSettings, 'aoHeaderCallback', oInit.fnHeaderCallback, 'user');
				_fnCallbackReg(oSettings, 'aoFooterCallback', oInit.fnFooterCallback, 'user');
				_fnCallbackReg(oSettings, 'aoInitComplete', oInit.fnInitComplete, 'user');
				_fnCallbackReg(oSettings, 'aoPreDrawCallback', oInit.fnPreDrawCallback, 'user');

				oSettings.rowIdFn = _fnGetObjectDataFn(oInit.rowId);

				/* Browser support detection */
				_fnBrowserDetect(oSettings);

				var oClasses = oSettings.oClasses;

				$.extend(oClasses, DataTable.ext.classes, oInit.oClasses);
				$this.addClass(oClasses.sTable);


				if (oSettings.iInitDisplayStart === undefined) {
					/* Display start point, taking into account the save saving */
					oSettings.iInitDisplayStart = oInit.iDisplayStart;
					oSettings._iDisplayStart = oInit.iDisplayStart;
				}

				if (oInit.iDeferLoading !== null) {
					oSettings.bDeferLoading = true;
					var tmp = Array.isArray(oInit.iDeferLoading);
					oSettings._iRecordsDisplay = tmp ? oInit.iDeferLoading[0] : oInit.iDeferLoading;
					oSettings._iRecordsTotal = tmp ? oInit.iDeferLoading[1] : oInit.iDeferLoading;
				}

				/* Language definitions */
				var oLanguage = oSettings.oLanguage;
				$.extend(true, oLanguage, oInit.oLanguage);

				if (oLanguage.sUrl) {
					/* Get the language definitions from a file - because this Ajax call makes the language
					 * get async to the remainder of this function we use bInitHandedOff to indicate that
					 * _fnInitialise will be fired by the returned Ajax handler, rather than the constructor
					 */
					$.ajax({
						dataType: 'json',
						url: oLanguage.sUrl,
						success: function (json) {
							_fnCamelToHungarian(defaults.oLanguage, json);
							_fnLanguageCompat(json);
							$.extend(true, oLanguage, json, oSettings.oInit.oLanguage);

							_fnCallbackFire(oSettings, null, 'i18n', [oSettings]);
							_fnInitialise(oSettings);
						},
						error: function () {
							// Error occurred loading language file, continue on as best we can
							_fnInitialise(oSettings);
						}
					});
					bInitHandedOff = true;
				}
				else {
					_fnCallbackFire(oSettings, null, 'i18n', [oSettings]);
				}

				/*
				 * Stripes
				 */
				if (oInit.asStripeClasses === null) {
					oSettings.asStripeClasses = [
						oClasses.sStripeOdd,
						oClasses.sStripeEven
					];
				}

				/* Remove row stripe classes if they are already on the table row */
				var stripeClasses = oSettings.asStripeClasses;
				var rowOne = $this.children('tbody').find('tr').eq(0);
				if ($.inArray(true, $.map(stripeClasses, function (el, i) {
					return rowOne.hasClass(el);
				})) !== -1) {
					$('tbody tr', this).removeClass(stripeClasses.join(' '));
					oSettings.asDestroyStripes = stripeClasses.slice();
				}

				/*
				 * Columns
				 * See if we should load columns automatically or use defined ones
				 */
				var anThs = [];
				var aoColumnsInit;
				var nThead = this.getElementsByTagName('thead');
				if (nThead.length !== 0) {
					_fnDetectHeader(oSettings.aoHeader, nThead[0]);
					anThs = _fnGetUniqueThs(oSettings);
				}

				/* If not given a column array, generate one with nulls */
				if (oInit.aoColumns === null) {
					aoColumnsInit = [];
					for (i = 0, iLen = anThs.length; i < iLen; i++) {
						aoColumnsInit.push(null);
					}
				}
				else {
					aoColumnsInit = oInit.aoColumns;
				}

				/* Add the columns */
				for (i = 0, iLen = aoColumnsInit.length; i < iLen; i++) {
					_fnAddColumn(oSettings, anThs ? anThs[i] : null);
				}

				/* Apply the column definitions */
				_fnApplyColumnDefs(oSettings, oInit.aoColumnDefs, aoColumnsInit, function (iCol, oDef) {
					_fnColumnOptions(oSettings, iCol, oDef);
				});

				/* HTML5 attribute detection - build an mData object automatically if the
				 * attributes are found
				 */
				if (rowOne.length) {
					var a = function (cell, name) {
						return cell.getAttribute('data-' + name) !== null ? name : null;
					};

					$(rowOne[0]).children('th, td').each(function (i, cell) {
						var col = oSettings.aoColumns[i];

						if (!col) {
							_fnLog(oSettings, 0, 'Incorrect column count', 18);
						}

						if (col.mData === i) {
							var sort = a(cell, 'sort') || a(cell, 'order');
							var filter = a(cell, 'filter') || a(cell, 'search');

							if (sort !== null || filter !== null) {
								col.mData = {
									_: i + '.display',
									sort: sort !== null ? i + '.@data-' + sort : undefined,
									type: sort !== null ? i + '.@data-' + sort : undefined,
									filter: filter !== null ? i + '.@data-' + filter : undefined
								};

								_fnColumnOptions(oSettings, i);
							}
						}
					});
				}

				var features = oSettings.oFeatures;
				var loadedInit = function () {
					/*
					 * Sorting
					 * @todo For modularisation (1.11) this needs to do into a sort start up handler
					 */

					// If aaSorting is not defined, then we use the first indicator in asSorting
					// in case that has been altered, so the default sort reflects that option
					if (oInit.aaSorting === undefined) {
						var sorting = oSettings.aaSorting;
						for (i = 0, iLen = sorting.length; i < iLen; i++) {
							sorting[i][1] = oSettings.aoColumns[i].asSorting[0];
						}
					}

					/* Do a first pass on the sorting classes (allows any size changes to be taken into
					 * account, and also will apply sorting disabled classes if disabled
					 */
					_fnSortingClasses(oSettings);

					if (features.bSort) {
						_fnCallbackReg(oSettings, 'aoDrawCallback', function () {
							if (oSettings.bSorted) {
								var aSort = _fnSortFlatten(oSettings);
								var sortedColumns = {};

								$.each(aSort, function (i, val) {
									sortedColumns[val.src] = val.dir;
								});

								_fnCallbackFire(oSettings, null, 'order', [oSettings, aSort, sortedColumns]);
								_fnSortAria(oSettings);
							}
						});
					}

					_fnCallbackReg(oSettings, 'aoDrawCallback', function () {
						if (oSettings.bSorted || _fnDataSource(oSettings) === 'ssp' || features.bDeferRender) {
							_fnSortingClasses(oSettings);
						}
					}, 'sc');


					/*
					 * Final init
					 * Cache the header, body and footer as required, creating them if needed
					 */

					// Work around for Webkit bug 83867 - store the caption-side before removing from doc
					var captions = $this.children('caption').each(function () {
						this._captionSide = $(this).css('caption-side');
					});

					var thead = $this.children('thead');
					if (thead.length === 0) {
						thead = $('<thead/>').appendTo($this);
					}
					oSettings.nTHead = thead[0];

					var tbody = $this.children('tbody');
					if (tbody.length === 0) {
						tbody = $('<tbody/>').insertAfter(thead);
					}
					oSettings.nTBody = tbody[0];

					var tfoot = $this.children('tfoot');
					if (tfoot.length === 0 && captions.length > 0 && (oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "")) {
						// If we are a scrolling table, and no footer has been given, then we need to create
						// a tfoot element for the caption element to be appended to
						tfoot = $('<tfoot/>').appendTo($this);
					}

					if (tfoot.length === 0 || tfoot.children().length === 0) {
						$this.addClass(oClasses.sNoFooter);
					}
					else if (tfoot.length > 0) {
						oSettings.nTFoot = tfoot[0];
						_fnDetectHeader(oSettings.aoFooter, oSettings.nTFoot);
					}

					/* Check if there is data passing into the constructor */
					if (oInit.aaData) {
						for (i = 0; i < oInit.aaData.length; i++) {
							_fnAddData(oSettings, oInit.aaData[i]);
						}
					}
					else if (oSettings.bDeferLoading || _fnDataSource(oSettings) == 'dom') {
						/* Grab the data from the page - only do this when deferred loading or no Ajax
						 * source since there is no point in reading the DOM data if we are then going
						 * to replace it with Ajax data
						 */
						_fnAddTr(oSettings, $(oSettings.nTBody).children('tr'));
					}

					/* Copy the data index array */
					oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();

					/* Initialisation complete - table can be drawn */
					oSettings.bInitialised = true;

					/* Check if we need to initialise the table (it might not have been handed off to the
					 * language processor)
					 */
					if (bInitHandedOff === false) {
						_fnInitialise(oSettings);
					}
				};

				/* Must be done after everything which can be overridden by the state saving! */
				_fnCallbackReg(oSettings, 'aoDrawCallback', _fnSaveState, 'state_save');

				if (oInit.bStateSave) {
					features.bStateSave = true;
					_fnLoadState(oSettings, oInit, loadedInit);
				}
				else {
					loadedInit();
				}

			});
			_that = null;
			return this;
		};


		/*
		 * It is useful to have variables which are scoped locally so only the
		 * DataTables functions can access them and they don't leak into global space.
		 * At the same time these functions are often useful over multiple files in the
		 * core and API, so we list, or at least document, all variables which are used
		 * by DataTables as private variables here. This also ensures that there is no
		 * clashing of variable names and that they can easily referenced for reuse.
		 */


		// Defined else where
		//  _selector_run
		//  _selector_opts
		//  _selector_first
		//  _selector_row_indexes

		var _ext; // DataTable.ext
		var _Api; // DataTable.Api
		var _api_register; // DataTable.Api.register
		var _api_registerPlural; // DataTable.Api.registerPlural

		var _re_dic = {};
		var _re_new_lines = /[\r\n\u2028]/g;
		var _re_html = /<.*?>/g;

		// This is not strict ISO8601 - Date.parse() is quite lax, although
		// implementations differ between browsers.
		var _re_date = /^\d{2,4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,2}([T ]{1}\d{1,2}[:\.]\d{2}([\.:]\d{2})?)?$/;

		// Escape regular expression special characters
		var _re_escape_regex = new RegExp('(\\' + ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-'].join('|\\') + ')', 'g');

		// http://en.wikipedia.org/wiki/Foreign_exchange_market
		// - \u20BD - Russian ruble.
		// - \u20a9 - South Korean Won
		// - \u20BA - Turkish Lira
		// - \u20B9 - Indian Rupee
		// - R - Brazil (R$) and South Africa
		// - fr - Swiss Franc
		// - kr - Swedish krona, Norwegian krone and Danish krone
		// - \u2009 is thin space and \u202F is narrow no-break space, both used in many
		// - Ƀ - Bitcoin
		// - Ξ - Ethereum
		//   standards as thousands separators.
		var _re_formatted_numeric = /['\u00A0,$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfkɃΞ]/gi;


		var _empty = function (d) {
			return !d || d === true || d === '-' ? true : false;
		};


		var _intVal = function (s) {
			var integer = parseInt(s, 10);
			return !isNaN(integer) && isFinite(s) ? integer : null;
		};

		// Convert from a formatted number with characters other than `.` as the
		// decimal place, to a Javascript number
		var _numToDecimal = function (num, decimalPoint) {
			// Cache created regular expressions for speed as this function is called often
			if (!_re_dic[decimalPoint]) {
				_re_dic[decimalPoint] = new RegExp(_fnEscapeRegex(decimalPoint), 'g');
			}
			return typeof num === 'string' && decimalPoint !== '.' ?
				num.replace(/\./g, '').replace(_re_dic[decimalPoint], '.') :
				num;
		};


		var _isNumber = function (d, decimalPoint, formatted) {
			var strType = typeof d === 'string';

			// If empty return immediately so there must be a number if it is a
			// formatted string (this stops the string "k", or "kr", etc being detected
			// as a formatted number for currency
			if (_empty(d)) {
				return true;
			}

			if (decimalPoint && strType) {
				d = _numToDecimal(d, decimalPoint);
			}

			if (formatted && strType) {
				d = d.replace(_re_formatted_numeric, '');
			}

			return !isNaN(parseFloat(d)) && isFinite(d);
		};


		// A string without HTML in it can be considered to be HTML still
		var _isHtml = function (d) {
			return _empty(d) || typeof d === 'string';
		};


		var _htmlNumeric = function (d, decimalPoint, formatted) {
			if (_empty(d)) {
				return true;
			}

			var html = _isHtml(d);
			return !html ?
				null :
				_isNumber(_stripHtml(d), decimalPoint, formatted) ?
					true :
					null;
		};


		var _pluck = function (a, prop, prop2) {
			var out = [];
			var i = 0, ien = a.length;

			// Could have the test in the loop for slightly smaller code, but speed
			// is essential here
			if (prop2 !== undefined) {
				for (; i < ien; i++) {
					if (a[i] && a[i][prop]) {
						out.push(a[i][prop][prop2]);
					}
				}
			}
			else {
				for (; i < ien; i++) {
					if (a[i]) {
						out.push(a[i][prop]);
					}
				}
			}

			return out;
		};


		// Basically the same as _pluck, but rather than looping over `a` we use `order`
		// as the indexes to pick from `a`
		var _pluck_order = function (a, order, prop, prop2) {
			var out = [];
			var i = 0, ien = order.length;

			// Could have the test in the loop for slightly smaller code, but speed
			// is essential here
			if (prop2 !== undefined) {
				for (; i < ien; i++) {
					if (a[order[i]][prop]) {
						out.push(a[order[i]][prop][prop2]);
					}
				}
			}
			else {
				for (; i < ien; i++) {
					out.push(a[order[i]][prop]);
				}
			}

			return out;
		};


		var _range = function (len, start) {
			var out = [];
			var end;

			if (start === undefined) {
				start = 0;
				end = len;
			}
			else {
				end = start;
				start = len;
			}

			for (var i = start; i < end; i++) {
				out.push(i);
			}

			return out;
		};


		var _removeEmpty = function (a) {
			var out = [];

			for (var i = 0, ien = a.length; i < ien; i++) {
				if (a[i]) { // careful - will remove all falsy values!
					out.push(a[i]);
				}
			}

			return out;
		};


		var _stripHtml = function (d) {
			return d.replace(_re_html, '');
		};


		/**
		 * Determine if all values in the array are unique. This means we can short
		 * cut the _unique method at the cost of a single loop. A sorted array is used
		 * to easily check the values.
		 *
		 * @param  {array} src Source array
		 * @return {boolean} true if all unique, false otherwise
		 * @ignore
		 */
		var _areAllUnique = function (src) {
			if (src.length < 2) {
				return true;
			}

			var sorted = src.slice().sort();
			var last = sorted[0];

			for (var i = 1, ien = sorted.length; i < ien; i++) {
				if (sorted[i] === last) {
					return false;
				}

				last = sorted[i];
			}

			return true;
		};


		/**
		 * Find the unique elements in a source array.
		 *
		 * @param  {array} src Source array
		 * @return {array} Array of unique items
		 * @ignore
		 */
		var _unique = function (src) {
			if (_areAllUnique(src)) {
				return src.slice();
			}

			// A faster unique method is to use object keys to identify used values,
			// but this doesn't work with arrays or objects, which we must also
			// consider. See jsperf.com/compare-array-unique-versions/4 for more
			// information.
			var
				out = [],
				val,
				i, ien = src.length,
				j, k = 0;

			again: for (i = 0; i < ien; i++) {
				val = src[i];

				for (j = 0; j < k; j++) {
					if (out[j] === val) {
						continue again;
					}
				}

				out.push(val);
				k++;
			}

			return out;
		};

		// Surprisingly this is faster than [].concat.apply
		// https://jsperf.com/flatten-an-array-loop-vs-reduce/2
		var _flatten = function (out, val) {
			if (Array.isArray(val)) {
				for (var i = 0; i < val.length; i++) {
					_flatten(out, val[i]);
				}
			}
			else {
				out.push(val);
			}

			return out;
		}

		var _includes = function (search, start) {
			if (start === undefined) {
				start = 0;
			}

			return this.indexOf(search, start) !== -1;
		};

		// Array.isArray polyfill.
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
		if (!Array.isArray) {
			Array.isArray = function (arg) {
				return Object.prototype.toString.call(arg) === '[object Array]';
			};
		}

		if (!Array.prototype.includes) {
			Array.prototype.includes = _includes;
		}

		// .trim() polyfill
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim
		if (!String.prototype.trim) {
			String.prototype.trim = function () {
				return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
			};
		}

		if (!String.prototype.includes) {
			String.prototype.includes = _includes;
		}

		/**
		 * DataTables utility methods
		 * 
		 * This namespace provides helper methods that DataTables uses internally to
		 * create a DataTable, but which are not exclusively used only for DataTables.
		 * These methods can be used by extension authors to save the duplication of
		 * code.
		 *
		 *  @namespace
		 */
		DataTable.util = {
			/**
			 * Throttle the calls to a function. Arguments and context are maintained
			 * for the throttled function.
			 *
			 * @param {function} fn Function to be called
			 * @param {integer} freq Call frequency in mS
			 * @return {function} Wrapped function
			 */
			throttle: function (fn, freq) {
				var
					frequency = freq !== undefined ? freq : 200,
					last,
					timer;

				return function () {
					var
						that = this,
						now = +new Date(),
						args = arguments;

					if (last && now < last + frequency) {
						clearTimeout(timer);

						timer = setTimeout(function () {
							last = undefined;
							fn.apply(that, args);
						}, frequency);
					}
					else {
						last = now;
						fn.apply(that, args);
					}
				};
			},


			/**
			 * Escape a string such that it can be used in a regular expression
			 *
			 *  @param {string} val string to escape
			 *  @returns {string} escaped string
			 */
			escapeRegex: function (val) {
				return val.replace(_re_escape_regex, '\\$1');
			},

			/**
			 * Create a function that will write to a nested object or array
			 * @param {*} source JSON notation string
			 * @returns Write function
			 */
			set: function (source) {
				if ($.isPlainObject(source)) {
					/* Unlike get, only the underscore (global) option is used for for
					 * setting data since we don't know the type here. This is why an object
					 * option is not documented for `mData` (which is read/write), but it is
					 * for `mRender` which is read only.
					 */
					return DataTable.util.set(source._);
				}
				else if (source === null) {
					// Nothing to do when the data source is null
					return function () { };
				}
				else if (typeof source === 'function') {
					return function (data, val, meta) {
						source(data, 'set', val, meta);
					};
				}
				else if (typeof source === 'string' && (source.indexOf('.') !== -1 ||
					source.indexOf('[') !== -1 || source.indexOf('(') !== -1)) {
					// Like the get, we need to get data from a nested object
					var setData = function (data, val, src) {
						var a = _fnSplitObjNotation(src), b;
						var aLast = a[a.length - 1];
						var arrayNotation, funcNotation, o, innerSrc;

						for (var i = 0, iLen = a.length - 1; i < iLen; i++) {
							// Protect against prototype pollution
							if (a[i] === '__proto__' || a[i] === 'constructor') {
								throw new Error('Cannot set prototype values');
							}

							// Check if we are dealing with an array notation request
							arrayNotation = a[i].match(__reArray);
							funcNotation = a[i].match(__reFn);

							if (arrayNotation) {
								a[i] = a[i].replace(__reArray, '');
								data[a[i]] = [];

								// Get the remainder of the nested object to set so we can recurse
								b = a.slice();
								b.splice(0, i + 1);
								innerSrc = b.join('.');

								// Traverse each entry in the array setting the properties requested
								if (Array.isArray(val)) {
									for (var j = 0, jLen = val.length; j < jLen; j++) {
										o = {};
										setData(o, val[j], innerSrc);
										data[a[i]].push(o);
									}
								}
								else {
									// We've been asked to save data to an array, but it
									// isn't array data to be saved. Best that can be done
									// is to just save the value.
									data[a[i]] = val;
								}

								// The inner call to setData has already traversed through the remainder
								// of the source and has set the data, thus we can exit here
								return;
							}
							else if (funcNotation) {
								// Function call
								a[i] = a[i].replace(__reFn, '');
								data = data[a[i]](val);
							}

							// If the nested object doesn't currently exist - since we are
							// trying to set the value - create it
							if (data[a[i]] === null || data[a[i]] === undefined) {
								data[a[i]] = {};
							}
							data = data[a[i]];
						}

						// Last item in the input - i.e, the actual set
						if (aLast.match(__reFn)) {
							// Function call
							data = data[aLast.replace(__reFn, '')](val);
						}
						else {
							// If array notation is used, we just want to strip it and use the property name
							// and assign the value. If it isn't used, then we get the result we want anyway
							data[aLast.replace(__reArray, '')] = val;
						}
					};

					return function (data, val) { // meta is also passed in, but not used
						return setData(data, val, source);
					};
				}
				else {
					// Array or flat object mapping
					return function (data, val) { // meta is also passed in, but not used
						data[source] = val;
					};
				}
			},

			/**
			 * Create a function that will read nested objects from arrays, based on JSON notation
			 * @param {*} source JSON notation string
			 * @returns Value read
			 */
			get: function (source) {
				if ($.isPlainObject(source)) {
					// Build an object of get functions, and wrap them in a single call
					var o = {};
					$.each(source, function (key, val) {
						if (val) {
							o[key] = DataTable.util.get(val);
						}
					});

					return function (data, type, row, meta) {
						var t = o[type] || o._;
						return t !== undefined ?
							t(data, type, row, meta) :
							data;
					};
				}
				else if (source === null) {
					// Give an empty string for rendering / sorting etc
					return function (data) { // type, row and meta also passed, but not used
						return data;
					};
				}
				else if (typeof source === 'function') {
					return function (data, type, row, meta) {
						return source(data, type, row, meta);
					};
				}
				else if (typeof source === 'string' && (source.indexOf('.') !== -1 ||
					source.indexOf('[') !== -1 || source.indexOf('(') !== -1)) {
					/* If there is a . in the source string then the data source is in a
					 * nested object so we loop over the data for each level to get the next
					 * level down. On each loop we test for undefined, and if found immediately
					 * return. This allows entire objects to be missing and sDefaultContent to
					 * be used if defined, rather than throwing an error
					 */
					var fetchData = function (data, type, src) {
						var arrayNotation, funcNotation, out, innerSrc;

						if (src !== "") {
							var a = _fnSplitObjNotation(src);

							for (var i = 0, iLen = a.length; i < iLen; i++) {
								// Check if we are dealing with special notation
								arrayNotation = a[i].match(__reArray);
								funcNotation = a[i].match(__reFn);

								if (arrayNotation) {
									// Array notation
									a[i] = a[i].replace(__reArray, '');

									// Condition allows simply [] to be passed in
									if (a[i] !== "") {
										data = data[a[i]];
									}
									out = [];

									// Get the remainder of the nested object to get
									a.splice(0, i + 1);
									innerSrc = a.join('.');

									// Traverse each entry in the array getting the properties requested
									if (Array.isArray(data)) {
										for (var j = 0, jLen = data.length; j < jLen; j++) {
											out.push(fetchData(data[j], type, innerSrc));
										}
									}

									// If a string is given in between the array notation indicators, that
									// is used to join the strings together, otherwise an array is returned
									var join = arrayNotation[0].substring(1, arrayNotation[0].length - 1);
									data = (join === "") ? out : out.join(join);

									// The inner call to fetchData has already traversed through the remainder
									// of the source requested, so we exit from the loop
									break;
								}
								else if (funcNotation) {
									// Function call
									a[i] = a[i].replace(__reFn, '');
									data = data[a[i]]();
									continue;
								}

								if (data === null || data[a[i]] === undefined) {
									return undefined;
								}

								data = data[a[i]];
							}
						}

						return data;
					};

					return function (data, type) { // row and meta also passed, but not used
						return fetchData(data, type, source);
					};
				}
				else {
					// Array or flat object mapping
					return function (data, type) { // row and meta also passed, but not used
						return data[source];
					};
				}
			}
		};



		/**
		 * Create a mapping object that allows camel case parameters to be looked up
		 * for their Hungarian counterparts. The mapping is stored in a private
		 * parameter called `_hungarianMap` which can be accessed on the source object.
		 *  @param {object} o
		 *  @memberof DataTable#oApi
		 */
		function _fnHungarianMap(o) {
			var
				hungarian = 'a aa ai ao as b fn i m o s ',
				match,
				newKey,
				map = {};

			$.each(o, function (key, val) {
				match = key.match(/^([^A-Z]+?)([A-Z])/);

				if (match && hungarian.indexOf(match[1] + ' ') !== -1) {
					newKey = key.replace(match[0], match[2].toLowerCase());
					map[newKey] = key;

					if (match[1] === 'o') {
						_fnHungarianMap(o[key]);
					}
				}
			});

			o._hungarianMap = map;
		}


		/**
		 * Convert from camel case parameters to Hungarian, based on a Hungarian map
		 * created by _fnHungarianMap.
		 *  @param {object} src The model object which holds all parameters that can be
		 *    mapped.
		 *  @param {object} user The object to convert from camel case to Hungarian.
		 *  @param {boolean} force When set to `true`, properties which already have a
		 *    Hungarian value in the `user` object will be overwritten. Otherwise they
		 *    won't be.
		 *  @memberof DataTable#oApi
		 */
		function _fnCamelToHungarian(src, user, force) {
			if (!src._hungarianMap) {
				_fnHungarianMap(src);
			}

			var hungarianKey;

			$.each(user, function (key, val) {
				hungarianKey = src._hungarianMap[key];

				if (hungarianKey !== undefined && (force || user[hungarianKey] === undefined)) {
					// For objects, we need to buzz down into the object to copy parameters
					if (hungarianKey.charAt(0) === 'o') {
						// Copy the camelCase options over to the hungarian
						if (!user[hungarianKey]) {
							user[hungarianKey] = {};
						}
						$.extend(true, user[hungarianKey], user[key]);

						_fnCamelToHungarian(src[hungarianKey], user[hungarianKey], force);
					}
					else {
						user[hungarianKey] = user[key];
					}
				}
			});
		}


		/**
		 * Language compatibility - when certain options are given, and others aren't, we
		 * need to duplicate the values over, in order to provide backwards compatibility
		 * with older language files.
		 *  @param {object} oSettings dataTables settings object
		 *  @memberof DataTable#oApi
		 */
		function _fnLanguageCompat(lang) {
			// Note the use of the Hungarian notation for the parameters in this method as
			// this is called after the mapping of camelCase to Hungarian
			var defaults = DataTable.defaults.oLanguage;

			// Default mapping
			var defaultDecimal = defaults.sDecimal;
			if (defaultDecimal) {
				_addNumericSort(defaultDecimal);
			}

			if (lang) {
				var zeroRecords = lang.sZeroRecords;

				// Backwards compatibility - if there is no sEmptyTable given, then use the same as
				// sZeroRecords - assuming that is given.
				if (!lang.sEmptyTable && zeroRecords &&
					defaults.sEmptyTable === "No data available in table") {
					_fnMap(lang, lang, 'sZeroRecords', 'sEmptyTable');
				}

				// Likewise with loading records
				if (!lang.sLoadingRecords && zeroRecords &&
					defaults.sLoadingRecords === "Loading...") {
					_fnMap(lang, lang, 'sZeroRecords', 'sLoadingRecords');
				}

				// Old parameter name of the thousands separator mapped onto the new
				if (lang.sInfoThousands) {
					lang.sThousands = lang.sInfoThousands;
				}

				var decimal = lang.sDecimal;
				if (decimal && defaultDecimal !== decimal) {
					_addNumericSort(decimal);
				}
			}
		}


		/**
		 * Map one parameter onto another
		 *  @param {object} o Object to map
		 *  @param {*} knew The new parameter name
		 *  @param {*} old The old parameter name
		 */
		var _fnCompatMap = function (o, knew, old) {
			if (o[knew] !== undefined) {
				o[old] = o[knew];
			}
		};


		/**
		 * Provide backwards compatibility for the main DT options. Note that the new
		 * options are mapped onto the old parameters, so this is an external interface
		 * change only.
		 *  @param {object} init Object to map
		 */
		function _fnCompatOpts(init) {
			_fnCompatMap(init, 'ordering', 'bSort');
			_fnCompatMap(init, 'orderMulti', 'bSortMulti');
			_fnCompatMap(init, 'orderClasses', 'bSortClasses');
			_fnCompatMap(init, 'orderCellsTop', 'bSortCellsTop');
			_fnCompatMap(init, 'order', 'aaSorting');
			_fnCompatMap(init, 'orderFixed', 'aaSortingFixed');
			_fnCompatMap(init, 'paging', 'bPaginate');
			_fnCompatMap(init, 'pagingType', 'sPaginationType');
			_fnCompatMap(init, 'pageLength', 'iDisplayLength');
			_fnCompatMap(init, 'searching', 'bFilter');

			// Boolean initialisation of x-scrolling
			if (typeof init.sScrollX === 'boolean') {
				init.sScrollX = init.sScrollX ? '100%' : '';
			}
			if (typeof init.scrollX === 'boolean') {
				init.scrollX = init.scrollX ? '100%' : '';
			}

			// Column search objects are in an array, so it needs to be converted
			// element by element
			var searchCols = init.aoSearchCols;

			if (searchCols) {
				for (var i = 0, ien = searchCols.length; i < ien; i++) {
					if (searchCols[i]) {
						_fnCamelToHungarian(DataTable.models.oSearch, searchCols[i]);
					}
				}
			}
		}


		/**
		 * Provide backwards compatibility for column options. Note that the new options
		 * are mapped onto the old parameters, so this is an external interface change
		 * only.
		 *  @param {object} init Object to map
		 */
		function _fnCompatCols(init) {
			_fnCompatMap(init, 'orderable', 'bSortable');
			_fnCompatMap(init, 'orderData', 'aDataSort');
			_fnCompatMap(init, 'orderSequence', 'asSorting');
			_fnCompatMap(init, 'orderDataType', 'sortDataType');

			// orderData can be given as an integer
			var dataSort = init.aDataSort;
			if (typeof dataSort === 'number' && !Array.isArray(dataSort)) {
				init.aDataSort = [dataSort];
			}
		}


		/**
		 * Browser feature detection for capabilities, quirks
		 *  @param {object} settings dataTables settings object
		 *  @memberof DataTable#oApi
		 */
		function _fnBrowserDetect(settings) {
			// We don't need to do this every time DataTables is constructed, the values
			// calculated are specific to the browser and OS configuration which we
			// don't expect to change between initialisations
			if (!DataTable.__browser) {
				var browser = {};
				DataTable.__browser = browser;

				// Scrolling feature / quirks detection
				var n = $('<div/>')
					.css({
						position: 'fixed',
						top: 0,
						left: $(window).scrollLeft() * -1, // allow for scrolling
						height: 1,
						width: 1,
						overflow: 'hidden'
					})
					.append(
						$('<div/>')
							.css({
								position: 'absolute',
								top: 1,
								left: 1,
								width: 100,
								overflow: 'scroll'
							})
							.append(
								$('<div/>')
									.css({
										width: '100%',
										height: 10
									})
							)
					)
					.appendTo('body');

				var outer = n.children();
				var inner = outer.children();

				// Numbers below, in order, are:
				// inner.offsetWidth, inner.clientWidth, outer.offsetWidth, outer.clientWidth
				//
				// IE6 XP:                           100 100 100  83
				// IE7 Vista:                        100 100 100  83
				// IE 8+ Windows:                     83  83 100  83
				// Evergreen Windows:                 83  83 100  83
				// Evergreen Mac with scrollbars:     85  85 100  85
				// Evergreen Mac without scrollbars: 100 100 100 100

				// Get scrollbar width
				browser.barWidth = outer[0].offsetWidth - outer[0].clientWidth;

				// IE6/7 will oversize a width 100% element inside a scrolling element, to
				// include the width of the scrollbar, while other browsers ensure the inner
				// element is contained without forcing scrolling
				browser.bScrollOversize = inner[0].offsetWidth === 100 && outer[0].clientWidth !== 100;

				// In rtl text layout, some browsers (most, but not all) will place the
				// scrollbar on the left, rather than the right.
				browser.bScrollbarLeft = Math.round(inner.offset().left) !== 1;

				// IE8- don't provide height and width for getBoundingClientRect
				browser.bBounding = n[0].getBoundingClientRect().width ? true : false;

				n.remove();
			}

			$.extend(settings.oBrowser, DataTable.__browser);
			settings.oScroll.iBarWidth = DataTable.__browser.barWidth;
		}


		/**
		 * Array.prototype reduce[Right] method, used for browsers which don't support
		 * JS 1.6. Done this way to reduce code size, since we iterate either way
		 *  @param {object} settings dataTables settings object
		 *  @memberof DataTable#oApi
		 */
		function _fnReduce(that, fn, init, start, end, inc) {
			var
				i = start,
				value,
				isSet = false;

			if (init !== undefined) {
				value = init;
				isSet = true;
			}

			while (i !== end) {
				if (!that.hasOwnProperty(i)) {
					continue;
				}

				value = isSet ?
					fn(value, that[i], i, that) :
					that[i];

				isSet = true;
				i += inc;
			}

			return value;
		}

		/**
		 * Add a column to the list used for the table with default values
		 *  @param {object} oSettings dataTables settings object
		 *  @param {node} nTh The th element for this column
		 *  @memberof DataTable#oApi
		 */
		function _fnAddColumn(oSettings, nTh) {
			// Add column to aoColumns array
			var oDefaults = DataTable.defaults.column;
			var iCol = oSettings.aoColumns.length;
			var oCol = $.extend({}, DataTable.models.oColumn, oDefaults, {
				"nTh": nTh ? nTh : document.createElement('th'),
				"sTitle": oDefaults.sTitle ? oDefaults.sTitle : nTh ? nTh.innerHTML : '',
				"aDataSort": oDefaults.aDataSort ? oDefaults.aDataSort : [iCol],
				"mData": oDefaults.mData ? oDefaults.mData : iCol,
				idx: iCol
			});
			oSettings.aoColumns.push(oCol);

			// Add search object for column specific search. Note that the `searchCols[ iCol ]`
			// passed into extend can be undefined. This allows the user to give a default
			// with only some of the parameters defined, and also not give a default
			var searchCols = oSettings.aoPreSearchCols;
			searchCols[iCol] = $.extend({}, DataTable.models.oSearch, searchCols[iCol]);

			// Use the default column options function to initialise classes etc
			_fnColumnOptions(oSettings, iCol, $(nTh).data());
		}


		/**
		 * Apply options for a column
		 *  @param {object} oSettings dataTables settings object
		 *  @param {int} iCol column index to consider
		 *  @param {object} oOptions object with sType, bVisible and bSearchable etc
		 *  @memberof DataTable#oApi
		 */
		function _fnColumnOptions(oSettings, iCol, oOptions) {
			var oCol = oSettings.aoColumns[iCol];
			var oClasses = oSettings.oClasses;
			var th = $(oCol.nTh);

			// Try to get width information from the DOM. We can't get it from CSS
			// as we'd need to parse the CSS stylesheet. `width` option can override
			if (!oCol.sWidthOrig) {
				// Width attribute
				oCol.sWidthOrig = th.attr('width') || null;

				// Style attribute
				var t = (th.attr('style') || '').match(/width:\s*(\d+[pxem%]+)/);
				if (t) {
					oCol.sWidthOrig = t[1];
				}
			}

			/* User specified column options */
			if (oOptions !== undefined && oOptions !== null) {
				// Backwards compatibility
				_fnCompatCols(oOptions);

				// Map camel case parameters to their Hungarian counterparts
				_fnCamelToHungarian(DataTable.defaults.column, oOptions, true);

				/* Backwards compatibility for mDataProp */
				if (oOptions.mDataProp !== undefined && !oOptions.mData) {
					oOptions.mData = oOptions.mDataProp;
				}

				if (oOptions.sType) {
					oCol._sManualType = oOptions.sType;
				}

				// `class` is a reserved word in Javascript, so we need to provide
				// the ability to use a valid name for the camel case input
				if (oOptions.className && !oOptions.sClass) {
					oOptions.sClass = oOptions.className;
				}
				if (oOptions.sClass) {
					th.addClass(oOptions.sClass);
				}

				var origClass = oCol.sClass;

				$.extend(oCol, oOptions);
				_fnMap(oCol, oOptions, "sWidth", "sWidthOrig");

				// Merge class from previously defined classes with this one, rather than just
				// overwriting it in the extend above
				if (origClass !== oCol.sClass) {
					oCol.sClass = origClass + ' ' + oCol.sClass;
				}

				/* iDataSort to be applied (backwards compatibility), but aDataSort will take
				 * priority if defined
				 */
				if (oOptions.iDataSort !== undefined) {
					oCol.aDataSort = [oOptions.iDataSort];
				}
				_fnMap(oCol, oOptions, "aDataSort");
			}

			/* Cache the data get and set functions for speed */
			var mDataSrc = oCol.mData;
			var mData = _fnGetObjectDataFn(mDataSrc);
			var mRender = oCol.mRender ? _fnGetObjectDataFn(oCol.mRender) : null;

			var attrTest = function (src) {
				return typeof src === 'string' && src.indexOf('@') !== -1;
			};
			oCol._bAttrSrc = $.isPlainObject(mDataSrc) && (
				attrTest(mDataSrc.sort) || attrTest(mDataSrc.type) || attrTest(mDataSrc.filter)
			);
			oCol._setter = null;

			oCol.fnGetData = function (rowData, type, meta) {
				var innerData = mData(rowData, type, undefined, meta);

				return mRender && type ?
					mRender(innerData, type, rowData, meta) :
					innerData;
			};
			oCol.fnSetData = function (rowData, val, meta) {
				return _fnSetObjectDataFn(mDataSrc)(rowData, val, meta);
			};

			// Indicate if DataTables should read DOM data as an object or array
			// Used in _fnGetRowElements
			if (typeof mDataSrc !== 'number') {
				oSettings._rowReadObject = true;
			}

			/* Feature sorting overrides column specific when off */
			if (!oSettings.oFeatures.bSort) {
				oCol.bSortable = false;
				th.addClass(oClasses.sSortableNone); // Have to add class here as order event isn't called
			}

			/* Check that the class assignment is correct for sorting */
			var bAsc = $.inArray('asc', oCol.asSorting) !== -1;
			var bDesc = $.inArray('desc', oCol.asSorting) !== -1;
			if (!oCol.bSortable || (!bAsc && !bDesc)) {
				oCol.sSortingClass = oClasses.sSortableNone;
				oCol.sSortingClassJUI = "";
			}
			else if (bAsc && !bDesc) {
				oCol.sSortingClass = oClasses.sSortableAsc;
				oCol.sSortingClassJUI = oClasses.sSortJUIAscAllowed;
			}
			else if (!bAsc && bDesc) {
				oCol.sSortingClass = oClasses.sSortableDesc;
				oCol.sSortingClassJUI = oClasses.sSortJUIDescAllowed;
			}
			else {
				oCol.sSortingClass = oClasses.sSortable;
				oCol.sSortingClassJUI = oClasses.sSortJUI;
			}
		}


		/**
		 * Adjust the table column widths for new data. Note: you would probably want to
		 * do a redraw after calling this function!
		 *  @param {object} settings dataTables settings object
		 *  @memberof DataTable#oApi
		 */
		function _fnAdjustColumnSizing(settings) {
			/* Not interested in doing column width calculation if auto-width is disabled */
			if (settings.oFeatures.bAutoWidth !== false) {
				var columns = settings.aoColumns;

				_fnCalculateColumnWidths(settings);
				for (var i = 0, iLen = columns.length; i < iLen; i++) {
					columns[i].nTh.style.width = columns[i].sWidth;
				}
			}

			var scroll = settings.oScroll;
			if (scroll.sY !== '' || scroll.sX !== '') {
				_fnScrollDraw(settings);
			}

			_fnCallbackFire(settings, null, 'column-sizing', [settings]);
		}


		/**
		 * Convert the index of a visible column to the index in the data array (take account
		 * of hidden columns)
		 *  @param {object} oSettings dataTables settings object
		 *  @param {int} iMatch Visible column index to lookup
		 *  @returns {int} i the data index
		 *  @memberof DataTable#oApi
		 */
		function _fnVisibleToColumnIndex(oSettings, iMatch) {
			var aiVis = _fnGetColumns(oSettings, 'bVisible');

			return typeof aiVis[iMatch] === 'number' ?
				aiVis[iMatch] :
				null;
		}


		/**
		 * Convert the index of an index in the data array and convert it to the visible
		 *   column index (take account of hidden columns)
		 *  @param {int} iMatch Column index to lookup
		 *  @param {object} oSettings dataTables settings object
		 *  @returns {int} i the data index
		 *  @memberof DataTable#oApi
		 */
		function _fnColumnIndexToVisible(oSettings, iMatch) {
			var aiVis = _fnGetColumns(oSettings, 'bVisible');
			var iPos = $.inArray(iMatch, aiVis);

			return iPos !== -1 ? iPos : null;
		}


		/**
		 * Get the number of visible columns
		 *  @param {object} oSettings dataTables settings object
		 *  @returns {int} i the number of visible columns
		 *  @memberof DataTable#oApi
		 */
		function _fnVisbleColumns(oSettings) {
			var vis = 0;

			// No reduce in IE8, use a loop for now
			$.each(oSettings.aoColumns, function (i, col) {
				if (col.bVisible && $(col.nTh).css('display') !== 'none') {
					vis++;
				}
			});

			return vis;
		}


		/**
		 * Get an array of column indexes that match a given property
		 *  @param {object} oSettings dataTables settings object
		 *  @param {string} sParam Parameter in aoColumns to look for - typically
		 *    bVisible or bSearchable
		 *  @returns {array} Array of indexes with matched properties
		 *  @memberof DataTable#oApi
		 */
		function _fnGetColumns(oSettings, sParam) {
			var a = [];

			$.map(oSettings.aoColumns, function (val, i) {
				if (val[sParam]) {
					a.push(i);
				}
			});

			return a;
		}


		/**
		 * Calculate the 'type' of a column
		 *  @param {object} settings dataTables settings object
		 *  @memberof DataTable#oApi
		 */
		function _fnColumnTypes(settings) {
			var columns = settings.aoColumns;
			var data = settings.aoData;
			var types = DataTable.ext.type.detect;
			var i, ien, j, jen, k, ken;
			var col, cell, detectedType, cache;

			// For each column, spin over the 
			for (i = 0, ien = columns.length; i < ien; i++) {
				col = columns[i];
				cache = [];

				if (!col.sType && col._sManualType) {
					col.sType = col._sManualType;
				}
				else if (!col.sType) {
					for (j = 0, jen = types.length; j < jen; j++) {
						for (k = 0, ken = data.length; k < ken; k++) {
							// Use a cache array so we only need to get the type data
							// from the formatter once (when using multiple detectors)
							if (cache[k] === undefined) {
								cache[k] = _fnGetCellData(settings, k, i, 'type');
							}

							detectedType = types[j](cache[k], settings);

							// If null, then this type can't apply to this column, so
							// rather than testing all cells, break out. There is an
							// exception for the last type which is `html`. We need to
							// scan all rows since it is possible to mix string and HTML
							// types
							if (!detectedType && j !== types.length - 1) {
								break;
							}

							// Only a single match is needed for html type since it is
							// bottom of the pile and very similar to string - but it
							// must not be empty
							if (detectedType === 'html' && !_empty(cache[k])) {
								break;
							}
						}

						// Type is valid for all data points in the column - use this
						// type
						if (detectedType) {
							col.sType = detectedType;
							break;
						}
					}

					// Fall back - if no type was detected, always use string
					if (!col.sType) {
						col.sType = 'string';
					}
				}
			}
		}


		/**
		 * Take the column definitions and static columns arrays and calculate how
		 * they relate to column indexes. The callback function will then apply the
		 * definition found for a column to a suitable configuration object.
		 *  @param {object} oSettings dataTables settings object
		 *  @param {array} aoColDefs The aoColumnDefs array that is to be applied
		 *  @param {array} aoCols The aoColumns array that defines columns individually
		 *  @param {function} fn Callback function - takes two parameters, the calculated
		 *    column index and the definition for that column.
		 *  @memberof DataTable#oApi
		 */
		function _fnApplyColumnDefs(oSettings, aoColDefs, aoCols, fn) {
			var i, iLen, j, jLen, k, kLen, def;
			var columns = oSettings.aoColumns;

			// Column definitions with aTargets
			if (aoColDefs) {
				/* Loop over the definitions array - loop in reverse so first instance has priority */
				for (i = aoColDefs.length - 1; i >= 0; i--) {
					def = aoColDefs[i];

					/* Each definition can target multiple columns, as it is an array */
					var aTargets = def.target !== undefined
						? def.target
						: def.targets !== undefined
							? def.targets
							: def.aTargets;

					if (!Array.isArray(aTargets)) {
						aTargets = [aTargets];
					}

					for (j = 0, jLen = aTargets.length; j < jLen; j++) {
						if (typeof aTargets[j] === 'number' && aTargets[j] >= 0) {
							/* Add columns that we don't yet know about */
							while (columns.length <= aTargets[j]) {
								_fnAddColumn(oSettings);
							}

							/* Integer, basic index */
							fn(aTargets[j], def);
						}
						else if (typeof aTargets[j] === 'number' && aTargets[j] < 0) {
							/* Negative integer, right to left column counting */
							fn(columns.length + aTargets[j], def);
						}
						else if (typeof aTargets[j] === 'string') {
							/* Class name matching on TH element */
							for (k = 0, kLen = columns.length; k < kLen; k++) {
								if (aTargets[j] == "_all" ||
									$(columns[k].nTh).hasClass(aTargets[j])) {
									fn(k, def);
								}
							}
						}
					}
				}
			}

			// Statically defined columns array
			if (aoCols) {
				for (i = 0, iLen = aoCols.length; i < iLen; i++) {
					fn(i, aoCols[i]);
				}
			}
		}

		/**
		 * Add a data array to the table, creating DOM node etc. This is the parallel to
		 * _fnGatherData, but for adding rows from a Javascript source, rather than a
		 * DOM source.
		 *  @param {object} oSettings dataTables settings object
		 *  @param {array} aData data array to be added
		 *  @param {node} [nTr] TR element to add to the table - optional. If not given,
		 *    DataTables will create a row automatically
		 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
		 *    if nTr is.
		 *  @returns {int} >=0 if successful (index of new aoData entry), -1 if failed
		 *  @memberof DataTable#oApi
		 */
		function _fnAddData(oSettings, aDataIn, nTr, anTds) {
			/* Create the object for storing information about this new row */
			var iRow = oSettings.aoData.length;
			var oData = $.extend(true, {}, DataTable.models.oRow, {
				src: nTr ? 'dom' : 'data',
				idx: iRow
			});

			oData._aData = aDataIn;
			oSettings.aoData.push(oData);

			/* Create the cells */
			var nTd, sThisType;
			var columns = oSettings.aoColumns;

			// Invalidate the column types as the new data needs to be revalidated
			for (var i = 0, iLen = columns.length; i < iLen; i++) {
				columns[i].sType = null;
			}

			/* Add to the display array */
			oSettings.aiDisplayMaster.push(iRow);

			var id = oSettings.rowIdFn(aDataIn);
			if (id !== undefined) {
				oSettings.aIds[id] = oData;
			}

			/* Create the DOM information, or register it if already present */
			if (nTr || !oSettings.oFeatures.bDeferRender) {
				_fnCreateTr(oSettings, iRow, nTr, anTds);
			}

			return iRow;
		}


		/**
		 * Add one or more TR elements to the table. Generally we'd expect to
		 * use this for reading data from a DOM sourced table, but it could be
		 * used for an TR element. Note that if a TR is given, it is used (i.e.
		 * it is not cloned).
		 *  @param {object} settings dataTables settings object
		 *  @param {array|node|jQuery} trs The TR element(s) to add to the table
		 *  @returns {array} Array of indexes for the added rows
		 *  @memberof DataTable#oApi
		 */
		function _fnAddTr(settings, trs) {
			var row;

			// Allow an individual node to be passed in
			if (!(trs instanceof $)) {
				trs = $(trs);
			}

			return trs.map(function (i, el) {
				row = _fnGetRowElements(settings, el);
				return _fnAddData(settings, row.data, el, row.cells);
			});
		}


		/**
		 * Take a TR element and convert it to an index in aoData
		 *  @param {object} oSettings dataTables settings object
		 *  @param {node} n the TR element to find
		 *  @returns {int} index if the node is found, null if not
		 *  @memberof DataTable#oApi
		 */
		function _fnNodeToDataIndex(oSettings, n) {
			return (n._DT_RowIndex !== undefined) ? n._DT_RowIndex : null;
		}


		/**
		 * Take a TD element and convert it into a column data index (not the visible index)
		 *  @param {object} oSettings dataTables settings object
		 *  @param {int} iRow The row number the TD/TH can be found in
		 *  @param {node} n The TD/TH element to find
		 *  @returns {int} index if the node is found, -1 if not
		 *  @memberof DataTable#oApi
		 */
		function _fnNodeToColumnIndex(oSettings, iRow, n) {
			return $.inArray(n, oSettings.aoData[iRow].anCells);
		}


		/**
		 * Get the data for a given cell from the internal cache, taking into account data mapping
		 *  @param {object} settings dataTables settings object
		 *  @param {int} rowIdx aoData row id
		 *  @param {int} colIdx Column index
		 *  @param {string} type data get type ('display', 'type' 'filter|search' 'sort|order')
		 *  @returns {*} Cell data
		 *  @memberof DataTable#oApi
		 */
		function _fnGetCellData(settings, rowIdx, colIdx, type) {
			if (type === 'search') {
				type = 'filter';
			}
			else if (type === 'order') {
				type = 'sort';
			}

			var draw = settings.iDraw;
			var col = settings.aoColumns[colIdx];
			var rowData = settings.aoData[rowIdx]._aData;
			var defaultContent = col.sDefaultContent;
			var cellData = col.fnGetData(rowData, type, {
				settings: settings,
				row: rowIdx,
				col: colIdx
			});

			if (cellData === undefined) {
				if (settings.iDrawError != draw && defaultContent === null) {
					_fnLog(settings, 0, "Requested unknown parameter " +
						(typeof col.mData == 'function' ? '{function}' : "'" + col.mData + "'") +
						" for row " + rowIdx + ", column " + colIdx, 4);
					settings.iDrawError = draw;
				}
				return defaultContent;
			}

			// When the data source is null and a specific data type is requested (i.e.
			// not the original data), we can use default column data
			if ((cellData === rowData || cellData === null) && defaultContent !== null && type !== undefined) {
				cellData = defaultContent;
			}
			else if (typeof cellData === 'function') {
				// If the data source is a function, then we run it and use the return,
				// executing in the scope of the data object (for instances)
				return cellData.call(rowData);
			}

			if (cellData === null && type === 'display') {
				return '';
			}

			if (type === 'filter') {
				var fomatters = DataTable.ext.type.search;

				if (fomatters[col.sType]) {
					cellData = fomatters[col.sType](cellData);
				}
			}

			return cellData;
		}


		/**
		 * Set the value for a specific cell, into the internal data cache
		 *  @param {object} settings dataTables settings object
		 *  @param {int} rowIdx aoData row id
		 *  @param {int} colIdx Column index
		 *  @param {*} val Value to set
		 *  @memberof DataTable#oApi
		 */
		function _fnSetCellData(settings, rowIdx, colIdx, val) {
			var col = settings.aoColumns[colIdx];
			var rowData = settings.aoData[rowIdx]._aData;

			col.fnSetData(rowData, val, {
				settings: settings,
				row: rowIdx,
				col: colIdx
			});
		}


		// Private variable that is used to match action syntax in the data property object
		var __reArray = /\[.*?\]$/;
		var __reFn = /\(\)$/;

		/**
		 * Split string on periods, taking into account escaped periods
		 * @param  {string} str String to split
		 * @return {array} Split string
		 */
		function _fnSplitObjNotation(str) {
			return $.map(str.match(/(\\.|[^\.])+/g) || [''], function (s) {
				return s.replace(/\\\./g, '.');
			});
		}


		/**
		 * Return a function that can be used to get data from a source object, taking
		 * into account the ability to use nested objects as a source
		 *  @param {string|int|function} mSource The data source for the object
		 *  @returns {function} Data get function
		 *  @memberof DataTable#oApi
		 */
		var _fnGetObjectDataFn = DataTable.util.get;


		/**
		 * Return a function that can be used to set data from a source object, taking
		 * into account the ability to use nested objects as a source
		 *  @param {string|int|function} mSource The data source for the object
		 *  @returns {function} Data set function
		 *  @memberof DataTable#oApi
		 */
		var _fnSetObjectDataFn = DataTable.util.set;


		/**
		 * Return an array with the full table data
		 *  @param {object} oSettings dataTables settings object
		 *  @returns array {array} aData Master data array
		 *  @memberof DataTable#oApi
		 */
		function _fnGetDataMaster(settings) {
			return _pluck(settings.aoData, '_aData');
		}


		/**
		 * Nuke the table
		 *  @param {object} oSettings dataTables settings object
		 *  @memberof DataTable#oApi
		 */
		function _fnClearTable(settings) {
			settings.aoData.length = 0;
			settings.aiDisplayMaster.length = 0;
			settings.aiDisplay.length = 0;
			settings.aIds = {};
		}


		/**
		* Take an array of integers (index array) and remove a target integer (value - not
		* the key!)
		*  @param {array} a Index array to target
		*  @param {int} iTarget value to find
		*  @memberof DataTable#oApi
		*/
		function _fnDeleteIndex(a, iTarget, splice) {
			var iTargetIndex = -1;

			for (var i = 0, iLen = a.length; i < iLen; i++) {
				if (a[i] == iTarget) {
					iTargetIndex = i;
				}
				else if (a[i] > iTarget) {
					a[i]--;
				}
			}

			if (iTargetIndex != -1 && splice === undefined) {
				a.splice(iTargetIndex, 1);
			}
		}


		/**
		 * Mark cached data as invalid such that a re-read of the data will occur when
		 * the cached data is next requested. Also update from the data source object.
		 *
		 * @param {object} settings DataTables settings object
		 * @param {int}    rowIdx   Row index to invalidate
		 * @param {string} [src]    Source to invalidate from: undefined, 'auto', 'dom'
		 *     or 'data'
		 * @param {int}    [colIdx] Column index to invalidate. If undefined the whole
		 *     row will be invalidated
		 * @memberof DataTable#oApi
		 *
		 * @todo For the modularisation of v1.11 this will need to become a callback, so
		 *   the sort and filter methods can subscribe to it. That will required
		 *   initialisation options for sorting, which is why it is not already baked in
		 */
		function _fnInvalidate(settings, rowIdx, src, colIdx) {
			var row = settings.aoData[rowIdx];
			var i, ien;
			var cellWrite = function (cell, col) {
				// This is very frustrating, but in IE if you just write directly
				// to innerHTML, and elements that are overwritten are GC'ed,
				// even if there is a reference to them elsewhere
				while (cell.childNodes.length) {
					cell.removeChild(cell.firstChild);
				}

				cell.innerHTML = _fnGetCellData(settings, rowIdx, col, 'display');
			};

			// Are we reading last data from DOM or the data object?
			if (src === 'dom' || ((!src || src === 'auto') && row.src === 'dom')) {
				// Read the data from the DOM
				row._aData = _fnGetRowElements(
					settings, row, colIdx, colIdx === undefined ? undefined : row._aData
				)
					.data;
			}
			else {
				// Reading from data object, update the DOM
				var cells = row.anCells;

				if (cells) {
					if (colIdx !== undefined) {
						cellWrite(cells[colIdx], colIdx);
					}
					else {
						for (i = 0, ien = cells.length; i < ien; i++) {
							cellWrite(cells[i], i);
						}
					}
				}
			}

			// For both row and cell invalidation, the cached data for sorting and
			// filtering is nulled out
			row._aSortData = null;
			row._aFilterData = null;

			// Invalidate the type for a specific column (if given) or all columns since
			// the data might have changed
			var cols = settings.aoColumns;
			if (colIdx !== undefined) {
				cols[colIdx].sType = null;
			}
			else {
				for (i = 0, ien = cols.length; i < ien; i++) {
					cols[i].sType = null;
				}

				// Update DataTables special `DT_*` attributes for the row
				_fnRowAttributes(settings, row);
			}
		}


		/**
		 * Build a data source object from an HTML row, reading the contents of the
		 * cells that are in the row.
		 *
		 * @param {object} settings DataTables settings object
		 * @param {node|object} TR element from which to read data or existing row
		 *   object from which to re-read the data from the cells
		 * @param {int} [colIdx] Optional column index
		 * @param {array|object} [d] Data source object. If `colIdx` is given then this
		 *   parameter should also be given and will be used to write the data into.
		 *   Only the column in question will be written
		 * @returns {object} Object with two parameters: `data` the data read, in
		 *   document order, and `cells` and array of nodes (they can be useful to the
		 *   caller, so rather than needing a second traversal to get them, just return
		 *   them from here).
		 * @memberof DataTable#oApi
		 */
		function _fnGetRowElements(settings, row, colIdx, d) {
			var
				tds = [],
				td = row.firstChild,
				name, col, o, i = 0, contents,
				columns = settings.aoColumns,
				objectRead = settings._rowReadObject;

			// Allow the data object to be passed in, or construct
			d = d !== undefined ?
				d :
				objectRead ?
					{} :
					[];

			var attr = function (str, td) {
				if (typeof str === 'string') {
					var idx = str.indexOf('@');

					if (idx !== -1) {
						var attr = str.substring(idx + 1);
						var setter = _fnSetObjectDataFn(str);
						setter(d, td.getAttribute(attr));
					}
				}
			};

			// Read data from a cell and store into the data object
			var cellProcess = function (cell) {
				if (colIdx === undefined || colIdx === i) {
					col = columns[i];
					contents = (cell.innerHTML).trim();

					if (col && col._bAttrSrc) {
						var setter = _fnSetObjectDataFn(col.mData._);
						setter(d, contents);

						attr(col.mData.sort, cell);
						attr(col.mData.type, cell);
						attr(col.mData.filter, cell);
					}
					else {
						// Depending on the `data` option for the columns the data can
						// be read to either an object or an array.
						if (objectRead) {
							if (!col._setter) {
								// Cache the setter function
								col._setter = _fnSetObjectDataFn(col.mData);
							}
							col._setter(d, contents);
						}
						else {
							d[i] = contents;
						}
					}
				}

				i++;
			};

			if (td) {
				// `tr` element was passed in
				while (td) {
					name = td.nodeName.toUpperCase();

					if (name == "TD" || name == "TH") {
						cellProcess(td);
						tds.push(td);
					}

					td = td.nextSibling;
				}
			}
			else {
				// Existing row object passed in
				tds = row.anCells;

				for (var j = 0, jen = tds.length; j < jen; j++) {
					cellProcess(tds[j]);
				}
			}

			// Read the ID from the DOM if present
			var rowNode = row.firstChild ? row : row.nTr;

			if (rowNode) {
				var id = rowNode.getAttribute('id');

				if (id) {
					_fnSetObjectDataFn(settings.rowId)(d, id);
				}
			}

			return {
				data: d,
				cells: tds
			};
		}
		/**
		 * Create a new TR element (and it's TD children) for a row
		 *  @param {object} oSettings dataTables settings object
		 *  @param {int} iRow Row to consider
		 *  @param {node} [nTrIn] TR element to add to the table - optional. If not given,
		 *    DataTables will create a row automatically
		 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
		 *    if nTr is.
		 *  @memberof DataTable#oApi
		 */
		function _fnCreateTr(oSettings, iRow, nTrIn, anTds) {
			var
				row = oSettings.aoData[iRow],
				rowData = row._aData,
				cells = [],
				nTr, nTd, oCol,
				i, iLen, create;

			if (row.nTr === null) {
				nTr = nTrIn || document.createElement('tr');

				row.nTr = nTr;
				row.anCells = cells;

				/* Use a private property on the node to allow reserve mapping from the node
				 * to the aoData array for fast look up
				 */
				nTr._DT_RowIndex = iRow;

				/* Special parameters can be given by the data source to be used on the row */
				_fnRowAttributes(oSettings, row);

				/* Process each column */
				for (i = 0, iLen = oSettings.aoColumns.length; i < iLen; i++) {
					oCol = oSettings.aoColumns[i];
					create = nTrIn ? false : true;

					nTd = create ? document.createElement(oCol.sCellType) : anTds[i];

					if (!nTd) {
						_fnLog(oSettings, 0, 'Incorrect column count', 18);
					}

					nTd._DT_CellIndex = {
						row: iRow,
						column: i
					};

					cells.push(nTd);

					// Need to create the HTML if new, or if a rendering function is defined
					if (create || ((oCol.mRender || oCol.mData !== i) &&
						(!$.isPlainObject(oCol.mData) || oCol.mData._ !== i + '.display')
					)) {
						nTd.innerHTML = _fnGetCellData(oSettings, iRow, i, 'display');
					}

					/* Add user defined class */
					if (oCol.sClass) {
						nTd.className += ' ' + oCol.sClass;
					}

					// Visibility - add or remove as required
					if (oCol.bVisible && !nTrIn) {
						nTr.appendChild(nTd);
					}
					else if (!oCol.bVisible && nTrIn) {
						nTd.parentNode.removeChild(nTd);
					}

					if (oCol.fnCreatedCell) {
						oCol.fnCreatedCell.call(oSettings.oInstance,
							nTd, _fnGetCellData(oSettings, iRow, i), rowData, iRow, i
						);
					}
				}

				_fnCallbackFire(oSettings, 'aoRowCreatedCallback', null, [nTr, rowData, iRow, cells]);
			}
		}


		/**
		 * Add attributes to a row based on the special `DT_*` parameters in a data
		 * source object.
		 *  @param {object} settings DataTables settings object
		 *  @param {object} DataTables row object for the row to be modified
		 *  @memberof DataTable#oApi
		 */
		function _fnRowAttributes(settings, row) {
			var tr = row.nTr;
			var data = row._aData;

			if (tr) {
				var id = settings.rowIdFn(data);

				if (id) {
					tr.id = id;
				}

				if (data.DT_RowClass) {
					// Remove any classes added by DT_RowClass before
					var a = data.DT_RowClass.split(' ');
					row.__rowc = row.__rowc ?
						_unique(row.__rowc.concat(a)) :
						a;

					$(tr)
						.removeClass(row.__rowc.join(' '))
						.addClass(data.DT_RowClass);
				}

				if (data.DT_RowAttr) {
					$(tr).attr(data.DT_RowAttr);
				}

				if (data.DT_RowData) {
					$(tr).data(data.DT_RowData);
				}
			}
		}


		/**
		 * Create the HTML header for the table
		 *  @param {object} oSettings dataTables settings object
		 *  @memberof DataTable#oApi
		 */
		function _fnBuildHead(oSettings) {
			var i, ien, cell, row, column;
			var thead = oSettings.nTHead;
			var tfoot = oSettings.nTFoot;
			var createHeader = $('th, td', thead).length === 0;
			var classes = oSettings.oClasses;
			var columns = oSettings.aoColumns;

			if (createHeader) {
				row = $('<tr/>').appendTo(thead);
			}

			for (i = 0, ien = columns.length; i < ien; i++) {
				column = columns[i];
				cell = $(column.nTh).addClass(column.sClass);

				if (createHeader) {
					cell.appendTo(row);
				}

				// 1.11 move into sorting
				if (oSettings.oFeatures.bSort) {
					cell.addClass(column.sSortingClass);

					if (column.bSortable !== false) {
						cell
							.attr('tabindex', oSettings.iTabIndex)
							.attr('aria-controls', oSettings.sTableId);

						_fnSortAttachListener(oSettings, column.nTh, i);
					}
				}

				if (column.sTitle != cell[0].innerHTML) {
					cell.html(column.sTitle);
				}

				_fnRenderer(oSettings, 'header')(
					oSettings, cell, column, classes
				);
			}

			if (createHeader) {
				_fnDetectHeader(oSettings.aoHeader, thead);
			}

			/* Deal with the footer - add classes if required */
			$(thead).children('tr').children('th, td').addClass(classes.sHeaderTH);
			$(tfoot).children('tr').children('th, td').addClass(classes.sFooterTH);

			// Cache the footer cells. Note that we only take the cells from the first
			// row in the footer. If there is more than one row the user wants to
			// interact with, they need to use the table().foot() method. Note also this
			// allows cells to be used for multiple columns using colspan
			if (tfoot !== null) {
				var cells = oSettings.aoFooter[0];

				for (i = 0, ien = cells.length; i < ien; i++) {
					column = columns[i];

					if (column) {
						column.nTf = cells[i].cell;

						if (column.sClass) {
							$(column.nTf).addClass(column.sClass);
						}
					}
					else {
						_fnLog(oSettings, 0, 'Incorrect column count', 18);
					}
				}
			}
		}


		/**
		 * Draw the header (or footer) element based on the column visibility states. The
		 * methodology here is to use the layout array from _fnDetectHeader, modified for
		 * the instantaneous column visibility, to construct the new layout. The grid is
		 * traversed over cell at a time in a rows x columns grid fashion, although each
		 * cell insert can cover multiple elements in the grid - which is tracks using the
		 * aApplied array. Cell inserts in the grid will only occur where there isn't
		 * already a cell in that position.
		 *  @param {object} oSettings dataTables settings object
		 *  @param array {objects} aoSource Layout array from _fnDetectHeader
		 *  @param {boolean} [bIncludeHidden=false] If true then include the hidden columns in the calc,
		 *  @memberof DataTable#oApi
		 */
		function _fnDrawHead(oSettings, aoSource, bIncludeHidden) {
			var i, iLen, j, jLen, k, kLen, n, nLocalTr;
			var aoLocal = [];
			var aApplied = [];
			var iColumns = oSettings.aoColumns.length;
			var iRowspan, iColspan;

			if (!aoSource) {
				return;
			}

			if (bIncludeHidden === undefined) {
				bIncludeHidden = false;
			}

			/* Make a copy of the master layout array, but without the visible columns in it */
			for (i = 0, iLen = aoSource.length; i < iLen; i++) {
				aoLocal[i] = aoSource[i].slice();
				aoLocal[i].nTr = aoSource[i].nTr;

				/* Remove any columns which are currently hidden */
				for (j = iColumns - 1; j >= 0; j--) {
					if (!oSettings.aoColumns[j].bVisible && !bIncludeHidden) {
						aoLocal[i].splice(j, 1);
					}
				}

				/* Prep the applied array - it needs an element for each row */
				aApplied.push([]);
			}

			for (i = 0, iLen = aoLocal.length; i < iLen; i++) {
				nLocalTr = aoLocal[i].nTr;

				/* All cells are going to be replaced, so empty out the row */
				if (nLocalTr) {
					while ((n = nLocalTr.firstChild)) {
						nLocalTr.removeChild(n);
					}
				}

				for (j = 0, jLen = aoLocal[i].length; j < jLen; j++) {
					iRowspan = 1;
					iColspan = 1;

					/* Check to see if there is already a cell (row/colspan) covering our target
					 * insert point. If there is, then there is nothing to do.
					 */
					if (aApplied[i][j] === undefined) {
						nLocalTr.appendChild(aoLocal[i][j].cell);
						aApplied[i][j] = 1;

						/* Expand the cell to cover as many rows as needed */
						while (aoLocal[i + iRowspan] !== undefined &&
							aoLocal[i][j].cell == aoLocal[i + iRowspan][j].cell) {
							aApplied[i + iRowspan][j] = 1;
							iRowspan++;
						}

						/* Expand the cell to cover as many columns as needed */
						while (aoLocal[i][j + iColspan] !== undefined &&
							aoLocal[i][j].cell == aoLocal[i][j + iColspan].cell) {
							/* Must update the applied array over the rows for the columns */
							for (k = 0; k < iRowspan; k++) {
								aApplied[i + k][j + iColspan] = 1;
							}
							iColspan++;
						}

						/* Do the actual expansion in the DOM */
						$(aoLocal[i][j].cell)
							.attr('rowspan', iRowspan)
							.attr('colspan', iColspan);
					}
				}
			}
		}


		/**
		 * Insert the required TR nodes into the table for display
		 *  @param {object} oSettings dataTables settings object
		 *  @param ajaxComplete true after ajax call to complete rendering
		 *  @memberof DataTable#oApi
		 */
		function _fnDraw(oSettings, ajaxComplete) {
			// Allow for state saving and a custom start position
			_fnStart(oSettings);

			/* Provide a pre-callback function which can be used to cancel the draw is false is returned */
			var aPreDraw = _fnCallbackFire(oSettings, 'aoPreDrawCallback', 'preDraw', [oSettings]);
			if ($.inArray(false, aPreDraw) !== -1) {
				_fnProcessingDisplay(oSettings, false);
				return;
			}

			var anRows = [];
			var iRowCount = 0;
			var asStripeClasses = oSettings.asStripeClasses;
			var iStripes = asStripeClasses.length;
			var oLang = oSettings.oLanguage;
			var bServerSide = _fnDataSource(oSettings) == 'ssp';
			var aiDisplay = oSettings.aiDisplay;
			var iDisplayStart = oSettings._iDisplayStart;
			var iDisplayEnd = oSettings.fnDisplayEnd();

			oSettings.bDrawing = true;

			/* Server-side processing draw intercept */
			if (oSettings.bDeferLoading) {
				oSettings.bDeferLoading = false;
				oSettings.iDraw++;
				_fnProcessingDisplay(oSettings, false);
			}
			else if (!bServerSide) {
				oSettings.iDraw++;
			}
			else if (!oSettings.bDestroying && !ajaxComplete) {
				_fnAjaxUpdate(oSettings);
				return;
			}

			if (aiDisplay.length !== 0) {
				var iStart = bServerSide ? 0 : iDisplayStart;
				var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd;

				for (var j = iStart; j < iEnd; j++) {
					var iDataIndex = aiDisplay[j];
					var aoData = oSettings.aoData[iDataIndex];
					if (aoData.nTr === null) {
						_fnCreateTr(oSettings, iDataIndex);
					}

					var nRow = aoData.nTr;

					/* Remove the old striping classes and then add the new one */
					if (iStripes !== 0) {
						var sStripe = asStripeClasses[iRowCount % iStripes];
						if (aoData._sRowStripe != sStripe) {
							$(nRow).removeClass(aoData._sRowStripe).addClass(sStripe);
							aoData._sRowStripe = sStripe;
						}
					}

					// Row callback functions - might want to manipulate the row
					// iRowCount and j are not currently documented. Are they at all
					// useful?
					_fnCallbackFire(oSettings, 'aoRowCallback', null,
						[nRow, aoData._aData, iRowCount, j, iDataIndex]);

					anRows.push(nRow);
					iRowCount++;
				}
			}
			else {
				/* Table is empty - create a row with an empty message in it */
				var sZero = oLang.sZeroRecords;
				if (oSettings.iDraw == 1 && _fnDataSource(oSettings) == 'ajax') {
					sZero = oLang.sLoadingRecords;
				}
				else if (oLang.sEmptyTable && oSettings.fnRecordsTotal() === 0) {
					sZero = oLang.sEmptyTable;
				}

				anRows[0] = $('<tr/>', { 'class': iStripes ? asStripeClasses[0] : '' })
					.append($('<td />', {
						'valign': 'top',
						'colSpan': _fnVisbleColumns(oSettings),
						'class': oSettings.oClasses.sRowEmpty
					}).html(sZero))[0];
			}

			/* Header and footer callbacks */
			_fnCallbackFire(oSettings, 'aoHeaderCallback', 'header', [$(oSettings.nTHead).children('tr')[0],
			_fnGetDataMaster(oSettings), iDisplayStart, iDisplayEnd, aiDisplay]);

			_fnCallbackFire(oSettings, 'aoFooterCallback', 'footer', [$(oSettings.nTFoot).children('tr')[0],
			_fnGetDataMaster(oSettings), iDisplayStart, iDisplayEnd, aiDisplay]);

			var body = $(oSettings.nTBody);

			body.children().detach();
			body.append($(anRows));

			/* Call all required callback functions for the end of a draw */
			_fnCallbackFire(oSettings, 'aoDrawCallback', 'draw', [oSettings]);

			/* Draw is complete, sorting and filtering must be as well */
			oSettings.bSorted = false;
			oSettings.bFiltered = false;
			oSettings.bDrawing = false;
		}


		/**
		 * Redraw the table - taking account of the various features which are enabled
		 *  @param {object} oSettings dataTables settings object
		 *  @param {boolean} [holdPosition] Keep the current paging position. By default
		 *    the paging is reset to the first page
		 *  @memberof DataTable#oApi
		 */
		function _fnReDraw(settings, holdPosition) {
			var
				features = settings.oFeatures,
				sort = features.bSort,
				filter = features.bFilter;

			if (sort) {
				_fnSort(settings);
			}

			if (filter) {
				_fnFilterComplete(settings, settings.oPreviousSearch);
			}
			else {
				// No filtering, so we want to just use the display master
				settings.aiDisplay = settings.aiDisplayMaster.slice();
			}

			if (holdPosition !== true) {
				settings._iDisplayStart = 0;
			}

			// Let any modules know about the draw hold position state (used by
			// scrolling internally)
			settings._drawHold = holdPosition;

			_fnDraw(settings);

			settings._drawHold = false;
		}


		/**
		 * Add the options to the page HTML for the table
		 *  @param {object} oSettings dataTables settings object
		 *  @memberof DataTable#oApi
		 */
		function _fnAddOptionsHtml(oSettings) {
			var classes = oSettings.oClasses;
			var table = $(oSettings.nTable);
			var holding = $('<div/>').insertBefore(table); // Holding element for speed
			var features = oSettings.oFeatures;

			// All DataTables are wrapped in a div
			var insert = $('<div/>', {
				id: oSettings.sTableId + '_wrapper',
				'class': classes.sWrapper + (oSettings.nTFoot ? '' : ' ' + classes.sNoFooter)
			});

			oSettings.nHolding = holding[0];
			oSettings.nTableWrapper = insert[0];
			oSettings.nTableReinsertBefore = oSettings.nTable.nextSibling;

			/* Loop over the user set positioning and place the elements as needed */
			var aDom = oSettings.sDom.split('');
			var featureNode, cOption, nNewNode, cNext, sAttr, j;
			for (var i = 0; i < aDom.length; i++) {
				featureNode = null;
				cOption = aDom[i];

				if (cOption == '<') {
					/* New container div */
					nNewNode = $('<div/>')[0];

					/* Check to see if we should append an id and/or a class name to the container */
					cNext = aDom[i + 1];
					if (cNext == "'" || cNext == '"') {
						sAttr = "";
						j = 2;
						while (aDom[i + j] != cNext) {
							sAttr += aDom[i + j];
							j++;
						}

						/* Replace jQuery UI constants @todo depreciated */
						if (sAttr == "H") {
							sAttr = classes.sJUIHeader;
						}
						else if (sAttr == "F") {
							sAttr = classes.sJUIFooter;
						}

						/* The attribute can be in the format of "#id.class", "#id" or "class" This logic
						 * breaks the string into parts and applies them as needed
						 */
						if (sAttr.indexOf('.') != -1) {
							var aSplit = sAttr.split('.');
							nNewNode.id = aSplit[0].substr(1, aSplit[0].length - 1);
							nNewNode.className = aSplit[1];
						}
						else if (sAttr.charAt(0) == "#") {
							nNewNode.id = sAttr.substr(1, sAttr.length - 1);
						}
						else {
							nNewNode.className = sAttr;
						}

						i += j; /* Move along the position array */
					}

					insert.append(nNewNode);
					insert = $(nNewNode);
				}
				else if (cOption == '>') {
					/* End container div */
					insert = insert.parent();
				}
				// @todo Move options into their own plugins?
				else if (cOption == 'l' && features.bPaginate && features.bLengthChange) {
					/* Length */
					featureNode = _fnFeatureHtmlLength(oSettings);
				}
				else if (cOption == 'f' && features.bFilter) {
					/* Filter */
					featureNode = _fnFeatureHtmlFilter(oSettings);
				}
				else if (cOption == 'r' && features.bProcessing) {
					/* pRocessing */
					featureNode = _fnFeatureHtmlProcessing(oSettings);
				}
				else if (cOption == 't') {
					/* Table */
					featureNode = _fnFeatureHtmlTable(oSettings);
				}
				else if (cOption == 'i' && features.bInfo) {
					/* Info */
					featureNode = _fnFeatureHtmlInfo(oSettings);
				}
				else if (cOption == 'p' && features.bPaginate) {
					/* Pagination */
					featureNode = _fnFeatureHtmlPaginate(oSettings);
				}
				else if (DataTable.ext.feature.length !== 0) {
					/* Plug-in features */
					var aoFeatures = DataTable.ext.feature;
					for (var k = 0, kLen = aoFeatures.length; k < kLen; k++) {
						if (cOption == aoFeatures[k].cFeature) {
							featureNode = aoFeatures[k].fnInit(oSettings);
							break;
						}
					}
				}

				/* Add to the 2D features array */
				if (featureNode) {
					var aanFeatures = oSettings.aanFeatures;

					if (!aanFeatures[cOption]) {
						aanFeatures[cOption] = [];
					}

					aanFeatures[cOption].push(featureNode);
					insert.append(featureNode);
				}
			}

			/* Built our DOM structure - replace the holding div with what we want */
			holding.replaceWith(insert);
			oSettings.nHolding = null;
		}


		/**
		 * Use the DOM source to create up an array of header cells. The idea here is to
		 * create a layout grid (array) of rows x columns, which contains a reference
		 * to the cell that that point in the grid (regardless of col/rowspan), such that
		 * any column / row could be removed and the new grid constructed
		 *  @param array {object} aLayout Array to store the calculated layout in
		 *  @param {node} nThead The header/footer element for the table
		 *  @memberof DataTable#oApi
		 */
		function _fnDetectHeader(aLayout, nThead) {
			var nTrs = $(nThead).children('tr');
			var nTr, nCell;
			var i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan;
			var bUnique;
			var fnShiftCol = function (a, i, j) {
				var k = a[i];
				while (k[j]) {
					j++;
				}
				return j;
			};

			aLayout.splice(0, aLayout.length);

			/* We know how many rows there are in the layout - so prep it */
			for (i = 0, iLen = nTrs.length; i < iLen; i++) {
				aLayout.push([]);
			}

			/* Calculate a layout array */
			for (i = 0, iLen = nTrs.length; i < iLen; i++) {
				nTr = nTrs[i];
				iColumn = 0;

				/* For every cell in the row... */
				nCell = nTr.firstChild;
				while (nCell) {
					if (nCell.nodeName.toUpperCase() == "TD" ||
						nCell.nodeName.toUpperCase() == "TH") {
						/* Get the col and rowspan attributes from the DOM and sanitise them */
						iColspan = nCell.getAttribute('colspan') * 1;
						iRowspan = nCell.getAttribute('rowspan') * 1;
						iColspan = (!iColspan || iColspan === 0 || iColspan === 1) ? 1 : iColspan;
						iRowspan = (!iRowspan || iRowspan === 0 || iRowspan === 1) ? 1 : iRowspan;

						/* There might be colspan cells already in this row, so shift our target
						 * accordingly
						 */
						iColShifted = fnShiftCol(aLayout, i, iColumn);

						/* Cache calculation for unique columns */
						bUnique = iColspan === 1 ? true : false;

						/* If there is col / rowspan, copy the information into the layout grid */
						for (l = 0; l < iColspan; l++) {
							for (k = 0; k < iRowspan; k++) {
								aLayout[i + k][iColShifted + l] = {
									"cell": nCell,
									"unique": bUnique
								};
								aLayout[i + k].nTr = nTr;
							}
						}
					}
					nCell = nCell.nextSibling;
				}
			}
		}


		/**
		 * Get an array of unique th elements, one for each column
		 *  @param {object} oSettings dataTables settings object
		 *  @param {node} nHeader automatically detect the layout from this node - optional
		 *  @param {array} aLayout thead/tfoot layout from _fnDetectHeader - optional
		 *  @returns array {node} aReturn list of unique th's
		 *  @memberof DataTable#oApi
		 */
		function _fnGetUniqueThs(oSettings, nHeader, aLayout) {
			var aReturn = [];
			if (!aLayout) {
				aLayout = oSettings.aoHeader;
				if (nHeader) {
					aLayout = [];
					_fnDetectHeader(aLayout, nHeader);
				}
			}

			for (var i = 0, iLen = aLayout.length; i < iLen; i++) {
				for (var j = 0, jLen = aLayout[i].length; j < jLen; j++) {
					if (aLayout[i][j].unique &&
						(!aReturn[j] || !oSettings.bSortCellsTop)) {
						aReturn[j] = aLayout[i][j].cell;
					}
				}
			}

			return aReturn;
		}

		/**
		 * Set the start position for draw
		 *  @param {object} oSettings dataTables settings object
		 */
		function _fnStart(oSettings) {
			var bServerSide = _fnDataSource(oSettings) == 'ssp';
			var iInitDisplayStart = oSettings.iInitDisplayStart;

			// Check and see if we have an initial draw position from state saving
			if (iInitDisplayStart !== undefined && iInitDisplayStart !== -1) {
				oSettings._iDisplayStart = bServerSide ?
					iInitDisplayStart :
					iInitDisplayStart >= oSettings.fnRecordsDisplay() ?
						0 :
						iInitDisplayStart;

				oSettings.iInitDisplayStart = -1;
			}
		}

		/**
		 * Create an Ajax call based on the table's settings, taking into account that
		 * parameters can have multiple forms, and backwards compatibility.
		 *
		 * @param {object} oSettings dataTables settings object
		 * @param {array} data Data to send to the server, required by
		 *     DataTables - may be augmented by developer callbacks
		 * @param {function} fn Callback function to run when data is obtained
		 */
		function _fnBuildAjax(oSettings, data, fn) {
			// Compatibility with 1.9-, allow fnServerData and event to manipulate
			_fnCallbackFire(oSettings, 'aoServerParams', 'serverParams', [data]);

			// Convert to object based for 1.10+ if using the old array scheme which can
			// come from server-side processing or serverParams
			if (data && Array.isArray(data)) {
				var tmp = {};
				var rbracket = /(.*?)\[\]$/;

				$.each(data, function (key, val) {
					var match = val.name.match(rbracket);

					if (match) {
						// Support for arrays
						var name = match[0];

						if (!tmp[name]) {
							tmp[name] = [];
						}
						tmp[name].push(val.value);
					}
					else {
						tmp[val.name] = val.value;
					}
				});
				data = tmp;
			}

			var ajaxData;
			var ajax = oSettings.ajax;
			var instance = oSettings.oInstance;
			var callback = function (json) {
				var status = oSettings.jqXHR
					? oSettings.jqXHR.status
					: null;

				if (json === null || (typeof status === 'number' && status == 204)) {
					json = {};
					_fnAjaxDataSrc(oSettings, json, []);
				}

				var error = json.error || json.sError;
				if (error) {
					_fnLog(oSettings, 0, error);
				}

				oSettings.json = json;

				_fnCallbackFire(oSettings, null, 'xhr', [oSettings, json, oSettings.jqXHR]);
				fn(json);
			};

			if ($.isPlainObject(ajax) && ajax.data) {
				ajaxData = ajax.data;

				var newData = typeof ajaxData === 'function' ?
					ajaxData(data, oSettings) :  // fn can manipulate data or return
					ajaxData;                      // an object object or array to merge

				// If the function returned something, use that alone
				data = typeof ajaxData === 'function' && newData ?
					newData :
					$.extend(true, data, newData);

				// Remove the data property as we've resolved it already and don't want
				// jQuery to do it again (it is restored at the end of the function)
				delete ajax.data;
			}

			var baseAjax = {
				"data": data,
				"success": callback,
				"dataType": "json",
				"cache": false,
				"type": oSettings.sServerMethod,
				"error": function (xhr, error, thrown) {
					var ret = _fnCallbackFire(oSettings, null, 'xhr', [oSettings, null, oSettings.jqXHR]);

					if ($.inArray(true, ret) === -1) {
						if (error == "parsererror") {
							_fnLog(oSettings, 0, 'Invalid JSON response', 1);
						}
						else if (xhr.readyState === 4) {
							_fnLog(oSettings, 0, 'Ajax error', 7);
						}
					}

					_fnProcessingDisplay(oSettings, false);
				}
			};

			// Store the data submitted for the API
			oSettings.oAjaxData = data;

			// Allow plug-ins and external processes to modify the data
			_fnCallbackFire(oSettings, null, 'preXhr', [oSettings, data]);

			if (oSettings.fnServerData) {
				// DataTables 1.9- compatibility
				oSettings.fnServerData.call(instance,
					oSettings.sAjaxSource,
					$.map(data, function (val, key) { // Need to convert back to 1.9 trad format
						return { name: key, value: val };
					}),
					callback,
					oSettings
				);
			}
			else if (oSettings.sAjaxSource || typeof ajax === 'string') {
				// DataTables 1.9- compatibility
				oSettings.jqXHR = $.ajax($.extend(baseAjax, {
					url: ajax || oSettings.sAjaxSource
				}));
			}
			else if (typeof ajax === 'function') {
				// Is a function - let the caller define what needs to be done
				oSettings.jqXHR = ajax.call(instance, data, callback, oSettings);
			}
			else {
				// Object to extend the base settings
				oSettings.jqXHR = $.ajax($.extend(baseAjax, ajax));

				// Restore for next time around
				ajax.data = ajaxData;
			}
		}


		/**
		 * Update the table using an Ajax call
		 *  @param {object} settings dataTables settings object
		 *  @returns {boolean} Block the table drawing or not
		 *  @memberof DataTable#oApi
		 */
		function _fnAjaxUpdate(settings) {
			settings.iDraw++;
			_fnProcessingDisplay(settings, true);

			_fnBuildAjax(
				settings,
				_fnAjaxParameters(settings),
				function (json) {
					_fnAjaxUpdateDraw(settings, json);
				}
			);
		}


		/**
		 * Build up the parameters in an object needed for a server-side processing
		 * request. Note that this is basically done twice, is different ways - a modern
		 * method which is used by default in DataTables 1.10 which uses objects and
		 * arrays, or the 1.9- method with is name / value pairs. 1.9 method is used if
		 * the sAjaxSource option is used in the initialisation, or the legacyAjax
		 * option is set.
		 *  @param {object} oSettings dataTables settings object
		 *  @returns {bool} block the table drawing or not
		 *  @memberof DataTable#oApi
		 */
		function _fnAjaxParameters(settings) {
			var
				columns = settings.aoColumns,
				columnCount = columns.length,
				features = settings.oFeatures,
				preSearch = settings.oPreviousSearch,
				preColSearch = settings.aoPreSearchCols,
				i, data = [], dataProp, column, columnSearch,
				sort = _fnSortFlatten(settings),
				displayStart = settings._iDisplayStart,
				displayLength = features.bPaginate !== false ?
					settings._iDisplayLength :
					-1;

			var param = function (name, value) {
				data.push({ 'name': name, 'value': value });
			};

			// DataTables 1.9- compatible method
			param('sEcho', settings.iDraw);
			param('iColumns', columnCount);
			param('sColumns', _pluck(columns, 'sName').join(','));
			param('iDisplayStart', displayStart);
			param('iDisplayLength', displayLength);

			// DataTables 1.10+ method
			var d = {
				draw: settings.iDraw,
				columns: [],
				order: [],
				start: displayStart,
				length: displayLength,
				search: {
					value: preSearch.sSearch,
					regex: preSearch.bRegex
				}
			};

			for (i = 0; i < columnCount; i++) {
				column = columns[i];
				columnSearch = preColSearch[i];
				dataProp = typeof column.mData == "function" ? 'function' : column.mData;

				d.columns.push({
					data: dataProp,
					name: column.sName,
					searchable: column.bSearchable,
					orderable: column.bSortable,
					search: {
						value: columnSearch.sSearch,
						regex: columnSearch.bRegex
					}
				});

				param("mDataProp_" + i, dataProp);

				if (features.bFilter) {
					param('sSearch_' + i, columnSearch.sSearch);
					param('bRegex_' + i, columnSearch.bRegex);
					param('bSearchable_' + i, column.bSearchable);
				}

				if (features.bSort) {
					param('bSortable_' + i, column.bSortable);
				}
			}

			if (features.bFilter) {
				param('sSearch', preSearch.sSearch);
				param('bRegex', preSearch.bRegex);
			}

			if (features.bSort) {
				$.each(sort, function (i, val) {
					d.order.push({ column: val.col, dir: val.dir });

					param('iSortCol_' + i, val.col);
					param('sSortDir_' + i, val.dir);
				});

				param('iSortingCols', sort.length);
			}

			// If the legacy.ajax parameter is null, then we automatically decide which
			// form to use, based on sAjaxSource
			var legacy = DataTable.ext.legacy.ajax;
			if (legacy === null) {
				return settings.sAjaxSource ? data : d;
			}

			// Otherwise, if legacy has been specified then we use that to decide on the
			// form
			return legacy ? data : d;
		}


		/**
		 * Data the data from the server (nuking the old) and redraw the table
		 *  @param {object} oSettings dataTables settings object
		 *  @param {object} json json data return from the server.
		 *  @param {string} json.sEcho Tracking flag for DataTables to match requests
		 *  @param {int} json.iTotalRecords Number of records in the data set, not accounting for filtering
		 *  @param {int} json.iTotalDisplayRecords Number of records in the data set, accounting for filtering
		 *  @param {array} json.aaData The data to display on this page
		 *  @param {string} [json.sColumns] Column ordering (sName, comma separated)
		 *  @memberof DataTable#oApi
		 */
		function _fnAjaxUpdateDraw(settings, json) {
			// v1.10 uses camelCase variables, while 1.9 uses Hungarian notation.
			// Support both
			var compat = function (old, modern) {
				return json[old] !== undefined ? json[old] : json[modern];
			};

			var data = _fnAjaxDataSrc(settings, json);
			var draw = compat('sEcho', 'draw');
			var recordsTotal = compat('iTotalRecords', 'recordsTotal');
			var recordsFiltered = compat('iTotalDisplayRecords', 'recordsFiltered');

			if (draw !== undefined) {
				// Protect against out of sequence returns
				if (draw * 1 < settings.iDraw) {
					return;
				}
				settings.iDraw = draw * 1;
			}

			// No data in returned object, so rather than an array, we show an empty table
			if (!data) {
				data = [];
			}

			_fnClearTable(settings);
			settings._iRecordsTotal = parseInt(recordsTotal, 10);
			settings._iRecordsDisplay = parseInt(recordsFiltered, 10);

			for (var i = 0, ien = data.length; i < ien; i++) {
				_fnAddData(settings, data[i]);
			}
			settings.aiDisplay = settings.aiDisplayMaster.slice();

			_fnDraw(settings, true);

			if (!settings._bInitComplete) {
				_fnInitComplete(settings, json);
			}

			_fnProcessingDisplay(settings, false);
		}


		/**
		 * Get the data from the JSON data source to use for drawing a table. Using
		 * `_fnGetObjectDataFn` allows the data to be sourced from a property of the
		 * source object, or from a processing function.
		 *  @param {object} oSettings dataTables settings object
		 *  @param  {object} json Data source object / array from the server
		 *  @return {array} Array of data to use
		 */
		function _fnAjaxDataSrc(oSettings, json, write) {
			var dataSrc = $.isPlainObject(oSettings.ajax) && oSettings.ajax.dataSrc !== undefined ?
				oSettings.ajax.dataSrc :
				oSettings.sAjaxDataProp; // Compatibility with 1.9-.

			if (!write) {
				if (dataSrc === 'data') {
					// If the default, then we still want to support the old style, and safely ignore
					// it if possible
					return json.aaData || json[dataSrc];
				}

				return dataSrc !== "" ?
					_fnGetObjectDataFn(dataSrc)(json) :
					json;
			}

			// set
			_fnSetObjectDataFn(dataSrc)(json, write);
		}

		/**
		 * Generate the node required for filtering text
		 *  @returns {node} Filter control element
		 *  @param {object} oSettings dataTables settings object
		 *  @memberof DataTable#oApi
		 */
		function _fnFeatureHtmlFilter(settings) {
			var classes = settings.oClasses;
			var tableId = settings.sTableId;
			var language = settings.oLanguage;
			var previousSearch = settings.oPreviousSearch;
			var features = settings.aanFeatures;
			var input = '<input type="search" class="' + classes.sFilterInput + '"/>';

			var str = language.sSearch;
			str = str.match(/_INPUT_/) ?
				str.replace('_INPUT_', input) :
				str + input;

			var filter = $('<div/>', {
				'id': !features.f ? tableId + '_filter' : null,
				'class': classes.sFilter
			})
				.append($('<label/>').append(str));

			var searchFn = function (event) {
				/* Update all other filter input elements for the new display */
				var n = features.f;
				var val = !this.value ? "" : this.value; // mental IE8 fix :-(
				if (previousSearch.return && event.key !== "Enter") {
					return;
				}
				/* Now do the filter */
				if (val != previousSearch.sSearch) {
					_fnFilterComplete(settings, {
						"sSearch": val,
						"bRegex": previousSearch.bRegex,
						"bSmart": previousSearch.bSmart,
						"bCaseInsensitive": previousSearch.bCaseInsensitive,
						"return": previousSearch.return
					});

					// Need to redraw, without resorting
					settings._iDisplayStart = 0;
					_fnDraw(settings);
				}
			};

			var searchDelay = settings.searchDelay !== null ?
				settings.searchDelay :
				_fnDataSource(settings) === 'ssp' ?
					400 :
					0;

			var jqFilter = $('input', filter)
				.val(previousSearch.sSearch)
				.attr('placeholder', language.sSearchPlaceholder)
				.on(
					'keyup.DT search.DT input.DT paste.DT cut.DT',
					searchDelay ?
						_fnThrottle(searchFn, searchDelay) :
						searchFn
				)
				.on('mouseup', function (e) {
					// Edge fix! Edge 17 does not trigger anything other than mouse events when clicking
					// on the clear icon (Edge bug 17584515). This is safe in other browsers as `searchFn`
					// checks the value to see if it has changed. In other browsers it won't have.
					setTimeout(function () {
						searchFn.call(jqFilter[0], e);
					}, 10);
				})
				.on('keypress.DT', function (e) {
					/* Prevent form submission */
					if (e.keyCode == 13) {
						return false;
					}
				})
				.attr('aria-controls', tableId);

			// Update the input elements whenever the table is filtered
			$(settings.nTable).on('search.dt.DT', function (ev, s) {
				if (settings === s) {
					// IE9 throws an 'unknown error' if document.activeElement is used
					// inside an iframe or frame...
					try {
						if (jqFilter[0] !== document.activeElement) {
							jqFilter.val(previousSearch.sSearch);
						}
					}
					catch (e) { }
				}
			});

			return filter[0];
		}


		/**
		 * Filter the table using both the global filter and column based filtering
		 *  @param {object} oSettings dataTables settings object
		 *  @param {object} oSearch search information
		 *  @param {int} [iForce] force a research of the master array (1) or not (undefined or 0)
		 *  @memberof DataTable#oApi
		 */
		function _fnFilterComplete(oSettings, oInput, iForce) {
			var oPrevSearch = oSettings.oPreviousSearch;
			var aoPrevSearch = oSettings.aoPreSearchCols;
			var fnSaveFilter = function (oFilter) {
				/* Save the filtering values */
				oPrevSearch.sSearch = oFilter.sSearch;
				oPrevSearch.bRegex = oFilter.bRegex;
				oPrevSearch.bSmart = oFilter.bSmart;
				oPrevSearch.bCaseInsensitive = oFilter.bCaseInsensitive;
				oPrevSearch.return = oFilter.return;
			};
			var fnRegex = function (o) {
				// Backwards compatibility with the bEscapeRegex option
				return o.bEscapeRegex !== undefined ? !o.bEscapeRegex : o.bRegex;
			};

			// Resolve any column types that are unknown due to addition or invalidation
			// @todo As per sort - can this be moved into an event handler?
			_fnColumnTypes(oSettings);

			/* In server-side processing all filtering is done by the server, so no point hanging around here */
			if (_fnDataSource(oSettings) != 'ssp') {
				/* Global filter */
				_fnFilter(oSettings, oInput.sSearch, iForce, fnRegex(oInput), oInput.bSmart, oInput.bCaseInsensitive, oInput.return);
				fnSaveFilter(oInput);

				/* Now do the individual column filter */
				for (var i = 0; i < aoPrevSearch.length; i++) {
					_fnFilterColumn(oSettings, aoPrevSearch[i].sSearch, i, fnRegex(aoPrevSearch[i]),
						aoPrevSearch[i].bSmart, aoPrevSearch[i].bCaseInsensitive);
				}

				/* Custom filtering */
				_fnFilterCustom(oSettings);
			}
			else {
				fnSaveFilter(oInput);
			}

			/* Tell the draw function we have been filtering */
			oSettings.bFiltered = true;
			_fnCallbackFire(oSettings, null, 'search', [oSettings]);
		}


		/**
		 * Apply custom filtering functions
		 *  @param {object} oSettings dataTables settings object
		 *  @memberof DataTable#oApi
		 */
		function _fnFilterCustom(settings) {
			var filters = DataTable.ext.search;
			var displayRows = settings.aiDisplay;
			var row, rowIdx;

			for (var i = 0, ien = filters.length; i < ien; i++) {
				var rows = [];

				// Loop over each row and see if it should be included
				for (var j = 0, jen = displayRows.length; j < jen; j++) {
					rowIdx = displayRows[j];
					row = settings.aoData[rowIdx];

					if (filters[i](settings, row._aFilterData, rowIdx, row._aData, j)) {
						rows.push(rowIdx);
					}
				}

				// So the array reference doesn't break set the results into the
				// existing array
				displayRows.length = 0;
				$.merge(displayRows, rows);
			}
		}


		/**
		 * Filter the table on a per-column basis
		 *  @param {object} oSettings dataTables settings object
		 *  @param {string} sInput string to filter on
		 *  @param {int} iColumn column to filter
		 *  @param {bool} bRegex treat search string as a regular expression or not
		 *  @param {bool} bSmart use smart filtering or not
		 *  @param {bool} bCaseInsensitive Do case insensitive matching or not
		 *  @memberof DataTable#oApi
		 */
		function _fnFilterColumn(settings, searchStr, colIdx, regex, smart, caseInsensitive) {
			if (searchStr === '') {
				return;
			}

			var data;
			var out = [];
			var display = settings.aiDisplay;
			var rpSearch = _fnFilterCreateSearch(searchStr, regex, smart, caseInsensitive);

			for (var i = 0; i < display.length; i++) {
				data = settings.aoData[display[i]]._aFilterData[colIdx];

				if (rpSearch.test(data)) {
					out.push(display[i]);
				}
			}

			settings.aiDisplay = out;
		}


		/**
		 * Filter the data table based on user input and draw the table
		 *  @param {object} settings dataTables settings object
		 *  @param {string} input string to filter on
		 *  @param {int} force optional - force a research of the master array (1) or not (undefined or 0)
		 *  @param {bool} regex treat as a regular expression or not
		 *  @param {bool} smart perform smart filtering or not
		 *  @param {bool} caseInsensitive Do case insensitive matching or not
		 *  @memberof DataTable#oApi
		 */
		function _fnFilter(settings, input, force, regex, smart, caseInsensitive) {
			var rpSearch = _fnFilterCreateSearch(input, regex, smart, caseInsensitive);
			var prevSearch = settings.oPreviousSearch.sSearch;
			var displayMaster = settings.aiDisplayMaster;
			var display, invalidated, i;
			var filtered = [];

			// Need to take account of custom filtering functions - always filter
			if (DataTable.ext.search.length !== 0) {
				force = true;
			}

			// Check if any of the rows were invalidated
			invalidated = _fnFilterData(settings);

			// If the input is blank - we just want the full data set
			if (input.length <= 0) {
				settings.aiDisplay = displayMaster.slice();
			}
			else {
				// New search - start from the master array
				if (invalidated ||
					force ||
					regex ||
					prevSearch.length > input.length ||
					input.indexOf(prevSearch) !== 0 ||
					settings.bSorted // On resort, the display master needs to be
					// re-filtered since indexes will have changed
				) {
					settings.aiDisplay = displayMaster.slice();
				}

				// Search the display array
				display = settings.aiDisplay;

				for (i = 0; i < display.length; i++) {
					if (rpSearch.test(settings.aoData[display[i]]._sFilterRow)) {
						filtered.push(display[i]);
					}
				}

				settings.aiDisplay = filtered;
			}
		}


		/**
		 * Build a regular expression object suitable for searching a table
		 *  @param {string} sSearch string to search for
		 *  @param {bool} bRegex treat as a regular expression or not
		 *  @param {bool} bSmart perform smart filtering or not
		 *  @param {bool} bCaseInsensitive Do case insensitive matching or not
		 *  @returns {RegExp} constructed object
		 *  @memberof DataTable#oApi
		 */
		function _fnFilterCreateSearch(search, regex, smart, caseInsensitive) {
			search = regex ?
				search :
				_fnEscapeRegex(search);

			if (smart) {
				/* For smart filtering we want to allow the search to work regardless of
				 * word order. We also want double quoted text to be preserved, so word
				 * order is important - a la google. So this is what we want to
				 * generate:
				 * 
				 * ^(?=.*?\bone\b)(?=.*?\btwo three\b)(?=.*?\bfour\b).*$
				 */
				var a = $.map(search.match(/"[^"]+"|[^ ]+/g) || [''], function (word) {
					if (word.charAt(0) === '"') {
						var m = word.match(/^"(.*)"$/);
						word = m ? m[1] : word;
					}

					return word.replace('"', '');
				});

				search = '^(?=.*?' + a.join(')(?=.*?') + ').*$';
			}

			return new RegExp(search, caseInsensitive ? 'i' : '');
		}


		/**
		 * Escape a string such that it can be used in a regular expression
		 *  @param {string} sVal string to escape
		 *  @returns {string} escaped string
		 *  @memberof DataTable#oApi
		 */
		var _fnEscapeRegex = DataTable.util.escapeRegex;

		var __filter_div = $('<div>')[0];
		var __filter_div_textContent = __filter_div.textContent !== undefined;

		// Update the filtering data for each row if needed (by invalidation or first run)
		function _fnFilterData(settings) {
			var columns = settings.aoColumns;
			var column;
			var i, j, ien, jen, filterData, cellData, row;
			var wasInvalidated = false;

			for (i = 0, ien = settings.aoData.length; i < ien; i++) {
				row = settings.aoData[i];

				if (!row._aFilterData) {
					filterData = [];

					for (j = 0, jen = columns.length; j < jen; j++) {
						column = columns[j];

						if (column.bSearchable) {
							cellData = _fnGetCellData(settings, i, j, 'filter');

							// Search in DataTables 1.10 is string based. In 1.11 this
							// should be altered to also allow strict type checking.
							if (cellData === null) {
								cellData = '';
							}

							if (typeof cellData !== 'string' && cellData.toString) {
								cellData = cellData.toString();
							}
						}
						else {
							cellData = '';
						}

						// If it looks like there is an HTML entity in the string,
						// attempt to decode it so sorting works as expected. Note that
						// we could use a single line of jQuery to do this, but the DOM
						// method used here is much faster http://jsperf.com/html-decode
						if (cellData.indexOf && cellData.indexOf('&') !== -1) {
							__filter_div.innerHTML = cellData;
							cellData = __filter_div_textContent ?
								__filter_div.textContent :
								__filter_div.innerText;
						}

						if (cellData.replace) {
							cellData = cellData.replace(/[\r\n\u2028]/g, '');
						}

						filterData.push(cellData);
					}

					row._aFilterData = filterData;
					row._sFilterRow = filterData.join('  ');
					wasInvalidated = true;
				}
			}

			return wasInvalidated;
		}


		/**
		 * Convert from the internal Hungarian notation to camelCase for external
		 * interaction
		 *  @param {object} obj Object to convert
		 *  @returns {object} Inverted object
		 *  @memberof DataTable#oApi
		 */
		function _fnSearchToCamel(obj) {
			return {
				search: obj.sSearch,
				smart: obj.bSmart,
				regex: obj.bRegex,
				caseInsensitive: obj.bCaseInsensitive
			};
		}



		/**
		 * Convert from camelCase notation to the internal Hungarian. We could use the
		 * Hungarian convert function here, but this is cleaner
		 *  @param {object} obj Object to convert
		 *  @returns {object} Inverted object
		 *  @memberof DataTable#oApi
		 */
		function _fnSearchToHung(obj) {
			return {
				sSearch: obj.search,
				bSmart: obj.smart,
				bRegex: obj.regex,
				bCaseInsensitive: obj.caseInsensitive
			};
		}

		/**
		 * Generate the node required for the info display
		 *  @param {object} oSettings dataTables settings object
		 *  @returns {node} Information element
		 *  @memberof DataTable#oApi
		 */
		function _fnFeatureHtmlInfo(settings) {
			var
				tid = settings.sTableId,
				nodes = settings.aanFeatures.i,
				n = $('<div/>', {
					'class': settings.oClasses.sInfo,
					'id': !nodes ? tid + '_info' : null
				});

			if (!nodes) {
				// Update display on each draw
				settings.aoDrawCallback.push({
					"fn": _fnUpdateInfo,
					"sName": "information"
				});

				n
					.attr('role', 'status')
					.attr('aria-live', 'polite');

				// Table is described by our info div
				$(settings.nTable).attr('aria-describedby', tid + '_info');
			}

			return n[0];
		}


		/**
		 * Update the information elements in the display
		 *  @param {object} settings dataTables settings object
		 *  @memberof DataTable#oApi
		 */
		function _fnUpdateInfo(settings) {
			/* Show information about the table */
			var nodes = settings.aanFeatures.i;
			if (nodes.length === 0) {
				return;
			}

			var
				lang = settings.oLanguage,
				start = settings._iDisplayStart + 1,
				end = settings.fnDisplayEnd(),
				max = settings.fnRecordsTotal(),
				total = settings.fnRecordsDisplay(),
				out = total ?
					lang.sInfo :
					lang.sInfoEmpty;

			if (total !== max) {
				/* Record set after filtering */
				out += ' ' + lang.sInfoFiltered;
			}

			// Convert the macros
			out += lang.sInfoPostFix;
			out = _fnInfoMacros(settings, out);

			var callback = lang.fnInfoCallback;
			if (callback !== null) {
				out = callback.call(settings.oInstance,
					settings, start, end, max, total, out
				);
			}

			$(nodes).html(out);
		}


		function _fnInfoMacros(settings, str) {
			// When infinite scrolling, we are always starting at 1. _iDisplayStart is used only
			// internally
			var
				formatter = settings.fnFormatNumber,
				start = settings._iDisplayStart + 1,
				len = settings._iDisplayLength,
				vis = settings.fnRecordsDisplay(),
				all = len === -1;

			return str.
				replace(/_START_/g, formatter.call(settings, start)).
				replace(/_END_/g, formatter.call(settings, settings.fnDisplayEnd())).
				replace(/_MAX_/g, formatter.call(settings, settings.fnRecordsTotal())).
				replace(/_TOTAL_/g, formatter.call(settings, vis)).
				replace(/_PAGE_/g, formatter.call(settings, all ? 1 : Math.ceil(start / len))).
				replace(/_PAGES_/g, formatter.call(settings, all ? 1 : Math.ceil(vis / len)));
		}



		/**
		 * Draw the table for the first time, adding all required features
		 *  @param {object} settings dataTables settings object
		 *  @memberof DataTable#oApi
		 */
		function _fnInitialise(settings) {
			var i, iLen, iAjaxStart = settings.iInitDisplayStart;
			var columns = settings.aoColumns, column;
			var features = settings.oFeatures;
			var deferLoading = settings.bDeferLoading; // value modified by the draw

			/* Ensure that the table data is fully initialised */
			if (!settings.bInitialised) {
				setTimeout(function () { _fnInitialise(settings); }, 200);
				return;
			}

			/* Show the display HTML options */
			_fnAddOptionsHtml(settings);

			/* Build and draw the header / footer for the table */
			_fnBuildHead(settings);
			_fnDrawHead(settings, settings.aoHeader);
			_fnDrawHead(settings, settings.aoFooter);

			/* Okay to show that something is going on now */
			_fnProcessingDisplay(settings, true);

			/* Calculate sizes for columns */
			if (features.bAutoWidth) {
				_fnCalculateColumnWidths(settings);
			}

			for (i = 0, iLen = columns.length; i < iLen; i++) {
				column = columns[i];

				if (column.sWidth) {
					column.nTh.style.width = _fnStringToCss(column.sWidth);
				}
			}

			_fnCallbackFire(settings, null, 'preInit', [settings]);

			// If there is default sorting required - let's do it. The sort function
			// will do the drawing for us. Otherwise we draw the table regardless of the
			// Ajax source - this allows the table to look initialised for Ajax sourcing
			// data (show 'loading' message possibly)
			_fnReDraw(settings);

			// Server-side processing init complete is done by _fnAjaxUpdateDraw
			var dataSrc = _fnDataSource(settings);
			if (dataSrc != 'ssp' || deferLoading) {
				// if there is an ajax source load the data
				if (dataSrc == 'ajax') {
					_fnBuildAjax(settings, [], function (json) {
						var aData = _fnAjaxDataSrc(settings, json);

						// Got the data - add it to the table
						for (i = 0; i < aData.length; i++) {
							_fnAddData(settings, aData[i]);
						}

						// Reset the init display for cookie saving. We've already done
						// a filter, and therefore cleared it before. So we need to make
						// it appear 'fresh'
						settings.iInitDisplayStart = iAjaxStart;

						_fnReDraw(settings);

						_fnProcessingDisplay(settings, false);
						_fnInitComplete(settings, json);
					}, settings);
				}
				else {
					_fnProcessingDisplay(settings, false);
					_fnInitComplete(settings);
				}
			}
		}


		/**
		 * Draw the table for the first time, adding all required features
		 *  @param {object} oSettings dataTables settings object
		 *  @param {object} [json] JSON from the server that completed the table, if using Ajax source
		 *    with client-side processing (optional)
		 *  @memberof DataTable#oApi
		 */
		function _fnInitComplete(settings, json) {
			settings._bInitComplete = true;

			// When data was added after the initialisation (data or Ajax) we need to
			// calculate the column sizing
			if (json || settings.oInit.aaData) {
				_fnAdjustColumnSizing(settings);
			}

			_fnCallbackFire(settings, null, 'plugin-init', [settings, json]);
			_fnCallbackFire(settings, 'aoInitComplete', 'init', [settings, json]);
		}


		function _fnLengthChange(settings, val) {
			var len = parseInt(val, 10);
			settings._iDisplayLength = len;

			_fnLengthOverflow(settings);

			// Fire length change event
			_fnCallbackFire(settings, null, 'length', [settings, len]);
		}


		/**
		 * Generate the node required for user display length changing
		 *  @param {object} settings dataTables settings object
		 *  @returns {node} Display length feature node
		 *  @memberof DataTable#oApi
		 */
		function _fnFeatureHtmlLength(settings) {
			var
				classes = settings.oClasses,
				tableId = settings.sTableId,
				menu = settings.aLengthMenu,
				d2 = Array.isArray(menu[0]),
				lengths = d2 ? menu[0] : menu,
				language = d2 ? menu[1] : menu;

			var select = $('<select/>', {
				'name': tableId + '_length',
				'aria-controls': tableId,
				'class': classes.sLengthSelect
			});

			for (var i = 0, ien = lengths.length; i < ien; i++) {
				select[0][i] = new Option(
					typeof language[i] === 'number' ?
						settings.fnFormatNumber(language[i]) :
						language[i],
					lengths[i]
				);
			}

			var div = $('<div><label/></div>').addClass(classes.sLength);
			if (!settings.aanFeatures.l) {
				div[0].id = tableId + '_length';
			}

			div.children().append(
				settings.oLanguage.sLengthMenu.replace('_MENU_', select[0].outerHTML)
			);

			// Can't use `select` variable as user might provide their own and the
			// reference is broken by the use of outerHTML
			$('select', div)
				.val(settings._iDisplayLength)
				.on('change.DT', function (e) {
					_fnLengthChange(settings, $(this).val());
					_fnDraw(settings);
				});

			// Update node value whenever anything changes the table's length
			$(settings.nTable).on('length.dt.DT', function (e, s, len) {
				if (settings === s) {
					$('select', div).val(len);
				}
			});

			return div[0];
		}



		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
		 * Note that most of the paging logic is done in
		 * DataTable.ext.pager
		 */

		/**
		 * Generate the node required for default pagination
		 *  @param {object} oSettings dataTables settings object
		 *  @returns {node} Pagination feature node
		 *  @memberof DataTable#oApi
		 */
		function _fnFeatureHtmlPaginate(settings) {
			var
				type = settings.sPaginationType,
				plugin = DataTable.ext.pager[type],
				modern = typeof plugin === 'function',
				redraw = function (settings) {
					_fnDraw(settings);
				},
				node = $('<div/>').addClass(settings.oClasses.sPaging + type)[0],
				features = settings.aanFeatures;

			if (!modern) {
				plugin.fnInit(settings, node, redraw);
			}

			/* Add a draw callback for the pagination on first instance, to update the paging display */
			if (!features.p) {
				node.id = settings.sTableId + '_paginate';

				settings.aoDrawCallback.push({
					"fn": function (settings) {
						if (modern) {
							var
								start = settings._iDisplayStart,
								len = settings._iDisplayLength,
								visRecords = settings.fnRecordsDisplay(),
								all = len === -1,
								page = all ? 0 : Math.ceil(start / len),
								pages = all ? 1 : Math.ceil(visRecords / len),
								buttons = plugin(page, pages),
								i, ien;

							for (i = 0, ien = features.p.length; i < ien; i++) {
								_fnRenderer(settings, 'pageButton')(
									settings, features.p[i], i, buttons, page, pages
								);
							}
						}
						else {
							plugin.fnUpdate(settings, redraw);
						}
					},
					"sName": "pagination"
				});
			}

			return node;
		}


		/**
		 * Alter the display settings to change the page
		 *  @param {object} settings DataTables settings object
		 *  @param {string|int} action Paging action to take: "first", "previous",
		 *    "next" or "last" or page number to jump to (integer)
		 *  @param [bool] redraw Automatically draw the update or not
		 *  @returns {bool} true page has changed, false - no change
		 *  @memberof DataTable#oApi
		 */
		function _fnPageChange(settings, action, redraw) {
			var
				start = settings._iDisplayStart,
				len = settings._iDisplayLength,
				records = settings.fnRecordsDisplay();

			if (records === 0 || len === -1) {
				start = 0;
			}
			else if (typeof action === "number") {
				start = action * len;

				if (start > records) {
					start = 0;
				}
			}
			else if (action == "first") {
				start = 0;
			}
			else if (action == "previous") {
				start = len >= 0 ?
					start - len :
					0;

				if (start < 0) {
					start = 0;
				}
			}
			else if (action == "next") {
				if (start + len < records) {
					start += len;
				}
			}
			else if (action == "last") {
				start = Math.floor((records - 1) / len) * len;
			}
			else {
				_fnLog(settings, 0, "Unknown paging action: " + action, 5);
			}

			var changed = settings._iDisplayStart !== start;
			settings._iDisplayStart = start;

			if (changed) {
				_fnCallbackFire(settings, null, 'page', [settings]);

				if (redraw) {
					_fnDraw(settings);
				}
			}
			else {
				// No change event - paging was called, but no change
				_fnCallbackFire(settings, null, 'page-nc', [settings]);
			}

			return changed;
		}



		/**
		 * Generate the node required for the processing node
		 *  @param {object} settings dataTables settings object
		 *  @returns {node} Processing element
		 *  @memberof DataTable#oApi
		 */
		function _fnFeatureHtmlProcessing(settings) {
			return $('<div/>', {
				'id': !settings.aanFeatures.r ? settings.sTableId + '_processing' : null,
				'class': settings.oClasses.sProcessing
			})
				.html(settings.oLanguage.sProcessing)
				.append('<div><div></div><div></div><div></div><div></div></div>')
				.insertBefore(settings.nTable)[0];
		}


		/**
		 * Display or hide the processing indicator
		 *  @param {object} settings dataTables settings object
		 *  @param {bool} show Show the processing indicator (true) or not (false)
		 *  @memberof DataTable#oApi
		 */
		function _fnProcessingDisplay(settings, show) {
			if (settings.oFeatures.bProcessing) {
				$(settings.aanFeatures.r).css('display', show ? 'block' : 'none');
			}

			_fnCallbackFire(settings, null, 'processing', [settings, show]);
		}

		/**
		 * Add any control elements for the table - specifically scrolling
		 *  @param {object} settings dataTables settings object
		 *  @returns {node} Node to add to the DOM
		 *  @memberof DataTable#oApi
		 */
		function _fnFeatureHtmlTable(settings) {
			var table = $(settings.nTable);

			// Scrolling from here on in
			var scroll = settings.oScroll;

			if (scroll.sX === '' && scroll.sY === '') {
				return settings.nTable;
			}

			var scrollX = scroll.sX;
			var scrollY = scroll.sY;
			var classes = settings.oClasses;
			var caption = table.children('caption');
			var captionSide = caption.length ? caption[0]._captionSide : null;
			var headerClone = $(table[0].cloneNode(false));
			var footerClone = $(table[0].cloneNode(false));
			var footer = table.children('tfoot');
			var _div = '<div/>';
			var size = function (s) {
				return !s ? null : _fnStringToCss(s);
			};

			if (!footer.length) {
				footer = null;
			}

			/*
			 * The HTML structure that we want to generate in this function is:
			 *  div - scroller
			 *    div - scroll head
			 *      div - scroll head inner
			 *        table - scroll head table
			 *          thead - thead
			 *    div - scroll body
			 *      table - table (master table)
			 *        thead - thead clone for sizing
			 *        tbody - tbody
			 *    div - scroll foot
			 *      div - scroll foot inner
			 *        table - scroll foot table
			 *          tfoot - tfoot
			 */
			var scroller = $(_div, { 'class': classes.sScrollWrapper })
				.append(
					$(_div, { 'class': classes.sScrollHead })
						.css({
							overflow: 'hidden',
							position: 'relative',
							border: 0,
							width: scrollX ? size(scrollX) : '100%'
						})
						.append(
							$(_div, { 'class': classes.sScrollHeadInner })
								.css({
									'box-sizing': 'content-box',
									width: scroll.sXInner || '100%'
								})
								.append(
									headerClone
										.removeAttr('id')
										.css('margin-left', 0)
										.append(captionSide === 'top' ? caption : null)
										.append(
											table.children('thead')
										)
								)
						)
				)
				.append(
					$(_div, { 'class': classes.sScrollBody })
						.css({
							position: 'relative',
							overflow: 'auto',
							width: size(scrollX)
						})
						.append(table)
				);

			if (footer) {
				scroller.append(
					$(_div, { 'class': classes.sScrollFoot })
						.css({
							overflow: 'hidden',
							border: 0,
							width: scrollX ? size(scrollX) : '100%'
						})
						.append(
							$(_div, { 'class': classes.sScrollFootInner })
								.append(
									footerClone
										.removeAttr('id')
										.css('margin-left', 0)
										.append(captionSide === 'bottom' ? caption : null)
										.append(
											table.children('tfoot')
										)
								)
						)
				);
			}

			var children = scroller.children();
			var scrollHead = children[0];
			var scrollBody = children[1];
			var scrollFoot = footer ? children[2] : null;

			// When the body is scrolled, then we also want to scroll the headers
			if (scrollX) {
				$(scrollBody).on('scroll.DT', function (e) {
					var scrollLeft = this.scrollLeft;

					scrollHead.scrollLeft = scrollLeft;

					if (footer) {
						scrollFoot.scrollLeft = scrollLeft;
					}
				});
			}

			$(scrollBody).css('max-height', scrollY);
			if (!scroll.bCollapse) {
				$(scrollBody).css('height', scrollY);
			}

			settings.nScrollHead = scrollHead;
			settings.nScrollBody = scrollBody;
			settings.nScrollFoot = scrollFoot;

			// On redraw - align columns
			settings.aoDrawCallback.push({
				"fn": _fnScrollDraw,
				"sName": "scrolling"
			});

			return scroller[0];
		}



		/**
		 * Update the header, footer and body tables for resizing - i.e. column
		 * alignment.
		 *
		 * Welcome to the most horrible function DataTables. The process that this
		 * function follows is basically:
		 *   1. Re-create the table inside the scrolling div
		 *   2. Take live measurements from the DOM
		 *   3. Apply the measurements to align the columns
		 *   4. Clean up
		 *
		 *  @param {object} settings dataTables settings object
		 *  @memberof DataTable#oApi
		 */
		function _fnScrollDraw(settings) {
			// Given that this is such a monster function, a lot of variables are use
			// to try and keep the minimised size as small as possible
			var
				scroll = settings.oScroll,
				scrollX = scroll.sX,
				scrollXInner = scroll.sXInner,
				scrollY = scroll.sY,
				barWidth = scroll.iBarWidth,
				divHeader = $(settings.nScrollHead),
				divHeaderStyle = divHeader[0].style,
				divHeaderInner = divHeader.children('div'),
				divHeaderInnerStyle = divHeaderInner[0].style,
				divHeaderTable = divHeaderInner.children('table'),
				divBodyEl = settings.nScrollBody,
				divBody = $(divBodyEl),
				divBodyStyle = divBodyEl.style,
				divFooter = $(settings.nScrollFoot),
				divFooterInner = divFooter.children('div'),
				divFooterTable = divFooterInner.children('table'),
				header = $(settings.nTHead),
				table = $(settings.nTable),
				tableEl = table[0],
				tableStyle = tableEl.style,
				footer = settings.nTFoot ? $(settings.nTFoot) : null,
				browser = settings.oBrowser,
				ie67 = browser.bScrollOversize,
				dtHeaderCells = _pluck(settings.aoColumns, 'nTh'),
				headerTrgEls, footerTrgEls,
				headerSrcEls, footerSrcEls,
				headerCopy, footerCopy,
				headerWidths = [], footerWidths = [],
				headerContent = [], footerContent = [],
				idx, correction, sanityWidth,
				zeroOut = function (nSizer) {
					var style = nSizer.style;
					style.paddingTop = "0";
					style.paddingBottom = "0";
					style.borderTopWidth = "0";
					style.borderBottomWidth = "0";
					style.height = 0;
				};

			// If the scrollbar visibility has changed from the last draw, we need to
			// adjust the column sizes as the table width will have changed to account
			// for the scrollbar
			var scrollBarVis = divBodyEl.scrollHeight > divBodyEl.clientHeight;

			if (settings.scrollBarVis !== scrollBarVis && settings.scrollBarVis !== undefined) {
				settings.scrollBarVis = scrollBarVis;
				_fnAdjustColumnSizing(settings);
				return; // adjust column sizing will call this function again
			}
			else {
				settings.scrollBarVis = scrollBarVis;
			}

			/*
			 * 1. Re-create the table inside the scrolling div
			 */

			// Remove the old minimised thead and tfoot elements in the inner table
			table.children('thead, tfoot').remove();

			if (footer) {
				footerCopy = footer.clone().prependTo(table);
				footerTrgEls = footer.find('tr'); // the original tfoot is in its own table and must be sized
				footerSrcEls = footerCopy.find('tr');
				footerCopy.find('[id]').removeAttr('id');
			}

			// Clone the current header and footer elements and then place it into the inner table
			headerCopy = header.clone().prependTo(table);
			headerTrgEls = header.find('tr'); // original header is in its own table
			headerSrcEls = headerCopy.find('tr');
			headerCopy.find('th, td').removeAttr('tabindex');
			headerCopy.find('[id]').removeAttr('id');


			/*
			 * 2. Take live measurements from the DOM - do not alter the DOM itself!
			 */

			// Remove old sizing and apply the calculated column widths
			// Get the unique column headers in the newly created (cloned) header. We want to apply the
			// calculated sizes to this header
			if (!scrollX) {
				divBodyStyle.width = '100%';
				divHeader[0].style.width = '100%';
			}

			$.each(_fnGetUniqueThs(settings, headerCopy), function (i, el) {
				idx = _fnVisibleToColumnIndex(settings, i);
				el.style.width = settings.aoColumns[idx].sWidth;
			});

			if (footer) {
				_fnApplyToChildren(function (n) {
					n.style.width = "";
				}, footerSrcEls);
			}

			// Size the table as a whole
			sanityWidth = table.outerWidth();
			if (scrollX === "") {
				// No x scrolling
				tableStyle.width = "100%";

				// IE7 will make the width of the table when 100% include the scrollbar
				// - which is shouldn't. When there is a scrollbar we need to take this
				// into account.
				if (ie67 && (table.find('tbody').height() > divBodyEl.offsetHeight ||
					divBody.css('overflow-y') == "scroll")
				) {
					tableStyle.width = _fnStringToCss(table.outerWidth() - barWidth);
				}

				// Recalculate the sanity width
				sanityWidth = table.outerWidth();
			}
			else if (scrollXInner !== "") {
				// legacy x scroll inner has been given - use it
				tableStyle.width = _fnStringToCss(scrollXInner);

				// Recalculate the sanity width
				sanityWidth = table.outerWidth();
			}

			// Hidden header should have zero height, so remove padding and borders. Then
			// set the width based on the real headers

			// Apply all styles in one pass
			_fnApplyToChildren(zeroOut, headerSrcEls);

			// Read all widths in next pass
			_fnApplyToChildren(function (nSizer) {
				var style = window.getComputedStyle ?
					window.getComputedStyle(nSizer).width :
					_fnStringToCss($(nSizer).width());

				headerContent.push(nSizer.innerHTML);
				headerWidths.push(style);
			}, headerSrcEls);

			// Apply all widths in final pass
			_fnApplyToChildren(function (nToSize, i) {
				nToSize.style.width = headerWidths[i];
			}, headerTrgEls);

			$(headerSrcEls).css('height', 0);

			/* Same again with the footer if we have one */
			if (footer) {
				_fnApplyToChildren(zeroOut, footerSrcEls);

				_fnApplyToChildren(function (nSizer) {
					footerContent.push(nSizer.innerHTML);
					footerWidths.push(_fnStringToCss($(nSizer).css('width')));
				}, footerSrcEls);

				_fnApplyToChildren(function (nToSize, i) {
					nToSize.style.width = footerWidths[i];
				}, footerTrgEls);

				$(footerSrcEls).height(0);
			}


			/*
			 * 3. Apply the measurements
			 */

			// "Hide" the header and footer that we used for the sizing. We need to keep
			// the content of the cell so that the width applied to the header and body
			// both match, but we want to hide it completely. We want to also fix their
			// width to what they currently are
			_fnApplyToChildren(function (nSizer, i) {
				nSizer.innerHTML = '<div class="dataTables_sizing">' + headerContent[i] + '</div>';
				nSizer.childNodes[0].style.height = "0";
				nSizer.childNodes[0].style.overflow = "hidden";
				nSizer.style.width = headerWidths[i];
			}, headerSrcEls);

			if (footer) {
				_fnApplyToChildren(function (nSizer, i) {
					nSizer.innerHTML = '<div class="dataTables_sizing">' + footerContent[i] + '</div>';
					nSizer.childNodes[0].style.height = "0";
					nSizer.childNodes[0].style.overflow = "hidden";
					nSizer.style.width = footerWidths[i];
				}, footerSrcEls);
			}

			// Sanity check that the table is of a sensible width. If not then we are going to get
			// misalignment - try to prevent this by not allowing the table to shrink below its min width
			if (Math.round(table.outerWidth()) < Math.round(sanityWidth)) {
				// The min width depends upon if we have a vertical scrollbar visible or not */
				correction = ((divBodyEl.scrollHeight > divBodyEl.offsetHeight ||
					divBody.css('overflow-y') == "scroll")) ?
					sanityWidth + barWidth :
					sanityWidth;

				// IE6/7 are a law unto themselves...
				if (ie67 && (divBodyEl.scrollHeight >
					divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")
				) {
					tableStyle.width = _fnStringToCss(correction - barWidth);
				}

				// And give the user a warning that we've stopped the table getting too small
				if (scrollX === "" || scrollXInner !== "") {
					_fnLog(settings, 1, 'Possible column misalignment', 6);
				}
			}
			else {
				correction = '100%';
			}

			// Apply to the container elements
			divBodyStyle.width = _fnStringToCss(correction);
			divHeaderStyle.width = _fnStringToCss(correction);

			if (footer) {
				settings.nScrollFoot.style.width = _fnStringToCss(correction);
			}


			/*
			 * 4. Clean up
			 */
			if (!scrollY) {
				/* IE7< puts a vertical scrollbar in place (when it shouldn't be) due to subtracting
				 * the scrollbar height from the visible display, rather than adding it on. We need to
				 * set the height in order to sort this. Don't want to do it in any other browsers.
				 */
				if (ie67) {
					divBodyStyle.height = _fnStringToCss(tableEl.offsetHeight + barWidth);
				}
			}

			/* Finally set the width's of the header and footer tables */
			var iOuterWidth = table.outerWidth();
			divHeaderTable[0].style.width = _fnStringToCss(iOuterWidth);
			divHeaderInnerStyle.width = _fnStringToCss(iOuterWidth);

			// Figure out if there are scrollbar present - if so then we need a the header and footer to
			// provide a bit more space to allow "overflow" scrolling (i.e. past the scrollbar)
			var bScrolling = table.height() > divBodyEl.clientHeight || divBody.css('overflow-y') == "scroll";
			var padding = 'padding' + (browser.bScrollbarLeft ? 'Left' : 'Right');
			divHeaderInnerStyle[padding] = bScrolling ? barWidth + "px" : "0px";

			if (footer) {
				divFooterTable[0].style.width = _fnStringToCss(iOuterWidth);
				divFooterInner[0].style.width = _fnStringToCss(iOuterWidth);
				divFooterInner[0].style[padding] = bScrolling ? barWidth + "px" : "0px";
			}

			// Correct DOM ordering for colgroup - comes before the thead
			table.children('colgroup').insertBefore(table.children('thead'));

			/* Adjust the position of the header in case we loose the y-scrollbar */
			divBody.trigger('scroll');

			// If sorting or filtering has occurred, jump the scrolling back to the top
			// only if we aren't holding the position
			if ((settings.bSorted || settings.bFiltered) && !settings._drawHold) {
				divBodyEl.scrollTop = 0;
			}
		}



		/**
		 * Apply a given function to the display child nodes of an element array (typically
		 * TD children of TR rows
		 *  @param {function} fn Method to apply to the objects
		 *  @param array {nodes} an1 List of elements to look through for display children
		 *  @param array {nodes} an2 Another list (identical structure to the first) - optional
		 *  @memberof DataTable#oApi
		 */
		function _fnApplyToChildren(fn, an1, an2) {
			var index = 0, i = 0, iLen = an1.length;
			var nNode1, nNode2;

			while (i < iLen) {
				nNode1 = an1[i].firstChild;
				nNode2 = an2 ? an2[i].firstChild : null;

				while (nNode1) {
					if (nNode1.nodeType === 1) {
						if (an2) {
							fn(nNode1, nNode2, index);
						}
						else {
							fn(nNode1, index);
						}

						index++;
					}

					nNode1 = nNode1.nextSibling;
					nNode2 = an2 ? nNode2.nextSibling : null;
				}

				i++;
			}
		}



		var __re_html_remove = /<.*?>/g;


		/**
		 * Calculate the width of columns for the table
		 *  @param {object} oSettings dataTables settings object
		 *  @memberof DataTable#oApi
		 */
		function _fnCalculateColumnWidths(oSettings) {
			var
				table = oSettings.nTable,
				columns = oSettings.aoColumns,
				scroll = oSettings.oScroll,
				scrollY = scroll.sY,
				scrollX = scroll.sX,
				scrollXInner = scroll.sXInner,
				columnCount = columns.length,
				visibleColumns = _fnGetColumns(oSettings, 'bVisible'),
				headerCells = $('th', oSettings.nTHead),
				tableWidthAttr = table.getAttribute('width'), // from DOM element
				tableContainer = table.parentNode,
				userInputs = false,
				i, column, columnIdx, width, outerWidth,
				browser = oSettings.oBrowser,
				ie67 = browser.bScrollOversize;

			var styleWidth = table.style.width;
			if (styleWidth && styleWidth.indexOf('%') !== -1) {
				tableWidthAttr = styleWidth;
			}

			/* Convert any user input sizes into pixel sizes */
			for (i = 0; i < visibleColumns.length; i++) {
				column = columns[visibleColumns[i]];

				if (column.sWidth !== null) {
					column.sWidth = _fnConvertToWidth(column.sWidthOrig, tableContainer);

					userInputs = true;
				}
			}

			/* If the number of columns in the DOM equals the number that we have to
			 * process in DataTables, then we can use the offsets that are created by
			 * the web- browser. No custom sizes can be set in order for this to happen,
			 * nor scrolling used
			 */
			if (ie67 || !userInputs && !scrollX && !scrollY &&
				columnCount == _fnVisbleColumns(oSettings) &&
				columnCount == headerCells.length
			) {
				for (i = 0; i < columnCount; i++) {
					var colIdx = _fnVisibleToColumnIndex(oSettings, i);

					if (colIdx !== null) {
						columns[colIdx].sWidth = _fnStringToCss(headerCells.eq(i).width());
					}
				}
			}
			else {
				// Otherwise construct a single row, worst case, table with the widest
				// node in the data, assign any user defined widths, then insert it into
				// the DOM and allow the browser to do all the hard work of calculating
				// table widths
				var tmpTable = $(table).clone() // don't use cloneNode - IE8 will remove events on the main table
					.css('visibility', 'hidden')
					.removeAttr('id');

				// Clean up the table body
				tmpTable.find('tbody tr').remove();
				var tr = $('<tr/>').appendTo(tmpTable.find('tbody'));

				// Clone the table header and footer - we can't use the header / footer
				// from the cloned table, since if scrolling is active, the table's
				// real header and footer are contained in different table tags
				tmpTable.find('thead, tfoot').remove();
				tmpTable
					.append($(oSettings.nTHead).clone())
					.append($(oSettings.nTFoot).clone());

				// Remove any assigned widths from the footer (from scrolling)
				tmpTable.find('tfoot th, tfoot td').css('width', '');

				// Apply custom sizing to the cloned header
				headerCells = _fnGetUniqueThs(oSettings, tmpTable.find('thead')[0]);

				for (i = 0; i < visibleColumns.length; i++) {
					column = columns[visibleColumns[i]];

					headerCells[i].style.width = column.sWidthOrig !== null && column.sWidthOrig !== '' ?
						_fnStringToCss(column.sWidthOrig) :
						'';

					// For scrollX we need to force the column width otherwise the
					// browser will collapse it. If this width is smaller than the
					// width the column requires, then it will have no effect
					if (column.sWidthOrig && scrollX) {
						$(headerCells[i]).append($('<div/>').css({
							width: column.sWidthOrig,
							margin: 0,
							padding: 0,
							border: 0,
							height: 1
						}));
					}
				}

				// Find the widest cell for each column and put it into the table
				if (oSettings.aoData.length) {
					for (i = 0; i < visibleColumns.length; i++) {
						columnIdx = visibleColumns[i];
						column = columns[columnIdx];

						$(_fnGetWidestNode(oSettings, columnIdx))
							.clone(false)
							.append(column.sContentPadding)
							.appendTo(tr);
					}
				}

				// Tidy the temporary table - remove name attributes so there aren't
				// duplicated in the dom (radio elements for example)
				$('[name]', tmpTable).removeAttr('name');

				// Table has been built, attach to the document so we can work with it.
				// A holding element is used, positioned at the top of the container
				// with minimal height, so it has no effect on if the container scrolls
				// or not. Otherwise it might trigger scrolling when it actually isn't
				// needed
				var holder = $('<div/>').css(scrollX || scrollY ?
					{
						position: 'absolute',
						top: 0,
						left: 0,
						height: 1,
						right: 0,
						overflow: 'hidden'
					} :
					{}
				)
					.append(tmpTable)
					.appendTo(tableContainer);

				// When scrolling (X or Y) we want to set the width of the table as 
				// appropriate. However, when not scrolling leave the table width as it
				// is. This results in slightly different, but I think correct behaviour
				if (scrollX && scrollXInner) {
					tmpTable.width(scrollXInner);
				}
				else if (scrollX) {
					tmpTable.css('width', 'auto');
					tmpTable.removeAttr('width');

					// If there is no width attribute or style, then allow the table to
					// collapse
					if (tmpTable.width() < tableContainer.clientWidth && tableWidthAttr) {
						tmpTable.width(tableContainer.clientWidth);
					}
				}
				else if (scrollY) {
					tmpTable.width(tableContainer.clientWidth);
				}
				else if (tableWidthAttr) {
					tmpTable.width(tableWidthAttr);
				}

				// Get the width of each column in the constructed table - we need to
				// know the inner width (so it can be assigned to the other table's
				// cells) and the outer width so we can calculate the full width of the
				// table. This is safe since DataTables requires a unique cell for each
				// column, but if ever a header can span multiple columns, this will
				// need to be modified.
				var total = 0;
				for (i = 0; i < visibleColumns.length; i++) {
					var cell = $(headerCells[i]);
					var border = cell.outerWidth() - cell.width();

					// Use getBounding... where possible (not IE8-) because it can give
					// sub-pixel accuracy, which we then want to round up!
					var bounding = browser.bBounding ?
						Math.ceil(headerCells[i].getBoundingClientRect().width) :
						cell.outerWidth();

					// Total is tracked to remove any sub-pixel errors as the outerWidth
					// of the table might not equal the total given here (IE!).
					total += bounding;

					// Width for each column to use
					columns[visibleColumns[i]].sWidth = _fnStringToCss(bounding - border);
				}

				table.style.width = _fnStringToCss(total);

				// Finished with the table - ditch it
				holder.remove();
			}

			// If there is a width attr, we want to attach an event listener which
			// allows the table sizing to automatically adjust when the window is
			// resized. Use the width attr rather than CSS, since we can't know if the
			// CSS is a relative value or absolute - DOM read is always px.
			if (tableWidthAttr) {
				table.style.width = _fnStringToCss(tableWidthAttr);
			}

			if ((tableWidthAttr || scrollX) && !oSettings._reszEvt) {
				var bindResize = function () {
					$(window).on('resize.DT-' + oSettings.sInstance, _fnThrottle(function () {
						_fnAdjustColumnSizing(oSettings);
					}));
				};

				// IE6/7 will crash if we bind a resize event handler on page load.
				// To be removed in 1.11 which drops IE6/7 support
				if (ie67) {
					setTimeout(bindResize, 1000);
				}
				else {
					bindResize();
				}

				oSettings._reszEvt = true;
			}
		}


		/**
		 * Throttle the calls to a function. Arguments and context are maintained for
		 * the throttled function
		 *  @param {function} fn Function to be called
		 *  @param {int} [freq=200] call frequency in mS
		 *  @returns {function} wrapped function
		 *  @memberof DataTable#oApi
		 */
		var _fnThrottle = DataTable.util.throttle;


		/**
		 * Convert a CSS unit width to pixels (e.g. 2em)
		 *  @param {string} width width to be converted
		 *  @param {node} parent parent to get the with for (required for relative widths) - optional
		 *  @returns {int} width in pixels
		 *  @memberof DataTable#oApi
		 */
		function _fnConvertToWidth(width, parent) {
			if (!width) {
				return 0;
			}

			var n = $('<div/>')
				.css('width', _fnStringToCss(width))
				.appendTo(parent || document.body);

			var val = n[0].offsetWidth;
			n.remove();

			return val;
		}


		/**
		 * Get the widest node
		 *  @param {object} settings dataTables settings object
		 *  @param {int} colIdx column of interest
		 *  @returns {node} widest table node
		 *  @memberof DataTable#oApi
		 */
		function _fnGetWidestNode(settings, colIdx) {
			var idx = _fnGetMaxLenString(settings, colIdx);
			if (idx < 0) {
				return null;
			}

			var data = settings.aoData[idx];
			return !data.nTr ? // Might not have been created when deferred rendering
				$('<td/>').html(_fnGetCellData(settings, idx, colIdx, 'display'))[0] :
				data.anCells[colIdx];
		}


		/**
		 * Get the maximum strlen for each data column
		 *  @param {object} settings dataTables settings object
		 *  @param {int} colIdx column of interest
		 *  @returns {string} max string length for each column
		 *  @memberof DataTable#oApi
		 */
		function _fnGetMaxLenString(settings, colIdx) {
			var s, max = -1, maxIdx = -1;

			for (var i = 0, ien = settings.aoData.length; i < ien; i++) {
				s = _fnGetCellData(settings, i, colIdx, 'display') + '';
				s = s.replace(__re_html_remove, '');
				s = s.replace(/&nbsp;/g, ' ');

				if (s.length > max) {
					max = s.length;
					maxIdx = i;
				}
			}

			return maxIdx;
		}


		/**
		 * Append a CSS unit (only if required) to a string
		 *  @param {string} value to css-ify
		 *  @returns {string} value with css unit
		 *  @memberof DataTable#oApi
		 */
		function _fnStringToCss(s) {
			if (s === null) {
				return '0px';
			}

			if (typeof s == 'number') {
				return s < 0 ?
					'0px' :
					s + 'px';
			}

			// Check it has a unit character already
			return s.match(/\d$/) ?
				s + 'px' :
				s;
		}



		function _fnSortFlatten(settings) {
			var
				i, iLen, k, kLen,
				aSort = [],
				aiOrig = [],
				aoColumns = settings.aoColumns,
				aDataSort, iCol, sType, srcCol,
				fixed = settings.aaSortingFixed,
				fixedObj = $.isPlainObject(fixed),
				nestedSort = [],
				add = function (a) {
					if (a.length && !Array.isArray(a[0])) {
						// 1D array
						nestedSort.push(a);
					}
					else {
						// 2D array
						$.merge(nestedSort, a);
					}
				};

			// Build the sort array, with pre-fix and post-fix options if they have been
			// specified
			if (Array.isArray(fixed)) {
				add(fixed);
			}

			if (fixedObj && fixed.pre) {
				add(fixed.pre);
			}

			add(settings.aaSorting);

			if (fixedObj && fixed.post) {
				add(fixed.post);
			}

			for (i = 0; i < nestedSort.length; i++) {
				srcCol = nestedSort[i][0];
				aDataSort = aoColumns[srcCol].aDataSort;

				for (k = 0, kLen = aDataSort.length; k < kLen; k++) {
					iCol = aDataSort[k];
					sType = aoColumns[iCol].sType || 'string';

					if (nestedSort[i]._idx === undefined) {
						nestedSort[i]._idx = $.inArray(nestedSort[i][1], aoColumns[iCol].asSorting);
					}

					aSort.push({
						src: srcCol,
						col: iCol,
						dir: nestedSort[i][1],
						index: nestedSort[i]._idx,
						type: sType,
						formatter: DataTable.ext.type.order[sType + "-pre"]
					});
				}
			}

			return aSort;
		}

		/**
		 * Change the order of the table
		 *  @param {object} oSettings dataTables settings object
		 *  @memberof DataTable#oApi
		 *  @todo This really needs split up!
		 */
		function _fnSort(oSettings) {
			var
				i, ien, iLen, j, jLen, k, kLen,
				sDataType, nTh,
				aiOrig = [],
				oExtSort = DataTable.ext.type.order,
				aoData = oSettings.aoData,
				aoColumns = oSettings.aoColumns,
				aDataSort, data, iCol, sType, oSort,
				formatters = 0,
				sortCol,
				displayMaster = oSettings.aiDisplayMaster,
				aSort;

			// Resolve any column types that are unknown due to addition or invalidation
			// @todo Can this be moved into a 'data-ready' handler which is called when
			//   data is going to be used in the table?
			_fnColumnTypes(oSettings);

			aSort = _fnSortFlatten(oSettings);

			for (i = 0, ien = aSort.length; i < ien; i++) {
				sortCol = aSort[i];

				// Track if we can use the fast sort algorithm
				if (sortCol.formatter) {
					formatters++;
				}

				// Load the data needed for the sort, for each cell
				_fnSortData(oSettings, sortCol.col);
			}

			/* No sorting required if server-side or no sorting array */
			if (_fnDataSource(oSettings) != 'ssp' && aSort.length !== 0) {
				// Create a value - key array of the current row positions such that we can use their
				// current position during the sort, if values match, in order to perform stable sorting
				for (i = 0, iLen = displayMaster.length; i < iLen; i++) {
					aiOrig[displayMaster[i]] = i;
				}

				/* Do the sort - here we want multi-column sorting based on a given data source (column)
				 * and sorting function (from oSort) in a certain direction. It's reasonably complex to
				 * follow on it's own, but this is what we want (example two column sorting):
				 *  fnLocalSorting = function(a,b){
				 *    var iTest;
				 *    iTest = oSort['string-asc']('data11', 'data12');
				 *      if (iTest !== 0)
				 *        return iTest;
				 *    iTest = oSort['numeric-desc']('data21', 'data22');
				 *    if (iTest !== 0)
				 *      return iTest;
				 *    return oSort['numeric-asc']( aiOrig[a], aiOrig[b] );
				 *  }
				 * Basically we have a test for each sorting column, if the data in that column is equal,
				 * test the next column. If all columns match, then we use a numeric sort on the row
				 * positions in the original data array to provide a stable sort.
				 *
				 * Note - I know it seems excessive to have two sorting methods, but the first is around
				 * 15% faster, so the second is only maintained for backwards compatibility with sorting
				 * methods which do not have a pre-sort formatting function.
				 */
				if (formatters === aSort.length) {
					// All sort types have formatting functions
					displayMaster.sort(function (a, b) {
						var
							x, y, k, test, sort,
							len = aSort.length,
							dataA = aoData[a]._aSortData,
							dataB = aoData[b]._aSortData;

						for (k = 0; k < len; k++) {
							sort = aSort[k];

							x = dataA[sort.col];
							y = dataB[sort.col];

							test = x < y ? -1 : x > y ? 1 : 0;
							if (test !== 0) {
								return sort.dir === 'asc' ? test : -test;
							}
						}

						x = aiOrig[a];
						y = aiOrig[b];
						return x < y ? -1 : x > y ? 1 : 0;
					});
				}
				else {
					// Depreciated - remove in 1.11 (providing a plug-in option)
					// Not all sort types have formatting methods, so we have to call their sorting
					// methods.
					displayMaster.sort(function (a, b) {
						var
							x, y, k, l, test, sort, fn,
							len = aSort.length,
							dataA = aoData[a]._aSortData,
							dataB = aoData[b]._aSortData;

						for (k = 0; k < len; k++) {
							sort = aSort[k];

							x = dataA[sort.col];
							y = dataB[sort.col];

							fn = oExtSort[sort.type + "-" + sort.dir] || oExtSort["string-" + sort.dir];
							test = fn(x, y);
							if (test !== 0) {
								return test;
							}
						}

						x = aiOrig[a];
						y = aiOrig[b];
						return x < y ? -1 : x > y ? 1 : 0;
					});
				}
			}

			/* Tell the draw function that we have sorted the data */
			oSettings.bSorted = true;
		}


		function _fnSortAria(settings) {
			var label;
			var nextSort;
			var columns = settings.aoColumns;
			var aSort = _fnSortFlatten(settings);
			var oAria = settings.oLanguage.oAria;

			// ARIA attributes - need to loop all columns, to update all (removing old
			// attributes as needed)
			for (var i = 0, iLen = columns.length; i < iLen; i++) {
				var col = columns[i];
				var asSorting = col.asSorting;
				var sTitle = col.ariaTitle || col.sTitle.replace(/<.*?>/g, "");
				var th = col.nTh;

				// IE7 is throwing an error when setting these properties with jQuery's
				// attr() and removeAttr() methods...
				th.removeAttribute('aria-sort');

				/* In ARIA only the first sorting column can be marked as sorting - no multi-sort option */
				if (col.bSortable) {
					if (aSort.length > 0 && aSort[0].col == i) {
						th.setAttribute('aria-sort', aSort[0].dir == "asc" ? "ascending" : "descending");
						nextSort = asSorting[aSort[0].index + 1] || asSorting[0];
					}
					else {
						nextSort = asSorting[0];
					}

					label = sTitle + (nextSort === "asc" ?
						oAria.sSortAscending :
						oAria.sSortDescending
					);
				}
				else {
					label = sTitle;
				}

				th.setAttribute('aria-label', label);
			}
		}


		/**
		 * Function to run on user sort request
		 *  @param {object} settings dataTables settings object
		 *  @param {node} attachTo node to attach the handler to
		 *  @param {int} colIdx column sorting index
		 *  @param {boolean} [append=false] Append the requested sort to the existing
		 *    sort if true (i.e. multi-column sort)
		 *  @param {function} [callback] callback function
		 *  @memberof DataTable#oApi
		 */
		function _fnSortListener(settings, colIdx, append, callback) {
			var col = settings.aoColumns[colIdx];
			var sorting = settings.aaSorting;
			var asSorting = col.asSorting;
			var nextSortIdx;
			var next = function (a, overflow) {
				var idx = a._idx;
				if (idx === undefined) {
					idx = $.inArray(a[1], asSorting);
				}

				return idx + 1 < asSorting.length ?
					idx + 1 :
					overflow ?
						null :
						0;
			};

			// Convert to 2D array if needed
			if (typeof sorting[0] === 'number') {
				sorting = settings.aaSorting = [sorting];
			}

			// If appending the sort then we are multi-column sorting
			if (append && settings.oFeatures.bSortMulti) {
				// Are we already doing some kind of sort on this column?
				var sortIdx = $.inArray(colIdx, _pluck(sorting, '0'));

				if (sortIdx !== -1) {
					// Yes, modify the sort
					nextSortIdx = next(sorting[sortIdx], true);

					if (nextSortIdx === null && sorting.length === 1) {
						nextSortIdx = 0; // can't remove sorting completely
					}

					if (nextSortIdx === null) {
						sorting.splice(sortIdx, 1);
					}
					else {
						sorting[sortIdx][1] = asSorting[nextSortIdx];
						sorting[sortIdx]._idx = nextSortIdx;
					}
				}
				else {
					// No sort on this column yet
					sorting.push([colIdx, asSorting[0], 0]);
					sorting[sorting.length - 1]._idx = 0;
				}
			}
			else if (sorting.length && sorting[0][0] == colIdx) {
				// Single column - already sorting on this column, modify the sort
				nextSortIdx = next(sorting[0]);

				sorting.length = 1;
				sorting[0][1] = asSorting[nextSortIdx];
				sorting[0]._idx = nextSortIdx;
			}
			else {
				// Single column - sort only on this column
				sorting.length = 0;
				sorting.push([colIdx, asSorting[0]]);
				sorting[0]._idx = 0;
			}

			// Run the sort by calling a full redraw
			_fnReDraw(settings);

			// callback used for async user interaction
			if (typeof callback == 'function') {
				callback(settings);
			}
		}


		/**
		 * Attach a sort handler (click) to a node
		 *  @param {object} settings dataTables settings object
		 *  @param {node} attachTo node to attach the handler to
		 *  @param {int} colIdx column sorting index
		 *  @param {function} [callback] callback function
		 *  @memberof DataTable#oApi
		 */
		function _fnSortAttachListener(settings, attachTo, colIdx, callback) {
			var col = settings.aoColumns[colIdx];

			_fnBindAction(attachTo, {}, function (e) {
				/* If the column is not sortable - don't to anything */
				if (col.bSortable === false) {
					return;
				}

				// If processing is enabled use a timeout to allow the processing
				// display to be shown - otherwise to it synchronously
				if (settings.oFeatures.bProcessing) {
					_fnProcessingDisplay(settings, true);

					setTimeout(function () {
						_fnSortListener(settings, colIdx, e.shiftKey, callback);

						// In server-side processing, the draw callback will remove the
						// processing display
						if (_fnDataSource(settings) !== 'ssp') {
							_fnProcessingDisplay(settings, false);
						}
					}, 0);
				}
				else {
					_fnSortListener(settings, colIdx, e.shiftKey, callback);
				}
			});
		}


		/**
		 * Set the sorting classes on table's body, Note: it is safe to call this function
		 * when bSort and bSortClasses are false
		 *  @param {object} oSettings dataTables settings object
		 *  @memberof DataTable#oApi
		 */
		function _fnSortingClasses(settings) {
			var oldSort = settings.aLastSort;
			var sortClass = settings.oClasses.sSortColumn;
			var sort = _fnSortFlatten(settings);
			var features = settings.oFeatures;
			var i, ien, colIdx;

			if (features.bSort && features.bSortClasses) {
				// Remove old sorting classes
				for (i = 0, ien = oldSort.length; i < ien; i++) {
					colIdx = oldSort[i].src;

					// Remove column sorting
					$(_pluck(settings.aoData, 'anCells', colIdx))
						.removeClass(sortClass + (i < 2 ? i + 1 : 3));
				}

				// Add new column sorting
				for (i = 0, ien = sort.length; i < ien; i++) {
					colIdx = sort[i].src;

					$(_pluck(settings.aoData, 'anCells', colIdx))
						.addClass(sortClass + (i < 2 ? i + 1 : 3));
				}
			}

			settings.aLastSort = sort;
		}


		// Get the data to sort a column, be it from cache, fresh (populating the
		// cache), or from a sort formatter
		function _fnSortData(settings, idx) {
			// Custom sorting function - provided by the sort data type
			var column = settings.aoColumns[idx];
			var customSort = DataTable.ext.order[column.sSortDataType];
			var customData;

			if (customSort) {
				customData = customSort.call(settings.oInstance, settings, idx,
					_fnColumnIndexToVisible(settings, idx)
				);
			}

			// Use / populate cache
			var row, cellData;
			var formatter = DataTable.ext.type.order[column.sType + "-pre"];

			for (var i = 0, ien = settings.aoData.length; i < ien; i++) {
				row = settings.aoData[i];

				if (!row._aSortData) {
					row._aSortData = [];
				}

				if (!row._aSortData[idx] || customSort) {
					cellData = customSort ?
						customData[i] : // If there was a custom sort function, use data from there
						_fnGetCellData(settings, i, idx, 'sort');

					row._aSortData[idx] = formatter ?
						formatter(cellData) :
						cellData;
				}
			}
		}



		/**
		 * Save the state of a table
		 *  @param {object} oSettings dataTables settings object
		 *  @memberof DataTable#oApi
		 */
		function _fnSaveState(settings) {
			if (settings._bLoadingState) {
				return;
			}

			/* Store the interesting variables */
			var state = {
				time: +new Date(),
				start: settings._iDisplayStart,
				length: settings._iDisplayLength,
				order: $.extend(true, [], settings.aaSorting),
				search: _fnSearchToCamel(settings.oPreviousSearch),
				columns: $.map(settings.aoColumns, function (col, i) {
					return {
						visible: col.bVisible,
						search: _fnSearchToCamel(settings.aoPreSearchCols[i])
					};
				})
			};

			settings.oSavedState = state;
			_fnCallbackFire(settings, "aoStateSaveParams", 'stateSaveParams', [settings, state]);

			if (settings.oFeatures.bStateSave && !settings.bDestroying) {
				settings.fnStateSaveCallback.call(settings.oInstance, settings, state);
			}
		}


		/**
		 * Attempt to load a saved table state
		 *  @param {object} oSettings dataTables settings object
		 *  @param {object} oInit DataTables init object so we can override settings
		 *  @param {function} callback Callback to execute when the state has been loaded
		 *  @memberof DataTable#oApi
		 */
		function _fnLoadState(settings, oInit, callback) {
			if (!settings.oFeatures.bStateSave) {
				callback();
				return;
			}

			var loaded = function (state) {
				_fnImplementState(settings, state, callback);
			}

			var state = settings.fnStateLoadCallback.call(settings.oInstance, settings, loaded);

			if (state !== undefined) {
				_fnImplementState(settings, state, callback);
			}
			// otherwise, wait for the loaded callback to be executed

			return true;
		}

		function _fnImplementState(settings, s, callback) {
			var i, ien;
			var columns = settings.aoColumns;
			settings._bLoadingState = true;

			// When StateRestore was introduced the state could now be implemented at any time
			// Not just initialisation. To do this an api instance is required in some places
			var api = settings._bInitComplete ? new DataTable.Api(settings) : null;

			if (!s || !s.time) {
				settings._bLoadingState = false;
				callback();
				return;
			}

			// Allow custom and plug-in manipulation functions to alter the saved data set and
			// cancelling of loading by returning false
			var abStateLoad = _fnCallbackFire(settings, 'aoStateLoadParams', 'stateLoadParams', [settings, s]);
			if ($.inArray(false, abStateLoad) !== -1) {
				settings._bLoadingState = false;
				callback();
				return;
			}

			// Reject old data
			var duration = settings.iStateDuration;
			if (duration > 0 && s.time < +new Date() - (duration * 1000)) {
				settings._bLoadingState = false;
				callback();
				return;
			}

			// Number of columns have changed - all bets are off, no restore of settings
			if (s.columns && columns.length !== s.columns.length) {
				settings._bLoadingState = false;
				callback();
				return;
			}

			// Store the saved state so it might be accessed at any time
			settings.oLoadedState = $.extend(true, {}, s);

			// Page Length
			if (s.length !== undefined) {
				// If already initialised just set the value directly so that the select element is also updated
				if (api) {
					api.page.len(s.length)
				}
				else {
					settings._iDisplayLength = s.length;
				}
			}

			// Restore key features - todo - for 1.11 this needs to be done by
			// subscribed events
			if (s.start !== undefined) {
				if (api === null) {
					settings._iDisplayStart = s.start;
					settings.iInitDisplayStart = s.start;
				}
				else {
					_fnPageChange(settings, s.start / settings._iDisplayLength);
				}
			}

			// Order
			if (s.order !== undefined) {
				settings.aaSorting = [];
				$.each(s.order, function (i, col) {
					settings.aaSorting.push(col[0] >= columns.length ?
						[0, col[1]] :
						col
					);
				});
			}

			// Search
			if (s.search !== undefined) {
				$.extend(settings.oPreviousSearch, _fnSearchToHung(s.search));
			}

			// Columns
			if (s.columns) {
				for (i = 0, ien = s.columns.length; i < ien; i++) {
					var col = s.columns[i];

					// Visibility
					if (col.visible !== undefined) {
						// If the api is defined, the table has been initialised so we need to use it rather than internal settings
						if (api) {
							// Don't redraw the columns on every iteration of this loop, we will do this at the end instead
							api.column(i).visible(col.visible, false);
						}
						else {
							columns[i].bVisible = col.visible;
						}
					}

					// Search
					if (col.search !== undefined) {
						$.extend(settings.aoPreSearchCols[i], _fnSearchToHung(col.search));
					}
				}

				// If the api is defined then we need to adjust the columns once the visibility has been changed
				if (api) {
					api.columns.adjust();
				}
			}

			settings._bLoadingState = false;
			_fnCallbackFire(settings, 'aoStateLoaded', 'stateLoaded', [settings, s]);
			callback();
		};


		/**
		 * Return the settings object for a particular table
		 *  @param {node} table table we are using as a dataTable
		 *  @returns {object} Settings object - or null if not found
		 *  @memberof DataTable#oApi
		 */
		function _fnSettingsFromNode(table) {
			var settings = DataTable.settings;
			var idx = $.inArray(table, _pluck(settings, 'nTable'));

			return idx !== -1 ?
				settings[idx] :
				null;
		}


		/**
		 * Log an error message
		 *  @param {object} settings dataTables settings object
		 *  @param {int} level log error messages, or display them to the user
		 *  @param {string} msg error message
		 *  @param {int} tn Technical note id to get more information about the error.
		 *  @memberof DataTable#oApi
		 */
		function _fnLog(settings, level, msg, tn) {
			msg = 'DataTables warning: ' +
				(settings ? 'table id=' + settings.sTableId + ' - ' : '') + msg;

			if (tn) {
				msg += '. For more information about this error, please see ' +
					'http://datatables.net/tn/' + tn;
			}

			if (!level) {
				// Backwards compatibility pre 1.10
				var ext = DataTable.ext;
				var type = ext.sErrMode || ext.errMode;

				if (settings) {
					_fnCallbackFire(settings, null, 'error', [settings, tn, msg]);
				}

				if (type == 'alert') {
					alert(msg);
				}
				else if (type == 'throw') {
					throw new Error(msg);
				}
				else if (typeof type == 'function') {
					type(settings, tn, msg);
				}
			}
			else if (window.console && console.log) {
				console.log(msg);
			}
		}


		/**
		 * See if a property is defined on one object, if so assign it to the other object
		 *  @param {object} ret target object
		 *  @param {object} src source object
		 *  @param {string} name property
		 *  @param {string} [mappedName] name to map too - optional, name used if not given
		 *  @memberof DataTable#oApi
		 */
		function _fnMap(ret, src, name, mappedName) {
			if (Array.isArray(name)) {
				$.each(name, function (i, val) {
					if (Array.isArray(val)) {
						_fnMap(ret, src, val[0], val[1]);
					}
					else {
						_fnMap(ret, src, val);
					}
				});

				return;
			}

			if (mappedName === undefined) {
				mappedName = name;
			}

			if (src[name] !== undefined) {
				ret[mappedName] = src[name];
			}
		}


		/**
		 * Extend objects - very similar to jQuery.extend, but deep copy objects, and
		 * shallow copy arrays. The reason we need to do this, is that we don't want to
		 * deep copy array init values (such as aaSorting) since the dev wouldn't be
		 * able to override them, but we do want to deep copy arrays.
		 *  @param {object} out Object to extend
		 *  @param {object} extender Object from which the properties will be applied to
		 *      out
		 *  @param {boolean} breakRefs If true, then arrays will be sliced to take an
		 *      independent copy with the exception of the `data` or `aaData` parameters
		 *      if they are present. This is so you can pass in a collection to
		 *      DataTables and have that used as your data source without breaking the
		 *      references
		 *  @returns {object} out Reference, just for convenience - out === the return.
		 *  @memberof DataTable#oApi
		 *  @todo This doesn't take account of arrays inside the deep copied objects.
		 */
		function _fnExtend(out, extender, breakRefs) {
			var val;

			for (var prop in extender) {
				if (extender.hasOwnProperty(prop)) {
					val = extender[prop];

					if ($.isPlainObject(val)) {
						if (!$.isPlainObject(out[prop])) {
							out[prop] = {};
						}
						$.extend(true, out[prop], val);
					}
					else if (breakRefs && prop !== 'data' && prop !== 'aaData' && Array.isArray(val)) {
						out[prop] = val.slice();
					}
					else {
						out[prop] = val;
					}
				}
			}

			return out;
		}


		/**
		 * Bind an event handers to allow a click or return key to activate the callback.
		 * This is good for accessibility since a return on the keyboard will have the
		 * same effect as a click, if the element has focus.
		 *  @param {element} n Element to bind the action to
		 *  @param {object} oData Data object to pass to the triggered function
		 *  @param {function} fn Callback function for when the event is triggered
		 *  @memberof DataTable#oApi
		 */
		function _fnBindAction(n, oData, fn) {
			$(n)
				.on('click.DT', oData, function (e) {
					$(n).trigger('blur'); // Remove focus outline for mouse users
					fn(e);
				})
				.on('keypress.DT', oData, function (e) {
					if (e.which === 13) {
						e.preventDefault();
						fn(e);
					}
				})
				.on('selectstart.DT', function () {
					/* Take the brutal approach to cancelling text selection */
					return false;
				});
		}


		/**
		 * Register a callback function. Easily allows a callback function to be added to
		 * an array store of callback functions that can then all be called together.
		 *  @param {object} oSettings dataTables settings object
		 *  @param {string} sStore Name of the array storage for the callbacks in oSettings
		 *  @param {function} fn Function to be called back
		 *  @param {string} sName Identifying name for the callback (i.e. a label)
		 *  @memberof DataTable#oApi
		 */
		function _fnCallbackReg(oSettings, sStore, fn, sName) {
			if (fn) {
				oSettings[sStore].push({
					"fn": fn,
					"sName": sName
				});
			}
		}


		/**
		 * Fire callback functions and trigger events. Note that the loop over the
		 * callback array store is done backwards! Further note that you do not want to
		 * fire off triggers in time sensitive applications (for example cell creation)
		 * as its slow.
		 *  @param {object} settings dataTables settings object
		 *  @param {string} callbackArr Name of the array storage for the callbacks in
		 *      oSettings
		 *  @param {string} eventName Name of the jQuery custom event to trigger. If
		 *      null no trigger is fired
		 *  @param {array} args Array of arguments to pass to the callback function /
		 *      trigger
		 *  @memberof DataTable#oApi
		 */
		function _fnCallbackFire(settings, callbackArr, eventName, args) {
			var ret = [];

			if (callbackArr) {
				ret = $.map(settings[callbackArr].slice().reverse(), function (val, i) {
					return val.fn.apply(settings.oInstance, args);
				});
			}

			if (eventName !== null) {
				var e = $.Event(eventName + '.dt');

				$(settings.nTable).trigger(e, args);

				ret.push(e.result);
			}

			return ret;
		}


		function _fnLengthOverflow(settings) {
			var
				start = settings._iDisplayStart,
				end = settings.fnDisplayEnd(),
				len = settings._iDisplayLength;

			/* If we have space to show extra rows (backing up from the end point - then do so */
			if (start >= end) {
				start = end - len;
			}

			// Keep the start record on the current page
			start -= (start % len);

			if (len === -1 || start < 0) {
				start = 0;
			}

			settings._iDisplayStart = start;
		}


		function _fnRenderer(settings, type) {
			var renderer = settings.renderer;
			var host = DataTable.ext.renderer[type];

			if ($.isPlainObject(renderer) && renderer[type]) {
				// Specific renderer for this type. If available use it, otherwise use
				// the default.
				return host[renderer[type]] || host._;
			}
			else if (typeof renderer === 'string') {
				// Common renderer - if there is one available for this type use it,
				// otherwise use the default
				return host[renderer] || host._;
			}

			// Use the default
			return host._;
		}


		/**
		 * Detect the data source being used for the table. Used to simplify the code
		 * a little (ajax) and to make it compress a little smaller.
		 *
		 *  @param {object} settings dataTables settings object
		 *  @returns {string} Data source
		 *  @memberof DataTable#oApi
		 */
		function _fnDataSource(settings) {
			if (settings.oFeatures.bServerSide) {
				return 'ssp';
			}
			else if (settings.ajax || settings.sAjaxSource) {
				return 'ajax';
			}
			return 'dom';
		}




		/**
		 * Computed structure of the DataTables API, defined by the options passed to
		 * `DataTable.Api.register()` when building the API.
		 *
		 * The structure is built in order to speed creation and extension of the Api
		 * objects since the extensions are effectively pre-parsed.
		 *
		 * The array is an array of objects with the following structure, where this
		 * base array represents the Api prototype base:
		 *
		 *     [
		 *       {
		 *         name:      'data'                -- string   - Property name
		 *         val:       function () {},       -- function - Api method (or undefined if just an object
		 *         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
		 *         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
		 *       },
		 *       {
		 *         name:     'row'
		 *         val:       {},
		 *         methodExt: [ ... ],
		 *         propExt:   [
		 *           {
		 *             name:      'data'
		 *             val:       function () {},
		 *             methodExt: [ ... ],
		 *             propExt:   [ ... ]
		 *           },
		 *           ...
		 *         ]
		 *       }
		 *     ]
		 *
		 * @type {Array}
		 * @ignore
		 */
		var __apiStruct = [];


		/**
		 * `Array.prototype` reference.
		 *
		 * @type object
		 * @ignore
		 */
		var __arrayProto = Array.prototype;


		/**
		 * Abstraction for `context` parameter of the `Api` constructor to allow it to
		 * take several different forms for ease of use.
		 *
		 * Each of the input parameter types will be converted to a DataTables settings
		 * object where possible.
		 *
		 * @param  {string|node|jQuery|object} mixed DataTable identifier. Can be one
		 *   of:
		 *
		 *   * `string` - jQuery selector. Any DataTables' matching the given selector
		 *     with be found and used.
		 *   * `node` - `TABLE` node which has already been formed into a DataTable.
		 *   * `jQuery` - A jQuery object of `TABLE` nodes.
		 *   * `object` - DataTables settings object
		 *   * `DataTables.Api` - API instance
		 * @return {array|null} Matching DataTables settings objects. `null` or
		 *   `undefined` is returned if no matching DataTable is found.
		 * @ignore
		 */
		var _toSettings = function (mixed) {
			var idx, jq;
			var settings = DataTable.settings;
			var tables = $.map(settings, function (el, i) {
				return el.nTable;
			});

			if (!mixed) {
				return [];
			}
			else if (mixed.nTable && mixed.oApi) {
				// DataTables settings object
				return [mixed];
			}
			else if (mixed.nodeName && mixed.nodeName.toLowerCase() === 'table') {
				// Table node
				idx = $.inArray(mixed, tables);
				return idx !== -1 ? [settings[idx]] : null;
			}
			else if (mixed && typeof mixed.settings === 'function') {
				return mixed.settings().toArray();
			}
			else if (typeof mixed === 'string') {
				// jQuery selector
				jq = $(mixed);
			}
			else if (mixed instanceof $) {
				// jQuery object (also DataTables instance)
				jq = mixed;
			}

			if (jq) {
				return jq.map(function (i) {
					idx = $.inArray(this, tables);
					return idx !== -1 ? settings[idx] : null;
				}).toArray();
			}
		};


		/**
		 * DataTables API class - used to control and interface with  one or more
		 * DataTables enhanced tables.
		 *
		 * The API class is heavily based on jQuery, presenting a chainable interface
		 * that you can use to interact with tables. Each instance of the API class has
		 * a "context" - i.e. the tables that it will operate on. This could be a single
		 * table, all tables on a page or a sub-set thereof.
		 *
		 * Additionally the API is designed to allow you to easily work with the data in
		 * the tables, retrieving and manipulating it as required. This is done by
		 * presenting the API class as an array like interface. The contents of the
		 * array depend upon the actions requested by each method (for example
		 * `rows().nodes()` will return an array of nodes, while `rows().data()` will
		 * return an array of objects or arrays depending upon your table's
		 * configuration). The API object has a number of array like methods (`push`,
		 * `pop`, `reverse` etc) as well as additional helper methods (`each`, `pluck`,
		 * `unique` etc) to assist your working with the data held in a table.
		 *
		 * Most methods (those which return an Api instance) are chainable, which means
		 * the return from a method call also has all of the methods available that the
		 * top level object had. For example, these two calls are equivalent:
		 *
		 *     // Not chained
		 *     api.row.add( {...} );
		 *     api.draw();
		 *
		 *     // Chained
		 *     api.row.add( {...} ).draw();
		 *
		 * @class DataTable.Api
		 * @param {array|object|string|jQuery} context DataTable identifier. This is
		 *   used to define which DataTables enhanced tables this API will operate on.
		 *   Can be one of:
		 *
		 *   * `string` - jQuery selector. Any DataTables' matching the given selector
		 *     with be found and used.
		 *   * `node` - `TABLE` node which has already been formed into a DataTable.
		 *   * `jQuery` - A jQuery object of `TABLE` nodes.
		 *   * `object` - DataTables settings object
		 * @param {array} [data] Data to initialise the Api instance with.
		 *
		 * @example
		 *   // Direct initialisation during DataTables construction
		 *   var api = $('#example').DataTable();
		 *
		 * @example
		 *   // Initialisation using a DataTables jQuery object
		 *   var api = $('#example').dataTable().api();
		 *
		 * @example
		 *   // Initialisation as a constructor
		 *   var api = new $.fn.DataTable.Api( 'table.dataTable' );
		 */
		_Api = function (context, data) {
			if (!(this instanceof _Api)) {
				return new _Api(context, data);
			}

			var settings = [];
			var ctxSettings = function (o) {
				var a = _toSettings(o);
				if (a) {
					settings.push.apply(settings, a);
				}
			};

			if (Array.isArray(context)) {
				for (var i = 0, ien = context.length; i < ien; i++) {
					ctxSettings(context[i]);
				}
			}
			else {
				ctxSettings(context);
			}

			// Remove duplicates
			this.context = _unique(settings);

			// Initial data
			if (data) {
				$.merge(this, data);
			}

			// selector
			this.selector = {
				rows: null,
				cols: null,
				opts: null
			};

			_Api.extend(this, this, __apiStruct);
		};

		DataTable.Api = _Api;

		// Don't destroy the existing prototype, just extend it. Required for jQuery 2's
		// isPlainObject.
		$.extend(_Api.prototype, {
			any: function () {
				return this.count() !== 0;
			},


			concat: __arrayProto.concat,


			context: [], // array of table settings objects


			count: function () {
				return this.flatten().length;
			},


			each: function (fn) {
				for (var i = 0, ien = this.length; i < ien; i++) {
					fn.call(this, this[i], i, this);
				}

				return this;
			},


			eq: function (idx) {
				var ctx = this.context;

				return ctx.length > idx ?
					new _Api(ctx[idx], this[idx]) :
					null;
			},


			filter: function (fn) {
				var a = [];

				if (__arrayProto.filter) {
					a = __arrayProto.filter.call(this, fn, this);
				}
				else {
					// Compatibility for browsers without EMCA-252-5 (JS 1.6)
					for (var i = 0, ien = this.length; i < ien; i++) {
						if (fn.call(this, this[i], i, this)) {
							a.push(this[i]);
						}
					}
				}

				return new _Api(this.context, a);
			},


			flatten: function () {
				var a = [];
				return new _Api(this.context, a.concat.apply(a, this.toArray()));
			},


			join: __arrayProto.join,


			indexOf: __arrayProto.indexOf || function (obj, start) {
				for (var i = (start || 0), ien = this.length; i < ien; i++) {
					if (this[i] === obj) {
						return i;
					}
				}
				return -1;
			},

			iterator: function (flatten, type, fn, alwaysNew) {
				var
					a = [], ret,
					i, ien, j, jen,
					context = this.context,
					rows, items, item,
					selector = this.selector;

				// Argument shifting
				if (typeof flatten === 'string') {
					alwaysNew = fn;
					fn = type;
					type = flatten;
					flatten = false;
				}

				for (i = 0, ien = context.length; i < ien; i++) {
					var apiInst = new _Api(context[i]);

					if (type === 'table') {
						ret = fn.call(apiInst, context[i], i);

						if (ret !== undefined) {
							a.push(ret);
						}
					}
					else if (type === 'columns' || type === 'rows') {
						// this has same length as context - one entry for each table
						ret = fn.call(apiInst, context[i], this[i], i);

						if (ret !== undefined) {
							a.push(ret);
						}
					}
					else if (type === 'column' || type === 'column-rows' || type === 'row' || type === 'cell') {
						// columns and rows share the same structure.
						// 'this' is an array of column indexes for each context
						items = this[i];

						if (type === 'column-rows') {
							rows = _selector_row_indexes(context[i], selector.opts);
						}

						for (j = 0, jen = items.length; j < jen; j++) {
							item = items[j];

							if (type === 'cell') {
								ret = fn.call(apiInst, context[i], item.row, item.column, i, j);
							}
							else {
								ret = fn.call(apiInst, context[i], item, i, j, rows);
							}

							if (ret !== undefined) {
								a.push(ret);
							}
						}
					}
				}

				if (a.length || alwaysNew) {
					var api = new _Api(context, flatten ? a.concat.apply([], a) : a);
					var apiSelector = api.selector;
					apiSelector.rows = selector.rows;
					apiSelector.cols = selector.cols;
					apiSelector.opts = selector.opts;
					return api;
				}
				return this;
			},


			lastIndexOf: __arrayProto.lastIndexOf || function (obj, start) {
				// Bit cheeky...
				return this.indexOf.apply(this.toArray.reverse(), arguments);
			},


			length: 0,


			map: function (fn) {
				var a = [];

				if (__arrayProto.map) {
					a = __arrayProto.map.call(this, fn, this);
				}
				else {
					// Compatibility for browsers without EMCA-252-5 (JS 1.6)
					for (var i = 0, ien = this.length; i < ien; i++) {
						a.push(fn.call(this, this[i], i));
					}
				}

				return new _Api(this.context, a);
			},


			pluck: function (prop) {
				let fn = DataTable.util.get(prop);

				return this.map(function (el) {
					return fn(el);
				});
			},

			pop: __arrayProto.pop,


			push: __arrayProto.push,


			// Does not return an API instance
			reduce: __arrayProto.reduce || function (fn, init) {
				return _fnReduce(this, fn, init, 0, this.length, 1);
			},


			reduceRight: __arrayProto.reduceRight || function (fn, init) {
				return _fnReduce(this, fn, init, this.length - 1, -1, -1);
			},


			reverse: __arrayProto.reverse,


			// Object with rows, columns and opts
			selector: null,


			shift: __arrayProto.shift,


			slice: function () {
				return new _Api(this.context, this);
			},


			sort: __arrayProto.sort, // ? name - order?


			splice: __arrayProto.splice,


			toArray: function () {
				return __arrayProto.slice.call(this);
			},


			to$: function () {
				return $(this);
			},


			toJQuery: function () {
				return $(this);
			},


			unique: function () {
				return new _Api(this.context, _unique(this));
			},


			unshift: __arrayProto.unshift
		});


		_Api.extend = function (scope, obj, ext) {
			// Only extend API instances and static properties of the API
			if (!ext.length || !obj || (!(obj instanceof _Api) && !obj.__dt_wrapper)) {
				return;
			}

			var
				i, ien,
				struct,
				methodScoping = function (scope, fn, struc) {
					return function () {
						var ret = fn.apply(scope, arguments);

						// Method extension
						_Api.extend(ret, ret, struc.methodExt);
						return ret;
					};
				};

			for (i = 0, ien = ext.length; i < ien; i++) {
				struct = ext[i];

				// Value
				obj[struct.name] = struct.type === 'function' ?
					methodScoping(scope, struct.val, struct) :
					struct.type === 'object' ?
						{} :
						struct.val;

				obj[struct.name].__dt_wrapper = true;

				// Property extension
				_Api.extend(scope, obj[struct.name], struct.propExt);
			}
		};


		// @todo - Is there need for an augment function?
		// _Api.augment = function ( inst, name )
		// {
		// 	// Find src object in the structure from the name
		// 	var parts = name.split('.');

		// 	_Api.extend( inst, obj );
		// };


		//     [
		//       {
		//         name:      'data'                -- string   - Property name
		//         val:       function () {},       -- function - Api method (or undefined if just an object
		//         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
		//         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
		//       },
		//       {
		//         name:     'row'
		//         val:       {},
		//         methodExt: [ ... ],
		//         propExt:   [
		//           {
		//             name:      'data'
		//             val:       function () {},
		//             methodExt: [ ... ],
		//             propExt:   [ ... ]
		//           },
		//           ...
		//         ]
		//       }
		//     ]

		_Api.register = _api_register = function (name, val) {
			if (Array.isArray(name)) {
				for (var j = 0, jen = name.length; j < jen; j++) {
					_Api.register(name[j], val);
				}
				return;
			}

			var
				i, ien,
				heir = name.split('.'),
				struct = __apiStruct,
				key, method;

			var find = function (src, name) {
				for (var i = 0, ien = src.length; i < ien; i++) {
					if (src[i].name === name) {
						return src[i];
					}
				}
				return null;
			};

			for (i = 0, ien = heir.length; i < ien; i++) {
				method = heir[i].indexOf('()') !== -1;
				key = method ?
					heir[i].replace('()', '') :
					heir[i];

				var src = find(struct, key);
				if (!src) {
					src = {
						name: key,
						val: {},
						methodExt: [],
						propExt: [],
						type: 'object'
					};
					struct.push(src);
				}

				if (i === ien - 1) {
					src.val = val;
					src.type = typeof val === 'function' ?
						'function' :
						$.isPlainObject(val) ?
							'object' :
							'other';
				}
				else {
					struct = method ?
						src.methodExt :
						src.propExt;
				}
			}
		};

		_Api.registerPlural = _api_registerPlural = function (pluralName, singularName, val) {
			_Api.register(pluralName, val);

			_Api.register(singularName, function () {
				var ret = val.apply(this, arguments);

				if (ret === this) {
					// Returned item is the API instance that was passed in, return it
					return this;
				}
				else if (ret instanceof _Api) {
					// New API instance returned, want the value from the first item
					// in the returned array for the singular result.
					return ret.length ?
						Array.isArray(ret[0]) ?
							new _Api(ret.context, ret[0]) : // Array results are 'enhanced'
							ret[0] :
						undefined;
				}

				// Non-API return - just fire it back
				return ret;
			});
		};


		/**
		 * Selector for HTML tables. Apply the given selector to the give array of
		 * DataTables settings objects.
		 *
		 * @param {string|integer} [selector] jQuery selector string or integer
		 * @param  {array} Array of DataTables settings objects to be filtered
		 * @return {array}
		 * @ignore
		 */
		var __table_selector = function (selector, a) {
			if (Array.isArray(selector)) {
				return $.map(selector, function (item) {
					return __table_selector(item, a);
				});
			}

			// Integer is used to pick out a table by index
			if (typeof selector === 'number') {
				return [a[selector]];
			}

			// Perform a jQuery selector on the table nodes
			var nodes = $.map(a, function (el, i) {
				return el.nTable;
			});

			return $(nodes)
				.filter(selector)
				.map(function (i) {
					// Need to translate back from the table node to the settings
					var idx = $.inArray(this, nodes);
					return a[idx];
				})
				.toArray();
		};



		/**
		 * Context selector for the API's context (i.e. the tables the API instance
		 * refers to.
		 *
		 * @name    DataTable.Api#tables
		 * @param {string|integer} [selector] Selector to pick which tables the iterator
		 *   should operate on. If not given, all tables in the current context are
		 *   used. This can be given as a jQuery selector (for example `':gt(0)'`) to
		 *   select multiple tables or as an integer to select a single table.
		 * @returns {DataTable.Api} Returns a new API instance if a selector is given.
		 */
		_api_register('tables()', function (selector) {
			// A new instance is created if there was a selector specified
			return selector !== undefined && selector !== null ?
				new _Api(__table_selector(selector, this.context)) :
				this;
		});


		_api_register('table()', function (selector) {
			var tables = this.tables(selector);
			var ctx = tables.context;

			// Truncate to the first matched table
			return ctx.length ?
				new _Api(ctx[0]) :
				tables;
		});


		_api_registerPlural('tables().nodes()', 'table().node()', function () {
			return this.iterator('table', function (ctx) {
				return ctx.nTable;
			}, 1);
		});


		_api_registerPlural('tables().body()', 'table().body()', function () {
			return this.iterator('table', function (ctx) {
				return ctx.nTBody;
			}, 1);
		});


		_api_registerPlural('tables().header()', 'table().header()', function () {
			return this.iterator('table', function (ctx) {
				return ctx.nTHead;
			}, 1);
		});


		_api_registerPlural('tables().footer()', 'table().footer()', function () {
			return this.iterator('table', function (ctx) {
				return ctx.nTFoot;
			}, 1);
		});


		_api_registerPlural('tables().containers()', 'table().container()', function () {
			return this.iterator('table', function (ctx) {
				return ctx.nTableWrapper;
			}, 1);
		});



		/**
		 * Redraw the tables in the current context.
		 */
		_api_register('draw()', function (paging) {
			return this.iterator('table', function (settings) {
				if (paging === 'page') {
					_fnDraw(settings);
				}
				else {
					if (typeof paging === 'string') {
						paging = paging === 'full-hold' ?
							false :
							true;
					}

					_fnReDraw(settings, paging === false);
				}
			});
		});



		/**
		 * Get the current page index.
		 *
		 * @return {integer} Current page index (zero based)
		 *//**
		* Set the current page.
		*
		* Note that if you attempt to show a page which does not exist, DataTables will
		* not throw an error, but rather reset the paging.
		*
		* @param {integer|string} action The paging action to take. This can be one of:
		*  * `integer` - The page index to jump to
		*  * `string` - An action to take:
		*    * `first` - Jump to first page.
		*    * `next` - Jump to the next page
		*    * `previous` - Jump to previous page
		*    * `last` - Jump to the last page.
		* @returns {DataTables.Api} this
		*/
		_api_register('page()', function (action) {
			if (action === undefined) {
				return this.page.info().page; // not an expensive call
			}

			// else, have an action to take on all tables
			return this.iterator('table', function (settings) {
				_fnPageChange(settings, action);
			});
		});


		/**
		 * Paging information for the first table in the current context.
		 *
		 * If you require paging information for another table, use the `table()` method
		 * with a suitable selector.
		 *
		 * @return {object} Object with the following properties set:
		 *  * `page` - Current page index (zero based - i.e. the first page is `0`)
		 *  * `pages` - Total number of pages
		 *  * `start` - Display index for the first record shown on the current page
		 *  * `end` - Display index for the last record shown on the current page
		 *  * `length` - Display length (number of records). Note that generally `start
		 *    + length = end`, but this is not always true, for example if there are
		 *    only 2 records to show on the final page, with a length of 10.
		 *  * `recordsTotal` - Full data set length
		 *  * `recordsDisplay` - Data set length once the current filtering criterion
		 *    are applied.
		 */
		_api_register('page.info()', function (action) {
			if (this.context.length === 0) {
				return undefined;
			}

			var
				settings = this.context[0],
				start = settings._iDisplayStart,
				len = settings.oFeatures.bPaginate ? settings._iDisplayLength : -1,
				visRecords = settings.fnRecordsDisplay(),
				all = len === -1;

			return {
				"page": all ? 0 : Math.floor(start / len),
				"pages": all ? 1 : Math.ceil(visRecords / len),
				"start": start,
				"end": settings.fnDisplayEnd(),
				"length": len,
				"recordsTotal": settings.fnRecordsTotal(),
				"recordsDisplay": visRecords,
				"serverSide": _fnDataSource(settings) === 'ssp'
			};
		});


		/**
		 * Get the current page length.
		 *
		 * @return {integer} Current page length. Note `-1` indicates that all records
		 *   are to be shown.
		 *//**
		* Set the current page length.
		*
		* @param {integer} Page length to set. Use `-1` to show all records.
		* @returns {DataTables.Api} this
		*/
		_api_register('page.len()', function (len) {
			// Note that we can't call this function 'length()' because `length`
			// is a Javascript property of functions which defines how many arguments
			// the function expects.
			if (len === undefined) {
				return this.context.length !== 0 ?
					this.context[0]._iDisplayLength :
					undefined;
			}

			// else, set the page length
			return this.iterator('table', function (settings) {
				_fnLengthChange(settings, len);
			});
		});



		var __reload = function (settings, holdPosition, callback) {
			// Use the draw event to trigger a callback
			if (callback) {
				var api = new _Api(settings);

				api.one('draw', function () {
					callback(api.ajax.json());
				});
			}

			if (_fnDataSource(settings) == 'ssp') {
				_fnReDraw(settings, holdPosition);
			}
			else {
				_fnProcessingDisplay(settings, true);

				// Cancel an existing request
				var xhr = settings.jqXHR;
				if (xhr && xhr.readyState !== 4) {
					xhr.abort();
				}

				// Trigger xhr
				_fnBuildAjax(settings, [], function (json) {
					_fnClearTable(settings);

					var data = _fnAjaxDataSrc(settings, json);
					for (var i = 0, ien = data.length; i < ien; i++) {
						_fnAddData(settings, data[i]);
					}

					_fnReDraw(settings, holdPosition);
					_fnProcessingDisplay(settings, false);
				});
			}
		};


		/**
		 * Get the JSON response from the last Ajax request that DataTables made to the
		 * server. Note that this returns the JSON from the first table in the current
		 * context.
		 *
		 * @return {object} JSON received from the server.
		 */
		_api_register('ajax.json()', function () {
			var ctx = this.context;

			if (ctx.length > 0) {
				return ctx[0].json;
			}

			// else return undefined;
		});


		/**
		 * Get the data submitted in the last Ajax request
		 */
		_api_register('ajax.params()', function () {
			var ctx = this.context;

			if (ctx.length > 0) {
				return ctx[0].oAjaxData;
			}

			// else return undefined;
		});


		/**
		 * Reload tables from the Ajax data source. Note that this function will
		 * automatically re-draw the table when the remote data has been loaded.
		 *
		 * @param {boolean} [reset=true] Reset (default) or hold the current paging
		 *   position. A full re-sort and re-filter is performed when this method is
		 *   called, which is why the pagination reset is the default action.
		 * @returns {DataTables.Api} this
		 */
		_api_register('ajax.reload()', function (callback, resetPaging) {
			return this.iterator('table', function (settings) {
				__reload(settings, resetPaging === false, callback);
			});
		});


		/**
		 * Get the current Ajax URL. Note that this returns the URL from the first
		 * table in the current context.
		 *
		 * @return {string} Current Ajax source URL
		 *//**
		* Set the Ajax URL. Note that this will set the URL for all tables in the
		* current context.
		*
		* @param {string} url URL to set.
		* @returns {DataTables.Api} this
		*/
		_api_register('ajax.url()', function (url) {
			var ctx = this.context;

			if (url === undefined) {
				// get
				if (ctx.length === 0) {
					return undefined;
				}
				ctx = ctx[0];

				return ctx.ajax ?
					$.isPlainObject(ctx.ajax) ?
						ctx.ajax.url :
						ctx.ajax :
					ctx.sAjaxSource;
			}

			// set
			return this.iterator('table', function (settings) {
				if ($.isPlainObject(settings.ajax)) {
					settings.ajax.url = url;
				}
				else {
					settings.ajax = url;
				}
				// No need to consider sAjaxSource here since DataTables gives priority
				// to `ajax` over `sAjaxSource`. So setting `ajax` here, renders any
				// value of `sAjaxSource` redundant.
			});
		});


		/**
		 * Load data from the newly set Ajax URL. Note that this method is only
		 * available when `ajax.url()` is used to set a URL. Additionally, this method
		 * has the same effect as calling `ajax.reload()` but is provided for
		 * convenience when setting a new URL. Like `ajax.reload()` it will
		 * automatically redraw the table once the remote data has been loaded.
		 *
		 * @returns {DataTables.Api} this
		 */
		_api_register('ajax.url().load()', function (callback, resetPaging) {
			// Same as a reload, but makes sense to present it for easy access after a
			// url change
			return this.iterator('table', function (ctx) {
				__reload(ctx, resetPaging === false, callback);
			});
		});




		var _selector_run = function (type, selector, selectFn, settings, opts) {
			var
				out = [], res,
				a, i, ien, j, jen,
				selectorType = typeof selector;

			// Can't just check for isArray here, as an API or jQuery instance might be
			// given with their array like look
			if (!selector || selectorType === 'string' || selectorType === 'function' || selector.length === undefined) {
				selector = [selector];
			}

			for (i = 0, ien = selector.length; i < ien; i++) {
				// Only split on simple strings - complex expressions will be jQuery selectors
				a = selector[i] && selector[i].split && !selector[i].match(/[\[\(:]/) ?
					selector[i].split(',') :
					[selector[i]];

				for (j = 0, jen = a.length; j < jen; j++) {
					res = selectFn(typeof a[j] === 'string' ? (a[j]).trim() : a[j]);

					if (res && res.length) {
						out = out.concat(res);
					}
				}
			}

			// selector extensions
			var ext = _ext.selector[type];
			if (ext.length) {
				for (i = 0, ien = ext.length; i < ien; i++) {
					out = ext[i](settings, opts, out);
				}
			}

			return _unique(out);
		};


		var _selector_opts = function (opts) {
			if (!opts) {
				opts = {};
			}

			// Backwards compatibility for 1.9- which used the terminology filter rather
			// than search
			if (opts.filter && opts.search === undefined) {
				opts.search = opts.filter;
			}

			return $.extend({
				search: 'none',
				order: 'current',
				page: 'all'
			}, opts);
		};


		var _selector_first = function (inst) {
			// Reduce the API instance to the first item found
			for (var i = 0, ien = inst.length; i < ien; i++) {
				if (inst[i].length > 0) {
					// Assign the first element to the first item in the instance
					// and truncate the instance and context
					inst[0] = inst[i];
					inst[0].length = 1;
					inst.length = 1;
					inst.context = [inst.context[i]];

					return inst;
				}
			}

			// Not found - return an empty instance
			inst.length = 0;
			return inst;
		};


		var _selector_row_indexes = function (settings, opts) {
			var
				i, ien, tmp, a = [],
				displayFiltered = settings.aiDisplay,
				displayMaster = settings.aiDisplayMaster;

			var
				search = opts.search,  // none, applied, removed
				order = opts.order,   // applied, current, index (original - compatibility with 1.9)
				page = opts.page;    // all, current

			if (_fnDataSource(settings) == 'ssp') {
				// In server-side processing mode, most options are irrelevant since
				// rows not shown don't exist and the index order is the applied order
				// Removed is a special case - for consistency just return an empty
				// array
				return search === 'removed' ?
					[] :
					_range(0, displayMaster.length);
			}
			else if (page == 'current') {
				// Current page implies that order=current and filter=applied, since it is
				// fairly senseless otherwise, regardless of what order and search actually
				// are
				for (i = settings._iDisplayStart, ien = settings.fnDisplayEnd(); i < ien; i++) {
					a.push(displayFiltered[i]);
				}
			}
			else if (order == 'current' || order == 'applied') {
				if (search == 'none') {
					a = displayMaster.slice();
				}
				else if (search == 'applied') {
					a = displayFiltered.slice();
				}
				else if (search == 'removed') {
					// O(n+m) solution by creating a hash map
					var displayFilteredMap = {};

					for (var i = 0, ien = displayFiltered.length; i < ien; i++) {
						displayFilteredMap[displayFiltered[i]] = null;
					}

					a = $.map(displayMaster, function (el) {
						return !displayFilteredMap.hasOwnProperty(el) ?
							el :
							null;
					});
				}
			}
			else if (order == 'index' || order == 'original') {
				for (i = 0, ien = settings.aoData.length; i < ien; i++) {
					if (search == 'none') {
						a.push(i);
					}
					else { // applied | removed
						tmp = $.inArray(i, displayFiltered);

						if ((tmp === -1 && search == 'removed') ||
							(tmp >= 0 && search == 'applied')) {
							a.push(i);
						}
					}
				}
			}

			return a;
		};


		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
		 * Rows
		 *
		 * {}          - no selector - use all available rows
		 * {integer}   - row aoData index
		 * {node}      - TR node
		 * {string}    - jQuery selector to apply to the TR elements
		 * {array}     - jQuery array of nodes, or simply an array of TR nodes
		 *
		 */
		var __row_selector = function (settings, selector, opts) {
			var rows;
			var run = function (sel) {
				var selInt = _intVal(sel);
				var i, ien;
				var aoData = settings.aoData;

				// Short cut - selector is a number and no options provided (default is
				// all records, so no need to check if the index is in there, since it
				// must be - dev error if the index doesn't exist).
				if (selInt !== null && !opts) {
					return [selInt];
				}

				if (!rows) {
					rows = _selector_row_indexes(settings, opts);
				}

				if (selInt !== null && $.inArray(selInt, rows) !== -1) {
					// Selector - integer
					return [selInt];
				}
				else if (sel === null || sel === undefined || sel === '') {
					// Selector - none
					return rows;
				}

				// Selector - function
				if (typeof sel === 'function') {
					return $.map(rows, function (idx) {
						var row = aoData[idx];
						return sel(idx, row._aData, row.nTr) ? idx : null;
					});
				}

				// Selector - node
				if (sel.nodeName) {
					var rowIdx = sel._DT_RowIndex;  // Property added by DT for fast lookup
					var cellIdx = sel._DT_CellIndex;

					if (rowIdx !== undefined) {
						// Make sure that the row is actually still present in the table
						return aoData[rowIdx] && aoData[rowIdx].nTr === sel ?
							[rowIdx] :
							[];
					}
					else if (cellIdx) {
						return aoData[cellIdx.row] && aoData[cellIdx.row].nTr === sel.parentNode ?
							[cellIdx.row] :
							[];
					}
					else {
						var host = $(sel).closest('*[data-dt-row]');
						return host.length ?
							[host.data('dt-row')] :
							[];
					}
				}

				// ID selector. Want to always be able to select rows by id, regardless
				// of if the tr element has been created or not, so can't rely upon
				// jQuery here - hence a custom implementation. This does not match
				// Sizzle's fast selector or HTML4 - in HTML5 the ID can be anything,
				// but to select it using a CSS selector engine (like Sizzle or
				// querySelect) it would need to need to be escaped for some characters.
				// DataTables simplifies this for row selectors since you can select
				// only a row. A # indicates an id any anything that follows is the id -
				// unescaped.
				if (typeof sel === 'string' && sel.charAt(0) === '#') {
					// get row index from id
					var rowObj = settings.aIds[sel.replace(/^#/, '')];
					if (rowObj !== undefined) {
						return [rowObj.idx];
					}

					// need to fall through to jQuery in case there is DOM id that
					// matches
				}

				// Get nodes in the order from the `rows` array with null values removed
				var nodes = _removeEmpty(
					_pluck_order(settings.aoData, rows, 'nTr')
				);

				// Selector - jQuery selector string, array of nodes or jQuery object/
				// As jQuery's .filter() allows jQuery objects to be passed in filter,
				// it also allows arrays, so this will cope with all three options
				return $(nodes)
					.filter(sel)
					.map(function () {
						return this._DT_RowIndex;
					})
					.toArray();
			};

			return _selector_run('row', selector, run, settings, opts);
		};


		_api_register('rows()', function (selector, opts) {
			// argument shifting
			if (selector === undefined) {
				selector = '';
			}
			else if ($.isPlainObject(selector)) {
				opts = selector;
				selector = '';
			}

			opts = _selector_opts(opts);

			var inst = this.iterator('table', function (settings) {
				return __row_selector(settings, selector, opts);
			}, 1);

			// Want argument shifting here and in __row_selector?
			inst.selector.rows = selector;
			inst.selector.opts = opts;

			return inst;
		});

		_api_register('rows().nodes()', function () {
			return this.iterator('row', function (settings, row) {
				return settings.aoData[row].nTr || undefined;
			}, 1);
		});

		_api_register('rows().data()', function () {
			return this.iterator(true, 'rows', function (settings, rows) {
				return _pluck_order(settings.aoData, rows, '_aData');
			}, 1);
		});

		_api_registerPlural('rows().cache()', 'row().cache()', function (type) {
			return this.iterator('row', function (settings, row) {
				var r = settings.aoData[row];
				return type === 'search' ? r._aFilterData : r._aSortData;
			}, 1);
		});

		_api_registerPlural('rows().invalidate()', 'row().invalidate()', function (src) {
			return this.iterator('row', function (settings, row) {
				_fnInvalidate(settings, row, src);
			});
		});

		_api_registerPlural('rows().indexes()', 'row().index()', function () {
			return this.iterator('row', function (settings, row) {
				return row;
			}, 1);
		});

		_api_registerPlural('rows().ids()', 'row().id()', function (hash) {
			var a = [];
			var context = this.context;

			// `iterator` will drop undefined values, but in this case we want them
			for (var i = 0, ien = context.length; i < ien; i++) {
				for (var j = 0, jen = this[i].length; j < jen; j++) {
					var id = context[i].rowIdFn(context[i].aoData[this[i][j]]._aData);
					a.push((hash === true ? '#' : '') + id);
				}
			}

			return new _Api(context, a);
		});

		_api_registerPlural('rows().remove()', 'row().remove()', function () {
			var that = this;

			this.iterator('row', function (settings, row, thatIdx) {
				var data = settings.aoData;
				var rowData = data[row];
				var i, ien, j, jen;
				var loopRow, loopCells;

				data.splice(row, 1);

				// Update the cached indexes
				for (i = 0, ien = data.length; i < ien; i++) {
					loopRow = data[i];
					loopCells = loopRow.anCells;

					// Rows
					if (loopRow.nTr !== null) {
						loopRow.nTr._DT_RowIndex = i;
					}

					// Cells
					if (loopCells !== null) {
						for (j = 0, jen = loopCells.length; j < jen; j++) {
							loopCells[j]._DT_CellIndex.row = i;
						}
					}
				}

				// Delete from the display arrays
				_fnDeleteIndex(settings.aiDisplayMaster, row);
				_fnDeleteIndex(settings.aiDisplay, row);
				_fnDeleteIndex(that[thatIdx], row, false); // maintain local indexes

				// For server-side processing tables - subtract the deleted row from the count
				if (settings._iRecordsDisplay > 0) {
					settings._iRecordsDisplay--;
				}

				// Check for an 'overflow' they case for displaying the table
				_fnLengthOverflow(settings);

				// Remove the row's ID reference if there is one
				var id = settings.rowIdFn(rowData._aData);
				if (id !== undefined) {
					delete settings.aIds[id];
				}
			});

			this.iterator('table', function (settings) {
				for (var i = 0, ien = settings.aoData.length; i < ien; i++) {
					settings.aoData[i].idx = i;
				}
			});

			return this;
		});


		_api_register('rows.add()', function (rows) {
			var newRows = this.iterator('table', function (settings) {
				var row, i, ien;
				var out = [];

				for (i = 0, ien = rows.length; i < ien; i++) {
					row = rows[i];

					if (row.nodeName && row.nodeName.toUpperCase() === 'TR') {
						out.push(_fnAddTr(settings, row)[0]);
					}
					else {
						out.push(_fnAddData(settings, row));
					}
				}

				return out;
			}, 1);

			// Return an Api.rows() extended instance, so rows().nodes() etc can be used
			var modRows = this.rows(-1);
			modRows.pop();
			$.merge(modRows, newRows);

			return modRows;
		});





		/**
		 *
		 */
		_api_register('row()', function (selector, opts) {
			return _selector_first(this.rows(selector, opts));
		});


		_api_register('row().data()', function (data) {
			var ctx = this.context;

			if (data === undefined) {
				// Get
				return ctx.length && this.length ?
					ctx[0].aoData[this[0]]._aData :
					undefined;
			}

			// Set
			var row = ctx[0].aoData[this[0]];
			row._aData = data;

			// If the DOM has an id, and the data source is an array
			if (Array.isArray(data) && row.nTr && row.nTr.id) {
				_fnSetObjectDataFn(ctx[0].rowId)(data, row.nTr.id);
			}

			// Automatically invalidate
			_fnInvalidate(ctx[0], this[0], 'data');

			return this;
		});


		_api_register('row().node()', function () {
			var ctx = this.context;

			return ctx.length && this.length ?
				ctx[0].aoData[this[0]].nTr || null :
				null;
		});


		_api_register('row.add()', function (row) {
			// Allow a jQuery object to be passed in - only a single row is added from
			// it though - the first element in the set
			if (row instanceof $ && row.length) {
				row = row[0];
			}

			var rows = this.iterator('table', function (settings) {
				if (row.nodeName && row.nodeName.toUpperCase() === 'TR') {
					return _fnAddTr(settings, row)[0];
				}
				return _fnAddData(settings, row);
			});

			// Return an Api.rows() extended instance, with the newly added row selected
			return this.row(rows[0]);
		});


		$(document).on('plugin-init.dt', function (e, context) {
			var api = new _Api(context);

			const namespace = 'on-plugin-init';
			const stateSaveParamsEvent = `stateSaveParams.${namespace}`;
			const destroyEvent = `destroy.${namespace}`;

			api.on(stateSaveParamsEvent, function (e, settings, d) {
				// This could be more compact with the API, but it is a lot faster as a simple
				// internal loop
				var idFn = settings.rowIdFn;
				var data = settings.aoData;
				var ids = [];

				for (var i = 0; i < data.length; i++) {
					if (data[i]._detailsShow) {
						ids.push('#' + idFn(data[i]._aData));
					}
				}

				d.childRows = ids;
			});

			api.on(destroyEvent, function () {
				api.off(`${stateSaveParamsEvent} ${destroyEvent}`);
			});

			var loaded = api.state.loaded();

			if (loaded && loaded.childRows) {
				api
					.rows($.map(loaded.childRows, function (id) {
						return id.replace(/:/g, '\\:')
					}))
					.every(function () {
						_fnCallbackFire(context, null, 'requestChild', [this])
					});
			}
		});

		var __details_add = function (ctx, row, data, klass) {
			// Convert to array of TR elements
			var rows = [];
			var addRow = function (r, k) {
				// Recursion to allow for arrays of jQuery objects
				if (Array.isArray(r) || r instanceof $) {
					for (var i = 0, ien = r.length; i < ien; i++) {
						addRow(r[i], k);
					}
					return;
				}

				// If we get a TR element, then just add it directly - up to the dev
				// to add the correct number of columns etc
				if (r.nodeName && r.nodeName.toLowerCase() === 'tr') {
					rows.push(r);
				}
				else {
					// Otherwise create a row with a wrapper
					var created = $('<tr><td></td></tr>').addClass(k);
					$('td', created)
						.addClass(k)
						.html(r)
					[0].colSpan = _fnVisbleColumns(ctx);

					rows.push(created[0]);
				}
			};

			addRow(data, klass);

			if (row._details) {
				row._details.detach();
			}

			row._details = $(rows);

			// If the children were already shown, that state should be retained
			if (row._detailsShow) {
				row._details.insertAfter(row.nTr);
			}
		};


		// Make state saving of child row details async to allow them to be batch processed
		var __details_state = DataTable.util.throttle(
			function (ctx) {
				_fnSaveState(ctx[0])
			},
			500
		);


		var __details_remove = function (api, idx) {
			var ctx = api.context;

			if (ctx.length) {
				var row = ctx[0].aoData[idx !== undefined ? idx : api[0]];

				if (row && row._details) {
					row._details.remove();

					row._detailsShow = undefined;
					row._details = undefined;
					$(row.nTr).removeClass('dt-hasChild');
					__details_state(ctx);
				}
			}
		};


		var __details_display = function (api, show) {
			var ctx = api.context;

			if (ctx.length && api.length) {
				var row = ctx[0].aoData[api[0]];

				if (row._details) {
					row._detailsShow = show;

					if (show) {
						row._details.insertAfter(row.nTr);
						$(row.nTr).addClass('dt-hasChild');
					}
					else {
						row._details.detach();
						$(row.nTr).removeClass('dt-hasChild');
					}

					_fnCallbackFire(ctx[0], null, 'childRow', [show, api.row(api[0])])

					__details_events(ctx[0]);
					__details_state(ctx);
				}
			}
		};


		var __details_events = function (settings) {
			var api = new _Api(settings);
			var namespace = '.dt.DT_details';
			var drawEvent = 'draw' + namespace;
			var colvisEvent = 'column-sizing' + namespace;
			var destroyEvent = 'destroy' + namespace;
			var data = settings.aoData;

			api.off(drawEvent + ' ' + colvisEvent + ' ' + destroyEvent);

			if (_pluck(data, '_details').length > 0) {
				// On each draw, insert the required elements into the document
				api.on(drawEvent, function (e, ctx) {
					if (settings !== ctx) {
						return;
					}

					api.rows({ page: 'current' }).eq(0).each(function (idx) {
						// Internal data grab
						var row = data[idx];

						if (row._detailsShow) {
							row._details.insertAfter(row.nTr);
						}
					});
				});

				// Column visibility change - update the colspan
				api.on(colvisEvent, function (e, ctx, idx, vis) {
					if (settings !== ctx) {
						return;
					}

					// Update the colspan for the details rows (note, only if it already has
					// a colspan)
					var row, visible = _fnVisbleColumns(ctx);

					for (var i = 0, ien = data.length; i < ien; i++) {
						row = data[i];

						if (row._details) {
							row._details.children('td[colspan]').attr('colspan', visible);
						}
					}
				});

				// Table destroyed - nuke any child rows
				api.on(destroyEvent, function (e, ctx) {
					if (settings !== ctx) {
						return;
					}

					for (var i = 0, ien = data.length; i < ien; i++) {
						if (data[i]._details) {
							__details_remove(api, i);
						}
					}
				});
			}
		};

		// Strings for the method names to help minification
		var _emp = '';
		var _child_obj = _emp + 'row().child';
		var _child_mth = _child_obj + '()';

		// data can be:
		//  tr
		//  string
		//  jQuery or array of any of the above
		_api_register(_child_mth, function (data, klass) {
			var ctx = this.context;

			if (data === undefined) {
				// get
				return ctx.length && this.length ?
					ctx[0].aoData[this[0]]._details :
					undefined;
			}
			else if (data === true) {
				// show
				this.child.show();
			}
			else if (data === false) {
				// remove
				__details_remove(this);
			}
			else if (ctx.length && this.length) {
				// set
				__details_add(ctx[0], ctx[0].aoData[this[0]], data, klass);
			}

			return this;
		});


		_api_register([
			_child_obj + '.show()',
			_child_mth + '.show()' // only when `child()` was called with parameters (without
		], function (show) {   // it returns an object and this method is not executed)
			__details_display(this, true);
			return this;
		});


		_api_register([
			_child_obj + '.hide()',
			_child_mth + '.hide()' // only when `child()` was called with parameters (without
		], function () {         // it returns an object and this method is not executed)
			__details_display(this, false);
			return this;
		});


		_api_register([
			_child_obj + '.remove()',
			_child_mth + '.remove()' // only when `child()` was called with parameters (without
		], function () {           // it returns an object and this method is not executed)
			__details_remove(this);
			return this;
		});


		_api_register(_child_obj + '.isShown()', function () {
			var ctx = this.context;

			if (ctx.length && this.length) {
				// _detailsShown as false or undefined will fall through to return false
				return ctx[0].aoData[this[0]]._detailsShow || false;
			}
			return false;
		});



		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
		 * Columns
		 *
		 * {integer}           - column index (>=0 count from left, <0 count from right)
		 * "{integer}:visIdx"  - visible column index (i.e. translate to column index)  (>=0 count from left, <0 count from right)
		 * "{integer}:visible" - alias for {integer}:visIdx  (>=0 count from left, <0 count from right)
		 * "{string}:name"     - column name
		 * "{string}"          - jQuery selector on column header nodes
		 *
		 */

		// can be an array of these items, comma separated list, or an array of comma
		// separated lists

		var __re_column_selector = /^([^:]+):(name|visIdx|visible)$/;


		// r1 and r2 are redundant - but it means that the parameters match for the
		// iterator callback in columns().data()
		var __columnData = function (settings, column, r1, r2, rows) {
			var a = [];
			for (var row = 0, ien = rows.length; row < ien; row++) {
				a.push(_fnGetCellData(settings, rows[row], column));
			}
			return a;
		};


		var __column_selector = function (settings, selector, opts) {
			var
				columns = settings.aoColumns,
				names = _pluck(columns, 'sName'),
				nodes = _pluck(columns, 'nTh');

			var run = function (s) {
				var selInt = _intVal(s);

				// Selector - all
				if (s === '') {
					return _range(columns.length);
				}

				// Selector - index
				if (selInt !== null) {
					return [selInt >= 0 ?
						selInt : // Count from left
						columns.length + selInt // Count from right (+ because its a negative value)
					];
				}

				// Selector = function
				if (typeof s === 'function') {
					var rows = _selector_row_indexes(settings, opts);

					return $.map(columns, function (col, idx) {
						return s(
							idx,
							__columnData(settings, idx, 0, 0, rows),
							nodes[idx]
						) ? idx : null;
					});
				}

				// jQuery or string selector
				var match = typeof s === 'string' ?
					s.match(__re_column_selector) :
					'';

				if (match) {
					switch (match[2]) {
						case 'visIdx':
						case 'visible':
							var idx = parseInt(match[1], 10);
							// Visible index given, convert to column index
							if (idx < 0) {
								// Counting from the right
								var visColumns = $.map(columns, function (col, i) {
									return col.bVisible ? i : null;
								});
								return [visColumns[visColumns.length + idx]];
							}
							// Counting from the left
							return [_fnVisibleToColumnIndex(settings, idx)];

						case 'name':
							// match by name. `names` is column index complete and in order
							return $.map(names, function (name, i) {
								return name === match[1] ? i : null;
							});

						default:
							return [];
					}
				}

				// Cell in the table body
				if (s.nodeName && s._DT_CellIndex) {
					return [s._DT_CellIndex.column];
				}

				// jQuery selector on the TH elements for the columns
				var jqResult = $(nodes)
					.filter(s)
					.map(function () {
						return $.inArray(this, nodes); // `nodes` is column index complete and in order
					})
					.toArray();

				if (jqResult.length || !s.nodeName) {
					return jqResult;
				}

				// Otherwise a node which might have a `dt-column` data attribute, or be
				// a child or such an element
				var host = $(s).closest('*[data-dt-column]');
				return host.length ?
					[host.data('dt-column')] :
					[];
			};

			return _selector_run('column', selector, run, settings, opts);
		};


		var __setColumnVis = function (settings, column, vis) {
			var
				cols = settings.aoColumns,
				col = cols[column],
				data = settings.aoData,
				row, cells, i, ien, tr;

			// Get
			if (vis === undefined) {
				return col.bVisible;
			}

			// Set
			// No change
			if (col.bVisible === vis) {
				return;
			}

			if (vis) {
				// Insert column
				// Need to decide if we should use appendChild or insertBefore
				var insertBefore = $.inArray(true, _pluck(cols, 'bVisible'), column + 1);

				for (i = 0, ien = data.length; i < ien; i++) {
					tr = data[i].nTr;
					cells = data[i].anCells;

					if (tr) {
						// insertBefore can act like appendChild if 2nd arg is null
						tr.insertBefore(cells[column], cells[insertBefore] || null);
					}
				}
			}
			else {
				// Remove column
				$(_pluck(settings.aoData, 'anCells', column)).detach();
			}

			// Common actions
			col.bVisible = vis;
		};


		_api_register('columns()', function (selector, opts) {
			// argument shifting
			if (selector === undefined) {
				selector = '';
			}
			else if ($.isPlainObject(selector)) {
				opts = selector;
				selector = '';
			}

			opts = _selector_opts(opts);

			var inst = this.iterator('table', function (settings) {
				return __column_selector(settings, selector, opts);
			}, 1);

			// Want argument shifting here and in _row_selector?
			inst.selector.cols = selector;
			inst.selector.opts = opts;

			return inst;
		});

		_api_registerPlural('columns().header()', 'column().header()', function (selector, opts) {
			return this.iterator('column', function (settings, column) {
				return settings.aoColumns[column].nTh;
			}, 1);
		});

		_api_registerPlural('columns().footer()', 'column().footer()', function (selector, opts) {
			return this.iterator('column', function (settings, column) {
				return settings.aoColumns[column].nTf;
			}, 1);
		});

		_api_registerPlural('columns().data()', 'column().data()', function () {
			return this.iterator('column-rows', __columnData, 1);
		});

		_api_registerPlural('columns().dataSrc()', 'column().dataSrc()', function () {
			return this.iterator('column', function (settings, column) {
				return settings.aoColumns[column].mData;
			}, 1);
		});

		_api_registerPlural('columns().cache()', 'column().cache()', function (type) {
			return this.iterator('column-rows', function (settings, column, i, j, rows) {
				return _pluck_order(settings.aoData, rows,
					type === 'search' ? '_aFilterData' : '_aSortData', column
				);
			}, 1);
		});

		_api_registerPlural('columns().nodes()', 'column().nodes()', function () {
			return this.iterator('column-rows', function (settings, column, i, j, rows) {
				return _pluck_order(settings.aoData, rows, 'anCells', column);
			}, 1);
		});

		_api_registerPlural('columns().visible()', 'column().visible()', function (vis, calc) {
			var that = this;
			var ret = this.iterator('column', function (settings, column) {
				if (vis === undefined) {
					return settings.aoColumns[column].bVisible;
				} // else
				__setColumnVis(settings, column, vis);
			});

			// Group the column visibility changes
			if (vis !== undefined) {
				this.iterator('table', function (settings) {
					// Redraw the header after changes
					_fnDrawHead(settings, settings.aoHeader);
					_fnDrawHead(settings, settings.aoFooter);

					// Update colspan for no records display. Child rows and extensions will use their own
					// listeners to do this - only need to update the empty table item here
					if (!settings.aiDisplay.length) {
						$(settings.nTBody).find('td[colspan]').attr('colspan', _fnVisbleColumns(settings));
					}

					_fnSaveState(settings);

					// Second loop once the first is done for events
					that.iterator('column', function (settings, column) {
						_fnCallbackFire(settings, null, 'column-visibility', [settings, column, vis, calc]);
					});

					if (calc === undefined || calc) {
						that.columns.adjust();
					}
				});
			}

			return ret;
		});

		_api_registerPlural('columns().indexes()', 'column().index()', function (type) {
			return this.iterator('column', function (settings, column) {
				return type === 'visible' ?
					_fnColumnIndexToVisible(settings, column) :
					column;
			}, 1);
		});

		_api_register('columns.adjust()', function () {
			return this.iterator('table', function (settings) {
				_fnAdjustColumnSizing(settings);
			}, 1);
		});

		_api_register('column.index()', function (type, idx) {
			if (this.context.length !== 0) {
				var ctx = this.context[0];

				if (type === 'fromVisible' || type === 'toData') {
					return _fnVisibleToColumnIndex(ctx, idx);
				}
				else if (type === 'fromData' || type === 'toVisible') {
					return _fnColumnIndexToVisible(ctx, idx);
				}
			}
		});

		_api_register('column()', function (selector, opts) {
			return _selector_first(this.columns(selector, opts));
		});

		var __cell_selector = function (settings, selector, opts) {
			var data = settings.aoData;
			var rows = _selector_row_indexes(settings, opts);
			var cells = _removeEmpty(_pluck_order(data, rows, 'anCells'));
			var allCells = $(_flatten([], cells));
			var row;
			var columns = settings.aoColumns.length;
			var a, i, ien, j, o, host;

			var run = function (s) {
				var fnSelector = typeof s === 'function';

				if (s === null || s === undefined || fnSelector) {
					// All cells and function selectors
					a = [];

					for (i = 0, ien = rows.length; i < ien; i++) {
						row = rows[i];

						for (j = 0; j < columns; j++) {
							o = {
								row: row,
								column: j
							};

							if (fnSelector) {
								// Selector - function
								host = data[row];

								if (s(o, _fnGetCellData(settings, row, j), host.anCells ? host.anCells[j] : null)) {
									a.push(o);
								}
							}
							else {
								// Selector - all
								a.push(o);
							}
						}
					}

					return a;
				}

				// Selector - index
				if ($.isPlainObject(s)) {
					// Valid cell index and its in the array of selectable rows
					return s.column !== undefined && s.row !== undefined && $.inArray(s.row, rows) !== -1 ?
						[s] :
						[];
				}

				// Selector - jQuery filtered cells
				var jqResult = allCells
					.filter(s)
					.map(function (i, el) {
						return { // use a new object, in case someone changes the values
							row: el._DT_CellIndex.row,
							column: el._DT_CellIndex.column
						};
					})
					.toArray();

				if (jqResult.length || !s.nodeName) {
					return jqResult;
				}

				// Otherwise the selector is a node, and there is one last option - the
				// element might be a child of an element which has dt-row and dt-column
				// data attributes
				host = $(s).closest('*[data-dt-row]');
				return host.length ?
					[{
						row: host.data('dt-row'),
						column: host.data('dt-column')
					}] :
					[];
			};

			return _selector_run('cell', selector, run, settings, opts);
		};




		_api_register('cells()', function (rowSelector, columnSelector, opts) {
			// Argument shifting
			if ($.isPlainObject(rowSelector)) {
				// Indexes
				if (rowSelector.row === undefined) {
					// Selector options in first parameter
					opts = rowSelector;
					rowSelector = null;
				}
				else {
					// Cell index objects in first parameter
					opts = columnSelector;
					columnSelector = null;
				}
			}
			if ($.isPlainObject(columnSelector)) {
				opts = columnSelector;
				columnSelector = null;
			}

			// Cell selector
			if (columnSelector === null || columnSelector === undefined) {
				return this.iterator('table', function (settings) {
					return __cell_selector(settings, rowSelector, _selector_opts(opts));
				});
			}

			// The default built in options need to apply to row and columns
			var internalOpts = opts ? {
				page: opts.page,
				order: opts.order,
				search: opts.search
			} : {};

			// Row + column selector
			var columns = this.columns(columnSelector, internalOpts);
			var rows = this.rows(rowSelector, internalOpts);
			var i, ien, j, jen;

			var cellsNoOpts = this.iterator('table', function (settings, idx) {
				var a = [];

				for (i = 0, ien = rows[idx].length; i < ien; i++) {
					for (j = 0, jen = columns[idx].length; j < jen; j++) {
						a.push({
							row: rows[idx][i],
							column: columns[idx][j]
						});
					}
				}

				return a;
			}, 1);

			// There is currently only one extension which uses a cell selector extension
			// It is a _major_ performance drag to run this if it isn't needed, so this is
			// an extension specific check at the moment
			var cells = opts && opts.selected ?
				this.cells(cellsNoOpts, opts) :
				cellsNoOpts;

			$.extend(cells.selector, {
				cols: columnSelector,
				rows: rowSelector,
				opts: opts
			});

			return cells;
		});


		_api_registerPlural('cells().nodes()', 'cell().node()', function () {
			return this.iterator('cell', function (settings, row, column) {
				var data = settings.aoData[row];

				return data && data.anCells ?
					data.anCells[column] :
					undefined;
			}, 1);
		});


		_api_register('cells().data()', function () {
			return this.iterator('cell', function (settings, row, column) {
				return _fnGetCellData(settings, row, column);
			}, 1);
		});


		_api_registerPlural('cells().cache()', 'cell().cache()', function (type) {
			type = type === 'search' ? '_aFilterData' : '_aSortData';

			return this.iterator('cell', function (settings, row, column) {
				return settings.aoData[row][type][column];
			}, 1);
		});


		_api_registerPlural('cells().render()', 'cell().render()', function (type) {
			return this.iterator('cell', function (settings, row, column) {
				return _fnGetCellData(settings, row, column, type);
			}, 1);
		});


		_api_registerPlural('cells().indexes()', 'cell().index()', function () {
			return this.iterator('cell', function (settings, row, column) {
				return {
					row: row,
					column: column,
					columnVisible: _fnColumnIndexToVisible(settings, column)
				};
			}, 1);
		});


		_api_registerPlural('cells().invalidate()', 'cell().invalidate()', function (src) {
			return this.iterator('cell', function (settings, row, column) {
				_fnInvalidate(settings, row, src, column);
			});
		});



		_api_register('cell()', function (rowSelector, columnSelector, opts) {
			return _selector_first(this.cells(rowSelector, columnSelector, opts));
		});


		_api_register('cell().data()', function (data) {
			var ctx = this.context;
			var cell = this[0];

			if (data === undefined) {
				// Get
				return ctx.length && cell.length ?
					_fnGetCellData(ctx[0], cell[0].row, cell[0].column) :
					undefined;
			}

			// Set
			_fnSetCellData(ctx[0], cell[0].row, cell[0].column, data);
			_fnInvalidate(ctx[0], cell[0].row, 'data', cell[0].column);

			return this;
		});



		/**
		 * Get current ordering (sorting) that has been applied to the table.
		 *
		 * @returns {array} 2D array containing the sorting information for the first
		 *   table in the current context. Each element in the parent array represents
		 *   a column being sorted upon (i.e. multi-sorting with two columns would have
		 *   2 inner arrays). The inner arrays may have 2 or 3 elements. The first is
		 *   the column index that the sorting condition applies to, the second is the
		 *   direction of the sort (`desc` or `asc`) and, optionally, the third is the
		 *   index of the sorting order from the `column.sorting` initialisation array.
		 *//**
		* Set the ordering for the table.
		*
		* @param {integer} order Column index to sort upon.
		* @param {string} direction Direction of the sort to be applied (`asc` or `desc`)
		* @returns {DataTables.Api} this
		*//**
		* Set the ordering for the table.
		*
		* @param {array} order 1D array of sorting information to be applied.
		* @param {array} [...] Optional additional sorting conditions
		* @returns {DataTables.Api} this
		*//**
		* Set the ordering for the table.
		*
		* @param {array} order 2D array of sorting information to be applied.
		* @returns {DataTables.Api} this
		*/
		_api_register('order()', function (order, dir) {
			var ctx = this.context;

			if (order === undefined) {
				// get
				return ctx.length !== 0 ?
					ctx[0].aaSorting :
					undefined;
			}

			// set
			if (typeof order === 'number') {
				// Simple column / direction passed in
				order = [[order, dir]];
			}
			else if (order.length && !Array.isArray(order[0])) {
				// Arguments passed in (list of 1D arrays)
				order = Array.prototype.slice.call(arguments);
			}
			// otherwise a 2D array was passed in

			return this.iterator('table', function (settings) {
				settings.aaSorting = order.slice();
			});
		});


		/**
		 * Attach a sort listener to an element for a given column
		 *
		 * @param {node|jQuery|string} node Identifier for the element(s) to attach the
		 *   listener to. This can take the form of a single DOM node, a jQuery
		 *   collection of nodes or a jQuery selector which will identify the node(s).
		 * @param {integer} column the column that a click on this node will sort on
		 * @param {function} [callback] callback function when sort is run
		 * @returns {DataTables.Api} this
		 */
		_api_register('order.listener()', function (node, column, callback) {
			return this.iterator('table', function (settings) {
				_fnSortAttachListener(settings, node, column, callback);
			});
		});


		_api_register('order.fixed()', function (set) {
			if (!set) {
				var ctx = this.context;
				var fixed = ctx.length ?
					ctx[0].aaSortingFixed :
					undefined;

				return Array.isArray(fixed) ?
					{ pre: fixed } :
					fixed;
			}

			return this.iterator('table', function (settings) {
				settings.aaSortingFixed = $.extend(true, {}, set);
			});
		});


		// Order by the selected column(s)
		_api_register([
			'columns().order()',
			'column().order()'
		], function (dir) {
			var that = this;

			return this.iterator('table', function (settings, i) {
				var sort = [];

				$.each(that[i], function (j, col) {
					sort.push([col, dir]);
				});

				settings.aaSorting = sort;
			});
		});



		_api_register('search()', function (input, regex, smart, caseInsen) {
			var ctx = this.context;

			if (input === undefined) {
				// get
				return ctx.length !== 0 ?
					ctx[0].oPreviousSearch.sSearch :
					undefined;
			}

			// set
			return this.iterator('table', function (settings) {
				if (!settings.oFeatures.bFilter) {
					return;
				}

				_fnFilterComplete(settings, $.extend({}, settings.oPreviousSearch, {
					"sSearch": input + "",
					"bRegex": regex === null ? false : regex,
					"bSmart": smart === null ? true : smart,
					"bCaseInsensitive": caseInsen === null ? true : caseInsen
				}), 1);
			});
		});


		_api_registerPlural(
			'columns().search()',
			'column().search()',
			function (input, regex, smart, caseInsen) {
				return this.iterator('column', function (settings, column) {
					var preSearch = settings.aoPreSearchCols;

					if (input === undefined) {
						// get
						return preSearch[column].sSearch;
					}

					// set
					if (!settings.oFeatures.bFilter) {
						return;
					}

					$.extend(preSearch[column], {
						"sSearch": input + "",
						"bRegex": regex === null ? false : regex,
						"bSmart": smart === null ? true : smart,
						"bCaseInsensitive": caseInsen === null ? true : caseInsen
					});

					_fnFilterComplete(settings, settings.oPreviousSearch, 1);
				});
			}
		);

		/*
		 * State API methods
		 */

		_api_register('state()', function () {
			return this.context.length ?
				this.context[0].oSavedState :
				null;
		});


		_api_register('state.clear()', function () {
			return this.iterator('table', function (settings) {
				// Save an empty object
				settings.fnStateSaveCallback.call(settings.oInstance, settings, {});
			});
		});


		_api_register('state.loaded()', function () {
			return this.context.length ?
				this.context[0].oLoadedState :
				null;
		});


		_api_register('state.save()', function () {
			return this.iterator('table', function (settings) {
				_fnSaveState(settings);
			});
		});



		/**
		 * Provide a common method for plug-ins to check the version of DataTables being
		 * used, in order to ensure compatibility.
		 *
		 *  @param {string} version Version string to check for, in the format "X.Y.Z".
		 *    Note that the formats "X" and "X.Y" are also acceptable.
		 *  @returns {boolean} true if this version of DataTables is greater or equal to
		 *    the required version, or false if this version of DataTales is not
		 *    suitable
		 *  @static
		 *  @dtopt API-Static
		 *
		 *  @example
		 *    alert( $.fn.dataTable.versionCheck( '1.9.0' ) );
		 */
		DataTable.versionCheck = DataTable.fnVersionCheck = function (version) {
			var aThis = DataTable.version.split('.');
			var aThat = version.split('.');
			var iThis, iThat;

			for (var i = 0, iLen = aThat.length; i < iLen; i++) {
				iThis = parseInt(aThis[i], 10) || 0;
				iThat = parseInt(aThat[i], 10) || 0;

				// Parts are the same, keep comparing
				if (iThis === iThat) {
					continue;
				}

				// Parts are different, return immediately
				return iThis > iThat;
			}

			return true;
		};


		/**
		 * Check if a `<table>` node is a DataTable table already or not.
		 *
		 *  @param {node|jquery|string} table Table node, jQuery object or jQuery
		 *      selector for the table to test. Note that if more than more than one
		 *      table is passed on, only the first will be checked
		 *  @returns {boolean} true the table given is a DataTable, or false otherwise
		 *  @static
		 *  @dtopt API-Static
		 *
		 *  @example
		 *    if ( ! $.fn.DataTable.isDataTable( '#example' ) ) {
		 *      $('#example').dataTable();
		 *    }
		 */
		DataTable.isDataTable = DataTable.fnIsDataTable = function (table) {
			var t = $(table).get(0);
			var is = false;

			if (table instanceof DataTable.Api) {
				return true;
			}

			$.each(DataTable.settings, function (i, o) {
				var head = o.nScrollHead ? $('table', o.nScrollHead)[0] : null;
				var foot = o.nScrollFoot ? $('table', o.nScrollFoot)[0] : null;

				if (o.nTable === t || head === t || foot === t) {
					is = true;
				}
			});

			return is;
		};


		/**
		 * Get all DataTable tables that have been initialised - optionally you can
		 * select to get only currently visible tables.
		 *
		 *  @param {boolean} [visible=false] Flag to indicate if you want all (default)
		 *    or visible tables only.
		 *  @returns {array} Array of `table` nodes (not DataTable instances) which are
		 *    DataTables
		 *  @static
		 *  @dtopt API-Static
		 *
		 *  @example
		 *    $.each( $.fn.dataTable.tables(true), function () {
		 *      $(table).DataTable().columns.adjust();
		 *    } );
		 */
		DataTable.tables = DataTable.fnTables = function (visible) {
			var api = false;

			if ($.isPlainObject(visible)) {
				api = visible.api;
				visible = visible.visible;
			}

			var a = $.map(DataTable.settings, function (o) {
				if (!visible || (visible && $(o.nTable).is(':visible'))) {
					return o.nTable;
				}
			});

			return api ?
				new _Api(a) :
				a;
		};


		/**
		 * Convert from camel case parameters to Hungarian notation. This is made public
		 * for the extensions to provide the same ability as DataTables core to accept
		 * either the 1.9 style Hungarian notation, or the 1.10+ style camelCase
		 * parameters.
		 *
		 *  @param {object} src The model object which holds all parameters that can be
		 *    mapped.
		 *  @param {object} user The object to convert from camel case to Hungarian.
		 *  @param {boolean} force When set to `true`, properties which already have a
		 *    Hungarian value in the `user` object will be overwritten. Otherwise they
		 *    won't be.
		 */
		DataTable.camelToHungarian = _fnCamelToHungarian;



		/**
		 *
		 */
		_api_register('$()', function (selector, opts) {
			var
				rows = this.rows(opts).nodes(), // Get all rows
				jqRows = $(rows);

			return $([].concat(
				jqRows.filter(selector).toArray(),
				jqRows.find(selector).toArray()
			));
		});


		// jQuery functions to operate on the tables
		$.each(['on', 'one', 'off'], function (i, key) {
			_api_register(key + '()', function ( /* event, handler */) {
				var args = Array.prototype.slice.call(arguments);

				// Add the `dt` namespace automatically if it isn't already present
				args[0] = $.map(args[0].split(/\s/), function (e) {
					return !e.match(/\.dt\b/) ?
						e + '.dt' :
						e;
				}).join(' ');

				var inst = $(this.tables().nodes());
				inst[key].apply(inst, args);
				return this;
			});
		});


		_api_register('clear()', function () {
			return this.iterator('table', function (settings) {
				_fnClearTable(settings);
			});
		});


		_api_register('settings()', function () {
			return new _Api(this.context, this.context);
		});


		_api_register('init()', function () {
			var ctx = this.context;
			return ctx.length ? ctx[0].oInit : null;
		});


		_api_register('data()', function () {
			return this.iterator('table', function (settings) {
				return _pluck(settings.aoData, '_aData');
			}).flatten();
		});


		_api_register('destroy()', function (remove) {
			remove = remove || false;

			return this.iterator('table', function (settings) {
				var classes = settings.oClasses;
				var table = settings.nTable;
				var tbody = settings.nTBody;
				var thead = settings.nTHead;
				var tfoot = settings.nTFoot;
				var jqTable = $(table);
				var jqTbody = $(tbody);
				var jqWrapper = $(settings.nTableWrapper);
				var rows = $.map(settings.aoData, function (r) { return r.nTr; });
				var i, ien;

				// Flag to note that the table is currently being destroyed - no action
				// should be taken
				settings.bDestroying = true;

				// Fire off the destroy callbacks for plug-ins etc
				_fnCallbackFire(settings, "aoDestroyCallback", "destroy", [settings]);

				// If not being removed from the document, make all columns visible
				if (!remove) {
					new _Api(settings).columns().visible(true);
				}

				// Blitz all `DT` namespaced events (these are internal events, the
				// lowercase, `dt` events are user subscribed and they are responsible
				// for removing them
				jqWrapper.off('.DT').find(':not(tbody *)').off('.DT');
				$(window).off('.DT-' + settings.sInstance);

				// When scrolling we had to break the table up - restore it
				if (table != thead.parentNode) {
					jqTable.children('thead').detach();
					jqTable.append(thead);
				}

				if (tfoot && table != tfoot.parentNode) {
					jqTable.children('tfoot').detach();
					jqTable.append(tfoot);
				}

				settings.aaSorting = [];
				settings.aaSortingFixed = [];
				_fnSortingClasses(settings);

				$(rows).removeClass(settings.asStripeClasses.join(' '));

				$('th, td', thead).removeClass(classes.sSortable + ' ' +
					classes.sSortableAsc + ' ' + classes.sSortableDesc + ' ' + classes.sSortableNone
				);

				// Add the TR elements back into the table in their original order
				jqTbody.children().detach();
				jqTbody.append(rows);

				var orig = settings.nTableWrapper.parentNode;

				// Remove the DataTables generated nodes, events and classes
				var removedMethod = remove ? 'remove' : 'detach';
				jqTable[removedMethod]();
				jqWrapper[removedMethod]();

				// If we need to reattach the table to the document
				if (!remove && orig) {
					// insertBefore acts like appendChild if !arg[1]
					orig.insertBefore(table, settings.nTableReinsertBefore);

					// Restore the width of the original table - was read from the style property,
					// so we can restore directly to that
					jqTable
						.css('width', settings.sDestroyWidth)
						.removeClass(classes.sTable);

					// If the were originally stripe classes - then we add them back here.
					// Note this is not fool proof (for example if not all rows had stripe
					// classes - but it's a good effort without getting carried away
					ien = settings.asDestroyStripes.length;

					if (ien) {
						jqTbody.children().each(function (i) {
							$(this).addClass(settings.asDestroyStripes[i % ien]);
						});
					}
				}

				/* Remove the settings object from the settings array */
				var idx = $.inArray(settings, DataTable.settings);
				if (idx !== -1) {
					DataTable.settings.splice(idx, 1);
				}
			});
		});


		// Add the `every()` method for rows, columns and cells in a compact form
		$.each(['column', 'row', 'cell'], function (i, type) {
			_api_register(type + 's().every()', function (fn) {
				var opts = this.selector.opts;
				var api = this;

				return this.iterator(type, function (settings, arg1, arg2, arg3, arg4) {
					// Rows and columns:
					//  arg1 - index
					//  arg2 - table counter
					//  arg3 - loop counter
					//  arg4 - undefined
					// Cells:
					//  arg1 - row index
					//  arg2 - column index
					//  arg3 - table counter
					//  arg4 - loop counter
					fn.call(
						api[type](
							arg1,
							type === 'cell' ? arg2 : opts,
							type === 'cell' ? opts : undefined
						),
						arg1, arg2, arg3, arg4
					);
				});
			});
		});


		// i18n method for extensions to be able to use the language object from the
		// DataTable
		_api_register('i18n()', function (token, def, plural) {
			var ctx = this.context[0];
			var resolved = _fnGetObjectDataFn(token)(ctx.oLanguage);

			if (resolved === undefined) {
				resolved = def;
			}

			if (plural !== undefined && $.isPlainObject(resolved)) {
				resolved = resolved[plural] !== undefined ?
					resolved[plural] :
					resolved._;
			}

			return resolved.replace('%d', plural); // nb: plural might be undefined,
		});
		/**
		 * Version string for plug-ins to check compatibility. Allowed format is
		 * `a.b.c-d` where: a:int, b:int, c:int, d:string(dev|beta|alpha). `d` is used
		 * only for non-release builds. See http://semver.org/ for more information.
		 *  @member
		 *  @type string
		 *  @default Version number
		 */
		DataTable.version = "1.13.1";

		/**
		 * Private data store, containing all of the settings objects that are
		 * created for the tables on a given page.
		 *
		 * Note that the `DataTable.settings` object is aliased to
		 * `jQuery.fn.dataTableExt` through which it may be accessed and
		 * manipulated, or `jQuery.fn.dataTable.settings`.
		 *  @member
		 *  @type array
		 *  @default []
		 *  @private
		 */
		DataTable.settings = [];

		/**
		 * Object models container, for the various models that DataTables has
		 * available to it. These models define the objects that are used to hold
		 * the active state and configuration of the table.
		 *  @namespace
		 */
		DataTable.models = {};



		/**
		 * Template object for the way in which DataTables holds information about
		 * search information for the global filter and individual column filters.
		 *  @namespace
		 */
		DataTable.models.oSearch = {
			/**
			 * Flag to indicate if the filtering should be case insensitive or not
			 *  @type boolean
			 *  @default true
			 */
			"bCaseInsensitive": true,

			/**
			 * Applied search term
			 *  @type string
			 *  @default <i>Empty string</i>
			 */
			"sSearch": "",

			/**
			 * Flag to indicate if the search term should be interpreted as a
			 * regular expression (true) or not (false) and therefore and special
			 * regex characters escaped.
			 *  @type boolean
			 *  @default false
			 */
			"bRegex": false,

			/**
			 * Flag to indicate if DataTables is to use its smart filtering or not.
			 *  @type boolean
			 *  @default true
			 */
			"bSmart": true,

			/**
			 * Flag to indicate if DataTables should only trigger a search when
			 * the return key is pressed.
			 *  @type boolean
			 *  @default false
			 */
			"return": false
		};




		/**
		 * Template object for the way in which DataTables holds information about
		 * each individual row. This is the object format used for the settings
		 * aoData array.
		 *  @namespace
		 */
		DataTable.models.oRow = {
			/**
			 * TR element for the row
			 *  @type node
			 *  @default null
			 */
			"nTr": null,

			/**
			 * Array of TD elements for each row. This is null until the row has been
			 * created.
			 *  @type array nodes
			 *  @default []
			 */
			"anCells": null,

			/**
			 * Data object from the original data source for the row. This is either
			 * an array if using the traditional form of DataTables, or an object if
			 * using mData options. The exact type will depend on the passed in
			 * data from the data source, or will be an array if using DOM a data
			 * source.
			 *  @type array|object
			 *  @default []
			 */
			"_aData": [],

			/**
			 * Sorting data cache - this array is ostensibly the same length as the
			 * number of columns (although each index is generated only as it is
			 * needed), and holds the data that is used for sorting each column in the
			 * row. We do this cache generation at the start of the sort in order that
			 * the formatting of the sort data need be done only once for each cell
			 * per sort. This array should not be read from or written to by anything
			 * other than the master sorting methods.
			 *  @type array
			 *  @default null
			 *  @private
			 */
			"_aSortData": null,

			/**
			 * Per cell filtering data cache. As per the sort data cache, used to
			 * increase the performance of the filtering in DataTables
			 *  @type array
			 *  @default null
			 *  @private
			 */
			"_aFilterData": null,

			/**
			 * Filtering data cache. This is the same as the cell filtering cache, but
			 * in this case a string rather than an array. This is easily computed with
			 * a join on `_aFilterData`, but is provided as a cache so the join isn't
			 * needed on every search (memory traded for performance)
			 *  @type array
			 *  @default null
			 *  @private
			 */
			"_sFilterRow": null,

			/**
			 * Cache of the class name that DataTables has applied to the row, so we
			 * can quickly look at this variable rather than needing to do a DOM check
			 * on className for the nTr property.
			 *  @type string
			 *  @default <i>Empty string</i>
			 *  @private
			 */
			"_sRowStripe": "",

			/**
			 * Denote if the original data source was from the DOM, or the data source
			 * object. This is used for invalidating data, so DataTables can
			 * automatically read data from the original source, unless uninstructed
			 * otherwise.
			 *  @type string
			 *  @default null
			 *  @private
			 */
			"src": null,

			/**
			 * Index in the aoData array. This saves an indexOf lookup when we have the
			 * object, but want to know the index
			 *  @type integer
			 *  @default -1
			 *  @private
			 */
			"idx": -1
		};


		/**
		 * Template object for the column information object in DataTables. This object
		 * is held in the settings aoColumns array and contains all the information that
		 * DataTables needs about each individual column.
		 *
		 * Note that this object is related to {@link DataTable.defaults.column}
		 * but this one is the internal data store for DataTables's cache of columns.
		 * It should NOT be manipulated outside of DataTables. Any configuration should
		 * be done through the initialisation options.
		 *  @namespace
		 */
		DataTable.models.oColumn = {
			/**
			 * Column index. This could be worked out on-the-fly with $.inArray, but it
			 * is faster to just hold it as a variable
			 *  @type integer
			 *  @default null
			 */
			"idx": null,

			/**
			 * A list of the columns that sorting should occur on when this column
			 * is sorted. That this property is an array allows multi-column sorting
			 * to be defined for a column (for example first name / last name columns
			 * would benefit from this). The values are integers pointing to the
			 * columns to be sorted on (typically it will be a single integer pointing
			 * at itself, but that doesn't need to be the case).
			 *  @type array
			 */
			"aDataSort": null,

			/**
			 * Define the sorting directions that are applied to the column, in sequence
			 * as the column is repeatedly sorted upon - i.e. the first value is used
			 * as the sorting direction when the column if first sorted (clicked on).
			 * Sort it again (click again) and it will move on to the next index.
			 * Repeat until loop.
			 *  @type array
			 */
			"asSorting": null,

			/**
			 * Flag to indicate if the column is searchable, and thus should be included
			 * in the filtering or not.
			 *  @type boolean
			 */
			"bSearchable": null,

			/**
			 * Flag to indicate if the column is sortable or not.
			 *  @type boolean
			 */
			"bSortable": null,

			/**
			 * Flag to indicate if the column is currently visible in the table or not
			 *  @type boolean
			 */
			"bVisible": null,

			/**
			 * Store for manual type assignment using the `column.type` option. This
			 * is held in store so we can manipulate the column's `sType` property.
			 *  @type string
			 *  @default null
			 *  @private
			 */
			"_sManualType": null,

			/**
			 * Flag to indicate if HTML5 data attributes should be used as the data
			 * source for filtering or sorting. True is either are.
			 *  @type boolean
			 *  @default false
			 *  @private
			 */
			"_bAttrSrc": false,

			/**
			 * Developer definable function that is called whenever a cell is created (Ajax source,
			 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
			 * allowing you to modify the DOM element (add background colour for example) when the
			 * element is available.
			 *  @type function
			 *  @param {element} nTd The TD node that has been created
			 *  @param {*} sData The Data for the cell
			 *  @param {array|object} oData The data for the whole row
			 *  @param {int} iRow The row index for the aoData data store
			 *  @default null
			 */
			"fnCreatedCell": null,

			/**
			 * Function to get data from a cell in a column. You should <b>never</b>
			 * access data directly through _aData internally in DataTables - always use
			 * the method attached to this property. It allows mData to function as
			 * required. This function is automatically assigned by the column
			 * initialisation method
			 *  @type function
			 *  @param {array|object} oData The data array/object for the array
			 *    (i.e. aoData[]._aData)
			 *  @param {string} sSpecific The specific data type you want to get -
			 *    'display', 'type' 'filter' 'sort'
			 *  @returns {*} The data for the cell from the given row's data
			 *  @default null
			 */
			"fnGetData": null,

			/**
			 * Function to set data for a cell in the column. You should <b>never</b>
			 * set the data directly to _aData internally in DataTables - always use
			 * this method. It allows mData to function as required. This function
			 * is automatically assigned by the column initialisation method
			 *  @type function
			 *  @param {array|object} oData The data array/object for the array
			 *    (i.e. aoData[]._aData)
			 *  @param {*} sValue Value to set
			 *  @default null
			 */
			"fnSetData": null,

			/**
			 * Property to read the value for the cells in the column from the data
			 * source array / object. If null, then the default content is used, if a
			 * function is given then the return from the function is used.
			 *  @type function|int|string|null
			 *  @default null
			 */
			"mData": null,

			/**
			 * Partner property to mData which is used (only when defined) to get
			 * the data - i.e. it is basically the same as mData, but without the
			 * 'set' option, and also the data fed to it is the result from mData.
			 * This is the rendering method to match the data method of mData.
			 *  @type function|int|string|null
			 *  @default null
			 */
			"mRender": null,

			/**
			 * Unique header TH/TD element for this column - this is what the sorting
			 * listener is attached to (if sorting is enabled.)
			 *  @type node
			 *  @default null
			 */
			"nTh": null,

			/**
			 * Unique footer TH/TD element for this column (if there is one). Not used
			 * in DataTables as such, but can be used for plug-ins to reference the
			 * footer for each column.
			 *  @type node
			 *  @default null
			 */
			"nTf": null,

			/**
			 * The class to apply to all TD elements in the table's TBODY for the column
			 *  @type string
			 *  @default null
			 */
			"sClass": null,

			/**
			 * When DataTables calculates the column widths to assign to each column,
			 * it finds the longest string in each column and then constructs a
			 * temporary table and reads the widths from that. The problem with this
			 * is that "mmm" is much wider then "iiii", but the latter is a longer
			 * string - thus the calculation can go wrong (doing it properly and putting
			 * it into an DOM object and measuring that is horribly(!) slow). Thus as
			 * a "work around" we provide this option. It will append its value to the
			 * text that is found to be the longest string for the column - i.e. padding.
			 *  @type string
			 */
			"sContentPadding": null,

			/**
			 * Allows a default value to be given for a column's data, and will be used
			 * whenever a null data source is encountered (this can be because mData
			 * is set to null, or because the data source itself is null).
			 *  @type string
			 *  @default null
			 */
			"sDefaultContent": null,

			/**
			 * Name for the column, allowing reference to the column by name as well as
			 * by index (needs a lookup to work by name).
			 *  @type string
			 */
			"sName": null,

			/**
			 * Custom sorting data type - defines which of the available plug-ins in
			 * afnSortData the custom sorting will use - if any is defined.
			 *  @type string
			 *  @default std
			 */
			"sSortDataType": 'std',

			/**
			 * Class to be applied to the header element when sorting on this column
			 *  @type string
			 *  @default null
			 */
			"sSortingClass": null,

			/**
			 * Class to be applied to the header element when sorting on this column -
			 * when jQuery UI theming is used.
			 *  @type string
			 *  @default null
			 */
			"sSortingClassJUI": null,

			/**
			 * Title of the column - what is seen in the TH element (nTh).
			 *  @type string
			 */
			"sTitle": null,

			/**
			 * Column sorting and filtering type
			 *  @type string
			 *  @default null
			 */
			"sType": null,

			/**
			 * Width of the column
			 *  @type string
			 *  @default null
			 */
			"sWidth": null,

			/**
			 * Width of the column when it was first "encountered"
			 *  @type string
			 *  @default null
			 */
			"sWidthOrig": null
		};


		/*
		 * Developer note: The properties of the object below are given in Hungarian
		 * notation, that was used as the interface for DataTables prior to v1.10, however
		 * from v1.10 onwards the primary interface is camel case. In order to avoid
		 * breaking backwards compatibility utterly with this change, the Hungarian
		 * version is still, internally the primary interface, but is is not documented
		 * - hence the @name tags in each doc comment. This allows a Javascript function
		 * to create a map from Hungarian notation to camel case (going the other direction
		 * would require each property to be listed, which would add around 3K to the size
		 * of DataTables, while this method is about a 0.5K hit).
		 *
		 * Ultimately this does pave the way for Hungarian notation to be dropped
		 * completely, but that is a massive amount of work and will break current
		 * installs (therefore is on-hold until v2).
		 */

		/**
		 * Initialisation options that can be given to DataTables at initialisation
		 * time.
		 *  @namespace
		 */
		DataTable.defaults = {
			/**
			 * An array of data to use for the table, passed in at initialisation which
			 * will be used in preference to any data which is already in the DOM. This is
			 * particularly useful for constructing tables purely in Javascript, for
			 * example with a custom Ajax call.
			 *  @type array
			 *  @default null
			 *
			 *  @dtopt Option
			 *  @name DataTable.defaults.data
			 *
			 *  @example
			 *    // Using a 2D array data source
			 *    $(document).ready( function () {
			 *      $('#example').dataTable( {
			 *        "data": [
			 *          ['Trident', 'Internet Explorer 4.0', 'Win 95+', 4, 'X'],
			 *          ['Trident', 'Internet Explorer 5.0', 'Win 95+', 5, 'C'],
			 *        ],
			 *        "columns": [
			 *          { "title": "Engine" },
			 *          { "title": "Browser" },
			 *          { "title": "Platform" },
			 *          { "title": "Version" },
			 *          { "title": "Grade" }
			 *        ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Using an array of objects as a data source (`data`)
			 *    $(document).ready( function () {
			 *      $('#example').dataTable( {
			 *        "data": [
			 *          {
			 *            "engine":   "Trident",
			 *            "browser":  "Internet Explorer 4.0",
			 *            "platform": "Win 95+",
			 *            "version":  4,
			 *            "grade":    "X"
			 *          },
			 *          {
			 *            "engine":   "Trident",
			 *            "browser":  "Internet Explorer 5.0",
			 *            "platform": "Win 95+",
			 *            "version":  5,
			 *            "grade":    "C"
			 *          }
			 *        ],
			 *        "columns": [
			 *          { "title": "Engine",   "data": "engine" },
			 *          { "title": "Browser",  "data": "browser" },
			 *          { "title": "Platform", "data": "platform" },
			 *          { "title": "Version",  "data": "version" },
			 *          { "title": "Grade",    "data": "grade" }
			 *        ]
			 *      } );
			 *    } );
			 */
			"aaData": null,


			/**
			 * If ordering is enabled, then DataTables will perform a first pass sort on
			 * initialisation. You can define which column(s) the sort is performed
			 * upon, and the sorting direction, with this variable. The `sorting` array
			 * should contain an array for each column to be sorted initially containing
			 * the column's index and a direction string ('asc' or 'desc').
			 *  @type array
			 *  @default [[0,'asc']]
			 *
			 *  @dtopt Option
			 *  @name DataTable.defaults.order
			 *
			 *  @example
			 *    // Sort by 3rd column first, and then 4th column
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "order": [[2,'asc'], [3,'desc']]
			 *      } );
			 *    } );
			 *
			 *    // No initial sorting
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "order": []
			 *      } );
			 *    } );
			 */
			"aaSorting": [[0, 'asc']],


			/**
			 * This parameter is basically identical to the `sorting` parameter, but
			 * cannot be overridden by user interaction with the table. What this means
			 * is that you could have a column (visible or hidden) which the sorting
			 * will always be forced on first - any sorting after that (from the user)
			 * will then be performed as required. This can be useful for grouping rows
			 * together.
			 *  @type array
			 *  @default null
			 *
			 *  @dtopt Option
			 *  @name DataTable.defaults.orderFixed
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "orderFixed": [[0,'asc']]
			 *      } );
			 *    } )
			 */
			"aaSortingFixed": [],


			/**
			 * DataTables can be instructed to load data to display in the table from a
			 * Ajax source. This option defines how that Ajax call is made and where to.
			 *
			 * The `ajax` property has three different modes of operation, depending on
			 * how it is defined. These are:
			 *
			 * * `string` - Set the URL from where the data should be loaded from.
			 * * `object` - Define properties for `jQuery.ajax`.
			 * * `function` - Custom data get function
			 *
			 * `string`
			 * --------
			 *
			 * As a string, the `ajax` property simply defines the URL from which
			 * DataTables will load data.
			 *
			 * `object`
			 * --------
			 *
			 * As an object, the parameters in the object are passed to
			 * [jQuery.ajax](http://api.jquery.com/jQuery.ajax/) allowing fine control
			 * of the Ajax request. DataTables has a number of default parameters which
			 * you can override using this option. Please refer to the jQuery
			 * documentation for a full description of the options available, although
			 * the following parameters provide additional options in DataTables or
			 * require special consideration:
			 *
			 * * `data` - As with jQuery, `data` can be provided as an object, but it
			 *   can also be used as a function to manipulate the data DataTables sends
			 *   to the server. The function takes a single parameter, an object of
			 *   parameters with the values that DataTables has readied for sending. An
			 *   object may be returned which will be merged into the DataTables
			 *   defaults, or you can add the items to the object that was passed in and
			 *   not return anything from the function. This supersedes `fnServerParams`
			 *   from DataTables 1.9-.
			 *
			 * * `dataSrc` - By default DataTables will look for the property `data` (or
			 *   `aaData` for compatibility with DataTables 1.9-) when obtaining data
			 *   from an Ajax source or for server-side processing - this parameter
			 *   allows that property to be changed. You can use Javascript dotted
			 *   object notation to get a data source for multiple levels of nesting, or
			 *   it my be used as a function. As a function it takes a single parameter,
			 *   the JSON returned from the server, which can be manipulated as
			 *   required, with the returned value being that used by DataTables as the
			 *   data source for the table. This supersedes `sAjaxDataProp` from
			 *   DataTables 1.9-.
			 *
			 * * `success` - Should not be overridden it is used internally in
			 *   DataTables. To manipulate / transform the data returned by the server
			 *   use `ajax.dataSrc`, or use `ajax` as a function (see below).
			 *
			 * `function`
			 * ----------
			 *
			 * As a function, making the Ajax call is left up to yourself allowing
			 * complete control of the Ajax request. Indeed, if desired, a method other
			 * than Ajax could be used to obtain the required data, such as Web storage
			 * or an AIR database.
			 *
			 * The function is given four parameters and no return is required. The
			 * parameters are:
			 *
			 * 1. _object_ - Data to send to the server
			 * 2. _function_ - Callback function that must be executed when the required
			 *    data has been obtained. That data should be passed into the callback
			 *    as the only parameter
			 * 3. _object_ - DataTables settings object for the table
			 *
			 * Note that this supersedes `fnServerData` from DataTables 1.9-.
			 *
			 *  @type string|object|function
			 *  @default null
			 *
			 *  @dtopt Option
			 *  @name DataTable.defaults.ajax
			 *  @since 1.10.0
			 *
			 * @example
			 *   // Get JSON data from a file via Ajax.
			 *   // Note DataTables expects data in the form `{ data: [ ...data... ] }` by default).
			 *   $('#example').dataTable( {
			 *     "ajax": "data.json"
			 *   } );
			 *
			 * @example
			 *   // Get JSON data from a file via Ajax, using `dataSrc` to change
			 *   // `data` to `tableData` (i.e. `{ tableData: [ ...data... ] }`)
			 *   $('#example').dataTable( {
			 *     "ajax": {
			 *       "url": "data.json",
			 *       "dataSrc": "tableData"
			 *     }
			 *   } );
			 *
			 * @example
			 *   // Get JSON data from a file via Ajax, using `dataSrc` to read data
			 *   // from a plain array rather than an array in an object
			 *   $('#example').dataTable( {
			 *     "ajax": {
			 *       "url": "data.json",
			 *       "dataSrc": ""
			 *     }
			 *   } );
			 *
			 * @example
			 *   // Manipulate the data returned from the server - add a link to data
			 *   // (note this can, should, be done using `render` for the column - this
			 *   // is just a simple example of how the data can be manipulated).
			 *   $('#example').dataTable( {
			 *     "ajax": {
			 *       "url": "data.json",
			 *       "dataSrc": function ( json ) {
			 *         for ( var i=0, ien=json.length ; i<ien ; i++ ) {
			 *           json[i][0] = '<a href="/message/'+json[i][0]+'>View message</a>';
			 *         }
			 *         return json;
			 *       }
			 *     }
			 *   } );
			 *
			 * @example
			 *   // Add data to the request
			 *   $('#example').dataTable( {
			 *     "ajax": {
			 *       "url": "data.json",
			 *       "data": function ( d ) {
			 *         return {
			 *           "extra_search": $('#extra').val()
			 *         };
			 *       }
			 *     }
			 *   } );
			 *
			 * @example
			 *   // Send request as POST
			 *   $('#example').dataTable( {
			 *     "ajax": {
			 *       "url": "data.json",
			 *       "type": "POST"
			 *     }
			 *   } );
			 *
			 * @example
			 *   // Get the data from localStorage (could interface with a form for
			 *   // adding, editing and removing rows).
			 *   $('#example').dataTable( {
			 *     "ajax": function (data, callback, settings) {
			 *       callback(
			 *         JSON.parse( localStorage.getItem('dataTablesData') )
			 *       );
			 *     }
			 *   } );
			 */
			"ajax": null,


			/**
			 * This parameter allows you to readily specify the entries in the length drop
			 * down menu that DataTables shows when pagination is enabled. It can be
			 * either a 1D array of options which will be used for both the displayed
			 * option and the value, or a 2D array which will use the array in the first
			 * position as the value, and the array in the second position as the
			 * displayed options (useful for language strings such as 'All').
			 *
			 * Note that the `pageLength` property will be automatically set to the
			 * first value given in this array, unless `pageLength` is also provided.
			 *  @type array
			 *  @default [ 10, 25, 50, 100 ]
			 *
			 *  @dtopt Option
			 *  @name DataTable.defaults.lengthMenu
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
			 *      } );
			 *    } );
			 */
			"aLengthMenu": [10, 25, 50, 100],


			/**
			 * The `columns` option in the initialisation parameter allows you to define
			 * details about the way individual columns behave. For a full list of
			 * column options that can be set, please see
			 * {@link DataTable.defaults.column}. Note that if you use `columns` to
			 * define your columns, you must have an entry in the array for every single
			 * column that you have in your table (these can be null if you don't which
			 * to specify any options).
			 *  @member
			 *
			 *  @name DataTable.defaults.column
			 */
			"aoColumns": null,

			/**
			 * Very similar to `columns`, `columnDefs` allows you to target a specific
			 * column, multiple columns, or all columns, using the `targets` property of
			 * each object in the array. This allows great flexibility when creating
			 * tables, as the `columnDefs` arrays can be of any length, targeting the
			 * columns you specifically want. `columnDefs` may use any of the column
			 * options available: {@link DataTable.defaults.column}, but it _must_
			 * have `targets` defined in each object in the array. Values in the `targets`
			 * array may be:
			 *   <ul>
			 *     <li>a string - class name will be matched on the TH for the column</li>
			 *     <li>0 or a positive integer - column index counting from the left</li>
			 *     <li>a negative integer - column index counting from the right</li>
			 *     <li>the string "_all" - all columns (i.e. assign a default)</li>
			 *   </ul>
			 *  @member
			 *
			 *  @name DataTable.defaults.columnDefs
			 */
			"aoColumnDefs": null,


			/**
			 * Basically the same as `search`, this parameter defines the individual column
			 * filtering state at initialisation time. The array must be of the same size
			 * as the number of columns, and each element be an object with the parameters
			 * `search` and `escapeRegex` (the latter is optional). 'null' is also
			 * accepted and the default will be used.
			 *  @type array
			 *  @default []
			 *
			 *  @dtopt Option
			 *  @name DataTable.defaults.searchCols
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "searchCols": [
			 *          null,
			 *          { "search": "My filter" },
			 *          null,
			 *          { "search": "^[0-9]", "escapeRegex": false }
			 *        ]
			 *      } );
			 *    } )
			 */
			"aoSearchCols": [],


			/**
			 * An array of CSS classes that should be applied to displayed rows. This
			 * array may be of any length, and DataTables will apply each class
			 * sequentially, looping when required.
			 *  @type array
			 *  @default null <i>Will take the values determined by the `oClasses.stripe*`
			 *    options</i>
			 *
			 *  @dtopt Option
			 *  @name DataTable.defaults.stripeClasses
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "stripeClasses": [ 'strip1', 'strip2', 'strip3' ]
			 *      } );
			 *    } )
			 */
			"asStripeClasses": null,


			/**
			 * Enable or disable automatic column width calculation. This can be disabled
			 * as an optimisation (it takes some time to calculate the widths) if the
			 * tables widths are passed in using `columns`.
			 *  @type boolean
			 *  @default true
			 *
			 *  @dtopt Features
			 *  @name DataTable.defaults.autoWidth
			 *
			 *  @example
			 *    $(document).ready( function () {
			 *      $('#example').dataTable( {
			 *        "autoWidth": false
			 *      } );
			 *    } );
			 */
			"bAutoWidth": true,


			/**
			 * Deferred rendering can provide DataTables with a huge speed boost when you
			 * are using an Ajax or JS data source for the table. This option, when set to
			 * true, will cause DataTables to defer the creation of the table elements for
			 * each row until they are needed for a draw - saving a significant amount of
			 * time.
			 *  @type boolean
			 *  @default false
			 *
			 *  @dtopt Features
			 *  @name DataTable.defaults.deferRender
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "ajax": "sources/arrays.txt",
			 *        "deferRender": true
			 *      } );
			 *    } );
			 */
			"bDeferRender": false,


			/**
			 * Replace a DataTable which matches the given selector and replace it with
			 * one which has the properties of the new initialisation object passed. If no
			 * table matches the selector, then the new DataTable will be constructed as
			 * per normal.
			 *  @type boolean
			 *  @default false
			 *
			 *  @dtopt Options
			 *  @name DataTable.defaults.destroy
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "srollY": "200px",
			 *        "paginate": false
			 *      } );
			 *
			 *      // Some time later....
			 *      $('#example').dataTable( {
			 *        "filter": false,
			 *        "destroy": true
			 *      } );
			 *    } );
			 */
			"bDestroy": false,


			/**
			 * Enable or disable filtering of data. Filtering in DataTables is "smart" in
			 * that it allows the end user to input multiple words (space separated) and
			 * will match a row containing those words, even if not in the order that was
			 * specified (this allow matching across multiple columns). Note that if you
			 * wish to use filtering in DataTables this must remain 'true' - to remove the
			 * default filtering input box and retain filtering abilities, please use
			 * {@link DataTable.defaults.dom}.
			 *  @type boolean
			 *  @default true
			 *
			 *  @dtopt Features
			 *  @name DataTable.defaults.searching
			 *
			 *  @example
			 *    $(document).ready( function () {
			 *      $('#example').dataTable( {
			 *        "searching": false
			 *      } );
			 *    } );
			 */
			"bFilter": true,


			/**
			 * Enable or disable the table information display. This shows information
			 * about the data that is currently visible on the page, including information
			 * about filtered data if that action is being performed.
			 *  @type boolean
			 *  @default true
			 *
			 *  @dtopt Features
			 *  @name DataTable.defaults.info
			 *
			 *  @example
			 *    $(document).ready( function () {
			 *      $('#example').dataTable( {
			 *        "info": false
			 *      } );
			 *    } );
			 */
			"bInfo": true,


			/**
			 * Allows the end user to select the size of a formatted page from a select
			 * menu (sizes are 10, 25, 50 and 100). Requires pagination (`paginate`).
			 *  @type boolean
			 *  @default true
			 *
			 *  @dtopt Features
			 *  @name DataTable.defaults.lengthChange
			 *
			 *  @example
			 *    $(document).ready( function () {
			 *      $('#example').dataTable( {
			 *        "lengthChange": false
			 *      } );
			 *    } );
			 */
			"bLengthChange": true,


			/**
			 * Enable or disable pagination.
			 *  @type boolean
			 *  @default true
			 *
			 *  @dtopt Features
			 *  @name DataTable.defaults.paging
			 *
			 *  @example
			 *    $(document).ready( function () {
			 *      $('#example').dataTable( {
			 *        "paging": false
			 *      } );
			 *    } );
			 */
			"bPaginate": true,


			/**
			 * Enable or disable the display of a 'processing' indicator when the table is
			 * being processed (e.g. a sort). This is particularly useful for tables with
			 * large amounts of data where it can take a noticeable amount of time to sort
			 * the entries.
			 *  @type boolean
			 *  @default false
			 *
			 *  @dtopt Features
			 *  @name DataTable.defaults.processing
			 *
			 *  @example
			 *    $(document).ready( function () {
			 *      $('#example').dataTable( {
			 *        "processing": true
			 *      } );
			 *    } );
			 */
			"bProcessing": false,


			/**
			 * Retrieve the DataTables object for the given selector. Note that if the
			 * table has already been initialised, this parameter will cause DataTables
			 * to simply return the object that has already been set up - it will not take
			 * account of any changes you might have made to the initialisation object
			 * passed to DataTables (setting this parameter to true is an acknowledgement
			 * that you understand this). `destroy` can be used to reinitialise a table if
			 * you need.
			 *  @type boolean
			 *  @default false
			 *
			 *  @dtopt Options
			 *  @name DataTable.defaults.retrieve
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      initTable();
			 *      tableActions();
			 *    } );
			 *
			 *    function initTable ()
			 *    {
			 *      return $('#example').dataTable( {
			 *        "scrollY": "200px",
			 *        "paginate": false,
			 *        "retrieve": true
			 *      } );
			 *    }
			 *
			 *    function tableActions ()
			 *    {
			 *      var table = initTable();
			 *      // perform API operations with oTable
			 *    }
			 */
			"bRetrieve": false,


			/**
			 * When vertical (y) scrolling is enabled, DataTables will force the height of
			 * the table's viewport to the given height at all times (useful for layout).
			 * However, this can look odd when filtering data down to a small data set,
			 * and the footer is left "floating" further down. This parameter (when
			 * enabled) will cause DataTables to collapse the table's viewport down when
			 * the result set will fit within the given Y height.
			 *  @type boolean
			 *  @default false
			 *
			 *  @dtopt Options
			 *  @name DataTable.defaults.scrollCollapse
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "scrollY": "200",
			 *        "scrollCollapse": true
			 *      } );
			 *    } );
			 */
			"bScrollCollapse": false,


			/**
			 * Configure DataTables to use server-side processing. Note that the
			 * `ajax` parameter must also be given in order to give DataTables a
			 * source to obtain the required data for each draw.
			 *  @type boolean
			 *  @default false
			 *
			 *  @dtopt Features
			 *  @dtopt Server-side
			 *  @name DataTable.defaults.serverSide
			 *
			 *  @example
			 *    $(document).ready( function () {
			 *      $('#example').dataTable( {
			 *        "serverSide": true,
			 *        "ajax": "xhr.php"
			 *      } );
			 *    } );
			 */
			"bServerSide": false,


			/**
			 * Enable or disable sorting of columns. Sorting of individual columns can be
			 * disabled by the `sortable` option for each column.
			 *  @type boolean
			 *  @default true
			 *
			 *  @dtopt Features
			 *  @name DataTable.defaults.ordering
			 *
			 *  @example
			 *    $(document).ready( function () {
			 *      $('#example').dataTable( {
			 *        "ordering": false
			 *      } );
			 *    } );
			 */
			"bSort": true,


			/**
			 * Enable or display DataTables' ability to sort multiple columns at the
			 * same time (activated by shift-click by the user).
			 *  @type boolean
			 *  @default true
			 *
			 *  @dtopt Options
			 *  @name DataTable.defaults.orderMulti
			 *
			 *  @example
			 *    // Disable multiple column sorting ability
			 *    $(document).ready( function () {
			 *      $('#example').dataTable( {
			 *        "orderMulti": false
			 *      } );
			 *    } );
			 */
			"bSortMulti": true,


			/**
			 * Allows control over whether DataTables should use the top (true) unique
			 * cell that is found for a single column, or the bottom (false - default).
			 * This is useful when using complex headers.
			 *  @type boolean
			 *  @default false
			 *
			 *  @dtopt Options
			 *  @name DataTable.defaults.orderCellsTop
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "orderCellsTop": true
			 *      } );
			 *    } );
			 */
			"bSortCellsTop": false,


			/**
			 * Enable or disable the addition of the classes `sorting\_1`, `sorting\_2` and
			 * `sorting\_3` to the columns which are currently being sorted on. This is
			 * presented as a feature switch as it can increase processing time (while
			 * classes are removed and added) so for large data sets you might want to
			 * turn this off.
			 *  @type boolean
			 *  @default true
			 *
			 *  @dtopt Features
			 *  @name DataTable.defaults.orderClasses
			 *
			 *  @example
			 *    $(document).ready( function () {
			 *      $('#example').dataTable( {
			 *        "orderClasses": false
			 *      } );
			 *    } );
			 */
			"bSortClasses": true,


			/**
			 * Enable or disable state saving. When enabled HTML5 `localStorage` will be
			 * used to save table display information such as pagination information,
			 * display length, filtering and sorting. As such when the end user reloads
			 * the page the display display will match what thy had previously set up.
			 *
			 * Due to the use of `localStorage` the default state saving is not supported
			 * in IE6 or 7. If state saving is required in those browsers, use
			 * `stateSaveCallback` to provide a storage solution such as cookies.
			 *  @type boolean
			 *  @default false
			 *
			 *  @dtopt Features
			 *  @name DataTable.defaults.stateSave
			 *
			 *  @example
			 *    $(document).ready( function () {
			 *      $('#example').dataTable( {
			 *        "stateSave": true
			 *      } );
			 *    } );
			 */
			"bStateSave": false,


			/**
			 * This function is called when a TR element is created (and all TD child
			 * elements have been inserted), or registered if using a DOM source, allowing
			 * manipulation of the TR element (adding classes etc).
			 *  @type function
			 *  @param {node} row "TR" element for the current row
			 *  @param {array} data Raw data array for this row
			 *  @param {int} dataIndex The index of this row in the internal aoData array
			 *
			 *  @dtopt Callbacks
			 *  @name DataTable.defaults.createdRow
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "createdRow": function( row, data, dataIndex ) {
			 *          // Bold the grade for all 'A' grade browsers
			 *          if ( data[4] == "A" )
			 *          {
			 *            $('td:eq(4)', row).html( '<b>A</b>' );
			 *          }
			 *        }
			 *      } );
			 *    } );
			 */
			"fnCreatedRow": null,


			/**
			 * This function is called on every 'draw' event, and allows you to
			 * dynamically modify any aspect you want about the created DOM.
			 *  @type function
			 *  @param {object} settings DataTables settings object
			 *
			 *  @dtopt Callbacks
			 *  @name DataTable.defaults.drawCallback
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "drawCallback": function( settings ) {
			 *          alert( 'DataTables has redrawn the table' );
			 *        }
			 *      } );
			 *    } );
			 */
			"fnDrawCallback": null,


			/**
			 * Identical to fnHeaderCallback() but for the table footer this function
			 * allows you to modify the table footer on every 'draw' event.
			 *  @type function
			 *  @param {node} foot "TR" element for the footer
			 *  @param {array} data Full table data (as derived from the original HTML)
			 *  @param {int} start Index for the current display starting point in the
			 *    display array
			 *  @param {int} end Index for the current display ending point in the
			 *    display array
			 *  @param {array int} display Index array to translate the visual position
			 *    to the full data array
			 *
			 *  @dtopt Callbacks
			 *  @name DataTable.defaults.footerCallback
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "footerCallback": function( tfoot, data, start, end, display ) {
			 *          tfoot.getElementsByTagName('th')[0].innerHTML = "Starting index is "+start;
			 *        }
			 *      } );
			 *    } )
			 */
			"fnFooterCallback": null,


			/**
			 * When rendering large numbers in the information element for the table
			 * (i.e. "Showing 1 to 10 of 57 entries") DataTables will render large numbers
			 * to have a comma separator for the 'thousands' units (e.g. 1 million is
			 * rendered as "1,000,000") to help readability for the end user. This
			 * function will override the default method DataTables uses.
			 *  @type function
			 *  @member
			 *  @param {int} toFormat number to be formatted
			 *  @returns {string} formatted string for DataTables to show the number
			 *
			 *  @dtopt Callbacks
			 *  @name DataTable.defaults.formatNumber
			 *
			 *  @example
			 *    // Format a number using a single quote for the separator (note that
			 *    // this can also be done with the language.thousands option)
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "formatNumber": function ( toFormat ) {
			 *          return toFormat.toString().replace(
			 *            /\B(?=(\d{3})+(?!\d))/g, "'"
			 *          );
			 *        };
			 *      } );
			 *    } );
			 */
			"fnFormatNumber": function (toFormat) {
				return toFormat.toString().replace(
					/\B(?=(\d{3})+(?!\d))/g,
					this.oLanguage.sThousands
				);
			},


			/**
			 * This function is called on every 'draw' event, and allows you to
			 * dynamically modify the header row. This can be used to calculate and
			 * display useful information about the table.
			 *  @type function
			 *  @param {node} head "TR" element for the header
			 *  @param {array} data Full table data (as derived from the original HTML)
			 *  @param {int} start Index for the current display starting point in the
			 *    display array
			 *  @param {int} end Index for the current display ending point in the
			 *    display array
			 *  @param {array int} display Index array to translate the visual position
			 *    to the full data array
			 *
			 *  @dtopt Callbacks
			 *  @name DataTable.defaults.headerCallback
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "fheaderCallback": function( head, data, start, end, display ) {
			 *          head.getElementsByTagName('th')[0].innerHTML = "Displaying "+(end-start)+" records";
			 *        }
			 *      } );
			 *    } )
			 */
			"fnHeaderCallback": null,


			/**
			 * The information element can be used to convey information about the current
			 * state of the table. Although the internationalisation options presented by
			 * DataTables are quite capable of dealing with most customisations, there may
			 * be times where you wish to customise the string further. This callback
			 * allows you to do exactly that.
			 *  @type function
			 *  @param {object} oSettings DataTables settings object
			 *  @param {int} start Starting position in data for the draw
			 *  @param {int} end End position in data for the draw
			 *  @param {int} max Total number of rows in the table (regardless of
			 *    filtering)
			 *  @param {int} total Total number of rows in the data set, after filtering
			 *  @param {string} pre The string that DataTables has formatted using it's
			 *    own rules
			 *  @returns {string} The string to be displayed in the information element.
			 *
			 *  @dtopt Callbacks
			 *  @name DataTable.defaults.infoCallback
			 *
			 *  @example
			 *    $('#example').dataTable( {
			 *      "infoCallback": function( settings, start, end, max, total, pre ) {
			 *        return start +" to "+ end;
			 *      }
			 *    } );
			 */
			"fnInfoCallback": null,


			/**
			 * Called when the table has been initialised. Normally DataTables will
			 * initialise sequentially and there will be no need for this function,
			 * however, this does not hold true when using external language information
			 * since that is obtained using an async XHR call.
			 *  @type function
			 *  @param {object} settings DataTables settings object
			 *  @param {object} json The JSON object request from the server - only
			 *    present if client-side Ajax sourced data is used
			 *
			 *  @dtopt Callbacks
			 *  @name DataTable.defaults.initComplete
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "initComplete": function(settings, json) {
			 *          alert( 'DataTables has finished its initialisation.' );
			 *        }
			 *      } );
			 *    } )
			 */
			"fnInitComplete": null,


			/**
			 * Called at the very start of each table draw and can be used to cancel the
			 * draw by returning false, any other return (including undefined) results in
			 * the full draw occurring).
			 *  @type function
			 *  @param {object} settings DataTables settings object
			 *  @returns {boolean} False will cancel the draw, anything else (including no
			 *    return) will allow it to complete.
			 *
			 *  @dtopt Callbacks
			 *  @name DataTable.defaults.preDrawCallback
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "preDrawCallback": function( settings ) {
			 *          if ( $('#test').val() == 1 ) {
			 *            return false;
			 *          }
			 *        }
			 *      } );
			 *    } );
			 */
			"fnPreDrawCallback": null,


			/**
			 * This function allows you to 'post process' each row after it have been
			 * generated for each table draw, but before it is rendered on screen. This
			 * function might be used for setting the row class name etc.
			 *  @type function
			 *  @param {node} row "TR" element for the current row
			 *  @param {array} data Raw data array for this row
			 *  @param {int} displayIndex The display index for the current table draw
			 *  @param {int} displayIndexFull The index of the data in the full list of
			 *    rows (after filtering)
			 *
			 *  @dtopt Callbacks
			 *  @name DataTable.defaults.rowCallback
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "rowCallback": function( row, data, displayIndex, displayIndexFull ) {
			 *          // Bold the grade for all 'A' grade browsers
			 *          if ( data[4] == "A" ) {
			 *            $('td:eq(4)', row).html( '<b>A</b>' );
			 *          }
			 *        }
			 *      } );
			 *    } );
			 */
			"fnRowCallback": null,


			/**
			 * __Deprecated__ The functionality provided by this parameter has now been
			 * superseded by that provided through `ajax`, which should be used instead.
			 *
			 * This parameter allows you to override the default function which obtains
			 * the data from the server so something more suitable for your application.
			 * For example you could use POST data, or pull information from a Gears or
			 * AIR database.
			 *  @type function
			 *  @member
			 *  @param {string} source HTTP source to obtain the data from (`ajax`)
			 *  @param {array} data A key/value pair object containing the data to send
			 *    to the server
			 *  @param {function} callback to be called on completion of the data get
			 *    process that will draw the data on the page.
			 *  @param {object} settings DataTables settings object
			 *
			 *  @dtopt Callbacks
			 *  @dtopt Server-side
			 *  @name DataTable.defaults.serverData
			 *
			 *  @deprecated 1.10. Please use `ajax` for this functionality now.
			 */
			"fnServerData": null,


			/**
			 * __Deprecated__ The functionality provided by this parameter has now been
			 * superseded by that provided through `ajax`, which should be used instead.
			 *
			 *  It is often useful to send extra data to the server when making an Ajax
			 * request - for example custom filtering information, and this callback
			 * function makes it trivial to send extra information to the server. The
			 * passed in parameter is the data set that has been constructed by
			 * DataTables, and you can add to this or modify it as you require.
			 *  @type function
			 *  @param {array} data Data array (array of objects which are name/value
			 *    pairs) that has been constructed by DataTables and will be sent to the
			 *    server. In the case of Ajax sourced data with server-side processing
			 *    this will be an empty array, for server-side processing there will be a
			 *    significant number of parameters!
			 *  @returns {undefined} Ensure that you modify the data array passed in,
			 *    as this is passed by reference.
			 *
			 *  @dtopt Callbacks
			 *  @dtopt Server-side
			 *  @name DataTable.defaults.serverParams
			 *
			 *  @deprecated 1.10. Please use `ajax` for this functionality now.
			 */
			"fnServerParams": null,


			/**
			 * Load the table state. With this function you can define from where, and how, the
			 * state of a table is loaded. By default DataTables will load from `localStorage`
			 * but you might wish to use a server-side database or cookies.
			 *  @type function
			 *  @member
			 *  @param {object} settings DataTables settings object
			 *  @param {object} callback Callback that can be executed when done. It
			 *    should be passed the loaded state object.
			 *  @return {object} The DataTables state object to be loaded
			 *
			 *  @dtopt Callbacks
			 *  @name DataTable.defaults.stateLoadCallback
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "stateSave": true,
			 *        "stateLoadCallback": function (settings, callback) {
			 *          $.ajax( {
			 *            "url": "/state_load",
			 *            "dataType": "json",
			 *            "success": function (json) {
			 *              callback( json );
			 *            }
			 *          } );
			 *        }
			 *      } );
			 *    } );
			 */
			"fnStateLoadCallback": function (settings) {
				try {
					return JSON.parse(
						(settings.iStateDuration === -1 ? sessionStorage : localStorage).getItem(
							'DataTables_' + settings.sInstance + '_' + location.pathname
						)
					);
				} catch (e) {
					return {};
				}
			},


			/**
			 * Callback which allows modification of the saved state prior to loading that state.
			 * This callback is called when the table is loading state from the stored data, but
			 * prior to the settings object being modified by the saved state. Note that for
			 * plug-in authors, you should use the `stateLoadParams` event to load parameters for
			 * a plug-in.
			 *  @type function
			 *  @param {object} settings DataTables settings object
			 *  @param {object} data The state object that is to be loaded
			 *
			 *  @dtopt Callbacks
			 *  @name DataTable.defaults.stateLoadParams
			 *
			 *  @example
			 *    // Remove a saved filter, so filtering is never loaded
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "stateSave": true,
			 *        "stateLoadParams": function (settings, data) {
			 *          data.oSearch.sSearch = "";
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Disallow state loading by returning false
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "stateSave": true,
			 *        "stateLoadParams": function (settings, data) {
			 *          return false;
			 *        }
			 *      } );
			 *    } );
			 */
			"fnStateLoadParams": null,


			/**
			 * Callback that is called when the state has been loaded from the state saving method
			 * and the DataTables settings object has been modified as a result of the loaded state.
			 *  @type function
			 *  @param {object} settings DataTables settings object
			 *  @param {object} data The state object that was loaded
			 *
			 *  @dtopt Callbacks
			 *  @name DataTable.defaults.stateLoaded
			 *
			 *  @example
			 *    // Show an alert with the filtering value that was saved
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "stateSave": true,
			 *        "stateLoaded": function (settings, data) {
			 *          alert( 'Saved filter was: '+data.oSearch.sSearch );
			 *        }
			 *      } );
			 *    } );
			 */
			"fnStateLoaded": null,


			/**
			 * Save the table state. This function allows you to define where and how the state
			 * information for the table is stored By default DataTables will use `localStorage`
			 * but you might wish to use a server-side database or cookies.
			 *  @type function
			 *  @member
			 *  @param {object} settings DataTables settings object
			 *  @param {object} data The state object to be saved
			 *
			 *  @dtopt Callbacks
			 *  @name DataTable.defaults.stateSaveCallback
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "stateSave": true,
			 *        "stateSaveCallback": function (settings, data) {
			 *          // Send an Ajax request to the server with the state object
			 *          $.ajax( {
			 *            "url": "/state_save",
			 *            "data": data,
			 *            "dataType": "json",
			 *            "method": "POST"
			 *            "success": function () {}
			 *          } );
			 *        }
			 *      } );
			 *    } );
			 */
			"fnStateSaveCallback": function (settings, data) {
				try {
					(settings.iStateDuration === -1 ? sessionStorage : localStorage).setItem(
						'DataTables_' + settings.sInstance + '_' + location.pathname,
						JSON.stringify(data)
					);
				} catch (e) { }
			},


			/**
			 * Callback which allows modification of the state to be saved. Called when the table
			 * has changed state a new state save is required. This method allows modification of
			 * the state saving object prior to actually doing the save, including addition or
			 * other state properties or modification. Note that for plug-in authors, you should
			 * use the `stateSaveParams` event to save parameters for a plug-in.
			 *  @type function
			 *  @param {object} settings DataTables settings object
			 *  @param {object} data The state object to be saved
			 *
			 *  @dtopt Callbacks
			 *  @name DataTable.defaults.stateSaveParams
			 *
			 *  @example
			 *    // Remove a saved filter, so filtering is never saved
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "stateSave": true,
			 *        "stateSaveParams": function (settings, data) {
			 *          data.oSearch.sSearch = "";
			 *        }
			 *      } );
			 *    } );
			 */
			"fnStateSaveParams": null,


			/**
			 * Duration for which the saved state information is considered valid. After this period
			 * has elapsed the state will be returned to the default.
			 * Value is given in seconds.
			 *  @type int
			 *  @default 7200 <i>(2 hours)</i>
			 *
			 *  @dtopt Options
			 *  @name DataTable.defaults.stateDuration
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "stateDuration": 60*60*24; // 1 day
			 *      } );
			 *    } )
			 */
			"iStateDuration": 7200,


			/**
			 * When enabled DataTables will not make a request to the server for the first
			 * page draw - rather it will use the data already on the page (no sorting etc
			 * will be applied to it), thus saving on an XHR at load time. `deferLoading`
			 * is used to indicate that deferred loading is required, but it is also used
			 * to tell DataTables how many records there are in the full table (allowing
			 * the information element and pagination to be displayed correctly). In the case
			 * where a filtering is applied to the table on initial load, this can be
			 * indicated by giving the parameter as an array, where the first element is
			 * the number of records available after filtering and the second element is the
			 * number of records without filtering (allowing the table information element
			 * to be shown correctly).
			 *  @type int | array
			 *  @default null
			 *
			 *  @dtopt Options
			 *  @name DataTable.defaults.deferLoading
			 *
			 *  @example
			 *    // 57 records available in the table, no filtering applied
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "serverSide": true,
			 *        "ajax": "scripts/server_processing.php",
			 *        "deferLoading": 57
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // 57 records after filtering, 100 without filtering (an initial filter applied)
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "serverSide": true,
			 *        "ajax": "scripts/server_processing.php",
			 *        "deferLoading": [ 57, 100 ],
			 *        "search": {
			 *          "search": "my_filter"
			 *        }
			 *      } );
			 *    } );
			 */
			"iDeferLoading": null,


			/**
			 * Number of rows to display on a single page when using pagination. If
			 * feature enabled (`lengthChange`) then the end user will be able to override
			 * this to a custom setting using a pop-up menu.
			 *  @type int
			 *  @default 10
			 *
			 *  @dtopt Options
			 *  @name DataTable.defaults.pageLength
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "pageLength": 50
			 *      } );
			 *    } )
			 */
			"iDisplayLength": 10,


			/**
			 * Define the starting point for data display when using DataTables with
			 * pagination. Note that this parameter is the number of records, rather than
			 * the page number, so if you have 10 records per page and want to start on
			 * the third page, it should be "20".
			 *  @type int
			 *  @default 0
			 *
			 *  @dtopt Options
			 *  @name DataTable.defaults.displayStart
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "displayStart": 20
			 *      } );
			 *    } )
			 */
			"iDisplayStart": 0,


			/**
			 * By default DataTables allows keyboard navigation of the table (sorting, paging,
			 * and filtering) by adding a `tabindex` attribute to the required elements. This
			 * allows you to tab through the controls and press the enter key to activate them.
			 * The tabindex is default 0, meaning that the tab follows the flow of the document.
			 * You can overrule this using this parameter if you wish. Use a value of -1 to
			 * disable built-in keyboard navigation.
			 *  @type int
			 *  @default 0
			 *
			 *  @dtopt Options
			 *  @name DataTable.defaults.tabIndex
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "tabIndex": 1
			 *      } );
			 *    } );
			 */
			"iTabIndex": 0,


			/**
			 * Classes that DataTables assigns to the various components and features
			 * that it adds to the HTML table. This allows classes to be configured
			 * during initialisation in addition to through the static
			 * {@link DataTable.ext.oStdClasses} object).
			 *  @namespace
			 *  @name DataTable.defaults.classes
			 */
			"oClasses": {},


			/**
			 * All strings that DataTables uses in the user interface that it creates
			 * are defined in this object, allowing you to modified them individually or
			 * completely replace them all as required.
			 *  @namespace
			 *  @name DataTable.defaults.language
			 */
			"oLanguage": {
				/**
				 * Strings that are used for WAI-ARIA labels and controls only (these are not
				 * actually visible on the page, but will be read by screenreaders, and thus
				 * must be internationalised as well).
				 *  @namespace
				 *  @name DataTable.defaults.language.aria
				 */
				"oAria": {
					/**
					 * ARIA label that is added to the table headers when the column may be
					 * sorted ascending by activing the column (click or return when focused).
					 * Note that the column header is prefixed to this string.
					 *  @type string
					 *  @default : activate to sort column ascending
					 *
					 *  @dtopt Language
					 *  @name DataTable.defaults.language.aria.sortAscending
					 *
					 *  @example
					 *    $(document).ready( function() {
					 *      $('#example').dataTable( {
					 *        "language": {
					 *          "aria": {
					 *            "sortAscending": " - click/return to sort ascending"
					 *          }
					 *        }
					 *      } );
					 *    } );
					 */
					"sSortAscending": ": activate to sort column ascending",

					/**
					 * ARIA label that is added to the table headers when the column may be
					 * sorted descending by activing the column (click or return when focused).
					 * Note that the column header is prefixed to this string.
					 *  @type string
					 *  @default : activate to sort column ascending
					 *
					 *  @dtopt Language
					 *  @name DataTable.defaults.language.aria.sortDescending
					 *
					 *  @example
					 *    $(document).ready( function() {
					 *      $('#example').dataTable( {
					 *        "language": {
					 *          "aria": {
					 *            "sortDescending": " - click/return to sort descending"
					 *          }
					 *        }
					 *      } );
					 *    } );
					 */
					"sSortDescending": ": activate to sort column descending"
				},

				/**
				 * Pagination string used by DataTables for the built-in pagination
				 * control types.
				 *  @namespace
				 *  @name DataTable.defaults.language.paginate
				 */
				"oPaginate": {
					/**
					 * Text to use when using the 'full_numbers' type of pagination for the
					 * button to take the user to the first page.
					 *  @type string
					 *  @default First
					 *
					 *  @dtopt Language
					 *  @name DataTable.defaults.language.paginate.first
					 *
					 *  @example
					 *    $(document).ready( function() {
					 *      $('#example').dataTable( {
					 *        "language": {
					 *          "paginate": {
					 *            "first": "First page"
					 *          }
					 *        }
					 *      } );
					 *    } );
					 */
					"sFirst": "First",


					/**
					 * Text to use when using the 'full_numbers' type of pagination for the
					 * button to take the user to the last page.
					 *  @type string
					 *  @default Last
					 *
					 *  @dtopt Language
					 *  @name DataTable.defaults.language.paginate.last
					 *
					 *  @example
					 *    $(document).ready( function() {
					 *      $('#example').dataTable( {
					 *        "language": {
					 *          "paginate": {
					 *            "last": "Last page"
					 *          }
					 *        }
					 *      } );
					 *    } );
					 */
					"sLast": "Last",


					/**
					 * Text to use for the 'next' pagination button (to take the user to the
					 * next page).
					 *  @type string
					 *  @default Next
					 *
					 *  @dtopt Language
					 *  @name DataTable.defaults.language.paginate.next
					 *
					 *  @example
					 *    $(document).ready( function() {
					 *      $('#example').dataTable( {
					 *        "language": {
					 *          "paginate": {
					 *            "next": "Next page"
					 *          }
					 *        }
					 *      } );
					 *    } );
					 */
					"sNext": "Next",


					/**
					 * Text to use for the 'previous' pagination button (to take the user to
					 * the previous page).
					 *  @type string
					 *  @default Previous
					 *
					 *  @dtopt Language
					 *  @name DataTable.defaults.language.paginate.previous
					 *
					 *  @example
					 *    $(document).ready( function() {
					 *      $('#example').dataTable( {
					 *        "language": {
					 *          "paginate": {
					 *            "previous": "Previous page"
					 *          }
					 *        }
					 *      } );
					 *    } );
					 */
					"sPrevious": "Previous"
				},

				/**
				 * This string is shown in preference to `zeroRecords` when the table is
				 * empty of data (regardless of filtering). Note that this is an optional
				 * parameter - if it is not given, the value of `zeroRecords` will be used
				 * instead (either the default or given value).
				 *  @type string
				 *  @default No data available in table
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.emptyTable
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "emptyTable": "No data available in table"
				 *        }
				 *      } );
				 *    } );
				 */
				"sEmptyTable": "No data available in table",


				/**
				 * This string gives information to the end user about the information
				 * that is current on display on the page. The following tokens can be
				 * used in the string and will be dynamically replaced as the table
				 * display updates. This tokens can be placed anywhere in the string, or
				 * removed as needed by the language requires:
				 *
				 * * `\_START\_` - Display index of the first record on the current page
				 * * `\_END\_` - Display index of the last record on the current page
				 * * `\_TOTAL\_` - Number of records in the table after filtering
				 * * `\_MAX\_` - Number of records in the table without filtering
				 * * `\_PAGE\_` - Current page number
				 * * `\_PAGES\_` - Total number of pages of data in the table
				 *
				 *  @type string
				 *  @default Showing _START_ to _END_ of _TOTAL_ entries
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.info
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "info": "Showing page _PAGE_ of _PAGES_"
				 *        }
				 *      } );
				 *    } );
				 */
				"sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",


				/**
				 * Display information string for when the table is empty. Typically the
				 * format of this string should match `info`.
				 *  @type string
				 *  @default Showing 0 to 0 of 0 entries
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.infoEmpty
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "infoEmpty": "No entries to show"
				 *        }
				 *      } );
				 *    } );
				 */
				"sInfoEmpty": "Showing 0 to 0 of 0 entries",


				/**
				 * When a user filters the information in a table, this string is appended
				 * to the information (`info`) to give an idea of how strong the filtering
				 * is. The variable _MAX_ is dynamically updated.
				 *  @type string
				 *  @default (filtered from _MAX_ total entries)
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.infoFiltered
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "infoFiltered": " - filtering from _MAX_ records"
				 *        }
				 *      } );
				 *    } );
				 */
				"sInfoFiltered": "(filtered from _MAX_ total entries)",


				/**
				 * If can be useful to append extra information to the info string at times,
				 * and this variable does exactly that. This information will be appended to
				 * the `info` (`infoEmpty` and `infoFiltered` in whatever combination they are
				 * being used) at all times.
				 *  @type string
				 *  @default <i>Empty string</i>
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.infoPostFix
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "infoPostFix": "All records shown are derived from real information."
				 *        }
				 *      } );
				 *    } );
				 */
				"sInfoPostFix": "",


				/**
				 * This decimal place operator is a little different from the other
				 * language options since DataTables doesn't output floating point
				 * numbers, so it won't ever use this for display of a number. Rather,
				 * what this parameter does is modify the sort methods of the table so
				 * that numbers which are in a format which has a character other than
				 * a period (`.`) as a decimal place will be sorted numerically.
				 *
				 * Note that numbers with different decimal places cannot be shown in
				 * the same table and still be sortable, the table must be consistent.
				 * However, multiple different tables on the page can use different
				 * decimal place characters.
				 *  @type string
				 *  @default 
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.decimal
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "decimal": ","
				 *          "thousands": "."
				 *        }
				 *      } );
				 *    } );
				 */
				"sDecimal": "",


				/**
				 * DataTables has a build in number formatter (`formatNumber`) which is
				 * used to format large numbers that are used in the table information.
				 * By default a comma is used, but this can be trivially changed to any
				 * character you wish with this parameter.
				 *  @type string
				 *  @default ,
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.thousands
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "thousands": "'"
				 *        }
				 *      } );
				 *    } );
				 */
				"sThousands": ",",


				/**
				 * Detail the action that will be taken when the drop down menu for the
				 * pagination length option is changed. The '_MENU_' variable is replaced
				 * with a default select list of 10, 25, 50 and 100, and can be replaced
				 * with a custom select box if required.
				 *  @type string
				 *  @default Show _MENU_ entries
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.lengthMenu
				 *
				 *  @example
				 *    // Language change only
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "lengthMenu": "Display _MENU_ records"
				 *        }
				 *      } );
				 *    } );
				 *
				 *  @example
				 *    // Language and options change
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "lengthMenu": 'Display <select>'+
				 *            '<option value="10">10</option>'+
				 *            '<option value="20">20</option>'+
				 *            '<option value="30">30</option>'+
				 *            '<option value="40">40</option>'+
				 *            '<option value="50">50</option>'+
				 *            '<option value="-1">All</option>'+
				 *            '</select> records'
				 *        }
				 *      } );
				 *    } );
				 */
				"sLengthMenu": "Show _MENU_ entries",


				/**
				 * When using Ajax sourced data and during the first draw when DataTables is
				 * gathering the data, this message is shown in an empty row in the table to
				 * indicate to the end user the the data is being loaded. Note that this
				 * parameter is not used when loading data by server-side processing, just
				 * Ajax sourced data with client-side processing.
				 *  @type string
				 *  @default Loading...
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.loadingRecords
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "loadingRecords": "Please wait - loading..."
				 *        }
				 *      } );
				 *    } );
				 */
				"sLoadingRecords": "Loading...",


				/**
				 * Text which is displayed when the table is processing a user action
				 * (usually a sort command or similar).
				 *  @type string
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.processing
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "processing": "DataTables is currently busy"
				 *        }
				 *      } );
				 *    } );
				 */
				"sProcessing": "",


				/**
				 * Details the actions that will be taken when the user types into the
				 * filtering input text box. The variable "_INPUT_", if used in the string,
				 * is replaced with the HTML text box for the filtering input allowing
				 * control over where it appears in the string. If "_INPUT_" is not given
				 * then the input box is appended to the string automatically.
				 *  @type string
				 *  @default Search:
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.search
				 *
				 *  @example
				 *    // Input text box will be appended at the end automatically
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "search": "Filter records:"
				 *        }
				 *      } );
				 *    } );
				 *
				 *  @example
				 *    // Specify where the filter should appear
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "search": "Apply filter _INPUT_ to table"
				 *        }
				 *      } );
				 *    } );
				 */
				"sSearch": "Search:",


				/**
				 * Assign a `placeholder` attribute to the search `input` element
				 *  @type string
				 *  @default 
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.searchPlaceholder
				 */
				"sSearchPlaceholder": "",


				/**
				 * All of the language information can be stored in a file on the
				 * server-side, which DataTables will look up if this parameter is passed.
				 * It must store the URL of the language file, which is in a JSON format,
				 * and the object has the same properties as the oLanguage object in the
				 * initialiser object (i.e. the above parameters). Please refer to one of
				 * the example language files to see how this works in action.
				 *  @type string
				 *  @default <i>Empty string - i.e. disabled</i>
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.url
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "url": "http://www.sprymedia.co.uk/dataTables/lang.txt"
				 *        }
				 *      } );
				 *    } );
				 */
				"sUrl": "",


				/**
				 * Text shown inside the table records when the is no information to be
				 * displayed after filtering. `emptyTable` is shown when there is simply no
				 * information in the table at all (regardless of filtering).
				 *  @type string
				 *  @default No matching records found
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.zeroRecords
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "zeroRecords": "No records to display"
				 *        }
				 *      } );
				 *    } );
				 */
				"sZeroRecords": "No matching records found"
			},


			/**
			 * This parameter allows you to have define the global filtering state at
			 * initialisation time. As an object the `search` parameter must be
			 * defined, but all other parameters are optional. When `regex` is true,
			 * the search string will be treated as a regular expression, when false
			 * (default) it will be treated as a straight string. When `smart`
			 * DataTables will use it's smart filtering methods (to word match at
			 * any point in the data), when false this will not be done.
			 *  @namespace
			 *  @extends DataTable.models.oSearch
			 *
			 *  @dtopt Options
			 *  @name DataTable.defaults.search
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "search": {"search": "Initial search"}
			 *      } );
			 *    } )
			 */
			"oSearch": $.extend({}, DataTable.models.oSearch),


			/**
			 * __Deprecated__ The functionality provided by this parameter has now been
			 * superseded by that provided through `ajax`, which should be used instead.
			 *
			 * By default DataTables will look for the property `data` (or `aaData` for
			 * compatibility with DataTables 1.9-) when obtaining data from an Ajax
			 * source or for server-side processing - this parameter allows that
			 * property to be changed. You can use Javascript dotted object notation to
			 * get a data source for multiple levels of nesting.
			 *  @type string
			 *  @default data
			 *
			 *  @dtopt Options
			 *  @dtopt Server-side
			 *  @name DataTable.defaults.ajaxDataProp
			 *
			 *  @deprecated 1.10. Please use `ajax` for this functionality now.
			 */
			"sAjaxDataProp": "data",


			/**
			 * __Deprecated__ The functionality provided by this parameter has now been
			 * superseded by that provided through `ajax`, which should be used instead.
			 *
			 * You can instruct DataTables to load data from an external
			 * source using this parameter (use aData if you want to pass data in you
			 * already have). Simply provide a url a JSON object can be obtained from.
			 *  @type string
			 *  @default null
			 *
			 *  @dtopt Options
			 *  @dtopt Server-side
			 *  @name DataTable.defaults.ajaxSource
			 *
			 *  @deprecated 1.10. Please use `ajax` for this functionality now.
			 */
			"sAjaxSource": null,


			/**
			 * This initialisation variable allows you to specify exactly where in the
			 * DOM you want DataTables to inject the various controls it adds to the page
			 * (for example you might want the pagination controls at the top of the
			 * table). DIV elements (with or without a custom class) can also be added to
			 * aid styling. The follow syntax is used:
			 *   <ul>
			 *     <li>The following options are allowed:
			 *       <ul>
			 *         <li>'l' - Length changing</li>
			 *         <li>'f' - Filtering input</li>
			 *         <li>'t' - The table!</li>
			 *         <li>'i' - Information</li>
			 *         <li>'p' - Pagination</li>
			 *         <li>'r' - pRocessing</li>
			 *       </ul>
			 *     </li>
			 *     <li>The following constants are allowed:
			 *       <ul>
			 *         <li>'H' - jQueryUI theme "header" classes ('fg-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix')</li>
			 *         <li>'F' - jQueryUI theme "footer" classes ('fg-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix')</li>
			 *       </ul>
			 *     </li>
			 *     <li>The following syntax is expected:
			 *       <ul>
			 *         <li>'&lt;' and '&gt;' - div elements</li>
			 *         <li>'&lt;"class" and '&gt;' - div with a class</li>
			 *         <li>'&lt;"#id" and '&gt;' - div with an ID</li>
			 *       </ul>
			 *     </li>
			 *     <li>Examples:
			 *       <ul>
			 *         <li>'&lt;"wrapper"flipt&gt;'</li>
			 *         <li>'&lt;lf&lt;t&gt;ip&gt;'</li>
			 *       </ul>
			 *     </li>
			 *   </ul>
			 *  @type string
			 *  @default lfrtip <i>(when `jQueryUI` is false)</i> <b>or</b>
			 *    <"H"lfr>t<"F"ip> <i>(when `jQueryUI` is true)</i>
			 *
			 *  @dtopt Options
			 *  @name DataTable.defaults.dom
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "dom": '&lt;"top"i&gt;rt&lt;"bottom"flp&gt;&lt;"clear"&gt;'
			 *      } );
			 *    } );
			 */
			"sDom": "lfrtip",


			/**
			 * Search delay option. This will throttle full table searches that use the
			 * DataTables provided search input element (it does not effect calls to
			 * `dt-api search()`, providing a delay before the search is made.
			 *  @type integer
			 *  @default 0
			 *
			 *  @dtopt Options
			 *  @name DataTable.defaults.searchDelay
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "searchDelay": 200
			 *      } );
			 *    } )
			 */
			"searchDelay": null,


			/**
			 * DataTables features six different built-in options for the buttons to
			 * display for pagination control:
			 *
			 * * `numbers` - Page number buttons only
			 * * `simple` - 'Previous' and 'Next' buttons only
			 * * 'simple_numbers` - 'Previous' and 'Next' buttons, plus page numbers
			 * * `full` - 'First', 'Previous', 'Next' and 'Last' buttons
			 * * `full_numbers` - 'First', 'Previous', 'Next' and 'Last' buttons, plus page numbers
			 * * `first_last_numbers` - 'First' and 'Last' buttons, plus page numbers
			 *  
			 * Further methods can be added using {@link DataTable.ext.oPagination}.
			 *  @type string
			 *  @default simple_numbers
			 *
			 *  @dtopt Options
			 *  @name DataTable.defaults.pagingType
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "pagingType": "full_numbers"
			 *      } );
			 *    } )
			 */
			"sPaginationType": "simple_numbers",


			/**
			 * Enable horizontal scrolling. When a table is too wide to fit into a
			 * certain layout, or you have a large number of columns in the table, you
			 * can enable x-scrolling to show the table in a viewport, which can be
			 * scrolled. This property can be `true` which will allow the table to
			 * scroll horizontally when needed, or any CSS unit, or a number (in which
			 * case it will be treated as a pixel measurement). Setting as simply `true`
			 * is recommended.
			 *  @type boolean|string
			 *  @default <i>blank string - i.e. disabled</i>
			 *
			 *  @dtopt Features
			 *  @name DataTable.defaults.scrollX
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "scrollX": true,
			 *        "scrollCollapse": true
			 *      } );
			 *    } );
			 */
			"sScrollX": "",


			/**
			 * This property can be used to force a DataTable to use more width than it
			 * might otherwise do when x-scrolling is enabled. For example if you have a
			 * table which requires to be well spaced, this parameter is useful for
			 * "over-sizing" the table, and thus forcing scrolling. This property can by
			 * any CSS unit, or a number (in which case it will be treated as a pixel
			 * measurement).
			 *  @type string
			 *  @default <i>blank string - i.e. disabled</i>
			 *
			 *  @dtopt Options
			 *  @name DataTable.defaults.scrollXInner
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "scrollX": "100%",
			 *        "scrollXInner": "110%"
			 *      } );
			 *    } );
			 */
			"sScrollXInner": "",


			/**
			 * Enable vertical scrolling. Vertical scrolling will constrain the DataTable
			 * to the given height, and enable scrolling for any data which overflows the
			 * current viewport. This can be used as an alternative to paging to display
			 * a lot of data in a small area (although paging and scrolling can both be
			 * enabled at the same time). This property can be any CSS unit, or a number
			 * (in which case it will be treated as a pixel measurement).
			 *  @type string
			 *  @default <i>blank string - i.e. disabled</i>
			 *
			 *  @dtopt Features
			 *  @name DataTable.defaults.scrollY
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "scrollY": "200px",
			 *        "paginate": false
			 *      } );
			 *    } );
			 */
			"sScrollY": "",


			/**
			 * __Deprecated__ The functionality provided by this parameter has now been
			 * superseded by that provided through `ajax`, which should be used instead.
			 *
			 * Set the HTTP method that is used to make the Ajax call for server-side
			 * processing or Ajax sourced data.
			 *  @type string
			 *  @default GET
			 *
			 *  @dtopt Options
			 *  @dtopt Server-side
			 *  @name DataTable.defaults.serverMethod
			 *
			 *  @deprecated 1.10. Please use `ajax` for this functionality now.
			 */
			"sServerMethod": "GET",


			/**
			 * DataTables makes use of renderers when displaying HTML elements for
			 * a table. These renderers can be added or modified by plug-ins to
			 * generate suitable mark-up for a site. For example the Bootstrap
			 * integration plug-in for DataTables uses a paging button renderer to
			 * display pagination buttons in the mark-up required by Bootstrap.
			 *
			 * For further information about the renderers available see
			 * DataTable.ext.renderer
			 *  @type string|object
			 *  @default null
			 *
			 *  @name DataTable.defaults.renderer
			 *
			 */
			"renderer": null,


			/**
			 * Set the data property name that DataTables should use to get a row's id
			 * to set as the `id` property in the node.
			 *  @type string
			 *  @default DT_RowId
			 *
			 *  @name DataTable.defaults.rowId
			 */
			"rowId": "DT_RowId"
		};

		_fnHungarianMap(DataTable.defaults);



		/*
		 * Developer note - See note in model.defaults.js about the use of Hungarian
		 * notation and camel case.
		 */

		/**
		 * Column options that can be given to DataTables at initialisation time.
		 *  @namespace
		 */
		DataTable.defaults.column = {
			/**
			 * Define which column(s) an order will occur on for this column. This
			 * allows a column's ordering to take multiple columns into account when
			 * doing a sort or use the data from a different column. For example first
			 * name / last name columns make sense to do a multi-column sort over the
			 * two columns.
			 *  @type array|int
			 *  @default null <i>Takes the value of the column index automatically</i>
			 *
			 *  @name DataTable.defaults.column.orderData
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Using `columnDefs`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [
			 *          { "orderData": [ 0, 1 ], "targets": [ 0 ] },
			 *          { "orderData": [ 1, 0 ], "targets": [ 1 ] },
			 *          { "orderData": 2, "targets": [ 2 ] }
			 *        ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Using `columns`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columns": [
			 *          { "orderData": [ 0, 1 ] },
			 *          { "orderData": [ 1, 0 ] },
			 *          { "orderData": 2 },
			 *          null,
			 *          null
			 *        ]
			 *      } );
			 *    } );
			 */
			"aDataSort": null,
			"iDataSort": -1,


			/**
			 * You can control the default ordering direction, and even alter the
			 * behaviour of the sort handler (i.e. only allow ascending ordering etc)
			 * using this parameter.
			 *  @type array
			 *  @default [ 'asc', 'desc' ]
			 *
			 *  @name DataTable.defaults.column.orderSequence
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Using `columnDefs`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [
			 *          { "orderSequence": [ "asc" ], "targets": [ 1 ] },
			 *          { "orderSequence": [ "desc", "asc", "asc" ], "targets": [ 2 ] },
			 *          { "orderSequence": [ "desc" ], "targets": [ 3 ] }
			 *        ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Using `columns`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columns": [
			 *          null,
			 *          { "orderSequence": [ "asc" ] },
			 *          { "orderSequence": [ "desc", "asc", "asc" ] },
			 *          { "orderSequence": [ "desc" ] },
			 *          null
			 *        ]
			 *      } );
			 *    } );
			 */
			"asSorting": ['asc', 'desc'],


			/**
			 * Enable or disable filtering on the data in this column.
			 *  @type boolean
			 *  @default true
			 *
			 *  @name DataTable.defaults.column.searchable
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Using `columnDefs`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [
			 *          { "searchable": false, "targets": [ 0 ] }
			 *        ] } );
			 *    } );
			 *
			 *  @example
			 *    // Using `columns`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columns": [
			 *          { "searchable": false },
			 *          null,
			 *          null,
			 *          null,
			 *          null
			 *        ] } );
			 *    } );
			 */
			"bSearchable": true,


			/**
			 * Enable or disable ordering on this column.
			 *  @type boolean
			 *  @default true
			 *
			 *  @name DataTable.defaults.column.orderable
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Using `columnDefs`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [
			 *          { "orderable": false, "targets": [ 0 ] }
			 *        ] } );
			 *    } );
			 *
			 *  @example
			 *    // Using `columns`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columns": [
			 *          { "orderable": false },
			 *          null,
			 *          null,
			 *          null,
			 *          null
			 *        ] } );
			 *    } );
			 */
			"bSortable": true,


			/**
			 * Enable or disable the display of this column.
			 *  @type boolean
			 *  @default true
			 *
			 *  @name DataTable.defaults.column.visible
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Using `columnDefs`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [
			 *          { "visible": false, "targets": [ 0 ] }
			 *        ] } );
			 *    } );
			 *
			 *  @example
			 *    // Using `columns`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columns": [
			 *          { "visible": false },
			 *          null,
			 *          null,
			 *          null,
			 *          null
			 *        ] } );
			 *    } );
			 */
			"bVisible": true,


			/**
			 * Developer definable function that is called whenever a cell is created (Ajax source,
			 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
			 * allowing you to modify the DOM element (add background colour for example) when the
			 * element is available.
			 *  @type function
			 *  @param {element} td The TD node that has been created
			 *  @param {*} cellData The Data for the cell
			 *  @param {array|object} rowData The data for the whole row
			 *  @param {int} row The row index for the aoData data store
			 *  @param {int} col The column index for aoColumns
			 *
			 *  @name DataTable.defaults.column.createdCell
			 *  @dtopt Columns
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [ {
			 *          "targets": [3],
			 *          "createdCell": function (td, cellData, rowData, row, col) {
			 *            if ( cellData == "1.7" ) {
			 *              $(td).css('color', 'blue')
			 *            }
			 *          }
			 *        } ]
			 *      });
			 *    } );
			 */
			"fnCreatedCell": null,


			/**
			 * This parameter has been replaced by `data` in DataTables to ensure naming
			 * consistency. `dataProp` can still be used, as there is backwards
			 * compatibility in DataTables for this option, but it is strongly
			 * recommended that you use `data` in preference to `dataProp`.
			 *  @name DataTable.defaults.column.dataProp
			 */


			/**
			 * This property can be used to read data from any data source property,
			 * including deeply nested objects / properties. `data` can be given in a
			 * number of different ways which effect its behaviour:
			 *
			 * * `integer` - treated as an array index for the data source. This is the
			 *   default that DataTables uses (incrementally increased for each column).
			 * * `string` - read an object property from the data source. There are
			 *   three 'special' options that can be used in the string to alter how
			 *   DataTables reads the data from the source object:
			 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
			 *      Javascript to read from nested objects, so to can the options
			 *      specified in `data`. For example: `browser.version` or
			 *      `browser.name`. If your object parameter name contains a period, use
			 *      `\\` to escape it - i.e. `first\\.name`.
			 *    * `[]` - Array notation. DataTables can automatically combine data
			 *      from and array source, joining the data with the characters provided
			 *      between the two brackets. For example: `name[, ]` would provide a
			 *      comma-space separated list from the source array. If no characters
			 *      are provided between the brackets, the original array source is
			 *      returned.
			 *    * `()` - Function notation. Adding `()` to the end of a parameter will
			 *      execute a function of the name given. For example: `browser()` for a
			 *      simple function on the data source, `browser.version()` for a
			 *      function in a nested property or even `browser().version` to get an
			 *      object property if the function called returns an object. Note that
			 *      function notation is recommended for use in `render` rather than
			 *      `data` as it is much simpler to use as a renderer.
			 * * `null` - use the original data source for the row rather than plucking
			 *   data directly from it. This action has effects on two other
			 *   initialisation options:
			 *    * `defaultContent` - When null is given as the `data` option and
			 *      `defaultContent` is specified for the column, the value defined by
			 *      `defaultContent` will be used for the cell.
			 *    * `render` - When null is used for the `data` option and the `render`
			 *      option is specified for the column, the whole data source for the
			 *      row is used for the renderer.
			 * * `function` - the function given will be executed whenever DataTables
			 *   needs to set or get the data for a cell in the column. The function
			 *   takes three parameters:
			 *    * Parameters:
			 *      * `{array|object}` The data source for the row
			 *      * `{string}` The type call data requested - this will be 'set' when
			 *        setting data or 'filter', 'display', 'type', 'sort' or undefined
			 *        when gathering data. Note that when `undefined` is given for the
			 *        type DataTables expects to get the raw data for the object back<
			 *      * `{*}` Data to set when the second parameter is 'set'.
			 *    * Return:
			 *      * The return value from the function is not required when 'set' is
			 *        the type of call, but otherwise the return is what will be used
			 *        for the data requested.
			 *
			 * Note that `data` is a getter and setter option. If you just require
			 * formatting of data for output, you will likely want to use `render` which
			 * is simply a getter and thus simpler to use.
			 *
			 * Note that prior to DataTables 1.9.2 `data` was called `mDataProp`. The
			 * name change reflects the flexibility of this property and is consistent
			 * with the naming of mRender. If 'mDataProp' is given, then it will still
			 * be used by DataTables, as it automatically maps the old name to the new
			 * if required.
			 *
			 *  @type string|int|function|null
			 *  @default null <i>Use automatically calculated column index</i>
			 *
			 *  @name DataTable.defaults.column.data
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Read table data from objects
			 *    // JSON structure for each row:
			 *    //   {
			 *    //      "engine": {value},
			 *    //      "browser": {value},
			 *    //      "platform": {value},
			 *    //      "version": {value},
			 *    //      "grade": {value}
			 *    //   }
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "ajaxSource": "sources/objects.txt",
			 *        "columns": [
			 *          { "data": "engine" },
			 *          { "data": "browser" },
			 *          { "data": "platform" },
			 *          { "data": "version" },
			 *          { "data": "grade" }
			 *        ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Read information from deeply nested objects
			 *    // JSON structure for each row:
			 *    //   {
			 *    //      "engine": {value},
			 *    //      "browser": {value},
			 *    //      "platform": {
			 *    //         "inner": {value}
			 *    //      },
			 *    //      "details": [
			 *    //         {value}, {value}
			 *    //      ]
			 *    //   }
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "ajaxSource": "sources/deep.txt",
			 *        "columns": [
			 *          { "data": "engine" },
			 *          { "data": "browser" },
			 *          { "data": "platform.inner" },
			 *          { "data": "details.0" },
			 *          { "data": "details.1" }
			 *        ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Using `data` as a function to provide different information for
			 *    // sorting, filtering and display. In this case, currency (price)
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [ {
			 *          "targets": [ 0 ],
			 *          "data": function ( source, type, val ) {
			 *            if (type === 'set') {
			 *              source.price = val;
			 *              // Store the computed display and filter values for efficiency
			 *              source.price_display = val=="" ? "" : "$"+numberFormat(val);
			 *              source.price_filter  = val=="" ? "" : "$"+numberFormat(val)+" "+val;
			 *              return;
			 *            }
			 *            else if (type === 'display') {
			 *              return source.price_display;
			 *            }
			 *            else if (type === 'filter') {
			 *              return source.price_filter;
			 *            }
			 *            // 'sort', 'type' and undefined all just use the integer
			 *            return source.price;
			 *          }
			 *        } ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Using default content
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [ {
			 *          "targets": [ 0 ],
			 *          "data": null,
			 *          "defaultContent": "Click to edit"
			 *        } ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Using array notation - outputting a list from an array
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [ {
			 *          "targets": [ 0 ],
			 *          "data": "name[, ]"
			 *        } ]
			 *      } );
			 *    } );
			 *
			 */
			"mData": null,


			/**
			 * This property is the rendering partner to `data` and it is suggested that
			 * when you want to manipulate data for display (including filtering,
			 * sorting etc) without altering the underlying data for the table, use this
			 * property. `render` can be considered to be the the read only companion to
			 * `data` which is read / write (then as such more complex). Like `data`
			 * this option can be given in a number of different ways to effect its
			 * behaviour:
			 *
			 * * `integer` - treated as an array index for the data source. This is the
			 *   default that DataTables uses (incrementally increased for each column).
			 * * `string` - read an object property from the data source. There are
			 *   three 'special' options that can be used in the string to alter how
			 *   DataTables reads the data from the source object:
			 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
			 *      Javascript to read from nested objects, so to can the options
			 *      specified in `data`. For example: `browser.version` or
			 *      `browser.name`. If your object parameter name contains a period, use
			 *      `\\` to escape it - i.e. `first\\.name`.
			 *    * `[]` - Array notation. DataTables can automatically combine data
			 *      from and array source, joining the data with the characters provided
			 *      between the two brackets. For example: `name[, ]` would provide a
			 *      comma-space separated list from the source array. If no characters
			 *      are provided between the brackets, the original array source is
			 *      returned.
			 *    * `()` - Function notation. Adding `()` to the end of a parameter will
			 *      execute a function of the name given. For example: `browser()` for a
			 *      simple function on the data source, `browser.version()` for a
			 *      function in a nested property or even `browser().version` to get an
			 *      object property if the function called returns an object.
			 * * `object` - use different data for the different data types requested by
			 *   DataTables ('filter', 'display', 'type' or 'sort'). The property names
			 *   of the object is the data type the property refers to and the value can
			 *   defined using an integer, string or function using the same rules as
			 *   `render` normally does. Note that an `_` option _must_ be specified.
			 *   This is the default value to use if you haven't specified a value for
			 *   the data type requested by DataTables.
			 * * `function` - the function given will be executed whenever DataTables
			 *   needs to set or get the data for a cell in the column. The function
			 *   takes three parameters:
			 *    * Parameters:
			 *      * {array|object} The data source for the row (based on `data`)
			 *      * {string} The type call data requested - this will be 'filter',
			 *        'display', 'type' or 'sort'.
			 *      * {array|object} The full data source for the row (not based on
			 *        `data`)
			 *    * Return:
			 *      * The return value from the function is what will be used for the
			 *        data requested.
			 *
			 *  @type string|int|function|object|null
			 *  @default null Use the data source value.
			 *
			 *  @name DataTable.defaults.column.render
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Create a comma separated list from an array of objects
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "ajaxSource": "sources/deep.txt",
			 *        "columns": [
			 *          { "data": "engine" },
			 *          { "data": "browser" },
			 *          {
			 *            "data": "platform",
			 *            "render": "[, ].name"
			 *          }
			 *        ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Execute a function to obtain data
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [ {
			 *          "targets": [ 0 ],
			 *          "data": null, // Use the full data source object for the renderer's source
			 *          "render": "browserName()"
			 *        } ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // As an object, extracting different data for the different types
			 *    // This would be used with a data source such as:
			 *    //   { "phone": 5552368, "phone_filter": "5552368 555-2368", "phone_display": "555-2368" }
			 *    // Here the `phone` integer is used for sorting and type detection, while `phone_filter`
			 *    // (which has both forms) is used for filtering for if a user inputs either format, while
			 *    // the formatted phone number is the one that is shown in the table.
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [ {
			 *          "targets": [ 0 ],
			 *          "data": null, // Use the full data source object for the renderer's source
			 *          "render": {
			 *            "_": "phone",
			 *            "filter": "phone_filter",
			 *            "display": "phone_display"
			 *          }
			 *        } ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Use as a function to create a link from the data source
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [ {
			 *          "targets": [ 0 ],
			 *          "data": "download_link",
			 *          "render": function ( data, type, full ) {
			 *            return '<a href="'+data+'">Download</a>';
			 *          }
			 *        } ]
			 *      } );
			 *    } );
			 */
			"mRender": null,


			/**
			 * Change the cell type created for the column - either TD cells or TH cells. This
			 * can be useful as TH cells have semantic meaning in the table body, allowing them
			 * to act as a header for a row (you may wish to add scope='row' to the TH elements).
			 *  @type string
			 *  @default td
			 *
			 *  @name DataTable.defaults.column.cellType
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Make the first column use TH cells
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [ {
			 *          "targets": [ 0 ],
			 *          "cellType": "th"
			 *        } ]
			 *      } );
			 *    } );
			 */
			"sCellType": "td",


			/**
			 * Class to give to each cell in this column.
			 *  @type string
			 *  @default <i>Empty string</i>
			 *
			 *  @name DataTable.defaults.column.class
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Using `columnDefs`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [
			 *          { "class": "my_class", "targets": [ 0 ] }
			 *        ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Using `columns`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columns": [
			 *          { "class": "my_class" },
			 *          null,
			 *          null,
			 *          null,
			 *          null
			 *        ]
			 *      } );
			 *    } );
			 */
			"sClass": "",

			/**
			 * When DataTables calculates the column widths to assign to each column,
			 * it finds the longest string in each column and then constructs a
			 * temporary table and reads the widths from that. The problem with this
			 * is that "mmm" is much wider then "iiii", but the latter is a longer
			 * string - thus the calculation can go wrong (doing it properly and putting
			 * it into an DOM object and measuring that is horribly(!) slow). Thus as
			 * a "work around" we provide this option. It will append its value to the
			 * text that is found to be the longest string for the column - i.e. padding.
			 * Generally you shouldn't need this!
			 *  @type string
			 *  @default <i>Empty string<i>
			 *
			 *  @name DataTable.defaults.column.contentPadding
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Using `columns`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columns": [
			 *          null,
			 *          null,
			 *          null,
			 *          {
			 *            "contentPadding": "mmm"
			 *          }
			 *        ]
			 *      } );
			 *    } );
			 */
			"sContentPadding": "",


			/**
			 * Allows a default value to be given for a column's data, and will be used
			 * whenever a null data source is encountered (this can be because `data`
			 * is set to null, or because the data source itself is null).
			 *  @type string
			 *  @default null
			 *
			 *  @name DataTable.defaults.column.defaultContent
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Using `columnDefs`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [
			 *          {
			 *            "data": null,
			 *            "defaultContent": "Edit",
			 *            "targets": [ -1 ]
			 *          }
			 *        ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Using `columns`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columns": [
			 *          null,
			 *          null,
			 *          null,
			 *          {
			 *            "data": null,
			 *            "defaultContent": "Edit"
			 *          }
			 *        ]
			 *      } );
			 *    } );
			 */
			"sDefaultContent": null,


			/**
			 * This parameter is only used in DataTables' server-side processing. It can
			 * be exceptionally useful to know what columns are being displayed on the
			 * client side, and to map these to database fields. When defined, the names
			 * also allow DataTables to reorder information from the server if it comes
			 * back in an unexpected order (i.e. if you switch your columns around on the
			 * client-side, your server-side code does not also need updating).
			 *  @type string
			 *  @default <i>Empty string</i>
			 *
			 *  @name DataTable.defaults.column.name
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Using `columnDefs`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [
			 *          { "name": "engine", "targets": [ 0 ] },
			 *          { "name": "browser", "targets": [ 1 ] },
			 *          { "name": "platform", "targets": [ 2 ] },
			 *          { "name": "version", "targets": [ 3 ] },
			 *          { "name": "grade", "targets": [ 4 ] }
			 *        ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Using `columns`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columns": [
			 *          { "name": "engine" },
			 *          { "name": "browser" },
			 *          { "name": "platform" },
			 *          { "name": "version" },
			 *          { "name": "grade" }
			 *        ]
			 *      } );
			 *    } );
			 */
			"sName": "",


			/**
			 * Defines a data source type for the ordering which can be used to read
			 * real-time information from the table (updating the internally cached
			 * version) prior to ordering. This allows ordering to occur on user
			 * editable elements such as form inputs.
			 *  @type string
			 *  @default std
			 *
			 *  @name DataTable.defaults.column.orderDataType
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Using `columnDefs`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [
			 *          { "orderDataType": "dom-text", "targets": [ 2, 3 ] },
			 *          { "type": "numeric", "targets": [ 3 ] },
			 *          { "orderDataType": "dom-select", "targets": [ 4 ] },
			 *          { "orderDataType": "dom-checkbox", "targets": [ 5 ] }
			 *        ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Using `columns`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columns": [
			 *          null,
			 *          null,
			 *          { "orderDataType": "dom-text" },
			 *          { "orderDataType": "dom-text", "type": "numeric" },
			 *          { "orderDataType": "dom-select" },
			 *          { "orderDataType": "dom-checkbox" }
			 *        ]
			 *      } );
			 *    } );
			 */
			"sSortDataType": "std",


			/**
			 * The title of this column.
			 *  @type string
			 *  @default null <i>Derived from the 'TH' value for this column in the
			 *    original HTML table.</i>
			 *
			 *  @name DataTable.defaults.column.title
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Using `columnDefs`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [
			 *          { "title": "My column title", "targets": [ 0 ] }
			 *        ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Using `columns`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columns": [
			 *          { "title": "My column title" },
			 *          null,
			 *          null,
			 *          null,
			 *          null
			 *        ]
			 *      } );
			 *    } );
			 */
			"sTitle": null,


			/**
			 * The type allows you to specify how the data for this column will be
			 * ordered. Four types (string, numeric, date and html (which will strip
			 * HTML tags before ordering)) are currently available. Note that only date
			 * formats understood by Javascript's Date() object will be accepted as type
			 * date. For example: "Mar 26, 2008 5:03 PM". May take the values: 'string',
			 * 'numeric', 'date' or 'html' (by default). Further types can be adding
			 * through plug-ins.
			 *  @type string
			 *  @default null <i>Auto-detected from raw data</i>
			 *
			 *  @name DataTable.defaults.column.type
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Using `columnDefs`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [
			 *          { "type": "html", "targets": [ 0 ] }
			 *        ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Using `columns`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columns": [
			 *          { "type": "html" },
			 *          null,
			 *          null,
			 *          null,
			 *          null
			 *        ]
			 *      } );
			 *    } );
			 */
			"sType": null,


			/**
			 * Defining the width of the column, this parameter may take any CSS value
			 * (3em, 20px etc). DataTables applies 'smart' widths to columns which have not
			 * been given a specific width through this interface ensuring that the table
			 * remains readable.
			 *  @type string
			 *  @default null <i>Automatic</i>
			 *
			 *  @name DataTable.defaults.column.width
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Using `columnDefs`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [
			 *          { "width": "20%", "targets": [ 0 ] }
			 *        ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Using `columns`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columns": [
			 *          { "width": "20%" },
			 *          null,
			 *          null,
			 *          null,
			 *          null
			 *        ]
			 *      } );
			 *    } );
			 */
			"sWidth": null
		};

		_fnHungarianMap(DataTable.defaults.column);



		/**
		 * DataTables settings object - this holds all the information needed for a
		 * given table, including configuration, data and current application of the
		 * table options. DataTables does not have a single instance for each DataTable
		 * with the settings attached to that instance, but rather instances of the
		 * DataTable "class" are created on-the-fly as needed (typically by a
		 * $().dataTable() call) and the settings object is then applied to that
		 * instance.
		 *
		 * Note that this object is related to {@link DataTable.defaults} but this
		 * one is the internal data store for DataTables's cache of columns. It should
		 * NOT be manipulated outside of DataTables. Any configuration should be done
		 * through the initialisation options.
		 *  @namespace
		 *  @todo Really should attach the settings object to individual instances so we
		 *    don't need to create new instances on each $().dataTable() call (if the
		 *    table already exists). It would also save passing oSettings around and
		 *    into every single function. However, this is a very significant
		 *    architecture change for DataTables and will almost certainly break
		 *    backwards compatibility with older installations. This is something that
		 *    will be done in 2.0.
		 */
		DataTable.models.oSettings = {
			/**
			 * Primary features of DataTables and their enablement state.
			 *  @namespace
			 */
			"oFeatures": {

				/**
				 * Flag to say if DataTables should automatically try to calculate the
				 * optimum table and columns widths (true) or not (false).
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type boolean
				 */
				"bAutoWidth": null,

				/**
				 * Delay the creation of TR and TD elements until they are actually
				 * needed by a driven page draw. This can give a significant speed
				 * increase for Ajax source and Javascript source data, but makes no
				 * difference at all for DOM and server-side processing tables.
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type boolean
				 */
				"bDeferRender": null,

				/**
				 * Enable filtering on the table or not. Note that if this is disabled
				 * then there is no filtering at all on the table, including fnFilter.
				 * To just remove the filtering input use sDom and remove the 'f' option.
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type boolean
				 */
				"bFilter": null,

				/**
				 * Table information element (the 'Showing x of y records' div) enable
				 * flag.
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type boolean
				 */
				"bInfo": null,

				/**
				 * Present a user control allowing the end user to change the page size
				 * when pagination is enabled.
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type boolean
				 */
				"bLengthChange": null,

				/**
				 * Pagination enabled or not. Note that if this is disabled then length
				 * changing must also be disabled.
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type boolean
				 */
				"bPaginate": null,

				/**
				 * Processing indicator enable flag whenever DataTables is enacting a
				 * user request - typically an Ajax request for server-side processing.
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type boolean
				 */
				"bProcessing": null,

				/**
				 * Server-side processing enabled flag - when enabled DataTables will
				 * get all data from the server for every draw - there is no filtering,
				 * sorting or paging done on the client-side.
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type boolean
				 */
				"bServerSide": null,

				/**
				 * Sorting enablement flag.
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type boolean
				 */
				"bSort": null,

				/**
				 * Multi-column sorting
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type boolean
				 */
				"bSortMulti": null,

				/**
				 * Apply a class to the columns which are being sorted to provide a
				 * visual highlight or not. This can slow things down when enabled since
				 * there is a lot of DOM interaction.
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type boolean
				 */
				"bSortClasses": null,

				/**
				 * State saving enablement flag.
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type boolean
				 */
				"bStateSave": null
			},


			/**
			 * Scrolling settings for a table.
			 *  @namespace
			 */
			"oScroll": {
				/**
				 * When the table is shorter in height than sScrollY, collapse the
				 * table container down to the height of the table (when true).
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type boolean
				 */
				"bCollapse": null,

				/**
				 * Width of the scrollbar for the web-browser's platform. Calculated
				 * during table initialisation.
				 *  @type int
				 *  @default 0
				 */
				"iBarWidth": 0,

				/**
				 * Viewport width for horizontal scrolling. Horizontal scrolling is
				 * disabled if an empty string.
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type string
				 */
				"sX": null,

				/**
				 * Width to expand the table to when using x-scrolling. Typically you
				 * should not need to use this.
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type string
				 *  @deprecated
				 */
				"sXInner": null,

				/**
				 * Viewport height for vertical scrolling. Vertical scrolling is disabled
				 * if an empty string.
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type string
				 */
				"sY": null
			},

			/**
			 * Language information for the table.
			 *  @namespace
			 *  @extends DataTable.defaults.oLanguage
			 */
			"oLanguage": {
				/**
				 * Information callback function. See
				 * {@link DataTable.defaults.fnInfoCallback}
				 *  @type function
				 *  @default null
				 */
				"fnInfoCallback": null
			},

			/**
			 * Browser support parameters
			 *  @namespace
			 */
			"oBrowser": {
				/**
				 * Indicate if the browser incorrectly calculates width:100% inside a
				 * scrolling element (IE6/7)
				 *  @type boolean
				 *  @default false
				 */
				"bScrollOversize": false,

				/**
				 * Determine if the vertical scrollbar is on the right or left of the
				 * scrolling container - needed for rtl language layout, although not
				 * all browsers move the scrollbar (Safari).
				 *  @type boolean
				 *  @default false
				 */
				"bScrollbarLeft": false,

				/**
				 * Flag for if `getBoundingClientRect` is fully supported or not
				 *  @type boolean
				 *  @default false
				 */
				"bBounding": false,

				/**
				 * Browser scrollbar width
				 *  @type integer
				 *  @default 0
				 */
				"barWidth": 0
			},


			"ajax": null,


			/**
			 * Array referencing the nodes which are used for the features. The
			 * parameters of this object match what is allowed by sDom - i.e.
			 *   <ul>
			 *     <li>'l' - Length changing</li>
			 *     <li>'f' - Filtering input</li>
			 *     <li>'t' - The table!</li>
			 *     <li>'i' - Information</li>
			 *     <li>'p' - Pagination</li>
			 *     <li>'r' - pRocessing</li>
			 *   </ul>
			 *  @type array
			 *  @default []
			 */
			"aanFeatures": [],

			/**
			 * Store data information - see {@link DataTable.models.oRow} for detailed
			 * information.
			 *  @type array
			 *  @default []
			 */
			"aoData": [],

			/**
			 * Array of indexes which are in the current display (after filtering etc)
			 *  @type array
			 *  @default []
			 */
			"aiDisplay": [],

			/**
			 * Array of indexes for display - no filtering
			 *  @type array
			 *  @default []
			 */
			"aiDisplayMaster": [],

			/**
			 * Map of row ids to data indexes
			 *  @type object
			 *  @default {}
			 */
			"aIds": {},

			/**
			 * Store information about each column that is in use
			 *  @type array
			 *  @default []
			 */
			"aoColumns": [],

			/**
			 * Store information about the table's header
			 *  @type array
			 *  @default []
			 */
			"aoHeader": [],

			/**
			 * Store information about the table's footer
			 *  @type array
			 *  @default []
			 */
			"aoFooter": [],

			/**
			 * Store the applied global search information in case we want to force a
			 * research or compare the old search to a new one.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @namespace
			 *  @extends DataTable.models.oSearch
			 */
			"oPreviousSearch": {},

			/**
			 * Store the applied search for each column - see
			 * {@link DataTable.models.oSearch} for the format that is used for the
			 * filtering information for each column.
			 *  @type array
			 *  @default []
			 */
			"aoPreSearchCols": [],

			/**
			 * Sorting that is applied to the table. Note that the inner arrays are
			 * used in the following manner:
			 * <ul>
			 *   <li>Index 0 - column number</li>
			 *   <li>Index 1 - current sorting direction</li>
			 * </ul>
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type array
			 *  @todo These inner arrays should really be objects
			 */
			"aaSorting": null,

			/**
			 * Sorting that is always applied to the table (i.e. prefixed in front of
			 * aaSorting).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type array
			 *  @default []
			 */
			"aaSortingFixed": [],

			/**
			 * Classes to use for the striping of a table.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type array
			 *  @default []
			 */
			"asStripeClasses": null,

			/**
			 * If restoring a table - we should restore its striping classes as well
			 *  @type array
			 *  @default []
			 */
			"asDestroyStripes": [],

			/**
			 * If restoring a table - we should restore its width
			 *  @type int
			 *  @default 0
			 */
			"sDestroyWidth": 0,

			/**
			 * Callback functions array for every time a row is inserted (i.e. on a draw).
			 *  @type array
			 *  @default []
			 */
			"aoRowCallback": [],

			/**
			 * Callback functions for the header on each draw.
			 *  @type array
			 *  @default []
			 */
			"aoHeaderCallback": [],

			/**
			 * Callback function for the footer on each draw.
			 *  @type array
			 *  @default []
			 */
			"aoFooterCallback": [],

			/**
			 * Array of callback functions for draw callback functions
			 *  @type array
			 *  @default []
			 */
			"aoDrawCallback": [],

			/**
			 * Array of callback functions for row created function
			 *  @type array
			 *  @default []
			 */
			"aoRowCreatedCallback": [],

			/**
			 * Callback functions for just before the table is redrawn. A return of
			 * false will be used to cancel the draw.
			 *  @type array
			 *  @default []
			 */
			"aoPreDrawCallback": [],

			/**
			 * Callback functions for when the table has been initialised.
			 *  @type array
			 *  @default []
			 */
			"aoInitComplete": [],


			/**
			 * Callbacks for modifying the settings to be stored for state saving, prior to
			 * saving state.
			 *  @type array
			 *  @default []
			 */
			"aoStateSaveParams": [],

			/**
			 * Callbacks for modifying the settings that have been stored for state saving
			 * prior to using the stored values to restore the state.
			 *  @type array
			 *  @default []
			 */
			"aoStateLoadParams": [],

			/**
			 * Callbacks for operating on the settings object once the saved state has been
			 * loaded
			 *  @type array
			 *  @default []
			 */
			"aoStateLoaded": [],

			/**
			 * Cache the table ID for quick access
			 *  @type string
			 *  @default <i>Empty string</i>
			 */
			"sTableId": "",

			/**
			 * The TABLE node for the main table
			 *  @type node
			 *  @default null
			 */
			"nTable": null,

			/**
			 * Permanent ref to the thead element
			 *  @type node
			 *  @default null
			 */
			"nTHead": null,

			/**
			 * Permanent ref to the tfoot element - if it exists
			 *  @type node
			 *  @default null
			 */
			"nTFoot": null,

			/**
			 * Permanent ref to the tbody element
			 *  @type node
			 *  @default null
			 */
			"nTBody": null,

			/**
			 * Cache the wrapper node (contains all DataTables controlled elements)
			 *  @type node
			 *  @default null
			 */
			"nTableWrapper": null,

			/**
			 * Indicate if when using server-side processing the loading of data
			 * should be deferred until the second draw.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 *  @default false
			 */
			"bDeferLoading": false,

			/**
			 * Indicate if all required information has been read in
			 *  @type boolean
			 *  @default false
			 */
			"bInitialised": false,

			/**
			 * Information about open rows. Each object in the array has the parameters
			 * 'nTr' and 'nParent'
			 *  @type array
			 *  @default []
			 */
			"aoOpenRows": [],

			/**
			 * Dictate the positioning of DataTables' control elements - see
			 * {@link DataTable.model.oInit.sDom}.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 *  @default null
			 */
			"sDom": null,

			/**
			 * Search delay (in mS)
			 *  @type integer
			 *  @default null
			 */
			"searchDelay": null,

			/**
			 * Which type of pagination should be used.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 *  @default two_button
			 */
			"sPaginationType": "two_button",

			/**
			 * The state duration (for `stateSave`) in seconds.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type int
			 *  @default 0
			 */
			"iStateDuration": 0,

			/**
			 * Array of callback functions for state saving. Each array element is an
			 * object with the following parameters:
			 *   <ul>
			 *     <li>function:fn - function to call. Takes two parameters, oSettings
			 *       and the JSON string to save that has been thus far created. Returns
			 *       a JSON string to be inserted into a json object
			 *       (i.e. '"param": [ 0, 1, 2]')</li>
			 *     <li>string:sName - name of callback</li>
			 *   </ul>
			 *  @type array
			 *  @default []
			 */
			"aoStateSave": [],

			/**
			 * Array of callback functions for state loading. Each array element is an
			 * object with the following parameters:
			 *   <ul>
			 *     <li>function:fn - function to call. Takes two parameters, oSettings
			 *       and the object stored. May return false to cancel state loading</li>
			 *     <li>string:sName - name of callback</li>
			 *   </ul>
			 *  @type array
			 *  @default []
			 */
			"aoStateLoad": [],

			/**
			 * State that was saved. Useful for back reference
			 *  @type object
			 *  @default null
			 */
			"oSavedState": null,

			/**
			 * State that was loaded. Useful for back reference
			 *  @type object
			 *  @default null
			 */
			"oLoadedState": null,

			/**
			 * Source url for AJAX data for the table.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 *  @default null
			 */
			"sAjaxSource": null,

			/**
			 * Property from a given object from which to read the table data from. This
			 * can be an empty string (when not server-side processing), in which case
			 * it is  assumed an an array is given directly.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sAjaxDataProp": null,

			/**
			 * The last jQuery XHR object that was used for server-side data gathering.
			 * This can be used for working with the XHR information in one of the
			 * callbacks
			 *  @type object
			 *  @default null
			 */
			"jqXHR": null,

			/**
			 * JSON returned from the server in the last Ajax request
			 *  @type object
			 *  @default undefined
			 */
			"json": undefined,

			/**
			 * Data submitted as part of the last Ajax request
			 *  @type object
			 *  @default undefined
			 */
			"oAjaxData": undefined,

			/**
			 * Function to get the server-side data.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type function
			 */
			"fnServerData": null,

			/**
			 * Functions which are called prior to sending an Ajax request so extra
			 * parameters can easily be sent to the server
			 *  @type array
			 *  @default []
			 */
			"aoServerParams": [],

			/**
			 * Send the XHR HTTP method - GET or POST (could be PUT or DELETE if
			 * required).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sServerMethod": null,

			/**
			 * Format numbers for display.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type function
			 */
			"fnFormatNumber": null,

			/**
			 * List of options that can be used for the user selectable length menu.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type array
			 *  @default []
			 */
			"aLengthMenu": null,

			/**
			 * Counter for the draws that the table does. Also used as a tracker for
			 * server-side processing
			 *  @type int
			 *  @default 0
			 */
			"iDraw": 0,

			/**
			 * Indicate if a redraw is being done - useful for Ajax
			 *  @type boolean
			 *  @default false
			 */
			"bDrawing": false,

			/**
			 * Draw index (iDraw) of the last error when parsing the returned data
			 *  @type int
			 *  @default -1
			 */
			"iDrawError": -1,

			/**
			 * Paging display length
			 *  @type int
			 *  @default 10
			 */
			"_iDisplayLength": 10,

			/**
			 * Paging start point - aiDisplay index
			 *  @type int
			 *  @default 0
			 */
			"_iDisplayStart": 0,

			/**
			 * Server-side processing - number of records in the result set
			 * (i.e. before filtering), Use fnRecordsTotal rather than
			 * this property to get the value of the number of records, regardless of
			 * the server-side processing setting.
			 *  @type int
			 *  @default 0
			 *  @private
			 */
			"_iRecordsTotal": 0,

			/**
			 * Server-side processing - number of records in the current display set
			 * (i.e. after filtering). Use fnRecordsDisplay rather than
			 * this property to get the value of the number of records, regardless of
			 * the server-side processing setting.
			 *  @type boolean
			 *  @default 0
			 *  @private
			 */
			"_iRecordsDisplay": 0,

			/**
			 * The classes to use for the table
			 *  @type object
			 *  @default {}
			 */
			"oClasses": {},

			/**
			 * Flag attached to the settings object so you can check in the draw
			 * callback if filtering has been done in the draw. Deprecated in favour of
			 * events.
			 *  @type boolean
			 *  @default false
			 *  @deprecated
			 */
			"bFiltered": false,

			/**
			 * Flag attached to the settings object so you can check in the draw
			 * callback if sorting has been done in the draw. Deprecated in favour of
			 * events.
			 *  @type boolean
			 *  @default false
			 *  @deprecated
			 */
			"bSorted": false,

			/**
			 * Indicate that if multiple rows are in the header and there is more than
			 * one unique cell per column, if the top one (true) or bottom one (false)
			 * should be used for sorting / title by DataTables.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortCellsTop": null,

			/**
			 * Initialisation object that is used for the table
			 *  @type object
			 *  @default null
			 */
			"oInit": null,

			/**
			 * Destroy callback functions - for plug-ins to attach themselves to the
			 * destroy so they can clean up markup and events.
			 *  @type array
			 *  @default []
			 */
			"aoDestroyCallback": [],


			/**
			 * Get the number of records in the current record set, before filtering
			 *  @type function
			 */
			"fnRecordsTotal": function () {
				return _fnDataSource(this) == 'ssp' ?
					this._iRecordsTotal * 1 :
					this.aiDisplayMaster.length;
			},

			/**
			 * Get the number of records in the current record set, after filtering
			 *  @type function
			 */
			"fnRecordsDisplay": function () {
				return _fnDataSource(this) == 'ssp' ?
					this._iRecordsDisplay * 1 :
					this.aiDisplay.length;
			},

			/**
			 * Get the display end point - aiDisplay index
			 *  @type function
			 */
			"fnDisplayEnd": function () {
				var
					len = this._iDisplayLength,
					start = this._iDisplayStart,
					calc = start + len,
					records = this.aiDisplay.length,
					features = this.oFeatures,
					paginate = features.bPaginate;

				if (features.bServerSide) {
					return paginate === false || len === -1 ?
						start + records :
						Math.min(start + len, this._iRecordsDisplay);
				}
				else {
					return !paginate || calc > records || len === -1 ?
						records :
						calc;
				}
			},

			/**
			 * The DataTables object for this table
			 *  @type object
			 *  @default null
			 */
			"oInstance": null,

			/**
			 * Unique identifier for each instance of the DataTables object. If there
			 * is an ID on the table node, then it takes that value, otherwise an
			 * incrementing internal counter is used.
			 *  @type string
			 *  @default null
			 */
			"sInstance": null,

			/**
			 * tabindex attribute value that is added to DataTables control elements, allowing
			 * keyboard navigation of the table and its controls.
			 */
			"iTabIndex": 0,

			/**
			 * DIV container for the footer scrolling table if scrolling
			 */
			"nScrollHead": null,

			/**
			 * DIV container for the footer scrolling table if scrolling
			 */
			"nScrollFoot": null,

			/**
			 * Last applied sort
			 *  @type array
			 *  @default []
			 */
			"aLastSort": [],

			/**
			 * Stored plug-in instances
			 *  @type object
			 *  @default {}
			 */
			"oPlugins": {},

			/**
			 * Function used to get a row's id from the row's data
			 *  @type function
			 *  @default null
			 */
			"rowIdFn": null,

			/**
			 * Data location where to store a row's id
			 *  @type string
			 *  @default null
			 */
			"rowId": null
		};

		/**
		 * Extension object for DataTables that is used to provide all extension
		 * options.
		 *
		 * Note that the `DataTable.ext` object is available through
		 * `jQuery.fn.dataTable.ext` where it may be accessed and manipulated. It is
		 * also aliased to `jQuery.fn.dataTableExt` for historic reasons.
		 *  @namespace
		 *  @extends DataTable.models.ext
		 */


		/**
		 * DataTables extensions
		 * 
		 * This namespace acts as a collection area for plug-ins that can be used to
		 * extend DataTables capabilities. Indeed many of the build in methods
		 * use this method to provide their own capabilities (sorting methods for
		 * example).
		 *
		 * Note that this namespace is aliased to `jQuery.fn.dataTableExt` for legacy
		 * reasons
		 *
		 *  @namespace
		 */
		DataTable.ext = _ext = {
			/**
			 * Buttons. For use with the Buttons extension for DataTables. This is
			 * defined here so other extensions can define buttons regardless of load
			 * order. It is _not_ used by DataTables core.
			 *
			 *  @type object
			 *  @default {}
			 */
			buttons: {},


			/**
			 * Element class names
			 *
			 *  @type object
			 *  @default {}
			 */
			classes: {},


			/**
			 * DataTables build type (expanded by the download builder)
			 *
			 *  @type string
			 */
			builder: "-source-",


			/**
			 * Error reporting.
			 * 
			 * How should DataTables report an error. Can take the value 'alert',
			 * 'throw', 'none' or a function.
			 *
			 *  @type string|function
			 *  @default alert
			 */
			errMode: "alert",


			/**
			 * Feature plug-ins.
			 * 
			 * This is an array of objects which describe the feature plug-ins that are
			 * available to DataTables. These feature plug-ins are then available for
			 * use through the `dom` initialisation option.
			 * 
			 * Each feature plug-in is described by an object which must have the
			 * following properties:
			 * 
			 * * `fnInit` - function that is used to initialise the plug-in,
			 * * `cFeature` - a character so the feature can be enabled by the `dom`
			 *   instillation option. This is case sensitive.
			 *
			 * The `fnInit` function has the following input parameters:
			 *
			 * 1. `{object}` DataTables settings object: see
			 *    {@link DataTable.models.oSettings}
			 *
			 * And the following return is expected:
			 * 
			 * * {node|null} The element which contains your feature. Note that the
			 *   return may also be void if your plug-in does not require to inject any
			 *   DOM elements into DataTables control (`dom`) - for example this might
			 *   be useful when developing a plug-in which allows table control via
			 *   keyboard entry
			 *
			 *  @type array
			 *
			 *  @example
			 *    $.fn.dataTable.ext.features.push( {
			 *      "fnInit": function( oSettings ) {
			 *        return new TableTools( { "oDTSettings": oSettings } );
			 *      },
			 *      "cFeature": "T"
			 *    } );
			 */
			feature: [],


			/**
			 * Row searching.
			 * 
			 * This method of searching is complimentary to the default type based
			 * searching, and a lot more comprehensive as it allows you complete control
			 * over the searching logic. Each element in this array is a function
			 * (parameters described below) that is called for every row in the table,
			 * and your logic decides if it should be included in the searching data set
			 * or not.
			 *
			 * Searching functions have the following input parameters:
			 *
			 * 1. `{object}` DataTables settings object: see
			 *    {@link DataTable.models.oSettings}
			 * 2. `{array|object}` Data for the row to be processed (same as the
			 *    original format that was passed in as the data source, or an array
			 *    from a DOM data source
			 * 3. `{int}` Row index ({@link DataTable.models.oSettings.aoData}), which
			 *    can be useful to retrieve the `TR` element if you need DOM interaction.
			 *
			 * And the following return is expected:
			 *
			 * * {boolean} Include the row in the searched result set (true) or not
			 *   (false)
			 *
			 * Note that as with the main search ability in DataTables, technically this
			 * is "filtering", since it is subtractive. However, for consistency in
			 * naming we call it searching here.
			 *
			 *  @type array
			 *  @default []
			 *
			 *  @example
			 *    // The following example shows custom search being applied to the
			 *    // fourth column (i.e. the data[3] index) based on two input values
			 *    // from the end-user, matching the data in a certain range.
			 *    $.fn.dataTable.ext.search.push(
			 *      function( settings, data, dataIndex ) {
			 *        var min = document.getElementById('min').value * 1;
			 *        var max = document.getElementById('max').value * 1;
			 *        var version = data[3] == "-" ? 0 : data[3]*1;
			 *
			 *        if ( min == "" && max == "" ) {
			 *          return true;
			 *        }
			 *        else if ( min == "" && version < max ) {
			 *          return true;
			 *        }
			 *        else if ( min < version && "" == max ) {
			 *          return true;
			 *        }
			 *        else if ( min < version && version < max ) {
			 *          return true;
			 *        }
			 *        return false;
			 *      }
			 *    );
			 */
			search: [],


			/**
			 * Selector extensions
			 *
			 * The `selector` option can be used to extend the options available for the
			 * selector modifier options (`selector-modifier` object data type) that
			 * each of the three built in selector types offer (row, column and cell +
			 * their plural counterparts). For example the Select extension uses this
			 * mechanism to provide an option to select only rows, columns and cells
			 * that have been marked as selected by the end user (`{selected: true}`),
			 * which can be used in conjunction with the existing built in selector
			 * options.
			 *
			 * Each property is an array to which functions can be pushed. The functions
			 * take three attributes:
			 *
			 * * Settings object for the host table
			 * * Options object (`selector-modifier` object type)
			 * * Array of selected item indexes
			 *
			 * The return is an array of the resulting item indexes after the custom
			 * selector has been applied.
			 *
			 *  @type object
			 */
			selector: {
				cell: [],
				column: [],
				row: []
			},


			/**
			 * Internal functions, exposed for used in plug-ins.
			 * 
			 * Please note that you should not need to use the internal methods for
			 * anything other than a plug-in (and even then, try to avoid if possible).
			 * The internal function may change between releases.
			 *
			 *  @type object
			 *  @default {}
			 */
			internal: {},


			/**
			 * Legacy configuration options. Enable and disable legacy options that
			 * are available in DataTables.
			 *
			 *  @type object
			 */
			legacy: {
				/**
				 * Enable / disable DataTables 1.9 compatible server-side processing
				 * requests
				 *
				 *  @type boolean
				 *  @default null
				 */
				ajax: null
			},


			/**
			 * Pagination plug-in methods.
			 * 
			 * Each entry in this object is a function and defines which buttons should
			 * be shown by the pagination rendering method that is used for the table:
			 * {@link DataTable.ext.renderer.pageButton}. The renderer addresses how the
			 * buttons are displayed in the document, while the functions here tell it
			 * what buttons to display. This is done by returning an array of button
			 * descriptions (what each button will do).
			 *
			 * Pagination types (the four built in options and any additional plug-in
			 * options defined here) can be used through the `paginationType`
			 * initialisation parameter.
			 *
			 * The functions defined take two parameters:
			 *
			 * 1. `{int} page` The current page index
			 * 2. `{int} pages` The number of pages in the table
			 *
			 * Each function is expected to return an array where each element of the
			 * array can be one of:
			 *
			 * * `first` - Jump to first page when activated
			 * * `last` - Jump to last page when activated
			 * * `previous` - Show previous page when activated
			 * * `next` - Show next page when activated
			 * * `{int}` - Show page of the index given
			 * * `{array}` - A nested array containing the above elements to add a
			 *   containing 'DIV' element (might be useful for styling).
			 *
			 * Note that DataTables v1.9- used this object slightly differently whereby
			 * an object with two functions would be defined for each plug-in. That
			 * ability is still supported by DataTables 1.10+ to provide backwards
			 * compatibility, but this option of use is now decremented and no longer
			 * documented in DataTables 1.10+.
			 *
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    // Show previous, next and current page buttons only
			 *    $.fn.dataTableExt.oPagination.current = function ( page, pages ) {
			 *      return [ 'previous', page, 'next' ];
			 *    };
			 */
			pager: {},


			renderer: {
				pageButton: {},
				header: {}
			},


			/**
			 * Ordering plug-ins - custom data source
			 * 
			 * The extension options for ordering of data available here is complimentary
			 * to the default type based ordering that DataTables typically uses. It
			 * allows much greater control over the the data that is being used to
			 * order a column, but is necessarily therefore more complex.
			 * 
			 * This type of ordering is useful if you want to do ordering based on data
			 * live from the DOM (for example the contents of an 'input' element) rather
			 * than just the static string that DataTables knows of.
			 * 
			 * The way these plug-ins work is that you create an array of the values you
			 * wish to be ordering for the column in question and then return that
			 * array. The data in the array much be in the index order of the rows in
			 * the table (not the currently ordering order!). Which order data gathering
			 * function is run here depends on the `dt-init columns.orderDataType`
			 * parameter that is used for the column (if any).
			 *
			 * The functions defined take two parameters:
			 *
			 * 1. `{object}` DataTables settings object: see
			 *    {@link DataTable.models.oSettings}
			 * 2. `{int}` Target column index
			 *
			 * Each function is expected to return an array:
			 *
			 * * `{array}` Data for the column to be ordering upon
			 *
			 *  @type array
			 *
			 *  @example
			 *    // Ordering using `input` node values
			 *    $.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
			 *    {
			 *      return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
			 *        return $('input', td).val();
			 *      } );
			 *    }
			 */
			order: {},


			/**
			 * Type based plug-ins.
			 *
			 * Each column in DataTables has a type assigned to it, either by automatic
			 * detection or by direct assignment using the `type` option for the column.
			 * The type of a column will effect how it is ordering and search (plug-ins
			 * can also make use of the column type if required).
			 *
			 * @namespace
			 */
			type: {
				/**
				 * Type detection functions.
				 *
				 * The functions defined in this object are used to automatically detect
				 * a column's type, making initialisation of DataTables super easy, even
				 * when complex data is in the table.
				 *
				 * The functions defined take two parameters:
				 *
				 *  1. `{*}` Data from the column cell to be analysed
				 *  2. `{settings}` DataTables settings object. This can be used to
				 *     perform context specific type detection - for example detection
				 *     based on language settings such as using a comma for a decimal
				 *     place. Generally speaking the options from the settings will not
				 *     be required
				 *
				 * Each function is expected to return:
				 *
				 * * `{string|null}` Data type detected, or null if unknown (and thus
				 *   pass it on to the other type detection functions.
				 *
				 *  @type array
				 *
				 *  @example
				 *    // Currency type detection plug-in:
				 *    $.fn.dataTable.ext.type.detect.push(
				 *      function ( data, settings ) {
				 *        // Check the numeric part
				 *        if ( ! data.substring(1).match(/[0-9]/) ) {
				 *          return null;
				 *        }
				 *
				 *        // Check prefixed by currency
				 *        if ( data.charAt(0) == '$' || data.charAt(0) == '&pound;' ) {
				 *          return 'currency';
				 *        }
				 *        return null;
				 *      }
				 *    );
				 */
				detect: [],


				/**
				 * Type based search formatting.
				 *
				 * The type based searching functions can be used to pre-format the
				 * data to be search on. For example, it can be used to strip HTML
				 * tags or to de-format telephone numbers for numeric only searching.
				 *
				 * Note that is a search is not defined for a column of a given type,
				 * no search formatting will be performed.
				 * 
				 * Pre-processing of searching data plug-ins - When you assign the sType
				 * for a column (or have it automatically detected for you by DataTables
				 * or a type detection plug-in), you will typically be using this for
				 * custom sorting, but it can also be used to provide custom searching
				 * by allowing you to pre-processing the data and returning the data in
				 * the format that should be searched upon. This is done by adding
				 * functions this object with a parameter name which matches the sType
				 * for that target column. This is the corollary of <i>afnSortData</i>
				 * for searching data.
				 *
				 * The functions defined take a single parameter:
				 *
				 *  1. `{*}` Data from the column cell to be prepared for searching
				 *
				 * Each function is expected to return:
				 *
				 * * `{string|null}` Formatted string that will be used for the searching.
				 *
				 *  @type object
				 *  @default {}
				 *
				 *  @example
				 *    $.fn.dataTable.ext.type.search['title-numeric'] = function ( d ) {
				 *      return d.replace(/\n/g," ").replace( /<.*?>/g, "" );
				 *    }
				 */
				search: {},


				/**
				 * Type based ordering.
				 *
				 * The column type tells DataTables what ordering to apply to the table
				 * when a column is sorted upon. The order for each type that is defined,
				 * is defined by the functions available in this object.
				 *
				 * Each ordering option can be described by three properties added to
				 * this object:
				 *
				 * * `{type}-pre` - Pre-formatting function
				 * * `{type}-asc` - Ascending order function
				 * * `{type}-desc` - Descending order function
				 *
				 * All three can be used together, only `{type}-pre` or only
				 * `{type}-asc` and `{type}-desc` together. It is generally recommended
				 * that only `{type}-pre` is used, as this provides the optimal
				 * implementation in terms of speed, although the others are provided
				 * for compatibility with existing Javascript sort functions.
				 *
				 * `{type}-pre`: Functions defined take a single parameter:
				 *
				 *  1. `{*}` Data from the column cell to be prepared for ordering
				 *
				 * And return:
				 *
				 * * `{*}` Data to be sorted upon
				 *
				 * `{type}-asc` and `{type}-desc`: Functions are typical Javascript sort
				 * functions, taking two parameters:
				 *
				 *  1. `{*}` Data to compare to the second parameter
				 *  2. `{*}` Data to compare to the first parameter
				 *
				 * And returning:
				 *
				 * * `{*}` Ordering match: <0 if first parameter should be sorted lower
				 *   than the second parameter, ===0 if the two parameters are equal and
				 *   >0 if the first parameter should be sorted height than the second
				 *   parameter.
				 * 
				 *  @type object
				 *  @default {}
				 *
				 *  @example
				 *    // Numeric ordering of formatted numbers with a pre-formatter
				 *    $.extend( $.fn.dataTable.ext.type.order, {
				 *      "string-pre": function(x) {
				 *        a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );
				 *        return parseFloat( a );
				 *      }
				 *    } );
				 *
				 *  @example
				 *    // Case-sensitive string ordering, with no pre-formatting method
				 *    $.extend( $.fn.dataTable.ext.order, {
				 *      "string-case-asc": function(x,y) {
				 *        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
				 *      },
				 *      "string-case-desc": function(x,y) {
				 *        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
				 *      }
				 *    } );
				 */
				order: {}
			},

			/**
			 * Unique DataTables instance counter
			 *
			 * @type int
			 * @private
			 */
			_unique: 0,


			//
			// Depreciated
			// The following properties are retained for backwards compatibility only.
			// The should not be used in new projects and will be removed in a future
			// version
			//

			/**
			 * Version check function.
			 *  @type function
			 *  @depreciated Since 1.10
			 */
			fnVersionCheck: DataTable.fnVersionCheck,


			/**
			 * Index for what 'this' index API functions should use
			 *  @type int
			 *  @deprecated Since v1.10
			 */
			iApiIndex: 0,


			/**
			 * jQuery UI class container
			 *  @type object
			 *  @deprecated Since v1.10
			 */
			oJUIClasses: {},


			/**
			 * Software version
			 *  @type string
			 *  @deprecated Since v1.10
			 */
			sVersion: DataTable.version
		};


		//
		// Backwards compatibility. Alias to pre 1.10 Hungarian notation counter parts
		//
		$.extend(_ext, {
			afnFiltering: _ext.search,
			aTypes: _ext.type.detect,
			ofnSearch: _ext.type.search,
			oSort: _ext.type.order,
			afnSortData: _ext.order,
			aoFeatures: _ext.feature,
			oApi: _ext.internal,
			oStdClasses: _ext.classes,
			oPagination: _ext.pager
		});


		$.extend(DataTable.ext.classes, {
			"sTable": "dataTable",
			"sNoFooter": "no-footer",

			/* Paging buttons */
			"sPageButton": "paginate_button",
			"sPageButtonActive": "current",
			"sPageButtonDisabled": "disabled",

			/* Striping classes */
			"sStripeOdd": "odd",
			"sStripeEven": "even",

			/* Empty row */
			"sRowEmpty": "dataTables_empty",

			/* Features */
			"sWrapper": "dataTables_wrapper",
			"sFilter": "dataTables_filter",
			"sInfo": "dataTables_info",
			"sPaging": "dataTables_paginate paging_", /* Note that the type is postfixed */
			"sLength": "dataTables_length",
			"sProcessing": "dataTables_processing",

			/* Sorting */
			"sSortAsc": "sorting_asc",
			"sSortDesc": "sorting_desc",
			"sSortable": "sorting", /* Sortable in both directions */
			"sSortableAsc": "sorting_desc_disabled",
			"sSortableDesc": "sorting_asc_disabled",
			"sSortableNone": "sorting_disabled",
			"sSortColumn": "sorting_", /* Note that an int is postfixed for the sorting order */

			/* Filtering */
			"sFilterInput": "",

			/* Page length */
			"sLengthSelect": "",

			/* Scrolling */
			"sScrollWrapper": "dataTables_scroll",
			"sScrollHead": "dataTables_scrollHead",
			"sScrollHeadInner": "dataTables_scrollHeadInner",
			"sScrollBody": "dataTables_scrollBody",
			"sScrollFoot": "dataTables_scrollFoot",
			"sScrollFootInner": "dataTables_scrollFootInner",

			/* Misc */
			"sHeaderTH": "",
			"sFooterTH": "",

			// Deprecated
			"sSortJUIAsc": "",
			"sSortJUIDesc": "",
			"sSortJUI": "",
			"sSortJUIAscAllowed": "",
			"sSortJUIDescAllowed": "",
			"sSortJUIWrapper": "",
			"sSortIcon": "",
			"sJUIHeader": "",
			"sJUIFooter": ""
		});


		var extPagination = DataTable.ext.pager;

		function _numbers(page, pages) {
			var
				numbers = [],
				buttons = extPagination.numbers_length,
				half = Math.floor(buttons / 2),
				i = 1;

			if (pages <= buttons) {
				numbers = _range(0, pages);
			}
			else if (page <= half) {
				numbers = _range(0, buttons - 2);
				numbers.push('ellipsis');
				numbers.push(pages - 1);
			}
			else if (page >= pages - 1 - half) {
				numbers = _range(pages - (buttons - 2), pages);
				numbers.splice(0, 0, 'ellipsis'); // no unshift in ie6
				numbers.splice(0, 0, 0);
			}
			else {
				numbers = _range(page - half + 2, page + half - 1);
				numbers.push('ellipsis');
				numbers.push(pages - 1);
				numbers.splice(0, 0, 'ellipsis');
				numbers.splice(0, 0, 0);
			}

			numbers.DT_el = 'span';
			return numbers;
		}


		$.extend(extPagination, {
			simple: function (page, pages) {
				return ['previous', 'next'];
			},

			full: function (page, pages) {
				return ['first', 'previous', 'next', 'last'];
			},

			numbers: function (page, pages) {
				return [_numbers(page, pages)];
			},

			simple_numbers: function (page, pages) {
				return ['previous', _numbers(page, pages), 'next'];
			},

			full_numbers: function (page, pages) {
				return ['first', 'previous', _numbers(page, pages), 'next', 'last'];
			},

			first_last_numbers: function (page, pages) {
				return ['first', _numbers(page, pages), 'last'];
			},

			// For testing and plug-ins to use
			_numbers: _numbers,

			// Number of number buttons (including ellipsis) to show. _Must be odd!_
			numbers_length: 7
		});


		$.extend(true, DataTable.ext.renderer, {
			pageButton: {
				_: function (settings, host, idx, buttons, page, pages) {
					var classes = settings.oClasses;
					var lang = settings.oLanguage.oPaginate;
					var aria = settings.oLanguage.oAria.paginate || {};
					var btnDisplay, btnClass;

					var attach = function (container, buttons) {
						var i, ien, node, button, tabIndex;
						var disabledClass = classes.sPageButtonDisabled;
						var clickHandler = function (e) {
							_fnPageChange(settings, e.data.action, true);
						};

						for (i = 0, ien = buttons.length; i < ien; i++) {
							button = buttons[i];

							if (Array.isArray(button)) {
								var inner = $('<' + (button.DT_el || 'div') + '/>')
									.appendTo(container);
								attach(inner, button);
							}
							else {
								btnDisplay = null;
								btnClass = button;
								tabIndex = settings.iTabIndex;

								switch (button) {
									case 'ellipsis':
										container.append('<span class="ellipsis">&#x2026;</span>');
										break;

									case 'first':
										btnDisplay = lang.sFirst;

										if (page === 0) {
											tabIndex = -1;
											btnClass += ' ' + disabledClass;
										}
										break;

									case 'previous':
										btnDisplay = lang.sPrevious;

										if (page === 0) {
											tabIndex = -1;
											btnClass += ' ' + disabledClass;
										}
										break;

									case 'next':
										btnDisplay = lang.sNext;

										if (pages === 0 || page === pages - 1) {
											tabIndex = -1;
											btnClass += ' ' + disabledClass;
										}
										break;

									case 'last':
										btnDisplay = lang.sLast;

										if (pages === 0 || page === pages - 1) {
											tabIndex = -1;
											btnClass += ' ' + disabledClass;
										}
										break;

									default:
										btnDisplay = settings.fnFormatNumber(button + 1);
										btnClass = page === button ?
											classes.sPageButtonActive : '';
										break;
								}

								if (btnDisplay !== null) {
									node = $('<a>', {
										'class': classes.sPageButton + ' ' + btnClass,
										'aria-controls': settings.sTableId,
										'aria-label': aria[button],
										'data-dt-idx': button,
										'tabindex': tabIndex,
										'id': idx === 0 && typeof button === 'string' ?
											settings.sTableId + '_' + button :
											null
									})
										.html(btnDisplay)
										.appendTo(container);

									_fnBindAction(
										node, { action: button }, clickHandler
									);
								}
							}
						}
					};

					// IE9 throws an 'unknown error' if document.activeElement is used
					// inside an iframe or frame. Try / catch the error. Not good for
					// accessibility, but neither are frames.
					var activeEl;

					try {
						// Because this approach is destroying and recreating the paging
						// elements, focus is lost on the select button which is bad for
						// accessibility. So we want to restore focus once the draw has
						// completed
						activeEl = $(host).find(document.activeElement).data('dt-idx');
					}
					catch (e) { }

					attach($(host).empty(), buttons);

					if (activeEl !== undefined) {
						$(host).find('[data-dt-idx=' + activeEl + ']').trigger('focus');
					}
				}
			}
		});



		// Built in type detection. See model.ext.aTypes for information about
		// what is required from this methods.
		$.extend(DataTable.ext.type.detect, [
			// Plain numbers - first since V8 detects some plain numbers as dates
			// e.g. Date.parse('55') (but not all, e.g. Date.parse('22')...).
			function (d, settings) {
				var decimal = settings.oLanguage.sDecimal;
				return _isNumber(d, decimal) ? 'num' + decimal : null;
			},

			// Dates (only those recognised by the browser's Date.parse)
			function (d, settings) {
				// V8 tries _very_ hard to make a string passed into `Date.parse()`
				// valid, so we need to use a regex to restrict date formats. Use a
				// plug-in for anything other than ISO8601 style strings
				if (d && !(d instanceof Date) && !_re_date.test(d)) {
					return null;
				}
				var parsed = Date.parse(d);
				return (parsed !== null && !isNaN(parsed)) || _empty(d) ? 'date' : null;
			},

			// Formatted numbers
			function (d, settings) {
				var decimal = settings.oLanguage.sDecimal;
				return _isNumber(d, decimal, true) ? 'num-fmt' + decimal : null;
			},

			// HTML numeric
			function (d, settings) {
				var decimal = settings.oLanguage.sDecimal;
				return _htmlNumeric(d, decimal) ? 'html-num' + decimal : null;
			},

			// HTML numeric, formatted
			function (d, settings) {
				var decimal = settings.oLanguage.sDecimal;
				return _htmlNumeric(d, decimal, true) ? 'html-num-fmt' + decimal : null;
			},

			// HTML (this is strict checking - there must be html)
			function (d, settings) {
				return _empty(d) || (typeof d === 'string' && d.indexOf('<') !== -1) ?
					'html' : null;
			}
		]);



		// Filter formatting functions. See model.ext.ofnSearch for information about
		// what is required from these methods.
		// 
		// Note that additional search methods are added for the html numbers and
		// html formatted numbers by `_addNumericSort()` when we know what the decimal
		// place is


		$.extend(DataTable.ext.type.search, {
			html: function (data) {
				return _empty(data) ?
					data :
					typeof data === 'string' ?
						data
							.replace(_re_new_lines, " ")
							.replace(_re_html, "") :
						'';
			},

			string: function (data) {
				return _empty(data) ?
					data :
					typeof data === 'string' ?
						data.replace(_re_new_lines, " ") :
						data;
			}
		});



		var __numericReplace = function (d, decimalPlace, re1, re2) {
			if (d !== 0 && (!d || d === '-')) {
				return -Infinity;
			}

			// If a decimal place other than `.` is used, it needs to be given to the
			// function so we can detect it and replace with a `.` which is the only
			// decimal place Javascript recognises - it is not locale aware.
			if (decimalPlace) {
				d = _numToDecimal(d, decimalPlace);
			}

			if (d.replace) {
				if (re1) {
					d = d.replace(re1, '');
				}

				if (re2) {
					d = d.replace(re2, '');
				}
			}

			return d * 1;
		};


		// Add the numeric 'deformatting' functions for sorting and search. This is done
		// in a function to provide an easy ability for the language options to add
		// additional methods if a non-period decimal place is used.
		function _addNumericSort(decimalPlace) {
			$.each(
				{
					// Plain numbers
					"num": function (d) {
						return __numericReplace(d, decimalPlace);
					},

					// Formatted numbers
					"num-fmt": function (d) {
						return __numericReplace(d, decimalPlace, _re_formatted_numeric);
					},

					// HTML numeric
					"html-num": function (d) {
						return __numericReplace(d, decimalPlace, _re_html);
					},

					// HTML numeric, formatted
					"html-num-fmt": function (d) {
						return __numericReplace(d, decimalPlace, _re_html, _re_formatted_numeric);
					}
				},
				function (key, fn) {
					// Add the ordering method
					_ext.type.order[key + decimalPlace + '-pre'] = fn;

					// For HTML types add a search formatter that will strip the HTML
					if (key.match(/^html\-/)) {
						_ext.type.search[key + decimalPlace] = _ext.type.search.html;
					}
				}
			);
		}


		// Default sort methods
		$.extend(_ext.type.order, {
			// Dates
			"date-pre": function (d) {
				var ts = Date.parse(d);
				return isNaN(ts) ? -Infinity : ts;
			},

			// html
			"html-pre": function (a) {
				return _empty(a) ?
					'' :
					a.replace ?
						a.replace(/<.*?>/g, "").toLowerCase() :
						a + '';
			},

			// string
			"string-pre": function (a) {
				// This is a little complex, but faster than always calling toString,
				// http://jsperf.com/tostring-v-check
				return _empty(a) ?
					'' :
					typeof a === 'string' ?
						a.toLowerCase() :
						!a.toString ?
							'' :
							a.toString();
			},

			// string-asc and -desc are retained only for compatibility with the old
			// sort methods
			"string-asc": function (x, y) {
				return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			},

			"string-desc": function (x, y) {
				return ((x < y) ? 1 : ((x > y) ? -1 : 0));
			}
		});


		// Numeric sorting types - order doesn't matter here
		_addNumericSort('');


		$.extend(true, DataTable.ext.renderer, {
			header: {
				_: function (settings, cell, column, classes) {
					// No additional mark-up required
					// Attach a sort listener to update on sort - note that using the
					// `DT` namespace will allow the event to be removed automatically
					// on destroy, while the `dt` namespaced event is the one we are
					// listening for
					$(settings.nTable).on('order.dt.DT', function (e, ctx, sorting, columns) {
						if (settings !== ctx) { // need to check this this is the host
							return;               // table, not a nested one
						}

						var colIdx = column.idx;

						cell
							.removeClass(
								classes.sSortAsc + ' ' +
								classes.sSortDesc
							)
							.addClass(columns[colIdx] == 'asc' ?
								classes.sSortAsc : columns[colIdx] == 'desc' ?
									classes.sSortDesc :
									column.sSortingClass
							);
					});
				},

				jqueryui: function (settings, cell, column, classes) {
					$('<div/>')
						.addClass(classes.sSortJUIWrapper)
						.append(cell.contents())
						.append($('<span/>')
							.addClass(classes.sSortIcon + ' ' + column.sSortingClassJUI)
						)
						.appendTo(cell);

					// Attach a sort listener to update on sort
					$(settings.nTable).on('order.dt.DT', function (e, ctx, sorting, columns) {
						if (settings !== ctx) {
							return;
						}

						var colIdx = column.idx;

						cell
							.removeClass(classes.sSortAsc + " " + classes.sSortDesc)
							.addClass(columns[colIdx] == 'asc' ?
								classes.sSortAsc : columns[colIdx] == 'desc' ?
									classes.sSortDesc :
									column.sSortingClass
							);

						cell
							.find('span.' + classes.sSortIcon)
							.removeClass(
								classes.sSortJUIAsc + " " +
								classes.sSortJUIDesc + " " +
								classes.sSortJUI + " " +
								classes.sSortJUIAscAllowed + " " +
								classes.sSortJUIDescAllowed
							)
							.addClass(columns[colIdx] == 'asc' ?
								classes.sSortJUIAsc : columns[colIdx] == 'desc' ?
									classes.sSortJUIDesc :
									column.sSortingClassJUI
							);
					});
				}
			}
		});

		/*
		 * Public helper functions. These aren't used internally by DataTables, or
		 * called by any of the options passed into DataTables, but they can be used
		 * externally by developers working with DataTables. They are helper functions
		 * to make working with DataTables a little bit easier.
		 */

		var __htmlEscapeEntities = function (d) {
			if (Array.isArray(d)) {
				d = d.join(',');
			}

			return typeof d === 'string' ?
				d
					.replace(/&/g, '&amp;')
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;')
					.replace(/"/g, '&quot;') :
				d;
		};

		// Common logic for moment, luxon or a date action
		function __mld(dt, momentFn, luxonFn, dateFn, arg1) {
			if (window.moment) {
				return dt[momentFn](arg1);
			}
			else if (window.luxon) {
				return dt[luxonFn](arg1);
			}

			return dateFn ? dt[dateFn](arg1) : dt;
		}


		var __mlWarning = false;
		function __mldObj(d, format, locale) {
			var dt;

			if (window.moment) {
				dt = window.moment.utc(d, format, locale, true);

				if (!dt.isValid()) {
					return null;
				}
			}
			else if (window.luxon) {
				dt = format && typeof d === 'string'
					? window.luxon.DateTime.fromFormat(d, format)
					: window.luxon.DateTime.fromISO(d);

				if (!dt.isValid) {
					return null;
				}

				dt.setLocale(locale);
			}
			else if (!format) {
				// No format given, must be ISO
				dt = new Date(d);
			}
			else {
				if (!__mlWarning) {
					alert('DataTables warning: Formatted date without Moment.js or Luxon - https://datatables.net/tn/17');
				}

				__mlWarning = true;
			}

			return dt;
		}

		// Wrapper for date, datetime and time which all operate the same way with the exception of
		// the output string for auto locale support
		function __mlHelper(localeString) {
			return function (from, to, locale, def) {
				// Luxon and Moment support
				// Argument shifting
				if (arguments.length === 0) {
					locale = 'en';
					to = null; // means toLocaleString
					from = null; // means iso8601
				}
				else if (arguments.length === 1) {
					locale = 'en';
					to = from;
					from = null;
				}
				else if (arguments.length === 2) {
					locale = to;
					to = from;
					from = null;
				}

				var typeName = 'datetime-' + to;

				// Add type detection and sorting specific to this date format - we need to be able to identify
				// date type columns as such, rather than as numbers in extensions. Hence the need for this.
				if (!DataTable.ext.type.order[typeName]) {
					// The renderer will give the value to type detect as the type!
					DataTable.ext.type.detect.unshift(function (d) {
						return d === typeName ? typeName : false;
					});

					// The renderer gives us Moment, Luxon or Date obects for the sorting, all of which have a
					// `valueOf` which gives milliseconds epoch
					DataTable.ext.type.order[typeName + '-asc'] = function (a, b) {
						var x = a.valueOf();
						var y = b.valueOf();

						return x === y
							? 0
							: x < y
								? -1
								: 1;
					}

					DataTable.ext.type.order[typeName + '-desc'] = function (a, b) {
						var x = a.valueOf();
						var y = b.valueOf();

						return x === y
							? 0
							: x > y
								? -1
								: 1;
					}
				}

				return function (d, type) {
					// Allow for a default value
					if (d === null || d === undefined) {
						if (def === '--now') {
							// We treat everything as UTC further down, so no changes are
							// made, as such need to get the local date / time as if it were
							// UTC
							var local = new Date();
							d = new Date(Date.UTC(
								local.getFullYear(), local.getMonth(), local.getDate(),
								local.getHours(), local.getMinutes(), local.getSeconds()
							));
						}
						else {
							d = '';
						}
					}

					if (type === 'type') {
						// Typing uses the type name for fast matching
						return typeName;
					}

					if (d === '') {
						return type !== 'sort'
							? ''
							: __mldObj('0000-01-01 00:00:00', null, locale);
					}

					// Shortcut. If `from` and `to` are the same, we are using the renderer to
					// format for ordering, not display - its already in the display format.
					if (to !== null && from === to && type !== 'sort' && type !== 'type' && !(d instanceof Date)) {
						return d;
					}

					var dt = __mldObj(d, from, locale);

					if (dt === null) {
						return d;
					}

					if (type === 'sort') {
						return dt;
					}

					var formatted = to === null
						? __mld(dt, 'toDate', 'toJSDate', '')[localeString]()
						: __mld(dt, 'format', 'toFormat', 'toISOString', to);

					// XSS protection
					return type === 'display' ?
						__htmlEscapeEntities(formatted) :
						formatted;
				};
			}
		}

		// Based on locale, determine standard number formatting
		// Fallback for legacy browsers is US English
		var __thousands = ',';
		var __decimal = '.';

		if (Intl) {
			try {
				var num = new Intl.NumberFormat().formatToParts(100000.1);

				for (var i = 0; i < num.length; i++) {
					if (num[i].type === 'group') {
						__thousands = num[i].value;
					}
					else if (num[i].type === 'decimal') {
						__decimal = num[i].value;
					}
				}
			}
			catch (e) {
				// noop
			}
		}

		// Formatted date time detection - use by declaring the formats you are going to use
		DataTable.datetime = function (format, locale) {
			var typeName = 'datetime-detect-' + format;

			if (!locale) {
				locale = 'en';
			}

			if (!DataTable.ext.type.order[typeName]) {
				DataTable.ext.type.detect.unshift(function (d) {
					var dt = __mldObj(d, format, locale);
					return d === '' || dt ? typeName : false;
				});

				DataTable.ext.type.order[typeName + '-pre'] = function (d) {
					return __mldObj(d, format, locale) || 0;
				}
			}
		}

		/**
		 * Helpers for `columns.render`.
		 *
		 * The options defined here can be used with the `columns.render` initialisation
		 * option to provide a display renderer. The following functions are defined:
		 *
		 * * `number` - Will format numeric data (defined by `columns.data`) for
		 *   display, retaining the original unformatted data for sorting and filtering.
		 *   It takes 5 parameters:
		 *   * `string` - Thousands grouping separator
		 *   * `string` - Decimal point indicator
		 *   * `integer` - Number of decimal points to show
		 *   * `string` (optional) - Prefix.
		 *   * `string` (optional) - Postfix (/suffix).
		 * * `text` - Escape HTML to help prevent XSS attacks. It has no optional
		 *   parameters.
		 *
		 * @example
		 *   // Column definition using the number renderer
		 *   {
		 *     data: "salary",
		 *     render: $.fn.dataTable.render.number( '\'', '.', 0, '$' )
		 *   }
		 *
		 * @namespace
		 */
		DataTable.render = {
			date: __mlHelper('toLocaleDateString'),
			datetime: __mlHelper('toLocaleString'),
			time: __mlHelper('toLocaleTimeString'),
			number: function (thousands, decimal, precision, prefix, postfix) {
				// Auto locale detection
				if (thousands === null || thousands === undefined) {
					thousands = __thousands;
				}

				if (decimal === null || decimal === undefined) {
					decimal = __decimal;
				}

				return {
					display: function (d) {
						if (typeof d !== 'number' && typeof d !== 'string') {
							return d;
						}

						if (d === '' || d === null) {
							return d;
						}

						var negative = d < 0 ? '-' : '';
						var flo = parseFloat(d);

						// If NaN then there isn't much formatting that we can do - just
						// return immediately, escaping any HTML (this was supposed to
						// be a number after all)
						if (isNaN(flo)) {
							return __htmlEscapeEntities(d);
						}

						flo = flo.toFixed(precision);
						d = Math.abs(flo);

						var intPart = parseInt(d, 10);
						var floatPart = precision ?
							decimal + (d - intPart).toFixed(precision).substring(2) :
							'';

						// If zero, then can't have a negative prefix
						if (intPart === 0 && parseFloat(floatPart) === 0) {
							negative = '';
						}

						return negative + (prefix || '') +
							intPart.toString().replace(
								/\B(?=(\d{3})+(?!\d))/g, thousands
							) +
							floatPart +
							(postfix || '');
					}
				};
			},

			text: function () {
				return {
					display: __htmlEscapeEntities,
					filter: __htmlEscapeEntities
				};
			}
		};


		/*
		 * This is really a good bit rubbish this method of exposing the internal methods
		 * publicly... - To be fixed in 2.0 using methods on the prototype
		 */


		/**
		 * Create a wrapper function for exporting an internal functions to an external API.
		 *  @param {string} fn API function name
		 *  @returns {function} wrapped function
		 *  @memberof DataTable#internal
		 */
		function _fnExternApiFunc(fn) {
			return function () {
				var args = [_fnSettingsFromNode(this[DataTable.ext.iApiIndex])].concat(
					Array.prototype.slice.call(arguments)
				);
				return DataTable.ext.internal[fn].apply(this, args);
			};
		}


		/**
		 * Reference to internal functions for use by plug-in developers. Note that
		 * these methods are references to internal functions and are considered to be
		 * private. If you use these methods, be aware that they are liable to change
		 * between versions.
		 *  @namespace
		 */
		$.extend(DataTable.ext.internal, {
			_fnExternApiFunc: _fnExternApiFunc,
			_fnBuildAjax: _fnBuildAjax,
			_fnAjaxUpdate: _fnAjaxUpdate,
			_fnAjaxParameters: _fnAjaxParameters,
			_fnAjaxUpdateDraw: _fnAjaxUpdateDraw,
			_fnAjaxDataSrc: _fnAjaxDataSrc,
			_fnAddColumn: _fnAddColumn,
			_fnColumnOptions: _fnColumnOptions,
			_fnAdjustColumnSizing: _fnAdjustColumnSizing,
			_fnVisibleToColumnIndex: _fnVisibleToColumnIndex,
			_fnColumnIndexToVisible: _fnColumnIndexToVisible,
			_fnVisbleColumns: _fnVisbleColumns,
			_fnGetColumns: _fnGetColumns,
			_fnColumnTypes: _fnColumnTypes,
			_fnApplyColumnDefs: _fnApplyColumnDefs,
			_fnHungarianMap: _fnHungarianMap,
			_fnCamelToHungarian: _fnCamelToHungarian,
			_fnLanguageCompat: _fnLanguageCompat,
			_fnBrowserDetect: _fnBrowserDetect,
			_fnAddData: _fnAddData,
			_fnAddTr: _fnAddTr,
			_fnNodeToDataIndex: _fnNodeToDataIndex,
			_fnNodeToColumnIndex: _fnNodeToColumnIndex,
			_fnGetCellData: _fnGetCellData,
			_fnSetCellData: _fnSetCellData,
			_fnSplitObjNotation: _fnSplitObjNotation,
			_fnGetObjectDataFn: _fnGetObjectDataFn,
			_fnSetObjectDataFn: _fnSetObjectDataFn,
			_fnGetDataMaster: _fnGetDataMaster,
			_fnClearTable: _fnClearTable,
			_fnDeleteIndex: _fnDeleteIndex,
			_fnInvalidate: _fnInvalidate,
			_fnGetRowElements: _fnGetRowElements,
			_fnCreateTr: _fnCreateTr,
			_fnBuildHead: _fnBuildHead,
			_fnDrawHead: _fnDrawHead,
			_fnDraw: _fnDraw,
			_fnReDraw: _fnReDraw,
			_fnAddOptionsHtml: _fnAddOptionsHtml,
			_fnDetectHeader: _fnDetectHeader,
			_fnGetUniqueThs: _fnGetUniqueThs,
			_fnFeatureHtmlFilter: _fnFeatureHtmlFilter,
			_fnFilterComplete: _fnFilterComplete,
			_fnFilterCustom: _fnFilterCustom,
			_fnFilterColumn: _fnFilterColumn,
			_fnFilter: _fnFilter,
			_fnFilterCreateSearch: _fnFilterCreateSearch,
			_fnEscapeRegex: _fnEscapeRegex,
			_fnFilterData: _fnFilterData,
			_fnFeatureHtmlInfo: _fnFeatureHtmlInfo,
			_fnUpdateInfo: _fnUpdateInfo,
			_fnInfoMacros: _fnInfoMacros,
			_fnInitialise: _fnInitialise,
			_fnInitComplete: _fnInitComplete,
			_fnLengthChange: _fnLengthChange,
			_fnFeatureHtmlLength: _fnFeatureHtmlLength,
			_fnFeatureHtmlPaginate: _fnFeatureHtmlPaginate,
			_fnPageChange: _fnPageChange,
			_fnFeatureHtmlProcessing: _fnFeatureHtmlProcessing,
			_fnProcessingDisplay: _fnProcessingDisplay,
			_fnFeatureHtmlTable: _fnFeatureHtmlTable,
			_fnScrollDraw: _fnScrollDraw,
			_fnApplyToChildren: _fnApplyToChildren,
			_fnCalculateColumnWidths: _fnCalculateColumnWidths,
			_fnThrottle: _fnThrottle,
			_fnConvertToWidth: _fnConvertToWidth,
			_fnGetWidestNode: _fnGetWidestNode,
			_fnGetMaxLenString: _fnGetMaxLenString,
			_fnStringToCss: _fnStringToCss,
			_fnSortFlatten: _fnSortFlatten,
			_fnSort: _fnSort,
			_fnSortAria: _fnSortAria,
			_fnSortListener: _fnSortListener,
			_fnSortAttachListener: _fnSortAttachListener,
			_fnSortingClasses: _fnSortingClasses,
			_fnSortData: _fnSortData,
			_fnSaveState: _fnSaveState,
			_fnLoadState: _fnLoadState,
			_fnImplementState: _fnImplementState,
			_fnSettingsFromNode: _fnSettingsFromNode,
			_fnLog: _fnLog,
			_fnMap: _fnMap,
			_fnBindAction: _fnBindAction,
			_fnCallbackReg: _fnCallbackReg,
			_fnCallbackFire: _fnCallbackFire,
			_fnLengthOverflow: _fnLengthOverflow,
			_fnRenderer: _fnRenderer,
			_fnDataSource: _fnDataSource,
			_fnRowAttributes: _fnRowAttributes,
			_fnExtend: _fnExtend,
			_fnCalculateEnd: function () { } // Used by a lot of plug-ins, but redundant
			// in 1.10, so this dead-end function is
			// added to prevent errors
		});


		// jQuery access
		$.fn.dataTable = DataTable;

		// Provide access to the host jQuery object (circular reference)
		DataTable.$ = $;

		// Legacy aliases
		$.fn.dataTableSettings = DataTable.settings;
		$.fn.dataTableExt = DataTable.ext;

		// With a capital `D` we return a DataTables API instance rather than a
		// jQuery object
		$.fn.DataTable = function (opts) {
			return $(this).dataTable(opts).api();
		};

		// All properties that are available to $.fn.dataTable should also be
		// available on $.fn.DataTable
		$.each(DataTable, function (prop, val) {
			$.fn.DataTable[prop] = val;
		});

		return DataTable;
	}));
/*! DataTables Bootstrap 5 integration
 * 2020 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				// CommonJS environments without a window global must pass a
				// root. This will give an error otherwise
				root = window;
			}

			if ( ! $ ) {
				$ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window
					require('jquery') :
					require('jquery')( root );
			}

			if ( ! $.fn.dataTable ) {
				require('datatables.net')(root, $);
			}


			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;



/**
 * DataTables integration for Bootstrap 5. This requires Bootstrap 5 and
 * DataTables 1.10 or newer.
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Bootstrap. See http://datatables.net/manual/styling/bootstrap
 * for further information.
 */

/* Set the defaults for DataTables initialisation */
$.extend( true, DataTable.defaults, {
	dom:
		"<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
		"<'row dt-row'<'col-sm-12'tr>>" +
		"<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
	renderer: 'bootstrap'
} );


/* Default class modification */
$.extend( DataTable.ext.classes, {
	sWrapper:      "dataTables_wrapper dt-bootstrap5",
	sFilterInput:  "form-control form-control-sm",
	sLengthSelect: "form-select form-select-sm",
	sProcessing:   "dataTables_processing card",
	sPageButton:   "paginate_button page-item"
} );


/* Bootstrap paging button renderer */
DataTable.ext.renderer.pageButton.bootstrap = function ( settings, host, idx, buttons, page, pages ) {
	var api     = new DataTable.Api( settings );
	var classes = settings.oClasses;
	var lang    = settings.oLanguage.oPaginate;
	var aria = settings.oLanguage.oAria.paginate || {};
	var btnDisplay, btnClass;

	var attach = function( container, buttons ) {
		var i, ien, node, button;
		var clickHandler = function ( e ) {
			e.preventDefault();
			if ( !$(e.currentTarget).hasClass('disabled') && api.page() != e.data.action ) {
				api.page( e.data.action ).draw( 'page' );
			}
		};

		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			button = buttons[i];

			if ( Array.isArray( button ) ) {
				attach( container, button );
			}
			else {
				btnDisplay = '';
				btnClass = '';

				switch ( button ) {
					case 'ellipsis':
						btnDisplay = '&#x2026;';
						btnClass = 'disabled';
						break;

					case 'first':
						btnDisplay = lang.sFirst;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'previous':
						btnDisplay = lang.sPrevious;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'next':
						btnDisplay = lang.sNext;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					case 'last':
						btnDisplay = lang.sLast;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					default:
						btnDisplay = button + 1;
						btnClass = page === button ?
							'active' : '';
						break;
				}

				if ( btnDisplay ) {
					node = $('<li>', {
							'class': classes.sPageButton+' '+btnClass,
							'id': idx === 0 && typeof button === 'string' ?
								settings.sTableId +'_'+ button :
								null
						} )
						.append( $('<a>', {
								'href': '#',
								'aria-controls': settings.sTableId,
								'aria-label': aria[ button ],
								'data-dt-idx': button,
								'tabindex': settings.iTabIndex,
								'class': 'page-link'
							} )
							.html( btnDisplay )
						)
						.appendTo( container );

					settings.oApi._fnBindAction(
						node, {action: button}, clickHandler
					);
				}
			}
		}
	};

	var hostEl = $(host);
	// IE9 throws an 'unknown error' if document.activeElement is used
	// inside an iframe or frame. 
	var activeEl;

	try {
		// Because this approach is destroying and recreating the paging
		// elements, focus is lost on the select button which is bad for
		// accessibility. So we want to restore focus once the draw has
		// completed
		activeEl = hostEl.find(document.activeElement).data('dt-idx');
	}
	catch (e) {}

	var paginationEl = hostEl.children('ul.pagination');

	if (paginationEl.length) {
		paginationEl.empty();
	}
	else {
		paginationEl = hostEl.html('<ul/>').children('ul').addClass('pagination');
	}

	attach(
		paginationEl,
		buttons
	);

	if ( activeEl !== undefined ) {
		hostEl.find('[data-dt-idx='+activeEl+']').trigger('focus');
	}
};


return DataTable;
}));

/*! Select for DataTables 1.5.0
 * 2015-2021 SpryMedia Ltd - datatables.net/license/mit
 */

(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery', 'datatables.net'], function ($) {
			return factory($, window, document);
		});
	}
	else if (typeof exports === 'object') {
		// CommonJS
		module.exports = function (root, $) {
			if (!root) {
				// CommonJS environments without a window global must pass a
				// root. This will give an error otherwise
				root = window;
			}

			if (!$) {
				$ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window
					require('jquery') :
					require('jquery')(root);
			}

			if (!$.fn.dataTable) {
				require('datatables.net')(root, $);
			}


			return factory($, root, root.document);
		};
	}
	else {
		// Browser
		factory(jQuery, window, document);
	}
}(function ($, window, document, undefined) {
	'use strict';
	var DataTable = $.fn.dataTable;



	// Version information for debugger
	DataTable.select = {};

	DataTable.select.version = '1.5.0';

	DataTable.select.init = function (dt) {
		var ctx = dt.settings()[0];

		if (ctx._select) {
			return;
		}

		var savedSelected = dt.state.loaded();

		var selectAndSave = function (e, settings, data) {
			if (data === null || data.select === undefined) {
				return;
			}

			// Clear any currently selected rows, before restoring state
			// None will be selected on first initialisation
			if (dt.rows({ selected: true }).any()) {
				dt.rows().deselect();
			}
			if (data.select.rows !== undefined) {
				dt.rows(data.select.rows).select();
			}

			if (dt.columns({ selected: true }).any()) {
				dt.columns().deselect();
			}
			if (data.select.columns !== undefined) {
				dt.columns(data.select.columns).select();
			}

			if (dt.cells({ selected: true }).any()) {
				dt.cells().deselect();
			}
			if (data.select.cells !== undefined) {
				for (var i = 0; i < data.select.cells.length; i++) {
					dt.cell(data.select.cells[i].row, data.select.cells[i].column).select();
				}
			}
			dt.state.save();
		}

		dt.one('init', function () {
			dt.on('stateSaveParams', function (e, settings, data) {
				data.select = {};
				data.select.rows = dt.rows({ selected: true }).ids(true).toArray();
				data.select.columns = dt.columns({ selected: true })[0];
				data.select.cells = dt.cells({ selected: true })[0].map(function (coords) {
					return { row: dt.row(coords.row).id(true), column: coords.column }
				});
			})

			selectAndSave(undefined, undefined, savedSelected)
			dt.on('stateLoaded stateLoadParams', selectAndSave)
		})

		var init = ctx.oInit.select;
		var defaults = DataTable.defaults.select;
		var opts = init === undefined ?
			defaults :
			init;

		// Set defaults
		var items = 'row';
		var style = 'api';
		var blurable = false;
		var toggleable = true;
		var info = true;
		var selector = 'td, th';
		var className = 'selected';
		var setStyle = false;

		ctx._select = {};

		// Initialisation customisations
		if (opts === true) {
			style = 'os';
			setStyle = true;
		}
		else if (typeof opts === 'string') {
			style = opts;
			setStyle = true;
		}
		else if ($.isPlainObject(opts)) {
			if (opts.blurable !== undefined) {
				blurable = opts.blurable;
			}

			if (opts.toggleable !== undefined) {
				toggleable = opts.toggleable;
			}

			if (opts.info !== undefined) {
				info = opts.info;
			}

			if (opts.items !== undefined) {
				items = opts.items;
			}

			if (opts.style !== undefined) {
				style = opts.style;
				setStyle = true;
			}
			else {
				style = 'os';
				setStyle = true;
			}

			if (opts.selector !== undefined) {
				selector = opts.selector;
			}

			if (opts.className !== undefined) {
				className = opts.className;
			}
		}

		dt.select.selector(selector);
		dt.select.items(items);
		dt.select.style(style);
		dt.select.blurable(blurable);
		dt.select.toggleable(toggleable);
		dt.select.info(info);
		ctx._select.className = className;


		// Sort table based on selected rows. Requires Select Datatables extension
		$.fn.dataTable.ext.order['select-checkbox'] = function (settings, col) {
			return this.api().column(col, { order: 'index' }).nodes().map(function (td) {
				if (settings._select.items === 'row') {
					return $(td).parent().hasClass(settings._select.className);
				} else if (settings._select.items === 'cell') {
					return $(td).hasClass(settings._select.className);
				}
				return false;
			});
		};

		// If the init options haven't enabled select, but there is a selectable
		// class name, then enable
		if (!setStyle && $(dt.table().node()).hasClass('selectable')) {
			dt.select.style('os');
		}
	};

	/*
	
	Select is a collection of API methods, event handlers, event emitters and
	buttons (for the `Buttons` extension) for DataTables. It provides the following
	features, with an overview of how they are implemented:
	
	## Selection of rows, columns and cells. Whether an item is selected or not is
	   stored in:
	
	* rows: a `_select_selected` property which contains a boolean value of the
	  DataTables' `aoData` object for each row
	* columns: a `_select_selected` property which contains a boolean value of the
	  DataTables' `aoColumns` object for each column
	* cells: a `_selected_cells` property which contains an array of boolean values
	  of the `aoData` object for each row. The array is the same length as the
	  columns array, with each element of it representing a cell.
	
	This method of using boolean flags allows Select to operate when nodes have not
	been created for rows / cells (DataTables' defer rendering feature).
	
	## API methods
	
	A range of API methods are available for triggering selection and de-selection
	of rows. Methods are also available to configure the selection events that can
	be triggered by an end user (such as which items are to be selected). To a large
	extent, these of API methods *is* Select. It is basically a collection of helper
	functions that can be used to select items in a DataTable.
	
	Configuration of select is held in the object `_select` which is attached to the
	DataTables settings object on initialisation. Select being available on a table
	is not optional when Select is loaded, but its default is for selection only to
	be available via the API - so the end user wouldn't be able to select rows
	without additional configuration.
	
	The `_select` object contains the following properties:
	
	```
	{
		items:string       - Can be `rows`, `columns` or `cells`. Defines what item 
							 will be selected if the user is allowed to activate row
							 selection using the mouse.
		style:string       - Can be `none`, `single`, `multi` or `os`. Defines the
							 interaction style when selecting items
		blurable:boolean   - If row selection can be cleared by clicking outside of
							 the table
		toggleable:boolean - If row selection can be cancelled by repeated clicking
							 on the row
		info:boolean       - If the selection summary should be shown in the table
							 information elements
	}
	```
	
	In addition to the API methods, Select also extends the DataTables selector
	options for rows, columns and cells adding a `selected` option to the selector
	options object, allowing the developer to select only selected items or
	unselected items.
	
	## Mouse selection of items
	
	Clicking on items can be used to select items. This is done by a simple event
	handler that will select the items using the API methods.
	
	 */


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Local functions
	 */

	/**
	 * Add one or more cells to the selection when shift clicking in OS selection
	 * style cell selection.
	 *
	 * Cell range is more complicated than row and column as we want to select
	 * in the visible grid rather than by index in sequence. For example, if you
	 * click first in cell 1-1 and then shift click in 2-2 - cells 1-2 and 2-1
	 * should also be selected (and not 1-3, 1-4. etc)
	 * 
	 * @param  {DataTable.Api} dt   DataTable
	 * @param  {object}        idx  Cell index to select to
	 * @param  {object}        last Cell index to select from
	 * @private
	 */
	function cellRange(dt, idx, last) {
		var indexes;
		var columnIndexes;
		var rowIndexes;
		var selectColumns = function (start, end) {
			if (start > end) {
				var tmp = end;
				end = start;
				start = tmp;
			}

			var record = false;
			return dt.columns(':visible').indexes().filter(function (i) {
				if (i === start) {
					record = true;
				}

				if (i === end) { // not else if, as start might === end
					record = false;
					return true;
				}

				return record;
			});
		};

		var selectRows = function (start, end) {
			var indexes = dt.rows({ search: 'applied' }).indexes();

			// Which comes first - might need to swap
			if (indexes.indexOf(start) > indexes.indexOf(end)) {
				var tmp = end;
				end = start;
				start = tmp;
			}

			var record = false;
			return indexes.filter(function (i) {
				if (i === start) {
					record = true;
				}

				if (i === end) {
					record = false;
					return true;
				}

				return record;
			});
		};

		if (!dt.cells({ selected: true }).any() && !last) {
			// select from the top left cell to this one
			columnIndexes = selectColumns(0, idx.column);
			rowIndexes = selectRows(0, idx.row);
		}
		else {
			// Get column indexes between old and new
			columnIndexes = selectColumns(last.column, idx.column);
			rowIndexes = selectRows(last.row, idx.row);
		}

		indexes = dt.cells(rowIndexes, columnIndexes).flatten();

		if (!dt.cells(idx, { selected: true }).any()) {
			// Select range
			dt.cells(indexes).select();
		}
		else {
			// Deselect range
			dt.cells(indexes).deselect();
		}
	}

	/**
	 * Disable mouse selection by removing the selectors
	 *
	 * @param {DataTable.Api} dt DataTable to remove events from
	 * @private
	 */
	function disableMouseSelection(dt) {
		var ctx = dt.settings()[0];
		var selector = ctx._select.selector;

		$(dt.table().container())
			.off('mousedown.dtSelect', selector)
			.off('mouseup.dtSelect', selector)
			.off('click.dtSelect', selector);

		$('body').off('click.dtSelect' + _safeId(dt.table().node()));
	}

	/**
	 * Attach mouse listeners to the table to allow mouse selection of items
	 *
	 * @param {DataTable.Api} dt DataTable to remove events from
	 * @private
	 */
	function enableMouseSelection(dt) {
		var container = $(dt.table().container());
		var ctx = dt.settings()[0];
		var selector = ctx._select.selector;
		var matchSelection;

		container
			.on('mousedown.dtSelect', selector, function (e) {
				// Disallow text selection for shift clicking on the table so multi
				// element selection doesn't look terrible!
				if (e.shiftKey || e.metaKey || e.ctrlKey) {
					container
						.css('-moz-user-select', 'none')
						.one('selectstart.dtSelect', selector, function () {
							return false;
						});
				}

				if (window.getSelection) {
					matchSelection = window.getSelection();
				}
			})
			.on('mouseup.dtSelect', selector, function () {
				// Allow text selection to occur again, Mozilla style (tested in FF
				// 35.0.1 - still required)
				container.css('-moz-user-select', '');
			})
			.on('click.dtSelect', selector, function (e) {
				var items = dt.select.items();
				var idx;

				// If text was selected (click and drag), then we shouldn't change
				// the row's selected state
				if (matchSelection) {
					var selection = window.getSelection();

					// If the element that contains the selection is not in the table, we can ignore it
					// This can happen if the developer selects text from the click event
					if (!selection.anchorNode || $(selection.anchorNode).closest('table')[0] === dt.table().node()) {
						if (selection !== matchSelection) {
							return;
						}
					}
				}

				var ctx = dt.settings()[0];
				var wrapperClass = dt.settings()[0].oClasses.sWrapper.trim().replace(/ +/g, '.');

				// Ignore clicks inside a sub-table
				if ($(e.target).closest('div.' + wrapperClass)[0] != dt.table().container()) {
					return;
				}

				var cell = dt.cell($(e.target).closest('td, th'));

				// Check the cell actually belongs to the host DataTable (so child
				// rows, etc, are ignored)
				if (!cell.any()) {
					return;
				}

				var event = $.Event('user-select.dt');
				eventTrigger(dt, event, [items, cell, e]);

				if (event.isDefaultPrevented()) {
					return;
				}

				var cellIndex = cell.index();
				if (items === 'row') {
					idx = cellIndex.row;
					typeSelect(e, dt, ctx, 'row', idx);
				}
				else if (items === 'column') {
					idx = cell.index().column;
					typeSelect(e, dt, ctx, 'column', idx);
				}
				else if (items === 'cell') {
					idx = cell.index();
					typeSelect(e, dt, ctx, 'cell', idx);
				}

				ctx._select_lastCell = cellIndex;
			});

		// Blurable
		$('body').on('click.dtSelect' + _safeId(dt.table().node()), function (e) {
			if (ctx._select.blurable) {
				// If the click was inside the DataTables container, don't blur
				if ($(e.target).parents().filter(dt.table().container()).length) {
					return;
				}

				// Ignore elements which have been removed from the DOM (i.e. paging
				// buttons)
				if ($(e.target).parents('html').length === 0) {
					return;
				}

				// Don't blur in Editor form
				if ($(e.target).parents('div.DTE').length) {
					return;
				}

				var event = $.Event('select-blur.dt');
				eventTrigger(dt, event, [e.target, e]);

				if (event.isDefaultPrevented()) {
					return;
				}

				clear(ctx, true);
			}
		});
	}

	/**
	 * Trigger an event on a DataTable
	 *
	 * @param {DataTable.Api} api      DataTable to trigger events on
	 * @param  {boolean}      selected true if selected, false if deselected
	 * @param  {string}       type     Item type acting on
	 * @param  {boolean}      any      Require that there are values before
	 *     triggering
	 * @private
	 */
	function eventTrigger(api, type, args, any) {
		if (any && !api.flatten().length) {
			return;
		}

		if (typeof type === 'string') {
			type = type + '.dt';
		}

		args.unshift(api);

		$(api.table().node()).trigger(type, args);
	}

	/**
	 * Update the information element of the DataTable showing information about the
	 * items selected. This is done by adding tags to the existing text
	 * 
	 * @param {DataTable.Api} api DataTable to update
	 * @private
	 */
	function info(api) {
		var ctx = api.settings()[0];

		if (!ctx._select.info || !ctx.aanFeatures.i) {
			return;
		}

		if (api.select.style() === 'api') {
			return;
		}

		var rows = api.rows({ selected: true }).flatten().length;
		var columns = api.columns({ selected: true }).flatten().length;
		var cells = api.cells({ selected: true }).flatten().length;

		var add = function (el, name, num) {
			el.append($('<span class="select-item"/>').append(api.i18n(
				'select.' + name + 's',
				{ _: '%d ' + name + 's selected', 0: '', 1: '1 ' + name + ' selected' },
				num
			)));
		};

		// Internal knowledge of DataTables to loop over all information elements
		$.each(ctx.aanFeatures.i, function (i, el) {
			el = $(el);

			var output = $('<span class="select-info"/>');
			add(output, 'row', rows);
			add(output, 'column', columns);
			add(output, 'cell', cells);

			var exisiting = el.children('span.select-info');
			if (exisiting.length) {
				exisiting.remove();
			}

			if (output.text() !== '') {
				el.append(output);
			}
		});
	}

	/**
	 * Initialisation of a new table. Attach event handlers and callbacks to allow
	 * Select to operate correctly.
	 *
	 * This will occur _after_ the initial DataTables initialisation, although
	 * before Ajax data is rendered, if there is ajax data
	 *
	 * @param  {DataTable.settings} ctx Settings object to operate on
	 * @private
	 */
	function init(ctx) {
		var api = new DataTable.Api(ctx);
		ctx._select_init = true;

		// Row callback so that classes can be added to rows and cells if the item
		// was selected before the element was created. This will happen with the
		// `deferRender` option enabled.
		// 
		// This method of attaching to `aoRowCreatedCallback` is a hack until
		// DataTables has proper events for row manipulation If you are reviewing
		// this code to create your own plug-ins, please do not do this!
		ctx.aoRowCreatedCallback.push({
			fn: function (row, data, index) {
				var i, ien;
				var d = ctx.aoData[index];

				// Row
				if (d._select_selected) {
					$(row).addClass(ctx._select.className);
				}

				// Cells and columns - if separated out, we would need to do two
				// loops, so it makes sense to combine them into a single one
				for (i = 0, ien = ctx.aoColumns.length; i < ien; i++) {
					if (ctx.aoColumns[i]._select_selected || (d._selected_cells && d._selected_cells[i])) {
						$(d.anCells[i]).addClass(ctx._select.className);
					}
				}
			},
			sName: 'select-deferRender'
		});

		// On Ajax reload we want to reselect all rows which are currently selected,
		// if there is an rowId (i.e. a unique value to identify each row with)
		api.on('preXhr.dt.dtSelect', function (e, settings) {
			if (settings !== api.settings()[0]) {
				// Not triggered by our DataTable!
				return;
			}

			// note that column selection doesn't need to be cached and then
			// reselected, as they are already selected
			var rows = api.rows({ selected: true }).ids(true).filter(function (d) {
				return d !== undefined;
			});

			var cells = api.cells({ selected: true }).eq(0).map(function (cellIdx) {
				var id = api.row(cellIdx.row).id(true);
				return id ?
					{ row: id, column: cellIdx.column } :
					undefined;
			}).filter(function (d) {
				return d !== undefined;
			});

			// On the next draw, reselect the currently selected items
			api.one('draw.dt.dtSelect', function () {
				api.rows(rows).select();

				// `cells` is not a cell index selector, so it needs a loop
				if (cells.any()) {
					cells.each(function (id) {
						api.cells(id.row, id.column).select();
					});
				}
			});
		});

		// Update the table information element with selected item summary
		api.on('draw.dtSelect.dt select.dtSelect.dt deselect.dtSelect.dt info.dt', function () {
			info(api);
			api.state.save();
		});

		// Clean up and release
		api.on('destroy.dtSelect', function () {
			api.rows({ selected: true }).deselect();

			disableMouseSelection(api);
			api.off('.dtSelect');
			$('body').off('.dtSelect' + _safeId(api.table().node()));
		});
	}

	/**
	 * Add one or more items (rows or columns) to the selection when shift clicking
	 * in OS selection style
	 *
	 * @param  {DataTable.Api} dt   DataTable
	 * @param  {string}        type Row or column range selector
	 * @param  {object}        idx  Item index to select to
	 * @param  {object}        last Item index to select from
	 * @private
	 */
	function rowColumnRange(dt, type, idx, last) {
		// Add a range of rows from the last selected row to this one
		var indexes = dt[type + 's']({ search: 'applied' }).indexes();
		var idx1 = $.inArray(last, indexes);
		var idx2 = $.inArray(idx, indexes);

		if (!dt[type + 's']({ selected: true }).any() && idx1 === -1) {
			// select from top to here - slightly odd, but both Windows and Mac OS
			// do this
			indexes.splice($.inArray(idx, indexes) + 1, indexes.length);
		}
		else {
			// reverse so we can shift click 'up' as well as down
			if (idx1 > idx2) {
				var tmp = idx2;
				idx2 = idx1;
				idx1 = tmp;
			}

			indexes.splice(idx2 + 1, indexes.length);
			indexes.splice(0, idx1);
		}

		if (!dt[type](idx, { selected: true }).any()) {
			// Select range
			dt[type + 's'](indexes).select();
		}
		else {
			// Deselect range - need to keep the clicked on row selected
			indexes.splice($.inArray(idx, indexes), 1);
			dt[type + 's'](indexes).deselect();
		}
	}

	/**
	 * Clear all selected items
	 *
	 * @param  {DataTable.settings} ctx Settings object of the host DataTable
	 * @param  {boolean} [force=false] Force the de-selection to happen, regardless
	 *     of selection style
	 * @private
	 */
	function clear(ctx, force) {
		if (force || ctx._select.style === 'single') {
			var api = new DataTable.Api(ctx);

			api.rows({ selected: true }).deselect();
			api.columns({ selected: true }).deselect();
			api.cells({ selected: true }).deselect();
		}
	}

	/**
	 * Select items based on the current configuration for style and items.
	 *
	 * @param  {object}             e    Mouse event object
	 * @param  {DataTables.Api}     dt   DataTable
	 * @param  {DataTable.settings} ctx  Settings object of the host DataTable
	 * @param  {string}             type Items to select
	 * @param  {int|object}         idx  Index of the item to select
	 * @private
	 */
	function typeSelect(e, dt, ctx, type, idx) {
		var style = dt.select.style();
		var toggleable = dt.select.toggleable();
		var isSelected = dt[type](idx, { selected: true }).any();

		if (isSelected && !toggleable) {
			return;
		}

		if (style === 'os') {
			if (e.ctrlKey || e.metaKey) {
				// Add or remove from the selection
				dt[type](idx).select(!isSelected);
			}
			else if (e.shiftKey) {
				if (type === 'cell') {
					cellRange(dt, idx, ctx._select_lastCell || null);
				}
				else {
					rowColumnRange(dt, type, idx, ctx._select_lastCell ?
						ctx._select_lastCell[type] :
						null
					);
				}
			}
			else {
				// No cmd or shift click - deselect if selected, or select
				// this row only
				var selected = dt[type + 's']({ selected: true });

				if (isSelected && selected.flatten().length === 1) {
					dt[type](idx).deselect();
				}
				else {
					selected.deselect();
					dt[type](idx).select();
				}
			}
		} else if (style == 'multi+shift') {
			if (e.shiftKey) {
				if (type === 'cell') {
					cellRange(dt, idx, ctx._select_lastCell || null);
				}
				else {
					rowColumnRange(dt, type, idx, ctx._select_lastCell ?
						ctx._select_lastCell[type] :
						null
					);
				}
			}
			else {
				dt[type](idx).select(!isSelected);
			}
		}
		else {
			dt[type](idx).select(!isSelected);
		}
	}

	function _safeId(node) {
		return node.id.replace(/[^a-zA-Z0-9\-\_]/g, '-');
	}



	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * DataTables selectors
	 */

	// row and column are basically identical just assigned to different properties
	// and checking a different array, so we can dynamically create the functions to
	// reduce the code size
	$.each([
		{ type: 'row', prop: 'aoData' },
		{ type: 'column', prop: 'aoColumns' }
	], function (i, o) {
		DataTable.ext.selector[o.type].push(function (settings, opts, indexes) {
			var selected = opts.selected;
			var data;
			var out = [];

			if (selected !== true && selected !== false) {
				return indexes;
			}

			for (var i = 0, ien = indexes.length; i < ien; i++) {
				data = settings[o.prop][indexes[i]];

				if ((selected === true && data._select_selected === true) ||
					(selected === false && !data._select_selected)
				) {
					out.push(indexes[i]);
				}
			}

			return out;
		});
	});

	DataTable.ext.selector.cell.push(function (settings, opts, cells) {
		var selected = opts.selected;
		var rowData;
		var out = [];

		if (selected === undefined) {
			return cells;
		}

		for (var i = 0, ien = cells.length; i < ien; i++) {
			rowData = settings.aoData[cells[i].row];

			if ((selected === true && rowData._selected_cells && rowData._selected_cells[cells[i].column] === true) ||
				(selected === false && (!rowData._selected_cells || !rowData._selected_cells[cells[i].column]))
			) {
				out.push(cells[i]);
			}
		}

		return out;
	});



	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * DataTables API
	 *
	 * For complete documentation, please refer to the docs/api directory or the
	 * DataTables site
	 */

	// Local variables to improve compression
	var apiRegister = DataTable.Api.register;
	var apiRegisterPlural = DataTable.Api.registerPlural;

	apiRegister('select()', function () {
		return this.iterator('table', function (ctx) {
			DataTable.select.init(new DataTable.Api(ctx));
		});
	});

	apiRegister('select.blurable()', function (flag) {
		if (flag === undefined) {
			return this.context[0]._select.blurable;
		}

		return this.iterator('table', function (ctx) {
			ctx._select.blurable = flag;
		});
	});

	apiRegister('select.toggleable()', function (flag) {
		if (flag === undefined) {
			return this.context[0]._select.toggleable;
		}

		return this.iterator('table', function (ctx) {
			ctx._select.toggleable = flag;
		});
	});

	apiRegister('select.info()', function (flag) {
		if (flag === undefined) {
			return this.context[0]._select.info;
		}

		return this.iterator('table', function (ctx) {
			ctx._select.info = flag;
		});
	});

	apiRegister('select.items()', function (items) {
		if (items === undefined) {
			return this.context[0]._select.items;
		}

		return this.iterator('table', function (ctx) {
			ctx._select.items = items;

			eventTrigger(new DataTable.Api(ctx), 'selectItems', [items]);
		});
	});

	// Takes effect from the _next_ selection. None disables future selection, but
	// does not clear the current selection. Use the `deselect` methods for that
	apiRegister('select.style()', function (style) {
		if (style === undefined) {
			return this.context[0]._select.style;
		}

		return this.iterator('table', function (ctx) {
			if (!ctx._select) {
				DataTable.select.init(new DataTable.Api(ctx));
			}

			if (!ctx._select_init) {
				init(ctx);
			}

			ctx._select.style = style;

			// Add / remove mouse event handlers. They aren't required when only
			// API selection is available
			var dt = new DataTable.Api(ctx);
			disableMouseSelection(dt);

			if (style !== 'api') {
				enableMouseSelection(dt);
			}

			eventTrigger(new DataTable.Api(ctx), 'selectStyle', [style]);
		});
	});

	apiRegister('select.selector()', function (selector) {
		if (selector === undefined) {
			return this.context[0]._select.selector;
		}

		return this.iterator('table', function (ctx) {
			disableMouseSelection(new DataTable.Api(ctx));

			ctx._select.selector = selector;

			if (ctx._select.style !== 'api') {
				enableMouseSelection(new DataTable.Api(ctx));
			}
		});
	});



	apiRegisterPlural('rows().select()', 'row().select()', function (select) {
		var api = this;

		if (select === false) {
			return this.deselect();
		}

		this.iterator('row', function (ctx, idx) {
			clear(ctx);

			ctx.aoData[idx]._select_selected = true;
			$(ctx.aoData[idx].nTr).addClass(ctx._select.className);
		});

		this.iterator('table', function (ctx, i) {
			eventTrigger(api, 'select', ['row', api[i]], true);
		});

		return this;
	});

	apiRegister('row().selected()', function () {
		var ctx = this.context[0];

		if (
			ctx &&
			this.length &&
			ctx.aoData[this[0]] &&
			ctx.aoData[this[0]]._select_selected
		) {
			return true;
		}

		return false;
	});

	apiRegisterPlural('columns().select()', 'column().select()', function (select) {
		var api = this;

		if (select === false) {
			return this.deselect();
		}

		this.iterator('column', function (ctx, idx) {
			clear(ctx);

			ctx.aoColumns[idx]._select_selected = true;

			var column = new DataTable.Api(ctx).column(idx);

			$(column.header()).addClass(ctx._select.className);
			$(column.footer()).addClass(ctx._select.className);

			column.nodes().to$().addClass(ctx._select.className);
		});

		this.iterator('table', function (ctx, i) {
			eventTrigger(api, 'select', ['column', api[i]], true);
		});

		return this;
	});

	apiRegister('column().selected()', function () {
		var ctx = this.context[0];

		if (
			ctx &&
			this.length &&
			ctx.aoColumns[this[0]] &&
			ctx.aoColumns[this[0]]._select_selected
		) {
			return true;
		}

		return false;
	});

	apiRegisterPlural('cells().select()', 'cell().select()', function (select) {
		var api = this;

		if (select === false) {
			return this.deselect();
		}

		this.iterator('cell', function (ctx, rowIdx, colIdx) {
			clear(ctx);

			var data = ctx.aoData[rowIdx];

			if (data._selected_cells === undefined) {
				data._selected_cells = [];
			}

			data._selected_cells[colIdx] = true;

			if (data.anCells) {
				$(data.anCells[colIdx]).addClass(ctx._select.className);
			}
		});

		this.iterator('table', function (ctx, i) {
			eventTrigger(api, 'select', ['cell', api.cells(api[i]).indexes().toArray()], true);
		});

		return this;
	});

	apiRegister('cell().selected()', function () {
		var ctx = this.context[0];

		if (ctx && this.length) {
			var row = ctx.aoData[this[0][0].row];

			if (row && row._selected_cells && row._selected_cells[this[0][0].column]) {
				return true;
			}
		}

		return false;
	});


	apiRegisterPlural('rows().deselect()', 'row().deselect()', function () {
		var api = this;

		this.iterator('row', function (ctx, idx) {
			ctx.aoData[idx]._select_selected = false;
			ctx._select_lastCell = null;
			$(ctx.aoData[idx].nTr).removeClass(ctx._select.className);
		});

		this.iterator('table', function (ctx, i) {
			eventTrigger(api, 'deselect', ['row', api[i]], true);
		});

		return this;
	});

	apiRegisterPlural('columns().deselect()', 'column().deselect()', function () {
		var api = this;

		this.iterator('column', function (ctx, idx) {
			ctx.aoColumns[idx]._select_selected = false;

			var api = new DataTable.Api(ctx);
			var column = api.column(idx);

			$(column.header()).removeClass(ctx._select.className);
			$(column.footer()).removeClass(ctx._select.className);

			// Need to loop over each cell, rather than just using
			// `column().nodes()` as cells which are individually selected should
			// not have the `selected` class removed from them
			api.cells(null, idx).indexes().each(function (cellIdx) {
				var data = ctx.aoData[cellIdx.row];
				var cellSelected = data._selected_cells;

				if (data.anCells && (!cellSelected || !cellSelected[cellIdx.column])) {
					$(data.anCells[cellIdx.column]).removeClass(ctx._select.className);
				}
			});
		});

		this.iterator('table', function (ctx, i) {
			eventTrigger(api, 'deselect', ['column', api[i]], true);
		});

		return this;
	});

	apiRegisterPlural('cells().deselect()', 'cell().deselect()', function () {
		var api = this;

		this.iterator('cell', function (ctx, rowIdx, colIdx) {
			var data = ctx.aoData[rowIdx];

			if (data._selected_cells !== undefined) {
				data._selected_cells[colIdx] = false;
			}

			// Remove class only if the cells exist, and the cell is not column
			// selected, in which case the class should remain (since it is selected
			// in the column)
			if (data.anCells && !ctx.aoColumns[colIdx]._select_selected) {
				$(data.anCells[colIdx]).removeClass(ctx._select.className);
			}
		});

		this.iterator('table', function (ctx, i) {
			eventTrigger(api, 'deselect', ['cell', api[i]], true);
		});

		return this;
	});



	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Buttons
	 */
	function i18n(label, def) {
		return function (dt) {
			return dt.i18n('buttons.' + label, def);
		};
	}

	// Common events with suitable namespaces
	function namespacedEvents(config) {
		var unique = config._eventNamespace;

		return 'draw.dt.DT' + unique + ' select.dt.DT' + unique + ' deselect.dt.DT' + unique;
	}

	function enabled(dt, config) {
		if ($.inArray('rows', config.limitTo) !== -1 && dt.rows({ selected: true }).any()) {
			return true;
		}

		if ($.inArray('columns', config.limitTo) !== -1 && dt.columns({ selected: true }).any()) {
			return true;
		}

		if ($.inArray('cells', config.limitTo) !== -1 && dt.cells({ selected: true }).any()) {
			return true;
		}

		return false;
	}

	var _buttonNamespace = 0;

	$.extend(DataTable.ext.buttons, {
		selected: {
			text: i18n('selected', 'Selected'),
			className: 'buttons-selected',
			limitTo: ['rows', 'columns', 'cells'],
			init: function (dt, node, config) {
				var that = this;
				config._eventNamespace = '.select' + (_buttonNamespace++);

				// .DT namespace listeners are removed by DataTables automatically
				// on table destroy
				dt.on(namespacedEvents(config), function () {
					that.enable(enabled(dt, config));
				});

				this.disable();
			},
			destroy: function (dt, node, config) {
				dt.off(config._eventNamespace);
			}
		},
		selectedSingle: {
			text: i18n('selectedSingle', 'Selected single'),
			className: 'buttons-selected-single',
			init: function (dt, node, config) {
				var that = this;
				config._eventNamespace = '.select' + (_buttonNamespace++);

				dt.on(namespacedEvents(config), function () {
					var count = dt.rows({ selected: true }).flatten().length +
						dt.columns({ selected: true }).flatten().length +
						dt.cells({ selected: true }).flatten().length;

					that.enable(count === 1);
				});

				this.disable();
			},
			destroy: function (dt, node, config) {
				dt.off(config._eventNamespace);
			}
		},
		selectAll: {
			text: i18n('selectAll', 'Select all'),
			className: 'buttons-select-all',
			action: function () {
				var items = this.select.items();
				this[items + 's']().select();
			}
		},
		selectNone: {
			text: i18n('selectNone', 'Deselect all'),
			className: 'buttons-select-none',
			action: function () {
				clear(this.settings()[0], true);
			},
			init: function (dt, node, config) {
				var that = this;
				config._eventNamespace = '.select' + (_buttonNamespace++);

				dt.on(namespacedEvents(config), function () {
					var count = dt.rows({ selected: true }).flatten().length +
						dt.columns({ selected: true }).flatten().length +
						dt.cells({ selected: true }).flatten().length;

					that.enable(count > 0);
				});

				this.disable();
			},
			destroy: function (dt, node, config) {
				dt.off(config._eventNamespace);
			}
		}
	});

	$.each(['Row', 'Column', 'Cell'], function (i, item) {
		var lc = item.toLowerCase();

		DataTable.ext.buttons['select' + item + 's'] = {
			text: i18n('select' + item + 's', 'Select ' + lc + 's'),
			className: 'buttons-select-' + lc + 's',
			action: function () {
				this.select.items(lc);
			},
			init: function (dt) {
				var that = this;

				dt.on('selectItems.dt.DT', function (e, ctx, items) {
					that.active(items === lc);
				});
			}
		};
	});



	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Initialisation
	 */

	// DataTables creation - check if select has been defined in the options. Note
	// this required that the table be in the document! If it isn't then something
	// needs to trigger this method unfortunately. The next major release of
	// DataTables will rework the events and address this.
	$(document).on('preInit.dt.dtSelect', function (e, ctx) {
		if (e.namespace !== 'dt') {
			return;
		}

		DataTable.select.init(new DataTable.Api(ctx));
	});


	return DataTable;
}));
/*!
 * jQuery DataTables Checkboxes (https://www.gyrocode.com/projects/jquery-datatables-checkboxes/)
 * Checkboxes extension for jQuery DataTables
 *
 * @version     1.2.13
 * @author      Gyrocode LLC (https://www.gyrocode.com)
 * @copyright   (c) Gyrocode LLC
 * @license     MIT
 */
(function (factory) {
    /* eslint-disable */
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery', 'datatables.net'], function ($) {
            return factory($, window, document);
        });
    }
    else if (typeof exports === 'object') {
        // CommonJS
        module.exports = function (root, $) {
            if (!root) {
                root = window;
            }

            if (!$ || !$.fn.dataTable) {
                $ = require('datatables.net')(root, $).$;
            }

            return factory($, root, root.document);
        };
    }
    else {
        // Browser
        factory(jQuery, window, document);
    }
    /* eslint-enable */
}(function ($, window, document) {
    'use strict';
    var DataTable = $.fn.dataTable;


    /**
    * Checkboxes is an extension for the jQuery DataTables library that provides
    * universal solution for working with checkboxes in a table.
    *
    *  @class
    *  @param {object} settings DataTables settings object for the host table
    *  @requires jQuery 1.7+
    *  @requires DataTables 1.10.8+
    *
    *  @example
    *     $('#example').DataTable({
    *        'columnDefs': [
    *           {
    *              'targets': 0,
    *              'checkboxes': true
    *           }
    *        ]
    *     });
    */
    var Checkboxes = function (settings) {
        // Sanity check that we are using DataTables 1.10.8 or newer
        if (!DataTable.versionCheck || !DataTable.versionCheck('1.10.8')) {
            throw 'DataTables Checkboxes requires DataTables 1.10.8 or newer';
        }

        this.s = {
            dt: new DataTable.Api(settings),
            columns: [],
            data: {},
            dataDisabled: {},
            ignoreSelect: false
        };

        // Get settings object
        this.s.ctx = this.s.dt.settings()[0];

        // Check if checkboxes have already been initialised on this table
        if (this.s.ctx.checkboxes) {
            return;
        }

        settings.checkboxes = this;

        this._constructor();
    };


    Checkboxes.prototype = {
        /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        * Constructor
        */

        /**
        * Initialise the Checkboxes instance
        *
        * @private
        */
        _constructor: function () {
            var self = this;
            var dt = self.s.dt;
            var ctx = self.s.ctx;
            var hasCheckboxes = false;
            var hasCheckboxesSelectRow = false;

            for (var i = 0; i < ctx.aoColumns.length; i++) {
                if (ctx.aoColumns[i].checkboxes) {
                    var $colHeader = $(dt.column(i).header());

                    //
                    // INITIALIZATION
                    //

                    hasCheckboxes = true;

                    if (!$.isPlainObject(ctx.aoColumns[i].checkboxes)) {
                        ctx.aoColumns[i].checkboxes = {};
                    }

                    ctx.aoColumns[i].checkboxes = $.extend(
                        {}, Checkboxes.defaults, ctx.aoColumns[i].checkboxes
                    );

                    //
                    // OPTIONS
                    //

                    var colOptions = {
                        'searchable': false,
                        'orderable': false
                    };

                    if (ctx.aoColumns[i].sClass === '') {
                        colOptions['className'] = 'dt-checkboxes-cell';
                    } else {
                        colOptions['className'] = ctx.aoColumns[i].sClass + ' dt-checkboxes-cell';
                    }

                    if (ctx.aoColumns[i].sWidthOrig === null) {
                        colOptions['width'] = '1%';
                    }

                    if (ctx.aoColumns[i].mRender === null) {
                        colOptions['render'] = function () {
                            return '<input type="checkbox" class="dt-checkboxes" autocomplete="off">';
                        };
                    }

                    DataTable.ext.internal._fnColumnOptions(ctx, i, colOptions);


                    // WORKAROUND: Remove "sorting" class
                    $colHeader.removeClass('sorting');

                    // WORKAROUND: Detach all event handlers for this column
                    $colHeader.off('.dt');

                    // If table has data source other than Ajax
                    if (ctx.sAjaxSource === null) {
                        // WORKAROUND: Invalidate column data
                        var cells = dt.cells('tr', i);
                        cells.invalidate('data');

                        // WORKAROUND: Add required class to existing cells
                        $(cells.nodes()).addClass(colOptions['className']);
                    }


                    //
                    // DATA
                    //

                    // Initialize object holding data for selected checkboxes
                    self.s.data[i] = {};
                    self.s.dataDisabled[i] = {};

                    // Store column index for easy column selection later
                    self.s.columns.push(i);


                    //
                    // CLASSES
                    //

                    // If row selection is enabled for this column
                    if (ctx.aoColumns[i].checkboxes.selectRow) {

                        // If Select extension is enabled
                        if (ctx._select) {
                            hasCheckboxesSelectRow = true;

                            // Otherwise, if Select extension is not enabled
                        } else {
                            // Disable row selection for this column
                            ctx.aoColumns[i].checkboxes.selectRow = false;
                        }
                    }

                    // If "Select all" control is enabled
                    if (ctx.aoColumns[i].checkboxes.selectAll) {
                        // Save previous HTML content
                        $colHeader.data('html', $colHeader.html());

                        // If "Select all" control markup is provided
                        if (ctx.aoColumns[i].checkboxes.selectAllRender !== null) {
                            var selectAllHtml = '';

                            // If "selectAllRender" option is a function
                            if ($.isFunction(ctx.aoColumns[i].checkboxes.selectAllRender)) {
                                selectAllHtml = ctx.aoColumns[i].checkboxes.selectAllRender();

                                // Otherwise, if "selectAllRender" option is a string
                            } else if (typeof ctx.aoColumns[i].checkboxes.selectAllRender === 'string') {
                                selectAllHtml = ctx.aoColumns[i].checkboxes.selectAllRender;
                            }

                            $colHeader
                                .html(selectAllHtml)
                                .addClass('dt-checkboxes-select-all')
                                .attr('data-col', i);
                        }
                    }
                }
            }

            // If table has at least one checkbox column
            if (hasCheckboxes) {

                // Load previous state
                self.loadState();

                //
                // EVENT HANDLERS
                //

                var $table = $(dt.table().node());
                var $tableBody = $(dt.table().body());
                var $tableContainer = $(dt.table().container());

                // If there is at least one column that has row selection enabled
                if (hasCheckboxesSelectRow) {
                    $table.addClass('dt-checkboxes-select');

                    // Handle event before row is selected/deselected
                    $table.on('user-select.dt.dtCheckboxes', function (e, dt, type, cell, originalEvent) {
                        self.onDataTablesUserSelect(e, dt, type, cell, originalEvent);
                    });

                    // Handle row select/deselect event
                    $table.on('select.dt.dtCheckboxes deselect.dt.dtCheckboxes', function (e, api, type, indexes) {
                        self.onDataTablesSelectDeselect(e, type, indexes);
                    });

                    // If displaying of Select extension information is enabled
                    if (ctx._select.info) {
                        // Disable Select extension information display
                        dt.select.info(false);

                        // Update the table information element with selected item summary
                        //
                        // NOTE: Needed to display correct count of selected rows
                        // when using server-side processing mode
                        $table.on('draw.dt.dtCheckboxes select.dt.dtCheckboxes deselect.dt.dtCheckboxes', function () {
                            self.showInfoSelected();
                        });
                    }
                }

                // Handle table draw event
                $table.on('draw.dt.dtCheckboxes', function (e) {
                    self.onDataTablesDraw(e);
                });

                // Handle checkbox click event
                $tableBody.on('click.dtCheckboxes', 'input.dt-checkboxes', function (e) {
                    self.onClick(e, this);
                });

                // Handle click on "Select all" control
                $tableContainer.on('click.dtCheckboxes', 'thead th.dt-checkboxes-select-all input[type="checkbox"]', function (e) {
                    self.onClickSelectAll(e, this);
                });

                // Handle click on heading containing "Select all" control
                $tableContainer.on('click.dtCheckboxes', 'thead th.dt-checkboxes-select-all', function () {
                    $('input[type="checkbox"]', this).not(':disabled').trigger('click');
                });

                // If row selection is disabled
                if (!hasCheckboxesSelectRow) {
                    // Handle click on cell containing checkbox
                    $tableContainer.on('click.dtCheckboxes', 'tbody td.dt-checkboxes-cell', function () {
                        $('input[type="checkbox"]', this).not(':disabled').trigger('click');
                    });
                }

                // Handle click on label node in heading containing "Select all" control
                // and in cell containing checkbox
                $tableContainer.on('click.dtCheckboxes', 'thead th.dt-checkboxes-select-all label, tbody td.dt-checkboxes-cell label', function (e) {
                    // Prevent default behavior
                    e.preventDefault();
                });

                // Handle click on "Select all" control in floating fixed header
                $(document).on('click.dtCheckboxes', '.fixedHeader-floating thead th.dt-checkboxes-select-all input[type="checkbox"]', function (e) {
                    // If FixedHeader is enabled in this instance
                    if (ctx._fixedHeader) {
                        // If header is floating in this instance
                        if (ctx._fixedHeader.dom['header'].floating) {
                            self.onClickSelectAll(e, this);
                        }
                    }
                });

                // Handle click on heading containing "Select all" control in floating fixed header
                $(document).on('click.dtCheckboxes', '.fixedHeader-floating thead th.dt-checkboxes-select-all', function () {
                    // If FixedHeader is enabled in this instance
                    if (ctx._fixedHeader) {
                        // If header is floating in this instance
                        if (ctx._fixedHeader.dom['header'].floating) {
                            $('input[type="checkbox"]', this).trigger('click');
                        }
                    }
                });

                // Handle table initialization event
                $table.on('init.dt.dtCheckboxes', function () {
                    // Use delay to handle initialization event
                    // because certain extensions (FixedColumns) are initialized
                    // only when initialization event is triggered.
                    setTimeout(function () {
                        self.onDataTablesInit();
                    }, 0);
                });

                // Handle state saving event
                $table.on('stateSaveParams.dt.dtCheckboxes', function (e, settings, data) {
                    self.onDataTablesStateSave(e, settings, data);
                });

                // Handle table destroy event
                $table.one('destroy.dt.dtCheckboxes', function (e, settings) {
                    self.onDataTablesDestroy(e, settings);
                });
            }
        },

        // Handles DataTables initialization event
        onDataTablesInit: function () {
            var self = this;
            var dt = self.s.dt;
            var ctx = self.s.ctx;

            // If server-side processing mode is not enabled
            // NOTE: Needed to avoid duplicate call to updateStateCheckboxes() in onDataTablesDraw()
            if (!ctx.oFeatures.bServerSide) {

                // If state saving is enabled
                if (ctx.oFeatures.bStateSave) {
                    self.updateState();
                }

                // Handle Ajax request completion event
                // NOTE: Needed to update table state
                // if table is reloaded via ajax.reload() API method
                $(dt.table().node()).on('xhr.dt.dtCheckboxes', function (e, settings, json, xhr) {
                    self.onDataTablesXhr(e.settings, json, xhr);
                });
            }
        },

        // Handles DataTables user initiated select event
        onDataTablesUserSelect: function (e, dt, type, cell /*, originalEvent*/) {
            var self = this;

            var cellIdx = cell.index();
            var rowIdx = cellIdx.row;
            var colIdx = self.getSelectRowColIndex();
            var cellData = dt.cell({ row: rowIdx, column: colIdx }).data();

            // If checkbox in the cell cannot be checked
            if (!self.isCellSelectable(colIdx, cellData)) {
                // Prevent row selection
                e.preventDefault();
            }
        },

        // Handles DataTables row select/deselect event
        onDataTablesSelectDeselect: function (e, type, indexes) {
            var self = this;
            var dt = self.s.dt;

            if (self.s.ignoreSelect) { return; }

            if (type === 'row') {
                // Get index of the first column that has checkbox and row selection enabled
                var colIdx = self.getSelectRowColIndex();
                if (colIdx !== null) {
                    var cells = dt.cells(indexes, colIdx);

                    self.updateData(cells, colIdx, (e.type === 'select') ? true : false);
                    self.updateCheckbox(cells, colIdx, (e.type === 'select') ? true : false);
                    self.updateSelectAll(colIdx);
                }
            }
        },

        // Handles DataTables state save event
        onDataTablesStateSave: function (e, settings, data) {
            var self = this;
            var ctx = self.s.ctx;

            // For every column where checkboxes are enabled
            $.each(self.s.columns, function (index, colIdx) {
                // If checkbox state saving is enabled
                if (ctx.aoColumns[colIdx].checkboxes.stateSave) {
                    // If checkboxes state hasn't been saved before
                    if (!Object.prototype.hasOwnProperty.call(data, 'checkboxes')) {
                        // Initialize array to save checkboxes state for each column
                        data.checkboxes = [];
                    }

                    // Save checkboxes state
                    data.checkboxes[colIdx] = self.s.data[colIdx];
                }
            });
        },

        // Handles DataTables destroy event
        onDataTablesDestroy: function () {
            var self = this;
            var dt = self.s.dt;

            // Get table elements
            var $table = $(dt.table().node());
            var $tableBody = $(dt.table().body());
            var $tableContainer = $(dt.table().container());

            // Detach event handlers
            $(document).off('click.dtCheckboxes');
            $tableContainer.off('.dtCheckboxes');
            $tableBody.off('.dtCheckboxes');
            $table.off('.dtCheckboxes');

            // Clear data
            //
            // NOTE: Needed only to reduce memory footprint
            // in case user saves instance of DataTable object.
            self.s.data = {};
            self.s.dataDisabled = {};

            // Remove added elements
            $('.dt-checkboxes-select-all', $table).each(function (index, el) {
                $(el)
                    .html($(el).data('html'))
                    .removeClass('dt-checkboxes-select-all');
            });
        },

        // Handles DataTables draw event
        onDataTablesDraw: function () {
            var self = this;
            var ctx = self.s.ctx;

            // If server-side processing is enabled
            // or deferred render is enabled
            //
            // TODO: it's not optimal to update state of checkboxes
            // for already created rows in deferred rendering mode
            if (ctx.oFeatures.bServerSide || ctx.oFeatures.bDeferRender) {
                self.updateStateCheckboxes({ page: 'current', search: 'none' });
            }

            $.each(self.s.columns, function (index, colIdx) {
                self.updateSelectAll(colIdx);
            });
        },

        // Handles DataTables Ajax request completion event
        onDataTablesXhr: function ( /* e, settings , json, xhr */) {
            var self = this;
            var dt = self.s.dt;
            var ctx = self.s.ctx;

            // Get table elements
            var $table = $(dt.table().node());

            // For every column where checkboxes are enabled
            $.each(self.s.columns, function (index, colIdx) {
                // Reset data
                self.s.data[colIdx] = {};
                self.s.dataDisabled[colIdx] = {};
            });

            // If state saving is enabled
            if (ctx.oFeatures.bStateSave) {
                // Load previous state
                self.loadState();

                // Update table state on next redraw
                $table.one('draw.dt.dtCheckboxes', function () {
                    self.updateState();
                });
            }
        },

        // Updates array holding data for selected checkboxes
        updateData: function (cells, colIdx, isSelected) {
            var self = this;
            var dt = self.s.dt;
            var ctx = self.s.ctx;

            // If Checkboxes extension is enabled for this column
            if (ctx.aoColumns[colIdx].checkboxes) {
                var cellsData = cells.data();
                cellsData.each(function (cellData) {
                    // If checkbox is checked
                    if (isSelected) {
                        ctx.checkboxes.s.data[colIdx][cellData] = 1;

                        // Otherwise, if checkbox is not checked
                    } else {
                        delete ctx.checkboxes.s.data[colIdx][cellData];
                    }
                });

                // If state saving is enabled
                if (ctx.oFeatures.bStateSave) {
                    // If checkbox state saving is enabled
                    if (ctx.aoColumns[colIdx].checkboxes.stateSave) {
                        // Save state
                        dt.state.save();
                    }
                }
            }
        },

        // Updates row selection
        updateSelect: function (selector, isSelected) {
            var self = this;
            var dt = self.s.dt;
            var ctx = self.s.ctx;

            // If Select extension is enabled
            if (ctx._select) {
                // Disable select event hanlder temporarily
                self.s.ignoreSelect = true;

                if (isSelected) {
                    dt.rows(selector).select();
                } else {
                    dt.rows(selector).deselect();
                }

                // Re-enable select event handler
                self.s.ignoreSelect = false;
            }
        },

        // Updates state of single checkbox
        updateCheckbox: function (cells, colIdx, isSelected) {
            var self = this;
            var ctx = self.s.ctx;

            var cellNodes = cells.nodes();
            if (cellNodes.length) {
                $('input.dt-checkboxes', cellNodes).not(':disabled').prop('checked', isSelected);

                // If selectCallback is a function
                if ($.isFunction(ctx.aoColumns[colIdx].checkboxes.selectCallback)) {
                    ctx.aoColumns[colIdx].checkboxes.selectCallback(cellNodes, isSelected);
                }
            }
        },

        // Update table state
        updateState: function () {
            var self = this;
            var dt = self.s.dt;
            var ctx = self.s.ctx;

            self.updateStateCheckboxes({ page: 'all', search: 'none' });

            // If FixedColumns extension is enabled
            if (ctx._oFixedColumns) {
                // Use delay to let FixedColumns construct the header
                // before we update the "Select all" checkbox
                setTimeout(function () {
                    // For every column where checkboxes are enabled
                    $.each(self.s.columns, function (index, colIdx) {
                        self.updateSelectAll(colIdx);
                    });
                }, 0);
            }
        },

        // Updates state of multiple checkboxes
        updateStateCheckboxes: function (opts) {
            var self = this;
            var dt = self.s.dt;
            var ctx = self.s.ctx;

            // Enumerate all cells
            dt.cells('tr', self.s.columns, opts).every(function (rowIdx, colIdx) {
                // Get cell data
                var cellData = this.data();

                // Determine if checkbox in the cell can be selected
                var isCellSelectable = self.isCellSelectable(colIdx, cellData);

                // If checkbox is checked
                if (
                    Object.prototype.hasOwnProperty.call(ctx.checkboxes.s.data, colIdx)
                    && Object.prototype.hasOwnProperty.call(ctx.checkboxes.s.data[colIdx], cellData)
                ) {
                    // If row selection is enabled
                    // and checkbox can be checked
                    if (ctx.aoColumns[colIdx].checkboxes.selectRow && isCellSelectable) {
                        self.updateSelect(rowIdx, true);
                    }

                    self.updateCheckbox(this, colIdx, true);
                }

                // If checkbox is disabled
                if (!isCellSelectable) {
                    $('input.dt-checkboxes', this.node()).prop('disabled', true);
                }
            });
        },

        // Handles checkbox click event
        onClick: function (e, ctrl) {
            var self = this;
            var dt = self.s.dt;
            var ctx = self.s.ctx;

            var cellSelector;

            // Get cell
            var $cell = $(ctrl).closest('td');

            // If cell is in a fixed column using FixedColumns extension
            if ($cell.parents('.DTFC_Cloned').length) {
                cellSelector = dt.fixedColumns().cellIndex($cell);

            } else {
                cellSelector = $cell;
            }

            var cell = dt.cell(cellSelector);
            var cellIdx = cell.index();
            var colIdx = cellIdx.column;
            var rowIdx = cellIdx.row;

            // If row selection is not enabled
            // NOTE: if row selection is enabled, checkbox selection/deselection
            // would be handled by onDataTablesSelectDeselect event handler instead
            if (!ctx.aoColumns[colIdx].checkboxes.selectRow) {
                cell.checkboxes.select(ctrl.checked);

                // Prevent click event from propagating to parent
                e.stopPropagation();

            } else {

                // If Select extension is enabled
                if (ctx._select) {
                    // If style is set to "os"
                    if (ctx._select.style === 'os') {

                        // WORKAROUND:
                        // See https://github.com/gyrocode/jquery-datatables-checkboxes/issues/128

                        // Prevent click event from propagating to parent
                        e.stopPropagation();

                        // Select/deselect individual row
                        cell.checkboxes.select(ctrl.checked);

                        // Otherwise, if style is set to other than "os"
                    } else {
                        // WORKAROUND:
                        // Select extension may keep the row selected
                        // when checkbox is unchecked with SHIFT key.
                        //
                        // We need to update the state of the checkbox AFTER handling
                        // select/deselect event from Select extension.
                        //
                        // Call to setTimeout is needed to let select/deselect event handler
                        // update the data first.
                        setTimeout(function () {
                            // Get cell data
                            var cellData = cell.data();

                            // Determine whether data is in the list
                            var hasData = (
                                Object.prototype.hasOwnProperty.call(self.s.data, colIdx)
                                && Object.prototype.hasOwnProperty.call(self.s.data[colIdx], cellData)
                            );

                            // If state of the checkbox needs to be updated
                            if (hasData !== ctrl.checked) {
                                self.updateCheckbox(cell, colIdx, hasData);
                                self.updateSelectAll(colIdx);
                            }
                        }, 0);
                    }
                }
            }
        },

        // Handles checkbox click event
        onClickSelectAll: function (e, ctrl) {
            var self = this;
            var dt = self.s.dt;
            var ctx = self.s.ctx;

            // Calculate column index
            var colIdx = null;
            var $th = $(ctrl).closest('th');

            // If column is fixed using FixedColumns extension
            if ($th.parents('.DTFC_Cloned').length) {
                var cellIdx = dt.fixedColumns().cellIndex($th);
                colIdx = cellIdx.column;
            } else {
                colIdx = dt.column($th).index();
            }

            // Indicate that state of "Select all" control has been changed
            $(ctrl).data('is-changed', true);

            dt.column(colIdx, {
                page: (
                    (ctx.aoColumns[colIdx].checkboxes && ctx.aoColumns[colIdx].checkboxes.selectAllPages)
                        ? 'all'
                        : 'current'
                ),
                search: 'applied'
            }).checkboxes.select(ctrl.checked);

            // Prevent click event from propagating to parent
            e.stopPropagation();
        },

        // Loads previosly saved sate
        loadState: function () {
            var self = this;
            var dt = self.s.dt;
            var ctx = self.s.ctx;

            // If state saving is enabled
            if (ctx.oFeatures.bStateSave) {
                // Retrieve stored state
                var state = dt.state.loaded();

                // For every column where checkboxes are enabled
                $.each(self.s.columns, function (index, colIdx) {
                    // If state is loaded and contains data for this column
                    if (state && state.checkboxes && state.checkboxes.hasOwnProperty(colIdx)) {
                        // If checkbox state saving is enabled
                        if (ctx.aoColumns[colIdx].checkboxes.stateSave) {
                            // Load previous state
                            self.s.data[colIdx] = state.checkboxes[colIdx];
                        }
                    }
                });
            }
        },

        // Updates state of the "Select all" controls
        updateSelectAll: function (colIdx) {
            var self = this;
            var dt = self.s.dt;
            var ctx = self.s.ctx;

            // If Checkboxes extension is enabled for this column
            // and "Select all" control is enabled for this column
            if (ctx.aoColumns[colIdx].checkboxes && ctx.aoColumns[colIdx].checkboxes.selectAll) {
                var cells = dt.cells('tr', colIdx, {
                    page: (
                        (ctx.aoColumns[colIdx].checkboxes.selectAllPages)
                            ? 'all'
                            : 'current'
                    ),
                    search: 'applied'
                });

                var $tableContainer = dt.table().container();
                var $checkboxesSelectAll = $('.dt-checkboxes-select-all[data-col="' + colIdx + '"] input[type="checkbox"]', $tableContainer);

                var countChecked = 0;
                var countDisabled = 0;
                var cellsData = cells.data();
                $.each(cellsData, function (index, cellData) {
                    // If checkbox is not disabled
                    if (self.isCellSelectable(colIdx, cellData)) {
                        if (
                            Object.prototype.hasOwnProperty.call(self.s.data, colIdx)
                            && Object.prototype.hasOwnProperty.call(self.s.data[colIdx], cellData)
                        ) {
                            countChecked++;
                        }

                        // Otherwise, if checkbox is disabled
                    } else {
                        countDisabled++;
                    }
                });

                // If FixedHeader is enabled in this instance
                if (ctx._fixedHeader) {
                    // If header is floating in this instance
                    if (ctx._fixedHeader.dom['header'].floating) {
                        $checkboxesSelectAll = $('.fixedHeader-floating .dt-checkboxes-select-all[data-col="' + colIdx + '"] input[type="checkbox"]');
                    }
                }

                var isSelected;
                var isIndeterminate;

                // If none of the checkboxes are checked
                if (countChecked === 0) {
                    isSelected = false;
                    isIndeterminate = false;

                    // If all of the checkboxes are checked
                } else if ((countChecked + countDisabled) === cellsData.length) {
                    isSelected = true;
                    isIndeterminate = false;

                    // If some of the checkboxes are checked
                } else {
                    isSelected = true;
                    isIndeterminate = true;
                }

                var isChanged = $checkboxesSelectAll.data('is-changed');
                var isSelectedNow = $checkboxesSelectAll.prop('checked');
                var isIndeterminateNow = $checkboxesSelectAll.prop('indeterminate');

                // If state of "Select all" control has been changed
                if (isChanged || isSelectedNow !== isSelected || isIndeterminateNow !== isIndeterminate) {
                    // Reset "Select all" control state flag
                    $checkboxesSelectAll.data('is-changed', false);

                    $checkboxesSelectAll.prop({
                        // NOTE: If checkbox has indeterminate state,
                        // "checked" property must be set to false.
                        'checked': isIndeterminate ? false : isSelected,
                        'indeterminate': isIndeterminate
                    });

                    // If selectAllCallback is a function
                    if ($.isFunction(ctx.aoColumns[colIdx].checkboxes.selectAllCallback)) {
                        ctx.aoColumns[colIdx].checkboxes.selectAllCallback($checkboxesSelectAll.closest('th').get(0), isSelected, isIndeterminate);
                    }
                }
            }
        },

        // Updates the information element of the DataTable showing information about the
        // items selected. Based on info() method of Select extension.
        showInfoSelected: function () {
            var self = this;
            var dt = self.s.dt;
            var ctx = self.s.ctx;

            if (!ctx.aanFeatures.i) {
                return;
            }

            // Get index of the first column that has checkbox and row selection enabled
            var colIdx = self.getSelectRowColIndex();

            // If there is a column that has checkbox and row selection enabled
            if (colIdx !== null) {
                // Count number of selected rows
                var countRows = 0;
                for (var cellData in ctx.checkboxes.s.data[colIdx]) {
                    if (
                        Object.prototype.hasOwnProperty.call(ctx.checkboxes.s.data, colIdx)
                        && Object.prototype.hasOwnProperty.call(ctx.checkboxes.s.data[colIdx], cellData)
                    ) {
                        countRows++;
                    }
                }

                var add = function ($el, name, num) {
                    $el.append($('<span class="select-item"/>').append(dt.i18n(
                        'select.' + name + 's',
                        { _: '%d ' + name + 's selected', 0: '', 1: '1 ' + name + ' selected' },
                        num
                    )));
                };

                // Internal knowledge of DataTables to loop over all information elements
                $.each(ctx.aanFeatures.i, function (i, el) {
                    var $el = $(el);

                    var $output = $('<span class="select-info"/>');
                    add($output, 'row', countRows);

                    var $existing = $el.children('span.select-info');
                    if ($existing.length) {
                        $existing.remove();
                    }

                    if ($output.text() !== '') {
                        $el.append($output);
                    }
                });
            }
        },

        // Determines whether checkbox in the cell can be checked
        isCellSelectable: function (colIdx, cellData) {
            var self = this;
            var ctx = self.s.ctx;

            // If data is in the list of disabled elements
            if (
                Object.prototype.hasOwnProperty.call(ctx.checkboxes.s.dataDisabled, colIdx)
                && Object.prototype.hasOwnProperty.call(ctx.checkboxes.s.dataDisabled[colIdx], cellData)
            ) {
                return false;

                // Otherwise, if checkbox can be selected
            } else {
                return true;
            }
        },

        // Gets cell index
        getCellIndex: function (cell) {
            var self = this;
            var dt = self.s.dt;
            var ctx = self.s.ctx;

            // If FixedColumns extension is available
            if (ctx._oFixedColumns) {
                return dt.fixedColumns().cellIndex(cell);

            } else {
                return dt.cell(cell).index();
            }
        },

        // Gets index of the first column that has checkbox and row selection enabled
        getSelectRowColIndex: function () {
            var self = this;
            var ctx = self.s.ctx;

            var colIdx = null;

            for (var i = 0; i < ctx.aoColumns.length; i++) {
                // If Checkboxes extension is enabled
                // and row selection is enabled for this column
                if (ctx.aoColumns[i].checkboxes && ctx.aoColumns[i].checkboxes.selectRow) {
                    colIdx = i;
                    break;
                }
            }

            return colIdx;
        },

        // Updates fixed column if FixedColumns extension is enabled
        // and given column is inside a fixed column
        updateFixedColumn: function (colIdx) {
            var self = this;
            var dt = self.s.dt;
            var ctx = self.s.ctx;

            // If FixedColumns extension is enabled
            if (ctx._oFixedColumns) {
                var leftCols = ctx._oFixedColumns.s.iLeftColumns;
                var rightCols = ctx.aoColumns.length - ctx._oFixedColumns.s.iRightColumns - 1;

                if (colIdx < leftCols || colIdx > rightCols) {
                    // Update the data shown in the fixed column
                    dt.fixedColumns().update();

                    // Use delay to let FixedColumns construct the header
                    // before we update the "Select all" checkbox
                    setTimeout(function () {
                        // For every column where checkboxes are enabled
                        $.each(self.s.columns, function (index, colIdx) {
                            self.updateSelectAll(colIdx);
                        });
                    }, 0);
                }
            }
        }
    };


    /**
    * Checkboxes default settings for initialisation
    *
    * @namespace
    * @name Checkboxes.defaults
    * @static
    */
    Checkboxes.defaults = {
        /**
        * Enable / disable checkbox state loading/saving if state saving is enabled globally
        *
        * @type {Boolean}
        * @default `true`
        */
        stateSave: true,

        /**
        * Enable / disable row selection
        *
        * @type {Boolean}
        * @default `false`
        */
        selectRow: false,

        /**
        * Enable / disable "select all" control in the header
        *
        * @type {Boolean}
        * @default `true`
        */
        selectAll: true,

        /**
        * Enable / disable ability to select checkboxes from all pages
        *
        * @type {Boolean}
        * @default `true`
        */
        selectAllPages: true,

        /**
        * Checkbox select/deselect callback
        *
        * @type {Function}
        * @default  `null`
        */
        selectCallback: null,

        /**
        * "Select all" control select/deselect callback
        *
        * @type {Function}
        * @default  `null`
        */
        selectAllCallback: null,

        /**
        * "Select all" control markup
        *
        * @type {mixed}
        * @default `<input type="checkbox">`
        */
        selectAllRender: '<input type="checkbox" autocomplete="off">'
    };


    /*
    * API
    */
    var Api = $.fn.dataTable.Api;

    // Doesn't do anything - work around for a bug in DT... Not documented
    Api.register('checkboxes()', function () {
        return this;
    });

    Api.registerPlural('columns().checkboxes.select()', 'column().checkboxes.select()', function (state) {
        if (typeof state === 'undefined') { state = true; }

        return this.iterator('column-rows', function (ctx, colIdx, i, j, rowsIdx) {
            // If Checkboxes extension is enabled for this column
            if (ctx.aoColumns[colIdx].checkboxes) {
                // Prepare a list of all cells
                var selector = [];
                $.each(rowsIdx, function (index, rowIdx) {
                    selector.push({ row: rowIdx, column: colIdx });
                });

                var cells = this.cells(selector);
                var cellsData = cells.data();

                // Prepare a list of cells that contain checkboxes that can be selected
                var rowsSelectableIdx = [];
                selector = [];
                $.each(cellsData, function (index, cellData) {
                    // If checkbox in the cell can be selected
                    if (ctx.checkboxes.isCellSelectable(colIdx, cellData)) {
                        selector.push({ row: rowsIdx[index], column: colIdx });
                        rowsSelectableIdx.push(rowsIdx[index]);
                    }
                });

                cells = this.cells(selector);

                ctx.checkboxes.updateData(cells, colIdx, state);

                // If row selection is enabled
                if (ctx.aoColumns[colIdx].checkboxes.selectRow) {
                    ctx.checkboxes.updateSelect(rowsSelectableIdx, state);
                }

                ctx.checkboxes.updateCheckbox(cells, colIdx, state);

                ctx.checkboxes.updateSelectAll(colIdx);

                ctx.checkboxes.updateFixedColumn(colIdx);
            }
        }, 1);
    });

    Api.registerPlural('cells().checkboxes.select()', 'cell().checkboxes.select()', function (state) {
        if (typeof state === 'undefined') { state = true; }

        return this.iterator('cell', function (ctx, rowIdx, colIdx) {
            // If Checkboxes extension is enabled for this column
            if (ctx.aoColumns[colIdx].checkboxes) {
                var cells = this.cells([{ row: rowIdx, column: colIdx }]);
                var cellData = this.cell({ row: rowIdx, column: colIdx }).data();

                // If checkbox in the cell can be selected
                if (ctx.checkboxes.isCellSelectable(colIdx, cellData)) {
                    ctx.checkboxes.updateData(cells, colIdx, state);

                    // If row selection is enabled
                    if (ctx.aoColumns[colIdx].checkboxes.selectRow) {
                        ctx.checkboxes.updateSelect(rowIdx, state);
                    }

                    ctx.checkboxes.updateCheckbox(cells, colIdx, state);

                    ctx.checkboxes.updateSelectAll(colIdx);

                    ctx.checkboxes.updateFixedColumn(colIdx);
                }
            }
        }, 1);
    });

    Api.registerPlural('cells().checkboxes.enable()', 'cell().checkboxes.enable()', function (state) {
        if (typeof state === 'undefined') { state = true; }

        return this.iterator('cell', function (ctx, rowIdx, colIdx) {
            // If Checkboxes extension is enabled for this column
            if (ctx.aoColumns[colIdx].checkboxes) {
                var cell = this.cell({ row: rowIdx, column: colIdx });

                // Get cell data
                var cellData = cell.data();

                // If checkbox should be enabled
                if (state) {
                    delete ctx.checkboxes.s.dataDisabled[colIdx][cellData];

                    // Otherwise, if checkbox should be disabled
                } else {
                    ctx.checkboxes.s.dataDisabled[colIdx][cellData] = 1;
                }

                // Determine if cell node is available
                // (deferRender is not enabled or cell has been already created)
                var cellNode = cell.node();
                if (cellNode) {
                    $('input.dt-checkboxes', cellNode).prop('disabled', !state);
                }

                // If row selection is enabled
                // and checkbox can be checked
                if (ctx.aoColumns[colIdx].checkboxes.selectRow) {
                    // If data is in the list
                    if (
                        Object.prototype.hasOwnProperty.call(ctx.checkboxes.s.data, colIdx)
                        && Object.prototype.hasOwnProperty.call(ctx.checkboxes.s.data[colIdx], cellData)
                    ) {
                        // Update selection based on current state:
                        // if checkbox is enabled then select row;
                        // otherwise, deselect row
                        ctx.checkboxes.updateSelect(rowIdx, state);
                    }
                }
            }
        }, 1);
    });

    Api.registerPlural('cells().checkboxes.disable()', 'cell().checkboxes.disable()', function (state) {
        if (typeof state === 'undefined') { state = true; }
        return this.checkboxes.enable(!state);
    });

    Api.registerPlural('columns().checkboxes.deselect()', 'column().checkboxes.deselect()', function (state) {
        if (typeof state === 'undefined') { state = true; }
        return this.checkboxes.select(!state);
    });

    Api.registerPlural('cells().checkboxes.deselect()', 'cell().checkboxes.deselect()', function (state) {
        if (typeof state === 'undefined') { state = true; }
        return this.checkboxes.select(!state);
    });

    Api.registerPlural('columns().checkboxes.deselectAll()', 'column().checkboxes.deselectAll()', function () {
        return this.iterator('column', function (ctx, colIdx) {
            // If Checkboxes extension is enabled for this column
            if (ctx.aoColumns[colIdx].checkboxes) {
                ctx.checkboxes.s.data[colIdx] = {};

                this.column(colIdx).checkboxes.select(false);
            }
        }, 1);
    });

    Api.registerPlural('columns().checkboxes.selected()', 'column().checkboxes.selected()', function () {
        return this.iterator('column-rows', function (ctx, colIdx, i, j, rowsIdx) {

            // If Checkboxes extension is enabled for this column
            if (ctx.aoColumns[colIdx].checkboxes) {
                var data = [];

                // If server-side processing mode is enabled
                if (ctx.oFeatures.bServerSide) {
                    $.each(ctx.checkboxes.s.data[colIdx], function (cellData) {
                        // If checkbox in the cell can be checked
                        if (ctx.checkboxes.isCellSelectable(colIdx, cellData)) {
                            data.push(cellData);
                        }
                    });

                    // Otherwise, if server-side processing mode is not enabled
                } else {
                    // Prepare a list of all cells
                    var selector = [];
                    $.each(rowsIdx, function (index, rowIdx) {
                        selector.push({ row: rowIdx, column: colIdx });
                    });

                    // Get all cells data
                    var cells = this.cells(selector);
                    var cellsData = cells.data();

                    // Enumerate all cells data
                    $.each(cellsData, function (index, cellData) {
                        // If checkbox is checked
                        if (
                            Object.prototype.hasOwnProperty.call(ctx.checkboxes.s.data, colIdx)
                            && Object.prototype.hasOwnProperty.call(ctx.checkboxes.s.data[colIdx], cellData)
                        ) {
                            // If checkbox in the cell can be selected
                            if (ctx.checkboxes.isCellSelectable(colIdx, cellData)) {
                                data.push(cellData);
                            }
                        }
                    });
                }

                return data;

            } else {
                return [];
            }
        }, 1);
    });


    /**
     * Version information
     *
     * @name Checkboxes.version
     * @static
     */
    Checkboxes.version = '1.2.13';



    $.fn.DataTable.Checkboxes = Checkboxes;
    $.fn.dataTable.Checkboxes = Checkboxes;


    // Attach a listener to the document which listens for DataTables initialisation
    // events so we can automatically initialise
    $(document).on('preInit.dt.dtCheckboxes', function (e, settings /*, json */) {
        if (e.namespace !== 'dt') {
            return;
        }

        new Checkboxes(settings);
    });


    return Checkboxes;
}));

/*! DataTables Editor v2.0.10
 *
 * ©2012-2022 SpryMedia Ltd, all rights reserved.
 * License: editor.datatables.net/license
 */

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery', 'datatables.net'], function ($) {
            return factory($, window, document);
        });
    }
    else if (typeof exports === 'object') {
        // CommonJS
        module.exports = function (root, $) {
            if (!root) {
                // CommonJS environments without a window global must pass a
                // root. This will give an error otherwise
                root = window;
            }

            if (!$) {
                $ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window
                    require('jquery') :
                    require('jquery')(root);
            }

            if (!$.fn.dataTable) {
                require('datatables.net')(root, $);
            }


            return factory($, root, root.document);
        };
    }
    else {
        // Browser
        factory(jQuery, window, document);
    }
}(function ($, window, document, undefined) {
    'use strict';
    var DataTable = $.fn.dataTable;

    var formOptions = {
        buttons: true,
        drawType: false,
        focus: 0,
        message: true,
        nest: false,
        onBackground: 'blur',
        onBlur: 'close',
        onComplete: 'close',
        onEsc: 'close',
        onFieldError: 'focus',
        onReturn: 'submit',
        scope: 'row',
        submit: 'all',
        submitHtml: '▶',
        submitTrigger: null,
        title: true
    };

    var defaults$1 = {
        /**
         * Parameter name to use to submit data to the server.
         *
         * @type string
         */
        actionName: 'action',
        /**
         * Control how the Ajax call to update data on the server.
         *
         * This option matches the `dt-init ajax` option in that is can be provided
         * in one of three different ways:
         *
         * * string - As a string, the value given is used as the url to target
         * the Ajax request to, using the default Editor Ajax options. Note that
         * for backwards compatibility you can use the form "METHOD URL" - for
         * example: `"PUT api/users"`, although it is recommended you use the
         * object form described below.
         * * object - As an object, the `ajax` property has two forms:
         * * Used to extend and override the default Ajax options that Editor
         * uses. This can be very useful for adding extra data for example, or
         * changing the HTTP request type.
         * * With `create`, `edit` and `remove` properties, Editor will use the
         * option for the action that it is taking, which can be useful for
         * REST style interfaces. The value of each property can be a string,
         * object or function, using exactly the same options as the main `ajax`
         * option. All three options must be defined if this form is to be used.
         * * function - As a function this gives complete control over the method
         * used to update the server (if indeed a server is being used!). For
         * example, you could use a different data store such as localStorage,
         * Firebase or route the data through a web-socket.
         *
         * @example
         *    // As a string - all actions are submitted to this URI as POST requests
         *    $(document).ready(function() {
         *      var editor = new $.fn.Editor( {
         *        "ajax": 'php/index.php',
         *        "table": "#example"
         *      } );
         *    } );
         *
         * @example
         *    // As an object - using GET rather than POST
         *    $(document).ready(function() {
         *      var editor = new $.fn.Editor( {
         *        "ajax": {
         *          "type": 'GET',
         *          "url": 'php/index.php
         *        },
         *        "table": "#example"
         *      } );
         *    } );
         *
         * @example
         *    // As an object - each action is submitted to a different URI as POST requests
         *    $(document).ready(function() {
         *      var editor = new $.fn.Editor( {
         *        "ajax": {
         *          "create": "/rest/user/create",
         *          "edit":   "/rest/user/_id_/edit",
         *          "remove": "/rest/user/_id_/delete"
         *        },
         *        "table": "#example"
         *      } );
         *    } );
         *
         * @example
         *    // As an object - with different HTTP methods for each action
         *    $(document).ready(function() {
         *      var editor = new $.fn.Editor( {
         *        "ajax": {
         *          "create": {
         *          	type: 'POST',
         *          	url:  '/rest/user/create'
         *          },
         *          "edit": {
         *          	type: 'PUT',
         *          	url:  '/rest/user/edit/_id_'
         *          },
         *          "remove": {
         *          	type: 'DELETE',
         *          	url:  '/rest/user/delete'
         *          }
         *        },
         *        "table": "#example"
         *      } );
         *    } );
         *
         *    // As a function - Making a custom `$.ajax` call
         *    $(document).ready(function() {
         *      var editor = new $.fn.Editor( {
         *        "table": "#example",
         *        "ajax": function ( method, url, data, successCallback, errorCallback ) {
         *          $.ajax( {
         *            "type": method,
         *            "url":  url,
         *            "data": data,
         *            "dataType": "json",
         *            "success": function (json) {
         *              successCallback( json );
         *            },
         *            "error": function (xhr, error, thrown) {
         *              errorCallback( xhr, error, thrown );
         *            }
         *          } );
         *        }
         *      } );
         *    } );
         */
        ajax: null,
        /**
         * The display controller for the form. The form itself is just a collection of
         * DOM elements which require a display container. This display controller allows
         * the visual appearance of the form to be significantly altered without major
         * alterations to the Editor code. There are two display controllers built into
         * Editor *lightbox* and *envelope*. The value of this property will
         * be used to access the display controller defined in {@link Editor.display}
         * for the given name. Additional display controllers can be added by adding objects
         * to that object, through extending the displayController model:
         * {@link Editor.models.displayController}.
         *
         * @type string
         * @default lightbox
         *
         * @example
         *    $(document).ready(function() {
         *      var editor = new $.fn.Editor( {
         *        "ajax": "php/index.php",
         *        "table": "#example",
         *        "display": 'envelope'
         *      } );
         *    } );
         */
        display: 'lightbox',
        /**
         * Events / callbacks - event handlers can be assigned as an individual function
         * during initialisation using the parameters in this name space. The names, and
         * the parameters passed to each callback match their event equivalent in the
         * {@link Editor} object.
         *
         * @namespace
         * @deprecated Since 1.3. Use the `on()` API method instead. Note that events
         * passed in do still operate as they did in 1.2- but are no longer
         * individually documented.
         */
        events: {},
        /**
         * Fields to initialise the form with - see {@link Editor.models.field} for
         * a full list of the options available to each field. Note that if fields are not
         * added to the form at initialisation time using this option, they can be added using
         * the {@link Editor#add} API method.
         *
         * @type array
         * @default []
         *
         * @example
         *    $(document).ready(function() {
         *      var editor = new $.fn.Editor( {
         *        "ajax": "php/index.php",
         *        "table": "#example",
         *        "fields": [ {
         *            "label": "User name:",
         *            "name": "username"
         *          }
         *          // More fields would typically be added here!
         *        } ]
         *      } );
         *    } );
         */
        fields: [],
        formOptions: {
            bubble: $.extend({}, formOptions, {
                buttons: '_basic',
                message: false,
                submit: 'changed',
                title: false
            }),
            inline: $.extend({}, formOptions, {
                buttons: false,
                submit: 'changed'
            }),
            main: $.extend({}, formOptions)
        },
        /**
         * Internationalisation options for Editor. All client-side strings that the
         * end user can see in the interface presented by Editor can be modified here.
         *
         * You may also wish to refer to the <a href="http://datatables.net/usage/i18n">
         * DataTables internationalisation options</a> to provide a fully language
         * customised table interface.
         *
         * @namespace
         *
         * @example
         *    // Set the 'create' button text. All other strings used are the
         *    // default values.
         *    var editor = new $.fn.Editor( {
         *      "ajax": "data/source",
         *      "table": "#example",
         *      "i18n": {
         *        "create": {
         *          "button": "New user"
         *        }
         *      }
         *    } );
         *
         * @example
         *    // Set the submit text for all three actions
         *    var editor = new $.fn.Editor( {
         *      "ajax": "data/source",
         *      "table": "#example",
         *      "i18n": {
         *        "create": {
         *          "submit": "Create new user"
         *        },
         *        "edit": {
         *          "submit": "Update user"
         *        },
         *        "remove": {
         *          "submit": "Remove user"
         *        }
         *      }
         *    } );
         */
        i18n: {
            /**
             * Close button title text
             *
             * @type string
             * @default Close
             */
            close: 'Close',
            /**
             * Strings used when working with the Editor 'create' action (creating new
             * records).
             *
             * @namespace
             */
            create: {
                /**
                 * Buttons button text
                 *
                 * @type string
                 * @default New
                 */
                button: 'New',
                /**
                 * Submit button text
                 *
                 * @type string
                 * @default Create
                 */
                submit: 'Create',
                /**
                 * Display container title (when showing the editor display)
                 *
                 * @type string
                 * @default Create new entry
                 */
                title: 'Create new entry'
            },
            datetime: {
                amPm: ['am', 'pm'],
                hours: 'Hour',
                minutes: 'Minute',
                months: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'
                ],
                next: 'Next',
                previous: 'Previous',
                seconds: 'Second',
                unknown: '-',
                weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            },
            /**
             * Strings used when working with the Editor 'edit' action (editing existing
             * records).
             *
             * @namespace
             */
            edit: {
                /**
                 * Buttons button text
                 *
                 * @type string
                 * @default Edit
                 */
                button: 'Edit',
                /**
                 * Submit button text
                 *
                 * @type string
                 * @default Update
                 */
                submit: 'Update',
                /**
                 * Display container title (when showing the editor display)
                 *
                 * @type string
                 * @default Edit entry
                 */
                title: 'Edit entry'
            },
            /**
             * Strings used for error conditions.
             *
             * @namespace
             */
            error: {
                /**
                 * Generic server error message
                 *
                 * @type string
                 * @default
                 * A system error has occurred (<a target=\"_blank\" href=\"//datatables.net/tn/12\">More information</a>)
                 */
                system: 'A system error has occurred (<a target="_blank" href="//datatables.net/tn/12">More information</a>).'
            },
            /**
             * Strings used for multi-value editing
             *
             * @namespace
             */
            multi: {
                /**
                 * Shown below the multi title text, although only the first
                 * instance of this text is shown in the form to reduce redundancy
                 */
                info: 'The selected items contain different values for this input. To edit and set all items for this input to the same value, click or tap here, otherwise they will retain their individual values.',
                /**
                 * Disabled for multi-row editing
                 */
                noMulti: 'This input can be edited individually, but not part of a group.',
                /**
                 * Shown below the field input when group editing a value to allow
                 * the user to return to the original multiple values
                 */
                restore: 'Undo changes',
                /**
                 * Shown in place of the field value when a field has multiple values
                 */
                title: 'Multiple values'
            },
            /**
             * Strings used when working with the Editor 'delete' action (deleting
             * existing records).
             *
             * @namespace
             */
            remove: {
                /**
                 * Buttons button text
                 *
                 * @type string
                 * @default Delete
                 */
                button: 'Delete',
                /**
                 * Deletion confirmation message.
                 *
                 * As Editor has the ability to delete either a single or multiple rows
                 * at a time, this option can be given as either a string (which will be
                 * used regardless of how many records are selected) or as an object
                 * where the property "_" will be used (with %d substituted for the number
                 * of records to be deleted) as the delete message, unless there is a
                 * key with the number of records to be deleted. This allows Editor
                 * to consider the different pluralisation characteristics of different
                 * languages.
                 *
                 * @type object|string
                 * @default Are you sure you wish to delete %d rows?
                 *
                 * @example
                 *    // String - no plural consideration
                 *    var editor = new $.fn.Editor( {
                 *      "ajax": "data/source",
                 *      "table": "#example",
                 *      "i18n": {
                 *        "remove": {
                 *          "confirm": "Are you sure you wish to delete %d record(s)?"
                 *        }
                 *      }
                 *    } );
                 *
                 * @example
                 *    // Basic 1 (singular) or _ (plural)
                 *    var editor = new $.fn.Editor( {
                 *      "ajax": "data/source",
                 *      "table": "#example",
                 *      "i18n": {
                 *        "remove": {
                 *          "confirm": {
                 *            "_": "Confirm deletion of %d records.",
                 *            "1": "Confirm deletion of record."
                 *        }
                 *      }
                 *    } );
                 *
                 * @example
                 *    // Singular, dual and plural
                 *    var editor = new $.fn.Editor( {
                 *      "ajax": "data/source",
                 *      "table": "#example",
                 *      "i18n": {
                 *        "remove": {
                 *          "confirm": {
                 *            "_": "Confirm deletion of %d records.",
                 *            "1": "Confirm deletion of record.",
                 *            "2": "Confirm deletion of both record."
                 *        }
                 *      }
                 *    } );
                 *
                 */
                confirm: {
                    1: 'Are you sure you wish to delete 1 row?',
                    _: 'Are you sure you wish to delete %d rows?'
                },
                /**
                 * Submit button text
                 *
                 * @type string
                 * @default Delete
                 */
                submit: 'Delete',
                /**
                 * Display container title (when showing the editor display)
                 *
                 * @type string
                 * @default Delete
                 */
                title: 'Delete',
            }
        },
        /**
         * JSON property from which to read / write the row's ID property (i.e. its
         * unique column index that identifies the row to the database). By default
         * Editor will use the `DT_RowId` property from the data source object
         * (DataTable's magic property to set the DOM id for the row).
         *
         * If you want to read a parameter from the data source object instead of
         * using `DT_RowId`, set this option to the property name to use.
         *
         * Like other data source options the `srcId` option can be given in dotted
         * object notation to read nested objects.
         *
         * @type null|string
         * @default DT_RowId
         *
         * @example
         *    // Using a data source such as:
         *    // { "id":12, "browser":"Chrome", ... }
         *    $(document).ready(function() {
         *      var editor = new $.fn.Editor( {
         *        "ajax": "php/index.php",
         *        "table": "#example",
         *        "idSrc": "id"
         *      } );
         *    } );
         */
        idSrc: 'DT_RowId',
        /**
         * jQuery selector that can be used to identify the table you wish to apply
         * this editor instance to.
         *
         * In previous versions of Editor (1.2 and earlier), this parameter was
         * called `table`. The name has been altered in 1.3+ to simplify the
         * initialisation. This is a backwards compatible change - if you pass in
         * a `table` option it will be used.
         *
         * @type string
         * @default <i>Empty string</i>
         *
         * @example
         *    $(document).ready(function() {
         *      var editor = new $.fn.Editor( {
         *        "ajax": "php/index.php",
         *        "table": "#example"
         *      } );
         *    } );
         */
        table: null,
    };

    var settings = {
        action: null,
        actionName: 'action',
        ajax: null,
        bubbleNodes: [],
        closeCb: null,
        closeIcb: null,
        dataSource: null,
        displayController: null,
        displayed: false,
        editCount: 0,
        editData: {},
        editFields: {},
        editOpts: {},
        fields: {},
        formOptions: {
            bubble: $.extend({}, formOptions),
            inline: $.extend({}, formOptions),
            main: $.extend({}, formOptions),
        },
        globalError: '',
        id: -1,
        idSrc: null,
        includeFields: [],
        mode: null,
        modifier: null,
        opts: null,
        order: [],
        processing: false,
        setFocus: null,
        table: null,
        template: null,
        unique: 0
    };

    var DataTable$6 = $.fn.dataTable;
    var DtInternalApi = DataTable$6.ext.oApi;
    function objectKeys(o) {
        var out = [];
        for (var key in o) {
            if (o.hasOwnProperty(key)) {
                out.push(key);
            }
        }
        return out;
    }
    function el(tag, ctx) {
        if (ctx === undefined) {
            ctx = document;
        }
        return $('*[data-dte-e="' + tag + '"]', ctx);
    }
    function safeDomId(id, prefix) {
        if (prefix === void 0) { prefix = '#'; }
        return typeof id === 'string' ?
            prefix + id.replace(/\./g, '-') :
            prefix + id;
    }
    function safeQueryId(id, prefix) {
        if (prefix === void 0) { prefix = '#'; }
        return typeof id === 'string' ?
            prefix + id.replace(/(:|\.|\[|\]|,)/g, '\\$1') :
            prefix + id;
    }
    function dataGet(src) {
        return DtInternalApi._fnGetObjectDataFn(src);
    }
    function dataSet(src) {
        return DtInternalApi._fnSetObjectDataFn(src);
    }
    var extend = DtInternalApi._fnExtend;
    function pluck(a, prop) {
        var out = [];
        $.each(a, function (idx, elIn) {
            out.push(elIn[prop]);
        });
        return out;
    }
    /**
     * Compare parameters for difference - diving into arrays and objects if
     * needed, allowing the object reference to be different, but the contents to
     * match.
     *
     * Please note that LOOSE type checking is used
     */
    function deepCompare(o1, o2) {
        if (typeof o1 !== 'object' || typeof o2 !== 'object') {
            return o1 == o2;
        }
        var o1Props = objectKeys(o1);
        var o2Props = objectKeys(o2);
        if (o1Props.length !== o2Props.length) {
            return false;
        }
        for (var i = 0, ien = o1Props.length; i < ien; i++) {
            var propName = o1Props[i];
            if (typeof o1[propName] === 'object') {
                if (!deepCompare(o1[propName], o2[propName])) {
                    return false;
                }
            }
            else if (o1[propName] != o2[propName]) {
                return false;
            }
        }
        return true;
    }

    /* -  -  -  -  -  -  -  -  -  -
     * DataTables editor interface
     */
    var _dtIsSsp = function (dt, editor) {
        // If the draw type is `none`, then we still need to use the DT API to
        // update the display with the new data
        return dt.settings()[0].oFeatures.bServerSide &&
            editor.s.editOpts.drawType !== 'none';
    };
    var _dtApi = function (table) {
        return table instanceof $.fn.dataTable.Api
            ? table
            : $(table).DataTable();
    };
    var _dtHighlight = function (node) {
        // Highlight a row using CSS transitions. The timeouts need to match the
        // transition duration from the CSS
        node = $(node);
        setTimeout(function () {
            node.addClass('highlight');
            setTimeout(function () {
                node
                    .addClass('noHighlight')
                    .removeClass('highlight');
                setTimeout(function () {
                    node.removeClass('noHighlight');
                }, 550);
            }, 500);
        }, 20);
    };
    var _dtRowSelector = function (out, dt, identifier, fields, idFn) {
        dt.rows(identifier).indexes().each(function (idx) {
            var row = dt.row(idx);
            var data = row.data();
            var idSrc = idFn(data);
            if (idSrc === undefined) {
                Editor.error('Unable to find row identifier', 14);
            }
            out[idSrc] = {
                data: data,
                fields: fields,
                idSrc: idSrc,
                node: row.node(),
                type: 'row'
            };
        });
    };
    var _dtFieldsFromIdx = function (dt, fields, idx, ignoreUnknown) {
        var col = dt.settings()[0].aoColumns[idx];
        var dataSrc = col.editField !== undefined ?
            col.editField :
            col.mData;
        var resolvedFields = {};
        var run = function (field, dataSrcIn) {
            if (field.name() === dataSrcIn) {
                resolvedFields[field.name()] = field;
            }
        };
        $.each(fields, function (name, fieldInst) {
            if (Array.isArray(dataSrc)) {
                for (var _i = 0, dataSrc_1 = dataSrc; _i < dataSrc_1.length; _i++) {
                    var data = dataSrc_1[_i];
                    run(fieldInst, data);
                }
            }
            else {
                run(fieldInst, dataSrc);
            }
        });
        if ($.isEmptyObject(resolvedFields) && !ignoreUnknown) {
            Editor.error('Unable to automatically determine field from source. Please specify the field name.', 11);
        }
        return resolvedFields;
    };
    var _dtCellSelector = function (out, dt, identifier, allFields, idFn, forceFields) {
        if (forceFields === void 0) { forceFields = null; }
        var cells = dt.cells(identifier);
        cells.indexes().each(function (idx) {
            var cell = dt.cell(idx);
            var row = dt.row(idx.row);
            var data = row.data();
            var idSrc = idFn(data);
            var fields = forceFields || _dtFieldsFromIdx(dt, allFields, idx.column, cells.count() > 1);
            var isNode = (typeof identifier === 'object' && identifier.nodeName) || identifier instanceof $;
            var prevDisplayFields;
            var prevAttach;
            var prevAttachFields;
            // Only add if a field was found to edit
            if (Object.keys(fields).length) {
                // The row selector will create a new `out` object for the identifier, and the
                // cell selector might be called multiple times for a row, so we need to save
                // our specific items
                if (out[idSrc]) {
                    prevAttach = out[idSrc].attach;
                    prevAttachFields = out[idSrc].attachFields;
                    prevDisplayFields = out[idSrc].displayFields;
                }
                // Use the row selector to get the row information
                _dtRowSelector(out, dt, idx.row, allFields, idFn);
                out[idSrc].attachFields = prevAttachFields || [];
                out[idSrc].attachFields.push(Object.keys(fields));
                out[idSrc].attach = prevAttach || [];
                out[idSrc].attach.push(isNode ?
                    $(identifier).get(0) :
                    cell.fixedNode ? // If its under a fixed column, get the floating node
                        cell.fixedNode() :
                        cell.node());
                out[idSrc].displayFields = prevDisplayFields || {};
                $.extend(out[idSrc].displayFields, fields);
            }
        });
    };
    var _dtColumnSelector = function (out, dt, identifier, fields, idFn) {
        dt.cells(null, identifier).indexes().each(function (idx) {
            _dtCellSelector(out, dt, idx, fields, idFn);
        });
    };
    var dataSource$1 = {
        commit: function (action, identifier, data, store) {
            // Updates complete - redraw
            var that = this;
            var dt = _dtApi(this.s.table);
            var ssp = dt.settings()[0].oFeatures.bServerSide;
            var ids = store.rowIds;
            // On edit, if there are any rows left in the `store.rowIds`, then they
            // were not returned by the server and should be removed (they might not
            // meet filtering requirements any more for example)
            if (!_dtIsSsp(dt, this) && action === 'edit' && store.rowIds.length) {
                var row = void 0;
                var compare = function (id) {
                    return function (rowIdx, rowData, rowNode) {
                        return id == dataSource$1.id.call(that, rowData);
                    };
                };
                for (var i = 0, ien = ids.length; i < ien; i++) {
                    // Find the row to edit - attempt to do an id look up first for speed
                    try {
                        row = dt.row(safeQueryId(ids[i]));
                    }
                    catch (e) {
                        row = dt;
                    }
                    // If not found, then we need to do it the slow way
                    if (!row.any()) {
                        row = dt.row(compare(ids[i]));
                    }
                    if (row.any() && !ssp) {
                        row.remove();
                    }
                }
            }
            var drawType = this.s.editOpts.drawType;
            if (drawType !== 'none') {
                var dtAny = dt;
                // SSP highlighting has to go after the draw, but this can't be
                // merged with client-side processing highlight as we want that
                // to work even when there isn't a draw happening.
                if (ssp && ids && ids.length) {
                    dt.one('draw', function () {
                        for (var i = 0, ien = ids.length; i < ien; i++) {
                            var row = dt.row(safeQueryId(ids[i]));
                            if (row.any()) {
                                _dtHighlight(row.node());
                            }
                        }
                    });
                }
                dt.draw(drawType);
                // Responsive needs to take account of new data column widths
                if (dtAny.responsive) {
                    dtAny.responsive.recalc();
                }
                // Rebuild searchpanes
                if (typeof dtAny.searchPanes === 'function' && !ssp) {
                    dtAny.searchPanes.rebuildPane(undefined, true);
                }
                // Rebuild searchbuilder
                if (dtAny.searchBuilder !== undefined && typeof dtAny.searchBuilder.rebuild === 'function' && !ssp) {
                    dtAny.searchBuilder.rebuild(dtAny.searchBuilder.getDetails());
                }
            }
        },
        create: function (fields, data) {
            var dt = _dtApi(this.s.table);
            if (!_dtIsSsp(dt, this)) {
                var row = dt.row.add(data);
                _dtHighlight(row.node());
            }
        },
        edit: function (identifier, fields, data, store) {
            var that = this;
            var dt = _dtApi(this.s.table);
            // No point in doing anything when server-side processing - the commit
            // will redraw the table
            if (!_dtIsSsp(dt, this) || this.s.editOpts.drawType === 'none') {
                // The identifier can select one or more rows, but the data will
                // refer to just a single row. We need to determine which row from
                // the set is the one to operator on.
                var rowId_1 = dataSource$1.id.call(this, data);
                var row = void 0;
                // Find the row to edit - attempt to do an id look up first for speed
                try {
                    row = dt.row(safeQueryId(rowId_1));
                }
                catch (e) {
                    row = dt;
                }
                // If not found, then we need to do it the slow way
                if (!row.any()) {
                    row = dt.row(function (rowIdx, rowData, rowNode) {
                        return rowId_1 == dataSource$1.id.call(that, rowData);
                    });
                }
                if (row.any()) {
                    // Merge data to allow for a sub-set to be returned
                    var toSave = extend({}, row.data(), true);
                    toSave = extend(toSave, data, true);
                    row.data(toSave);
                    // Remove the item from the list of indexes now that is has been
                    // updated
                    var idx = $.inArray(rowId_1, store.rowIds);
                    store.rowIds.splice(idx, 1);
                }
                else {
                    // If not found, then its a new row (change in pkey possibly)
                    row = dt.row.add(data);
                }
                _dtHighlight(row.node());
            }
        },
        fakeRow: function (insertPoint) {
            var dt = _dtApi(this.s.table);
            var tr = $('<tr class="dte-inlineAdd">');
            var attachFields = [];
            var attach = [];
            var displayFields = {};
            for (var i = 0, ien = dt.columns(':visible').count(); i < ien; i++) {
                var visIdx = dt.column(i + ':visible').index();
                var td = $('<td>').appendTo(tr);
                var fields = _dtFieldsFromIdx(dt, this.s.fields, visIdx, true);
                var cell = dt.cell(':eq(0)', visIdx).node();
                if (cell) {
                    td.addClass(cell.className);
                }
                if (Object.keys(fields).length) {
                    attachFields.push(Object.keys(fields));
                    attach.push(td[0]);
                    $.extend(displayFields, fields);
                }
            }
            var append = function () {
                var action = insertPoint === 'end'
                    ? 'appendTo'
                    : 'prependTo';
                tr[action](dt.table(undefined).body());
            };
            this.__dtFakeRow = tr;
            // Insert into the table
            append();
            dt.on('draw.dte-createInline', function () {
                append();
            });
            return {
                0: {
                    attach: attach,
                    attachFields: attachFields,
                    displayFields: displayFields,
                    fields: this.s.fields,
                    type: 'row'
                }
            };
        },
        fakeRowEnd: function () {
            var dt = _dtApi(this.s.table);
            dt.off('draw.dte-createInline');
            this.__dtFakeRow.remove();
            this.__dtFakeRow = null;
        },
        // get idSrc, fields to edit, data and node for each item
        fields: function (identifier) {
            var idFn = dataGet(this.s.idSrc);
            var dt = _dtApi(this.s.table);
            var fields = this.s.fields;
            var out = {};
            if ($.isPlainObject(identifier) &&
                (identifier.rows !== undefined || identifier.columns !== undefined || identifier.cells !== undefined)) {
                // Multi-item type selector
                if (identifier.rows !== undefined) {
                    _dtRowSelector(out, dt, identifier.rows, fields, idFn);
                }
                if (identifier.columns !== undefined) {
                    _dtColumnSelector(out, dt, identifier.columns, fields, idFn);
                }
                if (identifier.cells !== undefined) {
                    _dtCellSelector(out, dt, identifier.cells, fields, idFn);
                }
            }
            else {
                // Just a rows selector
                _dtRowSelector(out, dt, identifier, fields, idFn);
            }
            return out;
        },
        id: function (data) {
            var idFn = dataGet(this.s.idSrc);
            return idFn(data);
        },
        individual: function (identifier, fieldNames) {
            var idFn = dataGet(this.s.idSrc);
            var dt = _dtApi(this.s.table);
            var fields = this.s.fields;
            var out = {};
            var forceFields;
            if (fieldNames) {
                if (!Array.isArray(fieldNames)) {
                    fieldNames = [fieldNames];
                }
                forceFields = {};
                $.each(fieldNames, function (i, name) {
                    forceFields[name] = fields[name];
                });
            }
            _dtCellSelector(out, dt, identifier, fields, idFn, forceFields);
            return out;
        },
        prep: function (action, identifier, submit, json, store) {
            var _this = this;
            // Get the id of the rows created / edited
            if (action === 'create') {
                store.rowIds = $.map(json.data, function (row) { return dataSource$1.id.call(_this, row); });
            }
            if (action === 'edit') {
                var cancelled_1 = json.cancelled || [];
                store.rowIds = $.map(submit.data, function (val, key) {
                    return !$.isEmptyObject(submit.data[key]) && // was submitted
                        $.inArray(key, cancelled_1) === -1 ? // was not cancelled on the server-side
                        key :
                        undefined;
                });
            }
            else if (action === 'remove') {
                store.cancelled = json.cancelled || [];
            }
        },
        refresh: function () {
            // Reload a table's data - used when nested data is changed
            var dt = _dtApi(this.s.table);
            dt.ajax.reload(null, false);
        },
        remove: function (identifier, fields, store) {
            // No confirmation from the server
            var that = this;
            var dt = _dtApi(this.s.table);
            var cancelled = store.cancelled;
            if (cancelled.length === 0) {
                // No rows were cancelled on the server-side, remove them all
                dt.rows(identifier).remove();
            }
            else {
                // One or more rows were cancelled, so we need to identify them
                // and not remove those rows
                var indexes_1 = [];
                dt.rows(identifier).every(function () {
                    var id = dataSource$1.id.call(that, this.data());
                    if ($.inArray(id, cancelled) === -1) {
                        // Don't use `remove` here - it messes up the indexes
                        indexes_1.push(this.index());
                    }
                });
                dt.rows(indexes_1).remove();
            }
        }
    };

    /* -  -  -  -  -  -  -  -
     * HTML editor interface
     */
    function _htmlId(identifier) {
        if (identifier === 'keyless') {
            return $(document);
        }
        var specific = $('[data-editor-id="' + identifier + '"]');
        if (specific.length === 0) {
            specific = typeof identifier === 'string' ?
                $(safeQueryId(identifier)) :
                $(identifier);
        }
        if (specific.length === 0) {
            throw new Error('Could not find an element with `data-editor-id` or `id` of: ' + identifier);
        }
        return specific;
    }
    function _htmlEl(identifier, name) {
        var context = _htmlId(identifier);
        return $('[data-editor-field="' + name + '"]', context);
    }
    function _htmlEls(identifier, names) {
        var out = $();
        for (var i = 0, ien = names.length; i < ien; i++) {
            out = out.add(_htmlEl(identifier, names[i]));
        }
        return out;
    }
    function _htmlGet(identifier, dataSrc) {
        var el = _htmlEl(identifier, dataSrc);
        return el.filter('[data-editor-value]').length ?
            el.attr('data-editor-value') :
            el.html();
    }
    function _htmlSet(identifier, fields, data) {
        $.each(fields, function (name, field) {
            var val = field.valFromData(data);
            if (val !== undefined) {
                var el = _htmlEl(identifier, field.dataSrc());
                if (el.filter('[data-editor-value]').length) {
                    el.attr('data-editor-value', val);
                }
                else {
                    el.each(function () {
                        // This is very frustrating, but in IE if you just write directly
                        // to innerHTML, and elements that are overwritten are GC'ed,
                        // even if there is a reference to them elsewhere
                        while (this.childNodes.length) {
                            this.removeChild(this.firstChild);
                        }
                    })
                        .html(val);
                }
            }
        });
    }
    var dataSource = {
        create: function (fields, data) {
            // If there is an element with the id that has been created, then use it
            // to assign the values
            if (data) {
                var id = dataSource.id.call(this, data);
                try {
                    if (_htmlId(id).length) {
                        _htmlSet(id, fields, data);
                    }
                }
                catch (e) {
                    // noop - use `postCreate` to add items to the DOM
                }
            }
        },
        edit: function (identifier, fields, data) {
            // Get the ids from the returned data or `keyless` if not found
            var id = dataSource.id.call(this, data) || 'keyless';
            _htmlSet(id, fields, data);
        },
        // get idSrc, fields to edit, data and node for each item
        fields: function (identifier) {
            var out = {};
            // Allow multi-point editing
            if (Array.isArray(identifier)) {
                for (var i = 0, ien = identifier.length; i < ien; i++) {
                    var res = dataSource.fields.call(this, identifier[i]);
                    out[identifier[i]] = res[identifier[i]];
                }
                return out;
            }
            // else
            var data = {};
            var fields = this.s.fields;
            if (!identifier) {
                identifier = 'keyless';
            }
            $.each(fields, function (name, field) {
                var val = _htmlGet(identifier, field.dataSrc());
                // If no HTML element is present, jQuery returns null. We want undefined
                field.valToData(data, val === null ? undefined : val);
            });
            out[identifier] = {
                data: data,
                fields: fields,
                idSrc: identifier,
                node: document,
                type: 'row'
            };
            return out;
        },
        id: function (data) {
            var idFn = dataGet(this.s.idSrc);
            return idFn(data);
        },
        individual: function (identifier, fieldNames) {
            var attachEl;
            // Auto detection of the field name and id
            if (identifier instanceof $ || identifier.nodeName) {
                attachEl = identifier;
                if (!fieldNames) {
                    fieldNames = [$(identifier).attr('data-editor-field')];
                }
                var back = $.fn.addBack ? 'addBack' : 'andSelf';
                identifier = $(identifier).parents('[data-editor-id]')[back]().data('editor-id');
            }
            // no id given and none found
            if (!identifier) {
                identifier = 'keyless';
            }
            // no field name - cannot continue
            if (fieldNames && !Array.isArray(fieldNames)) {
                fieldNames = [fieldNames];
            }
            if (!fieldNames || fieldNames.length === 0) {
                throw new Error('Cannot automatically determine field name from data source');
            }
            var out = dataSource.fields.call(this, identifier);
            var fields = this.s.fields;
            var forceFields = {};
            $.each(fieldNames, function (i, name) {
                forceFields[name] = fields[name];
            });
            $.each(out, function (id, set) {
                set.type = 'cell';
                set.attachFields = [fieldNames];
                set.attach = attachEl ?
                    $(attachEl) :
                    _htmlEls(identifier, fieldNames).toArray();
                set.fields = fields;
                set.displayFields = forceFields;
            });
            return out;
        },
        initField: function (cfg) {
            // This is before the field has been initialised so can't use it API
            var label = $('[data-editor-label="' + (cfg.data || cfg.name) + '"]');
            if (!cfg.label && label.length) {
                cfg.label = label.html();
            }
        },
        remove: function (identifier, fields) {
            // If there is an element with an ID property matching the identifier,
            // remove it
            _htmlId(identifier).remove();
        }
    };

    /**
     * Class names that are used by Editor for its various display components.
     * A copy of this object is taken when an Editor instance is initialised, thus
     * allowing different classes to be used in different instances if required.
     * Class name changes can be useful for easy integration with CSS frameworks,
     * for example Twitter Bootstrap.
     *
     * @namespace
     */
    var classNames = {
        /**
         * Action classes - these are added to the Editor base element ("wrapper")
         * and allows styling based on the type of form view that is being employed.
         *
         * @namespace
         */
        actions: {
            /**
             * Editor is in 'create' state
             */
            create: 'DTE_Action_Create',
            /**
             * Editor is in 'edit' state
             */
            edit: 'DTE_Action_Edit',
            /**
             * Editor is in 'remove' state
             */
            remove: 'DTE_Action_Remove'
        },
        /**
         * Display body classes
         *
         * @namespace
         */
        body: {
            /**
             * Liner for the body content
             */
            content: 'DTE_Body_Content',
            /**
             * Container for the body elements
             */
            wrapper: 'DTE_Body'
        },
        /**
         * Bubble editing classes - these are used to display the bubble editor
         *
         * @namespace
         */
        bubble: {
            /**
             * Fixed background
             */
            bg: 'DTE_Bubble_Background',
            /**
             * Close button
             */
            close: 'icon close',
            /**
             * Bubble content liner
             */
            liner: 'DTE_Bubble_Liner',
            /**
             * Pointer shown which node is being edited
             */
            pointer: 'DTE_Bubble_Triangle',
            /**
             * Bubble table display wrapper, so the buttons and form can be shown
             * as table cells (via css)
             */
            table: 'DTE_Bubble_Table',
            /**
             * Bubble container element
             */
            wrapper: 'DTE DTE_Bubble'
        },
        /**
         * Field classes
         *
         * @namespace
         */
        field: {
            /**
             * Field is disabled
             */
            'disabled': 'disabled',
            /**
             * Field error state (added to the field.wrapper element when in error state
             */
            'error': 'DTE_Field_StateError',
            /**
             * Field input container
             */
            'input': 'DTE_Field_Input',
            /**
             * Input elements wrapper
             */
            'inputControl': 'DTE_Field_InputControl',
            /**
             * Field label
             */
            'label': 'DTE_Label',
            /**
             * Error information text
             */
            'msg-error': 'DTE_Field_Error',
            /**
             * General information text
             */
            'msg-info': 'DTE_Field_Info',
            /**
             * Label information text
             */
            'msg-label': 'DTE_Label_Info',
            /**
             * Live messaging (API) information text
             */
            'msg-message': 'DTE_Field_Message',
            /**
             * Multi-value information descriptive text
             */
            'multiInfo': 'multi-info',
            /**
             * Multi-value not editable (field.multiEditable)
             */
            'multiNoEdit': 'multi-noEdit',
            /**
             * Multi-value information display
             */
            'multiRestore': 'multi-restore',
            /**
             * Multi-value information display wrapper
             */
            'multiValue': 'multi-value',
            /**
             * Class prefix for the field name - field name is added to the end allowing
             * styling based on field name.
             */
            'namePrefix': 'DTE_Field_Name_',
            /**
             * Field's processing element
             */
            'processing': 'DTE_Processing_Indicator',
            /**
             * Class prefix for the field type - field type is added to the end allowing
             * styling based on field type.
             */
            'typePrefix': 'DTE_Field_Type_',
            /**
             * Container for each field
             */
            'wrapper': 'DTE_Field'
        },
        /**
         * Display footer classes
         *
         * @namespace
         */
        footer: {
            /**
             * Liner for the footer content
             */
            content: 'DTE_Footer_Content',
            /**
             * Container for the footer elements
             */
            wrapper: 'DTE_Footer'
        },
        /**
         * Form classes
         *
         * @namespace
         */
        form: {
            /**
             * Button
             */
            button: 'btn',
            /**
             * Button inside the form
             */
            buttonInternal: 'btn',
            /**
             * Buttons container
             */
            buttons: 'DTE_Form_Buttons',
            /**
             * Liner for the form content
             */
            content: 'DTE_Form_Content',
            /**
             * Global error imformation
             */
            error: 'DTE_Form_Error',
            /**
             * Global form information
             */
            info: 'DTE_Form_Info',
            /**
             * Applied to the <form> tag
             */
            tag: '',
            /**
             * Container for the form elements
             */
            wrapper: 'DTE_Form'
        },
        /**
         * Display header classes
         *
         * @namespace
         */
        header: {
            /**
             * Liner for the header content
             */
            content: 'DTE_Header_Content',
            /**
             * Container for the header elements
             */
            wrapper: 'DTE_Header'
        },
        /**
         * Inline editing classes - these are used to display the inline editor
         *
         * @namespace
         */
        inline: {
            buttons: 'DTE_Inline_Buttons',
            liner: 'DTE_Inline_Field',
            wrapper: 'DTE DTE_Inline',
        },
        /**
         * Processing classes
         *
         * @namespace
         */
        processing: {
            /**
             * Added to the base element ("wrapper") when the form is "processing"
             */
            active: 'processing',
            /**
             * Processing indicator element
             */
            indicator: 'DTE_Processing_Indicator'
        },
        /**
         * Applied to the base DIV element that contains all other Editor elements
         */
        wrapper: 'DTE'
    };

    var displayed$2 = false;
    var cssBackgroundOpacity = 1;
    var dom$1 = {
        background: $('<div class="DTED_Envelope_Background"><div></div></div>')[0],
        close: $('<div class="DTED_Envelope_Close"></div>')[0],
        content: null,
        wrapper: $('<div class="DTED DTED_Envelope_Wrapper">' +
            '<div class="DTED_Envelope_Shadow"></div>' +
            '<div class="DTED_Envelope_Container"></div>' +
            '</div>')[0]
    };
    function findAttachRow(editor, attach) {
        var dt = new $.fn.dataTable.Api(editor.s.table);
        // Figure out where we want to put the form display
        if (attach === 'head') {
            return dt.table(undefined).header(); // typing error in DT type file
        }
        else if (editor.s.action === 'create') {
            return dt.table(undefined).header();
        }
        else {
            return dt.row(editor.s.modifier).node();
        }
    }
    function heightCalc$1(dte) {
        // Set the max-height for the form content
        var header = $('div.DTE_Header', dom$1.wrapper).outerHeight();
        var footer = $('div.DTE_Footer', dom$1.wrapper).outerHeight();
        var maxHeight = $(window).height() - (envelope.conf.windowPadding * 2) -
            header - footer;
        $('div.DTE_Body_Content', dom$1.wrapper).css('maxHeight', maxHeight);
        return $(dte.dom.wrapper).outerHeight();
    }
    function hide$2(dte, callback) {
        if (!callback) {
            callback = function () { };
        }
        if (displayed$2) {
            $(dom$1.content).animate({
                top: -(dom$1.content.offsetHeight + 50)
            }, 600, function () {
                $([dom$1.wrapper, dom$1.background]).fadeOut('normal', function () {
                    $(this).detach();
                    callback();
                });
            });
            displayed$2 = false;
        }
    }
    function init$1() {
        dom$1.content = $('div.DTED_Envelope_Container', dom$1.wrapper)[0];
        cssBackgroundOpacity = $(dom$1.background).css('opacity');
    }
    function show$2(dte, callback) {
        if (!callback) {
            callback = function () { };
        }
        $('body')
            .append(dom$1.background)
            .append(dom$1.wrapper);
        // Adjust size for the content
        dom$1.content.style.height = 'auto';
        if (!displayed$2) {
            var style = dom$1.wrapper.style;
            style.opacity = '0';
            style.display = 'block';
            var height = heightCalc$1(dte);
            var targetRow = findAttachRow(dte, envelope.conf.attach);
            var width = targetRow.offsetWidth;
            style.display = 'none';
            style.opacity = '1';
            // Prep the display
            dom$1.wrapper.style.width = width + 'px';
            dom$1.wrapper.style.marginLeft = -(width / 2) + 'px';
            dom$1.wrapper.style.top = ($(targetRow).offset().top + targetRow.offsetHeight) + 'px';
            dom$1.content.style.top = ((-1 * height) - 20) + 'px';
            // Start animating in the background
            dom$1.background.style.opacity = '0';
            dom$1.background.style.display = 'block';
            $(dom$1.background).animate({
                opacity: cssBackgroundOpacity
            }, 'normal');
            // Animate in the display
            $(dom$1.wrapper).fadeIn();
            $(dom$1.content).animate({ top: 0 }, 600, callback);
        }
        // Event handlers
        $(dom$1.close)
            .attr('title', dte.i18n.close)
            .off('click.DTED_Envelope')
            .on('click.DTED_Envelope', function (e) {
                dte.close();
            });
        $(dom$1.background)
            .off('click.DTED_Envelope')
            .on('click.DTED_Envelope', function (e) {
                dte.background();
            });
        $('div.DTED_Lightbox_Content_Wrapper', dom$1.wrapper)
            .off('click.DTED_Envelope')
            .on('click.DTED_Envelope', function (e) {
                if ($(e.target).hasClass('DTED_Envelope_Content_Wrapper')) {
                    dte.background();
                }
            });
        $(window)
            .off('resize.DTED_Envelope')
            .on('resize.DTED_Envelope', function () {
                heightCalc$1(dte);
            });
        displayed$2 = true;
    }
    var envelope = {
        close: function (dte, callback) {
            hide$2(dte, callback);
        },
        conf: {
            attach: 'row',
            windowPadding: 50
        },
        destroy: function (dte) {
            hide$2();
        },
        init: function (dte) {
            init$1();
            return envelope;
        },
        node: function (dte) {
            return dom$1.wrapper[0];
        },
        open: function (dte, append, callback) {
            $(dom$1.content).children().detach();
            dom$1.content.appendChild(append);
            dom$1.content.appendChild(dom$1.close);
            show$2(dte, callback);
        }
    };

    function isMobile() {
        return typeof window.orientation !== 'undefined' && window.outerWidth <= 576
            ? true
            : false;
    }
    var displayed$1 = false;
    var ready = false;
    var scrollTop = 0;
    var dom = {
        background: $('<div class="DTED_Lightbox_Background"><div></div></div>'),
        close: $('<div class="DTED_Lightbox_Close"></div>'),
        content: null,
        wrapper: $('<div class="DTED DTED_Lightbox_Wrapper">' +
            '<div class="DTED_Lightbox_Container">' +
            '<div class="DTED_Lightbox_Content_Wrapper">' +
            '<div class="DTED_Lightbox_Content">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>')
    };
    function heightCalc() {
        var headerFooter = $('div.DTE_Header', dom.wrapper).outerHeight() +
            $('div.DTE_Footer', dom.wrapper).outerHeight();
        if (isMobile()) {
            $('div.DTE_Body_Content', dom.wrapper).css('maxHeight', 'calc(100vh - ' + headerFooter + 'px)');
        }
        else {
            // Set the max-height for the form content
            var maxHeight = $(window).height() - (self.conf.windowPadding * 2) - headerFooter;
            $('div.DTE_Body_Content', dom.wrapper).css('maxHeight', maxHeight);
        }
    }
    function hide$1(dte, callback) {
        if (!callback) {
            callback = function () { };
        }
        // Restore scroll state
        $('body').scrollTop(scrollTop);
        dte._animate(dom.wrapper, {
            opacity: 0,
            top: self.conf.offsetAni
        }, function () {
            $(this).detach();
            callback();
        });
        dte._animate(dom.background, {
            opacity: 0
        }, function () {
            $(this).detach();
        });
        displayed$1 = false;
        $(window).off('resize.DTED_Lightbox');
    }
    function init() {
        if (ready) {
            return;
        }
        dom.content = $('div.DTED_Lightbox_Content', dom.wrapper);
        dom.wrapper.css('opacity', 0);
        dom.background.css('opacity', 0);
        ready = true;
    }
    function show$1(dte, callback) {
        // Mobiles have very poor position fixed abilities, so we need to know
        // when using mobile A media query isn't good enough
        if (isMobile()) {
            $('body').addClass('DTED_Lightbox_Mobile');
        }
        $('body')
            .append(dom.background)
            .append(dom.wrapper);
        heightCalc();
        if (!displayed$1) {
            displayed$1 = true;
            dom.content.css('height', 'auto');
            dom.wrapper.css({
                top: -self.conf.offsetAni
            });
            dte._animate(dom.wrapper, {
                opacity: 1,
                top: 0
            }, callback);
            dte._animate(dom.background, {
                opacity: 1
            });
            $(window).on('resize.DTED_Lightbox', function () {
                heightCalc();
            });
            scrollTop = $('body').scrollTop();
        }
        // Event handlers - assign on show, premoving previous bindings
        dom.close
            .attr('title', dte.i18n.close)
            .off('click.DTED_Lightbox')
            .on('click.DTED_Lightbox', function (e) {
                dte.close();
            });
        dom.background
            .off('click.DTED_Lightbox')
            .on('click.DTED_Lightbox', function (e) {
                e.stopImmediatePropagation();
                dte.background();
            });
        $('div.DTED_Lightbox_Content_Wrapper', dom.wrapper)
            .off('click.DTED_Lightbox')
            .on('click.DTED_Lightbox', function (e) {
                if ($(e.target).hasClass('DTED_Lightbox_Content_Wrapper')) {
                    e.stopImmediatePropagation();
                    dte.background();
                }
            });
    }
    var self = {
        close: function (dte, callback) {
            hide$1(dte, callback);
        },
        conf: {
            offsetAni: 25,
            windowPadding: 25
        },
        destroy: function (dte) {
            if (displayed$1) {
                hide$1(dte);
            }
        },
        init: function (dte) {
            init();
            return self;
        },
        node: function (dte) {
            return dom.wrapper[0];
        },
        open: function (dte, append, callback) {
            var content = dom.content;
            content.children().detach();
            content
                .append(append)
                .append(dom.close);
            show$1(dte, callback);
        },
    };

    var DataTable$5 = $.fn.dataTable;
    /**
     * Add a new field to the from. This is the method that is called automatically when
     * fields are given in the initialisation objects as {@link Editor.defaults.fields}.
     *
     * @memberOf Editor
     * @param {object|array} field The object that describes the field (the full
     * object is described by {@link Editor.model.field}. Note that multiple
     * fields can be given by passing in an array of field definitions.
     * @param {string} [after] Existing field to insert the new field after. This
     * can be `undefined` (insert at end), `null` (insert at start) or `string`
     * the field name to insert after.
     * @param {boolean} [reorder] INTERNAL for array adding performance only
     */
    function add(cfg, after, reorder) {
        if (reorder === void 0) { reorder = true; }
        // Allow multiple fields to be added at the same time
        if (Array.isArray(cfg)) {
            // Do it in reverse to allow fields to appear in the same order given, otherwise,
            // the would appear in reverse if given an `after`
            if (after !== undefined) {
                cfg.reverse();
            }
            for (var _i = 0, cfg_1 = cfg; _i < cfg_1.length; _i++) {
                var cfgDp = cfg_1[_i];
                this.add(cfgDp, after, false);
            }
            this._displayReorder(this.order());
            return this;
        }
        var name = cfg.name;
        if (name === undefined) {
            throw new Error('Error adding field. The field requires a `name` option');
        }
        if (this.s.fields[name]) {
            throw new Error('Error adding field \'' + name + '\'. A field already exists with this name');
        }
        // Allow the data source to add / modify the field properties
        // Dev: would this be better as an event `preAddField`? And have the
        // data sources init only once, but can listen for such events? More
        // complexity, but probably more flexible...
        this._dataSource('initField', cfg);
        var editorField = new Editor.Field(cfg, this.classes.field, this);
        // If in an editing mode, we need to set the field up for the data
        if (this.s.mode) {
            var editFields = this.s.editFields;
            editorField.multiReset();
            $.each(editFields, function (idSrc, editIn) {
                var value;
                if (editIn.data) {
                    value = editorField.valFromData(editIn.data);
                }
                editorField.multiSet(idSrc, value !== undefined ?
                    value :
                    editorField.def());
            });
        }
        this.s.fields[name] = editorField;
        if (after === undefined) {
            this.s.order.push(name);
        }
        else if (after === null) {
            this.s.order.unshift(name);
        }
        else {
            var idx = $.inArray(after, this.s.order);
            this.s.order.splice(idx + 1, 0, name);
        }
        if (reorder !== false) {
            this._displayReorder(this.order());
        }
        return this;
    }
    // TODO
    /**
     * Get / set the Ajax configuration for the Editor instance
     *
     * @return {object|Editor} Editor instance, for chaining when used as a
     *   setter, the Ajax configuration when used as a getter.
     */
    function ajax(newAjax) {
        if (newAjax) {
            this.s.ajax = newAjax;
            return this;
        }
        return this.s.ajax;
    }
    /**
     * Perform background activation tasks.
     *
     * This is NOT publicly documented on the Editor web-site, but rather can be
     * used by display controller plug-ins to perform the required task on
     * background activation.
     *
     * @return {Editor} Editor instance, for chaining
     */
    function background() {
        var onBackground = this.s.editOpts.onBackground;
        if (typeof onBackground === 'function') {
            onBackground(this);
        }
        else if (onBackground === 'blur') {
            this.blur();
        }
        else if (onBackground === 'close') {
            this.close();
        }
        else if (onBackground === 'submit') {
            this.submit();
        }
        return this;
    }
    /**
     * Blur the currently displayed editor.
     *
     * A blur is different from a `close()` in that it might cause either a close or
     * the form to be submitted. A typical example of a blur would be clicking on
     * the background of the bubble or main editing forms - i.e. it might be a
     * close, or it might submit depending upon the configuration, while a click on
     * the close box is a very definite close.
     *
     * @return {Editor} Editor instance, for chaining
     */
    function blur() {
        this._blur();
        return this;
    }
    function bubble(cells, fieldNames, showIn, opts) {
        var _this = this;
        var that = this;
        // Some other field in inline edit mode?
        if (this._tidy(function () {
            that.bubble(cells, fieldNames, opts);
        })) {
            return this;
        }
        // Argument shifting
        if ($.isPlainObject(fieldNames)) {
            opts = fieldNames;
            fieldNames = undefined;
            showIn = true;
        }
        else if (typeof fieldNames === 'boolean') {
            showIn = fieldNames;
            fieldNames = undefined;
            opts = undefined;
        }
        if ($.isPlainObject(showIn)) {
            opts = showIn;
            showIn = true;
        }
        if (showIn === undefined) {
            showIn = true;
        }
        opts = $.extend({}, this.s.formOptions.bubble, opts);
        var editFields = this._dataSource('individual', cells, fieldNames);
        this._edit(cells, editFields, 'bubble', opts, function () {
            var namespace = _this._formOptions(opts);
            var ret = _this._preopen('bubble');
            if (!ret) {
                return _this;
            }
            // Keep the bubble in position on resize
            $(window).on('resize.' + namespace, function () {
                _this.bubblePosition();
            });
            // Store the nodes this are being used so the bubble can be positioned
            var nodes = [];
            _this.s.bubbleNodes = nodes.concat.apply(nodes, pluck(editFields, 'attach'));
            // Create container display
            var classes = _this.classes.bubble;
            var backgroundNode = $('<div class="' + classes.bg + '"><div></div></div>');
            var container = $('<div class="' + classes.wrapper + '">' +
                '<div class="' + classes.liner + '">' +
                '<div class="' + classes.table + '">' +
                '<div class="' + classes.close + '" title="' + _this.i18n.close + '"></div>' +
                '<div class="DTE_Processing_Indicator"><span></div>' +
                '</div>' +
                '</div>' +
                '<div class="' + classes.pointer + '"></div>' +
                '</div>');
            if (showIn) {
                container.appendTo('body');
                backgroundNode.appendTo('body');
            }
            var liner = container.children().eq(0);
            var tableNode = liner.children();
            var closeNode = tableNode.children();
            liner.append(_this.dom.formError);
            tableNode.prepend(_this.dom.form);
            if (opts.message) {
                liner.prepend(_this.dom.formInfo);
            }
            if (opts.title) {
                liner.prepend(_this.dom.header);
            }
            if (opts.buttons) {
                tableNode.append(_this.dom.buttons);
            }
            // Need to use a small anon function here as the animate callback is the scope
            // of the element being animated and TS won't allow access to the private methods
            var finish = function () {
                _this._clearDynamicInfo();
                _this._event('closed', ['bubble']);
            };
            var pair = $().add(container).add(backgroundNode);
            _this._closeReg(function (submitComplete) {
                _this._animate(pair, { opacity: 0 }, function () {
                    if (this === container[0]) {
                        pair.detach();
                        $(window).off('resize.' + namespace);
                        finish();
                    }
                });
            });
            // Close event handlers
            backgroundNode.on('click', function () {
                _this.blur();
            });
            closeNode.on('click', function () {
                _this._close();
            });
            _this.bubblePosition();
            _this._postopen('bubble', false);
            var opened = function () {
                _this._focus(_this.s.includeFields, opts.focus);
                _this._event('opened', ['bubble', _this.s.action]);
            };
            _this._animate(pair, { opacity: 1 }, function () {
                // Otherwise the callback will happen on both elements
                if (this === container[0]) {
                    opened();
                }
            });
        });
        return this;
    }
    /**
     * Reposition the editing bubble (`bubble()`) when it is visible. This can be
     * used to update the bubble position if other elements on the page change
     * position. Editor will automatically call this method on window resize.
     *
     * @return {Editor} Editor instance, for chaining
     */
    function bubblePosition() {
        var wrapper = $('div.DTE_Bubble');
        var liner = $('div.DTE_Bubble_Liner');
        var nodes = this.s.bubbleNodes;
        // Average the node positions to insert the container
        var position = { bottom: 0, left: 0, right: 0, top: 0 };
        $.each(nodes, function (i, nodeIn) {
            var pos = $(nodeIn).offset();
            nodeIn = $(nodeIn).get(0);
            position.top += pos.top;
            position.left += pos.left;
            position.right += pos.left + nodeIn.offsetWidth;
            position.bottom += pos.top + nodeIn.offsetHeight;
        });
        position.top /= nodes.length;
        position.left /= nodes.length;
        position.right /= nodes.length;
        position.bottom /= nodes.length;
        var top = position.top;
        var left = (position.left + position.right) / 2;
        var width = liner.outerWidth();
        var visLeft = left - (width / 2);
        var visRight = visLeft + width;
        var docWidth = $(window).width();
        var padding = 15;
        this.classes.bubble;
        wrapper.css({
            left: left,
            top: top
        });
        // Correct for overflow from the top of the document by positioning below
        // the field if needed
        if (liner.length && liner.offset().top < 0) {
            wrapper
                .css('top', position.bottom)
                .addClass('below');
        }
        else {
            wrapper.removeClass('below');
        }
        // Attempt to correct for overflow to the right of the document
        if (visRight + padding > docWidth) {
            var diff = visRight - docWidth;
            // If left overflowing, that takes priority
            liner.css('left', visLeft < padding ?
                -(visLeft - padding) :
                -(diff + padding));
        }
        else {
            // Correct overflow to the left
            liner.css('left', visLeft < padding ? -(visLeft - padding) : 0);
        }
        return this;
    }
    /**
     * Setup the buttons that will be shown in the footer of the form - calling this
     * method will replace any buttons which are currently shown in the form.
     *
     * @param {array|object} buttonsIn A single button definition to add to the form or
     * an array of objects with the button definitions to add more than one button.
     * The options for the button definitions are fully defined by the
     * {@link Editor.models.button} object.
     * @param {string} buttons.text The text to put into the button. This can be any
     * HTML string you wish as it will be rendered as HTML (allowing images etc to
     * be shown inside the button).
     * @param {function} [buttons.action] Callback function which the button is activated.
     * For example for a 'submit' button you would call the {@link Editor#submit} method,
     * while for a cancel button you would call the {@link Editor#close} method. Note that
     * the function is executed in the scope of the Editor instance, so you can call
     * the Editor's API methods using the `this` keyword.
     * @param {string} [buttons.className] The CSS class(es) to apply to the button
     * which can be useful for styling buttons which perform different functions
     * each with a distinctive visual appearance.
     * @return {Editor} Editor instance, for chaining
     */
    function buttons(buttonsIn) {
        var _this = this;
        if (buttonsIn === '_basic') {
            // Special string to create a basic button - undocumented
            buttonsIn = [{
                action: function () {
                    this.submit();
                },
                text: this.i18n[this.s.action].submit
            }];
        }
        else if (!Array.isArray(buttonsIn)) {
            // Allow a single button to be passed in as an object with an array
            buttonsIn = [buttonsIn];
        }
        $(this.dom.buttons).empty();
        $.each(buttonsIn, function (i, btn) {
            if (typeof btn === 'string') {
                btn = {
                    action: function () {
                        this.submit();
                    },
                    text: btn
                };
            }
            var text = btn.text || btn.label;
            var action = btn.action || btn.fn;
            var attr = btn.attr || {};
            $('<button></button>', {
                class: _this.classes.form.button + (btn.className ? ' ' + btn.className : '')
            })
                .html(typeof text === 'function' ?
                    text(_this) :
                    text || '')
                .attr('tabindex', btn.tabIndex !== undefined ? btn.tabIndex : 0)
                .attr(attr)
                .on('keyup', function (e) {
                    if (e.which === 13 && action) {
                        action.call(_this);
                    }
                })
                .on('keypress', function (e) {
                    // Stop the browser activating the click event - if we don't
                    // have this and the Ajax return is fast, the keyup in
                    // `_formOptions()` might trigger another submit
                    if (e.which === 13) {
                        e.preventDefault();
                    }
                })
                .on('click', function (e) {
                    e.preventDefault();
                    if (action) {
                        action.call(_this, e);
                    }
                })
                .appendTo(_this.dom.buttons);
        });
        return this;
    }
    /**
     * Remove fields from the form (fields are those that have been added using the
     * {@link Editor#add} method or the `fields` initialisation option). A single,
     * multiple or all fields can be removed at a time based on the passed parameter.
     * Fields are identified by the `name` property that was given to each field
     * when added to the form.
     *
     * @param {string|array} [fieldName] Field or fields to remove from the form. If
     * not given then all fields are removed from the form. If given as a string
     * then the single matching field will be removed. If given as an array of
     * strings, then all matching fields will be removed.
     * @return {Editor} Editor instance, for chaining
     *
     * @example
     * // Clear the form of current fields and then add a new field
     * // before displaying a 'create' display
     * editor.clear();
     * editor.add( {
     *  "label": "User name",
     *  "name": "username"
     * } );
     * editor.create( "Create user" );
     *
     * @example
     * // Remove an individual field
     * editor.clear( "username" );
     *
     * @example
     * // Remove multiple fields
     * editor.clear( [ "first_name", "last_name" ] );
     */
    function clear(fieldName) {
        var that = this;
        var sFields = this.s.fields;
        if (typeof fieldName === 'string') {
            // Remove an individual form element
            that.field(fieldName).destroy();
            delete sFields[fieldName];
            var orderIdx = $.inArray(fieldName, this.s.order);
            this.s.order.splice(orderIdx, 1);
            var includeIdx = $.inArray(fieldName, this.s.includeFields);
            if (includeIdx !== -1) {
                this.s.includeFields.splice(includeIdx, 1);
            }
        }
        else {
            $.each(this._fieldNames(fieldName), function (i, name) {
                that.clear(name);
            });
        }
        return this;
    }
    /**
     * Close the form display.
     *
     * Note that `close()` will close any of the three Editor form types (main,
     * bubble and inline).
     *
     * @return {Editor} Editor instance, for chaining
     */
    function close() {
        this._close(false);
        return this;
    }
    /**
     * Create a new record - show the form that allows the user to enter information
     * for a new row and then subsequently submit that data.
     *
     * @param {boolean} [show=true] Show the form or not.
     *
     * @example
     * // Show the create form with a submit button
     * editor
     *  .title( 'Add new record' )
     *  .buttons( {
     *    "label": "Save",
     *    "fn": function () {
     *      this.submit();
     *    }
     *  } )
     *  .create();
     *
     * @example
     * // Don't show the form and automatically submit it after programmatically
     * // setting the values of fields (and using the field defaults)
     * editor
     *  create()
     *  set( 'name',   'Test user' )
     *  set( 'access', 'Read only' )
     *  submit();
     */
    function create(arg1, arg2, arg3, arg4) {
        var _this = this;
        var that = this;
        var sFields = this.s.fields;
        var count = 1;
        // Some other field in inline edit mode?
        if (this._tidy(function () {
            that.create(arg1, arg2, arg3, arg4);
        })) {
            return this;
        }
        // Multi-row creation support (only supported by the 1.3+ style of calling
        // this method, so a max of three arguments
        if (typeof arg1 === 'number') {
            count = arg1;
            arg1 = arg2;
            arg2 = arg3;
        }
        // Set up the edit fields for submission
        this.s.editFields = {};
        for (var i = 0; i < count; i++) {
            this.s.editFields[i] = {
                fields: this.s.fields
            };
        }
        var argOpts = this._crudArgs(arg1, arg2, arg3, arg4);
        this.s.mode = 'main';
        this.s.action = 'create';
        this.s.modifier = null;
        this.dom.form.style.display = 'block';
        this._actionClass();
        // Allow all fields to be displayed for the create form
        this._displayReorder(this.fields());
        // Set the default for the fields
        $.each(sFields, function (name, fieldIn) {
            fieldIn.multiReset();
            // Set a value marker for each multi, so the field
            // knows what the id's are (ints in this case)
            for (var i = 0; i < count; i++) {
                fieldIn.multiSet(i, fieldIn.def());
            }
            fieldIn.set(fieldIn.def());
        });
        this._event('initCreate', null, function () {
            _this._assembleMain();
            _this._formOptions(argOpts.opts);
            argOpts.maybeOpen();
        });
        return this;
    }
    /**
     * Remove dependent links from a field
     *
     * @param {string} parent The name of the field to remove the existing dependencies
     * @return {Editor} Editor instance, for chaining
     */
    function undependent(parent) {
        if (Array.isArray(parent)) {
            for (var i = 0, ien = parent.length; i < ien; i++) {
                this.undependent(parent[i]);
            }
            return this;
        }
        $(this.field(parent).node()).off('.edep');
        return this;
    }
    /**
     * Create a dependent link between two or more fields. This method is used to
     * listen for a change in a field's value which will trigger updating of the
     * form. This update can consist of updating an options list, changing values
     * or making fields hidden / visible.
     *
     * @param {string} parent The name of the field to listen to changes from
     * @param {string|object|function} url Callback definition. This can be:
     * * A string, which will be used as a URL to submit the request for update to
     * * An object, which is used to extend an Ajax object for the request. The
     * `url` parameter must be specified.
     * * A function, which is used as a callback, allowing non-ajax updates.
     * @return {Editor} Editor instance, for chaining
     */
    function dependent(parent, url, opts) {
        var _this = this;
        if (Array.isArray(parent)) {
            for (var i = 0, ien = parent.length; i < ien; i++) {
                this.dependent(parent[i], url, opts);
            }
            return this;
        }
        var that = this;
        var parentField = this.field(parent);
        var ajaxOpts = {
            dataType: 'json',
            type: 'POST'
        };
        opts = $.extend({
            data: null,
            event: 'change',
            postUpdate: null,
            preUpdate: null
        }, opts);
        var update = function (json) {
            if (opts.preUpdate) {
                opts.preUpdate(json);
            }
            // Field specific
            $.each({
                errors: 'error',
                labels: 'label',
                messages: 'message',
                options: 'update',
                values: 'val'
            }, function (jsonProp, fieldFn) {
                if (json[jsonProp]) {
                    $.each(json[jsonProp], function (fieldIn, valIn) {
                        that.field(fieldIn)[fieldFn](valIn);
                    });
                }
            });
            // Form level
            $.each(['hide', 'show', 'enable', 'disable'], function (i, key) {
                if (json[key]) {
                    that[key](json[key], json.animate);
                }
            });
            if (opts.postUpdate) {
                opts.postUpdate(json);
            }
            parentField.processing(false);
        };
        // Use a delegate handler to account for field elements which are added and
        // removed after `depenedent` has been called
        $(parentField.node()).on(opts.event + '.edep', function (e) {
            // Make sure that it was one of the field's elements that triggered the ev
            if ($(parentField.node()).find(e.target).length === 0) {
                return;
            }
            parentField.processing(true);
            var data = {};
            data.rows = _this.s.editFields ?
                pluck(_this.s.editFields, 'data') :
                null;
            data.row = data.rows ?
                data.rows[0] :
                null;
            data.values = _this.val();
            if (opts.data) {
                var ret = opts.data(data);
                if (ret) {
                    opts.data = ret;
                }
            }
            if (typeof url === 'function') {
                var o = url.call(_this, parentField.val(), data, update, e);
                if (o) {
                    if (typeof o === 'object' && typeof o.then === 'function') {
                        o.then(function (resolved) {
                            if (resolved) {
                                update(resolved);
                            }
                        });
                    }
                    else {
                        update(o);
                    }
                }
            }
            else {
                if ($.isPlainObject(url)) {
                    $.extend(ajaxOpts, url);
                }
                else {
                    ajaxOpts.url = url;
                }
                $.ajax($.extend(ajaxOpts, {
                    data: data,
                    success: update
                }));
            }
        });
        return this;
    }
    /**
     * Destroy the Editor instance, cleaning up fields, display and event handlers
     */
    function destroy() {
        if (this.s.displayed) {
            this.close();
        }
        this.clear();
        // Stick the template back into the document so it can be reused
        if (this.s.template) {
            $('body').append(this.s.template);
        }
        var controller = this.s.displayController;
        if (controller.destroy) {
            controller.destroy(this);
        }
        $(document).off('.dte' + this.s.unique);
        this.dom = null;
        this.s = null;
    }
    /**
     * Disable one or more field inputs, disallowing subsequent user interaction with the
     * fields until they are re-enabled.
     *
     * @param {string|array} name The field name (from the `name` parameter given when
     * originally setting up the field) to disable, or an array of field names to disable
     * multiple fields with a single call.
     * @return {Editor} Editor instance, for chaining
     *
     * @example
     * // Show a 'create' record form, but with a field disabled
     * editor.disable( 'account_type' );
     * editor.create( 'Add new user', {
     *  "label": "Save",
     *  "fn": function () { this.submit(); }
     * } );
     *
     * @example
     * // Disable multiple fields by using an array of field names
     * editor.disable( ['account_type', 'access_level'] );
     */
    function disable(name) {
        var that = this;
        $.each(this._fieldNames(name), function (i, n) {
            that.field(n).disable();
        });
        return this;
    }
    function display(showIn) {
        if (showIn === undefined) {
            return this.s.displayed;
        }
        return this[showIn ? 'open' : 'close']();
    }
    /**
     * Fields which are currently displayed
     *
     * @return {string[]} Field names that are shown
     */
    function displayed() {
        return $.map(this.s.fields, function (fieldIn, name) {
            return fieldIn.displayed() ? name : null;
        });
    }
    /**
     * Get display controller node
     *
     * @return {node} Display controller host element
     */
    function displayNode() {
        return this.s.displayController.node(this);
    }
    /**
     * Edit a record - show the form, pre-populated with the data that is in the given
     * DataTables row, that allows the user to enter information for the row to be modified
     * and then subsequently submit that data.
     *
     * @param {node} items The TR element from the DataTable that is to be edited
     * @param {boolean} [show=true] Show the form or not.
     * @return {Editor} Editor instance, for chaining
     *
     * @example
     * // Show the edit form for the first row in the DataTable with a submit button
     * editor.edit( $('#example tbody tr:eq(0)')[0], 'Edit record', {
     *  "label": "Update",
     *  "fn": function () { this.submit(); }
     * } );
     *
     * @example
     * // Use the title and buttons API methods to show an edit form (this provides
     * // the same result as example above, but is a different way of achieving it
     * editor.title( 'Edit record' );
     * editor.buttons( {
     *  "label": "Update",
     *  "fn": function () { this.submit(); }
     * } );
     * editor.edit( $('#example tbody tr:eq(0)')[0] );
     *
     * @example
     * // Automatically submit an edit without showing the user the form
     * editor.edit( TRnode, null, null, false );
     * editor.set( 'name', 'Updated name' );
     * editor.set( 'access', 'Read only' );
     * editor.submit();
     */
    function edit(items, arg1, arg2, arg3, arg4) {
        var _this = this;
        var that = this;
        // Some other field in inline edit mode?
        if (this._tidy(function () {
            that.edit(items, arg1, arg2, arg3, arg4);
        })) {
            return this;
        }
        var argOpts = this._crudArgs(arg1, arg2, arg3, arg4);
        this._edit(items, this._dataSource('fields', items), 'main', argOpts.opts, function () {
            _this._assembleMain();
            _this._formOptions(argOpts.opts);
            argOpts.maybeOpen();
        });
        return this;
    }
    /**
     * Enable one or more field inputs, restoring user interaction with the fields.
     *
     * @param {string|array} name The field name (from the `name` parameter given when
     * originally setting up the field) to enable, or an array of field names to enable
     * multiple fields with a single call.
     * @return {Editor} Editor instance, for chaining
     *
     * @example
     * // Show a 'create' form with buttons which will enable and disable certain fields
     * editor.create( 'Add new user', [
     *  {
     *    "label": "User name only",
     *    "fn": function () {
     *      this.enable('username');
     *      this.disable( ['first_name', 'last_name'] );
     *    }
     *  }, {
     *    "label": "Name based",
     *    "fn": function () {
     *      this.disable('username');
     *      this.enable( ['first_name', 'last_name'] );
     *    }
     *  }, {
     *    "label": "Submit",
     *    "fn": function () { this.submit(); }
     *  }
     * );
     */
    function enable(name) {
        var that = this;
        $.each(this._fieldNames(name), function (i, n) {
            that.field(n).enable();
        });
        return this;
    }
    function error$1(name, msg) {
        var wrapper = $(this.dom.wrapper);
        if (msg === undefined) {
            // Global error
            this._message(this.dom.formError, name, true, function () {
                wrapper.toggleClass('inFormError', name !== undefined && name !== '');
            });
            // Store the error message so `inError` can check if there is an
            // error or not without considering animation
            this.s.globalError = name;
        }
        else {
            // Field error
            this.field(name).error(msg);
        }
        return this;
    }
    /**
     * Get a field object, configured for a named field, which can then be
     * manipulated through its API. This function effectively acts as a
     * proxy to the field extensions, allowing easy access to the methods
     * for a named field. The methods that are available depend upon the field
     * type plug-in for Editor.
     *
     * @param {string} name Field name to be obtained
     * @return {Editor.Field} Field instance
     *
     * @example
     * // Update the values available in a select list
     * editor.field('island').update( [
     *   'Lewis and Harris',
     *   'South Uist',
     *   'North Uist',
     *   'Benbecula',
     *   'Barra'
     * ] );
     *
     * @example
     * // Equivalent calls
     * editor.field('name').set('John Smith');
     *
     * // results in the same action as:
     * editor.set('John Smith');
     */
    function field(name) {
        var sFields = this.s.fields;
        if (!sFields[name]) {
            throw new Error('Unknown field name - ' + name);
        }
        return sFields[name];
    }
    /**
     * Get a list of the fields that are used by the Editor instance.
     *
     * @returns {string[]} Array of field names
     *
     * @example
     * // Get current fields and move first item to the end
     * var fields = editor.fields();
     * var first = fields.shift();
     * fields.push( first );
     * editor.order( fields );
     */
    function fields() {
        return $.map(this.s.fields, function (fieldIn, name) {
            return name;
        });
    }
    /**
     * Get data object for a file from a table and id
     *
     * @param  {string} name Table name
     * @param  {string|number} id Primary key identifier
     * @return {object} Table information
     */
    function file(name, id) {
        var tableFromFile = this.files(name); // can throw. `this` will be Editor or
        var fileFromTable = tableFromFile[id]; //  DataTables.Api context. Both work.
        if (!fileFromTable) {
            throw new Error('Unknown file id ' + id + ' in table ' + name);
        }
        return tableFromFile[id];
    }
    /**
     * Get data objects for available files
     *
     * @param  {string} [name] Table name
     * @return {object} Table array
     */
    function files(name) {
        if (!name) {
            return Editor.files;
        }
        var editorTable = Editor.files[name];
        if (!editorTable) {
            throw new Error('Unknown file table name: ' + name);
        }
        return editorTable;
    }
    /**
     * Get the value of a field
     *
     * @param {string|array} [name] The field name (from the `name` parameter given
     * when originally setting up the field) to disable. If not given, then an
     * object of fields is returned, with the value of each field from the
     * instance represented in the array (the object properties are the field
     * names). Also an array of field names can be given to get a collection of
     * data from the form.
     * @returns {*|object} Value from the named field
     *
     * @example
     * // Client-side validation - check that a field has been given a value
     * // before submitting the form
     * editor.create( 'Add new user', {
     *  "label": "Submit",
     *  "fn": function () {
     *    if ( this.get('username') === '' ) {
     *      this.error( 'username', 'A user name is required' );
     *      return;
     *    }
     *    this.submit();
     *  }
     * } );
     */
    function get(name) {
        var that = this;
        if (!name) {
            name = this.fields();
        }
        if (Array.isArray(name)) {
            var out_1 = {};
            $.each(name, function (i, n) {
                out_1[n] = that.field(n).get();
            });
            return out_1;
        }
        return this.field(name).get();
    }
    /**
     * Remove a field from the form display. Note that the field will still be submitted
     * with the other fields in the form, but it simply won't be visible to the user.
     *
     * @param {string|array} [name] The field name (from the `name` parameter given when
     * originally setting up the field) to hide or an array of names. If not given then all
     * fields are hidden.
     * @param {boolean} [animate=true] Animate if visible
     * @return {Editor} Editor instance, for chaining
     *
     * @example
     * // Show a 'create' record form, but with some fields hidden
     * editor.hide( 'account_type' );
     * editor.hide( 'access_level' );
     * editor.create( 'Add new user', {
     *  "label": "Save",
     *  "fn": function () { this.submit(); }
     * } );
     *
     * @example
     * // Show a single field by hiding all and then showing one
     * editor.hide();
     * editor.show('access_type');
     */
    function hide(names, animate) {
        var that = this;
        $.each(this._fieldNames(names), function (i, n) {
            that.field(n).hide(animate);
        });
        return this;
    }
    /**
     * Get the ids of the rows being edited
     */
    function ids(includeHash) {
        if (includeHash === void 0) { includeHash = false; }
        return $.map(this.s.editFields, function (editIn, idSrc) {
            return includeHash === true ?
                '#' + idSrc :
                idSrc;
        });
    }
    /**
     * Determine if there is an error state in the form, either the form's global
     * error message, or one or more fields.
     *
     * @param {string|array|undefined} [inNames] The field names to check. All
     * fields checked if undefined.
     * @return {boolean} `true` if there is an error in the form
     */
    function inError(inNames) {
        $(this.dom.formError);
        // Is there a global error?
        if (this.s.globalError) {
            return true;
        }
        // Field specific
        var names = this._fieldNames(inNames);
        for (var i = 0, ien = names.length; i < ien; i++) {
            if (this.field(names[i]).inError()) {
                return true;
            }
        }
        return false;
    }
    /**
     * Inline editing. This method provides a method to allow
     * end users to very quickly edit fields in place. For example, a user could
     * simply click on a cell in a table, the contents of which would be replaced
     * with the editing input field for that cell.
     *
     * @param {string|node|DataTables.Api|cell-selector} cell The cell or field to
     * be edited (note that for table editing this must be a cell - for standalone
     * editing it can also be the field name to edit).
     * @param {string} [fieldName] The field name to be edited. This parameter is
     * optional. If not provided, Editor will attempt to resolve the correct field
     * from the cell / element given as the first parameter. If it is unable to do
     * so, it will throw an error.
     * @param {object} [opts] Inline editing options - see the `form-options` type
     * @return {Editor} Editor instance, for chaining
     */
    function inline(cell, fieldName, opts) {
        var _this = this;
        var that = this;
        // Argument shifting
        if ($.isPlainObject(fieldName)) {
            opts = fieldName;
            fieldName = undefined;
        }
        opts = $.extend({}, this.s.formOptions.inline, opts);
        var editFields = this._dataSource('individual', cell, fieldName);
        var keys = Object.keys(editFields);
        // Only a single row
        if (keys.length > 1) {
            throw new Error('Cannot edit more than one row inline at a time');
        }
        var editRow = editFields[keys[0]];
        // Remap so easier to use
        var hosts = [];
        for (var _i = 0, _a = editRow.attach; _i < _a.length; _i++) {
            var row = _a[_i];
            hosts.push(row);
        }
        // Already in edit mode for this cell?
        if ($('div.DTE_Field', hosts).length) {
            return this;
        }
        // Some other field in inline edit mode?
        if (this._tidy(function () {
            that.inline(cell, fieldName, opts);
        })) {
            return this;
        }
        // Start a full row edit, but don't display - we will be showing the field
        this._edit(cell, editFields, 'inline', opts, function () {
            _this._inline(editFields, opts);
        });
        return this;
    }
    /**
     * Inline creation of data.
     */
    function inlineCreate(insertPoint, opts) {
        var _this = this;
        // Argument juggling - allow no insert point, just options
        if ($.isPlainObject(insertPoint)) {
            opts = insertPoint;
            insertPoint = null;
        }
        if (this._tidy(function () {
            _this.inlineCreate(insertPoint, opts);
        })) {
            return this;
        }
        // Set the default for the fields
        $.each(this.s.fields, function (name, fieldIn) {
            fieldIn.multiReset();
            fieldIn.multiSet(0, fieldIn.def());
            fieldIn.set(fieldIn.def());
        });
        this.s.mode = 'main';
        this.s.action = 'create';
        this.s.modifier = null;
        this.s.editFields = this._dataSource('fakeRow', insertPoint);
        opts = $.extend({}, this.s.formOptions.inline, opts);
        this._actionClass();
        this._inline(this.s.editFields, opts, function () {
            // When the form is closed (cancelled or submitted) we need to remove the
            // fake row
            _this._dataSource('fakeRowEnd');
        });
        this._event('initCreate', null);
        return this;
    }
    /**
     * Show an information message for the form as a whole, or for an individual
     * field. This can be used to provide helpful information to a user about an
     * individual field, or more typically the form (for example when deleting
     * a record and asking for confirmation).
     *
     * @param {string} [name] The name of the field to show the message for. If not
     * given then a global message is shown for the form
     * @param {string|function} msg The message to show
     * @return {Editor} Editor instance, for chaining
     *
     * @example
     * // Show a global message for a 'create' form
     * editor.message( 'Add a new user to the database by completing the fields below' );
     * editor.create( 'Add new user', {
     *  "label": "Submit",
     *  "fn": function () { this.submit(); }
     * } );
     *
     * @example
     * // Show a message for an individual field when a 'help' icon is clicked on
     * $('#user_help').click( function () {
     *  editor.message( 'user', 'The user name is what the system user will login with' );
     * } );
     */
    function message(name, msg) {
        if (msg === undefined) {
            // Global message
            this._message(this.dom.formInfo, name);
        }
        else {
            // Field message
            this.field(name).message(msg);
        }
        return this;
    }
    /**
     * Get which mode of operation the Editor form is in
     *
     * @return {string} `create`, `edit`, `remove` or `null` if no active state.
     */
    function mode(modeIn) {
        if (!modeIn) {
            return this.s.action;
        }
        if (!this.s.action) {
            throw new Error('Not currently in an editing mode');
        }
        else if (this.s.action === 'create' && modeIn !== 'create') {
            throw new Error('Changing from create mode is not supported');
        }
        this.s.action = modeIn;
        return this;
    }
    /**
     * Get the modifier that was used to trigger the edit or delete action.
     *
     * @return {*} The identifier that was used for the editing / remove method
     * called.
     */
    function modifier() {
        return this.s.modifier;
    }
    /**
     * Get the values from one or more fields, taking into account multiple data
     * points being edited at the same time.
     *
     * @param  {string|array} fieldNames A single field name or an array of field
     * names.
     * @return {object} If a string is given as the first parameter an object that
     * contains the value for each row being edited is returned. If an array is
     * given, then the object has the field names as the parameter name and the
     * value is the value object with values for each row being edited.
     */
    function multiGet(fieldNames) {
        var that = this;
        if (fieldNames === undefined) {
            fieldNames = this.fields();
        }
        if (Array.isArray(fieldNames)) {
            var out_2 = {};
            $.each(fieldNames, function (i, name) {
                out_2[name] = that.field(name).multiGet();
            });
            return out_2;
        }
        // String
        return this.field(fieldNames).multiGet();
    }
    /**
     * Set the values for one or more fields, taking into account multiple data
     * points being edited at the same time.
     *
     * @param  {object|string} fieldNames The name of the field to set, or an object
     * with the field names as the parameters that contains the value object to
     * set for each field.
     * @param  {*} [valIn] Value to set if first parameter is given as a string.
     * Otherwise it is ignored.
     * @return {Editor} Editor instance, for chaining
     */
    function multiSet(fieldNames, valIn) {
        var that = this;
        if ($.isPlainObject(fieldNames) && valIn === undefined) {
            $.each(fieldNames, function (name, value) {
                that.field(name).multiSet(value);
            });
        }
        else {
            this.field(fieldNames).multiSet(valIn);
        }
        return this;
    }
    /**
     * Get the container node for an individual field.
     *
     * @param {string|array} name The field name (from the `name` parameter given
     * when originally setting up the field) to get the DOM node for.
     * @return {node|array} Field container node
     *
     * @example
     * // Dynamically add a class to a field's container
     * $(editor.node( 'account_type' )).addClass( 'account' );
     */
    function node(name) {
        var that = this;
        if (!name) {
            name = this.order();
        }
        return Array.isArray(name) ?
            $.map(name, function (n) {
                return that.field(n).node();
            }) :
            this.field(name).node();
    }
    /**
     * Remove a bound event listener to the editor instance. This method provides a
     * shorthand way of binding jQuery events that would be the same as writing
     * `$(editor).off(...)` for convenience.
     *
     * @param {string} name Event name to remove the listeners for - event names are
     * defined by {@link Editor}.
     * @param {function} [fn] The function to remove. If not given, all functions which
     * are assigned to the given event name will be removed.
     * @return {Editor} Editor instance, for chaining
     *
     * @example
     * // Add an event to alert when the form is shown and then remove the listener
     * // so it will only fire once
     * editor.on( 'open', function () {
     *  alert('Form displayed!');
     *  editor.off( 'open' );
     * } );
     */
    function off(name, fn) {
        $(this).off(this._eventName(name), fn);
        return this;
    }
    /**
     * Listen for an event which is fired off by Editor when it performs certain
     * actions. This method provides a shorthand way of binding jQuery events that
     * would be the same as writing  `$(editor).on(...)` for convenience.
     *
     * @param {string} name Event name to add the listener for - event names are
     * defined by {@link Editor}.
     * @param {function} fn The function to run when the event is triggered.
     * @return {Editor} Editor instance, for chaining
     *
     * @example
     * // Log events on the console when they occur
     * editor.on( 'open', function () { console.log( 'Form opened' ); } );
     * editor.on( 'close', function () { console.log( 'Form closed' ); } );
     * editor.on( 'submit', function () { console.log( 'Form submitted' ); } );
     */
    function on(name, fn) {
        $(this).on(this._eventName(name), fn);
        return this;
    }
    /**
     * Listen for a single event event which is fired off by Editor when it performs
     * certain actions. This method provides a shorthand way of binding jQuery
     * events that would be the same as writing  `$(editor).one(...)` for
     * convenience.
     *
     * @param {string} name Event name to add the listener for - event names are
     * defined by {@link Editor}.
     * @param {function} fn The function to run when the event is triggered.
     * @return {Editor} Editor instance, for chaining
     */
    function one(name, fn) {
        $(this).one(this._eventName(name), fn);
        return this;
    }
    /**
     * Display the main form editor to the end user in the web-browser.
     *
     * Note that the `close()` method will close any of the three Editor form types
     * (main, bubble and inline), but this method will open only the main type.
     *
     * @return {Editor} Editor instance, for chaining
     *
     * @example
     * // Build a 'create' form, but don't display it until some values have
     * // been set. When done, then display the form.
     * editor.create( 'Create user', {
     *  "label": "Submit",
     *  "fn": function () { this.submit(); }
     * }, false );
     * editor.set( 'name', 'Test user' );
     * editor.set( 'access', 'Read only' );
     * editor.open();
     */
    function open() {
        var _this = this;
        // Insert the display elements in order
        this._displayReorder();
        // Define how to do a close
        this._closeReg(function () {
            _this._nestedClose(function () {
                _this._clearDynamicInfo();
                _this._event('closed', ['main']);
            });
        });
        // Run the standard open with common events
        var ret = this._preopen('main');
        if (!ret) {
            return this;
        }
        this._nestedOpen(function () {
            _this._focus($.map(_this.s.order, function (name) { return _this.s.fields[name]; }), _this.s.editOpts.focus);
            _this._event('opened', ['main', _this.s.action]);
        }, this.s.editOpts.nest);
        this._postopen('main', false);
        return this;
    }
    function order(setIn /* , ... */) {
        if (!setIn) {
            return this.s.order;
        }
        // Allow new layout to be passed in as arguments
        if (arguments.length && !Array.isArray(setIn)) {
            setIn = Array.prototype.slice.call(arguments);
        }
        // Sanity check - array must exactly match the fields we have available
        if (this.s.order.slice().sort().join('-') !== setIn.slice().sort().join('-')) {
            throw new Error('All fields, and no additional fields, must be provided for ordering.');
        }
        // Copy the new array into the order (so the reference is maintained)
        $.extend(this.s.order, setIn);
        this._displayReorder();
        return this;
    }
    /**
     * Remove (delete) entries from the table. The rows to remove are given as
     * either a single DOM node or an array of DOM nodes (including a jQuery
     * object).
     *
     * @param {node|array} items The row, or array of nodes, to delete
     * @param {boolean} [show=true] Show the form or not.
     * @return {Editor} Editor instance, for chaining
     *
     * @example
     * // Delete a given row with a message to let the user know exactly what is
     * // happening
     * editor.message( "Are you sure you want to remove this row?" );
     * editor.remove( row_to_delete, 'Delete row', {
     *  "label": "Confirm",
     *  "fn": function () { this.submit(); }
     * } );
     *
     * @example
     * // Delete the first row in a table without asking the user for confirmation
     * editor.remove( '', $('#example tbody tr:eq(0)')[0], null, false );
     * editor.submit();
     *
     * @example
     * // Delete all rows in a table with a submit button
     * editor.remove( $('#example tbody tr'), 'Delete all rows', {
     *  "label": "Delete all",
     *  "fn": function () { this.submit(); }
     * } );
     */
    function remove(items, arg1, arg2, arg3, arg4) {
        var _this = this;
        var that = this;
        // Some other field in inline edit mode?
        if (this._tidy(function () {
            that.remove(items, arg1, arg2, arg3, arg4);
        })) {
            return this;
        }
        // Allow a single row node to be passed in to remove, Can't use Array.isArray
        // as we also allow array like objects to be passed in (API, jQuery)
        if (items.length === undefined) {
            items = [items];
        }
        var argOpts = this._crudArgs(arg1, arg2, arg3, arg4);
        var editFields = this._dataSource('fields', items);
        this.s.action = 'remove';
        this.s.modifier = items;
        this.s.editFields = editFields;
        this.dom.form.style.display = 'none';
        this._actionClass();
        this._event('initRemove', [
            pluck(editFields, 'node'),
            pluck(editFields, 'data'),
            items
        ], function () {
            _this._event('initMultiRemove', // undocumented and to be removed in v2
                [editFields, items], function () {
                    _this._assembleMain();
                    _this._formOptions(argOpts.opts);
                    argOpts.maybeOpen();
                    var opts = _this.s.editOpts;
                    if (opts.focus !== null) {
                        $('button', _this.dom.buttons).eq(opts.focus).focus();
                    }
                });
        });
        return this;
    }
    /**
     * Set the value of a field
     *
     * @param {string|object} name The field name (from the `name` parameter given
     * when originally setting up the field) to set the value of. If given as an
     * object the object parameter name will be the value of the field to set and
     * the value the value to set for the field.
     * @param {*} [valIn] The value to set the field to. The format of the value will
     * depend upon the field type. Not required if the first parameter is given
     * as an object.
     * @return {Editor} Editor instance, for chaining
     *
     * @example
     * // Set the values of a few fields before then automatically submitting the form
     * editor.create( null, null, false );
     * editor.set( 'name', 'Test user' );
     * editor.set( 'access', 'Read only' );
     * editor.submit();
     */
    function set(setIn, valIn) {
        var that = this;
        if (!$.isPlainObject(setIn)) {
            var o = {};
            o[setIn] = valIn;
            setIn = o;
        }
        $.each(setIn, function (n, v) {
            that.field(n).set(v);
        });
        return this;
    }
    /**
     * Show a field in the display that was previously hidden.
     *
     * @param {string|array} [names] The field name (from the `name` parameter
     * given when originally setting up the field) to make visible, or an array of
     * field names to make visible. If not given all fields are shown.
     * @param {boolean} [animate=true] Animate if visible
     * @return {Editor} Editor instance, for chaining
     *
     * @example
     * // Shuffle the fields that are visible, hiding one field and making two
     * // others visible before then showing the {@link Editor#create} record form.
     * editor.hide( 'username' );
     * editor.show( 'account_type' );
     * editor.show( 'access_level' );
     * editor.create( 'Add new user', {
     *  "label": "Save",
     *  "fn": function () { this.submit(); }
     * } );
     *
     * @example
     * // Show all fields
     * editor.show();
     */
    function show(names, animate) {
        var that = this;
        $.each(this._fieldNames(names), function (i, n) {
            that.field(n).show(animate);
        });
        return this;
    }
    /**
     * Submit a form to the server for processing. The exact action performed will depend
     * on which of the methods {@link Editor#create}, {@link Editor#edit} or
     * {@link Editor#remove} were called to prepare the form - regardless of which one is
     * used, you call this method to submit data.
     *
     * @param {function} [successCallback] Callback function that is executed once the
     * form has been successfully submitted to the server and no errors occurred.
     * @param {function} [errorCallback] Callback function that is executed if the
     * server reports an error due to the submission (this includes a JSON formatting
     * error should the error return invalid JSON).
     * @param {function} [formatdata] Callback function that is passed in the data
     * that will be submitted to the server, allowing pre-formatting of the data,
     * removal of data or adding of extra fields.
     * @param {boolean} [hideIn=true] When the form is successfully submitted, by default
     * the form display will be hidden - this option allows that to be overridden.
     * @return {Editor} Editor instance, for chaining
     *
     * @example
     * // Submit data from a form button
     * editor.create( 'Add new record', {
     *  "label": "Save",
     *  "fn": function () {
     *    this.submit();
     *  }
     * } );
     *
     * @example
     * // Submit without showing the user the form
     * editor.create( null, null, false );
     * editor.submit();
     *
     * @example
     * // Provide success and error callback methods
     * editor.create( 'Add new record', {
     *  "label": "Save",
     *  "fn": function () {
     *    this.submit( function () {
     *        alert( 'Form successfully submitted!' );
     *      }, function () {
     *        alert( 'Form  encountered an error :-(' );
     *      }
     *    );
     *  }
     * } );
     *
     * @example
     * // Add an extra field to the data
     * editor.create( 'Add new record', {
     *  "label": "Save",
     *  "fn": function () {
     *    this.submit( null, null, function (data) {
     *      data.extra = "Extra information";
     *    } );
     *  }
     * } );
     *
     * @example
     * // Don't hide the form immediately - change the title and then close the form
     * // after a small amount of time
     * editor.create( 'Add new record', {
     *  "label": "Save",
     *  "fn": function () {
     *    this.submit(
     *      function () {
     *        var that = this;
     *        this.title( 'Data successfully added!' );
     *        setTimeout( function () {
     *          that.close();
     *        }, 1000 );
     *      },
     *      null,
     *      null,
     *      false
     *    );
     *  }
     * } );
     *
     */
    function submit(successCallback, errorCallback, formatdata, hideIn) {
        var _this = this;
        var sFields = this.s.fields;
        var errorFields = [];
        var errorReady = 0;
        var sent = false;
        if (this.s.processing || !this.s.action) {
            return this;
        }
        this._processing(true);
        // If there are fields in error, we want to wait for the error notification
        // to be cleared before the form is submitted - errorFields tracks the
        // fields which are in the error state, while errorReady tracks those which
        // are ready to submit
        var send = function () {
            if (errorFields.length !== errorReady || sent) {
                return;
            }
            _this._event('initSubmit', [_this.s.action], function (result) {
                if (result === false) {
                    _this._processing(false);
                    return;
                }
                sent = true;
                _this._submit(successCallback, errorCallback, formatdata, hideIn);
            });
        };
        // Remove the global error (don't know if the form is still in an error
        // state!)
        this.error();
        // Count how many fields are in error
        $.each(sFields, function (name, fieldIn) {
            if (fieldIn.inError()) {
                errorFields.push(name);
            }
        });
        // Remove the error display
        $.each(errorFields, function (i, name) {
            sFields[name].error('', function () {
                errorReady++;
                send();
            });
        });
        send();
        return this;
    }
    /**
     * Get / set the DataTable assoc. with this Editor instance
     *
     * @param  {string|node|jQuery|undefined} setIn If undefined, treat as a getter,
     * otherwise set the host DataTable
     * @return {Editor|string|node|jQuery} Self is a setter, otherwise the DataTable
     * / DataTable selector
     */
    function table(setIn) {
        if (setIn === undefined) {
            return this.s.table;
        }
        this.s.table = setIn;
        return this;
    }
    /**
     * Get / set the form template
     *
     * @param  {string|node|jQuery|undefined} setIn If undefined, treat as a getter,
     * otherwise set as the template - usually a selector.
     * @return {Editor|string|node|jQuery} Self is a setter, otherwise the template
     */
    function template(setIn) {
        if (setIn === undefined) {
            return this.s.template;
        }
        this.s.template = setIn === null ?
            null :
            $(setIn);
        return this;
    }
    /**
     * Set the title of the form
     *
     * @param {string|function} titleIn The title to give to the form
     * @return {Editor} Editor instance, for chaining
     *
     * @example
     * // Create an edit display used the title, buttons and edit methods (note that
     * // this is just an example, typically you would use the parameters of the edit
     * // method to achieve this.
     * editor.title( 'Edit record' );
     * editor.buttons( {
     *  "label": "Update",
     *  "fn": function () { this.submit(); }
     * } );
     * editor.edit( TR_to_edit );
     *
     * @example
     * // Show a create form, with a timer for the duration that the form is open
     * editor.create( 'Add new record - time on form: 0s', {
     *  "label": "Save",
     *  "fn": function () { this.submit(); }
     * } );
     *
     * // Add an event to the editor to stop the timer when the display is removed
     * var runTimer = true;
     * var timer = 0;
     * editor.on( 'close', function () {
     *  runTimer = false;
     *  editor.off( 'close' );
     * } );
     * // Start the timer running
     * updateTitle();
     *
     * // Local function to update the title once per second
     * function updateTitle() {
     *  editor.title( 'Add new record - time on form: '+timer+'s' );
     *  timer++;
     *  if ( runTimer ) {
     *    setTimeout( function() {
     *      updateTitle();
     *    }, 1000 );
     *  }
     * }
     */
    function title(titleIn) {
        var header = $(this.dom.header).children('div.' + this.classes.header.content);
        if (titleIn === undefined) {
            return header.html();
        }
        if (typeof titleIn === 'function') {
            titleIn = titleIn(this, new DataTable$5.Api(this.s.table));
        }
        header.html(titleIn);
        return this;
    }
    function val(fieldIn, value) {
        if (value !== undefined || $.isPlainObject(fieldIn)) {
            return this.set(fieldIn, value);
        }
        return this.get(fieldIn); // field can be undefined to get all
    }

    /**
     * Common error message emitter. This method is not (yet) publicly documented on
     * the Editor site. It might be in future.
     *
     * @param  {string} msg Error message
     * @param  {int}    tn  Tech note link
     */
    function error(msg, tn, thro) {
        if (thro === void 0) { thro = true; }
        var display = tn ?
            msg + ' For more information, please refer to https://datatables.net/tn/' + tn :
            msg;
        if (thro) {
            throw display;
        }
        else {
            console.warn(display);
        }
    }
    /**
     * Obtain label / value pairs of data from a data source, be it an array or
     * object, for use in an input that requires label / value pairs such as
     * `select`, `radio` and `checkbox` inputs.
     *
     * A callback function is triggered for each label / value pair found, so the
     * caller can add it to the input as required.
     *
     * @static
     * @param {object|array} An object or array of data to iterate over getting the
     * label / value pairs.
     * @param {object} props When an array of objects is passed in as the data
     * source by default the label will be read from the `label` property and
     * the value from the `value` property of the object. This option can alter
     * that behaviour.
     * @param {function} fn Callback function. Takes three parameters: the label,
     * the value and the iterator index.
     */
    function pairs(data, props, fn) {
        var i;
        var ien;
        var dataPoint;
        // Define default properties to read the data from if using an object.
        // The passed in `props` object and override.
        props = $.extend({
            label: 'label',
            value: 'value'
        }, props);
        if (Array.isArray(data)) {
            // As an array, we iterate each item which can be an object or value
            for (i = 0, ien = data.length; i < ien; i++) {
                dataPoint = data[i];
                if ($.isPlainObject(dataPoint)) {
                    fn(dataPoint[props.value] === undefined ?
                        dataPoint[props.label] :
                        dataPoint[props.value], dataPoint[props.label], i, dataPoint.attr // optional - can be undefined
                    );
                }
                else {
                    fn(dataPoint, dataPoint, i);
                }
            }
        }
        else {
            // As an object the key is the label and the value is the value
            i = 0;
            $.each(data, function (key, val) {
                fn(val, key, i);
                i++;
            });
        }
    }
    /**
     * Field specific upload method. This can be used to upload a file to the Editor
     * libraries. This method is not (yet) publicly documented on the Editor site.
     * It might be in future.
     *
     * @static
     * @param {Editor} editor The Editor instance operating on
     * @param {object} conf Field configuration object
     * @param {Files} files The file(s) to upload
     * @param {function} progressCallback Upload progress callback
     * @param {function} completeCallback Callback function for once the file has
     * been uploaded
     */
    function upload$1(editor, conf, files, progressCallback, completeCallback) {
        var reader = new FileReader();
        var counter = 0;
        var ids = [];
        var generalError = 'A server error occurred while uploading the file';
        // Clear any existing errors, as the new upload might not be in error
        editor.error(conf.name, '');
        if (typeof conf.ajax === 'function') {
            conf.ajax(files, function (idsIn) {
                completeCallback.call(editor, idsIn);
            });
            return;
        }
        progressCallback(conf, conf.fileReadText || '<i>Uploading file</i>');
        reader.onload = function (e) {
            var data = new FormData();
            var ajax;
            data.append('action', 'upload');
            data.append('uploadField', conf.name);
            data.append('upload', files[counter]);
            if (conf.ajaxData) {
                conf.ajaxData(data, files[counter], counter);
            }
            if (conf.ajax) {
                ajax = conf.ajax;
            }
            else if ($.isPlainObject(editor.s.ajax)) {
                ajax = editor.s.ajax.upload ?
                    editor.s.ajax.upload :
                    editor.s.ajax;
            }
            else if (typeof editor.s.ajax === 'string') {
                ajax = editor.s.ajax;
            }
            if (!ajax) {
                throw new Error('No Ajax option specified for upload plug-in');
            }
            if (typeof ajax === 'string') {
                ajax = { url: ajax };
            }
            // Handle the case when the ajax data is given as a function
            if (typeof ajax.data === 'function') {
                var d = {};
                var ret = ajax.data(d);
                // Allow the return to be used, or the object passed in
                if (ret !== undefined && typeof ret !== 'string') {
                    d = ret;
                }
                $.each(d, function (key, value) {
                    data.append(key, value);
                });
            }
            else if ($.isPlainObject(ajax.data)) {
                throw new Error('Upload feature cannot use `ajax.data` with an object. Please use it as a function instead.');
            }
            // Dev cancellable event
            editor._event('preUpload', [conf.name, files[counter], data], function (preRet) {
                // Upload was cancelled
                if (preRet === false) {
                    // If there are other files still to read, spin through them
                    if (counter < files.length - 1) {
                        counter++;
                        reader.readAsDataURL(files[counter]);
                    }
                    else {
                        completeCallback.call(editor, ids);
                    }
                    return;
                }
                // Use preSubmit to stop form submission during an upload, since the
                // value won't be known until that point.
                var submit = false;
                editor
                    .on('preSubmit.DTE_Upload', function () {
                        submit = true;
                        return false;
                    });
                $.ajax($.extend({}, ajax, {
                    contentType: false,
                    data: data,
                    dataType: 'json',
                    error: function (xhr) {
                        editor.error(conf.name, generalError);
                        editor._event('uploadXhrError', [conf.name, xhr]);
                        progressCallback(conf);
                    },
                    processData: false,
                    success: function (json) {
                        editor.off('preSubmit.DTE_Upload');
                        editor._event('uploadXhrSuccess', [conf.name, json]);
                        if (json.fieldErrors && json.fieldErrors.length) {
                            var errors = json.fieldErrors;
                            for (var i = 0, ien = errors.length; i < ien; i++) {
                                editor.error(errors[i].name, errors[i].status);
                            }
                        }
                        else if (json.error) {
                            editor.error(json.error);
                        }
                        else if (!json.upload || !json.upload.id) {
                            editor.error(conf.name, generalError);
                        }
                        else {
                            if (json.files) {
                                // Loop over the tables that are defined
                                $.each(json.files, function (table, filesIn) {
                                    if (!Editor.files[table]) {
                                        Editor.files[table] = {};
                                    }
                                    $.extend(Editor.files[table], filesIn);
                                });
                            }
                            ids.push(json.upload.id);
                            if (counter < files.length - 1) {
                                counter++;
                                reader.readAsDataURL(files[counter]);
                            }
                            else {
                                completeCallback.call(editor, ids);
                                if (submit) {
                                    editor.submit();
                                }
                            }
                        }
                        progressCallback(conf);
                    },
                    type: 'post',
                    xhr: function () {
                        var xhr = $.ajaxSettings.xhr();
                        if (xhr.upload) {
                            xhr.upload.onprogress = function () {
                                if (e.lengthComputable) {
                                    var percent = (e.loaded / e.total * 100).toFixed(0) + '%';
                                    progressCallback(conf, files.length === 1 ?
                                        percent :
                                        counter + ':' + files.length + ' ' + percent);
                                }
                            };
                            xhr.upload.onloadend = function () {
                                progressCallback(conf, conf.processingText || 'Processing');
                            };
                        }
                        return xhr;
                    }
                }));
            });
        };
        // Convert to a plain array
        files = $.map(files, function (val) {
            return val;
        });
        // Truncate the selected files if needed
        if (conf._limitLeft !== undefined) {
            files.splice(conf._limitLeft, files.length);
        }
        reader.readAsDataURL(files[0]);
    }

    var DataTable$4 = $.fn.dataTable;
    var _inlineCounter = 0;
    /**
     * Set the class on the form to relate to the action that is being performed.
     * This allows styling to be applied to the form to reflect the state that
     * it is in.
     *
     * @private
     */
    function _actionClass() {
        var classesActions = this.classes.actions;
        var action = this.s.action;
        var wrapper = $(this.dom.wrapper);
        wrapper.removeClass([classesActions.create, classesActions.edit, classesActions.remove].join(' '));
        if (action === 'create') {
            wrapper.addClass(classesActions.create);
        }
        else if (action === 'edit') {
            wrapper.addClass(classesActions.edit);
        }
        else if (action === 'remove') {
            wrapper.addClass(classesActions.remove);
        }
    }
    /**
     * Create an Ajax request in the same style as DataTables 1.10, with full
     * backwards compatibility for Editor 1.2.
     *
     * @param  {object} data Data to submit
     * @param  {function} success Success callback
     * @param  {function} error Error callback
     * @param  {object} submitParams Submitted data
     * @private
     */
    function _ajax(data, success, error, submitParams) {
        var action = this.s.action;
        var thrown;
        var opts = {
            complete: [function (xhr, text) {
                // Use `complete` rather than `success` so that all status codes are
                // caught and can return valid JSON (useful when working with REST
                // services).
                var json = null;
                if (xhr.status === 204 || xhr.responseText === 'null') {
                    json = {};
                }
                else {
                    try {
                        // jQuery 1.12 or newer for responseJSON, but its the only
                        // way to get the JSON from a JSONP. So if you want to use
                        // JSONP with Editor you have to use jQuery 1.12+.
                        json = xhr.responseJSON ?
                            xhr.responseJSON :
                            JSON.parse(xhr.responseText);
                    }
                    catch (e) { }
                }
                if ($.isPlainObject(json) || Array.isArray(json)) {
                    success(json, xhr.status >= 400, xhr);
                }
                else {
                    error(xhr, text, thrown);
                }
            }],
            data: null,
            dataType: 'json',
            error: [function (xhr, text, err) {
                thrown = err;
            }],
            success: [],
            type: 'POST'
        };
        var a;
        var ajaxSrc = this.s.ajax;
        var id = action === 'edit' || action === 'remove' ?
            pluck(this.s.editFields, 'idSrc').join(',') :
            null;
        // Get the correct object for rest style
        if ($.isPlainObject(ajaxSrc) && ajaxSrc[action]) {
            ajaxSrc = ajaxSrc[action];
        }
        if (typeof ajaxSrc === 'function') {
            // As a function, execute it, passing in the required parameters
            ajaxSrc.call(this, null, null, data, success, error);
            return;
        }
        else if (typeof ajaxSrc === 'string') {
            // As a string it gives the URL. For backwards compatibility it can also
            // give the method.
            if (ajaxSrc.indexOf(' ') !== -1) {
                a = ajaxSrc.split(' ');
                opts.type = a[0];
                opts.url = a[1];
            }
            else {
                opts.url = ajaxSrc;
            }
        }
        else {
            // As an object, we extend the Editor defaults - with the exception of
            // the error and complete functions which get added in so the user can
            // specify their own in addition to ours
            var optsCopy = $.extend({}, ajaxSrc || {});
            if (optsCopy.complete) {
                opts.complete.unshift(optsCopy.complete);
                delete optsCopy.complete;
            }
            if (optsCopy.error) {
                opts.error.unshift(optsCopy.error);
                delete optsCopy.error;
            }
            opts = $.extend({}, opts, optsCopy);
        }
        // URL macros
        if (opts.replacements) {
            $.each(opts.replacements, function (key, repl) {
                opts.url = opts.url.replace('{' + key + '}', repl.call(this, key, id, action, data));
            });
        }
        opts.url = opts.url
            .replace(/_id_/, id)
            .replace(/{id}/, id);
        // Data processing option like in DataTables
        if (opts.data) {
            var isFn = typeof opts.data === 'function';
            var newData = isFn ?
                opts.data(data) : // fn can manipulate data or return an object
                opts.data; // object or array to merge
            // If the function returned something, use that alone
            data = isFn && newData ?
                newData :
                $.extend(true, data, newData);
        }
        opts.data = data;
        // If a DELETE method is used there are a number of servers which will
        // reject the request if it has a body. So we need to append to the URL.
        //
        // http://stackoverflow.com/questions/15088955
        // http://bugs.jquery.com/ticket/11586
        if (opts.type === 'DELETE' && (opts.deleteBody === undefined || opts.deleteBody === true)) {
            var params = $.param(opts.data);
            opts.url += opts.url.indexOf('?') === -1 ?
                '?' + params :
                '&' + params;
            delete opts.data;
        }
        // Finally, make the ajax call
        $.ajax(opts);
    }
    /**
     * Abstraction for jQuery's animate method, to support jQuery slim which doesn't
     * include the animate module
     *
     * @private
     */
    function _animate(target, style, time, callback) {
        if ($.fn.animate) {
            target
                .stop()
                .animate(style, time, callback);
        }
        else {
            target.css(style);
            if (typeof time === 'function') {
                time.call(target);
            }
            else if (callback) {
                callback.call(target);
            }
        }
    }
    /**
     * Create the DOM structure from the source elements for the main form.
     * This is required since the elements can be moved around for other form types
     * (bubble).
     *
     * @private
     */
    function _assembleMain() {
        var dom = this.dom;
        $(dom.wrapper)
            .prepend(dom.header);
        $(dom.footer)
            .append(dom.formError)
            .append(dom.buttons);
        $(dom.bodyContent)
            .append(dom.formInfo)
            .append(dom.form);
    }
    /**
     * Blur the editing window. A blur is different from a close in that it might
     * cause either a close or the form to be submitted. A typical example of a
     * blur would be clicking on the background of the bubble or main editing forms
     * - i.e. it might be a close, or it might submit depending upon the
     * configuration, while a click on the close box is a very definite close.
     *
     * @private
     */
    function _blur() {
        var opts = this.s.editOpts;
        var onBlur = opts.onBlur;
        if (this._event('preBlur') === false) {
            return;
        }
        if (typeof onBlur === 'function') {
            onBlur(this);
        }
        else if (onBlur === 'submit') {
            this.submit();
        }
        else if (onBlur === 'close') {
            this._close();
        }
    }
    /**
     * Clear all of the information that might have been dynamically set while
     * the form was visible - specifically errors and dynamic messages
     *
     * @private
     */
    function _clearDynamicInfo(errorsOnly) {
        if (errorsOnly === void 0) { errorsOnly = false; }
        // Can be triggered due to a destroy if the editor is open
        if (!this.s) {
            return;
        }
        var errorClass = this.classes.field.error;
        var fields = this.s.fields;
        $('div.' + errorClass, this.dom.wrapper).removeClass(errorClass);
        $.each(fields, function (name, field) {
            field.error('');
            if (!errorsOnly) {
                field.message('');
            }
        });
        this.error('');
        if (!errorsOnly) {
            this.message('');
        }
    }
    /**
     * Close an editing display, firing callbacks and events as needed
     *
     * @param  {function} submitComplete Function to call after the preClose event
     * @param  {string} mode Editing mode that is just finished
     * @private
     */
    function _close(submitComplete, mode) {
        var closed;
        // Allow preClose event to cancel the opening of the display
        if (this._event('preClose') === false) {
            return;
        }
        if (this.s.closeCb) {
            closed = this.s.closeCb(submitComplete, mode);
            this.s.closeCb = null;
        }
        if (this.s.closeIcb) {
            this.s.closeIcb();
            this.s.closeIcb = null;
        }
        // Remove focus control
        $('body').off('focus.editor-focus');
        this.s.displayed = false;
        this._event('close');
        if (closed) {
            // Note that `bubble` will call this itself due to the animation
            this._event('closed', [closed]);
        }
    }
    /**
     * Register a function to be called when the editing display is closed. This is
     * used by function that create the editing display to tidy up the display on
     * close - for example removing event handlers to prevent memory leaks.
     *
     * @param  {function} fn Function to call on close
     * @private
     */
    function _closeReg(fn) {
        this.s.closeCb = fn;
    }
    /**
     * Argument shifting for the create(), edit() and remove() methods. In Editor
     * 1.3 the preferred form of calling those three methods is with just two
     * parameters (one in the case of create() - the id and the show flag), while in
     * previous versions four / three parameters could be passed in, including the
     * buttons and title options. In 1.3 the chaining API is preferred, but we want
     * to support the old form as well, so this function is provided to perform
     * that argument shifting, common to all three.
     *
     * @private
     */
    function _crudArgs(arg1, arg2, arg3, arg4) {
        var that = this;
        var title;
        var buttons;
        var show;
        var opts;
        if ($.isPlainObject(arg1)) {
            // Form options passed in as the first option
            opts = arg1;
        }
        else if (typeof arg1 === 'boolean') {
            // Show / hide passed in as the first option - form options second
            show = arg1;
            opts = arg2; // can be undefined
        }
        else {
            // Old style arguments
            title = arg1; // can be undefined
            buttons = arg2; // can be undefined
            show = arg3; // can be undefined
            opts = arg4; // can be undefined
        }
        // If all undefined, then fall into here
        if (show === undefined) {
            show = true;
        }
        if (title) {
            that.title(title);
        }
        if (buttons) {
            that.buttons(buttons);
        }
        return {
            maybeOpen: function () {
                if (show) {
                    that.open();
                }
            },
            opts: $.extend({}, this.s.formOptions.main, opts)
        };
    }
    /**
     * Execute the data source abstraction layer functions. This is simply a case
     * of executing the function with the Editor scope, passing in the remaining
     * parameters.
     *
     * @param {string} name Function name to execute
     * @private
     */
    function _dataSource(name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var dataSource = this.s.table
            ? Editor.dataSources.dataTable
            : Editor.dataSources.html;
        var fn = dataSource[name];
        if (fn) {
            return fn.apply(this, args);
        }
    }
    /**
     * Insert the fields into the DOM, in the correct order
     *
     * @private
     */
    function _displayReorder(includeFields) {
        var _this = this;
        var formContent = $(this.dom.formContent);
        var fields = this.s.fields;
        var order = this.s.order;
        var template = this.s.template;
        var mode = this.s.mode || 'main';
        if (includeFields) {
            this.s.includeFields = includeFields;
        }
        else {
            includeFields = this.s.includeFields;
        }
        // Empty before adding in the required fields
        formContent.children().detach();
        $.each(order, function (i, name) {
            if (_this._weakInArray(name, includeFields) !== -1) {
                if (template && mode === 'main') {
                    template.find('editor-field[name="' + name + '"]').after(fields[name].node());
                    template.find('[data-editor-template="' + name + '"]').append(fields[name].node());
                }
                else {
                    formContent.append(fields[name].node());
                }
            }
        });
        if (template && mode === 'main') {
            template.appendTo(formContent);
        }
        this._event('displayOrder', [
            this.s.displayed,
            this.s.action,
            formContent
        ]);
    }
    /**
     * Generic editing handler. This can be called by the three editing modes (main,
     * bubble and inline) to configure Editor for a row edit, and fire the required
     * events to ensure that the editing interfaces all provide a common API.
     *
     * @param {*} rows Identifier for the item(s) to be edited
     * @param {string} type Editing type - for the initEdit event
     * @private
     */
    function _edit(items, editFields, type, formOptions, setupDone) {
        var _this = this;
        var fields = this.s.fields;
        var usedFields = [];
        var includeInOrder;
        var editData = {};
        this.s.editFields = editFields;
        this.s.editData = editData;
        this.s.modifier = items;
        this.s.action = 'edit';
        this.dom.form.style.display = 'block';
        this.s.mode = type;
        this._actionClass();
        // Setup the field values for editing
        $.each(fields, function (name, field) {
            field.multiReset();
            includeInOrder = false;
            editData[name] = {};
            $.each(editFields, function (idSrc, edit) {
                if (edit.fields[name]) {
                    var val = field.valFromData(edit.data);
                    var nullDefault = field.nullDefault();
                    // Save the set data values so we can decided in submit if data has changed
                    // Note that `null` is stored as an empty string since fields do not currently
                    // have the ability to store a null value - when they are read back (in the
                    // submit) they would be an empty string. When null handling is added to
                    // fields, this will need to be removed.
                    editData[name][idSrc] = val === null ?
                        '' :
                        Array.isArray(val) ?
                            val.slice() :
                            val;
                    // If scoped to edit the whole row, then set all of the fields
                    if (!formOptions || formOptions.scope === 'row') {
                        field.multiSet(idSrc, val === undefined || (nullDefault && val === null) ?
                            field.def() :
                            val, false);
                        if (!edit.displayFields || edit.displayFields[name]) {
                            includeInOrder = true;
                        }
                    }
                    else {
                        // Limit editing to only those fields selected if any are selected
                        if (!edit.displayFields || edit.displayFields[name]) {
                            field.multiSet(idSrc, val === undefined || (nullDefault && val === null) ?
                                field.def() :
                                val, false);
                            includeInOrder = true;
                        }
                    }
                }
            });
            // Loop finished - can do a multi-value check for display of the field now
            field._multiValueCheck();
            // If the field is used, then add it to the fields to be shown
            if (field.multiIds().length !== 0 && includeInOrder) {
                usedFields.push(name);
            }
        });
        // Remove the fields that are not required from the display
        var currOrder = this.order().slice();
        for (var i = currOrder.length - 1; i >= 0; i--) {
            // Use `toString()` to convert numbers to strings, since usedFields
            // contains strings (object property names)
            if ($.inArray(currOrder[i].toString(), usedFields) === -1) {
                currOrder.splice(i, 1);
            }
        }
        this._displayReorder(currOrder);
        // Events
        this._event('initEdit', [
            pluck(editFields, 'node')[0],
            pluck(editFields, 'data')[0],
            items,
            type
        ], function () {
            _this._event('initMultiEdit', // undocumented and to be removed in v2
                [editFields, items, type], function () {
                    setupDone();
                });
        });
    }
    /**
     * Fire callback functions and trigger events.
     *
     * @param {string|array} trigger Name(s) of the jQuery custom event to trigger
     * @param {array} args Array of arguments to pass to the triggered event
     * @return {*} Return from the event
     * @private
     */
    function _event(trigger, args, promiseComplete) {
        if (args === void 0) { args = []; }
        if (promiseComplete === void 0) { promiseComplete = undefined; }
        // Allow an array to be passed in for the trigger to fire multiple events
        if (Array.isArray(trigger)) {
            for (var i = 0, ien = trigger.length; i < ien; i++) {
                this._event(trigger[i], args);
            }
        }
        else {
            var e = $.Event(trigger);
            $(this).triggerHandler(e, args);
            var result = e.result;
            // Automatically trigger a cancelled event if a `pre` event handler
            // was cancelled by the callback
            if (trigger.indexOf('pre') === 0 && result === false) {
                $(this).triggerHandler($.Event(trigger + 'Cancelled'), args);
            }
            // Allow for a promise to be returned and execute a callback
            if (promiseComplete) {
                if (result && typeof result === 'object' && result.then) {
                    // jQuery and "real" promises both provide "then"
                    result.then(promiseComplete);
                }
                else {
                    // If there wasn't a promise returned, then execute immediately
                    promiseComplete(result);
                }
            }
            return result;
        }
    }
    /**
     * 'Modernise' event names, from the old style `on[A-Z]` names to camelCase.
     * This is done to provide backwards compatibility with Editor 1.2- event names.
     * The names themselves were updated for consistency with DataTables.
     *
     * @param {string} Event name to modernise
     * @return {string} String with new event name structure
     * @private
     */
    function _eventName(input) {
        var name;
        var names = input.split(' ');
        for (var i = 0, ien = names.length; i < ien; i++) {
            name = names[i];
            // Strip the 'on' part and lowercase the first character
            var onStyle = name.match(/^on([A-Z])/);
            if (onStyle) {
                name = onStyle[1].toLowerCase() + name.substring(3);
            }
            names[i] = name;
        }
        return names.join(' ');
    }
    /**
     * Find a field from a DOM node. All children are searched.
     *
     * @param  {node} node DOM node to search for
     * @return {Field}     Field instance
     */
    function _fieldFromNode(node) {
        var foundField = null;
        $.each(this.s.fields, function (name, field) {
            if ($(field.node()).find(node).length) {
                foundField = field;
            }
        });
        return foundField;
    }
    /**
     * Convert a field name input parameter to an array of field names.
     *
     * Many of the API methods provide the ability to pass `undefined` a string or
     * array of strings to identify fields. This method harmonises that.
     *
     * @param  {array|string} [fieldNames] Field names to get
     * @return {array}                     Field names
     * @private
     */
    function _fieldNames(fieldNames) {
        if (fieldNames === undefined) {
            return this.fields();
        }
        else if (!Array.isArray(fieldNames)) {
            return [fieldNames];
        }
        return fieldNames;
    }
    /**
     * Focus on a field. Providing the logic to allow complex focus expressions
     *
     * @param {array} fields Array of Field instances or field names for the fields
     * that are shown
     * @param {null|string|integer} focus Field identifier to focus on
     * @private
     */
    function _focus(fieldsIn, focus) {
        var _this = this;
        // Can't focus on a field when in remove mode (they aren't shown).
        if (this.s.action === 'remove') {
            return;
        }
        var field;
        var fields = $.map(fieldsIn, function (fieldOrName) {
            return typeof fieldOrName === 'string' ?
                _this.s.fields[fieldOrName] :
                fieldOrName;
        });
        if (typeof focus === 'number') {
            field = fields[focus];
        }
        else if (focus) {
            if (focus.indexOf('jq:') === 0) {
                field = $('div.DTE ' + focus.replace(/^jq:/, ''));
            }
            else {
                field = this.s.fields[focus];
            }
        }
        else {
            document.activeElement.blur();
        }
        this.s.setFocus = field;
        if (field) {
            field.focus();
        }
    }
    /**
     * Form options - common function so all editing methods can provide the same
     * basic options, DRY.
     *
     * @param {object} opts Editing options. See model.formOptions
     * @private
     */
    function _formOptions(opts) {
        var _this = this;
        var that = this;
        var inlineCount = _inlineCounter++;
        var namespace = '.dteInline' + inlineCount;
        // Backwards compatibility with 1.4
        // if ( opts.closeOnComplete !== undefined ) {
        // 	opts.onComplete = opts.closeOnComplete ? 'close' : 'none';
        // }
        // if ( opts.submitOnBlur !== undefined ) {
        // 	opts.onBlur = opts.submitOnBlur ? 'submit' : 'close';
        // }
        // if ( opts.submitOnReturn !== undefined ) {
        // 	opts.onReturn = opts.submitOnReturn ? 'submit' : 'none';
        // }
        // if ( opts.blurOnBackground !== undefined ) {
        // 	opts.onBackground = opts.blurOnBackground ? 'blur' : 'none';
        // }
        this.s.editOpts = opts;
        // When submitting by Ajax we don't want to close a form that has been
        // opened during the ajax request, so we keep a count of the form opening
        this.s.editCount = inlineCount;
        if (typeof opts.title === 'string' || typeof opts.title === 'function') {
            this.title(opts.title);
            opts.title = true;
        }
        if (typeof opts.message === 'string' || typeof opts.message === 'function') {
            this.message(opts.message);
            opts.message = true;
        }
        if (typeof opts.buttons !== 'boolean') {
            this.buttons(opts.buttons);
            opts.buttons = true;
        }
        // Prevent submit by a host `<form>`
        $(document).on('keydown' + namespace, function (e) {
            if (e.which === 13 && _this.s.displayed) { // return
                var el = $(document.activeElement);
                if (el) {
                    var field = _this._fieldFromNode(el);
                    if (field && typeof field.canReturnSubmit === 'function' && field.canReturnSubmit(el)) {
                        e.preventDefault();
                    }
                }
            }
        });
        $(document).on('keyup' + namespace, function (e) {
            var el = $(document.activeElement);
            if (e.which === 13 && _this.s.displayed) { // return
                var field = _this._fieldFromNode(el);
                // Allow the field plug-in to say if we can submit or not
                if (field && typeof field.canReturnSubmit === 'function' && field.canReturnSubmit(el)) {
                    if (opts.onReturn === 'submit') {
                        e.preventDefault();
                        _this.submit();
                    }
                    else if (typeof opts.onReturn === 'function') {
                        e.preventDefault();
                        opts.onReturn(_this, e);
                    }
                }
            }
            else if (e.which === 27) { // esc
                e.preventDefault();
                if (typeof opts.onEsc === 'function') {
                    opts.onEsc(that, e);
                }
                else if (opts.onEsc === 'blur') {
                    that.blur();
                }
                else if (opts.onEsc === 'close') {
                    that.close();
                }
                else if (opts.onEsc === 'submit') {
                    that.submit();
                }
            }
            else if (el.parents('.DTE_Form_Buttons').length) {
                if (e.which === 37) { // left
                    el.prev('button').trigger('focus');
                }
                else if (e.which === 39) { // right
                    el.next('button').trigger('focus');
                }
            }
        });
        this.s.closeIcb = function () {
            $(document).off('keydown' + namespace);
            $(document).off('keyup' + namespace);
        };
        return namespace;
    }
    /**
     * Inline editing insertion of fields
     */
    function _inline(editFields, opts, closeCb) {
        var _this = this;
        if (closeCb === void 0) { closeCb = null; }
        var closed = false;
        var classes = this.classes.inline;
        var keys = Object.keys(editFields);
        var editRow = editFields[keys[0]];
        var children = null;
        var lastAttachPoint;
        var elements = [];
        for (var i = 0; i < editRow.attach.length; i++) {
            var name_1 = editRow.attachFields[i][0];
            elements.push({
                field: this.s.fields[name_1],
                name: name_1,
                node: $(editRow.attach[i]),
            });
        }
        var namespace = this._formOptions(opts);
        var ret = this._preopen('inline');
        if (!ret) {
            return this;
        }
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var el = elements_1[_i];
            var node = el.node;
            el.children = node.contents().detach();
            // Note the wdith setting shouldn't be required, but Edge increases the column's
            // width if a % width is used (even 1%). This is the workaround
            var style = navigator.userAgent.indexOf('Edge/') !== -1 ?
                'style="width:' + node.width() + 'px"' :
                '';
            node.append($('<div class="' + classes.wrapper + '">' +
                '<div class="' + classes.liner + '" ' + style + '>' +
                '<div class="DTE_Processing_Indicator"><span></span></div>' +
                '</div>' +
                '<div class="' + classes.buttons + '"></div>' +
                '</div>'));
            node.find('div.' + classes.liner.replace(/ /g, '.'))
                .append(el.field.node())
                .append(this.dom.formError);
            // Need the last insert point to allow for number submitTrigger
            lastAttachPoint = el.field.node();
            if (opts.buttons) {
                // Use prepend for the CSS, so we can float the buttons right
                node.find('div.' + classes.buttons.replace(/ /g, '.')).append(this.dom.buttons);
            }
        }
        // If there is a submit trigger target, we need to modify the document to allow submission
        var submitTrigger = opts.submitTrigger;
        if (submitTrigger !== null) {
            // Allow the input to be a column index, including a negative to count from right
            if (typeof submitTrigger === 'number') {
                var kids = $(lastAttachPoint).closest('tr').children();
                submitTrigger = submitTrigger < 0
                    ? kids[kids.length + submitTrigger]
                    : kids[submitTrigger];
            }
            children = Array.prototype.slice.call($(submitTrigger)[0].childNodes);
            $(children).detach();
            // Event handler to submit the form and do nothing else
            $(submitTrigger)
                .on('click.dte-submit', function (e) {
                    e.stopImmediatePropagation();
                    _this.submit();
                })
                .append(opts.submitHtml);
        }
        this._closeReg(function (submitComplete, action) {
            // Mark that this specific inline edit has closed
            closed = true;
            $(document).off('click' + namespace);
            // If there was no submit, we need to put the DOM back as it was. If
            // there was a submit, the write of the new value will set the DOM to
            // how it should be. Note also, check if it was an edit action, if not
            // a create will create new row so we tidy this one up
            if (!submitComplete || action !== 'edit') {
                elements.forEach(function (el) {
                    el.node.contents().detach();
                    el.node.append(el.children);
                });
            }
            if (submitTrigger) {
                $(submitTrigger)
                    .off('click.dte-submit')
                    .empty()
                    .append(children);
            }
            // Clear error messages "offline"
            _this._clearDynamicInfo();
            if (closeCb) {
                closeCb();
            }
            return 'inline'; // trigger `closed`
        });
        // Submit and blur actions
        setTimeout(function () {
            // If already closed, possibly due to some other aspect of the event
            // that triggered the inline call, don't add the event listener - it
            // isn't needed (and is dangerous)
            if (closed) {
                return;
            }
            // andSelf is deprecated in jQ1.8, but we want 1.7 compat
            var back = $.fn.addBack ? 'addBack' : 'andSelf';
            // Chrome uses the target as the element where the mouse up happens,
            // but we want the target being where the mouse down is, to allow for
            // text selection in an input - so listen on mousedown as well.
            var target;
            $(document)
                .on('mousedown' + namespace, function (e) {
                    target = e.target;
                })
                .on('keydown' + namespace, function (e) {
                    target = e.target;
                })
                .on('click' + namespace, function (e) {
                    // Was the click inside or owned by one of the editing nodes? If
                    // not, then come out of editing mode.
                    var isIn = false;
                    for (var _i = 0, elements_2 = elements; _i < elements_2.length; _i++) {
                        var el = elements_2[_i];
                        if (el.field._typeFn('owns', target) ||
                            $.inArray(el.node[0], $(target).parents()[back]()) !== -1) {
                            isIn = true;
                        }
                    }
                    if (!isIn) {
                        _this.blur();
                    }
                });
        }, 0);
        this._focus($.map(elements, function (el) { return el.field; }), opts.focus);
        this._postopen('inline', true);
    }
    /**
     * Update the field options from a JSON data source
     *
     * @param  {object} json JSON object from the server
     * @private
     */
    function _optionsUpdate(json) {
        var that = this;
        if (json.options) {
            $.each(this.s.fields, function (name, field) {
                if (json.options[name] !== undefined) {
                    var fieldInst = that.field(name);
                    if (fieldInst && fieldInst.update) {
                        fieldInst.update(json.options[name]);
                    }
                }
            });
        }
    }
    /**
     * Show a message in the form. This can be used for error messages or dynamic
     * messages (information display) as the structure for each is basically the
     * same. This method will take into account if the form is visible or not - if
     * so then the message is shown with an effect for the end user, otherwise
     * it is just set immediately.
     *
     * @param {element} el The field display node to use
     * @param {string|function} msg The message to show
     * @private
     */
    function _message(el, msg, title, fn) {
        // Allow for jQuery slim
        var canAnimate = $.fn.animate ? true : false;
        if (title === undefined) {
            title = false;
        }
        if (!fn) {
            fn = function () { };
        }
        if (typeof msg === 'function') {
            msg = msg(this, new DataTable$4.Api(this.s.table));
        }
        el = $(el);
        if (canAnimate) {
            el.stop();
        }
        if (!msg) {
            if (this.s.displayed && canAnimate) {
                // Clear the message with visual effect since the form is visible
                el
                    .fadeOut(function () {
                        el.html('');
                        fn();
                    });
            }
            else {
                // Clear the message without visual effect
                el
                    .html('')
                    .css('display', 'none');
                fn();
            }
            if (title) {
                el.removeAttr('title');
            }
        }
        else {
            fn();
            if (this.s.displayed && canAnimate) {
                // Show the message with visual effect
                el
                    .html(msg)
                    .fadeIn();
            }
            else {
                // Show the message without visual effect
                el
                    .html(msg)
                    .css('display', 'block');
            }
            if (title) {
                el.attr('title', msg);
            }
        }
    }
    /**
     * Update the multi-value information display to not show redundant information
     *
     * @private
     */
    function _multiInfo() {
        var fields = this.s.fields;
        var include = this.s.includeFields;
        var show = true;
        var state;
        if (!include) {
            return;
        }
        for (var i = 0, ien = include.length; i < ien; i++) {
            var field = fields[include[i]];
            var multiEditable = field.multiEditable();
            if (field.isMultiValue() && multiEditable && show) {
                // Multi-row editable. Only show first message
                state = true;
                show = false;
            }
            else if (field.isMultiValue() && !multiEditable) {
                // Not multi-row editable. Always show message
                state = true;
            }
            else {
                state = false;
            }
            fields[include[i]].multiInfoShown(state);
        }
    }
    /**
     * Close the current form, which can result in the display controller
     * hiding its display, or showing a form from a level up if nesting
     */
    function _nestedClose(cb) {
        var disCtrl = this.s.displayController;
        var show = disCtrl._show;
        if (!show || !show.length) {
            // Nothing shown just now
            if (cb) {
                cb();
            }
        }
        else if (show.length > 1) {
            // Got nested forms - remove current and go one layer up
            show.pop();
            // Get the one to show
            var last = show[show.length - 1];
            if (cb) {
                cb();
            }
            this.s.displayController.open(last.dte, last.append, last.callback);
        }
        else {
            this.s.displayController.close(this, cb);
            show.length = 0;
        }
    }
    /**
     * Display a form, adding it to the display stack for nesting
     */
    function _nestedOpen(cb, nest) {
        var disCtrl = this.s.displayController;
        // This needs to be per display controller, but the controller
        // itself doesn't know anything about the nesting, so we add a
        // "hidden" property to it, used here, but not by the controller
        // itself.
        if (!disCtrl._show) {
            disCtrl._show = [];
        }
        if (!nest) {
            disCtrl._show.length = 0;
        }
        disCtrl._show.push({
            append: this.dom.wrapper,
            callback: cb,
            dte: this,
        });
        this.s.displayController.open(this, this.dom.wrapper, cb);
    }
    /**
     * Common display editing form method called by all editing methods after the
     * form has been configured and displayed. This is to ensure all fire the same
     * events.
     *
     * @param  {string} type Editing type
     * @param  {boolean} immediate indicate if the open is immediate (in which case
     * `opened` is also triggered).
     * @return {boolean} `true`
     * @private
     */
    function _postopen(type, immediate) {
        var _this = this;
        var focusCapture = this.s.displayController.captureFocus;
        if (focusCapture === undefined) {
            focusCapture = true;
        }
        $(this.dom.form)
            .off('submit.editor-internal')
            .on('submit.editor-internal', function (e) {
                e.preventDefault();
            });
        // Focus capture - when the Editor form is shown we capture the browser's
        // focus action. Without doing this is would result in the user being able
        // to control items under the Editor display - triggering actions that
        // shouldn't be possible while the editing is shown.
        if (focusCapture && (type === 'main' || type === 'bubble')) {
            $('body').on('focus.editor-focus', function () {
                if ($(document.activeElement).parents('.DTE').length === 0 &&
                    $(document.activeElement).parents('.DTED').length === 0) {
                    if (_this.s.setFocus) {
                        _this.s.setFocus.focus();
                    }
                }
            });
        }
        this._multiInfo();
        this._event('open', [type, this.s.action]);
        if (immediate) {
            this._event('opened', [type, this.s.action]);
        }
        return true;
    }
    /**
     * Common display editing form method called by all editing methods before the
     * form has been configured and displayed. This is to ensure all fire the same
     * events.
     *
     * @param  {string} Editing type
     * @return {boolean} `false` if the open is cancelled by the preOpen event,
     * otherwise `true`
     * @private
     */
    function _preopen(type) {
        // Allow preOpen event to cancel the opening of the display
        if (this._event('preOpen', [type, this.s.action]) === false) {
            // Tidy- this would normally be done on close, but we never get that far
            this._clearDynamicInfo();
            this._event('cancelOpen', [type, this.s.action]);
            // inline and bubble methods cannot be opened using `open()`, they
            // have to be called again, so we need to clean up the event
            // listener added by _formOptions
            if ((this.s.mode === 'inline' || this.s.mode === 'bubble') && this.s.closeIcb) {
                this.s.closeIcb();
            }
            this.s.closeIcb = null;
            return false;
        }
        this._clearDynamicInfo(true);
        this.s.displayed = type;
        return true;
    }
    /**
     * Set the form into processing mode or take it out of processing mode. In
     * processing mode a processing indicator is shown and user interaction with the
     * form buttons is blocked
     *
     * @param {boolean} processing true if to go into processing mode and false if
     * to come out of processing mode
     * @private
     */
    function _processing(processing) {
        var procClass = this.classes.processing.active;
        $(['div.DTE', this.dom.wrapper]).toggleClass(procClass, processing);
        this.s.processing = processing;
        this._event('processing', [processing]);
    }
    /**
     * Check if any of the fields are processing for the submit to carry on. It
     * can recurse.
     *
     * @private
     */
    function _noProcessing(args) {
        var processing = false;
        $.each(this.s.fields, function (name, field) {
            if (field.processing()) {
                processing = true;
            }
        });
        if (processing) {
            this.one('processing-field', function () {
                // Are any other fields in a processing state? - Might need to wait again
                if (this._noProcessing(args) === true) {
                    this._submit.apply(this, args);
                }
            });
        }
        return !processing;
    }
    /**
     * Submit a form to the server for processing. This is the private method that is used
     * by the 'submit' API method, which should always be called in preference to calling
     * this method directly.
     *
     * @param {function} [successCallback] Callback function that is executed once the
     * form has been successfully submitted to the server and no errors occurred.
     * @param {function} [errorCallback] Callback function that is executed if the
     * server reports an error due to the submission (this includes a JSON formatting
     * error should the error return invalid JSON).
     * @param {function} [formatdata] Callback function that is passed in the data
     * that will be submitted to the server, allowing pre-formatting of the data,
     * removal of data or adding of extra fields.
     * @param {boolean} [hide=true] When the form is successfully submitted, by default
     * the form display will be hidden - this option allows that to be overridden.
     * @private
     */
    function _submit(successCallback, errorCallback, formatdata, hide) {
        var _this = this;
        var changed = false;
        var allData = {};
        var changedData = {};
        var setBuilder = dataSet;
        var fields = this.s.fields;
        var editCount = this.s.editCount;
        var editFields = this.s.editFields;
        var editData = this.s.editData;
        var opts = this.s.editOpts;
        var changedSubmit = opts.submit;
        var submitParamsLocal;
        // First - are any of the fields currently "processing"? If so, then we
        // want to let them complete before submitting
        if (this._noProcessing(arguments) === false) {
            Editor.error('Field is still processing', 16, false);
            return;
        }
        // After initSubmit to allow `mode()` to be used as a setter
        var action = this.s.action;
        var submitParams = {
            data: {}
        };
        submitParams[this.s.actionName] = action;
        // Gather the data that is to be submitted
        if (action === 'create' || action === 'edit') {
            $.each(editFields, function (idSrc, edit) {
                var allRowData = {};
                var changedRowData = {};
                $.each(fields, function (name, field) {
                    if (edit.fields[name] && field.submittable()) {
                        var multiGet = field.multiGet();
                        var builder = setBuilder(name);
                        // If it wasn't an edit field, we still need to get the original
                        // data, so we can submit it if `all` or `allIfChanged`
                        if (multiGet[idSrc] === undefined) {
                            var originalVal = field.valFromData(edit.data);
                            builder(allRowData, originalVal);
                            return;
                        }
                        var value = multiGet[idSrc];
                        var manyBuilder = Array.isArray(value) && typeof name === 'string' && name.indexOf('[]') !== -1 ?
                            setBuilder(name.replace(/\[.*$/, '') + '-many-count') :
                            null;
                        builder(allRowData, value);
                        // We need to tell the server-side if an array submission
                        // actually has no elements so it knows if the array was
                        // being submitted or not (since otherwise it doesn't know
                        // if the array was empty, or just not being submitted)
                        if (manyBuilder) {
                            manyBuilder(allRowData, value.length);
                        }
                        // Build a changed object for if that is the selected data
                        // type
                        if (action === 'edit' && (!editData[name] || !field.compare(value, editData[name][idSrc]))) {
                            builder(changedRowData, value);
                            changed = true;
                            if (manyBuilder) {
                                manyBuilder(changedRowData, value.length);
                            }
                        }
                    }
                });
                if (!$.isEmptyObject(allRowData)) {
                    allData[idSrc] = allRowData;
                }
                if (!$.isEmptyObject(changedRowData)) {
                    changedData[idSrc] = changedRowData;
                }
            });
            // Decide what data to submit to the server for edit (create is all, always)
            if (action === 'create' || changedSubmit === 'all' || (changedSubmit === 'allIfChanged' && changed)) {
                submitParams.data = allData;
            }
            else if (changedSubmit === 'changed' && changed) {
                submitParams.data = changedData;
            }
            else {
                // Nothing to submit
                this.s.action = null;
                if (opts.onComplete === 'close' && (hide === undefined || hide)) {
                    this._close(false);
                }
                else if (typeof opts.onComplete === 'function') {
                    opts.onComplete(this);
                }
                if (successCallback) {
                    successCallback.call(this);
                }
                this._processing(false);
                this._event('submitComplete');
                return;
            }
        }
        else if (action === 'remove') {
            $.each(editFields, function (idSrc, edit) {
                submitParams.data[idSrc] = edit.data;
            });
        }
        // Local copy of the submit parameters, needed for the data lib prep since
        // the preSubmit can modify the format and we need to know what the format is
        submitParamsLocal = $.extend(true, {}, submitParams);
        // Allow the data to be submitted to the server to be preprocessed by callback
        // and event functions
        if (formatdata) {
            formatdata(submitParams);
        }
        this._event('preSubmit', [submitParams, action], function (result) {
            if (result === false) {
                _this._processing(false);
            }
            else {
                // Submit to the server (or whatever method is defined in the settings)
                var submitWire = _this.s.ajax ?
                    _this._ajax :
                    _this._submitTable;
                submitWire.call(_this, submitParams, function (json, notGood, xhr) {
                    _this._submitSuccess(json, notGood, submitParams, submitParamsLocal, _this.s.action, editCount, hide, successCallback, errorCallback, xhr);
                }, function (xhr, err, thrown) {
                    _this._submitError(xhr, err, thrown, errorCallback, submitParams, _this.s.action);
                }, submitParams);
            }
        });
    }
    /**
     * Save submitted data without an Ajax request. This will write to a local
     * table only - not saving it permanently, but rather using the DataTable itself
     * as a data store.
     *
     * @param  {object} data Data to submit
     * @param  {function} success Success callback
     * @param  {function} error Error callback
     * @param  {object} submitParams Submitted data
     * @private
     */
    function _submitTable(data, success, error, submitParams) {
        var action = data.action;
        var out = { data: [] };
        var idGet = dataGet(this.s.idSrc);
        var idSet = dataSet(this.s.idSrc);
        // Nothing required for remove - create and edit get a copy of the data
        if (action !== 'remove') {
            var originalData_1 = this.s.mode === 'main' ?
                this._dataSource('fields', this.modifier()) :
                this._dataSource('individual', this.modifier());
            $.each(data.data, function (key, vals) {
                var toSave;
                var extender = extend;
                // Get the original row's data, so we can modify it with new values.
                // This allows Editor to not need to submit all fields
                if (action === 'edit') {
                    var rowData = originalData_1[key].data;
                    toSave = extender({}, rowData, true);
                    toSave = extender(toSave, vals, true);
                }
                else {
                    toSave = extender({}, vals, true);
                }
                // If create and there isn't an id for the new row, create
                // one. An id could be creased by `preSubmit`
                var overrideId = idGet(toSave);
                if (action === 'create' && overrideId === undefined) {
                    idSet(toSave, +new Date() + key.toString());
                }
                else {
                    idSet(toSave, overrideId);
                }
                out.data.push(toSave);
            });
        }
        success(out);
    }
    /**
     * Submit success callback function
     *
     * @param  {object} json                Payload
     * @param  {bool} notGood               True if the returned status code was
     * >=400 (i.e. processing failed). This is called `notGood` rather than
     * `success` since the request was successfully processed, just not written to
     * the db. It is also inverted from "good" to make it optional when overriding
     * the `ajax` function.
     * @param  {object} submitParams        Submitted data
     * @param  {object} submitParamsLocal   Unmodified copy of submitted data
     * (before it could be modified by the user)
     * @param  {string} action              CRUD action being taken
     * @param  {int} editCount              Protection against async errors
     * @param  {bool} hide                  Hide the form flag
     * @param  {function} successCallback   Success callback
     * @param  {function} errorCallback     Error callback
     * @private
     */
    function _submitSuccess(json, notGood, submitParams, submitParamsLocal, action, editCount, hide, successCallback, errorCallback, xhr) {
        var _this = this;
        var that = this;
        var setData;
        var fields = this.s.fields;
        var opts = this.s.editOpts;
        var modifier = this.s.modifier;
        this._event('postSubmit', [json, submitParams, action, xhr]);
        if (!json.error) {
            json.error = '';
        }
        if (!json.fieldErrors) {
            json.fieldErrors = [];
        }
        if (notGood || json.error || json.fieldErrors.length) {
            // Global form error
            var globalError_1 = [];
            if (json.error) {
                globalError_1.push(json.error);
            }
            // Field specific errors
            $.each(json.fieldErrors, function (i, err) {
                var field = fields[err.name];
                if (!field) {
                    throw new Error('Unknown field: ' + err.name);
                }
                else if (field.displayed()) {
                    field.error(err.status || 'Error');
                    if (i === 0) {
                        if (opts.onFieldError === 'focus') {
                            // Scroll the display to the first error and focus
                            _this._animate($(_this.dom.bodyContent), { scrollTop: $(field.node()).position().top }, 500);
                            field.focus();
                        }
                        else if (typeof opts.onFieldError === 'function') {
                            opts.onFieldError(_this, err);
                        }
                    }
                }
                else {
                    // If the field isn't visible, we need to make it display as a global error
                    // This _shouldn't_ happen - it means there is invalid data if it does
                    globalError_1.push(field.name() + ': ' + (err.status || 'Error'));
                }
            });
            this.error(globalError_1.join('<br>'));
            this._event('submitUnsuccessful', [json]);
            if (errorCallback) {
                errorCallback.call(that, json);
            }
        }
        else {
            // Create a data store that the data source can use, which is
            // unique to this action
            var store = {};
            if (json.data && (action === 'create' || action === 'edit')) {
                this._dataSource('prep', action, modifier, submitParamsLocal, json, store);
                for (var _i = 0, _a = json.data; _i < _a.length; _i++) {
                    var data = _a[_i];
                    setData = data;
                    var id = this._dataSource('id', data);
                    this._event('setData', [json, data, action]); // legacy
                    if (action === 'create') {
                        // New row was created to add it to the DT
                        this._event('preCreate', [json, data, id]);
                        this._dataSource('create', fields, data, store);
                        this._event(['create', 'postCreate'], [json, data, id]);
                    }
                    else if (action === 'edit') {
                        // Row was updated, so tell the DT
                        this._event('preEdit', [json, data, id]);
                        this._dataSource('edit', modifier, fields, data, store);
                        this._event(['edit', 'postEdit'], [json, data, id]);
                    }
                }
                this._dataSource('commit', action, modifier, json.data, store);
            }
            else if (action === 'remove') {
                this._dataSource('prep', action, modifier, submitParamsLocal, json, store);
                // Remove the rows given and then redraw the table
                this._event('preRemove', [json, this.ids()]);
                this._dataSource('remove', modifier, fields, store);
                this._event(['remove', 'postRemove'], [json, this.ids()]);
                this._dataSource('commit', action, modifier, json.data, store);
            }
            // Submission complete
            if (editCount === this.s.editCount) {
                var sAction = this.s.action;
                this.s.action = null; // Must do before close, in case close starts a new edit
                if (opts.onComplete === 'close' && (hide === undefined || hide)) {
                    // If no data returned, then treat as not complete
                    this._close(json.data ? true : false, sAction);
                }
                else if (typeof opts.onComplete === 'function') {
                    opts.onComplete(this);
                }
            }
            // All done - fire off the callbacks and events
            if (successCallback) {
                successCallback.call(that, json);
            }
            this._event('submitSuccess', [json, setData, action]);
        }
        this._processing(false);
        this._event('submitComplete', [json, setData, action]);
    }
    /**
     * Submit error callback function
     *
     * @private
     */
    function _submitError(xhr, err, thrown, errorCallback, submitParams, action) {
        this._event('postSubmit', [null, submitParams, action, xhr]);
        this.error(this.i18n.error.system);
        this._processing(false);
        if (errorCallback) {
            errorCallback.call(this, xhr, err, thrown);
        }
        this._event(['submitError', 'submitComplete'], [xhr, err, thrown, submitParams]);
    }
    /**
     * Check to see if the form needs to be tidied before a new action can be performed.
     * This includes if the from is currently processing an old action and if it
     * is inline editing.
     *
     * @param {function} fn Callback function
     * @returns {boolean} `true` if was in inline mode, `false` otherwise
     * @private
     */
    function _tidy(fn) {
        var _this = this;
        var dt = this.s.table ?
            new $.fn.dataTable.Api(this.s.table) :
            null;
        var ssp = false;
        if (dt) {
            ssp = dt.settings()[0].oFeatures.bServerSide;
        }
        if (this.s.processing) {
            // If currently processing, wait until the action is complete
            this.one('submitComplete', function () {
                // If server-side processing is being used in DataTables, first
                // check that we are still processing (might not be if nothing was
                // submitted) and then wait for the draw to finished
                if (ssp) {
                    dt.one('draw', fn);
                }
                else {
                    setTimeout(function () {
                        fn();
                    }, 10);
                }
            });
            return true;
        }
        else if (this.display() === 'inline' || this.display() === 'bubble') {
            // If there is an inline edit box, it needs to be tidied
            this
                .one('close', function () {
                    // On close if processing then we need to wait for the submit to
                    // complete before running the callback as onBlur was set to
                    // submit
                    if (!_this.s.processing) {
                        // IE needs a small timeout, otherwise it may not focus on a
                        // field if one already has focus
                        setTimeout(function () {
                            // Check this Editor wasn't destroyed
                            if (_this.s) {
                                fn();
                            }
                        }, 10);
                    }
                    else {
                        // Need to wait for the submit to finish
                        _this.one('submitComplete', function (e, json) {
                            // If SSP then need to wait for the draw
                            if (ssp && json) {
                                dt.one('draw', fn);
                            }
                            else {
                                setTimeout(function () {
                                    if (_this.s) {
                                        fn();
                                    }
                                }, 10);
                            }
                        });
                    }
                })
                .blur();
            return true;
        }
        return false;
    }
    /**
     * Same as $.inArray but with weak type checking
     *
     * @param {any} name Value to look for in the array
     * @param {array} arr Array to scan through
     * @returns {number} -1 if not found, index otherwise
     */
    function _weakInArray(name, arr) {
        for (var i = 0, ien = arr.length; i < ien; i++) {
            if (name == arr[i]) {
                return i;
            }
        }
        return -1;
    }

    var fieldType = {
        create: function () { },
        disable: function () { },
        enable: function () { },
        get: function () { },
        set: function () { }
    };

    var DataTable$3 = $.fn.dataTable;
    // Upload private helper method
    function _buttonText(conf, textIn) {
        if (textIn === null || textIn === undefined) {
            textIn = conf.uploadText || 'Choose file...';
        }
        conf._input.find('div.upload button').html(textIn);
    }
    function _commonUpload(editor, conf, dropCallback, multiple) {
        if (multiple === void 0) { multiple = false; }
        var btnClass = editor.classes.form.buttonInternal;
        var container = $('<div class="editor_upload">' +
            '<div class="eu_table">' +
            '<div class="row">' +
            '<div class="cell upload limitHide">' +
            '<button class="' + btnClass + '"></button>' +
            '<input type="file" ' + (multiple ? 'multiple' : '') + '></input>' +
            '</div>' +
            '<div class="cell clearValue">' +
            '<button class="' + btnClass + '"></button>' +
            '</div>' +
            '</div>' +
            '<div class="row second">' +
            '<div class="cell limitHide">' +
            '<div class="drop"><span></span></div>' +
            '</div>' +
            '<div class="cell">' +
            '<div class="rendered"></div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>');
        conf._input = container;
        conf._enabled = true;
        if (conf.id) {
            container.find('input[type=file]').attr('id', Editor.safeId(conf.id));
        }
        if (conf.attr) {
            container.find('input[type=file]').attr(conf.attr);
        }
        _buttonText(conf);
        if (window.FileReader && conf.dragDrop !== false) {
            container.find('div.drop span').text(conf.dragDropText || 'Drag and drop a file here to upload');
            var dragDrop_1 = container.find('div.drop');
            dragDrop_1
                .on('drop', function (e) {
                    if (conf._enabled) {
                        Editor.upload(editor, conf, e.originalEvent.dataTransfer.files, _buttonText, dropCallback);
                        dragDrop_1.removeClass('over');
                    }
                    return false;
                })
                .on('dragleave dragexit', function (e) {
                    if (conf._enabled) {
                        dragDrop_1.removeClass('over');
                    }
                    return false;
                })
                .on('dragover', function (e) {
                    if (conf._enabled) {
                        dragDrop_1.addClass('over');
                    }
                    return false;
                });
            // When an Editor is open with a file upload input there is a
            // reasonable chance that the user will miss the drop point when
            // dragging and dropping. Rather than loading the file in the browser,
            // we want nothing to happen, otherwise the form will be lost.
            editor
                .on('open', function () {
                    $('body').on('dragover.DTE_Upload drop.DTE_Upload', function (e) {
                        return false;
                    });
                })
                .on('close', function () {
                    $('body').off('dragover.DTE_Upload drop.DTE_Upload');
                });
        }
        else {
            container.addClass('noDrop');
            container.append(container.find('div.rendered'));
        }
        container.find('div.clearValue button').on('click', function (e) {
            e.preventDefault();
            if (conf._enabled) {
                upload.set.call(editor, conf, '');
            }
        });
        container.find('input[type=file]').on('input', function () {
            Editor.upload(editor, conf, this.files, _buttonText, function (ids) {
                dropCallback.call(editor, ids);
                container.find('input[type=file]')[0].value = '';
            });
        });
        return container;
    }
    // Typically a change event caused by the end user will be added to a queue that
    // the browser will handle when no other script is running. However, using
    // `$().trigger()` will cause it to happen immediately, so in order to simulate
    // the standard browser behaviour we use setTimeout. This also means that
    // `dependent()` and other change event listeners will trigger when the field
    // values have all been set, rather than as they are being set - 31594
    function _triggerChange(input) {
        setTimeout(function () {
            input.trigger('change', { editor: true, editorSet: true }); // editorSet legacy
        }, 0);
    }
    // A number of the fields in this file use the same get, set, enable and disable
    // methods (specifically the text based controls), so in order to reduce the code
    // size, we just define them once here in our own local base model for the field
    // types.
    var baseFieldType = $.extend(true, {}, fieldType, {
        canReturnSubmit: function (conf, node) {
            return true;
        },
        disable: function (conf) {
            conf._input.prop('disabled', true);
        },
        enable: function (conf) {
            conf._input.prop('disabled', false);
        },
        get: function (conf) {
            return conf._input.val();
        },
        set: function (conf, val) {
            conf._input.val(val);
            _triggerChange(conf._input);
        }
    });
    var hidden = {
        create: function (conf) {
            conf._val = conf.value;
            return null;
        },
        get: function (conf) {
            return conf._val;
        },
        set: function (conf, val) {
            conf._val = val;
        }
    };
    var readonly = $.extend(true, {}, baseFieldType, {
        create: function (conf) {
            conf._input = $('<input/>').attr($.extend({
                id: Editor.safeId(conf.id),
                readonly: 'readonly',
                type: 'text'
            }, conf.attr || {}));
            return conf._input[0];
        }
    });
    var text = $.extend(true, {}, baseFieldType, {
        create: function (conf) {
            conf._input = $('<input/>').attr($.extend({
                id: Editor.safeId(conf.id),
                type: 'text'
            }, conf.attr || {}));
            return conf._input[0];
        }
    });
    var password = $.extend(true, {}, baseFieldType, {
        create: function (conf) {
            conf._input = $('<input/>').attr($.extend({
                id: Editor.safeId(conf.id),
                type: 'password'
            }, conf.attr || {}));
            return conf._input[0];
        }
    });
    var textarea = $.extend(true, {}, baseFieldType, {
        canReturnSubmit: function (conf, node) {
            return false;
        },
        create: function (conf) {
            conf._input = $('<textarea></textarea>').attr($.extend({
                id: Editor.safeId(conf.id)
            }, conf.attr || {}));
            return conf._input[0];
        }
    });
    var select = $.extend(true, {}, baseFieldType, {
        // Locally "private" function that can be reused for the create and update methods
        _addOptions: function (conf, opts, append) {
            if (append === void 0) { append = false; }
            var elOpts = conf._input[0].options;
            var countOffset = 0;
            if (!append) {
                elOpts.length = 0;
                if (conf.placeholder !== undefined) {
                    var placeholderValue = conf.placeholderValue !== undefined ?
                        conf.placeholderValue :
                        '';
                    countOffset += 1;
                    elOpts[0] = new Option(conf.placeholder, placeholderValue);
                    var disabled = conf.placeholderDisabled !== undefined ?
                        conf.placeholderDisabled :
                        true;
                    elOpts[0].hidden = disabled; // can't be hidden if not disabled!
                    elOpts[0].disabled = disabled;
                    elOpts[0]._editor_val = placeholderValue;
                }
            }
            else {
                countOffset = elOpts.length;
            }
            if (opts) {
                Editor.pairs(opts, conf.optionsPair, function (val, label, i, attr) {
                    var option = new Option(label, val);
                    option._editor_val = val;
                    if (attr) {
                        $(option).attr(attr);
                    }
                    elOpts[i + countOffset] = option;
                });
            }
        },
        create: function (conf) {
            conf._input = $('<select></select>')
                .attr($.extend({
                    id: Editor.safeId(conf.id),
                    multiple: conf.multiple === true
                }, conf.attr || {}))
                .on('change.dte', function (e, d) {
                    // On change, get the user selected value and store it as the
                    // last set, so `update` can reflect it. This way `_lastSet`
                    // always gives the intended value, be it set via the API or by
                    // the end user.
                    if (!d || !d.editor) {
                        conf._lastSet = select.get(conf);
                    }
                });
            select._addOptions(conf, conf.options || conf.ipOpts);
            return conf._input[0];
        },
        destroy: function (conf) {
            conf._input.off('change.dte');
        },
        get: function (conf) {
            var val = conf._input.find('option:selected').map(function () {
                return this._editor_val;
            }).toArray();
            if (conf.multiple) {
                return conf.separator ?
                    val.join(conf.separator) :
                    val;
            }
            return val.length ? val[0] : null;
        },
        set: function (conf, val, localUpdate) {
            if (!localUpdate) {
                conf._lastSet = val;
            }
            // Can't just use `$().val()` because it won't work with strong types
            if (conf.multiple && conf.separator && !Array.isArray(val)) {
                val = typeof val === 'string' ?
                    val.split(conf.separator) :
                    [];
            }
            else if (!Array.isArray(val)) {
                val = [val];
            }
            var i;
            var len = val.length;
            var found;
            var allFound = false;
            var options = conf._input.find('option');
            conf._input.find('option').each(function () {
                found = false;
                for (i = 0; i < len; i++) {
                    // Weak typing
                    if (this._editor_val == val[i]) {
                        found = true;
                        allFound = true;
                        break;
                    }
                }
                this.selected = found;
            });
            // If there is a placeholder, we might need to select it if nothing else
            // was selected. It doesn't make sense to select when multi is enabled
            if (conf.placeholder && !allFound && !conf.multiple && options.length) {
                options[0].selected = true;
            }
            // Update will call change itself, otherwise multiple might be called
            if (!localUpdate) {
                _triggerChange(conf._input);
            }
            return allFound;
        },
        update: function (conf, options, append) {
            select._addOptions(conf, options, append);
            // Attempt to set the last selected value (set by the API or the end
            // user, they get equal priority)
            var lastSet = conf._lastSet;
            if (lastSet !== undefined) {
                select.set(conf, lastSet, true);
            }
            _triggerChange(conf._input);
        }
    });
    var checkbox = $.extend(true, {}, baseFieldType, {
        // Locally "private" function that can be reused for the create and update methods
        _addOptions: function (conf, opts, append) {
            if (append === void 0) { append = false; }
            var jqInput = conf._input;
            var offset = 0;
            if (!append) {
                jqInput.empty();
            }
            else {
                offset = $('input', jqInput).length;
            }
            if (opts) {
                Editor.pairs(opts, conf.optionsPair, function (val, label, i, attr) {
                    jqInput.append('<div>' +
                        '<input id="' + Editor.safeId(conf.id) + '_' + (i + offset) + '" type="checkbox" />' +
                        '<label for="' + Editor.safeId(conf.id) + '_' + (i + offset) + '">' + label + '</label>' +
                        '</div>');
                    $('input:last', jqInput).attr('value', val)[0]._editor_val = val;
                    if (attr) {
                        $('input:last', jqInput).attr(attr);
                    }
                });
            }
        },
        create: function (conf) {
            conf._input = $('<div></div>');
            checkbox._addOptions(conf, conf.options || conf.ipOpts);
            return conf._input[0];
        },
        disable: function (conf) {
            conf._input.find('input').prop('disabled', true);
        },
        enable: function (conf) {
            conf._input.find('input').prop('disabled', false);
        },
        get: function (conf) {
            var out = [];
            var selected = conf._input.find('input:checked');
            if (selected.length) {
                selected.each(function () {
                    out.push(this._editor_val);
                });
            }
            else if (conf.unselectedValue !== undefined) {
                out.push(conf.unselectedValue);
            }
            return conf.separator === undefined || conf.separator === null ?
                out :
                out.join(conf.separator);
        },
        set: function (conf, val) {
            var jqInputs = conf._input.find('input');
            if (!Array.isArray(val) && typeof val === 'string') {
                val = val.split(conf.separator || '|');
            }
            else if (!Array.isArray(val)) {
                val = [val];
            }
            var i;
            var len = val.length;
            var found;
            jqInputs.each(function () {
                found = false;
                for (i = 0; i < len; i++) {
                    if (this._editor_val == val[i]) {
                        found = true;
                        break;
                    }
                }
                this.checked = found;
            });
            _triggerChange(jqInputs);
        },
        update: function (conf, options, append) {
            // Get the current value
            var currVal = checkbox.get(conf);
            checkbox._addOptions(conf, options, append);
            checkbox.set(conf, currVal);
        }
    });
    var radio = $.extend(true, {}, baseFieldType, {
        // Locally "private" function that can be reused for the create and update methods
        _addOptions: function (conf, opts, append) {
            if (append === void 0) { append = false; }
            var jqInput = conf._input;
            var offset = 0;
            if (!append) {
                jqInput.empty();
            }
            else {
                offset = $('input', jqInput).length;
            }
            if (opts) {
                Editor.pairs(opts, conf.optionsPair, function (val, label, i, attr) {
                    jqInput.append('<div>' +
                        '<input id="' + Editor.safeId(conf.id) + '_' + (i + offset) + '" type="radio" name="' + conf.name + '" />' +
                        '<label for="' + Editor.safeId(conf.id) + '_' + (i + offset) + '">' + label + '</label>' +
                        '</div>');
                    $('input:last', jqInput).attr('value', val)[0]._editor_val = val;
                    if (attr) {
                        $('input:last', jqInput).attr(attr);
                    }
                });
            }
        },
        create: function (conf) {
            conf._input = $('<div />');
            radio._addOptions(conf, conf.options || conf.ipOpts);
            // this is ugly, but IE6/7 has a problem with radio elements that are created
            // and checked before being added to the DOM! Basically it doesn't check them. As
            // such we use the _preChecked property to set cache the checked button and then
            // check it again when the display is shown. This has no effect on other browsers
            // other than to cook a few clock cycles.
            this.on('open', function () {
                conf._input.find('input').each(function () {
                    if (this._preChecked) {
                        this.checked = true;
                    }
                });
            });
            return conf._input[0];
        },
        disable: function (conf) {
            conf._input.find('input').prop('disabled', true);
        },
        enable: function (conf) {
            conf._input.find('input').prop('disabled', false);
        },
        get: function (conf) {
            var el = conf._input.find('input:checked');
            if (el.length) {
                return el[0]._editor_val;
            }
            return conf.unselectedValue !== undefined ?
                conf.unselectedValue :
                undefined;
        },
        set: function (conf, val) {
            conf._input.find('input').each(function () {
                this._preChecked = false;
                if (this._editor_val == val) {
                    this.checked = true;
                    this._preChecked = true;
                }
                else {
                    // In a detached DOM tree, there is no relationship between the
                    // input elements, so we need to uncheck any element that does
                    // not match the value
                    this.checked = false;
                    this._preChecked = false;
                }
            });
            _triggerChange(conf._input.find('input:checked'));
        },
        update: function (conf, options, append) {
            var currVal = radio.get(conf);
            radio._addOptions(conf, options, append);
            // Select the current value if it exists in the new data set, otherwise
            // select the first radio input so there is always a value selected
            var inputs = conf._input.find('input');
            radio.set(conf, inputs.filter('[value="' + currVal + '"]').length ?
                currVal :
                inputs.eq(0).attr('value'));
        }
    });
    var datetime = $.extend(true, {}, baseFieldType, {
        create: function (conf) {
            conf._input = $('<input />').attr($.extend(true, {
                id: Editor.safeId(conf.id),
                type: 'text'
            }, conf.attr));
            if (!DataTable$3.DateTime) {
                Editor.error('DateTime library is required', 15);
            }
            conf._picker = new DataTable$3.DateTime(conf._input, $.extend({
                format: conf.displayFormat || conf.format,
                i18n: this.i18n.datetime,
            }, conf.opts));
            conf._closeFn = function () {
                conf._picker.hide();
            };
            if (conf.keyInput === false) {
                conf._input.on('keydown', function (e) {
                    e.preventDefault();
                });
            }
            this.on('close', conf._closeFn);
            return conf._input[0];
        },
        destroy: function (conf) {
            this.off('close', conf._closeFn);
            conf._input.off('keydown');
            conf._picker.destroy();
        },
        errorMessage: function (conf, msg) {
            conf._picker.errorMsg(msg);
        },
        get: function (conf) {
            var val = conf._input.val();
            var inst = conf._picker.c;
            var moment = window.moment;
            // If a wire format is specified, convert the display format to the wire
            return val && conf.wireFormat && moment ?
                moment(val, inst.format, inst.momentLocale, inst.momentStrict).format(conf.wireFormat) :
                val;
        },
        maxDate: function (conf, max) {
            conf._picker.max(max);
        },
        minDate: function (conf, min) {
            conf._picker.min(min);
        },
        // default disable and enable options are okay
        owns: function (conf, node) {
            return conf._picker.owns(node);
        },
        set: function (conf, val) {
            var inst = conf._picker.c;
            var moment = window.moment;
            // If there is a wire format, convert it to the display format
            // Note that special values (e.g. `--now` and empty) do not get formatted
            conf._picker.val(typeof val === 'string' && val && val.indexOf('--') !== 0 && conf.wireFormat && moment ?
                moment(val, conf.wireFormat, inst.momentLocale, inst.momentStrict).format(inst.format) :
                val);
            _triggerChange(conf._input);
        }
    });
    var upload = $.extend(true, {}, baseFieldType, {
        canReturnSubmit: function (conf, node) {
            return false;
        },
        create: function (conf) {
            var editor = this;
            var container = _commonUpload(editor, conf, function (val) {
                upload.set.call(editor, conf, val[0]);
                editor._event('postUpload', [conf.name, val[0]]);
            });
            return container;
        },
        disable: function (conf) {
            conf._input.find('input').prop('disabled', true);
            conf._enabled = false;
        },
        enable: function (conf) {
            conf._input.find('input').prop('disabled', false);
            conf._enabled = true;
        },
        get: function (conf) {
            return conf._val;
        },
        set: function (conf, val) {
            conf._val = val;
            conf._input.val('');
            var container = conf._input;
            if (conf.display) {
                var rendered = container.find('div.rendered');
                if (conf._val) {
                    rendered.html(conf.display(conf._val));
                }
                else {
                    rendered
                        .empty()
                        .append('<span>' + (conf.noFileText || 'No file') + '</span>');
                }
            }
            var button = container.find('div.clearValue button');
            if (val && conf.clearText) {
                button.html(conf.clearText);
                container.removeClass('noClear');
            }
            else {
                container.addClass('noClear');
            }
            conf._input.find('input').triggerHandler('upload.editor', [conf._val]);
        }
    });
    var uploadMany = $.extend(true, {}, baseFieldType, {
        _showHide: function (conf) {
            if (!conf.limit) {
                return;
            }
            conf._container.find('div.limitHide').css('display', conf._val.length >= conf.limit ?
                'none' :
                'block');
            // Used by the Editor.upload static function to truncate if too many
            // files are selected for upload
            conf._limitLeft = conf.limit - conf._val.length;
        },
        canReturnSubmit: function (conf, node) {
            return false;
        },
        create: function (conf) {
            var editor = this;
            var container = _commonUpload(editor, conf, function (val) {
                conf._val = conf._val.concat(val);
                uploadMany.set.call(editor, conf, conf._val);
                editor._event('postUpload', [conf.name, conf._val]);
            }, true);
            container
                .addClass('multi')
                .on('click', 'button.remove', function (e) {
                    e.stopPropagation();
                    if (conf._enabled) {
                        var idx = $(this).data('idx');
                        conf._val.splice(idx, 1);
                        uploadMany.set.call(editor, conf, conf._val);
                    }
                });
            conf._container = container;
            return container;
        },
        disable: function (conf) {
            conf._input.find('input').prop('disabled', true);
            conf._enabled = false;
        },
        enable: function (conf) {
            conf._input.find('input').prop('disabled', false);
            conf._enabled = true;
        },
        get: function (conf) {
            return conf._val;
        },
        set: function (conf, val) {
            // Default value for fields is an empty string, whereas we want []
            if (!val) {
                val = [];
            }
            if (!Array.isArray(val)) {
                throw new Error('Upload collections must have an array as a value');
            }
            conf._val = val;
            conf._input.val('');
            var that = this;
            var container = conf._input;
            if (conf.display) {
                var rendered = container.find('div.rendered').empty();
                if (val.length) {
                    var list_1 = $('<ul></ul>').appendTo(rendered);
                    $.each(val, function (i, file) {
                        var display = conf.display(file, i);
                        if (display !== null) {
                            list_1.append('<li>' +
                                display +
                                ' <button class="' + that.classes.form.button + ' remove" data-idx="' + i + '">&times;</button>' +
                                '</li>');
                        }
                    });
                }
                else {
                    rendered.append('<span>' + (conf.noFileText || 'No files') + '</span>');
                }
            }
            uploadMany._showHide(conf);
            conf._input.find('input').triggerHandler('upload.editor', [conf._val]);
        }
    });
    var datatable = $.extend(true, {}, baseFieldType, {
        _addOptions: function (conf, options, append) {
            if (append === void 0) { append = false; }
            var dt = conf.dt;
            if (!append) {
                dt.clear();
            }
            dt.rows.add(options).draw();
        },
        _jumpToFirst: function (conf) {
            // Find which page in the table the first selected row is
            var idx = conf.dt.row({ order: 'applied', selected: true }).index();
            var page = 0;
            if (typeof idx === 'number') {
                var pageLen = conf.dt.page.info().length;
                var pos = conf.dt.rows({ order: 'applied' }).indexes().indexOf(idx);
                page = pageLen > 0
                    ? Math.floor(pos / pageLen)
                    : 0;
            }
            conf.dt.page(page).draw(false);
        },
        create: function (conf) {
            var _this = this;
            conf.optionsPair = $.extend({
                label: 'label',
                value: 'value'
            }, conf.optionsPair);
            var table = $('<table>');
            var container = $('<div>').append(table);
            var side = $('<div class="DTE_Field_Type_datatable_info">');
            if (conf.footer) {
                $('<tfoot>')
                    .append(Array.isArray(conf.footer)
                        ? $('<tr>').append($.map(conf.footer, function (str) { return $('<th>').html(str); }))
                        : conf.footer)
                    .appendTo(table);
            }
            var dt = table
                .addClass(datatable.tableClass)
                .width('100%')
                .on('init.dt', function (e, settings) {
                    var api = new DataTable$3.Api(settings);
                    var containerNode = $(api.table(undefined).container());
                    // Select init
                    DataTable$3.select.init(api);
                    // Append side button controls
                    side
                        .append(containerNode.find('div.dataTables_filter'))
                        .append(containerNode.find('div.dt-buttons'))
                        .append(containerNode.find('div.dataTables_info'));
                })
                .DataTable($.extend({
                    buttons: [],
                    columns: [
                        {
                            data: conf.optionsPair.label,
                            title: 'Label'
                        }
                    ],
                    deferRender: true,
                    dom: 'fiBtp',
                    language: {
                        paginate: {
                            next: '>',
                            previous: '<',
                        },
                        search: '',
                        searchPlaceholder: 'Search'
                    },
                    lengthChange: false,
                    select: {
                        style: conf.multiple ? 'os' : 'single'
                    },
                }, conf.config));
            this.on('open', function () {
                if (dt.search()) {
                    dt.search('').draw();
                }
                dt.columns.adjust();
            });
            // Change event for when the user does a select - `set` will do its own
            // triggering of the change for the api
            dt.on('user-select', function () {
                _triggerChange($(conf.dt.table().container()));
            });
            if (conf.editor) {
                conf.editor.table(dt);
                conf.editor.on('submitComplete', function (e, json, data, action) {
                    if (action === 'create') {
                        var _loop_1 = function (dp) {
                            dt
                                .rows(function (idx, d) { return d === dp; })
                                .select();
                        };
                        // Automatically select the new data
                        for (var _i = 0, _a = json.data; _i < _a.length; _i++) {
                            var dp = _a[_i];
                            _loop_1(dp);
                        }
                    }
                    else if (action === 'edit' || action === 'remove') {
                        _this._dataSource('refresh');
                    }
                    datatable._jumpToFirst(conf);
                });
            }
            conf.dt = dt;
            datatable._addOptions(conf, conf.options || []);
            return {
                input: container,
                side: side,
            };
        },
        disable: function (conf) {
            conf.dt.select.style('api');
            conf.dt.buttons().container().css('display', 'none');
        },
        dt: function (conf) {
            return conf.dt;
        },
        enable: function (conf) {
            conf.dt.select.style(conf.multiple ? 'os' : 'single');
            conf.dt.buttons().container().css('display', 'block');
        },
        get: function (conf) {
            var rows = conf.dt
                .rows({ selected: true })
                .data()
                .pluck(conf.optionsPair.value)
                .toArray();
            return conf.separator || !conf.multiple
                ? rows.join(conf.separator || ',')
                : rows;
        },
        set: function (conf, val, localUpdate) {
            // Convert to an array of values - works for both single and multiple
            if (conf.multiple && conf.separator && !Array.isArray(val)) {
                val = typeof val === 'string' ?
                    val.split(conf.separator) :
                    [];
            }
            else if (!Array.isArray(val)) {
                val = [val];
            }
            // if ( ! localUpdate ) {
            // 	conf._lastSet = val;
            // }
            var valueFn = dataGet(conf.optionsPair.value);
            conf.dt.rows({ selected: true }).deselect();
            conf.dt.rows(function (idx, data, node) { return val.indexOf(valueFn(data)) !== -1; }).select();
            // Jump to the first page with a selected row (if there are any)
            datatable._jumpToFirst(conf);
            // Update will call change itself, otherwise multiple might be called
            if (!localUpdate) {
                _triggerChange($(conf.dt.table().container()));
            }
        },
        tableClass: '',
        update: function (conf, options, append) {
            datatable._addOptions(conf, options, append);
            // Attempt to set the last selected value (set by the API or the end
            // user, they get equal priority)
            var lastSet = conf._lastSet;
            if (lastSet !== undefined) {
                datatable.set(conf, lastSet, true);
            }
            _triggerChange($(conf.dt.table().container()));
        }
    });

    var defaults = {
        className: '',
        compare: null,
        data: '',
        def: '',
        entityDecode: true,
        fieldInfo: '',
        getFormatter: null,
        id: '',
        label: '',
        labelInfo: '',
        message: '',
        multiEditable: true,
        name: null,
        nullDefault: false,
        setFormatter: null,
        submit: true,
        type: 'text'
    };

    var DataTable$2 = $.fn.dataTable;
    var Field = /** @class */ (function () {
        function Field(options, classes, host) {
            var that = this;
            var multiI18n = host.internalI18n().multi;
            var opts = $.extend(true, {}, Field.defaults, options);
            if (!Editor.fieldTypes[opts.type]) {
                throw new Error('Error adding field - unknown field type ' + opts.type);
            }
            this.s = {
                classes: classes,
                host: host,
                multiIds: [],
                multiValue: false,
                multiValues: {},
                name: opts.name,
                opts: opts,
                processing: false,
                type: Editor.fieldTypes[opts.type],
            };
            // No id, so assign one to have the label reference work
            if (!opts.id) {
                opts.id = 'DTE_Field_' + opts.name;
            }
            // If no `data` option is given, then we use the name from the field as the
            // data prop to read data for the field from DataTables
            if (opts.data === '') {
                opts.data = opts.name;
            }
            // Get and set functions in the data object for the record
            this.valFromData = function (d) {
                // wrapper to automatically pass `editor` as the type
                return dataGet(opts.data)(d, 'editor');
            };
            this.valToData = dataSet(opts.data); // set val to data
            // Field HTML structure
            var template = $('<div class="' +
                classes.wrapper + ' ' + classes.typePrefix + opts.type + ' ' + classes.namePrefix + opts.name + ' ' + opts.className +
                '">' +
                '<label data-dte-e="label" class="' + classes.label + '" for="' + Editor.safeId(opts.id) + '">' +
                opts.label +
                '<div data-dte-e="msg-label" class="' + classes['msg-label'] + '">' + opts.labelInfo + '</div>' +
                '</label>' +
                '<div data-dte-e="input" class="' + classes.input + '">' +
                // Field specific HTML is added here if there is any
                '<div data-dte-e="input-control" class="' + classes.inputControl + '"></div>' +
                '<div data-dte-e="multi-value" class="' + classes.multiValue + '">' +
                multiI18n.title +
                '<span data-dte-e="multi-info" class="' + classes.multiInfo + '">' +
                multiI18n.info +
                '</span>' +
                '</div>' +
                '<div data-dte-e="msg-multi" class="' + classes.multiRestore + '">' +
                multiI18n.restore +
                '</div>' +
                '<div data-dte-e="msg-error" class="' + classes['msg-error'] + '"></div>' +
                '<div data-dte-e="msg-message" class="' + classes['msg-message'] + '">' + opts.message + '</div>' +
                '<div data-dte-e="msg-info" class="' + classes['msg-info'] + '">' + opts.fieldInfo + '</div>' +
                '</div>' +
                '<div data-dte-e="field-processing" class="' + classes.processing + '"><span></span></div>' +
                '</div>');
            var input = this._typeFn('create', opts);
            var side = null;
            if (input && input.side) {
                side = input.side;
                input = input.input;
            }
            if (input !== null) {
                el('input-control', template).prepend(input);
            }
            else {
                template.css('display', 'none');
            }
            this.dom = {
                container: template,
                fieldError: el('msg-error', template),
                fieldInfo: el('msg-info', template),
                fieldMessage: el('msg-message', template),
                inputControl: el('input-control', template),
                label: el('label', template).append(side),
                labelInfo: el('msg-label', template),
                multi: el('multi-value', template),
                multiInfo: el('multi-info', template),
                multiReturn: el('msg-multi', template),
                processing: el('field-processing', template)
            };
            // On click - set a common value for the field
            this.dom.multi.on('click', function () {
                if (that.s.opts.multiEditable && !template.hasClass(classes.disabled) && opts.type !== 'readonly') {
                    that.val('');
                    that.focus();
                }
            });
            this.dom.multiReturn.on('click', function () {
                that.multiRestore();
            });
            // Field type extension methods - add a method to the field for the public
            // methods that each field type defines beyond the default ones that already
            // exist as part of this instance
            $.each(this.s.type, function (name, fn) {
                if (typeof fn === 'function' && that[name] === undefined) {
                    that[name] = function () {
                        var args = Array.prototype.slice.call(arguments);
                        args.unshift(name);
                        var ret = that._typeFn.apply(that, args);
                        // Return the given value if there is one, or the field instance
                        // for chaining if there is no value
                        return ret === undefined ?
                            that :
                            ret;
                    };
                }
            });
        }
        /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
         * Public
         */
        Field.prototype.def = function (set) {
            var opts = this.s.opts;
            if (set === undefined) {
                // Backwards compat
                var def = opts['default'] !== undefined ?
                    opts['default'] :
                    opts.def;
                return typeof def === 'function' ?
                    def() :
                    def;
            }
            opts.def = set;
            return this;
        };
        Field.prototype.disable = function () {
            this.dom.container.addClass(this.s.classes.disabled);
            this._typeFn('disable');
            return this;
        };
        Field.prototype.displayed = function () {
            var container = this.dom.container;
            return container.parents('body').length && container.css('display') !== 'none' ?
                true :
                false;
        };
        Field.prototype.enable = function (toggle) {
            if (toggle === void 0) { toggle = true; }
            if (toggle === false) {
                return this.disable();
            }
            this.dom.container.removeClass(this.s.classes.disabled);
            this._typeFn('enable');
            return this;
        };
        Field.prototype.enabled = function () {
            return this.dom.container.hasClass(this.s.classes.disabled) === false;
        };
        Field.prototype.error = function (msg, fn) {
            var classes = this.s.classes;
            // Add or remove the error class
            if (msg) {
                this.dom.container.addClass(classes.error);
            }
            else {
                this.dom.container.removeClass(classes.error);
            }
            this._typeFn('errorMessage', msg);
            return this._msg(this.dom.fieldError, msg, fn);
        };
        Field.prototype.fieldInfo = function (msg) {
            return this._msg(this.dom.fieldInfo, msg);
        };
        Field.prototype.isMultiValue = function () {
            return this.s.multiValue && this.s.multiIds.length !== 1;
        };
        Field.prototype.inError = function () {
            return this.dom.container.hasClass(this.s.classes.error);
        };
        Field.prototype.input = function () {
            return this.s.type.input ?
                this._typeFn('input') :
                $('input, select, textarea', this.dom.container);
        };
        Field.prototype.focus = function () {
            if (this.s.type.focus) {
                this._typeFn('focus');
            }
            else {
                $('input, select, textarea', this.dom.container).focus();
            }
            return this;
        };
        Field.prototype.get = function () {
            // When multi-value a single get is undefined
            if (this.isMultiValue()) {
                return undefined;
            }
            return this._format(this._typeFn('get'), this.s.opts.getFormatter);
        };
        Field.prototype.hide = function (animate) {
            var el = this.dom.container;
            if (animate === undefined) {
                animate = true;
            }
            if (this.s.host.display() && animate && $.fn.slideUp) {
                el.slideUp();
            }
            else {
                el.css('display', 'none');
            }
            return this;
        };
        Field.prototype.label = function (str) {
            var label = this.dom.label;
            var labelInfo = this.dom.labelInfo.detach();
            if (str === undefined) {
                return label.html();
            }
            label.html(str);
            label.append(labelInfo);
            return this;
        };
        Field.prototype.labelInfo = function (msg) {
            return this._msg(this.dom.labelInfo, msg);
        };
        Field.prototype.message = function (msg, fn) {
            return this._msg(this.dom.fieldMessage, msg, fn);
        };
        // There is no `multiVal()` as its arguments could be ambiguous
        // id is an idSrc value _only_
        Field.prototype.multiGet = function (id) {
            var value;
            var multiValues = this.s.multiValues;
            var multiIds = this.s.multiIds;
            var isMultiValue = this.isMultiValue();
            if (id === undefined) {
                var fieldVal = this.val();
                // Get an object with the values for each item being edited
                value = {};
                for (var _i = 0, multiIds_1 = multiIds; _i < multiIds_1.length; _i++) {
                    var multiId = multiIds_1[_i];
                    value[multiId] = isMultiValue ?
                        multiValues[multiId] :
                        fieldVal;
                }
            }
            else if (isMultiValue) {
                // Individual value
                value = multiValues[id];
            }
            else {
                // Common value
                value = this.val();
            }
            return value;
        };
        Field.prototype.multiRestore = function () {
            this.s.multiValue = true;
            this._multiValueCheck();
        };
        Field.prototype.multiSet = function (id, val, recalc) {
            if (recalc === void 0) { recalc = true; }
            var that = this;
            var multiValues = this.s.multiValues;
            var multiIds = this.s.multiIds;
            if (val === undefined) {
                val = id;
                id = undefined;
            }
            // Set
            var set = function (idSrc, valIn) {
                // Get an individual item's value - add the id to the edit ids if
                // it isn't already in the set.
                if ($.inArray(idSrc, multiIds) === -1) {
                    multiIds.push(idSrc);
                }
                multiValues[idSrc] = that._format(valIn, that.s.opts.setFormatter);
            };
            if ($.isPlainObject(val) && id === undefined) {
                // idSrc / value pairs passed in
                $.each(val, function (idSrc, innerVal) {
                    set(idSrc, innerVal);
                });
            }
            else if (id === undefined) {
                // Set same value for all existing ids
                $.each(multiIds, function (i, idSrc) {
                    set(idSrc, val);
                });
            }
            else {
                // Setting an individual property
                set(id, val);
            }
            this.s.multiValue = true;
            if (recalc) {
                this._multiValueCheck();
            }
            return this;
        };
        Field.prototype.name = function () {
            return this.s.opts.name;
        };
        Field.prototype.node = function () {
            return this.dom.container[0];
        };
        Field.prototype.nullDefault = function () {
            return this.s.opts.nullDefault;
        };
        Field.prototype.processing = function (set) {
            if (set === undefined) {
                return this.s.processing;
            }
            this.dom.processing.css('display', set ? 'block' : 'none');
            this.s.processing = set;
            this.s.host.internalEvent('processing-field', [set]);
            return this;
        };
        // multiCheck is not publicly documented
        Field.prototype.set = function (val, multiCheck) {
            if (multiCheck === void 0) { multiCheck = true; }
            var decodeFn = function (d) {
                return typeof d !== 'string' ?
                    d :
                    d
                        .replace(/&gt;/g, '>')
                        .replace(/&lt;/g, '<')
                        .replace(/&amp;/g, '&')
                        .replace(/&quot;/g, '"')
                        .replace(/&#163;/g, '£')
                        .replace(/&#39;/g, '\'')
                        .replace(/&#10;/g, '\n');
            };
            this.s.multiValue = false;
            var decode = this.s.opts.entityDecode;
            if (decode === undefined || decode === true) {
                if (Array.isArray(val)) {
                    for (var i = 0, ien = val.length; i < ien; i++) {
                        val[i] = decodeFn(val[i]);
                    }
                }
                else {
                    val = decodeFn(val);
                }
            }
            // If triggered from multi check we don't want to do formatting or multi checking again
            if (multiCheck === true) {
                val = this._format(val, this.s.opts.setFormatter);
                this._typeFn('set', val);
                this._multiValueCheck();
            }
            else {
                this._typeFn('set', val);
            }
            return this;
        };
        Field.prototype.show = function (animate, toggle) {
            if (animate === void 0) { animate = true; }
            if (toggle === void 0) { toggle = true; }
            if (toggle === false) {
                return this.hide(animate);
            }
            var el = this.dom.container;
            if (this.s.host.display() && animate && $.fn.slideDown) {
                el.slideDown();
            }
            else {
                el.css('display', ''); // empty to restore css default (flex or block)
            }
            return this;
        };
        Field.prototype.update = function (options, append) {
            if (append === void 0) { append = false; }
            if (this.s.type.update) {
                this._typeFn('update', options, append);
            }
            return this;
        };
        Field.prototype.val = function (val) {
            return val === undefined ?
                this.get() :
                this.set(val);
        };
        /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
         * Internal - Called from Editor only and are not publicly documented -
         * these APIs can change!
         */
        Field.prototype.compare = function (value, original) {
            var compare = this.s.opts.compare || deepCompare;
            return compare(value, original);
        };
        Field.prototype.dataSrc = function () {
            return this.s.opts.data;
        };
        Field.prototype.destroy = function () {
            // remove element
            this.dom.container.remove();
            // field's own destroy method if there is one
            this._typeFn('destroy');
            return this;
        };
        Field.prototype.multiEditable = function () {
            return this.s.opts.multiEditable;
        };
        Field.prototype.multiIds = function () {
            return this.s.multiIds;
        };
        Field.prototype.multiInfoShown = function (show) {
            this.dom.multiInfo.css({ display: show ? 'block' : 'none' });
        };
        Field.prototype.multiReset = function () {
            this.s.multiIds = [];
            this.s.multiValues = {};
        };
        Field.prototype.submittable = function () {
            return this.s.opts.submit;
        };
        /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
         * Internal
         */
        Field.prototype._msg = function (el, msg, fn) {
            if (msg === undefined) {
                return el.html();
            }
            if (typeof msg === 'function') {
                var editor = this.s.host;
                msg = msg(editor, new DataTable$2.Api(editor.internalSettings().table));
            }
            if (el.parent().is(':visible') && $.fn.animate) {
                el.html(msg);
                if (msg) {
                    el.slideDown(fn); // fn can be undefined - so jQuery won't execute it
                }
                else {
                    el.slideUp(fn);
                }
            }
            else {
                // Not visible, so immediately set, or blank out the element
                el
                    .html(msg || '')
                    .css('display', msg ? 'block' : 'none');
                if (fn) {
                    fn();
                }
            }
            return this;
        };
        Field.prototype._multiValueCheck = function () {
            var last;
            var ids = this.s.multiIds;
            var values = this.s.multiValues;
            var isMultiValue = this.s.multiValue;
            var isMultiEditable = this.s.opts.multiEditable;
            var val;
            var different = false;
            if (ids) {
                for (var i = 0; i < ids.length; i++) {
                    val = values[ids[i]];
                    if (i > 0 && !deepCompare(val, last)) {
                        different = true;
                        break;
                    }
                    last = val;
                }
            }
            if ((different && isMultiValue) || (!isMultiEditable && this.isMultiValue())) {
                // Different values or same values, but not multiple editable
                this.dom.inputControl.css({ display: 'none' });
                this.dom.multi.css({ display: 'block' });
            }
            else {
                // All the same value
                this.dom.inputControl.css({ display: 'block' });
                this.dom.multi.css({ display: 'none' });
                if (isMultiValue && !different) {
                    this.set(last, false);
                }
            }
            this.dom.multiReturn.css({
                display: ids && ids.length > 1 && different && !isMultiValue ?
                    'block' :
                    'none'
            });
            // Update information label
            var i18n = this.s.host.internalI18n().multi;
            this.dom.multiInfo.html(isMultiEditable ? i18n.info : i18n.noMulti);
            this.dom.multi.toggleClass(this.s.classes.multiNoEdit, !isMultiEditable);
            this.s.host.internalMultiInfo();
            return true;
        };
        Field.prototype._typeFn = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            // Insert the options as the first parameter - all field type methods
            // take the field's configuration object as the first parameter
            args.unshift(this.s.opts);
            var fn = this.s.type[name];
            if (fn) {
                return fn.apply(this.s.host, args);
            }
        };
        /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
         * Private
         */
        Field.prototype._errorNode = function () {
            return this.dom.fieldError;
        };
        Field.prototype._format = function (val, formatter) {
            if (formatter) {
                if (Array.isArray(formatter)) {
                    var args = formatter.slice();
                    var name_1 = args.shift();
                    formatter = Field.formatters[name_1].apply(this, args);
                }
                return formatter.call(this.s.host, val, this);
            }
            return val;
        };
        Field.defaults = defaults;
        Field.formatters = {};
        return Field;
    }());

    var button = {
        action: null,
        className: null,
        tabIndex: 0,
        text: null,
    };

    var displayController = {
        close: function () { },
        init: function () { },
        node: function () { },
        open: function () { }
    };

    var DataTable$1 = $.fn.dataTable;
    /*
     * DataTables 1.10 API integration. Provides the ability to control basic Editor
     * aspects from the DataTables API. Full control does of course require use of
     * the Editor API though.
     */
    var apiRegister = DataTable$1.Api.register;
    function _getInst(api) {
        var ctx = api.context[0];
        return ctx.oInit.editor || ctx._editor;
    }
    // Set sensible defaults for the editing options
    function _setBasic(inst, opts, type, plural) {
        if (!opts) {
            opts = {};
        }
        if (opts.buttons === undefined) {
            opts.buttons = '_basic';
        }
        if (opts.title === undefined) {
            opts.title = inst.i18n[type].title;
        }
        if (opts.message === undefined) {
            if (type === 'remove') {
                var confirm_1 = inst.i18n[type].confirm;
                opts.message = plural !== 1 ? confirm_1._.replace(/%d/, plural) : confirm_1['1'];
            }
            else {
                opts.message = '';
            }
        }
        return opts;
    }
    apiRegister('editor()', function () {
        return _getInst(this);
    });
    // Row editing
    apiRegister('row.create()', function (opts) {
        // main
        var inst = _getInst(this);
        inst.create(_setBasic(inst, opts, 'create'));
        return this;
    });
    apiRegister('row().edit()', function (opts) {
        // main
        var inst = _getInst(this);
        inst.edit(this[0][0], _setBasic(inst, opts, 'edit'));
        return this;
    });
    apiRegister('rows().edit()', function (opts) {
        // main
        var inst = _getInst(this);
        inst.edit(this[0], _setBasic(inst, opts, 'edit'));
        return this;
    });
    apiRegister('row().delete()', function (opts) {
        // main
        var inst = _getInst(this);
        inst.remove(this[0][0], _setBasic(inst, opts, 'remove', 1));
        return this;
    });
    apiRegister('rows().delete()', function (opts) {
        // main
        var inst = _getInst(this);
        inst.remove(this[0], _setBasic(inst, opts, 'remove', this[0].length));
        return this;
    });
    apiRegister('cell().edit()', function (type, opts) {
        // inline or bubble
        if (!type) {
            type = 'inline';
        }
        else if ($.isPlainObject(type)) {
            opts = type;
            type = 'inline';
        }
        _getInst(this)[type](this[0][0], opts);
        return this;
    });
    apiRegister('cells().edit()', function (opts) {
        // bubble only at the moment
        _getInst(this).bubble(this[0], opts);
        return this;
    });
    apiRegister('file()', file);
    apiRegister('files()', files);
    // Global listener for file information updates via DataTables' Ajax JSON
    $(document).on('xhr.dt', function (e, ctx, json) {
        if (e.namespace !== 'dt') {
            return;
        }
        if (json && json.files) {
            $.each(json.files, function (name, filesIn) {
                if (!Editor.files[name]) {
                    Editor.files[name] = {};
                }
                $.extend(Editor.files[name], filesIn);
            });
        }
    });

    /*
     * Add helpful buttons to make life easier
     *
     * Note that the values that require a string to make any sense (the button text
     * for example) are set by Editor when Editor is initialised through the i18n
     * options.
     */
    var _buttons = $.fn.dataTable.ext.buttons;
    $.extend(_buttons, {
        create: {
            action: function (e, dt, node, config) {
                var that = this;
                var editor = config.editor;
                this.processing(true);
                editor
                    .one('preOpen', function () {
                        that.processing(false);
                    })
                    .create($.extend({
                        buttons: config.formButtons,
                        message: config.formMessage || editor.i18n.create.message,
                        nest: true,
                        title: config.formTitle || editor.i18n.create.title
                    }, config.formOptions));
            },
            className: 'buttons-create',
            editor: null,
            formButtons: {
                action: function (e) {
                    this.submit();
                },
                text: function (editor) {
                    return editor.i18n.create.submit;
                }
            },
            formMessage: null,
            formOptions: {},
            formTitle: null,
            text: function (dt, node, config) {
                return dt.i18n('buttons.create', config.editor.i18n.create.button);
            },
        },
        createInline: {
            action: function (e, dt, node, config) {
                config.editor.inlineCreate(config.position, config.formOptions);
            },
            className: 'buttons-create',
            editor: null,
            formButtons: {
                action: function (e) {
                    this.submit();
                },
                text: function (editor) {
                    return editor.i18n.create.submit;
                }
            },
            formOptions: {},
            position: 'start',
            text: function (dt, node, config) {
                return dt.i18n('buttons.create', config.editor.i18n.create.button);
            },
        },
        edit: {
            action: function (e, dt, node, config) {
                var that = this;
                var editor = config.editor;
                var rows = dt.rows({ selected: true }).indexes();
                var columns = dt.columns({ selected: true }).indexes();
                var cells = dt.cells({ selected: true }).indexes();
                var items = columns.length || cells.length ?
                    {
                        cells: cells,
                        columns: columns,
                        rows: rows
                    } :
                    rows;
                this.processing(true);
                editor
                    .one('preOpen', function () {
                        that.processing(false);
                    })
                    .edit(items, $.extend({
                        buttons: config.formButtons,
                        message: config.formMessage || editor.i18n.edit.message,
                        nest: true,
                        title: config.formTitle || editor.i18n.edit.title
                    }, config.formOptions));
            },
            className: 'buttons-edit',
            editor: null,
            extend: 'selected',
            formButtons: {
                action: function (e) {
                    this.submit();
                },
                text: function (editor) {
                    return editor.i18n.edit.submit;
                },
            },
            formMessage: null,
            formOptions: {},
            formTitle: null,
            text: function (dt, node, config) {
                return dt.i18n('buttons.edit', config.editor.i18n.edit.button);
            },
        },
        remove: {
            action: function (e, dt, node, config) {
                var that = this;
                var editor = config.editor;
                this.processing(true);
                editor
                    .one('preOpen', function () {
                        that.processing(false);
                    })
                    .remove(dt.rows({ selected: true }).indexes(), $.extend({
                        buttons: config.formButtons,
                        message: config.formMessage,
                        nest: true,
                        title: config.formTitle || editor.i18n.remove.title
                    }, config.formOptions));
            },
            className: 'buttons-remove',
            editor: null,
            extend: 'selected',
            formButtons: {
                action: function (e) {
                    this.submit();
                },
                text: function (editor) {
                    return editor.i18n.remove.submit;
                },
            },
            formMessage: function (editor, dt) {
                var rows = dt.rows({ selected: true }).indexes();
                var i18n = editor.i18n.remove;
                var question = typeof i18n.confirm === 'string' ?
                    i18n.confirm :
                    i18n.confirm[rows.length] ?
                        i18n.confirm[rows.length] : i18n.confirm._;
                return question.replace(/%d/g, rows.length);
            },
            formOptions: {},
            formTitle: null,
            limitTo: ['rows'],
            text: function (dt, node, config) {
                return dt.i18n('buttons.remove', config.editor.i18n.remove.button);
            },
        }
    });
    // Reuse the standard edit and remove buttons for their singular equivalent,
    // but set it to extend the single selected button only
    _buttons.editSingle = $.extend({}, _buttons.edit);
    _buttons.editSingle.extend = 'selectedSingle';
    _buttons.removeSingle = $.extend({}, _buttons.remove);
    _buttons.removeSingle.extend = 'selectedSingle';


    if (!DataTable || !DataTable.versionCheck || !DataTable.versionCheck('1.10.20')) {
        throw new Error('Editor requires DataTables 1.10.20 or newer');
    }
    var Editor = /** @class */ (function () {
        function Editor(init) {
            var _this = this;
            this.add = add;
            this.ajax = ajax;
            this.background = background;
            this.blur = blur;
            this.bubble = bubble;
            this.bubblePosition = bubblePosition;
            this.buttons = buttons;
            this.clear = clear;
            this.close = close;
            this.create = create;
            this.undependent = undependent;
            this.dependent = dependent;
            this.destroy = destroy;
            this.disable = disable;
            this.display = display;
            this.displayed = displayed;
            this.displayNode = displayNode;
            this.edit = edit;
            this.enable = enable;
            this.error = error$1;
            this.field = field;
            this.fields = fields;
            this.file = file;
            this.files = files;
            this.get = get;
            this.hide = hide;
            this.ids = ids;
            this.inError = inError;
            this.inline = inline;
            this.inlineCreate = inlineCreate;
            this.message = message;
            this.mode = mode;
            this.modifier = modifier;
            this.multiGet = multiGet;
            this.multiSet = multiSet;
            this.node = node;
            this.off = off;
            this.on = on;
            this.one = one;
            this.open = open;
            this.order = order;
            this.remove = remove;
            this.set = set;
            this.show = show;
            this.submit = submit;
            this.table = table;
            this.template = template;
            this.title = title;
            this.val = val;
            this._actionClass = _actionClass;
            this._ajax = _ajax;
            this._animate = _animate;
            this._assembleMain = _assembleMain;
            this._blur = _blur;
            this._clearDynamicInfo = _clearDynamicInfo;
            this._close = _close;
            this._closeReg = _closeReg;
            this._crudArgs = _crudArgs;
            this._dataSource = _dataSource;
            this._displayReorder = _displayReorder;
            this._edit = _edit;
            this._event = _event;
            this._eventName = _eventName;
            this._fieldFromNode = _fieldFromNode;
            this._fieldNames = _fieldNames;
            this._focus = _focus;
            this._formOptions = _formOptions;
            this._inline = _inline;
            this._optionsUpdate = _optionsUpdate;
            this._message = _message;
            this._multiInfo = _multiInfo;
            this._nestedClose = _nestedClose;
            this._nestedOpen = _nestedOpen;
            this._postopen = _postopen;
            this._preopen = _preopen;
            this._processing = _processing;
            this._noProcessing = _noProcessing;
            this._submit = _submit;
            this._submitTable = _submitTable;
            this._submitSuccess = _submitSuccess;
            this._submitError = _submitError;
            this._tidy = _tidy;
            this._weakInArray = _weakInArray;
            if (!(this instanceof Editor)) {
                alert('DataTables Editor must be initialised as a \'new\' instance');
            }
            init = $.extend(true, {}, Editor.defaults, init);
            this.s = $.extend(true, {}, Editor.models.settings, {
                actionName: init.actionName,
                ajax: init.ajax,
                formOptions: init.formOptions,
                idSrc: init.idSrc,
                table: init.domTable || init.table,
                template: init.template ?
                    $(init.template).detach() : null
            });
            this.classes = $.extend(true, {}, Editor.classes);
            this.i18n = init.i18n;
            // Increment the unique counter for the next instance
            Editor.models.settings.unique++;
            var that = this;
            var classes = this.classes;
            var wrapper = $('<div class="' + classes.wrapper + '">' +
                '<div data-dte-e="processing" class="' + classes.processing.indicator + '"><span></span></div>' +
                '<div data-dte-e="body" class="' + classes.body.wrapper + '">' +
                '<div data-dte-e="body_content" class="' + classes.body.content + '"></div>' +
                '</div>' +
                '<div data-dte-e="foot" class="' + classes.footer.wrapper + '">' +
                '<div class="' + classes.footer.content + '"></div>' +
                '</div>' +
                '</div>');
            var form = $('<form data-dte-e="form" class="' + classes.form.tag + '">' +
                '<div data-dte-e="form_content" class="' + classes.form.content + '"></div>' +
                '</form>');
            this.dom = {
                body: el('body', wrapper)[0],
                bodyContent: el('body_content', wrapper)[0],
                buttons: $('<div data-dte-e="form_buttons" class="' + classes.form.buttons + '"></div>')[0],
                footer: el('foot', wrapper)[0],
                form: form[0],
                formContent: el('form_content', form)[0],
                formError: $('<div data-dte-e="form_error" class="' + classes.form.error + '"></div>')[0],
                formInfo: $('<div data-dte-e="form_info" class="' + classes.form.info + '"></div>')[0],
                header: $('<div data-dte-e="head" class="' +
                    classes.header.wrapper +
                    '"><div class="' +
                    classes.header.content +
                    '"></div></div>')[0],
                processing: el('processing', wrapper)[0],
                wrapper: wrapper[0],
            };
            // Bind callback methods
            $.each(init.events, function (evt, fn) {
                that.on(evt, function () {
                    var argsIn = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        argsIn[_i] = arguments[_i];
                    }
                    // When giving events in the constructor the event argument was not
                    // given in 1.2-, so we remove it here. This is solely for
                    // backwards compatibility as the events in the initialisation are
                    // not documented in 1.3+.
                    fn.apply(that, argsIn);
                });
            });
            // Cache the DOM nodes
            this.dom;
            var table$1 = this.s.table;
            // Add any fields which are given on initialisation
            if (init.fields) {
                this.add(init.fields);
            }
            $(document)
                .on('init.dt.dte' + this.s.unique, function (e, settings, json) {
                    if (_this.s.table && settings.nTable === $(table$1)[0]) {
                        // Attempt to attach to a DataTable automatically when the table is
                        // initialised
                        settings._editor = _this;
                    }
                })
                .on('i18n.dt.dte' + this.s.unique, function (e, settings) {
                    if (_this.s.table && settings.nTable === $(table$1)[0]) {
                        // Use loaded language options
                        if (settings.oLanguage.editor) {
                            $.extend(true, _this.i18n, settings.oLanguage.editor);
                        }
                    }
                })
                .on('xhr.dt.dte' + this.s.unique, function (e, settings, json) {
                    if (json && _this.s.table && settings.nTable === $(table$1)[0]) {
                        // Automatically update fields which have a field name defined in
                        // the returned json - saves an `initComplete` for the user
                        _this._optionsUpdate(json);
                    }
                });
            // Prep the display controller
            if (!Editor.display[init.display]) {
                throw new Error('Cannot find display controller ' + init.display);
            }
            this.s.displayController = Editor.display[init.display].init(this);
            this._event('initComplete', []);
            $(document).trigger('initEditor', [this]);
        }
        // Expose internal methods and options for the Field class to use
        // These are not publicly documented.
        /** @internal */
        Editor.prototype.internalEvent = function (name, args) {
            this._event(name, args);
        };
        /** @internal */
        Editor.prototype.internalI18n = function () {
            return this.i18n;
        };
        /** @internal */
        Editor.prototype.internalMultiInfo = function () {
            return this._multiInfo();
        };
        /** @internal */
        Editor.prototype.internalSettings = function () {
            return this.s;
        };
        Editor.fieldTypes = {
            checkbox: checkbox,
            datatable: datatable,
            datetime: datetime,
            hidden: hidden,
            password: password,
            radio: radio,
            readonly: readonly,
            select: select,
            text: text,
            textarea: textarea,
            upload: upload,
            uploadMany: uploadMany
        };
        Editor.files = {};
        Editor.version = '2.0.10';
        Editor.classes = classNames;
        Editor.Field = Field;
        Editor.DateTime = null;
        Editor.error = error;
        Editor.pairs = pairs;
        Editor.upload = upload$1;
        Editor.defaults = defaults$1;
        Editor.models = {
            button: button,
            displayController: displayController,
            fieldType: fieldType,
            formOptions: formOptions,
            settings: settings,
        };
        Editor.dataSources = {
            dataTable: dataSource$1,
            html: dataSource,
        };
        Editor.display = {
            envelope: envelope,
            lightbox: self,
        };
        Editor.safeId = function (id) {
            return safeDomId(id, '');
        };
        return Editor;
    }());
    DataTable.Editor = Editor;
    $.fn.dataTable.Editor = Editor;
    if (DataTable.DateTime) {
        Editor.DateTime = DataTable.DateTime;
    }
    // If there are field types available on DataTables we copy them in (after the
    // built in ones to allow overrides) and then expose the field types object.
    if (DataTable.ext.editorFields) {
        $.extend(Editor.fieldTypes, DataTable.ext.editorFields);
    }
    DataTable.ext.editorFields = Editor.fieldTypes;



    return Editor;
}));
if (!DataTable.ext.editorFields) {
    DataTable.ext.editorFields = {};
}
var _fieldTypes = DataTable.Editor ? DataTable.Editor.fieldTypes : DataTable.ext.editorFields;
_fieldTypes.select2 = {
    _addOptions: function (conf, options) {
        var elOpts = conf._input[0].options;
        elOpts.length = 0;
        if (options) {
            DataTable.Editor.pairs(options, conf.optionsPair, function (val, label, i) {
                elOpts[i] = new Option(label, val);
            });
        }
    },
    create: function (conf) {
        var editor = this;
        conf._input = $('<select/>').attr(
            $.extend({
                id: DataTable.Editor.safeId(conf.id),
                multiple: conf.multiple === true
            },
                conf.attr || {}));

        _fieldTypes.select2._addOptions(conf, conf.options || conf.ipOpts);
        editor.on('open.select2' + DataTable.Editor.safeId(conf.id), function () {
            conf._input.select2($.extend({}, conf.opts, {
                //Default options
                width: '100%',
                // following property require for inline edit change event handling
                dropdownParent: $('body'),//$(conf._input).parent().parent(),
                containerCssClass: $(conf._input).attr("class")
            }));
        });
        return conf._input[0];
    },

    update: function (conf, options) {
        conf.options = options;
        _fieldTypes.select2._addOptions(conf, options);
    },
    get: function (conf) {
        var val = conf._input.val();
        return conf._input.prop('multiple') && val === null ? [] : val;
    },
    set: function (conf, val) {
        _fieldTypes.select2._addOptions(conf, conf.options || conf.ipOpts);
        if (val && val.length) {
            for (var i = 0; i < val.length; i++) {
                if ($(conf._input).find("option[value='" + val[i] + "']").length) {
                } else {
                    if (val[i] != "") {
                        // Create the DOM option that is pre-selected by default 
                        var newState = new Option(val[i], val[i], true, true);
                        // Append it to the select 
                        $(conf._input).append(newState).trigger('change');
                    }
                }
            }
            $(conf._input).val(val).trigger("change");
        } else {
            conf._input.select2().val(val).trigger('change');
        }
    },
    enable: function (conf) {
        $(conf._input).prop('disabled', false);
        $(conf._input).selectpicker('refresh');
    },
    disable: function (conf) {
        $(conf._input).prop('disabled', true);
        $(conf._input).selectpicker('refresh');
    },
};

/*! Bootstrap integration for DataTables' Editor
 * © SpryMedia Ltd - datatables.net/license
 https://editor.datatables.net/extensions/Editor/js/editor.bootstrap5.js
 */

(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery', 'datatables.net-bs5', 'datatables.net-editor'], function ($) {
			return factory($, window, document);
		});
	}
	else if (typeof exports === 'object') {
		// CommonJS
		module.exports = function (root, $) {
			if (!root) {
				// CommonJS environments without a window global must pass a
				// root. This will give an error otherwise
				root = window;
			}

			if (!$) {
				$ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window
					require('jquery') :
					require('jquery')(root);
			}

			if (!$.fn.dataTable) {
				require('datatables.net-bs5')(root, $);
			}

			if (!$.fn.dataTable) {
				require('datatables.net-editor')(root, $);
			}


			return factory($, root, root.document);
		};
	}
	else {
		// Browser
		factory(jQuery, window, document);
	}
}(function ($, window, document, undefined) {
	'use strict';
	var DataTable = $.fn.dataTable;


	var Editor = DataTable.Editor;

	/*
	 * Set the default display controller to be our bootstrap control 
	 */
	DataTable.Editor.defaults.display = "bootstrap";


	/*
	 * Alter the buttons that Editor adds to Buttons so they are suitable for bootstrap
	 */
	//var i18nDefaults = DataTable.Editor.defaults.i18n;
	//i18nDefaults.create.title = '<h5 class="modal-title">' + i18nDefaults.create.title + '</h5>';
	//i18nDefaults.edit.title = '<h5 class="modal-title">' + i18nDefaults.edit.title + '</h5>';
	//i18nDefaults.remove.title = '<h5 class="modal-title">' + i18nDefaults.remove.title + '</h5>';


	///*
	// * Change the default classes from Editor to be classes for Bootstrap
	// */
	//$.extend(true, $.fn.dataTable.Editor.classes, {
	//	"header": {
	//		"wrapper": "DTE_Header modal-header"
	//	},
	//	"body": {
	//		"wrapper": "DTE_Body modal-body"
	//	},
	//	"footer": {
	//		"wrapper": "DTE_Footer modal-footer"
	//	},
	//	"form": {
	//		"tag": "form-horizontal",
	//		"button": "btn",
	//		"buttonInternal": "btn btn-outline-secondary"
	//	},
	//	"field": {
	//		"wrapper": "DTE_Field form-group row",
	//		"label": "col-lg-4 col-form-label",
	//		"input": "col-lg-8",
	//		"error": "error is-invalid",
	//		"msg-labelInfo": "form-text text-secondary small",
	//		"msg-info": "form-text text-secondary small",
	//		"msg-message": "form-text text-secondary small",
	//		"msg-error": "form-text text-danger small",
	//		"multiValue": "card multi-value",
	//		"multiInfo": "small",
	//		"multiRestore": "multi-restore"
	//	}
	//});

	$.extend(true, DataTable.ext.buttons, {
		create: {
			formButtons: {
				className: 'btn-primary'
			}
		},
		edit: {
			formButtons: {
				className: 'btn-primary'
			}
		},
		remove: {
			formButtons: {
				className: 'btn-danger'
			}
		}
	});

	DataTable.Editor.fieldTypes.datatable.tableClass = 'table';

	/*
	 * Bootstrap display controller - this is effectively a proxy to the Bootstrap
	 * modal control.
	 */
	let shown = false;
	let fullyShown = false;

	const dom = {
		content: $(
			'<div class="modal fade DTED">' +
			'<div class="modal-dialog modal-dialog-scrollable modal-dialog-centered"></div>' +
			'</div>'
		),
		close: $('<button class="btn-close"></div>')
	};
	let modal;
	let _bs = window.bootstrap;

	DataTable.Editor.bootstrap = function (bs) {
		_bs = bs;
	}

	DataTable.Editor.display.bootstrap = $.extend(true, {}, DataTable.Editor.models.displayController, {
		/*
		 * API methods
		 */
		init: function (dte) {
			// Add `form-control` to required elements
			dte.on('displayOrder.dtebs open.dtebs', function (e, display, action, form) {
				$.each(dte.s.fields, function (key, field) {
					$('input:not([type=checkbox]):not([type=radio]), select, textarea', field.node())
						.addClass('form-control');

					$('input[type=checkbox], input[type=radio]', field.node())
						.addClass('form-check-input');

					$('select', field.node())
						.addClass('form-select');
				});
			});

			return DataTable.Editor.display.bootstrap;
		},

		open: function (dte, append, callback) {
			if (!modal) {
				modal = new _bs.Modal(dom.content[0], {
					backdrop: "static",
					keyboard: false
				});
			}

			$(append).addClass('modal-content');

			// Special class for DataTable buttons in the form
			$(append).find('div.DTE_Field_Type_datatable div.dt-buttons')
				.removeClass('btn-group')
				.addClass('btn-group-vertical');

			// Setup events on each show
			dom.close
				.attr('title', dte.i18n.close)
				.off('click.dte-bs5')
				.on('click.dte-bs5', function () {
					dte.close('icon');
				})
				.appendTo($('div.modal-header', append));

			// This is a bit horrible, but if you mousedown and then drag out of the modal container, we don't
			// want to trigger a background action.
			let allowBackgroundClick = false;
			$(document)
				.off('mousedown.dte-bs5')
				.on('mousedown.dte-bs5', 'div.modal', function (e) {
					allowBackgroundClick = $(e.target).hasClass('modal') && shown
						? true
						: false;
				});

			$(document)
				.off('click.dte-bs5')
				.on('click.dte-bs5', 'div.modal', function (e) {
					if ($(e.target).hasClass('modal') && allowBackgroundClick) {
						dte.background();
					}
				});

			var content = dom.content.find('div.modal-dialog');
			content.children().detach();
			content.append(append);

			if (shown) {
				if (callback) {
					callback();
				}
				return;
			}

			shown = true;
			fullyShown = false;

			$(dom.content)
				.one('shown.bs.modal', function () {
					// Can only give elements focus when shown
					if (dte.s.setFocus) {
						dte.s.setFocus.focus();
					}

					fullyShown = true;

					if (callback) {
						callback();
					}
				})
				.one('hidden', function () {
					shown = false;
				})
				.appendTo('body');

			modal.show();
		},

		close: function (dte, callback) {
			if (!shown) {
				if (callback) {
					callback();
				}
				return;
			}

			// Check if actually displayed or not before hiding. BS4 doesn't like `hide`
			// before it has been fully displayed
			if (!fullyShown) {
				$(dom.content)
					.one('shown.bs.modal', function () {
						DataTable.Editor.display.bootstrap.close(dte, callback);
					});

				return;
			}

			$(dom.content)
				.one('hidden.bs.modal', function () {
					$(this).detach();
				});

			modal.hide();

			shown = false;
			fullyShown = false;

			if (callback) {
				callback();
			}
		},

		node: function (dte) {
			return dom.content[0];
		}
	});


	return Editor;
}));
/*! Buttons for DataTables 2.3.3
 * ©2016-2022 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				// CommonJS environments without a window global must pass a
				// root. This will give an error otherwise
				root = window;
			}

			if ( ! $ ) {
				$ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window
					require('jquery') :
					require('jquery')( root );
			}

			if ( ! $.fn.dataTable ) {
				require('datatables.net')(root, $);
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;



// Used for namespacing events added to the document by each instance, so they
// can be removed on destroy
var _instCounter = 0;

// Button namespacing counter for namespacing events on individual buttons
var _buttonCounter = 0;

var _dtButtons = DataTable.ext.buttons;

// Allow for jQuery slim
function _fadeIn(el, duration, fn) {
	if ($.fn.animate) {
		el
			.stop()
			.fadeIn( duration, fn );

	}
	else {
		el.css('display', 'block');

		if (fn) {
			fn.call(el);
		}
	}
}

function _fadeOut(el, duration, fn) {
	if ($.fn.animate) {
		el
			.stop()
			.fadeOut( duration, fn );
	}
	else {
		el.css('display', 'none');
		
		if (fn) {
			fn.call(el);
		}
	}
}

/**
 * [Buttons description]
 * @param {[type]}
 * @param {[type]}
 */
var Buttons = function( dt, config )
{
	// If not created with a `new` keyword then we return a wrapper function that
	// will take the settings object for a DT. This allows easy use of new instances
	// with the `layout` option - e.g. `topLeft: $.fn.dataTable.Buttons( ... )`.
	if ( !(this instanceof Buttons) ) {
		return function (settings) {
			return new Buttons( settings, dt ).container();
		};
	}

	// If there is no config set it to an empty object
	if ( typeof( config ) === 'undefined' ) {
		config = {};	
	}
	
	// Allow a boolean true for defaults
	if ( config === true ) {
		config = {};
	}

	// For easy configuration of buttons an array can be given
	if ( Array.isArray( config ) ) {
		config = { buttons: config };
	}

	this.c = $.extend( true, {}, Buttons.defaults, config );

	// Don't want a deep copy for the buttons
	if ( config.buttons ) {
		this.c.buttons = config.buttons;
	}

	this.s = {
		dt: new DataTable.Api( dt ),
		buttons: [],
		listenKeys: '',
		namespace: 'dtb'+(_instCounter++)
	};

	this.dom = {
		container: $('<'+this.c.dom.container.tag+'/>')
			.addClass( this.c.dom.container.className )
	};

	this._constructor();
};


$.extend( Buttons.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Public methods
	 */

	/**
	 * Get the action of a button
	 * @param  {int|string} Button index
	 * @return {function}
	 *//**
	 * Set the action of a button
	 * @param  {node} node Button element
	 * @param  {function} action Function to set
	 * @return {Buttons} Self for chaining
	 */
	action: function ( node, action )
	{
		var button = this._nodeToButton( node );

		if ( action === undefined ) {
			return button.conf.action;
		}

		button.conf.action = action;

		return this;
	},

	/**
	 * Add an active class to the button to make to look active or get current
	 * active state.
	 * @param  {node} node Button element
	 * @param  {boolean} [flag] Enable / disable flag
	 * @return {Buttons} Self for chaining or boolean for getter
	 */
	active: function ( node, flag ) {
		var button = this._nodeToButton( node );
		var klass = this.c.dom.button.active;
		var jqNode = $(button.node);

		if ( flag === undefined ) {
			return jqNode.hasClass( klass );
		}

		jqNode.toggleClass( klass, flag === undefined ? true : flag );

		return this;
	},

	/**
	 * Add a new button
	 * @param {object} config Button configuration object, base string name or function
	 * @param {int|string} [idx] Button index for where to insert the button
	 * @param {boolean} [draw=true] Trigger a draw. Set a false when adding
	 *   lots of buttons, until the last button.
	 * @return {Buttons} Self for chaining
	 */
	add: function ( config, idx, draw )
	{
		var buttons = this.s.buttons;

		if ( typeof idx === 'string' ) {
			var split = idx.split('-');
			var base = this.s;

			for ( var i=0, ien=split.length-1 ; i<ien ; i++ ) {
				base = base.buttons[ split[i]*1 ];
			}

			buttons = base.buttons;
			idx = split[ split.length-1 ]*1;
		}

		this._expandButton(
			buttons,
			config,
			config !== undefined ? config.split : undefined,
			(config === undefined || config.split === undefined || config.split.length === 0) && base !== undefined,
			false,
			idx
		);

		if (draw === undefined || draw === true) {
			this._draw();
		}
	
		return this;
	},

	/**
	 * Clear buttons from a collection and then insert new buttons
	 */
	collectionRebuild: function ( node, newButtons )
	{
		var button = this._nodeToButton( node );
		
		if(newButtons !== undefined) {
			var i;
			// Need to reverse the array
			for (i=button.buttons.length-1; i>=0; i--) {
				this.remove(button.buttons[i].node);
			}
	
			for (i=0; i<newButtons.length; i++) {
				var newBtn = newButtons[i];

				this._expandButton(
					button.buttons,
					newBtn,
					newBtn !== undefined && newBtn.config !== undefined && newBtn.config.split !== undefined,
					true,
					newBtn.parentConf !== undefined && newBtn.parentConf.split !== undefined,
					i,
					newBtn.parentConf
				);
			}
		}

		this._draw(button.collection, button.buttons);
	},

	/**
	 * Get the container node for the buttons
	 * @return {jQuery} Buttons node
	 */
	container: function ()
	{
		return this.dom.container;
	},

	/**
	 * Disable a button
	 * @param  {node} node Button node
	 * @return {Buttons} Self for chaining
	 */
	disable: function ( node ) {
		var button = this._nodeToButton( node );

		$(button.node)
			.addClass( this.c.dom.button.disabled )
			.prop('disabled', true);

		return this;
	},

	/**
	 * Destroy the instance, cleaning up event handlers and removing DOM
	 * elements
	 * @return {Buttons} Self for chaining
	 */
	destroy: function ()
	{
		// Key event listener
		$('body').off( 'keyup.'+this.s.namespace );

		// Individual button destroy (so they can remove their own events if
		// needed). Take a copy as the array is modified by `remove`
		var buttons = this.s.buttons.slice();
		var i, ien;
		
		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			this.remove( buttons[i].node );
		}

		// Container
		this.dom.container.remove();

		// Remove from the settings object collection
		var buttonInsts = this.s.dt.settings()[0];

		for ( i=0, ien=buttonInsts.length ; i<ien ; i++ ) {
			if ( buttonInsts.inst === this ) {
				buttonInsts.splice( i, 1 );
				break;
			}
		}

		return this;
	},

	/**
	 * Enable / disable a button
	 * @param  {node} node Button node
	 * @param  {boolean} [flag=true] Enable / disable flag
	 * @return {Buttons} Self for chaining
	 */
	enable: function ( node, flag )
	{
		if ( flag === false ) {
			return this.disable( node );
		}

		var button = this._nodeToButton( node );
		$(button.node)
			.removeClass( this.c.dom.button.disabled )
			.prop('disabled', false);

		return this;
	},

	/**
	 * Get a button's index
	 * 
	 * This is internally recursive
	 * @param {element} node Button to get the index of
	 * @return {string} Button index
	 */
	index: function ( node, nested, buttons )
	{
		if ( ! nested ) {
			nested = '';
			buttons = this.s.buttons;
		}

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			var inner = buttons[i].buttons;

			if (buttons[i].node === node) {
				return nested + i;
			}

			if ( inner && inner.length ) {
				var match = this.index(node, i + '-', inner);

				if (match !== null) {
					return match;
				}
			}
		}

		return null;
	},


	/**
	 * Get the instance name for the button set selector
	 * @return {string} Instance name
	 */
	name: function ()
	{
		return this.c.name;
	},

	/**
	 * Get a button's node of the buttons container if no button is given
	 * @param  {node} [node] Button node
	 * @return {jQuery} Button element, or container
	 */
	node: function ( node )
	{
		if ( ! node ) {
			return this.dom.container;
		}

		var button = this._nodeToButton( node );
		return $(button.node);
	},

	/**
	 * Set / get a processing class on the selected button
	 * @param {element} node Triggering button node
	 * @param  {boolean} flag true to add, false to remove, undefined to get
	 * @return {boolean|Buttons} Getter value or this if a setter.
	 */
	processing: function ( node, flag )
	{
		var dt = this.s.dt;
		var button = this._nodeToButton( node );

		if ( flag === undefined ) {
			return $(button.node).hasClass( 'processing' );
		}

		$(button.node).toggleClass( 'processing', flag );

		$(dt.table().node()).triggerHandler( 'buttons-processing.dt', [
			flag, dt.button( node ), dt, $(node), button.conf
		] );

		return this;
	},

	/**
	 * Remove a button.
	 * @param  {node} node Button node
	 * @return {Buttons} Self for chaining
	 */
	remove: function ( node )
	{
		var button = this._nodeToButton( node );
		var host = this._nodeToHost( node );
		var dt = this.s.dt;

		// Remove any child buttons first
		if ( button.buttons.length ) {
			for ( var i=button.buttons.length-1 ; i>=0 ; i-- ) {
				this.remove( button.buttons[i].node );
			}
		}

		button.conf.destroying = true;

		// Allow the button to remove event handlers, etc
		if ( button.conf.destroy ) {
			button.conf.destroy.call( dt.button(node), dt, $(node), button.conf );
		}

		this._removeKey( button.conf );

		$(button.node).remove();

		var idx = $.inArray( button, host );
		host.splice( idx, 1 );

		return this;
	},

	/**
	 * Get the text for a button
	 * @param  {int|string} node Button index
	 * @return {string} Button text
	 *//**
	 * Set the text for a button
	 * @param  {int|string|function} node Button index
	 * @param  {string} label Text
	 * @return {Buttons} Self for chaining
	 */
	text: function ( node, label )
	{
		var button = this._nodeToButton( node );
		var buttonLiner = this.c.dom.collection.buttonLiner;
		var linerTag = button.inCollection && buttonLiner && buttonLiner.tag ?
			buttonLiner.tag :
			this.c.dom.buttonLiner.tag;
		var dt = this.s.dt;
		var jqNode = $(button.node);
		var text = function ( opt ) {
			return typeof opt === 'function' ?
				opt( dt, jqNode, button.conf ) :
				opt;
		};

		if ( label === undefined ) {
			return text( button.conf.text );
		}

		button.conf.text = label;

		if ( linerTag ) {
			jqNode
				.children( linerTag )
				.eq(0)
				.filter(':not(.dt-down-arrow)')
				.html( text(label) );
		}
		else {
			jqNode.html( text(label) );
		}

		return this;
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Buttons constructor
	 * @private
	 */
	_constructor: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var dtSettings = dt.settings()[0];
		var buttons =  this.c.buttons;

		if ( ! dtSettings._buttons ) {
			dtSettings._buttons = [];
		}

		dtSettings._buttons.push( {
			inst: this,
			name: this.c.name
		} );

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			this.add( buttons[i] );
		}

		dt.on( 'destroy', function ( e, settings ) {
			if ( settings === dtSettings ) {
				that.destroy();
			}
		} );

		// Global key event binding to listen for button keys
		$('body').on( 'keyup.'+this.s.namespace, function ( e ) {
			if ( ! document.activeElement || document.activeElement === document.body ) {
				// SUse a string of characters for fast lookup of if we need to
				// handle this
				var character = String.fromCharCode(e.keyCode).toLowerCase();

				if ( that.s.listenKeys.toLowerCase().indexOf( character ) !== -1 ) {
					that._keypress( character, e );
				}
			}
		} );
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Add a new button to the key press listener
	 * @param {object} conf Resolved button configuration object
	 * @private
	 */
	_addKey: function ( conf )
	{
		if ( conf.key ) {
			this.s.listenKeys += $.isPlainObject( conf.key ) ?
				conf.key.key :
				conf.key;
		}
	},

	/**
	 * Insert the buttons into the container. Call without parameters!
	 * @param  {node} [container] Recursive only - Insert point
	 * @param  {array} [buttons] Recursive only - Buttons array
	 * @private
	 */
	_draw: function ( container, buttons )
	{
		if ( ! container ) {
			container = this.dom.container;
			buttons = this.s.buttons;
		}

		container.children().detach();

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			container.append( buttons[i].inserter );
			container.append( ' ' );

			if ( buttons[i].buttons && buttons[i].buttons.length ) {
				this._draw( buttons[i].collection, buttons[i].buttons );
			}
		}
	},

	/**
	 * Create buttons from an array of buttons
	 * @param  {array} attachTo Buttons array to attach to
	 * @param  {object} button Button definition
	 * @param  {boolean} inCollection true if the button is in a collection
	 * @private
	 */
	_expandButton: function ( attachTo, button, split, inCollection, inSplit, attachPoint, parentConf )
	{
		var dt = this.s.dt;
		var buttonCounter = 0;
		var isSplit = false;
		var buttons = ! Array.isArray( button ) ?
			[ button ] :
			button;
		
		if(button === undefined ) {
			buttons = !Array.isArray(split) ?
				[ split ] :
				split;
		}

		if (button !== undefined && button.split !== undefined) {
			isSplit = true;
		}
			
		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			var conf = this._resolveExtends( buttons[i] );

			if ( ! conf ) {
				continue;
			}

			if( conf.config !== undefined && conf.config.split) {
				isSplit = true;
			}
			else {
				isSplit = false;
			}
			
			// If the configuration is an array, then expand the buttons at this
			// point
			if ( Array.isArray( conf ) ) {
				this._expandButton( attachTo, conf, built !== undefined && built.conf !== undefined ? built.conf.split : undefined, inCollection, parentConf !== undefined && parentConf.split !== undefined, attachPoint, parentConf );
				continue;
			}

			var built = this._buildButton( conf, inCollection, conf.split !== undefined || (conf.config !== undefined && conf.config.split !== undefined), inSplit );
			if ( ! built ) {
				continue;
			}

			if ( attachPoint !== undefined && attachPoint !== null ) {
				attachTo.splice( attachPoint, 0, built );
				attachPoint++;
			}
			else {
				attachTo.push( built );
			}

			
			if ( built.conf.buttons || built.conf.split ) {
				built.collection = $('<'+(isSplit ? this.c.dom.splitCollection.tag : this.c.dom.collection.tag)+'/>');

				built.conf._collection = built.collection;

				if(built.conf.split) {
					for(var j = 0; j < built.conf.split.length; j++) {
						if(typeof built.conf.split[j] === "object") {
							built.conf.split[j].parent = parentConf;
							if(built.conf.split[j].collectionLayout === undefined) {
								built.conf.split[j].collectionLayout = built.conf.collectionLayout;
							}
							if(built.conf.split[j].dropup === undefined) {
								built.conf.split[j].dropup = built.conf.dropup;
							}
							if(built.conf.split[j].fade === undefined) {
								built.conf.split[j].fade = built.conf.fade;
							}
						}
					}
				}
				else {
					$(built.node).append($('<span class="dt-down-arrow">'+this.c.dom.splitDropdown.text+'</span>'))
				}

				this._expandButton( built.buttons, built.conf.buttons, built.conf.split, !isSplit, isSplit, attachPoint, built.conf );
			}
			built.conf.parent = parentConf;

			// init call is made here, rather than buildButton as it needs to
			// be selectable, and for that it needs to be in the buttons array
			if ( conf.init ) {
				conf.init.call( dt.button( built.node ), dt, $(built.node), conf );
			}

			buttonCounter++;
		}
	},

	/**
	 * Create an individual button
	 * @param  {object} config            Resolved button configuration
	 * @param  {boolean} inCollection `true` if a collection button
	 * @return {jQuery} Created button node (jQuery)
	 * @private
	 */
	_buildButton: function ( config, inCollection, isSplit, inSplit )
	{
		var buttonDom = this.c.dom.button;
		var linerDom = this.c.dom.buttonLiner;
		var collectionDom = this.c.dom.collection;
		var splitDom = this.c.dom.split;
		var splitCollectionDom = this.c.dom.splitCollection;
		var splitDropdownButton = this.c.dom.splitDropdownButton;
		var dt = this.s.dt;
		var text = function ( opt ) {
			return typeof opt === 'function' ?
				opt( dt, button, config ) :
				opt;
		};

		// Spacers don't do much other than insert an element into the DOM
		if (config.spacer) {
			var spacer = $('<span></span>')
				.addClass('dt-button-spacer ' + config.style + ' ' + buttonDom.spacerClass)
				.html(text(config.text));

			return {
				conf:         config,
				node:         spacer,
				inserter:     spacer,
				buttons:      [],
				inCollection: inCollection,
				isSplit:	  isSplit,
				inSplit:	  inSplit,
				collection:   null
			};
		}

		if ( !isSplit && inSplit && splitCollectionDom ) {
			buttonDom = splitDropdownButton;
		}
		else if ( !isSplit && inCollection && collectionDom.button ) {
			buttonDom = collectionDom.button;
		} 

		if ( !isSplit && inSplit && splitCollectionDom.buttonLiner ) {
			linerDom = splitCollectionDom.buttonLiner
		}
		else if ( !isSplit && inCollection && collectionDom.buttonLiner ) {
			linerDom = collectionDom.buttonLiner;
		}

		// Make sure that the button is available based on whatever requirements
		// it has. For example, PDF button require pdfmake
		if ( config.available && ! config.available( dt, config ) && !config.hasOwnProperty('html') ) {
			return false;
		}

		var button;
		if(!config.hasOwnProperty('html')) {
			var action = function ( e, dt, button, config ) {
				config.action.call( dt.button( button ), e, dt, button, config );
	
				$(dt.table().node()).triggerHandler( 'buttons-action.dt', [
					dt.button( button ), dt, button, config 
				] );
			};

			var tag = config.tag || buttonDom.tag;
			var clickBlurs = config.clickBlurs === undefined
				? true :
				config.clickBlurs;

			button = $('<'+tag+'/>')
				.addClass( buttonDom.className )
				.addClass( inSplit ? this.c.dom.splitDropdownButton.className : '')
				.attr( 'tabindex', this.s.dt.settings()[0].iTabIndex )
				.attr( 'aria-controls', this.s.dt.table().node().id )
				.on( 'click.dtb', function (e) {
					e.preventDefault();
	
					if ( ! button.hasClass( buttonDom.disabled ) && config.action ) {
						action( e, dt, button, config );
					}
					if( clickBlurs ) {
						button.trigger('blur');
					}
				} )
				.on( 'keypress.dtb', function (e) {
					if ( e.keyCode === 13 ) {
						e.preventDefault();

						if ( ! button.hasClass( buttonDom.disabled ) && config.action ) {
							action( e, dt, button, config );
						}
					}
				} );
	
			// Make `a` tags act like a link
			if ( tag.toLowerCase() === 'a' ) {
				button.attr( 'href', '#' );
			}
	
			// Button tags should have `type=button` so they don't have any default behaviour
			if ( tag.toLowerCase() === 'button' ) {
				button.attr( 'type', 'button' );
			}
	
			if ( linerDom.tag ) {
				var liner = $('<'+linerDom.tag+'/>')
					.html( text( config.text ) )
					.addClass( linerDom.className );
	
				if ( linerDom.tag.toLowerCase() === 'a' ) {
					liner.attr( 'href', '#' );
				}
	
				button.append( liner );
			}
			else {
				button.html( text( config.text ) );
			}
	
			if ( config.enabled === false ) {
				button.addClass( buttonDom.disabled );
			}
	
			if ( config.className ) {
				button.addClass( config.className );
			}
	
			if ( config.titleAttr ) {
				button.attr( 'title', text( config.titleAttr ) );
			}
	
			if ( config.attr ) {
				button.attr( config.attr );
			}
	
			if ( ! config.namespace ) {
				config.namespace = '.dt-button-'+(_buttonCounter++);
			}

			if  ( config.config !== undefined && config.config.split ) {
				config.split = config.config.split;
			}
		}
		else {
			button = $(config.html)
		}
	
		var buttonContainer = this.c.dom.buttonContainer;
		var inserter;
		if ( buttonContainer && buttonContainer.tag ) {
			inserter = $('<'+buttonContainer.tag+'/>')
				.addClass( buttonContainer.className )
				.append( button );
		}
		else {
			inserter = button;
		}

		this._addKey( config );

		// Style integration callback for DOM manipulation
		// Note that this is _not_ documented. It is currently
		// for style integration only
		if( this.c.buttonCreated ) {
			inserter = this.c.buttonCreated( config, inserter );
		}

		var splitDiv;
		if(isSplit) {
			splitDiv = $('<div/>').addClass(this.c.dom.splitWrapper.className)
			splitDiv.append(button);
			var dropButtonConfig = $.extend(config, {
				text: this.c.dom.splitDropdown.text,
				className: this.c.dom.splitDropdown.className,
				closeButton: false,
				attr: {
					'aria-haspopup': 'dialog',
					'aria-expanded': false
				},
				align: this.c.dom.splitDropdown.align,
				splitAlignClass: this.c.dom.splitDropdown.splitAlignClass
				
			})

			this._addKey(dropButtonConfig);

			var splitAction = function ( e, dt, button, config ) {
				_dtButtons.split.action.call( dt.button(splitDiv), e, dt, button, config );
	
				$(dt.table().node()).triggerHandler( 'buttons-action.dt', [
					dt.button( button ), dt, button, config 
				] );
				button.attr('aria-expanded', true)
			};
			
			var dropButton = $('<button class="' + this.c.dom.splitDropdown.className + ' dt-button"><span class="dt-btn-split-drop-arrow">'+this.c.dom.splitDropdown.text+'</span></button>')
				.on( 'click.dtb', function (e) {
					e.preventDefault();
					e.stopPropagation();

					if ( ! dropButton.hasClass( buttonDom.disabled )) {
						splitAction( e, dt, dropButton, dropButtonConfig );
					}
					if ( clickBlurs ) {
						dropButton.trigger('blur');
					}
				} )
				.on( 'keypress.dtb', function (e) {
					if ( e.keyCode === 13 ) {
						e.preventDefault();

						if ( ! dropButton.hasClass( buttonDom.disabled ) ) {
							splitAction( e, dt, dropButton, dropButtonConfig );
						}
					}
				} );

			if(config.split.length === 0) {
				dropButton.addClass('dtb-hide-drop');
			}

			splitDiv.append(dropButton).attr(dropButtonConfig.attr);
		}

		return {
			conf:         config,
			node:         isSplit ? splitDiv.get(0) : button.get(0),
			inserter:     isSplit ? splitDiv : inserter,
			buttons:      [],
			inCollection: inCollection,
			isSplit:	  isSplit,
			inSplit:	  inSplit,
			collection:   null
		};
	},

	/**
	 * Get the button object from a node (recursive)
	 * @param  {node} node Button node
	 * @param  {array} [buttons] Button array, uses base if not defined
	 * @return {object} Button object
	 * @private
	 */
	_nodeToButton: function ( node, buttons )
	{
		if ( ! buttons ) {
			buttons = this.s.buttons;
		}

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			if ( buttons[i].node === node ) {
				return buttons[i];
			}

			if ( buttons[i].buttons.length ) {
				var ret = this._nodeToButton( node, buttons[i].buttons );

				if ( ret ) {
					return ret;
				}
			}
		}
	},

	/**
	 * Get container array for a button from a button node (recursive)
	 * @param  {node} node Button node
	 * @param  {array} [buttons] Button array, uses base if not defined
	 * @return {array} Button's host array
	 * @private
	 */
	_nodeToHost: function ( node, buttons )
	{
		if ( ! buttons ) {
			buttons = this.s.buttons;
		}

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			if ( buttons[i].node === node ) {
				return buttons;
			}

			if ( buttons[i].buttons.length ) {
				var ret = this._nodeToHost( node, buttons[i].buttons );

				if ( ret ) {
					return ret;
				}
			}
		}
	},

	/**
	 * Handle a key press - determine if any button's key configured matches
	 * what was typed and trigger the action if so.
	 * @param  {string} character The character pressed
	 * @param  {object} e Key event that triggered this call
	 * @private
	 */
	_keypress: function ( character, e )
	{
		// Check if this button press already activated on another instance of Buttons
		if ( e._buttonsHandled ) {
			return;
		}

		var run = function ( conf, node ) {
			if ( ! conf.key ) {
				return;
			}

			if ( conf.key === character ) {
				e._buttonsHandled = true;
				$(node).click();
			}
			else if ( $.isPlainObject( conf.key ) ) {
				if ( conf.key.key !== character ) {
					return;
				}

				if ( conf.key.shiftKey && ! e.shiftKey ) {
					return;
				}

				if ( conf.key.altKey && ! e.altKey ) {
					return;
				}

				if ( conf.key.ctrlKey && ! e.ctrlKey ) {
					return;
				}

				if ( conf.key.metaKey && ! e.metaKey ) {
					return;
				}

				// Made it this far - it is good
				e._buttonsHandled = true;
				$(node).click();
			}
		};

		var recurse = function ( a ) {
			for ( var i=0, ien=a.length ; i<ien ; i++ ) {
				run( a[i].conf, a[i].node );

				if ( a[i].buttons.length ) {
					recurse( a[i].buttons );
				}
			}
		};

		recurse( this.s.buttons );
	},

	/**
	 * Remove a key from the key listener for this instance (to be used when a
	 * button is removed)
	 * @param  {object} conf Button configuration
	 * @private
	 */
	_removeKey: function ( conf )
	{
		if ( conf.key ) {
			var character = $.isPlainObject( conf.key ) ?
				conf.key.key :
				conf.key;

			// Remove only one character, as multiple buttons could have the
			// same listening key
			var a = this.s.listenKeys.split('');
			var idx = $.inArray( character, a );
			a.splice( idx, 1 );
			this.s.listenKeys = a.join('');
		}
	},

	/**
	 * Resolve a button configuration
	 * @param  {string|function|object} conf Button config to resolve
	 * @return {object} Button configuration
	 * @private
	 */
	_resolveExtends: function ( conf )
	{
		var that = this;
		var dt = this.s.dt;
		var i, ien;
		var toConfObject = function ( base ) {
			var loop = 0;

			// Loop until we have resolved to a button configuration, or an
			// array of button configurations (which will be iterated
			// separately)
			while ( ! $.isPlainObject(base) && ! Array.isArray(base) ) {
				if ( base === undefined ) {
					return;
				}

				if ( typeof base === 'function' ) {
					base = base.call( that, dt, conf );

					if ( ! base ) {
						return false;
					}
				}
				else if ( typeof base === 'string' ) {
					if ( ! _dtButtons[ base ] ) {
						return {html: base}
					}

					base = _dtButtons[ base ];
				}

				loop++;
				if ( loop > 30 ) {
					// Protect against misconfiguration killing the browser
					throw 'Buttons: Too many iterations';
				}
			}

			return Array.isArray( base ) ?
				base :
				$.extend( {}, base );
		};

		conf = toConfObject( conf );

		while ( conf && conf.extend ) {
			// Use `toConfObject` in case the button definition being extended
			// is itself a string or a function
			if ( ! _dtButtons[ conf.extend ] ) {
				throw 'Cannot extend unknown button type: '+conf.extend;
			}

			var objArray = toConfObject( _dtButtons[ conf.extend ] );
			if ( Array.isArray( objArray ) ) {
				return objArray;
			}
			else if ( ! objArray ) {
				// This is a little brutal as it might be possible to have a
				// valid button without the extend, but if there is no extend
				// then the host button would be acting in an undefined state
				return false;
			}

			// Stash the current class name
			var originalClassName = objArray.className;

			if (conf.config !== undefined && objArray.config !== undefined) {
				conf.config = $.extend({}, objArray.config, conf.config)
			}

			conf = $.extend( {}, objArray, conf );

			// The extend will have overwritten the original class name if the
			// `conf` object also assigned a class, but we want to concatenate
			// them so they are list that is combined from all extended buttons
			if ( originalClassName && conf.className !== originalClassName ) {
				conf.className = originalClassName+' '+conf.className;
			}

			// Buttons to be added to a collection  -gives the ability to define
			// if buttons should be added to the start or end of a collection
			var postfixButtons = conf.postfixButtons;
			if ( postfixButtons ) {
				if ( ! conf.buttons ) {
					conf.buttons = [];
				}

				for ( i=0, ien=postfixButtons.length ; i<ien ; i++ ) {
					conf.buttons.push( postfixButtons[i] );
				}

				conf.postfixButtons = null;
			}

			var prefixButtons = conf.prefixButtons;
			if ( prefixButtons ) {
				if ( ! conf.buttons ) {
					conf.buttons = [];
				}

				for ( i=0, ien=prefixButtons.length ; i<ien ; i++ ) {
					conf.buttons.splice( i, 0, prefixButtons[i] );
				}

				conf.prefixButtons = null;
			}

			// Although we want the `conf` object to overwrite almost all of
			// the properties of the object being extended, the `extend`
			// property should come from the object being extended
			conf.extend = objArray.extend;
		}

		return conf;
	},

	/**
	 * Display (and replace if there is an existing one) a popover attached to a button
	 * @param {string|node} content Content to show
	 * @param {DataTable.Api} hostButton DT API instance of the button
	 * @param {object} inOpts Options (see object below for all options)
	 */
	_popover: function ( content, hostButton, inOpts, e ) {
		var dt = hostButton;
		var buttonsSettings = this.c;
		var closed = false;
		var options = $.extend( {
			align: 'button-left', // button-right, dt-container, split-left, split-right
			autoClose: false,
			background: true,
			backgroundClassName: 'dt-button-background',
			closeButton: true,
			contentClassName: buttonsSettings.dom.collection.className,
			collectionLayout: '',
			collectionTitle: '',
			dropup: false,
			fade: 400,
			popoverTitle: '',
			rightAlignClassName: 'dt-button-right',
			tag: buttonsSettings.dom.collection.tag
		}, inOpts );

		var hostNode = hostButton.node();

		var close = function () {
			closed = true;

			_fadeOut(
				$('.dt-button-collection'),
				options.fade,
				function () {
					$(this).detach();
				}
			);

			$(dt.buttons( '[aria-haspopup="dialog"][aria-expanded="true"]' ).nodes())
				.attr('aria-expanded', 'false');

			$('div.dt-button-background').off( 'click.dtb-collection' );
			Buttons.background( false, options.backgroundClassName, options.fade, hostNode );

			$(window).off('resize.resize.dtb-collection');
			$('body').off( '.dtb-collection' );
			dt.off( 'buttons-action.b-internal' );
			dt.off( 'destroy' );
		};

		if (content === false) {
			close();
			return;
		}

		var existingExpanded = $(dt.buttons( '[aria-haspopup="dialog"][aria-expanded="true"]' ).nodes());
		if ( existingExpanded.length ) {
			// Reuse the current position if the button that was triggered is inside an existing collection
			if (hostNode.closest('div.dt-button-collection').length) {
				hostNode = existingExpanded.eq(0);
			}

			close();
		}

		// Try to be smart about the layout
		var cnt = $('.dt-button', content).length;
		var mod = '';

		if (cnt === 3) {
			mod = 'dtb-b3';
		}
		else if (cnt === 2) {
			mod = 'dtb-b2';
		}
		else if (cnt === 1) {
			mod = 'dtb-b1';
		}

		var display = $('<div/>')
			.addClass('dt-button-collection')
			.addClass(options.collectionLayout)
			.addClass(options.splitAlignClass)
			.addClass(mod)
			.css('display', 'none')
			.attr({
				'aria-modal': true,
				role: 'dialog'
			});

		content = $(content)
			.addClass(options.contentClassName)
			.attr('role', 'menu')
			.appendTo(display);

		hostNode.attr( 'aria-expanded', 'true' );

		if ( hostNode.parents('body')[0] !== document.body ) {
			hostNode = document.body.lastChild;
		}

		if ( options.popoverTitle ) {
			display.prepend('<div class="dt-button-collection-title">'+options.popoverTitle+'</div>');
		}
		else if ( options.collectionTitle ) {
			display.prepend('<div class="dt-button-collection-title">'+options.collectionTitle+'</div>');
		}

		if (options.closeButton) {
			display.prepend('<div class="dtb-popover-close">x</div>').addClass('dtb-collection-closeable')
		}

		_fadeIn( display.insertAfter( hostNode ), options.fade );

		var tableContainer = $( hostButton.table().container() );
		var position = display.css( 'position' );

		if ( options.span === 'container' || options.align === 'dt-container' ) {
			hostNode = hostNode.parent();
			display.css('width', tableContainer.width());
		}

		// Align the popover relative to the DataTables container
		// Useful for wide popovers such as SearchPanes
		if (position === 'absolute') {
			// Align relative to the host button
			var offsetParent = $(hostNode[0].offsetParent);
			var buttonPosition = hostNode.position();
			var buttonOffset = hostNode.offset();
			var tableSizes = offsetParent.offset();
			var containerPosition = offsetParent.position();
			var computed = window.getComputedStyle(offsetParent[0]);

			tableSizes.height = offsetParent.outerHeight();
			tableSizes.width = offsetParent.width() + parseFloat(computed.paddingLeft);
			tableSizes.right = tableSizes.left + tableSizes.width;
			tableSizes.bottom = tableSizes.top + tableSizes.height;

			// Set the initial position so we can read height / width
			var top = buttonPosition.top + hostNode.outerHeight();
			var left = buttonPosition.left;

			display.css( {
				top: top,
				left: left
			} );

			// Get the popover position
			computed = window.getComputedStyle(display[0]);
			var popoverSizes = display.offset();

			popoverSizes.height = display.outerHeight();
			popoverSizes.width = display.outerWidth();
			popoverSizes.right = popoverSizes.left + popoverSizes.width;
			popoverSizes.bottom = popoverSizes.top + popoverSizes.height;
			popoverSizes.marginTop = parseFloat(computed.marginTop);
			popoverSizes.marginBottom = parseFloat(computed.marginBottom);

			// First position per the class requirements - pop up and right align
			if (options.dropup) {
				top = buttonPosition.top - popoverSizes.height - popoverSizes.marginTop - popoverSizes.marginBottom;
			}

			if (options.align === 'button-right' || display.hasClass( options.rightAlignClassName )) {
				left = buttonPosition.left - popoverSizes.width + hostNode.outerWidth(); 
			}

			// Container alignment - make sure it doesn't overflow the table container
			if (options.align === 'dt-container' || options.align === 'container') {
				if (left < buttonPosition.left) {
					left = -buttonPosition.left;
				}

				if (left + popoverSizes.width > tableSizes.width) {
					left = tableSizes.width - popoverSizes.width;
				}
			}

			// Window adjustment
			if (containerPosition.left + left + popoverSizes.width > $(window).width()) {
				// Overflowing the document to the right
				left = $(window).width() - popoverSizes.width - containerPosition.left;
			}

			if (buttonOffset.left + left < 0) {
				// Off to the left of the document
				left = -buttonOffset.left;
			}

			if (containerPosition.top + top + popoverSizes.height > $(window).height() + $(window).scrollTop()) {
				// Pop up if otherwise we'd need the user to scroll down
				top = buttonPosition.top - popoverSizes.height - popoverSizes.marginTop - popoverSizes.marginBottom;
			}

			if (containerPosition.top + top < $(window).scrollTop()) {
				// Correction for when the top is beyond the top of the page
				top = buttonPosition.top + hostNode.outerHeight();
			}

			// Calculations all done - now set it
			display.css( {
				top: top,
				left: left
			} );
		}
		else {
			// Fix position - centre on screen
			var position = function () {
				var half = $(window).height() / 2;

				var top = display.height() / 2;
				if ( top > half ) {
					top = half;
				}

				display.css( 'marginTop', top*-1 );
			};

			position();

			$(window).on('resize.dtb-collection', function () {
				position();
			});
		}

		if ( options.background ) {
			Buttons.background(
				true,
				options.backgroundClassName,
				options.fade,
				options.backgroundHost || hostNode
			);
		}

		// This is bonkers, but if we don't have a click listener on the
		// background element, iOS Safari will ignore the body click
		// listener below. An empty function here is all that is
		// required to make it work...
		$('div.dt-button-background').on( 'click.dtb-collection', function () {} );

		if ( options.autoClose ) {
			setTimeout( function () {
				dt.on( 'buttons-action.b-internal', function (e, btn, dt, node) {
					if ( node[0] === hostNode[0] ) {
						return;
					}
					close();
				} );
			}, 0);
		}
		
		$(display).trigger('buttons-popover.dt');


		dt.on('destroy', close);

		setTimeout(function() {
			closed = false;
			$('body')
				.on( 'click.dtb-collection', function (e) {
					if (closed) {
						return;
					}

					// andSelf is deprecated in jQ1.8, but we want 1.7 compat
					var back = $.fn.addBack ? 'addBack' : 'andSelf';
					var parent = $(e.target).parent()[0];
	
					if (( ! $(e.target).parents()[back]().filter( content ).length  && !$(parent).hasClass('dt-buttons')) || $(e.target).hasClass('dt-button-background')) {
						close();
					}
				} )
				.on( 'keyup.dtb-collection', function (e) {
					if ( e.keyCode === 27 ) {
						close();
					}
				} )
				.on( 'keydown.dtb-collection', function (e) {
					// Focus trap for tab key
					var elements = $('a, button', content);
					var active = document.activeElement;

					if (e.keyCode !== 9) { // tab
						return;
					}

					if (elements.index(active) === -1) {
						// If current focus is not inside the popover
						elements.first().focus();
						e.preventDefault();
					}
					else if (e.shiftKey) {
						// Reverse tabbing order when shift key is pressed
						if (active === elements[0]) {
							elements.last().focus();
							e.preventDefault();
						}
					}
					else {
						if (active === elements.last()[0]) {
							elements.first().focus();
							e.preventDefault();
						}
					}
				} );
		}, 0);
	}
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Statics
 */

/**
 * Show / hide a background layer behind a collection
 * @param  {boolean} Flag to indicate if the background should be shown or
 *   hidden 
 * @param  {string} Class to assign to the background
 * @static
 */
Buttons.background = function ( show, className, fade, insertPoint ) {
	if ( fade === undefined ) {
		fade = 400;
	}
	if ( ! insertPoint ) {
		insertPoint = document.body;
	}

	if ( show ) {
		_fadeIn(
			$('<div/>')
				.addClass( className )
				.css( 'display', 'none' )
				.insertAfter( insertPoint ),
			fade
		);
	}
	else {
		_fadeOut(
			$('div.'+className),
			fade,
			function () {
				$(this)
					.removeClass( className )
					.remove();
			}
		);
	}
};

/**
 * Instance selector - select Buttons instances based on an instance selector
 * value from the buttons assigned to a DataTable. This is only useful if
 * multiple instances are attached to a DataTable.
 * @param  {string|int|array} Instance selector - see `instance-selector`
 *   documentation on the DataTables site
 * @param  {array} Button instance array that was attached to the DataTables
 *   settings object
 * @return {array} Buttons instances
 * @static
 */
Buttons.instanceSelector = function ( group, buttons )
{
	if ( group === undefined || group === null ) {
		return $.map( buttons, function ( v ) {
			return v.inst;
		} );
	}

	var ret = [];
	var names = $.map( buttons, function ( v ) {
		return v.name;
	} );

	// Flatten the group selector into an array of single options
	var process = function ( input ) {
		if ( Array.isArray( input ) ) {
			for ( var i=0, ien=input.length ; i<ien ; i++ ) {
				process( input[i] );
			}
			return;
		}

		if ( typeof input === 'string' ) {
			if ( input.indexOf( ',' ) !== -1 ) {
				// String selector, list of names
				process( input.split(',') );
			}
			else {
				// String selector individual name
				var idx = $.inArray( input.trim(), names );

				if ( idx !== -1 ) {
					ret.push( buttons[ idx ].inst );
				}
			}
		}
		else if ( typeof input === 'number' ) {
			// Index selector
			ret.push( buttons[ input ].inst );
		}
		else if ( typeof input === 'object' ) {
			// Actual instance selector
			ret.push( input );
		}
	};
	
	process( group );

	return ret;
};

/**
 * Button selector - select one or more buttons from a selector input so some
 * operation can be performed on them.
 * @param  {array} Button instances array that the selector should operate on
 * @param  {string|int|node|jQuery|array} Button selector - see
 *   `button-selector` documentation on the DataTables site
 * @return {array} Array of objects containing `inst` and `idx` properties of
 *   the selected buttons so you know which instance each button belongs to.
 * @static
 */
Buttons.buttonSelector = function ( insts, selector )
{
	var ret = [];
	var nodeBuilder = function ( a, buttons, baseIdx ) {
		var button;
		var idx;

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			button = buttons[i];

			if ( button ) {
				idx = baseIdx !== undefined ?
					baseIdx+i :
					i+'';

				a.push( {
					node: button.node,
					name: button.conf.name,
					idx:  idx
				} );

				if ( button.buttons ) {
					nodeBuilder( a, button.buttons, idx+'-' );
				}
			}
		}
	};

	var run = function ( selector, inst ) {
		var i, ien;
		var buttons = [];
		nodeBuilder( buttons, inst.s.buttons );

		var nodes = $.map( buttons, function (v) {
			return v.node;
		} );

		if ( Array.isArray( selector ) || selector instanceof $ ) {
			for ( i=0, ien=selector.length ; i<ien ; i++ ) {
				run( selector[i], inst );
			}
			return;
		}

		if ( selector === null || selector === undefined || selector === '*' ) {
			// Select all
			for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
				ret.push( {
					inst: inst,
					node: buttons[i].node
				} );
			}
		}
		else if ( typeof selector === 'number' ) {
			// Main button index selector
			if (inst.s.buttons[ selector ]) {
				ret.push( {
					inst: inst,
					node: inst.s.buttons[ selector ].node
				} );
			}
		}
		else if ( typeof selector === 'string' ) {
			if ( selector.indexOf( ',' ) !== -1 ) {
				// Split
				var a = selector.split(',');

				for ( i=0, ien=a.length ; i<ien ; i++ ) {
					run( a[i].trim(), inst );
				}
			}
			else if ( selector.match( /^\d+(\-\d+)*$/ ) ) {
				// Sub-button index selector
				var indexes = $.map( buttons, function (v) {
					return v.idx;
				} );

				ret.push( {
					inst: inst,
					node: buttons[ $.inArray( selector, indexes ) ].node
				} );
			}
			else if ( selector.indexOf( ':name' ) !== -1 ) {
				// Button name selector
				var name = selector.replace( ':name', '' );

				for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
					if ( buttons[i].name === name ) {
						ret.push( {
							inst: inst,
							node: buttons[i].node
						} );
					}
				}
			}
			else {
				// jQuery selector on the nodes
				$( nodes ).filter( selector ).each( function () {
					ret.push( {
						inst: inst,
						node: this
					} );
				} );
			}
		}
		else if ( typeof selector === 'object' && selector.nodeName ) {
			// Node selector
			var idx = $.inArray( selector, nodes );

			if ( idx !== -1 ) {
				ret.push( {
					inst: inst,
					node: nodes[ idx ]
				} );
			}
		}
	};


	for ( var i=0, ien=insts.length ; i<ien ; i++ ) {
		var inst = insts[i];

		run( selector, inst );
	}

	return ret;
};

/**
 * Default function used for formatting output data.
 * @param {*} str Data to strip
 */
Buttons.stripData = function ( str, config ) {
	if ( typeof str !== 'string' ) {
		return str;
	}

	// Always remove script tags
	str = str.replace( /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '' );

	// Always remove comments
	str = str.replace( /<!\-\-.*?\-\->/g, '' );

	if ( ! config || config.stripHtml ) {
		str = str.replace( /<[^>]*>/g, '' );
	}

	if ( ! config || config.trim ) {
		str = str.replace( /^\s+|\s+$/g, '' );
	}

	if ( ! config || config.stripNewlines ) {
		str = str.replace( /\n/g, ' ' );
	}

	if ( ! config || config.decodeEntities ) {
		_exportTextarea.innerHTML = str;
		str = _exportTextarea.value;
	}

	return str;
};


/**
 * Buttons defaults. For full documentation, please refer to the docs/option
 * directory or the DataTables site.
 * @type {Object}
 * @static
 */
Buttons.defaults = {
	buttons: [ 'copy', 'excel', 'csv', 'pdf', 'print' ],
	name: 'main',
	tabIndex: 0,
	dom: {
		container: {
			tag: 'div',
			className: 'dt-buttons'
		},
		collection: {
			tag: 'div',
			className: ''
		},
		button: {
			tag: 'button',
			className: 'dt-button',
			active: 'active',
			disabled: 'disabled',
			spacerClass: ''
		},
		buttonLiner: {
			tag: 'span',
			className: ''
		},
		split: {
			tag: 'div',
			className: 'dt-button-split',
		},
		splitWrapper: {
			tag: 'div',
			className: 'dt-btn-split-wrapper',
		},
		splitDropdown: {
			tag: 'button',
			text: '&#x25BC;',
			className: 'dt-btn-split-drop',
			align: 'split-right',
			splitAlignClass: 'dt-button-split-left'
		},
		splitDropdownButton: {
			tag: 'button',
			className: 'dt-btn-split-drop-button dt-button',
		},
		splitCollection: {
			tag: 'div',
			className: 'dt-button-split-collection',
		}
	}
};

/**
 * Version information
 * @type {string}
 * @static
 */
Buttons.version = '2.3.3';


$.extend( _dtButtons, {
	collection: {
		text: function ( dt ) {
			return dt.i18n( 'buttons.collection', 'Collection' );
		},
		className: 'buttons-collection',
		closeButton: false,
		init: function ( dt, button, config ) {
			button.attr( 'aria-expanded', false );
		},
		action: function ( e, dt, button, config ) {
			if ( config._collection.parents('body').length ) {
				this.popover(false, config);
			}
			else {
				this.popover(config._collection, config);
			}

			// When activated using a key - auto focus on the
			// first item in the popover
			if (e.type === 'keypress') {
				$('a, button', config._collection).eq(0).focus();
			}
		},
		attr: {
			'aria-haspopup': 'dialog'
		}
		// Also the popover options, defined in Buttons.popover
	},
	split: {
		text: function ( dt ) {
			return dt.i18n( 'buttons.split', 'Split' );
		},
		className: 'buttons-split',
		closeButton: false,
		init: function ( dt, button, config ) {
			return button.attr( 'aria-expanded', false );
		},
		action: function ( e, dt, button, config ) {
			this.popover(config._collection, config);
		},
		attr: {
			'aria-haspopup': 'dialog'
		}
		// Also the popover options, defined in Buttons.popover
	},
	copy: function ( dt, conf ) {
		if ( _dtButtons.copyHtml5 ) {
			return 'copyHtml5';
		}
	},
	csv: function ( dt, conf ) {
		if ( _dtButtons.csvHtml5 && _dtButtons.csvHtml5.available( dt, conf ) ) {
			return 'csvHtml5';
		}
	},
	excel: function ( dt, conf ) {
		if ( _dtButtons.excelHtml5 && _dtButtons.excelHtml5.available( dt, conf ) ) {
			return 'excelHtml5';
		}
	},
	pdf: function ( dt, conf ) {
		if ( _dtButtons.pdfHtml5 && _dtButtons.pdfHtml5.available( dt, conf ) ) {
			return 'pdfHtml5';
		}
	},
	pageLength: function ( dt ) {
		var lengthMenu = dt.settings()[0].aLengthMenu;
		var vals = [];
		var lang = [];
		var text = function ( dt ) {
			return dt.i18n( 'buttons.pageLength', {
				"-1": 'Show all rows',
				_:    'Show %d rows'
			}, dt.page.len() );
		};

		// Support for DataTables 1.x 2D array
		if (Array.isArray( lengthMenu[0] )) {
			vals = lengthMenu[0];
			lang = lengthMenu[1];
		}
		else {
			for (var i=0 ; i<lengthMenu.length ; i++) {
				var option = lengthMenu[i];

				// Support for DataTables 2 object in the array
				if ($.isPlainObject(option)) {
					vals.push(option.value);
					lang.push(option.label);
				}
				else {
					vals.push(option);
					lang.push(option);
				}
			}
		}

		return {
			extend: 'collection',
			text: text,
			className: 'buttons-page-length',
			autoClose: true,
			buttons: $.map( vals, function ( val, i ) {
				return {
					text: lang[i],
					className: 'button-page-length',
					action: function ( e, dt ) {
						dt.page.len( val ).draw();
					},
					init: function ( dt, node, conf ) {
						var that = this;
						var fn = function () {
							that.active( dt.page.len() === val );
						};

						dt.on( 'length.dt'+conf.namespace, fn );
						fn();
					},
					destroy: function ( dt, node, conf ) {
						dt.off( 'length.dt'+conf.namespace );
					}
				};
			} ),
			init: function ( dt, node, conf ) {
				var that = this;
				dt.on( 'length.dt'+conf.namespace, function () {
					that.text( conf.text );
				} );
			},
			destroy: function ( dt, node, conf ) {
				dt.off( 'length.dt'+conf.namespace );
			}
		};
	},
	spacer: {
		style: 'empty',
		spacer: true,
		text: function ( dt ) {
			return dt.i18n( 'buttons.spacer', '' );
		}
	}
} );


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables API
 *
 * For complete documentation, please refer to the docs/api directory or the
 * DataTables site
 */

// Buttons group and individual button selector
DataTable.Api.register( 'buttons()', function ( group, selector ) {
	// Argument shifting
	if ( selector === undefined ) {
		selector = group;
		group = undefined;
	}

	this.selector.buttonGroup = group;

	var res = this.iterator( true, 'table', function ( ctx ) {
		if ( ctx._buttons ) {
			return Buttons.buttonSelector(
				Buttons.instanceSelector( group, ctx._buttons ),
				selector
			);
		}
	}, true );

	res._groupSelector = group;
	return res;
} );

// Individual button selector
DataTable.Api.register( 'button()', function ( group, selector ) {
	// just run buttons() and truncate
	var buttons = this.buttons( group, selector );

	if ( buttons.length > 1 ) {
		buttons.splice( 1, buttons.length );
	}

	return buttons;
} );

// Active buttons
DataTable.Api.registerPlural( 'buttons().active()', 'button().active()', function ( flag ) {
	if ( flag === undefined ) {
		return this.map( function ( set ) {
			return set.inst.active( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.active( set.node, flag );
	} );
} );

// Get / set button action
DataTable.Api.registerPlural( 'buttons().action()', 'button().action()', function ( action ) {
	if ( action === undefined ) {
		return this.map( function ( set ) {
			return set.inst.action( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.action( set.node, action );
	} );
} );

// Collection control
DataTable.Api.registerPlural( 'buttons().collectionRebuild()', 'button().collectionRebuild()', function ( buttons ) {
	return this.each( function ( set ) {
		for(var i = 0; i < buttons.length; i++) {
			if(typeof buttons[i] === 'object') {
				buttons[i].parentConf = set;
			}
		}
		set.inst.collectionRebuild( set.node, buttons );
	} );
} );

// Enable / disable buttons
DataTable.Api.register( ['buttons().enable()', 'button().enable()'], function ( flag ) {
	return this.each( function ( set ) {
		set.inst.enable( set.node, flag );
	} );
} );

// Disable buttons
DataTable.Api.register( ['buttons().disable()', 'button().disable()'], function () {
	return this.each( function ( set ) {
		set.inst.disable( set.node );
	} );
} );

// Button index
DataTable.Api.register( 'button().index()', function () {
	var idx = null;

	this.each( function ( set ) {
		var res = set.inst.index( set.node );

		if (res !== null) {
			idx = res;
		}
	} );

	return idx;
} );

// Get button nodes
DataTable.Api.registerPlural( 'buttons().nodes()', 'button().node()', function () {
	var jq = $();

	// jQuery will automatically reduce duplicates to a single entry
	$( this.each( function ( set ) {
		jq = jq.add( set.inst.node( set.node ) );
	} ) );

	return jq;
} );

// Get / set button processing state
DataTable.Api.registerPlural( 'buttons().processing()', 'button().processing()', function ( flag ) {
	if ( flag === undefined ) {
		return this.map( function ( set ) {
			return set.inst.processing( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.processing( set.node, flag );
	} );
} );

// Get / set button text (i.e. the button labels)
DataTable.Api.registerPlural( 'buttons().text()', 'button().text()', function ( label ) {
	if ( label === undefined ) {
		return this.map( function ( set ) {
			return set.inst.text( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.text( set.node, label );
	} );
} );

// Trigger a button's action
DataTable.Api.registerPlural( 'buttons().trigger()', 'button().trigger()', function () {
	return this.each( function ( set ) {
		set.inst.node( set.node ).trigger( 'click' );
	} );
} );

// Button resolver to the popover
DataTable.Api.register( 'button().popover()', function (content, options) {
	return this.map( function ( set ) {
		return set.inst._popover( content, this.button(this[0].node), options );
	} );
} );

// Get the container elements
DataTable.Api.register( 'buttons().containers()', function () {
	var jq = $();
	var groupSelector = this._groupSelector;

	// We need to use the group selector directly, since if there are no buttons
	// the result set will be empty
	this.iterator( true, 'table', function ( ctx ) {
		if ( ctx._buttons ) {
			var insts = Buttons.instanceSelector( groupSelector, ctx._buttons );

			for ( var i=0, ien=insts.length ; i<ien ; i++ ) {
				jq = jq.add( insts[i].container() );
			}
		}
	} );

	return jq;
} );

DataTable.Api.register( 'buttons().container()', function () {
	// API level of nesting is `buttons()` so we can zip into the containers method
	return this.containers().eq(0);
} );

// Add a new button
DataTable.Api.register( 'button().add()', function ( idx, conf, draw ) {
	var ctx = this.context;

	// Don't use `this` as it could be empty - select the instances directly
	if ( ctx.length ) {
		var inst = Buttons.instanceSelector( this._groupSelector, ctx[0]._buttons );

		if ( inst.length ) {
			inst[0].add( conf, idx , draw);
		}
	}

	return this.button( this._groupSelector, idx );
} );

// Destroy the button sets selected
DataTable.Api.register( 'buttons().destroy()', function () {
	this.pluck( 'inst' ).unique().each( function ( inst ) {
		inst.destroy();
	} );

	return this;
} );

// Remove a button
DataTable.Api.registerPlural( 'buttons().remove()', 'buttons().remove()', function () {
	this.each( function ( set ) {
		set.inst.remove( set.node );
	} );

	return this;
} );

// Information box that can be used by buttons
var _infoTimer;
DataTable.Api.register( 'buttons.info()', function ( title, message, time ) {
	var that = this;

	if ( title === false ) {
		this.off('destroy.btn-info');
		_fadeOut(
			$('#datatables_buttons_info'),
			400,
			function () {
				$(this).remove();
			}
		);
		clearTimeout( _infoTimer );
		_infoTimer = null;

		return this;
	}

	if ( _infoTimer ) {
		clearTimeout( _infoTimer );
	}

	if ( $('#datatables_buttons_info').length ) {
		$('#datatables_buttons_info').remove();
	}

	title = title ? '<h2>'+title+'</h2>' : '';

	_fadeIn(
		$('<div id="datatables_buttons_info" class="dt-button-info"/>')
			.html( title )
			.append( $('<div/>')[ typeof message === 'string' ? 'html' : 'append' ]( message ) )
			.css( 'display', 'none' )
			.appendTo( 'body' )
	);

	if ( time !== undefined && time !== 0 ) {
		_infoTimer = setTimeout( function () {
			that.buttons.info( false );
		}, time );
	}

	this.on('destroy.btn-info', function () {
		that.buttons.info(false);
	});

	return this;
} );

// Get data from the table for export - this is common to a number of plug-in
// buttons so it is included in the Buttons core library
DataTable.Api.register( 'buttons.exportData()', function ( options ) {
	if ( this.context.length ) {
		return _exportData( new DataTable.Api( this.context[0] ), options );
	}
} );

// Get information about the export that is common to many of the export data
// types (DRY)
DataTable.Api.register( 'buttons.exportInfo()', function ( conf ) {
	if ( ! conf ) {
		conf = {};
	}

	return {
		filename: _filename( conf ),
		title: _title( conf ),
		messageTop: _message(this, conf.message || conf.messageTop, 'top'),
		messageBottom: _message(this, conf.messageBottom, 'bottom')
	};
} );



/**
 * Get the file name for an exported file.
 *
 * @param {object}	config Button configuration
 * @param {boolean} incExtension Include the file name extension
 */
var _filename = function ( config )
{
	// Backwards compatibility
	var filename = config.filename === '*' && config.title !== '*' && config.title !== undefined && config.title !== null && config.title !== '' ?
		config.title :
		config.filename;

	if ( typeof filename === 'function' ) {
		filename = filename();
	}

	if ( filename === undefined || filename === null ) {
		return null;
	}

	if ( filename.indexOf( '*' ) !== -1 ) {
		filename = filename.replace( '*', $('head > title').text() ).trim();
	}

	// Strip characters which the OS will object to
	filename = filename.replace(/[^a-zA-Z0-9_\u00A1-\uFFFF\.,\-_ !\(\)]/g, "");

	var extension = _stringOrFunction( config.extension );
	if ( ! extension ) {
		extension = '';
	}

	return filename + extension;
};

/**
 * Simply utility method to allow parameters to be given as a function
 *
 * @param {undefined|string|function} option Option
 * @return {null|string} Resolved value
 */
var _stringOrFunction = function ( option )
{
	if ( option === null || option === undefined ) {
		return null;
	}
	else if ( typeof option === 'function' ) {
		return option();
	}
	return option;
};

/**
 * Get the title for an exported file.
 *
 * @param {object} config	Button configuration
 */
var _title = function ( config )
{
	var title = _stringOrFunction( config.title );

	return title === null ?
		null : title.indexOf( '*' ) !== -1 ?
			title.replace( '*', $('head > title').text() || 'Exported data' ) :
			title;
};

var _message = function ( dt, option, position )
{
	var message = _stringOrFunction( option );
	if ( message === null ) {
		return null;
	}

	var caption = $('caption', dt.table().container()).eq(0);
	if ( message === '*' ) {
		var side = caption.css( 'caption-side' );
		if ( side !== position ) {
			return null;
		}

		return caption.length ?
			caption.text() :
			'';
	}

	return message;
};




var _exportTextarea = $('<textarea/>')[0];
var _exportData = function ( dt, inOpts )
{
	var config = $.extend( true, {}, {
		rows:           null,
		columns:        '',
		modifier:       {
			search: 'applied',
			order:  'applied'
		},
		orthogonal:     'display',
		stripHtml:      true,
		stripNewlines:  true,
		decodeEntities: true,
		trim:           true,
		format:         {
			header: function ( d ) {
				return Buttons.stripData( d, config );
			},
			footer: function ( d ) {
				return Buttons.stripData( d, config );
			},
			body: function ( d ) {
				return Buttons.stripData( d, config );
			}
		},
		customizeData: null
	}, inOpts );

	var header = dt.columns( config.columns ).indexes().map( function (idx) {
		var el = dt.column( idx ).header();
		return config.format.header( el.innerHTML, idx, el );
	} ).toArray();

	var footer = dt.table().footer() ?
		dt.columns( config.columns ).indexes().map( function (idx) {
			var el = dt.column( idx ).footer();
			return config.format.footer( el ? el.innerHTML : '', idx, el );
		} ).toArray() :
		null;
	
	// If Select is available on this table, and any rows are selected, limit the export
	// to the selected rows. If no rows are selected, all rows will be exported. Specify
	// a `selected` modifier to control directly.
	var modifier = $.extend( {}, config.modifier );
	if ( dt.select && typeof dt.select.info === 'function' && modifier.selected === undefined ) {
		if ( dt.rows( config.rows, $.extend( { selected: true }, modifier ) ).any() ) {
			$.extend( modifier, { selected: true } )
		}
	}

	var rowIndexes = dt.rows( config.rows, modifier ).indexes().toArray();
	var selectedCells = dt.cells( rowIndexes, config.columns );
	var cells = selectedCells
		.render( config.orthogonal )
		.toArray();
	var cellNodes = selectedCells
		.nodes()
		.toArray();

	var columns = header.length;
	var rows = columns > 0 ? cells.length / columns : 0;
	var body = [];
	var cellCounter = 0;

	for ( var i=0, ien=rows ; i<ien ; i++ ) {
		var row = [ columns ];

		for ( var j=0 ; j<columns ; j++ ) {
			row[j] = config.format.body( cells[ cellCounter ], i, j, cellNodes[ cellCounter ] );
			cellCounter++;
		}

		body[i] = row;
	}

	var data = {
		header: header,
		footer: footer,
		body:   body
	};

	if ( config.customizeData ) {
		config.customizeData( data );
	}

	return data;
};


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables interface
 */

// Attach to DataTables objects for global access
$.fn.dataTable.Buttons = Buttons;
$.fn.DataTable.Buttons = Buttons;



// DataTables creation - check if the buttons have been defined for this table,
// they will have been if the `B` option was used in `dom`, otherwise we should
// create the buttons instance here so they can be inserted into the document
// using the API. Listen for `init` for compatibility with pre 1.10.10, but to
// be removed in future.
$(document).on( 'init.dt plugin-init.dt', function (e, settings) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	var opts = settings.oInit.buttons || DataTable.defaults.buttons;

	if ( opts && ! settings._buttons ) {
		new Buttons( settings, opts ).container();
	}
} );

function _init ( settings, options ) {
	var api = new DataTable.Api( settings );
	var opts = options
		? options
		: api.init().buttons || DataTable.defaults.buttons;

	return new Buttons( api, opts ).container();
}

// DataTables `dom` feature option
DataTable.ext.feature.push( {
	fnInit: _init,
	cFeature: "B"
} );

// DataTables 2 layout feature
if ( DataTable.ext.features ) {
	DataTable.ext.features.register( 'buttons', _init );
}


return DataTable;
}));

/*! Bootstrap integration for DataTables' Buttons
 * ©2016 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net-bs5', 'datatables.net-buttons'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				// CommonJS environments without a window global must pass a
				// root. This will give an error otherwise
				root = window;
			}

			if ( ! $ ) {
				$ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window
					require('jquery') :
					require('jquery')( root );
			}

			if ( ! $.fn.dataTable ) {
				require('datatables.net-bs5')(root, $);
			}

			if ( ! $.fn.dataTable.Buttons ) {
				require('datatables.net-buttons')(root, $);
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;



$.extend( true, DataTable.Buttons.defaults, {
	dom: {
		container: {
			className: 'dt-buttons btn-group flex-wrap'
		},
		button: {
			className: 'btn btn-secondary'
		},
		collection: {
			tag: 'div',
			className: 'dropdown-menu',
			closeButton: false,
			button: {
				tag: 'a',
				className: 'dt-button dropdown-item',
				active: 'active',
				disabled: 'disabled'
			}
		},
		splitWrapper: {
			tag: 'div',
			className: 'dt-btn-split-wrapper btn-group',
			closeButton: false,
		},
		splitDropdown: {
			tag: 'button',
			text: '',
			className: 'btn btn-secondary dt-btn-split-drop dropdown-toggle dropdown-toggle-split',
			closeButton: false,
			align: 'split-left',
			splitAlignClass: 'dt-button-split-left'
		},
		splitDropdownButton: {
			tag: 'button',
			className: 'dt-btn-split-drop-button btn btn-secondary',
			closeButton: false
		}
	},
	buttonCreated: function ( config, button ) {
		return config.buttons ?
			$('<div class="btn-group"/>').append(button) :
			button;
	}
} );

DataTable.ext.buttons.collection.className += ' dropdown-toggle';
DataTable.ext.buttons.collection.rightAlignClassName = 'dropdown-menu-right';


return DataTable;
}));

/*! DateTime picker for DataTables.net v1.2.0
 *
 * © SpryMedia Ltd, all rights reserved.
 * License: MIT datatables.net/license/mit
 */

(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], function ($) {
			return factory($, window, document);
		});
	}
	else if (typeof exports === 'object') {
		// CommonJS
		module.exports = function (root, $) {
			if (!root) {
				// CommonJS environments without a window global must pass a
				// root. This will give an error otherwise
				root = window;
			}

			if (!$) {
				$ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window
					require('jquery') :
					require('jquery')(root);
			}


			return factory($, root, root.document);
		};
	}
	else {
		// Browser
		factory(jQuery, window, document);
	}
}(function ($, window, document, undefined) {
	'use strict';



	/**
	 * @summary     DateTime picker for DataTables.net
	 * @version     1.2.0
	 * @file        dataTables.dateTime.js
	 * @author      SpryMedia Ltd
	 * @contact     www.datatables.net/contact
	 */

	// Supported formatting and parsing libraries:
	// * Moment
	// * Luxon
	// * DayJS
	var dateLib;

	/*
	 * This file provides a DateTime GUI picker (calendar and time input). Only the
	 * format YYYY-MM-DD is supported without additional software, but the end user
	 * experience can be greatly enhanced by including the momentjs, dayjs or luxon library
	 * which provide date / time parsing and formatting options.
	 *
	 * This functionality is required because the HTML5 date and datetime input
	 * types are not widely supported in desktop browsers.
	 *
	 * Constructed by using:
	 *
	 *     new DateTime( input, opts )
	 *
	 * where `input` is the HTML input element to use and `opts` is an object of
	 * options based on the `DateTime.defaults` object.
	 */
	var DateTime = function (input, opts) {
		// Attempt to auto detect the formatting library (if there is one). Having it in
		// the constructor allows load order independence.
		if (typeof dateLib === 'undefined') {
			dateLib = window.moment
				? window.moment
				: window.dayjs
					? window.dayjs
					: window.luxon
						? window.luxon
						: null;
		}

		this.c = $.extend(true, {}, DateTime.defaults, opts);
		var classPrefix = this.c.classPrefix;
		var i18n = this.c.i18n;

		// Only IS8601 dates are supported without moment, dayjs or luxon
		if (!dateLib && this.c.format !== 'YYYY-MM-DD') {
			throw "DateTime: Without momentjs, dayjs or luxon only the format 'YYYY-MM-DD' can be used";
		}

		// Min and max need to be `Date` objects in the config
		if (typeof this.c.minDate === 'string') {
			this.c.minDate = new Date(this.c.minDate);
		}
		if (typeof this.c.maxDate === 'string') {
			this.c.maxDate = new Date(this.c.maxDate);
		}

		var timeBlock = function (type) {
			return '<div class="' + classPrefix + '-timeblock">' +
				'</div>';
		};

		var gap = function () {
			return '<span>:</span>';
		};

		// DOM structure
		var structure = $(
			'<div class="' + classPrefix + '">' +
			'<div class="' + classPrefix + '-date">' +
			'<div class="' + classPrefix + '-title">' +
			'<div class="' + classPrefix + '-iconLeft">' +
			'<button type="button" title="' + i18n.previous + '">' + i18n.previous + '</button>' +
			'</div>' +
			'<div class="' + classPrefix + '-iconRight">' +
			'<button type="button" title="' + i18n.next + '">' + i18n.next + '</button>' +
			'</div>' +
			'<div class="' + classPrefix + '-label">' +
			'<span></span>' +
			'<select class="' + classPrefix + '-month"></select>' +
			'</div>' +
			'<div class="' + classPrefix + '-label">' +
			'<span></span>' +
			'<select class="' + classPrefix + '-year"></select>' +
			'</div>' +
			'</div>' +
			'<div class="' + classPrefix + '-buttons">' +
			'<a class="' + classPrefix + '-clear">' + i18n.clear + '</a>' +
			'<a class="' + classPrefix + '-today">' + i18n.today + '</a>' +
			'</div>' +
			'<div class="' + classPrefix + '-calendar"></div>' +
			'</div>' +
			'<div class="' + classPrefix + '-time">' +
			'<div class="' + classPrefix + '-hours"></div>' +
			'<div class="' + classPrefix + '-minutes"></div>' +
			'<div class="' + classPrefix + '-seconds"></div>' +
			'</div>' +
			'<div class="' + classPrefix + '-error"></div>' +
			'</div>'
		);

		this.dom = {
			container: structure,
			date: structure.find('.' + classPrefix + '-date'),
			title: structure.find('.' + classPrefix + '-title'),
			calendar: structure.find('.' + classPrefix + '-calendar'),
			time: structure.find('.' + classPrefix + '-time'),
			error: structure.find('.' + classPrefix + '-error'),
			buttons: structure.find('.' + classPrefix + '-buttons'),
			clear: structure.find('.' + classPrefix + '-clear'),
			today: structure.find('.' + classPrefix + '-today'),
			input: $(input)
		};

		this.s = {
			/** @type {Date} Date value that the picker has currently selected */
			d: null,

			/** @type {Date} Date of the calendar - might not match the value */
			display: null,

			/** @type {number} Used to select minutes in a range where the range base is itself unavailable */
			minutesRange: null,

			/** @type {number} Used to select minutes in a range where the range base is itself unavailable */
			secondsRange: null,

			/** @type {String} Unique namespace string for this instance */
			namespace: 'dateime-' + (DateTime._instance++),

			/** @type {Object} Parts of the picker that should be shown */
			parts: {
				date: this.c.format.match(/[YMD]|L(?!T)|l/) !== null,
				time: this.c.format.match(/[Hhm]|LT|LTS/) !== null,
				seconds: this.c.format.indexOf('s') !== -1,
				hours12: this.c.format.match(/[haA]/) !== null
			}
		};

		this.dom.container
			.append(this.dom.date)
			.append(this.dom.time)
			.append(this.dom.error);

		this.dom.date
			.append(this.dom.title)
			.append(this.dom.buttons)
			.append(this.dom.calendar);

		this._constructor();
	};

	$.extend(DateTime.prototype, {
		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
		 * Public
		 */

		/**
		 * Destroy the control
		 */
		destroy: function () {
			this._hide(true);
			this.dom.container.off().empty();
			this.dom.input
				.removeAttr('autocomplete')
				.off('.datetime');
		},

		errorMsg: function (msg) {
			var error = this.dom.error;

			if (msg) {
				error.html(msg);
			}
			else {
				error.empty();
			}

			return this;
		},

		hide: function () {
			this._hide();

			return this;
		},

		max: function (date) {
			this.c.maxDate = typeof date === 'string'
				? new Date(date)
				: date;

			this._optionsTitle();
			this._setCalander();

			return this;
		},

		min: function (date) {
			this.c.minDate = typeof date === 'string'
				? new Date(date)
				: date;

			this._optionsTitle();
			this._setCalander();

			return this;
		},

		/**
		 * Check if an element belongs to this control
		 *
		 * @param  {node} node Element to check
		 * @return {boolean}   true if owned by this control, false otherwise
		 */
		owns: function (node) {
			return $(node).parents().filter(this.dom.container).length > 0;
		},

		/**
		 * Get / set the value
		 *
		 * @param  {string|Date} set   Value to set
		 * @param  {boolean} [write=true] Flag to indicate if the formatted value
		 *   should be written into the input element
		 */
		val: function (set, write) {
			if (set === undefined) {
				return this.s.d;
			}

			if (set instanceof Date) {
				this.s.d = this._dateToUtc(set);
			}
			else if (set === null || set === '') {
				this.s.d = null;
			}
			else if (set === '--now') {
				this.s.d = this._dateToUtc(new Date());
			}
			else if (typeof set === 'string') {
				// luxon uses different method names so need to be able to call them
				if (dateLib && dateLib == window.luxon) {
					var luxDT = dateLib.DateTime.fromFormat(set, this.c.format)
					this.s.d = luxDT.isValid ? luxDT.toJSDate() : null;
				}
				else if (dateLib) {
					// Use moment, dayjs or luxon if possible (even for ISO8601 strings, since it
					// will correctly handle 0000-00-00 and the like)
					var m = dateLib.utc(set, this.c.format, this.c.locale, this.c.strict);
					this.s.d = m.isValid() ? m.toDate() : null;
				}
				else {
					// Else must be using ISO8601 without a date library (constructor would
					// have thrown an error otherwise)
					var match = set.match(/(\d{4})\-(\d{2})\-(\d{2})/);
					this.s.d = match ?
						new Date(Date.UTC(match[1], match[2] - 1, match[3])) :
						null;
				}
			}

			if (write || write === undefined) {
				if (this.s.d) {
					this._writeOutput();
				}
				else {
					// The input value was not valid...
					this.dom.input.val(set);
				}
			}

			// Need something to display
			this.s.display = this.s.d
				? new Date(this.s.d.toString())
				: new Date();

			// Set the day of the month to be 1 so changing between months doesn't
			// run into issues when going from day 31 to 28 (for example)
			this.s.display.setUTCDate(1);

			// Update the display elements for the new value
			this._setTitle();
			this._setCalander();
			this._setTime();

			return this;
		},


		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
		 * Constructor
		 */

		/**
		 * Build the control and assign initial event handlers
		 *
		 * @private
		 */
		_constructor: function () {
			var that = this;
			var classPrefix = this.c.classPrefix;
			var last = this.dom.input.val();

			var onChange = function () {
				var curr = that.dom.input.val();

				if (curr !== last) {
					that.c.onChange.call(that, curr, that.s.d, that.dom.input);
					last = curr;
				}
			};

			if (!this.s.parts.date) {
				this.dom.date.css('display', 'none');
			}

			if (!this.s.parts.time) {
				this.dom.time.css('display', 'none');
			}

			if (!this.s.parts.seconds) {
				this.dom.time.children('div.' + classPrefix + '-seconds').remove();
				this.dom.time.children('span').eq(1).remove();
			}

			if (!this.c.buttons.clear) {
				this.dom.clear.css('display', 'none');
			}

			if (!this.c.buttons.today) {
				this.dom.today.css('display', 'none');
			}

			// Render the options
			this._optionsTitle();

			$(document).on('i18n.dt', function (e, settings) {
				if (settings.oLanguage.datetime) {
					$.extend(true, that.c.i18n, settings.oLanguage.datetime);
					that._optionsTitle();
				}
			});

			// When attached to a hidden input, we always show the input picker, and
			// do so inline
			if (this.dom.input.attr('type') === 'hidden') {
				this.dom.container.addClass('inline');
				this.c.attachTo = 'input';

				this.val(this.dom.input.val(), false);
				this._show();
			}

			// Set the initial value
			if (last) {
				this.val(last, false);
			}

			// Trigger the display of the widget when clicking or focusing on the
			// input element
			this.dom.input
				.attr('autocomplete', 'off')
				.on('focus.datetime click.datetime', function () {
					// If already visible - don't do anything
					if (that.dom.container.is(':visible') || that.dom.input.is(':disabled')) {
						return;
					}

					// In case the value has changed by text
					that.val(that.dom.input.val(), false);

					that._show();
				})
				.on('keyup.datetime', function () {
					// Update the calendar's displayed value as the user types
					if (that.dom.container.is(':visible')) {
						that.val(that.dom.input.val(), false);
					}
				});

			// Main event handlers for input in the widget
			this.dom.container
				.on('change', 'select', function () {
					var select = $(this);
					var val = select.val();

					if (select.hasClass(classPrefix + '-month')) {
						// Month select
						that._correctMonth(that.s.display, val);
						that._setTitle();
						that._setCalander();
					}
					else if (select.hasClass(classPrefix + '-year')) {
						// Year select
						that.s.display.setUTCFullYear(val);
						that._setTitle();
						that._setCalander();
					}
					else if (select.hasClass(classPrefix + '-hours') || select.hasClass(classPrefix + '-ampm')) {
						// Hours - need to take account of AM/PM input if present
						if (that.s.parts.hours12) {
							var hours = $(that.dom.container).find('.' + classPrefix + '-hours').val() * 1;
							var pm = $(that.dom.container).find('.' + classPrefix + '-ampm').val() === 'pm';

							that.s.d.setUTCHours(hours === 12 && !pm ?
								0 :
								pm && hours !== 12 ?
									hours + 12 :
									hours
							);
						}
						else {
							that.s.d.setUTCHours(val);
						}

						that._setTime();
						that._writeOutput(true);

						onChange();
					}
					else if (select.hasClass(classPrefix + '-minutes')) {
						// Minutes select
						that.s.d.setUTCMinutes(val);
						that._setTime();
						that._writeOutput(true);

						onChange();
					}
					else if (select.hasClass(classPrefix + '-seconds')) {
						// Seconds select
						that.s.d.setSeconds(val);
						that._setTime();
						that._writeOutput(true);

						onChange();
					}

					that.dom.input.focus();
					that._position();
				})
				.on('click', function (e) {
					var d = that.s.d;
					var nodeName = e.target.nodeName.toLowerCase();
					var target = nodeName === 'span' ?
						e.target.parentNode :
						e.target;

					nodeName = target.nodeName.toLowerCase();

					if (nodeName === 'select') {
						return;
					}

					e.stopPropagation();

					if (nodeName === 'a') {
						e.preventDefault();

						if ($(target).hasClass(classPrefix + '-clear')) {
							// Clear the value and don't change the display
							that.s.d = null;
							that.dom.input.val('');
							that._writeOutput();
							that._setCalander();
							that._setTime();

							onChange();
						}
						else if ($(target).hasClass(classPrefix + '-today')) {
							// Don't change the value, but jump to the month
							// containing today
							that.s.display = new Date();

							that._setTitle();
							that._setCalander();
						}
					}
					if (nodeName === 'button') {
						var button = $(target);
						var parent = button.parent();

						if (parent.hasClass('disabled') && !parent.hasClass('range')) {
							button.blur();
							return;
						}

						if (parent.hasClass(classPrefix + '-iconLeft')) {
							// Previous month
							that.s.display.setUTCMonth(that.s.display.getUTCMonth() - 1);
							that._setTitle();
							that._setCalander();

							that.dom.input.focus();
						}
						else if (parent.hasClass(classPrefix + '-iconRight')) {
							// Next month
							that._correctMonth(that.s.display, that.s.display.getUTCMonth() + 1);
							that._setTitle();
							that._setCalander();

							that.dom.input.focus();
						}
						else if (button.parents('.' + classPrefix + '-time').length) {
							var val = button.data('value');
							var unit = button.data('unit');

							d = that._needValue();

							if (unit === 'minutes') {
								if (parent.hasClass('disabled') && parent.hasClass('range')) {
									that.s.minutesRange = val;
									that._setTime();
									return;
								}
								else {
									that.s.minutesRange = null;
								}
							}

							if (unit === 'seconds') {
								if (parent.hasClass('disabled') && parent.hasClass('range')) {
									that.s.secondsRange = val;
									that._setTime();
									return;
								}
								else {
									that.s.secondsRange = null;
								}
							}

							// Specific to hours for 12h clock
							if (val === 'am') {
								if (d.getUTCHours() >= 12) {
									val = d.getUTCHours() - 12;
								}
								else {
									return;
								}
							}
							else if (val === 'pm') {
								if (d.getUTCHours() < 12) {
									val = d.getUTCHours() + 12;
								}
								else {
									return;
								}
							}

							var set = unit === 'hours' ?
								'setUTCHours' :
								unit === 'minutes' ?
									'setUTCMinutes' :
									'setSeconds';

							d[set](val);
							that._setCalander();
							that._setTime();
							that._writeOutput(true);
							onChange();
						}
						else {
							// Calendar click
							d = that._needValue();

							// Can't be certain that the current day will exist in
							// the new month, and likewise don't know that the
							// new day will exist in the old month, But 1 always
							// does, so we can change the month without worry of a
							// recalculation being done automatically by `Date`
							d.setUTCDate(1);
							d.setUTCFullYear(button.data('year'));
							d.setUTCMonth(button.data('month'));
							d.setUTCDate(button.data('day'));

							that._writeOutput(true);

							// Don't hide if there is a time picker, since we want to
							// be able to select a time as well.
							if (!that.s.parts.time) {
								// This is annoying but IE has some kind of async
								// behaviour with focus and the focus from the above
								// write would occur after this hide - resulting in the
								// calendar opening immediately
								setTimeout(function () {
									that._hide();
								}, 10);
							}
							else {
								that._setCalander();
								that._setTime();
							}

							onChange();
						}
					}
					else {
						// Click anywhere else in the widget - return focus to the
						// input element
						that.dom.input.focus();
					}
				});
		},


		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
		 * Private
		 */

		/**
		 * Compare the date part only of two dates - this is made super easy by the
		 * toDateString method!
		 *
		 * @param  {Date} a Date 1
		 * @param  {Date} b Date 2
		 * @private
		 */
		_compareDates: function (a, b) {
			// Can't use toDateString as that converts to local time
			// luxon uses different method names so need to be able to call them
			return dateLib && dateLib == window.luxon
				? dateLib.DateTime.fromJSDate(a).toISODate() === dateLib.DateTime.fromJSDate(b).toISODate()
				: this._dateToUtcString(a) === this._dateToUtcString(b);
		},

		/**
		 * When changing month, take account of the fact that some months don't have
		 * the same number of days. For example going from January to February you
		 * can have the 31st of Jan selected and just add a month since the date
		 * would still be 31, and thus drop you into March.
		 *
		 * @param  {Date} date  Date - will be modified
		 * @param  {integer} month Month to set
		 * @private
		 */
		_correctMonth: function (date, month) {
			var days = this._daysInMonth(date.getUTCFullYear(), month);
			var correctDays = date.getUTCDate() > days;

			date.setUTCMonth(month);

			if (correctDays) {
				date.setUTCDate(days);
				date.setUTCMonth(month);
			}
		},

		/**
		 * Get the number of days in a method. Based on
		 * http://stackoverflow.com/a/4881951 by Matti Virkkunen
		 *
		 * @param  {integer} year  Year
		 * @param  {integer} month Month (starting at 0)
		 * @private
		 */
		_daysInMonth: function (year, month) {
			// 
			var isLeap = ((year % 4) === 0 && ((year % 100) !== 0 || (year % 400) === 0));
			var months = [31, (isLeap ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

			return months[month];
		},

		/**
		 * Create a new date object which has the UTC values set to the local time.
		 * This allows the local time to be used directly for the library which
		 * always bases its calculations and display on UTC.
		 *
		 * @param  {Date} s Date to "convert"
		 * @return {Date}   Shifted date
		 */
		_dateToUtc: function (s) {
			return new Date(Date.UTC(
				s.getFullYear(), s.getMonth(), s.getDate(),
				s.getHours(), s.getMinutes(), s.getSeconds()
			));
		},

		/**
		 * Create a UTC ISO8601 date part from a date object
		 *
		 * @param  {Date} d Date to "convert"
		 * @return {string} ISO formatted date
		 */
		_dateToUtcString: function (d) {
			// luxon uses different method names so need to be able to call them
			return dateLib && dateLib == window.luxon
				? dateLib.DateTime.fromJSDate(d).toISODate()
				: d.getUTCFullYear() + '-' +
				this._pad(d.getUTCMonth() + 1) + '-' +
				this._pad(d.getUTCDate());
		},

		/**
		 * Hide the control and remove events related to its display
		 *
		 * @private
		 */
		_hide: function (destroy) {
			if (!destroy && this.dom.input.attr('type') === 'hidden') {
				return;
			}

			var namespace = this.s.namespace;

			this.dom.container.detach();

			$(window).off('.' + namespace);
			$(document).off('keydown.' + namespace);
			$('div.dataTables_scrollBody').off('scroll.' + namespace);
			$('div.DTE_Body_Content').off('scroll.' + namespace);
			$('body').off('click.' + namespace);
			$(this.dom.input[0].offsetParent).off('.' + namespace);
		},

		/**
		 * Convert a 24 hour value to a 12 hour value
		 *
		 * @param  {integer} val 24 hour value
		 * @return {integer}     12 hour value
		 * @private
		 */
		_hours24To12: function (val) {
			return val === 0 ?
				12 :
				val > 12 ?
					val - 12 :
					val;
		},

		/**
		 * Generate the HTML for a single day in the calendar - this is basically
		 * and HTML cell with a button that has data attributes so we know what was
		 * clicked on (if it is clicked on) and a bunch of classes for styling.
		 *
		 * @param  {object} day Day object from the `_htmlMonth` method
		 * @return {string}     HTML cell
		 */
		_htmlDay: function (day) {
			if (day.empty) {
				return '<td class="empty"></td>';
			}

			var classes = ['selectable'];
			var classPrefix = this.c.classPrefix;

			if (day.disabled) {
				classes.push('disabled');
			}

			if (day.today) {
				classes.push('now');
			}

			if (day.selected) {
				classes.push('selected');
			}

			return '<td data-day="' + day.day + '" class="' + classes.join(' ') + '">' +
				'<button class="' + classPrefix + '-button ' + classPrefix + '-day" type="button" ' + 'data-year="' + day.year + '" data-month="' + day.month + '" data-day="' + day.day + '">' +
				'<span>' + day.day + '</span>' +
				'</button>' +
				'</td>';
		},


		/**
		 * Create the HTML for a month to be displayed in the calendar table.
		 * 
		 * Based upon the logic used in Pikaday - MIT licensed
		 * Copyright (c) 2014 David Bushell
		 * https://github.com/dbushell/Pikaday
		 *
		 * @param  {integer} year  Year
		 * @param  {integer} month Month (starting at 0)
		 * @return {string} Calendar month HTML
		 * @private
		 */
		_htmlMonth: function (year, month) {
			var now = this._dateToUtc(new Date()),
				days = this._daysInMonth(year, month),
				before = new Date(Date.UTC(year, month, 1)).getUTCDay(),
				data = [],
				row = [];

			if (this.c.firstDay > 0) {
				before -= this.c.firstDay;

				if (before < 0) {
					before += 7;
				}
			}

			var cells = days + before,
				after = cells;

			while (after > 7) {
				after -= 7;
			}

			cells += 7 - after;

			var minDate = this.c.minDate;
			var maxDate = this.c.maxDate;

			if (minDate) {
				minDate.setUTCHours(0);
				minDate.setUTCMinutes(0);
				minDate.setSeconds(0);
			}

			if (maxDate) {
				maxDate.setUTCHours(23);
				maxDate.setUTCMinutes(59);
				maxDate.setSeconds(59);
			}

			for (var i = 0, r = 0; i < cells; i++) {
				var day = new Date(Date.UTC(year, month, 1 + (i - before))),
					selected = this.s.d ? this._compareDates(day, this.s.d) : false,
					today = this._compareDates(day, now),
					empty = i < before || i >= (days + before),
					disabled = (minDate && day < minDate) ||
						(maxDate && day > maxDate);

				var disableDays = this.c.disableDays;
				if (Array.isArray(disableDays) && $.inArray(day.getUTCDay(), disableDays) !== -1) {
					disabled = true;
				}
				else if (typeof disableDays === 'function' && disableDays(day) === true) {
					disabled = true;
				}

				var dayConfig = {
					day: 1 + (i - before),
					month: month,
					year: year,
					selected: selected,
					today: today,
					disabled: disabled,
					empty: empty
				};

				row.push(this._htmlDay(dayConfig));

				if (++r === 7) {
					if (this.c.showWeekNumber) {
						row.unshift(this._htmlWeekOfYear(i - before, month, year));
					}

					data.push('<tr>' + row.join('') + '</tr>');
					row = [];
					r = 0;
				}
			}

			var classPrefix = this.c.classPrefix;
			var className = classPrefix + '-table';
			if (this.c.showWeekNumber) {
				className += ' weekNumber';
			}

			// Show / hide month icons based on min/max
			if (minDate) {
				var underMin = minDate >= new Date(Date.UTC(year, month, 1, 0, 0, 0));

				this.dom.title.find('div.' + classPrefix + '-iconLeft')
					.css('display', underMin ? 'none' : 'block');
			}

			if (maxDate) {
				var overMax = maxDate < new Date(Date.UTC(year, month + 1, 1, 0, 0, 0));

				this.dom.title.find('div.' + classPrefix + '-iconRight')
					.css('display', overMax ? 'none' : 'block');
			}

			return '<table class="' + className + '">' +
				'<thead>' +
				this._htmlMonthHead() +
				'</thead>' +
				'<tbody>' +
				data.join('') +
				'</tbody>' +
				'</table>';
		},

		/**
		 * Create the calendar table's header (week days)
		 *
		 * @return {string} HTML cells for the row
		 * @private
		 */
		_htmlMonthHead: function () {
			var a = [];
			var firstDay = this.c.firstDay;
			var i18n = this.c.i18n;

			// Take account of the first day shift
			var dayName = function (day) {
				day += firstDay;

				while (day >= 7) {
					day -= 7;
				}

				return i18n.weekdays[day];
			};

			// Empty cell in the header
			if (this.c.showWeekNumber) {
				a.push('<th></th>');
			}

			for (var i = 0; i < 7; i++) {
				a.push('<th>' + dayName(i) + '</th>');
			}

			return a.join('');
		},

		/**
		 * Create a cell that contains week of the year - ISO8601
		 *
		 * Based on https://stackoverflow.com/questions/6117814/ and
		 * http://techblog.procurios.nl/k/n618/news/view/33796/14863/
		 *
		 * @param  {integer} d Day of month
		 * @param  {integer} m Month of year (zero index)
		 * @param  {integer} y Year
		 * @return {string}   
		 * @private
		 */
		_htmlWeekOfYear: function (d, m, y) {
			var date = new Date(y, m, d, 0, 0, 0, 0);

			// First week of the year always has 4th January in it
			date.setDate(date.getDate() + 4 - (date.getDay() || 7));

			var oneJan = new Date(y, 0, 1);
			var weekNum = Math.ceil((((date - oneJan) / 86400000) + 1) / 7);

			return '<td class="' + this.c.classPrefix + '-week">' + weekNum + '</td>';
		},

		/**
		 * Check if the instance has a date object value - it might be null.
		 * If is doesn't set one to now.
		 * @returns A Date object
		 * @private
		 */
		_needValue: function () {
			if (!this.s.d) {
				this.s.d = this._dateToUtc(new Date());

				if (!this.s.parts.time) {
					this.s.d.setUTCHours(0);
					this.s.d.setUTCMinutes(0);
					this.s.d.setSeconds(0);
					this.s.d.setMilliseconds(0);
				}
			}

			return this.s.d;
		},

		/**
		 * Create option elements from a range in an array
		 *
		 * @param  {string} selector Class name unique to the select element to use
		 * @param  {array} values   Array of values
		 * @param  {array} [labels] Array of labels. If given must be the same
		 *   length as the values parameter.
		 * @private
		 */
		_options: function (selector, values, labels) {
			if (!labels) {
				labels = values;
			}

			var select = this.dom.container.find('select.' + this.c.classPrefix + '-' + selector);
			select.empty();

			for (var i = 0, ien = values.length; i < ien; i++) {
				select.append('<option value="' + values[i] + '">' + labels[i] + '</option>');
			}
		},

		/**
		 * Set an option and update the option's span pair (since the select element
		 * has opacity 0 for styling)
		 *
		 * @param  {string} selector Class name unique to the select element to use
		 * @param  {*}      val      Value to set
		 * @private
		 */
		_optionSet: function (selector, val) {
			var select = this.dom.container.find('select.' + this.c.classPrefix + '-' + selector);
			var span = select.parent().children('span');

			select.val(val);

			var selected = select.find('option:selected');
			span.html(selected.length !== 0 ?
				selected.text() :
				this.c.i18n.unknown
			);
		},

		/**
		 * Create time options list.
		 *
		 * @param  {string} unit Time unit - hours, minutes or seconds
		 * @param  {integer} count Count range - 12, 24 or 60
		 * @param  {integer} val Existing value for this unit
		 * @param  {integer[]} allowed Values allow for selection
		 * @param  {integer} range Override range
		 * @private
		 */
		_optionsTime: function (unit, count, val, allowed, range) {
			var classPrefix = this.c.classPrefix;
			var container = this.dom.container.find('div.' + classPrefix + '-' + unit);
			var i, j;
			var render = count === 12 ?
				function (i) { return i; } :
				this._pad;
			var classPrefix = this.c.classPrefix;
			var className = classPrefix + '-table';
			var i18n = this.c.i18n;

			if (!container.length) {
				return;
			}

			var a = '';
			var span = 10;
			var button = function (value, label, className) {
				// Shift the value for PM
				if (count === 12 && typeof value === 'number') {
					if (val >= 12) {
						value += 12;
					}

					if (value == 12) {
						value = 0;
					}
					else if (value == 24) {
						value = 12;
					}
				}

				var selected = val === value || (value === 'am' && val < 12) || (value === 'pm' && val >= 12) ?
					'selected' :
					'';

				if (typeof value === 'number' && allowed && $.inArray(value, allowed) === -1) {
					selected += ' disabled';
				}

				if (className) {
					selected += ' ' + className;
				}

				return '<td class="selectable ' + selected + '">' +
					'<button class="' + classPrefix + '-button ' + classPrefix + '-day" type="button" data-unit="' + unit + '" data-value="' + value + '">' +
					'<span>' + label + '</span>' +
					'</button>' +
					'</td>';
			}

			if (count === 12) {
				// Hours with AM/PM
				a += '<tr>';

				for (i = 1; i <= 6; i++) {
					a += button(i, render(i));
				}
				a += button('am', i18n.amPm[0]);

				a += '</tr>';
				a += '<tr>';

				for (i = 7; i <= 12; i++) {
					a += button(i, render(i));
				}
				a += button('pm', i18n.amPm[1]);
				a += '</tr>';

				span = 7;
			}
			else if (count === 24) {
				// Hours - 24
				var c = 0;
				for (j = 0; j < 4; j++) {
					a += '<tr>';
					for (i = 0; i < 6; i++) {
						a += button(c, render(c));
						c++;
					}
					a += '</tr>';
				}

				span = 6;
			}
			else {
				// Minutes and seconds
				a += '<tr>';
				for (j = 0; j < 60; j += 10) {
					a += button(j, render(j), 'range');
				}
				a += '</tr>';

				// Slight hack to allow for the different number of columns
				a += '</tbody></thead><table class="' + className + ' ' + className + '-nospace"><tbody>';

				var start = range !== null
					? range
					: val === -1
						? 0
						: Math.floor(val / 10) * 10;

				a += '<tr>';
				for (j = start + 1; j < start + 10; j++) {
					a += button(j, render(j));
				}
				a += '</tr>';

				span = 6;
			}

			container
				.empty()
				.append(
					'<table class="' + className + '">' +
					'<thead><tr><th colspan="' + span + '">' +
					i18n[unit] +
					'</th></tr></thead>' +
					'<tbody>' +
					a +
					'</tbody>' +
					'</table>'
				);
		},

		/**
		 * Create the options for the month and year
		 *
		 * @param  {integer} year  Year
		 * @param  {integer} month Month (starting at 0)
		 * @private
		 */
		_optionsTitle: function () {
			var i18n = this.c.i18n;
			var min = this.c.minDate;
			var max = this.c.maxDate;
			var minYear = min ? min.getFullYear() : null;
			var maxYear = max ? max.getFullYear() : null;

			var i = minYear !== null ? minYear : new Date().getFullYear() - this.c.yearRange;
			var j = maxYear !== null ? maxYear : new Date().getFullYear() + this.c.yearRange;

			this._options('month', this._range(0, 11), i18n.months);
			this._options('year', this._range(i, j));
		},

		/**
		 * Simple two digit pad
		 *
		 * @param  {integer} i      Value that might need padding
		 * @return {string|integer} Padded value
		 * @private
		 */
		_pad: function (i) {
			return i < 10 ? '0' + i : i;
		},

		/**
		 * Position the calendar to look attached to the input element
		 * @private
		 */
		_position: function () {
			var offset = this.c.attachTo === 'input' ? this.dom.input.position() : this.dom.input.offset();
			var container = this.dom.container;
			var inputHeight = this.dom.input.outerHeight();

			if (container.hasClass('inline')) {
				container.insertAfter(this.dom.input);
				return;
			}

			if (this.s.parts.date && this.s.parts.time && $(window).width() > 550) {
				container.addClass('horizontal');
			}
			else {
				container.removeClass('horizontal');
			}

			if (this.c.attachTo === 'input') {
				container
					.css({
						top: offset.top + inputHeight,
						left: offset.left
					})
					.insertAfter(this.dom.input);
			}
			else {
				container
					.css({
						top: offset.top + inputHeight,
						left: offset.left
					})
					.appendTo('body');
			}

			var calHeight = container.outerHeight();
			var calWidth = container.outerWidth();
			var scrollTop = $(window).scrollTop();

			// Correct to the bottom
			if (offset.top + inputHeight + calHeight - scrollTop > $(window).height()) {
				var newTop = offset.top - calHeight;

				container.css('top', newTop < 0 ? 0 : newTop);
			}

			// Correct to the right
			if (calWidth + offset.left > $(window).width()) {
				var newLeft = $(window).width() - calWidth;

				// Account for elements which are inside a position absolute element
				if (this.c.attachTo === 'input') {
					newLeft -= $(container).offsetParent().offset().left;
				}

				container.css('left', newLeft < 0 ? 0 : newLeft);
			}
		},

		/**
		 * Create a simple array with a range of values
		 *
		 * @param  {integer} start   Start value (inclusive)
		 * @param  {integer} end     End value (inclusive)
		 * @param  {integer} [inc=1] Increment value
		 * @return {array}           Created array
		 * @private
		 */
		_range: function (start, end, inc) {
			var a = [];

			if (!inc) {
				inc = 1;
			}

			for (var i = start; i <= end; i += inc) {
				a.push(i);
			}

			return a;
		},

		/**
		 * Redraw the calendar based on the display date - this is a destructive
		 * operation
		 *
		 * @private
		 */
		_setCalander: function () {
			if (this.s.display) {
				this.dom.calendar
					.empty()
					.append(this._htmlMonth(
						this.s.display.getUTCFullYear(),
						this.s.display.getUTCMonth()
					));
			}
		},

		/**
		 * Set the month and year for the calendar based on the current display date
		 *
		 * @private
		 */
		_setTitle: function () {
			this._optionSet('month', this.s.display.getUTCMonth());
			this._optionSet('year', this.s.display.getUTCFullYear());
		},

		/**
		 * Set the time based on the current value of the widget
		 *
		 * @private
		 */
		_setTime: function () {
			var that = this;
			var d = this.s.d;

			// luxon uses different method names so need to be able to call them. This happens a few time later in this method too
			var luxDT = null
			if (dateLib && dateLib == window.luxon) {
				luxDT = dateLib.DateTime.fromJSDate(d);
			}

			var hours = luxDT != null
				? luxDT.hour
				: d
					? d.getUTCHours()
					: -1;

			var allowed = function (prop) { // Backwards compt with `Increment` option
				return that.c[prop + 'Available'] ?
					that.c[prop + 'Available'] :
					that._range(0, 59, that.c[prop + 'Increment']);
			}

			this._optionsTime('hours', this.s.parts.hours12 ? 12 : 24, hours, this.c.hoursAvailable)
			this._optionsTime(
				'minutes',
				60,
				luxDT != null
					? luxDT.minute
					: d
						? d.getUTCMinutes()
						: -1,
				allowed('minutes'),
				this.s.minutesRange
			);
			this._optionsTime(
				'seconds',
				60,
				luxDT != null
					? luxDT.second
					: d
						? d.getSeconds()
						: -1,
				allowed('seconds'),
				this.s.secondsRange
			);
		},

		/**
		 * Show the widget and add events to the document required only while it
		 * is displayed
		 * 
		 * @private
		 */
		_show: function () {
			var that = this;
			var namespace = this.s.namespace;

			this._position();

			// Need to reposition on scroll
			$(window).on('scroll.' + namespace + ' resize.' + namespace, function () {
				that._position();
			});

			$('div.DTE_Body_Content').on('scroll.' + namespace, function () {
				that._position();
			});

			$('div.dataTables_scrollBody').on('scroll.' + namespace, function () {
				that._position();
			});

			var offsetParent = this.dom.input[0].offsetParent;

			if (offsetParent !== document.body) {
				$(offsetParent).on('scroll.' + namespace, function () {
					that._position();
				});
			}

			// On tab focus will move to a different field (no keyboard navigation
			// in the date picker - this might need to be changed).
			$(document).on('keydown.' + namespace, function (e) {
				if (
					e.keyCode === 9 || // tab
					e.keyCode === 27 || // esc
					e.keyCode === 13    // return
				) {
					that._hide();
				}
			});

			// Hide if clicking outside of the widget - but in a different click
			// event from the one that was used to trigger the show (bubble and
			// inline)
			setTimeout(function () {
				$('body').on('click.' + namespace, function (e) {
					var parents = $(e.target).parents();

					if (!parents.filter(that.dom.container).length && e.target !== that.dom.input[0]) {
						that._hide();
					}
				});
			}, 10);
		},

		/**
		 * Write the formatted string to the input element this control is attached
		 * to
		 *
		 * @private
		 */
		_writeOutput: function (focus) {
			var date = this.s.d;
			var out = '';

			// Use moment, dayjs or luxon if possible - otherwise it must be ISO8601 (or the
			// constructor would have thrown an error)
			// luxon uses different method names so need to be able to call them.
			if (date) {
				out = dateLib && dateLib == window.luxon
					? dateLib.DateTime.fromJSDate(this.s.d).toFormat(this.c.format)
					: dateLib ?
						dateLib.utc(date, undefined, this.c.locale, this.c.strict).format(this.c.format) :
						date.getUTCFullYear() + '-' +
						this._pad(date.getUTCMonth() + 1) + '-' +
						this._pad(date.getUTCDate());
			}

			this.dom.input
				.val(out)
				.trigger('change', { write: date });

			if (this.dom.input.attr('type') === 'hidden') {
				this.val(out, false);
			}

			if (focus) {
				this.dom.input.focus();
			}
		}
	});

	/**
	 * Use a specificmoment compatible date library
	 */
	DateTime.use = function (lib) {
		dateLib = lib;
	};

	/**
	 * For generating unique namespaces
	 *
	 * @type {Number}
	 * @private
	 */
	DateTime._instance = 0;

	/**
	 * Defaults for the date time picker
	 *
	 * @type {Object}
	 */
	DateTime.defaults = {
		attachTo: 'body',

		buttons: {
			clear: false,
			today: false
		},

		// Not documented - could be an internal property
		classPrefix: 'dt-datetime',

		// function or array of ints
		disableDays: null,

		// first day of the week (0: Sunday, 1: Monday, etc)
		firstDay: 1,

		format: 'YYYY-MM-DD',

		hoursAvailable: null,

		i18n: {
			clear: 'Clear',
			previous: 'Previous',
			next: 'Next',
			months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
			amPm: ['am', 'pm'],
			hours: 'Hour',
			minutes: 'Minute',
			seconds: 'Second',
			unknown: '-',
			today: 'Today'
		},

		maxDate: null,

		minDate: null,

		minutesAvailable: null,

		minutesIncrement: 1, // deprecated

		strict: true,

		locale: 'en',

		onChange: function () { },

		secondsAvailable: null,

		secondsIncrement: 1, // deprecated

		// show the ISO week number at the head of the row
		showWeekNumber: false,

		// overruled by max / min date
		yearRange: 25
	};

	DateTime.version = '1.2.0';

	// Global export - if no conflicts
	if (!window.DateTime) {
		window.DateTime = DateTime;
	}

	// Make available via jQuery
	$.fn.dtDateTime = function (options) {
		return this.each(function () {
			new DateTime(this, options);
		});
	}

	// Attach to DataTables if present
	if ($.fn.dataTable) {
		$.fn.dataTable.DateTime = DateTime;
		$.fn.DataTable.DateTime = DateTime;

		if ($.fn.dataTable.Editor) {
			$.fn.dataTable.Editor.DateTime = DateTime;
		}
	}


	return DateTime;
}));
$.extend(true, $.fn.dataTable.defaults, {
    dom: fukui.ui.dom,
    processing: true,
    serverSide: true,
    ordering: true,
    paging: true,
    lengthMenu: [10, 20, 50, 100],
    pageLength: 20,
    searching: false,
    scrollX: true,
    scrollY: '66vh',
    scrollCollapse: true,
    autoWidth: false,
    responsive: true,
    stateSave: true,
    language: {
        "decimal": "",
        "emptyTable": "データが見つかりません",
        "info": "_TOTAL_件中 _START_ ～ _END_ 件を表示",
        "infoEmpty": "0件中0 ～ 0件を表示",
        "infoFiltered": "(全 _MAX_ エントリー中)",
        "infoPostFix": "",
        "thousands": ",",
        "lengthMenu": "_MENU_ 件表示",
        "loadingRecords": "ローディング...",
        "processing": "",
        "search": "検索:",
        "zeroRecords": "検索条件に一致するデータが見つかりません",
        "paginate": {
            "first": "最初",
            "last": "最後",
            "next": "次へ",
            "previous": "前へ"
        },
        "aria": {
            "sortAscending": ": 昇順で並べ替え",
            "sortDescending": ": 降順に並べ替え"
        },
        "select": {
            "rows": {
                _: "選択された %d 行",
                0: "行をクリックして選択",
                1: "1行選択"
            }
        }
    }
});
//http://cdn.datatables.net/plug-ins/1.13.4/i18n/ja.json
$.fn.select2.defaults.set('language', 'ja');
//https://datatables.net/reference/option/language
$.fn.dataTable.ext.errMode = function (settings, tn, msg) {
    if (settings && settings.jqXHR && settings.jqXHR.status == 401) {
        window.location = window.location.origin + '/Identity/Account/Login?ReturnUrl=%2F';
    }
};
/*!
 * validate.js 0.13.1
 *
 * (c) 2013-2019 Nicklas Ansman, 2013 Wrapp
 * Validate.js may be freely distributed under the MIT license.
 * For all details and documentation:
 * http://validatejs.org/
 */

(function(exports, module, define) {
  "use strict";

  // The main function that calls the validators specified by the constraints.
  // The options are the following:
  //   - format (string) - An option that controls how the returned value is formatted
  //     * flat - Returns a flat array of just the error messages
  //     * grouped - Returns the messages grouped by attribute (default)
  //     * detailed - Returns an array of the raw validation data
  //   - fullMessages (boolean) - If `true` (default) the attribute name is prepended to the error.
  //
  // Please note that the options are also passed to each validator.
  var validate = function(attributes, constraints, options) {
    options = v.extend({}, v.options, options);

    var results = v.runValidations(attributes, constraints, options)
      , attr
      , validator;

    if (results.some(function(r) { return v.isPromise(r.error); })) {
      throw new Error("Use validate.async if you want support for promises");
    }
    return validate.processValidationResults(results, options);
  };

  var v = validate;

  // Copies over attributes from one or more sources to a single destination.
  // Very much similar to underscore's extend.
  // The first argument is the target object and the remaining arguments will be
  // used as sources.
  v.extend = function(obj) {
    [].slice.call(arguments, 1).forEach(function(source) {
      for (var attr in source) {
        obj[attr] = source[attr];
      }
    });
    return obj;
  };

  v.extend(validate, {
    // This is the version of the library as a semver.
    // The toString function will allow it to be coerced into a string
    version: {
      major: 0,
      minor: 13,
      patch: 1,
      metadata: null,
      toString: function() {
        var version = v.format("%{major}.%{minor}.%{patch}", v.version);
        if (!v.isEmpty(v.version.metadata)) {
          version += "+" + v.version.metadata;
        }
        return version;
      }
    },

    // Below is the dependencies that are used in validate.js

    // The constructor of the Promise implementation.
    // If you are using Q.js, RSVP or any other A+ compatible implementation
    // override this attribute to be the constructor of that promise.
    // Since jQuery promises aren't A+ compatible they won't work.
    Promise: typeof Promise !== "undefined" ? Promise : /* istanbul ignore next */ null,

    EMPTY_STRING_REGEXP: /^\s*$/,

    // Runs the validators specified by the constraints object.
    // Will return an array of the format:
    //     [{attribute: "<attribute name>", error: "<validation result>"}, ...]
    runValidations: function(attributes, constraints, options) {
      var results = []
        , attr
        , validatorName
        , value
        , validators
        , validator
        , validatorOptions
        , error;

      if (v.isDomElement(attributes) || v.isJqueryElement(attributes)) {
        attributes = v.collectFormValues(attributes);
      }

      // Loops through each constraints, finds the correct validator and run it.
      for (attr in constraints) {
        value = v.getDeepObjectValue(attributes, attr);
        // This allows the constraints for an attribute to be a function.
        // The function will be called with the value, attribute name, the complete dict of
        // attributes as well as the options and constraints passed in.
        // This is useful when you want to have different
        // validations depending on the attribute value.
        validators = v.result(constraints[attr], value, attributes, attr, options, constraints);

        for (validatorName in validators) {
          validator = v.validators[validatorName];

          if (!validator) {
            error = v.format("Unknown validator %{name}", {name: validatorName});
            throw new Error(error);
          }

          validatorOptions = validators[validatorName];
          // This allows the options to be a function. The function will be
          // called with the value, attribute name, the complete dict of
          // attributes as well as the options and constraints passed in.
          // This is useful when you want to have different
          // validations depending on the attribute value.
          validatorOptions = v.result(validatorOptions, value, attributes, attr, options, constraints);
          if (!validatorOptions) {
            continue;
          }
          results.push({
            attribute: attr,
            value: value,
            validator: validatorName,
            globalOptions: options,
            attributes: attributes,
            options: validatorOptions,
            error: validator.call(validator,
                value,
                validatorOptions,
                attr,
                attributes,
                options)
          });
        }
      }

      return results;
    },

    // Takes the output from runValidations and converts it to the correct
    // output format.
    processValidationResults: function(errors, options) {
      errors = v.pruneEmptyErrors(errors, options);
      errors = v.expandMultipleErrors(errors, options);
      errors = v.convertErrorMessages(errors, options);

      var format = options.format || "grouped";

      if (typeof v.formatters[format] === 'function') {
        errors = v.formatters[format](errors);
      } else {
        throw new Error(v.format("Unknown format %{format}", options));
      }

      return v.isEmpty(errors) ? undefined : errors;
    },

    // Runs the validations with support for promises.
    // This function will return a promise that is settled when all the
    // validation promises have been completed.
    // It can be called even if no validations returned a promise.
    async: function(attributes, constraints, options) {
      options = v.extend({}, v.async.options, options);

      var WrapErrors = options.wrapErrors || function(errors) {
        return errors;
      };

      // Removes unknown attributes
      if (options.cleanAttributes !== false) {
        attributes = v.cleanAttributes(attributes, constraints);
      }

      var results = v.runValidations(attributes, constraints, options);

      return new v.Promise(function(resolve, reject) {
        v.waitForResults(results).then(function() {
          var errors = v.processValidationResults(results, options);
          if (errors) {
            reject(new WrapErrors(errors, options, attributes, constraints));
          } else {
            resolve(attributes);
          }
        }, function(err) {
          reject(err);
        });
      });
    },

    single: function(value, constraints, options) {
      options = v.extend({}, v.single.options, options, {
        format: "flat",
        fullMessages: false
      });
      return v({single: value}, {single: constraints}, options);
    },

    // Returns a promise that is resolved when all promises in the results array
    // are settled. The promise returned from this function is always resolved,
    // never rejected.
    // This function modifies the input argument, it replaces the promises
    // with the value returned from the promise.
    waitForResults: function(results) {
      // Create a sequence of all the results starting with a resolved promise.
      return results.reduce(function(memo, result) {
        // If this result isn't a promise skip it in the sequence.
        if (!v.isPromise(result.error)) {
          return memo;
        }

        return memo.then(function() {
          return result.error.then(function(error) {
            result.error = error || null;
          });
        });
      }, new v.Promise(function(r) { r(); })); // A resolved promise
    },

    // If the given argument is a call: function the and: function return the value
    // otherwise just return the value. Additional arguments will be passed as
    // arguments to the function.
    // Example:
    // ```
    // result('foo') // 'foo'
    // result(Math.max, 1, 2) // 2
    // ```
    result: function(value) {
      var args = [].slice.call(arguments, 1);
      if (typeof value === 'function') {
        value = value.apply(null, args);
      }
      return value;
    },

    // Checks if the value is a number. This function does not consider NaN a
    // number like many other `isNumber` functions do.
    isNumber: function(value) {
      return typeof value === 'number' && !isNaN(value);
    },

    // Returns false if the object is not a function
    isFunction: function(value) {
      return typeof value === 'function';
    },

    // A simple check to verify that the value is an integer. Uses `isNumber`
    // and a simple modulo check.
    isInteger: function(value) {
      return v.isNumber(value) && value % 1 === 0;
    },

    // Checks if the value is a boolean
    isBoolean: function(value) {
      return typeof value === 'boolean';
    },

    // Uses the `Object` function to check if the given argument is an object.
    isObject: function(obj) {
      return obj === Object(obj);
    },

    // Simply checks if the object is an instance of a date
    isDate: function(obj) {
      return obj instanceof Date;
    },

    // Returns false if the object is `null` of `undefined`
    isDefined: function(obj) {
      return obj !== null && obj !== undefined;
    },

    // Checks if the given argument is a promise. Anything with a `then`
    // function is considered a promise.
    isPromise: function(p) {
      return !!p && v.isFunction(p.then);
    },

    isJqueryElement: function(o) {
      return o && v.isString(o.jquery);
    },

    isDomElement: function(o) {
      if (!o) {
        return false;
      }

      if (!o.querySelectorAll || !o.querySelector) {
        return false;
      }

      if (v.isObject(document) && o === document) {
        return true;
      }

      // http://stackoverflow.com/a/384380/699304
      /* istanbul ignore else */
      if (typeof HTMLElement === "object") {
        return o instanceof HTMLElement;
      } else {
        return o &&
          typeof o === "object" &&
          o !== null &&
          o.nodeType === 1 &&
          typeof o.nodeName === "string";
      }
    },

    isEmpty: function(value) {
      var attr;

      // Null and undefined are empty
      if (!v.isDefined(value)) {
        return true;
      }

      // functions are non empty
      if (v.isFunction(value)) {
        return false;
      }

      // Whitespace only strings are empty
      if (v.isString(value)) {
        return v.EMPTY_STRING_REGEXP.test(value);
      }

      // For arrays we use the length property
      if (v.isArray(value)) {
        return value.length === 0;
      }

      // Dates have no attributes but aren't empty
      if (v.isDate(value)) {
        return false;
      }

      // If we find at least one property we consider it non empty
      if (v.isObject(value)) {
        for (attr in value) {
          return false;
        }
        return true;
      }

      return false;
    },

    // Formats the specified strings with the given values like so:
    // ```
    // format("Foo: %{foo}", {foo: "bar"}) // "Foo bar"
    // ```
    // If you want to write %{...} without having it replaced simply
    // prefix it with % like this `Foo: %%{foo}` and it will be returned
    // as `"Foo: %{foo}"`
    format: v.extend(function(str, vals) {
      if (!v.isString(str)) {
        return str;
      }
      return str.replace(v.format.FORMAT_REGEXP, function(m0, m1, m2) {
        if (m1 === '%') {
          return "%{" + m2 + "}";
        } else {
          return String(vals[m2]);
        }
      });
    }, {
      // Finds %{key} style patterns in the given string
      FORMAT_REGEXP: /(%?)%\{([^\}]+)\}/g
    }),

    // "Prettifies" the given string.
    // Prettifying means replacing [.\_-] with spaces as well as splitting
    // camel case words.
    prettify: function(str) {
      if (v.isNumber(str)) {
        // If there are more than 2 decimals round it to two
        if ((str * 100) % 1 === 0) {
          return "" + str;
        } else {
          return parseFloat(Math.round(str * 100) / 100).toFixed(2);
        }
      }

      if (v.isArray(str)) {
        return str.map(function(s) { return v.prettify(s); }).join(", ");
      }

      if (v.isObject(str)) {
        if (!v.isDefined(str.toString)) {
          return JSON.stringify(str);
        }

        return str.toString();
      }

      // Ensure the string is actually a string
      str = "" + str;

      return str
        // Splits keys separated by periods
        .replace(/([^\s])\.([^\s])/g, '$1 $2')
        // Removes backslashes
        .replace(/\\+/g, '')
        // Replaces - and - with space
        .replace(/[_-]/g, ' ')
        // Splits camel cased words
        .replace(/([a-z])([A-Z])/g, function(m0, m1, m2) {
          return "" + m1 + " " + m2.toLowerCase();
        })
        .toLowerCase();
    },

    stringifyValue: function(value, options) {
      var prettify = options && options.prettify || v.prettify;
      return prettify(value);
    },

    isString: function(value) {
      return typeof value === 'string';
    },

    isArray: function(value) {
      return {}.toString.call(value) === '[object Array]';
    },

    // Checks if the object is a hash, which is equivalent to an object that
    // is neither an array nor a function.
    isHash: function(value) {
      return v.isObject(value) && !v.isArray(value) && !v.isFunction(value);
    },

    contains: function(obj, value) {
      if (!v.isDefined(obj)) {
        return false;
      }
      if (v.isArray(obj)) {
        return obj.indexOf(value) !== -1;
      }
      return value in obj;
    },

    unique: function(array) {
      if (!v.isArray(array)) {
        return array;
      }
      return array.filter(function(el, index, array) {
        return array.indexOf(el) == index;
      });
    },

    forEachKeyInKeypath: function(object, keypath, callback) {
      if (!v.isString(keypath)) {
        return undefined;
      }

      var key = ""
        , i
        , escape = false;

      for (i = 0; i < keypath.length; ++i) {
        switch (keypath[i]) {
          case '.':
            if (escape) {
              escape = false;
              key += '.';
            } else {
              object = callback(object, key, false);
              key = "";
            }
            break;

          case '\\':
            if (escape) {
              escape = false;
              key += '\\';
            } else {
              escape = true;
            }
            break;

          default:
            escape = false;
            key += keypath[i];
            break;
        }
      }

      return callback(object, key, true);
    },

    getDeepObjectValue: function(obj, keypath) {
      if (!v.isObject(obj)) {
        return undefined;
      }

      return v.forEachKeyInKeypath(obj, keypath, function(obj, key) {
        if (v.isObject(obj)) {
          return obj[key];
        }
      });
    },

    // This returns an object with all the values of the form.
    // It uses the input name as key and the value as value
    // So for example this:
    // <input type="text" name="email" value="foo@bar.com" />
    // would return:
    // {email: "foo@bar.com"}
    collectFormValues: function(form, options) {
      var values = {}
        , i
        , j
        , input
        , inputs
        , option
        , value;

      if (v.isJqueryElement(form)) {
        form = form[0];
      }

      if (!form) {
        return values;
      }

      options = options || {};

      inputs = form.querySelectorAll("input[name], textarea[name]");
      for (i = 0; i < inputs.length; ++i) {
        input = inputs.item(i);

        if (v.isDefined(input.getAttribute("data-ignored"))) {
          continue;
        }

        var name = input.name.replace(/\./g, "\\\\.");
        value = v.sanitizeFormValue(input.value, options);
        if (input.type === "number") {
          value = value ? +value : null;
        } else if (input.type === "checkbox") {
          if (input.attributes.value) {
            if (!input.checked) {
              value = values[name] || null;
            }
          } else {
            value = input.checked;
          }
        } else if (input.type === "radio") {
          if (!input.checked) {
            value = values[name] || null;
          }
        }
        values[name] = value;
      }

      inputs = form.querySelectorAll("select[name]");
      for (i = 0; i < inputs.length; ++i) {
        input = inputs.item(i);
        if (v.isDefined(input.getAttribute("data-ignored"))) {
          continue;
        }

        if (input.multiple) {
          value = [];
          for (j in input.options) {
            option = input.options[j];
             if (option && option.selected) {
              value.push(v.sanitizeFormValue(option.value, options));
            }
          }
        } else {
          var _val = typeof input.options[input.selectedIndex] !== 'undefined' ? input.options[input.selectedIndex].value : /* istanbul ignore next */ '';
          value = v.sanitizeFormValue(_val, options);
        }
        values[input.name] = value;
      }

      return values;
    },

    sanitizeFormValue: function(value, options) {
      if (options.trim && v.isString(value)) {
        value = value.trim();
      }

      if (options.nullify !== false && value === "") {
        return null;
      }
      return value;
    },

    capitalize: function(str) {
      if (!v.isString(str)) {
        return str;
      }
      return str[0].toUpperCase() + str.slice(1);
    },

    // Remove all errors who's error attribute is empty (null or undefined)
    pruneEmptyErrors: function(errors) {
      return errors.filter(function(error) {
        return !v.isEmpty(error.error);
      });
    },

    // In
    // [{error: ["err1", "err2"], ...}]
    // Out
    // [{error: "err1", ...}, {error: "err2", ...}]
    //
    // All attributes in an error with multiple messages are duplicated
    // when expanding the errors.
    expandMultipleErrors: function(errors) {
      var ret = [];
      errors.forEach(function(error) {
        // Removes errors without a message
        if (v.isArray(error.error)) {
          error.error.forEach(function(msg) {
            ret.push(v.extend({}, error, {error: msg}));
          });
        } else {
          ret.push(error);
        }
      });
      return ret;
    },

    // Converts the error mesages by prepending the attribute name unless the
    // message is prefixed by ^
    convertErrorMessages: function(errors, options) {
      options = options || {};

      var ret = []
        , prettify = options.prettify || v.prettify;
      errors.forEach(function(errorInfo) {
        var error = v.result(errorInfo.error,
            errorInfo.value,
            errorInfo.attribute,
            errorInfo.options,
            errorInfo.attributes,
            errorInfo.globalOptions);

        if (!v.isString(error)) {
          ret.push(errorInfo);
          return;
        }

        if (error[0] === '^') {
          error = error.slice(1);
        } else if (options.fullMessages !== false) {
          error = v.capitalize(prettify(errorInfo.attribute)) + " " + error;
        }
        error = error.replace(/\\\^/g, "^");
        error = v.format(error, {
          value: v.stringifyValue(errorInfo.value, options)
        });
        ret.push(v.extend({}, errorInfo, {error: error}));
      });
      return ret;
    },

    // In:
    // [{attribute: "<attributeName>", ...}]
    // Out:
    // {"<attributeName>": [{attribute: "<attributeName>", ...}]}
    groupErrorsByAttribute: function(errors) {
      var ret = {};
      errors.forEach(function(error) {
        var list = ret[error.attribute];
        if (list) {
          list.push(error);
        } else {
          ret[error.attribute] = [error];
        }
      });
      return ret;
    },

    // In:
    // [{error: "<message 1>", ...}, {error: "<message 2>", ...}]
    // Out:
    // ["<message 1>", "<message 2>"]
    flattenErrorsToArray: function(errors) {
      return errors
        .map(function(error) { return error.error; })
        .filter(function(value, index, self) {
          return self.indexOf(value) === index;
        });
    },

    cleanAttributes: function(attributes, whitelist) {
      function whitelistCreator(obj, key, last) {
        if (v.isObject(obj[key])) {
          return obj[key];
        }
        return (obj[key] = last ? true : {});
      }

      function buildObjectWhitelist(whitelist) {
        var ow = {}
          , lastObject
          , attr;
        for (attr in whitelist) {
          if (!whitelist[attr]) {
            continue;
          }
          v.forEachKeyInKeypath(ow, attr, whitelistCreator);
        }
        return ow;
      }

      function cleanRecursive(attributes, whitelist) {
        if (!v.isObject(attributes)) {
          return attributes;
        }

        var ret = v.extend({}, attributes)
          , w
          , attribute;

        for (attribute in attributes) {
          w = whitelist[attribute];

          if (v.isObject(w)) {
            ret[attribute] = cleanRecursive(ret[attribute], w);
          } else if (!w) {
            delete ret[attribute];
          }
        }
        return ret;
      }

      if (!v.isObject(whitelist) || !v.isObject(attributes)) {
        return {};
      }

      whitelist = buildObjectWhitelist(whitelist);
      return cleanRecursive(attributes, whitelist);
    },

    exposeModule: function(validate, root, exports, module, define) {
      if (exports) {
        if (module && module.exports) {
          exports = module.exports = validate;
        }
        exports.validate = validate;
      } else {
        root.validate = validate;
        if (validate.isFunction(define) && define.amd) {
          define([], function () { return validate; });
        }
      }
    },

    warn: function(msg) {
      if (typeof console !== "undefined" && console.warn) {
        console.warn("[validate.js] " + msg);
      }
    },

    error: function(msg) {
      if (typeof console !== "undefined" && console.error) {
        console.error("[validate.js] " + msg);
      }
    }
  });

  validate.validators = {
    // Presence validates that the value isn't empty
    presence: function(value, options) {
      options = v.extend({}, this.options, options);
      if (options.allowEmpty !== false ? !v.isDefined(value) : v.isEmpty(value)) {
        return options.message || this.message || "can't be blank";
      }
    },
    length: function(value, options, attribute) {
      // Empty values are allowed
      if (!v.isDefined(value)) {
        return;
      }

      options = v.extend({}, this.options, options);

      var is = options.is
        , maximum = options.maximum
        , minimum = options.minimum
        , tokenizer = options.tokenizer || function(val) { return val; }
        , err
        , errors = [];

      value = tokenizer(value);
      var length = value.length;
      if(!v.isNumber(length)) {
        return options.message || this.notValid || "has an incorrect length";
      }

      // Is checks
      if (v.isNumber(is) && length !== is) {
        err = options.wrongLength ||
          this.wrongLength ||
          "is the wrong length (should be %{count} characters)";
        errors.push(v.format(err, {count: is}));
      }

      if (v.isNumber(minimum) && length < minimum) {
        err = options.tooShort ||
          this.tooShort ||
          "is too short (minimum is %{count} characters)";
        errors.push(v.format(err, {count: minimum}));
      }

      if (v.isNumber(maximum) && length > maximum) {
        err = options.tooLong ||
          this.tooLong ||
          "is too long (maximum is %{count} characters)";
        errors.push(v.format(err, {count: maximum}));
      }

      if (errors.length > 0) {
        return options.message || errors;
      }
    },
    numericality: function(value, options, attribute, attributes, globalOptions) {
      // Empty values are fine
      if (!v.isDefined(value)) {
        return;
      }

      options = v.extend({}, this.options, options);

      var errors = []
        , name
        , count
        , checks = {
            greaterThan:          function(v, c) { return v > c; },
            greaterThanOrEqualTo: function(v, c) { return v >= c; },
            equalTo:              function(v, c) { return v === c; },
            lessThan:             function(v, c) { return v < c; },
            lessThanOrEqualTo:    function(v, c) { return v <= c; },
            divisibleBy:          function(v, c) { return v % c === 0; }
          }
        , prettify = options.prettify ||
          (globalOptions && globalOptions.prettify) ||
          v.prettify;

      // Strict will check that it is a valid looking number
      if (v.isString(value) && options.strict) {
        var pattern = "^-?(0|[1-9]\\d*)";
        if (!options.onlyInteger) {
          pattern += "(\\.\\d+)?";
        }
        pattern += "$";

        if (!(new RegExp(pattern).test(value))) {
          return options.message ||
            options.notValid ||
            this.notValid ||
            this.message ||
            "must be a valid number";
        }
      }

      // Coerce the value to a number unless we're being strict.
      if (options.noStrings !== true && v.isString(value) && !v.isEmpty(value)) {
        value = +value;
      }

      // If it's not a number we shouldn't continue since it will compare it.
      if (!v.isNumber(value)) {
        return options.message ||
          options.notValid ||
          this.notValid ||
          this.message ||
          "is not a number";
      }

      // Same logic as above, sort of. Don't bother with comparisons if this
      // doesn't pass.
      if (options.onlyInteger && !v.isInteger(value)) {
        return options.message ||
          options.notInteger ||
          this.notInteger ||
          this.message ||
          "must be an integer";
      }

      for (name in checks) {
        count = options[name];
        if (v.isNumber(count) && !checks[name](value, count)) {
          // This picks the default message if specified
          // For example the greaterThan check uses the message from
          // this.notGreaterThan so we capitalize the name and prepend "not"
          var key = "not" + v.capitalize(name);
          var msg = options[key] ||
            this[key] ||
            this.message ||
            "must be %{type} %{count}";

          errors.push(v.format(msg, {
            count: count,
            type: prettify(name)
          }));
        }
      }

      if (options.odd && value % 2 !== 1) {
        errors.push(options.notOdd ||
            this.notOdd ||
            this.message ||
            "must be odd");
      }
      if (options.even && value % 2 !== 0) {
        errors.push(options.notEven ||
            this.notEven ||
            this.message ||
            "must be even");
      }

      if (errors.length) {
        return options.message || errors;
      }
    },
    datetime: v.extend(function(value, options) {
      if (!v.isFunction(this.parse) || !v.isFunction(this.format)) {
        throw new Error("Both the parse and format functions needs to be set to use the datetime/date validator");
      }

      // Empty values are fine
      if (!v.isDefined(value)) {
        return;
      }

      options = v.extend({}, this.options, options);

      var err
        , errors = []
        , earliest = options.earliest ? this.parse(options.earliest, options) : NaN
        , latest = options.latest ? this.parse(options.latest, options) : NaN;

      value = this.parse(value, options);

      // 86400000 is the number of milliseconds in a day, this is used to remove
      // the time from the date
      if (isNaN(value) || options.dateOnly && value % 86400000 !== 0) {
        err = options.notValid ||
          options.message ||
          this.notValid ||
          "must be a valid date";
        return v.format(err, {value: arguments[0]});
      }

      if (!isNaN(earliest) && value < earliest) {
        err = options.tooEarly ||
          options.message ||
          this.tooEarly ||
          "must be no earlier than %{date}";
        err = v.format(err, {
          value: this.format(value, options),
          date: this.format(earliest, options)
        });
        errors.push(err);
      }

      if (!isNaN(latest) && value > latest) {
        err = options.tooLate ||
          options.message ||
          this.tooLate ||
          "must be no later than %{date}";
        err = v.format(err, {
          date: this.format(latest, options),
          value: this.format(value, options)
        });
        errors.push(err);
      }

      if (errors.length) {
        return v.unique(errors);
      }
    }, {
      parse: null,
      format: null
    }),
    date: function(value, options) {
      options = v.extend({}, options, {dateOnly: true});
      return v.validators.datetime.call(v.validators.datetime, value, options);
    },
    format: function(value, options) {
      if (v.isString(options) || (options instanceof RegExp)) {
        options = {pattern: options};
      }

      options = v.extend({}, this.options, options);

      var message = options.message || this.message || "is invalid"
        , pattern = options.pattern
        , match;

      // Empty values are allowed
      if (!v.isDefined(value)) {
        return;
      }
      if (!v.isString(value)) {
        return message;
      }

      if (v.isString(pattern)) {
        pattern = new RegExp(options.pattern, options.flags);
      }
      match = pattern.exec(value);
      if (!match || match[0].length != value.length) {
        return message;
      }
    },
    inclusion: function(value, options) {
      // Empty values are fine
      if (!v.isDefined(value)) {
        return;
      }
      if (v.isArray(options)) {
        options = {within: options};
      }
      options = v.extend({}, this.options, options);
      if (v.contains(options.within, value)) {
        return;
      }
      var message = options.message ||
        this.message ||
        "^%{value} is not included in the list";
      return v.format(message, {value: value});
    },
    exclusion: function(value, options) {
      // Empty values are fine
      if (!v.isDefined(value)) {
        return;
      }
      if (v.isArray(options)) {
        options = {within: options};
      }
      options = v.extend({}, this.options, options);
      if (!v.contains(options.within, value)) {
        return;
      }
      var message = options.message || this.message || "^%{value} is restricted";
      if (v.isString(options.within[value])) {
        value = options.within[value];
      }
      return v.format(message, {value: value});
    },
    email: v.extend(function(value, options) {
      options = v.extend({}, this.options, options);
      var message = options.message || this.message || "is not a valid email";
      // Empty values are fine
      if (!v.isDefined(value)) {
        return;
      }
      if (!v.isString(value)) {
        return message;
      }
      if (!this.PATTERN.exec(value)) {
        return message;
      }
    }, {
      PATTERN: /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i
    }),
    equality: function(value, options, attribute, attributes, globalOptions) {
      if (!v.isDefined(value)) {
        return;
      }

      if (v.isString(options)) {
        options = {attribute: options};
      }
      options = v.extend({}, this.options, options);
      var message = options.message ||
        this.message ||
        "is not equal to %{attribute}";

      if (v.isEmpty(options.attribute) || !v.isString(options.attribute)) {
        throw new Error("The attribute must be a non empty string");
      }

      var otherValue = v.getDeepObjectValue(attributes, options.attribute)
        , comparator = options.comparator || function(v1, v2) {
          return v1 === v2;
        }
        , prettify = options.prettify ||
          (globalOptions && globalOptions.prettify) ||
          v.prettify;

      if (!comparator(value, otherValue, options, attribute, attributes)) {
        return v.format(message, {attribute: prettify(options.attribute)});
      }
    },
    // A URL validator that is used to validate URLs with the ability to
    // restrict schemes and some domains.
    url: function(value, options) {
      if (!v.isDefined(value)) {
        return;
      }

      options = v.extend({}, this.options, options);

      var message = options.message || this.message || "is not a valid url"
        , schemes = options.schemes || this.schemes || ['http', 'https']
        , allowLocal = options.allowLocal || this.allowLocal || false
        , allowDataUrl = options.allowDataUrl || this.allowDataUrl || false;
      if (!v.isString(value)) {
        return message;
      }

      // https://gist.github.com/dperini/729294
      var regex =
        "^" +
        // protocol identifier
        "(?:(?:" + schemes.join("|") + ")://)" +
        // user:pass authentication
        "(?:\\S+(?::\\S*)?@)?" +
        "(?:";

      var tld = "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))";

      if (allowLocal) {
        tld += "?";
      } else {
        regex +=
          // IP address exclusion
          // private & local networks
          "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
          "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
          "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})";
      }

      regex +=
          // IP address dotted notation octets
          // excludes loopback network 0.0.0.0
          // excludes reserved space >= 224.0.0.0
          // excludes network & broacast addresses
          // (first & last IP address of each class)
          "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
          "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
          "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
        "|" +
          // host name
          "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
          // domain name
          "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
          tld +
        ")" +
        // port number
        "(?::\\d{2,5})?" +
        // resource path
        "(?:[/?#]\\S*)?" +
      "$";

      if (allowDataUrl) {
        // RFC 2397
        var mediaType = "\\w+\\/[-+.\\w]+(?:;[\\w=]+)*";
        var urlchar = "[A-Za-z0-9-_.!~\\*'();\\/?:@&=+$,%]*";
        var dataurl = "data:(?:"+mediaType+")?(?:;base64)?,"+urlchar;
        regex = "(?:"+regex+")|(?:^"+dataurl+"$)";
      }

      var PATTERN = new RegExp(regex, 'i');
      if (!PATTERN.exec(value)) {
        return message;
      }
    },
    type: v.extend(function(value, originalOptions, attribute, attributes, globalOptions) {
      if (v.isString(originalOptions)) {
        originalOptions = {type: originalOptions};
      }

      if (!v.isDefined(value)) {
        return;
      }

      var options = v.extend({}, this.options, originalOptions);

      var type = options.type;
      if (!v.isDefined(type)) {
        throw new Error("No type was specified");
      }

      var check;
      if (v.isFunction(type)) {
        check = type;
      } else {
        check = this.types[type];
      }

      if (!v.isFunction(check)) {
        throw new Error("validate.validators.type.types." + type + " must be a function.");
      }

      if (!check(value, options, attribute, attributes, globalOptions)) {
        var message = originalOptions.message ||
          this.messages[type] ||
          this.message ||
          options.message ||
          (v.isFunction(type) ? "must be of the correct type" : "must be of type %{type}");

        if (v.isFunction(message)) {
          message = message(value, originalOptions, attribute, attributes, globalOptions);
        }

        return v.format(message, {attribute: v.prettify(attribute), type: type});
      }
    }, {
      types: {
        object: function(value) {
          return v.isObject(value) && !v.isArray(value);
        },
        array: v.isArray,
        integer: v.isInteger,
        number: v.isNumber,
        string: v.isString,
        date: v.isDate,
        boolean: v.isBoolean
      },
      messages: {}
    })
  };

  validate.formatters = {
    detailed: function(errors) {return errors;},
    flat: v.flattenErrorsToArray,
    grouped: function(errors) {
      var attr;

      errors = v.groupErrorsByAttribute(errors);
      for (attr in errors) {
        errors[attr] = v.flattenErrorsToArray(errors[attr]);
      }
      return errors;
    },
    constraint: function(errors) {
      var attr;
      errors = v.groupErrorsByAttribute(errors);
      for (attr in errors) {
        errors[attr] = errors[attr].map(function(result) {
          return result.validator;
        }).sort();
      }
      return errors;
    }
  };

  validate.exposeModule(validate, this, exports, module, define);
}).call(this,
        typeof exports !== 'undefined' ? /* istanbul ignore next */ exports : null,
        typeof module !== 'undefined' ? /* istanbul ignore next */ module : null,
        typeof define !== 'undefined' ? /* istanbul ignore next */ define : null);
