import axios from "axios";
import React, { useRef, useState } from "react";
import { Link, useHistory, useLocation, withRouter } from "react-router-dom";
import { useAuth } from "../../App";
import { appContext } from "../../AppProvider";
import jwt from "jsonwebtoken";

function AuthShipperSignin() {
  let history = useHistory();
  let location = useLocation();

  let submitRef = useRef();

  let auth = useAuth();

  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  let [result, setResult] = useState('');
  let [err, setErr] = useState('');

  const success = <div className="alert alert-success">Success</div>;
  const status = <div className="alert alert-info">Sending...</div>;
  const failure = <div className="alert alert-danger">Error!</div>;


  const { setAuthData } = React.useContext(appContext);

  let { from } = location.state || { from: { pathname: "/" } };

  const login = () => {
    auth.signin(() => {
      history.replace(from);
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'email') {
      setEmail(value);
    } else {
      setPassword(value);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    submitRef.current.value = 'Submitting...';
    setErr(null)
    setResult(null)
    setResult(status)
    const loginObj = { email: email, password: password }
    axios.post("/auth/shipper/login", loginObj).then((res) => {

      let decoded = jwt.verify(res.data.token, 'aqwsderfgtyhjuiklop');

      if (decoded.result[0].shipper_id && decoded.result[0].email === email) {
        setResult(success)
        setAuthData({ shipper_id: decoded.result[0].shipper_id, email: decoded.result[0].email, token: res.data.token })
        setTimeout(()=>login(), 3000)
        console.log("shipper authenticated login now ");
        setEmail('');
        setPassword('');
        submitRef.current.value = 'Log in';
        setTimeout(()=>{setResult(null)}, 3000)
      }
    }).catch((err) => {
      console.log(err);
      setResult(null)
      setErr(failure)
      submitRef.current.value = 'Log in';
      setTimeout(()=>{setErr(null)}, 3000)

    })
  }

  return (
    <div>
      <main className="container d-flex justify-content-center align-items-centerx">
        <form onSubmit={handleSubmit} id="loginForm">
          <div className="form-group">
            <label className="label-control">Username</label>
            <input
              type="text"
              name="email"
              placeholder="Email"
              id="email"
              className="form-control border border-primary rounded-pill rounded-sm"
              defaultValue={email}
              required
              onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="label-control">Password</label>
            <span><Link to="/admin/forget" className="pull-right mb-1 text-muted"><small>Forget password</small></Link></span>
            <input
              type="password"
              name="password"
              placeholder="Password"
              id="password"
              className="form-control border border-primary rounded-pill rounded-sm"
              defaultValue={password}
              required
              onChange={handleChange} />
          </div>

          <div className="form-group text-center">
            <span className="bg-success text-white d-block mb-1 rounded">{result}</span>
            <span className="bg-danger text-white d-block mb-1 rounded">{err}</span>
            <input
              type="submit"
              value="Log in"
              id="submit"
              ref={submitRef}
              className="btn btn-sm btn-outline-success pull-right rounded-pill rounded-sm" /><br />
            <p className="text-muted">Don't have an account?{" "}Sign up</p>
            <p>You must log in to view the page at {from.pathname === "/" ? '/home' : from.pathname}</p>
          </div>
        </form>

      </main>
    </div>
  );
}
export default withRouter(AuthShipperSignin);