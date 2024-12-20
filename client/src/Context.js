import React, { Component } from "react";
import axios from "axios";

const Context = React.createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "SEARCH_RECIPES":
      return {
        ...state,
        recipes_list: action.payload,
        heading: "Search Results",
      };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "GET_USER_INGREDIENTS":
      return {
        ...state,
        userIngredients: action.payload,
      };
    default:
      return state;
  }
};

export class Provider extends Component {
  state = {
    recipes_list: [],
    heading: "Recommended Recipes",
    user: null,
    dispatch: (action) => this.setState((state) => reducer(state, action)),
    userIngredients: null,
  };

  componentDidMount() {
    const baseUrl = "https://api.edamam.com/api/recipes/v2";
    const queryParams = new URLSearchParams({
      type: "public",
      diet: "balanced",
      cuisineType: "South East Asian",
      app_id: process.env.REACT_APP_EM_ID,
      app_key: process.env.REACT_APP_EM_KEY,
      from: 9,
    });

    axios
      .get(`${baseUrl}?${queryParams.toString()}`)
      .then((res) => {
        // console.log(res.data);
        this.setState({ recipes_list: res.data.hits });
      })
      .catch((err) => console.log(err));

    // console.log("hi");
    // console.log(this.user);
    if (this.user != null) {
      this.fetchUserIngredients();
    }
  }

  // fetchUserIngredients = () => {
  //   if (this.state.user) {
  //     axios
  //       .get(`${process.env.REACT_APP_BACKENDURL}/users/${this.state.user.id}/ingredientslist`)
  //       .then((res) => {
  //         this.setState({ userIngredients: res.data.ingredients });
  //         console.log(this.state.ingredients);
  //       })
  //       .catch((err) => console.log(err));
  //   }
  // };

  setContextUser = (user) => {
    this.setState({ user });
  };

  render() {
    return (
      <Context.Provider
        value={{
          ...this.state,
          setContextUser: this.setContextUser,
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

export const Consumer = Context.Consumer;
export { Context };
