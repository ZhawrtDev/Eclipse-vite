import React, { useState } from "react";
import "./styles.css";
import logo from "../../assets/eclipse.png";
import Robux from "../../assets/Robux.png";
import Background from "../../assets/background.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faDiscord, faWindows } from "@fortawesome/free-brands-svg-icons";

function Home() {
  const [activeTab, setActiveTab] = useState("money");

  return (
    <div className="main">
      {/* <div className="cabecario">
        <div
          className="profile a"
          style={{ borderRight: "1px solid #232323d6" }}
        >
          <div className="box-img">
            <FontAwesomeIcon icon={faLayerGroup} size="2x" />
          </div>
          <div className="text">
            <p>ServerSide.</p>
            <h1>RYZEON</h1>
          </div>
        </div>

        <div className="profile">
          <div className="box-img">
            <img src={logo} className="logo" />
          </div>
          <div className="text">
            <p>ServerSide.</p>
            <h1>ECLIPSE</h1>
          </div>
        </div>
      </div> */}
      <div className="b-effect"></div>

      {/* CABEÇARIO */}
      <div className="effect"></div>
      <div className="cabecario">
        <div className="logo">
          <img src={logo} alt="logo" />
          <h1>ECLIPSE</h1>
        </div>

        <div className="nav">
          <div className="lnk a">Home</div>
          <div className="lnk">Pricing</div>
          <div className="lnk">Info</div>
        </div>

        <div className="touchs">
          <a
            href="https://discord.gg/hnxYDYVvfB"
            target="_blank"
            rel="noopener noreferrer"
            className="touch"
            style={{ marginRight: "10px" }}
          >
            <FontAwesomeIcon
              icon={faDiscord}
              style={{ marginRight: 10, color: "#fff" }}
            />
            <p>Discord</p>
          </a>
          <a
            href="http://serverside.ltd/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="touch a"
          >
            <p>Login</p>
          </a>
        </div>
      </div>

      {/* INICIO */}
      <div className="inicio">
        <div className="inform">
          <h2>
            CHOOSE RIGHT THIS TIME<span>!</span>
          </h2>
          <h1>
            Not All ServerSides Are Equal{" "}
            <span className="s2">Make The Right Pick</span>
          </h1>
          <div className="content-p">
            <FontAwesomeIcon
              icon={faWindows}
              style={{
                fontSize: 50,
                marginRight: 20,
                opacity: 0.4,
                color: "#2563EB",
              }}
            />
            <p>
              This server allows you to <span>take full control</span> of the
              infected game, wherever it is hosted. You can{" "}
              <span>run your own scripts</span> directly from the{" "}
              <span>server</span>, just enter it once and you're done. Use it to{" "}
              <span>spawn items</span>, <span>get tools</span>,{" "}
              <span>kick players</span>,<span>run admin commands</span> or
              anything else you want. It runs <span>silently</span> and gives
              you
              <span> full access to the server</span>. <span>Fast</span>,{" "}
              <span>easy to use</span> and
              <span> completely under your control</span>.
            </p>
          </div>

          <div className="whv-main">
            <div className="box">
              <h1>300+</h1>
              <p>Games Logged</p>
            </div>

            <div className="box">
              <h1>98%</h1>
              <p>Games Logged</p>
            </div>

            <div className="box">
              <h1>100+</h1>
              <p>Scripts Executed</p>
            </div>

            <div className="box" style={{ borderRight: 0 }}>
              <h1>10+</h1>
              <p>Scripts Library</p>
            </div>
          </div>

          <div className="touchs">
            <div
              className={`touch ${activeTab === "money" ? "a" : ""}`}
              onClick={() => setActiveTab("money")}
              style={{ marginRight: "10px" }}
            >
              Pay With Money
            </div>
            <div
              className={`touch ${activeTab === "robux" ? "a" : ""}`}
              onClick={() => setActiveTab("robux")}
            >
              Pay With Robux
            </div>
          </div>

          <div className="pricing">
            {activeTab === "money" && (
              <div className="money">
                <div className="box">
                  <div className="text">
                    <div className="header">
                      <h3>Standard</h3>
                    </div>
                    <h2>
                      <span>£5</span> /For Ever
                    </h2>
                    <p>
                      This product is available for a one-time payment, granting
                      lifetime access with no recurring fees. Enjoy all features
                      and future updates at no additional cost. It's a long-term
                      investment.
                    </p>
                  </div>

                  <div className="box-product">
                    <div className="item">
                      <div className="icon">
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ color: "#333333" }}
                        />
                      </div>
                      <p>Basic administrative controls</p>
                    </div>

                    <div className="item">
                      <div className="icon">
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ color: "#333333" }}
                        />
                      </div>
                      <p>Access to supported games</p>
                    </div>

                    <div className="item">
                      <div className="icon">
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ color: "#333333" }}
                        />
                      </div>
                      <p>Standard script execution</p>
                    </div>

                    <div className="item">
                      <div className="icon">
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ color: "#333333" }}
                        />
                      </div>
                      <p>Basic features</p>
                    </div>

                    <div className="item">
                      <div className="icon">
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ color: "#333333" }}
                        />
                      </div>
                      <p>Community support</p>
                    </div>

                    <div className="item">
                      <div className="icon">
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ color: "#333333" }}
                        />
                      </div>
                      <p>Regular updates</p>
                    </div>
                  </div>

                  <a
                    href="https://eclipseutilities.bgng.io/product/standardeclipse"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="buy"
                  >
                    Purchase
                  </a>
                </div>

                <div className="box a">
                  <div className="text">
                    <div className="header">
                      <h3>Premium</h3>

                      <div className="most">Most Popular</div>
                    </div>
                    <h2>
                      <span>£10</span> /For Ever
                    </h2>
                    <p>
                      This product is available for a one-time payment, granting
                      lifetime access with no recurring fees. Enjoy all features
                      and future updates at no additional cost. It's a long-term
                      investment.
                    </p>
                  </div>

                  <div className="box-product">
                    <div className="item">
                      <div className="icon">
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ color: "#333333" }}
                        />
                      </div>
                      <p>Advanced administrative controls</p>
                    </div>

                    <div className="item">
                      <div className="icon">
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ color: "#333333" }}
                        />
                      </div>
                      <p>Priority script execution</p>
                    </div>

                    <div className="item">
                      <div className="icon">
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ color: "#333333" }}
                        />
                      </div>
                      <p>Standard script execution</p>
                    </div>

                    <div className="item">
                      <div className="icon">
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ color: "#333333" }}
                        />
                      </div>
                      <p>Extended features</p>
                    </div>

                    <div className="item">
                      <div className="icon">
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ color: "#333333" }}
                        />
                      </div>
                      <p>Priority support</p>
                    </div>

                    <div className="item">
                      <div className="icon">
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ color: "#333333" }}
                        />
                      </div>
                      <p>Early access to updates</p>
                    </div>
                  </div>

                  <a
                    href="https://eclipseutilities.bgng.io/product/premiumeclipse"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="buy"
                  >
                    Purchase
                  </a>
                </div>
              </div>
            )}

            {activeTab === "robux" && (
              <div className="robux">
                <div className="box">
                  <div className="text">
                    <div className="header">
                      <h3>Standard</h3>
                    </div>
                    <h2>
                      <img style={{ width: 50 }} src={Robux} />{" "}
                      <span>1500</span> /For Ever
                    </h2>
                    <p>
                      This product is available for a one-time payment, granting
                      lifetime access with no recurring fees. Enjoy all features
                      and future updates at no additional cost. It's a long-term
                      investment.
                    </p>
                  </div>

                  <div className="box-product">
                    <div className="item">
                      <div className="icon">
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ color: "#333333" }}
                        />
                      </div>
                      <p>Basic administrative controls</p>
                    </div>

                    <div className="item">
                      <div className="icon">
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ color: "#333333" }}
                        />
                      </div>
                      <p>Access to supported games</p>
                    </div>

                    <div className="item">
                      <div className="icon">
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ color: "#333333" }}
                        />
                      </div>
                      <p>Standard script execution</p>
                    </div>

                    <div className="item">
                      <div className="icon">
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ color: "#333333" }}
                        />
                      </div>
                      <p>Basic features</p>
                    </div>

                    <div className="item">
                      <div className="icon">
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ color: "#333333" }}
                        />
                      </div>
                      <p>Community support</p>
                    </div>

                    <div className="item">
                      <div className="icon">
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ color: "#333333" }}
                        />
                      </div>
                      <p>Regular updates</p>
                    </div>
                  </div>

                  <a
                    href="https://www.roblox.com/pt/catalog/112949849895642/Byefron-Standard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="buy"
                  >
                    Purchase
                  </a>
                </div>

                <div className="box a">
                  <div className="text">
                    <div className="header">
                      <h3>Premium</h3>

                      <div className="most">Most Popular</div>
                    </div>
                    <h2>
                      <img style={{ width: 50 }} src={Robux} />{" "}
                      <span style={{ fontSize: "60px" }}>3000</span> /For Ever
                    </h2>
                    <p>
                      This product is available for a one-time payment, granting
                      lifetime access with no recurring fees. Enjoy all features
                      and future updates at no additional cost. It's a long-term
                      investment.
                    </p>
                  </div>

                  <div className="box-product">
                    <div className="item">
                      <div className="icon">
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ color: "#333333" }}
                        />
                      </div>
                      <p>Advanced administrative controls</p>
                    </div>

                    <div className="item">
                      <div className="icon">
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ color: "#333333" }}
                        />
                      </div>
                      <p>Priority script execution</p>
                    </div>

                    <div className="item">
                      <div className="icon">
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ color: "#333333" }}
                        />
                      </div>
                      <p>Standard script execution</p>
                    </div>

                    <div className="item">
                      <div className="icon">
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ color: "#333333" }}
                        />
                      </div>
                      <p>Extended features</p>
                    </div>

                    <div className="item">
                      <div className="icon">
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ color: "#333333" }}
                        />
                      </div>
                      <p>Priority support</p>
                    </div>

                    <div className="item">
                      <div className="icon">
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ color: "#333333" }}
                        />
                      </div>
                      <p>Early access to updates</p>
                    </div>
                  </div>

                  <a
                    href="https://www.roblox.com/pt/catalog/102872228150886/Byefron-Premium"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="buy"
                  >
                    Purchase
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
