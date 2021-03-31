import React, {Component, useState, useEffect} from 'react';
import Auxillary from '../../Hoc/Auxillary';

import Burger from '../../Components/Burger/Burger';
import BuildControls from '../../Components/Burger/BuildControls/BuildControls';
import Modal from '../../Components/UI/Modal/Modal';
import OrderSummary from '../../Components/Burger/OrderSummary/OrderSummary';
import axiosInstance from '../../axios-orders';
import Spinner from '../../Components/UI/Spinner/Spinner';
import withErrorHandler from '../../Hoc/withErrorHandler/withErrorHandler';

const INGREDIENTS_PRICE = {
    salad: 0.5, 
    bacon: 0.7,  
    cheese: 0.4, 
    meat: 1.2
};


class BurgerBuilder extends Component{
    
    state = {
        ingredients : null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    };
    componentDidMount() {
        axiosInstance.get('https://react-api-practice-d1f6e-default-rtdb.firebaseio.com/ingredients.json').then(resp => {
            this.setState({ingredients: resp.data});
        }).catch (err => this.setState({error: true}));
    }
    addIngredientsHandler = (type) =>{
        const oldIngredientCount = this.state.ingredients[type];
        const newIngredientCount = oldIngredientCount + 1;

        const updatedIngredient = {
            ...this.state.ingredients
        };
        updatedIngredient[type] = newIngredientCount;

        // new total
        const oldTotal = this.state.totalPrice;
        const newPrice = oldTotal + INGREDIENTS_PRICE[type];

        this.setState({totalPrice: newPrice, ingredients: updatedIngredient});
        this.updatePurchaseState(updatedIngredient);
    }

    removeIngredientsHandler = (type) =>{
        const oldIngredientCount = this.state.ingredients[type];
        const newIngredientCount = (oldIngredientCount > 0) ? oldIngredientCount - 1: 0; 
        const updatedIngredient = {
            ...this.state.ingredients
        };
        updatedIngredient[type] = newIngredientCount;

        // update price
        const oldTotal = this.state.totalPrice;
        const newTotal = oldTotal - INGREDIENTS_PRICE[type];
        
        this.setState({totalPrice: newTotal, ingredients: updatedIngredient});
        this.updatePurchaseState(updatedIngredient);
    }

    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
                        .map(igKey => {
                            return ingredients[igKey]
                        }).reduce((sum, el ) => {
                            return sum + el;
                        }, 0);
    
        this.setState({purchasable: sum > 0})
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        // alert('You Continue');
        // Firebase needs a .json for the location
        this.setState({loading: true});
        const {ingredient, totalPrice} = this.state;
        const order = {
            ingredient, totalPrice,
            customer: {
                name: 'Nivesh Pandya',
                address: {
                    street: 'Test 123',
                    zipcode: '78665',
                    country: 'USA'
                },
                email: 'test@test.com',
            },
            deliveryMethod: 'fastest'
        }
        axiosInstance.post('/orders.json', order).then(resp => {
            this.setState({loading: false, purchasing: false});
        })
        .catch( err => {
            this.setState({loading: false, purchasing: false});
        });
    }

    render(){

        const disabledInfo = {...this.state.ingredients};

        for(let ingredient in disabledInfo){
            disabledInfo[ingredient] = (disabledInfo[ingredient] <=0);
        }

        let orderSummary =  null;

        let burger = this.state.error ? <p> Ingredients cannot be loaded </p> : <Spinner />
        
        if(this.state.ingredients){
            burger = (<Auxillary>
                        <Burger ingredients={this.state.ingredients} />
                            <BuildControls
                                burgerPrice={this.state.totalPrice}
                                addIngredients={this.addIngredientsHandler} 
                                removeIngredients={this.removeIngredientsHandler}
                                disabled={disabledInfo}
                                purchasable={this.state.purchasable}
                                purchaseButtonHandler={this.purchaseHandler}
                            />
                        </Auxillary>
                        );
            orderSummary =  <OrderSummary 
                        totalPrice={this.state.totalPrice}
                        purchaseCancelled={this.purchaseCancelHandler}
                        purchaseContinued={this.purchaseContinueHandler}
                        ingredients={this.state.ingredients}/>
        }

        if(this.state.loading) {
            orderSummary = <Spinner />
        }

        return (
            <Auxillary>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler} >
                    {orderSummary}
                </Modal>
                {burger}
            </Auxillary>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axiosInstance);