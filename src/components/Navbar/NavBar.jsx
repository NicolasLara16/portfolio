import { AppBar, MenuItem, Toolbar, styled } from '@mui/material';
import { Link } from 'react-router-dom';

// Estilize o Toolbar usando styled do Material-UI
const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-around',
});

// Estilize a AppBar para mudar a cor de fundo
const StyledAppBar = styled(AppBar)({
  backgroundColor: 'black', // Cor da barra
});

// Estilize o MenuItem para mudar a cor do texto
const StyledMenuItem = styled(MenuItem)({
  color: 'white', // Cor das letras
  textDecoration: 'none', // Remove sublinhado do link
});

function NavBar() {
  return (
    <StyledAppBar position="absolute">
      <StyledToolbar>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <StyledMenuItem>Menu</StyledMenuItem>
        </Link>
        <Link to="/projetos" style={{ textDecoration: 'none' }}>
          <StyledMenuItem>Projetos</StyledMenuItem>
        </Link>
        <Link to="/skills" style={{ textDecoration: 'none' }}>
          <StyledMenuItem>Skills</StyledMenuItem>
        </Link>
        <Link to="/contato" style={{ textDecoration: 'none' }}>
          <StyledMenuItem>Contato</StyledMenuItem>
        </Link>
      </StyledToolbar>
    </StyledAppBar>
  );
}

export default NavBar;
