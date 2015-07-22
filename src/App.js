import React, {Component, PropTypes} from 'react';
import Gauge from './Gauge';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {value:55.85};
    setInterval(()=>(this.setState({value:Math.random()*100})), 1500);
  }
  
  render() {
    return <Gauge value={this.state.value} label={'Level'} />;
  }
}
