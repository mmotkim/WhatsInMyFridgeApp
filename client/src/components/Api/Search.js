import React, { Component, useContext } from "react";
import axios from "axios";
import { Consumer, Context } from "../../Context";

class Search extends Component {
  state = {
    ingredients: "",
    userIngredients: null,
    user: null,
    ingredientsList: [],
    selectedIngredients: [],
    manualIngredient: "",
  };

  fetchIngredientsList = () => {
    axios
      .get(`${process.env.REACT_APP_BACKENDURL}/ingredientslist`)
      .then((response) => {
        console.log("aeyo");
        this.setState({ ingredientsList: response.data });
      })
      .catch((error) => {
        this.setState({ error });
      });
  };

  componentDidMount() {
    const { heading, user } = this.context;
    console.log("hi");
    // console.log(heading);
    console.log(user);
    this.fetchIngredientsList();
    this.fetchUserIngredients(user);
  }

  findRecipe = (dispatch, e) => {
    e.preventDefault();

    const { ingredientsList, selectedIngredients, manualIngredient } = this.state;
    // Get the names of the selected ingredients
    const selectedIngredientNames = ingredientsList
      .filter((ingredient) => selectedIngredients.includes(parseInt(ingredient.id)))
      .map((ingredient) => ingredient.name)
      .join(", "); // Join names with commas

    // Include manual ingredient in the query
    const query = [selectedIngredientNames, manualIngredient].filter(Boolean).join(", ");

    const baseUrl = "https://api.edamam.com/api/recipes/v2";
    const queryParams = new URLSearchParams({
      type: "public",
      q: query,
      app_id: process.env.REACT_APP_EM_ID,
      app_key: process.env.REACT_APP_EM_KEY,
      cuisineType: "South East Asian",
    });

    axios
      .get(`${baseUrl}?${queryParams.toString()}`)
      .then((res) => {
        dispatch({
          type: "SEARCH_RECIPES",
          payload: res.data.hits,
        });

        this.setState({ ingredients: "" });
      })
      .catch((err) => console.log(err));
  };

  fetchUserIngredients = (user) => {
    if (user) {
      axios
        .get(`${process.env.REACT_APP_BACKENDURL}/users/${user.id}/ingredientslist`)
        .then((res) => {
          const userIngredients = res.data;
          // Automatically select the first 5 ingredients (or all if there are less than 5)
          const selectedIngredients = userIngredients.slice(0, 5);
          this.setState({ userIngredients, selectedIngredients });
          console.log(this.state.userIngredients);
        })
        .catch((err) => console.log(err));
    }
  };

  getUserIngredientsDetails = () => {
    const { ingredientsList, userIngredients } = this.state;
    if (!ingredientsList || !userIngredients) {
      return [];
    }
    return ingredientsList.filter((ingredient) => userIngredients.includes(parseInt(ingredient.id)));
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleCheckboxChange = (ingredientId) => {
    this.setState((prevState) => {
      const { selectedIngredients } = prevState;
      if (selectedIngredients.includes(ingredientId)) {
        return {
          selectedIngredients: selectedIngredients.filter((id) => id !== ingredientId),
        };
      } else {
        return {
          selectedIngredients: [...selectedIngredients, ingredientId],
        };
      }
    });
  };

  render() {
    const userIngredientsDetails = this.getUserIngredientsDetails();

    return (
      <Consumer>
        {(context) => {
          const { dispatch } = context;
          //   this.fetchUserIngredients(context.user);
          return (
            <div className="card card-body mb-4 p-4">
              <h1 className="display-4 text-center search-text">
                <i className="fas fa-utensils fa-fw"></i>
                Search for Recipes
              </h1>
              <p className="lead text-center search-text">Get some recipes for your ingredients:</p>
              <form onSubmit={this.findRecipe.bind(this, dispatch)}>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Kale, Egg, Chicken..."
                    name="manualIngredient"
                    value={this.state.manualIngredient}
                    onChange={this.onChange}
                  />
                </div>

                <div className="ingredients-container">
                  {userIngredientsDetails.map((ingredient) => (
                    <div className=" ingredient-list-search" key={ingredient.id}>
                      <div className="ingredient-item">
                        <label>
                          <input
                            type="checkbox"
                            value={ingredient.id}
                            name={ingredient.name}
                            checked={this.state.selectedIngredients.includes(parseInt(ingredient.id))}
                            onChange={() => this.handleCheckboxChange(parseInt(ingredient.id))}
                          />
                          {ingredient.name}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="btn btn-warning btn-lrg btn-block mb-5" type="submit">
                  <i className="fa fa-search fa-fw"></i>
                  Search
                </button>
              </form>
            </div>
          );
        }}
      </Consumer>
    );
  }
}
Search.contextType = Context;

export default Search;
