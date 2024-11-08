import { Routes, Route } from 'react-router-dom';

import AboutMe from './sections/AboutMe/AboutMe';
import Contact from './sections/Contact/Contact';
import Projects from './sections/Projects/Projects';
import Home from './sections/Home/Home';
import SoftSkills from './sections/SoftSkills/SoftSkills';

function Rotas() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sobre" element={<AboutMe />} />
      <Route path="/contato" element={<Contact />} />
      <Route path="/projetos" element={<Projects />} />
      <Route path="/softskills" element={<SoftSkills />} />
    </Routes>
  );
}

export default Rotas;