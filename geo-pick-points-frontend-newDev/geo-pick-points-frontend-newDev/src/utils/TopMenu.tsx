import React, { Component, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import ImageLogo from "../layout/image/logo.png";
import Login from "../Pages/Login";
import { useLocation } from 'react-router-dom';

class TopMenu extends Component {

    render() {
        return (
            <div style={{
                position: "fixed",     
                top: 0,                  
                left: 0,            
                right: 0,          
                zIndex: 1000,        
                width: "100%",       
                maxHeight: "15vh",       
                backgroundColor: 'white',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
            }}>
                <Navbar expand="lg" className="shadow">
                    <Container fluid>
                        <Navbar.Brand href="/"  style={{width:"20vh", height:"10vh"}}>
                            <div  style={{width:"100%"}}>
                                <img src={ImageLogo} width={"100%"} alt="logo" />
                            </div>
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="navbarScroll" />
                        <Navbar.Collapse id="navbarScroll" style={{ backgroundColor: "white"}}>
                            <Nav
                                className="me-auto my-2 my-lg-0"
                                style={{ maxHeight: "10vh" }}
                                navbarScroll
                            >
                                <Nav.Link href="#action2">Service</Nav.Link>
                                <Nav.Link href="#action2">About us</Nav.Link>
                                <Nav.Link href="#action2">Contact</Nav.Link>
                                <Nav.Link href="#action2">Imprint</Nav.Link>

                            </Nav>
                            <Login />

                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
    }
}
export default TopMenu;
