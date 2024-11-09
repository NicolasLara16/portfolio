import NavBar from "../../components/Navbar/NavBar"
import './ContactStyles.modules.css';

function Contact() {
  return (
    <>
    <NavBar/>
    <h1>Contact</h1>
    <div className="formulario">
      <form>
        <label >Nome:</label>
        <input type="text" id="name" name="name" required/>
        <br/>
        <label >Email:</label>
        <input type="email" id="email" name="email" required/>
        <br/>
        <label >Menssagem:</label>
        <textarea id="message" name="message" required></textarea>
        <br/>
        <input type="submit" value="Submit"/>
      </form>
    </div>
    </>
  )
}

export default Contact