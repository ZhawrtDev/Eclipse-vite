import React, { useEffect, useState } from "react";
import "./styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

const Popup = ({ error, text, trigger }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (trigger) {
      setVisible(true);
    }
  }, [trigger]);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <div className={`mainPopup ${visible ? "show" : ""}`}>
      <div className={`popup-container ${error ? "error" : "success"}`}>
        <div className="icon">
          <FontAwesomeIcon
            icon={error ? faCircleXmark : faCheck}
            style={{ fontSize: "1.2rem", color: `${error ? "#B20000" : "#228b22"}` }}
          />
        </div>

        <div className="text">
          <p>
            <span className="popup-status">{error ? "Error" : "Success"}</span> {text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Popup;
