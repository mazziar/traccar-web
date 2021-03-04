import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { sessionActions } from './store';
import { newuserActions } from './store';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import { Accordion, AccordionSummary, AccordionDetails, makeStyles, Typography} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField';
import t from './common/localization';
import background from './back2.png';
import backend from '../config.json'

const useStyles = makeStyles(theme => ({
  all: {
    display: 'flex',
    height: '100%',
    width: '100%',
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
  },
  root: {
   width: 'auto',
   marginTop: theme.spacing(5),
   marginLeft: theme.spacing(3),
   marginRight: theme.spacing(3),
   //backgroundColor : '#fff',
    [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
      width: 300,
      height: '567px',
      marginLeft: '7%',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
   // padding: theme.spacing(3),
  },
  paper2: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: theme.spacing(3),
  },
   summery: {
    backgroundColor: '#f9f9f9',
    marginLeft: 'auto',
    marginRight: 'auto',
    
  },
   header: {
    direction: "rtl",
    marginRight: 'auto',
    backgroundColor: '#f9f9f9',
  },
  
  logo: {
    
    
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

const LoginPage = () => {
  const dispatch = useDispatch();
  const [failed, setFailed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newname, setNewname] = useState('');
  const [newpassword, setNewpassword] = useState('');
  const [repeatenewpassword, setRepeatenewpassword] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const classes = useStyles();
  const history = useHistory();
  
  const handlePhonenumberChange = (event) => {
    setPhonenumber(event.target.value);
  }
   const handleNewnameChange = (event) => {
    setNewname(event.target.value);
  }
   const handleNewpasswordChange = (event) => {
    setNewpassword(event.target.value);
  }
   const handleRepeatenewpassword = (event) => {
    setRepeatenewpassword(event.target.value);
  }
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }
  

  const handleRegister = async (event) => {
    // TODO: Implement registration
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName:`${newname}`,
                               password:`${newpassword}`,
                               deviceSim:`${phonenumber}` })
    }
    
   const response = await fetch( backend.backend +'/api/users/addDirect',requestOptions );
    if (response.ok) {
     dispatch(newuserActions.updateNewUser({ userName:`${newname}`, 
                                             password:`${newpassword}`,
                                             deviceSim:`${phonenumber}` }));
   history.push('/verification');
}
  }

  const handleLogin = async (event) => {console.log(backend.backend)
    event.preventDefault();
    const response = await fetch(backend.backend+ '/api/session', { method: 'POST', body: new URLSearchParams(`email=${email}&password=${password}`)});
    if (response.ok) {
      const user = await response.json();
      dispatch(sessionActions.updateUser(user));
      history.push('/');
    } else {
      setFailed(true);
      setPassword('');
    }
  }
  const handleRecovery = async (event) => {
  event.preventDefault();
  //const response = await fetch(backend.backend + '/api/session', { method: 'POST', body: new URLSearchParams(`email=${email}`)});
  history.push('/recoverypassword');

  }
  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : 'panel1');
  };
  return (
    <div className={classes.all} >
     
    <main className={classes.root}>
      <Paper className={classes.paper}>
        
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary className={classes.summery} >
         <img className={classes.logo} src='/modern/logosite.png' alt='caren' className={classes.summery} />
        </AccordionSummary>
        <AccordionDetails className={classes.paper2}>
         <form onSubmit={handleLogin}>
          <TextField
            margin='normal'
            required
            fullWidth
            error={failed}
            color='secondary'
            label={t('userEmail')}
            name='email'
            value={email}
            autoComplete='email'
            onChange={handleEmailChange}
            helperText={failed && 'شماره موبایل یا رمز ورود اشتباه میباشد'} />

          <TextField
            margin='normal'
            required
            fullWidth
            error={failed}
            color='secondary'
            label={t('userPassword')}
            name='password'
            value={password}
            type='password'
            autoComplete='current-password'
            onChange={handlePasswordChange} />

          <FormControl fullWidth margin='normal'>
            <div className={classes.buttons}>
              <Button type='button' 
                      variant='contained' 
                      color='inherit'
                      onClick={handleRecovery} 
                      disabled={!email}>
                {t('loginRecoveryPasssword')}
              </Button>
              <Button type='submit' variant='contained' color='secondary' disabled={!email || !password}>
                {t('loginLogin')}
              </Button>
            </div>
          </FormControl>
        </form>
       </AccordionDetails>
       </Accordion>
      </Paper>
      <Accordion  expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
            <AccordionSummary  className={classes.header}>
              {<ExpandMoreIcon />}
              <Typography variant="subtitle1" className={classes.header}>
                {t('loginRegister')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.paper2}>
              <TextField
                margin="normal"
                label={t('userEmailPhon')}
                color='secondary'
                name='newname'
                value={newname}
                onChange={handleNewnameChange} />
             
              <TextField
                margin="normal"
                name='phonenumber'
                value={phonenumber}
                color='secondary'  
                label={t('deviceSim')}
                onChange={handlePhonenumberChange} />
             
            </AccordionDetails>
           <div className={classes.buttons2}>
             <FormControl fullWidth margin='normal'>
               <Button type='button' 
                       variant='contained' 
                       color='secondary'
                       onClick={handleRegister}  
                       disabled={!phonenumber || !newname || !(newpassword === repeatenewpassword)}>
                  {t('loginRegister')}
                </Button>
              </FormControl>
            </div>
          </Accordion>
        
    </main>
    </div>
  );
}

export default LoginPage;
