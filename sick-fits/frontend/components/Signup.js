import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNUP_MUTATION = gql`
    mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
        signup(email: $email, name: $name, password: $password) {
            id
            email
            name
        }
    }
`;

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
            <Mutation
                mutation={SIGNUP_MUTATION}
                variables={this.state}
                refetchQueries={[{ query: CURRENT_USER_QUERY }]}
            >
                {(signup, { error, loading }) => {
                    return (
                        <Form
                            method="post"
                            onSubmit={async e => {
                                e.preventDefault();
                                await signup();
                                this.setState({ email: '', name: '', password: '' });
                            }}
                        >
                            <fieldset disabled={loading} aria-busy={loading}>
                                <h2>Sign Up for An Account</h2>
                                <Error error={error} />
                                <label htmlFor="email">
                                    Email
                                    <input
                                        value={this.state.email}
                                        onChange={this.handleChange}
                                        type="email"
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
                                <button type="submit">Sign Up!</button>
                            </fieldset>
                        </Form>
                    );
                }}
            </Mutation>
        );
    }
}

export default Signup;
