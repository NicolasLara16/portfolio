import { AppBar, MenuItem, Toolbar, styled } from '@mui/material';

// Estilize o Toolbar usando styled do Material-UI
const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

function NavBar() {
  return (
    <AppBar position="absolute">
      <StyledToolbar>
        <MenuItem>Menu</MenuItem>
        <MenuItem>Projetos</MenuItem>
        <MenuItem>Softskills</MenuItem>
        <MenuItem>Contact</MenuItem>
        <MenuItem>Sobre mim</MenuItem>
        {/* <StyledButton /> */}
      </StyledToolbar>
    </AppBar>
  );
}

export default NavBar;
