import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import axios from "axios";
import NumberFormat from 'react-number-format';
import { DateTime } from "luxon";
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Snackbar, TablePagination, TextField, Toolbar, Typography } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { Alert, Skeleton } from "@material-ui/lab";
import DialogContentText from '@material-ui/core/DialogContentText';
const { REACT_APP_API_URL } = process.env;


const useStyles = makeStyles((theme) => ({
    table: {
      minWidth: 650
    },
    divLoading: {
        alignItems: 'center',
        paddingBottom: '30px',
    },
    title: {
        flex: '1 1 100%',
    },
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    }
}));

const getProducts = async (setIsError, setIsLoading, setProducts, page, rowsPerPage) => {
    setIsError(false);
    setIsLoading(true);
    try {
        const result = await axios.get(REACT_APP_API_URL + 'api/v1/products', {
            params: {
                page: page,
                limit: rowsPerPage
            }
        });
        setProducts(result.data);
    } catch (error) {
        setIsError(true);
    }
    setIsLoading(false);
};

export default function TableData(props) {
    const [products, setProducts] = useState({data: [], total: 0});
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [deletedProduct, setDeletedProduct] = useState(false);
    const [updatedProduct, setUpdatedProduct] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [product, setProduct] = useState({});
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openDelete, setOpenDelete] = useState(false);
    const { register, handleSubmit, watch, errors } = useForm();

    useEffect(() => {
        getProducts(setIsError, setIsLoading, setProducts, page, rowsPerPage);
    }, [page]);

    const formatDate = (date) => {
        var date = DateTime.fromISO(date).toLocaleString()
        return date;
    };
    
    const handleClose = () => {
        setOpenEdit(false);
    }
    
    const editProduct = (row) => {
        setProduct(row)
        setOpenEdit(true);
    }
    
    const onSubmit = async (data) => {
        await axios.put(REACT_APP_API_URL + 'api/v1/products/' + product.id, data, { headers: { Authorization: props.userToken }}).then((response) => {
            getProducts(setIsError, setIsLoading, setProducts, page, rowsPerPage);
            setUpdatedProduct(true);
            setOpenEdit(false);
        })
    };
    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const deleteProduct = async (product) => {
        await axios.delete(REACT_APP_API_URL + 'api/v1/products/' + product.id, { headers: { Authorization: props.userToken }}).then((response) => {
            getProducts(setIsError, setIsLoading, setProducts, page, rowsPerPage);
            setDeletedProduct(true);
            setOpenDelete(false);
        })
    }

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };

    const handleOpenDelete = (product) => {
        setProduct(product)
        setOpenDelete(true);
    };

    const renderConfirmDelete = () => {
        return (
            <Dialog
                open={openDelete}
                onClose={handleCloseDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Delete Product</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => deleteProduct(product)} color="primary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    const renderDialog = () => {
        return (
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={openEdit}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Edit Product
                </DialogTitle>
                <DialogContent dividers>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField required name="title" label="Title" defaultValue={product.title} fullWidth inputRef={register({ required: true })}/>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField required name="product_type" label="Type" defaultValue={product.product_type} fullWidth inputRef={register({ required: true })}/>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField name="description" label="Description" defaultValue={product.description} fullWidth inputRef={register}/>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField name="filename" label="Filename" defaultValue={product.filename} fullWidth inputRef={register}/>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField name="height" label="Height" defaultValue={product.height} fullWidth inputRef={register}/>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField name="width" label="Width" defaultValue={product.width} fullWidth inputRef={register}/>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField required name="price" label="Price" defaultValue={product.price} fullWidth inputRef={register({ required: true })}/>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField name="rating" label="Rating" defaultValue={product.rating} fullWidth inputRef={register}/>
                            </Grid>
                            <Grid item style={{ marginTop: 16 }}>
                                <Button
                                    type="button"
                                    variant="contained"
                                    onClick={handleClose}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item style={{ marginTop: 16 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                >
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
            </Dialog>
        );
    };

    const classes = useStyles();

    return (
        <Fragment>
            {renderDialog()}
            {renderConfirmDelete()}
            {updatedProduct &&
                <Snackbar open={updatedProduct} autoHideDuration={6000} onClose={() => { setUpdatedProduct(false)}}>
                    <Alert onClose={() => { setUpdatedProduct(false) }} severity="success">
                        Success! Edited Product
                    </Alert>
                </Snackbar>
            }
            {deletedProduct &&
                <Snackbar open={deletedProduct} autoHideDuration={6000} onClose={() => { setDeletedProduct(false)}}>
                    <Alert onClose={() => { setDeletedProduct(false) }} severity="success">
                        Success! Deleted Product
                    </Alert>
                </Snackbar>
            }
            <div style={{ width: '100%', paddingTop: '30px' }}>
                {isLoading ? (
                    <div className={classes.divLoading}>
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                    </div>
                ) : (
                    <Paper>
                        <Toolbar className={classes.root}>
                            <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                                Products
                            </Typography>
                        </Toolbar>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Title</TableCell>
                                        <TableCell align="center">Type</TableCell>
                                        <TableCell align="center">Rating</TableCell>
                                        <TableCell align="center">Price</TableCell>
                                        <TableCell align="center">Created</TableCell>
                                        {props.userToken && (
                                            <TableCell align="center">Actions</TableCell>
                                        )}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {products.data.map(row => (
                                        <TableRow key={`row_${row.id}`}>
                                            <TableCell component="th" scope="row">{row.title}</TableCell>
                                            <TableCell align="center">{row.product_type}</TableCell>
                                            <TableCell align="center">{row.rating}</TableCell>
                                            <TableCell align="center">
                                                <NumberFormat value={row.price} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                                            </TableCell>
                                            <TableCell align="center">{formatDate(row.created_at)}</TableCell>
                                            {props.userToken && (
                                                <TableCell align="center">
                                                    <Button aria-label="edit" onClick={() => editProduct(row)}>
                                                        Edit
                                                    </Button>
                                                    <Button aria-label="delete" onClick={() => handleOpenDelete(row)}>
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            component="div"
                            rowsPerPageOptions={[5, 10, 25, 50, 100]}
                            count={products.total}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </Paper>
                )}  
            </div>
        </Fragment>
    );
}
