import React, { Fragment } from 'react'
import { Link, Links } from 'react-router-dom'

const Navbar = () => {
    const links = [
        { "to": "/", "label": "Home" },
        { "to": "/recruiter", "label": "Recruiter" },
        { "to": "/candidate", "label": "Candidate" },
        { "to": "/register", "label": "Register" },
        { "to": "/login", "label": "Login" }
    ]

    return (
        <Fragment>
            <header className='flex justify-between p-2'>
                <h1>Udyoga</h1>
                <nav>
                    <ul className='flex gap-2'>
                        {
                            links.map((link, index) => {
                                return (
                                    <Link to={link.to} key={index}>{link.label}</Link>
                                );
                            })
                        }
                    </ul>
                </nav>
            </header>
        </Fragment>
    )
}

export default Navbar