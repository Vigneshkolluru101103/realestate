import React from "react";
import { SharedLogin } from "../../components/SharedLogin";

export const BrokerLoginPage = () => {
  return <SharedLogin defaultDestination="/broker/dashboard" />;
};

export default BrokerLoginPage;
