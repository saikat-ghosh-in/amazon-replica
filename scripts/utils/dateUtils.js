
export const DateUtils = {
  formatDateWeekday(time) {
    return new Date(time).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  },

  formatDateMonth(time) {
    return new Date(time).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    });
  },

  calculateDeliveryDate(startDate, daysRemaining) {
    const date = new Date(startDate);

    while (daysRemaining > 0) {
      date.setDate(date.getDate() + 1);

      // deliver during the weekdays.
      if (date.getDay() === 6 || date.getDay() === 0) continue;

      --daysRemaining;
    }

    return date;
  }
};
