import NavBar from "../../components/Navbar/NavBar"
import  Avatar  from "../../assets/avatar.jpg";
import './HomeStyles.modules.css'

import { FaLinkedin } from "react-icons/fa";
import { GrFormView } from "react-icons/gr";



function Home() {
  return (
    <>
    <NavBar/>
    <div className="container">
      <h1>Seja bem vindo!</h1>
      <img src={Avatar} alt="avatar" />
      <p>Me chamo Nicolás, estudo Ciências da computação
        e adoro explorar novas tecnologias. Minha principal atividade é desenvolver
        aplicativos mobile e web.
      </p>
    </div>
    <div className="redes">
      <button>
      <FaLinkedin />
      <br />
        <a href="https://www.linkedin.com/in/nicolas-gerardo/">Linkedin</a>
      </button>

      <button>
      <GrFormView />
        <a href="https://docs.google.com/document/d/e/2PACX-1vQTts1xIrrpEa8AEgqGBulBdnaHmpM5cygF_ghwy-D0B6JrAR7gW9m4Rwpb6ZrDTBDeZRPX_bGYDGX2/pub">Ver CV</a>
      </button>
    </div>
    </>
  )
}

export default Home;