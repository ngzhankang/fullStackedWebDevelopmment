// ADVANCE DATA VIEWER
const advanceDataQuery = {
    festivalId: null,
    startTime: null,
    endTime: null,
    page: 0,
    pageSize: 5,
};

var currentData = []

// pagination function
const advanceDataPaginationFunction = {
    gotoFirstPage: function () {
        advanceDataQuery['page'] = 0;
    },
    changePage: function (delta) {
        if (advanceDataQuery) {
            console.log(advanceDataQuery['page'], parseInt(delta), parseInt(advanceDataQuery['page'] + delta))
            if (advanceDataQuery['page'] + parseInt(delta) == -1) { // check negative int
                console.log('Going to negative page!');
            }
            else if (currentData.length < advanceDataQuery['pageSize'] && parseInt(delta) > 0) { // find out number of data in current page
                console.log('No more next page!');
            }
            else {
                advanceDataQuery['page'] += parseInt(delta);
            }

        }
    },
    changePageSize: function (newPageSize) {
        advanceDataQuery['pageSize'] = newPageSize;
    },
};

// using localhost machine address to get and fetch from the backend
const advanceDataUrl = "http://localhost:3000/advance/data";

// to populate the table upon getting the data from the backend
function populateAdvanceDataTable(data) {
    console.log(data);
    if (data.rows.length === 0) {
      return;
    }
    else {
      const dataTableHtml = data.rows.map(
        ({ festivalid, performanceid, starttime, endtime, popularity }) => `
              <tr>
                  <td>${festivalid}</td>
                  <td>${performanceid}</td>
                  <td>${starttime}</td>
                  <td>${endtime}</td>
                  <td>${popularity}</td>
              </tr>
            `,
      );
      $('#advance-data-tbody').html(dataTableHtml);
    }
  }

// to fire the query to the backend and wait for response for table data
function getAdvanceDataFromBackend(callback) {
    $.get(advanceDataUrl, advanceDataQuery)
      .done((result) => callback(null, result))
      .fail((message) => callback(message, null));
  }

// to fire the table to refresh the old datas and to call populateAdvanceDataTable function
function refreshAdvanceDataTable() {
    getAdvanceDataFromBackend(function (error, data) {
      if (error) return alert(JSON.stringify(error));
      populateAdvanceDataTable(data);
      if (data.rows.length === 0) return advanceDataQuery['page']--;
      currentData = data.rows;
    });
  }

// to capture the input from html.
function filterAdvanceData(event) {
    $('#advance-data-filter-form input')
      .not(':input[type=submit]')
      .each((idx, input) => {
        advanceDataQuery[$(input).attr('key')] = $(input).val();
      });
    refreshAdvanceDataTable();
    return false;
  }

// to control the pagination after clicking
function paginateAdvanceData(event) {
    const fn = $(this).attr('fn');
    const value = $(this).attr('value') || $(this).val(); //if the 1st value is nth, take the 2nd value
    advanceDataPaginationFunction[fn](value);
    refreshAdvanceDataTable();
    return false;
  }

// getting info from the frontend and then sending to filterAdvanceData function
function registerAdvanceDataFilterForm() {
    $("#advance-data-filter-form").submit(filterAdvanceData);
  }

// to call the event for the pagination and size method upon click
function registerAdvanceDataPaginationForm() {
    $('#advance-data-first-page').click(paginateAdvanceData);
    $('#advance-data-previous-page').click(paginateAdvanceData);
    $('#advance-data-next-page').click(paginateAdvanceData);
    $('#advance-data-page-size-select').change(paginateAdvanceData);
  }

// call these functions
$(document).ready(function () {
    registerAdvanceDataFilterForm();
    registerAdvanceDataPaginationForm();
    refreshAdvanceDataTable();
  });