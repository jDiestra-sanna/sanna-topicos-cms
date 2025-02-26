import { Drawer, Typography } from '@material-ui/core';
import { humanDatetime, stg } from '../../../../inc/Utils';
import { makeStyles } from '@material-ui/styles';
import { NotificationState } from 'models/notification';
import { useSelector, useDispatch } from 'react-redux';
import * as Actions from './store/actions/index';
import * as AppActions from '../../../../app/store/actions';
import * as quickPanelActions from './store/actions';
import Alert from '../../../../inc/Alert';
import Api from '../../../../inc/Apiv2';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import React, { Fragment, useEffect, useState } from 'react';
import reducer from './store/reducers';
import Toast from '../../../../inc/Toast';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import useAuthUser from 'hooks/auth-user';
import withReducer from 'app/store/withReducer';

const useStyles = makeStyles(() => ({
  root: {
    width: 360,
  },
}));

function QuickPanel(props) {
  const [notifications, setNotifications] = useState([]);
  const audio = new Audio('/assets/sound/notification.mp3');
  const authUser = useAuthUser();
  const classes = useStyles();
  const dispatch = useDispatch();
  const state = useSelector(({ quickPanel }) => quickPanel.state);

  useEffect(() => {
    if (state) {
      (async () => {
        loadData();
        setTimeout(() => {
          maskAsRead(notifications.map(n => n.id));
        }, 1000);
      })();
    }
  }, [state]);

  useEffect(() => {
    loadData();
    const intervalID = setInterval(() => loadData(), stg.interval * 1000);

    return () => {
      clearInterval(intervalID);
    };
  }, []);

  const loadData = async () => {
    // const response = await Api.get('/notifications', { user_id: authUser.data?.id, limit: 1000 }, false);
    const response = await Api.get('/notifications', { limit: 1000 }, false);
    if (!response.ok) return Alert.error(response.message);

    let hasNew = false;

    response.data.forEach(notification => {
      if (notification.state === NotificationState.ENABLED) {
        hasNew = true;

        dispatch(
          AppActions.showMessage({
            message: notification.body,
            variant: 'success',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right',
            },
            autoHideDuration: 30000,
          }),
        );
      }
    });

    if (hasNew) audio.play();

    setNotifications(response.data);
    dispatch(quickPanelActions.setQquickPanelBadge(response.data.length));
  };

  const maskAsRead = async ids => {
    if (!Array.isArray(ids) || ids.length === 0) return;

    const response = await Api.patch('/notifications/read', { ids }, false);
    if (!response.ok) return Alert.error(response.message);
  };

  const removeNotification = async id => {
    const response = await Api.delete(`/notifications/${id}`, {}, 'Eliminando...');
    if (!response.ok) return Alert.error(response.message);

    Toast.success('Eliminado correctamente');
    loadData();
  };

  return (
    <Drawer
      classes={{ paper: classes.root }}
      open={state}
      anchor="right"
      onClose={() => dispatch(Actions.toggleQuickPanel())}
    >
      <AppBar
        position="static"
        color="default"
      >
        <Toolbar
          variant="dense"
          className="pr-4"
        >
          <Typography
            variant="h6"
            color="inherit"
            style={{ flexGrow: 1 }}
          >
            Notificaciones
          </Typography>
          <IconButton onClick={() => dispatch(Actions.toggleQuickPanel())}>
            <Icon>close</Icon>
          </IconButton>
        </Toolbar>
      </AppBar>

      {notifications == null ? (
        <div>Cargando...</div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-1 items-center justify-center h-full">
          <div className="max-w-512 text-center">
            <FuseAnimate
              animation="transition.expandIn"
              delay={100}
            >
              <Typography
                variant="h2"
                color="inherit"
                className="font-medium mb-16"
              >
                <Icon fontSize="inherit">notifications_active</Icon>
              </Typography>
            </FuseAnimate>

            <FuseAnimate delay={300}>
              <Typography
                variant="h6"
                color="textSecondary"
                className="mb-16"
              >
                No tienes ninguna alerta.
              </Typography>
            </FuseAnimate>

            <FuseAnimate delay={600}>
              <Typography
                color="textSecondary"
                className="mb-16 mx-48"
              >
                Aquí aparecerán las notificaciones que tenemos para ti.
              </Typography>
            </FuseAnimate>
          </div>
        </div>
      ) : (
        <FuseScrollbars>
          <List>
            {notifications.map((notification, i) => (
              <Fragment key={i}>
                {i > 0 && <Divider />}
                <ListItem
                  button
                  dense
                  style={
                    notification.state == '1' || notification.state == '2'
                      ? { background: 'rgba(255,106,0,.1)' }
                      : undefined
                  }
                  onClick={() => {}}
                >
                  <ListItemAvatar>
                    <Avatar style={{ background: 'rgba(0,0,0,.3)' }}>
                      <Icon>notifications</Icon>
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <div>
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-12 text-gray-600">{notification.body}</div>
                      </div>
                    }
                    secondary={<span className="text-12">{humanDatetime(notification.date_created)}</span>}
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Eliminar">
                      <IconButton
                        edge="end"
                        onClick={() => removeNotification(notification.id)}
                      >
                        <Icon>delete</Icon>
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              </Fragment>
            ))}
          </List>
        </FuseScrollbars>
      )}
    </Drawer>
  );
}

export default withReducer('quickPanel', reducer)(QuickPanel);
