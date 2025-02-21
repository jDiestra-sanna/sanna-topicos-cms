import React, {Component} from 'react';
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Popover from "@material-ui/core/Popover";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import {
    format,
    subDays,
    subWeeks,
    subMonths,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    startOfYear,
    endOfYear,
    subYears,
} from 'date-fns'
import Icon from "@material-ui/core/Icon";

const now = new Date();

class Ranger extends Component {


    constructor(props) {
        super(props);

        this.state = {
            dateFrom: this.props.dateFrom,
            dateTo  : this.props.dateTo,
            anchorEl: null,
        };

        this.ranges = [
            {
                name : 'Hoy',
                value: [now, now],
            }, {
                name : 'Ayer',
                value: [subDays(now, 1), subDays(now, 1)],
            }, {
                name : 'Últimos 7 días',
                value: [subDays(now, 6), now],
            }, {
                name : "Últimos 30 días",
                value: [subDays(now, 29), now],
            }, {
                name : 'Últimos 6 meses',
                value: [subMonths(now, 5), now],
            }, {
                name : 'Esta semana',
                value: [startOfWeek(now), endOfWeek(now)],
            }, {
                name : 'Semana pasada',
                value: [startOfWeek(subWeeks(now, 1)), endOfWeek(subWeeks(now, 1))]
            }, {
                name : 'Este mes',
                value: [startOfMonth(now), endOfMonth(now)],
            }, {
                name : 'Mes pasado',
                value: [startOfMonth(subMonths(now, 1)), endOfMonth(subMonths(now, 1))]
            }, {
                name : 'Este año',
                value: [startOfYear(now), endOfYear(now)],
            }, {
                name : 'Año pasado',
                value: [startOfYear(subYears(now, 1)), endOfYear(subYears(now, 1))],
            },
        ];
    }

    handleOpen = e => {
        this.setState({anchorEl: e.currentTarget});
    };

    handleClose = () => {
        this.setState({anchorEl: null});
    };

    isValid() {
        return this.state.dateFrom && this.state.dateTo;
    }

    getLabel() {
        if (this.isValid()) {
            const fmt = 'dd/MM/yyyy';
            const fmt_date_from = format(this.state.dateFrom, fmt);
            const fmt_date_to = format(this.state.dateTo, fmt);
            const result = this.ranges.filter(range =>
                format(range.value[0], fmt) === fmt_date_from
                && format(range.value[1], fmt) === fmt_date_to);
            if (result.length > 0) {
                return result[0].name;
            } else if (fmt_date_from === fmt_date_to) {
                return fmt_date_from;
            } else {
                return fmt_date_from + ' - ' + fmt_date_to;
            }
        } else {
            return this.props.label || 'Fecha';
        }
    }

    onChange = () => {
        const {dateFrom, dateTo} = this.state;
        if (!this.equal(this.props.dateFrom, dateFrom) || !this.equal(this.props.dateTo, dateTo)) {
            this.props.onChange(dateFrom, dateTo);
        }
    };

    equal(left, right) {
        const fmt = 'dd/MM/yyyy';
        const fmt_left = left ? format(left, fmt) : '';
        const fmt_right = right ? format(right, fmt) : '';
        return fmt_left === fmt_right;
    }

    render() {
        return (
            <div>
                <Button
                    variant={this.props.variant}
                    onClick={this.handleOpen}
                    fullWidth={this.props.fullWidth}
                    startIcon={this.props.startIcon}
                    endIcon={this.props.endIcon}
                    color={this.props.color}
                    className={this.props.buttonClassName}
                    >
                    {this.getLabel()}
                </Button>
                <Popover
                    open={Boolean(this.state.anchorEl)}
                    anchorEl={this.state.anchorEl}
                    onClose={this.handleClose}
                    anchorOrigin={{
                        vertical  : 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical  : 'top',
                        horizontal: 'center',
                    }}>
                    <List>
                        {this.isValid() && (
                            <>
                                <ListItem dense button onClick={() => {
                                    this.setState({
                                        dateFrom: null,
                                        dateTo  : null,
                                    }, this.onChange);
                                    this.handleClose();
                                }}>
                                    <ListItemText primary="Ninguno"/>
                                </ListItem>
                                <Divider/>
                            </>
                        )}
                        {this.ranges.map((item, index) => {
                            return (
                                <ListItem key={index} dense button onClick={() => {
                                    this.setState({
                                        dateFrom: item.value[0],
                                        dateTo  : item.value[1],
                                    }, this.onChange);
                                    this.handleClose();
                                }}>
                                    <ListItemText primary={item.name}/>
                                </ListItem>
                            );
                        })}
                        <Divider/>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <ListItem dense>
                                <ListItemIcon>
                                    <React.Fragment>Desde</React.Fragment>
                                </ListItemIcon>
                                <KeyboardDatePicker
                                    disableToolbar
                                    variant="inline"
                                    format="dd/MM/yyyy"
                                    margin="none"
                                    value={this.state.dateFrom}
                                    onChange={val => {
                                        this.setState({dateFrom: val}, this.onChange);
                                    }}
                                    autoOk
                                    maxDate={this.state.dateTo}
                                    InputProps={{
                                        disableUnderline: true,
                                        style           : {width: 144},
                                    }}/>
                            </ListItem>
                            <Divider/>
                            <ListItem dense>
                                <ListItemIcon>
                                    <React.Fragment>Hasta</React.Fragment>
                                </ListItemIcon>
                                <KeyboardDatePicker
                                    disableToolbar
                                    variant="inline"
                                    format="dd/MM/yyyy"
                                    margin="none"
                                    value={this.state.dateTo}
                                    onChange={val => {
                                        this.setState({dateTo: val}, this.onChange);
                                    }}
                                    autoOk
                                    minDate={this.state.dateFrom}
                                    InputProps={{
                                        disableUnderline: true,
                                        style           : {width: 144},
                                    }}/>
                            </ListItem>
                        </MuiPickersUtilsProvider>
                    </List>
                </Popover>
            </div>
        );
    }
}

Ranger.propTypes = {
    dateFrom : PropTypes.instanceOf(Date),
    dateTo   : PropTypes.instanceOf(Date),
    onChange : PropTypes.func.isRequired,
    label    : PropTypes.string,
    fullWidth: PropTypes.bool,
    startIcon: PropTypes.node,
    endIcon: PropTypes.node,
    color: PropTypes.string,
    buttonClassName: PropTypes.string,
    variant: PropTypes.string,
};

Ranger.defaultProps = {
    startIcon: <Icon className="mr-4">date_range</Icon>,
    variant  : 'contained',
}

export default Ranger;