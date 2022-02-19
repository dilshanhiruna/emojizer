import React, { useState } from "react";
import nodeEmoji from "node-emoji";
import pluralize from "pluralize";
import ReactTooltip from "react-tooltip";
import Switch from "react-switch";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const Emojizer = () => {
  const [text, setText] = useState(
    "I am in my car, confused about whether I will be on time. The train was delayed and I was running away from the police man It's ok now though. Please phone me later, maybe we can have a pizza tonight while watching tv"
  );
  const [emojized, setEmojized] = useState("");
  const [advanceMode, setadvanceMode] = useState(false);
  const [removeMode, setremoveMode] = useState(false);
  const [advanceEdit, setadvanceEdit] = useState(false);
  const [fontSize, setfontSize] = useState(20);

  /**
   * @description: This function is used to emojize the text
   */
  const EmojizeText = () => {
    var words = [];
    if (text.length > 0) {
      words = text
        .trim()
        .replace(/[^0-9a-z ]/gi, "")
        .split(/\s+/);

      //get words from words array and replace with emojis
      var emojizedWords = words.map((word) => {
        var singularWord = pluralize.singular(word);
        //make the word singular and find the excat matching emoji
        var emoji = nodeEmoji.find(singularWord);

        if (emoji) {
          return {
            word: word,
            emoji: emoji.emoji,
            advance: false,
            emojiCount: 1,
          };
        } else {
          var similarEmoji = nodeEmoji.search(singularWord);
          if (similarEmoji.length > 0 && advanceMode) {
            //return the last emoji if there are more than one
            return {
              word: word,
              emoji: similarEmoji.pop().emoji,
              advance: true,
              emojiCount: similarEmoji.length,
            };
          } else {
            return { word: word, emoji: "", advance: false, emojiCount: 0 };
          }
        }
      });
      setEmojized(emojizedWords);
    }
  };

  const [selectedKey, setselectedKey] = useState("");
  const [currentIndex, setcurrentIndex] = useState(0);

  /**
   * @description This function is used to toggle between multiple emojis
   * @param {*} key word array index
   * @param {*} word word
   */
  const ChangeEmoji = (key, word) => {
    //get similar emojis
    var similarEmoji = nodeEmoji.search(pluralize.singular(word));

    if (similarEmoji.length > 0) {
      //if changing the previous change emoji
      if (selectedKey === key) {
        if (currentIndex >= similarEmoji.length) {
          //display the emoji word
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

  const advanceEmojiChange = (index, word, emoji) => {
    if (emoji !== "") {
      const newArray = [...emojized];
      newArray[index].emoji = emoji.emoji;
      setEmojized(newArray);
    } else {
      const newArray = [...emojized];
      newArray[index].emoji = "";
      setEmojized(newArray);
    }
  };

  const handleChangeAdvanceSwitch = (nextChecked) => {
    setadvanceMode(nextChecked);
  };
  const handleChangeAdvanceEditSwitch = (nextChecked) => {
    setadvanceEdit(nextChecked);
    setremoveMode(false);
  };
  const handleChangeRemoveSwitch = (nextChecked) => {
    setremoveMode(nextChecked);
  };

  /**
   * @description: This function is used remove the selected emoji
   * @param {*} key word array index
   */
  const removeWord = (key) => {
    setEmojized(emojized.filter((word, index) => index !== key));
  };

  /**
   * @description: This function is copy the emojized text to clipboard
   */
  function copyText() {
    var text = Object.entries(emojized).map((word, key) => {
      return word[1].emoji ? word[1].emoji : word[1].word;
    });
    navigator.clipboard.writeText(text.join(" "));
  }

  const AdvanceEditPopup = ({ word, index }) => {
    const [suggestedEmojis, setsuggestedEmojis] = useState([]);

    var similarEmoji = nodeEmoji.search(pluralize.singular(word));

    const handleSearchChange = (word) => {
      if (word.length > 2) {
        setsuggestedEmojis(nodeEmoji.search(word));
      }
    };

    return (
      <>
        <input
          className="popup-emoji-search"
          type="text"
          placeholder="search emojis"
          onChange={(e) => handleSearchChange(e.target.value)}
        />

        {Object.entries(suggestedEmojis)
          .slice(0, 10)
          .map((emoji, key) => {
            return (
              <div
                className="popup-emoji-container"
                key={key}
                onClick={() => advanceEmojiChange(index, word, emoji[1])}
              >
                {emoji[1].emoji}
              </div>
            );
          })}
        {similarEmoji.map((emoji, key) => {
          return (
            <div
              className="popup-emoji-container"
              key={key}
              onClick={() => advanceEmojiChange(index, word, emoji)}
            >
              {emoji.emoji}
            </div>
          );
        })}
        <div
          className="popup-emoji-container"
          style={{ fontSize: "15px", fontWeight: "500" }}
          onClick={() => advanceEmojiChange(index, word, "")}
        >
          <p> {word}</p>
        </div>
      </>
    );
  };

  return (
    <div className="container">
      <h1 className="title">
        Em
        <img
          src={require("../src/assets/smiling_face.gif")}
          alt="emoji"
          width={50}
          style={{ marginBottom: "-10px" }}
        />
        jizer
      </h1>
      <div>
        <ReactTooltip effect="solid" place="bottom" />
        <div>
          <textarea
            defaultValue={text}
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
              <span>Advance Edit</span>
              <Switch
                onChange={handleChangeAdvanceEditSwitch}
                checked={advanceEdit}
                onColor="#f5842f"
                disabled={emojized.length === 0}
              />
            </div>
            <div className="switchControls">
              <span>Remove mode</span>
              <Switch
                onChange={handleChangeRemoveSwitch}
                checked={removeMode}
                onColor="#ff0d1d"
                disabled={emojized.length === 0 || advanceEdit}
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
            {advanceEdit
              ? "  click on emojis to edit"
              : "  click on emojis to toggle"}
          </p>
          {Object.entries(emojized).map((word, key) => {
            return word[1].emoji ? (
              advanceEdit ? (
                <Popup
                  trigger={
                    <div
                      className={
                        "word-box" +
                        (removeMode ? " shake-slow word-box-remove" : "")
                      }
                      onClick={() => {
                        removeMode
                          ? removeWord(key)
                          : ChangeEmoji(key, word[1].word);
                      }}
                      style={{
                        border: word[1].advance ? "1px solid #a3cfab" : "",
                        fontSize: fontSize + "px",
                      }}
                    >
                      <span data-tip={word[1].word}> {word[1].emoji}</span>
                    </div>
                  }
                  position="top left"
                  key={key}
                >
                  <div>
                    <AdvanceEditPopup word={word[1].word} index={key} />
                  </div>
                </Popup>
              ) : (
                <div
                  className={
                    "word-box" +
                    (removeMode ? " shake-slow word-box-remove" : "")
                  }
                  key={key}
                  onClick={() => {
                    removeMode
                      ? removeWord(key)
                      : ChangeEmoji(key, word[1].word);
                  }}
                  style={{
                    border: word[1].advance ? "1px solid #a3cfab" : "",
                    fontSize: fontSize + "px",
                  }}
                >
                  <span data-tip={word[1].word}> {word[1].emoji}</span>
                </div>
              )
            ) : advanceEdit ? (
              <Popup
                trigger={
                  <div
                    className={
                      "word-box" +
                      (removeMode ? " shake-slow word-box-remove" : "")
                    }
                    key={key}
                    onClick={() => {
                      removeMode
                        ? removeWord(key)
                        : ChangeEmoji(key, word[1].word);
                    }}
                    style={{
                      fontSize: fontSize + "px",
                    }}
                  >
                    {word[1].word}
                  </div>
                }
                position="top left"
                key={key}
              >
                <div>
                  <AdvanceEditPopup word={word[1].word} index={key} />
                </div>
              </Popup>
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
