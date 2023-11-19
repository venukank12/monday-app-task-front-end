import React from "react";
import { useState, useEffect } from "react";
import ConfigForm from "./components/ConfigForm";
import mondayClient from "./services/mondayClient";

const App = () => {
  const [context, setContext] = useState();

  useEffect(() => {
    mondayClient.listen("context", (res) => {
      setContext(res.data);
    });
  }, []);

  return <ConfigForm userId={context?.user?.id} boardId={context?.boardId} />;
};

export default App;
