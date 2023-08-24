import { Image, Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import { Logo } from '../assets';
import { FaWallet } from 'react-icons/fa6';
import { useConnect } from '../contexts/contexts';
function Header() {
  const {account, isConnected, connectWallet, disconnectWallet} = useConnect();
  return (
    <Navbar collapseOnSelect expand="lg" className="mt-3">
      <Container className='rounded-3 p-3'>
        <Navbar.Brand>
          <NavLink to="/" className="nav-link text-white fs-2">
          <Image src={Logo} height="80" className='me-3' /> 
          </NavLink>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mx-auto">
            <NavLink to="/" className="nav-link text-white title-fs fs-2">NFT Minting</NavLink>
          </Nav>
          { isConnected ? (
            <Nav>
              <Button className='py-2 px-4 rounded-5 border-white border-2 mint-button d-flex align-items-center justify-content-center title-fs' onClick={disconnectWallet}><FaWallet/><span className='ms-2 title-fs'>{account?.slice(0, 3) + ".." + account?.slice(-3)}</span></Button>
            </Nav>
          ) : (
            <Nav>
              <Button className='py-2 px-4 rounded-5 border-white border-2 mint-button d-flex align-items-center justify-content-center title-fs' onClick={connectWallet}><FaWallet/><span className='ms-2 title-fs'>Connect</span></Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;