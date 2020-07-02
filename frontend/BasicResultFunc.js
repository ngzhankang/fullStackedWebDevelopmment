// RESULT VIEWER
const basicResultQuery = {
    festivalId: null,
    page: 0,
    pageSize: 5,
  };
  
  var currentData2 = []
  
  // list out all the functions so that they can do some logic changes
  const basicResultPaginationFunction = {
    gotoFirstPage: function () {
      basicResultQuery['page'] = 0;
    },
    changePage: function (delta) {
      if (basicResultQuery) {
        console.log(basicResultQuery['page'], parseInt(delta), parseInt(basicResultQuery['page'] + delta))
        if (basicResultQuery['page'] + parseInt(delta) == -1) { // check negative int
          console.log('Going to negative page!');
        }
        else if (currentData2.length < basicResultQuery['pageSize'] && parseInt(delta) > 0) { // find out number of data in current page
          console.log('No more next page!');
        }
        else {
          basicResultQuery['page'] += parseInt(delta);
        }
  
      }
    },
    changePageSize: function (newPageSize) {
      basicResultQuery['pageSize'] = newPageSize;
    },
  };
  
  // using localhost machine address to get and fetch from the backend
  const basicResultUrl = "http://localhost:3000/basic/result";
  
  // to populate the table upon getting the data from the backend
  function populateBasicResultTable(data) {
    console.log(data);
    if (data.rows.length === 0) {
      return;
    }
    else {
      const dataTableHtml = Object.entries(data.rows).map( //data.result
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
      $('#basic-result-tbody').html(dataTableHtml);
    }
  }
  
  // to fire the query to the backend and wait for response for table data
  function getBasicResultFromBackend(callback) {
  $.get(basicResultUrl, basicResultQuery)
      .done((result) => callback(null, result))
      .fail((message) => callback(message, null));
  }
  
  // to fire the table to refresh the old datas and to call populateBasicResultTable function
  function refreshBasicResultTable() {
    getBasicResultFromBackend(function (error, data) {
      if (error) return alert(JSON.stringify(error));
      populateBasicResultTable(data);
      if (data.rows.length === 0) return basicDataQuery['page']--;
      currentData = data.rows;
    });
  }
  
  // to compute the results that will be displayed after filter
  function compute() {
    $('#basic-result-input-form input')
    .not(':input[type=submit]')
    .each((idx, input) => {
      basicResultQuery[$(input).attr('key')] = $(input).val();
    });
  refreshBasicResultTable();
  return false;
  }
  
  // to control the pagination after clicking
  function paginateBasicResult(event) {
    const fn = $(this).attr('fn');
    const value = $(this).attr('value') || $(this).val(); //if the 1st value is nth, take the 2nd value
    basicResultPaginationFunction[fn](value);
    refreshBasicResultTable();
    return false;
  }
  
  // getting info from the frontend and then sending it to compute function
  function registerBasicResultInput() {
    $("#basic-result-filter-form").submit(compute);
  }
  
  // to call the event for the pagination and size method upon click
  function registerBasicResultPaginationForm() {
    $('#basic-result-first-page').click(paginateBasicResult);
    $('#basic-result-previous-page').click(paginateBasicResult);
    $('#basic-result-next-page').click(paginateBasicResult);
    $('#basic-result-page-size-select').change(paginateBasicResult);
  }
  
// call these functions
$(document).ready(function () {
    registerBasicResultInput();
    registerBasicResultPaginationForm();
    refreshBasicResultTable();
  });
  