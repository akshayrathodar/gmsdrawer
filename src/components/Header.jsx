import React, { useState, useEffect } from "react";
import "./Header.css";
// import { languageStore } from "../redux/store/store";
// import {
//   changeLanguage
// } from "../redux/action/languageActions";

const Header = (props) => {
  const lang = "uk";
  // const [lang, setLang] = useState(languageStore.getState());

  // useEffect(() => {
  //   if (props.currentLanguage) {
  //     setLang(props.currentLanguage);
  //   }
  // }, []);

  // const handleLangChange = (languageСode) => {
  //   setLang(languageСode);
  //   changeLanguage(languageСode);
  //   props.elementLanguageSetState(languageСode);
  // };

  return (
    <div className="header">
      <div className="logo">
        <svg
          width="135"
          height="45"
          viewBox="0 0 135 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 22.5C0 35.1999 9.80013 45 22.5 45C35.1999 45 45 35.1999 45 22.5C45 9.80013 35.1999 0 22.5 0C9.80013 0 0 9.80013 0 22.5Z"
            fill="#56B763"
          />
          <path
            d="M45 22.5C45 35.1999 54.8001 45 67.5 45C80.1999 45 90 35.1999 90 22.5C90 9.80013 80.1999 0 67.5 0C54.8001 0 45 9.80013 45 22.5Z"
            fill="#56B763"
          />
          <path
            d="M90 22.5C90 35.1999 99.8001 45 112.5 45C125.2 45 135 35.1999 135 22.5C135 9.80013 125.2 0 112.5 0C99.8001 0 90 9.80013 90 22.5Z"
            fill="#56B763"
          />
          <path
            d="M111.535 24.2873C103.846 23.0389 103.279 19.9462 103.279 18.0452C103.279 12.3989 110.684 12.1436 111.904 12.1436C115.905 12.1436 119.225 13.619 120.587 14.8958V21.1095H120.388C118.061 16.513 113.862 15.9739 111.507 15.9739C110.032 15.9739 107.705 16.1442 107.705 18.0452C107.705 19.5206 109.351 19.9462 113.465 20.6272C121.154 21.8756 121.721 25.0534 121.721 26.9544C121.721 32.6007 114.316 32.856 113.096 32.856C108.755 32.856 105.776 31.2955 104.414 29.962V23.7482H104.612C106.939 28.4582 111.053 29.0257 113.493 29.0257C114.969 29.0257 117.295 28.8554 117.295 26.9544C117.295 25.479 115.65 24.9683 111.535 24.2873Z"
            fill="white"
          />
          <path
            d="M67.642 31.3808L70.4793 12.5693H79.0764V32.4306H74.9907V13.988H74.5934L71.4724 32.4306H63.5279L60.4068 13.988H60.0096V32.4306H55.9238V12.5693H64.5209L67.3582 31.3808H67.642Z"
            fill="white"
          />
          <path
            d="M22.6701 24.9399H30.6997V25.2236C28.9406 27.4084 25.9047 28.6568 22.4715 28.6568C18.5276 28.6568 15.8605 25.9613 15.8605 22.4998C15.8605 19.0383 18.5276 16.3428 22.4715 16.3428C25.6493 16.3428 28.2313 17.6196 29.6783 20.4569H29.9053V14.2715C27.8057 12.6826 25.1386 12.1436 22.6701 12.1436C16.0591 12.1436 11.3208 16.6549 11.3208 22.4998C11.3208 28.3447 16.0591 32.856 22.6701 32.856C26.4721 32.856 29.5932 31.5792 31.4091 29.962V21.1095H22.6701V24.9399Z"
            fill="white"
          />
        </svg>
      </div>
      <div
        className="lang-switcher"
        style={{
          height: "20px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          // onClick={() => handleLangChange("en")}
          className="lang"
          style={{
            color: lang === "en" ? "#56b763" : "#7d8985",
            fontWeight: lang === "en" ? "bold" : "normal",
          }}
        >
          ENG
        </button>
        <p
          className="lang"
          style={{
            color: "#7d8985",
          }}
        >
          &nbsp;/&nbsp;
        </p>
        <button
          // onClick={() => handleLangChange("uk")}
          className="lang"
          style={{
            color: lang === "uk" ? "#56b763" : "#7d8985",
            fontWeight: lang === "uk" ? "bold" : "normal",
          }}
        >
          UKR
        </button>
      </div>
    </div>
  );
};

export default Header;
