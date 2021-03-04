import t from '../common/localization'
import React from 'react';
import { useSelector } from 'react-redux';
import { formatPosition } from '../common/formatter';

const StatusView = ({ deviceId, onShowDetails }) => {
  const device = useSelector(state => state.devices.items[deviceId]);
  const position = useSelector(state => state.positions.items[deviceId]);
  const obd = useSelector(state => state.positions.obd[deviceId]);
  const error = useSelector(state => state.positions.error[deviceId]);
 console.log(position.protocol)
  
  const handleClick = e => {
    e.preventDefault();
    onShowDetails(position.id);
   
  };
   if (position.protocol=="gps104"){
  return (
    <>
      <b>{t('positionWaterTemperature')}:</b> {obd ? obd.coolantTemp : 0 }<br />
      <b>{t('positionSpeed')}:</b> {obd ? obd.obdSpeed : 0 }<br />
      <b>{t('positionRpm')}:</b> {obd ? obd.rpm : 0 }<br />
      <b>{t('positionBatteryPower')}:</b> {obd ? obd.battery : 0}<br />
      <b>{t('positionTripOdometer')}:</b> {obd ? obd.odometer : 0 }<br />
      <b>{t('positionErrors')}:</b> {error ? JSON.stringify(error) : "بدون خطا" }<br />
      <a href="/" onClick={handleClick}>{t('sharedShowDetails')}</a>
    </>
  );} else {
    return (
    <>
      <b>{t('positionSpeed')}:</b> {formatPosition(position.speed, 'speed')}<br />
      <b>{t('positionDistance')}:</b> {formatPosition(position.attributes.totalDistance, 'distance')}<br />
      {position.attributes.batteryLevel &&
        <><b>{t('positionBattery')}:</b> {formatPosition(position.attributes.batteryLevel, 'batteryLevel')}<br /></>
      }
      <a href="/" onClick={handleClick}>{t('sharedShowDetails')}</a>
    </>
  );
    }
};

export default StatusView;
