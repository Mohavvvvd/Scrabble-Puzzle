import React, { useState } from "react";
import EntryPage from "./EntryPage";
import Game from "./Game"; 

const App: React.FC = () => {
  const [showEntry, setShowEntry] = useState(true);

  return showEntry ? (
    <EntryPage onStart={() => setShowEntry(false)} />
  ) : (
    <Game />
  );
};

export default App;
