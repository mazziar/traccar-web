import t from './common/localization'
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import backend from '../config.json'

const ErrorDialog = ({ open, endpoint,deviceSim, errors, onResult }) => {
   
   const errList=[]; 
   if (errors) {
  Object.keys(errors).map(function(key, index) {
   errList.push([key,errors[key]])
  // console.log(key)
  // console.log(errors[key])
   });
  }
  const clearError = async () => { 
   const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: deviceSim.toString()
       
      }
    const response = await fetch( backend.backend +'/api/users/clearError',requestOptions );
     if (response.ok) {
      onResult(true);
    }
    };
     
  return (
    <Dialog
      open={open}
      onClose={() => { onResult(false) }}>
      <DialogContent>
        <List>{errList.length==0? <ListItem >{t('sharedNoError')}  </ListItem> :
        errList.map(err => (
            <ListItem >
              <ListItemText primary={err[0]} />
              <ListItemText primary={err[1]} />
            </ListItem>
          )
          )}
        </List>
        
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={clearError}>{t('sharedRemove')}</Button>
        <Button autoFocus onClick={() => onResult(false)}>{t('sharedCancel')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorDialog;
