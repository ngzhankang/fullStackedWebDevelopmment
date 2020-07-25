// RESULT VIEWER - BASIC
const basicResultQuery = {
  festivalId: null,
};

var currentData2 = []

// using localhost machine address to get and fetch from the backend
const basicResultUrl = "https://fsp-jibaboom-skrtttt.herokuapp.com/basic/result";
// const basicResultUrl = "https://localhost:3000/basic/result";

// to populate the table upon getting the data from the backend
function populateBasicResultTable(data) {
  console.log(data)
  const resultTableHtml = (data).map(
    ({ performanceId, startTime, endTime }) => `
              <tr>
                  <td>${performanceId}</td>
                  <td>${startTime}</td>
                  <td>${endTime}</td>
              </tr>
            `,
  );
  $('#basic-result-tbody').html(resultTableHtml);
}

// catch error from the backend and let the frontend handle it
function catchDaErrorBasic(data) {
  if(data.error) {
    alert(data.error)
  }
  else {  
    populateBasicResultTable(data.result)
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
    catchDaErrorBasic(data);
    // if (data.rows.length === 0) return basicResultQuery['page']--;
    // currentData2 = data.rows;
  });
}

// to compute the results that will be displayed after filter
function computeBasic() {
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
  $("#basic-result-input-form").submit(computeBasic);
}

// call these functions
$(document).ready(function () {
  $("#basicSwitch").click(function () {
    var functionLabel = document.getElementById("functionLabel");

    if ($("#functionLabel").text() == "Basic") {
        functionLabel.innerHTML = "Advance";
    } else {
        functionLabel.innerHTML = "Basic";
    }
});
  registerBasicResultInput();
  // refreshBasicResultTable();
});
