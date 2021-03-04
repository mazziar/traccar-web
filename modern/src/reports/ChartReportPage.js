import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { generalActions} from '../store';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import ReportLayoutPage from './ReportLayoutPage';
import ReportFilter from './ReportFilter';
import Graph from './Graph';
import { useAttributePreference } from '../common/preferences';
import { formatDate , formatVolume } from '../common/formatter';
import { speedConverter } from '../common/converter';
import t from '../common/localization';
import backend from '../../config.json';
const Filter = ({ children, setItems }) => {
  const dispatch = useDispatch();
  const speedUnit = useAttributePreference('speedUnit');

  const handleSubmit = async (deviceId, from, to, mail, headers) => {
    dispatch(generalActions.block());
    const query = new URLSearchParams({ deviceId, from, to, mail });
    const response = await fetch(backend.backend+`/api/reports/route?${query.toString()}`, { headers });
    
    if (response.ok) {
      
      const positions = await response.json();
      
      let formattedPositions = positions.map(position => {
        return {
          speed: Number(speedConverter(position.speed, speedUnit))==0
                 ?position.attributes.obd 
                 ? Number(position.attributes.obd.obdSpeed) 
                 : null 
                 :Number(speedConverter(position.speed, speedUnit)),
          battery: position.attributes.obd ? position.attributes.obd.battery : null ,
          rpm: position.attributes.obd ? Number(position.attributes.obd.rpm) : null ,
          watertempreture: position.attributes.obd ? position.attributes.obd.coolantTemp : null ,
          altitude: position.altitude,
          accuracy: position.accuracy,
          fixTime: formatDate(position.fixTime)
        }
      });
      dispatch(generalActions.notBlock());
      setItems(formattedPositions);       
    }
  }
  return (
    <>
      <ReportFilter handleSubmit={handleSubmit} showOnly />
      {children}
    </>
  )
}

const ChartType = ({ type, setType }) => {

  return (
    <FormControl variant="filled" margin="normal" fullWidth>
      <InputLabel>{t('reportChartType')}</InputLabel>
      <Select value={type} onChange={e => setType(e.target.value)}>
        <MenuItem value="speed">{t('positionSpeed')}</MenuItem>
        <MenuItem value="accuracy">{t('positionAccuracy')}</MenuItem>
        <MenuItem value="altitude">{t('positionAltitude')}</MenuItem>
        <MenuItem value="battery">{t('positionBatteryPower')}</MenuItem>
        <MenuItem value="rpm">{t('positionRpm')}</MenuItem>
        <MenuItem value="watertempreture">{t('positionWaterTemperature')}</MenuItem>
      </Select>
    </FormControl>
  )
}


const ChartReportPage = () => {
  
  const [items, setItems] = useState([]);
  const [type, setType] = useState('speed');

  return (
    <>
      <ReportLayoutPage filter={ 
        <Filter setItems={setItems}>
          <ChartType type={type} setType={setType} />
        </Filter>
      }>
        <Graph items={items} type={type} />
      </ReportLayoutPage>
    </>
  )
}

export default ChartReportPage;
