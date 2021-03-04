import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generalActions} from './store';
import { isWidthUp, makeStyles, withWidth } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import ContainerDimensions from 'react-container-dimensions';
import DevicesList from './DevicesList';
import MainToolbar from './MainToolbar';
import Map from './map/Map';
import SelectedDeviceMap from './map/SelectedDeviceMap';
import AccuracyMap from './map/AccuracyMap';
import GeofenceMap from './map/GeofenceMap';
import CurrentPositionsMap from './map/CurrentPositionsMap';
import CurrentLocationMap from './map/CurrentLocationMap';
import CarDashbord from './CarDashbord';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flexGrow: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column-reverse',
    }
  },
  drawerPaper: {
    position: 'relative',
    [theme.breakpoints.up('sm')]: {
      width: 350,
    },
    [theme.breakpoints.down('xs')]: {
      height: 250,
    }
  },
  mapContainer: {
    flexGrow: 1,
  },
  DashbordContainer: {
   flexGrow: 1,
  },
}));

const MainPage = ({ width }) => {
  const classes = useStyles();
  const [dorph, setDorph] = useState(window.innerHeight < window.innerWidth );
  const dispatch = useDispatch();
  const mapordashbord =  useSelector(state => state.general.MOD);
  const handleChange = (mapordashbord) => {
     dispatch(generalActions.showMap());
   }
 
   console.log(dorph )
   console.log(window.innerWidth)
  return (
    <div className={classes.root}>
      <MainToolbar />
      <div className={classes.content}>
        { mapordashbord ? 
        <div className={classes.DashbordContainer}>
        <CarDashbord onChange={handleChange} /> 
        </div> :
          <div className={classes.mapContainer}>
           <ContainerDimensions>
             <Map >
               <CurrentLocationMap onChange={handleChange} />
               <GeofenceMap />
               <AccuracyMap />
               <CurrentPositionsMap />
               <SelectedDeviceMap />
             </Map>
           </ContainerDimensions>
         </div> }
         { dorph ?
         <Drawer
           anchor={isWidthUp('sm', width) ? 'left' : 'bottom'}
           variant='permanent'
           classes={{ paper: classes.drawerPaper }}>
           <DevicesList  />
         </Drawer> : null
          }
      </div>
    </div>
  );
}

export default withWidth()(MainPage);
