import React from 'react'
import LogoImg from "../assets/Logo.png"
function Logo({ width = '100px' }) {
  return (
    <img src={LogoImg} alt="Logo"  width={width}/>
  )
}

export default Logo