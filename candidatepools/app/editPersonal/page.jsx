"use client"

import React from 'react'
import NavbarLogo from '../components/NavbarLogo'
import NavbarMain from '../components/NavbarMain'

function EditPersonal() {
    return (
        <div>
            <NavbarLogo />
            <NavbarMain status="edit" />
        </div>
    )
}

export default EditPersonal
