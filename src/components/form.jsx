import React, { Fragment, useState } from 'react';
import { Button, Grid, makeStyles, Snackbar, TextField } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios';
const { REACT_APP_API_URL } = process.env;

const useStyles = makeStyles((theme) => ({
	uploadForm: {
		paddingTop: theme.spacing(4),
	},
    customButtom: {
        padding: "7px 16px",
    },
}));

export default function Form(props) {
    const [file, setFile] = useState(null);
    const [data, setData] = useState([]);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    
    const handleUploadClick = (event) => {
        setIsError(false);
        setIsLoading(true);
        var file = event.target.files[0];
        setFile(file);
        var reader = new FileReader();
        reader.onload = function(){
            var dataURL = reader.result;
            if (dataURL) {
                const data = {
                    "file": dataURL
                }
                try {
                    axios.post(REACT_APP_API_URL + 'api/v1/products', data, {
                        headers: {
                          'Authorization': `Basic ${props.userToken}` 
                        }
                    }).then((response) => {
                        if (response.status === 200) {
                            setOpenAlert(true);
                        } else {
                            setIsError(true);
                        }
                    })
                } catch (error) {
                    setIsError(true);
                }
                setIsLoading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const classes = useStyles();

    return (
        <Fragment>
            {openAlert &&
                <Snackbar open={openAlert} autoHideDuration={6000} onClose={() => { setOpenAlert(false)}}>
                    <Alert onClose={() => { setOpenAlert(false) }} severity="success">
                        Success! Registered Products
                    </Alert>
                </Snackbar>
            }
            {isError &&
                <Snackbar open={isError} autoHideDuration={6000} onClose={() => { setIsError(false)}}>
                    <Alert onClose={() => { setIsError(false) }} severity="error">
                        Error! Invalid Json File
                    </Alert>
                </Snackbar>
            }
            {props.userToken && 
                <div className={classes.uploadForm}>
                    <Grid container spacing={2} justify="center">
                        <Grid item>
                            <TextField 
                                id="outlined-basic" 
                                variant="outlined" 
                                size="small" 
                                value={file ? file.name : "Upload .json file"}
                                disabled 
                            />
                        </Grid>
                        <Grid item>
                            <label htmlFor="upload-photo">
                                <input
                                    style={{ display: "none" }}
                                    id="upload-photo"
                                    name="upload-photo"
                                    onChange={handleUploadClick}
                                    type="file"
                                    accept="application/JSON"
                                />
                                <Button className={classes.customButtom} color="primary" variant="contained" component="span" >
                                    Upload
                                </Button>
                            </label>
                        </Grid>
                    </Grid>
                </div>
            }
        </Fragment>
    );
};