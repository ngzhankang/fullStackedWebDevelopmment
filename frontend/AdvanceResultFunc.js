// RESULT VIEWER - ADVANCE
const advanceResultQuery = {
  festivalId: null,
  page: 0,
  pageSize: 5,
};

var currentData2 = []

// list out all the functions so that they can do some logic changes
const advanceResultPaginationFunction = {
  gotoFirstPage: function () {
    advanceResultQuery['page'] = 0;
  },
  changePage: function (delta) {
    if (advanceResultQuery) {
      console.log(advanceResultQuery['page'], parseInt(delta), parseInt(advanceResultQuery['page'] + delta))
      if (advanceResultQuery['page'] + parseInt(delta) == -1) { // check negative int
        console.log('Going to negative page!');
      }
      else if (currentData2.length < advanceResultQuery['pageSize'] && parseInt(delta) > 0) { // find out number of data in current page
        console.log('No more next page!');
      }
      else {
        advanceResultQuery['page'] += parseInt(delta);
      }

    }
  },
  changePageSize: function (newPageSize) {
    advanceResultQuery['pageSize'] = newPageSize;
  },
};

// using localhost machine address to get and fetch from the backend
const advanceResultUrl = "http://localhost:3000/advance/result";

// to populate the table upon getting the data from the backend
function populateAdvanceResultTable(data) {
  console.log(data);
  if (data.rows.length === 0) {
    return;
  }
  else {
    const dataTableHtml = Object.entries(data.rows).map( //data.result
      ({ performanceid, starttime, endtime, popularity }) => `
            <tr>
                <td>${performanceid}</td>
                <td>${starttime}</td>
                <td>${endtime}</td>
                <td>${popularity}</td>
            </tr>
          `,
    );
    $('#advance-result-tbody').html(dataTableHtml);
  }
}

// to fire the query to the backend and wait for response for table data
function getAdvanceResultFromBackend(callback) {
$.get(advanceResultUrl, advanceResultQuery)
    .done((result) => callback(null, result))
    .fail((message) => callback(message, null));
}

// to fire the table to refresh the old datas and to call populateAdvanceResultTable function
function refreshAdvanceResultTable() {
  getAdvanceResultFromBackend(function (error, data) {
    if (error) return alert(JSON.stringify(error));
    populateAdvanceResultTable(data);
    if (data.rows.length === 0) return advanceResultQuery['page']--;
    currentData2 = data.rows;
  });
}

// to compute the results that will be displayed after filter
function compute() {
  $('#advance-result-input-form input')
  .not(':input[type=submit]')
  .each((idx, input) => {
    advanceResultQuery[$(input).attr('key')] = $(input).val();
  });
refreshAdvanceResultTable();
return false;
}

// to control the pagination after clicking
function paginateAdvanceResult(event) {
  const fn = $(this).attr('fn');
  const value = $(this).attr('value') || $(this).val(); //if the 1st value is nth, take the 2nd value
  advanceResultPaginationFunction[fn](value);
  refreshAdvanceResultTable();
  return false;
}

// getting info from the frontend and then sending it to compute function
function registerAdvanceResultInput() {
  $("#advance-result-filter-form").submit(compute);
}

// to call the event for the pagination and size method upon click
function registerAdvanceResultPaginationForm() {
  $('#advance-result-first-page').click(paginateAdvanceResult);
  $('#advance-result-previous-page').click(paginateAdvanceResult);
  $('#advance-result-next-page').click(paginateAdvanceResult);
  $('#advance-result-page-size-select').change(paginateAdvanceResult);
}

// call these functions
$(document).ready(function () {
  registerAdvanceResultInput();
  registerAdvanceResultPaginationForm();
  refreshAdvanceResultTable();
});
