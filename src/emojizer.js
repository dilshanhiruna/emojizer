import React, { useState } from "react";
import nodeEmoji from "node-emoji";
import pluralize from "pluralize";

const Emojizer = () => {
  const [text, setText] = useState("");
  const [emojized, setEmojized] = useState("");

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
          if (similarEmoji.length > 0) {
            return { word: word, emoji: similarEmoji.pop().emoji };
          } else {
            return { word: word, emoji: "" };
          }
        }
      });
      setEmojized(emojizedWords);
    }
  };

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
      <button onClick={EmojizeText}>emojize</button>
      <br />

      <div style={{ display: "flex", justifyContent: "center" }}>
        {Object.entries(emojized).map((word) => {
          return word[1].emoji ? (
            <div className="word-box">{word[1].emoji}</div>
          ) : (
            <div className="word-box">{word[1].word}</div>
          );
        })}
      </div>
    </div>
  );
};

export default Emojizer;
