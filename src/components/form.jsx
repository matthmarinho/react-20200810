import React, { Fragment, useState } from 'react';
import { Button, Grid, IconButton, makeStyles, TextField } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
	uploadForm: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
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
                    "params": {
                        "file": dataURL
                    }
                }
                try {
                    var result = axios.post('api/v1/products', data, {
                        headers: {
                          'Authorization': `Basic ${props.userToken}` 
                        }
                    });
                    if (result.data) {
                        setOpenAlert(true);
                    } else {
                        setIsError(true);
                    }
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
                <Alert 
                    variant="filled"
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setOpenAlert(false);
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                }> 
                    Success! Registered Products
                </Alert>
            }
            {isError &&
                <Alert 
                    variant="filled"
                    severity="error"
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setIsError(false);
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                }>
                    Error! Invalid Json File
                </Alert>
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