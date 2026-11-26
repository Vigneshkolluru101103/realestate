import React from 'react';
import BankUpiSettingsScreen from '../BankUpiSettings/BankUpiSettingsScreen';
import './PlanBilling.css';

/**
 * PlanBillingScreen:
 * In accordance with Broker Portal specifications, subscription and quota management
 * UI has been removed. Bank & UPI Settings is now the primary and only visible section.
 */
export default function PlanBillingScreen(props) {
  return <BankUpiSettingsScreen {...props} />;
}
