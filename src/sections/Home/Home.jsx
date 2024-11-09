import NavBar from "../../components/Navbar/NavBar"
import  Avatar  from "../../assets/avatar.jpg";
import './HomeStyles.modules.css'



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
    </>
  )
}

export default Home;