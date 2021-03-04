import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { generalActions} from './store';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import t from './common/localization';
import RemoveDialog from './RemoveDialog';
import ErrorDialog from './ErrorDialog';


const useStyles = makeStyles(theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
     backgroundColor: '#ae2025',
  },
}));

const EditCollectionView = ({ content, editPath, endpoint,props }) => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const [selectedId, setSelectedId] = useState(null);
  
  const [selectedAnchorEl, setSelectedAnchorEl] = useState(null);
  const [removeDialogShown, setRemoveDialogShown] = useState(false);
  const [errorDialogShown, setErrorDialogShown] = useState(false);
  const [updateTimestamp, setUpdateTimestamp] = useState(Date.now());
  const errors = useSelector(state => state.positions.error);
  const model = useSelector(state => state.devices);
  const [error, setError] = useState(null);
  const [phone, setPhone] = useState(null);


  const menuShow = (anchorId, itemId, aa, phone) => {
    if (aa == 'image'){
    if (model.items[itemId].model != 'D10'){
     dispatch(generalActions.showMap());
     }
    if (model.items[itemId].model == 'D10'){
     dispatch(generalActions.showDashboard());
     }
    //history.push(`/device/${itemId}`);
     }
    if (aa == 'edit'){
    history.push(`/device/${itemId}`);}
    if (aa == 'delet'){
    setSelectedId(itemId);
    setRemoveDialogShown(true);
    }
    if (aa == 'error'){ 
    setError(errors[itemId])
    setPhone(phone)
    setErrorDialogShown(true);
    }
    if (aa == 'useredit'){
    setSelectedAnchorEl(anchorId);
    setSelectedId(itemId);
    }
  }

  const menuHide = () => {
    setSelectedAnchorEl(null);
  }

  const handleAdd = () => {
    history.push(editPath);
    menuHide();
  }

  const handleEdit = () => {
    history.push(`${editPath}/${selectedId}`);
    menuHide();
  }

  const handleRemove = () => {
    setRemoveDialogShown(true);
    menuHide();
  }

  const handleRemoveResult = () => {
    setRemoveDialogShown(false);
    setUpdateTimestamp(Date.now());
  }
  const handleErrorResult = () => {
    setErrorDialogShown(false);
    setUpdateTimestamp(Date.now());
  }

  const Content = content;
  
  return (
    <>
      <Content updateTimestamp={updateTimestamp} onMenuClick={menuShow} />
      <Fab size="medium" color="primary" className={classes.fab} onClick={handleAdd}>
        <AddIcon />
      </Fab>
      <Menu open={!!selectedAnchorEl} anchorEl={selectedAnchorEl} onClose={menuHide}>
        <MenuItem onClick={handleEdit}>{t('sharedEdit')}</MenuItem>
        <MenuItem onClick={handleEdit}>{t('sharedShowDetails')}</MenuItem>
        <MenuItem onClick={handleRemove}>{t('sharedRemove')}</MenuItem>
      </Menu>
      <RemoveDialog open={removeDialogShown} endpoint={endpoint} itemId={selectedId} onResult={handleRemoveResult} />
      <ErrorDialog open={errorDialogShown} onResult={handleErrorResult} deviceSim={phone} errors={error}/>
    </>
  );
}

export default EditCollectionView;
