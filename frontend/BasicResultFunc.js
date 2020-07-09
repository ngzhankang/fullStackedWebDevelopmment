// RESULT VIEWER - BASIC
const basicResultQuery = {
  festivalId: null,
};

var currentData2 = []

// using localhost machine address to get and fetch from the backend
const basicResultUrl = "http://localhost:3000/basic/result";



// to populate the table upon getting the data from the backend
function populateBasicResultTable(data) {
  const resultTableHtml = (data.result).map(
    ({ performanceid, starttime, endtime }) => `
              <tr>
                  <td>${performanceid}</td>
                  <td>${starttime}</td>
                  <td>${endtime}</td>
              </tr>
            `,
  );
  $('#basic-result-tbody').html(resultTableHtml);
}

// catch error from the backend and let the frontend handle it
function catchDaError(data) {
  if(data == undefined) {
    alert('Invalid festivalId!')
  }
  else {  
    populateBasicResultTable(data)
  }
}

// to fire the query to the backend and wait for response for table data
function getBasicResultFromBackend(callback) {
  $.get(basicResultUrl, basicResultQuery)
    .done((result) => callback(null, result))
    .fail((message) => callback(message, null));
}

// async function getBasicResultFromBackend() {
//   $.get(basicResultUrl, basicResultQuery)
//       .done(await result)
//       .fail(await message);
//   }

// to fire the table to refresh the old datas and to call populateBasicResultTable function
function refreshBasicResultTable() {
  getBasicResultFromBackend(function (error, data) {
    if (error) return alert(JSON.stringify(error));
    catchDaError(data);
    // if (data.rows.length === 0) return basicResultQuery['page']--;
    // currentData2 = data.rows;
  });
}

// to compute the results that will be displayed after filter
function compute() {
  $('#basic-result-input-form input')
    .not(':input[type=submit]')
    .each((_, input) => {
      basicResultQuery[$(input).attr('key')] = $(input).val();
    });
  refreshBasicResultTable();
  return false;
}

// getting info from the frontend and then sending it to compute function
function registerBasicResultInput() {
  $("#basic-result-input-form").submit(compute);
}

// call these functions
$(document).ready(function () {
  registerBasicResultInput();
  // refreshBasicResultTable();
});
