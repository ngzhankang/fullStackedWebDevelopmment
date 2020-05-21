const basicDataQuery = {
  festivalId: null,
  startTime: null,
  page: 0,
  pageSize: 5,
};

// list out all the functions so that they can do some logic changes
const basicDataPaginationFunction = {
  gotoFirstPage: function () {
    basicDataQuery["page"] = 0;
  },
  changePage: function (delta) {
    basicDataQuery["page"] += parseInt(delta);
  },
  changePageSize: function (newPageSize) {
    basicDataQuery["pageSize"] = newPageSize;
  },
};

// using localhost machine address to fetch data.
const basicDataUrl = "http://localhost:8080/basic/data";

// to populate the table upon getting the data from the backend
function populateBasicDataTable(data) {
  console.log(data);
  const dataTableHtml = data.map(
    ({festivalId, performanceid, startTime, endTime}) => `
            <tr>
                <td>${festivalId}</td>
                <td>${performanceid}</td>
                <td>${startTime}</td>
                <td>${endTime}</td>
            </tr>
          `,
  );
  $('#basic-data-tbody').html(dataTableHtml);
}

// to fire the query to the backend and wait for response for table data
function getBasicDataFromBackend(callback) {
  $.get(basicDataUrl, basicDataQuery)
    .done((result) => callback(null, result))
    .fail((message) => callback(message, null));
}

// to fire the table to refresh the old datas and to call populateBasicDataTabe function
function refreshBasicDataTable() {
  getBasicDataFromBackend(function (error, data) {
    if (error) {
      return alert(error);
    }
    populateBasicDataTable(data);
  });
}

// to capture the input from html.
function filterBasicData(event) {
  $("#basic-data-filter-form input")
    .not(":input[type=submit]")
    .each((idx, input) => {
      basicDataQuery[$(input).attr("key")] = $(input).val();
    });
  refreshBasicDataTable();
  return false;
}

// to control the pagination after clicking
function paginateBasicData(event) {
  const fn = $(this).attr("fn");
  const value = $(this).attr("value") || $(this).val("value"); //if the 1st value is nth, take the 2nd value
  basicDataPaginationFunction[fn](value);
  refreshBasicDataTable();
}

function registerBasicDataFilterForm() {
  $("#basic-data-filter-form").submit(filterBasicData);
}

// to call the event for the pagination and size method upon click
function regiserBasicDataPaginationForm() {
  $("#basic-data-first-page").click(paginateBasicData);
  $("#basic-data-previous-page").click(paginateBasicData);
  $("#basic-data-next-page").click(paginateBasicData);
  $("#basic-data-page-size-select").change(paginateBasicData);
}

$(document).ready(function () {
  registerBasicDataFilterForm();
  regiserBasicDataPaginationForm();
});
