import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

class Signup extends Component {
    state = {
        email: '',
        name: '',
        password: '',
    };
    handleChange = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };
    render() {
        return (
            <Form>
                <fieldset>
                    <h2>Sign Up for An Account</h2>
                    <label htmlFor="email">
                        Email
                        <input
                            value={this.state.email}
                            onChange={this.handleChange}
                            type="text"
                            name="email"
                            id="email"
                            placeholder="Email"
                            required
                        />
                    </label>
                    <label htmlFor="name">
                        Name
                        <input
                            value={this.state.name}
                            onChange={this.handleChange}
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Name"
                            required
                        />
                    </label>
                    <label htmlFor="password">
                        Password
                        <input
                            value={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Password"
                            required
                        />
                    </label>
                </fieldset>
            </Form>
        );
    }
}

export default Signup;
