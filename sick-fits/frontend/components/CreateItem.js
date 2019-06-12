import React, { Component } from 'react';
import Router from 'next/router';
import { Mutation } from 'react-apollo';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import gql from 'graphql-tag';
import Error from './ErrorMessage';

const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
        $title: String!
        $description: String!
        $price: Int!
        $image: String
        $largeImage: String!
    ) {
        createItem(
            title: $title
            description: $description
            price: $price
            image: $image
            largeImage: $largeImage
        ) {
            id
        }
    }
`;

class CreateItem extends Component {
    state = {
        title: 'Cool Shoes',
        description: 'I love those Context',
        image: 'dog.jpg',
        largeImage: 'dogggg.jpg',
        price: 4560,
    };

    handleChange = e => {
        const { name, type, value } = e.target;
        const val = type === 'number' ? parseFloat(value) : value;
        this.setState(() => ({ [name]: val }));
    };

    render() {
        return (
            <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
                {(createItem, { loading, error, data }) => (
                    <Form
                        onSubmit={async e => {
                            e.preventDefault();
                            const res = await createItem();
                            Router.push({
                                pathname: '/item',
                                query: { id: res.data.createItem.id },
                            });
                        }}
                    >
                        <Error error={error} />
                        <fieldset disabled={loading} aria-busy={loading}>
                            <label htmlFor="title">
                                Title
                                <input
                                    value={this.state.title}
                                    onChange={this.handleChange}
                                    type="text"
                                    name="title"
                                    id="title"
                                    placeholder="Title"
                                    required
                                />
                            </label>
                            <label htmlFor="price">
                                Price
                                <input
                                    value={this.state.price}
                                    onChange={this.handleChange}
                                    type="number"
                                    name="price"
                                    id="price"
                                    placeholder="Price"
                                    required
                                />
                            </label>
                            <label htmlFor="description">
                                Description
                                <textarea
                                    value={this.state.description}
                                    onChange={this.handleChange}
                                    name="description"
                                    id="description"
                                    placeholder="Enter A Description"
                                    required
                                />
                            </label>
                            <button type="submit">Submit</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        );
    }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
