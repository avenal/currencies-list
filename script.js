var apiData;
var currenciesContainer = document.getElementById("currencies");
var currencyDetails = document.getElementById("currency-detail");
var dateNow = new Date();
var weekAgo = new Date();
weekAgo.setDate(dateNow.getDate() - 7);
var url =
  "https://api.exchangeratesapi.io/history?start_at=" +
  weekAgo.getFullYear() +
  "-" +
  parseInt(weekAgo.getMonth() + 1) +
  "-" +
  weekAgo.getDate() +
  "&end_at=" +
  dateNow.getFullYear() +
  "-" +
  parseInt(dateNow.getMonth() + 1) +
  "-" +
  dateNow.getDate() +
  "&base=PLN";

function sortData(data) {
  return data.sort(function (a, b) {
    var dateA = new Date(a.date);
    var dateB = new Date(b.date);
    return dateA - dateB;
  });
}

function buildUI(data) {
  Object.keys(data).forEach(function (key) {
    var p = document.createElement("p");
    p.id = key;
    p.className = "currency-item";
    var values = sortData(data[key]);
    p.innerHTML =
      '<span class="currency-item--primary">' +
      key +
      "</span>" +
      '/<span class="currency-item--secondary">PLN</span>' +
      " : " +
      values[values.length - 1].value;
    currenciesContainer.appendChild(p);
  });

  currenciesContainer.addEventListener("click", function (e) {
    if (e.target.className === "currency-item") {
      currencyDetails.innerHTML = "";
      var title = document.createElement("h1");
      title.innerText = e.target.id + "/PLN";
      currencyDetails.appendChild(title);
      sortData(data[e.target.id]).forEach(function (element) {
        var detail = document.createElement("p");
        detail.className = "currency-item__detail";
        detail.innerHTML =
          '<span class="currency-item__detail--value">' +
          element.value +
          "</span>" +
          '<span class="currency-item__detail--date">' +
          element.date +
          "</span>";
        currencyDetails.appendChild(detail);
      });
    }
  });
}

function transformData(data) {
  return data.reduce(function (acc, val) {
    val.values.forEach(function (element) {
      if (!acc[element.currency]) {
        acc[element.currency] = [];
      }
      acc[element.currency].push({
        date: val.date,
        value: element.value,
      });
    });
    return acc;
  }, {});
}

(function getCurrencies() {
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      apiData = Object.entries(data.rates).map(function ([key, value]) {
        return {
          date: key,
          values: Object.entries(value).map(function ([k, v]) {
            return { currency: k, value: (1 / v).toFixed(6) };
          }),
        };
      });
      buildUI(transformData(apiData));
    });
})();
