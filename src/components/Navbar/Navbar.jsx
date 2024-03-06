import { Menuicon } from '../menuicon/Menuicon';
import { Link } from 'react-router-dom';
import logo from '../../assets/kenyanauto-black-transparent-logo.png';
import './Navbar.css'

export const Navbar = () => {
  return (
    <nav className="navbar">
            <div className="navbar-logo">
                <Link to={'/'}><img src={logo} alt="KenyanAuto" className="navbar-logo-img" width={50}/></Link>
            </div>
            <div className="navbar-menu">
                <ul className="navbar-menu-list">
                    <li className="navbar-menu-item">
                        <a href="/Buying" className="navbar-menu-link">Buying</a>
                    </li>
                    <li className="navbar-menu-item">
                        <a href="/Selling" className="navbar-menu-link">Selling</a>
                    </li>
                    <li className="navbar-menu-item">
                        <a href="/Maintenance" className="navbar-menu-link">Maintenance</a>
                    </li>
                    <li className="navbar-menu-item">
                        <a href="/Guide" className="navbar-menu-link">Guides</a>
                    </li>
                </ul>
            </div>
            <Menuicon className="menu-icon"/>
    </nav>
  )
}
