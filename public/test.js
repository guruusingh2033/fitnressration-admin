importScripts('/lodash.core.min.js');

function formatDate(date) {
  if (date) {
    return date.getFullYear() + '-' + _.padStart(date.getMonth() + 1, 2, '0') + '-' + _.padStart(date.getDate(), 2, '0');    
  }
}

function addDays(date, days) {
  date = convertToDate(date);
  return createDay(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function convertToDate(date) {
  if (typeof date == 'string') {
    return new Date(Date.parse(date + ' 00:00'));
  }
  else {
    return date;
  }
}

function createDay(year, month, day) {
  return new Date(year, month, day, 0, 0, 0);
}


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StockCalculator = function () {
  _createClass(StockCalculator, null, [{
    key: 'calculate',
    value: function calculate(initial, date, mealId, api) {
      var mealStock = /*MealStock.findOne({meal:mealId, date:date})*/api.findMealStock({ meal: mealId, date: date }) || {};

      var sales = api.mealSales(mealId, date);
      var output = sales + (mealStock.nonSales || 0);
      var stock = initial + (mealStock.adjustment || 0) - output + (mealStock.restock || 0);

      return {
        initial: initial,
        adjustment: mealStock.adjustment,
        sales: sales,
        nonSales: mealStock.nonSales || 0,
        output: output,
        restock: mealStock.restock || 0,
        stock: stock
      };
    }
  }]);

  function StockCalculator(mealId, api) {
    _classCallCheck(this, StockCalculator);

    this.today = formatDate(new Date());
    this.firstDate = '2016-08-29';
    this.mealId = mealId;

    this._cache = {};
    this.api = api;
  }

  _createClass(StockCalculator, [{
    key: 'forDate',
    value: function forDate(date) {
      date = formatDate(date);
      if (date < this.firstDate) date = this.firstDate;
      var currentDate = this.firstDate;

      var yesterday;
      while (currentDate <= date) {
        if (!this._cache[currentDate]) {
          var mealStock = this.api.findMealStock({ meal: this.mealId, date: currentDate }); //MealStock.findOne({meal:this.mealId, date:currentDate}) || {};
          var initial = currentDate == this.firstDate ? mealStock.stock : this._cache[yesterday].stock || 0;
          this._cache[currentDate] = StockCalculator.calculate(initial, currentDate, this.mealId, this.api);

          // var sales = mealSales(this.mealId, currentDate);
          // var output = sales + (mealStock.nonSales || 0);
          // var stock = initial + (mealStock.adjustment || 0) - output + (mealStock.restock || 0);

          // this._cache[currentDate] = {
          //   initial: initial,
          //   // stockDisplay: initial + (mealStock.adjustment ? ` (${mealStock.adjustment})` : ''),
          //   adjustment: mealStock.adjustment,
          //   sales: sales,
          //   nonSales: mealStock.nonSales || 0,
          //   output: output,
          //   restock: mealStock.restock || 0,
          //   stock: stock
          // };
        }

        yesterday = currentDate;
        currentDate = formatDate(addDays(currentDate, 1));
      }

      return this._cache[date];
    }
  }]);

  return StockCalculator;
}();


onmessage = function(e) {
	var orders = e.data.orders;
	var meals = e.data.meals;
	var date = e.data.date;
	for ()
	postMessage(e.data);
}