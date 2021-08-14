import React, { Component } from 'react';
import Home from './HomeComponent';
import About from './AboutComponent';
import Menu from './MenuComponent';
import Contact from './ContactComponent';
import DishDetail from './DishdetailComponent';
import Favorites from './FavoriteComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { postComment, postFeedback, fetchDishes, fetchComments, fetchPromos, fetchLeaders, loginUser, logoutUser, fetchFavorites, googleLogin, postFavorite, deleteFavorite, postCursorActivity, newCursorActivity } from '../redux/ActionCreators';
import { actions } from 'react-redux-form';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import * as uniqid from 'uniqid';

const LEFT_MOUSE_DOWN = 'Left Mouse Down';
const RIGHT_MOUSE_DOWN = 'Right Mouse Down';
const MIDDLE_MOUSE_DOWN = 'Middle Mouse Down';
const LEFT_MOUSE_UP = 'Left Mouse Up';
const RIGHT_MOUSE_UP = 'Right Mouse Up';
const MIDDLE_MOUSE_UP = 'Middle Mouse Up';
const DEFAULT_MOUSE_DOWN = 'Mouse Down';
const DEFAULT_MOUSE_UP = 'Mouse Up';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      promotions: state.promotions,
      leaders: state.leaders,
      favorites: state.favorites,
      auth: state.auth
    }
}

const mapDispatchToProps = (dispatch) => ({
  postComment: (dishId, rating, comment) => dispatch(postComment(dishId, rating, comment)),
  fetchDishes: () => {dispatch(fetchDishes())},
  resetFeedbackForm: () => { dispatch(actions.reset('feedback'))},
  fetchComments: () => {dispatch(fetchComments())},
  fetchPromos: () => {dispatch(fetchPromos())},
  fetchLeaders: () => dispatch(fetchLeaders()),
  postFeedback: (feedback) => dispatch(postFeedback(feedback)),
  loginUser: (creds) => dispatch(loginUser(creds)),
  logoutUser: () => dispatch(logoutUser()),
  fetchFavorites: () => dispatch(fetchFavorites()),
  googleLogin: () => dispatch(googleLogin()),
  postFavorite: (dishId) => dispatch(postFavorite(dishId)),
  deleteFavorite: (dishId) => dispatch(deleteFavorite(dishId)),
  postCursorActivity: (event) => dispatch(postCursorActivity(event)),
  newCursorActivity: (user) => dispatch(newCursorActivity(user))
});

class Main extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user_id: uniqid()
    }

    this.reportMouseDown = this.reportMouseDown.bind(this);
    this.reportMouseUp = this.reportMouseUp.bind(this);
    this.reportMouseMove = this.reportMouseMove.bind(this);
  }

  componentDidMount() {
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
    this.props.fetchLeaders();
    this.props.fetchFavorites();
    this.props.newCursorActivity({
      user_id: this.state.user_id,
      events: []
    });
  }

  componentWillUnmount() {
    this.props.logoutUser();
  }

  reportMouseDown(event) {
    let newEVent = {
        timestamp: new Date().getTime().toString(),
        cor_X: event.clientX,
        cor_Y: event.clientY,
        tagID: document.elementFromPoint(event.clientX, event.clientY).id
    }
    switch (event.button) {
      case 0:
        newEVent.type = LEFT_MOUSE_DOWN;
        break;
      case 1:
        newEVent.type = MIDDLE_MOUSE_DOWN;
        break;
      case 2:
        newEVent.type = RIGHT_MOUSE_DOWN;
        break;
      default:
        newEVent.type = DEFAULT_MOUSE_DOWN;
    }
    let user_id = this.state.user_id;
    this.props.postCursorActivity([newEVent, user_id]);
  }

  reportMouseUp(event) {
    let newEVent = {
      timestamp: new Date().getTime().toString(),
      cor_X: event.clientX,
      cor_Y: event.clientY,
      tagID: document.elementFromPoint(event.clientX, event.clientY).id
    }
    switch (event.button) {
      case 0:
        newEVent.type = LEFT_MOUSE_UP;
        break;
      case 1:
        newEVent.type = MIDDLE_MOUSE_UP;
        break;
      case 2:
        newEVent.type = RIGHT_MOUSE_UP;
        break;
      default:
        newEVent.type = DEFAULT_MOUSE_UP;
    }
    let user_id = this.state.user_id;
    this.props.postCursorActivity([newEVent, user_id]);
  }

  reportMouseMove(event) {
    let newEVent = {
      timestamp: new Date().getTime().toString(),
      type: "Mouse Move",
      cor_X: event.clientX,
      cor_Y: event.clientY,
      tagID: document.elementFromPoint(event.clientX, event.clientY).id
    };
    let user_id = this.state.user_id;
    this.props.postCursorActivity([newEVent, user_id]);
  }

  reportKeyDown(event) {

  }

  reportKeyUp(event) {
    
  }

  render() {

    const HomePage = () => {
      return(
        <Home dish={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
          dishesLoading={this.props.dishes.isLoading}
          dishesErrMess={this.props.dishes.errMess}
          promotion={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
          promosLoading={this.props.promotions.isLoading}
          promosErrMess={this.props.promotions.errMess}
          leader={this.props.leaders.leaders.filter((leader) => leader.featured)[0]}
          leaderLoading={this.props.leaders.isLoading}
          leaderErrMess={this.props.leaders.errMess}
        />
      );
    }

    const DishWithId = ({match}) => {
      return(
        (this.props.auth.isAuthenticated && this.props.favorites.favorites)
        ?
        <DishDetail dish={this.props.dishes.dishes.filter((dish) => dish._id === match.params.dishId)[0]}
          isLoading={this.props.dishes.isLoading}
          errMess={this.props.dishes.errMess}
          comments={this.props.comments.comments.filter((comment) => comment.dish === match.params.dishId)}
          commentsErrMess={this.props.comments.errMess}
          postComment={this.props.postComment}
          favorite={this.props.favorites.favorites?
            this.props.favorites.favorites.dishes.some((dish) => dish === match.params.dishId) : false}
          postFavorite={this.props.postFavorite}
          />
        :
        <DishDetail dish={this.props.dishes.dishes.filter((dish) => dish._id === match.params.dishId)[0]}
          isLoading={this.props.dishes.isLoading}
          errMess={this.props.dishes.errMess}
          comments={this.props.comments.comments.filter((comment) => comment.dish === match.params.dishId)}
          commentsErrMess={this.props.comments.errMess}
          postComment={this.props.postComment}
          favorite={false}
          postFavorite={this.props.postFavorite}
          />
      );
    }

    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route {...rest} render={(props) => (
        this.props.auth.isAuthenticated
          ? <Component {...props} />
          : <Redirect to={{
              pathname: '/home',
              state: { from: props.location }
            }} />
      )} />
    );

    return (
      <div onMouseDown={(e) => this.reportMouseDown(e)} 
        onMouseUp={(e) => this.reportMouseUp(e)} 
        onMouseMove={(e) => this.reportMouseMove(e)}>
        <Header auth={this.props.auth} 
          loginUser={this.props.loginUser} 
          logoutUser={this.props.logoutUser}
          googleLogin={this.props.googleLogin}
          />   
        <TransitionGroup>
          <CSSTransition key={this.props.location.key} classNames="page" timeout={300}>
            <Switch>
              <Route path="/home" component={HomePage} />
              <Route exact path='/aboutus' component={() => <About leaders={this.props.leaders} />} />
              <Route exact path="/menu" component={() => <Menu dishes={this.props.dishes} />} />
              <Route path="/menu/:dishId" component={DishWithId} />
              <PrivateRoute exact path="/favorites" component={() => <Favorites favorites={this.props.favorites} dishes={this.props.dishes} deleteFavorite={this.props.deleteFavorite} />} />
              <Route exact path="/contactus" component={() => <Contact resetFeedbackForm={this.props.resetFeedbackForm} postFeedback={this.props.postFeedback} />} />
              <Redirect to="/home" />
            </Switch>
          </CSSTransition>
        </TransitionGroup>
        <Footer />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
