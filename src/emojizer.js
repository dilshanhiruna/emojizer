import React, { useState } from "react";
import nodeEmoji from "node-emoji";
import pluralize from "pluralize";
import ReactTooltip from "react-tooltip";
import Switch from "react-switch";

const Emojizer = () => {
  const [text, setText] = useState("");
  const [emojized, setEmojized] = useState([]);
  const [advanceMode, setadvanceMode] = useState(false);
  const [removeMode, setremoveMode] = useState(false);

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
    <div>
      <h1>Emojizer</h1>
      <textarea
        name="text"
        id=""
        cols="30"
        rows="10"
        onChange={(e) => {
          setText(e.target.value);
        }}
      ></textarea>
      <br />
      <span>Advance mode</span>
      <Switch onChange={handleChangeAdvanceSwitch} checked={advanceMode} />
      <span>Remove mode</span>
      <Switch
        onChange={handleChangeRemoveSwitch}
        checked={removeMode}
        onColor="#ff0d1d"
      />
      <button onClick={copyText}>Copy</button>
      <button onClick={EmojizeText}>emojize</button>
      <br />
      <div style={{ display: "flex", justifyContent: "center" }}>
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
              style={{ border: !removeMode ? "1px solid #c9c9c9" : "" }}
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
            >
              {word[1].word}
            </div>
          );
        })}
      </div>
      <ReactTooltip effect="solid" />;
    </div>
  );
};

export default Emojizer;
