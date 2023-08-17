import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import React from 'react';

import { Button, Modal } from '..';

interface ConfirmationModalProps {
  title: string;
  description?: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  description,
  isOpen,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal open={isOpen} width="max-w-2xl">
      <div className="bg-white">
        <div className="mb-4 flex flex-col items-center justify-center gap-5">
          <ExclamationTriangleIcon className="h-16 w-16" />
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        {description && <p className="mb-4 text-gray">{description}</p>}
        <div className="mt-6 flex justify-end gap-5">
          <Button title="No" variant="out-lined" onClick={onCancel} />
          <Button title="Yes" onClick={onConfirm} />
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
