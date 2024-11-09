import { Routes, Route } from 'react-router-dom';


import Contact from './sections/Contact/Contact';
import Projects from './sections/Projects/Projects';
import Home from './sections/Home/Home';
import Skills from './sections/Skills/Skills';

function Rotas() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contato" element={<Contact />} />
      <Route path="/projetos" element={<Projects />} />
      <Route path="/skills" element={<Skills />} />
    </Routes>
  );
}

export default Rotas;