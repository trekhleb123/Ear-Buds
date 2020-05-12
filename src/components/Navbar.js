import React from 'react'
import { NavLink } from 'react-router-dom'


const Navbar = (props) => {
    return (
        <nav className="nav-wrapper black">
            <div className="container">
                <NavLink to="/"> Home</NavLink>
                {/* <NavLink to="/signin"> Sign In</NavLink> */}
            </div>
        </nav>
    )
}

export default Navbar
