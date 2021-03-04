import React, { useState } from 'react';
import { useDispatch, useSelector  } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { sessionActions } from './store';
import { newuserActions } from './store';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import { Accordion,AccordionDetails, makeStyles} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import t from './common/localization';
import backend from '../config.json';
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(5),
    width: 'auto',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3),
  },
  paper2: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3),
  },
  
  logo: {
    marginTop: theme.spacing(2)
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-evenly',
    '& > *': {
      flexBasis: '40%',
    }, },
    buttons2: {
    marginBottom: theme.spacing(4),
    display: 'flex',
    justifyContent: 'space-evenly',
    '& > *': {
      flexBasis: '40%',
    },
  },
}));
const RecoveryPassword = () => {
  
  const history = useHistory();
  const dispatch = useDispatch();
  const [failed, setFailed] = useState(false);
  const [password, setPassword] = useState('');
  const [newpassword, setNewpassword] = useState('');
  const [repeatenewpassword, setRepeatenewpassword] = useState('');
  const classes = useStyles();
  const newuser = useSelector(state => state.newuser);
  const [code, setCode] = useState('');
  const [allOk, setAllOk] = useState(false);
  const handleCodeChange = (event) => {
    setCode(event.target.value);
  }
  const handleNewpasswordChange = (event) => {
    setNewpassword(event.target.value);
  }
   const handleRepeatenewpassword = (event) => {
    setRepeatenewpassword(event.target.value);
  }
  const handleLogin = async (event) => { 
    console.log("login")
    if (allOk) {
    event.preventDefault();
    const response = await fetch(backend.backend + '/api/session', {  method: 'POST',
                                                     body: new URLSearchParams(`email=${newuser.newuser.userName}&
                                                                                password=${newuser.newuser.password}`)  });
    if (response.ok) {
      const user = await response.json();
      dispatch(sessionActions.updateUser(user));
      history.push('/');
    } else {
      setFailed(true);
      setPassword('');
    }
   }
  }
  
  const handleRegister = async () => {
     const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code:`${code}`,
                               mobile:`${newuser.newuser.deviceSim}`,
                               password:`${newuser.newuser.password}`,
                               newuser:`${newuser.newuser.userName}`})
    }
    
    const response = await fetch(backend.backend + '/api/users/addDirectVerificationCode' ,requestOptions   );
    
    
      var myVar = setInterval(function(){ checkok(); }, 3000 );
       setTimeout(function(){ clearInterval(myVar); }, 90000);
     
      const checkok = async (event) => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: `${newuser.newuser.userName}`
      }
      
    const response = await fetch(backend.backend +'/api/users/checkAllOk',requestOptions);
      const verificatrionStatus = await response.json();
      setAllOk(verificatrionStatus.allOk)
      handleLogin()
    }
   }

 return (
   <main className={classes.root}>
      <Accordion defaultExpanded className={classes.paper}>
            <AccordionDetails className={classes.paper}>
              کد فعال سازی برای شما ارسال شد
              <TextField
                margin="normal"
                label={t('loginVerification')}
                name='newname'
                value={code}
                onChange={handleCodeChange}/>
              <TextField
                margin="normal"
                label={t('userNewPassword')}
                name='newpassword'
                value={newpassword}
                onChange={handleNewpasswordChange}/>
              <TextField
                margin="normal"
                label={t('userRepeateNewPassword')}
                name='repeatenewpassword'
                value={repeatenewpassword}
                onChange={handleRepeatenewpassword}/>

            </AccordionDetails>
           <div className={classes.buttons2}>
             <FormControl fullWidth margin='normal'>
               <Button type='button' 
                       variant='contained' 
                       color='primary'  
                       onClick={handleRegister}  
                       disabled={!code}>
                  {t('positionInput')}
                </Button>
              </FormControl>
            </div><></>
          </Accordion>
    </main>
    
   
 );


}
export default RecoveryPassword;
