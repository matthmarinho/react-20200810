import React, { Fragment, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Form from './form';
import { Button, Dialog, DialogContent, DialogTitle,  Snackbar,  TextField } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Table from './table';
import { Alert } from '@material-ui/lab';
const { REACT_APP_API_URL } = process.env;

function Copyright() {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{'Copyright © '}
			<Link color="inherit" href="https://www.linkedin.com/in/matthaeus-marinho-784b8b193/">
				Matthaeus Marinho
      		</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

const useStyles = makeStyles((theme) => ({
	footer: {
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(6),
	},
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
	table: {
		paddingBottom: '20px'
	},
	username: {
		textAlign: 'right',
		flexGrow: 1,
	}, 
	submit: {
		paddingTop: '20px',
		marginBottom: '20px',
	},
}));

export default function Home() {
	const classes = useStyles();
	const [openDialog, setOpenDialog] = useState(false);
	const [userToken, setUserToken] = useState(null);
	const [login, setLogin] = useState(false);
	const [user, setUser] = useState(null);
	const [loginError, setLoginError] = useState(false);
	const { register, handleSubmit } = useForm();

	const handleClose = () => {
        setOpenDialog(false);
    }

	const handleOpen = () => {
        setOpenDialog(true);
    }

	const onSubmit = async (data) => {
		try {
			await axios.post(REACT_APP_API_URL + 'api/v1/authentication/authenticate/', data).then((response) => {
				console.log(response);
				if (response.status === 200) {
					setUserToken(response.data.result.auth_token);
					setUser(response.data.result.user)
					setLogin(true);
					setOpenDialog(false);
				}
			})
		} catch {
			setLoginError(true);
			setOpenDialog(false);
		}
    };

	const renderDialog = () => {
        return (
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={openDialog}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                   	Login
                </DialogTitle>
                <DialogContent dividers>
                    <form onSubmit={handleSubmit(onSubmit)}>
						<Container component="main" maxWidth="xs">
							<TextField 
								required 
								name="email" 
								label="Email Address" 
								fullWidth 
								autoComplete="email" 
								variant="outlined"
								margin="normal"
								autoFocus
								inputRef={register({ required: true })}
							/>
							<TextField 
								required 
								name="password" 
								label="Password" 
								type="password"
								fullWidth 
								autoComplete="current-password" 
								variant="outlined"
								margin="normal"
								inputRef={register({ required: true })}
							/>
							<div className={classes.submit}>
								<Button
									type="submit"
									fullWidth
									variant="contained"
									color="primary"
									
									size="large"
								>
									Sign In
								</Button>
							</div>
						</Container>
                    </form>
                </DialogContent>
            </Dialog>
        );
    }

	return (
		<React.Fragment>
			{login &&
                <Snackbar open={login} autoHideDuration={6000} onClose={() => { setLogin(false)}}>
                    <Alert onClose={() => { setLogin(false) }} severity="success">
						Logged In
                    </Alert>
                </Snackbar>
            }
			{loginError &&
                <Snackbar open={loginError} autoHideDuration={6000} onClose={() => { setLoginError(false)}}>
                    <Alert onClose={() => { setLoginError(false) }} severity="error">
						Invalid Credentials
                    </Alert>
                </Snackbar>
            }
			{renderDialog()}
			<CssBaseline />
			<AppBar position="relative">
				<Toolbar>
					<Typography className={classes.title} variant="h6" color="inherit" noWrap>
						ruby on rails 20200810
          			</Typography>
					<Fragment>
						{user ? (
							<Typography className={classes.username} variant="h6" color="inherit">
								{user}
							</Typography>
						) : (
							<Button color="inherit" onClick={() => handleOpen()}>Login</Button>
						)}
					</Fragment>
				</Toolbar>
			</AppBar>
			<main>
				<div className={classes.table}>
					<Container maxWidth="md">
						<Form userToken={userToken} />
						<Table userToken={userToken} />
					</Container>
				</div>
			</main>
			<footer className={classes.footer}>
				<Typography variant="h6" align="center" gutterBottom>
					ruby on rails 20200810
        		</Typography>
				<Copyright />
			</footer>
		</React.Fragment>
	);
}