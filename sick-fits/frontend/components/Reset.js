import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const RESET_MUTATION = gql`
    mutation RESET_MUTATION($resetToken: String!, $password: String!, $confirmPassword: String!) {
        resetPassword(
            resetToken: $resetToken
            password: $password
            confirmPassword: $confirmPassword
        ) {
            id
            email
            name
        }
    }
`;

class Reset extends Component {
    state = {
        password: '',
        confirmPassword: '',
    };
    handleChange = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };
    render() {
        return (
            <Mutation
                mutation={RESET_MUTATION}
                variables={{
                    resetToken: this.props.resetToken,
                    password: this.state.password,
                    confirmPassword: this.state.confirmPassword,
                }}
                refetchQueries={[{ query: CURRENT_USER_QUERY }]}
            >
                {(resetPassword, { error, loading, called }) => {
                    return (
                        <Form
                            method="post"
                            onSubmit={async e => {
                                e.preventDefault();
                                const success = await resetPassword();
                                this.setState({ password: '', confirmPassword: '' });
                            }}
                        >
                            <fieldset disabled={loading} aria-busy={loading}>
                                <h2>Reset Your Password</h2>
                                <Error error={error} />

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
                                <label htmlFor="confirmPassword">
                                    Confirm Password
                                    <input
                                        value={this.state.confirmPassword}
                                        onChange={this.handleChange}
                                        type="password"
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        placeholder="Confirm Password"
                                        required
                                    />
                                </label>
                                <button type="submit">Reset Password</button>
                            </fieldset>
                        </Form>
                    );
                }}
            </Mutation>
        );
    }
}

export default Reset;
