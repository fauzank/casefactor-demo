import React, { useState } from 'react';
import { useHistory } from "react-router";
import { Drawer, Menu, MenuItem, AppBar, Toolbar, List, Divider, IconButton, ListItem, ListItemIcon, ListItemText, } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import * as Icon from '@material-ui/icons';
// import { withRouter } from "react-router-dom";
// import logoImage from '../../assets/images/movitWhiteLogo.png'
import { AmplifySignOut } from '@aws-amplify/ui-react';

export default function LeftNavbar(props) {
    const history = useHistory();
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget)
    };
    const handleMenuClose = () => {
        setAnchorEl(null)
    };
    
    const handleDrawerOpen = () => {
        setOpen(true)
    };

    const handleDrawerClose = () => {
        setOpen(false)
    };

    return (
        <div className="App">
            <div className="">
                <AppBar position="fixed">
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            className=""
                        >
                            <MenuIcon />
                        </IconButton>
                        <div>
                            <div>Case Factor</div>
                        </div>

                        <div className="flexGrow1 text-center"><div className="appbar-header">{props.pageTitle}</div></div>
                        <div className="text-right">
                            <IconButton
                                edge="end"
                                aria-label="account of current user"
                                aria-controls="simple-menu"
                                aria-haspopup="true"
                                onClick={handleMenuClick}
                                color="inherit"
                            >
                                <Icon.AccountCircle />
                            </IconButton>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                                <MenuItem onClick={handleMenuClose}>My account</MenuItem>
                                <MenuItem ><AmplifySignOut /></MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>
                <Drawer
                    className=""
                    variant="persistent"
                    anchor="left"
                    open={open}
                >
                    <div className="text-right">
                        <IconButton onClick={handleDrawerClose}><Icon.ChevronLeft /></IconButton>
                    </div>
                    <Divider />
                    <List className="paddingRight2Rem">
                        <ListItem button key="home" onClick={(event) => history.push('/')}>
                            <ListItemIcon className=""><Icon.Home /></ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItem>
                        <ListItem button key="employeeDetail" onClick={(event) => history.push('/employee')}>
                            <ListItemIcon className=""><Icon.VerifiedUser /></ListItemIcon>
                            <ListItemText primary="Employee Detail" />
                        </ListItem>
                        <ListItem button key="caseList" onClick={(event) => history.push('/case')}>
                            <ListItemIcon className=""><Icon.Payment /></ListItemIcon>
                            <ListItemText primary="Case List" />
                        </ListItem>
                    </List>
                </Drawer>
            </div>
        </div>
    );
}

 