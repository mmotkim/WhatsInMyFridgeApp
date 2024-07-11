import React, { useEffect, useState, useContext } from "react";
import { useAuth0 } from "../react-auth0-spa";
import Awesome from "./Awesome";
import axios from "axios";
import Background from "../assets/userpageBG.png";
import { Context } from "../Context";

const Userpage = () => {
  const { loading, user } = useAuth0();

  const [ingredient, setIngredients] = useState();
  const [userID, setUser] = useState();
  const { setContextUser } = useContext(Context);

  console.log(axios.baseURL);
  useEffect(() => {
    const initializeUser = async () => {
      const mytest = await axios({
        method: "POST",
        url: "http://localhost:5000/initializeUser",
        data: {
          email: user.email,
          auth0_id: user.sub,
          username: user.given_name,
        },
      });
      // console.log(mytest.data.ingredient);
      // console.log(mytest.data.user[0].id);
      setIngredients(mytest.data.ingredient);
      setContextUser(mytest.data.user[0]);
      setUser(mytest.data.user[0].id);
    };
    if (user) initializeUser();
  }, [user]);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  console.log("Whats up");
  console.log(user.email);
  console.log(user.sub);
  console.log(user.given_name);
  console.log(userID);

  return (
    <div className="container-fluid padding">
      <div className="row wording text-center bg" style={{ backgroundImage: `url(${Background})` }}>
        <div className="col-12 ">
          <br />
          <i className="far fa-user-circle fa-8x"></i>
          <br />
          <h2 className="userpage-welcome">Welcome back, {user.given_name}</h2>
          <br />
          <Awesome ingredients={ingredient} userID={userID} />
        </div>
      </div>
    </div>
  );
};

export default Userpage;
