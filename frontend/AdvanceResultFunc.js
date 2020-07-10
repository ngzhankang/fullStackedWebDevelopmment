// RESULT VIEWER - ADVANCE
const advanceResultQuery = {
  festivalId: null,
};

var currentData2 = []

// using localhost machine address to get and fetch from the backend
const advanceResultUrl = "http://localhost:3000/advance/result";

// to populate the table upon getting the data from the backend
function populateAdvanceResultTable(data, totalPopularity) {
  console.log(data);
  console.log(totalPopularity)
    const resultTableHtml = (data).map(
      ({ performanceid, starttime, endtime, popularity }) => `
            <tr>
                <td>${performanceid}</td>
                <td>${starttime}</td>
                <td>${endtime}</td>
                <td>${popularity}</td>
            </tr>
          `,
    );
    $('#advance-result-tbody').html(resultTableHtml);
  }

  // to populate the table upon getting the data from the backend
function populateTotalPopularity(data, totalPopularity) {
    console.log(data);
    console.log(totalPopularity)
      const resultsTableHtml = (data).map(
        ({ totalPopularity }) => `
              hi
              ${"Total Popularity: " + totalPopularity}
            `,
      );
      $('#totalPopularity-result-tbody').html(resultsTableHtml);
    }


// catch error from the backend and let the frontend handle it
function catchDaErrorAdvance(data) {
    if(data.error) {
      alert(data.error)
    }
    else {  
      populateAdvanceResultTable(data.result)
      populateTotalPopularity(totalPopularity)
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
    catchDaErrorAdvance(data)
    // if (data.rows.length === 0) return advanceResultQuery['page']--;
    // currentData2 = data.rows;
  });
}

// to compute the results that will be displayed after filter
function computeAdvance() {
  $('#advance-result-input-form input')
  .not(':input[type=submit]')
  .each((_, input) => {
    advanceResultQuery[$(input).attr('key')] = $(input).val();
  });
refreshAdvanceResultTable();
return false;
}

// getting info from the frontend and then sending it to compute function
function registerAdvanceResultInput() {
  $("#advance-result-input-form").submit(computeAdvance);
}

// call these functions
$(document).ready(function () {
  registerAdvanceResultInput();
//   refreshAdvanceResultTable();
});

