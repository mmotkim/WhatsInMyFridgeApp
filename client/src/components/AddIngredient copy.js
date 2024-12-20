import React from 'react';
import axios from 'axios';

class AddIngredient extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { 
      user_id: '4',
      ingredient_name: '',
      category: '',
      amount: '', 
      url2: process.env.REACT_APP_BACKENDURL
    };
  }
  // change the state using .setState  
  onInputName = (event) => {
    this.setState({ ingredient_name: event.target.value })
  };
  onInputCategory = (event) => {
    this.setState({ category: event.target.value })
  };
  onInputAmount = (event) => {
    this.setState({ amount: event.target.value })
  };


  //callback to handle submission of forms   
  onFormSubmit = (event) => {
    event.preventDefault();
    axios.post(`${this.state.url2}/users/${this.props.userID}/ingredients`, {
      user_id: this.state.user_id, 
      ingredient_name: this.state.ingredient_name,
      category: this.state.category,
      amount: this.state.amount
    })
    .then(res => {
      alert('New Ingredient Added!');
      this.setState({ ingredient_name: '' });
      this.setState({ category: '' });
      this.setState({ amount: '' });
      console.log(res);
    })
    .catch(function (error) {
      console.log(error);
    });

  };

  render() {
    return(
      <div className="form-group container addIngredient">
        <form onSubmit={this.onFormSubmit} className="createIngredientForm" >
          <div>
            <label className="label-text"> Add Ingredient </label>
            <input 
              placeholder="Ex. Chicken"
              type="text" 
              value={this.state.ingredient_name}

              // create & use a callback method to handle changes
              onChange={this.onInputName}
            />
          </div>
          <div>
            <label className="label-text"> Category </label>
            <input 
              placeholder="Ex. Poultry"
              type="text" 
              value={this.state.category}

              // create & use a callback method to handle changes
              onChange={this.onInputCategory}
            />
          </div>
          <div>
            <label className="label-text"> Amount </label>
            <input 
              placeholder="Ex. 5lbs"
              type="text" 
              value={this.state.amount}

              // create & use a callback method to handle changes
              onChange={this.onInputAmount}
            />
          </div>
          <button className="btn btn-primary addButton">Submit</button>
        </form>
        
      </div>
    );
  }
}

export default AddIngredient; 