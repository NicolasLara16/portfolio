import NavBar from "../../components/Navbar/NavBar";
import { FaHtml5, FaCss3Alt, FaReact } from "react-icons/fa";
import { RiJavascriptFill } from "react-icons/ri";

import './SkillsStyles.modules.css';

function Skills() {
  return (
    <>
      <NavBar />

      <section>
        <div className="hard">
          <h2>Hard Skills</h2>
          <ul>
            <li>
              <FaHtml5 /> Html
            </li>
            <li>
              <FaCss3Alt /> Css
            </li>
            <li>
              <RiJavascriptFill /> JavaScript
            </li>
            <li>
              <FaReact /> React
            </li>
          </ul>
        </div>
        <div className="soft">
          <h2>Soft Skills</h2>
          {/* Adicione aqui os detalhes das soft skills */}
        </div>
      </section>

      <div className="buttonC">
      <button>
        Certificados
      </button>
    </div>
    </>
  );
}

export default Skills;
