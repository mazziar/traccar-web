import React, { Fragment,  useState  } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { useHistory } from 'react-router-dom';

import ListItemText from '@material-ui/core/ListItemText';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Accordion, AccordionDetails, AccordionSummary, Container,  Paper, Slider, Tooltip, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';
import DeleteOutlineTwoToneIcon from '@material-ui/icons/DeleteOutlineTwoTone';
import MailOutlineTwoToneIcon from '@material-ui/icons/MailOutlineTwoTone';
import Button from '@material-ui/core/Button';
import ErrorDialog from './ErrorDialog';
import t from './common/localization';
import useStateList from 'use-state-list';
import { devicesActions } from './store';
import EditCollectionView from './EditCollectionView';
import { useEffectAsync } from './reactHelper';
import RemoveDialog from './RemoveDialog';
import { formatDate , formatVolume ,formatPosition } from './common/formatter';
import backend from '../config.json';
const useStyles = makeStyles((theme) => ({
  list: {
    maxHeight: '100%',
    overflow: 'auto',
    backgroundColor: '#ffffff',
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    backgroundColor: '#ae2025',
  },
   details: {
    
    height: theme.spacing(4),
    backgroundColor: '#f4f4f4',
  },
    detail: {
    
    height: theme.spacing(4),
    backgroundColor: '#f9f9f9',
  },
  
  param: {
    direction: "rtl",
    marginRight: 'auto',
    backgroundColor: '#f9f9f9',
  },
  device : {
  margin : '8px',
  backgroundColor: '#f4f4f9',
  
  },
  button :{
  margin : theme.spacing(-1),
  
  },
  icon: {
    width: '25px',
    height: '25px',
    filter: 'brightness(100) invert(10)',
  },
}));

const DeviceView = ({ updateTimestamp, onMenuClick ,props }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [selectedId, setSelectedId] = useState(null);
  const [selectedAnchorEl, setSelectedAnchorEl] = useState(null);
  const [removeDialogShown, setRemoveDialogShown] = useState(false);
  const [updateTimestampp, setUpdateTimestampp] = useState(Date.now());
  const menuHide = () => {
    setSelectedAnchorEl(null);
  }


  const items = useSelector(state => Object.values(state.devices.items));
  //console.log(items)
  const [expanded, setExpanded] = useStateList(items.length);
  useEffectAsync(async () => {
    const response = await fetch(backend.backend+'/api/devices');
    if (response.ok) {
      dispatch(devicesActions.refresh(await response.json()));
    }
  }, [updateTimestamp]);
 
  
  const obd   = useSelector(state => state.positions.obd);
  const error = useSelector(state => state.positions.error);
  
  const handleError = () => {
    setRemoveDialogShown(true);
  }

    const handleErrorResult = () => {
    setRemoveDialogShown(false);
    setUpdateTimestampp(Date.now());
  }
  //  <AccordionDetails className={classes.details}>
  //               {obd[item.id] ? formatPosition(Number(obd[item.id].tAveragePasheshAngector),'obd3') : 0 }
  //             <b className={classes.param}>:{t('positiontAveragePasheshAngector')}</b><br />
  //            </AccordionDetails> 
  return (
    <List className={classes.list}>
      {items.map((item, index, list) => (
        <Fragment key={item.id}>
        
          <ListItem button key={item.id} className={classes.device} onClick={() => dispatch(devicesActions.select(item))}>
           
            <ListItemText primary={item.name} secondary={formatDate(item.lastUpdate)} />
            <ListItemSecondaryAction>
             <IconButton className={classes.button} onClick={(event) => onMenuClick(event.currentTarget, item.id,'more')}>
                <Avatar className={classes.small} variant="rounded">
                <MoreVertIcon /> 
                </Avatar>
              </IconButton>
              <IconButton className={classes.button} onClick={(event) => onMenuClick(event.currentTarget, item.id,'massage')}>
                <Avatar className={classes.small} variant="rounded">
                <MailOutlineTwoToneIcon />
				</Avatar >
              </IconButton>
              <IconButton className={classes.button} onClick={(event) => onMenuClick(event.currentTarget, item.id,'edit')}>
                <Avatar className={classes.small} variant="rounded">
                <EditTwoToneIcon />
				</Avatar >
              </IconButton>
              <IconButton className={classes.button} onClick={(event) => onMenuClick(event.currentTarget, item.id,'delet')}>
                <Avatar className={classes.small} variant="rounded">
                <DeleteOutlineTwoToneIcon />
				</Avatar >
              </IconButton>
               <IconButton className={classes.button} onClick={(event) => onMenuClick(event.currentTarget, item.id,'image')}>
              <Avatar className={classes.small} variant="rounded">
                <img className={classes.icon} src={`modern/images/icon/${item.category || 'default'}.svg`} alt="" />
              </Avatar>
              </IconButton>
            </ListItemSecondaryAction>
           
          </ListItem>{ item.model == "D10" || item.model == "DG10" ?
          <Accordion expanded={expanded[item.id]} onChange={() => setExpanded(!expanded[item.id])}>
            <AccordionSummary className={classes.param}>
                  {<ExpandMoreIcon />}          
              <Typography className={classes.param}>
                {t('sharedShowParam')}
              </Typography>
            </AccordionSummary >
              <AccordionDetails className={classes.details}>
               {obd[item.id] ? obd[item.id].coolantTemp : 0 }<b className={classes.param}>:{t('positionWaterTemperature')}</b><br />
              </AccordionDetails >
              <AccordionDetails className={classes.detail}>
                {obd[item.id] ? obd[item.id].obdSpeed : 0 } <b className={classes.param}>:{t('positionSpeed')}</b><br />
              </AccordionDetails>
              <AccordionDetails className={classes.details}>
                 {obd[item.id] ? obd[item.id].rpm : 0 }<b className={classes.param}>:{t('positionRpm')}</b><br />
              </AccordionDetails>
              <AccordionDetails className={classes.detail}>
                 {obd[item.id] ? obd[item.id].battery : 0}<b className={classes.param}>:{t('positionBatteryPower')}</b><br />
              </AccordionDetails>
              <AccordionDetails className={classes.details}>
                 {obd[item.id] ? obd[item.id].odometer : 0 }<b className={classes.param}>:{t('positionTripOdometer')}</b><br />
              </AccordionDetails>
              <AccordionDetails className={classes.detail}>
                 {obd[item.id] ? obd[item.id].vWatterSensor : 0 }<b className={classes.param}>:{t('positionvWatterSensor')}</b><br />
              </AccordionDetails>
              <AccordionDetails className={classes.details}>
                 {obd[item.id] ? obd[item.id].vDaricheGaz : 0 }<b className={classes.param}>:{t('positionvDaricheGaz')}</b><br />
              </AccordionDetails>
              <AccordionDetails className={classes.detail}>
                 {obd[item.id] ? obd[item.id].vAirTempSensor : 0 }<b className={classes.param}>:{t('positionvAirTempSensor')}</b><br />
              </AccordionDetails>
              <AccordionDetails className={classes.details}>
                 {obd[item.id] ? obd[item.id].vManifooldPressure : 0 }
               <b className={classes.param}>:{t('positionvManifooldPressure')}</b><br />
              </AccordionDetails>
              <AccordionDetails className={classes.detail}>
                 {obd[item.id] ? obd[item.id].vMogheiatDaricheGass : 0 }
              <b className={classes.param}>:{t('positionvMogheiatDaricheGass')}</b><br />
              </AccordionDetails>    
              <AccordionDetails className={classes.details}>
                 {obd[item.id] ? formatPosition(Number(obd[item.id].tPsheshAngector1),'obd3') : 0 }
                 <b className={classes.param}>:{t('positiontPsheshAngector1')}</b><br />
              </AccordionDetails>   
              <AccordionDetails className={classes.detail}>
                 {obd[item.id] ? formatPosition(Number(obd[item.id].tPsheshAngector2),'obd3') : 0 }
                 <b className={classes.param}>:{t('positiontPsheshAngector2')}</b><br />
              </AccordionDetails>   
              <AccordionDetails className={classes.details}>
                 {obd[item.id] ? formatPosition(Number(obd[item.id].tPsheshAngector3),'obd3'): 0 }
                 <b className={classes.param}>:{t('positiontPsheshAngector3')}</b><br />
              </AccordionDetails>   
              <AccordionDetails className={classes.detail}>
                 {obd[item.id] ? formatPosition(Number(obd[item.id].tPsheshAngector4),'obd3') : 0 }
                 <b className={classes.param}>:{t('positiontPsheshAngector4')}</b><br />
              </AccordionDetails>   
               
              <AccordionDetails className={classes.param}>
                <b className={classes.param}></b> {error[item.id] ?  
                     <Button color="inherit" onClick={(event) => onMenuClick(event.currentTarget, item.id,'error',item.phone)}>
                          {t('sharedShowError')}
                     </Button> 
                : "بدون خطا" }<br /> 
              </AccordionDetails>
          </Accordion> : null}
          {index < list.length - 1 ? <Divider /> : null}
        </Fragment>
      
      ))}
      
    </List>
  );
}

const DevicesList = (props) => {
  const history = useHistory();
 

  return (
    <EditCollectionView content={DeviceView} editPath="/device" endpoint="devices" />
    
  );
}

export default DevicesList;
