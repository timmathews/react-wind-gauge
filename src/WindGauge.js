import React, {Component, PropTypes} from 'react';
import d3 from 'd3';

export default class LiquidGauge extends Component {
  static propTypes = {
    backgroundColor: PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.arrayOf(React.PropTypes.string)
    ]),
    compassFont: PropTypes.string,
    lineColor: PropTypes.string,
    shadowColor: PropTypes.string,
    subColor: PropTypes.string,
    subFont: PropTypes.string,
    textColor: PropTypes.string,
    textFont: PropTypes.string
  };

  static defaultProps = {
    // Background color, should this be transparent by default?
    backgroundColor: ['#022f2c', '#479791'],

    // Font to use for compass text
    compassFont: 'Century Gothic',

    // Color to draw lines, should this be foreground color?
    lineColor: '#006363',

    // Color of drop shadow
    shadowColor: '#1d7373',

    // Color of subscripts
    subColor: '#888',

    // Font to use for subscripts
    subFont: 'Century Gothic',

    // Color of main text
    textColor: '#099',

    // Font to use for main text
    textFont: 'Century Gothic',

    width: 400
  }

  componentDidMount() {
    const gauge = this.renderWindGauge("WindGauge", this.props.value);

    this.setState({gauge: gauge});
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.width !== this.props.width) {
      const gauge = this.renderWindGauge("WindGauge", this.props.value);
      this.setState({gauge: gauge});
    } else if(this.state !== null) {
      this.state.gauge.update(this.props.value);
    }
  }

  render() {
    return <div / >;
  }

  renderWindGauge(elementId, value) {
    function deg2rad(deg) {
      return deg / 180 * Math.PI;
    }

    let el = React.findDOMNode(this);

    let {width, height, background, lineColor} = this.props;

    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }

    var svg = d3.select(el).append("svg")
        .attr("width", width)
        .attr("height", height);

    var gradient = svg.append("defs")
      .append("linearGradient")
        .attr("id", "gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%")
        .attr("spreadMethod", "pad");

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", background[0])
        .attr("stop-opacity", 1);

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", background[1])
        .attr("stop-opacity", 1);

    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "url(#gradient)");

    let divider = [{x: 0.6 * width, y: 0 * height / 3},
                   {x: 0.7 * width, y: 1 * height / 3},
                   {x: 0.7 * width, y: 2 * height / 3},
                   {x: 0.6 * width, y: 3 * height / 3}];

    let line2 = [{x: 0.7 * width, y: 1 * height / 3},
                 {x: 1.0 * width, y: 1 * height / 3}];

    let line3 = [{x: 0.7 * width, y: 2 * height / 3},
                 {x: 1.0 * width, y: 2 * height / 3}];

    let lineFunction = d3.svg.line()
      .x(function(d) {return d.x})
      .y(function(d) {return d.y})
      .interpolate("linear");

    svg.append("path")
      .attr("d", lineFunction(divider))
      .attr("stroke", lineColor)
      .attr("stroke-width", 4)
      .attr("fill", "none");

    svg.append("path")
      .attr("d", lineFunction(line2))
      .attr("stroke", lineColor)
      .attr("stroke-width", 4)
      .attr("fill", "none");

    svg.append("path")
      .attr("d", lineFunction(line3))
      .attr("stroke", lineColor)
      .attr("stroke-width", 4)
      .attr("fill", "none");

    function GaugeUpdater() {
      this.update = function(value) {
      }
    }

    return new GaugeUpdater();
  }
}
