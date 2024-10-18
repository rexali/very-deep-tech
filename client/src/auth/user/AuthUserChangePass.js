import React from "react";
import { postData } from '../../service'
import {appContext} from '../../AppProvider'

export default class AuthUserChangePass extends React.Component {
    static contextType = appContext;
    constructor(props) {
        super(props);
        this.params = new URLSearchParams(window.location.search);
        this.random_code = this.params.get('random_code');
        this.emailAddress = this.params.get('emailAddress');
        this.state = {
            password: '',
            password2: '',
            result: '',
            err: ''
        }
    }

    handleChange = (evt) => {
        const { name, value } = evt.target;
        this.setState({
            [name]: value
        })
    }

    handleSubmit = async (evt) => {
        evt.preventDefault()
        const success = <div className="alert alert-success">Successfully changed</div>;
        const status = <div className="alert alert-info">Sending...</div>;
        const failure = <div className="alert alert-danger">Error!</div>;
        const mismatch = <div className="alert alert-danger">Error!: password mismatch </div>;
        this.setState({ err: '', result:status })
        if (this.state.password === this.state.password2) {

            const postObj = {
                email: this.emailAddress,
                random_code: this.random_code,
                password: this.state.password
            }
            let result;
            if (await this.context.getCsrfToken()) {
            result = await postData('/auth/user/change/password', postObj);
            }
            this.setState({ result: status, err: '' })
            if (result.affectedRows === 1 && result.warningCount === 0) {
                this.setState({ result: success, password1: '', password2: '', err:'' })
                console.log(result);
            } else {
                this.setState({ err: failure, result:'' })
                console.error(result);
            }

        } else {
            this.setState({ err: mismatch, result:'' })
        }

    }

    render() {
        const { result, err, password1, password2 } = this.state;
        return (
            <div className="d-flex justify-content-center align-items-center w-100" style={{ height: '500px' }}>
                <form name="changePasswordForm" id="changePasswordForm" onSubmit={this.handleSubmit}>
                    <h5>Change your password</h5>
                    <p className="text-center bg-success text-white" id="changePasswordResult"></p>
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            className="form-control rounded-pill"
                            onChange={this.handleChange}
                            defaultValue={password1}
                            placeholder="Enter new password"
                            required />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="password2"
                            className="form-control"
                            defaultValue={password2}
                            onChange={this.handleChange}
                            placeholder="Confirm new password rounded-pill"
                            required />
                    </div>
                    <div className="text-center">
                        <span className="bg-success text-white d-block mb-1">{result}</span>
                        <span className="bg-danger text-white d-block mb-1">{err}</span>
                        <input
                            type="submit"
                            id="submit-id"
                            className="btn btn-outline-success rounded rounded-sm"
                            value="Submit" />
                    </div>
                </form>
            </div>
        );
    }
}