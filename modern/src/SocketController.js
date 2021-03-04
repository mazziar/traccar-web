import { useDispatch, useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { positionsActions, devicesActions, sessionActions ,generalActions} from './store';
import { useHistory } from 'react-router-dom';
import { useEffectAsync } from './reactHelper';
import backend from '../config.json';
const displayNotifications = events => {
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      for (const event of events) {
        const notification = new Notification(`Event: ${event.type}`);
        setTimeout(notification.close.bind(notification), 4 * 1000);
      }
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission(permission => {
        if (permission === "granted") {
          displayNotifications(events);
        }
      });
    }
  }
};

const SocketController = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const authenticated = useSelector(state => !!state.session.user);

  const connectSocket = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    
   // const socket = new WebSocket(protocol + '//'  + backend.backend.replace('http://','')+'/api/socket');
    const socket = new WebSocket(protocol + '//'  + window.location.host + '/api/socket');

    socket.onclose = () => {
      dispatch(generalActions.closeWs());
      setTimeout(() => connectSocket(), 30 * 1000);
    };

    socket.onopen = () => {
      dispatch(generalActions.openWs());
      
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.devices) {
        dispatch(devicesActions.update(data.devices));
         
      }
      if (data.positions) {
        dispatch(positionsActions.update(data.positions));
       //dispatch(positionsActions.updateobd(data.positions));
       // console.log(data.positions[0].attributes.obd);
      if (data.positions[0]) {
      if (data.positions[0].attributes.obd) {
        dispatch(positionsActions.updateobd(data.positions));
      }
      if (data.positions[0].attributes.error) {
        dispatch(positionsActions.updateError(data.positions));
      }
      }
      }
      if (data.events) {
        displayNotifications(data.events);
      }
    };
  }
  //const wwss = useSelector(state => state.general.ws)
  //setInterval(() => console.log(wwss), 3000);

  useEffectAsync(async () => {
    const response = await fetch(backend.backend +'/api/server');
    if (response.ok) {
      dispatch(sessionActions.updateServer(await response.json()));
    }
  }, []);

  useEffectAsync(async () => {
    if (authenticated) {
      const response = await fetch(backend.backend + '/api/devices');
      if (response.ok) {
        dispatch(devicesActions.refresh(await response.json()));
      }
      connectSocket();
    } else {
      const response = await fetch(backend.backend + '/api/session');
      if (response.ok) {
        dispatch(sessionActions.updateUser(await response.json()));
      } else {
        history.push('/login');
      }
    }
  }, [authenticated]);

  return null;
}

export default connect()(SocketController);
