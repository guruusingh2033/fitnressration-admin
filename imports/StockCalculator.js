import { addDays, formatDate, today } from './date';
import { MealStock } from './api/mealStock';
import { mealSales } from './helpers';

export class StockCalculator {
  static calculate(initial, date, mealId, api) {
    var mealStock = api.findMealStock(mealId, date) || {};//MealStock.findOne({meal:mealId, date:date}) || {};

    var sales = mealSales(mealId, date);
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

  constructor(mealId) {
    this.today = formatDate(new Date());
    this.firstDate = '2016-08-29';
    this.mealId = mealId;
    this._calcCache = {};
    this._mealStockCache = {};
    this._cache = {};
  }

  cachedValues(date) {
    return this._calcCache[date];
  }

  initCache(date) {

  }

  findMealStock(date) {
    if (!this._mealStockCache[date]) {
      this._mealStockCache[date] = MealStock.findOne({meal:this.mealId, date:date});
    }
    return this._mealStockCache[date];
  }

  forDate(date) {
    date = typeof date == 'string' ? date : formatDate(date);

    if (!this._cache[date]) {
      this._cache[date] = this._forDate(date);
    }

    return this._cache[date];
  }

  _forDate(date) {
    if (date < formatDate(today())) {
      return this.findMealStock(date);
    }
    var firstDate = formatDate(today());
    var currentDate = firstDate;
    var prevDate;
    while (currentDate <= date) {
      if (!this._calcCache[currentDate]) {
        var mealStock = this.findMealStock(currentDate) || {};
        var initial = currentDate == firstDate ? mealStock.initial : (this._calcCache[prevDate].stock || 0);
        this._calcCache[currentDate] = StockCalculator.calculate(initial, currentDate, this.mealId, {
          findMealStock: (mealId, date) => {return this.findMealStock(date)}
        });
      }
      prevDate = currentDate;
      currentDate = formatDate(addDays(currentDate, 1));
    }
    return this._calcCache[date];
  }
}
