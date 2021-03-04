import t from './common/localization'
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActions } from './store';
import { useHistory } from 'react-router-dom';
import backend from '../config.json';

const ExitDialog = ({ open, endpoint, itemId, onResult }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const handleRemove = async () => {
    const response = await fetch(backend.backend+`/api/${endpoint}/${itemId}`, { method: 'DELETE' });
    if (response.ok) {
      onResult(true);
    }
  
  }
    const handleLogout = async () => {
    console.log("exit")
    const response = await fetch(backend.backend + '/api/session', { method: 'DELETE' });
    if (response.ok) {
      dispatch(sessionActions.updateUser(null));
      history.push('/login');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {onResult(false)}}>
      <DialogContent>
        <DialogContentText>{t('sharedLogautConfirm')}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleLogout}>{t('loginLogout')}</Button>
        <Button autoFocus onClick={() => onResult(false)}>{t('sharedCancel')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExitDialog;
