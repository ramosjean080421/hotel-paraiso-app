import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, useTheme, Menu, MenuItem } from '@mui/material';
import { Link as RouterLink, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const theme = useTheme();

  // Estado para el menú de admin
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openAdminMenu = Boolean(anchorEl);

  const handleAdminMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAdminMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    if (isHomePage) {
      const sections = document.querySelectorAll('div[id], main[id], footer[id], header[id], section[id], aside[id]');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      }, { rootMargin: '-50% 0px -50% 0px' });

      sections.forEach(section => observer.observe(section));
      window.addEventListener('scroll', handleScroll);
      handleScroll();
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
        sections.forEach(section => observer.unobserve(section));
      };
    } else {
      setIsScrolled(true);
      setActiveSection('');
    }
  }, [isHomePage]);

  const navbarIsTransparent = isHomePage && !isScrolled;

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const navLinkStyles = {
    position: 'relative',
    textDecoration: 'none',
    color: 'inherit',
    mx: 0.5,
    '&::after': {
      content: '""',
      position: 'absolute',
      width: '100%',
      transform: 'scaleX(0)',
      height: '2px',
      bottom: '-4px',
      left: 0,
      backgroundColor: 'primary.main',
      transformOrigin: 'bottom right',
      transition: 'transform 0.25s ease-out',
    },
    '&.active': {
      color: 'primary.main',
      fontWeight: 'bold',
      '&::after': {
        transform: 'scaleX(1)',
        transformOrigin: 'bottom left',
      },
    },
  };

  return (
    <AppBar 
      position="fixed"
      elevation={navbarIsTransparent ? 0 : 4}
      sx={{
        transition: 'all 0.3s ease-in-out',
        backgroundColor: navbarIsTransparent ? 'transparent' : theme.palette.background.default,
        color: navbarIsTransparent ? '#fff' : theme.palette.text.primary,
        boxShadow: navbarIsTransparent ? 'none' : '',
      }}
    >
      <Toolbar>
        <Typography 
          variant="h6" 
          component={RouterLink} 
          to="/"
          onClick={() => isHomePage && handleScrollTo('inicio')}
          sx={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
        >
          Hotel Paraíso
        </Typography>

        <Box sx={{ flexGrow: 1 }} />
        
        {isHomePage ? (
          <>
            <Button onClick={() => handleScrollTo('inicio')} sx={navLinkStyles} className={activeSection === 'inicio' ? 'active' : ''}>Inicio</Button>
            <Button onClick={() => handleScrollTo('nosotros')} sx={navLinkStyles} className={activeSection === 'nosotros' ? 'active' : ''}>Nosotros</Button>
            <Button onClick={() => handleScrollTo('habitaciones')} sx={navLinkStyles} className={activeSection === 'habitaciones' ? 'active' : ''}>Habitaciones</Button>
            <Button onClick={() => handleScrollTo('ubicacion')} sx={navLinkStyles} className={activeSection === 'ubicacion' ? 'active' : ''}>Ubicación</Button>
            <Button onClick={() => handleScrollTo('contacto')} sx={navLinkStyles} className={activeSection === 'contacto' ? 'active' : ''}>Contacto</Button>
          </>
        ) : (
          <>
            <Button component={NavLink} to="/" end sx={navLinkStyles}>Inicio</Button>
            <Button component={NavLink} to="/rooms" sx={navLinkStyles}>Habitaciones</Button>
          </>
        )}
        
        {user && ( <Button component={NavLink} to="/my-reservations" end sx={navLinkStyles}>Mis Reservas</Button> )}
        
        {user && user.role === 'admin' && (
          <>
            <Button
              color="inherit"
              onClick={handleAdminMenuClick}
              endIcon={<ArrowDropDownIcon />}
            >
              Panel de Admin
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={openAdminMenu}
              onClose={handleAdminMenuClose}
            >
              <MenuItem component={NavLink} to="/admin/rooms" onClick={handleAdminMenuClose}>Gestionar Habitaciones</MenuItem>
              <MenuItem component={NavLink} to="/admin/reservations" onClick={handleAdminMenuClose}>Ver Reservas</MenuItem>
              <MenuItem component={NavLink} to="/admin/users" onClick={handleAdminMenuClose}>Gestionar Usuarios</MenuItem>
            </Menu>
          </>
        )}

        <Box sx={{ borderLeft: 1, borderColor: 'divider', ml: 1, pl: 1 }}>
          {user ? (
            <>
              <Typography component="span" sx={{ mr: 2, ml: 1 }}>Hola, {user.name}</Typography>
              <Button color="inherit" onClick={logout}>Cerrar Sesión</Button>
            </>
          ) : (
            <>
              <Button component={NavLink} to="/login" end sx={navLinkStyles}>Login</Button>
              <Button component={NavLink} to="/register" end sx={navLinkStyles}>Register</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}