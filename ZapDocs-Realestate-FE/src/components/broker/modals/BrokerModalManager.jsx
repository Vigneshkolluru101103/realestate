import React from 'react';
import { Info } from 'lucide-react';
import { useBrokerState } from '../../../contexts/BrokerStateContext';
import AgreementCreationModal from './AgreementCreationModal';
import RazorpayCheckoutModal from './RazorpayCheckoutModal';
import AutoRenewConfirmModal from './AutoRenewConfirmModal';
import RenewalReviewModal from './RenewalReviewModal';
import GstInvoiceViewerModal from './GstInvoiceViewerModal';
import DraftPdfWarningModal from './DraftPdfWarningModal';
import AgreementDetailsModal from './AgreementDetailsModal';
import AddClientModal from './AddClientModal';
import EditClientModal from './EditClientModal';
import ReferEarnModal from './ReferEarnModal';
import VideoPlayerModal from './VideoPlayerModal';

export default function BrokerModalManager() {
  const { activeModal, toastMessage } = useBrokerState();

  return (
    <>
      {/* Toast Notification Container */}
      {toastMessage && (
        <div id="toast-container">
          <div className="toast-msg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={15} color="#2563eb" style={{ flexShrink: 0 }} />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Dynamic Modals */}
      {activeModal?.name === 'generate-agreement' && (
        <AgreementCreationModal
          key={activeModal.modalOpenId || activeModal.payload?.modalOpenId || activeModal.payload?.key || 'gen-agreement'}
          initialType={activeModal.payload?.type || activeModal.payload?.agreement?.agreementTitle || 'Residential Rental Agreement'}
          initialCategory={activeModal.payload?.category || null}
          initialTerm={activeModal.payload?.term || activeModal.payload?.agreement?.type || null}
          initialCost={activeModal.payload?.cost || 0}
          initialPrefill={activeModal.payload?.prefill || null}
          initialAgreement={activeModal.payload?.agreement || (activeModal.payload?.id && !activeModal.payload?.prefill ? activeModal.payload : null)}
          initialEntryMode={activeModal.payload?.entryMode || (activeModal.payload?.agreement || (activeModal.payload?.id && !activeModal.payload?.prefill) || activeModal.payload?.prefill ? 'manual' : 'choose')}
        />
      )}

      {activeModal?.name === 'razorpay-checkout' && (
        <RazorpayCheckoutModal order={activeModal.payload} />
      )}

      {activeModal?.name === 'auto-renew-confirm' && (
        <AutoRenewConfirmModal />
      )}

      {activeModal?.name === 'renewal-review' && (
        <RenewalReviewModal agreement={activeModal.payload} />
      )}

      {activeModal?.name === 'gst-invoice-viewer' && (
        <GstInvoiceViewerModal invoiceId={activeModal.payload} />
      )}

      {activeModal?.name === 'draft-pdf-warning' && (
        <DraftPdfWarningModal agreement={activeModal.payload} />
      )}

      {activeModal?.name === 'agreement-details' && (
        <AgreementDetailsModal agreement={activeModal.payload} />
      )}

      {activeModal?.name === 'add-client' && (
        <AddClientModal />
      )}

      {activeModal?.name === 'edit-client' && (
        <EditClientModal client={activeModal.payload} />
      )}

      {activeModal?.name === 'refer-earn' && (
        <ReferEarnModal />
      )}

      {activeModal?.name === 'video-player' && (
        <VideoPlayerModal title={activeModal.payload} />
      )}
    </>
  );
}
