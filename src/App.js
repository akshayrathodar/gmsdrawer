// File Imports
import React, { Component } from "react";
import FabricCanvas from "./components/FabricCanvas";
import { Row, Col, Container, Collapse } from "reactstrap";
import { Tabs, Tab, TabList } from "react-web-tabs";
import LeftPanel from "./components/LeftPanel";
import Footer from "./components/Footer";
import Settings from "./components/Settings";
import { fabric } from "fabric";
import "./App.css";
import Header from "./components/Header";
const { v4: uuidv4 } = require("uuid");
const { default: axios } = require("axios");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvas: null,
      isSnap: false,
      isOverlap: false,
      isGrid: false,
      canvaswidth: 700,
      canvasheight: 500,
      // defaultbg: require("./images/img/main-img.jpg"),
      fontBoldValue: "normal",
      fontItalicValue: "",
      fontUnderlineValue: "",
      collapse: true,
      leftcolsize: 3,
      rightcolsize: 9,
      footercolsize: 3,
      toggleleft: "0px",
      gridsize: 30,
      showSettings: false,
    };
  }

  onChangeHandler = (e) => {
    console.log(e.target.name);
    this.setState({ [e.target.name]: e.target.value });
    console.log(this.state.canvaswidth, this.state.canvasheight);
  };

  updateCanvas = (canvas) => {
    this.setState({
      canvas: canvas,
    });
    this.setState({
      toggleleft:
        document.getElementsByClassName("tabpanel")[0].clientWidth + "px",
    });
  };
  updateState = (stateoptions) => {
    this.setState(stateoptions);
  };
  toggleSettings = () => {
    console.log("toggleSettings", this.state.showSettings);
    this.setState((state) => ({
      showSettings: !state.showSettings,
    }));
  };
  toggleSidebar = () => {
    // this.setState(state => ({
    //   collapse: !state.collapse
    // }));
    // if (this.state.collapse) {
    //   this.setState({
    //     leftcolsize: 1,
    //     rightcolsize: 11,
    //     footercolsize: 4
    //   });
    // }
    // else {
    //   this.setState({
    //     leftcolsize: 3,
    //     rightcolsize: 9,
    //     footercolsize: 3
    //   });
    // }
    const self = this;
    setTimeout(function () {
      self.setState({
        toggleleft:
          document.getElementsByClassName("tabpanel")[0].clientWidth + "px",
      });
    }, 5);
  };
  async downloadAsPNG() {
    const currentTime = new Date();
    const month = currentTime.getMonth() + 1;
    const day = currentTime.getDate();
    const year = currentTime.getFullYear();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    let fileName = 'GMS_card';
    const canvasdata = document.getElementById("main-canvas");
    // console.log(canvasdata)
    const link = document.createElement("a");
    const canvasDataUrl = canvasdata.toDataURL();

    fileName = fileName + ".png";
    link.setAttribute("href", canvasDataUrl);
    link.setAttribute("crossOrigin", "anonymous");
    link.setAttribute("target", "_blank");
    link.setAttribute("download", fileName);
    // console.log(link)
    if (document.createEvent) {
      const evtObj = document.createEvent("MouseEvents");
      evtObj.initEvent("click", true, true);
      // console.log(canvasDataUrl)

      localStorage.setItem("canva", canvasDataUrl);

      const imgId = uuidv4();
      const reqBody = {
        id: imgId,
        base64Url: canvasDataUrl,
      };
      const reqConfig = {
        headers: {
          accept: "text/html, application/json",
        },
      };

      const splittedUrl = window.location.href.split("/");
      const languageUrl = splittedUrl[splittedUrl.length - 1];

      try {
        axios
          .post(`http://localhost:8000/saveurl`, reqBody, reqConfig)
          .then(() =>
            window.location.replace(
              `http://localhost:3000/#/share/${'en'}/${imgId}`
            )
          );
      } catch (error) {
        console.log(error);
      }
    }
  }

  downloadAsJSON = () => {
    const currentTime = new Date();
    const month = currentTime.getMonth() + 1;
    const day = currentTime.getDate();
    const year = currentTime.getFullYear();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    const fileName = month + "" + day + "" + year + "" + hours + "" + minutes + "" + seconds;
    const canvasdata = this.state.canvas.toDatalessJSON();
    const string = JSON.stringify(canvasdata);
    const file = new Blob([string], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  setSnap = () => {
    this.setState({
      isSnap: !this.state.isSnap,
    });
    const offstate = document.querySelectorAll("#snapswitch");
    for (let j = 0; j < offstate.length; j++) {
      offstate[j].checked = this.state.isSnap;
    }
  };
  showhideGrid = () => {
    const isGrid = !this.state.isGrid;
    this.setState({
      isGrid: isGrid,
    });
    if (isGrid) {
      for (let i = 0; i < 650 / this.state.gridsize; i++) {
        this.state.canvas.add(
          new fabric.Line(
            [i * this.state.gridsize, 0, i * this.state.gridsize, 650],
            {
              stroke: "#ccc",
              selectable: false,
            }
          )
        );
        this.state.canvas.add(
          new fabric.Line(
            [0, i * this.state.gridsize, 650, i * this.state.gridsize],
            {
              stroke: "#ccc",
              selectable: false,
            }
          )
        );
      }
    } else {
      this.clearGrid();
    }
    const offstate = document.querySelectorAll("#gridswitch");
    for (let j = 0; j < offstate.length; j++) {
      offstate[j].checked = this.state.isGrid;
    }
    this.state.canvas.renderAll();
  };
  clearGrid = () => {
    const objects = this.state.canvas.getObjects("line");
    for (let i in objects) {
      this.state.canvas.remove(objects[i]);
    }
  };
  setOverlap = () => {
    this.setState({
      isOverlap: !this.state.isOverlap,
    });
    const offoverlap = document.querySelectorAll("#overlapswitch");
    for (let j = 0; j < offoverlap.length; j++) {
      offoverlap[j].checked = this.state.isOverlap;
    }
  };

  render() {
    return (
      <div>
        <Header />
        <Container fluid={true}>
          <Settings
            show={this.state.showSettings}
            close={this.toggleSettings}
            changeHandler={this.onChangeHandler}
            value={this.state.canvasheight}
          />

          {/* <Row className="bottomborder">
          <Col xs="3">
            <div className="left-link"><a href="#" className="nav-link">Design your postcard</a></div>
          </Col>
        </Row> */}

          <Row>
            <Col xs="8">
              {/* <Row>
              <Col>
                <Toolbar state={this.state} />
              </Col>
            </Row> */}
              {/* <Row>
                <Col xs={this.state.leftcolsize}></Col>
                <Col xs="5">
                  <Footer
                    downloadPng={this.downloadAsPNG}
                    state={this.state}
                    canvas={this.state.canvas}
                    footercolsize={this.state.footercolsize}
                  />
                </Col>
              </Row> */}
              <Row>
                <Col>
                  <FabricCanvas
                    state={this.state}
                    updateCanvas={this.updateCanvas}
                    updateState={this.updateState}
                  />
                </Col>
              </Row>
              <div className="hepler-div">
                <Footer
                  downloadPng={this.downloadAsPNG}
                  state={this.state}
                  canvas={this.state.canvas}
                />
              </div>
            </Col>
            <Col xs="4" className="tabpanel">
              <Tabs
                defaultTab="vertical-tab-three"
                horizontal
                className="vertical-tabs"
              >
                <TabList>
                  <Tab
                    onClick={this.toggleSidebar}
                    tabFor="vertical-tab-three"
                    className="lasttab"
                  >
                    <div className="edit-box2">
                      <div className="image-icon">
                        <img
                          className="tab-image"
                          style={{ height: "35px" }}
                          src={require("./images/img/gms-13.png")}
                        />
                      </div>
                      <span>Elements</span>
                    </div>
                  </Tab>
                  <Tab
                    onClick={this.toggleSidebar}
                    tabFor="vertical-tab-four"
                    className="lasttab"
                  >
                    <div className="edit-box3">
                      <div className="image-icon">
                        <img
                          className="tab-image"
                          style={{ height: "35px" }}
                          src={require("./images/img/gms-14.png")}
                        />
                      </div>
                      <span>Text</span>
                    </div>
                  </Tab>
                  <Tab
                    onClick={this.toggleSidebar}
                    tabFor="vertical-tab-two"
                    className="lasttab"
                  >
                    <div className="edit-box1">
                      <div className="image-icon">
                        <img
                          className="tab-image"
                          style={{ height: "35px" }}
                          src={require("./images/img/gms-26.png")}
                        />
                      </div>
                      <span>Cards</span>
                    </div>
                  </Tab>
                  {/* TRANSFER FUNCTIONAL TO BOTTOM */}
                  {/* <Tab
                  onClick={() => this.downloadAsPNG()}
                  tabFor="vertical-tab-four"
                  className="lasttab"
                >
                  <div>
                    <span>SHARE</span>
                  </div>
                </Tab> */}
                </TabList>
                <Collapse isOpen={this.state.collapse}>
                  <LeftPanel canvas={this.state.canvas} />
                </Collapse>
              </Tabs>
            </Col>
          </Row>
          {/* <Row>
            <Col xs={this.state.leftcolsize}></Col>
            <Col xs="5">
              <Footer
                downloadPng={this.downloadAsPNG}
                state={this.state}
                canvas={this.state.canvas}
                footercolsize={this.state.footercolsize}
              />
            </Col>
          </Row> */}
        </Container>
      </div>
    );
  }
}

export default App;
