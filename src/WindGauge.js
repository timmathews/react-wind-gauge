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

    let {width, height, background, lineColor, textColor} = this.props;

    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }

    let svg = d3.select(el).append("svg")
      .attr("width", width)
      .attr("height", height);

    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "#333");

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

    const boxWidth = 0.35 * width,
          mBoxWidth = 0.30 * width,
          boxHeight=  height / 3,
          boxX = 0.65 * width,
          mBoxX = 0.7 * width;


    drawDataBox(boxX,  0 * height / 3, boxWidth,  boxHeight, 123, 123, "KTS", "BSPD");
    drawDataBox(mBoxX, 1 * height / 3, mBoxWidth, boxHeight, 123, 123, "\u00B0", "AWA");
    drawDataBox(boxX,  2 * height / 3, boxWidth,  boxHeight, 123, 123, "KTS", "AWS");

    drawCircle(45);

    function drawDataBox(x, y, w, h, val, tgt, units, measure) {
      const valSize = 75,
            subSize = 24,
            unitSize = units === '\u00B0' ? 48 : 24,
            padding = 20;

      let unitText = svg.append("text")
        .attr("x", x + w - 2 * padding)
        .attr("y", y + padding + 2 * subSize)
        .attr("font-family", "Century Gothic")
        .attr("text-anchor", "end")
        .attr("fill", textColor)
        .attr("font-size", unitSize)
        .text(units);

      let w1 = unitText.node().getBBox().width;

      let valueText = svg.append("text")
        .attr("x", x + w - w1 - 2 * padding)
        .attr("y", y + padding + valSize)
        .attr("text-anchor", "end")
        .attr("fill", textColor)
        .attr("font-size", valSize)
        .text(val);

      let subText = svg.append("text")
        .attr("x", 0)
        .attr("y", y + h / 2)
        .attr("font-size", subSize)
        .attr("fill", textColor)
        .attr("text-anchor", "middle")
        .attr("transform", "translate(0," + measure.length * -10 + ")")
        .selectAll("tspan")
          .data(measure.split(''))
          .enter().append("tspan")
            .attr("x", x + w - padding)
            .attr("dy", "0.8em")
            .text(function(d) { return d});

      let tgtText = svg.append("text")
        .attr("x", x + w - 2 * padding)
        .attr("y", y + h - padding / 2)
        .attr("fill", textColor)
        .attr("text-anchor", "end")
        .text(tgt);

      let w2 = tgtText.node().getBBox().width;

      let tgtLbl = svg.append("text")
        .attr("x", x + w - w2 - 25 - 2 * padding)
        .attr("y", y + h - padding / 2)
        .attr("fill", textColor)
        .attr("text-anchor", "end")
        .text("Target:");

      if(tgt >= val) {
        triangle(x + w - w2 - 20 - 2 * padding, y + h - padding / 2, 18, 18, 'up');
      } else {
        triangle(x + w - w2 - 20 - 2 * padding, y + h - padding / 2, 18, 18, 'dn');
      }
    }

    function triangle(x, y, w, h, dir) {
      var tx, ty, rx;
      tx = x + w / 2;
      if(dir == 'up') {
        ty = y - h;
      } else {
        ty = y;
        y -= h;
      }
      rx = x + w;

      var tPoints = [{x:tx, y:ty}, {x:x, y:y}, {x:rx, y:y}];

      svg.append("path")
        .attr("d", lineFunction(tPoints) + "Z")
        .attr("fill", textColor);

    }

    function drawCircle(heading, targetHeading, trueWindAngle, apparentWindAngle) {
      const originX = width / 3,
            originY = height / 2,
            radius  = Math.min(originX, originY) - 35;

      const g = svg.append("g")
        .attr("transform", "translate(" + originX + "," + originY + ") rotate(" + heading  + ")");


      g.append("circle")
        .attr("r", radius)
        .attr("stroke", lineColor)
        .attr("stroke-width", 4)
        .attr("fill", "none");

      for(let i = 0; i < 64; i++) {
        let tickLength = 10;
        let tickWidth = 1;

        if(i % 16 == 0) {
          tickLength = 30;
        } else if(i % 8 == 0) {
          tickLength = 25;
        } else if(i % 4 == 0) {
          tickLength = 20;
          tickWidth = 2;
        } else if(i % 2 == 0) {
          tickLength = 15;
        }

        let tickAngle = i * Math.PI / 32;

        const tickPath = [
          {x: -Math.cos(tickAngle) * radius,
           y: -Math.sin(tickAngle) * radius},
          {x: -Math.cos(tickAngle) * (radius - tickLength),
           y: -Math.sin(tickAngle) * (radius - tickLength)}
        ];

        g.append("path")
          .attr("d", lineFunction(tickPath))
          .attr("stroke", lineColor)
          .attr("stroke-width", tickWidth)
          .attr("fill", "none");
      }

      g.append("text").text("N")
        .attr("fill", lineColor)
        .attr("font-size", "20pt")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(0," + -(radius + 5) + ")");

      g.append("text").text("S")
        .attr("fill", lineColor)
        .attr("font-size", "20pt")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(0," + (radius + 5) + ") rotate(180)");

      let east = g.append("text").text("E")
        .attr("fill", lineColor)
        .attr("font-size", "20pt")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + (radius + 5) + ",0) rotate(90)");


      g.append("text").text("W")
        .attr("fill", lineColor)
        .attr("font-size", "20pt")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + -(radius + 5) + ",0) rotate(270)");
    }

    function GaugeUpdater() {
      this.update = function(value) {
      }
    }

    return new GaugeUpdater();
  }
}
