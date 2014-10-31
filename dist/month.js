/** @jsx React.DOM */
"use strict";

var calendar = require('calendar');
var React = require('react/addons');
var moment = require('moment');
var cx = React.addons.classSet;
var _ = require('underscore');

// And get the language object
var lang = moment().localeData();

var WEEKDAYS = _.zip(lang._weekdays, lang._weekdaysShort);
var MONTHS = lang._months;


var Month = React.createClass({displayName: 'Month',
  renderDay: function(date, i) {
    var DateComponent = this.props.dateComponent;

    return React.createElement(DateComponent, React.__spread({},  this.props, {date: date, key: i}));
  },

  renderWeek: function(dates, i) {
    var days = _.map(dates, this.renderDay);
    return (
      React.createElement("tr", {key: i}, days)
    );
  },

  renderDayHeaders: function() {
    var indices = _.range(this.props.firstOfWeek ,7).concat(_.range(0, this.props.firstOfWeek));

    var headers = _.map(indices, function(index) {
        var weekday = WEEKDAYS[index];
        return (
          React.createElement("th", {key: weekday, scope: "col"}, React.createElement("abbr", {title: weekday[0]}, weekday[1]))
        );
    });

    return (
      React.createElement("tr", null, headers)
    );
  },

  handleYearChange: function(event) {
    this.props.onYearChange(parseInt(event.target.value, 10));
  },

  renderYearChoice: function(year, i) {
    if (this.props.minDate && year < this.props.minDate.getFullYear()) {
      return;
    }

    if (this.props.maxDate && year > this.props.maxDate.getFullYear()) {
      return;
    }

    return (
      React.createElement("option", {key: year, value: year}, year)
    );
  },

  renderHeaderYear: function() {
    var monthMoment = moment(this.props.firstOfMonth);
    var y = this.props.firstOfMonth.getFullYear();
    var years = _.range(y - 5, y).concat(_.range(y, y + 10));
    var choices = _.map(years, this.renderYearChoice);

    return (
      React.createElement("span", {className: "react-calendar-label"}, 
        monthMoment.format('YYYY'), 
        this.props.disableNavigation ? null : React.createElement("select", {value: y, onChange: this.handleYearChange}, choices)
      )
    );
  },

  handleMonthChange: function(event) {
    this.props.onMonthChange(parseInt(event.target.value, 10));
  },

  renderMonthChoice: function(month , i) {
    var disabled = false;
    var year = this.props.firstOfMonth.getFullYear();

    if (this.props.minDate && new Date(year, i + 1, 1).getTime() < this.props.minDate.getTime()) {
      disabled = true;
    }

    if (this.props.maxDate && new Date(year, i, 1).getTime() > this.props.maxDate.getTime()) {
      disabled = true;
    }

    return (
      React.createElement("option", {key: month, value: i, disabled: disabled ? 'disabled' : null}, month)
    );
  },

  renderHeaderMonth: function() {
    var monthMoment = moment(this.props.firstOfMonth);

    var choices = _.map(MONTHS, this.renderMonthChoice);

    return (
      React.createElement("span", {className: "react-calendar-label"}, 
        monthMoment.format('MMMM'), 
        this.props.disableNavigation ? null : React.createElement("select", {value: this.props.month, onChange: this.handleMonthChange}, choices)
      )
    );
  },

  renderHeader: function() {
    return (
      React.createElement("div", {className: "react-calendar-header"}, 
        this.renderHeaderMonth(), " ", this.renderHeaderYear()
      )
    );
  },

  render: function() {
    var cal = new calendar.Calendar(this.props.firstOfWeek);
    var monthDates = cal.monthDates(this.props.firstOfMonth.getFullYear(), this.props.firstOfMonth.getMonth());
    var weeks =_.map(monthDates, this.renderWeek);

    return (
      React.createElement("div", {className: "react-calendar-month"}, 
        this.renderHeader(), 
        React.createElement("table", {className: "react-calendar-dates"}, 
          React.createElement("thead", null, 
            this.renderDayHeaders()
          ), 
          React.createElement("tbody", null, 
            weeks
          )
        )
      )
    );
  }
});

module.exports = Month;