import React, { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Container, makeStyles, Paper, Slider, Tooltip, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { generalActions} from '../store';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MainToolbar from '../MainToolbar';
import Map from '../map/Map';
import t from '../common/localization';
import ReplayPathMap from '../map/ReplayPathMap';
import PositionsMap from '../map/PositionsMap';
import { formatPosition , formatDate } from '../common/formatter';
import ReportFilter from './ReportFilter';
import BlockUi from 'react-block-ui';
import backend from '../../config.json';
const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  controlPanel: {
    position: 'absolute',
    bottom: theme.spacing(5),
    left: '50%',
    transform: 'translateX(-50%)',
  },
  controlContent: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  configForm: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const TimeLabel = ({ children, open, value }) => {
  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={formatDate(value)}>
      {children}
    </Tooltip>
  );
};

const ReplayPage = () => {
  const classes = useStyles();

  const [expanded, setExpanded] = useState(true);
  const [positions, setPositions] = useState([]);
  const [index, setIndex] = useState(0);
  const dispatch = useDispatch();
  const blocking =  useSelector(state => state.general.blocking);

  const handleSubmit = async (deviceId, from, to, _, headers) => {
        dispatch(generalActions.block());
    const query = new URLSearchParams({ deviceId, from, to });
    const response = await fetch(backend.backend+`/api/positions?${query.toString()}`, { headers });
    if (response.ok) {
      setIndex(0);
      setPositions(await response.json());
      setExpanded(false);
      dispatch(generalActions.notBlock());
    }
  };

  return (
    <div className={classes.root}>
      <MainToolbar />
      <Map>
        <ReplayPathMap positions={positions} />
        {index < positions.length &&
          <PositionsMap positions={[positions[index]]} />
        }
      </Map>
      <Container maxWidth="sm" className={classes.controlPanel}>
        {!!positions.length &&
          <Paper className={classes.controlContent}>
            <Slider
              max={positions.length - 1}
              step={null}
              marks={positions.map((_, index) => ({ value: index }))}
              value={index}
              onChange={(_, index) => setIndex(index)}
              valueLabelDisplay="auto"
              valueLabelFormat={i => i < positions.length ? formatPosition(positions[i], 'fixTime') : ''}
              ValueLabelComponent={TimeLabel}
              />
          </Paper>
        }
        <BlockUi blocking={blocking}>
        <div>
          <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography align='center'>
                {t('reportConfigure')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.configForm}>
              <ReportFilter handleSubmit={handleSubmit} showOnly />
            </AccordionDetails>
          </Accordion>
        </div>
         </BlockUi>
      </Container>
    </div>
  );
}

export default ReplayPage;
