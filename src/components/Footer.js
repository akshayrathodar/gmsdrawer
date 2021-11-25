import React from "react";
import { Row, Col, Container } from "reactstrap";
import { initCenteringGuidelines } from "./Helpers";
import CTAButton from "./CTAButton";
import ReactDOM from "react-dom";
import { fabric } from "fabric";
//import { SketchPicker } from 'react-color';
//import FontPicker from 'font-picker-react';
//import Popup from 'reactjs-popup'
import { getOffset, saveCanvasState } from "./Helpers";
import FabricCanvas from "./FabricCanvas";
//import { Row, Col, Container, Collapse } from "reactstrap";

class Footer extends React.Component {
  state = {
    savestateaction: true,
    canvasScale: 1,
    SCALE_FACTOR: 1.2,
  };
  componentDidMount() {
    this.initKeyboardEvents();
  }
  undo = () => {
    var canvas = this.props.canvas;
    canvas.stateaction = false;
    var index = canvas.index;
    var state = canvas.state;
    if (index > 0) {
      index -= 1;
      this.removeObjects();
      canvas.loadFromJSON(state[index], function () {
        canvas.renderAll();
        canvas.stateaction = true;
        canvas.index = index;
      });
    } else {
      canvas.stateaction = true;
    }
  };
  redo = () => {
    var canvas = this.props.canvas;
    var index = canvas.index;
    var state = canvas.state;
    console.log(index);
    canvas.stateaction = false;
    if (index < state.length - 1) {
      this.removeObjects();
      canvas.loadFromJSON(state[index + 1], function () {
        canvas.renderAll();
        canvas.stateaction = true;
        index += 1;
        canvas.index = index;
      });
    } else {
      canvas.stateaction = true;
    }
  };
  removeObjects = () => {
    var canvas = this.props.canvas;
    var activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    if (activeObject.type === "activeSelection") {
      activeObject.forEachObject((object) => {
        canvas.remove(object);
      });
    } else {
      canvas.remove(activeObject);
    }
  };
  // zoomIn = () => {
  //   var canvas = this.props.canvas;

  //   this.setState(
  //     { canvasScale: this.state.canvasScale * this.state.SCALE_FACTOR },
  //     function () {
  //       console.log(this.state.canvasScale);
  //     }
  //   );

  //   canvas.setHeight(canvas.getHeight() * this.state.SCALE_FACTOR);
  //   canvas.setWidth(canvas.getWidth() * this.state.SCALE_FACTOR);
  //   var objects = canvas.getObjects();
  //   for (var i in objects) {
  //     var scaleX = objects[i].scaleX;
  //     var scaleY = objects[i].scaleY;
  //     var left = objects[i].left;
  //     var top = objects[i].top;
  //     var tempScaleX = scaleX * this.state.SCALE_FACTOR;
  //     var tempScaleY = scaleY * this.state.SCALE_FACTOR;
  //     var tempLeft = left * this.state.SCALE_FACTOR;
  //     var tempTop = top * this.state.SCALE_FACTOR;
  //     objects[i].scaleX = tempScaleX;
  //     objects[i].scaleY = tempScaleY;
  //     objects[i].left = tempLeft;
  //     objects[i].top = tempTop;
  //     objects[i].setCoords();
  //   }
  //   canvas.renderAll();
  //   initCenteringGuidelines(canvas);
  // };
  // // Zoom Out
  // zoomOut = () => {
  //   var canvas = this.props.canvas;
  //   this.setState({
  //     canvasScale: this.state.canvasScale / this.state.SCALE_FACTOR,
  //   });
  //   canvas.setHeight(canvas.getHeight() * (1 / this.state.SCALE_FACTOR));
  //   canvas.setWidth(canvas.getWidth() * (1 / this.state.SCALE_FACTOR));
  //   var objects = canvas.getObjects();
  //   for (var i in objects) {
  //     var scaleX = objects[i].scaleX;
  //     var scaleY = objects[i].scaleY;
  //     var left = objects[i].left;
  //     var top = objects[i].top;
  //     var tempScaleX = scaleX * (1 / this.state.SCALE_FACTOR);
  //     var tempScaleY = scaleY * (1 / this.state.SCALE_FACTOR);
  //     var tempLeft = left * (1 / this.state.SCALE_FACTOR);
  //     var tempTop = top * (1 / this.state.SCALE_FACTOR);
  //     objects[i].scaleX = tempScaleX;
  //     objects[i].scaleY = tempScaleY;
  //     objects[i].left = tempLeft;
  //     objects[i].top = tempTop;
  //     objects[i].setCoords();
  //   }
  //   canvas.renderAll();
  //   initCenteringGuidelines(canvas);
  // };
  resetState = () => {
    var canvas = this.props.canvas;
    canvas.state = [];
    canvas.index = 0;
  };
  zoomToPercent = (event) => {
    var canvas = this.props.canvas;
    var percentage = Number(event.target.value) / 100;
    canvas.setHeight(
      canvas.getHeight() * (percentage / this.state.canvasScale)
    );
    canvas.setWidth(canvas.getWidth() * (percentage / this.state.canvasScale));
    var objects = canvas.getObjects();
    for (var i in objects) {
      var scaleX = objects[i].scaleX;
      var scaleY = objects[i].scaleY;
      var left = objects[i].left;
      var top = objects[i].top;
      var tempScaleX = scaleX * (percentage / this.state.canvasScale);
      var tempScaleY = scaleY * (percentage / this.state.canvasScale);
      var tempLeft = left * (percentage / this.state.canvasScale);
      var tempTop = top * (percentage / this.state.canvasScale);
      objects[i].scaleX = tempScaleX;
      objects[i].scaleY = tempScaleY;
      objects[i].left = tempLeft;
      objects[i].top = tempTop;
      objects[i].setCoords();
    }
    this.setState({
      canvasScale: percentage,
    });
    canvas.renderAll();
  };
  removeObject = () => {
    var canvas = this.props.canvas;
    var activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    if (activeObject.type === "activeSelection") {
      activeObject.forEachObject(function (object) {
        canvas.remove(object);
      });
    } else {
      canvas.remove(activeObject);
    }
  };
  grpungrpItems() {
    var canvas = this.props.canvas;
    var actObj = canvas.getActiveObject();
    if (!actObj) {
      return false;
    }
    if (actObj.type === "group") {
      actObj.toActiveSelection();
    } else if (actObj.type === "activeSelection") {
      actObj.toGroup();
    }
    canvas.renderAll();
  }
  initKeyboardEvents = () => {
    let self = this;
    document.onkeyup = function (e) {
      e.preventDefault(); // Let's stop this event.
      e.stopPropagation(); // Really this time.
      if (e.which === 46) {
        self.removeObject();
      }
      if (e.ctrlKey && e.which === 90) {
        self.undo();
      }
      if (e.ctrlKey && e.which === 89) {
        self.redo();
      }
      if (e.which === 71) {
        //group / ungroup items
        self.grpungrpItems();
      }
    };
  };

  //piece of shit

  state = {
    value: "6",
    opacityval: "1",
    strokeval: "1",
    blurval: "1",
    glowcolor: "",
    offsetX: "1",
    offsetY: "1",
    activeFontFamily: "Open Sans",
    savestateaction: true,
    displayColorPicker: false,
    displaystrokeColorPicker: false,
    displayglowColorPicker: false,
    collapse: false,
    glowcollapse: false,
    styles: {
      position: "absolute",
      display: "none",
    },
  };
  componentDidMount() {}
  componentWillReceiveProps = (newprops) => {
    var canvas = this.props.state.canvas;
    if (canvas) {
      var activeObject = canvas.getActiveObject();
      var left = getOffset("main-canvas").left;
      var top = getOffset("main-canvas").top;
      if (activeObject) {
        this.setState({
          styles: {
            top: activeObject.top + top - 50,
            left:
              activeObject.left +
              left +
              (activeObject.width * activeObject.scaleX) / 2 +
              10,
            position: "fixed",
            display: "block",
            zIndex: 1000,
          },
        });
      } else {
        this.setState({
          styles: {
            display: "none",
          },
        });
      }
    }
  };
  setStyle = (styleName, value, o) => {
    if (o.setSelectionStyles && o.isEditing) {
      var style = {};
      style[styleName] = value;
      o.setSelectionStyles(style);
    } else {
      o.set(styleName, value);
    }
    o.setCoords();
  };
  setActiveStyle = (styleName, value) => {
    var canvas = this.props.state.canvas;
    var activeObject = canvas.getActiveObject();
    var self = this;
    if (!activeObject) return;
    if (activeObject.type === "activeSelection") {
      activeObject.forEachObject(function (o) {
        if (o.paths && o.paths.length > 0) {
          for (var i = 0; i < o.paths.length; i++) {
            var co = o.paths[i];
            self.setStyle(styleName, value, co);
          }
        }

        self.setStyle(styleName, value, o);
      });
    } else {
      if (activeObject.paths && activeObject.paths.length > 0) {
        for (var i = 0; i < activeObject.paths.length; i++) {
          var o = activeObject.paths[i];
          self.setStyle(styleName, value, o);
        }
      }
      self.setStyle(styleName, value, activeObject);
    }
    canvas.renderAll();
    saveCanvasState(canvas);
  };
  setTextFont = (fontfamily) => {
    this.setState({
      activeFontFamily: fontfamily,
    });
    this.setActiveStyle("fontFamily", fontfamily);
  };
  setTextBold = () => {
    var fontBoldValue =
      this.props.state.fontBoldValue === "normal" ? "bold" : "normal";
    this.setActiveStyle("fontWeight", fontBoldValue);
    this.props.state.fontBoldValue = fontBoldValue;
  };
  setTextItalic = () => {
    var fontItalicValue =
      this.props.state.fontItalicValue === "normal" ? "italic" : "normal";
    this.setActiveStyle("fontStyle", fontItalicValue);
    this.props.state.fontItalicValue = fontItalicValue;
  };
  setTextUnderline = () => {
    var fontUnderlineValue = !this.props.state.fontUnderlineValue
      ? "underline"
      : false;
    this.setActiveStyle("underline", fontUnderlineValue);
    this.props.state.fontUnderlineValue = fontUnderlineValue;
  };
  setActiveProp = (name, value) => {
    var canvas = this.props.state.canvas;
    var activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    if (activeObject.type === "activeSelection") {
      activeObject.forEachObject(function (object) {
        object.set(name, value).setCoords();
      });
    } else if (activeObject) {
      activeObject.set(name, value).setCoords();
    }
    canvas.renderAll();
    saveCanvasState(canvas);
  };
  alignObjectLeft = (value) => {
    this.setActiveProp("textAlign", "left");
  };
  alignObjectCenter = () => {
    this.setActiveProp("textAlign", "center");
  };
  alignObjectRight = () => {
    this.setActiveProp("textAlign", "right");
  };
  clearCanvas = () => {
    var canvas = this.props.state.canvas;
    canvas.clear();
  };
  deleteItem = () => {
    var canvas = this.props.state.canvas;
    var activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    if (activeObject.type === "activeSelection") {
      activeObject.forEachObject(function (object) {
        canvas.remove(object);
      });
    } else {
      canvas.remove(activeObject);
    }
  };
  setColor = (color) => {
    this.changeObjectColor(color.hex);
    ReactDOM.findDOMNode(this.refs.textcolor).style.background = color.hex;
  };
  pickerOpen = () => {
    this.setState({
      displayColorPicker: !this.state.displayColorPicker,
    });
  };
  pickerClose = () => {
    this.setState({
      displayColorPicker: false,
    });
  };
  strokepickerOpen = () => {
    this.setState({
      displaystrokeColorPicker: !this.state.displaystrokeColorPicker,
    });
  };
  strokepickerClose = () => {
    this.setState({
      displaystrokeColorPicker: false,
    });
  };
  glowpickerOpen = () => {
    this.setState({
      displayglowColorPicker: !this.state.displayglowColorPicker,
    });
  };
  glowpickerClose = () => {
    this.setState({
      displayglowColorPicker: false,
    });
  };
  setStroke = (color) => {
    this.setActiveStyle("stroke", color.hex);
    ReactDOM.findDOMNode(this.refs.textstrokecol).style.background = color.hex;
  };
  changeObjectColor = (hex) => {
    this.setActiveStyle("fill", hex);
  };
  fontSize = (event) => {
    this.setState({
      value: event.target.value,
    });
    this.setActiveStyle("fontSize", event.target.value);
  };
  clone = () => {
    var canvas = this.props.state.canvas;
    var activeObject = canvas.getActiveObject();
    if (!activeObject) return false;
    if (activeObject.type === "activeSelection") {
      activeObject.forEachObject((object) => {
        this.cloneSelObject(object);
      });
    } else {
      this.cloneSelObject(activeObject);
    }
  };
  cloneSelObject = (actobj) => {
    var canvas = this.props.state.canvas;
    canvas.discardActiveObject();
    if (fabric.util.getKlass(actobj.type).async) {
      var clone = fabric.util.object.clone(actobj);
      clone.set({
        left: actobj.left + 50,
        top: actobj.top + 50,
      });
      canvas.add(clone);
      saveCanvasState(canvas);
    } else {
      var clones = fabric.util.object.clone(actobj);
      canvas.add(
        clones.set({
          left: actobj.left + 50,
          top: actobj.top + 50,
        })
      );
      saveCanvasState(canvas);
    }
    canvas.requestRenderAll();
  };
  setOpacity = (event) => {
    this.setState({
      opacityval: event.target.value,
    });
    this.setActiveStyle("opacity", event.target.value / 100);
  };
  setStrokeval = (event) => {
    console.log(event.target.value);
    this.setState({
      strokeval: event.target.value,
    });
    this.setActiveStyle("strokeWidth", event.target.value * 1);
  };
  outlinetoggle = () => {
    this.setState({
      collapse: !this.state.collapse,
    });
  };
  setGlow = (color) => {
    ReactDOM.findDOMNode(this.refs.textglowcol).style.background = color.hex;
    this.setState({
      glowcolor: color.hex,
    });
    var canvas = this.props.state.canvas;
    var activeObject = canvas.getActiveObject();
    activeObject.setShadow({
      color: color.hex,
      blur: 1,
      offsetX: 1,
      offsetY: 1,
    });
    canvas.renderAll();
  };
  setglowblur = (event) => {
    this.setState({
      blurval: event.target.value,
    });
    var canvas = this.props.state.canvas;
    var activeObject = canvas.getActiveObject();
    activeObject.setShadow({
      blur: event.target.value,
      color: this.state.glowcolor,
      offsetX: this.state.offsetX,
      offsetY: this.state.offsetY,
    });
    canvas.renderAll();
  };
  setglowoffsetX = (event) => {
    this.setState({
      offsetX: event.target.value,
    });
    var canvas = this.props.state.canvas;
    var activeObject = canvas.getActiveObject();
    activeObject.setShadow({
      blur: this.state.blurval,
      color: this.state.glowcolor,
      offsetX: event.target.value,
      offsetY: "",
    });
    canvas.renderAll();
  };
  setglowoffsetY = (event) => {
    this.setState({
      offsetY: event.target.value,
    });
    var canvas = this.props.state.canvas;
    var activeObject = canvas.getActiveObject();
    activeObject.setShadow({
      blur: this.state.blurval,
      color: this.state.glowcolor,
      offsetX: this.state.offsetX,
      offsetY: event.target.value,
    });
    canvas.renderAll();
  };
  glowtoggle = () => {
    this.setState({
      glowcollapse: !this.state.glowcollapse,
    });
  };
  bringForward = () => {
    var canvas = this.props.state.canvas;
    var activeObject = canvas.getActiveObject();
    var grpobjs = canvas.getActiveObjects();
    if (grpobjs) {
      grpobjs.forEach((object) => {
        canvas.bringForward(object);
        canvas.renderAll();
        saveCanvasState(canvas);
      });
    } else {
      canvas.bringForward(activeObject);
      canvas.renderAll();
      saveCanvasState(canvas);
    }
  };
  sendBackward = () => {
    var canvas = this.props.state.canvas;
    var activeObject = canvas.getActiveObject();
    var grpobjs = canvas.getActiveObjects();
    if (grpobjs) {
      grpobjs.forEach((object) => {
        canvas.sendBackwards(object);
        canvas.renderAll();
        saveCanvasState(canvas);
      });
    } else {
      canvas.sendBackwards(activeObject);
      canvas.renderAll();
      saveCanvasState(canvas);
    }
  };

  //OEPOF

  render() {
    return (
      <div className="footer">
        {/* <Col xs={this.props.footercolsize}> */}
        <div className="undo-redo-buttons">
          <div title="Undo" className="undoicon" onClick={this.undo}>
            <div className="first">
              <span className="undo" alt="">
                <svg
                  width="15"
                  height="10"
                  viewBox="0 0 11 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.646446 3.64645C0.451184 3.84171 0.451184 4.15829 0.646446 4.35355L3.82843 7.53553C4.02369 7.7308 4.34027 7.7308 4.53553 7.53553C4.7308 7.34027 4.7308 7.02369 4.53553 6.82843L1.70711 4L4.53553 1.17157C4.7308 0.97631 4.7308 0.659728 4.53553 0.464466C4.34027 0.269203 4.02369 0.269203 3.82843 0.464465L0.646446 3.64645ZM11 3.5L1 3.5L1 4.5L11 4.5L11 3.5Z"
                    fill="#56B763"
                  />
                </svg>
              </span>
            </div>
            <div className="second">UNDO</div>
          </div>
          <div title="Redo" className="redoicon" onClick={this.redo}>
            <div className="first">
              <span className="redo" alt="">
                <svg
                  width="15"
                  height="10"
                  viewBox="0 0 11 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.3536 4.35355C10.5488 4.15829 10.5488 3.84171 10.3536 3.64645L7.17157 0.464466C6.97631 0.269204 6.65973 0.269204 6.46447 0.464466C6.2692 0.659728 6.2692 0.97631 6.46447 1.17157L9.29289 4L6.46447 6.82843C6.2692 7.02369 6.2692 7.34027 6.46447 7.53553C6.65973 7.7308 6.97631 7.7308 7.17157 7.53553L10.3536 4.35355ZM10 3.5L4.37114e-08 3.5L-4.37114e-08 4.5L10 4.5L10 3.5Z"
                    fill="#56B763"
                  />
                </svg>
              </span>
            </div>
            <div className="second">REDO</div>
          </div>
        </div>
        {/* </Col> */}
        {/* <Col xs="3">
            <div className="canvassize">
              {this.props.canvas ? (
                <span>
                  {parseInt(this.props.canvas.width, 10)} x{" "}
                  {parseInt(this.props.canvas.height, 10)} px
                </span>
              ) : (
                <span>640 x 360 px</span>
              )}
            </div>
          </Col> */}
        {/* <Col xs={this.props.footercolsize}>
            <div className="plus" title="Zoom In" onClick={this.zoomIn}>
              +
            </div>
            <div className="zoomval">
              <div className="select-container">
                <span className="select-arrow fa fa-chevron-down"></span>
                <select
                  className="zoom"
                  onChange={this.zoomToPercent}
                  value={this.state.canvasScale * 100}
                >
                  <option value="25">25%</option>
                  <option value="50">50%</option>
                  <option value="75">75%</option>
                  <option value="100">100%</option>
                </select>
              </div>
            </div>
            <div className="minus" title="Zoom Out" onClick={this.zoomOut}>
              -
            </div>
          </Col> */}
        {/* <Col className="button-share-footer"> */}
        <CTAButton text="SHARE" onClick={this.props.downloadPng} />
        {/* </Col> */}
        {/* <Col id="remove-button-span" xs="4"> */}
        <div className="remove-button-footer">
          <span onClick={this.deleteItem} className="drawer-remove-icon">
            <svg
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.875 6.875C6.04076 6.875 6.19973 6.94085 6.31694 7.05806C6.43415 7.17527 6.5 7.33424 6.5 7.5V15C6.5 15.1658 6.43415 15.3247 6.31694 15.4419C6.19973 15.5592 6.04076 15.625 5.875 15.625C5.70924 15.625 5.55027 15.5592 5.43306 15.4419C5.31585 15.3247 5.25 15.1658 5.25 15V7.5C5.25 7.33424 5.31585 7.17527 5.43306 7.05806C5.55027 6.94085 5.70924 6.875 5.875 6.875ZM9 6.875C9.16576 6.875 9.32473 6.94085 9.44194 7.05806C9.55915 7.17527 9.625 7.33424 9.625 7.5V15C9.625 15.1658 9.55915 15.3247 9.44194 15.4419C9.32473 15.5592 9.16576 15.625 9 15.625C8.83424 15.625 8.67527 15.5592 8.55806 15.4419C8.44085 15.3247 8.375 15.1658 8.375 15V7.5C8.375 7.33424 8.44085 7.17527 8.55806 7.05806C8.67527 6.94085 8.83424 6.875 9 6.875ZM12.75 7.5C12.75 7.33424 12.6842 7.17527 12.5669 7.05806C12.4497 6.94085 12.2908 6.875 12.125 6.875C11.9592 6.875 11.8003 6.94085 11.6831 7.05806C11.5658 7.17527 11.5 7.33424 11.5 7.5V15C11.5 15.1658 11.5658 15.3247 11.6831 15.4419C11.8003 15.5592 11.9592 15.625 12.125 15.625C12.2908 15.625 12.4497 15.5592 12.5669 15.4419C12.6842 15.3247 12.75 15.1658 12.75 15V7.5Z"
                fill="#56B763"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M17.125 3.75C17.125 4.08152 16.9933 4.39946 16.7589 4.63388C16.5245 4.8683 16.2065 5 15.875 5H15.25V16.25C15.25 16.913 14.9866 17.5489 14.5178 18.0178C14.0489 18.4866 13.413 18.75 12.75 18.75H5.25C4.58696 18.75 3.95107 18.4866 3.48223 18.0178C3.01339 17.5489 2.75 16.913 2.75 16.25V5H2.125C1.79348 5 1.47554 4.8683 1.24112 4.63388C1.0067 4.39946 0.875 4.08152 0.875 3.75V2.5C0.875 2.16848 1.0067 1.85054 1.24112 1.61612C1.47554 1.3817 1.79348 1.25 2.125 1.25H6.5C6.5 0.918479 6.6317 0.600537 6.86612 0.366117C7.10054 0.131696 7.41848 0 7.75 0L10.25 0C10.5815 0 10.8995 0.131696 11.1339 0.366117C11.3683 0.600537 11.5 0.918479 11.5 1.25H15.875C16.2065 1.25 16.5245 1.3817 16.7589 1.61612C16.9933 1.85054 17.125 2.16848 17.125 2.5V3.75ZM4.1475 5L4 5.07375V16.25C4 16.5815 4.1317 16.8995 4.36612 17.1339C4.60054 17.3683 4.91848 17.5 5.25 17.5H12.75C13.0815 17.5 13.3995 17.3683 13.6339 17.1339C13.8683 16.8995 14 16.5815 14 16.25V5.07375L13.8525 5H4.1475ZM2.125 3.75V2.5H15.875V3.75H2.125Z"
                fill="#56B763"
              />
            </svg>
          </span>
          <span onClick={this.deleteItem} id="remove-button-drawer">
            REMOVE
          </span>
        </div>
        {/* </Col> */}
      </div>
    );
  }
}

export default Footer;
