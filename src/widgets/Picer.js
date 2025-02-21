import React from 'react';
import PropTypes from "prop-types";
import Badge from "@material-ui/core/Badge/Badge";
import Fab from "@material-ui/core/Fab";
import Avatar from "@material-ui/core/Avatar";
import Pic from "../inc/Pic";
import Icon from "@material-ui/core/Icon";

class Picer extends React.Component {

    state = {
        preview: null,
    };

    render() {
        return (
            <Badge
                overlap="circle"
                badgeContent={(
                    <Fab size="small" color="secondary" className="overflow-hidden">
                        <Icon>edit</Icon>
                        <input
                            type="file"
                            name="pic"
                            style={{position: 'absolute', opacity: 0, cursor: 'pointer'}}
                            accept="image/*"
                            onChange={e => {
                                const file = e.target.files[0];
                                this.props.onChange(e);
                                if (file) {
                                    let reader = new FileReader();
                                    reader.readAsDataURL(file);
                                    reader.onloadend = () => {
                                        this.setState({
                                            preview: reader.result
                                        });
                                    };
                                }
                            }}/>
                    </Fab>
                )}>
                <Avatar
                    className="w-96 h-96"
                    style={{border: '4px solid #FFF', backgroundColor: '#DDD'}}
                    src={this.state.preview
                        ? this.state.preview
                        : Pic.url(this.props.pic, typeof this.props.small === 'undefined' ? true : this.props.small)}>
                    <Icon fontSize="large">image</Icon>
                </Avatar>
            </Badge>
        );
    }
}

Picer.propTypes = {
    pic     : PropTypes.string,
    small   : PropTypes.bool,
    onChange: PropTypes.func,
};

export default Picer;