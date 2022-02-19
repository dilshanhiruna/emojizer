import React, { useState } from "react";
import nodeEmoji from "node-emoji";
import pluralize from "pluralize";
import ReactTooltip from "react-tooltip";
import Switch from "react-switch";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const Emojizer = () => {
  const [text, setText] = useState("");
  const [emojized, setEmojized] = useState([]);
  const [advanceMode, setadvanceMode] = useState(false);
  const [removeMode, setremoveMode] = useState(false);
  const [fontSize, setfontSize] = useState(20);

  const EmojizeText = () => {
    var words = [];
    if (text.length > 0) {
      words = text.trim().replace(/,/, "").split(/\s+/);

      //get words from words array and replace with emojis
      var emojizedWords = words.map((word) => {
        var emoji = nodeEmoji.find(pluralize.singular(word));
        if (emoji) {
          return { word: word, emoji: emoji.emoji };
        } else {
          var similarEmoji = nodeEmoji.search(word);
          if (similarEmoji.length > 0 && advanceMode) {
            return { word: word, emoji: similarEmoji.pop().emoji };
          } else {
            return { word: word, emoji: "" };
          }
        }
      });
      setEmojized(emojizedWords);
    }
  };

  const [selectedKey, setselectedKey] = useState("");
  const [currentIndex, setcurrentIndex] = useState(0);

  const ChangeEmoji = (key, word) => {
    var similarEmoji = nodeEmoji.search(pluralize.singular(word));

    if (similarEmoji.length > 0) {
      if (selectedKey === key) {
        if (currentIndex >= similarEmoji.length) {
          const newArray = [...emojized];
          newArray[key].emoji = "";
          setEmojized(newArray);
          setcurrentIndex(0);
        } else {
          const newArray = [...emojized];
          newArray[key].emoji = similarEmoji[currentIndex].emoji;
          setEmojized(newArray);
          setcurrentIndex(currentIndex + 1);
        }
      } else {
        const newArray = [...emojized];
        newArray[key].emoji = similarEmoji[0].emoji;
        setEmojized(newArray);

        setcurrentIndex(currentIndex + 1);
        setselectedKey(key);
      }
    }
  };

  const handleChangeAdvanceSwitch = (nextChecked) => {
    setadvanceMode(nextChecked);
  };
  const handleChangeRemoveSwitch = (nextChecked) => {
    setremoveMode(nextChecked);
  };

  const removeWord = (key) => {
    setEmojized(emojized.filter((word, index) => index !== key));
  };

  function copyText() {
    var text = Object.entries(emojized).map((word, key) => {
      return word[1].emoji ? word[1].emoji : word[1].word;
    });
    navigator.clipboard.writeText(text.join(" "));
  }

  return (
    <div className="container">
      <h1 className="title">Em😎jizer</h1>
      <div>
        <ReactTooltip effect="solid" />
        <div>
          <textarea
            className="text-area"
            name="text"
            onChange={(e) => {
              setText(e.target.value);
            }}
            maxLength="1000"
          ></textarea>
        </div>
        <div className="controls">
          <div className="switch-controls-div">
            <div className="switchControls">
              <span>Advance mode</span>
              <Switch
                onChange={handleChangeAdvanceSwitch}
                checked={advanceMode}
              />
            </div>
            <div className="switchControls">
              <span>Remove mode</span>
              <Switch
                onChange={handleChangeRemoveSwitch}
                checked={removeMode}
                onColor="#ff0d1d"
                disabled={emojized.length === 0}
              />
            </div>
          </div>
          <div className="fontSize-slider">
            <span>Font Size {fontSize}</span>
            <Slider
              min={10}
              max={30}
              defaultValue={20}
              startPoint={20}
              onChange={(e) => setfontSize(e)}
              trackStyle={{ backgroundColor: "green" }}
            />
          </div>
          <div className="btn-group">
            <button className="fill" onClick={copyText}>
              copy
            </button>
            <button className="fill2" onClick={EmojizeText}>
              emojize
            </button>
          </div>
        </div>
        <hr className="hr-line" />

        <div className="output-container">
          <p style={{ fontSize: "12px" }} hidden={emojized.length === 0}>
            click on emojis to toggle
          </p>
          {Object.entries(emojized).map((word, key) => {
            return word[1].emoji ? (
              <div
                className={
                  "word-box" + (removeMode ? " shake-slow word-box-remove" : "")
                }
                key={key}
                onClick={() => {
                  removeMode ? removeWord(key) : ChangeEmoji(key, word[1].word);
                }}
                style={{
                  border: !removeMode ? "1px solid #c9c9c9" : "",
                  fontSize: fontSize + "px",
                }}
              >
                <span data-tip={word[1].word}> {word[1].emoji}</span>
              </div>
            ) : (
              <div
                className={
                  "word-box" + (removeMode ? " shake-slow word-box-remove" : "")
                }
                key={key}
                onClick={() => {
                  removeMode ? removeWord(key) : ChangeEmoji(key, word[1].word);
                }}
                style={{
                  fontSize: fontSize + "px",
                }}
              >
                {word[1].word}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Emojizer;
