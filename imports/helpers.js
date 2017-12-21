_ = lodash;

import { Orders } from './api/orders';

export function formatDate(date) {
	if (date) {
		return date.getFullYear() + '-' + _.padStart(date.getMonth() + 1, 2, '0') + '-' + _.padStart(date.getDate(), 2, '0');
	}
}

export function amPm(time, appendSuffix=true) {
  var date = new Date(Date.parse('Jan 1 ' + time));
  var hours = date.getHours();
  var suffix = hours >= 12 ? "pm":"am";
  hours = ((hours + 11) % 12 + 1); 

  return hours + (appendSuffix ? '' + suffix : '');
}

export function timeDisplay(time) {
	if (time) {
	  return amPm(time.start, false) + '-' + amPm(time.end);		
	}
}

export function mealSales(mealId, date) {
  var orders = Orders.find({'deliveryOptions.date':date, state:'completed', bundles:{$elemMatch:{mealSelections:{$elemMatch:{'meal._id':mealId}}}}}).fetch();
  var sales = 0;
  for (var order of orders) {
  	for (var bundle of order.bundles) {
  		for (var mealSelection of bundle.mealSelections) {
  			if (mealSelection.meal._id._str == mealId._str) {
  				sales += mealSelection.quantity;
  				break;
  			}
  		}
  	}
  }
  return sales;
}


export function monthName(month) {
  switch (month + 1) {
    case 1: return 'January';
    case 2: return 'February';
    case 3: return 'March';
    case 4: return 'April';
    case 5: return 'May';
    case 6: return 'June';
    case 7: return 'July';
    case 8: return 'August';
    case 9: return 'September';
    case 10: return 'October';
    case 11: return 'November';
    case 12: return 'December';
  }
}
