import UserForm from "../components/UserForm";

const Signin = ({ route, onRouteChange, loadUser }) => {
  return(
    <div>
      <UserForm type={route} onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
    </div>
  );
}

export default Signin;