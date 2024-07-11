import React from "react";
import axios from "axios";
import { Consumer } from "../Context";

class AddIngredient extends React.Component {
  // TODO: Add get function

  constructor(props) {
    super(props);
    this.state = {
      ingredients: [],
      selectedIngredients: new Set(),
      isLoading: true,
      error: null,
      url2: process.env.REACT_APP_BACKENDURL,
    };
  }

  componentDidMount() {
    axios
      .get(`${this.state.url2}/ingredientslist`)
      .then((response) => {
        this.setState({ ingredients: response.data, isLoading: false });
      })
      .catch((error) => {
        this.setState({ error, isLoading: false });
      });
    console.log(this.ingredients);
  }

  handleCheckboxChange = (ingredientId) => {
    this.setState((prevState) => {
      const selectedIngredients = new Set(prevState.selectedIngredients);
      if (selectedIngredients.has(ingredientId)) {
        selectedIngredients.delete(ingredientId);
      } else {
        selectedIngredients.add(ingredientId);
      }
      console.log(selectedIngredients);
      return { selectedIngredients };
    });
  };

  // change the state using .setState
  // onInputName = (event) => {
  //   this.setState({ ingredient_name: event.target.value });
  // };
  // onInputCategory = (event) => {
  //   this.setState({ category: event.target.value });
  // };
  // onInputAmount = (event) => {
  //   this.setState({ amount: event.target.value });
  // };

  //callback to handle submission of forms
  onFormSubmit = (event) => {
    event.preventDefault();
    console.log(this.props.user.id);
    axios
      .post(`${this.state.url2}/user/${this.props.user.id}/ingredientslist`, {
        user_id: this.props.user.id,
        ingredients: Array.from(this.state.selectedIngredients),
      })
      .then((res) => {
        alert("New Ingredient Added!");
        // this.setState({ ingredient_name: "" });
        // this.setState({ category: "" });
        // this.setState({ amount: "" });
        console.log(res);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  render() {
    const { ingredients, selectedIngredients, isLoading, error } = this.state;
    if (isLoading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p>Error loading ingredients: {error.message}</p>;
    }

    return (
      <div className="form-group container">
        <form onSubmit={this.onFormSubmit} className="createIngredientForm">
          <div className="ingredient-list">
            {ingredients.map((ingredient) => (
              <div key={ingredient.id} className="ingredient-item">
                <label>
                  <input
                    type="checkbox"
                    value={ingredient.id}
                    checked={selectedIngredients.has(ingredient.id)}
                    onChange={() => this.handleCheckboxChange(ingredient.id)}
                  />
                  {ingredient.name}
                </label>
              </div>
            ))}
          </div>
          <div className="container" />
          <button className="btn btn-primary addButton">Add to Fridge</button>
        </form>
      </div>
    );
  }
}

export default AddIngredient;
